export const compassPillars = [
  {
    id: "safety",
    icon: "🛡️",
    title: "Veiligheid",
    description: "Buffer, voorspelbaarheid en weten dat tegenslag opgevangen kan worden.",
  },
  {
    id: "freedom",
    icon: "🕊️",
    title: "Vrijheid",
    description: "Zelf keuzes kunnen maken zonder voor iedere euro toestemming te vragen.",
  },
  {
    id: "enjoyment",
    icon: "☀️",
    title: "Genieten",
    description: "Geld ook gebruiken voor plezier, herinneringen en het leven van nu.",
  },
  {
    id: "responsibility",
    icon: "⚖️",
    title: "Verantwoordelijkheid",
    description: "Rekeningen, afspraken en gevolgen zorgvuldig dragen.",
  },
  {
    id: "sharing",
    icon: "🤲",
    title: "Delen",
    description: "Met geld anderen helpen, geven en gastvrij kunnen zijn.",
  },
] as const;

export type CompassPillarId = (typeof compassPillars)[number]["id"];

export const reflectionPrompts = [
  {
    id: "safe",
    question: "Geld geeft mij vooral rust wanneer…",
    options: [
      "er een ruime buffer staat",
      "alle vaste lasten overzichtelijk zijn",
      "ik zelf vrij kan beslissen",
      "we open zijn over alles",
      "we ook ruimte houden om te leven",
    ],
  },
  {
    id: "restricted",
    question: "Ik voel me financieel het snelst beperkt wanneer…",
    options: [
      "iedere kleine uitgave besproken moet worden",
      "er geen plan of overzicht is",
      "sparen altijd voor genieten gaat",
      "de ander meer beslissingsmacht heeft",
      "ik bang ben voor onverwachte kosten",
    ],
  },
  {
    id: "regret",
    question: "Ik krijg sneller spijt van…",
    options: [
      "te veel uitgeven",
      "een mooie kans niet pakken",
      "te weinig voor mezelf houden",
      "niet gul genoeg zijn",
      "een besluit nemen zonder overleg",
    ],
  },
  {
    id: "conflict",
    question: "Bij geldspanning doe ik eerder dit:",
    options: [
      "ik wil direct cijfers en een plan",
      "ik vermijd het gesprek",
      "ik verdedig mijn vrijheid",
      "ik geef snel toe om rust te houden",
      "ik probeer de emotie achter het bedrag te begrijpen",
    ],
  },
  {
    id: "upbringing",
    question: "Wat heb je thuis het sterkst over geld geleerd?",
    options: [
      "geld is schaars, dus wees altijd voorzichtig",
      "hard werken geeft recht op comfort",
      "over geld praat je liever niet",
      "delen met anderen hoort er vanzelfsprekend bij",
      "goed overzicht voorkomt veel spanning",
      "ik moest mijn eigen weg hierin zoeken",
    ],
  },
] as const;

