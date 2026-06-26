export type TriggerId =
  | "stilte"
  | "toon"
  | "kritiek"
  | "planning"
  | "geld"
  | "familie"
  | "tempo"
  | "telefoon"
  | "niet-gezien"
  | "druk"
  | "afwijzing"
  | "alleen";

export type InnerId =
  | "verdriet"
  | "angst"
  | "schaamte"
  | "eenzaam"
  | "teleurstelling"
  | "machteloos"
  | "boosheid"
  | "controle"
  | "verdedigen"
  | "kwijtraken"
  | "niet-belangrijk"
  | "oplossen";

export type OuterId =
  | "aandringen"
  | "uitleggen"
  | "fel"
  | "controleren"
  | "stilvallen"
  | "terugtrekken"
  | "kort"
  | "vermijden"
  | "pleasen"
  | "te-snel-sorry"
  | "grap"
  | "bevriezen";

export type InterpretationId =
  | "niet-belangrijk"
  | "wil-winnen"
  | "laat-alleen"
  | "niet-serieus"
  | "te-veel"
  | "keurt-af"
  | "tegen-mij"
  | "controleert"
  | "sluit-hart"
  | "gaat-weg"
  | "schuld"
  | "voelt-niets";

export type NeedId =
  | "geruststelling"
  | "erkenning"
  | "ruimte"
  | "nabijheid"
  | "veiligheid"
  | "duidelijkheid"
  | "zachtheid"
  | "serieus"
  | "vrijheid"
  | "blijven";

export type EndpointId =
  | "allebei-stil"
  | "boos-stil"
  | "veel-woorden"
  | "snel-goedmaken"
  | "vermijden"
  | "afstand"
  | "sorry-zonder-begrip"
  | "oude-pijn"
  | "moe"
  | "contact-kwijt";

export type AccelerationId =
  | "toon"
  | "wegloopt"
  | "duwen"
  | "oude-voorbeelden"
  | "altijd-nooit"
  | "laat-maar"
  | "analyseert"
  | "geloof-wapen"
  | "sarcasme"
  | "afsluit"
  | "geen-terugkomtijd"
  | "schaamte";

export type ExitId =
  | "bij-trigger"
  | "spanning-voel"
  | "voor-uitleggen"
  | "voor-stilval"
  | "oranje"
  | "oude-pijn"
  | "pauze"
  | "twintig-minuten"
  | "voor-slapen"
  | "willen-winnen";

export type ProtectionRoute = "vechten" | "vluchten" | "bevriezen" | "pleasen";

export const triggers: Record<TriggerId, { title: string; group: string }> = {
  stilte: { title: "Stilte / geen reactie", group: "Relationeel" },
  toon: { title: "Korte toon", group: "Relationeel" },
  kritiek: { title: "Kritiek of correctie", group: "Relationeel" },
  planning: { title: "Planning of afspraak vergeten", group: "Praktisch" },
  geld: { title: "Geld of aankoop", group: "Praktisch" },
  familie: { title: "Familie / schoonfamilie", group: "Praktisch" },
  tempo: { title: "Lichamelijkheid, seks of tempo", group: "Gevoelig" },
  telefoon: { title: "Telefoon / schermtijd", group: "Praktisch" },
  "niet-gezien": { title: "Niet gezien worden", group: "Dieper" },
  druk: { title: "Gevoel dat de ander drukt", group: "Dieper" },
  afwijzing: { title: "Ik voel mij afgewezen", group: "Dieper" },
  alleen: { title: "Ik voel dat ik alleen sta", group: "Dieper" },
};

export const inners: Record<InnerId, { title: string; kind: string }> = {
  verdriet: { title: "Verdriet", kind: "eerste gevoel" },
  angst: { title: "Angst", kind: "eerste gevoel" },
  schaamte: { title: "Schaamte", kind: "eerste gevoel" },
  eenzaam: { title: "Eenzaamheid", kind: "eerste gevoel" },
  teleurstelling: { title: "Teleurstelling", kind: "eerste gevoel" },
  machteloos: { title: "Machteloosheid", kind: "eerste gevoel" },
  boosheid: { title: "Boosheid", kind: "tweede laag" },
  controle: { title: "Controle zoeken", kind: "bescherming" },
  verdedigen: { title: "Ik moet mij verdedigen", kind: "gedachte" },
  kwijtraken: { title: "Ik raak je kwijt", kind: "gedachte" },
  "niet-belangrijk": { title: "Ik ben niet belangrijk", kind: "gedachte" },
  oplossen: { title: "Ik moet dit oplossen", kind: "gedachte" },
};

export const outers: Record<OuterId, { title: string; route: ProtectionRoute }> = {
  aandringen: { title: "Aandringen", route: "vechten" },
  uitleggen: { title: "Uitleggen", route: "vechten" },
  fel: { title: "Fel worden", route: "vechten" },
  controleren: { title: "Controle zoeken", route: "vechten" },
  stilvallen: { title: "Stilvallen", route: "bevriezen" },
  terugtrekken: { title: "Terugtrekken", route: "vluchten" },
  kort: { title: "Kort antwoorden", route: "vluchten" },
  vermijden: { title: "Vermijden", route: "vluchten" },
  pleasen: { title: "De ander tevreden stellen", route: "pleasen" },
  "te-snel-sorry": { title: "Te snel sorry zeggen", route: "pleasen" },
  grap: { title: "Grap maken om spanning te breken", route: "pleasen" },
  bevriezen: { title: "Geen woorden meer hebben", route: "bevriezen" },
};

