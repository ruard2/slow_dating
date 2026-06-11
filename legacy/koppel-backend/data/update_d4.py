# -*- coding: utf-8 -*-
import json, sys
sys.stdout.reconfigure(encoding='utf-8')

with open('cases.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

cases = data['cases']

D4_CASES = {

"D4_POSITIVE_001": {
  "questions": [
    {
      "question_id": "q1_reaction",
      "step": "reaction",
      "prompt": "Wat doet het met jou als je partner gewoon zegt: 'Goed, neem je tijd'?",
      "helper_text": "Kies wat het meest herkenbaar is, niet wat het netst klinkt.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Ik voel opluchting — ik hoefde er niet voor te vechten.", "tags": {"needs.freedom": 2, "needs.safety": 1}},
        {"option_id": "B", "label": "Ik word blij, maar check vanbinnen ook: meent hij/zij het echt?", "tags": {"needs.reassurance": 1, "needs.freedom": 1}},
        {"option_id": "C", "label": "Ik voel vrijheid én een lichte verbazing — dit is niet altijd zo gegaan.", "tags": {"needs.freedom": 2, "sensitive_points.not_enough": 1}},
        {"option_id": "D", "label": "Ik neem het aan en geniet — ruimte ontvangen gaat mij goed af.", "tags": {"needs.freedom": 2, "needs.autonomy": 1}},
        {"option_id": "E", "label": "Ik voel schuld — ook al heb ik het gevraagd, ik wil de ander niet alleen laten.", "tags": {"protections.appease": 2, "needs.freedom": 1}}
      ]
    },
    {
      "question_id": "q2_need",
      "step": "need",
      "prompt": "Wat heeft alleen-tijd voor jou?",
      "helper_text": "Niet wat je denkt dat je zou moeten willen — wat helpt jou echt?",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Terugkeren bij mezelf — daarna kan ik er weer echt voor de ander zijn.", "tags": {"needs.freedom": 2, "needs.autonomy": 2}},
        {"option_id": "B", "label": "Bewijs dat ik mezelf mag zijn in deze relatie.", "tags": {"needs.freedom": 2, "sensitive_points.losing_self": 1}},
        {"option_id": "C", "label": "Opladen — ik leeg mezelf in verbinding en heb stilte nodig om te vullen.", "tags": {"needs.freedom": 2, "centers.body": 1}},
        {"option_id": "D", "label": "Vrijheid zonder schuld — dat is de combinatie die ik zoek.", "tags": {"needs.freedom": 3, "protections.appease": 1}},
        {"option_id": "E", "label": "Eerlijk gezegd niet zo veel — ik ben meer van samen dan van apart.", "tags": {"needs.connection": 2, "needs.closeness": 1}}
      ]
    }
  ],
  "outputs": {
    "solo": {
      "mirror": "Ruimte ontvangen zonder dat het iets kost — dat is niet vanzelfsprekend voor jou. Of je nu opluchting voelt, lichte twijfel, of schuld: jouw reactie vertelt iets over hoe jij je verhoudt tot autonomie in verbinding.",
      "protection_reflection": "Schuld voelen als je eigen ruimte neemt, of checken of de ander het echt meent — dat zijn manieren om verbinding te bewaken. Maar ze kosten je ook iets van de vrijheid die je vroeg.",
      "need_reflection": "Jij hebt behoefte aan ruimte die niet betaald hoeft te worden. Niet ruimte na onderhandeling, maar ruimte die gewoon mag bestaan.",
      "chance": "Dit moment laat zien dat alleen-tijd en verbinding geen tegenpolen zijn. Jij mag opladen zonder de relatie te verliezen.",
      "challenge": "Kun jij de ruimte echt benutten, of zit er vanbinnen toch een stem die zegt: ik moet dit goed maken?",
      "experiment": "Neem vandaag een half uur echt voor jezelf — geen halve aanwezigheid. Kijk hoe het voelt zonder verantwoording.",
      "gentle_phrase": "Jij hebt ruimte nodig. Dat maakt jou geen slechte partner. Dat maakt jou een heel mens."
    },
    "couple": {
      "comparison_intro": "Ruimte geven en ruimte nemen — voor ieder van jullie zit er een ander verhaal aan.",
      "what_a_may_hear": "A vraagt ruimte — en voelt daarin zowel vrijheid als schuld. Het laat zien hoeveel A gewend is zich aan te passen.",
      "what_b_may_hear": "B geeft ruimte. Maar wat kost het B? Is dit gemakkelijk, of vraagt het iets om niet te volgen?",
      "what_each_protects": "A beschermt zichzelf door ruimte te vragen. B beschermt zichzelf door ruimte te geven zonder er veel over te zeggen.",
      "shared_chance": "Samen bespreken: wat heeft ieder van jullie nodig om te kunnen opladen?",
      "shared_challenge": "Hoe houden jullie verbinding zonder dat één van jullie zichzelf inlevert?",
      "shared_experiment": "Plan deze week allebei één moment van eigen tijd — zonder overleg, zonder verantwoording. Vertel daarna alleen hoe het voelde."
    }
  }
},

