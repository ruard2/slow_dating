# -*- coding: utf-8 -*-
import json, sys
sys.stdout.reconfigure(encoding='utf-8')

with open('cases.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

cases = data['cases']

D7_CASES = {

"D7_POSITIVE_001": {
  "questions": [
    {
      "question_id": "q1_reaction",
      "step": "reaction",
      "prompt": "Wat doet het met jou als je partner terugkomt en zegt: 'Ik wil niet dat we zo blijven'?",
      "helper_text": "Kies wat het meest herkenbaar is, niet wat het netst klinkt.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Ik voel iets zachter worden — dit is het moment waarop ik op wacht.", "tags": {"needs.connection": 2, "needs.reassurance": 2}},
        {"option_id": "B", "label": "Ik voel opluchting maar ook voorzichtigheid — laat ik maar zien of het echt is.", "tags": {"needs.reassurance": 2, "protections.control": 1}},
        {"option_id": "C", "label": "Ik voel iets van dankbaarheid — de moed om terug te komen is niet klein.", "tags": {"needs.connection": 2, "skills.repair": 1}},
        {"option_id": "D", "label": "Ik voel de spanning nog — even één zin is niet genoeg.", "tags": {"needs.reassurance": 2, "sensitive_points.not_enough": 1}},
        {"option_id": "E", "label": "Ik ga meteen mee — ik wil het ook niet zo laten.", "tags": {"skills.repair": 2, "needs.connection": 2}}
      ]
    },
    {
      "question_id": "q2_need",
      "step": "need",
      "prompt": "Wat heeft dit soort herstelgebaar voor jou?",
      "helper_text": "Niet wat je denkt dat je zou moeten willen — wat helpt jou echt?",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Het zegt: jij kiest voor ons, ook als het moeilijk is.", "tags": {"needs.connection": 2, "needs.reassurance": 2}},
        {"option_id": "B", "label": "Het geeft mij bewijs dat conflict niet het einde is.", "tags": {"needs.safety": 2, "needs.stability": 1}},
        {"option_id": "C", "label": "Het doet de pijn niet weg maar maakt de weg terug open.", "tags": {"needs.connection": 2, "skills.repair": 1}},
        {"option_id": "D", "label": "Het laat zien dat herstellen iets van ons allebei kan zijn.", "tags": {"skills.repair": 2, "needs.connection": 1}},
        {"option_id": "E", "label": "Het geeft eigenlijk niet zo veel — ik verwacht meer dan een zinnetje.", "tags": {"needs.reassurance": 2, "sensitive_points.not_enough": 1}}
      ]
    }
  ],
  "outputs": {
    "solo": {
      "mirror": "Eén zin na een conflict — en iets wordt zachter. Dat is niet niets. Jij reageert op de beweging van de ander, op het feit dat er terugkeren is.",
      "protection_reflection": "Voorzichtigheid bij een herstelgebaar is geen onwil. Jij weet uit ervaring dat terugkomen soms vluchtig is. Dat geheugen beschermt jou.",
      "need_reflection": "Jij hebt behoefte aan een partner die terugkomt — niet als het makkelijk is, maar juist als het moeilijk is. Die beweging is voor jou het bewijs van keuze.",
      "chance": "Dit moment laat zien dat herstel kan beginnen met een kleine stap. Jij hoeft niet te wachten op perfectie.",
      "challenge": "Kun jij de zachtheid die je voelt ook laten zien — zonder dat alles al opgelost is?",
      "experiment": "Zeg de volgende keer als het scherp was: 'Ik wil ook niet dat we zo blijven.' Kijk wat die zin doet.",
      "gentle_phrase": "Terugkomen is ook een taal van liefde."
    },
    "couple": {
      "comparison_intro": "Na een conflict terugkeren — voor A en B kan dat heel verschillende dingen betekenen.",
      "what_a_may_hear": "A hoort in het terugkomen van B een keuze voor de relatie. Dat raakt meer dan het gesprek zelf.",
      "what_b_may_hear": "B maakte een stap. Maar weet B hoe groot die stap voelde voor A?",
      "what_each_protects": "A beschermt zichzelf door voorzichtig te zijn. B beschermt zichzelf door de eerste stap te zetten.",
      "shared_chance": "Samen leren: herstel begint met beweging, niet met de perfecte woorden.",
      "shared_challenge": "Hoe gaat het proces verder na die eerste zin? Hoe wordt de zachtheid ook verdiept?",
      "shared_experiment": "Spreek een herstelritueel af: na een conflict begint één van jullie met een kleine beweging. De ander ontvangt het. Geen groot gesprek nodig."
    }
  }
},

