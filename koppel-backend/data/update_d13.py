import json, sys
sys.stdout.reconfigure(encoding='utf-8')

D13_CASES = {

# ── POSITIVE ──────────────────────────────────────────────────────────────

"D13_POSITIVE_001": {
  "questions": [
    {
      "question_id": "D13_POSITIVE_001_Q1",
      "step": "reaction",
      "prompt": "Jullie bidden samen, zitten stil of spreken hoop uit — hoe eenvoudig ook. Wat doet dat moment met jou?",
      "helper_text": "Kies wat het meest klopt.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Rust — even groter dan het dagelijkse gedoe", "tags": {"needs.safety": 2, "needs.stability": 2}},
        {"option_id": "B", "label": "Verbinding — we delen iets wat dieper gaat dan woorden", "tags": {"needs.connection": 2, "skills.vulnerability": 1}},
        {"option_id": "C", "label": "Kwetsbaarheid — dit is intiem op een manier die ik niet altijd aandurf", "tags": {"skills.vulnerability": 2, "needs.safety": 1}},
        {"option_id": "D", "label": "Dankbaarheid — dat we dit samen kunnen doen", "tags": {"needs.connection": 2, "needs.recognition": 1}}
      ]
    },
    {
      "question_id": "D13_POSITIVE_001_Q2",
      "step": "need",
      "prompt": "Wat maakt gedeelde stilte of gebed voor jou echt — niet alleen een gewoonte?",
      "helper_text": "Kies het meest essentiële.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Dat we er allebei echt bij zijn — ook als de woorden niet perfect zijn", "tags": {"needs.connection": 2, "needs.recognition": 1}},
        {"option_id": "B", "label": "Dat het veilig voelt om eerlijk te zijn over wat ik voel of vraag", "tags": {"needs.safety": 2, "skills.vulnerability": 1}},
        {"option_id": "C", "label": "Dat het ruimte geeft aan iets groters dan onze eigen zorgen", "tags": {"needs.stability": 2, "needs.connection": 1}},
        {"option_id": "D", "label": "Dat het ons herinnert aan wat we samen geloven en hopen", "tags": {"needs.stability": 2, "skills.values_alignment": 2}}
      ]
    }
  ],
  "outputs": {
    "solo": {
      "mirror": "Samen stil zijn of bidden is een van de meest intieme dingen die mensen kunnen doen — en ook een van de kwetsbaarste.",
      "protection_reflection": "Als het ongemakkelijk voelt, beschermt dat je voor de kwetsbaarheid van echt aanwezig zijn in geloof.",
      "need_reflection": "Jij verlangt naar gedeelde diepte — iets wat groter is dan jullie dagelijks leven.",
      "chance": "Eenvoud is genoeg. Een moment van stilte samen is al verbinding.",
      "challenge": "Wees eerlijk over wat je voelt in zulke momenten — ook als het niet vroom klinkt.",
      "experiment": "Sluit deze week één dag af met een moment van stilte samen — hoe kort ook.",
      "gentle_phrase": "Samen stil zijn is ook bidden."
    },
    "couple": {
      "comparison_intro": "Gedeelde spiritualiteit hoeft niet groot te zijn — eenvoud verbindt het meest.",
      "what_a_may_hear": "Jij vindt rust in samen richten op iets groters.",
      "what_b_may_hear": "Jij ook — maar misschien met andere woorden of vormen.",
      "what_each_protects": "De een beschermt het geloof door het te delen. De ander beschermt zichzelf door eerlijk te zijn.",
      "shared_chance": "Gezamenlijke momenten van stilte of gebed bouwen een laag in de relatie die moeilijk te beschrijven is maar wel voelbaar.",
      "shared_challenge": "Zoek een vorm die voor jullie beiden klopt — niet de vorm van één van jullie.",
      "shared_experiment": "Probeer drie weken lang één vast moment per week van gedeelde stilte of gebed."
    }
  }
},