"D4_POSITIVE_002": {
  "questions": [
    {
      "question_id": "q1_emotion",
      "step": "emotion",
      "prompt": "Wat voel je als je partner je aanmoedigt in iets dat echt van jou is?",
      "helper_text": "Kies wat het meest herkenbaar is, niet wat het netst klinkt.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Ik word blij — dit is de relatie die ik wil.", "tags": {"needs.recognition": 2, "needs.freedom": 1}},
        {"option_id": "B", "label": "Ik voel ruimte — ik hoef me niet kleiner te maken om verbonden te blijven.", "tags": {"needs.freedom": 2, "needs.autonomy": 1}},
        {"option_id": "C", "label": "Ik word een beetje verlegen — enthousiasme tonen is voor mij niet vanzelfsprekend.", "tags": {"sensitive_points.not_enough": 1, "skills.vulnerability": 1}},
        {"option_id": "D", "label": "Ik voel dankbaarheid maar ook een lichte verrassing — dit had ik niet verwacht.", "tags": {"needs.recognition": 2, "needs.freedom": 1}},
        {"option_id": "E", "label": "Ik voel warmte, maar ook voorzichtigheid — stel dat het verandert.", "tags": {"needs.reassurance": 1, "protections.control": 1}}
      ]
    },
    {
      "question_id": "q2_interpretation",
      "step": "interpretation",
      "prompt": "Wat zegt het dat je partner aanmoedigt zonder er zelf deel van te zijn?",
      "helper_text": "Wat maak jij hiervan — los van wat je zou 'moeten' denken?",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Het zegt: jij mag compleet zijn zonder dat ik alles hoef te begrijpen.", "tags": {"needs.freedom": 2, "needs.autonomy": 2}},
        {"option_id": "B", "label": "Het geeft mij bevestiging dat ruimte voor mezelf er mag zijn.", "tags": {"needs.freedom": 2, "needs.recognition": 1}},
        {"option_id": "C", "label": "Het zegt dat deze relatie groot genoeg is voor wie ik werkelijk ben.", "tags": {"needs.freedom": 2, "needs.connection": 1}},
        {"option_id": "D", "label": "Het roept ook iets op: willen wij ooit hetzelfde? Gaat dit ons uit elkaar trekken?", "tags": {"needs.stability": 1, "sensitive_points.losing_self": 1}},
        {"option_id": "E", "label": "Het voelt als een gunning — niet vanzelfsprekend, maar iets dat ik ontvang.", "tags": {"needs.recognition": 2, "needs.freedom": 1}}
      ]
    }
  ],
  "outputs": {
    "solo": {
      "mirror": "Jij laat iets van jezelf zien — en de ander maakt er ruimte voor. Dat voelt als meer dan aanmoediging. Het zegt: jij mag er zijn, ook de kant die ik zelf niet heb.",
      "protection_reflection": "Voorzichtigheid bij erkenning — de vraag of het blijft — beschermt jou tegen de teleurstelling als de ruimte later toch kleiner wordt. Maar ze remt ook het volledig ontvangen van dit moment.",
      "need_reflection": "Jij hebt behoefte aan een relatie die ruimte maakt voor wie jij bent, niet alleen voor de rol die jij vervult. Aanmoediging zonder betrokkenheid is een zachte vorm van die vrijheid.",
      "chance": "Dit moment bewijst: jij hoeft jezelf niet in te leveren voor verbinding.",
      "challenge": "Kun jij voluit genieten van aanmoediging zonder te checken of het voorwaardelijk is?",
      "experiment": "Deel deze week iets van je interesse — niet als test, maar als uitnodiging. Kijk hoe de ontvangst voelt.",
      "gentle_phrase": "Je eigen wereld mag bestaan naast de gedeelde wereld. Dat is geen afstand. Dat is gezond."
    },
    "couple": {
      "comparison_intro": "Eigen interesses en aanmoediging — jullie beleven dit elk op hun eigen manier.",
      "what_a_may_hear": "A voelt zich gezien in iets wat echt van hem/haar is. Dat heeft meer impact dan A misschien laat merken.",
      "what_b_may_hear": "B moedigt aan vanuit generositeit. Maar begrijpt B ook wat dit voor A betekent — dat het méér is dan een compliment?",
      "what_each_protects": "A beschermt zichzelf door zich niet volledig te laten zien. B beschermt zichzelf door betrokken te zijn zonder te claimen.",
      "shared_chance": "Samen ontdekken: welke kant van jou heeft de ander eigenlijk nog nooit echt gezien?",
      "shared_challenge": "Hoe houden jullie ruimte voor elkaars afzonderlijke wereld naarmate de relatie groter wordt?",
      "shared_experiment": "Vertel de ander deze week over iets dat je bezighoudt — iets dat niet over de relatie gaat. Vraag de ander alleen te luisteren."
    }
  }
},