"D7_POSITIVE_002": {
  "questions": [
    {
      "question_id": "q1_emotion",
      "step": "emotion",
      "prompt": "Wat voel je als iemand excuses maakt zonder te verdedigen of gelijk te zoeken?",
      "helper_text": "Kies wat het meest herkenbaar is, niet wat het netst klinkt.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Ik word geraakt — dit is zeldzamer dan het zou moeten zijn.", "tags": {"needs.recognition": 2, "needs.connection": 1}},
        {"option_id": "B", "label": "Ik voel ontroering — de eenvoud van het excuus raakt mij.", "tags": {"skills.repair": 1, "needs.connection": 2}},
        {"option_id": "C", "label": "Ik voel opluchting — nu kunnen we echt verder.", "tags": {"needs.safety": 2, "skills.repair": 1}},
        {"option_id": "D", "label": "Ik wil het geloven maar iets in mij wacht op de 'maar'.", "tags": {"needs.reassurance": 2, "protections.control": 1}},
        {"option_id": "E", "label": "Ik neem het aan maar voel ook: dit had eerder mogen komen.", "tags": {"sensitive_points.not_enough": 1, "needs.recognition": 1}}
      ]
    },
    {
      "question_id": "q2_interpretation",
      "step": "interpretation",
      "prompt": "Wat zegt een eerlijk excuus over jullie relatie?",
      "helper_text": "Wat maak jij hiervan — los van wat je zou 'moeten' denken?",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Het zegt dat er meer is dan gelijk hebben — er is verbinding.", "tags": {"needs.connection": 2, "skills.repair": 2}},
        {"option_id": "B", "label": "Het zegt dat jij groot genoeg bent om je eigen fout te zien.", "tags": {"skills.repair": 2, "needs.honesty": 1}},
        {"option_id": "C", "label": "Het geeft mij vertrouwen dat fouten herstelbaar zijn.", "tags": {"needs.safety": 2, "needs.stability": 1}},
        {"option_id": "D", "label": "Het zegt: wij kunnen eerlijk zijn, ook over onze schaduwkanten.", "tags": {"needs.honesty": 2, "needs.connection": 1}},
        {"option_id": "E", "label": "Het is fijn, maar ik wil ook weten dat het gedrag verandert.", "tags": {"needs.stability": 2, "needs.reassurance": 1}}
      ]
    }
  ],
  "outputs": {
    "solo": {
      "mirror": "Een excuus zonder verdediging — jij merkt hoe anders dat aankomt. Niet 'sorry maar...' maar gewoon: het spijt me. Dat is niet makkelijk en het opent iets.",
      "protection_reflection": "Wachten op de 'maar', wachten of het gedrag verandert — dat zijn beschermingen die jij opbouwde omdat excuses niet altijd echt waren. Dat geheugen is terecht.",
      "need_reflection": "Jij hebt behoefte aan eerlijkheid over fouten — en aan herstel dat gedrag meeneemt, niet alleen woorden.",
      "chance": "Dit moment toont dat schuldige dingen zeggen de relatie niet breekt — het herstelt hem.",
      "challenge": "Kun jij het excuus ontvangen zonder meteen te toetsen of het 'echt' is?",
      "experiment": "Oefen zelf een eerlijk excuus: geen 'sorry als jij je zo voelde', maar 'dat was niet goed van mij.' Kijk hoe dat voelt.",
      "gentle_phrase": "Een excuus zonder maar is een geschenk. Jij mag het ontvangen."
    },
    "couple": {
      "comparison_intro": "Excuses maken en ontvangen — dat heeft voor beiden een eigen gewicht.",
      "what_a_may_hear": "A ontvangt het excuus — en merkt hoe zeldzaam dit voelt. Dat zegt iets over wat A gewend is.",
      "what_b_may_hear": "B heeft iets gezegd wat moeilijk was. Maar weet B hoe groot de impact is op A?",
      "what_each_protects": "A beschermt zichzelf door voorzichtig te zijn. B beschermt zichzelf door excuses te maken vóór het escaleert.",
      "shared_chance": "Samen leren: excuses zijn geen zwakte — ze zijn herstel.",
      "shared_challenge": "Hoe volgen jullie een excuus op met gedrag? Hoe ontvangt A het zonder te toetsen?",
      "shared_experiment": "Oefen één keer een eerlijk excuus in de komende week — voor iets kleins. Geen verdediging erna."
    }
  }
},

"D7_POSITIVE_003": {
  "questions": [
    {
      "question_id": "q1_reaction",
      "step": "reaction",
      "prompt": "Wat doet het met je als jullie na spanning toch weer contact maken — zelfs via een glimlach?",
      "helper_text": "Kies wat het meest herkenbaar is, niet wat het netst klinkt.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Ik voel iets ontdooien — dit is de relatie die ik wil.", "tags": {"needs.connection": 2, "skills.repair": 1}},
        {"option_id": "B", "label": "Ik voel opluchting vermengd met iets triests — de pijn was ook echt.", "tags": {"needs.connection": 1, "centers.body": 1}},
        {"option_id": "C", "label": "Ik word dankbaar — jullie kunnen dit.", "tags": {"skills.repair": 2, "needs.connection": 2}},
        {"option_id": "D", "label": "Ik neem het aan maar voel ook: we hebben het er nog niet echt over gehad.", "tags": {"needs.honesty": 1, "needs.stability": 1}},
        {"option_id": "E", "label": "Ik voel de spanning minder worden — luchtigheid is voor mij een manier van herstellen.", "tags": {"skills.repair": 2, "needs.freedom": 1}}
      ]
    },
    {
      "question_id": "q2_need",
      "step": "need",
      "prompt": "Wat heeft licht contact na conflict voor jou?",
      "helper_text": "Niet wat je denkt dat je zou moeten willen — wat helpt jou echt?",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Het zegt: wij zijn meer dan de ruzie.", "tags": {"needs.connection": 2, "needs.stability": 1}},
        {"option_id": "B", "label": "Het maakt het mogelijk om straks het gesprek wel te voeren — als het iets rustiger is.", "tags": {"needs.safety": 2, "skills.repair": 1}},
        {"option_id": "C", "label": "Het is soms genoeg — niet alles hoeft uitgesproken.", "tags": {"needs.freedom": 2, "needs.stability": 1}},
        {"option_id": "D", "label": "Het is een begin maar niet het einde — ik wil ook het gesprek nog.", "tags": {"needs.honesty": 2, "needs.connection": 1}},
        {"option_id": "E", "label": "Het geeft mij energie — luchtigheid helpt mij herstellen van spanning.", "tags": {"skills.repair": 2, "centers.body": 1}}
      ]
    }
  ],
  "outputs": {
    "solo": {
      "mirror": "Een glimlach na spanning — dat is niet het einde van het conflict, maar het begin van terugvinden. Jij merkt hoe klein contact al iets kan herstellen.",
      "protection_reflection": "Lachen kan ook een manier zijn om het gesprek uit te stellen. Als dat patroon herkend is, mag het besproken worden — maar dit moment laat ook zien dat er liefde onder zit.",
      "need_reflection": "Jij hebt behoefte aan contact na conflict — ook als dat contact klein is. Niet meteen alles oplossen, maar eerst weer bij elkaar zijn.",
      "chance": "Dit moment laat zien dat herstel niet altijd via woorden gaat. Soms via ogen.",
      "challenge": "Kun jij de glimlach ontvangen en daarna toch het gesprek nog aangaan — als dat nodig is?",
      "experiment": "Zoek na de volgende ruzie bewust één klein contact — een aanraking, een blik, een grap. Pas daarna het gesprek.",
      "gentle_phrase": "Jullie vonden elkaar terug. Dat is niet weinig."
    },
    "couple": {
      "comparison_intro": "Licht contact na conflict — voor A en B kan dat verschillende dingen betekenen.",
      "what_a_may_hear": "A voelt de glimlach als herstel. Maar is dat voor A genoeg, of wil A ook nog het gesprek?",
      "what_b_may_hear": "B kijkt en glimlacht — en denkt misschien: nu is het klaar. Maar weet B of dat voor A ook zo voelt?",
      "what_each_protects": "A beschermt zichzelf door licht contact als brug. B beschermt zichzelf door via luchtigheid het zware te vermijden.",
      "shared_chance": "Contact als brug, niet als afsluiting — samen leren wanneer het genoeg is.",
      "shared_challenge": "Hoe houden jullie ruimte voor het gesprek als luchtigheid de afsluiting dreigt te worden?",
      "shared_experiment": "Maak een afspraak: na een glimlach of licht contact, één kleine vraag: 'Is er nog iets wat je wil zeggen?' Zo blijft de deur open."
    }
  }
},

