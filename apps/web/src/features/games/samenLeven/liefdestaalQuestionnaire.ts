import type { SamenLevenPrompt } from "./content";
import {
  loveRouteInfo,
  type LoveRoute,
} from "./liefdestaalContent";

type PairOption = { label: string; route: LoveRoute };
type PairQuestion = {
  id: string;
  section: "ontvangen" | "geven";
  question: string;
  options: readonly [PairOption, PairOption];
};

// Dertig volledig originele gedwongen A/B-keuzes. Iedere combinatie van twee
// routes komt drie keer voor; daardoor kan geen route door de vraagopbouw zelf
// vaker scoren dan een andere.
export const lovePairQuestions: readonly PairQuestion[] = [
  {
    id: "r01",
    section: "ontvangen",
    question: "Na een zware dag raakt dit mij meer:",
    options: [
      { label: "Je zegt precies wat je in mij waardeert.", route: "woorden" },
      { label: "Je gaat zonder afleiding bij me zitten.", route: "aandacht" },
    ],
  },
  {
    id: "r02",
    section: "ontvangen",
    question: "Wanneer ik onzeker ben, helpt dit het meest:",
    options: [
      { label: "Je spreekt vertrouwen in mij uit.", route: "woorden" },
      { label: "Je biedt een warme, welkome omhelzing aan.", route: "aanraking" },
    ],
  },
  {
    id: "r03",
    section: "ontvangen",
    question: "In een drukke week voelt dit sterker als liefde:",
    options: [
      { label: "Je stuurt een persoonlijk bemoedigend bericht.", route: "woorden" },
      { label: "Je neemt uit jezelf een lastige taak over.", route: "hulp" },
    ],
  },
  {
    id: "r04",
    section: "ontvangen",
    question: "Op een gewone dag word ik blijer van:",
    options: [
      { label: "Een onverwacht lief briefje.", route: "woorden" },
      { label: "Iets kleins dat je speciaal voor mij meenam.", route: "attenties" },
    ],
  },
  {
    id: "r05",
    section: "ontvangen",
    question: "Als we elkaar weinig hebben gezien, verlang ik eerder naar:",
    options: [
      { label: "Een avond met volledige aandacht voor elkaar.", route: "aandacht" },
      { label: "Rustig weer lichamelijk dichtbij zijn.", route: "aanraking" },
    ],
  },
  {
    id: "r06",
    section: "ontvangen",
    question: "Wanneer mijn hoofd vol zit, ondersteunt dit mij meer:",
    options: [
      { label: "Je luistert totdat ik echt ben uitgepraat.", route: "aandacht" },
      { label: "Je regelt iets praktisch waar ik tegenop zie.", route: "hulp" },
    ],
  },
  {
    id: "r07",
    section: "ontvangen",
    question: "Een bijzonder moment voelt waardevoller door:",
    options: [
      { label: "Samen bewust tijd nemen om het te vieren.", route: "aandacht" },
      { label: "Een zorgvuldig gekozen aandenken.", route: "attenties" },
    ],
  },
  {
    id: "r08",
    section: "ontvangen",
    question: "Als ik verdrietig ben, landt dit dieper:",
    options: [
      { label: "Je vraagt of je mijn hand mag vasthouden.", route: "aanraking" },
      { label: "Je maakt eten of drinken voor me klaar.", route: "hulp" },
    ],
  },
  {
    id: "r09",
    section: "ontvangen",
    question: "Bij thuiskomst voelt dit meer als welkom:",
    options: [
      { label: "Een lange knuffel of kus die echt gemeend is.", route: "aanraking" },
      { label: "Een kleine verrassing die laat zien dat je aan me dacht.", route: "attenties" },
    ],
  },
  {
    id: "r10",
    section: "ontvangen",
    question: "Wanneer ik overbelast ben, waardeer ik eerder:",
    options: [
      { label: "Dat je ziet wat nodig is en het doet.", route: "hulp" },
      { label: "Dat je iets kleins klaarlegt dat mijn dag lichter maakt.", route: "attenties" },
    ],
  },
  {
    id: "r11",
    section: "ontvangen",
    question: "Na een fout geloof ik herstel sneller wanneer:",
    options: [
      { label: "Je helder uitspreekt wat je spijt.", route: "woorden" },
      { label: "Je ruim tijd maakt om mijn kant te horen.", route: "aandacht" },
    ],
  },
  {
    id: "r12",
    section: "ontvangen",
    question: "Als ik iets spannends moet doen, sterkt dit mij meer:",
    options: [
      { label: "Je benoemt waarom je in mij gelooft.", route: "woorden" },
      { label: "Je zoekt even warme nabijheid voordat ik ga.", route: "aanraking" },
    ],
  },
  {
    id: "r13",
    section: "ontvangen",
    question: "Ik voel me beter gezien wanneer:",
    options: [
      { label: "Je hardop opmerkt hoeveel moeite ik deed.", route: "woorden" },
      { label: "Je spontaan helpt om het laatste stuk af te maken.", route: "hulp" },
    ],
  },
  {
    id: "r14",
    section: "ontvangen",
    question: "Voor mijn verjaardag raakt dit mij eerder:",
    options: [
      { label: "Een persoonlijke tekst met echte herinneringen.", route: "woorden" },
      { label: "Een klein cadeau met een verhaal erachter.", route: "attenties" },
    ],
  },
  {
    id: "r15",
    section: "ontvangen",
    question: "Wanneer we langs elkaar heen leven, helpt dit het meest:",
    options: [
      { label: "Samen wandelen en echt doorvragen.", route: "aandacht" },
      { label: "Zonder haast tegen elkaar aan zitten.", route: "aanraking" },
    ],
  },
  {
    id: "r16",
    section: "ontvangen",
    question: "Als ik vastloop, ervaar ik meer liefde doordat je:",
    options: [
      { label: "Samen met mij aandachtig naar het probleem kijkt.", route: "aandacht" },
      { label: "Een concrete eerste stap voor me mogelijk maakt.", route: "hulp" },
    ],
  },
  {
    id: "r17",
    section: "ontvangen",
    question: "Als we iets te vieren hebben, kies ik liever:",
    options: [
      { label: "Een ervaring waarbij we alleen oog voor elkaar hebben.", route: "aandacht" },
      { label: "Een tastbare herinnering aan het moment.", route: "attenties" },
    ],
  },
  {
    id: "r18",
    section: "ontvangen",
    question: "Na een gespannen gesprek voelt herstel sterker door:",
    options: [
      { label: "Voorzichtige aanraking, nadat je vraagt of die welkom is.", route: "aanraking" },
      { label: "Een zichtbare verandering in wat je voortaan doet.", route: "hulp" },
    ],
  },
  {
    id: "r19",
    section: "ontvangen",
    question: "Wanneer ik je mis, helpt mij eerder:",
    options: [
      { label: "Iets van jouw nabijheid, zoals een kledingstuk of omhelzing.", route: "aanraking" },
      { label: "Een klein voorwerp dat naar ons verwijst.", route: "attenties" },
    ],
  },
  {
    id: "r20",
    section: "ontvangen",
    question: "Wanneer ik ziek ben, voelt dit zorgzamer:",
    options: [
      { label: "Je neemt praktische dingen volledig van me over.", route: "hulp" },
      { label: "Je brengt iets kleins dat precies bij mij past.", route: "attenties" },
    ],
  },
  {
    id: "g01",
    section: "geven",
    question: "Wanneer ik liefde spontaan wil tonen, kies ik eerder:",
    options: [
      { label: "Ik vertel wat ik bijzonder aan je vind.", route: "woorden" },
      { label: "Ik plan een moment waarop we echt samen zijn.", route: "aandacht" },
    ],
  },
  {
    id: "g02",
    section: "geven",
    question: "Als jij thuiskomt, laat ik liefde eerder zien door:",
    options: [
      { label: "Iets liefs of grappigs tegen je te zeggen.", route: "woorden" },
      { label: "Een kus, knuffel of hand aan te bieden.", route: "aanraking" },
    ],
  },
  {
    id: "g03",
    section: "geven",
    question: "Wanneer jij gespannen bent, is mijn eerste reflex:",
    options: [
      { label: "Je moed inspreken.", route: "woorden" },
      { label: "Iets regelen zodat jij minder hoeft te dragen.", route: "hulp" },
    ],
  },
  {
    id: "g04",
    section: "geven",
    question: "Als ik onverwacht aan jou denk, doe ik eerder dit:",
    options: [
      { label: "Ik stuur je meteen een persoonlijk bericht.", route: "woorden" },
      { label: "Ik bewaar of koop iets kleins voor je.", route: "attenties" },
    ],
  },
  {
    id: "g05",
    section: "geven",
    question: "Na een periode van afstand zoek ik eerder verbinding door:",
    options: [
      { label: "Bewust tijd vrij te maken en te luisteren.", route: "aandacht" },
      { label: "Lichamelijke nabijheid rustig te herstellen.", route: "aanraking" },
    ],
  },
  {
    id: "g06",
    section: "geven",
    question: "Wanneer jij een probleem deelt, toon ik betrokkenheid eerder door:",
    options: [
      { label: "Door te vragen en erbij te blijven.", route: "aandacht" },
      { label: "Meteen mee te helpen aan een oplossing.", route: "hulp" },
    ],
  },
  {
    id: "g07",
    section: "geven",
    question: "Wanneer jij iets bereikt, vier ik dat liever met:",
    options: [
      { label: "Een ervaring waar we samen van genieten.", route: "aandacht" },
      { label: "Een verrassing die bij jouw prestatie past.", route: "attenties" },
    ],
  },
  {
    id: "g08",
    section: "geven",
    question: "Als jij verdrietig bent, bied ik eerder:",
    options: [
      { label: "Een arm om je heen of hand om vast te houden.", route: "aanraking" },
      { label: "Eten, vervoer of een andere praktische zorg.", route: "hulp" },
    ],
  },
  {
    id: "g09",
    section: "geven",
    question: "Op een gewone dag toon ik liefde eerder met:",
    options: [
      { label: "Even dicht bij je komen zitten.", route: "aanraking" },
      { label: "Een klein ding meenemen waarvan ik weet dat je het fijn vindt.", route: "attenties" },
    ],
  },
  {
    id: "g10",
    section: "geven",
    question: "Wanneer ik iets goed wil maken, doe ik eerder:",
    options: [
      { label: "Ik verander concreet iets in mijn gedrag.", route: "hulp" },
      { label: "Ik maak een persoonlijk gebaar dat het moment markeert.", route: "attenties" },
    ],
  },
];

