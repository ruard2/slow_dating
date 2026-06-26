export interface Vraag {
  id: string;
  n: 1 | 2 | 3;
  cat: string;
  type: string;
  v: string;
  f?: string;
}

export interface QuizVraag {
  id: string;
  cat: string;
  v: string;
}

export const CAT_LABELS: Record<string, string> = {
  humor: "Humor",
  smaak: "Smaak",
  dagelijks: "Dagelijks",
  dromen: "Dromen",
  waarden: "Waarden",
  jeugd: "Jeugd",
  liefde: "Liefde",
  angst: "Kwetsbaarheid",
  diepte: "Verdieping",
  werk: "Werk",
  karakter: "Karakter",
  relatie: "Relatie",
  hechting: "Hechting",
  conflict: "Conflict",
  emoties: "Emoties",
  praktisch: "Praktisch",
  communicatie: "Communicatie",
  schaamte: "Schaamte",
};

export const NIVEAU_LABELS = ["", "Luchtig", "Persoonlijk", "Verdiepend"] as const;

export const KENNISMAKING_VRAGEN: Vraag[] = [
  // Niveau 1
  { id: "k001", n: 1, cat: "humor", type: "open", v: "Als jij een dier was, welk dier zou je zijn en waarom?" },
  { id: "k002", n: 1, cat: "smaak", type: "of-of", v: "Zoet of hartig? Koffie of thee? En heb je daar altijd zo over gedacht?" },
  { id: "k003", n: 1, cat: "dagelijks", type: "open", v: "Hoe ziet jouw perfecte zondagochtend eruit?" },
  { id: "k004", n: 1, cat: "humor", type: "open", v: "Wat is het meest bizarre talent dat je hebt — iets wat niemand van je verwacht?" },
  { id: "k005", n: 1, cat: "dromen", type: "open", v: "Als je morgen een jaar vrij had en geld geen rol speelde, wat zou je doen?" },
  { id: "k006", n: 1, cat: "smaak", type: "open", v: "Welk liedje staat er altijd op als je alleen thuis bent?" },
  { id: "k007", n: 1, cat: "humor", type: "open", v: "Wat is het onhandigste wat je ooit hebt gedaan in het bijzijn van iemand die je wilde imponeren?" },
  { id: "k008", n: 1, cat: "dagelijks", type: "open", v: "Ben je iemand die de wekker op de snooze zet, of spring je er meteen uit?" },
  { id: "k009", n: 1, cat: "dromen", type: "open", v: "Welke plek op aarde wil je ooit nog een keer bezoeken, en waarom juist die?" },
  { id: "k010", n: 1, cat: "humor", type: "of-of", v: "Strandvakantie of bergwandeling? En wat zegt dat over jou, denk je?" },
  { id: "k011", n: 1, cat: "smaak", type: "open", v: "Wat is het laatste boek of de laatste serie waar je echt in opging?" },
  { id: "k012", n: 1, cat: "dagelijks", type: "open", v: "Hoe laad jij jezelf op als je uitgeput bent?" },
  { id: "k013", n: 1, cat: "humor", type: "open", v: "Wat is iets wat de meeste mensen leuk vinden maar jij stiekem niet?" },
  { id: "k014", n: 1, cat: "dromen", type: "open", v: "Als je als kind gevraagd werd wat je later wilde worden — klopte dat een beetje?" },
  { id: "k015", n: 1, cat: "smaak", type: "rangschik", v: "Rangschik: Netflix avond thuis, avondje uit met vrienden, avontuur buitenshuis. Wat kiest jouw hart?" },
  { id: "k016", n: 1, cat: "dagelijks", type: "open", v: "Ben je iemand die zijn telefoon altijd bij zich heeft of ben je er soms bewust van weg?" },
  { id: "k017", n: 1, cat: "humor", type: "open", v: "Wat is het meest absurde iets waar je ooit geld aan hebt uitgegeven en niet spijt van had?" },
  { id: "k018", n: 1, cat: "dromen", type: "open", v: "Als jij een restaurant zou openen, wat voor restaurant zou dat zijn?" },
  { id: "k019", n: 1, cat: "humor", type: "of-of", v: "Laat slapen en laat opstaan, of vroeg naar bed en vroeg opstaan?" },
  { id: "k020", n: 1, cat: "dagelijks", type: "open", v: "Wat ruikt voor jou naar thuis?" },
  { id: "k073", n: 1, cat: "karakter", type: "open", v: "Hoe zou jij jouw jeugd in drie woorden omschrijven?" },
  { id: "k074", n: 1, cat: "karakter", type: "of-of", v: "Ben je meer rustig of druk? Meer spontaan of bedachtzaam?" },
  { id: "k075", n: 1, cat: "smaak", type: "of-of", v: "Houd je meer van stad, dorp, natuur of zee?" },
  { id: "k076", n: 1, cat: "dagelijks", type: "open", v: "Ben je sportief? En welke sport vind je leuk om zelf te doen of te volgen?" },
  { id: "k077", n: 1, cat: "karakter", type: "of-of", v: "Neem jij graag leiding, of werk je liever op de achtergrond?" },
  { id: "k078", n: 1, cat: "karakter", type: "of-of", v: "Werk je liever alleen of samen?" },
  { id: "k079", n: 1, cat: "relatie", type: "of-of", v: "Heb je liever veel contacten of een paar diepe contacten?" },
  { id: "k080", n: 1, cat: "relatie", type: "open", v: "Hoe laat jij merken dat je om iemand geeft?" },
  { id: "k081", n: 1, cat: "relatie", type: "open", v: "Waardoor voel jij je veilig bij iemand?" },
  { id: "k082", n: 1, cat: "karakter", type: "open", v: "Waar kun je verdrietig van worden?" },
  { id: "k083", n: 1, cat: "karakter", type: "open", v: "Waar kun je boos om worden?" },
  { id: "k084", n: 1, cat: "karakter", type: "open", v: "Kun jij makkelijk vergeven, of kost dat tijd?" },
  { id: "k085", n: 1, cat: "waarden", type: "open", v: "Wat betekent eerlijkheid voor jou?" },
  { id: "k086", n: 1, cat: "waarden", type: "open", v: "Wat betekent vertrouwen voor jou?" },
  { id: "k087", n: 1, cat: "dromen", type: "open", v: "Waar hoop je op voor de komende jaren?" },
  { id: "k088", n: 1, cat: "waarden", type: "open", v: "Wat betekent geluk voor jou?" },
  { id: "k089", n: 1, cat: "dromen", type: "open", v: "Wat zou je doen als tijd en geld geen probleem waren?" },
  { id: "k090", n: 1, cat: "jeugd", type: "open", v: "Welke periode in je leven vond je mooi? En welke vond je moeilijk?" },
  { id: "k091", n: 1, cat: "dromen", type: "open", v: "Wat hoop je dat mensen later over jou zeggen?" },
  { id: "k092", n: 1, cat: "relatie", type: "open", v: "Wat vind je het belangrijkste in een relatie?" },
  // Niveau 2
  { id: "k021", n: 2, cat: "waarden", type: "open", v: "Wat is iets wat je echt belangrijk vindt in een vriendschap, maar zelden hardop zegt?" },
  { id: "k022", n: 2, cat: "jeugd", type: "open", v: "Welke herinnering uit je jeugd komt soms zomaar in je op?" },
  { id: "k023", n: 2, cat: "dromen", type: "open", v: "Is er iets wat je ooit wilde bereiken maar op een gegeven moment losgelaten hebt? Mis je dat?" },
  { id: "k024", n: 2, cat: "waarden", type: "open", v: "Wat geeft jou energie? En wat vreet het van je — ook als het ogenschijnlijk leuk is?" },
  { id: "k025", n: 2, cat: "liefde", type: "open", v: "Hoe weet jij dat iemand van je houdt — wat doet of zegt diegene dan?" },
  { id: "k026", n: 2, cat: "dagelijks", type: "open", v: "Wanneer voel jij je het meest jezelf?" },
  { id: "k027", n: 2, cat: "jeugd", type: "open", v: "Hoe was jouw thuis toen je opgroeide? Wat nam je mee, wat liet je achter?" },
  { id: "k028", n: 2, cat: "waarden", type: "open", v: "Is er een overtuiging die je vroeger had maar nu niet meer?" },
  { id: "k029", n: 2, cat: "dromen", type: "open", v: "Waar ben je het meest trots op in je leven tot nu toe?" },
  { id: "k030", n: 2, cat: "humor", type: "open", v: "Wat is iets wat je doet als niemand kijkt?" },
  { id: "k031", n: 2, cat: "liefde", type: "open", v: "Hoe ziet een perfecte dag er voor jou uit als je samen bent met iemand?" },
  { id: "k032", n: 2, cat: "waarden", type: "open", v: "Wat vind jij de grootste verspilling van tijd? En doe je dat zelf ook soms?" },
  { id: "k033", n: 2, cat: "jeugd", type: "open", v: "Heb je een lievelingsplek uit je jeugd die je niet bent vergeten?" },
  { id: "k034", n: 2, cat: "dromen", type: "open", v: "Als je over 10 jaar terugkijkt — wat wil je dan kunnen zeggen dat je gedaan hebt?" },
  { id: "k035", n: 2, cat: "dagelijks", type: "open", v: "Wanneer had je voor het laatste het gevoel dat de tijd stilstond op een goede manier?" },
  { id: "k036", n: 2, cat: "waarden", type: "of-of", v: "Liever iemand die altijd eerlijk is maar soms pijn doet, of iemand die dingen soms voor je verzacht?" },
  { id: "k037", n: 2, cat: "liefde", type: "open", v: "Hoe reageer jij als je je verdrietig voelt — trek je je terug of zoek je contact?" },
  { id: "k038", n: 2, cat: "humor", type: "open", v: "Waar kun jij heel erg slecht tegen — iets wat anderen klein vinden maar jou echt irriteert?" },
  { id: "k039", n: 2, cat: "dromen", type: "open", v: "Is er een versie van jezelf die je altijd voor ogen hebt gehad maar nog niet bent?" },
  { id: "k040", n: 2, cat: "waarden", type: "open", v: "Wat betekent vrijheid voor jou in het dagelijkse leven?" },
  { id: "k041", n: 2, cat: "jeugd", type: "open", v: "Wie had de meeste invloed op wie jij nu bent? Hoe dan?" },
  { id: "k042", n: 2, cat: "liefde", type: "open", v: "Hoe uit jij genegenheid het liefst — en hoe ontvang je het het liefst?" },
  { id: "k043", n: 2, cat: "humor", type: "open", v: "Welk bijdehand antwoord zit er nog steeds in je hoofd dat je niet op tijd kon bedenken?" },
  { id: "k044", n: 2, cat: "waarden", type: "open", v: "Wat is het mooiste compliment dat iemand je ooit gegeven heeft?" },
  { id: "k045", n: 2, cat: "dagelijks", type: "open", v: "Hoe ziet jouw ideale woonplek eruit over 10 jaar?" },
  { id: "k093", n: 2, cat: "dagelijks", type: "open", v: "Wanneer functioneer jij op je best?" },
  { id: "k094", n: 2, cat: "dagelijks", type: "open", v: "Wat moet een ander weten om prettig met jouw ritme samen te leven?" },
  { id: "k095", n: 2, cat: "communicatie", type: "open", v: "Wanneer voel jij dat een gesprek echt goed loopt?" },
  { id: "k096", n: 2, cat: "communicatie", type: "open", v: "Wat maakt dat jij dichtklapt in een gesprek?" },
  { id: "k097", n: 2, cat: "communicatie", type: "of-of", v: "Praat je liever meteen dingen uit, of denk je eerst een tijd na?" },
  { id: "k098", n: 2, cat: "communicatie", type: "open", v: "Wat vind jij moeilijker: zeggen wat je nodig hebt, of horen wat de ander nodig heeft?" },
  { id: "k099", n: 2, cat: "communicatie", type: "open", v: "Hoe kan iemand jou het beste aanspreken als er iets schuurt?" },
  { id: "k100", n: 2, cat: "relatie", type: "open", v: "Wanneer verandert een kennis voor jou in een echte vriend?" },
  { id: "k101", n: 2, cat: "dagelijks", type: "open", v: "Welke sociale verwachting vind jij vermoeiend?" },
  { id: "k102", n: 2, cat: "liefde", type: "open", v: "Wanneer ervaar jij nabijheid zonder dat er veel gezegd wordt?" },
  { id: "k103", n: 2, cat: "liefde", type: "open", v: "Waarin ben jij soms lastig om lief te hebben?" },
  { id: "k104", n: 2, cat: "liefde", type: "open", v: "Wat maakt dat jij je terugtrekt in een relatie?" },
  { id: "k105", n: 2, cat: "conflict", type: "open", v: "Wat is jouw eerste neiging bij spanning — praten, oplossen, vermijden of terugtrekken?" },
  { id: "k106", n: 2, cat: "conflict", type: "open", v: "Wanneer wordt een meningsverschil voor jou persoonlijk?" },
  { id: "k107", n: 2, cat: "conflict", type: "open", v: "Wat helpt jou om rustig te blijven als emoties oplopen?" },
  { id: "k108", n: 2, cat: "conflict", type: "open", v: "Welke onuitgesproken verwachting zorgt bij jou soms voor teleurstelling?" },
  { id: "k109", n: 2, cat: "emoties", type: "open", v: "Welke emotie laat jij makkelijk zien, en welke minder?" },
  { id: "k110", n: 2, cat: "emoties", type: "open", v: "Wat ligt er bij jou vaak onder boosheid?" },
  { id: "k111", n: 2, cat: "emoties", type: "open", v: "Wanneer voel jij je klein of onzeker?" },
  { id: "k112", n: 2, cat: "waarden", type: "open", v: "Hoe neem jij belangrijke beslissingen — meer vanuit je hoofd of vanuit je gevoel?" },
  { id: "k113", n: 2, cat: "waarden", type: "open", v: "Wanneer ben jij geneigd anderen tevreden te houden ten koste van jezelf?" },
  { id: "k114", n: 2, cat: "praktisch", type: "open", v: "Hoe kijk jij aan tegen sparen, uitgeven en genieten?" },
  { id: "k115", n: 2, cat: "praktisch", type: "open", v: "Wat irriteert jou sneller: slordigheid, onduidelijkheid of controle?" },
  { id: "k116", n: 2, cat: "waarden", type: "open", v: "Welke waarde wil jij niet kwijtraken als het leven druk wordt?" },
  { id: "k117", n: 2, cat: "waarden", type: "open", v: "Waar wil jij later liever niet met spijt op terugkijken?" },
  // Niveau 3
  { id: "k051", n: 3, cat: "diepte", type: "open", v: "Wat is iets wat je zelden of nooit hardop zegt, maar wel voelt?", f: "Wat houdt je tegen om het te zeggen?" },
  { id: "k052", n: 3, cat: "angst", type: "open", v: "Wat is jouw grootste angst in een intieme relatie?" },
  { id: "k053", n: 3, cat: "diepte", type: "open", v: "Wanneer voelde je je voor het laatste echt gezien door iemand?" },
  { id: "k054", n: 3, cat: "liefde", type: "open", v: "Is er iets wat je altijd wilt zeggen bij een afscheid maar zelden doet?" },
  { id: "k055", n: 3, cat: "angst", type: "open", v: "Wat is het verhaal dat je over jezelf vertelt maar eigenlijk niet meer gelooft?", f: "Welk verhaal wil je liever geloven?" },
  { id: "k056", n: 3, cat: "diepte", type: "open", v: "Hoe weet jij wanneer je iemand echt vertrouwt?" },
  { id: "k057", n: 3, cat: "liefde", type: "open", v: "Was er een moment in je leven dat je je compleet alleen voelde? Wat deed je daarmee?" },
  { id: "k058", n: 3, cat: "waarden", type: "open", v: "Wat is iets wat je echt nodig hebt in je leven maar moeilijk vindt om te vragen?" },
  { id: "k059", n: 3, cat: "angst", type: "open", v: "Wat is het ergste wat iemand over jou kan denken — en is er een kern van waarheid in?" },
  { id: "k060", n: 3, cat: "diepte", type: "open", v: "Is er iets wat je nog nooit aan iemand verteld hebt — niet omdat het geheim is, maar omdat niemand ooit vroeg?" },
  { id: "k061", n: 3, cat: "liefde", type: "open", v: "Hoe ziet liefde er voor jou uit op een gewone dinsdag?" },
  { id: "k062", n: 3, cat: "diepte", type: "open", v: "Wat heeft je gevormd dat je liever niet had meegemaakt maar ook niet meer zou missen?" },
  { id: "k063", n: 3, cat: "angst", type: "open", v: "Waarvan ben jij bang dat het nooit verandert in jezelf?" },
  { id: "k064", n: 3, cat: "liefde", type: "open", v: "Wanneer voel jij je echt geliefd? Niet in grote gebaren, maar in kleine momenten." },
  { id: "k065", n: 3, cat: "diepte", type: "open", v: "Als jij een brief aan je 15-jarige zelf kon schrijven — wat zou je zeggen?" },
  { id: "k066", n: 3, cat: "waarden", type: "open", v: "Wat wil je dat mensen zeggen op jouw begrafenis? En leef je daar al naar?" },
  { id: "k067", n: 3, cat: "liefde", type: "open", v: "Wat is het mooiste wat liefde jou ooit gegeven heeft?" },
  { id: "k068", n: 3, cat: "angst", type: "open", v: "Is er iets waarbij je altijd maar doorgaat terwijl je eigenlijk even wil stoppen?" },
  { id: "k069", n: 3, cat: "diepte", type: "open", v: "Wat maakt jou op dit moment onrustig — als je heel eerlijk bent?" },
  { id: "k070", n: 3, cat: "liefde", type: "open", v: "Hoe ziet vergeving er voor jou uit — aan iemand anders, of aan jezelf?" },
  { id: "k071", n: 3, cat: "waarden", type: "open", v: "Wat is het verschil tussen het leven dat jij leeft en het leven dat jij wíl leven?", f: "Wat houdt je tegen om dat gat te dichten?" },
  { id: "k072", n: 3, cat: "diepte", type: "open", v: "Wat moet iemand weten om jou echt te begrijpen?" },
  { id: "k118", n: 3, cat: "diepte", type: "open", v: "Welke kant van jezelf laat je minder snel zien, zelfs aan mensen die dichtbij komen?" },
  { id: "k119", n: 3, cat: "diepte", type: "open", v: "Wanneer trek jij je terug, terwijl je eigenlijk verbinding zoekt?" },
  { id: "k120", n: 3, cat: "diepte", type: "open", v: "Welke behoefte vind jij moeilijk om rechtstreeks uit te spreken?" },
  { id: "k121", n: 3, cat: "diepte", type: "open", v: "Wat bescherm jij in jezelf door sterk, grappig, stil of druk te worden?" },
  { id: "k122", n: 3, cat: "diepte", type: "open", v: "Wanneer merk jij verschil tussen hoe je overkomt en hoe je je echt voelt?" },
  { id: "k123", n: 3, cat: "hechting", type: "open", v: "Wat maakt het voor jou spannend om iemand echt dichtbij te laten komen?" },
  { id: "k124", n: 3, cat: "hechting", type: "open", v: "Wanneer verlang je naar nabijheid, maar gedraag je je juist onafhankelijk?" },
  { id: "k125", n: 3, cat: "hechting", type: "open", v: "Wat zou iemand moeten begrijpen over jouw manier van hechten?" },
  { id: "k126", n: 3, cat: "conflict", type: "open", v: "Wanneer zeg jij 'het geeft niet', terwijl het wel iets met je doet?" },
  { id: "k127", n: 3, cat: "conflict", type: "open", v: "Wat vind jij moeilijker: sorry zeggen, sorry ontvangen of opnieuw vertrouwen?" },
  { id: "k128", n: 3, cat: "diepte", type: "open", v: "Welke strijd voer je soms onder de oppervlakte, zonder dat de ander het weet?" },
  { id: "k129", n: 3, cat: "conflict", type: "open", v: "Wanneer word jij harder dan je eigenlijk wilt zijn?" },
  { id: "k130", n: 3, cat: "liefde", type: "open", v: "Wat betekent liefde voor jou wanneer het gevoel tijdelijk minder sterk is?" },
  { id: "k131", n: 3, cat: "liefde", type: "open", v: "Wanneer voelt trouw voor jou als vrijheid, en wanneer als druk?" },
  { id: "k132", n: 3, cat: "liefde", type: "open", v: "Wat maakt dat jij je gekozen voelt?" },
  { id: "k133", n: 3, cat: "diepte", type: "open", v: "Waar ligt bij jou de grens tussen aanpassen en jezelf verliezen?" },
  { id: "k134", n: 3, cat: "angst", type: "open", v: "Welke grens stel je te laat omdat je de sfeer goed wilt houden?" },
  { id: "k135", n: 3, cat: "angst", type: "open", v: "Wat heb jij nodig om nee te zeggen zonder je meteen schuldig te voelen?" },
  { id: "k136", n: 3, cat: "jeugd", type: "open", v: "Welke ervaring heeft jou voorzichtiger gemaakt in contact met mensen?" },
  { id: "k137", n: 3, cat: "jeugd", type: "open", v: "Welke oude pijn kan in nieuwe situaties onverwacht meespelen?" },
  { id: "k138", n: 3, cat: "jeugd", type: "open", v: "Welke boodschap kreeg je vroeger mee zonder dat iemand die letterlijk uitsprak?" },
  { id: "k139", n: 3, cat: "diepte", type: "open", v: "Waar verlang je naar, maar durf je niet te snel op te hopen?" },
  { id: "k140", n: 3, cat: "dromen", type: "open", v: "Welke droom heb je misschien begraven omdat hij te kwetsbaar voelde?" },
  { id: "k141", n: 3, cat: "schaamte", type: "open", v: "Waarover schaam jij je sneller dan nodig is?" },
  { id: "k142", n: 3, cat: "schaamte", type: "open", v: "Welke complimenten kun je moeilijk ontvangen omdat ze dichtbij komen?" },
  { id: "k143", n: 3, cat: "schaamte", type: "open", v: "Wanneer verberg jij teleurstelling om niet behoeftig te lijken?" },
  { id: "k144", n: 3, cat: "diepte", type: "open", v: "Wat zou je willen kunnen zeggen zonder bang te zijn dat het te veel is?" },
  { id: "k145", n: 3, cat: "diepte", type: "open", v: "Wat zou een ander aan jou mogen spiegelen als dat liefdevol gebeurt?" },
];

