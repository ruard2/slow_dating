import { createHash } from "node:crypto";

import { findGame, worldIdForGame } from "@slow-dating/content";
import type {
  ProfileChapter,
  ProfileConversationCard,
  ProfileEvidence,
  ProfileInsights,
  ProfileNarrativeCard,
  ProfilePersonBlock,
  ProfileTextBlock,
  RelationshipGameResult,
} from "@slow-dating/contracts";

import { computeTraits } from "./traitEngine.js";
import type { DomainReading, ProfileFacts } from "./traitEngine.js";

// Provider-schakelaar: standaard OpenAI; later eenvoudig naar Claude.
const PROVIDER = (process.env.AI_PROFILE_PROVIDER ?? "openai").toLowerCase();
const OPENAI_MODEL = process.env.AI_PROFILE_MODEL ?? "gpt-4o";
const CLAUDE_MODEL = process.env.AI_PROFILE_MODEL ?? "claude-opus-4-8";
const TIMEOUT_MS = 30_000;

/** Is de AI-laag bruikbaar (provider gekozen + sleutel aanwezig)? */
export function aiProfileEnabled(): boolean {
  if (process.env.AI_PROFILE_ENABLED === "false") return false;
  if (PROVIDER === "claude" || PROVIDER === "anthropic") {
    return Boolean(process.env.ANTHROPIC_API_KEY);
  }
  return Boolean(process.env.OPENAI_API_KEY);
}

// In-memory cache: zelfde input → zelfde kaarten, geen extra LLM-call.
const cache = new Map<string, ProfileNarrativeCard[]>();
const world3Cache = new Map<string, Partial<ProfileChapter>>();

const CARD_KINDS = [
  "portrait",
  "direction",
  "connection",
  "partner-view",
  "shared",
  "difference",
  "surprise",
  "challenge",
  "conversation",
] as const;

// Menu van mogelijke verdiepingsthema's (kaart 2+). Géén verplichte vakjes:
// de AI vult alleen wat de inhoud draagt, en mag een eigen thema toevoegen.
const DEEPENING_THEMES = [
  "de lagen onder je oppervlak: wat je laat zien vs. wat eronder zit en wat je verborgen houdt — en waar dat vandaan komt (herkomst, je verhaal van vroeger)",
  "wat je nodig hebt om je veilig te voelen, wat je overspoelt of teveel wordt, en hoe iemand je het beste benadert",
  "wat je meeneemt van vroeger/thuis en wat je juist anders wil doen",
  "conflictstijl en reactie onder spanning — terugtrekken vs. opzoeken, en wat dat doet",
  "kernwaarden: wat jullie écht belangrijk vinden en waar dat botst of klikt",
  "kernkwadranten: ieders valkuil, de uitdaging die daarbij hoort, en de allergie (waar je je aan stoort bij een ander)",
  "kwaliteiten: hoe jullie van betekenis zijn voor een ander",
  "tempo & nabijheid: hoe snel of behoedzaam jullie toenadering zoeken, en concrete grenzen",
  "hoe jullie reageren op onverwachte, ongemakkelijke of speelse situaties (dilemma's, spel, plezier)",
  "geloof, zingeving en levensrichting",
  "intentie & levensfase: kinderwens, toekomst, wat jullie zoeken",
  "raakvlakken: waar jullie elkaar onverwacht vinden",
  "schurende verschillen: waar wrijving kan ontstaan",
  "de wachtkamer: wie wachtte op wie (alleen bij wachttijd-data)",
];

