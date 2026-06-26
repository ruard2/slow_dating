export type DramaRole = "slachtoffer" | "redder" | "aanklager";
export type SceneId =
  | "partner-trekt-zich-terug"
  | "kritiek-op-plan"
  | "afspraak-vergeten"
  | "vriend-klaagt"
  | "moeder-teleurgesteld"
  | "familie-mengt-zich"
  | "collega-laat"
  | "leiding-vraagt-extra"
  | "appgroep-druk"
  | "geen-reactie"
  | "vrienden-ruzie"
  | "grens-blijft-vragen";
export type FeelingId =
  | "niet-gezien"
  | "verantwoordelijk"
  | "schuldig"
  | "machteloos"
  | "boos"
  | "gebruikt"
  | "afwijzing"
  | "druk"
  | "schaamte"
  | "oneerlijk";
export type PullId =
  | "oplossen"
  | "terugtrekken"
  | "klagen"
  | "aanvallen"
  | "sussen"
  | "overnemen"
  | "uitleggen"
  | "gelijk"
  | "wegcijferen";
export type GainId =
  | "niet-kiezen"
  | "zorg-krijgen"
  | "nodig-zijn"
  | "controle"
  | "moreel-helder"
  | "kwetsbaar-niet-voelen"
  | "schuldgevoel-kwijt"
  | "geen-grens";
export type CostId =
  | "kracht-verlies"
  | "afhankelijk"
  | "moe"
  | "ander-kleiner"
  | "verbinding-verlies"
  | "harder"
  | "later-verwijtend"
  | "passief";
export type ShiftId =
  | "redder-aanklager"
  | "redder-slachtoffer"
  | "slachtoffer-aanklager"
  | "slachtoffer-redder"
  | "aanklager-slachtoffer"
  | "aanklager-redder";

export const roles: Record<
  DramaRole,
  {
    title: string;
    line: string;
    description: string;
    adultMove: string;
    christianDistortion: string;
  }
> = {
  slachtoffer: {
    title: "Slachtoffer",
    line: "Ik kan hier niets aan doen.",
    description:
      "Niet: iemand die echt slachtoffer is. Wel: de plek waar je machteloos wordt en je keuze weggeeft.",
    adultMove: "Eerlijk kwetsbaar: ik vind dit moeilijk, en dit is mijn volgende kleine stap.",
    christianDistortion: "Ik ontken mijn roeping en verantwoordelijkheid.",
  },
  redder: {
    title: "Redder",
    line: "Ik moet dit oplossen.",
    description:
      "Niet: iemand die goed helpt. Wel: helpen zonder goede grens, zonder vraag, of om eigen spanning te dempen.",
    adultMove: "Steunende helper: ik ben bij je, maar ik neem het niet van je over.",
    christianDistortion: "Ik neem een plek in die niet van mij is.",
  },
  aanklager: {
    title: "Aanklager",
    line: "Jij bent het probleem.",
    description:
      "Niet: terecht begrenzen. Wel: spanning oplossen door schuld buiten jezelf te leggen.",
    adultMove: "Duidelijke begrenzer: dit raakt mij, en dit is mijn grens of verzoek.",
    christianDistortion: "Ik ga op de rechterstoel zitten.",
  },
};

export const scenes: Record<SceneId, { title: string; text: string; category: string }> = {
  "partner-trekt-zich-terug": {
    title: "Je partner trekt zich terug",
    category: "Relatie",
    text: "Je probeert iets belangrijks te bespreken, maar je partner wordt stil, kortaf of gaat iets anders doen. Jij voelt de spanning oplopen.",
  },
  "kritiek-op-plan": {
    title: "Kritiek op jouw plan",
    category: "Relatie",
    text: "Jij stelt iets voor voor jullie avond of toekomst. De ander ziet vooral bezwaren. Het voelt alsof jouw initiatief wordt afgekeurd.",
  },
  "afspraak-vergeten": {
    title: "Een afspraak wordt vergeten",
    category: "Relatie",
    text: "Jullie hadden iets afgesproken. De ander is het vergeten of doet alsof het niet zo duidelijk was. Jij moet kiezen: slikken, redden of aanvallen.",
  },
  "vriend-klaagt": {
    title: "De klagende vriend",
    category: "Familie & vrienden",
    text: "Een vriend appt voor de vijfde keer over hetzelfde probleem. Jij hebt al vaak advies gegeven. Hij doet er niets mee, maar komt wel terug.",
  },
  "moeder-teleurgesteld": {
    title: "Je moeder is teleurgesteld",
    category: "Familie & vrienden",
    text: "Je moeder zegt: ‘Je hebt ook nooit tijd voor ons.’ Jij had net een drukke week.",
  },
  "familie-mengt-zich": {
    title: "Familie mengt zich ermee",
    category: "Familie & vrienden",
    text: "Iemand uit de familie heeft een duidelijke mening over jullie keuzes. Jij voelt dat je moet verdedigen, sussen of partij kiezen.",
  },
  "collega-laat": {
    title: "Collega levert niets aan",
    category: "Werk & druk",
    text: "Je collega komt zijn afspraak niet na, waardoor jij extra werk krijgt.",
  },
  "leiding-vraagt-extra": {
    title: "Er wordt weer iets extra’s gevraagd",
    category: "Werk & druk",
    text: "Je leidinggevende, studieproject of vrijwilligersteam vraagt op het laatste moment extra inzet. Eigenlijk zit je al vol.",
  },
  "appgroep-druk": {
    title: "De groep verwacht reactie",
    category: "Werk & druk",
    text: "In een groep loopt de toon op. Iedereen kijkt naar jou omdat jij vaak degene bent die nuance brengt of de boel redt.",
  },
  "geen-reactie": {
    title: "Iemand reageert niet",
    category: "Appcontact & grenzen",
    text: "Je stuurt een kwetsbaar bericht. De ander leest het, maar reageert uren niet.",
  },
  "vrienden-ruzie": {
    title: "Twee vrienden hebben ruzie",
    category: "Appcontact & grenzen",
    text: "Beide vrienden vertellen jou hun kant. Allebei verwachten ze steun.",
  },
  "grens-blijft-vragen": {
    title: "Je twijfelende ‘misschien’",
    category: "Appcontact & grenzen",
    text: "Iemand blijft iets vragen nadat jij al twijfelend ‘misschien’ zei.",
  },
};