"D13_POSITIVE_002": {
  "questions": [
    {
      "question_id": "D13_POSITIVE_002_Q1",
      "step": "emotion",
      "prompt": "Iemand zegt eerlijk: 'Ik weet niet goed wat ik geloof op dit punt.' De ander luistert. Wat voel jij in zo'n moment?",
      "helper_text": "Kies de emotie die het meest klopt.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Opluchting — eindelijk hoef ik niet te doen alsof ik alles weet", "tags": {"needs.safety": 2, "skills.vulnerability": 2}},
        {"option_id": "B", "label": "Verrassing — ik had niet verwacht dat er zo gereageerd zou worden", "tags": {"needs.safety": 1, "needs.connection": 1}},
        {"option_id": "C", "label": "Verbinding — twijfel delen is intiem", "tags": {"needs.connection": 2, "skills.vulnerability": 2}},
        {"option_id": "D", "label": "Lichte angst — stel dat mijn twijfel de ander verontrust", "tags": {"patterns.pleasing": 1, "needs.safety": 1}}
      ]
    },
    {
      "question_id": "D13_POSITIVE_002_Q2",
      "step": "need",
      "prompt": "Wat heb jij nodig om twijfel of verandering in geloof te durven delen met je partner?",
      "helper_text": "Kies het meest essentiële.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Dat hij/zij niet schrikt of probeert me te overtuigen", "tags": {"needs.safety": 2, "needs.freedom": 1}},
        {"option_id": "B", "label": "Dat mijn twijfel niet als aanval op zijn/haar geloof wordt gezien", "tags": {"needs.safety": 2, "needs.recognition": 1}},
        {"option_id": "C", "label": "Dat we allebei mogen groeien — ook in verschillende richtingen", "tags": {"needs.freedom": 2, "needs.connection": 1}},
        {"option_id": "D", "label": "Dat liefde niet afhankelijk is van geloofszekerheid", "tags": {"needs.safety": 2, "needs.connection": 2}}
      ]
    }
  ],
  "outputs": {
    "solo": {
      "mirror": "Twijfel delen in een geloofsgesprek is moed — het vraagt dat liefde sterker is dan antwoorden.",
      "protection_reflection": "De angst dat twijfel de ander verontrust beschermt de relatie — maar het houdt je ook alleen met je vragen.",
      "need_reflection": "Jij wil ruimte voor eerlijkheid over geloof — zonder dat het de relatie op het spel zet.",
      "chance": "Twijfel is geen gebrek aan geloof — het is denken met een open hand.",
      "challenge": "Deel één twijfel die je al een tijdje draagt — niet als crisis, maar als eerlijkheid.",
      "experiment": "Vraag de ander: 'Is er iets in je geloof dat je soms niet hardop zegt?' Luister.",
      "gentle_phrase": "Twijfel en liefde kunnen naast elkaar bestaan."
    },
    "couple": {
      "comparison_intro": "Ruimte voor twijfel in een geloofsgesprek is een teken van volwassen liefde.",
      "what_a_may_hear": "Jij deelde twijfel — en dat was moed.",
      "what_b_may_hear": "Jij gaf ruimte — en dat was liefde.",
      "what_each_protects": "De een beschermt eerlijkheid. De ander beschermt de verbinding.",
      "shared_chance": "Geloof dat twijfel overleeft is steviger dan geloof dat twijfel vermijdt.",
      "shared_challenge": "Maak het veilig voor elkaar om te zeggen: 'Ik weet het niet.'",
      "shared_experiment": "Spreek af: geloofsgesprekken zijn vrij van oordeel. Probeer één zo'n gesprek deze maand."
    }
  }
},

"D13_POSITIVE_003": {
  "questions": [
    {
      "question_id": "D13_POSITIVE_003_Q1",
      "step": "reaction",
      "prompt": "Geloof wordt concreet: een keuze over gastvrijheid, geven, rust, vergeving of richting. Hoe voelt dat voor jou?",
      "helper_text": "Kies wat het meest klopt.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Bevredigend — geloof dat hands-on is voelt echter", "tags": {"skills.values_alignment": 2, "needs.connection": 1}},
        {"option_id": "B", "label": "Verbindend — we doen samen iets wat ons geloof uitdrukt", "tags": {"needs.connection": 2, "skills.values_alignment": 2}},
        {"option_id": "C", "label": "Richtinggevend — het helpt me weten waar we voor staan", "tags": {"needs.stability": 2, "skills.values_alignment": 1}},
        {"option_id": "D", "label": "Soms moeilijk — geloof omzetten in keuzes vraagt ook offers", "tags": {"needs.stability": 1, "skills.agency": 1}}
      ]
    },
    {
      "question_id": "D13_POSITIVE_003_Q2",
      "step": "need",
      "prompt": "Welke concrete uitdrukking van jullie geloof of waarden geeft jou het meeste richting als stel?",
      "helper_text": "Kies wat het meest resoneert.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Hoe we omgaan met geld — geven, sparen, delen", "tags": {"skills.values_alignment": 2, "needs.stability": 1}},
        {"option_id": "B", "label": "Hoe we onze deur openhouden voor anderen", "tags": {"skills.values_alignment": 2, "needs.connection": 1}},
        {"option_id": "C", "label": "Hoe we rust bewaren als iets kostbaars", "tags": {"needs.stability": 2, "skills.values_alignment": 1}},
        {"option_id": "D", "label": "Hoe we vergeven — aan elkaar en aan anderen", "tags": {"skills.repair": 2, "skills.values_alignment": 2}}
      ]
    }
  ],
  "outputs": {
    "solo": {
      "mirror": "Geloof dat richting geeft aan concrete keuzes is het stevigste fundament.",
      "protection_reflection": "Offers die geloof vraagt kosten iets echts. Dat mag benoemd worden.",
      "need_reflection": "Jij wil leven vanuit waarden die ook merkbaar zijn in de kleine keuzes van elke dag.",
      "chance": "Geloof als kompas maakt moeilijke keuzes helderder.",
      "challenge": "Benoem één waarde die jullie willen belichamen — en maak hem concreet.",
      "experiment": "Vraag: 'Welke keuze hebben we dit jaar gemaakt die echt uitdrukt wat we geloven?'",
      "gentle_phrase": "Geloof is niet wat je zegt — het is wat je kiest."
    },
    "couple": {
      "comparison_intro": "Waarden concretiseren als stel geeft richting én verbinding.",
      "what_a_may_hear": "Jij wil geloof zien in daden — niet alleen horen in woorden.",
      "what_b_may_hear": "Jij ook — maar misschien in andere daden.",
      "what_each_protects": "De een beschermt consistentie. De ander beschermt vrijheid van expressie.",
      "shared_chance": "Gedeelde waarden in concrete keuzes bouwen een identiteit als stel.",
      "shared_challenge": "Kies één waarde die jullie dit jaar willen uitdrukken in een concrete gewoonte.",
      "shared_experiment": "Bespreek: welke drie waarden willen wij als stel belichamen? Hoe doen we dat al, hoe kunnen we dat meer doen?"
    }
  }
},