"D7_POSITIVE_004": {
  "questions": [
    {
      "question_id": "q1_emotion",
      "step": "emotion",
      "prompt": "Wat voel je als je het oneens kunt blijven zonder dat de relatie eronder lijdt?",
      "helper_text": "Kies wat het meest herkenbaar is, niet wat het netst klinkt.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Vrijheid — ik hoef niet te winnen of me aan te passen.", "tags": {"needs.freedom": 2, "needs.autonomy": 2}},
        {"option_id": "B", "label": "Opluchting — dit is de versie van de relatie die ik wil.", "tags": {"needs.safety": 2, "needs.connection": 1}},
        {"option_id": "C", "label": "Iets van verbazing — ik ben niet gewend dat verschil zo kan zijn.", "tags": {"needs.safety": 2, "sensitive_points.not_enough": 1}},
        {"option_id": "D", "label": "Rust — de verbinding is groter dan het meningsverschil.", "tags": {"needs.connection": 2, "needs.stability": 1}},
        {"option_id": "E", "label": "Een lichte onzekerheid — als we het zo laten, is het dan wel echt besproken?", "tags": {"needs.honesty": 1, "needs.stability": 1}}
      ]
    },
    {
      "question_id": "q2_interpretation",
      "step": "interpretation",
      "prompt": "Wat zegt het dat jullie niet hoeven te winnen?",
      "helper_text": "Wat maak jij hiervan — los van wat je zou 'moeten' denken?",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Het zegt dat wij allebei ruimte innemen — ook als we het niet eens zijn.", "tags": {"needs.freedom": 2, "needs.connection": 1}},
        {"option_id": "B", "label": "Het zegt dat onze relatie groter is dan gelijk hebben.", "tags": {"needs.connection": 2, "skills.repair": 1}},
        {"option_id": "C", "label": "Het geeft mij vertrouwen dat we ook grotere conflicten aankunnen.", "tags": {"needs.safety": 2, "needs.stability": 1}},
        {"option_id": "D", "label": "Het zegt dat ik mezelf mag zijn — ook de kant die niet met jou meegaat.", "tags": {"needs.freedom": 2, "needs.autonomy": 1}},
        {"option_id": "E", "label": "Het stelt mij gerust — we hoeven niet alles opgelost te hebben.", "tags": {"needs.safety": 2, "needs.freedom": 1}}
      ]
    }
  ],
  "outputs": {
    "solo": {
      "mirror": "Oneens blijven zonder dat de verbinding breekt — dat vraagt iets. Van jou en van de ander. Jij merkt het als dat lukt.",
      "protection_reflection": "Een lichte onzekerheid of het echt besproken is beschermt jou tegen de schijn van oplossing. Dat gevoel mag er zijn — en mag benoemd worden.",
      "need_reflection": "Jij hebt behoefte aan een relatie waar jij jezelf niet hoeft in te leveren om verbonden te blijven. Verschil mag coëxisteren.",
      "chance": "Dit moment is bewijs: het kan. Verschil zonder breken.",
      "challenge": "Kun jij 'we zijn het oneens' zeggen zonder dat jij het als verlies ervaart?",
      "experiment": "Benoem het de volgende keer als een meningsverschil niet escaleert: 'We zien het anders en dat is oké.' Hardop zeggen versterkt het.",
      "gentle_phrase": "Verschil is geen gevaar. Het is de ruimte tussen twee echte mensen."
    },
    "couple": {
      "comparison_intro": "Oneens blijven — voor A en B betekent dat misschien iets anders.",
      "what_a_may_hear": "A voelt ruimte in het verschil. Dat is voor A een teken dat de relatie echt is.",
      "what_b_may_hear": "B heeft ook iets laten gaan — niet gelijk hoeven halen. Hoe voelt dat voor B?",
      "what_each_protects": "A beschermt zichzelf door niet te willen winnen. B beschermt zichzelf door de rust te bewaren.",
      "shared_chance": "Samen bouwen aan gesprekken waar verschil niet de verbinding kost.",
      "shared_challenge": "Hoe houden jullie ruimte voor verschil ook als het onderwerp groter en zwaarder is?",
      "shared_experiment": "Oefen één keer het zinnetje: 'Ik zie het anders dan jij — en dat hoeft nu niet opgelost.' Kijk hoe dat landt."
    }
  }
},

