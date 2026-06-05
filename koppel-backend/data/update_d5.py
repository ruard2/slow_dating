# -*- coding: utf-8 -*-
import json, sys
sys.stdout.reconfigure(encoding='utf-8')

with open('cases.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

cases = data['cases']

D5_CASES = {

"D5_POSITIVE_001": {
  "questions": [
    {
      "question_id": "q1_reaction",
      "step": "reaction",
      "prompt": "Wat doet het met jou als je partner jou bedankt voor iets gewoons?",
      "helper_text": "Kies wat het meest herkenbaar is, niet wat het netst klinkt.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Ik word warm vanbinnen — het kleine bedankje zegt meer dan de woorden.", "tags": {"needs.recognition": 2, "needs.attention": 1}},
        {"option_id": "B", "label": "Ik voel opluchting — ik had er niet op gerekend maar had het wel nodig.", "tags": {"needs.recognition": 2, "sensitive_points.not_seen": 1}},
        {"option_id": "C", "label": "Ik wuif het weg — dat hoeft niet, dat doe ik toch altijd.", "tags": {"protections.minimize": 2, "needs.recognition": 1}},
        {"option_id": "D", "label": "Ik word verlegen — erkenning ontvangen is voor mij niet vanzelfsprekend.", "tags": {"skills.vulnerability": 1, "needs.recognition": 1}},
        {"option_id": "E", "label": "Ik merk nauwelijks iets — dankzeggen vind ik normaal tussen partners.", "tags": {"needs.connection": 1, "needs.stability": 1}}
      ]
    },
    {
      "question_id": "q2_need",
      "step": "need",
      "prompt": "Wat heeft gezien worden voor kleine dingen voor jou?",
      "helper_text": "Niet wat je denkt dat je zou moeten willen — wat helpt jou echt?",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Het zegt: jij telt, ook als je niets buitengewoons doet.", "tags": {"needs.recognition": 3, "needs.attention": 1}},
        {"option_id": "B", "label": "Het geeft energie — erkend worden vult op wat geven kost.", "tags": {"needs.recognition": 2, "centers.body": 1}},
        {"option_id": "C", "label": "Het bouwt vertrouwen — ik weet dat ik niet onzichtbaar ben.", "tags": {"needs.recognition": 2, "needs.safety": 1}},
        {"option_id": "D", "label": "Het maakt mij zachter — kritiek of stress zinkt weg als ik me gezien voel.", "tags": {"needs.recognition": 2, "needs.reassurance": 1}},
        {"option_id": "E", "label": "Eerlijk gezegd niet zo veel — ik doe het niet voor de erkenning.", "tags": {"needs.autonomy": 1, "needs.freedom": 1}}
      ]
    }
  ],
  "outputs": {
    "solo": {
      "mirror": "Een simpel dankjewel voor iets gewoons — en toch doet het iets. Jouw reactie laat zien hoeveel erkenning voor jou betekent. Niet als ijdelheid, maar als brandstof.",
      "protection_reflection": "Wegwuiven of zeggen 'dat doe ik toch altijd' beschermt jou tegen kwetsbaarheid: als ik het klein maak, kan ik niet teleurgesteld worden als het volgende keer uitblijft.",
      "need_reflection": "Jij hebt behoefte aan erkenning die het gewone ziet. Niet alleen de grote prestaties — ook de dingen die elke dag gebeuren zonder applaus.",
      "chance": "Dit moment laat zien dat waardering niet groot hoeft te zijn. Klein en echt is genoeg.",
      "challenge": "Kun jij het bedankje volledig binnenlaten — zonder het meteen kleiner te maken?",
      "experiment": "Bedank je partner deze week voor één klein ding — en ontvang het ook als je partner het doet. Kijk wat het verschil maakt.",
      "gentle_phrase": "Jij doet veel zonder dat je het uitschreeuwt. Dat mag gezien worden."
    },
    "couple": {
      "comparison_intro": "Bedanken en bedankt worden — jullie kunnen hier heel anders in zitten.",
      "what_a_may_hear": "A voelt de erkenning — maar weet soms niet hoe dat te ontvangen. Dat is geen ondankbaarheid, dat is onwennigheid.",
      "what_b_may_hear": "B zei dankjewel — en misschien is het voor B normaal, terwijl A het als bijzonder ervaart.",
      "what_each_protects": "A beschermt zichzelf door erkenning klein te maken. B beschermt zichzelf door erkenning te geven als iets vanzelfsprekends.",
      "shared_chance": "Ontdekken wat voor ieder van jullie de taal van waardering is.",
      "shared_challenge": "Hoe houden jullie erkenning levend als de routine toeslaat?",
      "shared_experiment": "Zeg deze week elke dag één concreet dankjewel — voor iets kleins. Kijk wat het met jullie doet."
    }
  }
},

