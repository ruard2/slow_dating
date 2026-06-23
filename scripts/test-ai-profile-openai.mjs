// TEST (OpenAI): AI-gegenereerde profielschets voor het seed-koppel.
// Privacy: stuurt GEEN namen/woonplaats naar de API — alleen spelkeuzes, met
// tokens {{A}} (jij) en {{B}} (partner). Echte namen worden er lokaal pas in
// de output weer ingezet. Wegwerp-test.
//
// Gebruik (PowerShell):
//   $env:OPENAI_API_KEY="sk-..."; node scripts/test-ai-profile-openai.mjs
//   (optioneel ander model)  $env:MODEL="gpt-4o-mini"

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const STORE = resolve(here, "../apps/api/data/local-store.json");
const PAIR = "33333333-3333-4333-8333-333333333333";
const MODEL = process.env.MODEL || "gpt-4o";

const KEY = process.env.OPENAI_API_KEY;
if (!KEY) {
  console.error(
    'Geen OPENAI_API_KEY. PowerShell: $env:OPENAI_API_KEY="sk-..."; node scripts/test-ai-profile-openai.mjs',
  );
  process.exit(1);
}

const TITLES = {
  waarden: "Je waarden",
  "lach-samen": "Lach samen",
  kennismaking: "Leer elkaar kennen",
  familiedorp: "Familiedorp",
  kwaliteiten: "Jullie kwaliteiten",
  "stille-vijver": "Stille vijver",
  "brug-ontdekking": "Brug van ontdekking",
};

const store = JSON.parse(readFileSync(STORE, "utf8"));
const pair = store.pairs.find((p) => p.id === PAIR);
if (!pair) {
  console.error("Seed-koppel niet gevonden. Draai eerst scripts/seed-kaart1.mjs.");
  process.exit(1);
}
const [A, B] = pair.memberIds;
const nameOf = (id) =>
  store.profiles.find((p) => p.id === id)?.displayName ?? "Onbekend";
const profileOf = (id) => store.profiles.find((p) => p.id === id) ?? {};

function clean(result) {
  if (!result || typeof result !== "object") return result;
  const out = {};
  for (const [k, v] of Object.entries(result)) {
    if (["schemaVersion", "completedAt"].includes(k)) continue;
    if (v && typeof v === "object" && !Array.isArray(v) && (v[A] || v[B])) {
      out[k] = { "{{A}}": v[A], "{{B}}": v[B] };
    } else {
      out[k] = v;
    }
  }
  return out;
}

const runs = store.gameRuns
  .filter((r) => r.pairId === PAIR && r.status === "completed")
  .map((r) => ({ spel: TITLES[r.gameId] ?? r.gameId, resultaat: clean(r.resultaat ?? r.result) }));

const anon = {
  toelichting:
    "{{A}} is de gebruiker, {{B}} is de partner. Dit zijn hun keuzes in spellen op kaart 1.",
  profiel_A: {
    kernwaarden: profileOf(A).coreValues ?? [],
    relatie_intentie: profileOf(A).relationIntention,
    interesses: profileOf(A).interests ?? [],
  },
  profiel_B: {
    kernwaarden: profileOf(B).coreValues ?? [],
    relatie_intentie: profileOf(B).relationIntention,
    interesses: profileOf(B).interests ?? [],
  },
  spellen: runs,
};

const SYSTEM = `Je schrijft een warm, persoonlijk relatieprofiel in het Nederlands voor een slow-dating-app.
Strikte regels:
- Gebruik UITSLUITEND de aangeleverde gegevens. Verzin niets, voeg geen feiten toe.
- Noem de twee mensen alleen met de tokens {{A}} (de gebruiker) en {{B}} (de partner). Gebruik nooit echte namen.
- Geen diagnose, geen etiketten, geen oordeel. Mild, nieuwsgierig, concreet.
- Verwijs naar wat ze echt kozen (waarden, spelkeuzes), niet naar algemeenheden.
- Schrijf 5 tot 7 kaarten die samen een rijk, specifiek portret vormen.`;

const schema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cards: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          kind: {
            type: "string",
            enum: [
              "portret",
              "richting",
              "verbinding",
              "gedeeld",
              "verschil",
              "verrassing",
              "uitdaging",
              "gesprek",
            ],
          },
          titel: { type: "string" },
          tekst: { type: "string" },
        },
        required: ["kind", "titel", "tekst"],
      },
    },
  },
  required: ["cards"],
};

console.log(`Model: ${MODEL} (OpenAI) — anonieme payload verzenden…\n`);

const response = await fetch("https://api.openai.com/v1/chat/completions", {
  method: "POST",
  headers: {
    authorization: `Bearer ${KEY}`,
    "content-type": "application/json",
  },
  body: JSON.stringify({
    model: MODEL,
    messages: [
      { role: "system", content: SYSTEM },
      {
        role: "user",
        content: `Schrijf het profiel op basis van deze gegevens:\n\n${JSON.stringify(anon, null, 2)}`,
      },
    ],
    response_format: {
      type: "json_schema",
      json_schema: { name: "profielschets", strict: true, schema },
    },
  }),
});

if (!response.ok) {
  console.error(`API-fout ${response.status}:`, await response.text());
  process.exit(1);
}

const data = await response.json();
const text = data.choices?.[0]?.message?.content ?? "{}";
let parsed;
try {
  parsed = JSON.parse(text);
} catch {
  console.error("Kon JSON niet parsen. Ruwe output:\n", text);
  process.exit(1);
}

const nameA = nameOf(A);
const nameB = nameOf(B);
const hydrate = (s) =>
  String(s).replaceAll("{{A}}", nameA).replaceAll("{{B}}", nameB);

console.log(`=== Profielschets voor ${nameA} & ${nameB} ===\n`);
for (const card of parsed.cards ?? []) {
  console.log(`▸ [${card.kind}] ${hydrate(card.titel)}`);
  console.log(`  ${hydrate(card.tekst)}\n`);
}
if (data.usage) {
  console.log(
    `(tokens — in: ${data.usage.prompt_tokens}, out: ${data.usage.completion_tokens})`,
  );
}