"D7_TENSION_001": {
  "questions": [
    {
      "question_id": "q1_reaction",
      "step": "reaction",
      "prompt": "Wat is jouw eerste reactie als een gesprek van nu ineens gaat over vroeger?",
      "helper_text": "Kies wat het meest herkenbaar is, niet wat het netst klinkt.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Ik ga in de verdediging — dat is iets anders, dat was toen.", "tags": {"protections.control": 2, "needs.stability": 1}},
        {"option_id": "B", "label": "Ik voel me overweldigd — er komt te veel tegelijk.", "tags": {"centers.body": 1, "needs.safety": 2}},
        {"option_id": "C", "label": "Ik stop met luisteren — als het toch over alles gaat, haakt mijn hoofd af.", "tags": {"protections.withdraw": 2, "needs.stability": 1}},
        {"option_id": "D", "label": "Ik rakel zelf ook oude dingen op — als we toch bezig zijn.", "tags": {"patterns.pursue_withdraw": 1, "protections.control": 1}},
        {"option_id": "E", "label": "Ik merk het maar probeer bij het nu te blijven.", "tags": {"skills.self_regulation": 2, "needs.stability": 1}}
      ]
    },
    {
      "question_id": "q2_interpretation",
      "step": "interpretation",
      "prompt": "Wat hoor jij vanbinnen als de oude dossiers opengaan?",
      "helper_text": "Wat maak jij hiervan — los van wat je zou 'moeten' denken?",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Ik hoor: er is iets uit het verleden dat nooit echt besproken is.", "tags": {"needs.honesty": 2, "needs.stability": 1}},
        {"option_id": "B", "label": "Ik hoor: ik raap alles op om gelijk te krijgen.", "tags": {"protections.control": 2, "needs.recognition": 1}},
        {"option_id": "C", "label": "Ik hoor: de pijn van nu is niet de echte pijn — die zit dieper.", "tags": {"sensitive_points.not_seen": 2, "needs.connection": 1}},
        {"option_id": "D", "label": "Ik hoor: ik vertrouw jou niet genoeg om bij dit moment te blijven.", "tags": {"needs.safety": 2, "sensitive_points.not_trusted": 1}},
        {"option_id": "E", "label": "Ik hoor de patronen die we nog niet hebben doorbroken.", "tags": {"patterns.pursue_withdraw": 2, "needs.stability": 1}}
      ]
    }
  ],
  "outputs": {
    "solo": {
      "mirror": "Oud pijn oprakelen in een nieuw conflict — jij merkt wanneer dat gebeurt. Soms is het de enige manier om te zeggen: er is iets dat nooit echt gezien is.",
      "protection_reflection": "In de verdediging gaan of zelf ook oud ophalen beschermt jou tegen het gevoel dat je verliest. Maar het zorgt ook dat het huidige moment verdrinkt.",
      "need_reflection": "Jij hebt behoefte aan gesprekken die bij het nu blijven — of aan ruimte om oud pijn apart te bespreken. Niet tegelijk, maar niet weggeduwd.",
      "chance": "Dit patroon benoemen is de eerste stap: 'We gaan nu over vroeger. Is dat wat we willen?'",
      "challenge": "Kun jij stoppen met het ophalen van oud bewijs — ook als je het hebt?",
      "experiment": "Spreek af: als jullie merken dat het gesprek naar vroeger glijdt, pauzeert iemand en zegt: 'We zijn bij het verleden beland. Wil je dat nu, of later apart?'",
      "gentle_phrase": "Het verleden mag er zijn. Maar het hoeft het heden niet te overschaduwen."
    },
    "couple": {
      "comparison_intro": "Oud pijn in een nieuw conflict — voor beide partners een eigen ervaring.",
      "what_a_may_hear": "A hoort oud pijn oprakelen en zit vast tussen verdedigen en begrijpen.",
      "what_b_may_hear": "B haalt oud op — misschien omdat er iets is dat nooit echt besproken is.",
      "what_each_protects": "A beschermt zichzelf door te verdedigen. B beschermt zichzelf door meer bewijs te verzamelen.",
      "shared_chance": "Samen onderscheid maken: dit gesprek, dat gesprek. Nu en later.",
      "shared_challenge": "Hoe stoppen jullie het oprakelen zonder het oude te verdringen?",
      "shared_experiment": "Spreek een 'nu of later'-ronde af: als oud pijn opkomt, beslissen jullie samen: nu bespreken of op een ander moment? Schrijf het op als het later is."
    }
  }
},

