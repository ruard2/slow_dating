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
  type ProfileConversationCard,
  type ProfileEvidence,
  type ProfileGameAppendix,
  type ProfileInsights,
  type ProfileNarrativeCard,
  type ProfilePersonBlock,
  type ProfileTextBlock,
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
  3: ["Samen leven", "Hoe jullie omgaan met geld, aandacht, taken, stress en ontspanning"],
  4: ["Botsen zonder breken", "Hoe jullie omgaan met spanning, verschil en herstel"],
  5: ["Samen bouwen", "Hoe jullie richting kiezen voor toekomst, trouw en gezamenlijke gewoontes"],
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

const WORLD3_GAME_IDS = [
  "geldbrug",
  "winkelmandje",
  "liefdestaal",
  "stressmeter",
  "huishoudtafel",
  "irritatiebingo",
  "kleine-date",
] as const;

function summarizeWorld3Result(run: GameRun) {
  const result = run.result ?? {};
  const strings = uniqueLabels(usefulStrings(result), 8);
  const title = findGame(run.gameId)?.title ?? cleanLabel(run.gameId);
  if (run.gameId === "geldbrug") {
    const largestDifference = (result as { largestDifference?: { left?: string; right?: string } }).largestDifference;
    return largestDifference
      ? `Geld en richting: grootste verschil rond ${largestDifference.left ?? "links"} tegenover ${largestDifference.right ?? "rechts"}.`
      : "Geld en richting: keuzes rond zekerheid, vrijheid, uitgeven, sparen en commitment.";
  }
  if (run.gameId === "winkelmandje") {
    return "Winkelmandje: verborgen budgetten, gekozen producten, onderliggende behoeften en reacties op de reveal.";
  }
  if (run.gameId === "liefdestaal") {
    return "Liefdestalen: primaire en tweede taal, ontvangen en geven, plus scores per persoon.";
  }
  if (run.gameId === "stressmeter") {
    return "Stressmeter: reacties onder druk, afstand/nabijheid, risico nemen en samenwerking in spanning.";
  }
  if (run.gameId === "huishoudtafel") {
    return "Huishoudtafel: taakverdeling, ritme, verschillen, eigenaarschap en mogelijke experimenten.";
  }
  if (run.gameId === "irritatiebingo") {
    return "Kleine-irritatiebingo: dagelijkse ergernissen, thema-keuze en gesprek over kleine wrijving.";
  }
  if (run.gameId === "kleine-date") {
    const summary = typeof (result as { summary?: unknown }).summary === "string"
      ? (result as { summary: string }).summary
      : "";
    return summary || "Kleine date: gekozen date-objecten, volgorde, stijl en gezamenlijk voorstel.";
  }
  return strings.length ? `${title}: ${listNatural(strings.slice(0, 4))}.` : `${title} afgerond.`;
}

function buildWorld3Appendix(runs: GameRun[]): ProfileGameAppendix[] {
  return runs.map((run) => ({
    gameId: run.gameId,
    gameTitle: findGame(run.gameId)?.title ?? cleanLabel(run.gameId),
    completedAt: run.completedAt ?? run.startedAt,
    summary: summarizeWorld3Result(run),
    result: (run.result ?? {}) as Record<string, unknown>,
  }));
}

function world3Evidence(runs: GameRun[], gameId: string, label: string) {
  const run = latestRun(runs, gameId);
  return run ? [evidenceFor(run, label, `world3-${gameId}`)] : [];
}

function recordValue(input: unknown, key: string): unknown {
  return input && typeof input === "object" && !Array.isArray(input)
    ? (input as Record<string, unknown>)[key]
    : undefined;
}

