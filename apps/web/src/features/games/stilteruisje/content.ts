export const needs = [
  {
    id: "safety",
    label: "Veiligheid",
    description: "Weten dat wat je deelt zorgvuldig wordt ontvangen.",
  },
  {
    id: "time",
    label: "Tijd",
    description: "Niet hoeven haasten naar een antwoord of oplossing.",
  },
  {
    id: "clarity",
    label: "Duidelijkheid",
    description: "Weten waar het gesprek over gaat en wat er wordt gevraagd.",
  },
  {
    id: "gentleness",
    label: "Zachtheid",
    description: "Een rustige toon, zonder oordeel of druk.",
  },
  {
    id: "closeness",
    label: "Nabijheid",
    description: "Voelen dat de ander echt aanwezig en betrokken is.",
  },
] as const;

export const noises = [
  { id: "interruptions", label: "Onderbrekingen", detail: "Steeds van richting veranderen." },
  { id: "haste", label: "Haast", detail: "Snel tot een conclusie moeten komen." },
  { id: "advice", label: "Ongevraagd advies", detail: "Oplossingen krijgen voordat je bent gehoord." },
  { id: "tension", label: "Spanning", detail: "Op je woorden moeten letten uit angst voor reactie." },
  { id: "uncertainty", label: "Onduidelijkheid", detail: "Niet weten wat de ander werkelijk bedoelt." },
] as const;

export const invitations = [
  { id: "walk", label: "Samen wandelen", detail: "Praten terwijl jullie dezelfde kant op kijken." },
  { id: "quiet", label: "Eerst even stil", detail: "Beginnen zonder meteen woorden te hoeven vinden." },
  { id: "question", label: "Een open vraag", detail: "Een rustige, oprechte uitnodiging krijgen." },
  { id: "side-by-side", label: "Naast elkaar zitten", detail: "Nabij zijn zonder voortdurend oogcontact." },
  { id: "direct", label: "Eerlijk benoemen", detail: "Duidelijk zeggen wat je wilt delen en waarom." },
] as const;

export const supportActions = [
  { id: "listen", label: "Ik luister uit zonder het op te lossen." },
  { id: "slow", label: "Ik vertraag en laat stiltes bestaan." },
  { id: "check", label: "Ik vraag tussendoor wat je van mij nodig hebt." },
  { id: "soften", label: "Ik let bewust op een zachte toon." },
] as const;

export const conversationQuestions = [
  "Welke instelling op jouw mengpaneel verrast je het meest?",
  "Wanneer voelde jij je voor het laatst echt vrij om open te zijn?",
  "Welke ruis maak ik soms onbedoeld harder?",
  "Wat kan ik klein en concreet doen waardoor jij meer ruimte voelt?",
  "Welke stilte voelt voor jou prettig, en welke juist afstandelijk?",
] as const;

export type NeedId = (typeof needs)[number]["id"];
export type NoiseId = (typeof noises)[number]["id"];
export type InvitationId = (typeof invitations)[number]["id"];
export type SupportActionId = (typeof supportActions)[number]["id"];

export function labelFor<T extends { id: string; label: string }>(
  items: readonly T[],
  id: string,
) {
  return items.find((item) => item.id === id)?.label ?? id;
}