"D7_TENSION_002": {
  "questions": [
    {
      "question_id": "q1_emotion",
      "step": "emotion",
      "prompt": "Wat voel je als er stilte is na een conflict — niet als rust, maar als kou?",
      "helper_text": "Kies wat het meest herkenbaar is, niet wat het netst klinkt.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Ik voel angst — dit is erger dan ruzie.", "tags": {"needs.safety": 2, "sensitive_points.abandonment": 1}},
        {"option_id": "B", "label": "Ik voel eenzaamheid — de ander is er maar er is geen contact.", "tags": {"needs.connection": 2, "sensitive_points.not_seen": 1}},
        {"option_id": "C", "label": "Ik voel schuld — ook al weet ik niet precies waarom.", "tags": {"protections.appease": 2, "sensitive_points.not_enough": 1}},
        {"option_id": "D", "label": "Ik voel boosheid — dit is een manier om mij te controleren.", "tags": {"needs.freedom": 2, "protections.distance": 1}},
        {"option_id": "E", "label": "Ik geef ook stilte terug — als jij zo doet, doe ik het ook.", "tags": {"patterns.pursue_withdraw": 1, "protections.distance": 1}}
      ]
    },
    {
      "question_id": "q2_sensitive_point",
      "step": "sensitive_point",
      "prompt": "Wat doet die stilte met jou van binnen?",
      "helper_text": "Niet wat je denkt dat je zou moeten voelen — wat herken jij echt?",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Ze bevestigt mijn angst: de ander gaat weg als het moeilijk is.", "tags": {"sensitive_points.abandonment": 2, "needs.safety": 2}},
        {"option_id": "B", "label": "Ze maakt mij klein — ik weet niet wat ik fout heb gedaan.", "tags": {"sensitive_points.not_enough": 2, "needs.recognition": 1}},
        {"option_id": "C", "label": "Ze trekt iets open van vroeger — ik ken deze stilte al.", "tags": {"sensitive_points.abandonment": 2, "needs.safety": 1}},
        {"option_id": "D", "label": "Ze maakt mij onzeker over de relatie — is dit te herstellen?", "tags": {"needs.reassurance": 2, "needs.stability": 1}},
        {"option_id": "E", "label": "Ze vult de ruimte met alles wat ik niet durf te vragen.", "tags": {"sensitive_points.not_seen": 2, "needs.connection": 1}}
      ]
    }
  ],
  "outputs": {
    "solo": {
      "mirror": "Stilte die koud is — dat is een specifieke pijn. Jij merkt het onderscheid met gezonde rust. De kou zegt iets, ook al zegt niemand iets.",
      "protection_reflection": "Schuld voelen bij die stilte, of zelf ook zwijgen — beide beschermen jou tegen het risico van toenadering zoeken en afgewezen worden.",
      "need_reflection": "Jij hebt behoefte aan verbinding na conflict, ook als het gesprek nog niet klaar is. Kleine tekenen van aanwezigheid zijn voor jou genoeg om te kunnen ademhalen.",
      "chance": "De stilte benoemen is al verbinding: 'Ik voel afstand. Ik wil die niet.'",
      "challenge": "Kun jij de eerste stap zetten — ook als de stilte van de ander is?",
      "experiment": "Zeg de volgende keer in de stilte: 'Ik merk dat we ver van elkaar zijn. Ik wil dat niet.' Geen aanklacht. Alleen het benoemen.",
      "gentle_phrase": "Jij mag contact willen ook als het net scherp was."
    },
    "couple": {
      "comparison_intro": "Stilte na conflict — voor de één rust, voor de ander kou.",
      "what_a_may_hear": "A voelt de stilte als verlating — ook als B dat niet bedoelt. Dat is echte pijn.",
      "what_b_may_hear": "B zwijgt om bij te komen. Maar weet B dat A dat als kou ervaart?",
      "what_each_protects": "A beschermt zichzelf door de stilte te voelen en klein te worden. B beschermt zichzelf door afstand te nemen na conflict.",
      "shared_chance": "Samen leren: stilte is oké, maar kou niet. Het onderscheid mag besproken worden.",
      "shared_challenge": "Hoe signaleert B dat het rust is en niet straf? Hoe vraagt A om contact zonder te pushen?",
      "shared_experiment": "Spreek een signaal af: als B stilte nodig heeft, zegt B: 'Ik heb even tijd nodig, maar ik ga niet weg.' Dat kleine zinnetje verandert alles."
    }
  }
},