function personResult(result: unknown, personId: string): Record<string, unknown> {
  const people = recordValue(result, "people");
  const value = recordValue(people, personId);
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function stringList(values: unknown, limit = 5): string[] {
  if (!Array.isArray(values)) return [];
  return uniqueLabels(
    values
      .map((value) =>
        typeof value === "string"
          ? cleanLabel(value)
          : typeof value === "object" && value
            ? cleanLabel(
                String(
                  (value as Record<string, unknown>).label ??
                    (value as Record<string, unknown>).title ??
                    "",
                ),
              )
            : "",
      )
      .filter(Boolean),
    limit,
  );
}

function world3PersonHighlights(
  runs: GameRun[],
  personId: string,
  label: string,
): string[] {
  const highlights: string[] = [];
  for (const run of runs) {
    const result = run.result ?? {};
    if (run.gameId === "liefdestaal") {
      const profile = recordValue(recordValue(result, "loveProfiles"), personId);
      const primary = recordValue(recordValue(profile, "primary"), "title");
      const secondary = recordValue(recordValue(profile, "secondary"), "title");
      if (typeof primary === "string") {
        highlights.push(
          typeof secondary === "string"
            ? `${label}: liefde landt vooral via ${primary.toLowerCase()}, met ${secondary.toLowerCase()} dichtbij.`
            : `${label}: liefde landt vooral via ${primary.toLowerCase()}.`,
        );
      }
    }
    if (run.gameId === "kleine-date") {
      const chosen = stringList(
        (recordValue(result, "chosenObjects") as unknown[])?.filter(
          (item) => recordValue(item, "actorId") === personId,
        ),
        6,
      );
      if (chosen.length) {
        highlights.push(`${label} legde bij de date ${listNatural(chosen)} op tafel.`);
      }
    }
    if (run.gameId === "winkelmandje") {
      const person = personResult(result, personId);
      const need = recordValue(recordValue(person, "strongestNeed"), "title");
      const overBudget = recordValue(person, "overBudget");
      if (typeof need === "string") {
        highlights.push(
          `${label} koos in het winkelmandje vooral vanuit ${need.toLowerCase()}${
            overBudget ? " en ging over het verborgen budget" : ""
          }.`,
        );
      }
    }
    if (run.gameId === "stressmeter") {
      const rounds = recordValue(personResult(result, personId), "rounds");
      if (Array.isArray(rounds) && rounds.length) {
        const avgRisk = Math.round(
          rounds.reduce(
            (sum, round) =>
              sum +
              Number(
                recordValue(recordValue(round, "stressSignals"), "riskTaking") ??
                  0,
              ),
            0,
          ) / rounds.length,
        );
        highlights.push(`${label} liet in de stressmeter risico nemen rond ${avgRisk}/100 zien.`);
      }
    }
  }
  return uniqueLabels(highlights, 5);
}

function world3SharedHighlights(
  runs: GameRun[],
  ownerId: string,
  partnerId: string | null,
) {
  const highlights: string[] = [];
  for (const run of runs) {
    const result = run.result ?? {};
    if (run.gameId === "geldbrug") {
      const diff = recordValue(result, "largestDifference") as
        | Record<string, unknown>
        | undefined;
      const agree = recordValue(result, "strongestAgreement") as
        | Record<string, unknown>
        | undefined;
      if (diff) {
        highlights.push(
          `Geldbrug: grootste verschil tussen ${cleanLabel(
            String(diff.left ?? "links"),
          )} en ${cleanLabel(String(diff.right ?? "rechts"))}.`,
        );
      }
      if (agree) {
        highlights.push(
          `Geldbrug: meeste overeenkomst rond ${cleanLabel(
            String(agree.left ?? "links"),
          )} / ${cleanLabel(String(agree.right ?? "rechts"))}.`,
        );
      }
    }
    if (run.gameId === "huishoudtafel") {
      const differences = recordValue(result, "differences");
      if (Array.isArray(differences) && differences.length) {
        const tasks = stringList(
          differences.map((item) => recordValue(item, "taskLabel")),
          4,
        );
        if (tasks.length) {
          highlights.push(`Huishoudtafel: vooral gesprek nodig rond ${listNatural(tasks)}.`);
        }
      }
    }
    if (run.gameId === "irritatiebingo") {
      const strings = uniqueLabels(usefulStrings(recordValue(result, "selections")), 6);
      if (strings.length) {
        highlights.push(`Irritatiebingo: terugkerende prikkels waren ${listNatural(strings.slice(0, 4))}.`);
      }
    }
    if (run.gameId === "kleine-date") {
      const all = stringList(recordValue(result, "chosenObjects"), 8);
      if (all.length) highlights.push(`Kleine date: jullie kozen samen ${listNatural(all.slice(0, 6))}.`);
    }
    if (run.gameId === "liefdestaal" && partnerId) {
      const profiles = recordValue(result, "loveProfiles");
      const ownerPrimary = recordValue(recordValue(recordValue(profiles, ownerId), "primary"), "title");
      const partnerPrimary = recordValue(recordValue(recordValue(profiles, partnerId), "primary"), "title");
      if (typeof ownerPrimary === "string" && typeof partnerPrimary === "string") {
        highlights.push(
          ownerPrimary === partnerPrimary
            ? `Liefdestaal: jullie eerste taal overlapte in ${ownerPrimary.toLowerCase()}.`
            : `Liefdestaal: jij kwam uit bij ${ownerPrimary.toLowerCase()}, je partner bij ${partnerPrimary.toLowerCase()}.`,
        );
      }
    }
  }
  return uniqueLabels(highlights, 8);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function buildWorld3RichFallback(
  context: ChapterContext,
): Pick<
  ProfileChapter,
  | "overviewSummary"
  | "coupleImage"
  | "personProfiles"
  | "relationshipStrengths"
  | "relationshipChallenges"
  | "relaxationChances"
  | "practicalTips"
  | "conversationCards"
  | "gameResultAppendix"
  | "dataCoverage"
> {
  const { installationId, partnerId, partnerName, runs } = context;
  const gameIds = runs.map((run) => run.gameId);
  const gameTitles = runs.map((run) => findGame(run.gameId)?.title ?? cleanLabel(run.gameId));
  const appendix = buildWorld3Appendix(runs);
  const missingGames = WORLD3_GAME_IDS.filter((gameId) => !gameIds.includes(gameId));
  const ownEvidence = runs.slice(0, 3).map((run) =>
    evidenceFor(run, `${findGame(run.gameId)?.title ?? run.gameId} verwerkt`),
  );
  const partnerEvidence = runs.slice(2, 5).map((run) =>
    evidenceFor(run, `${findGame(run.gameId)?.title ?? run.gameId} verwerkt`),
  );
  const personProfiles: ProfilePersonBlock[] = [
    {
      personId: installationId,
      label: "Jij",
      profile:
        "In kaart 3 wordt vooral zichtbaar hoe jouw voorkeuren landen in gewone keuzes: geld, huishouden, stress, liefde geven en ontspanning. Dit is minder een etiket dan een praktische doorsnede van wat jij belangrijk maakt wanneer samenleven concreet wordt.",
      strengths: ["Je keuzes geven aanknopingspunten voor praktische afspraken.", "Je laat zien waar verbinding voor jou concreet wordt."],
      watchouts: ["Let erop dat vanzelfsprekende voorkeuren niet onuitgesproken afspraken worden."],
      evidence: ownEvidence,
    },
    ...(partnerId
      ? [{
          personId: partnerId,
          label: partnerName,
          profile:
            `${partnerName} wordt in kaart 3 zichtbaar in dezelfde alledaagse laag: wat geld betekent, hoe zorg verdeeld voelt, hoe spanning binnenkomt en welke vormen van aandacht sneller landen.`,
          strengths: ["De keuzes van je partner maken praktische behoeften bespreekbaar."],
          watchouts: ["Verschil hoeft geen probleem te zijn, maar vraagt wel taal voordat het routine wordt."],
          evidence: partnerEvidence,
        } satisfies ProfilePersonBlock]
      : []),
  ];
  const relationshipStrengths: ProfileTextBlock[] = [
    {
      title: "Jullie maken samenleven concreet",
      body: `Kaart 3 bracht ${listNatural(gameTitles.slice(0, 5))} samen. Daardoor gaat het profiel niet alleen over wie jullie zijn, maar ook over hoe jullie kiezen, verdelen, ontspannen en reageren wanneer het praktisch wordt.`,
      evidence: runs.slice(0, 3).map((run) => evidenceFor(run, "Afgerond en meegenomen in profiel 3")),
    },
  ];
  const relationshipChallenges: ProfileTextBlock[] = [
    {
      title: "Verschillen worden nu praktisch",
      body:
        "Waar kaart 1 en 2 vooral lieten zien wat jullie belangrijk vinden en nodig hebben, laat kaart 3 zien waar dat schuurt in geld, taken, stress of aandacht. Dat is bruikbare informatie, geen foutmelding.",
      evidence: runs.slice(0, 3).map((run) => evidenceFor(run, "Praktisch verschil of patroon onderzocht")),
    },
  ];
  const relaxationChances: ProfileTextBlock[] = [
    {
      title: "Ontspanning is ook profieldata",
      body:
        gameIds.includes("kleine-date")
          ? "De kleine-date-keuzes laten zien welke vorm van lichtheid, ontmoeting en plezier haalbaar voelt. Dat is net zo waardevol als de zwaardere thema's."
          : "Plan ook bewust lichte momenten: kaart 3 wordt sterker wanneer zorg, geld en taakverdeling niet losstaan van plezier en ontspanning.",
      evidence: world3Evidence(runs, "kleine-date", "Kleine date meegenomen"),
    },
  ];
  const practicalTips: ProfileTextBlock[] = [
    {
      title: "Maak één kleine afspraak per domein",
      body:
        "Kies niet meteen een groot systeem. Begin met één afspraak over geld, één over huishouden, één over stress en één over ontspanning. Klein genoeg om echt te doen.",
      evidence: runs.slice(0, 4).map((run) => evidenceFor(run, "Input voor praktische afspraak")),
    },
    {
      title: "Vertaal verschil naar een concrete vraag",
      body:
        "Vraag niet alleen wie gelijk heeft, maar: wat probeert deze voorkeur te beschermen of mogelijk te maken?",
      evidence: runs.slice(0, 2).map((run) => evidenceFor(run, "Verschil als gesprekstof")),
    },
  ];
  const conversationCards: ProfileConversationCard[] = [
    {
      title: "De week die echt zou kunnen",
      question: "Welke kleine afspraak zou komende week al merkbaar rust geven?",
      whyThisMatters: "Kaart 3 gaat over gewoonte, niet alleen inzicht.",
      evidence: runs.slice(0, 2).map((run) => evidenceFor(run, "Concrete samenleefdata")),
    },
    {
      title: "Verschil zonder strijd",
      question: `Waar wil jij ${partnerName} beter begrijpen voordat je een conclusie trekt?`,
      whyThisMatters: "Praktische verschillen worden zachter wanneer de betekenis erachter zichtbaar wordt.",
      evidence: runs.slice(0, 2).map((run) => evidenceFor(run, "Verschil verkend")),
    },
  ];
  return {
    overviewSummary:
      `Profiel 3 gebruikt ${runs.length} spellen uit kaart 3. Het laat zien hoe jullie eerdere profiel zichtbaar wordt in gewone onderwerpen: geld, taken, stress, liefdestalen, kleine irritaties en ontspanning.`,
    coupleImage:
      `Samen lijken jullie profielgegevens nu minder abstract: kaart 3 laat zien hoe aandacht, verantwoordelijkheid en plezier op tafel komen zodra keuzes concreet worden.`,
    personProfiles,
    relationshipStrengths,
    relationshipChallenges,
    relaxationChances,
    practicalTips,
    conversationCards,
    gameResultAppendix: appendix,
    dataCoverage: {
      requiredGames: 5,
      completedGameCount: runs.length,
      gamesUsed: gameIds,
      missingGames,
    },
  };
}

function buildWorld3ConcreteFallback(
  context: ChapterContext,
): Pick<
  ProfileChapter,
  | "overviewSummary"
  | "coupleImage"
  | "personProfiles"
  | "relationshipStrengths"
  | "relationshipChallenges"
  | "relaxationChances"
  | "practicalTips"
  | "conversationCards"
  | "gameResultAppendix"
  | "dataCoverage"
> {
  const { installationId, partnerId, partnerName, runs } = context;
  const gameIds = runs.map((run) => run.gameId);
  const gameTitles = runs.map((run) => findGame(run.gameId)?.title ?? cleanLabel(run.gameId));
  const appendix = buildWorld3Appendix(runs);
  const missingGames = WORLD3_GAME_IDS.filter((gameId) => !gameIds.includes(gameId));
  const ownHighlights = world3PersonHighlights(runs, installationId, "Jij");
  const partnerHighlights = partnerId
    ? world3PersonHighlights(runs, partnerId, partnerName)
    : [];
  const sharedHighlights = world3SharedHighlights(runs, installationId, partnerId);
  const evidenceFrom = (run: GameRun, fallback: string) =>
    world3SharedHighlights([run], installationId, partnerId)[0] ??
    world3PersonHighlights([run], installationId, "Jij")[0] ??
    (partnerId ? world3PersonHighlights([run], partnerId, partnerName)[0] : undefined) ??
    fallback;

  const personProfiles: ProfilePersonBlock[] = [
    {
      personId: installationId,
      label: "Jij",
      profile: ownHighlights.length
        ? `${ownHighlights.join(" ")} Samen geeft dat een praktischer beeld van wat voor jou rust, aandacht of ruimte geeft zodra samenleven concreet wordt.`
        : "Bij jou wordt zichtbaar waar gewone keuzes betekenis krijgen: geld, taken, stress, aandacht en ontspanning. De data is nog bescheiden, maar geeft wel aanknopingspunten voor concrete afspraken.",
      strengths: ownHighlights.slice(0, 2),
      watchouts: ["Maak je voorkeuren expliciet; anders worden ze snel stille verwachtingen."],
      evidence: runs
        .slice(0, 3)
        .map((run) => evidenceFor(run, evidenceFrom(run, "Concrete keuze van jou verwerkt"))),
    },
    ...(partnerId
      ? [
          {
            personId: partnerId,
            label: partnerName,
            profile: partnerHighlights.length
              ? `${partnerHighlights.join(" ")} Dat maakt zichtbaar welke vorm van aandacht, zorg of vrijheid voor ${partnerName} sneller betekenis krijgt.`
              : `${partnerName} wordt zichtbaar in de alledaagse laag: wat geld betekent, hoe zorg verdeeld voelt, hoe spanning binnenkomt en welke vormen van aandacht sneller landen.`,
            strengths: partnerHighlights.slice(0, 2),
            watchouts: ["Verschil hoeft geen probleem te zijn, maar vraagt wel woorden voordat het routine wordt."],
            evidence: runs
              .slice(0, 3)
              .map((run) => evidenceFor(run, evidenceFrom(run, `Keuze van ${partnerName} verwerkt`))),
          } satisfies ProfilePersonBlock,
        ]
      : []),
  ];

  const relationshipStrengths: ProfileTextBlock[] = [
    {
      title: "Jullie keuzes worden concreet",
      body: sharedHighlights.length
        ? `${sharedHighlights.slice(0, 3).join(" ")} Daardoor gaat dit profiel niet alleen over karakter, maar over wat er gebeurt wanneer keuzes echt op tafel komen.`
        : `Jullie speelden ${listNatural(gameTitles.slice(0, 5))}. Daarmee wordt zichtbaar hoe voorkeuren landen in geld, taken, aandacht, stress en ontspanning.`,
      evidence: runs
        .slice(0, 3)
        .map((run) => evidenceFor(run, evidenceFrom(run, "Concrete keuze uit kaart 3"))),
    },
  ];
  const relationshipChallenges: ProfileTextBlock[] = [
    {
      title: "Verschil vraagt vertaling",
      body:
        "Het belangrijke verschil is niet alleen dát jullie iets anders kiezen, maar wat die keuze probeert te beschermen: rust, vrijheid, erkenning, zorg, overzicht of verbinding. Daar zit het echte gesprek.",
      evidence: runs
        .slice(0, 3)
        .map((run) => evidenceFor(run, evidenceFrom(run, "Verschil als gesprekstof"))),
    },
  ];
  const dateHighlight = world3SharedHighlights(
    runs.filter((run) => run.gameId === "kleine-date"),
    installationId,
    partnerId,
  )[0];
  const relaxationChances: ProfileTextBlock[] = [
    {
      title: "Ontspanning hoort bij samen leven",
      body: gameIds.includes("kleine-date")
        ? `${dateHighlight ?? "De kleine-date-keuzes laten zien welke vorm van lichtheid, ontmoeting en plezier haalbaar voelt."} Dat is waardevolle profieldata: plezier laat zien hoe verbinding kan herstellen.`
        : "Plan ook bewust lichte momenten: kaart 3 wordt sterker wanneer zorg, geld en taakverdeling niet losstaan van plezier en ontspanning.",
      evidence: world3Evidence(runs, "kleine-date", dateHighlight ?? "Kleine date meegenomen"),
    },
  ];
  const practicalTips: ProfileTextBlock[] = [
    {
      title: "Maak één kleine afspraak per domein",
      body:
        "Kies niet meteen een groot systeem. Begin met één afspraak over geld, één over huishouden, één over stress en één over ontspanning. Klein genoeg om echt te doen.",
      evidence: runs
        .slice(0, 4)
        .map((run) => evidenceFor(run, evidenceFrom(run, "Input voor praktische afspraak"))),
    },
    {
      title: "Vraag wat een keuze beschermt",
      body:
        "Vraag niet alleen wie gelijk heeft, maar: wat probeert deze voorkeur te beschermen of mogelijk te maken? Vaak zit daar meer liefde in dan in de keuze zelf.",
      evidence: runs
        .slice(0, 2)
        .map((run) => evidenceFor(run, evidenceFrom(run, "Verschil als gesprekstof"))),
    },
  ];
  const conversationCards: ProfileConversationCard[] = [
    {
      title: "De week die echt zou kunnen",
      question: "Welke kleine afspraak zou komende week al merkbaar rust geven?",
      whyThisMatters: "Samen leven verandert meestal door kleine herhaalbare afspraken, niet door één groot gesprek.",
      evidence: runs
        .slice(0, 2)
        .map((run) => evidenceFor(run, evidenceFrom(run, "Concrete samenleefdata"))),
    },
    {
      title: "Verschil zonder strijd",
      question: `Waar wil jij ${partnerName} beter begrijpen voordat je een conclusie trekt?`,
      whyThisMatters: "Praktische verschillen worden zachter wanneer de betekenis erachter zichtbaar wordt.",
      evidence: runs
        .slice(0, 2)
        .map((run) => evidenceFor(run, evidenceFrom(run, "Verschil verkend"))),
    },
  ];

  return {
    overviewSummary:
      `${sharedHighlights.length ? sharedHighlights.slice(0, 3).join(" ") : `Jullie speelden ${runs.length} spellen over geld, taken, stress, liefde geven en ontspanning.`} Dit hoofdstuk gaat daarom minder over losse voorkeuren en meer over hoe jullie samenleven concreet wordt.`,
    coupleImage:
      `${ownHighlights[0] ?? "Jij laat eigen voorkeuren zien in gewone keuzes."} ${partnerHighlights[0] ?? `${partnerName} laat op dezelfde manier zien wat praktisch betekenis krijgt.`} Samen ontstaat zo een beeld van twee mensen die niet alleen moeten klikken, maar ook moeten leren vertalen wat een keuze eigenlijk beschermt.`,
    personProfiles,
    relationshipStrengths,
    relationshipChallenges,
    relaxationChances,
    practicalTips,
    conversationCards,
    gameResultAppendix: appendix,
    dataCoverage: {
      requiredGames: 5,
      completedGameCount: runs.length,
      gamesUsed: gameIds,
      missingGames,
    },
  };
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
    const baseChapter: ProfileChapter = {
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
    return available && world === 3
      ? { ...baseChapter, ...buildWorld3ConcreteFallback(context) }
      : baseChapter;
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
