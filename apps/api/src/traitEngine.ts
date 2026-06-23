import { findGame } from "@slow-dating/content";
import type { RelationshipGameResult } from "@slow-dating/contracts";

// Gewogen trekkenmodel (v2) — zie docs/PROFIEL_SCOREMODEL.md.
// 6 domeinen met facetten. Elke keuze levert SIGNALEN (domein + facet + richting
// + gewicht + soort + leesbare notitie). Een domein wordt pas "stevig" bij
// genoeg onafhankelijke bronnen (convergentie). Bij weinig data blijft het beeld
// bewust bescheiden en leunt het op directe zelfrapportage (profiel/waarden).
//
// Uitbreiden = één spel toevoegen aan GAME_EXTRACTORS hieronder.

export interface ProfileFacts {
  kernwaarden: string[];
  interesses: string[];
  relatie_intentie: string | null;
  levensfase: string | null;
  christelijke_laag?: boolean;
}

export type Domain =
  | "openheid"
  | "zorgvuldigheid"
  | "verbinding"
  | "mildheid"
  | "rust_tempo"
  | "zingeving";

export const DOMAIN_LABEL: Record<Domain, string> = {
  openheid: "Openheid & nieuwsgierigheid",
  zorgvuldigheid: "Zorgvuldigheid & toewijding",
  verbinding: "Verbinding & nabijheid",
  mildheid: "Mildheid & samenwerking",
  rust_tempo: "Emotionele rust & tempo",
  zingeving: "Zingeving & richting",
};

type SignalKind = "zelfrapportage" | "gedrag" | "toestand";

interface Signal {
  domein: Domain;
  facet: string;
  richting: number; // ±, sterkte van het signaal
  gewicht: number; // 1 zwak (trefwoord) · 2 afgeleid/zelfrapportage · 3 direct gedrag
  soort: SignalKind;
  notitie: string; // mensentaal, voedt de AI-schrijver
  bron: string; // spel- of profielnaam
}

/** Eén domein-samenvatting voor de AI-schrijver (cijfers blijven onder de motorkap). */
export interface DomainReading {
  domein: string;
  facetten: string[];
  kernpunten: string[];
  dekking: "voorlopig" | "redelijk" | "stevig";
  nadruk: "licht" | "duidelijk";
  soorten: SignalKind[];
  bronnen: string[];
}

const isObj = (v: unknown): v is Record<string, unknown> =>
  Boolean(v) && typeof v === "object" && !Array.isArray(v);
const strArr = (v: unknown): string[] =>
  Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [];

// --- Waarde → signalen (directe zelfrapportage, gewicht 2) ---
const VALUE_SIGNALS: Record<
  string,
  Array<{ d: Domain; f: string; v: number; note: string }>
> = {
  avontuur: [{ d: "openheid", f: "avontuur", v: 3, note: "hecht aan avontuur en nieuwe ervaringen" }],
  vrijheid: [
    { d: "openheid", f: "avontuur", v: 2, note: "hecht aan vrijheid en eigen ruimte" },
    { d: "verbinding", f: "nabijheid", v: -2, note: "wil ruimte naast verbondenheid" },
  ],
  groei: [{ d: "openheid", f: "verbeelding", v: 2, note: "gericht op groei en ontwikkeling" }],
  rust: [
    { d: "openheid", f: "avontuur", v: -3, note: "zoekt eerder rust dan prikkels" },
    { d: "rust_tempo", f: "bedachtzaam", v: 2, note: "houdt van kalmte" },
  ],
  creativiteit: [{ d: "openheid", f: "verbeelding", v: 3, note: "creatief ingesteld" }],
  trouw: [
    { d: "zorgvuldigheid", f: "betrouwbaar", v: 3, note: "hecht sterk aan trouw" },
    { d: "verbinding", f: "nabijheid", v: 1, note: "" },
  ],
  ambitie: [{ d: "zorgvuldigheid", f: "structuur", v: 2, note: "ambitieus" }],
  eerlijkheid: [{ d: "openheid", f: "uiten", v: 2, note: "hecht aan eerlijkheid" }],
  warmte: [
    { d: "verbinding", f: "warmte", v: 3, note: "warm in de omgang" },
    { d: "mildheid", f: "zorgzaam", v: 2, note: "" },
  ],
  verbinding: [{ d: "verbinding", f: "nabijheid", v: 3, note: "zoekt verbinding" }],
  familie: [
    { d: "verbinding", f: "nabijheid", v: 2, note: "hecht aan familie en thuis" },
    { d: "mildheid", f: "zorgzaam", v: 2, note: "" },
  ],
  vriendschap: [{ d: "verbinding", f: "warmte", v: 2, note: "hecht aan vriendschap" }],
  respect: [{ d: "mildheid", f: "zorgzaam", v: 2, note: "hecht aan respect" }],
  geloof: [{ d: "zingeving", f: "geloof", v: 3, note: "geloof speelt een rol" }],
  dankbaarheid: [{ d: "zingeving", f: "betekenis", v: 2, note: "hecht aan dankbaarheid" }],
  humor: [{ d: "openheid", f: "speels", v: 2, note: "humor is belangrijk" }],
};