const SYSTEM_PROMPT = `Je schrijft voor een slow-dating-app een nuchter, eerlijk portret in het Nederlands op basis van wat twee mensen in spellen kozen. De lezer is {{A}} zelf.

AANSPREEKVORM (cruciaal):
- Spreek {{A}} (de lezer) aan met "jij/je". Schrijf NOOIT over {{A}} in de derde persoon en gebruik het token {{A}} niet in lopende tekst — gebruik "jij".
- Noem de partner bij naam: gebruik het token {{B}}.
- Het stel samen = "jullie".
- Gebruik NOOIT "hij", "zij", "ze", "hem", "haar", "hun" of "hen" voor één persoon — het geslacht is onbekend. Voor de lezer gebruik je "jij", voor de partner de naam {{B}}, of je herschrijft de zin. ("Ze" of "hun" voor één persoon is fout.)

TOON: down-to-earth en concreet, met af en toe een klein droog grapje. Geen opsmuk, geen clichés, geen zalvende mooimakerij. Eerlijk mag — het hoeft niet altijd positief of vleiend te zijn.

GRONDING:
- Baseer alles op de gegevens; verzin niets.
- Schrijf een eigenschap of rol alleen toe aan wie het écht koos. Zegt de data niet wie iets koos, schrijf het dan niet aan één persoon toe.
- Geen logische sprongen: een eigenschap van één persoon is geen uitspraak over "de relatie" of iets "wederzijds". Een 'connection'/'shared'-kaart mag alleen als jullie béiden iets lieten zien dat het onderbouwt.
- Scheid feit van vermoeden: data = stellig; gevolgtrekking = voorzichtig ("misschien", "dat zou kunnen") en alleen als ze echt volgt. Bij twijfel weglaten.
- Geen diagnose, geen etiketten, geen grote woorden zonder onderbouwing.
- Noem NOOIT het woord "score", getallen, percentages, "niveau" of "gewogen_trekken" in de tekst. Vertaal trekken naar gewone mensentaal ("je houdt van rust" i.p.v. "je hebt een lage score op avontuur").
- Bouw het portret op 'gewogen_trekken': per persoon een lijst domeinen met 'kernpunten' (waarnemingen in mensentaal), 'dekking' (voorlopig/redelijk/stevig), 'nadruk' en 'bronnen'. Verzin geen trek die hier niet in staat.
- DEKKING stuurt je stelligheid: 'stevig' mag je rustig benoemen; 'redelijk' iets voorzichtiger; 'voorlopig' alleen heel licht aanstippen of weglaten. Bij weinig dekking (vroeg in het spel) leun je vooral op de directe zelfrapportage (kernwaarden, interesses, intentie) en blijf je bescheiden — beweer niet meer dan de data draagt. Het beeld mag mager zijn; dat is eerlijk.
- Gebruik 'profielen', 'spellen' en 'speelse_feiten' als concrete illustratie en bewijs bij de kernpunten.

KAARTSOORTEN (kies per kaart het passende 'kind'):
- 'portrait': een eerlijke schets van één persoon, alleen op grond van diens eigen keuzes (jou in de "jij"-vorm, of {{B}}).
- 'surprise': gaat puur over wáchttijd in de wachtkamer — hoe vaak/lang de één op de ander wachtte. Feitelijk benoemen (bv. "er werd duidelijk vaker en langer op {{B}} gewacht dan andersom"), duiding licht en optioneel, nooit een karakteroordeel.
- 'challenge': benoemt eerlijk waar een verschil tot wrijving of spanning kan leiden en stelt een directe vraag ("hier kan spanning zitten — hoe gaan jullie hiermee om?"). Niet gladstrijken, niet zalvend; mág schuren.
- 'shared' / 'connection': alleen als jullie béiden iets lieten zien dat het onderbouwt — nooit op grond van één persoon.
- 'difference': een helder verschil tussen jullie, zonder oordeel.
- 'direction' / 'partner-view' / 'conversation': richting voor de toekomst, een blik op de ander, of pure gespreksstof — waar passend.
Hoevéél kaarten en welke samenstelling staat in de opdracht hieronder; volg die.

'kind' is een van: ${CARD_KINDS.join(", ")}.
'chatPrompt': een korte, concrete vraag die jullie samen kunnen bespreken (of null).
'evidence': 1 à 2 onderbouwingen per kaart. 'game' = exact een speltitel uit de gegevens; 'detail' = een korte, kale zin met de specifieke keuze, ZONDER veldnaam ervoor (dus "geduldig, goed luisteren", niet "kwaliteiten: geduldig, goed luisteren"). Steunt een kaart nergens op (bv. de wachttijd-kaart), laat 'evidence' dan leeg ([]).`;

const RESPONSE_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    cards: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          kind: { type: "string", enum: [...CARD_KINDS] },
          title: { type: "string" },
          body: { type: "string" },
          chatPrompt: { type: ["string", "null"] },
          evidence: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                game: { type: "string" },
                detail: { type: "string" },
              },
              required: ["game", "detail"],
            },
          },
        },
        required: ["kind", "title", "body", "chatPrompt", "evidence"],
      },
    },
  },
  required: ["cards"],
} as const;

interface RawCard {
  kind: (typeof CARD_KINDS)[number];
  title: string;
  body: string;
  chatPrompt: string | null;
  evidence: Array<{ game: string; detail: string }>;
}

interface RawWorld3Evidence {
  game: string;
  detail: string;
}

interface RawWorld3Block {
  title: string;
  body: string;
  evidence: RawWorld3Evidence[];
}

interface RawWorld3Person {
  person: "{{A}}" | "{{B}}";
  label: string;
  profile: string;
  strengths: string[];
  watchouts: string[];
  evidence: RawWorld3Evidence[];
}

interface RawWorld3ConversationCard {
  title: string;
  question: string;
  whyThisMatters: string;
  evidence: RawWorld3Evidence[];
}

interface RawWorld3Profile {
  overviewSummary: string;
  coupleImage: string;
  personProfiles: RawWorld3Person[];
  relationshipStrengths: RawWorld3Block[];
  relationshipChallenges: RawWorld3Block[];
  relaxationChances: RawWorld3Block[];
  practicalTips: RawWorld3Block[];
  conversationCards: RawWorld3ConversationCard[];
}

const WORLD3_EVIDENCE_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    game: { type: "string" },
    detail: { type: "string" },
  },
  required: ["game", "detail"],
} as const;

