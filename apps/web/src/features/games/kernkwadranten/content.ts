export type QuadrantField = "quality" | "pitfall" | "challenge" | "allergy";

export interface QualityProfile {
  quality: string;
  pitfall: string;
  challenge: string;
  allergy: string;
}

export const qualityProfiles: QualityProfile[] = [
  { quality: "Zorgzaam", pitfall: "Jezelf wegcijferen", challenge: "Grenzen bewaken", allergy: "Egoisme" },
  { quality: "Eerlijk", pitfall: "Botheid", challenge: "Tact", allergy: "Oneerlijkheid" },
  { quality: "Enthousiast", pitfall: "Overrompelen", challenge: "Doseren", allergy: "Passiviteit" },
  { quality: "Geduldig", pitfall: "Te lang afwachten", challenge: "Tijdig handelen", allergy: "Ongeduld" },
  { quality: "Empathisch", pitfall: "Overnemen", challenge: "Afstand houden", allergy: "Onverschilligheid" },
  { quality: "Betrouwbaar", pitfall: "Te veel dragen", challenge: "Hulp vragen", allergy: "Onbetrouwbaarheid" },
  { quality: "Creatief", pitfall: "Versnippering", challenge: "Afronden", allergy: "Starheid" },
  { quality: "Nieuwsgierig", pitfall: "Bemoeizucht", challenge: "Respectvol begrenzen", allergy: "Oppervlakkigheid" },
  { quality: "Loyaal", pitfall: "Blind trouw blijven", challenge: "Eigen koers houden", allergy: "Ontrouw" },
  { quality: "Doorzetter", pitfall: "Doordrammen", challenge: "Loslaten", allergy: "Luiheid" },
  { quality: "Optimistisch", pitfall: "Problemen onderschatten", challenge: "Realistisch kijken", allergy: "Negativiteit" },
  { quality: "Directief", pitfall: "Domineren", challenge: "Ruimte geven", allergy: "Besluiteloosheid" },
  { quality: "Daadkrachtig", pitfall: "Te snel beslissen", challenge: "Vertragen", allergy: "Passiviteit" },
  { quality: "Spontaan", pitfall: "Onbezonnenheid", challenge: "Vooruitdenken", allergy: "Regelzucht" },
  { quality: "Sensitief", pitfall: "Overprikkeling", challenge: "Stevigheid", allergy: "Hardheid" },
  { quality: "Gedreven", pitfall: "Over je grens gaan", challenge: "Herstellen", allergy: "Luiheid" },
  { quality: "Bescheiden", pitfall: "Onzichtbaar worden", challenge: "Jezelf tonen", allergy: "Arrogantie" },
  { quality: "Rustig", pitfall: "Afwachtend worden", challenge: "Initiatief nemen", allergy: "Dramatiek" },
  { quality: "Humoristisch", pitfall: "Serie vermijden", challenge: "Kwetsbaar blijven", allergy: "Zwaarmoedigheid" },
  { quality: "Onafhankelijk", pitfall: "Afstand houden", challenge: "Steun toelaten", allergy: "Afhankelijkheid" },
  { quality: "Hartelijk", pitfall: "Iedereen willen pleasen", challenge: "Eerlijk begrenzen", allergy: "Afstandelijkheid" },
  { quality: "Analytisch", pitfall: "Overdenken", challenge: "Vertrouwen op gevoel", allergy: "Onbezonnenheid" },
  { quality: "Flexibel", pitfall: "Meewaaien", challenge: "Standpunt innemen", allergy: "Starheid" },
  { quality: "Organisatietalent", pitfall: "Controlezucht", challenge: "Ruimte laten", allergy: "Chaos" },
  { quality: "Rechtvaardig", pitfall: "Moraliserend worden", challenge: "Nuance", allergy: "Onrechtvaardigheid" },
  { quality: "Perfectionistisch", pitfall: "Veeleisendheid", challenge: "Goed genoeg", allergy: "Slordigheid" },
  { quality: "Avontuurlijk", pitfall: "Roekeloosheid", challenge: "Risico afwegen", allergy: "Bangheid" },
  { quality: "Behulpzaam", pitfall: "Ongevraagd oplossen", challenge: "Eerst vragen", allergy: "Egoisme" },
  { quality: "Nuchter", pitfall: "Gevoel wegredeneren", challenge: "Emotie toelaten", allergy: "Dramatiek" },
  { quality: "Inspirerend", pitfall: "Te groot maken", challenge: "Concreet blijven", allergy: "Futloosheid" },
];

export const allQualities = qualityProfiles.map(({ quality }) => quality);
export const allAllergies = [...new Set(qualityProfiles.map(({ allergy }) => allergy))];

export function profileForQuality(quality: string) {
  return (
    qualityProfiles.find((profile) => profile.quality === quality) ??
    qualityProfiles[0]!
  );
}

export function profileForAllergy(allergy: string) {
  return (
    qualityProfiles.find((profile) => profile.allergy === allergy) ??
    qualityProfiles[0]!
  );
}

function rotate<T>(items: T[], offset: number) {
  return items.map((_, index) => items[(index + offset) % items.length]!);
}

export function optionsFor(
  profile: QualityProfile,
  field: QuadrantField,
) {
  const correct = profile[field];
  const pool = qualityProfiles
    .map((candidate) => candidate[field])
    .filter((value, index, values) => value !== correct && values.indexOf(value) === index);
  const seed = [...profile.quality, ...field].reduce(
    (sum, character) => sum + character.charCodeAt(0),
    0,
  );
  const distractors = rotate(pool, seed % pool.length).slice(0, 3);
  return rotate([correct, ...distractors], seed % 4);
}

export const conversationQuestions = [
  "Welk vak herken je het sterkst in het dagelijks leven?",
  "Wanneer slaat jouw kwaliteit door naar de valkuil?",
  "Wat kan je partner doen wanneer jij in die valkuil terechtkomt?",
  "Welke kleine stap maakt de uitdaging haalbaar?",
  "Wat raakt jou precies in de allergie van de ander?",
  "Waar lijken jullie kwadranten op elkaar en waar botsen ze?",
];