// --- Trefwoord → signalen (zwak, gewicht 1) ---
const KEYWORD_SIGNALS: Array<{
  re: RegExp;
  d: Domain;
  f: string;
  v: number;
  note: string;
}> = [
  { re: /geduld|kalm|luister/i, d: "mildheid", f: "zorgzaam", v: 2, note: "geduldig, luistert goed" },
  { re: /rust|stil|thuis|wandel|lezen|tuin/i, d: "openheid", f: "avontuur", v: -2, note: "houdt van rust en het bekende" },
  { re: /spontaan|avontuur|reiz|onderweg/i, d: "openheid", f: "avontuur", v: 2, note: "spontaan, houdt van onderweg zijn" },
  { re: /humor|grap|lach|speels|absurd/i, d: "openheid", f: "speels", v: 2, note: "speels gevoel voor humor" },
  { re: /zorg|vredestichter|verbind/i, d: "mildheid", f: "zorgzaam", v: 2, note: "zorgzaam, zoekt harmonie" },
  { re: /warm|hartelijk|lief|gezellig/i, d: "verbinding", f: "warmte", v: 2, note: "warm en hartelijk in contact" },
  { re: /eerlijk|open|direct/i, d: "openheid", f: "uiten", v: 2, note: "open en direct" },
  { re: /muziek|zing|foto|kunst|creat|koken/i, d: "openheid", f: "verbeelding", v: 1, note: "creatieve/expressieve kant" },
];

function valueSignals(values: string[], bron: string, soort: SignalKind, gewicht: number): Signal[] {
  return values.flatMap((value) =>
    (VALUE_SIGNALS[value] ?? [])
      .filter((s) => s.note)
      .map((s) => ({ domein: s.d, facet: s.f, richting: s.v, gewicht, soort, notitie: s.note, bron })),
  );
}
function keywordSignals(words: string[], bron: string, soort: SignalKind): Signal[] {
  const out: Signal[] = [];
  for (const word of words) {
    for (const k of KEYWORD_SIGNALS) {
      if (k.re.test(word)) {
        out.push({ domein: k.d, facet: k.f, richting: k.v, gewicht: 1, soort, notitie: k.note, bron });
      }
    }
  }
  return out;
}

// --- Per-spel extractors (uitbreidbaar register) ---
// Voeg een nieuw spel toe door hier een entry te plaatsen die het stuk van
// deze persoon uit het resultaat haalt en signalen teruggeeft.
const GAME_EXTRACTORS: Record<
  string,
  (result: Record<string, unknown>, personId: string, bron: string) => Signal[]