"D7_TENSION_003": {
  "questions": [
    {
      "question_id": "q1_emotion",
      "step": "emotion",
      "prompt": "Wat voel je als een gesprek verandert in een strijd om gelijk?",
      "helper_text": "Kies wat het meest herkenbaar is, niet wat het netst klinkt.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Ik voel spanning toenemen — dit is niet waar ik voor kwam.", "tags": {"needs.connection": 2, "needs.stability": 1}},
        {"option_id": "B", "label": "Ik voel iets activeren — ik wil dit nu winnen.", "tags": {"protections.control": 2, "needs.recognition": 1}},
        {"option_id": "C", "label": "Ik voel verdriet — we zijn de verbinding kwijt en zoeken in bewijzen.", "tags": {"needs.connection": 2, "sensitive_points.not_seen": 1}},
        {"option_id": "D", "label": "Ik voel vermoeidheid — dit kost energie die niets oplevert.", "tags": {"needs.stability": 2, "needs.connection": 1}},
        {"option_id": "E", "label": "Ik voel frustratie — ik heb gelijk maar niemand ziet het.", "tags": {"needs.recognition": 2, "protections.control": 1}}
      ]
    },
    {
      "question_id": "q2_interpretation",
      "step": "interpretation",
      "prompt": "Wat wil je eigenlijk als je probeert gelijk te krijgen?",
      "helper_text": "Wat maak jij hiervan — los van wat je zou 'moeten' denken?",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Ik wil gezien worden — dat mijn ervaring telt.", "tags": {"needs.recognition": 2, "sensitive_points.not_seen": 2}},
        {"option_id": "B", "label": "Ik wil dat de ander mij begrijpt — niet per se mee eens is.", "tags": {"needs.recognition": 2, "needs.connection": 1}},
        {"option_id": "C", "label": "Ik wil niet als de schuldige worden aangewezen.", "tags": {"needs.safety": 2, "sensitive_points.judgment": 1}},
        {"option_id": "D", "label": "Ik wil eigenlijk gewoon dat dit ophoudt — maar ik weet niet hoe.", "tags": {"needs.safety": 2, "needs.connection": 1}},
        {"option_id": "E", "label": "Ik wil het verhaal rechtgezet hebben — de feiten moeten kloppen.", "tags": {"needs.stability": 1, "needs.honesty": 1}}
      ]
    }
  ],
  "outputs": {
    "solo": {
      "mirror": "Strijd om gelijk — jij merkt wanneer het gesprek die kant opgaat. En jij merkt ook wat er onder die strijd zit: een behoefte die nog niet gehoord is.",
      "protection_reflection": "Bewijs verzamelen, citaten herhalen — dat beschermt jou tegen de kwetsbaarheid van: ik heb dit nodig en het komt er niet. Maar het brengt de verbinding ook verder weg.",
      "need_reflection": "Jij hebt behoefte aan gezien worden — niet aan gelijk krijgen. De twee worden verward, maar het zijn andere dingen.",
      "chance": "Als jij stopt met bewijzen en zegt wat je eigenlijk nodig hebt, kan het gesprek veranderen.",
      "challenge": "Kun jij vragen wat je nodig hebt in plaats van te bewijzen wat klopt?",
      "experiment": "Probeer één keer: stop het bewijzen en zeg: 'Eigenlijk wil ik gewoon dat jij begrijpt dat ik mij zo voelde.' Kijk wat er dan gebeurt.",
      "gentle_phrase": "Jij hoeft niet te winnen om gezien te worden."
    },
    "couple": {
      "comparison_intro": "Gelijk willen krijgen — voor beiden zit er iets anders achter.",
      "what_a_may_hear": "A wil gelijk — maar eigenlijk wil A gezien worden. Dat is iets anders, en iets kwetsbaarders.",
      "what_b_may_hear": "B wil ook gelijk. Maar achter B's strijd zit waarschijnlijk ook een behoefte die nog niet uitgesproken is.",
      "what_each_protects": "A beschermt zichzelf door te bewijzen. B beschermt zichzelf door te verdedigen.",
      "shared_chance": "Samen stoppen met de strijd en vragen: wat heb jij eigenlijk nodig in dit gesprek?",
      "shared_challenge": "Hoe kunnen jullie beiden toegeven aan de kwetsbaarheid achter het gelijk willen hebben?",
      "shared_experiment": "Spreek af: als jullie merken dat het om gelijk gaat, pauzeert iemand en vraagt: 'Wat heb jij eigenlijk nodig?' Geen antwoord vereist, alleen de vraag."
    }
  }
},

"D7_TENSION_004": {
  "questions": [
    {
      "question_id": "q1_reaction",
      "step": "reaction",
      "prompt": "Wat doet het met jou als iemand weggaat na een conflict zonder te zeggen wanneer hij/zij terugkomt?",
      "helper_text": "Kies wat het meest herkenbaar is, niet wat het netst klinkt.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Ik voel paniek — het voelt als verlaten worden.", "tags": {"sensitive_points.abandonment": 2, "needs.safety": 2}},
        {"option_id": "B", "label": "Ik voel boosheid — dit is niet eerlijk.", "tags": {"needs.stability": 2, "needs.connection": 1}},
        {"option_id": "C", "label": "Ik voel eenzaamheid — ik sta er alleen voor terwijl hij/zij afkoelt.", "tags": {"needs.connection": 2, "sensitive_points.not_seen": 1}},
        {"option_id": "D", "label": "Ik voel opluchting — even ruimte is voor mij ook prettig.", "tags": {"needs.freedom": 2, "needs.stability": 1}},
        {"option_id": "E", "label": "Ik ga ook door met iets anders — afstand nemen werkt ook voor mij.", "tags": {"needs.freedom": 2, "needs.autonomy": 1}}
      ]
    },
    {
      "question_id": "q2_sensitive_point",
      "step": "sensitive_point",
      "prompt": "Wat wordt die afwezigheid voor jou als er geen einde aan wordt gegeven?",
      "helper_text": "Niet wat je denkt dat je zou moeten voelen — wat herken jij echt?",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Ze wordt een bewijs: als het moeilijk wordt, ga jij weg.", "tags": {"sensitive_points.abandonment": 3, "needs.safety": 1}},
        {"option_id": "B", "label": "Ze wordt angst — stel dat hij/zij niet terugkomt.", "tags": {"sensitive_points.abandonment": 2, "needs.safety": 2}},
        {"option_id": "C", "label": "Ze wordt boosheid — ik voel me in de steek gelaten terwijl ik bleef.", "tags": {"sensitive_points.not_chosen": 2, "needs.connection": 1}},
        {"option_id": "D", "label": "Ze wordt een patroon dat ik niet meer kan negeren.", "tags": {"patterns.pursue_withdraw": 2, "needs.stability": 1}},
        {"option_id": "E", "label": "Ze wordt eigenlijk niets — ik gebruik de tijd ook voor mezelf.", "tags": {"needs.freedom": 2, "needs.autonomy": 1}}
      ]
    }
  ],
  "outputs": {
    "solo": {
      "mirror": "Weggaan na een conflict is soms wijs — maar zonder terugkeermoment wordt het iets anders. Voor jou wordt de afwezigheid gevuld met wat je het meest vreest.",
      "protection_reflection": "Jouw reactie — paniek, boosheid, eenzaamheid — beschermt jou tegen het gevoel volledig alleen te staan. Die reactie is informatie.",
      "need_reflection": "Jij hebt behoefte aan een time-out mét een terugkeer. Niet meteen, maar wel een concreet moment. De afwezigheid verdraag je beter als je weet dat er terugkeer is.",
      "chance": "Dit patroon is bespreekbaar: 'Ik heb geen probleem met even weg. Maar ik heb wel een terugkeermoment nodig.'",
      "challenge": "Kun jij zeggen wat je nodig hebt zonder te eisen dat de ander niet weggaat?",
      "experiment": "Vraag één keer: 'Ik snap dat je even weg wil. Kun je zeggen wanneer we verder kunnen praten?' Niet vasthouden — alleen een anker vragen.",
      "gentle_phrase": "Jij mag een terugkeermoment vragen. Dat is niet claimend. Dat is zorg voor verbinding."
    },
    "couple": {
      "comparison_intro": "Time-out na conflict — voor A verlating, voor B noodzakelijke rust.",
      "what_a_may_hear": "A blijft achter zonder anker. Dat is niet alleen ongemakkelijk — dat activeert iets diepers.",
      "what_b_may_hear": "B loopt weg om bij te komen. Een goede reden. Maar B weet misschien niet wat achterblijven doet met A.",
      "what_each_protects": "A beschermt zichzelf door te blijven en te wachten. B beschermt zichzelf door afstand te nemen.",
      "shared_chance": "Samen een time-outprotocol maken: weg mag, maar met terugkeermoment.",
      "shared_challenge": "Hoe geeft B ruimte aan A's behoefte aan anker? Hoe geeft A ruimte aan B's behoefte aan afstand?",
      "shared_experiment": "Spreek af: als B time-out neemt, zegt B altijd: 'Ik ben er om [tijdstip].' A houdt dat vast. Oefen dat één keer."
    }
  }
},

