const PERSON = (n: number) => `/assets/dorp/people/person-${n}.webp`;
const OM = (code: string) => `/assets/dorp/symbols/${code}.svg`;

export interface TrayItem {
  id: string;
  img: string;
  role: string;
  isDier?: boolean;
}

export interface TrayCat {
  id: string;
  label: string;
  isDier?: boolean;
  items: TrayItem[];
}

export const TRAY_CATS: TrayCat[] = [
  {
    id: "ouders",
    label: "Ouders",
    items: [
      { id: "vader", img: PERSON(5), role: "vader" },
      { id: "moeder", img: PERSON(1), role: "moeder" },
      { id: "vader-grijs", img: PERSON(10), role: "vader (ouder)" },
      { id: "moeder-grijs", img: PERSON(8), role: "moeder (ouder)" },
      { id: "pleegvader", img: PERSON(7), role: "pleegvader" },
      { id: "pleegmoeder", img: PERSON(3), role: "pleegmoeder" },
      { id: "verzorger", img: PERSON(11), role: "verzorger" },
      { id: "stiefvader", img: PERSON(6), role: "stiefvader" },
      { id: "stiefmoeder", img: PERSON(2), role: "stiefmoeder" },
    ],
  },
  {
    id: "kinderen",
    label: "Kinderen",
    items: [
      { id: "zoon", img: PERSON(7), role: "zoon" },
      { id: "dochter", img: PERSON(3), role: "dochter" },
      { id: "broertje", img: PERSON(4), role: "broertje" },
      { id: "zusje", img: PERSON(2), role: "zusje" },
      { id: "broer", img: PERSON(6), role: "broer" },
      { id: "zus", img: PERSON(8), role: "zus" },
      { id: "halfbroer", img: PERSON(11), role: "halfbroer" },
      { id: "halfzus", img: PERSON(1), role: "halfzus" },
      { id: "pleegkind", img: PERSON(9), role: "pleegkind" },
    ],
  },
  {
    id: "grootouders",
    label: "Grootouders",
    items: [
      { id: "opa", img: PERSON(10), role: "opa" },
      { id: "oma", img: PERSON(8), role: "oma" },
      { id: "overopa", img: PERSON(5), role: "overopa" },
      { id: "overoma", img: PERSON(2), role: "overoma" },
    ],
  },
  {
    id: "familie",
    label: "Familie",
    items: [
      { id: "oom", img: PERSON(5), role: "oom" },
      { id: "tante", img: PERSON(1), role: "tante" },
      { id: "neef", img: PERSON(7), role: "neef" },
      { id: "nicht", img: PERSON(3), role: "nicht" },
      { id: "familielid", img: PERSON(11), role: "familielid" },
    ],
  },
  {
    id: "mensen",
    label: "Mensen",
    items: [
      { id: "vriend", img: PERSON(6), role: "vriend" },
      { id: "vriendin", img: PERSON(2), role: "vriendin" },
      { id: "buurman", img: PERSON(4), role: "buurman" },
      { id: "buurvrouw", img: PERSON(3), role: "buurvrouw" },
      { id: "speciaal", img: PERSON(11), role: "speciaal iemand" },
      { id: "mysterie", img: OM("2753"), role: "mysterie" },
    ],
  },
  {
    id: "dieren",
    label: "Dieren",
    isDier: true,
    items: [
      { id: "hond", img: OM("1F415"), role: "hond", isDier: true },
      { id: "kat", img: OM("1F408"), role: "kat", isDier: true },
      { id: "konijn", img: OM("1F430"), role: "konijn", isDier: true },
      { id: "paard", img: OM("1F434"), role: "paard", isDier: true },
      { id: "vogel", img: OM("1F426"), role: "vogel", isDier: true },
      { id: "vis", img: OM("1F41F"), role: "vis", isDier: true },
      { id: "schildpad", img: OM("1F422"), role: "schildpad", isDier: true },
      { id: "kip", img: OM("1F413"), role: "kip", isDier: true },
      { id: "poedel", img: OM("1F429"), role: "poedel", isDier: true },
      { id: "vos", img: OM("1F98A"), role: "vos", isDier: true },
      { id: "ander", img: OM("1F43E"), role: "ander dier", isDier: true },
    ],
  },
];

export const DIER_IDS = new Set<string>(
  TRAY_CATS.find((c) => c.id === "dieren")?.items.map((i) => i.id) ?? [],
);

export const LABELS = [
  "de regelaar",
  "de grappenmaker",
  "de stille kracht",
  "de sfeermaker",
  "de denker",
  "de zorgzame",
  "de chaoot",
  "de keukenheld",
  "de appgroep-koning(in)",
  "de altijd-te-laat-persoon",
  "de doe-maar-normaal-persoon",
  "de mopperaar met een goed hart",
  "de praktische helper",
  "de verhalenverteller",
  "de rustbrenger",
  "de vragensteller",
  "de eeuwige optimist",
  "de echte baas van het huis",
  "de echte baas",
  "de knuffelkoning",
  "de herrieschopper",
  "de bankbezetter",
  "de chaosmotor",
  "de trouwe schaduw",
  "de snackinspecteur",
  "de slaapkampioen",
  "de dramaqueen",
];

export const SFEER_OPTIES = [
  "gezellig druk",
  "rustig",
  "praktisch",
  "chaotisch maar warm",
  "veel humor",
  "veel eten",
  "veel praten",
  "weinig woorden, wel betrokken",
  "iedereen bemoeit zich ermee",
  "iedereen doet zijn eigen ding",
  "veel plannen",
  "veel improviseren",
  "altijd koffie of thee",
  "altijd iemand te laat",
  "veel dieren",
  "veel verhalen",
  "veel doe-maar-normaal",
  "veel zorg voor elkaar",
  "soms ingewikkeld",
  "liever kort houden",
];

export const ZIN_OPTIES = [
  "Heb je wel genoeg gegeten?",
  "Doe even normaal.",
  "Wie heeft de oplader?",
  "We gaan over vijf minuten weg.",
  "Zet de waterkoker maar aan.",
  "Dat kan nog best.",
  "Niet zo moeilijk doen.",
  "Vroeger deden we dat ook zo.",
  "Waar is de afstandsbediening?",
  "Neem nog wat mee voor onderweg.",
  "Ik zeg niks, maar...",
  "Gezellig dat je er bent.",
  "We hadden toch afgesproken om op tijd te zijn?",
  "Er is altijd nog plek voor taart.",
  "Kom, we doen gewoon alsof dit gepland was.",
];

export const NAPRAAT_VRAGEN = [
  "Wie zou ik op een verjaardag bij jullie meteen herkennen?",
  "Wie zorgt bij jullie voor de meeste gezelligheid?",
  "Wie is het grappigste personage in jouw familiedorp?",
  "Wie staat dichterbij dan mensen misschien zouden verwachten?",
  "Welk dier of mens is eigenlijk de baas?",
  "Wat is typisch aan jouw familie of thuiswereld?",
  "Wat neem jij graag mee uit jouw thuis?",
  "Wat laat je liever nog even voor later?",
];