"D13_POSITIVE_004": {
  "questions": [
    {
      "question_id": "D13_POSITIVE_004_Q1",
      "step": "emotion",
      "prompt": "Jullie helpen samen iemand, koken, bezoeken of dienen. Het kost tijd maar geeft ook vreugde. Wat voel jij daarbij?",
      "helper_text": "Kies de emotie die het meest klopt.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Vreugde — dit is waarom we doen wat we doen", "tags": {"needs.connection": 2, "skills.values_alignment": 2}},
        {"option_id": "B", "label": "Verbinding — samen dienen brengt ons dichter bij elkaar", "tags": {"needs.connection": 2, "skills.teamwork": 2}},
        {"option_id": "C", "label": "Volheid — dit geeft meer dan het kost", "tags": {"needs.connection": 2, "needs.stability": 1}},
        {"option_id": "D", "label": "Rust — even zijn we deel van iets groters", "tags": {"needs.stability": 2, "needs.connection": 1}}
      ]
    },
    {
      "question_id": "D13_POSITIVE_004_Q2",
      "step": "need",
      "prompt": "Wat maakt samen dienen voor jou meer dan een taak — iets wat echt betekenis heeft?",
      "helper_text": "Kies het meest essentiële.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Dat we het allebei willen — niet dat één iemand de ander meesleept", "tags": {"needs.connection": 2, "needs.freedom": 1}},
        {"option_id": "B", "label": "Dat het voortkomt uit liefde, niet uit verplichting", "tags": {"needs.freedom": 2, "skills.values_alignment": 1}},
        {"option_id": "C", "label": "Dat we er samen over praten — wat het doet, wat het vraagt", "tags": {"needs.connection": 2, "skills.communication": 1}},
        {"option_id": "D", "label": "Dat het ons herinnert aan wat echt telt", "tags": {"needs.stability": 2, "skills.values_alignment": 2}}
      ]
    }
  ],
  "outputs": {
    "solo": {
      "mirror": "Samen dienen verbindt jullie aan iets buiten jezelf — en dat geeft de relatie diepte.",
      "protection_reflection": "Als dienen een verplichting voelt, verliest het zijn kracht. Dienen vanuit liefde kost ook, maar vult ook.",
      "need_reflection": "Jij wil leven met betekenis — niet alleen voor jullie zelf, maar als deel van iets groters.",
      "chance": "Samen iets geven geeft meer dan het kost — aan de ander én aan jullie relatie.",
      "challenge": "Kies iets wat jullie willen doen — niet wat jullie moeten doen.",
      "experiment": "Plan één concrete daad van dienst samen dit kwartaal — hoe klein ook.",
      "gentle_phrase": "Samen geven verbindt ons met iets wat groter is dan wijzelf."
    },
    "couple": {
      "comparison_intro": "Samen dienen brengt een dimensie in de relatie die moeilijk te vervangen is.",
      "what_a_may_hear": "Jij vindt vreugde in samen geven — en wil dat de ander dat ook ervaart.",
      "what_b_may_hear": "Jij ook — misschien op een andere manier of in een andere context.",
      "what_each_protects": "De een beschermt verbinding met de wereld. De ander beschermt de energie van de relatie.",
      "shared_chance": "Samen dienen geeft jullie relatie een richting naar buiten.",
      "shared_challenge": "Kies samen iets concreets — en doe het vanuit keuze, niet plicht.",
      "shared_experiment": "Plan dit kwartaal één gezamenlijke daad van dienst of vrijgevigheid."
    }
  }
},