"D4_POSITIVE_003": {
  "questions": [
    {
      "question_id": "q1_emotion",
      "step": "emotion",
      "prompt": "Wat voel je als jullie zonder spanning iets verschillend doen?",
      "helper_text": "Kies wat het meest herkenbaar is, niet wat het netst klinkt.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Vrijheid — ik hoef niet alles hetzelfde te willen.", "tags": {"needs.freedom": 2, "needs.autonomy": 2}},
        {"option_id": "B", "label": "Opluchting — verschil hoeft geen conflict te zijn.", "tags": {"needs.stability": 1, "needs.freedom": 1}},
        {"option_id": "C", "label": "Een licht gevoel — dit is de versie van de relatie die ik het liefst heb.", "tags": {"needs.freedom": 2, "needs.connection": 1}},
        {"option_id": "D", "label": "Verbazing — dit is niet hoe ik dacht dat het zou gaan.", "tags": {"needs.freedom": 1, "needs.stability": 1}},
        {"option_id": "E", "label": "Een kleine eenzaamheid ook — samen is uiteindelijk mijn voorkeur.", "tags": {"needs.connection": 2, "needs.closeness": 1}}
      ]
    },
    {
      "question_id": "q2_interpretation",
      "step": "interpretation",
      "prompt": "Wat zegt dit moment over hoe jullie met verschil omgaan?",
      "helper_text": "Wat maak jij hiervan — los van wat je zou 'moeten' denken?",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Het zegt dat wij naast elkaar kunnen leven zonder in elkaar op te gaan.", "tags": {"needs.freedom": 2, "needs.autonomy": 2}},
        {"option_id": "B", "label": "Het zegt dat verschil niet automatisch afstand is.", "tags": {"needs.freedom": 2, "needs.connection": 1}},
        {"option_id": "C", "label": "Het geeft mij hoop dat we dit vaker zo kunnen doen.", "tags": {"needs.stability": 1, "needs.freedom": 1}},
        {"option_id": "D", "label": "Het voelt als een mijlpaal — hier hebben we eerder ruzie over gehad.", "tags": {"skills.repair": 2, "needs.stability": 1}},
        {"option_id": "E", "label": "Het voelt goed, maar ik vraag me ook af: hoeveel verschil houdt ons verbonden?", "tags": {"needs.stability": 2, "sensitive_points.losing_self": 1}}
      ]
    }
  ],
  "outputs": {
    "solo": {
      "mirror": "Jullie deden het anders — en het voelde goed. Dat klinkt simpel, maar het vraagt iets: bereidheid om los te laten dat samen altijd hetzelfde moet betekenen.",
      "protection_reflection": "Als eenzaamheid even meekwam in dit moment, is dat geen zwakte. Het zegt iets over wat jij ook waardeert: samen zijn. Ruimte en nabijheid hoeven niet te kiezen.",
      "need_reflection": "Jij hebt behoefte aan een relatie waar verschil geen bedreiging is. Waar jij je eigen richting op mag gaan en toch terugkomt bij de ander.",
      "chance": "Dit moment is een oefening in vrijheid binnen verbinding. Jullie kunnen dit vaker.",
      "challenge": "Kun jij verschil vieren ook als jij eigenlijk liever samen was geweest?",
      "experiment": "Plan één moment waarop jullie bewust iets afzonderlijk doen — en daarna één moment om erop terug te komen.",
      "gentle_phrase": "Twee mensen met elk een eigen wereld — en toch samen. Dat is niet minder, dat is meer."
    },
    "couple": {
      "comparison_intro": "Verschil verdragen of waarderen — dat is voor jullie misschien niet even vanzelfsprekend.",
      "what_a_may_hear": "Voor A voelt vrijheid in verschil als adem. Dit moment geeft A iets wat anders nodig is.",
      "what_b_may_hear": "Voor B is dit misschien vanzelfsprekender — of juist moeilijker dan het lijkt. Had B ook ruimte voor wat híj/zij wilde?",
      "what_each_protects": "A beschermt zichzelf door ruimte te vragen. B beschermt zichzelf door mee te gaan zonder er veel van te zeggen.",
      "shared_chance": "Samen ontdekken: hoe ziet 'vrijheid in verbinding' er voor jullie uit?",
      "shared_challenge": "Hoe zorgen jullie dat apart gaan geen signaal van afstand wordt?",
      "shared_experiment": "Maak een ritueel: na elk moment van apart gaan, een klein check-in. Gewoon: 'Hoe was het voor jou?'"
    }
  }
},

"D4_POSITIVE_004": {
  "questions": [
    {
      "question_id": "q1_reaction",
      "step": "reaction",
      "prompt": "Wat doet het met jou als jij een grens stelt en de ander luistert?",
      "helper_text": "Kies wat het meest herkenbaar is, niet wat het netst klinkt.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Opluchting — ik dacht dat dit meer gedoe zou geven.", "tags": {"needs.safety": 2, "needs.freedom": 1}},
        {"option_id": "B", "label": "Verbazing — ik ben niet gewend dat grenzen goed landen.", "tags": {"needs.safety": 2, "sensitive_points.not_enough": 1}},
        {"option_id": "C", "label": "Rust — ik voel me serieus genomen.", "tags": {"needs.recognition": 2, "needs.safety": 1}},
        {"option_id": "D", "label": "Iets van kracht — ik kon dit zeggen en het klopte.", "tags": {"skills.boundary_setting": 2, "needs.autonomy": 1}},
        {"option_id": "E", "label": "Schuld — ook al werd mijn grens gerespecteerd, ik voelde me er toch naar over.", "tags": {"protections.appease": 2, "needs.freedom": 1}}
      ]
    },
    {
      "question_id": "q2_need",
      "step": "need",
      "prompt": "Wat heb jij nodig om een grens te kunnen stellen?",
      "helper_text": "Niet wat je denkt dat je zou moeten willen — wat helpt jou echt?",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "De ervaring dat het veilig is — dat de ander er niet van schrikt of boos wordt.", "tags": {"needs.safety": 2, "needs.reassurance": 1}},
        {"option_id": "B", "label": "Het geloof dat ik het waard ben om gehoord te worden.", "tags": {"needs.recognition": 2, "sensitive_points.not_enough": 1}},
        {"option_id": "C", "label": "Oefening — ik hoor mezelf pas als ik het al te lang niet gezegd heb.", "tags": {"skills.boundary_setting": 2, "needs.autonomy": 1}},
        {"option_id": "D", "label": "Toestemming van mezelf — dat ik een grens mag hebben zonder reden.", "tags": {"needs.freedom": 2, "needs.autonomy": 2}},
        {"option_id": "E", "label": "Eigenlijk niks — een grens stellen gaat mij relatief goed af.", "tags": {"skills.boundary_setting": 2, "needs.autonomy": 1}}
      ]
    }
  ],
  "outputs": {
    "solo": {
      "mirror": "Een grens zeggen en gehoord worden — dat klinkt simpel maar voelt soms als een risico. Jouw reactie op dit moment vertelt iets over hoe vertrouwd grenzen stellen voor jou is.",
      "protection_reflection": "Schuld na een grens stellen beschermt jou tegen het risico van afwijzing. Maar het ondermijnt ook de grens zelf. Als je je er meteen naar voelt, was de grens misschien half.",
      "need_reflection": "Jij hebt behoefte aan een relatie waar grenzen veilig zijn. Niet getolereerd, maar echt ontvangen.",
      "chance": "Dit moment is bewijs dat grenzen de verbinding niet hoeven te verbreken.",
      "challenge": "Kun jij een grens stellen zonder die meteen te verduidelijken, verzachten of verontschuldigen?",
      "experiment": "Oefen deze week één grens in twee woorden: 'Niet nu.' Geen uitleg. Kijk hoe dat voelt.",
      "gentle_phrase": "Een grens stellen is niet egoïstisch. Het is eerlijk zijn over wie jij bent."
    },
    "couple": {
      "comparison_intro": "Grenzen stellen en ontvangen — dat raakt jullie allebei op een eigen manier.",
      "what_a_may_hear": "A stelt een grens — en voelt daarna schuld. Dat zegt iets over hoeveel A gewend is zich aan te passen.",
      "what_b_may_hear": "B respecteert de grens. Maar hoe voelt dat voor B? Is het makkelijk, of vergt het iets?",
      "what_each_protects": "A beschermt zichzelf door de grens te verzachten. B beschermt zichzelf door te luisteren zonder erin te duiken.",
      "shared_chance": "Samen oefenen: grenzen zeggen en ontvangen zonder het kleiner te maken.",
      "shared_challenge": "Hoe maakt B ruimte voor A's grenzen zonder zich afgewezen te voelen?",
      "shared_experiment": "Spreek af: als één van jullie 'niet nu' zegt, vraagt de ander niet waarom. Oefen dat deze week."
    }
  }
},

