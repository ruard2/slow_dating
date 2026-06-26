export type KleurId = "R" | "G" | "Gr" | "B";

export const colors: Record<
  KleurId,
  {
    name: string;
    label: string;
    hex: string;
    soft: string;
    kernzin: string;
    kracht: string;
    valkuil: string;
    behoefte: string;
    angst: string;
    stress: string;
    tip: string;
  }
> = {
  R: {
    name: "Rood",
    label: "daadkracht",
    hex: "#e24b3b",
    soft: "rgba(226,75,59,.18)",
    kernzin: "Jij brengt beweging wanneer iets vastloopt.",
    kracht: "Eerlijkheid, tempo, knopen doorhakken en richting geven.",
    valkuil: "Je toon kan harder landen dan je bedoelt, juist wanneer je wilt helpen.",
    behoefte: "Serieus genomen worden, effect zien en niet machteloos blijven staan.",
    angst: "Dat er niets gebeurt, dat jij het alleen moet dragen of dat jouw grens niet telt.",
    stress: "Onder druk word je directer, korter en sneller controlerend.",
    tip: "Zeg vóór je stuurt: “Ik merk dat ik wil doorduwen. Wat gebeurt er bij jou?”",
  },
  G: {
    name: "Geel",
    label: "energie",
    hex: "#f2bd45",
    soft: "rgba(242,189,69,.2)",
    kernzin: "Jij brengt lucht, verbinding en mogelijkheden.",
    kracht: "Warmte, humor, creativiteit, initiatief en mensen meenemen.",
    valkuil: "Je kunt spanning te snel lichter maken, waardoor het echte punt verdwijnt.",
    behoefte: "Gevoel van contact, waardering en ruimte om levendig te blijven.",
    angst: "Afwijzing, sfeerbreuk of het gevoel dat jouw enthousiasme te veel is.",
    stress: "Onder druk ga je praten, relativeren, grappen maken of snel schakelen.",
    tip: "Zeg: “Ik maak het nu luchtig, maar eigenlijk raakt dit me.”",
  },
  Gr: {
    name: "Groen",
    label: "veiligheid",
    hex: "#54a05a",
    soft: "rgba(84,160,90,.2)",
    kernzin: "Jij brengt rust, trouw en bedding.",
    kracht: "Geduld, luisteren, nabij blijven en mensen veilig laten voelen.",
    valkuil: "Je zegt soms te weinig om de vrede te bewaren, tot de emmer vol is.",
    behoefte: "Tijd, zachtheid, voorspelbaarheid en veiligheid om eerlijk te zijn.",
    angst: "Dat conflict de relatie beschadigt of dat jouw behoefte te veel is.",
    stress: "Onder druk word je stiller, pas je je aan of zeg je ‘laat maar’.",
    tip: "Zeg één zin, niet alles: “Ik heb hier wel iets over te zeggen.”",
  },
  B: {
    name: "Blauw",
    label: "zorgvuldigheid",
    hex: "#3f7fc5",
    soft: "rgba(63,127,197,.2)",
    kernzin: "Jij brengt helderheid, nuance en kwaliteit.",
    kracht: "Analyseren, risico’s zien, betrouwbaarheid en zorgvuldig kiezen.",
    valkuil: "Je analyse kan afstandelijk klinken wanneer de ander eerst contact nodig heeft.",
    behoefte: "Duidelijkheid, betrouwbaarheid, goede redenen en tijd om te begrijpen.",
    angst: "Chaos, fouten, onbetrouwbaarheid of beslissen zonder voldoende grond.",
    stress: "Onder druk ga je meer controleren, verklaren, vragen en ordenen.",
    tip: "Zeg: “Ik probeer het te begrijpen, maar ik wil je eerst horen.”",
  },
};

export const uitlegCards = [
  {
    title: "Geen hokjes, wel taal",
    body:
      "Kleuren zijn geen diagnose en geen excuus. Ze zijn een eenvoudige taal voor wat je sneller doet wanneer spanning oploopt.",
  },
  {
    title: "Je hebt meestal meer dan één kleur",
    body:
      "De meeste mensen herkennen een hoofdkleur en een tweede kleur. In rust kan je anders reageren dan onder druk.",
  },
  {
    title: "Het gaat om jullie dans",
    body:
      "Kaart 4 gebruikt kleurentaal vooral om ruzies zachter te maken: wat bedoel je, wat hoort de ander, en wat helpt dan?",
  },
];