"D7_DEEP_001": {
  "questions": [
    {
      "question_id": "q1_emotion",
      "step": "emotion",
      "prompt": "Wat gebeurt er in jou zodra de toon in een gesprek verandert?",
      "helper_text": "Kies wat het meest herkenbaar is, niet wat het netst klinkt.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Ik bevries — mijn gedachten stoppen en ik weet niet meer wat ik moet zeggen.", "tags": {"centers.body": 2, "needs.safety": 2}},
        {"option_id": "B", "label": "Ik ga kalmeren — ik maak het snel goed ook al ben ik het er niet mee eens.", "tags": {"protections.appease": 3, "needs.safety": 1}},
        {"option_id": "C", "label": "Ik ga weg van mezelf — ik doe dingen automatisch, voel weinig.", "tags": {"protections.withdraw": 2, "centers.body": 1}},
        {"option_id": "D", "label": "Ik word klein — ik trek me terug en wacht tot het over is.", "tags": {"protections.withdraw": 3, "needs.safety": 2}},
        {"option_id": "E", "label": "Ik reageer scherper terug — aanvallen is voor mij de vlucht naar voren.", "tags": {"protections.control": 2, "needs.safety": 1}}
      ]
    },
    {
      "question_id": "q2_sensitive_point",
      "step": "sensitive_point",
      "prompt": "Welk oud verhaal wordt actief als het conflict begint?",
      "helper_text": "Niet wat je denkt dat je zou moeten voelen — wat herken jij echt?",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Het verhaal dat ruzie het einde betekent — van de relatie of van de liefde.", "tags": {"sensitive_points.abandonment": 2, "needs.safety": 2}},
        {"option_id": "B", "label": "Het verhaal dat ik schuldig ben als er spanning is — ook als ik het niet veroorzaakte.", "tags": {"sensitive_points.not_enough": 2, "protections.appease": 1}},
        {"option_id": "C", "label": "Het verhaal dat ik mij moet aanpassen om veilig te zijn.", "tags": {"protections.appease": 2, "sensitive_points.not_enough": 1}},
        {"option_id": "D", "label": "Het verhaal van vroeger — een plek of iemand waar conflict gevaarlijk was.", "tags": {"sensitive_points.abandonment": 2, "needs.safety": 2}},
        {"option_id": "E", "label": "Ik weet het niet precies — het is meer een lichamelijke reactie dan een verhaal.", "tags": {"centers.body": 2, "needs.safety": 2}}
      ]
    }
  ],
  "outputs": {
    "solo": {
      "mirror": "Jouw lichaam reageert op de toon — vóór je hoofd heeft besloten wat er aan de hand is. Dat is een oud alarm dat ooit zijn werk deed. Nu is het hier.",
      "protection_reflection": "Bevriezen, glad strijken, weggaan van jezelf — dat zijn niet de beste reacties, maar ze waren ooit de enige. Jij hebt dit geleerd in een context waar conflict niet veilig was.",
      "need_reflection": "Jij hebt behoefte aan een context waar conflict veilig is — waar de toon verandert maar de relatie niet in gevaar komt. Dat vertrouwen is opbouwbaar.",
      "chance": "Als jij je oud alarm leert herkennen, kun jij een keuze maken die nieuw is.",
      "challenge": "Kun jij, als je het merkt, even stoppen en zeggen: 'Ik voel mijn oud alarm. Geef me even'?",
      "experiment": "Schrijf op: 'Als de toon verandert, voel ik... en dan doe ik...' Alleen herkennen — niet oplossen.",
      "gentle_phrase": "Jouw lichaam herinnert wat jij misschien liever vergeet. Dat mag er zijn."
    },
    "couple": {
      "comparison_intro": "Angst voor conflict — dat is iets dat het gesprek beïnvloedt vóór het begint.",
      "what_a_may_hear": "A bevriest of gaat glad strijken. Dat is niet zwak — dat is een oud alarm dat afgaat.",
      "what_b_may_hear": "B ervaart de reactie van A maar begrijpt misschien niet waar die vandaan komt.",
      "what_each_protects": "A beschermt zichzelf door conflict te vermijden of te sussen. B beschermt zichzelf door direct te zijn.",
      "shared_chance": "Samen ruimte maken voor A's alarm: 'Ik merk dat je dit hard aankomt. We hoeven dit niet meteen op te lossen.'",
      "shared_challenge": "Hoe maakt B conflict minder bedreigend voor A? Hoe leert A het verschil tussen oud en nieuw?",
      "shared_experiment": "Spreek een pauzewoord af: als A het alarm voelt, zegt A dat. B reageert met: 'We stoppen even. We zijn er allebei nog.' Oefen dat."
    }
  }
},