"D4_TENSION_001": {
  "questions": [
    {
      "question_id": "q1_reaction",
      "step": "reaction",
      "prompt": "Wat voel je vanbinnen als je partner vraagt: 'Waar ga je heen en hoe laat ben je terug'?",
      "helper_text": "Kies wat het meest herkenbaar is, niet wat het netst klinkt.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Ik voel me meteen gecontroleerd — ook al is dat misschien niet de bedoeling.", "tags": {"needs.freedom": 2, "protections.distance": 1}},
        {"option_id": "B", "label": "Ik word kort in mijn antwoord — ik wil niet verantwoording afleggen.", "tags": {"needs.autonomy": 2, "protections.withdraw": 1}},
        {"option_id": "C", "label": "Iets in mij wil zeggen: dat gaat je niets aan.", "tags": {"needs.freedom": 3, "protections.distance": 1}},
        {"option_id": "D", "label": "Ik vind het prima — dit soort praktische vragen hebben wij gewoon.", "tags": {"needs.stability": 1, "needs.connection": 1}},
        {"option_id": "E", "label": "Ik voel irritatie maar reageer toch vriendelijk — ik wil geen ruzie over niets.", "tags": {"protections.appease": 1, "needs.freedom": 1}}
      ]
    },
    {
      "question_id": "q2_interpretation",
      "step": "interpretation",
      "prompt": "Wat maakt dat deze vraag meer voelt dan praktisch?",
      "helper_text": "Wat maak jij hiervan — los van wat je zou 'moeten' denken?",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Ik hoor er iets in van: jij hoort mij te informeren. Dat voelt als plicht.", "tags": {"needs.freedom": 2, "needs.autonomy": 2}},
        {"option_id": "B", "label": "Ik hoor: ik vertrouw je, maar ik wil weten waar je bent. Dat is ook iets.", "tags": {"needs.reassurance": 1, "needs.freedom": 1}},
        {"option_id": "C", "label": "Ik hoor mijn eigen behoefte aan autonomie — en hoe snel die botst met nabijheid.", "tags": {"needs.freedom": 2, "patterns.pursue_withdraw": 1}},
        {"option_id": "D", "label": "Ik hoor de ander die aansluiting zoekt — maar dit is niet hoe ik dat wil.", "tags": {"needs.freedom": 2, "needs.connection": 1}},
        {"option_id": "E", "label": "Ik weet het eigenlijk niet — ik reageer gewoon meteen.", "tags": {"needs.autonomy": 1, "centers.body": 1}}
      ]
    }
  ],
  "outputs": {
    "solo": {
      "mirror": "Een praktische vraag die niet praktisch voelt — jij reageert op iets dat dieper zit dan de woorden. Autonomie is voor jou geen detail. Het is een voorwaarde.",
      "protection_reflection": "Korter worden, inwendig terugtrekken — jij beschermt je vrijheid bij het eerste signaal van inperking. Dat is een snelle reflex die ooit ergens voor nodig was.",
      "need_reflection": "Jij hebt behoefte aan een relatie waar jij vrij kunt bewegen zonder verantwoording. Niet geheimhouding, maar ruimte zonder rekenschap.",
      "chance": "Dit moment nodigt uit om te zeggen wat jij nodig hebt — niet als reactie, maar als gesprek.",
      "challenge": "Kun jij onderscheid maken tussen controle en verbinding — en de ander het voordeel van de twijfel geven?",
      "experiment": "Zeg één keer: 'Ik merk dat ik bij dit soort vragen dichtklap. Dat gaat niet over jou, maar over mij.' En kijk wat dat doet.",
      "gentle_phrase": "Jij mag vrij zijn. En de ander mag verbinding zoeken. Allebei tegelijk kan ook."
    },
    "couple": {
      "comparison_intro": "Dezelfde vraag, twee heel verschillende ervaringen.",
      "what_a_may_hear": "A hoort in de vraag: jij moet mij informeren. Vrijheid voelt meteen smaller.",
      "what_b_may_hear": "B vroeg iets praktisch — of zocht verbinding. De korte reactie van A voelt als afwijzing.",
      "what_each_protects": "A beschermt vrijheid door afstand te nemen. B beschermt verbinding door te vragen.",
      "shared_chance": "Samen bespreken: wat is de taal waarmee B verbinding zoekt, en hoe kan dat anders?",
      "shared_challenge": "Hoe vraagt B naar aansluiting zonder A's vrijheidsgevoel te raken?",
      "shared_experiment": "Spreek af: B vraagt niet 'waar ga je heen' maar 'zien we elkaar nog vanavond?'. Oefen dat verschil."
    }
  }
},