"D5_POSITIVE_002": {
  "questions": [
    {
      "question_id": "q1_emotion",
      "step": "emotion",
      "prompt": "Wat voel je als je partner de onzichtbare last benoemt die jij draagt?",
      "helper_text": "Kies wat het meest herkenbaar is, niet wat het netst klinkt.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Opluchting — eindelijk. Ik had niet geweten hoe groot het was tot het gezegd werd.", "tags": {"needs.recognition": 2, "sensitive_points.not_seen": 2}},
        {"option_id": "B", "label": "Emotie die ik niet verwachtte — de erkenning raakt dieper dan de woorden.", "tags": {"needs.recognition": 3, "centers.body": 1}},
        {"option_id": "C", "label": "Dankbaarheid en tegelijk een lichte schaamte — ik had het eerder moeten zeggen.", "tags": {"needs.recognition": 2, "protections.appease": 1}},
        {"option_id": "D", "label": "Een lichte wantrouwigheid — klopt dit, of wordt er iets goed gemaakt?", "tags": {"needs.reassurance": 1, "protections.control": 1}},
        {"option_id": "E", "label": "Rust — het benoemen van wat ik draag geeft me al iets terug.", "tags": {"needs.recognition": 2, "needs.safety": 1}}
      ]
    },
    {
      "question_id": "q2_interpretation",
      "step": "interpretation",
      "prompt": "Wat zegt dit moment van erkenning over jullie relatie?",
      "helper_text": "Wat maak jij hiervan — los van wat je zou 'moeten' denken?",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Het zegt dat jij écht kijkt — niet alleen naar wat klaar is maar naar wat het kostte.", "tags": {"needs.recognition": 3, "needs.attention": 1}},
        {"option_id": "B", "label": "Het zegt dat wij kunnen praten over wat onzichtbaar is.", "tags": {"needs.honesty": 2, "needs.connection": 1}},
        {"option_id": "C", "label": "Het geeft mij hoop — misschien hoef ik het niet altijd alleen te dragen.", "tags": {"needs.recognition": 2, "needs.stability": 1}},
        {"option_id": "D", "label": "Het voelt als begin — ik wil dat dit vaker zo gaat.", "tags": {"needs.recognition": 2, "needs.reassurance": 1}},
        {"option_id": "E", "label": "Het is fijn — maar het lost de last zelf niet op.", "tags": {"needs.recognition": 1, "needs.stability": 2}}
      ]
    }
  ],
  "outputs": {
    "solo": {
      "mirror": "Gezien worden in wat je draagt — niet alleen in wat je doet. Jij merkt hoe erkenning van de onzichtbare last anders aankomt dan een dankjewel voor de resultaten.",
      "protection_reflection": "Pas durven voelen hoe zwaar het was nadat iemand het benoemt — dat is hoe goed jij gewend bent het te dragen zonder te laten merken.",
      "need_reflection": "Jij hebt behoefte aan een partner die ziet wat achter de taken zit. Niet alleen de output — ook de energie die het kost.",
      "chance": "Dit moment opent een gesprek over verdeling dat anders misschien nooit komt.",
      "challenge": "Kun jij de volgende keer de last benoemen vóórdat je erdoor omvalt?",
      "experiment": "Zeg deze week één keer: 'Ik denk al een tijdje aan... en ik merk dat het energie kost.' Geen klacht — gewoon benoemen.",
      "gentle_phrase": "Wat jij draagt telt, ook als niemand het ziet. Maar het mag gezien worden."
    },
    "couple": {
      "comparison_intro": "Mentale last is onzichtbaar — tenzij je er namen voor vindt.",
      "what_a_may_hear": "A draagt veel zonder het te benoemen. Erkenning ervan is voor A meer dan een compliment — het is een bewijs van gezien zijn.",
      "what_b_may_hear": "B heeft iets opgemerkt en het benoemd. Dat vraagt aandacht. Maar begrijpt B ook wat dit voor A opent?",
      "what_each_protects": "A beschermt zichzelf door te dragen zonder te klagen. B beschermt zichzelf door erkenning te geven als gebaar.",
      "shared_chance": "Samen zichtbaar maken wat onzichtbaar is: wie denkt aan wat? Wie regelt wat?",
      "shared_challenge": "Hoe maakt B dit patroon van erkenning duurzaam, niet incidenteel?",
      "shared_experiment": "Maak samen een 'mentale last-check': vraag elke week: 'Wat draag jij dat ik niet zie?'"
    }
  }
},

"D5_POSITIVE_003": {
  "questions": [
    {
      "question_id": "q1_emotion",
      "step": "emotion",
      "prompt": "Wat gebeurt er vanbinnen als iemand iets zegt over wie je bent, niet alleen over wat je doet?",
      "helper_text": "Kies wat het meest herkenbaar is, niet wat het netst klinkt.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Ik word geraakt — dit raakt dieper dan een compliment over mijn acties.", "tags": {"needs.recognition": 3, "centers.body": 1}},
        {"option_id": "B", "label": "Ik word verlegen — ik weet niet hoe ik dit moet ontvangen.", "tags": {"skills.vulnerability": 1, "needs.recognition": 1}},
        {"option_id": "C", "label": "Ik voel iets ontspannen — alsof ik even niet hoef te presteren.", "tags": {"needs.recognition": 2, "sensitive_points.not_enough": 1}},
        {"option_id": "D", "label": "Ik twijfel — klopt dit beeld? Zie jij mij echt zo?", "tags": {"needs.reassurance": 1, "needs.recognition": 2}},
        {"option_id": "E", "label": "Ik voel dankbaarheid maar ook druk — dit beeld moet ik waarmaken.", "tags": {"needs.recognition": 1, "sensitive_points.not_enough": 2}}
      ]
    },
    {
      "question_id": "q2_need",
      "step": "need",
      "prompt": "Wat heeft dit soort erkenning voor jou?",
      "helper_text": "Niet wat je denkt dat je zou moeten willen — wat helpt jou echt?",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Het geeft mij het gevoel dat ik er mag zijn, niet alleen vanwege wat ik doe.", "tags": {"needs.recognition": 3, "sensitive_points.not_enough": 1}},
        {"option_id": "B", "label": "Het raakt iets ouds — een behoefte die er al lang is maar zelden gevuld wordt.", "tags": {"needs.recognition": 2, "sensitive_points.not_seen": 2}},
        {"option_id": "C", "label": "Het helpt mij geloven in wie ik ben als de twijfel opkomt.", "tags": {"needs.recognition": 2, "needs.reassurance": 1}},
        {"option_id": "D", "label": "Het doet mij weten dat jij mij werkelijk ziet — niet een versie van mij.", "tags": {"needs.recognition": 3, "needs.honesty": 1}},
        {"option_id": "E", "label": "Eerlijk gezegd niet zo veel — ik vind erkenning voor karakter wat abstract.", "tags": {"needs.stability": 1, "needs.autonomy": 1}}
      ]
    }
  ],
  "outputs": {
    "solo": {
      "mirror": "Erkenning voor wie je bent raakt anders dan lof voor wat je deed. Jij hoeft niet te presteren om het te verdienen — het was er al.",
      "protection_reflection": "Verlegen worden, twijfelen of het klopt, of de druk voelen om het beeld waar te maken — dat zijn manieren om afstand te houden van iets dat te goed voelt. Als ik het niet volledig ontvang, kan het me ook niet kwetsen als het wegvalt.",
      "need_reflection": "Jij hebt behoefte aan gezien worden in wie je bent — los van prestaties, hulp of rollen. Dat is een fundamentele behoefte die veel mensen nooit uitspreken.",
      "chance": "Dit moment nodigt jou uit om een compliment te ontvangen zonder het meteen te verklaren.",
      "challenge": "Kun jij 'dankjewel' zeggen zonder eraan toe te voegen dat het wel meeviel?",
      "experiment": "Schrijf één eigenschap van jezelf op die jij zelf ook erkent. Hardop zeggen mag ook.",
      "gentle_phrase": "Jij bent meer dan wat je doet. Dat mag je weten."
    },
    "couple": {
      "comparison_intro": "Complimenten voor karakter zijn zeldzamer dan dankjewel voor taken — en raken meer.",
      "what_a_may_hear": "A hoort iets over wie hij/zij is. Dat raakt dieper dan een praktisch bedankje — en kan ook meer kwetsbaarheid oproepen.",
      "what_b_may_hear": "B heeft iets benoemd over A's karakter. Begrijpt B hoe groot dit kan zijn voor A?",
      "what_each_protects": "A beschermt zichzelf door het compliment kleiner te maken. B beschermt zichzelf door het te zeggen als een observatie.",
      "shared_chance": "Samen leren: iets zeggen over wie de ander is — niet alleen wat hij/zij doet.",
      "shared_challenge": "Hoe maakt B dit tot een patroon, niet een incident?",
      "shared_experiment": "Zeg deze week één keer iets over een eigenschap van de ander die jij bewondert. Concreet en echt."
    }
  }
},

