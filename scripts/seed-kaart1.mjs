// Seed: twee gesimuleerde mensen die kaart 1 samen volledig hebben afgerond.
// Voegt een vaste, herhaalbare koppeling toe aan de lokale JSON-database, zodat
// je in de browser kunt inloggen als "speler A" en de groeiende profielschets
// ziet. Idempotent: opnieuw draaien vervangt de seed-data.
//
// Gebruik:
//   1) Stop de API-dev-server (anders overschrijft die je seed).
//   2) node scripts/seed-kaart1.mjs
//   3) Start de dev-server weer (npm run dev).
//   4) In de browser (console van de app), plak:
//        localStorage.setItem("slow-dating-installation-secret",
//          "5d0a7e515d0a7e515d0a7e515d0a7e515d0a7e515d0a7e515d0a7e515d0a7e51");
//        location.reload();
//      Je bent nu speler A met kaart 1 afgerond.

import { createHash, randomBytes, scryptSync } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const STORE = resolve(here, "../apps/api/data/local-store.json");

const sha256 = (value) => createHash("sha256").update(value).digest("hex");
const iso = (offsetMinutes) =>
  new Date(Date.UTC(2026, 5, 14, 12, 0) + offsetMinutes * 60_000).toISOString();

// Vaste identiteiten (zodat opnieuw draaien netjes vervangt).
const A = "11111111-1111-4111-8111-111111111111";
const B = "22222222-2222-4222-8222-222222222222";
const PAIR = "33333333-3333-4333-8333-333333333333";
const ACC_A = "55555555-5555-4555-8555-000000000001";
const ACC_B = "55555555-5555-4555-8555-000000000002";
const EMAIL_A = "speler.a@slowdating.test";
const EMAIL_B = "speler.b@slowdating.test";
const PASSWORD = "kaart1test";

// Zelfde scrypt-formaat als auth.ts: scrypt:<saltB64>:<hashB64>
function hashPassword(password) {
  const salt = randomBytes(16);
  const derived = scryptSync(password, salt, 64);
  return `scrypt:${salt.toString("base64")}:${derived.toString("base64")}`;
}
const SECRET_A =
  "5d0a7e515d0a7e515d0a7e515d0a7e515d0a7e515d0a7e515d0a7e515d0a7e51";
const SECRET_B =
  "5d0a7e525d0a7e525d0a7e525d0a7e525d0a7e525d0a7e525d0a7e525d0a7e52";

function profile(id, displayName, overrides) {
  return {
    id,
    displayName,
    bio: overrides.bio,
    avatarColor: overrides.avatarColor,
    photoUrl: null,
    birthYear: overrides.birthYear,
    city: overrides.city,
    interests: overrides.interests,
    coreValues: overrides.coreValues,
    relationIntention: "serieus",
    lifeStage: "kinderwens",
    prefAgeMin: 25,
    prefAgeMax: 42,
    prefMaxDistanceKm: 50,
    christianLayer: true,
    createdAt: iso(-60),
    updatedAt: iso(-60),
  };
}

// Eén afgerond discovery-spel voor het koppel (creator = A).
function run(gameId, version, result, order) {
  return {
    id: `44444444-4444-4444-8444-0000000000${String(order).padStart(2, "0")}`,
    gameId,
    version,
    mode: "couple",
    pairId: PAIR,
    installationId: A,
    status: "completed",
    revision: 8,
    state: {},
    result: { schemaVersion: result.schemaVersion ?? 1, ...result },
    startedAt: iso(order * 10),
    completedAt: iso(order * 10 + 6),
  };
}