const WORLD3_BLOCK_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    title: { type: "string" },
    body: { type: "string" },
    evidence: { type: "array", items: WORLD3_EVIDENCE_SCHEMA },
  },
  required: ["title", "body", "evidence"],
} as const;

const WORLD3_RESPONSE_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    overviewSummary: { type: "string" },
    coupleImage: { type: "string" },
    personProfiles: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          person: { type: "string", enum: ["{{A}}", "{{B}}"] },
          label: { type: "string" },
          profile: { type: "string" },
          strengths: { type: "array", items: { type: "string" } },
          watchouts: { type: "array", items: { type: "string" } },
          evidence: { type: "array", items: WORLD3_EVIDENCE_SCHEMA },
        },
        required: [
          "person",
          "label",
          "profile",
          "strengths",
          "watchouts",
          "evidence",
        ],
      },
    },
    relationshipStrengths: { type: "array", items: WORLD3_BLOCK_SCHEMA },
    relationshipChallenges: { type: "array", items: WORLD3_BLOCK_SCHEMA },
    relaxationChances: { type: "array", items: WORLD3_BLOCK_SCHEMA },
    practicalTips: { type: "array", items: WORLD3_BLOCK_SCHEMA },
    conversationCards: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          title: { type: "string" },
          question: { type: "string" },
          whyThisMatters: { type: "string" },
          evidence: { type: "array", items: WORLD3_EVIDENCE_SCHEMA },
        },
        required: ["title", "question", "whyThisMatters", "evidence"],
      },
    },
  },
  required: [
    "overviewSummary",
    "coupleImage",
    "personProfiles",
    "relationshipStrengths",
    "relationshipChallenges",
    "relaxationChances",
    "practicalTips",
    "conversationCards",
  ],
} as const;

function parseJsonObject<T>(text: string): T {
  try {
    return JSON.parse(text) as T;
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("AI response bevat geen JSON-object");
    return JSON.parse(match[0]) as T;
  }
}

function stripMeta(value: unknown, a: string, b: string): unknown {
  if (!value || typeof value !== "object") return value;
  if (Array.isArray(value)) return value.map((item) => stripMeta(item, a, b));
  const out: Record<string, unknown> = {};
  for (const [key, val] of Object.entries(value as Record<string, unknown>)) {
    if (["schemaVersion", "completedAt"].includes(key)) continue;
    if (
      val &&
      typeof val === "object" &&
      !Array.isArray(val) &&
      ((val as Record<string, unknown>)[a] !== undefined ||
        (val as Record<string, unknown>)[b] !== undefined)
    ) {
      const rec = val as Record<string, unknown>;
      out[key] = { "{{A}}": rec[a], "{{B}}": rec[b] };
    } else {
      out[key] = stripMeta(val, a, b);
    }
  }
  return out;
}