"D4_TENSION_002": {
  "questions": [
    {
      "question_id": "q1_reaction",
      "step": "reaction",
      "prompt": "Wat is jouw eerste reactie als je partner iets heeft afgesproken of besloten zonder jou erbij te betrekken?",
      "helper_text": "Kies wat het meest herkenbaar is, niet wat het netst klinkt.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Ik voel me buitengesloten — ook al was het niet de bedoeling.", "tags": {"needs.connection": 2, "needs.stability": 1}},
        {"option_id": "B", "label": "Ik voel irritatie — we hadden het toch even kunnen bespreken?", "tags": {"needs.stability": 2, "protections.control": 1}},
        {"option_id": "C", "label": "Ik snap het — vrijheid is voor hem/haar belangrijk. Maar ik ervaar het toch als: ik tel niet mee.", "tags": {"needs.recognition": 2, "sensitive_points.not_chosen": 1}},
        {"option_id": "D", "label": "Ik vind het prima — ieder mag zijn eigen plannen maken.", "tags": {"needs.freedom": 2, "needs.autonomy": 1}},
        {"option_id": "E", "label": "Ik zeg niets maar voel vanbinnen dat er iets niet klopt.", "tags": {"protections.withdraw": 1, "needs.connection": 1}}
      ]
    },
    {
      "question_id": "q2_interpretation",
      "step": "interpretation",
      "prompt": "Wat is voor jou het verschil tussen vrijheid en overleg?",
      "helper_text": "Wat maak jij hiervan — los van wat je zou 'moeten' denken?",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Vrijheid is fijn, maar overleg zegt: jij bestaat in mijn wereld.", "tags": {"needs.recognition": 2, "needs.connection": 2}},
        {"option_id": "B", "label": "Overleg is niet nodig — maar een kleine mededeling had genoeg geweest.", "tags": {"needs.connection": 1, "needs.stability": 1}},
        {"option_id": "C", "label": "Vrijheid en overleg sluiten elkaar niet uit. Ik wil allebei.", "tags": {"needs.freedom": 1, "needs.connection": 2}},
        {"option_id": "D", "label": "Voor mij is vrijheid vanzelfsprekend — maar ik snap dat de ander dat anders ervaart.", "tags": {"needs.freedom": 2, "needs.autonomy": 1}},
        {"option_id": "E", "label": "Dit raakt iets diepers: zijn wij een team of twee individuen die toevallig samen zijn?", "tags": {"needs.stability": 2, "sensitive_points.not_chosen": 1}}
      ]
    }
  ],
  "outputs": {
    "solo": {
      "mirror": "Vrijheid en betrokkenheid — twee behoeften die in één relatie naast elkaar moeten bestaan. Jij merkt wanneer het evenwicht kantelt.",
      "protection_reflection": "Stil blijven of je aanpassen als een spontaan plan je raakt — dat beschermt jou tegen het conflict, maar laat de onvrede onzichtbaar.",
      "need_reflection": "Jij hebt behoefte aan het gevoel dat jij er toe doet in de plannen van de ander. Dat is geen controle — dat is verbinding.",
      "chance": "Dit moment nodigt uit om te zeggen wat overleg voor jou betekent — niet als regel, maar als behoefte.",
      "challenge": "Kun jij het gesprek starten zonder te klagen, maar als eerlijk verzoek?",
      "experiment": "Zeg één keer: 'Ik vraag je niet om alles te overleggen. Maar een klein bericht vooraf doet iets met mij. Is dat haalbaar?'",
      "gentle_phrase": "Verbinding hoeft geen vrijheid te kosten. Maar vrijheid mag verbinding niet onzichtbaar maken."
    },
    "couple": {
      "comparison_intro": "Spontaniteit en overleg — jullie zitten hier waarschijnlijk anders in.",
      "what_a_may_hear": "A voelt zich buitengesloten bij een beslissing zonder overleg. Dat is geen overdrijving — dat is wat verbinding voor A betekent.",
      "what_b_may_hear": "B heeft iets spontaan gedaan — en begrijpt misschien niet waarom dat een issue is. Voor B is vrijheid normaal.",
      "what_each_protects": "A beschermt verbinding door overleg te verwachten. B beschermt vrijheid door spontaan te handelen.",
      "shared_chance": "Samen een kleine norm maken: wanneer is overleg fijn, wanneer is het niet nodig?",
      "shared_challenge": "Hoe geeft A ruimte aan B's vrijheid? Hoe laat B zien dat A's aanwezigheid telt?",
      "shared_experiment": "Spreek af: bij een spontaan plan stuurt B een bericht — geen toestemming vragen, maar een mededeling. Oefen dat."
    }
  }
},