"D5_POSITIVE_004": {
  "questions": [
    {
      "question_id": "q1_reaction",
      "step": "reaction",
      "prompt": "Wat doet het met jou als je hulp vraagt en het wordt gegeven?",
      "helper_text": "Kies wat het meest herkenbaar is, niet wat het netst klinkt.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Opluchting — ik hoef het niet altijd alleen te dragen.", "tags": {"needs.recognition": 1, "needs.stability": 2}},
        {"option_id": "B", "label": "Dankbaarheid en een klein gevoel van winnen op mezelf — vragen was moeilijk.", "tags": {"skills.vulnerability": 2, "needs.recognition": 1}},
        {"option_id": "C", "label": "Rust — verantwoordelijkheid gedeeld voelen geeft ademruimte.", "tags": {"needs.stability": 2, "needs.freedom": 1}},
        {"option_id": "D", "label": "Blijdschap maar ook een beetje vreemd — ik ben gewend het zelf te doen.", "tags": {"protections.overperform": 1, "needs.recognition": 1}},
        {"option_id": "E", "label": "Ik voel weinig extra — ik had gewoon hulp nodig en ik vroeg het.", "tags": {"needs.autonomy": 1, "needs.stability": 1}}
      ]
    },
    {
      "question_id": "q2_interpretation",
      "step": "interpretation",
      "prompt": "Wat zegt dit moment van gedeelde verantwoordelijkheid over jullie?",
      "helper_text": "Wat maak jij hiervan — los van wat je zou 'moeten' denken?",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Het zegt dat we allebei de last kunnen dragen — niet alleen ik.", "tags": {"needs.stability": 2, "needs.connection": 1}},
        {"option_id": "B", "label": "Het zegt dat ik meer mag vragen — dat het welkom is.", "tags": {"needs.recognition": 1, "needs.safety": 2}},
        {"option_id": "C", "label": "Het geeft mij hoop dat de verdeling kan veranderen.", "tags": {"needs.stability": 2, "needs.reassurance": 1}},
        {"option_id": "D", "label": "Het zegt dat ik de ander niet hoef te ontzien als ik steun nodig heb.", "tags": {"needs.recognition": 1, "skills.communication": 1}},
        {"option_id": "E", "label": "Het laat zien dat samen niet automatisch gaat — het vraagt actie van ons allebei.", "tags": {"needs.stability": 1, "needs.honesty": 1}}
      ]
    }
  ],
  "outputs": {
    "solo": {
      "mirror": "Hulp vragen en het ontvangen — dat klinkt simpel maar vraagt iets. Jij hebt de stap gezet. En het werkte.",
      "protection_reflection": "Gewend zijn het zelf te doen beschermt jou tegen teleurstelling als hulp uitblijft. Maar het maakt vragen ook steeds moeilijker — totdat de bitterheid groter wordt dan de behoefte.",
      "need_reflection": "Jij hebt behoefte aan gedeelde verantwoordelijkheid — niet als oplossing voor alles, maar als bewijs dat jij niet alleen staat.",
      "chance": "Dit moment bewijst dat vragen loont. Je hoeft niet alles te dragen om een goede partner te zijn.",
      "challenge": "Kun jij hulp vragen vóórdat je over je grens bent?",
      "experiment": "Vraag deze week één keer iets concreets. Niet vaag, niet als hint — gewoon direct: 'Kun jij dit voor mij doen?'",
      "gentle_phrase": "Hulp vragen is geen falen. Het is verbinden."
    },
    "couple": {
      "comparison_intro": "Hulp vragen en geven — voor jullie allebei een eigen verhaal.",
      "what_a_may_hear": "A heeft gevraagd — en dat was niet vanzelfsprekend. De stap zelf verdient erkenning.",
      "what_b_may_hear": "B heeft geholpen. Maar weet B ook hoe groot het was voor A om te vragen?",
      "what_each_protects": "A beschermt zichzelf door niet te vragen. B beschermt zichzelf door te wachten tot er gevraagd wordt.",
      "shared_chance": "Samen een norm maken: vragen is welkom. Niet wachten tot het over gaat.",
      "shared_challenge": "Hoe maakt A het makkelijker om te vragen? Hoe maakt B het makkelijker om aan te bieden?",
      "shared_experiment": "Spreek af: vraag deze week allebei één keer concreet om iets. Kijk hoe dat voelt."
    }
  }
},