# ── TENSION ───────────────────────────────────────────────────────────────

"D13_TENSION_001": {
  "questions": [
    {
      "question_id": "D13_TENSION_001_Q1",
      "step": "reaction",
      "prompt": "Voor de één is kerk voeding en thuis. Voor de ander voelt het zwaarder of leger. Hoe reageer jij als dat verschil er ligt?",
      "helper_text": "Kies de meest herkenbare reactie.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Ik voel verdriet — iets wat mij voedt, raakt hem/haar niet zo", "tags": {"sensitive_points.not_seen": 2, "needs.connection": 1}},
        {"option_id": "B", "label": "Ik voel druk — alsof ik moet kiezen tussen kerk en verbinding", "tags": {"patterns.pleasing": 2, "needs.freedom": 1}},
        {"option_id": "C", "label": "Ik trek me terug — dit gesprek loopt toch vast", "tags": {"patterns.avoidance": 2, "needs.safety": 1}},
        {"option_id": "D", "label": "Ik probeer het te begrijpen maar voel ook pijn", "tags": {"skills.empathy": 2, "needs.connection": 1}}
      ]
    },
    {
      "question_id": "D13_TENSION_001_Q2",
      "step": "interpretation",
      "prompt": "Als jullie kerkelijke betrokkenheid verschilt — wat raakt dat eigenlijk in jou?",
      "helper_text": "Kies de meest herkenbare gedachte.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "'Iets wat de kern van mijn leven is, deelt hij/zij niet'", "tags": {"sensitive_points.not_seen": 2, "needs.connection": 2}},
        {"option_id": "B", "label": "'Ik ben bang dat dit ons verder uit elkaar drijft'", "tags": {"patterns.catastrophizing": 2, "needs.stability": 1}},
        {"option_id": "C", "label": "'Ik wil niet kiezen tussen mijn geloof en mijn partner'", "tags": {"needs.freedom": 2, "needs.connection": 2}},
        {"option_id": "D", "label": "'Misschien moet ik minder van hem/haar verwachten op dit vlak'", "tags": {"patterns.resignation": 2, "needs.connection": 1}}
      ]
    }
  ],
  "outputs": {
    "solo": {
      "mirror": "Verschil in kerkbeleving raakt niet alleen de zondagochtend — het raakt identiteit en verbinding.",
      "protection_reflection": "Je terugtrekken beschermt je voor een gesprek dat pijn kan doen — maar het laat het verschil ook groeien.",
      "need_reflection": "Jij wil dat iets wat de kern van jouw leven is, ook door je partner wordt erkend — niet overgenomen, maar gezien.",
      "chance": "Erkend worden in je geloof is anders dan samen geloven. Het eerste is mogelijk ook met verschil.",
      "challenge": "Zeg wat het voor jou betekent — niet als overtuiging, maar als persoonlijke werkelijkheid.",
      "experiment": "Vraag de ander: 'Wat maakt het voor jou moeilijker?' Luister zonder te verdedigen.",
      "gentle_phrase": "Jij hoeft mij niet na te volgen — maar ik wil wel dat je me kent."
    },
    "couple": {
      "comparison_intro": "Verschil in kerkbeleving vraagt om respect — voor wat de ander geeft én wat de ander mist.",
      "what_a_may_hear": "Jij wordt gevoed door iets wat de ander niet in dezelfde mate voelt — dat is eenzaam.",
      "what_b_may_hear": "Jij voelt druk of leegte op dit vlak — en dat is ook echt.",
      "what_each_protects": "De een beschermt de geloofsgemeenschap. De ander beschermt eigen ruimte.",
      "shared_chance": "Respect voor verschil in kerkbeleving maakt het mogelijk samen te blijven zonder dwang.",
      "shared_challenge": "Maak ruimte voor ieder om zijn/haar geloofsweg te gaan — zonder scorebord.",
      "shared_experiment": "Spreek af: ik ga mee als ik wil, niet als ik moet. Geen druk, geen schuldgevoel."
    }
  }
},