export const scenarios = [
  {
    id: "late-no-message",
    situation: "Je partner komt te laat zonder bericht.",
    answers: [
      { color: "R", text: "Ik zeg direct dat dit niet oké is." },
      { color: "G", text: "Ik maak eerst een luchtige opmerking." },
      { color: "Gr", text: "Ik zeg weinig, maar voel me teleurgesteld." },
      { color: "B", text: "Ik vraag waarom dit niet eerder gecommuniceerd was." },
    ],
  },
  {
    id: "argument-silence",
    situation: "Na een ruzie blijft de ander stil.",
    answers: [
      { color: "R", text: "Ik wil het nu uitpraten, niet laten hangen." },
      { color: "G", text: "Ik probeer de sfeer weer wat lichter te maken." },
      { color: "Gr", text: "Ik geef ruimte en wacht tot de ander komt." },
      { color: "B", text: "Ik denk eerst na over wat er precies misging." },
    ],
  },
  {
    id: "plan-changes",
    situation: "Een plan verandert op het laatste moment.",
    answers: [
      { color: "R", text: "Ik zeg eerlijk dat ik dit irritant vind." },
      { color: "G", text: "Ik schakel mee; misschien wordt het juist leuk." },
      { color: "Gr", text: "Ik vind het lastig, maar zeg er niet meteen iets van." },
      { color: "B", text: "Ik wil begrijpen waarom het veranderd is." },
    ],
  },
  {
    id: "partner-sad",
    situation: "Je partner is verdrietig.",
    answers: [
      { color: "R", text: "Ik wil weten wat er is en wat we kunnen doen." },
      { color: "G", text: "Ik probeer nabijheid en wat lucht te brengen." },
      { color: "Gr", text: "Ik ga erbij zitten en blijf rustig aanwezig." },
      { color: "B", text: "Ik vraag door zodat ik het goed begrijp." },
    ],
  },
  {
    id: "big-choice",
    situation: "Jullie moeten samen een grote keuze maken.",
    answers: [
      { color: "R", text: "Ik wil naar een besluit toe werken." },
      { color: "G", text: "Ik kijk waar we samen energie van krijgen." },
      { color: "Gr", text: "Ik wil zeker weten dat de ander echt mee kan." },
      { color: "B", text: "Ik wil eerst de feiten en opties helder hebben." },
    ],
  },
  {
    id: "criticism",
    situation: "Je krijgt kritiek die volgens jou niet helemaal klopt.",
    answers: [
      { color: "R", text: "Ik reageer direct en zet recht wat niet klopt." },
      { color: "G", text: "Ik probeer het gesprek vriendelijk te houden." },
      { color: "Gr", text: "Ik slik eerst even en trek me wat terug." },
      { color: "B", text: "Ik vraag om concrete voorbeelden." },
    ],
  },
  {
    id: "messy-house",
    situation: "Thuis is iets blijven liggen terwijl jullie moe zijn.",
    answers: [
      { color: "R", text: "Ik pak door en zeg wat er moet gebeuren." },
      { color: "G", text: "Ik probeer het gezellig op te lossen." },
      { color: "Gr", text: "Ik doe het liever zelf dan dat er gedoe komt." },
      { color: "B", text: "Ik wil een afspraak zodat dit niet steeds terugkomt." },
    ],
  },
  {
    id: "vulnerable-topic",
    situation: "Er komt een kwetsbaar onderwerp op tafel.",
    answers: [
      { color: "R", text: "Ik wil eerlijk zijn, ook als het schuurt." },
      { color: "G", text: "Ik zoek contact, warmte en een zachte opening." },
      { color: "Gr", text: "Ik heb tijd nodig om veilig te kunnen spreken." },
      { color: "B", text: "Ik orden eerst mijn gedachten voordat ik iets zeg." },
    ],
  },
] as const;

export const stressBehaviors = [
  { id: "direct", text: "Ik ga harder praten of directer worden.", scores: { R: 3, G: 0, Gr: 0, B: 1 } },
  { id: "silent", text: "Ik word stil en trek me terug.", scores: { R: 0, G: 0, Gr: 3, B: 1 } },
  { id: "control", text: "Ik ga meer controleren of plannen.", scores: { R: 1, G: 0, Gr: 0, B: 3 } },
  { id: "joke", text: "Ik maak een grapje om de spanning weg te halen.", scores: { R: 0, G: 3, Gr: 1, B: 0 } },
  { id: "solve", text: "Ik wil het direct oplossen en ga meteen in actie.", scores: { R: 3, G: 1, Gr: 0, B: 0 } },
  { id: "analyze", text: "Ik ga alles analyseren en scenario’s bedenken.", scores: { R: 0, G: 0, Gr: 0, B: 3 } },
  { id: "let-it-go", text: "Ik zeg ‘laat maar’, maar bedoel dat niet echt.", scores: { R: 0, G: 1, Gr: 3, B: 0 } },
  { id: "busy", text: "Ik verander van onderwerp of blijf te druk om erbij te zijn.", scores: { R: 0, G: 3, Gr: 0, B: 1 } },
] as const;