"D5_TENSION_001": {
  "questions": [
    {
      "question_id": "q1_emotion",
      "step": "emotion",
      "prompt": "Wat voel je als alles loopt maar niemand het opmerkt?",
      "helper_text": "Kies wat het meest herkenbaar is, niet wat het netst klinkt.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Bitterheid — ik doe dit ook voor hen, maar niemand ziet het.", "tags": {"sensitive_points.not_seen": 2, "needs.recognition": 2}},
        {"option_id": "B", "label": "Vermoeidheid — ik doe het maar weet niet meer waarom.", "tags": {"needs.recognition": 2, "protections.overperform": 1}},
        {"option_id": "C", "label": "Woede die ik niet mag voelen — want ik deed het toch vrijwillig?", "tags": {"sensitive_points.not_seen": 2, "needs.recognition": 1}},
        {"option_id": "D", "label": "Verdriet — ik wil gezien worden maar vraag er ook niet om.", "tags": {"sensitive_points.not_seen": 2, "needs.recognition": 2}},
        {"option_id": "E", "label": "Ik merk er weinig van — ik doe het niet voor de erkenning.", "tags": {"needs.autonomy": 1, "needs.freedom": 1}}
      ]
    },
    {
      "question_id": "q2_interpretation",
      "step": "interpretation",
      "prompt": "Wat hoor jij vanbinnen in de stilte na een dag waarop jij veel droeg?",
      "helper_text": "Wat maak jij hiervan — los van wat je zou 'moeten' denken?",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Ik hoor: ik doe dit toch voor jullie, zie je het dan niet?", "tags": {"sensitive_points.not_seen": 2, "needs.recognition": 2}},
        {"option_id": "B", "label": "Ik hoor mijn eigen vraag: waarom doe ik dit eigenlijk?", "tags": {"needs.recognition": 2, "needs.autonomy": 1}},
        {"option_id": "C", "label": "Ik hoor iets ouds: ik moet presteren om te mogen bestaan.", "tags": {"sensitive_points.not_enough": 3, "protections.overperform": 1}},
        {"option_id": "D", "label": "Ik hoor: ik ben de enige die het ziet. Dat is eenzaam.", "tags": {"sensitive_points.not_seen": 2, "needs.connection": 1}},
        {"option_id": "E", "label": "Ik hoor een sluimerende verandering — ooit ga ik hiermee stoppen.", "tags": {"protections.withdraw": 1, "needs.recognition": 2}}
      ]
    }
  ],
  "outputs": {
    "solo": {
      "mirror": "Alles loopt — en dat is deels jouw verdienste. Maar als de stilte klinkt als onzichtbaarheid, is er meer aan de hand dan eerlijkheid over taken.",
      "protection_reflection": "Doorgaan zonder te vragen beschermt jou tegen de kwetsbaarheid van: ik wil iets en ik weet niet of ik het krijg. Maar het laat ook toe dat de situatie in stand blijft.",
      "need_reflection": "Jij hebt behoefte aan erkenning voor wat je draagt — niet alleen als het spectaculair is. Het gewone verdient ook aandacht.",
      "chance": "De bitterheid is een signaal, geen probleem. Hij zegt: ik heb iets nodig dat ik nog niet gevraagd heb.",
      "challenge": "Kun jij iets vragen wat jij normaal verwacht dat de ander vanzelf zou zien?",
      "experiment": "Zeg één keer concreet: 'Ik heb vandaag veel geregeld en ik zou het fijn vinden als je dat even erkent.' En kijk wat er dan gebeurt.",
      "gentle_phrase": "Onzichtbaar zijn is pijn. Jij mag het benoemen."
    },
    "couple": {
      "comparison_intro": "Wat jij draagt en wat de ander ziet — dat kan een grote kloof zijn.",
      "what_a_may_hear": "A draagt veel en voelt de bitterheid van onzichtbaarheid. Dat is niet overdreven — dat is een signaal dat er iets mist.",
      "what_b_may_hear": "B merkt niet wat A draagt — misschien omdat A het niet benoemt, of omdat B gewend is dat het loopt.",
      "what_each_protects": "A beschermt zichzelf door door te gaan. B beschermt zichzelf door niet te kijken wat er achter de gladde organisatie zit.",
      "shared_chance": "Samen zichtbaar maken: wie doet wat, en wat kost het?",
      "shared_challenge": "Hoe maakt A ruimte om het te zeggen zonder het als aanval te framen? Hoe kijkt B actiever naar wat A draagt?",
      "shared_experiment": "Maak samen een lijst van wat ieder deze week heeft geregeld. Bekijk die lijst samen. Geen oordeel — alleen zien."
    }
  }
},