const runs = [
  run(
    "waarden",
    2,
    {
      selections: {
        [A]: ["eerlijkheid", "trouw", "humor"],
        [B]: ["eerlijkheid", "trouw", "avontuur"],
      },
      sharedValues: ["eerlijkheid", "trouw"],
      completedAt: iso(16),
    },
    1,
  ),
  run(
    "lach-samen",
    1,
    { humor: ["woordgrap", "absurde situatie"], completedAt: iso(26) },
    2,
  ),
  run(
    "kennismaking",
    1,
    {
      answers: ["mijn eerste grote reis", "favoriete plek thuis"],
      predictions: ["dat klopte precies", "dat verraste me"],
      completedAt: iso(36),
    },
    3,
  ),
  run(
    "familiedorp",
    1,
    {
      roles: ["de zorgdrager", "de vredestichter"],
      messages: ["wees sterk en red jezelf"],
      completedAt: iso(46),
    },
    4,
  ),
  run(
    "kwaliteiten",
    1,
    {
      own: { kwaliteiten: ["geduldig", "goed luisteren"], allergie: "chaos" },
      partner: {
        kwaliteiten: ["spontaan", "warme humor"],
        allergie: "afstandelijkheid",
      },
      completedAt: iso(56),
    },
    5,
  ),
  run(
    "stille-vijver",
    1,
    {
      choices: ["rustig water", "een open vraag"],
      reflection: "luisteren zonder oplossen",
      completedAt: iso(66),
    },
    6,
  ),
  run(
    "brug-ontdekking",
    1,
    {
      stones: ["een eerste stap", "een kleine blunder", "een klein geluk"],
      completedAt: iso(76),
    },
    7,
  ),
];