"D13_TENSION_002": {
  "questions": [
    {
      "question_id": "D13_TENSION_002_Q1",
      "step": "emotion",
      "prompt": "In een conflict klinkt een Bijbeltekst of moreel argument. Misschien goed bedoeld — maar jij hoort: jij bent verkeerd. Wat voel jij dan?",
      "helper_text": "Kies de emotie die het meest klopt.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Afgesneden — geloof wordt ingezet om mij te benoemen en niet te begrijpen", "tags": {"sensitive_points.not_respected": 2, "needs.recognition": 2}},
        {"option_id": "B", "label": "Boos — ik gebruik geloof niet als wapen, waarom wel zo naar mij?", "tags": {"sensitive_points.not_respected": 2, "patterns.escalation": 1}},
        {"option_id": "C", "label": "Verdrietig — dit maakt geloof een muur, geen brug", "tags": {"needs.connection": 2, "sensitive_points.not_seen": 1}},
        {"option_id": "D", "label": "Klein — alsof ik verlies voor het gesprek begint", "tags": {"sensitive_points.not_good_enough": 2, "needs.recognition": 1}}
      ]
    },
    {
      "question_id": "D13_TENSION_002_Q2",
      "step": "interpretation",
      "prompt": "Als geloofstaal wordt ingezet in een conflict — wat zegt dat voor jou over hoe jullie met elkaar praten?",
      "helper_text": "Kies de meest herkenbare gedachte.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "'Geloof mag geen argument zijn in een conflict — dat doet het geen recht'", "tags": {"skills.insight": 2, "needs.fairness": 1}},
        {"option_id": "B", "label": "'Dit is een manier om gelijk te krijgen op een plek waar ik niet kan weerleggen'", "tags": {"sensitive_points.not_respected": 2, "needs.fairness": 1}},
        {"option_id": "C", "label": "'De ander bedoelt het niet slecht maar begrijpt niet hoe het aankomt'", "tags": {"skills.empathy": 2, "needs.connection": 1}},
        {"option_id": "D", "label": "'Dit patroon schaadt ons — en het schaadt ook het geloof'", "tags": {"skills.insight": 2, "needs.stability": 1}}
      ]
    }
  ],
  "outputs": {
    "solo": {
      "mirror": "Geloof als argument in een conflict sluit de ander af in plaats van uit te nodigen. Dat is niet wat geloof bedoelt.",
      "protection_reflection": "Klein voelen bij geloofstaal beschermt je niet — het maakt je weerlozer. Benoemen maakt je sterker.",
      "need_reflection": "Jij wil dat geloof een brug is, geen gewicht — in het conflict én daarbuiten.",
      "chance": "Dit gesprek is te voeren — buiten het conflict, als het rustig is.",
      "challenge": "Zeg het later: 'Als je dat zegt in een ruzie, voel ik me afgesneden — niet geholpen.'",
      "experiment": "Maak samen een afspraak: in conflicten gebruiken we geen geloofsargumenten als wapen.",
      "gentle_phrase": "Geloof verbindt — of het verbindt niet. Het is geen argument in een strijd."
    },
    "couple": {
      "comparison_intro": "Geloofstaal in een conflict raakt dieper dan bedoeld — en dat verdient een gesprek.",
      "what_a_may_hear": "Jij voelde je afgesneden — en dat is een echte pijn.",
      "what_b_may_hear": "Jij bedoelde het misschien goed — maar het landde als oordeel.",
      "what_each_protects": "De een beschermt de eigen waarheid. De ander beschermt de verbinding.",
      "shared_chance": "Als jullie dit benoemen, kunnen jullie afspreken hoe geloof wél zijn plek krijgt.",
      "shared_challenge": "Geloof hoort geen wapen te zijn — maak dat expliciet.",
      "shared_experiment": "Spreek af: geen Bijbelteksten of morele argumenten in conflicten. Wel daarna, als het rustig is."
    }
  }
},