"D4_TENSION_003": {
  "questions": [
    {
      "question_id": "q1_emotion",
      "step": "emotion",
      "prompt": "Wat voel je als jij of je partner zich ontwikkelt op een manier die jullie verschil vergroot?",
      "helper_text": "Kies wat het meest herkenbaar is, niet wat het netst klinkt.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Trots op de ander, maar ook een licht gevoel van achterblijven.", "tags": {"needs.stability": 1, "sensitive_points.not_enough": 1}},
        {"option_id": "B", "label": "Angst — gaan we nog wel dezelfde kant op?", "tags": {"needs.stability": 2, "sensitive_points.losing_self": 1}},
        {"option_id": "C", "label": "Vrijheid — dit hoort bij een gezonde relatie.", "tags": {"needs.freedom": 2, "needs.autonomy": 1}},
        {"option_id": "D", "label": "Eenzaamheid — groei voelt soms als weglopen.", "tags": {"needs.connection": 2, "sensitive_points.abandonment": 1}},
        {"option_id": "E", "label": "Onzekerheid — groei bij de ander legt bloot wat bij mij stilstaat.", "tags": {"needs.recognition": 1, "sensitive_points.not_enough": 2}}
      ]
    },
    {
      "question_id": "q2_interpretation",
      "step": "interpretation",
      "prompt": "Wat zegt de spanning rond groei over wat jij nodig hebt in de relatie?",
      "helper_text": "Wat maak jij hiervan — los van wat je zou 'moeten' denken?",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Ik heb richting nodig — het gevoel dat we samen ergens naartoe gaan.", "tags": {"needs.stability": 2, "needs.connection": 2}},
        {"option_id": "B", "label": "Ik heb bevestiging nodig dat groei ons niet uit elkaar trekt.", "tags": {"needs.reassurance": 2, "needs.stability": 1}},
        {"option_id": "C", "label": "Ik heb ruimte nodig om zelf ook te groeien — zonder vergeleken te worden.", "tags": {"needs.freedom": 2, "needs.recognition": 1}},
        {"option_id": "D", "label": "Ik heb eerlijkheid nodig — samen kijken of we nog op één lijn zitten.", "tags": {"needs.honesty": 2, "needs.stability": 1}},
        {"option_id": "E", "label": "Ik heb eigenlijk geen bevestiging nodig — groei is positief voor ons allebei.", "tags": {"needs.freedom": 2, "needs.autonomy": 1}}
      ]
    }
  ],
  "outputs": {
    "solo": {
      "mirror": "Groei is goed — maar als de afstand vergroot, raakt het iets wezenlijks. Jouw reactie laat zien hoe jij verbinding en ontwikkeling met elkaar verhoudt.",
      "protection_reflection": "De spanning bij groei is soms een bescherming: als ik het probleem benoem vóór het er is, ben ik al voorbereid op verlies. Maar het kan ook groei in de weg staan.",
      "need_reflection": "Jij hebt behoefte aan een gedeelde richting — niet dat jullie alles hetzelfde doen, maar dat jullie weten waarheen.",
      "chance": "Groei van de ander hoeft niet te bedreigen. Het kan ook uitnodigen.",
      "challenge": "Kun jij de ontwikkeling van je partner toejuichen zonder je eigen plek in de relatie te verliezen?",
      "experiment": "Vraag je partner deze week: 'Wat leer jij nu? En hoe kan ik daarin bij je zijn, ook al doe ik het niet zelf?'",
      "gentle_phrase": "Twee mensen die groeien hoeven niet uiteen te groeien. Dat is een keuze."
    },
    "couple": {
      "comparison_intro": "Groei raakt jullie allebei — maar de vraag is wie waar staat in dit verhaal.",
      "what_a_may_hear": "A voelt de spanning van verandering. Dat is niet kleinzielig — het is zorg voor verbinding.",
      "what_b_may_hear": "B groeit — en wil daarin gesteund worden. Maar voelt B ook wat het met A doet?",
      "what_each_protects": "A beschermt verbinding door de groei kritisch te volgen. B beschermt de eigen ontwikkeling door er ruimte voor te vragen.",
      "shared_chance": "Samen een gesprek starten: hoe kunnen we groeien zonder de afstand te vergroten?",
      "shared_challenge": "Hoe houdt B verbinding terwijl hij/zij groeit? Hoe geeft A ruimte zonder zichzelf te verliezen?",
      "shared_experiment": "Plan één keer per maand een 'groeicheck-in': wat groeit er bij jou, en hoe gaat dat voor ons?"
    }
  }
},

"D4_TENSION_004": {
  "questions": [
    {
      "question_id": "q1_emotion",
      "step": "emotion",
      "prompt": "Wat voel je als je partner je geslotenheid rond je telefoon als afstand ervaart?",
      "helper_text": "Kies wat het meest herkenbaar is, niet wat het netst klinkt.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Ik voel me onterecht beschuldigd — mijn privacy is mijn privacy.", "tags": {"needs.autonomy": 2, "needs.freedom": 2}},
        {"option_id": "B", "label": "Ik voel schuld — ook al heb ik niets te verbergen.", "tags": {"protections.appease": 2, "sensitive_points.judgment": 1}},
        {"option_id": "C", "label": "Ik voel frustratie — dit gaat niet over mijn telefoon maar over vertrouwen.", "tags": {"needs.honesty": 2, "needs.autonomy": 1}},
        {"option_id": "D", "label": "Ik begrijp het — maar ik wil toch mijn eigen ruimte.", "tags": {"needs.freedom": 2, "needs.autonomy": 2}},
        {"option_id": "E", "label": "Ik voel de druk om open te zijn, ook als ik dat niet wil.", "tags": {"needs.autonomy": 2, "protections.distance": 1}}
      ]
    },
    {
      "question_id": "q2_interpretation",
      "step": "interpretation",
      "prompt": "Waar gaat dit gesprek eigenlijk over voor jou?",
      "helper_text": "Wat maak jij hiervan — los van wat je zou 'moeten' denken?",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Over autonomie — mag ik een privéwereld hebben in een relatie?", "tags": {"needs.autonomy": 2, "needs.freedom": 2}},
        {"option_id": "B", "label": "Over vertrouwen — en wie dat moet bewijzen.", "tags": {"needs.honesty": 2, "sensitive_points.not_trusted": 1}},
        {"option_id": "C", "label": "Over de grens tussen samen en apart — en waar die ligt.", "tags": {"needs.freedom": 2, "needs.stability": 1}},
        {"option_id": "D", "label": "Over oud wantrouwen dat van de ander is, niet van mij.", "tags": {"sensitive_points.not_trusted": 1, "needs.honesty": 1}},
        {"option_id": "E", "label": "Ik weet het niet precies — dit gesprek heeft al eerder gespeeld.", "tags": {"patterns.pursue_withdraw": 1, "needs.stability": 1}}
      ]
    }
  ],
  "outputs": {
    "solo": {
      "mirror": "Privacy is geen schuld. Maar het gesprek erover is ook geen aanval. Jij zit tussen twee waarden: je eigen ruimte en de verbinding met de ander.",
      "protection_reflection": "Jezelf verdedigen als iemand je privéruimte aankaart — dat is begrijpelijk. Maar defensiviteit sluit soms ook het gesprek dat eigenlijk nodig is.",
      "need_reflection": "Jij hebt behoefte aan een eigen wereld naast de gedeelde wereld. Dat is gezond. En het vraagt ook om een gesprek over waar de grens loopt.",
      "chance": "Dit moment nodigt jullie uit om te bespreken wat privacy en vertrouwen voor ieder van jullie betekenen.",
      "challenge": "Kun jij je eigen grens uitleggen zonder je te moeten verdedigen?",
      "experiment": "Zeg: 'Mijn telefoon is mijn ruimte, niet mijn geheim. Wat maakt dit moeilijk voor jou?' En luister.",
      "gentle_phrase": "Eigen ruimte hebben is geen verraad. Het is een manier om jezelf te bewaken."
    },
    "couple": {
      "comparison_intro": "Privacy en openheid — voor jullie zijn dit waarschijnlijk verschillende behoeften.",
      "what_a_may_hear": "A heeft een privéruimte nodig. Dat is niet verdacht — maar het raakt B op een manier die moeilijk te negeren is.",
      "what_b_may_hear": "B ervaart geslotenheid als afstand. Dat is geen overdrijving — dat is wat verbinding voor B betekent.",
      "what_each_protects": "A beschermt autonomie door grenzen te bewaken. B beschermt verbinding door openheid te zoeken.",
      "shared_chance": "Samen onderscheid maken: wat is privé (eigen ruimte) en wat is geheimhouding (iets verbergen)?",
      "shared_challenge": "Hoe geeft A ruimte aan B's behoefte aan verbinding? Hoe geeft B ruimte aan A's behoefte aan autonomie?",
      "shared_experiment": "Maak een afspraak: wat is oké als eigen ruimte, wat is voor jullie beiden geen issue? Schrijf het op."
    }
  }
},