"D5_TENSION_002": {
  "questions": [
    {
      "question_id": "q1_reaction",
      "step": "reaction",
      "prompt": "Wat doet het met je als je merkt dat je boos moet worden voordat de ander in beweging komt?",
      "helper_text": "Kies wat het meest herkenbaar is, niet wat het netst klinkt.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Ik voel me vernederd — ik had het niet zo ver moeten laten komen.", "tags": {"sensitive_points.not_seen": 2, "needs.recognition": 1}},
        {"option_id": "B", "label": "Ik word boos over de boosheid zelf — ik had dit niet nodig moeten hebben.", "tags": {"needs.recognition": 2, "protections.overperform": 1}},
        {"option_id": "C", "label": "Ik voel iets van macht — boosheid werkt althans. Maar dat is een slechte prijs.", "tags": {"protections.control": 1, "needs.recognition": 1}},
        {"option_id": "D", "label": "Ik voel moe — altijd aansturen, altijd escaleren.", "tags": {"needs.recognition": 2, "sensitive_points.not_seen": 2}},
        {"option_id": "E", "label": "Ik word stil daarna — de hulp is er, maar de verbinding is weg.", "tags": {"protections.withdraw": 2, "needs.connection": 1}}
      ]
    },
    {
      "question_id": "q2_interpretation",
      "step": "interpretation",
      "prompt": "Wat hoor jij in dat patroon over jullie relatie?",
      "helper_text": "Wat maak jij hiervan — los van wat je zou 'moeten' denken?",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Ik hoor: ik moet alarm slaan om serieus genomen te worden.", "tags": {"sensitive_points.not_seen": 2, "needs.recognition": 2}},
        {"option_id": "B", "label": "Ik hoor: jouw signalen zijn onvoldoende — alleen druk werkt.", "tags": {"sensitive_points.not_seen": 2, "needs.recognition": 2}},
        {"option_id": "C", "label": "Ik hoor: ik ben meer manager dan partner.", "tags": {"needs.connection": 2, "sensitive_points.not_chosen": 1}},
        {"option_id": "D", "label": "Ik hoor iets dat ik niet meer kan negeren: dit patroon slijt ons uit.", "tags": {"patterns.pursue_withdraw": 2, "needs.connection": 1}},
        {"option_id": "E", "label": "Ik hoor: ik moet duidelijker zijn in wat ik nodig heb — eerder.", "tags": {"skills.communication": 2, "needs.recognition": 1}}
      ]
    }
  ],
  "outputs": {
    "solo": {
      "mirror": "Hulp pas na escalatie — jij merkt wat dat kost. Niet alleen energie, maar verbinding. De hulp is er, maar de erkenning ontbreekt.",
      "protection_reflection": "Doorgaan totdat de bitterheid explodeert beschermt jou tegen het risico van vragen en niet krijgen. Maar het maakt jou ook de enige die de thermostaat is in de relatie.",
      "need_reflection": "Jij hebt behoefte aan een partner die beweegt vóór de bel — niet erna. Niet als reactie op druk, maar als aanwezigheid.",
      "chance": "Dit patroon is duidelijk genoeg om er samen over te praten — als het rustiger is dan nu.",
      "challenge": "Kun jij jouw behoefte eerder uitspreken — niet als verwijt, maar als vraag?",
      "experiment": "Zeg de volgende keer dat je iets nodig hebt: 'Ik merk dat ik dit te lang heb gedragen. Ik vraag het nu, voor ik er boos van word.' En kijk wat er dan gebeurt.",
      "gentle_phrase": "Jij mag vragen zonder te escaleren. Jouw behoeften verdienen meer dan alarm."
    },
    "couple": {
      "comparison_intro": "Hulp vragen en hulp geven — voor jullie verloopt dat via een specifiek pad.",
      "what_a_may_hear": "A moet escaleren om gehoord te worden. Dat voelt als vernedering — ook als de ander het niet zo bedoelt.",
      "what_b_may_hear": "B reageert op druk, niet op signalen. Misschien ziet B de signalen niet — of gelooft B pas in de urgentie als het groot is.",
      "what_each_protects": "A beschermt zichzelf door door te gaan totdat het niet meer kan. B beschermt zichzelf door te reageren op wat zichtbaar is.",
      "shared_chance": "Samen bespreken: hoe kunnen A's signalen vroeger aankomen bij B?",
      "shared_challenge": "Hoe leert A eerder vragen? Hoe leert B eerder kijken?",
      "shared_experiment": "Spreek een vroeg alarm af: A zegt een afgesproken zin als de last te groot wordt. B reageert meteen — niet pas als A boos is."
    }
  }
},

