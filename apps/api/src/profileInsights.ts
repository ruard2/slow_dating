import {
  profileInsightsSchema,
  relationshipGameResultSchema,
  waardenResultSchema,
  type GameRun,
  type ProfileInsights,
  type RelationshipGameResult,
  type ResultProvenance,
  type ValueId,
  type WaitingStats,
} from "@slow-dating/contracts";

interface InsightPair {
  id: string;
  memberIds: string[];
  partnerName: string;
}

interface BuildProfileInsightsInput {
  installationId: string;
  completedRuns: GameRun[];
  waiting: WaitingStats;
  currentPair: InsightPair | null;
  generatedAt: string;
}

function provenanceFor(run: GameRun, resultSchemaVersion: number) {
  return {
    gameRunId: run.id,
    gameId: run.gameId,
    gameVersion: run.version,
    resultSchemaVersion,
    pairId: run.pairId,
    completedAt: run.completedAt ?? run.startedAt,
  } satisfies ResultProvenance;
}

function parseSemanticResult(run: GameRun) {
  if (run.gameId !== "waarden" || !run.result) return null;
  const parsed = waardenResultSchema.safeParse(run.result);
  if (!parsed.success) return null;
  return {
    result: parsed.data,
    provenance: provenanceFor(run, parsed.data.schemaVersion),
  };
}

export function buildProfileInsights({
  installationId,
  completedRuns,
  waiting,
  currentPair,
  generatedAt,
}: BuildProfileInsightsInput): ProfileInsights {
  const semanticRuns = completedRuns
    .map((run) => ({ run, semantic: parseSemanticResult(run) }))
    .filter(
      (
        entry,
      ): entry is {
        run: GameRun;
        semantic: NonNullable<ReturnType<typeof parseSemanticResult>>;
      } => Boolean(entry.semantic),
    )
    .sort((left, right) =>
      left.semantic.provenance.completedAt.localeCompare(
        right.semantic.provenance.completedAt,
      ),
    );

  const values = new Map<
    ValueId,
    { occurrences: number; lastSeenAt: string; sources: ResultProvenance[] }
  >();
  for (const { semantic } of semanticRuns) {
    const selected = semantic.result.selections[installationId] ?? [];
    for (const valueId of selected) {
      const existing = values.get(valueId);
      values.set(valueId, {
        occurrences: (existing?.occurrences ?? 0) + 1,
        lastSeenAt: semantic.provenance.completedAt,
        sources: [...(existing?.sources ?? []), semantic.provenance],
      });
    }
  }

  const relationshipRuns = currentPair
    ? semanticRuns.filter(({ run }) => run.pairId === currentPair.id)
    : [];
  const sharedValues = new Set<ValueId>();
  const differingValues = new Set<ValueId>();
  for (const { semantic } of relationshipRuns) {
    semantic.result.sharedValues.forEach((valueId) => sharedValues.add(valueId));
    const own = new Set(semantic.result.selections[installationId] ?? []);
    const partnerId = currentPair?.memberIds.find(
      (memberId) => memberId !== installationId,
    );
    const partner = new Set(
      partnerId ? (semantic.result.selections[partnerId] ?? []) : [],
    );
    own.forEach((valueId) => {
      if (!partner.has(valueId)) differingValues.add(valueId);
    });
    partner.forEach((valueId) => {
      if (!own.has(valueId)) differingValues.add(valueId);
    });
  }

  return profileInsightsSchema.parse({
    schemaVersion: 1,
    generatedAt,
    personal: {
      completedRuns: semanticRuns.length,
      values: [...values.entries()]
        .map(([valueId, insight]) => ({ valueId, ...insight }))
        .sort(
          (left, right) =>
            right.occurrences - left.occurrences ||
            left.valueId.localeCompare(right.valueId),
        ),
      waiting,
      provenance: semanticRuns.map(({ semantic }) => semantic.provenance),
    },
    currentRelationship: currentPair
      ? {
          pairId: currentPair.id,
          partnerName: currentPair.partnerName,
          completedRuns: relationshipRuns.length,
          sharedValues: [...sharedValues].sort(),
          differingValues: [...differingValues].sort(),
          provenance: relationshipRuns.map(
            ({ semantic }) => semantic.provenance,
          ),
        }
      : null,
  });
}

export function relationshipGameResults(
  completedRuns: GameRun[],
): RelationshipGameResult[] {
  return completedRuns
    .map((run) => {
      const semantic = parseSemanticResult(run);
      if (!semantic) return null;
      return relationshipGameResultSchema.parse({
        provenance: semantic.provenance,
        result: semantic.result,
      });
    })
    .filter((result): result is RelationshipGameResult => result !== null)
    .sort((left, right) =>
      right.provenance.completedAt.localeCompare(
        left.provenance.completedAt,
      ),
    );
}