// --- Kaart 2 (Verdieping): rijkere, consistente antwoorden ---
// Ruard (A) = rustig, bedachtzaam, trekt zich terug bij spanning, zorgt.
// Maaike (B) = spontaan, avontuurlijk, zoekt contact, vlot.
const kaart2Runs = [
  run("kernkwadranten", 2, {
    profiles: {
      [A]: { quality: "geduldig", pitfall: "te afwachtend", challenge: "vaker initiatief nemen", allergy: "chaos" },
      [B]: { quality: "spontaan", pitfall: "chaotisch", challenge: "soms rust nemen", allergy: "starheid" },
    },
    rounds: [],
    completedAt: iso(120),
  }, 11),
  run("stilteruisje", 1, {
    mixes: {
      [A]: { needs: { safety: 5, time: 4, clarity: 4, gentleness: 4, closeness: 3 }, noise: "drukte", invitation: "een rustige vraag" },
      [B]: { needs: { safety: 3, time: 2, clarity: 3, gentleness: 3, closeness: 5 }, noise: "afstand", invitation: "samen iets doen" },
    },
    supportByActor: {},
    completedAt: iso(130),
  }, 12),
  run("vrolijke-open-plek", 1, {
    selectedMission: "video",
    selectedMissionTitle: "Deel de lach",
    completedMissionIds: ["video", "setback"],
    completedMissionTitles: ["Deel de lach", "Mens erger je zacht"],
    missionChoices: {},
    reflections: {
      [A]: "Ik werd best fanatiek bij het bordspel, maar genoot vooral van samen lachen en de rust erna.",
      [B]: "Het avontuurlijke, spontane spel was het leukst — ik hou van een beetje spanning en lol.",
    },
    playSignals: { raceWinnerId: B },
    completedAt: iso(140),
  }, 13),
  run("oude-eik", 1, {
    portraits: {
      [A]: { atmosphere: "quiet", message: "do-not-burden", role: "observer", response: "withdraw", need: "space", keep: "De rust en vanzelfsprekende zorg van thuis.", change: "Eerder zeggen wat ik nodig heb." },
      [B]: { atmosphere: "warm", message: "be-yourself", role: "connector", response: "pursue", need: "reassurance", keep: "De warmte en humor aan tafel.", change: "Niet meteen alles willen oplossen of opvrolijken." },
    },
    completedAt: iso(150),
  }, 14),
  run("spiegelvijver", 1, {
    selfPortraits: {
      [A]: { openness: "observe-first", origin: "Thuis was het veiliger om eerst te kijken.", surface: ["rustig", "slim"], deeper: ["onzekerheid"], hidden: ["waarom ik afstand neem"] },
      [B]: { openness: "easy-but-guarded", origin: "Ik viel vroeger op door vrolijk te zijn.", surface: ["vrolijk", "grappig"], deeper: ["behoefte aan bevestiging", "gevoeligheid"], hidden: ["waarom ik snel help"] },
    },
    observations: {},
    recognitions: {},
    completedAt: iso(160),
  }, 15),
  run("grenzen-tempo", 1, {
    boundaryAnswers: {
      [A]: { "hand-vasthouden": "fine", zoenen: "later", samenwonen: "later", logeren: "ask-first" },
      [B]: { "hand-vasthouden": "fine", zoenen: "fine", samenwonen: "ask-first", logeren: "fine" },
    },
    tempoAnswers: {
      [A]: { nabijheid: "slow", toekomst: "calm", fysiek: "slow" },
      [B]: { nabijheid: "average", toekomst: "average", fysiek: "fast" },
    },
    smallNos: {},
    smallNoResponses: {
      [A]: { responseId: "thank-you", supportId: "calm-acceptance" },
      [B]: { responseId: "thank-you", supportId: "stay-warm" },
    },
    completedAt: iso(170),
  }, 16),
  run("kruispunt-reacties", 1, {
    usedCardIds: ["wrong-train", "ex-at-party", "lost-passport", "surprise-guests", "night-swim"],
    roundsPlayed: 1,
    answers: {
      "wrong-train": { [A]: { optionIndex: 3, answeredAt: iso(180) }, [B]: { optionIndex: 0, answeredAt: iso(180) } },
      "ex-at-party": { [A]: { optionIndex: 1, answeredAt: iso(181) }, [B]: { optionIndex: 2, answeredAt: iso(181) } },
      "lost-passport": { [A]: { optionIndex: 0, answeredAt: iso(182) }, [B]: { optionIndex: 2, answeredAt: iso(182) } },
      "surprise-guests": { [A]: { optionIndex: 1, answeredAt: iso(183) }, [B]: { optionIndex: 0, answeredAt: iso(183) } },
      "night-swim": { [A]: { optionIndex: null, answeredAt: iso(184) }, [B]: { optionIndex: 0, answeredAt: iso(184) } },
    },
    // Leesbare vorm (zoals de web-serializer 'm nu ook opslaat): scenario + de
    // daadwerkelijk gekozen optie per persoon, zodat de profiel-AI het snapt.
    readableAnswers: {
      "wrong-train": {
        category: "avontuur",
        scenario: "We zitten vrolijk in de trein. Na veertig minuten blijkt dat we precies de verkeerde kant op reizen.",
        choices: { [A]: "Doorrijden: blijkbaar is dit de reis", [B]: "Hard lachen en uitstappen" },
      },
      "ex-at-party": {
        category: "sociaal",
        scenario: "Op een feest komt mijn ex enthousiast op ons af en zegt: 'Wat leuk om jou weer te zien!'",
        choices: { [A]: "Ik observeer eerst heel goed", [B]: "Ik word extra gezellig" },
      },
      "lost-passport": {
        category: "avontuur",
        scenario: "Op het vliegveld kan ik mijn paspoort nergens vinden. Boarding sluit over twaalf minuten.",
        choices: { [A]: "Ik zoek systematisch", [B]: "Jij zoekt, ik praat met personeel" },
      },
      "surprise-guests": {
        category: "sociaal",
        scenario: "Ik sta voor de deur met vier vrienden en roep: 'Verrassing, ze eten mee!'",
        choices: { [A]: "Eerst even apart met jou praten", [B]: "Welkom, we improviseren" },
      },
      "night-swim": {
        category: "avontuur",
        scenario: "Op vakantie stel ik om middernacht voor om in een donker bergmeer te springen.",
        choices: { [A]: null, [B]: "Ik ren al naar het water" },
      },
    },
    revisitCardIds: { [A]: "ex-at-party", [B]: "wrong-train" },
    completedAt: iso(185),
  }, 17),
];