export const translatePhrases = [
  {
    id: "why-so-long",
    theme: "Druk",
    original: "Waarom duurt dit zo lang?",
    hears: {
      R: "Je bent te traag; neem nou eens leiding.",
      G: "Ik stel teleur en de sfeer wordt negatief.",
      Gr: "Ik doe het fout; straks wordt het gedoe.",
      B: "Oneerlijke vraag; er is vast een goede reden.",
    },
    better: {
      R: "Ik wil graag weten wanneer we dit afronden. Kun je één concrete stap noemen?",
      G: "Hoe gaat het ermee? Kan ik iets doen zodat het lichter wordt?",
      Gr: "Neem de tijd die je nodig hebt. Ik vraag even hoe het ervoor staat.",
      B: "Kun je me meenemen in de stappen die nog nodig zijn?",
    },
  },
  {
    id: "you-never-listen",
    theme: "Niet gehoord",
    original: "Je luistert nooit naar me.",
    hears: {
      R: "Je valt mijn aanpak aan.",
      G: "Je bent boos op mij; de verbinding is weg.",
      Gr: "Ik heb je teleurgesteld en moet stiller worden.",
      B: "Wat klopt er precies niet? Dit is te algemeen.",
    },
    better: {
      R: "Ik wil dat je nu even stopt en mij serieus hoort.",
      G: "Ik mis contact met je. Kun je me even aankijken en luisteren?",
      Gr: "Ik vind dit spannend om te zeggen, maar ik voel me niet gehoord.",
      B: "Bij dit ene punt voelde ik me niet begrepen. Mag ik het concreet maken?",
    },
  },
  {
    id: "do-it-yourself",
    theme: "Initiatief",
    original: "Doe jij het nou maar.",
    hears: {
      R: "Goed, ik neem het over.",
      G: "Je bent niet enthousiast; misschien is er iets mis.",
      Gr: "Ik wil niet opdringen, dus ik trek me terug.",
      B: "Dit is geen echte input; ik wil criteria.",
    },
    better: {
      R: "Jij mag beslissen; mijn enige harde punt is dit.",
      G: "Ik laat het aan jou, maar ik hoop dat het ook gezellig blijft.",
      Gr: "Ik vind beide opties oké; jouw voorkeur telt voor mij mee.",
      B: "Mijn voorkeur is dit, maar ik ben benieuwd naar jouw argumenten.",
    },
  },
  {
    id: "always",
    theme: "Altijd/nooit",
    original: "Je doet dit altijd.",
    hears: {
      R: "Onterecht. Ik ga dit weerleggen.",
      G: "Je bent gefrustreerd op mij; ik wil de sfeer redden.",
      Gr: "Ik faal alweer; ik trek me terug.",
      B: "Altijd klopt niet. Geef voorbeelden.",
    },
    better: {
      R: "Dit gebeurde net, en ik wil het nu serieus bespreken.",
      G: "Ik merk dat ik er moedeloos van word en contact met je mis.",
      Gr: "Ik vind het spannend om dit te zeggen, maar dit raakt me vaker.",
      B: "Ik zie een patroon in deze drie situaties. Wil je met me meekijken?",
    },
  },
] as const;

export const comboText: Record<
  string,
  { title: string; strength: string; tension: string; exercise: string; question: string }