"D5_TENSION_003": {
  "questions": [
    {
      "question_id": "q1_emotion",
      "step": "emotion",
      "prompt": "Wat voel je als je merkt dat je boekhouden bijhoudt?",
      "helper_text": "Kies wat het meest herkenbaar is, niet wat het netst klinkt.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Schaamte — ik wil dit niet zijn.", "tags": {"sensitive_points.not_enough": 2, "needs.recognition": 1}},
        {"option_id": "B", "label": "Vermoeidheid — dit is niet hoe ik de relatie wilde.", "tags": {"needs.recognition": 2, "needs.connection": 1}},
        {"option_id": "C", "label": "Rechtvaardiging — het is de enige manier om zichtbaar te maken wat ik draag.", "tags": {"sensitive_points.not_seen": 2, "needs.recognition": 2}},
        {"option_id": "D", "label": "Verdriet — dit voelt als afstand.", "tags": {"sensitive_points.not_seen": 1, "needs.connection": 2}},
        {"option_id": "E", "label": "Ik betrapt mezelf erin — maar het gaat vanzelf.", "tags": {"patterns.pursue_withdraw": 1, "sensitive_points.not_seen": 1}}
      ]
    },
    {
      "question_id": "q2_sensitive_point",
      "step": "sensitive_point",
      "prompt": "Wat probeert het boekhouden zichtbaar te maken?",
      "helper_text": "Niet wat je denkt dat je zou moeten voelen — wat herken jij echt?",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Dat ik meer doe dan de ander — en dat dat erkend moet worden.", "tags": {"sensitive_points.not_seen": 2, "needs.recognition": 2}},
        {"option_id": "B", "label": "Dat ik bang ben te verdwijnen in de relatie als ik niet tel.", "tags": {"sensitive_points.not_enough": 2, "needs.recognition": 2}},
        {"option_id": "C", "label": "Dat ik het gevoel heb dat ik er alleen voor sta.", "tags": {"sensitive_points.not_seen": 2, "needs.connection": 1}},
        {"option_id": "D", "label": "Dat erkenning voor mij niet vanzelf komt — ik moet er iets voor doen.", "tags": {"sensitive_points.not_enough": 2, "protections.overperform": 1}},
        {"option_id": "E", "label": "Dat ik mezelf klein maak als ik niet op gelijkwaardigheid let.", "tags": {"sensitive_points.not_chosen": 1, "needs.recognition": 1}}
      ]
    }
  ],
  "outputs": {
    "solo": {
      "mirror": "Boekhouden begint niet uit hebzucht — het begint als de enige manier om iets onzichtbaars te meten. Jij wil niet tellen, maar je hebt geleerd dat zien niet vanzelf gaat.",
      "protection_reflection": "De lijst in je hoofd beschermt jou tegen het gevoel volledig te verdwijnen in geven. Maar hij vergroot ook de afstand — en maakt verbinding moeilijker.",
      "need_reflection": "Jij hebt behoefte aan erkenning die zo vanzelfsprekend is dat je het niet hoeft bij te houden. Dat is de droom achter het boekhouden.",
      "chance": "De lijst zelf is al informatie. Wat staat erop? Dat is het gesprek dat nodig is.",
      "challenge": "Kun jij de inhoud van de lijst zeggen in plaats van hem bij te houden?",
      "experiment": "Vertel je partner één ding van je lijst — niet als klacht maar als eerlijk: 'Ik merk dat ik dit bijhoud. Ik denk dat ik iets nodig heb wat ik nog niet gezegd heb.'",
      "gentle_phrase": "Je bent meer dan de verdeling. Maar de verdeling mag besproken worden."
    },
    "couple": {
      "comparison_intro": "Een mentale lijst bijhouden — dat is een teken dat er iets onuitgesproken is.",
      "what_a_may_hear": "A houdt bij wat er gedaan wordt — en wat niet. Dat is geen aanklacht, dat is signaal.",
      "what_b_may_hear": "B weet misschien niet dat A boekhouden bijhoudt. De vraag is: wat heeft B nodig om eerder te kijken?",
      "what_each_protects": "A beschermt zichzelf door te tellen. B beschermt zichzelf door niet te tellen.",
      "shared_chance": "De lijst openbaar maken — samen kijken wat erin staat.",
      "shared_challenge": "Hoe maakt A het bespreekbaar zonder beschuldigen? Hoe ontvangt B het zonder defensief te worden?",
      "shared_experiment": "Maak één keer samen een eerlijke taakverdeling zichtbaar. Niet om te winnen — om te begrijpen."
    }
  }
},

"D5_TENSION_004": {
  "questions": [
    {
      "question_id": "q1_reaction",
      "step": "reaction",
      "prompt": "Wat doet kritiek met jou als er weinig waardering aan vooraf is gegaan?",
      "helper_text": "Kies wat het meest herkenbaar is, niet wat het netst klinkt.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Ik hoor het niet meer — er is te veel achterstand.", "tags": {"sensitive_points.not_seen": 2, "needs.recognition": 2}},
        {"option_id": "B", "label": "Ik word defensief — ik verdedig wat ik al deed.", "tags": {"protections.control": 1, "needs.recognition": 2}},
        {"option_id": "C", "label": "Ik word verdrietig — ik doe zoveel, en dit is wat eruit komt.", "tags": {"sensitive_points.not_seen": 2, "needs.recognition": 2}},
        {"option_id": "D", "label": "Ik geloof het — als ik het zo goed deed, was er al waardering geweest.", "tags": {"sensitive_points.not_enough": 2, "needs.recognition": 1}},
        {"option_id": "E", "label": "Ik reageer kalm van buiten maar vanbinnen stapelt het op.", "tags": {"protections.appease": 2, "sensitive_points.not_seen": 1}}
      ]
    },
    {
      "question_id": "q2_interpretation",
      "step": "interpretation",
      "prompt": "Wat hoor jij eigenlijk als je denkt: het is nooit genoeg?",
      "helper_text": "Wat maak jij hiervan — los van wat je zou 'moeten' denken?",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Ik hoor een oud geluid — dit gevoel ken ik van vroeger.", "tags": {"sensitive_points.not_enough": 3, "needs.recognition": 1}},
        {"option_id": "B", "label": "Ik hoor: jij ziet niet wat ik al doe. En dat doet pijn.", "tags": {"sensitive_points.not_seen": 2, "needs.recognition": 2}},
        {"option_id": "C", "label": "Ik hoor: ik moet harder proberen. Dan misschien wordt het gezien.", "tags": {"protections.overperform": 2, "sensitive_points.not_enough": 1}},
        {"option_id": "D", "label": "Ik hoor: ik ben niet de partner die jij wil.", "tags": {"sensitive_points.not_enough": 2, "sensitive_points.not_chosen": 1}},
        {"option_id": "E", "label": "Ik hoor iets dat ik moet bespreken — voor het verder groeit.", "tags": {"skills.communication": 2, "needs.honesty": 1}}
      ]
    }
  ],
  "outputs": {
    "solo": {
      "mirror": "Kritiek die aankomt als 'nooit genoeg' — dat zegt iets over hoe de bodem is. Niet alleen over de inhoud van de kritiek, maar over de afwezigheid van wat eraan vooraf had moeten gaan.",
      "protection_reflection": "Defensief worden of stil blijven — beide beschermen jou tegen de pijn van niet gezien zijn. Maar ze laten de basis onbesproken.",
      "need_reflection": "Jij hebt behoefte aan waardering als fundament — niet als beloning, maar als bodem waarop kritiek kan landen.",
      "chance": "Dit gevoel is informatie. Het zegt: er is iets minder geworden wat ik nodig heb.",
      "challenge": "Kun jij dit gevoel benoemen zonder te wachten tot de kritiek weer komt?",
      "experiment": "Zeg één keer: 'Ik merk dat ik kritiek moeilijker ontvang als ik me weinig gezien voel. Mogen we het daar ook over hebben?'",
      "gentle_phrase": "Kritiek mag er zijn. Maar het vraagt een fundament van waardering. Dat mag jij vragen."
    },
    "couple": {
      "comparison_intro": "Kritiek en waardering — de verhouding daartussen bepaalt hoe het aankomt.",
      "what_a_may_hear": "A hoort de kritiek groter dan de inhoud — omdat de bodem van waardering leeg is.",
      "what_b_may_hear": "B geeft feedback vanuit betrokkenheid — maar merkt misschien niet dat de rekening van erkentelijkheid leeg is.",
      "what_each_protects": "A beschermt zichzelf door defensief te worden of stil te blijven. B beschermt zichzelf door te zeggen wat beter kan zonder eerst te zeggen wat goed is.",
      "shared_chance": "Bespreken: hoe kan kritiek veilig zijn als er eerst meer waardering is?",
      "shared_challenge": "Hoe verhoudt B feedback aan waardering? Hoe zegt A wat de bodem nodig heeft?",
      "shared_experiment": "Spreek af: voor elke kritiek, één eerlijk compliment. Niet als trucje, maar als ritueel."
    }
  }
},

