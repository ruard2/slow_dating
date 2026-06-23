import {
  findGame,
  getWorldPlacements,
  worldIdForGame,
} from "@slow-dating/content";
import {
  profileInsightsSchema,
  relationshipGameResultSchema,
  waardenResultSchema,
  type GameRun,
  type ProfileChapter,
  type ProfileEvidence,
  type ProfileInsights,
  type ProfileNarrativeCard,
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

interface ChapterContext {
  installationId: string;
  partnerId: string | null;
  partnerName: string;
  world: number;
  runs: GameRun[];
  generatedAt: string;
}

const WORLD_TITLES: Record<number, [string, string]> = {
  1: ["Eerste indruk", "Wie jullie zijn en hoe jullie elkaar ontmoeten"],
  2: ["Verdieping", "Wat jullie nodig hebben en wat onder de oppervlakte leeft"],
  3: ["Nabijheid", "Hoe vertrouwen, verschil en verbondenheid zich ontwikkelen"],
  4: ["Richting", "Hoe jullie samen keuzes maken en vooruitkijken"],
  5: ["Ziel", "Wat jullie ten diepste samenbrengt"],
};

const VALUE_NAMES: Record<string, string> = {
  eerlijkheid: "eerlijkheid",
  trouw: "trouw",
  familie: "familie",
  humor: "humor",
  respect: "respect",
  avontuur: "avontuur",
  geloof: "geloof",
  warmte: "warmte",
  vrijheid: "vrijheid",
  groei: "groei",
  rust: "rust",
  vriendschap: "vriendschap",
  ambitie: "ambitie",
  verbinding: "verbinding",
  dankbaarheid: "dankbaarheid",
  creativiteit: "creativiteit",
};

const PROFILE_LABELS: Record<string, string> = {
  safety: "veiligheid",
  time: "tijd om te openen",
  clarity: "duidelijkheid",
  gentleness: "zachtheid",
  closeness: "nabijheid",
  interruptions: "onderbrekingen",
  haste: "haast",
  advice: "ongevraagd advies",
  tension: "spanning",
  uncertainty: "onduidelijkheid",
  walk: "samen wandelen",
  quiet: "eerst even stil",
  question: "een open vraag",
  "side by side": "naast elkaar zitten",
  direct: "eerlijk benoemen",
  listen: "luisteren zonder oplossen",
  slow: "vertragen",
  check: "vragen wat nodig is",
  soften: "een zachte toon",
  warm: "warm en betrokken",
  busy: "levendig en druk",
  careful: "voorzichtig",
  unpredictable: "onvoorspelbaar",
  independent: "zelfstandig",
  pursue: "direct contact zoeken",
  withdraw: "afstand nemen",
  solve: "oplossen en regelen",
  please: "aanpassen om rust te bewaren",
  defend: "verdedigen",
  freeze: "even stilvallen",
  reassurance: "bevestiging",
  space: "ruimte",
  recognition: "erkenning",
  reliability: "betrouwbaarheid",
};

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

function parseWaardenResult(run: GameRun) {
  if (run.gameId !== "waarden" || !run.result) return null;
  const parsed = waardenResultSchema.safeParse(run.result);
  if (!parsed.success) return null;
  return {
    result: parsed.data,
    provenance: provenanceFor(run, parsed.data.schemaVersion),
  };
}

function cleanLabel(value: string) {
  const cleaned = value
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return PROFILE_LABELS[cleaned.toLowerCase()] ?? cleaned;
}

function usefulStrings(
  input: unknown,
  output: string[] = [],
  depth = 0,
): string[] {
  if (depth > 5 || output.length >= 30) return output;
  if (typeof input === "string") {
    const value = cleanLabel(input);
    if (
      value.length >= 2 &&
      value.length <= 90 &&
      !["completed", "couple", "true", "false"].includes(value.toLowerCase())
    ) {
      output.push(value);
    }
    return output;
  }
  if (Array.isArray(input)) {
    input.forEach((value) => usefulStrings(value, output, depth + 1));
    return output;
  }
  if (input && typeof input === "object") {
    Object.entries(input).forEach(([key, value]) => {
      if (!["completedAt", "schemaVersion", "version", "type"].includes(key)) {
        usefulStrings(value, output, depth + 1);
      }
    });
  }
  return output;
}

function uniqueLabels(values: string[], limit = 5) {
  const seen = new Set<string>();
  return values.filter((value) => {
    const key = value.toLocaleLowerCase("nl");
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  }).slice(0, limit);
}

function evidenceFor(
  run: GameRun,
  label: string,
  suffix = "result",
): ProfileEvidence {
  return {
    id: `${run.id}:${suffix}`,
    sourceGameId: run.gameId,
    sourceGameTitle: findGame(run.gameId)?.title ?? cleanLabel(run.gameId),
    sourceRunId: run.id,
    observedAt: run.completedAt ?? run.startedAt,
    label,
  };
}

function card(
  input: Omit<ProfileNarrativeCard, "isNew">,
): ProfileNarrativeCard {
  return { ...input, isNew: true };
}

function latestRun(runs: GameRun[], gameId: string) {
  return [...runs]
    .filter((run) => run.gameId === gameId)
    .sort((left, right) =>
      (right.completedAt ?? right.startedAt).localeCompare(
        left.completedAt ?? left.startedAt,
      ),
    )[0];
}

function listNatural(values: string[]) {
  if (values.length <= 1) return values[0] ?? "";
  return `${values.slice(0, -1).join(", ")} en ${values.at(-1)}`;
}

function buildWorldOneCards(context: ChapterContext) {
  const { installationId, partnerId, partnerName, runs } = context;
  const cards: ProfileNarrativeCard[] = [];
  const evidence = runs.map((run) =>
    evidenceFor(run, `${findGame(run.gameId)?.title ?? run.gameId} afgerond`),
  );
  const gameIds = new Set(runs.map((run) => run.gameId));
  const waardenRun = latestRun(runs, "waarden");
  const waarden = waardenRun ? parseWaardenResult(waardenRun) : null;
  const ownValues = waarden?.result.selections[installationId] ?? [];
  const partnerValues =
    partnerId && waarden
      ? (waarden.result.selections[partnerId] ?? [])
      : [];
  const sharedValues = waarden?.result.sharedValues ?? [];
  const differingValues = [
    ...ownValues.filter((value) => !partnerValues.includes(value)),
    ...partnerValues.filter((value) => !ownValues.includes(value)),
  ];

  cards.push(
    card({
      id: "world-1-portrait",
      kind: "portrait",
      scope: "relationship",
      title:
        sharedValues.length > 0
          ? "Jullie beginnen met herkenning én nieuwsgierigheid"
          : "Jullie eerste contouren worden zichtbaar",
      body:
        runs.length >= 7
          ? `Na zeven ontmoetingen ontstaat een verrassend compleet eerste beeld. Jullie hebben niet alleen verteld wat belangrijk is, maar ook laten zien hoe jullie spelen, kijken, herinneren en elkaar proberen te begrijpen.`
          : `Na ${runs.length} verschillende ontmoetingen is dit nog geen eindconclusie, maar wel een herkenbare eerste schets. Jullie keuzes laten zien waar contact vanzelf ontstaat en waar nog iets te ontdekken valt.`,
      confidence: runs.length >= 7 ? "strong" : "pattern",
      evidence: evidence.slice(0, 4),
    }),
  );

  if (ownValues.length && waardenRun) {
    const labels = ownValues.map((value) => VALUE_NAMES[value] ?? cleanLabel(value));
    cards.push(
      card({
        id: "world-1-direction",
        kind: "direction",
        scope: "personal",
        title: "Dit geeft jou richting",
        body: `In je eerste keuzes kwamen ${listNatural(labels)} duidelijk naar voren. Samen vormen ze geen etiket, maar wel een kompas voor wat jij graag serieus genomen ziet in contact.`,
        confidence: "observation",
        evidence: [
          evidenceFor(
            waardenRun,
            `Gekozen waarden: ${labels.join(", ")}`,
            "personal-values",
          ),
        ],
      }),
    );
  }

  const qualitiesRun = latestRun(runs, "kwaliteiten");
  if (qualitiesRun?.result) {
    const labels = uniqueLabels(usefulStrings(qualitiesRun.result), 4);
    if (labels.length) {
      cards.push(
        card({
          id: "world-1-partner-view",
          kind: "partner-view",
          scope: "relationship",
          title: `${partnerName} ziet meer dan alleen je buitenkant`,
          body: `Bij de kwaliteiten kwamen onder andere ${listNatural(labels)} langs. Interessant wordt vooral waar jouw zelfbeeld en de blik van ${partnerName} elkaar raken of juist nét verschillen.`,
          confidence: "observation",
          evidence: [
            evidenceFor(
              qualitiesRun,
              `Kwaliteiten en reacties: ${labels.join(", ")}`,
              "qualities",
            ),
          ],
        }),
      );
    }
  }

  if (sharedValues.length && waardenRun) {
    const labels = sharedValues.map(
      (value) => VALUE_NAMES[value] ?? cleanLabel(value),
    );
    cards.push(
      card({
        id: "world-1-shared",
        kind: "shared",
        scope: "relationship",
        title: "Hier vinden jullie elkaar vanzelf",
        body: `Jullie kozen allebei voor ${listNatural(labels)}. Dat betekent niet dat jullie er precies hetzelfde onder verstaan, maar wel dat hier een natuurlijke ingang voor herkenning ligt.`,
        confidence: "observation",
        evidence: [
          evidenceFor(
            waardenRun,
            `Gedeelde waarden: ${labels.join(", ")}`,
            "shared-values",
          ),
        ],
      }),
    );
  }

  if (differingValues.length && waardenRun) {
    const labels = uniqueLabels(
      differingValues.map((value) => VALUE_NAMES[value] ?? cleanLabel(value)),
      4,
    );
    cards.push(
      card({
        id: "world-1-difference",
        kind: "difference",
        scope: "relationship",
        title: "Hier nemen jullie een andere afslag",
        body: `Bij ${listNatural(labels)} lag het accent niet helemaal gelijk. Dat is geen minpunt: juist hier kunnen jullie ontdekken wat hetzelfde woord voor ieder van jullie werkelijk betekent.`,
        confidence: "observation",
        evidence: [
          evidenceFor(
            waardenRun,
            `Verschillende accenten: ${labels.join(", ")}`,
            "different-values",
          ),
        ],
      }),
    );
  }

  const expressionGames = [
    "kennismaking",
    "stille-vijver",
    "brug-ontdekking",
  ].filter((gameId) => gameIds.has(gameId));
  if (expressionGames.length >= 2) {
    const sources = expressionGames
      .map((gameId) => latestRun(runs, gameId))
      .filter((run): run is GameRun => Boolean(run));
    cards.push(
      card({
        id: "world-1-connection",
        kind: "connection",
        scope: "relationship",
        title: "Jullie leren elkaar niet via één soort gesprek kennen",
        body: `Jullie bewogen tussen vragen, beelden en persoonlijke verhalen. Dat geeft ruimte aan verschillende manieren van vertellen: soms direct, soms via een herinnering of associatie die pas later betekenis krijgt.`,
        confidence: sources.length >= 3 ? "strong" : "pattern",
        evidence: sources.map((run) =>
          evidenceFor(run, `${findGame(run.gameId)?.title} samen doorlopen`),
        ),
      }),
    );
  }

  if (gameIds.has("lach-samen") && gameIds.has("waarden")) {
    const laughRun = latestRun(runs, "lach-samen")!;
    cards.push(
      card({
        id: "world-1-surprise",
        kind: "surprise",
        scope: "relationship",
        title: "Serieus over wat telt, niet voortdurend plechtig",
        body: `Jullie maakten ruimte voor zowel waarden als onzin en speelse keuzes. Dat contrast is misschien wel het leukste eerste detail: betekenis hoeft bij jullie niet zonder luchtigheid te komen.`,
        confidence: "pattern",
        evidence: [
          evidenceFor(waardenRun!, "Samen stilgestaan bij wat belangrijk is"),
          evidenceFor(laughRun, "Samen ruimte gemaakt voor humor"),
        ],
      }),
    );
  }

  if (differingValues.length >= 2 && expressionGames.length >= 2) {
    cards.push(
      card({
        id: "world-1-challenge",
        kind: "challenge",
        scope: "relationship",
        title: "Een plek om nieuwsgierig te blijven",
        body: `Het kan zijn dat jullie soms hetzelfde gesprek met een ander accent binnenkomen. Let vooral op het moment waarop herkenning te snel als overeenstemming wordt gezien; een extra vraag kan dan meer opleveren dan een snelle conclusie.`,
        confidence: "pattern",
        evidence: [
          ...(waardenRun
            ? [evidenceFor(waardenRun, "Meerdere verschillende waarde-accenten")]
            : []),
          ...expressionGames
            .slice(0, 1)
            .map((gameId) =>
              evidenceFor(
                latestRun(runs, gameId)!,
                "Verschillende manieren van uitdrukken verkend",
              ),
            ),
        ],
      }),
    );
  }

  cards.push(
    card({
      id: "world-1-conversation",
      kind: "conversation",
      scope: "relationship",
      title: "Praat hier eens verder over",
      body:
        sharedValues.length > 0
          ? `Waar merken jullie in het dagelijks leven het sterkst dat ${VALUE_NAMES[sharedValues[0]!] ?? sharedValues[0]} voor jullie allebei belangrijk is?`
          : "Welke keuze van de ander verraste je het meest, en wat wil je daar nog beter van begrijpen?",
      confidence: "observation",
      evidence: evidence.slice(0, 2),
      chatPrompt:
        sharedValues.length > 0
          ? `Waar merken wij in het dagelijks leven het sterkst dat ${VALUE_NAMES[sharedValues[0]!] ?? sharedValues[0]} voor ons allebei belangrijk is?`
          : "Welke keuze van mij verraste je het meest, en wat wil je daar nog beter van begrijpen?",
    }),
  );

  if (runs.length < 7) {
    cards.push(
      card({
        id: "world-1-unknown",
        kind: "unknown",
        scope: "relationship",
        title: "Dit beeld is nog in beweging",
        body: `Er ${7 - runs.length === 1 ? "is" : "zijn"} nog ${7 - runs.length} kaart-1-spel${7 - runs.length === 1 ? "" : "len"} niet meegenomen. Wanneer jullie verder spelen, worden nieuwe nuances automatisch aan dit hoofdstuk toegevoegd.`,
        confidence: "observation",
        evidence: [],
      }),
    );
  }

  return cards;
}

function buildLaterWorldCards(context: ChapterContext) {
  const { partnerName, runs, world } = context;
  const evidence = runs.map((run) =>
    evidenceFor(run, `${findGame(run.gameId)?.title ?? run.gameId} afgerond`),
  );
  const gameThemes: Record<string, string> = {
    kernkwadranten: "de kracht en keerzijde van kwaliteiten",
    stilteruisje: "wat helpt om je werkelijk te openen",
    "vrolijke-open-plek": "wat lucht, spel en ontspanning geeft",
    "oude-eik": "rollen en boodschappen uit je familie",
    spiegelvijver: "wat zichtbaar is en wat daaronder leeft",
    "grenzen-tempo": "ruimte, grenzen en tempo",
    "kruispunt-reacties": "reacties wanneer iets spannend wordt",
  };
  const labels = uniqueLabels(
    runs.flatMap((run) => {
      const theme = gameThemes[run.gameId];
      const details = usefulStrings(run.result).filter(
        (value) =>
          value.includes(" ") ||
          Object.values(PROFILE_LABELS).includes(value.toLowerCase()),
      );
      return [...(theme ? [theme] : []), ...details];
    }),
    6,
  );
  const [title] = WORLD_TITLES[world] ?? [`Profiel ${world}`, ""];
  const cards: ProfileNarrativeCard[] = [
    card({
      id: `world-${world}-portrait`,
      kind: "portrait",
      scope: "relationship",
      title: `${title} bracht een nieuwe laag`,
      body: `Op deze kaart keken jullie niet alleen naar losse voorkeuren, maar ook naar wat er tussen jullie gebeurt. ${runs.length} verschillende ervaringen geven een nieuw hoofdstuk dat naast jullie eerste profiel blijft bestaan.`,
      confidence: runs.length >= 5 ? "strong" : "pattern",
      evidence: evidence.slice(0, 4),
    }),
  ];

  if (labels.length) {
    cards.push(
      card({
        id: `world-${world}-themes`,
        kind: "direction",
        scope: "relationship",
        title: "Thema's die hier naar voren kwamen",
        body: `In jullie antwoorden en keuzes kwamen onder andere ${listNatural(labels.slice(0, 4))} terug. Bekijk dit als gespreksmateriaal, niet als een vaststaand oordeel over wie jullie zijn.`,
        confidence: runs.length >= 2 ? "pattern" : "observation",
        evidence: evidence.slice(0, 3),
      }),
    );
  }

  if (world === 2) {
    const gameIds = new Set(runs.map((run) => run.gameId));
    if (
      gameIds.has("kernkwadranten") ||
      gameIds.has("spiegelvijver") ||
      gameIds.has("oude-eik")
    ) {
      cards.push(
        card({
          id: "world-2-under-surface",
          kind: "partner-view",
          scope: "relationship",
          title: "Jullie keken verder dan het eerste antwoord",
          body: `Bij eigenschappen, familiepatronen en wat onder de oppervlakte leeft, wordt zichtbaar dat gedrag meer dan één betekenis kan hebben. ${partnerName} hoeft je niet direct volledig te begrijpen om wel zorgvuldig te leren kijken.`,
          confidence: "pattern",
          evidence: evidence.filter((item) =>
            ["kernkwadranten", "spiegelvijver", "oude-eik"].includes(
              item.sourceGameId,
            ),
          ),
        }),
      );
    }
    if (
      gameIds.has("grenzen-tempo") ||
      gameIds.has("stilteruisje") ||
      gameIds.has("kruispunt-reacties")
    ) {
      cards.push(
        card({
          id: "world-2-challenge",
          kind: "challenge",
          scope: "relationship",
          title: "Verschil vraagt soms om tempo",
          body: `Het kan zijn dat de één sneller reageert, dichterbij komt of duidelijkheid zoekt dan de ander. De uitdaging is niet om hetzelfde te worden, maar om verschil te herkennen voordat het als afwijzing of druk voelt.`,
          confidence: "pattern",
          evidence: evidence.filter((item) =>
            ["grenzen-tempo", "stilteruisje", "kruispunt-reacties"].includes(
              item.sourceGameId,
            ),
          ),
        }),
      );
    }
  }

  cards.push(
    card({
      id: `world-${world}-conversation`,
      kind: "conversation",
      scope: "relationship",
      title: "Neem dit mee in jullie gesprek",
      body: "Welk inzicht van deze kaart voelde meteen herkenbaar, en welk inzicht wil je nog niet te snel vastzetten?",
      confidence: "observation",
      evidence: evidence.slice(0, 2),
      chatPrompt:
        "Welk inzicht van deze kaart voelde voor jou meteen herkenbaar, en welk inzicht wil je nog niet te snel vastzetten?",
    }),
  );
  return cards;
}

function buildChapters(
  installationId: string,
  completedRuns: GameRun[],
  currentPair: InsightPair | null,
  generatedAt: string,
): ProfileChapter[] {
  const relationshipRuns = currentPair
    ? completedRuns.filter((run) => run.pairId === currentPair.id)
    : [];
  const partnerId =
    currentPair?.memberIds.find((id) => id !== installationId) ?? null;

  return [1, 2, 3, 4, 5].map((world) => {
    const latestByGame = new Map<string, GameRun>();
    relationshipRuns
      .filter((run) => worldIdForGame(run.gameId) === world)
      .forEach((run) => {
        const existing = latestByGame.get(run.gameId);
        if (
          !existing ||
          (run.completedAt ?? run.startedAt) >
            (existing.completedAt ?? existing.startedAt)
        ) {
          latestByGame.set(run.gameId, run);
        }
      });
    const runs = [...latestByGame.values()].sort((left, right) =>
      (left.completedAt ?? left.startedAt).localeCompare(
        right.completedAt ?? right.startedAt,
      ),
    );
    const availableGames = getWorldPlacements(world).filter(
      ({ game }) => game.scoresDiscovery,
    ).length;
    const available = runs.length >= 5;
    const [title, subtitle] = WORLD_TITLES[world] ?? [
      `Profiel ${world}`,
      `Jullie hoofdstuk na kaart ${world}`,
    ];
    const context: ChapterContext = {
      installationId,
      partnerId,
      partnerName: currentPair?.partnerName ?? "je reisgenoot",
      world,
      runs,
      generatedAt,
    };
    return {
      world,
      title,
      subtitle,
      available,
      status: !available
        ? "locked"
        : runs.length >= availableGames
          ? "complete"
          : "provisional",
      requiredGames: 5,
      completedGameIds: runs.map((run) => run.gameId),
      completedGameCount: runs.length,
      generatedAt,
      cards: available
        ? world === 1
          ? buildWorldOneCards(context)
          : buildLaterWorldCards(context)
        : [],
    };
  });
}

export function buildProfileInsights({
  installationId,
  completedRuns,
  waiting,
  currentPair,
  generatedAt,
}: BuildProfileInsightsInput): ProfileInsights {
  const semanticRuns = completedRuns
    .map((run) => ({ run, semantic: parseWaardenResult(run) }))
    .filter(
      (
        entry,
      ): entry is {
        run: GameRun;
        semantic: NonNullable<ReturnType<typeof parseWaardenResult>>;
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
    chapters: buildChapters(
      installationId,
      completedRuns,
      currentPair,
      generatedAt,
    ),
  });
}

export function relationshipGameResults(
  completedRuns: GameRun[],
): RelationshipGameResult[] {
  return completedRuns
    .map((run) => {
      const semantic = parseWaardenResult(run);
      if (!run.result) return null;
      const schemaVersion =
        typeof run.result.schemaVersion === "number" &&
        Number.isInteger(run.result.schemaVersion) &&
        run.result.schemaVersion > 0
          ? run.result.schemaVersion
          : 1;
      return relationshipGameResultSchema.parse({
        provenance:
          semantic?.provenance ?? provenanceFor(run, schemaVersion),
        result: semantic?.result ?? run.result,
      });
    })
    .filter((result): result is RelationshipGameResult => result !== null)
    .sort((left, right) =>
      right.provenance.completedAt.localeCompare(
        left.provenance.completedAt,
      ),
    );
}