export const QUIZ_VRAGEN: QuizVraag[] = [
  { id: "q001", cat: "smaak", v: "Wat is mijn absolute lievelingseten?" },
  { id: "q002", cat: "smaak", v: "Welk liedje zet ik op als ik me goed voel?" },
  { id: "q003", cat: "angst", v: "Waar ben ik stiekem een beetje bang voor?" },
  { id: "q004", cat: "dagelijks", v: "Wat is mijn ochtendgewoonste die ik bijna nooit overla?" },
  { id: "q005", cat: "smaak", v: "Welke film kan ik keer op keer kijken?" },
  { id: "q006", cat: "humor", v: "Wat is mijn meest terugkerende irritatie in het dagelijkse leven?" },
  { id: "q007", cat: "dromen", v: "Welk land staat bovenaan mijn verlanglijstje?" },
  { id: "q008", cat: "smaak", v: "Koffie of thee — en hoe drink ik het het liefst?" },
  { id: "q009", cat: "dagelijks", v: "Hoe laat ga ik normaal naar bed?" },
  { id: "q010", cat: "humor", v: "Wat is mijn guilty pleasure die ik normaal verberg?" },
  { id: "q011", cat: "liefde", v: "Hoe wil ik het liefst getroost worden als ik me slecht voel?" },
  { id: "q012", cat: "dromen", v: "Welk beroep had ik als kind altijd willen hebben?" },
  { id: "q013", cat: "smaak", v: "Wat is mijn favoriete seizoen en waarom?" },
  { id: "q014", cat: "dagelijks", v: "Hoe besteed ik mijn vrije zondagochtend het liefst?" },
  { id: "q015", cat: "humor", v: "Wat is mijn meest bizarre, onaantrekkelijke gewoonte?" },
  { id: "q016", cat: "dromen", v: "Als ik morgen mocht stoppen met werken, wat zou ik dan doen?" },
  { id: "q017", cat: "waarden", v: "Wat is voor mij het allerbelangrijkste in een relatie?" },
  { id: "q018", cat: "smaak", v: "Welk type restaurant ga ik altijd graag naartoe?" },
  { id: "q019", cat: "angst", v: "Wat vind ik echt moeilijk — iets wat me regelmatig raakt?" },
  { id: "q020", cat: "humor", v: "Waar kan ik echt niet bij stilstaan zonder te lachen?" },
  { id: "q021", cat: "jeugd", v: "Wat is een herinnering uit mijn jeugd die ik steeds opnieuw vertel?" },
  { id: "q022", cat: "dagelijks", v: "Hoe reageer ik als ik gestrest ben — trek ik me terug of zoek ik afleiding?" },
  { id: "q023", cat: "smaak", v: "Welke serie of film kan ik maar niet afkrijgen maar stop toch niet?" },
  { id: "q024", cat: "dromen", v: "Wat is mijn geheime talent waar ik een beetje trots op ben?" },
  { id: "q025", cat: "waarden", v: "Wat is iets wat ik absoluut niet kan vergeven?" },
  { id: "q026", cat: "humor", v: "Wat doe ik als niemand kijkt en ik alleen thuis ben?" },
  { id: "q027", cat: "liefde", v: "Hoe geef ik het liefst liefde — wat doe ik dan?" },
  { id: "q028", cat: "smaak", v: "Welk gerecht maak ik als ik iemand wil imponeren?" },
  { id: "q029", cat: "dagelijks", v: "Wat is mijn favoriete plek in huis om te ontspannen?" },
  { id: "q030", cat: "angst", v: "Waar word ik 's nachts wakker van als het niet goed gaat?" },
  { id: "q031", cat: "humor", v: "Wat is het gekste wat ik ooit gekocht heb?" },
  { id: "q032", cat: "waarden", v: "Wat is voor mij echte vriendschap — in één zin?" },
  { id: "q033", cat: "dromen", v: "Welk boek heeft mij het meest veranderd of geraakt?" },
  { id: "q034", cat: "smaak", v: "Waar doe ik het liefst boodschappen?" },
  { id: "q035", cat: "dagelijks", v: "Hoe weet je dat ik een slechte dag heb — wat doe ik dan?" },
  { id: "q036", cat: "humor", v: "Wat is mijn standaardreactie als ik iets niet weet?" },
  { id: "q037", cat: "liefde", v: "Hoe zie ik mijn ideale avond eruit als ik thuis ben met een geliefde?" },
  { id: "q038", cat: "dromen", v: "Wat is een droom die ik nog niet hardop heb uitgesproken?" },
  { id: "q039", cat: "smaak", v: "Sport kijken of zelf sporten — en wat dan?" },
  { id: "q040", cat: "waarden", v: "Wat is voor mij absoluut niet onderhandelbaar in mijn leven?" },
  { id: "q041", cat: "humor", v: "Welk woord of uitdrukking gebruik ik te veel?" },
  { id: "q042", cat: "jeugd", v: "Welk karakter uit een film of boek vond ik vroeger mijn held?" },
  { id: "q043", cat: "dagelijks", v: "Hoe zie mijn ideale werkdag eruit?" },
  { id: "q044", cat: "angst", v: "Wat is het ergste scenario dat soms door mijn hoofd schiet?" },
  { id: "q045", cat: "smaak", v: "Welk land of welke cultuur fascineert me het meest?" },
  { id: "q046", cat: "humor", v: "Wat is mijn meest embarrassing moment dat ik inmiddels grappig vind?" },
  { id: "q047", cat: "liefde", v: "Hoe toon ik dat ik iemand vertrouw — wat doe ik dan meer?" },
  { id: "q048", cat: "dromen", v: "Als ik een extra leven had, wat voor leven zou dat zijn?" },
  { id: "q049", cat: "waarden", v: "Wat is iets waarop ik nooit compromis sluit?" },
  { id: "q050", cat: "dagelijks", v: "Wat is het eerste dat ik doe als ik thuiskom?" },
  { id: "q051", cat: "humor", v: "Welke geluiden kan ik écht niet uitstaan?" },
  { id: "q052", cat: "smaak", v: "Zoet of hartig ontbijt?" },
  { id: "q053", cat: "jeugd", v: "Wat was mijn lievelingssnoep als kind?" },
  { id: "q054", cat: "liefde", v: "Wat wil ik dat een partner altijd onthoudt over mij?" },
  { id: "q055", cat: "dromen", v: "Wat is het project of plan dat al jaren in mijn hoofd zit?" },
];

export function seededShuffle<T>(arr: T[], seed: number): T[] {
  const result = [...arr];
  let s = seed;
  for (let i = result.length - 1; i > 0; i--) {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    const j = Math.abs(s) % (i + 1);
    [result[i], result[j]] = [result[j]!, result[i]!];
  }
  return result;
}

export function getKaartQueue(seed: number, niveau: number): Vraag[] {
  const pool = KENNISMAKING_VRAGEN.filter((q) => q.n <= niveau);
  return seededShuffle(pool, seed).slice(0, 12);
}

export function getQuizQueue(seed: number): QuizVraag[] {
  return seededShuffle(QUIZ_VRAGEN, seed).slice(0, 10);
}

export function getRaadQueue(seed: number, niveau: number): Vraag[] {
  const pool = KENNISMAKING_VRAGEN.filter((q) => q.n <= niveau);
  return seededShuffle(pool, seed).slice(0, 8);
}

export function computeNiveau(duur: number, kennis: number): 1 | 2 | 3 {
  const avg = Math.round((duur + kennis) / 2);
  return Math.max(1, Math.min(3, avg)) as 1 | 2 | 3;
}