"D13_TENSION_003": {
  "questions": [
    {
      "question_id": "D13_TENSION_003_Q1",
      "step": "reaction",
      "prompt": "De vraag over geloofsopvoeding — bidden, kerk, school, doop, regels of vrijheid. Hoe reageer jij als jullie er anders over denken?",
      "helper_text": "Kies de meest herkenbare reactie.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Ik voel het belang sterk — dit gaat over wat we doorgeven", "tags": {"needs.stability": 2, "skills.values_alignment": 2}},
        {"option_id": "B", "label": "Ik merk spanning — alsof we op twee eilanden staan", "tags": {"needs.connection": 2, "patterns.avoidance": 1}},
        {"option_id": "C", "label": "Ik ben bang voor conflict — dit raakt iets dieps bij ons allebei", "tags": {"needs.safety": 2, "patterns.avoidance": 1}},
        {"option_id": "D", "label": "Ik probeer ruimte te geven maar voel ook mijn eigen overtuiging", "tags": {"skills.empathy": 2, "needs.freedom": 1}}
      ]
    },
    {
      "question_id": "D13_TENSION_003_Q2",
      "step": "interpretation",
      "prompt": "Achter de keuze over geloofsopvoeding — wat wil jij eigenlijk doorgeven aan je kind?",
      "helper_text": "Kies wat het diepst resoneert.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Een fundament — iets wat houvast geeft als het leven moeilijk wordt", "tags": {"needs.stability": 2, "skills.values_alignment": 2}},
        {"option_id": "B", "label": "Vrijheid om zelf te zoeken — zonder last van verplichting", "tags": {"needs.freedom": 2, "skills.values_alignment": 1}},
        {"option_id": "C", "label": "Gemeenschap — erbij horen, een plek hebben", "tags": {"needs.connection": 2, "needs.stability": 1}},
        {"option_id": "D", "label": "Mijn eigen geloof — niet als dwang, maar als erfenis van liefde", "tags": {"skills.values_alignment": 2, "needs.connection": 1}}
      ]
    }
  ],
  "outputs": {
    "solo": {
      "mirror": "Geloofsopvoeding raakt de vraag: wat is het dierbaarste dat ik kan doorgeven?",
      "protection_reflection": "Angst voor conflict rondom dit thema beschermt de relatie — maar stelt ook een gesprek uit dat echt gevoerd moet worden.",
      "need_reflection": "Jij wil iets doorgeven aan je kind dat meer is dan regels — iets wat richting geeft.",
      "chance": "Dit gesprek over doorgeven kan jullie ook helpen verwoorden wat jullie zelf geloven.",
      "challenge": "Praat over het verlangen achter de keuze — niet alleen over de praktische vraag.",
      "experiment": "Schrijf elk apart: wat wil ik doorgeven aan mijn kind over geloof, zingeving of waarden? Vergelijk.",
      "gentle_phrase": "Wat ik wil doorgeven, begint met wat ik zelf leef."
    },
    "couple": {
      "comparison_intro": "Geloofsopvoeding is een van de meest gelaagde gesprekken die ouders kunnen voeren.",
      "what_a_may_hear": "Jij wil iets doorgeven wat voor jou fundamenteel is.",
      "what_b_may_hear": "Jij wil je kind de ruimte geven die jij soms miste.",
      "what_each_protects": "De een beschermt het fundament. De ander beschermt de vrijheid.",
      "shared_chance": "Het gesprek over doorgeven maakt jullie bewuster van wat jullie zelf geloven.",
      "shared_challenge": "Maak ruimte voor verschil — en zoek de kern die jullie allebei willen meegeven.",
      "shared_experiment": "Schrijf elk drie dingen die je wil doorgeven. Zoek de overlap. Begin daar."
    }
  }
},

"D13_TENSION_004": {
  "questions": [
    {
      "question_id": "D13_TENSION_004_Q1",
      "step": "reaction",
      "prompt": "Een opmerking of zucht over elkaars geloof of twijfel raakt dieper dan bedoeld. Hoe reageer jij op zo'n moment?",
      "helper_text": "Kies de meest herkenbare reactie.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Ik sluit me af — dit is te teer om te verdedigen", "tags": {"protections.withdrawal": 2, "sensitive_points.not_respected": 1}},
        {"option_id": "B", "label": "Ik reageer scherper dan ik wil — het raakt iets wat ik niet verwacht", "tags": {"patterns.escalation": 2, "sensitive_points.not_respected": 1}},
        {"option_id": "C", "label": "Ik zeg niks maar het blijft hangen", "tags": {"patterns.avoidance": 2, "patterns.resentment": 1}},
        {"option_id": "D", "label": "Ik probeer het te begrijpen maar voel me toch gemist", "tags": {"skills.empathy": 2, "sensitive_points.not_seen": 1}}
      ]
    },
    {
      "question_id": "D13_TENSION_004_Q2",
      "step": "interpretation",
      "prompt": "Als jullie elkaar missen in de laag van betekenis — wat is dan eigenlijk de onderliggende vraag?",
      "helper_text": "Kies de meest herkenbare gedachte.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "'Ken jij echt wat dit voor mij betekent?'", "tags": {"sensitive_points.not_seen": 2, "needs.recognition": 2}},
        {"option_id": "B", "label": "'Respecteer jij mijn weg — ook als die anders is dan de jouwe?'", "tags": {"needs.recognition": 2, "needs.freedom": 2}},
        {"option_id": "C", "label": "'Kunnen wij samen zijn zonder dit als scheidslijn te zien?'", "tags": {"needs.connection": 2, "needs.stability": 1}},
        {"option_id": "D", "label": "'Is er ruimte voor ons allebei in dit gesprek?'", "tags": {"needs.safety": 2, "needs.recognition": 1}}
      ]
    }
  ],
  "outputs": {
    "solo": {
      "mirror": "Cynisme of onbegrip rond geloof raakt niet alleen de overtuiging — het raakt de vraag of je gekend wordt.",
      "protection_reflection": "Je afsluiten beschermt iets teerders dan een mening — het beschermt je ziel.",
      "need_reflection": "Jij wil gezien worden in wat jou betekenis geeft — ook als de ander het niet deelt.",
      "chance": "Respect voor elkaars betekenislaag hoeft geen overeenstemming te zijn.",
      "challenge": "Zeg het later: 'Die opmerking raakte iets. Niet als verwijt — als eerlijkheid.'",
      "experiment": "Vertel de ander één keer wat geloof of zingeving voor jou concreet betekent in je leven. Geen debat — gewoon vertellen.",
      "gentle_phrase": "Je hoeft het niet te delen om het te respecteren."
    },
    "couple": {
      "comparison_intro": "Cynisme of onbegrip over elkaars geloof mist de laag die er echt toe doet.",
      "what_a_may_hear": "Jij voelt je gemist in iets wat teer is.",
      "what_b_may_hear": "Jij bedoelde het misschien niet zo — maar het landde pijnlijk.",
      "what_each_protects": "De een beschermt zijn/haar innerlijk leven. De ander beschermt misschien de eigen onzekerheid.",
      "shared_chance": "Als jullie elkaars betekeniswereld leren kennen, groeit respect — ook bij verschil.",
      "shared_challenge": "Luister naar wat het voor de ander betekent — voor je reageert.",
      "shared_experiment": "Vertel elkaar één keer wat geloof, zingeving of waarden concreet voor jou doet in je leven. Luister alleen."
    }
  }
},