> = {
  "R-R": {
    title: "Vuur ontmoet vuur",
    strength: "Eerlijkheid en daadkracht. Er gebeurt altijd iets.",
    tension: "Er kan strijd ontstaan om regie of gelijk.",
    exercise: "Eén zegt: “Ik wil nu niet winnen, ik wil zeggen wat dit met mij doet.” De ander vat alleen samen.",
    question: "Waar wil jij eigenlijk niet winnen, maar gezien worden?",
  },
  "R-G": {
    title: "Richting ontmoet energie",
    strength: "Rood brengt focus, Geel brengt leven.",
    tension: "Rood kan Geel chaotisch vinden; Geel kan Rood hard vinden.",
    exercise: "Rood kiest het doel, Geel kiest de sfeer. Daarna checken jullie: voelt dit voor allebei goed?",
    question: "Wanneer voelt de ander als rem, en wanneer als geschenk?",
  },
  "R-Gr": {
    title: "Tempo ontmoet veiligheid",
    strength: "Rood brengt beweging, Groen brengt bedding.",
    tension: "Rood duwt; Groen trekt terug. Beiden voelen zich alleen.",
    exercise: "Rood vraagt: “Wat heb jij nodig om mee te kunnen bewegen?” Groen antwoordt met één concrete behoefte.",
    question: "Wat gebeurt er in jou als de ander sneller of langzamer gaat dan jij aankunt?",
  },
  "R-B": {
    title: "Besluit ontmoet bewijs",
    strength: "Rood kiest, Blauw bewaakt kwaliteit.",
    tension: "Rood vindt Blauw traag; Blauw vindt Rood impulsief.",
    exercise: "Blauw krijgt vijf minuten voor risico’s. Rood kiest daarna één kleine stap.",
    question: "Wanneer is snelheid eigenlijk onrust, en zorgvuldigheid eigenlijk angst?",
  },
  "G-G": {
    title: "Vonken ontmoet vonken",
    strength: "Warmte, plezier en veel ideeën.",
    tension: "Moeilijke gesprekken kunnen te snel worden weggelachen.",
    exercise: "Tien minuten zonder grapjes: ieder zegt één zin die lastig is.",
    question: "Welk serieus gesprek maken jullie te snel luchtig?",
  },
  "G-Gr": {
    title: "Avontuur ontmoet rust",
    strength: "Geel brengt leven, Groen brengt veiligheid.",
    tension: "Geel voelt zich geremd; Groen voelt zich overvraagd.",
    exercise: "Plan één moment met twee helften: eerst iets levendigs, dan rustige nabijheid.",
    question: "Wanneer voelt rust als liefde, en wanneer als saaiheid?",
  },
  "G-B": {
    title: "Idee ontmoet structuur",
    strength: "Geel droomt, Blauw maakt haalbaar.",
    tension: "Geel voelt kritiek; Blauw voelt chaos.",
    exercise: "Geel noemt drie ideeën zonder onderbreking. Blauw vraagt daarna: welke maken we concreet?",
    question: "Welke kritiek is eigenlijk zorg, en welke spontaniteit is eigenlijk verlangen?",
  },
  "Gr-Gr": {
    title: "Rust ontmoet rust",
    strength: "Trouw, zachtheid en veiligheid.",
    tension: "Moeilijke onderwerpen kunnen te lang blijven liggen.",
    exercise: "Ieder maakt af: “Ik zeg dit niet graag, maar ik wil eerlijk zijn: …”",
    question: "Wat zeggen jullie niet om de vrede te bewaren?",
  },
  "Gr-B": {
    title: "Zorg ontmoet zorgvuldigheid",
    strength: "Rustig, betrouwbaar en loyaal.",
    tension: "Blauw klinkt kritisch; Groen raakt gekwetst en trekt terug.",
    exercise: "Blauw start met waardering. Groen zegt daarna duidelijk welke toon helpt.",
    question: "Waar heb jij bevestiging nodig voordat je verder kunt?",
  },
  "B-B": {
    title: "Precisie ontmoet precisie",
    strength: "Kwaliteit, betrouwbaarheid en diepgang.",
    tension: "Gevoel kan worden beredeneerd in plaats van gedeeld.",
    exercise: "Geen argumenten: alleen “ik voel… ik verlang… ik ben bang dat…”",
    question: "Waar gebruiken jullie analyse om kwetsbaarheid te vermijden?",
  },
};

export const deeperQuestions: Record<KleurId, string[]> = {
  R: [
    "Waar ben jij bang dat er niets gebeurt als jij niet duwt?",
    "Wanneer klinkt jouw eerlijkheid harder dan je hart eigenlijk is?",
    "Wat verlang jij dat de ander serieus neemt, zonder dat jij hoeft te forceren?",
    "Waar zou je deze week bewust eerst kunnen vragen voordat je stuurt?",
  ],
  G: [
    "Wanneer maak jij iets luchtig omdat de spanning eigenlijk te dichtbij komt?",
    "Waar verlang jij naar erkenning zonder dat je ervoor hoeft te presteren?",
    "Welke zorg zit er soms onder jouw vrolijkheid?",
    "Wanneer mag een gesprek zwaar zijn zonder dat jij het hoeft te redden?",
  ],
  Gr: [
    "Wat zeg jij niet om de vrede te bewaren, terwijl het wel in je leeft?",
    "Waar verwar jij rust met verdwijnen?",
    "Welke ene zin zou al genoeg zijn om jezelf niet kwijt te raken?",
    "Waar heb jij veiligheid nodig om eerlijker te worden?",
  ],
  B: [
    "Welk gevoel heb jij al lang zorgvuldig beredeneerd in plaats van gevoeld?",
    "Wanneer is jouw vraag om duidelijkheid eigenlijk een vraag om veiligheid?",
    "Waar klinkt jouw zorg als kritiek?",
    "Wat zou er gebeuren als je eerst contact maakt en daarna pas analyseert?",
  ],
};