export const moneyScenarios = [
  {
    id: "washing-machine",
    title: "De wasmachine begeeft het",
    situation:
      "Er is deze maand weinig ruimte. Repareren is goedkoper, vervangen geeft waarschijnlijk langer rust.",
    choices: [
      "Nu repareren en later opnieuw kijken",
      "Een degelijk nieuw model kopen",
      "Tijdelijk een goedkope tussenoplossing",
      "Eerst alle opties en garanties uitzoeken",
    ],
  },
  {
    id: "income-drop",
    title: "Tijdelijk minder inkomen",
    situation:
      "Eén van jullie gaat zes maanden minder verdienen door studie, zorg of herstel.",
    choices: [
      "Uitgaven samen sterk terugbrengen",
      "De buffer bewust gebruiken",
      "De inkomensverdeling tijdelijk anders dragen",
      "Het plan pas maken als het echt nodig is",
    ],
  },
  {
    id: "family-loan",
    title: "Familie vraagt om hulp",
    situation:
      "Een familielid vraagt een bedrag dat jullie kunnen missen, maar niet zonder gevolgen.",
    choices: [
      "Geven zonder terugbetaling",
      "Lenen met duidelijke afspraken",
      "Een kleiner bedrag aanbieden",
      "Niet financieel helpen, wel praktisch",
    ],
  },
  {
    id: "holiday-buffer",
    title: "Reis of buffer",
    situation:
      "Er is genoeg voor een bijzondere reis óf om jullie noodbuffer stevig aan te vullen.",
    choices: [
      "De reis nu maken",
      "Alles naar de buffer",
      "Een kleinere reis en de rest sparen",
      "Nog een paar maanden wachten",
    ],
  },
  {
    id: "hidden-debt",
    title: "Een oude schuld komt boven",
    situation:
      "Eén van jullie vertelt over een betalingsachterstand die uit schaamte lang niet genoemd is.",
    choices: [
      "Eerst luisteren, daarna samen overzicht maken",
      "Direct volledige openheid en bewijs vragen",
      "Ieder blijft verantwoordelijk voor eigen verleden",
      "Samen aflossen, maar met nieuwe grenzen",
    ],
  },
  {
    id: "unexpected-money",
    title: "Onverwacht €2.000",
    situation:
      "Jullie ontvangen onverwacht geld. Er zijn geen acute problemen.",
    choices: [
      "Alles sparen",
      "Een deel vieren en een deel sparen",
      "Iets kopen dat al lang gewenst is",
      "Een deel weggeven",
    ],
  },
  {
    id: "career-risk",
    title: "Een kans met minder zekerheid",
    situation:
      "Een betekenisvolle baan of onderneming geeft tijdelijk minder inkomen en meer risico.",
    choices: [
      "Alleen doen met een stevige buffer",
      "De kans pakken en samen aanpassen",
      "Eerst een proefperiode zoeken",
      "Niet doen zolang de uitkomst onzeker is",
    ],
  },
  {
    id: "income-gap",
    title: "Groot inkomensverschil",
    situation:
      "Eén verdient duidelijk meer. De vraag ontstaat hoeveel invloed en vrije bestedingsruimte ieder heeft.",
    choices: [
      "Inleg naar inkomen, beslissingen gelijk",
      "Alles volledig gezamenlijk",
      "Gedeeld deel plus ieder een eigen bedrag",
      "Ieder draagt dezelfde helft",
    ],
  },
  {
    id: "generosity",
    title: "Geven dat echt iets kost",
    situation:
      "Een doel raakt één van jullie diep. Een betekenisvolle gift vertraagt een gezamenlijk spaardoel.",
    choices: [
      "Nu gul geven",
      "Een kleiner vast bedrag geven",
      "Eerst samen criteria afspreken",
      "Geen gezamenlijke doelen vertragen",
    ],
  },
  {
    id: "expensive-quality",
    title: "Duurzaam of goedkoop",
    situation:
      "Een duur product gaat waarschijnlijk langer mee, maar het goedkope alternatief voldoet nu ook.",
    choices: [
      "Kwaliteit kopen",
      "Goedkoop kiezen",
      "Tweedehands zoeken",
      "De aankoop uitstellen",
    ],
  },
  {
    id: "privacy",
    title: "Een aankoop zonder overleg",
    situation:
      "De ander koopt iets van eigen geld. Het bedrag is niet gevaarlijk, maar voelt voor jou toch groot.",
    choices: [
      "Eigen geld betekent eigen keuze",
      "Boven een grens altijd overleggen",
      "Alleen vertellen, geen toestemming vragen",
      "Eerst bespreken waarom het raakt",
    ],
  },
  {
    id: "care-parent",
    title: "Structureel ondersteunen",
    situation:
      "Een ouder heeft waarschijnlijk langere tijd financiële hulp nodig.",
    choices: [
      "Een vast gezamenlijk bedrag",
      "Alleen de eigen familie financieel dragen",
      "Eerst andere hulpbronnen onderzoeken",
      "Per maand opnieuw beslissen",
    ],
  },
] as const;

export const scenarioNeeds = [
  "veiligheid",
  "vrijheid",
  "eerlijkheid",
  "rechtvaardigheid",
  "rust",
  "loyaliteit",
  "gulheid",
] as const;

export const scenarioFears = [
  "controle verliezen",
  "tekortkomen",
  "oneerlijk behandeld worden",
  "de ander teleurstellen",
  "vastzitten",
  "misbruik van vertrouwen",
] as const;

export const moneyScales = [
  {
    id: "openness",
    left: "Veel persoonlijke privacy",
    right: "Volledige openheid",
  },
  {
    id: "together",
    left: "Veel eigen financiële ruimte",
    right: "Zo veel mogelijk gezamenlijk",
  },
  {
    id: "time",
    left: "Eerst zekerheid opbouwen",
    right: "Ook nu bewust genieten",
  },
  {
    id: "risk",
    left: "Risico zo veel mogelijk vermijden",
    right: "Kansen durven nemen",
  },
  {
    id: "giving",
    left: "Geven vooraf plannen",
    right: "Spontaan kunnen geven",
  },
] as const;

export const commitmentOptions = [
  "Eén keer per maand praten we rustig over geld, zonder telefoons.",
  "We spreken een bedrag af waarboven we eerst samen overleggen.",
  "We geven elkaar allebei een vrij persoonlijk bedrag zonder verantwoording.",
  "We bepalen samen één eerste doel voor onze noodbuffer.",
  "We kiezen een vast bedrag of percentage om te delen of weg te geven.",
  "We bespreken één financiële zorg die tot nu toe moeilijk uit te spreken was.",
  "We nemen geen groot financieel besluit midden in een ruzie.",
  "Bij spanning vragen we eerst: wil je overleg, geruststelling of een oplossing?",
] as const;

export const christianQuestions = [
  "Waar zoek jij sneller zekerheid: bij God, inkomen, bezit, controle of een buffer?",
  "Wanneer wordt voorzichtigheid bij jou angst?",
  "Wanneer wordt vrijgevigheid onverantwoordelijk of bedoeld om jezelf te bewijzen?",
  "Hoe voorkom je dat degene met het hoogste inkomen ook de meeste macht krijgt?",
  "Wat betekent rentmeesterschap voor jullie dagelijks, niet alleen in theorie?",
  "Hoe kijken jullie naar geven, delen, tienden en gastvrijheid?",
  "Welke geldkeuze zou vertrouwen in God zichtbaar maken zonder roekeloos te worden?",
] as const;