# ── DEEP ──────────────────────────────────────────────────────────────────

"D13_DEEP_001": {
  "questions": [
    {
      "question_id": "D13_DEEP_001_Q1",
      "step": "sensitive_point",
      "prompt": "Je geloof, godsbeeld of kerk schuift. Het raakt jou — én jullie relatie. Welk gevoel zit er het diepst onder?",
      "helper_text": "Kies het meest kwetsbare.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Angst — stel dat ik verander en de ander volgt niet, of wil niet", "tags": {"sensitive_points.abandonment": 2, "needs.safety": 2}},
        {"option_id": "B", "label": "Rouw — ik verlies iets wat me lang heeft gedragen", "tags": {"sensitive_points.grief": 2, "needs.stability": 1}},
        {"option_id": "C", "label": "Verwarring — ik weet niet meer wie ik ben als dit verschuift", "tags": {"sensitive_points.identity": 2, "needs.stability": 1}},
        {"option_id": "D", "label": "Opluchting met schaamte — het klopt meer nu, maar ik durf het niet te zeggen", "tags": {"sensitive_points.shame": 2, "needs.freedom": 1}}
      ]
    },
    {
      "question_id": "D13_DEEP_001_Q2",
      "step": "emotion",
      "prompt": "Als je geloof verschuift — wat heb je dan het meest nodig van je partner?",
      "helper_text": "Kies wat het diepst resoneert.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Dat hij/zij bij me blijft ook als mijn overtuigingen veranderen", "tags": {"needs.safety": 2, "needs.connection": 2}},
        {"option_id": "B", "label": "Ruimte om te zoeken zonder veroordeeld te worden", "tags": {"needs.freedom": 2, "needs.safety": 2}},
        {"option_id": "C", "label": "Dat hij/zij mij kent — niet alleen mijn overtuigingen", "tags": {"needs.recognition": 2, "needs.connection": 2}},
        {"option_id": "D", "label": "Dat we dit samen kunnen doorleven zonder het als scheidslijn te zien", "tags": {"needs.connection": 2, "needs.stability": 2}}
      ]
    }
  ],
  "outputs": {
    "solo": {
      "mirror": "Geloofsverandering is een van de diepste vormen van innerlijke groei — en een van de moeilijkste om te delen.",
      "protection_reflection": "Schaamte over veranderend geloof beschermt je voor oordeel — maar het maakt het ook eenzaam.",
      "need_reflection": "Jij wil veranderen mogen — en toch geliefd blijven. Dat is een echte behoefte.",
      "chance": "Geloof dat vragen stelt en antwoorden zoekt is levend geloof.",
      "challenge": "Deel de crisis eerder, niet als hij volledig is. Dan is de ander al mee in het proces.",
      "experiment": "Zeg: 'Ik merk dat mijn geloof aan het verschuiven is. Ik weet nog niet waar ik uitkom. Ik wil het met jou bespreken.'",
      "gentle_phrase": "Ik mag veranderen — en toch mezelf zijn."
    },
    "couple": {
      "comparison_intro": "Een geloofscrisis is persoonlijk — maar ze raakt altijd ook de relatie.",
      "what_a_may_hear": "Jij verschuift — en dat is spannend en waardevol tegelijk.",
      "what_b_may_hear": "Jij ziet de ander veranderen — en dat roept iets op.",
      "what_each_protects": "De een beschermt het zoekproces. De ander beschermt de stabiliteit van de relatie.",
      "shared_chance": "Als jullie de geloofscrisis samen doorleven, groeit het vertrouwen.",
      "shared_challenge": "Laat verandering toe — voor jezelf en voor de ander.",
      "shared_experiment": "Spreek af: ik vertel je hoe het met mijn geloof gaat — jij luistert zonder te sturen."
    }
  }
},