"D7_DEEP_002": {
  "questions": [
    {
      "question_id": "q1_emotion",
      "step": "emotion",
      "prompt": "Wat voel je als je merkt dat je nog niet kunt vergeven, ook al wil je verder?",
      "helper_text": "Kies wat het meest herkenbaar is, niet wat het netst klinkt.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Frustratie op mezelf — ik wil het loslaten maar het gaat niet.", "tags": {"sensitive_points.not_enough": 2, "needs.freedom": 1}},
        {"option_id": "B", "label": "Verdriet — er is iets kapot gegaan dat niet zomaar heelt.", "tags": {"needs.connection": 2, "sensitive_points.not_seen": 1}},
        {"option_id": "C", "label": "Angst — wat als vergeven betekent dat het opnieuw kan gebeuren?", "tags": {"needs.safety": 2, "sensitive_points.abandonment": 1}},
        {"option_id": "D", "label": "Boosheid die ik niet meer wil voelen maar die er nog is.", "tags": {"needs.recognition": 2, "centers.body": 1}},
        {"option_id": "E", "label": "Moeheid — ik ben het dragen moe, maar loslaten ook.", "tags": {"needs.freedom": 2, "sensitive_points.not_enough": 1}}
      ]
    },
    {
      "question_id": "q2_sensitive_point",
      "step": "sensitive_point",
      "prompt": "Wat houdt je tegen bij vergeven?",
      "helper_text": "Niet wat je denkt dat je zou moeten voelen — wat herken jij echt?",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Als ik vergeef, geef ik aan dat het oké was. En dat was het niet.", "tags": {"needs.recognition": 2, "sensitive_points.not_seen": 2}},
        {"option_id": "B", "label": "Als ik vergeef, geef ik de bescherming op die de pijn mij geeft.", "tags": {"protections.control": 2, "needs.safety": 1}},
        {"option_id": "C", "label": "Als ik vergeef zonder echte erkenning, doe ik alsof het niets was.", "tags": {"needs.recognition": 3, "needs.honesty": 1}},
        {"option_id": "D", "label": "Ik weet niet hoe — vergeven is iets dat ik niet geleerd heb.", "tags": {"sensitive_points.not_enough": 1, "needs.safety": 1}},
        {"option_id": "E", "label": "Iets in mij wil dat de pijn eerst gezien wordt voordat ik loslaat.", "tags": {"needs.recognition": 3, "sensitive_points.not_seen": 1}}
      ]
    }
  ],
  "outputs": {
    "solo": {
      "mirror": "Vergeven wil je — maar iets houdt je tegen. Dat is geen onwil. Dat is eerlijkheid over wat er nodig is vóór loslaten mogelijk wordt.",
      "protection_reflection": "Vasthouden aan de pijn beschermt jou tegen herhaling, tegen de boodschap dat het oké was, en tegen het verlies van controle over wat er pijn deed. Dat zijn echte beschermingen.",
      "need_reflection": "Jij hebt behoefte aan erkenning vóór vergeven. Niet perfecte erkenning — maar genoeg om te voelen: het werd gezien.",
      "chance": "Vergeven is niet vergeten. Het is besluiten om de pijn niet langer de ruimte te laten bepalen.",
      "challenge": "Kun jij zeggen wat je nodig hebt vóórdat vergeven mogelijk is?",
      "experiment": "Schrijf op: 'Ik kan pas vergeven als...' Niet voor de ander — voor jezelf. Kijk wat erachter staat.",
      "gentle_phrase": "Vergeven heeft zijn eigen tijd. Jij mag die tijd nemen."
    },
    "couple": {
      "comparison_intro": "Vergeven — dat is voor A iets dat niet zomaar komt, en dat mag zo zijn.",
      "what_a_may_hear": "A wil verder maar kan het nog niet. Dat is geen sabotage — dat is een eerlijk signaal over wat er nodig is.",
      "what_b_may_hear": "B wil dat het voorbij is. Maar vergeven kan niet worden gehaast — en het vraagt soms om meer dan excuses.",
      "what_each_protects": "A beschermt zichzelf door de pijn vast te houden. B beschermt zichzelf door te willen afsluiten.",
      "shared_chance": "Samen bespreken: wat heeft A nodig om te kunnen vergeven? Wat kan B bieden?",
      "shared_challenge": "Hoe wacht B op A's tempo? Hoe zegt A wat het vergeven blokkeert?",
      "shared_experiment": "A zegt één keer: 'Ik wil vergeven, maar ik heb daarvoor nodig: ...' B luistert alleen. Geen verdediging, geen reactie."
    }
  }
}

}

# Update cases
updated = 0
for c in cases:
    cid = c['case_id']
    if cid in D7_CASES:
        c['questions'] = D7_CASES[cid]['questions']
        c['outputs'] = D7_CASES[cid]['outputs']
        updated += 1
        print('Updated: ' + cid)

data['cases'] = cases

with open('cases.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print('\nDone! Updated ' + str(updated) + ' D7 cases.')