> = {
  waarden: (r, id, bron) =>
    isObj(r.selections) ? valueSignals(strArr(r.selections[id]), bron, "zelfrapportage", 2) : [],

  spiegelvijver: (r, id, bron) => {
    const self = isObj(r.selfPortraits) ? r.selfPortraits[id] : undefined;
    if (!isObj(self)) return [];
    const out: Signal[] = [];
    const o = self.openness;
    if (o === "observe-first") out.push({ domein: "openheid", facet: "uiten", richting: -3, gewicht: 3, soort: "gedrag", notitie: "laat zichzelf niet meteen zien, kijkt eerst de kat uit de boom", bron });
    else if (o === "easy-but-guarded") out.push({ domein: "openheid", facet: "uiten", richting: 2, gewicht: 3, soort: "gedrag", notitie: "maakt makkelijk contact maar houdt iets achter", bron });
    else if (o === "open-not-deep") out.push({ domein: "openheid", facet: "uiten", richting: 1, gewicht: 3, soort: "gedrag", notitie: "open, maar niet meteen diep", bron });
    out.push(...keywordSignals([...strArr(self.surface), ...strArr(self.deeper)], bron, "gedrag"));
    return out;
  },

  "oude-eik": (r, id, bron) => {
    const p = isObj(r.portraits) ? r.portraits[id] : undefined;
    if (!isObj(p)) return [];
    const out: Signal[] = [];
    const resp: Record<string, { d: Domain; f: string; v: number; note: string }> = {
      pursue: { d: "mildheid", f: "conflict", v: 3, note: "zoekt bij spanning juist contact" },
      withdraw: { d: "mildheid", f: "conflict", v: -3, note: "neemt bij spanning eerder afstand" },
      solve: { d: "rust_tempo", f: "vlot", v: 2, note: "gaat bij spanning regelen en oplossen" },
      please: { d: "mildheid", f: "zorgzaam", v: 3, note: "past zich aan om de rust te bewaren" },
      defend: { d: "mildheid", f: "conflict", v: 3, note: "verdedigt zich stevig bij spanning" },
      freeze: { d: "rust_tempo", f: "bedachtzaam", v: 2, note: "valt bij spanning even stil" },
    };
    const rm = typeof p.response === "string" ? resp[p.response] : undefined;
    if (rm) out.push({ domein: rm.d, facet: rm.f, richting: rm.v, gewicht: 3, soort: "gedrag", notitie: rm.note, bron });
    if (p.need === "space") out.push({ domein: "verbinding", facet: "nabijheid", richting: -3, gewicht: 3, soort: "gedrag", notitie: "heeft bij spanning ruimte nodig", bron });
    if (p.need === "reassurance" || p.need === "gentleness") out.push({ domein: "verbinding", facet: "hechting", richting: 2, gewicht: 3, soort: "gedrag", notitie: "heeft bij spanning bevestiging of zachtheid nodig", bron });
    const roleMap: Record<string, { d: Domain; f: string; v: number; note: string }> = {
      connector: { d: "verbinding", f: "warmte", v: 2, note: "was van oudsher de verbinder of sfeermaker" },
      carer: { d: "mildheid", f: "zorgzaam", v: 2, note: "was van oudsher de zorgdrager" },
      peacemaker: { d: "mildheid", f: "zorgzaam", v: 2, note: "was van oudsher de vredestichter" },
    };
    const rmRole = typeof p.role === "string" ? roleMap[p.role] : undefined;
    if (rmRole) out.push({ domein: rmRole.d, facet: rmRole.f, richting: rmRole.v, gewicht: 2, soort: "gedrag", notitie: rmRole.note, bron });
    return out;
  },

  stilteruisje: (r, id, bron) => {
    const mix = isObj(r.mixes) ? r.mixes[id] : undefined;
    if (!isObj(mix) || !isObj(mix.needs)) return [];
    const n = mix.needs as Record<string, unknown>;
    const num = (k: string) => (typeof n[k] === "number" ? (n[k] as number) : 3);
    const out: Signal[] = [];
    if (num("closeness") >= 4) out.push({ domein: "verbinding", facet: "nabijheid", richting: 2, gewicht: 2, soort: "gedrag", notitie: "heeft nabijheid nodig om zich te openen", bron });
    if (num("time") >= 4) out.push({ domein: "rust_tempo", facet: "bedachtzaam", richting: 2, gewicht: 2, soort: "gedrag", notitie: "heeft tijd nodig om zich te openen", bron });
    if (num("safety") >= 4) out.push({ domein: "rust_tempo", facet: "veiligheid", richting: 2, gewicht: 2, soort: "gedrag", notitie: "heeft veiligheid nodig om zich te openen", bron });
    return out;
  },

  "grenzen-tempo": (r, id, bron) => {
    const out: Signal[] = [];
    const tempoLevel: Record<string, number> = { slow: 1, calm: 2, average: 3, fast: 4 };
    const tempo = isObj(r.tempoAnswers) ? r.tempoAnswers[id] : undefined;
    if (isObj(tempo)) {
      const nums = Object.values(tempo)
        .map((v) => (typeof v === "string" ? tempoLevel[v] : undefined))
        .filter((n): n is number => typeof n === "number");
      if (nums.length) {
        const avg = nums.reduce((a, b) => a + b, 0) / nums.length;
        if (avg <= 2) out.push({ domein: "rust_tempo", facet: "bedachtzaam", richting: 3, gewicht: 3, soort: "gedrag", notitie: "neemt nabijheid en tempo graag rustig aan", bron });
        else if (avg >= 3.4) out.push({ domein: "verbinding", facet: "nabijheid", richting: 2, gewicht: 3, soort: "gedrag", notitie: "staat open voor een vlotter tempo in nabijheid", bron });
      }
    }
    const bnd = isObj(r.boundaryAnswers) ? r.boundaryAnswers[id] : undefined;
    if (isObj(bnd)) {
      const vals = Object.values(bnd);
      const cautious = vals.filter((v) => v === "later" || v === "not-okay" || v === "ask-first").length;
      if (vals.length && cautious >= Math.ceil(vals.length / 2)) {
        out.push({ domein: "rust_tempo", facet: "veiligheid", richting: 2, gewicht: 2, soort: "gedrag", notitie: "bewaakt grenzen zorgvuldig en neemt fysieke nabijheid behoedzaam", bron });
      }
    }
    const snr = isObj(r.smallNoResponses) ? r.smallNoResponses[id] : undefined;
    if (isObj(snr) && (snr.supportId === "calm-acceptance" || snr.responseId === "thank-you")) {
      out.push({ domein: "mildheid", facet: "zorgzaam", richting: 2, gewicht: 2, soort: "gedrag", notitie: "reageert rustig en respectvol op een kleine nee", bron });
    }
    return out;
  },

  "kruispunt-reacties": (r, id, bron) => {
    if (!isObj(r.answers)) return [];
    let answered = 0;
    let timeouts = 0;
    for (const card of Object.values(r.answers)) {
      if (!isObj(card)) continue;
      const a = card[id];
      if (!isObj(a)) continue;
      if (a.optionIndex === null) timeouts += 1;
      else answered += 1;
    }
    if (answered + timeouts < 2) return [];
    if (timeouts >= 2 || timeouts > answered)
      return [{ domein: "rust_tempo", facet: "bedachtzaam", richting: 2, gewicht: 2, soort: "gedrag", notitie: "laat zich onder tijdsdruk niet opjagen, kiest niet altijd snel", bron }];
    if (timeouts === 0)
      return [{ domein: "rust_tempo", facet: "vlot", richting: 2, gewicht: 2, soort: "gedrag", notitie: "reageert vlot en beslist onder tijdsdruk", bron }];
    return [];
  },

  "vrolijke-open-plek": (r, id, bron) => {
    const refl = isObj(r.reflections) ? r.reflections[id] : undefined;
    return typeof refl === "string" ? keywordSignals([refl], bron, "gedrag") : [];
  },

  kernkwadranten: (r, id, bron) => {
    const prof = isObj(r.profiles) ? r.profiles[id] : undefined;
    if (!isObj(prof)) return [];
    return keywordSignals(
      [prof.quality, prof.challenge].filter((x): x is string => typeof x === "string"),
      bron,
      "gedrag",
    );
  },

  kwaliteiten: (r, _id, bron) =>
    isObj(r.own) ? keywordSignals(strArr((r.own as Record<string, unknown>).kwaliteiten), bron, "gedrag") : [],

  familiedorp: (r, _id, bron) => keywordSignals(strArr(r.roles), bron, "gedrag"),
};

