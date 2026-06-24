import { extraIrritatieBingoThemes } from "./bingoThemes";
import { completeLovePrompts } from "./liefdestaalQuestionnaire";

export type SamenLevenGameId =
  | "geldbrug"
  | "winkelmandje"
  | "liefdestaal"
  | "stressmeter"
  | "irritatiebingo"
  | "kleine-date";

export interface SamenLevenPrompt {
  id: string;
  question: string;
  options: readonly string[];
}

export interface SamenLevenContent {
  id: SamenLevenGameId;
  kicker: string;
  title: string;
  description: string;
  prompts: readonly SamenLevenPrompt[];
  discussionQuestions: readonly string[];
  christianIntro: string;
  christianPrompts: readonly string[];
  christianOutcome: string;
  takeaway: string;
  themes?: readonly SamenLevenTheme[];
}

export interface SamenLevenTheme {
  id: string;
  icon: string;
  title: string;
  description: string;
  prompts: readonly SamenLevenPrompt[];
  discussionQuestions: readonly string[];
  christianIntro: string;
  christianPrompts: readonly string[];
  christianOutcome: string;
}

export const samenLevenContent: Record<SamenLevenGameId, SamenLevenContent> = {
  geldbrug: {
    id: "geldbrug",
    kicker: "De Geldbrug",
    title: "Waar draagt geld jullie naartoe?",
    description:
      "Vergelijk wat geld voor jullie betekent: rust, vrijheid, plezier, zekerheid of verantwoordelijkheid.",
    prompts: [
      {
        id: "security",
        question: "Wanneer voelt geld voor jou vooral veilig?",
        options: ["Als er ruim spaargeld is", "Als alles overzichtelijk is", "Als ik vrij kan kiezen", "Als we kunnen delen"],
      },
      {
        id: "spending",
        question: "Welke uitgave voelt het snelst goed?",
        options: ["Iets praktisch", "Een ervaring samen", "Iets moois voor mezelf", "Iets voor een ander"],
      },
      {
        id: "tension",
        question: "Waar ontstaat bij jou het snelst spanning?",
        options: ["Onverwachte kosten", "Verschil in zuinigheid", "Geen gezamenlijke afspraken", "Controle of verantwoording"],
      },
    ],
    discussionQuestions: [
      "Welke geldkeuze zou voor jou vertrouwen laten zien?",
      "Waar hebben jullie een gezamenlijke afspraak nodig en waar juist vrijheid?",
      "Welke financiële gewoonte uit je jeugd neem je nog mee?",
    ],
    christianIntro:
      "Geld raakt vertrouwen, rentmeesterschap, vrijgevigheid en de vraag waar je zekerheid zoekt.",
    christianPrompts: [
      "Waar zoek jij sneller zekerheid: in God, controle, spaargeld, inkomen of bezit?",
      "Wanneer wordt zuinigheid angst, en wanneer wordt gulheid onverantwoordelijkheid?",
      "Wat betekent rentmeesterschap voor jou concreet?",
      "Hoe kijk jij naar geven, delen, tienden of vrijgevigheid?",
      "Welke geldkeuze onthult iets over wat je werkelijk vertrouwt?",
    ],
    christianOutcome:
      "Jullie zien beter of financiële keuzes gedragen worden door angst, status, vrijheid, verantwoordelijkheid of vertrouwen.",
    takeaway: "Geldafspraken werken pas wanneer ook de betekenis achter het bedrag besproken wordt.",
  },
  winkelmandje: {
    id: "winkelmandje",
    kicker: "Het Winkelmandje",
    title: "Wat probeer je werkelijk te kopen?",
    description:
      "Kijk achter een aankoop: behoefte, gemak, plezier, vergelijking, troost of impuls.",
    prompts: [
      {
        id: "trigger",
        question: "Wanneer belandt er bij jou sneller iets in het mandje?",
        options: ["Na een drukke dag", "Bij korting of schaarste", "Als anderen het hebben", "Na lang vergelijken"],
      },
      {
        id: "need",
        question: "Wat moet een aankoop je meestal geven?",
        options: ["Gemak", "Plezier", "Een frisse start", "Erbij horen"],
      },
      {
        id: "pause",
        question: "Welke pauzeknop helpt jou het meest?",
        options: ["24 uur wachten", "Overleggen", "Een budget", "De echte behoefte opschrijven"],
      },
    ],
    discussionQuestions: [
      "Welke aankoop bleek achteraf vooral een gevoel te moeten oplossen?",
      "Waar willen jullie onbekommerd van genieten?",
      "Welke gezamenlijke regel zou vrijheid geven zonder betutteling?",
    ],
    christianIntro:
      "Kopen kan iets goeds vieren, maar ook onrust, vergelijking of leegte proberen te verdoven.",
    christianPrompts: [
      "Koop jij soms om onrust, leegte, stress of vergelijking te dempen?",
      "Wanneer wordt genieten dankbaarheid, en wanneer wordt het vluchtgedrag?",
      "Wat betekent eenvoud voor jou zonder krampachtig te worden?",
      "Welke online verleiding kent jouw zwakke plek?",
      "Hoe zouden jullie samen kunnen oefenen in tevredenheid?",
    ],
    christianOutcome:
      "Jullie leren niet alleen budgetteren, maar ook verlangens onderscheiden.",
    takeaway: "Een goed mandje begint niet bij de prijs, maar bij weten wat je werkelijk nodig hebt.",
  },
  liefdestaal: {
    id: "liefdestaal",
    kicker: "Liefdestaal of misverstand",
    title: "Wanneer voel jij: ik word gezien?",
    description:
      "Ontdek welke twee manieren van liefde nu het duidelijkst bij jou binnenkomen en welke jij zelf het makkelijkst geeft.",
    prompts: completeLovePrompts,
    discussionQuestions: [
      "Welke liefde van de ander heb je pas later leren herkennen?",
      "Wat wil je graag ontvangen zonder dat het een eis wordt?",
      "Welke kleine vertaling kunnen jullie deze week oefenen?",
    ],
    christianIntro:
      "Liefde verdiept wanneer geliefd zijn niet verdiend hoeft te worden en geven geen transactie wordt.",
    christianPrompts: [
      "Vraag jij liefde vooral als bevestiging dat je genoeg bent?",
      "Welke liefdestaal gebruik jij om erkenning terug te krijgen?",
      "Hoe verandert genade jouw manier van liefhebben?",
      "Waarin vind jij liefde ontvangen moeilijker dan liefde geven?",
      "Hoe leren jullie elkaars taal zonder slaaf te worden van verwachtingen?",
    ],
    christianOutcome:
      "Liefde wordt een oefening in ontvangen, geven en vrij worden, niet in punten bijhouden.",
    takeaway: "Liefde wordt hoorbaar wanneer je leert vertalen zonder de ander te laten raden.",
  },
  stressmeter: {
    id: "stressmeter",
    kicker: "De Stressmeter",
    title: "Wat gebeurt er als het vol wordt?",
    description:
      "Breng jullie eerste stressreacties en de hulp die werkelijk helpt naast elkaar.",
    prompts: [
      {
        id: "reaction",
        question: "Wat doe jij meestal als de druk oploopt?",
        options: ["Harder werken", "Controleren", "Terugtrekken", "Praten", "Afleiding zoeken"],
      },
      {
        id: "signal",
        question: "Waaraan kan de ander stress bij jou herkennen?",
        options: ["Korter reageren", "Stil worden", "Onrustig regelen", "Slecht slapen", "Alles relativeren"],
      },
      {
        id: "help",
        question: "Wat helpt dan het meest?",
        options: ["Praktische hulp", "Even ruimte", "Een luisterend oor", "Samen vertragen", "Een helder plan"],
      },
    ],
    discussionQuestions: [
      "Welke hulp bedoel je goed maar voelt voor de ander juist als druk?",
      "Wat is jullie vroegste waarschuwingssignaal?",
      "Welke grens willen jullie bewaken voordat de meter rood staat?",
    ],
    christianIntro:
      "Stress kan onthullen waarop je bouwt en nodigt uit tot rust, vertrouwen, sabbat, gebed en kwetsbaarheid.",
    christianPrompts: [
      "Wat gebeurt er geestelijk met jou als je overbelast raakt?",
      "Ga jij onder stress controleren, harder werken, vluchten, verdoven of bidden?",
      "Wat betekent rust voor jou: herstel, gehoorzaamheid, vertrouwen of luxe?",
      "Welke Bijbelse waarheid vergeet jij als je vol zit?",
      "Hoe kan de ander helpen zonder jouw redder te moeten zijn?",
    ],
    christianOutcome:
      "Stress wordt een venster op vertrouwen, grenzen en geestelijke draagkracht.",
    takeaway: "Goede steun begint vóór het breekpunt en sluit aan bij wat de ander werkelijk nodig heeft.",
  },
  irritatiebingo: {
    id: "irritatiebingo",
    kicker: "Kleine-irritatiebingo",
    title: "Kunnen jullie erom lachen én eerlijk blijven?",
    description:
      "Kies een ronde met herkenbare casussen. Ontdek met humor welke behoefte, grens of verwachting onder een kleine ergernis zit.",
    prompts: [],
    discussionQuestions: [],
    themes: [
      {
        id: "huis-en-taken",
        icon: "📋",
        title: "Huis & halve klusjes",
        description:
          "Rommel, opruimen, zoeken, wachten en dingen die nét niet af zijn.",
        prompts: [
          {
            id: "house-trigger",
            question: "Welke kleine huiskwestie drukt het snelst op jouw knop?",
            options: [
              "Natte handdoek op bed",
              "Kastjes of laden open",
              "Lege verpakking terugzetten",
              "Spullen op de trap",
              "Afwas naast de vaatwasser",
              "Een klus voor 90% afmaken",
              "Ik herken mezelf nergens in",
            ],
          },
          {
            id: "house-case",
            question:
              "Je vindt voor de derde keer spullen van de ander op een onlogische plek. Wat is je eerste impuls?",
            options: [
              "Zelf opruimen en zuchten",
              "Direct benoemen",
              "Er een grap van maken",
              "Alles op één hoop leggen",
              "Wachten tot een rustig moment",
              "Ik merk het nauwelijks",
            ],
          },
          {
            id: "house-meaning",
            question: "Welke betekenis krijgt zoiets bij jou het snelst?",
            options: [
              "Mijn tijd telt minder",
              "Ik sta er alleen voor",
              "Er is geen overzicht",
              "De ander ziet het gewoon niet",
              "Thuis mag losser zijn",
              "Het betekent eigenlijk weinig",
            ],
          },
          {
            id: "house-request",
            question: "Welke reactie zou jou het meest helpen?",
            options: [
              "Erkenning zonder verdediging",
              "Een concrete afspraak",
              "Samen meteen oplossen",
              "Een beetje humor",
              "Zelf leren loslaten",
              "Vrijheid voor eigen zones",
            ],
          },
        ],
        discussionQuestions: [
          "Welke halve klus voelt voor jou groter dan hij eruitziet?",
          "Wat is een redelijke standaard en wat is persoonlijke voorkeur?",
          "Welke huishoudelijke irritatie kunnen jullie vandaag praktisch oplossen?",
          "Waar zou waardering meer helpen dan een nieuwe regel?",
        ],
        christianIntro:
          "Gewone klusjes kunnen een oefenplaats zijn voor verborgen dienstbaarheid, rechtvaardigheid en dankbaarheid.",
        christianPrompts: [
          "Wanneer dien jij vrij en wanneer hoop je stiekem verdiensten op te bouwen?",
          "Welke onzichtbare taak verdient meer waardering?",
          "Hoe voorkomt genade dat een fout meteen een karakteroordeel wordt?",
          "Wat betekent Christus volgen in een klus die niemand ziet?",
        ],
        christianOutcome:
          "Jullie verbinden taakverdeling met nederigheid, erkenning en wederzijdse zorg.",
      },
      {
        id: "tijd-en-aandacht",
        icon: "🕰️",
        title: "Tijd & aandacht",
        description:
          "Te laat, nog één berichtje, plannen wijzigen en half luisteren.",
        prompts: [
          {
            id: "time-trigger",
            question: "Wat voelt voor jou het snelst als gebrek aan aandacht?",
            options: [
              "Op de telefoon kijken",
              "Te laat komen",
              "Een plan last-minute wijzigen",
              "Niet onthouden wat ik vertelde",
              "Door me heen praten",
              "Tijdens gesprek iets anders doen",
              "Geen van deze",
            ],
          },
          {
            id: "time-case",
            question:
              "Jullie zouden om acht uur vertrekken. Om acht uur begint de ander nog iets ‘kleins’. Wat doe jij?",
            options: [
              "Ik word meteen kortaf",
              "Ik vraag om een nieuwe echte tijd",
              "Ik help om sneller klaar te zijn",
              "Ik wacht maar voel irritatie",
              "Ik maak er een grap van",
              "Vijf minuten boeit me niet",
            ],
          },
          {
            id: "time-meaning",
            question: "Wat raakt vertraging of afleiding bij jou?",
            options: [
              "Ik voel me niet belangrijk",
              "Ik verlies grip op mijn planning",
              "Ik moet weer aanpassen",
              "Ik schaam me naar anderen",
              "Ik mis echte aanwezigheid",
              "Voor mij is tijd juist flexibel",
            ],
          },
          {
            id: "time-repair",
            question: "Welke reparatie voelt oprecht?",
            options: [
              "Telefoon zichtbaar wegleggen",
              "Excuses en opnieuw afspreken",
              "Een duidelijke vertrektijd",
              "Tien minuten volle aandacht",
              "Mij laten uitpraten",
              "Niet te zwaar maken",
            ],
          },
        ],
        discussionQuestions: [
          "Wanneer betekent ‘op tijd’ voor jullie werkelijk hetzelfde?",
          "Welke vorm van telefoongebruik voelt prima en welke niet?",
          "Hoe laat je merken dat een gesprek nu echt aandacht heeft?",
          "Welke afspraak voorkomt dat flexibiliteit als onverschilligheid voelt?",
        ],
        christianIntro:
          "Aandacht is een vorm van liefde: aanwezig zijn, betrouwbaar omgaan met tijd en de ander niet als onderbreking behandelen.",
        christianPrompts: [
          "Waar nodigt liefde jou uit om werkelijk aanwezig te zijn?",
          "Wanneer wordt jouw planning een vorm van controle?",
          "Hoe helpt geduld zonder onbetrouwbaarheid goed te praten?",
          "Welke afspraak zou trouw in het kleine zichtbaar maken?",
        ],
        christianOutcome:
          "Tijd wordt niet alleen planning, maar ook een oefening in trouw, geduld en aanwezigheid.",
      },
      {
        id: "gewoontes-en-prikkels",
        icon: "☕",
        title: "Gewoontes & prikkels",
        description:
          "Geluiden, temperatuur, slapen, eten en kleine lichamelijke gewoontes.",
        prompts: [
          {
            id: "sense-trigger",
            question: "Welke prikkel is voor jou het lastigst te negeren?",
            options: [
              "Eet- of drinkgeluiden",
              "Muziek of tv op de achtergrond",
              "Fel licht",
              "Sterke geuren",
              "Te warm of te koud",
              "Veel bewegen of tikken",
              "Ik kan veel verdragen",
            ],
          },
          {
            id: "sense-case",
            question:
              "De ander maakt een terugkerend geluid dat jou steeds meer opvalt. Wat gebeurt er?",
            options: [
              "Ik fixeer me erop",
              "Ik vraag het meteen vriendelijk",
              "Ik houd het lang in",
              "Ik loop even weg",
              "Ik zet zelf geluid aan",
              "Ik probeer eraan te wennen",
            ],
          },
          {
            id: "habit-clash",
            question: "Waar verschillen dagelijkse ritmes het meest?",
            options: [
              "Slapen en opstaan",
              "Eten en snacken",
              "Rust versus geluid",
              "Douche en badkamer",
              "Deuren, ramen en temperatuur",
              "Tempo in de ochtend",
              "We lijken hierin op elkaar",
            ],
          },
          {
            id: "sense-boundary",
            question: "Wat maakt een verzoek hierover respectvol?",
            options: [
              "Over mijn prikkel spreken",
              "Niet doen alsof de ander fout is",
              "Een praktisch alternatief bieden",
              "Een eigen rustige plek hebben",
              "Ook zelf leren verdragen",
              "Samen experimenteren",
            ],
          },
        ],
        discussionQuestions: [
          "Welke prikkel is klein voor de één maar lichamelijk groot voor de ander?",
          "Waar is aanpassen liefdevol en waar wordt het te beperkend?",
          "Welke eigen plek of routine kan rust geven?",
          "Hoe vraag je iets zonder de ander als irritant persoon neer te zetten?",
        ],
        christianIntro:
          "Lichamelijke prikkels vragen om mildheid met grenzen: de ander liefhebben zonder je eigen draagkracht te ontkennen.",
        christianPrompts: [
          "Hoe kun je waarheid spreken zonder minachting?",
          "Waar heb jij zelfbeheersing nodig en waar een eerlijke grens?",
          "Wat betekent zachtmoedigheid wanneer je lichaam al overprikkeld is?",
          "Hoe kunnen jullie elkaars kwetsbaarheid dragen?",
        ],
        christianOutcome:
          "Jullie oefenen zachtmoedigheid die zowel de ander als de eigen grens serieus neemt.",
      },
      {
        id: "sociaal-en-onderweg",
        icon: "🚗",
        title: "Sociaal & onderweg",
        description:
          "Bezoek, familie, autoritten, groepsapps en samen naar buiten treden.",
        prompts: [
          {
            id: "social-trigger",
            question: "Welke sociale situatie schuurt het snelst?",
            options: [
              "Te lang blijven op bezoek",
              "Plannen zonder overleg",
              "Privédingen delen",
              "Niet helpen in een groep",
              "Veel groepsappmeldingen",
              "Anders rijden of navigeren",
              "Geen van deze",
            ],
          },
          {
            id: "social-case",
            question:
              "Op een verjaardag wil jij naar huis, maar de ander begint net een nieuw gesprek. Wat doe je?",
            options: [
              "Een afgesproken signaal geven",
              "Hardop zeggen dat ik weg wil",
              "Nog één ronde toestaan",
              "Stil geïrriteerd wachten",
              "Zelf alvast afscheid nemen",
              "Ik vind langer blijven prima",
            ],
          },
          {
            id: "loyalty",
            question: "Wat moet de ander in gezelschap vooral bewaken?",
            options: [
              "Onze onderlinge afspraken",
              "Mijn privacy",
              "Niet ten koste van mij grappen",
              "Samen verantwoordelijkheid nemen",
              "Ruimte om verschillend te zijn",
              "Dat we niet aan elkaar vastzitten",
            ],
          },
          {
            id: "social-repair",
            question: "Wat helpt na een sociaal misverstand?",
            options: [
              "Thuis rustig nabespreken",
              "Meteen kort afstemmen",
              "Erkenning van mijn ongemak",
              "Een concreet signaal afspreken",
              "Ook mijn eigen aandeel zien",
              "Het niet groter maken",
            ],
          },
        ],
        discussionQuestions: [
          "Welk stil signaal gebruiken jullie als één van jullie weg wil?",
          "Wat is privé van jullie samen en wat mag gedeeld worden?",
          "Wanneer verwacht je dat de ander zichtbaar jouw kant kiest?",
          "Hoe geef je elkaar sociaal vrijheid zonder elkaar kwijt te raken?",
        ],
        christianIntro:
          "In gezelschap worden loyaliteit, gastvrijheid, waarheid en de vrijheid van de ander zichtbaar.",
        christianPrompts: [
          "Hoe bescherm je de waardigheid van je partner wanneer anderen erbij zijn?",
          "Wanneer wordt gastvrijheid grenzeloos pleasen?",
          "Welke grap of onthulling zou de ander onveilig kunnen maken?",
          "Hoe ziet trouw eruit zonder elkaar sociaal te bezitten?",
        ],
        christianOutcome:
          "Jullie verbinden sociale vrijheid met loyaliteit, gastvrijheid en zorg voor elkaars waardigheid.",
      },
      ...extraIrritatieBingoThemes,
    ],
    christianIntro:
      "Kleine irritaties kunnen een goede waarde beschermen, maar ook trots, oordeel, controle of ongeduld blootleggen.",
    christianPrompts: [
      "Welke irritatie zegt iets goeds over wat jij belangrijk vindt?",
      "Welke irritatie onthult misschien ongeduld, trots of controle?",
      "Hoe kun je iets benoemen zonder minachting?",
      "Wanneer moet je verdragen en wanneer eerlijk grenzen stellen?",
      "Hoe zou genade klinken in een gesprek over kleine ergernissen?",
    ],
    christianOutcome:
      "Humor blijft bestaan en krijgt meer zelfkennis, genade en mildheid.",
    takeaway: "Een kleine ergernis hoeft niet klein gemaakt te worden; wel vriendelijk vertaald.",
  },
  "kleine-date": {
    id: "kleine-date",
    kicker: "Plan een kleine date",
    title: "Maak aandacht concreet",
    description:
      "Ontwerp samen een haalbare ontmoeting die past bij jullie energie, budget en behoefte.",
    prompts: [
      {
        id: "mood",
        question: "Waar hebben jullie nu het meest behoefte aan?",
        options: ["Rust", "Plezier", "Een goed gesprek", "Iets nieuws", "Buiten zijn"],
      },
      {
        id: "shape",
        question: "Welke vorm voelt ontspannen?",
        options: ["Wandeling", "Thuis iets maken", "Koffie of lunch", "Kleine activiteit", "Samen ergens kijken"],
      },
      {
        id: "care",
        question: "Wat maakt de date echt aandachtig?",
        options: ["Telefoons weg", "Geen haast", "Om de beurt kiezen", "Een klein gebaar", "Ruimte om nee te zeggen"],
      },
    ],
    discussionQuestions: [
      "Welke concrete dag en tijd kunnen jullie nu kiezen?",
      "Hoe houden jullie het klein genoeg om echt door te laten gaan?",
      "Wat zorgt dat jullie je allebei vrij en gezien voelen?",
    ],
    christianIntro:
      "Een date kan een oefening zijn in aandacht, soberheid, gastvrijheid en zuivere intentie.",
    christianPrompts: [
      "Wat maakt deze date minder indrukgericht en meer aandachtig?",
      "Hoe bewaken jullie vrijheid en zuiverheid tijdens de ontmoeting?",
      "Kan het eenvoudig, vreugdevol en niet statusgericht zijn?",
      "Hoe kijk je dankbaar terug zonder meteen te claimen?",
      "Welke vorm van gastvrijheid past bij deze fase?",
    ],
    christianOutcome:
      "De echte ontmoeting wordt ingebed in zorgvuldigheid, vreugde en respect.",
    takeaway: "Een goede date hoeft niet groot te zijn; wel gekozen, haalbaar en aandachtig.",
  },
};

export const samenLevenGameIds = Object.keys(
  samenLevenContent,
) as SamenLevenGameId[];

export function isSamenLevenGameId(value: string): value is SamenLevenGameId {
  return value in samenLevenContent;
}

export function getSamenLevenRound(
  content: SamenLevenContent,
  themeId: string | null,
) {
  const theme =
    content.themes?.find((candidate) => candidate.id === themeId) ??
    content.themes?.[0];
  return {
    theme,
    prompts: theme?.prompts ?? content.prompts,
    discussionQuestions:
      theme?.discussionQuestions ?? content.discussionQuestions,
  };
}

export const irritatieBingoBoardOrder = [
  "badkamer",
  "delen-en-lenen",
  "digitale-wereld",
  "tijd-en-aandacht",
  "eten-en-keuken",
  "slapen-en-ochtend",
  "toon-en-woorden",
  "huis-en-taken",
  "gewoontes-en-prikkels",
  "sociaal-en-onderweg",
  "vakantie-en-uitjes",
  "beslissen",
  "alleentijd-en-rust",
  "kleine-uitgaven",
  "humor-en-plagen",
  "familie-en-bezoek",
] as const;