async function callLLM(userContent: string): Promise<RawCard[]> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    if (PROVIDER === "claude" || PROVIDER === "anthropic") {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        signal: controller.signal,
        headers: {
          "x-api-key": process.env.ANTHROPIC_API_KEY ?? "",
          "anthropic-version": "2023-06-01",
          "content-type": "application/json",
        },
        body: JSON.stringify({
          model: CLAUDE_MODEL,
          max_tokens: 4000,
          output_config: {
            format: { type: "json_schema", schema: RESPONSE_SCHEMA },
          },
          system: SYSTEM_PROMPT,
          messages: [{ role: "user", content: userContent }],
        }),
      });
      if (!res.ok) throw new Error(`Claude ${res.status}: ${await res.text()}`);
      const data = (await res.json()) as {
        content?: Array<{ type: string; text?: string }>;
      };
      const text =
        data.content?.find((block) => block.type === "text")?.text ?? "{}";
      return (JSON.parse(text).cards ?? []) as RawCard[];
    }

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      signal: controller.signal,
      headers: {
        authorization: `Bearer ${process.env.OPENAI_API_KEY ?? ""}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userContent },
        ],
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "profielschets",
            strict: true,
            schema: RESPONSE_SCHEMA,
          },
        },
      }),
    });
    if (!res.ok) throw new Error(`OpenAI ${res.status}: ${await res.text()}`);
    const data = (await res.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const text = data.choices?.[0]?.message?.content ?? "{}";
    return (JSON.parse(text).cards ?? []) as RawCard[];
  } finally {
    clearTimeout(timeout);
  }
}

async function callWorld3LLM(userContent: string): Promise<RawWorld3Profile> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    if (PROVIDER === "claude" || PROVIDER === "anthropic") {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        signal: controller.signal,
        headers: {
          "x-api-key": process.env.ANTHROPIC_API_KEY ?? "",
          "anthropic-version": "2023-06-01",
          "content-type": "application/json",
        },
        body: JSON.stringify({
          model: CLAUDE_MODEL,
          max_tokens: 5000,
          output_config: {
            format: { type: "json_schema", schema: WORLD3_RESPONSE_SCHEMA },
          },
          system: SYSTEM_PROMPT,
          messages: [{ role: "user", content: userContent }],
        }),
      });
      if (!res.ok) throw new Error(`Claude ${res.status}: ${await res.text()}`);
      const data = (await res.json()) as {
        content?: Array<{ type: string; text?: string }>;
      };
      const text =
        data.content?.find((block) => block.type === "text")?.text ?? "{}";
      return parseJsonObject<RawWorld3Profile>(text);
    }

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      signal: controller.signal,
      headers: {
        authorization: `Bearer ${process.env.OPENAI_API_KEY ?? ""}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userContent },
        ],
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "profiel_samen_leven",
            strict: true,
            schema: WORLD3_RESPONSE_SCHEMA,
          },
        },
      }),
    });
    if (!res.ok) {
      const firstError = await res.text();
      const retry = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        signal: controller.signal,
        headers: {
          authorization: `Bearer ${process.env.OPENAI_API_KEY ?? ""}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          model: OPENAI_MODEL,
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            {
              role: "user",
              content: `${userContent}

Geef uitsluitend geldig JSON terug met exact deze velden: overviewSummary, coupleImage, personProfiles, relationshipStrengths, relationshipChallenges, relaxationChances, practicalTips, conversationCards.`,
            },
          ],
          response_format: { type: "json_object" },
        }),
      });
      if (!retry.ok) {
        throw new Error(
          `OpenAI ${res.status}: ${firstError}; retry ${retry.status}: ${await retry.text()}`,
        );
      }
      const retryData = (await retry.json()) as {
        choices?: Array<{ message?: { content?: string } }>;
      };
      return parseJsonObject<RawWorld3Profile>(
        retryData.choices?.[0]?.message?.content ?? "{}",
      );
    }
    const data = (await res.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const text = data.choices?.[0]?.message?.content ?? "{}";
    return parseJsonObject<RawWorld3Profile>(text);
  } finally {
    clearTimeout(timeout);
  }
}

interface AiContext {
  ownerId: string;
  ownerName: string;
  partnerId: string;
  partnerName: string;
  tempo?: Record<string, { madeWaitSeconds: number; madeWaitCount: number }>;
  ownerProfile?: ProfileFacts;
  partnerProfile?: ProfileFacts;
  ownerTraits?: DomainReading[];
  partnerTraits?: DomainReading[];
}

async function cardsForWorld(
  world: number,
  worldResults: RelationshipGameResult[],
  context: AiContext,
  status: "provisional" | "complete",
  mode: "intro" | "deepening",
  priorText: string,
): Promise<ProfileNarrativeCard[]> {
  const { ownerId, ownerName, partnerId, partnerName, tempo } = context;
  const profielen =
    context.ownerProfile || context.partnerProfile
      ? { "{{A}}": context.ownerProfile, "{{B}}": context.partnerProfile }
      : undefined;
  const trekken =
    context.ownerTraits || context.partnerTraits
      ? { "{{A}}": context.ownerTraits, "{{B}}": context.partnerTraits }
      : undefined;

  const spellen = worldResults.map((entry) => ({
    spel: findGame(entry.provenance.gameId)?.title ?? entry.provenance.gameId,
    resultaat: stripMeta(entry.result, ownerId, partnerId),
  }));
  const speelseFeiten = tempo
    ? {
        toelichting:
          "wachttijden in de wachtkamer: hoger = vaker/langer op die persoon gewacht (de bedachtzame/tragere).",
        "{{A}}": tempo[ownerId] ?? { madeWaitSeconds: 0, madeWaitCount: 0 },
        "{{B}}": tempo[partnerId] ?? { madeWaitSeconds: 0, madeWaitCount: 0 },
      }
    : undefined;
  // Globale veiligheidsstrip: vervang eventuele losse installatie-ids.
  const payloadObject: Record<string, unknown> = {};
  if (trekken) payloadObject.gewogen_trekken = trekken;
  if (profielen) payloadObject.profielen = profielen;
  payloadObject.spellen = spellen;
  if (speelseFeiten) payloadObject.speelse_feiten = speelseFeiten;
  let payload = JSON.stringify(payloadObject, null, 2);
  payload = payload.split(ownerId).join("{{A}}").split(partnerId).join("{{B}}");

  const fingerprint = createHash("sha1")
    .update(`${mode}\n${priorText}\n${payload}`)
    .digest("hex");
  const cacheKey = `${PROVIDER}:${world}:${fingerprint}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  const header = `Jij = de lezer ({{A}}); spreek in de "jij"-vorm. De partner = {{B}}; samen = "jullie".`;
  const instructions =
    mode === "intro"
      ? `${header}

Dit is het eerste, voorzichtige portret (kaart ${world}). Er is nog weinig data — blijf bescheiden en leun vooral op directe zelfrapportage (kernwaarden, interesses, intentie). Schrijf 4 tot 6 kaarten. Neem in elk geval op: twee 'portrait'-kaarten (jou in de "jij"-vorm en één van {{B}}, elk op eigen keuzes), één 'surprise'-kaart over de wachtkamer (alleen bij wachttijd-data), en minstens één 'challenge'-kaart die mag schuren.

Gegevens:

${payload}`
      : `${header}

Dit is kaart ${world}: een VERDIEPING van het eerdere portret — geen herhaling. Bouw voort op wat al bekend is en laat de groei zien (verwijs gerust naar het begin: "in kaart 1 zagen we vooral je rust — nu wordt zichtbaar waar die vandaan komt").

WAT WE AL WISTEN (uit eerdere kaarten — niet herhalen, wél op verder bouwen):
${priorText || "(nog niets eerder geschreven)"}

THEMA-MENU — schrijf een kaart voor élk thema waar de gegevens hieronder genoeg voor dragen. Sla thema's over die te dun zijn; voeg een eigen thema toe als de data daarom vraagt. Het aantal kaarten volgt uit de inhoud, mik op 6 tot 10:
${DEEPENING_THEMES.map((t) => `  • ${t}`).join("\n")}

Verplicht ergens in de set: minstens één 'challenge'-kaart die mag schuren, en — alleen als er wachttijd-data is — één 'surprise'-kaart over de wachtkamer. Verder vrij.

ALS er data is van het spel "Onder de oppervlakte" (spiegelvijver, met velden zoals surface/deeper/hidden en origin/herkomst): wijd dan één kaart aan de lagen ónder de oppervlakte. Benoem concreet wat iemand aan de buitenkant laat zien, wat daaronder zit, wat verborgen blijft, en waar dat vandaan komt (de herkomst/het verhaal van vroeger). Dit is het meest persoonlijke en kwetsbare materiaal in de hele set — sla het niet over en maak het niet algemeen. Schrijf het per persoon (jou in de "jij"-vorm, {{B}} bij naam); maak er géén gezamenlijke "jullie zijn allebei creatief"-kaart van.

GA DIEP EN CONCREET: spel de specifieke keuzes uit (wélk kernkwadrant, wélke valkuil en allergie, wélke waarde, wélke reactie onder spanning, wélke laag onder de oppervlakte), niet alleen het abstracte label. Wees breed en eerlijk, met inzicht — maar zonder iets te verzinnen of mooier te maken dan de data draagt.

Gegevens:

${payload}`;

  const raw = await callLLM(instructions);

  const hydrate = (text: string) =>
    text.split("{{A}}").join(ownerName).split("{{B}}").join(partnerName);
  const isKind = (value: string): value is RawCard["kind"] =>
    (CARD_KINDS as readonly string[]).includes(value);

  // Speltitel → bronvermelding, voor het per-kaart koppelen van bewijs.
  const byTitle = new Map(
    worldResults.map((entry) => [
      findGame(entry.provenance.gameId)?.title ?? entry.provenance.gameId,
      entry,
    ]),
  );
  const built: ProfileNarrativeCard[] = raw.map((card, index) => {
    const evidence = (card.evidence ?? [])
      .map((item, i) => {
        const entry = byTitle.get(item.game);
        if (!entry) return null;
        return {
          id: `${entry.provenance.gameRunId}:ai-${index}-${i}`,
          sourceGameId: entry.provenance.gameId,
          sourceGameTitle:
            findGame(entry.provenance.gameId)?.title ?? entry.provenance.gameId,
          sourceRunId: entry.provenance.gameRunId,
          observedAt: entry.provenance.completedAt,
          label: hydrate(item.detail),
        };
      })
      .filter((item): item is NonNullable<typeof item> => item !== null);
    return {
      id: `ai-w${world}-${index}`,
      kind: isKind(card.kind) ? card.kind : "portrait",
      scope: "relationship" as const,
      title: hydrate(card.title),
      body: hydrate(card.body),
      confidence: status === "complete" ? "strong" : "pattern",
      evidence,
      isNew: true,
      ...(card.chatPrompt ? { chatPrompt: hydrate(card.chatPrompt) } : {}),
    };
  });

  cache.set(cacheKey, built);
  return built;
}

async function richWorld3ForChapter(
  chapter: ProfileChapter,
  worldResults: RelationshipGameResult[],
  context: AiContext,
  priorText: string,
): Promise<Partial<ProfileChapter>> {
  const { ownerId, ownerName, partnerId, partnerName, tempo } = context;
  const profielen =
    context.ownerProfile || context.partnerProfile
      ? { "{{A}}": context.ownerProfile, "{{B}}": context.partnerProfile }
      : undefined;
  const trekken =
    context.ownerTraits || context.partnerTraits
      ? { "{{A}}": context.ownerTraits, "{{B}}": context.partnerTraits }
      : undefined;
  const spellen = worldResults.map((entry) => ({
    spel: findGame(entry.provenance.gameId)?.title ?? entry.provenance.gameId,
    gameId: entry.provenance.gameId,
    completedAt: entry.provenance.completedAt,
    resultaat: stripMeta(entry.result, ownerId, partnerId),
  }));
  const speelseFeiten = tempo
    ? {
        toelichting:
          "wachttijden in de wachtkamer: hoger = vaker/langer op die persoon gewacht.",
        "{{A}}": tempo[ownerId] ?? { madeWaitSeconds: 0, madeWaitCount: 0 },
        "{{B}}": tempo[partnerId] ?? { madeWaitSeconds: 0, madeWaitCount: 0 },
      }
    : undefined;

  const payloadObject: Record<string, unknown> = {
    eerdere_profielhoofdstukken: priorText || "(nog geen eerdere AI-tekst)",
    kaart_3_spelresultaten: spellen,
    volledige_resultatenbijlage: chapter.gameResultAppendix ?? [],
    data_dekking: chapter.dataCoverage,
  };
  if (trekken) payloadObject.gewogen_trekken_cumulatief_tm_kaart_3 = trekken;
  if (profielen) payloadObject.profielen_uit_eerdere_kaarten = profielen;
  if (speelseFeiten) payloadObject.speelse_feiten = speelseFeiten;

  let payload = JSON.stringify(payloadObject, null, 2);
  payload = payload.split(ownerId).join("{{A}}").split(partnerId).join("{{B}}");

  const fingerprint = createHash("sha1")
    .update(`world3-rich\n${priorText}\n${payload}`)
    .digest("hex");
  const cacheKey = `${PROVIDER}:world3-rich:${fingerprint}`;
  const cached = world3Cache.get(cacheKey);
  if (cached) return cached;

  const gameTitles = worldResults
    .map((entry) => findGame(entry.provenance.gameId)?.title ?? entry.provenance.gameId)
    .join(", ");
  const instructions = `Jij schrijft profielhoofdstuk 3 voor de profielschets in de slow-dating-app.

Jij = de lezer ({{A}}), schrijf dus tegen "jij". De partner = {{B}}. Samen = "jullie".

Doel:
- Bouw voort op kaart 1 en 2; herhaal ze niet als losse samenvatting.
- Gebruik kaart 3 als serieus hoofdstuk over samen leven: geld, aandacht, huis, stress, irritatie, plannen, plezier en commitment.
- Gebruik alle kaart-3-domeinen waarvoor data is. Laat niets belangrijks verdwijnen.
- Maak onderscheid tussen feit, patroon en voorzichtige interpretatie.
- Geef bij elk inzicht concrete evidence. evidence.game moet exact een van deze speltitels zijn: ${gameTitles}.
- Geen therapietaal, diagnose, preek of wollige taal. Nuchter, warm, eerlijk, soms licht droog.
- Noem geen ruwe scores als hoofdzaak. Vertaal scores naar gewone taal.
- Christelijke reflecties alleen verwerken als ze werkelijk in de data staan.
- Als data dun of eenzijdig is: benoem dat voorzichtig en maak er geen grote conclusie van.
- Schrijf NOOIT meta-zinnen zoals "kaart 3 gebruikt vijf spellen", "profieldata", "de gegevens laten zien" of "dit profiel gaat over". Schrijf direct over het stel.
- Leg verbanden tussen domeinen: bv. liefdestaal + date-keuzes + geldkeuzes + irritaties. Dáár zit de rijkdom.
- Noem concrete keuzes: welke liefdestaal, welke date-objecten, welk budget/mandje, welke huishoudtaken, welk stressgedrag, welke irritaties.
- Trek geen jeugd- of herkomstconclusies tenzij eerdere profielhoofdstukken dat expliciet ondersteunen. Gebruik anders "dit kan raken aan..." in plaats van "dit komt doordat...".
- "attenties" vertaal je naar "cadeaus met betekenis", "kleine gebaren" of "iets dat laat zien: ik dacht aan je".
- Vermijd lelijke formuleringen zoals "Testpartner's", "verwijderd in liefdestaal", "bevredigen". Schrijf natuurlijk Nederlands.

Schrijf rijke output in dit vaste JSON-schema:
- overviewSummary: compleet maar leesbaar profielhoofdstuk over kaart 3.
- coupleImage: verwerkt beeld van dit stel: wie jullie samen lijken te zijn in dagelijks leven, met nuance.
- personProfiles: profiel per persoon.
- relationshipStrengths: sterke kanten met evidence.
- relationshipChallenges: uitdagingen met evidence.
- relaxationChances: waar lucht, plezier en ontspanning zitten.
- practicalTips: concrete oefeningen of afspraken.
- conversationCards: vragen om samen te bespreken.

Gegevens:

${payload}`;

  const raw = await callWorld3LLM(instructions);
  const hydrate = (text: string) =>
    text.split("{{A}}").join(ownerName).split("{{B}}").join(partnerName);
  const byTitle = new Map(
    worldResults.map((entry) => [
      findGame(entry.provenance.gameId)?.title ?? entry.provenance.gameId,
      entry,
    ]),
  );
  const toEvidence = (
    evidence: RawWorld3Evidence[] | undefined,
    prefix: string,
  ): ProfileEvidence[] =>
    (evidence ?? [])
      .map((item, i) => {
        const entry = byTitle.get(item.game);
        if (!entry) return null;
        return {
          id: `${entry.provenance.gameRunId}:${prefix}-${i}`,
          sourceGameId: entry.provenance.gameId,
          sourceGameTitle:
            findGame(entry.provenance.gameId)?.title ?? entry.provenance.gameId,
          sourceRunId: entry.provenance.gameRunId,
          observedAt: entry.provenance.completedAt,
          label: hydrate(item.detail),
        };
      })
      .filter((item): item is ProfileEvidence => item !== null);
  const toBlocks = (
    blocks: RawWorld3Block[] | undefined,
    prefix: string,
  ): ProfileTextBlock[] =>
    (blocks ?? [])
      .filter((block) => block.title && block.body)
      .map((block, index) => ({
        title: hydrate(block.title),
        body: hydrate(block.body),
        evidence: toEvidence(block.evidence, `${prefix}-${index}`),
      }));

  const personProfiles: ProfilePersonBlock[] = (raw.personProfiles ?? [])
    .filter((person) => person.profile)
    .map((person, index) => ({
      personId: person.person === "{{A}}" ? ownerId : partnerId,
      label: hydrate(person.label),
      profile: hydrate(person.profile),
      strengths: (person.strengths ?? []).map(hydrate),
      watchouts: (person.watchouts ?? []).map(hydrate),
      evidence: toEvidence(person.evidence, `person-${index}`),
    }));

  const conversationCards: ProfileConversationCard[] = (
    raw.conversationCards ?? []
  )
    .filter((card) => card.title && card.question)
    .map((card, index) => ({
      title: hydrate(card.title),
      question: hydrate(card.question),
      whyThisMatters: hydrate(card.whyThisMatters),
      evidence: toEvidence(card.evidence, `conversation-${index}`),
    }));

  const rich: Partial<ProfileChapter> = {
    overviewSummary: hydrate(raw.overviewSummary),
    coupleImage: hydrate(raw.coupleImage),
    personProfiles,
    relationshipStrengths: toBlocks(raw.relationshipStrengths, "strength"),
    relationshipChallenges: toBlocks(raw.relationshipChallenges, "challenge"),
    relaxationChances: toBlocks(raw.relaxationChances, "relaxation"),
    practicalTips: toBlocks(raw.practicalTips, "tip"),
    conversationCards,
  };
  world3Cache.set(cacheKey, rich);
  return rich;
}

function richWorld3FromNarrativeCards(
  chapter: ProfileChapter,
  context: AiContext,
): Partial<ProfileChapter> {
  const cards = chapter.cards;
  if (!cards.length) return {};
  const byKind = (kinds: ProfileNarrativeCard["kind"][]) =>
    cards.filter((card) => kinds.includes(card.kind));
  const toBlocks = (
    source: ProfileNarrativeCard[],
    fallback: ProfileNarrativeCard[],
  ): ProfileTextBlock[] =>
    (source.length ? source : fallback)
      .slice(0, 3)
      .map((card) => ({
        title: card.title,
        body: card.body,
        evidence: card.evidence,
      }));
  const portraits = byKind(["portrait", "partner-view"]);
  const conversationSource = cards.filter((card) => card.chatPrompt).slice(0, 4);
  return {
    overviewSummary:
      cards[0]?.body ??
      "Kaart 3 laat zien hoe jullie voorkeuren concreet worden in geld, aandacht, taken, stress en ontspanning.",
    coupleImage:
      byKind(["shared", "connection"])[0]?.body ??
      byKind(["difference", "challenge"])[0]?.body ??
      cards[1]?.body,
    personProfiles: portraits.slice(0, 2).map((card, index) => ({
      personId: index === 0 ? context.ownerId : context.partnerId,
      label: index === 0 ? "Jij" : context.partnerName,
      profile: card.body,
      strengths: card.kind === "portrait" ? [card.title] : [],
      watchouts: card.kind === "challenge" ? [card.title] : [],
      evidence: card.evidence,
    })).filter((person) => person.profile && person.personId),
    relationshipStrengths: toBlocks(
      byKind(["shared", "connection"]),
      cards.filter((card) => card.kind !== "challenge"),
    ),
    relationshipChallenges: toBlocks(
      byKind(["challenge", "difference"]),
      cards,
    ),
    relaxationChances: toBlocks(
      cards.filter((card) =>
        /date|rust|ontspann|knus|plezier|sfeer/i.test(
          `${card.title} ${card.body}`,
        ),
      ),
      cards,
    ),
    practicalTips: conversationSource.slice(0, 3).map((card) => ({
      title: card.title,
      body: card.chatPrompt ?? card.body,
      evidence: card.evidence,
    })),
    conversationCards: conversationSource.map((card) => ({
      title: card.title,
      question: card.chatPrompt ?? card.body,
      whyThisMatters: "Deze vraag komt direct uit wat jullie in kaart 3 lieten zien.",
      evidence: card.evidence,
    })),
  };
}

/**
 * Vervangt de regelgebaseerde kaarten van elk beschikbaar hoofdstuk door
 * AI-gegenereerde kaarten. Bij een fout blijft het regelgebaseerde hoofdstuk
 * gewoon staan (geen onderbreking voor de gebruiker).
 */
export async function augmentInsightsWithAi(
  insights: ProfileInsights,
  results: RelationshipGameResult[],
  context: AiContext,
): Promise<ProfileInsights> {
  const totalWait = Object.values(context.tempo ?? {}).reduce(
    (sum, t) => sum + t.madeWaitSeconds,
    0,
  );
  const traitsFor = (
    id: string,
    cumulative: RelationshipGameResult[],
    profile: ProfileFacts | undefined,
  ) =>
    computeTraits(id, cumulative, profile, {
      personSeconds: context.tempo?.[id]?.madeWaitSeconds ?? 0,
      totalSeconds: totalWait,
    });

  // Geanonimiseerd: namen terug naar tokens voordat eerdere kaarten als
  // context naar de LLM gaan (privacy + consistente "jij/{{B}}"-opbouw).
  const anonymize = (text: string) =>
    text.split(context.ownerName).join("{{A}}").split(context.partnerName).join("{{B}}");

  // Sequentieel op world-volgorde: elk volgend hoofdstuk bouwt voort op de
  // kaarten die de vorige hoofdstukken al opleverden (priorText).
  const ordered = [...insights.chapters].sort((a, b) => a.world - b.world);
  const processed = new Map<number, ProfileInsights["chapters"][number]>();
  let priorText = "";

  for (const chapter of ordered) {
    if (!chapter.available || chapter.status === "locked") {
      processed.set(chapter.world, chapter);
      continue;
    }
    const worldResults = results.filter(
      (entry) => worldIdForGame(entry.provenance.gameId) === chapter.world,
    );
    if (worldResults.length === 0) {
      processed.set(chapter.world, chapter);
      continue;
    }
    // Cumulatief: het profiel van een hoofdstuk weegt alle spellen t/m dat
    // landschap — zo wordt elk volgend hoofdstuk rijker dan het vorige.
    const cumulative = results.filter(
      (entry) => (worldIdForGame(entry.provenance.gameId) ?? 99) <= chapter.world,
    );
    const chapterContext: AiContext = {
      ...context,
      ownerTraits: traitsFor(context.ownerId, cumulative, context.ownerProfile),
      ...(context.partnerId
        ? {
            partnerTraits: traitsFor(
              context.partnerId,
              cumulative,
              context.partnerProfile,
            ),
          }
        : {}),
    };
    const mode = chapter.world <= 1 ? "intro" : "deepening";
    try {
      const cards = await cardsForWorld(
        chapter.world,
        worldResults,
        chapterContext,
        chapter.status,
        mode,
        priorText,
      );
      let nextChapter: ProfileInsights["chapters"][number] =
        cards.length > 0 ? { ...chapter, cards } : chapter;
      if (chapter.world === 3) {
        try {
          const rich = await richWorld3ForChapter(
            nextChapter,
            worldResults,
            chapterContext,
            priorText,
          );
          nextChapter = { ...nextChapter, ...rich };
        } catch (error) {
          console.warn(
            "AI-profiel kaart 3 rijke laag mislukt, fallback blijft staan:",
            error instanceof Error ? error.message : error,
          );
          nextChapter = {
            ...nextChapter,
            ...richWorld3FromNarrativeCards(nextChapter, chapterContext),
          };
        }
      }
      processed.set(chapter.world, nextChapter);
      const summaryParts = [
        ...nextChapter.cards.map((card) =>
          anonymize(`(kaart ${chapter.world}) ${card.title}: ${card.body}`),
        ),
        nextChapter.overviewSummary
          ? anonymize(`(kaart ${chapter.world}) ${nextChapter.overviewSummary}`)
          : "",
        nextChapter.coupleImage
          ? anonymize(`(kaart ${chapter.world}) ${nextChapter.coupleImage}`)
          : "",
      ].filter(Boolean);
      if (summaryParts.length > 0) {
        priorText += (priorText ? "\n" : "") + summaryParts.join("\n");
      }
    } catch (error) {
      console.warn(
        `AI-profiel kaart ${chapter.world} mislukt, val terug op sjabloon:`,
        error instanceof Error ? error.message : error,
      );
      processed.set(chapter.world, chapter);
    }
  }

  const chapters = insights.chapters.map(
    (chapter) => processed.get(chapter.world) ?? chapter,
  );
  return { ...insights, chapters };
}