export const sceneCategories = [
  "Relatie",
  "Familie & vrienden",
  "Werk & druk",
  "Appcontact & grenzen",
] as const;

export const feelings: Record<FeelingId, string> = {
  "niet-gezien": "ik voel mij niet gezien",
  verantwoordelijk: "ik voel mij verantwoordelijk",
  schuldig: "ik voel mij schuldig",
  machteloos: "ik voel mij machteloos",
  boos: "ik voel mij boos",
  gebruikt: "ik voel mij gebruikt",
  afwijzing: "ik ben bang voor afwijzing",
  druk: "ik voel druk",
  schaamte: "ik voel schaamte",
  oneerlijk: "ik voel dat het oneerlijk is",
};

export const pulls: Record<PullId, string> = {
  oplossen: "oplossen",
  terugtrekken: "terugtrekken",
  klagen: "klagen",
  aanvallen: "aanvallen",
  sussen: "sussen",
  overnemen: "overnemen",
  uitleggen: "uitleggen",
  gelijk: "bewijzen dat ik gelijk heb",
  wegcijferen: "mezelf wegcijferen",
};

export const gains: Record<GainId, string> = {
  "niet-kiezen": "ik hoef nog niet te kiezen",
  "zorg-krijgen": "ik krijg zorg of aandacht",
  "nodig-zijn": "ik voel mij nodig",
  controle: "ik houd controle",
  "moreel-helder": "ik voel mij moreel helder",
  "kwetsbaar-niet-voelen": "ik hoef mijn kwetsbaarheid niet te voelen",
  "schuldgevoel-kwijt": "ik demp mijn schuldgevoel",
  "geen-grens": "ik hoef mijn grens niet eerlijk te zeggen",
};

export const costs: Record<CostId, string> = {
  "kracht-verlies": "ik verlies kracht",
  afhankelijk: "ik word afhankelijk",
  moe: "ik raak moe",
  "ander-kleiner": "ik maak de ander kleiner",
  "verbinding-verlies": "ik verlies verbinding",
  harder: "ik word harder dan ik wil",
  "later-verwijtend": "ik word later verwijtend",
  passief: "ik word passief",
};

export const roleSentences: Record<DramaRole, string[]> = {
  slachtoffer: [
    "Laat maar, het maakt toch niet uit.",
    "Ik doe het ook nooit goed.",
    "Niemand ziet hoe zwaar dit is.",
    "Ik heb geen keuze.",
  ],
  redder: [
    "Ik regel het wel.",
    "Ik moet zorgen dat iedereen oké is.",
    "Ik help wel, ook al heb ik geen ruimte.",
    "Ik weet wat jij moet doen.",
  ],
  aanklager: [
    "Dit is jouw schuld.",
    "Jij doet ook altijd...",
    "Als jij normaal deed, hadden we dit niet.",
    "Ik moet jou eens duidelijk zeggen hoe het zit.",
  ],
};

export const shifts: Record<ShiftId, string> = {
  "redder-aanklager": "Eerst red ik, daarna verwijt ik, en uiteindelijk voel ik mij gebruikt.",
  "redder-slachtoffer": "Eerst red ik, daarna voel ik mij miskend, en uiteindelijk denk ik: ik probeer alleen maar te helpen.",
  "slachtoffer-aanklager": "Eerst klaag ik, daarna val ik aan, en uiteindelijk voel ik mij alleen.",
  "slachtoffer-redder": "Eerst voel ik mij klein, daarna los ik het zelf maar weer op.",
  "aanklager-slachtoffer": "Eerst beschuldig ik, daarna voel ik mij onbegrepen.",
  "aanklager-redder": "Eerst val ik aan, daarna probeer ik de schade te repareren.",
};

export const invitedRoles: Record<DramaRole, string> = {
  slachtoffer: "Je nodigt de ander vaak uit om te redden, aan te klagen of mee machteloos te worden.",
  redder: "Je nodigt de ander vaak uit om kleiner te worden, afhankelijk te blijven of later boos te worden.",
  aanklager: "Je nodigt de ander vaak uit om te verdedigen, terug te vechten of slachtoffer te worden.",
};

export const christianPrompts = [
  "Waar maak ik mij kleiner dan God mij roept?",
  "Waar wil ik redder zijn in plaats van naaste?",
  "Waar wordt waarheid bij mij een wapen?",
  "Waar zie ik de splinter scherper dan mijn eigen balk?",
  "Waar mag ik eerlijk, verantwoordelijk en genadig aanwezig zijn?",
];