export function computeTraits(
  personId: string,
  results: RelationshipGameResult[],
  profile: ProfileFacts | undefined,
  waiting: { personSeconds: number; totalSeconds: number },
): DomainReading[] {
  const signals: Signal[] = [];

  // 1) Directe zelfrapportage uit het profiel (leidend bij weinig spel-data).
  if (profile) {
    signals.push(...valueSignals(profile.kernwaarden, "Profiel", "zelfrapportage", 2));
    signals.push(...keywordSignals(profile.interesses, "Profiel", "zelfrapportage"));
    if (profile.relatie_intentie === "serieus") {
      signals.push({ domein: "zorgvuldigheid", facet: "serieus", richting: 3, gewicht: 2, soort: "zelfrapportage", notitie: "zoekt iets serieus", bron: "Profiel" });
    }
    if (profile.levensfase === "kinderwens" || profile.levensfase === "heeft-kinderen") {
      const note = profile.levensfase === "kinderwens" ? "heeft een kinderwens en kijkt naar de toekomst" : "heeft kinderen; gezin speelt een rol";
      signals.push({ domein: "zingeving", facet: "richting", richting: 3, gewicht: 2, soort: "zelfrapportage", notitie: note, bron: "Profiel" });
      signals.push({ domein: "zorgvuldigheid", facet: "toewijding", richting: 2, gewicht: 1, soort: "zelfrapportage", notitie: "", bron: "Profiel" });
    }
    if (profile.christelijke_laag) {
      signals.push({ domein: "zingeving", facet: "geloof", richting: 3, gewicht: 2, soort: "zelfrapportage", notitie: "koos bewust de geloofslaag — geloof speelt een rol", bron: "Geloofslaag" });
    }
  }

  // 2) Per spel het stuk van deze persoon wegen.
  for (const entry of results) {
    const extractor = GAME_EXTRACTORS[entry.provenance.gameId];
    if (!extractor || !isObj(entry.result)) continue;
    const bron = findGame(entry.provenance.gameId)?.title ?? entry.provenance.gameId;
    signals.push(...extractor(entry.result, personId, bron));
  }

  // 3) Toestand: wachtkamer-tempo.
  if (waiting.totalSeconds > 0) {
    const share = waiting.personSeconds / waiting.totalSeconds;
    if (share >= 0.6) signals.push({ domein: "rust_tempo", facet: "bedachtzaam", richting: 3, gewicht: 2, soort: "toestand", notitie: "er werd duidelijk vaker en langer op deze persoon gewacht", bron: "Wachtkamer" });
    else if (share <= 0.4) signals.push({ domein: "rust_tempo", facet: "vlot", richting: 2, gewicht: 2, soort: "toestand", notitie: "was meestal als eerste klaar in de wachtkamer", bron: "Wachtkamer" });
  }

  // Aggregatie per domein.
  const byDomain = new Map<Domain, Signal[]>();
  for (const s of signals) {
    const list = byDomain.get(s.domein) ?? [];
    list.push(s);
    byDomain.set(s.domein, list);
  }

  const readings: DomainReading[] = [];
  for (const [domain, list] of byDomain.entries()) {
    const bronnen = [...new Set(list.map((s) => s.bron))];
    const coverage = bronnen.length;
    const totalWeight = list.reduce((sum, s) => sum + s.gewicht, 0);
    readings.push({
      domein: DOMAIN_LABEL[domain],
      facetten: [...new Set(list.map((s) => s.facet))],
      kernpunten: [...new Set(list.map((s) => s.notitie).filter(Boolean))].slice(0, 6),
      dekking: coverage <= 2 ? "voorlopig" : coverage <= 4 ? "redelijk" : "stevig",
      nadruk: totalWeight >= 6 ? "duidelijk" : "licht",
      soorten: [...new Set(list.map((s) => s.soort))],
      bronnen,
    });
  }

  // Domeinen met de meeste/duidelijkste onderbouwing eerst.
  const order = { stevig: 2, redelijk: 1, voorlopig: 0 } as const;
  return readings.sort(
    (a, b) =>
      order[b.dekking] - order[a.dekking] ||
      b.kernpunten.length - a.kernpunten.length,
  );
}
