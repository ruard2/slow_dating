export const christianPrompts = [
  "Hoe kijken jullie vanuit geloof naar seksualiteit, wachten en wat je voor het huwelijk bewaart?",
  "Wat betekent reinheid en respect voor het lichaam van de ander concreet voor jullie tempo?",
  "Hoe kunnen jullie elkaar helpen om grenzen niet als regel, maar als zorg en trouw te zien?",
  "Wat zou je samen aan God willen vragen over hoe jullie hierin groeien?",
] as const;

export const boundaryLevels = [
  { id: "fine", label: "Prima" },
  { id: "ask-first", label: "Eerst vragen" },
  { id: "later", label: "Liever later" },
  { id: "not-okay", label: "Niet goed" },
] as const;

export const boundaryScenarios = [
  {
    id: "daily-messages",
    text: "De ander appt meerdere keren per dag.",
  },
  {
    id: "online-status",
    text: "De ander vraagt waarom je nog online was.",
  },
  {
    id: "call-soon",
    text: "De ander wil na een paar gesprekken bellen.",
  },
  {
    id: "previous-relationship",
    text: "De ander vraagt naar je vorige relatie.",
  },
  {
    id: "other-dates",
    text: "De ander wil weten of je ook met anderen praat.",
  },
  {
    id: "hold-hands",
    text: "De ander wil je hand vasthouden.",
  },
  {
    id: "vulnerable-joke",
    text: "De ander maakt een grap over iets kwetsbaars.",
  },
  {
    id: "exclusivity",
    text: "De ander wil snel duidelijkheid over exclusiviteit.",
  },
  {
    id: "photo-together",
    text: "De ander wil samen op de foto.",
  },
  {
    id: "deep-values",
    text: "De ander vraagt iets over geloof, seksualiteit of toekomst.",
  },
] as const;

export const tempoLevels = [
  { id: "slow", label: "Langzaam" },
  { id: "calm", label: "Rustig" },
  { id: "average", label: "Gemiddeld" },
  { id: "fast", label: "Snel" },
] as const;

export const tempoAreas = [
  { id: "messages", label: "Appcontact" },
  { id: "stories", label: "Persoonlijke verhalen" },
  { id: "emotional", label: "Emotionele openheid" },
  { id: "physical", label: "Lichamelijke nabijheid" },
  { id: "social-circle", label: "Vrienden en familie betrekken" },
  { id: "exclusive", label: "Exclusiviteit" },
] as const;

export const smallNoScenarios = [
  "Zullen we vanavond nog bellen?",
  "Mag ik daar iets persoonlijks over vragen?",
  "Zullen we elkaar zaterdag zien?",
  "Mag ik je een knuffel geven?",
  "Wil je uitleggen waarom je stil werd?",
  "Zullen we dit gesprek nog even voortzetten?",
] as const;

export const boundaryPhrases = [
  "Nu liever niet.",
  "Misschien later.",
  "Daar wil ik nog niet over praten.",
  "Ik vind je leuk, maar dit gaat voor mij te snel.",
] as const;

export const responseOptions = [
  {
    id: "thank-you",
    label: "Prima, dankjewel dat je het zegt.",
    tone: "Geeft ruimte",
  },
  {
    id: "why-not",
    label: "Waarom niet?",
    tone: "Kan als druk voelen",
  },
  {
    id: "meant-well",
    label: "Ik bedoelde het gewoon aardig.",
    tone: "Verlegt de aandacht",
  },
  {
    id: "withdraw",
    label: "Laat maar dan.",
    tone: "Kan als straf voelen",
  },
] as const;

export const supportOptions = [
  { id: "calm-acceptance", label: "Mijn nee rustig aannemen" },
  { id: "no-explanation", label: "Geen uitleg van mij verlangen" },
  { id: "check-later", label: "Later nog eens vriendelijk afstemmen" },
  { id: "stay-warm", label: "Warm en betrokken blijven" },
] as const;

export function optionLabel(
  options: readonly { id: string; label: string }[],
  id: string | undefined,
) {
  if (!id) return "Niet ingevuld";
  return options.find((option) => option.id === id)?.label ?? id;
}