"D4_DEEP_001": {
  "questions": [
    {
      "question_id": "q1_emotion",
      "step": "emotion",
      "prompt": "Wat voel je als verwachtingen van de ander dichterbij komen en er weerstand in jou opkomt?",
      "helper_text": "Kies wat het meest herkenbaar is, niet wat het netst klinkt.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Paniek of spanning — ik wil weg, ook al wil ik niet weg.", "tags": {"needs.freedom": 2, "sensitive_points.losing_self": 2}},
        {"option_id": "B", "label": "Irritatie — alsof ik in een hoek gedreven word.", "tags": {"needs.autonomy": 2, "protections.distance": 1}},
        {"option_id": "C", "label": "Verwarring — ik houd van de ander maar wil toch ruimte. Dat klopt niet.", "tags": {"needs.freedom": 2, "sensitive_points.losing_self": 1}},
        {"option_id": "D", "label": "Ik ga afstand scheppen — een uitje, werk, bezigheid.", "tags": {"protections.withdraw": 2, "needs.freedom": 2}},
        {"option_id": "E", "label": "Ik word stil — ik verberg de weerstand maar voel hem wel.", "tags": {"protections.distance": 2, "needs.freedom": 1}}
      ]
    },
    {
      "question_id": "q2_sensitive_point",
      "step": "sensitive_point",
      "prompt": "Wat is er zo eng aan te dichtbij laten komen?",
      "helper_text": "Niet wat je denkt dat je zou moeten voelen — wat herken jij echt?",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Dat ik mezelf verlies als de ander te veel ruimte inneemt.", "tags": {"sensitive_points.losing_self": 3, "needs.autonomy": 1}},
        {"option_id": "B", "label": "Dat ik verantwoordelijk word voor het geluk van de ander — en dat nooit goed genoeg kan doen.", "tags": {"protections.withdraw": 1, "sensitive_points.not_enough": 2}},
        {"option_id": "C", "label": "Dat ik niet meer weet wie ik zelf ben als we te erg in elkaar vergroeien.", "tags": {"sensitive_points.losing_self": 2, "needs.autonomy": 2}},
        {"option_id": "D", "label": "Dat intimiteit leidt tot verlies — van mezelf, of van de ander.", "tags": {"sensitive_points.abandonment": 1, "sensitive_points.losing_self": 2}},
        {"option_id": "E", "label": "Ik weet het niet precies — maar als het te echt wordt, wil ik achteruitstappen.", "tags": {"protections.distance": 2, "needs.freedom": 2}}
      ]
    }
  ],
  "outputs": {
    "solo": {
      "mirror": "Weerstand bij verwachtingen betekent niet dat jij niet wil verbinden. Het betekent dat jij jezelf nodig hebt om te kunnen verbinden. Die grens beschermt iets echts.",
      "protection_reflection": "Terugtrekken, afstand scheppen, stil worden — jij creëert ruimte als die er niet vanzelf is. Dat werkt. Maar de ander merkt de afstand soms als afwijzing.",
      "need_reflection": "Jij hebt behoefte aan ruimte als voorwaarde voor nabijheid. Niet als vlucht, maar als adem. Dat is een legitieme behoefte.",
      "chance": "Jij kunt leren zeggen wat je nodig hebt vóórdat je het moet afdwingen door weg te gaan.",
      "challenge": "Kun jij de weerstand benoemen terwijl je nog bij de ander bent, in plaats van erna?",
      "experiment": "Oefen één zin: 'Ik merk dat ik ruimte nodig heb. Ik ben er straks weer.' Geen uitleg, geen discussie. Alleen die zin.",
      "gentle_phrase": "Jij kunt liefhebben en jezelf tegelijk houden. Het is niet kiezen."
    },
    "couple": {
      "comparison_intro": "Nabijheid en weerstand — voor A voelen die soms gelijktijdig.",
      "what_a_may_hear": "A houdt van B maar merkt weerstand als het te dicht wordt. Dat is geen afwijzing — dat is zelfbehoud.",
      "what_b_may_hear": "B zoekt nabijheid en ervaart soms de terugtrekking van A als afstand. Dat doet pijn, ook als A dat niet bedoelt.",
      "what_each_protects": "A beschermt zichzelf door ruimte te bewaken. B beschermt zichzelf door verbinding te zoeken.",
      "shared_chance": "Samen begrijpen: wat heeft A nodig om echt aanwezig te zijn? Wat heeft B nodig om de ruimte niet als afwijzing te voelen?",
      "shared_challenge": "Hoe maakt B ruimte voor A's behoefte aan autonomie? Hoe communiceert A vóór de weerstand groot wordt?",
      "shared_experiment": "Spreek een signaal af: als A ruimte nodig heeft, zegt A dat. B reageert met: 'Oké, ik ben er als je terugkomt.' Oefen dat één keer."
    }
  }
},