"D13_DEEP_002": {
  "questions": [
    {
      "question_id": "D13_DEEP_002_Q1",
      "step": "sensitive_point",
      "prompt": "Kerk, autoriteit, oordeel of schaamte hebben sporen nagelaten. Geloofsgesprekken zijn beladen. Wat raakt jou het diepst?",
      "helper_text": "Kies het meest kwetsbare.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Oud oordeel — ik was nooit goed genoeg, vroom genoeg, zuiver genoeg", "tags": {"sensitive_points.shame": 2, "sensitive_points.not_good_enough": 2}},
        {"option_id": "B", "label": "Niet-gehoord zijn — mijn twijfel of pijn mocht er niet zijn", "tags": {"sensitive_points.not_seen": 2, "sensitive_points.not_respected": 1}},
        {"option_id": "C", "label": "Verlies — ik ben iets kwijtgeraakt wat me ook gaf", "tags": {"sensitive_points.grief": 2, "needs.stability": 1}},
        {"option_id": "D", "label": "Schaamte die nog steeds meekomt als geloof ter sprake komt", "tags": {"sensitive_points.shame": 2, "patterns.hypervigilance": 1}}
      ]
    },
    {
      "question_id": "D13_DEEP_002_Q2",
      "step": "emotion",
      "prompt": "Wat heb jij nodig van je partner om geloofsgesprekken veilig te laten voelen als er pijn uit het verleden meekomt?",
      "helper_text": "Kies wat het meest resoneert.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Dat hij/zij weet dat bepaalde woorden of thema's zwaar landen voor mij", "tags": {"needs.safety": 2, "needs.recognition": 2}},
        {"option_id": "B", "label": "Dat ik mijn pijn mag benoemen zonder dat hij/zij het verdedigt of wegrelativeert", "tags": {"needs.safety": 2, "needs.recognition": 2}},
        {"option_id": "C", "label": "Dat geloof bij ons geen verplicht onderwerp is — maar wel een veilig onderwerp", "tags": {"needs.freedom": 2, "needs.safety": 2}},
        {"option_id": "D", "label": "Dat de ander zachtheid brengt als dit ter sprake komt", "tags": {"needs.safety": 2, "needs.connection": 2}}
      ]
    }
  ],
  "outputs": {
    "solo": {
      "mirror": "Kerkelijke pijn is echt — en die mag er zijn naast geloof, twijfel én liefde.",
      "protection_reflection": "Alertheid bij geloofsgesprekken beschermt je voor oud oordeel. Dat alarm had vroeger zin — het mag nu worden bijgesteld.",
      "need_reflection": "Jij verdient zachtheid in gesprekken over geloof — van de ander én van jezelf.",
      "chance": "Als de ander weet wat beladen is voor jou, kunnen geloofsgesprekken ook helend worden.",
      "challenge": "Vertel je partner één ding dat pijn heeft gedaan in kerk of geloof. Niet voor debat — voor begrip.",
      "experiment": "Zeg: 'Als we over geloof praten, is het voor mij soms beladen. Dit is waarom...'",
      "gentle_phrase": "Mijn pijn uit het verleden mag meegeteld worden in onze gesprekken over geloof."
    },
    "couple": {
      "comparison_intro": "Kerkelijke pijn vraagt extra zachtheid in geloofsgesprekken — van beide kanten.",
      "what_a_may_hear": "Jij draagt iets mee dat in geloofsgesprekken al snel raakt.",
      "what_b_may_hear": "Jij weet misschien niet altijd wat beladen is — leer het vragen.",
      "what_each_protects": "De een beschermt oud zeer. De ander beschermt de ruimte voor geloof.",
      "shared_chance": "Als jullie elkaars gevoeligheid kennen, worden geloofsgesprekken veiliger.",
      "shared_challenge": "Vraag: 'Wat maakt dit onderwerp soms moeilijk voor je?' Luister zonder te verdedigen.",
      "shared_experiment": "Vertel elkaar één ding dat geloof of kerk voor jou pijnlijk heeft gemaakt. De ander luistert alleen."
    }
  }
}

} # end D13_CASES

# ── Update cases.json ──────────────────────────────────────────────────────

with open('cases.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

updated = 0
for c in data['cases']:
    dom = c.get('domain', {})
    did = dom.get('domain_id') if isinstance(dom, dict) else dom
    cid = c['case_id']
    if did == 'D13' and cid in D13_CASES:
        c['questions'] = D13_CASES[cid]['questions']
        c['outputs']   = D13_CASES[cid]['outputs']
        print('Updated:', cid)
        updated += 1

with open('cases.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f'\nDone! Updated {updated} D13 cases.')