// Wachtkamer-sessies: userId = wie wachtte; er werd dus op de ánder gewacht.
// We laten {{A}} (Ruard) vaker wachten → {{B}} (Maaike) is de bedachtzame.
function waitSession(suffix, userId, startMin, durSec) {
  const startedAt = iso(startMin);
  const endedAt = new Date(Date.parse(startedAt) + durSec * 1000).toISOString();
  return {
    id: `66666666-6666-4666-8666-0000000000${suffix}`,
    pairId: PAIR,
    gameRunId: `44444444-4444-4444-8444-0000000000${suffix}`,
    userId,
    startedAt,
    endedAt,
  };
}
const waits = [
  waitSession("01", A, 0, 42),
  waitSession("03", A, 10, 78),
  waitSession("04", A, 20, 36),
  waitSession("05", B, 30, 19),
];

const allRuns = [...runs, ...kaart2Runs];
const store = JSON.parse(readFileSync(STORE, "utf8"));
const runIds = new Set(allRuns.map((r) => r.id));
const waitIds = new Set(waits.map((w) => w.id));

// Verwijder eerdere seed (idempotent).
store.accounts = (store.accounts ?? []).filter(
  (a) =>
    a.id !== ACC_A &&
    a.id !== ACC_B &&
    a.email !== EMAIL_A &&
    a.email !== EMAIL_B,
);
store.installations = store.installations.filter((i) => i.id !== A && i.id !== B);
store.profiles = store.profiles.filter((p) => p.id !== A && p.id !== B);
store.pairs = store.pairs.filter((p) => p.id !== PAIR);
store.gameRuns = store.gameRuns.filter((r) => !runIds.has(r.id));

store.installations.push(
  { id: A, secretHash: sha256(SECRET_A), accountId: ACC_A, createdAt: iso(-60), lastSeenAt: iso(80) },
  { id: B, secretHash: sha256(SECRET_B), accountId: ACC_B, createdAt: iso(-60), lastSeenAt: iso(80) },
);
const pwHash = hashPassword(PASSWORD);
store.accounts.push(
  { id: ACC_A, email: EMAIL_A, emailVerified: true, passwordHash: pwHash, primaryInstallationId: A, createdAt: iso(-60) },
  { id: ACC_B, email: EMAIL_B, emailVerified: true, passwordHash: hashPassword(PASSWORD), primaryInstallationId: B, createdAt: iso(-60) },
);
store.profiles.push(
  profile(A, "Ruard", {
    bio: "Houdt van lange wandelingen, goede gesprekken en slechte woordgrappen.",
    avatarColor: "#B9D67A",
    birthYear: 1994,
    city: "Utrecht",
    interests: ["wandelen", "koken", "muziek"],
    coreValues: ["eerlijkheid", "trouw", "humor"],
  }),
  profile(B, "Maaike", {
    bio: "Spontaan, gelovig en altijd in voor een avontuur.",
    avatarColor: "#E2BF66",
    birthYear: 1996,
    city: "Amersfoort",
    interests: ["reizen", "zingen", "fotografie"],
    coreValues: ["eerlijkheid", "trouw", "avontuur"],
  }),
);
store.pairs.push({
  id: PAIR,
  code: "TEST01",
  createdAt: iso(-30),
  disconnectedAt: null,
  memberIds: [A, B],
  // Testkoppel: alle werelden ontgrendeld + solo door alle spellen kunnen klikken.
  developerMode: true,
  sharedSeconds: 1200,
  bothOnlineSince: null,
  callUnlocked: true,
  callRequestedBy: null,
  callConsent: {},
  callCooldownUntil: null,
});
store.gameRuns.push(...allRuns);
store.waitingSessions = (store.waitingSessions ?? []).filter(
  (w) => !waitIds.has(w.id),
);
store.waitingSessions.push(...waits);

writeFileSync(STORE, JSON.stringify(store, null, 2), "utf8");

console.log("✓ Seed klaar.");
console.log(`  Koppel ${PAIR} — ${runs.length} kaart-1 + ${kaart2Runs.length} kaart-2 spellen afgerond.`);
console.log("");
console.log("  Inloggen via het normale inlogscherm (e-mail + wachtwoord):");
console.log(`    Speler A:  ${EMAIL_A}   /   ${PASSWORD}`);
console.log(`    Speler B:  ${EMAIL_B}   /   ${PASSWORD}`);