"D4_DEEP_002": {
  "questions": [
    {
      "question_id": "q1_emotion",
      "step": "emotion",
      "prompt": "Wat voel je als je eigen ruimte wilt maar tegelijk schuldgevoel voelt?",
      "helper_text": "Kies wat het meest herkenbaar is, niet wat het netst klinkt.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Ik voel me verscheurd — ik wil het maar voel me er slecht over.", "tags": {"needs.freedom": 2, "protections.appease": 2}},
        {"option_id": "B", "label": "Vermoeidheid — altijd balanceren tussen mezelf en de ander.", "tags": {"needs.freedom": 2, "sensitive_points.not_enough": 1}},
        {"option_id": "C", "label": "Boosheid op mezelf — ik zou dit toch gewoon moeten kunnen.", "tags": {"needs.autonomy": 2, "sensitive_points.not_enough": 1}},
        {"option_id": "D", "label": "Ik voel de schuld maar neem de ruimte toch — en hoop dat het goedkomt.", "tags": {"needs.freedom": 2, "protections.appease": 1}},
        {"option_id": "E", "label": "Ik slik het in — ruimte vragen kost meer dan het oplevert.", "tags": {"protections.withdraw": 2, "needs.freedom": 2}}
      ]
    },
    {
      "question_id": "q2_sensitive_point",
      "step": "sensitive_point",
      "prompt": "Waar komt dat schuldgevoel vandaan?",
      "helper_text": "Niet wat je denkt dat je zou moeten voelen — wat herken jij echt?",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Van het idee dat ik de ander telustel als ik voor mezelf kies.", "tags": {"sensitive_points.not_enough": 2, "protections.appease": 2}},
        {"option_id": "B", "label": "Van de overtuiging dat mijn behoeften minder mogen tellen dan die van de ander.", "tags": {"sensitive_points.not_enough": 3, "needs.recognition": 1}},
        {"option_id": "C", "label": "Van vroeger leren dat ruimte nemen straf of verlies betekende.", "tags": {"sensitive_points.abandonment": 2, "needs.safety": 1}},
        {"option_id": "D", "label": "Van het gevoel dat ik verantwoordelijk ben voor het welzijn van de ander.", "tags": {"protections.overperform": 2, "sensitive_points.not_enough": 1}},
        {"option_id": "E", "label": "Ik weet het niet precies — ik voel het gewoon als ik eraan begin.", "tags": {"needs.freedom": 1, "centers.body": 1}}
      ]
    }
  ],
  "outputs": {
    "solo": {
      "mirror": "Ruimte willen én schuldgevoel voelen — dat zijn twee dingen die tegelijk kunnen bestaan. Jij probeert jezelf te zijn zonder de ander te verliezen. Dat vraagt iets.",
      "protection_reflection": "Schuld als je voor jezelf kiest is een bescherming: als ik me slecht voel, heb ik de ander al gestraft vóór hij/zij klaagt. Maar het houdt jou ook klein.",
      "need_reflection": "Jij hebt behoefte aan ruimte die niet betaald wordt met schuldgevoel. Jouw behoeften mogen er zijn zonder prijs.",
      "chance": "Schuld voelen en toch ruimte nemen — dat is al groei. De volgende stap is het schuldgevoel niet laten winnen.",
      "challenge": "Kun jij ruimte nemen zonder verontschuldiging? Alleen zeggen wat je nodig hebt?",
      "experiment": "Zeg één keer: 'Ik ga even tijd voor mezelf nemen.' Geen uitleg. Geen sorry. Kijk hoe dat voelt.",
      "gentle_phrase": "Jouw behoeften zijn niet te veel. Ze zijn van jou."
    },
    "couple": {
      "comparison_intro": "Ruimte nemen en schuld voelen — dat raakt iets dat groter is dan dit moment.",
      "what_a_may_hear": "A wil ruimte maar voelt schuld. Dat zegt iets over hoe A geleerd heeft dat eigen behoeften een risico zijn.",
      "what_b_may_hear": "B ontvangt misschien half aanwezigheid of half afstand — omdat A niet echt ruimte neemt maar ook niet echt aanwezig is.",
      "what_each_protects": "A beschermt zichzelf door schuld te voelen en daarmee de ander niet te belasten. B beschermt zichzelf door de ambivalentie van A niet hardop te benoemen.",
      "shared_chance": "Samen normaliseren: ruimte nemen is gezond. Het is geen aanval op de verbinding.",
      "shared_challenge": "Hoe geeft B actief ruimte zodat A het niet hoeft te veroveren? Hoe leert A ruimte nemen zonder schuldgevoel?",
      "shared_experiment": "B zegt deze week actief: 'Neem je eigen tijd vandaag. Ik ben er als je terugkomt.' Zonder verwachting."
    }
  }
}

}

# Update cases
updated = 0
for c in cases:
    cid = c['case_id']
    if cid in D4_CASES:
        c['questions'] = D4_CASES[cid]['questions']
        c['outputs'] = D4_CASES[cid]['outputs']
        updated += 1
        print('Updated: ' + cid)

data['cases'] = cases

with open('cases.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print('\nDone! Updated ' + str(updated) + ' D4 cases.')
