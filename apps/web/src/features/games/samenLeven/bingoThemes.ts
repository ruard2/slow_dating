import type { SamenLevenTheme } from "./content";

export const extraIrritatieBingoThemes: readonly SamenLevenTheme[] = [
  {
    id: "toon-en-woorden",
    icon: "💬",
    title: "Toon & woorden",
    description: "Zuchten, corrigeren, grapjes en de manier waarop iets gezegd wordt.",
    prompts: [
      {
        id: "tone-trigger",
        question: "Welke manier van praten raakt jou het snelst?",
        options: ["Zuchten", "Een scherpe grap", "Mij corrigeren", "Een bevelende toon", "Alles relativeren", "Steeds onderbreken"],
      },
      {
        id: "tone-case",
        question: "De boodschap klopt, maar de toon voelt kleinerend. Wat doe jij?",
        options: ["Ik reageer op de toon", "Ik verdedig mezelf", "Ik trek me terug", "Ik vraag om een herhaling", "Ik laat het gaan", "Ik maak zelf een grap"],
      },
      {
        id: "tone-need",
        question: "Wat heb jij dan vooral nodig?",
        options: ["Respect", "Zachtheid", "Duidelijkheid", "Erkenning", "Tijd om af te koelen", "Niet alles zo zwaar maken"],
      },
    ],
    discussionQuestions: [
      "Welke toon hoor jij sneller als kritiek dan de ander bedoelt?",
      "Hoe kunnen jullie een zin opnieuw beginnen zonder gezichtsverlies?",
      "Welke woorden zijn voor jullie nooit grappig?",
    ],
    christianIntro: "Woorden kunnen opbouwen of verwonden; waarheid en liefde horen bij elkaar.",
    christianPrompts: [
      "Spreek jij waarheid om te dienen of om te winnen?",
      "Hoe klinkt zachtmoedigheid zonder vaag te worden?",
      "Wanneer moet je vergeving vragen voor je toon, niet alleen je bedoeling?",
    ],
    christianOutcome: "Jullie oefenen spreken dat eerlijk én genadig is.",
  },
  {
    id: "slapen-en-ochtend",
    icon: "🛏️",
    title: "Slapen & ochtend",
    description: "Wekkers, snoozen, dekbedden en vroeg of laat op gang komen.",
    prompts: [
      {
        id: "sleep-trigger",
        question: "Wat verstoort jouw rust het meest?",
        options: ["Veel snoozen", "Laat licht of geluid", "Dekbed stelen", "Vroeg praten", "Andere kamertemperatuur", "Onregelmatige bedtijd"],
      },
      {
        id: "sleep-case",
        question: "De ander wil praten terwijl jij bijna slaapt. Wat gebeurt er?",
        options: ["Ik luister half", "Ik word kortaf", "Ik maak een afspraak voor morgen", "Ik blijf toch wakker", "Ik vind het juist fijn", "Ik zeg niets en baal"],
      },
      {
        id: "sleep-care",
        question: "Welke slaapafspraak voelt zorgzaam?",
        options: ["Een stille zone", "Een vaste praatgrens", "Eigen dekbed", "Wekker verder weg", "Ochtendruimte", "Flexibel per dag"],
      },
    ],
    discussionQuestions: [
      "Wanneer heeft rust voorrang op contact?",
      "Hoe ziet een liefdevolle ochtend eruit voor jullie verschillen?",
      "Welke kleine aanpassing zou veel irritatie wegnemen?",
    ],
    christianIntro: "Rust erkent dat niemand onuitputtelijk is en dat zorg ook praktisch mag zijn.",
    christianPrompts: [
      "Kun jij rust ontvangen zonder schuldgevoel?",
      "Hoe respecteer je de lichamelijke grens van de ander?",
      "Waar vraagt liefde om jezelf even niet centraal te zetten?",
    ],
    christianOutcome: "Jullie behandelen rust als een gave en een wederzijdse verantwoordelijkheid.",
  },
  {
    id: "eten-en-keuken",
    icon: "🍽️",
    title: "Eten & keuken",
    description: "Kiezen wat je eet, restjes, koken en verwachtingen rond de maaltijd.",
    prompts: [
      {
        id: "food-trigger",
        question: "Wat irriteert jou sneller rond eten?",
        options: ["Laat beslissen", "Kritiek op koken", "Restjes laten staan", "Ander eettempo", "Snacken vóór het eten", "Nooit boodschappen aanvullen"],
      },
      {
        id: "food-case",
        question: "Jij hebt gekookt en de ander wil iets anders. Wat voel je eerst?",
        options: ["Niet gewaardeerd", "Prima, eigen keuze", "Verspilde moeite", "Boos om de timing", "Ik wil overleggen", "Ik kook liever niet meer"],
      },
      {
        id: "food-plan",
        question: "Welke afspraak geeft de meeste rust?",
        options: ["Weekmenu", "Om de beurt kiezen", "Twee vrije avonden", "Altijd een noodmaaltijd", "Samen boodschappen", "Geen vaste afspraak"],
      },
    ],
    discussionQuestions: [
      "Wanneer voelt eten als zorg en wanneer als verplichting?",
      "Hoe geef je feedback op koken zonder ondankbaar te klinken?",
      "Welke voedselgewoonte uit thuis neem je mee?",
    ],
    christianIntro: "Maaltijden raken dankbaarheid, gastvrijheid en zorg voor lichaam en gemeenschap.",
    christianPrompts: [
      "Hoe kan een gewone maaltijd een plek van dankbaarheid worden?",
      "Wanneer verandert gastvrijheid in prestatie?",
      "Hoe ontvangen jullie eten en zorg zonder vanzelfsprekendheid?",
    ],
    christianOutcome: "De maaltijd wordt een oefening in dankbaarheid en gastvrijheid.",
  },
  {
    id: "kleine-uitgaven",
    icon: "🛍️",
    title: "Kleine uitgaven",
    description: "Koffie, bezorging, koopjes en bedragen die ongemerkt optellen.",
    prompts: [
      {
        id: "money-trigger",
        question: "Welke kleine uitgave schuurt het meest?",
        options: ["Vaak bezorgen", "Dagelijkse koffie", "Impulsaankopen", "Abonnementen vergeten", "Altijd het goedkoopste", "Over elke euro praten"],
      },
      {
        id: "money-case",
        question: "De ander koopt iets kleins zonder overleg, maar jullie sparen samen. Wat doe je?",
        options: ["Ik zeg direct iets", "Ik houd het bij", "Kleine vrijheid hoort erbij", "Ik vraag naar de reden", "Ik word onzeker", "Ik koop zelf ook iets"],
      },
      {
        id: "money-rule",
        question: "Welke grens voelt eerlijk?",
        options: ["Vrij bedrag per maand", "Overleggen boven een bedrag", "Volledige openheid", "Ieder eigen rekening", "Alleen gezamenlijke doelen", "Geen vaste regel"],
      },
    ],
    discussionQuestions: [
      "Wanneer wordt een klein bedrag symbolisch groot?",
      "Hoe combineren jullie vrijheid en gezamenlijke verantwoordelijkheid?",
      "Welke uitgave zegt iets over wat jij belangrijk vindt?",
    ],
    christianIntro: "Ook kleine uitgaven kunnen verlangen, vrijheid, angst en rentmeesterschap zichtbaar maken.",
    christianPrompts: [
      "Waar zoek jij troost of status in kleine aankopen?",
      "Hoe ziet vrijgevigheid eruit zonder onverantwoordelijkheid?",
      "Welke geldgewoonte helpt jullie vertrouwen in God te oefenen?",
    ],
    christianOutcome: "Jullie leren kleine geldkeuzes lezen als signalen van verlangen en vertrouwen.",
  },
  {
    id: "badkamer",
    icon: "🚿",
    title: "Badkamer",
    description: "Tijd, handdoeken, haren, doppen en wie wanneer naar binnen wil.",
    prompts: [
      {
        id: "bath-trigger",
        question: "Welke badkamerklassieker herken je?",
        options: ["Natte vloer", "Haren laten liggen", "Dop niet terug", "Te lang douchen", "Spullen overal", "Net binnenkomen als ik wil"],
      },
      {
        id: "bath-case",
        question: "Jullie hebben haast en de ander blijft langer in de badkamer. Wat doe je?",
        options: ["Op de deur kloppen", "Mijn planning aanpassen", "Geïrriteerd roepen", "Een tijd afspreken", "Ik wacht stil", "Ik vind het niet erg"],
      },
      {
        id: "bath-solution",
        question: "Wat zou het meeste helpen?",
        options: ["Eigen plank", "Ochtendrooster", "Direct opruimen", "Korter douchen", "Tweede spiegelplek", "Meer tolerantie"],
      },
    ],
    discussionQuestions: [
      "Welke badkamerverwachting heb je nooit uitgesproken?",
      "Wat is hygiëne en wat is persoonlijke voorkeur?",
      "Hoe voorkom je dat haast de toon bepaalt?",
    ],
    christianIntro: "Zelfs gedeelde ruimte vraagt om consideratie, eenvoud en respect voor elkaars lichaam.",
    christianPrompts: [
      "Hoe ziet zorgvuldigheid eruit in een ruimte die je deelt?",
      "Waar kun jij dienen zonder de ander te controleren?",
      "Hoe praat je over lichamelijke gewoontes zonder schaamte te veroorzaken?",
    ],
    christianOutcome: "Jullie oefenen respect en dienstbaarheid in een heel gewone gedeelde ruimte.",
  },
  {
    id: "delen-en-lenen",
    icon: "🔑",
    title: "Delen & lenen",
    description: "Opladers, sleutels, kleding en spullen terugvinden waar je ze liet.",
    prompts: [
      {
        id: "share-trigger",
        question: "Wat is bij delen het lastigst?",
        options: ["Niet vragen", "Niet terugleggen", "Slordig gebruiken", "Mijn laatste opmaken", "Niet kunnen vinden", "Alles apart willen houden"],
      },
      {
        id: "share-case",
        question: "Je zoekt iets en ontdekt dat de ander het heeft meegenomen. Wat doe je?",
        options: ["Direct appen", "Boos zoeken", "Een reserve kopen", "Later rustig bespreken", "Het kan gebeuren", "Voortaan verstoppen"],
      },
      {
        id: "share-boundary",
        question: "Welke deelregel past bij jou?",
        options: ["Altijd vragen", "Alles mag behalve enkele dingen", "Terug op vaste plek", "Laat weten wat je meeneemt", "Ieder eigen spullen", "Geen regels nodig"],
      },
    ],
    discussionQuestions: [
      "Welk bezit voelt voor jou verrassend persoonlijk?",
      "Wanneer is delen liefdevol en wanneer grensloos?",
      "Welke vaste plek kan veel irritatie voorkomen?",
    ],
    christianIntro: "Delen raakt vrijgevigheid, grenzen en de vraag of bezit een middel of een identiteit wordt.",
    christianPrompts: [
      "Wat deel je ruimhartig en wat houd je angstig vast?",
      "Hoe kan vrijgevigheid samengaan met respect voor grenzen?",
      "Wanneer gebruik je bezit om controle te houden?",
    ],
    christianOutcome: "Jullie verbinden delen met vrijheid, respect en goed rentmeesterschap.",
  },
  {
    id: "beslissen",
    icon: "🗓️",
    title: "Plannen & beslissen",
    description: "Wie kiest, hoe lang overleg duurt en wanneer een besluit echt vaststaat.",
    prompts: [
      {
        id: "decision-trigger",
        question: "Wat frustreert jou bij samen beslissen?",
        options: ["Geen voorkeur zeggen", "Alles eindeloos afwegen", "Te snel beslissen", "Later terugkomen", "Altijd mij laten kiezen", "Mijn voorstel direct afwijzen"],
      },
      {
        id: "decision-case",
        question: "Jullie blijven twijfelen tussen twee opties. Wat is jouw reflex?",
        options: ["Gewoon knoop doorhakken", "Meer informatie zoeken", "De ander laten kiezen", "Uitstellen", "Voor- en nadelen maken", "Loten"],
      },
      {
        id: "decision-method",
        question: "Welke methode voelt eerlijk?",
        options: ["Om de beurt beslissen", "Wie het meeste raakt kiest", "Samen consensus", "Proefperiode", "Meerderheid met twee bestaat niet", "Per onderwerp verdelen"],
      },
    ],
    discussionQuestions: [
      "Wanneer voelt besluitvaardigheid als dominantie?",
      "Welke beslissingen mogen licht blijven?",
      "Waar wil jij meer initiatief van de ander?",
    ],
    christianIntro: "Samen kiezen vraagt wijsheid, nederigheid en vrijheid om niet altijd gelijk te krijgen.",
    christianPrompts: [
      "Zoek je in een besluit Gods wijsheid of vooral bevestiging van je voorkeur?",
      "Kun jij toegeven zonder innerlijk een rekening bij te houden?",
      "Hoe ziet gezamenlijke onderscheiding er praktisch uit?",
    ],
    christianOutcome: "Besluiten worden oefeningen in wijsheid, nederigheid en gedeelde verantwoordelijkheid.",
  },
  {
    id: "familie-en-bezoek",
    icon: "🏠",
    title: "Familie & bezoek",
    description: "Hoe vaak, hoe lang, onverwacht langskomen en wie de grenzen bewaakt.",
    prompts: [
      {
        id: "visit-trigger",
        question: "Wat geeft rond bezoek het snelst spanning?",
        options: ["Onaangekondigd komen", "Te vaak afspreken", "Te lang blijven", "Altijd gastheer zijn", "Geen hulp achteraf", "Moeilijk nee zeggen"],
      },
      {
        id: "visit-case",
        question: "Familie wil langskomen op jullie vrije avond. Wat doe je?",
        options: ["Direct ja", "Eerst samen overleggen", "Een ander moment voorstellen", "Met tegenzin toestemmen", "Duidelijk nee", "De ander laten beslissen"],
      },
      {
        id: "visit-loyalty",
        question: "Wat verwacht je van je partner?",
        options: ["Onze grens uitspreken", "Mijn familie accepteren", "Niet alles persoonlijk nemen", "Meehelpen ontvangen", "Na afloop luisteren", "Mij vrijlaten om alleen te gaan"],
      },
    ],
    discussionQuestions: [
      "Wie bewaakt de grens richting welke familie?",
      "Wanneer is gastvrijheid vreugde en wanneer uitputting?",
      "Welke vrije tijd willen jullie beschermen?",
    ],
    christianIntro: "Gastvrijheid is waardevol, maar liefde vraagt ook eerlijke grenzen en trouw aan de relatie.",
    christianPrompts: [
      "Wanneer ontvang je uit liefde en wanneer uit mensenvrees?",
      "Hoe eer je familie zonder je partner alleen te laten?",
      "Welke grens maakt duurzame gastvrijheid mogelijk?",
    ],
    christianOutcome: "Jullie zoeken gastvrijheid die vrij, trouw en begrensd is.",
  },
  {
    id: "digitale-wereld",
    icon: "📱",
    title: "Schermen & online",
    description: "Meldingen, scrollen, delen op sociale media en digitale privacy.",
    prompts: [
      {
        id: "digital-trigger",
        question: "Wat stoort jou digitaal het meest?",
        options: ["Scrollen tijdens gesprek", "Altijd meldingen", "Foto's delen zonder vragen", "Online maar niet reageren", "Telefoon in bed", "Wachtwoorden verwachten"],
      },
      {
        id: "digital-case",
        question: "De ander plaatst iets over jullie zonder overleg. Wat doe je?",
        options: ["Vraag het te verwijderen", "Leg uit waarom het raakt", "Vind het juist leuk", "Reageer openbaar", "Trek me terug", "Maak eerst een afspraak"],
      },
      {
        id: "digital-rule",
        question: "Welke digitale grens past?",
        options: ["Telefoonvrije momenten", "Altijd toestemming voor foto's", "Geen geheimen maar wel privacy", "Meldingen uit", "Geen telefoon in bed", "Geen vaste regels"],
      },
    ],
    discussionQuestions: [
      "Wat betekent digitale privacy binnen vertrouwen?",
      "Wanneer voelt een scherm als concurrent?",
      "Wat willen jullie nooit zonder overleg delen?",
    ],
    christianIntro: "Digitale gewoontes raken aandacht, waarheid, kuisheid, vergelijking en wat je hart voortdurend voedt.",
    christianPrompts: [
      "Waar trekt je scherm je weg van liefdevolle aanwezigheid?",
      "Welke online inhoud voedt onrust of vergelijking?",
      "Hoe ziet integriteit eruit wanneer niemand meekijkt?",
    ],
    christianOutcome: "Jullie verbinden digitale vrijheid met aandacht, integriteit en bewaking van het hart.",
  },
  {
    id: "vakantie-en-uitjes",
    icon: "🧳",
    title: "Vakantie & uitjes",
    description: "Tempo, budget, voorbereiding en hoeveel er op één dag moet gebeuren.",
    prompts: [
      {
        id: "trip-trigger",
        question: "Waar botsen reisstijlen het snelst?",
        options: ["Te veel plannen", "Niets voorbereiden", "Te laat inpakken", "Ander budget", "Vroeg vertrekken", "Geen rustdag"],
      },
      {
        id: "trip-case",
        question: "Op vakantie wil één door, de ander pauze. Wat doe jij?",
        options: ["Programma aanpassen", "Alleen verdergaan", "Over mijn grens gaan", "Een compromis zoeken", "Geïrriteerd afhaken", "De dag splitsen"],
      },
      {
        id: "trip-value",
        question: "Wat maakt een uitje geslaagd?",
        options: ["Veel meemaken", "Rust", "Spontaniteit", "Goed eten", "Natuur", "Samenwerking"],
      },
    ],
    discussionQuestions: [
      "Hoeveel lege ruimte heeft een fijne reis nodig?",
      "Wie draagt welke voorbereiding?",
      "Wanneer mag je tijdens een uitje iets apart doen?",
    ],
    christianIntro: "Vrije tijd kan dankbaarheid en verwondering voeden, maar ook prestatie, status of vluchtgedrag worden.",
    christianPrompts: [
      "Kun jij genieten zonder alles maximaal te benutten?",
      "Hoe oefen je dankbaarheid wanneer plannen tegenvallen?",
      "Waar kan eenvoud meer vreugde geven dan status?",
    ],
    christianOutcome: "Jullie leren vrije tijd ontvangen met dankbaarheid, flexibiliteit en eenvoud.",
  },
  {
    id: "alleentijd-en-rust",
    icon: "🌿",
    title: "Alleentijd & rust",
    description: "Hoeveel nabijheid fijn is en wanneer stilte geen afwijzing betekent.",
    prompts: [
      {
        id: "alone-trigger",
        question: "Wat raakt jou rond alleentijd?",
        options: ["De ander trekt zich plots terug", "Ik krijg nooit rust", "Stilte voelt afstandelijk", "Altijd samen moeten", "Geen duidelijke terugkomtijd", "Mijn rust wordt onderbroken"],
      },
      {
        id: "alone-case",
        question: "Na een drukke dag wil de ander alleen zijn. Wat denk jij eerst?",
        options: ["Heb ik iets fout gedaan?", "Prima, ik ook", "Ik voel me afgewezen", "Ik wil weten hoelang", "Ik bied zorg aan", "Ik blijf contact zoeken"],
      },
      {
        id: "alone-language",
        question: "Welke zin geeft veiligheid?",
        options: ["Ik heb rust nodig en kom terug", "Het ligt niet aan jou", "Zullen we later praten?", "Wil je nabijheid of ruimte?", "Neem alle tijd", "Ik blijf even dichtbij"],
      },
    ],
    discussionQuestions: [
      "Hoeveel afzondering laadt jou werkelijk op?",
      "Wat maakt ruimte veilig in plaats van afstandelijk?",
      "Hoe spreek je een terugkommoment af?",
    ],
    christianIntro: "Stilte en afzondering kunnen herstel en gebed dienen, zolang ze geen straf of vlucht worden.",
    christianPrompts: [
      "Zoek jij stilte om bij God te komen of om de ander te vermijden?",
      "Hoe geef je ruimte zonder emotioneel te verdwijnen?",
      "Wat leert Jezus' ritme van afzondering en terugkeer?",
    ],
    christianOutcome: "Jullie onderscheiden herstellende stilte van afstand en leren veilig terugkeren.",
  },
  {
    id: "humor-en-plagen",
    icon: "🎭",
    title: "Humor & plagen",
    description: "Wanneer lachen verbindt en wanneer een grap net te ver gaat.",
    prompts: [
      {
        id: "humor-trigger",
        question: "Welke grap voelt sneller onveilig?",
        options: ["Over uiterlijk", "Over familie", "Over fouten", "Waar anderen bij zijn", "Steeds hetzelfde grapje", "Sarcasme bij spanning"],
      },
      {
        id: "humor-case",
        question: "Iedereen lacht, maar jij voelt je geraakt. Wat doe je?",
        options: ["Ik lach mee", "Ik zeg meteen stop", "Ik bespreek het later", "Ik maak een grap terug", "Ik trek me terug", "Ik check de bedoeling"],
      },
      {
        id: "humor-repair",
        question: "Wat maakt herstel geloofwaardig?",
        options: ["Niet zeggen dat het maar een grap was", "Oprecht excuses", "Niet herhalen", "Er later samen om kunnen lachen", "Mijn grens onthouden", "Ook mijn gevoeligheid erkennen"],
      },
    ],
    discussionQuestions: [
      "Welke onderwerpen zijn geen publiek materiaal?",
      "Hoe merk je dat de ander niet meer meelacht?",
      "Wanneer helpt humor spanning en wanneer ontwijkt hij haar?",
    ],
    christianIntro: "Vreugde en humor zijn gaven, maar nooit ten koste van de waardigheid van de ander.",
    christianPrompts: [
      "Gebruik je humor om te verbinden of om waarheid en kwetsbaarheid te ontwijken?",
      "Hoe bewaak je de waardigheid van de ander in gezelschap?",
      "Kun je zonder verdediging stoppen wanneer een grap pijn doet?",
    ],
    christianOutcome: "Humor wordt vrijer wanneer hij vreugde brengt zonder iemand kleiner te maken.",
  },
];