"D5_DEEP_001": {
  "questions": [
    {
      "question_id": "q1_sensitive_point",
      "step": "sensitive_point",
      "prompt": "Hoe verhoudt jouw gevoel van waarde zich tot wat jij doet voor de ander?",
      "helper_text": "Kies wat het meest herkenbaar is — ook als het niet iets is waar je trots op bent.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Ik voel me waardevoller als ik nuttig ben — en minder waard als ik niets te geven heb.", "tags": {"sensitive_points.not_enough": 2, "protections.overperform": 2}},
        {"option_id": "B", "label": "Ik weet rationeel dat dit niet klopt, maar voel het toch zo.", "tags": {"sensitive_points.not_enough": 2, "needs.recognition": 1}},
        {"option_id": "C", "label": "Geven is mijn taal — door te geven maak ik contact.", "tags": {"protections.overperform": 2, "needs.connection": 1}},
        {"option_id": "D", "label": "Ik ben bang dat als ik stop met geven, de ander minder verbonden is.", "tags": {"protections.overperform": 2, "sensitive_points.abandonment": 1}},
        {"option_id": "E", "label": "Mijn gevoel van waarde staat los van wat ik doe — ik voel me niet zo daarin.", "tags": {"needs.autonomy": 2, "needs.freedom": 1}}
      ]
    },
    {
      "question_id": "q2_emotion",
      "step": "emotion",
      "prompt": "Wat voel je bij de vraag: word ik geliefd om wie ik ben, of om wat ik doe?",
      "helper_text": "Niet wat je denkt dat je zou moeten voelen — wat herken jij echt?",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Angst — ik durf de vraag nauwelijks te stellen, want het antwoord kan pijn doen.", "tags": {"sensitive_points.not_enough": 3, "needs.reassurance": 1}},
        {"option_id": "B", "label": "Verdriet — ik weet het antwoord al, en het klopt niet.", "tags": {"sensitive_points.not_enough": 2, "needs.recognition": 2}},
        {"option_id": "C", "label": "Hoop — ik denk dat het allebei is. Maar ik wil het zeker weten.", "tags": {"needs.reassurance": 2, "needs.recognition": 1}},
        {"option_id": "D", "label": "Twijfel — ik weet het eigenlijk niet. En dat is spannend.", "tags": {"needs.reassurance": 2, "sensitive_points.not_enough": 1}},
        {"option_id": "E", "label": "Rust — ik voel me geliefd om wie ik ben. De vraag stelt me niet zo op de proef.", "tags": {"needs.recognition": 1, "needs.safety": 1}}
      ]
    }
  ],
  "outputs": {
    "solo": {
      "mirror": "Geven als liefdestaal is mooi — maar als het ook de manier is om je waarde te verdienen, betaal je een hoge prijs voor verbinding.",
      "protection_reflection": "Altijd geven beschermt jou tegen het risico van ontvangen — en de kwetsbaarheid die daarin zit. Als ik geef, heb ik controle. Als ik ontvang, ben ik afhankelijk van de ander.",
      "need_reflection": "Jij hebt behoefte aan liefde die niet gekoppeld is aan prestatie. Aan een relatie waar je gezien bent als je niets geeft — alleen maar bent.",
      "chance": "Dit inzicht is een kans om te oefenen met niets doen en toch aanwezig zijn.",
      "challenge": "Kun jij één dag minder doen — en kijken of je je nog steeds geliefd voelt?",
      "experiment": "Vraag je partner deze week: 'Wat waardeer je aan mij, los van wat ik doe?' Luister alleen. Geen weerwoord.",
      "gentle_phrase": "Je bent geen prestatie. Je bent een mens. Dat is genoeg."
    },
    "couple": {
      "comparison_intro": "Geven en waarde — voor A zitten die soms aan elkaar vast.",
      "what_a_may_hear": "A geeft veel — maar achter dat geven zit een vraag: word ik ook gewaardeerd als ik niets breng?",
      "what_b_may_hear": "B ontvangt. Maar weet B dat A achter het geven ook een diepere vraag draagt?",
      "what_each_protects": "A beschermt zichzelf door nuttig te zijn. B beschermt zichzelf door te ontvangen zonder te veel te vragen.",
      "shared_chance": "Samen bespreken: hoe voelt geliefd worden los van doen er bij ieder van jullie uit?",
      "shared_challenge": "Hoe geeft B actief signalen dat A geliefd is zonder het te hoeven verdienen?",
      "shared_experiment": "B zegt deze week: 'Ik ben blij met jou — niet om wat je doet, maar om wie je bent.' Eén keer, concreet en echt."
    }
  }
},