export const heardWrongCards = [
  {
    id: "serious",
    phrase: "Ik wil dit even serieus bespreken.",
    hiddenNeed: "Ik wil niet dat dit tussen ons blijft staan.",
    hears: {
      R: "Goed, concreet worden.",
      G: "Oei, de sfeer wordt zwaar.",
      Gr: "Er komt mogelijk conflict; voorzichtig.",
      B: "Prima, maar dan graag precies en rustig.",
    },
  },
  {
    id: "space",
    phrase: "Ik heb even ruimte nodig.",
    hiddenNeed: "Ik wil niet weglopen, maar ik moet vertragen om verbonden te blijven.",
    hears: {
      R: "Je trekt je terug terwijl we dit moeten oplossen.",
      G: "Je wilt minder contact met mij.",
      Gr: "Rust is veilig; geef ruimte.",
      B: "Hoe lang, waarom, en wat spreken we af?",
    },
  },
  {
    id: "not-good",
    phrase: "Dit voelt voor mij niet goed.",
    hiddenNeed: "Ik wil dat mijn grens serieus genomen wordt.",
    hears: {
      R: "Er moet nu iets veranderen.",
      G: "Ik heb iets verkeerd gedaan en de sfeer is kapot.",
      Gr: "Dit is spannend; voorzichtig reageren.",
      B: "Wat klopt er precies niet?",
    },
  },
  {
    id: "help",
    phrase: "Ik heb hulp nodig.",
    hiddenNeed: "Ik wil het niet alleen dragen.",
    hears: {
      R: "Ik moet in actie komen.",
      G: "Ik wil nabij zijn en bemoedigen.",
      Gr: "Ik wil ondersteunen zonder te duwen.",
      B: "Wat is de vraag precies?",
    },
  },
] as const;

export const growthCards: Record<string, string[]> = {
  "R-R": [
    "Spreek af dat één van jullie bij oplopende spanning hardop zegt: pauze, niet winnen.",
    "Oefen één gesprek waarin de eerste reactie alleen samenvatten is.",
  ],
  "R-G": [
    "Rood formuleert het doel in één zin; Geel formuleert wat het warm houdt.",
    "Kies één moeilijk onderwerp en begin met waardering voordat je naar actie gaat.",
  ],
  "R-Gr": [
    "Rood stelt één vraag vóór een opdracht. Groen geeft één duidelijk antwoord vóór terugtrekken.",
    "Gebruik deze zin: tempo omlaag, verbinding omhoog.",
  ],
  "R-B": [
    "Blauw noemt maximaal drie risico’s; Rood kiest één kleine volgende stap.",
    "Spreek een beslismoment af, zodat zorgvuldigheid geen eindeloze wachtruimte wordt.",
  ],
  "G-G": [
    "Tien minuten zonder grapjes: ieder zegt één zin die je normaal luchtig zou maken.",
    "Maak één leuke afspraak én één serieuze afspraak. Allebei tellen.",
  ],
  "G-Gr": [
    "Plan iets levendigs met een duidelijke zachte landing erna.",
    "Geel vraagt: wordt dit te veel? Groen zegt: dit heb ik nodig om mee te kunnen.",
  ],
  "G-B": [
    "Geel noemt ideeën zonder onderbreking; Blauw kiest daarna één haalbare versie.",
    "Blauw begint kritiek met: ik wil dit beschermen, niet afbreken.",
  ],
  "Gr-Gr": [
    "Ieder zegt één waarheid die klein genoeg is om veilig te blijven, maar echt genoeg om te tellen.",
    "Zet een vast moment voor moeilijke onderwerpen, zodat vrede geen uitstel wordt.",
  ],
  "Gr-B": [
    "Blauw begint met waardering; Groen zegt daarna welk tempo veilig voelt.",
    "Vertaal kritiek naar zorg en stilte naar behoefte.",
  ],
  "B-B": [
    "Vijf minuten geen analyse: alleen ik voel, ik verlang, ik ben bang, ik hoop.",
    "Kies één punt waar goed genoeg vandaag beter is dan perfect ooit.",
  ],
};

export function comboKey(left: KleurId, right: KleurId) {
  const order: KleurId[] = ["R", "G", "Gr", "B"];
  return [left, right].sort((a, b) => order.indexOf(a) - order.indexOf(b)).join("-");
}