export const completeLovePrompts: readonly SamenLevenPrompt[] =
  lovePairQuestions.map(({ id, question, options }) => ({
    id,
    question,
    options: options.map((option) => option.label),
  }));

const routeByAnswer = new Map(
  lovePairQuestions.flatMap((question) =>
    question.options.map((option) => [
      `${question.id}:${option.label}`,
      option.route,
    ] as const),
  ),
);

export function scoreCompleteLoveRoutes(selections: Record<string, string>) {
  const scores: Record<LoveRoute, number> = {
    woorden: 0,
    aandacht: 0,
    aanraking: 0,
    hulp: 0,
    attenties: 0,
  };
  for (const [questionId, answer] of Object.entries(selections)) {
    const route = routeByAnswer.get(`${questionId}:${answer}`);
    if (route) scores[route] += 1;
  }
  return (Object.entries(scores) as [LoveRoute, number][])
    .map(([route, score]) => ({ route, score, ...loveRouteInfo[route] }))
    .sort((left, right) => right.score - left.score);
}

export function buildLoveProfile(selections: Record<string, string>) {
  const all = scoreCompleteLoveRoutes(selections);
  const receiving = scoreCompleteLoveRoutes(
    Object.fromEntries(
      Object.entries(selections).filter(([questionId]) =>
        questionId.startsWith("r"),
      ),
    ),
  );
  const giving = scoreCompleteLoveRoutes(
    Object.fromEntries(
      Object.entries(selections).filter(([questionId]) =>
        questionId.startsWith("g"),
      ),
    ),
  );
  return {
    all,
    receiving,
    giving,
    primary: all[0],
    secondary: all[1],
    closePair: Boolean(
      all[0] && all[1] && Math.abs(all[0].score - all[1].score) <= 2,
    ),
  };
}