"D5_DEEP_002": {
  "questions": [
    {
      "question_id": "q1_reaction",
      "step": "reaction",
      "prompt": "Wat doe jij als iemand je oprecht complimenteert of bedankt?",
      "helper_text": "Kies wat het meest herkenbaar is — ook als het niet iets is waar je trots op bent.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Ik wuif het weg — het stelt niets voor, iedereen had het gedaan.", "tags": {"protections.minimize": 2, "needs.recognition": 1}},
        {"option_id": "B", "label": "Ik maak een grapje — het is te ongemakkelijk om het serieus te nemen.", "tags": {"protections.humor": 2, "needs.recognition": 1}},
        {"option_id": "C", "label": "Ik accepteer het maar voel er van binnen weinig bij — het landt niet.", "tags": {"needs.recognition": 2, "centers.body": 1}},
        {"option_id": "D", "label": "Ik voel me verlegen en zeg snel iets terug over de ander.", "tags": {"protections.appease": 1, "skills.vulnerability": 1}},
        {"option_id": "E", "label": "Ik ontvang het — complimenten gaan mij relatief goed af.", "tags": {"needs.recognition": 1, "needs.autonomy": 1}}
      ]
    },
    {
      "question_id": "q2_sensitive_point",
      "step": "sensitive_point",
      "prompt": "Waarom is ontvangen moeilijker dan geven?",
      "helper_text": "Niet wat je denkt dat je zou moeten voelen — wat herken jij echt?",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Als ik ontvang, word ik afhankelijk van het oordeel van de ander.", "tags": {"sensitive_points.not_enough": 2, "protections.withdraw": 1}},
        {"option_id": "B", "label": "Als ik het echt binnenlaat, geef ik toe dat ik het nodig had. Dat voelt kwetsbaar.", "tags": {"skills.vulnerability": 2, "needs.recognition": 2}},
        {"option_id": "C", "label": "Ik geloof het compliment niet volledig — ik wacht op de nuance die het kleiner maakt.", "tags": {"sensitive_points.not_enough": 2, "protections.control": 1}},
        {"option_id": "D", "label": "Ik weet niet hoe ik moet ontvangen zonder iets terug te geven.", "tags": {"protections.overperform": 1, "needs.recognition": 1}},
        {"option_id": "E", "label": "Ontvangen is voor mij niet zo moeilijk — ik sta er gewoon niet veel bij stil.", "tags": {"needs.autonomy": 1, "needs.freedom": 1}}
      ]
    }
  ],
  "outputs": {
    "solo": {
      "mirror": "Jij verlangt naar erkenning — en als die er is, maak je haar klein. Dat is geen ondankbaarheid. Dat is een bescherming die zo ingesleten is dat je hem niet eens meer ziet.",
      "protection_reflection": "Wegwuiven, een grap maken, snel iets terugzeggen — al die bewegingen houden kwetsbaarheid buiten. Als ik het niet binnenlaat, kan het mij ook niet raken.",
      "need_reflection": "Jij hebt behoefte aan erkenning die je kunt geloven. Niet bewijzen hoeven te leveren — alleen ontvangen mogen.",
      "chance": "De volgende keer dat iemand iets moois zegt over jou — dat is een moment om te oefenen.",
      "challenge": "Kun jij 'dankjewel' zeggen — alleen dankjewel — zonder er iets achteraan te zeggen?",
      "experiment": "Oefen vandaag één keer ontvangen. Iemand zegt iets aardigs. Zeg alleen: 'Dat doet me goed, dankjewel.' Stop daarna.",
      "gentle_phrase": "Jij mag ontvangen. Dat maakt je niet zwak. Het maakt je menselijk."
    },
    "couple": {
      "comparison_intro": "Complimenten geven is voor B misschien makkelijker dan ze ontvangen zijn voor A.",
      "what_a_may_hear": "A wuift complimenten weg — maar vanbinnen is er een verlangen naar erkenning. Dat is geen tegenspraak, dat is bescherming.",
      "what_b_may_hear": "B geeft iets — en ziet het worden afgeweerd. Dat kan ontmoedigen of verwarren.",
      "what_each_protects": "A beschermt zichzelf door complimenten klein te maken. B beschermt zichzelf door niet te hard aan te dringen.",
      "shared_chance": "Samen oefenen: complimenten geven die landen.",
      "shared_challenge": "Hoe maakt B duidelijk dat het oprecht is? Hoe oefent A met ontvangen?",
      "shared_experiment": "B geeft deze week één compliment en wacht — geen reactie verwachten. A oefent met alleen zeggen: 'Dankjewel, dat doet me goed.'"
    }
  }
}

}

# Update cases
updated = 0
for c in cases:
    cid = c['case_id']
    if cid in D5_CASES:
        c['questions'] = D5_CASES[cid]['questions']
        c['outputs'] = D5_CASES[cid]['outputs']
        updated += 1
        print('Updated: ' + cid)

data['cases'] = cases

with open('cases.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print('\nDone! Updated ' + str(updated) + ' D5 cases.')