export const interpretations: Record<InterpretationId, string> = {
  "niet-belangrijk": "je vindt mij niet belangrijk",
  "wil-winnen": "je wilt winnen",
  "laat-alleen": "je laat mij alleen",
  "niet-serieus": "je neemt mij niet serieus",
  "te-veel": "je vindt mij te veel",
  "keurt-af": "je keurt mij af",
  "tegen-mij": "je bent tegen mij",
  controleert: "je wilt mij controleren",
  "sluit-hart": "je sluit je hart",
  "gaat-weg": "je gaat toch weg",
  schuld: "je geeft mij overal de schuld",
  "voelt-niets": "je voelt niets",
};

export const needs: Record<NeedId, string> = {
  geruststelling: "geruststelling",
  erkenning: "erkenning",
  ruimte: "ruimte",
  nabijheid: "nabijheid",
  veiligheid: "veiligheid",
  duidelijkheid: "duidelijkheid",
  zachtheid: "zachtheid",
  serieus: "serieus genomen worden",
  vrijheid: "keuzevrijheid",
  blijven: "weten dat je blijft",
};

export const endpoints: Record<EndpointId, string> = {
  "allebei-stil": "allebei stil",
  "boos-stil": "één boos, één stil",
  "veel-woorden": "veel woorden, weinig contact",
  "snel-goedmaken": "snel goedmaken zonder echt herstel",
  vermijden: "vermijden tot het overwaait",
  afstand: "lichamelijke of emotionele afstand",
  "sorry-zonder-begrip": "sorry zeggen maar niets begrijpen",
  "oude-pijn": "oude pijn erbij halen",
  moe: "allebei moe",
  "contact-kwijt": "contact kwijt",
};

export const accelerations: Record<AccelerationId, string> = {
  toon: "als de toon verandert",
  wegloopt: "als iemand wegloopt",
  duwen: "als iemand blijft duwen",
  "oude-voorbeelden": "als oude voorbeelden erbij komen",
  "altijd-nooit": "als altijd/nooit valt",
  "laat-maar": "als iemand laat maar zegt",
  analyseert: "als iemand de ander analyseert",
  "geloof-wapen": "als geloof of principes als wapen voelen",
  sarcasme: "als sarcasme binnenkomt",
  afsluit: "als iemand zich afsluit",
  "geen-terugkomtijd": "als er geen terugkomtijd is",
  schaamte: "als schaamte het overneemt",
};

export const exits: Record<ExitId, string> = {
  "bij-trigger": "direct bij de trigger",
  "spanning-voel": "zodra ik spanning voel",
  "voor-uitleggen": "voordat ik ga uitleggen",
  "voor-stilval": "voordat ik stilval",
  oranje: "zodra iemand oranje zegt",
  "oude-pijn": "zodra oude pijn erbij komt",
  pauze: "nadat we pauze nemen",
  "twintig-minuten": "binnen 20 minuten na stilte",
  "voor-slapen": "voor het slapen",
  "willen-winnen": "zodra we merken dat we willen winnen",
};

export const repairSentences = [
  "Ik wil niet winnen, ik wil terug naar jou.",
  "Ik ben geraakt, maar ik ben niet tegen jou.",
  "Ik merk dat ik mezelf verdedig.",
  "Ik heb even pauze nodig, maar ik kom terug.",
  "Ik denk dat ik invul wat jij bedoelt.",
  "Ik word stil, maar ik geef je niet op.",
  "Kunnen we opnieuw beginnen?",
  "Ik wil eerst begrijpen voordat ik reageer.",
  "Mijn toon was verkeerd. Mijn punt wil ik rustiger uitleggen.",
  "Ik wil verantwoordelijkheid nemen voor mijn deel.",
];

export const contractOptions = [
  "Als ik stil word, kom ik binnen 20 minuten terug.",
  "Als ik ga aandringen, stel ik eerst één vraag.",
  "Als jij oranje zegt, pauzeren we zonder discussie.",
  "Als we rood zijn, nemen we pauze met terugkomtijd.",
  "We gebruiken altijd/nooit niet tijdens ruzie.",
  "We praten niet verder als één van ons alleen nog wil winnen.",
  "We appen niet verder bij ruzie, maar plannen een gesprek.",
  "We noemen eerst wat we voelen voordat we uitleggen waarom.",
  "We stoppen niet midden in rood zonder terugkeer.",
];

export const routeNameOptions = [
  "De Stilte-Spiraal",
  "De Druk-en-Dicht Route",
  "De Gelijk-Krijg Brug",
  "De Laat-Maar Kloof",
  "De Snelle Oplosroute",
  "De Oude-Pijn Bocht",
  "De Oranje Brug",
  "De Terugkomroute",
];

export const christianQuestions = [
  "Waar begin ik mezelf te rechtvaardigen?",
  "Waar oordeel ik sneller dan ik luister?",
  "Wat is hier waarheid spreken in liefde?",
  "Wat is hier verantwoordelijkheid nemen zonder mezelf te vernietigen?",
  "Waar helpt vergeving zonder het probleem weg te poetsen?",
];
