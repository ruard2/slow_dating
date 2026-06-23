import type { ValueId } from "./contracts";

export interface ValueDefinition {
  id: ValueId;
  name: string;
  emoji: string;
  question: string;
}

export const christianPrompts = [
  "Welke van jouw waarden komen voort uit je geloof of het volgen van Christus?",
  "Waar dagen jullie waarden elkaar uit om meer op Christus te gaan lijken?",
  "Welke waarde wil je samen, voor God, centraal zetten in jullie relatie?",
] as const;

export const values: ValueDefinition[] = [
  { id: "eerlijkheid", name: "Eerlijkheid", emoji: "🤝", question: "Wanneer was het moeilijkst om eerlijk te zijn, maar ben je blij dat je het deed?" },
  { id: "trouw", name: "Trouw", emoji: "💛", question: "Voor wie zou jij alles laten vallen als diegene je nu belde?" },
  { id: "familie", name: "Familie", emoji: "🏠", question: "Hoe zag jouw thuis eruit toen je opgroeide? Wat wil je hetzelfde doen en wat anders?" },
  { id: "humor", name: "Humor", emoji: "😄", question: "Wanneer lach jij het hardst en wie brengt dat in jou naar boven?" },
  { id: "respect", name: "Respect", emoji: "🌿", question: "Wat respecteer jij in anderen dat je zelden uitspreekt?" },
  { id: "avontuur", name: "Avontuur", emoji: "🧭", question: "Wat is de meest avontuurlijke keuze die je ooit hebt gemaakt?" },
  { id: "geloof", name: "Geloof", emoji: "✝️", question: "Wat geeft jouw leven richting en waar haal jij betekenis uit?" },
  { id: "warmte", name: "Warmte", emoji: "☀️", question: "Voor wie zorg jij het meest spontaan, zonder dat het je moeite kost?" },
  { id: "vrijheid", name: "Vrijheid", emoji: "🦋", question: "Wat heb je ooit opgegeven voor vrijheid en was dat de moeite waard?" },
  { id: "groei", name: "Groei", emoji: "🌱", question: "Wanneer kijk je terug en denk je: ik ben echt anders geworden?" },
  { id: "rust", name: "Rust", emoji: "🌊", question: "Waar of bij wie voel jij je het meest thuis en wat maakt dat zo?" },
  { id: "vriendschap", name: "Vriendschap", emoji: "🤗", question: "Wie kent jou het beste en wat weet diegene dat anderen niet weten?" },
  { id: "ambitie", name: "Ambitie", emoji: "🔥", question: "Wat is een droom die je nog niet hardop hebt uitgesproken?" },
  { id: "verbinding", name: "Verbinding", emoji: "🫂", question: "In welk gezelschap hoef jij jezelf niet te filteren?" },
  { id: "dankbaarheid", name: "Dankbaarheid", emoji: "🙏", question: "Waar ben jij dankbaar voor dat je zelden uitspreekt?" },
  { id: "creativiteit", name: "Creativiteit", emoji: "🎨", question: "Wanneer voel jij je het meest creatief en wat maak of doe jij dan?" },
];

export const tensionQuestions: Array<{
  values: [ValueId, ValueId];
  question: string;
}> = [
  { values: ["vrijheid", "familie"], question: "Vrijheid en Familie: hoe houd jij ruimte en verbondenheid in evenwicht?" },
  { values: ["ambitie", "rust"], question: "Ambitie wil vooruit, Rust wil vertragen. Wanneer geef jij gas en wanneer rem je?" },
  { values: ["geloof", "avontuur"], question: "Geloof geeft richting, Avontuur zoekt het onbekende. Hoe werken die twee in jou?" },
  { values: ["vrijheid", "trouw"], question: "Hoe ben jij trouw zonder jezelf of je vrijheid te verliezen?" },
  { values: ["ambitie", "vriendschap"], question: "Ambitie en Vriendschap vragen allebei tijd. Hoe kies jij wanneer beide roepen?" },
  { values: ["verbinding", "vrijheid"], question: "Verbinding wil nabijheid, Vrijheid wil ruimte. Hoe werkt dat voor jou in een relatie?" },
  { values: ["familie", "avontuur"], question: "Familie geeft wortels, Avontuur geeft vleugels. Hoe leven die twee in jou?" },
];

export const selectionHotspots = [
  { left: 15.7, top: 36.1, width: 14.5, height: 8.7 },
  { left: 33.0, top: 36.2, width: 14.7, height: 8.7 },
  { left: 51.2, top: 36.1, width: 15.0, height: 9.0 },
  { left: 69.4, top: 36.2, width: 14.7, height: 8.7 },
  { left: 15.2, top: 47.6, width: 15.0, height: 8.7 },
  { left: 33.4, top: 47.6, width: 14.7, height: 8.6 },
  { left: 51.5, top: 47.6, width: 14.1, height: 8.9 },
  { left: 69.9, top: 47.3, width: 13.8, height: 9.3 },
  { left: 15.5, top: 58.7, width: 15.4, height: 9.3 },
  { left: 33.0, top: 58.7, width: 15.0, height: 9.2 },
  { left: 51.2, top: 58.7, width: 15.5, height: 9.4 },
  { left: 68.9, top: 58.7, width: 15.7, height: 9.2 },
  { left: 15.2, top: 70.0, width: 14.5, height: 9.2 },
  { left: 33.0, top: 70.1, width: 15.2, height: 9.0 },
  { left: 51.2, top: 69.7, width: 15.0, height: 9.3 },
  { left: 69.4, top: 70.0, width: 15.4, height: 9.3 },
];
