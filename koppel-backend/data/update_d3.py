# -*- coding: utf-8 -*-
import json, sys, copy
sys.stdout.reconfigure(encoding='utf-8')

with open('cases.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

cases = data['cases']

D3_CASES = {

"D3_POSITIVE_001": {
  "questions": [
    {
      "question_id": "q1_reaction",
      "step": "reaction",
      "prompt": "Wat doet het met jou als je partner gewoon doet wat afgesproken was?",
      "helper_text": "Kies wat het meest herkenbaar is, niet wat het netst klinkt.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Ik ontspan vanbinnen — het bevestigt dat ik kan vertrouwen.", "tags": {"needs.safety": 2, "needs.reassurance": 1}},
        {"option_id": "B", "label": "Ik voel dankbaarheid, maar ook: had ik dit dan niet gewoon verwacht?", "tags": {"needs.stability": 1, "sensitive_points.not_enough": 1}},
        {"option_id": "C", "label": "Ik merk het nauwelijks bewust, maar achteraf realiseer ik hoe fijn het is.", "tags": {"needs.safety": 1, "centers.body": 1}},
        {"option_id": "D", "label": "Ik word warm vanbinnen — kleine dingen tellen voor mij het meest.", "tags": {"needs.recognition": 2, "needs.attention": 1}},
        {"option_id": "E", "label": "Ik neem het aan maar check vanbinnen: is dit een patroon of een uitzondering?", "tags": {"needs.reassurance": 2, "protections.control": 1}}
      ]
    },
    {
      "question_id": "q2_need",
      "step": "need",
      "prompt": "Wat heeft betrouwbaarheid op deze manier voor jou?",
      "helper_text": "Niet wat het voor de ander betekent — wat het voor jóu doet.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Het zegt: jij bent hier voor mij. Dat geeft rust die ik moeilijk in woorden vat.", "tags": {"needs.safety": 2, "needs.reassurance": 2}},
        {"option_id": "B", "label": "Het geeft mij bewijs dat ik niet hoef te waken — ik kan loslaten.", "tags": {"needs.stability": 2, "skills.self_regulation": 1}},
        {"option_id": "C", "label": "Het bouwt langzaam iets op — vertrouwen is voor mij geen woord maar iets dat ik voel.", "tags": {"needs.safety": 2, "centers.body": 1}},
        {"option_id": "D", "label": "Het maakt me rustig maar ook een beetje verdrietig — ik had dit zo nodig en wist dat niet.", "tags": {"needs.reassurance": 2, "sensitive_points.not_enough": 1}},
        {"option_id": "E", "label": "Eerlijk gezegd merk ik er weinig bij — ik neem betrouwbaarheid als gegeven.", "tags": {"needs.freedom": 1, "centers.head": 1}}
      ]
    }
  ],
  "outputs": {
    "solo": {
      "mirror": "Betrouwbaarheid voelt voor jou niet als vanzelfsprekend — het raakt iets diepers. Als jij ontspant wanneer een afspraak nagekomen wordt, zegt dat iets over wat jij nodig hebt om je veilig te voelen.",
      "protection_reflection": "Jouw waakzaamheid is er niet voor niets. Ergens heb jij geleerd dat veiligheid niet altijd gegarandeerd is. Die alertheid beschermt jou — maar maakt het ook lastiger om echt te landen in vertrouwen.",
      "need_reflection": "Jij hebt behoefte aan betrouwbaarheid als taal. Niet grote beloften, maar kleine consistentie: jij doet wat je zegt, ik kan op jou rekenen.",
      "chance": "Dit moment laat zien wat jij écht nodig hebt in verbinding — niet spektakel, maar de stilte van vertrouwen.",
      "challenge": "Kun jij het ontvangen als het er is? Of zoek jij toch het bewijs dat het niet altijd zo zal blijven?",
      "experiment": "Zeg vandaag een keer hardop: 'Dankjewel dat je deed wat je zei.' Klein, maar het benoemen van betrouwbaarheid maakt het echt.",
      "gentle_phrase": "Jij hebt niet te veel nodig. Jij hebt nodig wat altijd had mogen bestaan."
    },
    "couple": {
      "comparison_intro": "Jullie reageren allebei op betrouwbaarheid — maar wat dat voor ieder van jullie betekent, kan heel anders zijn.",
      "what_a_may_hear": "Voor A voelt een nagekomen afspraak als bevestiging van basisveiligheid. Zonder het te beseffen checkt A continu: is dit een patroon of toeval?",
      "what_b_may_hear": "Voor B is een afspraak nakomen iets gewoons — misschien begrijpt B niet waarom dit zo'n impact heeft op A.",
      "what_each_protects": "A beschermt zichzelf door waakzaam te blijven. B beschermt zichzelf door het belang te minimaliseren.",
      "shared_chance": "Samen onderzoeken: wat is voor ons allebei de taal van vertrouwen?",
      "shared_challenge": "Kunnen jullie betrouwbaarheid klein houden — en toch serieus nemen?",
      "shared_experiment": "Benoem deze week één keer als de ander iets nakomt. Niet als compliment maar als erkenning: 'Ik merk dat ik dit fijn vind.'"
    }
  }
},

"D3_POSITIVE_002": {
  "questions": [
    {
      "question_id": "q1_emotion",
      "step": "emotion",
      "prompt": "Wat voel je als je partner zegt: 'Ik wil dit vertellen zodat het niet tussen ons komt'?",
      "helper_text": "Kies wat het meest herkenbaar is, niet wat het netst klinkt.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Ik voel dankbaarheid — en een lichte druk om het goede te zeggen.", "tags": {"needs.connection": 2, "protections.appease": 1}},
        {"option_id": "B", "label": "Ik word geraakt — dit soort moed raakt mij meer dan grote woorden.", "tags": {"needs.honesty": 2, "needs.connection": 1}},
        {"option_id": "C", "label": "Ik voel spanning — ik weet niet wat er komt en of ik het aankan.", "tags": {"needs.safety": 1, "sensitive_points.not_enough": 1, "centers.body": 1}},
        {"option_id": "D", "label": "Ik voel bewondering maar ook een lichte jaloezie — ik wou dat ik dit ook zo kon.", "tags": {"skills.vulnerability": 1, "needs.recognition": 1}},
        {"option_id": "E", "label": "Ik neem het aan maar voel vanbinnen toch waakzaamheid — eerlijkheid kan ook pijn doen.", "tags": {"needs.reassurance": 1, "protections.control": 1}}
      ]
    },
    {
      "question_id": "q2_interpretation",
      "step": "interpretation",
      "prompt": "Wat zegt deze eerlijkheid van je partner over jullie relatie?",
      "helper_text": "Wat maak jij hiervan — los van wat je zou 'moeten' denken?",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Het zegt dat wij veilig genoeg zijn voor kwetsbaarheid — dat is kostbaar.", "tags": {"needs.safety": 2, "needs.honesty": 2}},
        {"option_id": "B", "label": "Het zegt: jij kiest voor transparantie ook als dat moeilijk is. Dat bouwt iets.", "tags": {"needs.honesty": 2, "needs.stability": 1}},
        {"option_id": "C", "label": "Het geeft mij hoop — maar ik wil zien of dit patroon blijft.", "tags": {"needs.reassurance": 2, "protections.control": 1}},
        {"option_id": "D", "label": "Het roept ook iets op: ben ik zelf ook zo eerlijk naar jou?", "tags": {"skills.vulnerability": 2, "needs.honesty": 1}},
        {"option_id": "E", "label": "Het maakt mij verdrietig — want dit voelt als wat er altijd had moeten zijn.", "tags": {"needs.safety": 2, "sensitive_points.not_enough": 1}}
      ]
    }
  ],
  "outputs": {
    "solo": {
      "mirror": "Eerlijkheid die verbinding zoekt, niet conflict — dat raakt jou. Je partner koos om iets moeilijks te zeggen zodat het niet onuitgesproken tussen jullie bleef. Jouw reactie laat zien wat vertrouwen voor jou betekent.",
      "protection_reflection": "Dankbaarheid voelen én tegelijk waakzaam blijven — dat is geen tegenstelling. Jij hebt geleerd dat eerlijkheid soms ook een inleiding is tot pijn. Die bescherming is niet verkeerd, maar kan het ontvangen moeilijker maken.",
      "need_reflection": "Jij hebt behoefte aan een partner die transparant is — niet perfect, maar eerlijk. Dat iemand de moeite neemt om het te zeggen voor het een probleem wordt, is voor jou een fundament van veiligheid.",
      "chance": "Dit moment toont dat kwetsbaarheid en verbinding hand in hand gaan. Jij mag ook gebruik maken van die veiligheid.",
      "challenge": "Kun jij eerlijkheid ontvangen zonder meteen te zorgen dat alles goed blijft? Mag het ook even wringen?",
      "experiment": "Oefen deze week één zin die je normaal inslikt: 'Ik wil dit zeggen zodat het niet onuitgesproken blijft...'",
      "gentle_phrase": "Je hoeft de ander niet te beschermen tegen jouw eerlijkheid. Echte verbinding verdraagt de waarheid."
    },
    "couple": {
      "comparison_intro": "Eerlijkheid spreekt jullie allebei aan — maar het geven én ontvangen ervan vraagt iets anders van ieder.",
      "what_a_may_hear": "A voelt de moed van eerlijkheid en wil die veiligheid beantwoorden met warmte — soms ten koste van de eigen reactie.",
      "what_b_may_hear": "B heeft iets gezegd wat moeilijk was. De vraag is: voelde de reactie van A als echte ontvangst, of als management?",
      "what_each_protects": "A beschermt door de ander gerust te stellen. B beschermt door eerlijk te zijn vóór het escaleert.",
      "shared_chance": "Beiden oefenen: eerlijkheid geven en ontvangen zonder het gesprek meteen glad te maken.",
      "shared_challenge": "Kunnen jullie een moeilijk moment laten zijn zonder het meteen op te lossen?",
      "shared_experiment": "Kies één ding dat jullie allebei 'bijna' gezegd hadden maar inslikten. Zeg het deze week."
    }
  }
},

"D3_POSITIVE_003": {
  "questions": [
    {
      "question_id": "q1_reaction",
      "step": "reaction",
      "prompt": "Hoe voel je je wanneer je partner je geruststelt zonder geïrriteerd te raken?",
      "helper_text": "Kies wat het meest herkenbaar is, niet wat het netst klinkt.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Ik voel opluchting — ik was bang voor een andere reactie.", "tags": {"needs.safety": 2, "sensitive_points.not_enough": 1}},
        {"option_id": "B", "label": "Ik word rustig, maar ergens wacht ik nog op de irritatie die niet komt.", "tags": {"needs.reassurance": 2, "protections.control": 1}},
        {"option_id": "C", "label": "Ik voel me gezien — mijn vraag mocht er zijn.", "tags": {"needs.recognition": 2, "needs.attention": 1}},
        {"option_id": "D", "label": "Ik voel dankbaarheid maar ook een lichte schaamte dat ik die bevestiging nodig had.", "tags": {"needs.reassurance": 2, "sensitive_points.not_enough": 1}},
        {"option_id": "E", "label": "Ik neem het aan, maar mijn lichaam gelooft het nog niet helemaal.", "tags": {"needs.safety": 2, "centers.body": 1}}
      ]
    },
    {
      "question_id": "q2_need",
      "step": "need",
      "prompt": "Wat heb je nodig om je vragen veilig te kunnen stellen?",
      "helper_text": "Niet wat je denkt dat je zou moeten willen — wat helpt jou echt?",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Rust — dat mijn vraag niet meer kost dan het waard is.", "tags": {"needs.safety": 2, "needs.reassurance": 1}},
        {"option_id": "B", "label": "De ervaring dat ik niet tè veel ben.", "tags": {"sensitive_points.not_enough": 2, "needs.recognition": 1}},
        {"option_id": "C", "label": "Consistentie — weten dat dit de reactie is, keer op keer.", "tags": {"needs.stability": 2, "needs.reassurance": 1}},
        {"option_id": "D", "label": "Zachtheid — niet per se antwoorden, maar toon.", "tags": {"needs.safety": 2, "centers.body": 1}},
        {"option_id": "E", "label": "Eigenlijk geen geruststelling — ik wil begrijpen wat er écht is.", "tags": {"needs.honesty": 2, "needs.autonomy": 1}}
      ]
    }
  ],
  "outputs": {
    "solo": {
      "mirror": "Jij durft te vragen wat je spannend vindt — en als dat goed landt, merk je hoe je lichaam langzaam ontspant. Dat ontspannen is geen zwakte, dat is vertrouwen dat wordt opgebouwd.",
      "protection_reflection": "De verwachting dat je partner geïrriteerd zal raken, is er niet voor niets. Ergens heb jij geleerd dat vragen stellen risico heeft. Die waakzaamheid beschermt jou — maar kost ook iets.",
      "need_reflection": "Jij hebt behoefte aan een partner die jouw vragen kan verdragen zonder ongeduld. Niet per se met antwoorden, maar met aanwezigheid.",
      "chance": "Elke keer dat je vraag goed ontvangen wordt, wordt vertrouwen een klein beetje groter. Dit moment telt.",
      "challenge": "Kun jij de geruststelling binnenlaten, ook als een deel van jou wacht op de keer dat het niet zo gaat?",
      "experiment": "Stel vandaag bewust één vraag die je normaal inslikt. Kijk wat er gebeurt.",
      "gentle_phrase": "Jouw vragen zijn geen last. Ze zijn een uitnodiging tot verbinding."
    },
    "couple": {
      "comparison_intro": "Geruststelling geven en ontvangen — jullie hebben hierin waarschijnlijk verschillende ervaringen.",
      "what_a_may_hear": "A stelt een vraag met innerlijke spanning. De reactie van de ander bepaalt voor een moment hoe veilig de relatie voelt.",
      "what_b_may_hear": "B antwoordt rustig, maar begrijpt misschien niet hoe groot dit moment is voor A. Of: B doet zijn/haar best maar voelt de druk van altijd rustig moeten reageren.",
      "what_each_protects": "A beschermt zichzelf door bijna niet te vragen. B beschermt zichzelf door kalm te lijken ook als het binnenin niet zo rustig is.",
      "shared_chance": "Samen onderzoeken: welke vragen blijven nog ongesteld tussen jullie?",
      "shared_challenge": "Kan A vaker vragen? Kan B ook aangeven als kalm zijn moeilijk is?",
      "shared_experiment": "Maak ruimte voor één vraag die normaal niet gesteld wordt. Luister zonder meteen te antwoorden."
    }
  }
},

"D3_POSITIVE_004": {
  "questions": [
    {
      "question_id": "q1_emotion",
      "step": "emotion",
      "prompt": "Wat voel je wanneer jullie samen overzicht maken in plaats van verwijten?",
      "helper_text": "Kies wat het meest herkenbaar is, niet wat het netst klinkt.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Opluchting — dit is de relatie die ik wil, niet de ruzie die ik vreesde.", "tags": {"needs.safety": 2, "needs.stability": 1}},
        {"option_id": "B", "label": "Rust en trots — wij kunnen dit.", "tags": {"needs.connection": 2, "skills.repair": 1}},
        {"option_id": "C", "label": "Energie — samenwerken geeft mij hoop.", "tags": {"needs.stability": 2, "needs.connection": 1}},
        {"option_id": "D", "label": "Warmte, maar ook: dit had eerder mogen gebeuren.", "tags": {"needs.stability": 1, "sensitive_points.not_enough": 1}},
        {"option_id": "E", "label": "Ik ben er vanbinnen nog niet helemaal bij — de spanning van eerder hangt nog.", "tags": {"centers.body": 1, "needs.reassurance": 1}}
      ]
    },
    {
      "question_id": "q2_interpretation",
      "step": "interpretation",
      "prompt": "Wat zegt dit moment van samenwerken over jullie als team?",
      "helper_text": "Wat maak jij hiervan — los van wat je zou 'moeten' denken?",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Het zegt dat we samen sterker zijn dan het probleem.", "tags": {"needs.stability": 2, "skills.repair": 2}},
        {"option_id": "B", "label": "Het zegt: wij kiezen voor oplossingen, niet voor gelijk hebben.", "tags": {"skills.repair": 2, "needs.connection": 1}},
        {"option_id": "C", "label": "Het voelt als een fundament dat langzaam sterker wordt.", "tags": {"needs.safety": 2, "needs.stability": 1}},
        {"option_id": "D", "label": "Het geeft hoop — maar ik wacht nog even of het ook blijft.", "tags": {"needs.reassurance": 1, "protections.control": 1}},
        {"option_id": "E", "label": "Het zegt dat wij volwassen kunnen zijn met elkaar. Dat is zeldzamer dan het klinkt.", "tags": {"skills.repair": 2, "needs.honesty": 1}}
      ]
    }
  ],
  "outputs": {
    "solo": {
      "mirror": "Jullie kozen voor samen in plaats van tegen elkaar. Dat klinkt simpel, maar het is dat niet. Jij voelde wat dat betekent: oplossing boven gelijk, overzicht boven verwijt.",
      "protection_reflection": "Het feit dat jij dit zo opmerkt, zegt iets over hoe het anders kan gaan. Jij kent de versie waarbij het escaleert. Dat je dit moment opmerkt als anders, is geen toeval.",
      "need_reflection": "Jij hebt behoefte aan een relatie waar problemen samen gedragen worden. Niet jij alleen, niet de ander alleen — maar als team.",
      "chance": "Dit moment is een blauwdruk. Jullie kunnen dit — ook als het moeilijk is.",
      "challenge": "Kun jij deze rust vasthouden als de volgende keer de spanning er eerder is?",
      "experiment": "Maak een kleine check-in-afspraak voor de volgende keer dat er vaagheid is: niet later maar meteen even samen zitten.",
      "gentle_phrase": "Samenwerken is ook een keuze. Jij hebt hem gemaakt."
    },
    "couple": {
      "comparison_intro": "Beiden kozen voor samenwerking — maar hoe dat voelde, kan voor jullie allebei anders zijn.",
      "what_a_may_hear": "A voelt opluchting: wij kunnen dit. Tegelijk is er een voorzichtige hoop — want dit is niet altijd zo gegaan.",
      "what_b_may_hear": "B voelt misschien voldoening: we hebben het opgelost. Maar begrijpt B dat dit voor A meer is dan een praktisch moment?",
      "what_each_protects": "A beschermt zichzelf door niet te veel te verwachten. B beschermt zichzelf door het praktisch te houden.",
      "shared_chance": "Maak van samenwerken een ritueel, niet een uitzondering.",
      "shared_challenge": "Hoe blijven jullie in samenwerking als de spanning er al is vóór het gesprek begint?",
      "shared_experiment": "Plan deze week een moment van 15 minuten: geen groot probleem nodig. Gewoon even samen kijken wat er ligt."
    }
  }
},

"D3_TENSION_001": {
  "questions": [
    {
      "question_id": "q1_reaction",
      "step": "reaction",
      "prompt": "Wat is jouw eerste reactie als blijkt dat jullie iets anders begrepen hadden?",
      "helper_text": "Kies wat het meest herkenbaar is, niet wat het netst klinkt.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Ik word direct gespannen — verwarring over afspraken maakt mij onzeker.", "tags": {"needs.stability": 2, "needs.safety": 1}},
        {"option_id": "B", "label": "Ik word geïrriteerd — ik dacht dat dit duidelijk was.", "tags": {"protections.control": 1, "needs.stability": 1}},
        {"option_id": "C", "label": "Ik neem het op mezelf — ik had het vast anders moeten zeggen.", "tags": {"protections.appease": 2, "sensitive_points.not_enough": 1}},
        {"option_id": "D", "label": "Ik voel frustratie maar probeer het rustig te bespreken.", "tags": {"skills.communication": 1, "needs.stability": 1}},
        {"option_id": "E", "label": "Ik stap er snel overheen — misverstanden horen erbij.", "tags": {"protections.minimize": 1, "needs.freedom": 1}}
      ]
    },
    {
      "question_id": "q2_interpretation",
      "step": "interpretation",
      "prompt": "Wat hoor jij vanbinnen als 'kan ik op jou rekenen?' ineens een vraag wordt?",
      "helper_text": "Wat maak jij hiervan — los van wat je zou 'moeten' denken?",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Ik hoor: ik twijfel aan jou. Dat doet pijn.", "tags": {"sensitive_points.not_trusted": 2, "needs.recognition": 1}},
        {"option_id": "B", "label": "Ik hoor mijn eigen oude vraag: ben ik betrouwbaar genoeg?", "tags": {"sensitive_points.not_enough": 2, "needs.reassurance": 1}},
        {"option_id": "C", "label": "Ik hoor: dit gaat over vertrouwen, niet over een afspraak.", "tags": {"needs.safety": 2, "patterns.pursue_withdraw": 1}},
        {"option_id": "D", "label": "Ik hoor: jij pakt dit groter dan het is.", "tags": {"protections.minimize": 1, "sensitive_points.judgment": 1}},
        {"option_id": "E", "label": "Ik hoor mezelf ook: kan ik op jou rekenen voor eerlijke communicatie?", "tags": {"needs.honesty": 2, "needs.stability": 1}}
      ]
    }
  ],
  "outputs": {
    "solo": {
      "mirror": "Een vage afspraak wordt groot omdat vertrouwen al iets is dat bewaard wordt, niet vanzelfsprekend is. Jij merkt wanneer de grond onder jullie even minder stevig aanvoelt.",
      "protection_reflection": "De irritatie of spanning bij een misverstand beschermt jou tegen het grotere risico: dat het patroon is, niet een incident. Jij test eigenlijk: is dit veilig?",
      "need_reflection": "Jij hebt behoefte aan duidelijkheid — niet als controle, maar als veiligheid. Weten wat je kunt verwachten geeft rust.",
      "chance": "Dit misverstand kan een oefenkans zijn: hoe lossen jullie iets op zonder dat het een aanklacht wordt?",
      "challenge": "Kun jij het misverstand laten zijn wat het is — een misverstand — zonder het te laden met de grotere vraag?",
      "experiment": "Spreek samen af: als er onduidelijkheid is, benoem je het meteen. Niet later. Gewoon: 'Ik dacht dat het zo was, klopt dat?'",
      "gentle_phrase": "Onduidelijkheid is geen bewijs van onbetrouwbaarheid. Het is een uitnodiging om te verduidelijken."
    },
    "couple": {
      "comparison_intro": "Jullie hadden allebei een verwachting — maar ze kwamen niet overeen. Hoe elk van jullie daarmee omgaat, laat iets zien.",
      "what_a_may_hear": "A hoort in het misverstand: kan ik op jou rekenen? Die vraag is groter dan de afspraak.",
      "what_b_may_hear": "B voelt de beschuldiging maar begrijpt niet waarom dit zo zwaar landt. Voor B was het gewoon een onduidelijkheid.",
      "what_each_protects": "A beschermt zichzelf door alert te blijven op patronen. B beschermt zichzelf door het klein te houden.",
      "shared_chance": "Leer samen onderscheid maken: is dit een patroon of een incident?",
      "shared_challenge": "Hoe voeren jullie dit gesprek zonder dat één iemand aanklager wordt en de ander verdachte?",
      "shared_experiment": "Maak samen een kleine afspreekregel: bij twijfel even herhalen wat je allebei begreep. Twee minuten, geen discussie."
    }
  }
},

"D3_TENSION_002": {
  "questions": [
    {
      "question_id": "q1_reaction",
      "step": "reaction",
      "prompt": "Wat doe jij vanbinnen terwijl je wacht en er geen bericht komt?",
      "helper_text": "Kies wat het meest herkenbaar is, niet wat het netst klinkt.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Ik begin scenario's te bedenken — van vergeten tot iets ergs.", "tags": {"needs.safety": 2, "protections.control": 1, "centers.head": 1}},
        {"option_id": "B", "label": "Ik voel me langzaam bozer worden — dit is niet oké.", "tags": {"needs.stability": 2, "protections.control": 1}},
        {"option_id": "C", "label": "Ik ga van bezorgd naar boos naar verdrietig — in één keer.", "tags": {"needs.reassurance": 2, "needs.safety": 1}},
        {"option_id": "D", "label": "Ik schrik van hoe hard ik het voel — dit raakt meer dan ik dacht.", "tags": {"sensitive_points.abandonment": 2, "needs.safety": 1}},
        {"option_id": "E", "label": "Ik merk iets, maar probeer het weg te redeneren — het zal wel iets zijn.", "tags": {"protections.minimize": 2, "needs.freedom": 1}}
      ]
    },
    {
      "question_id": "q2_interpretation",
      "step": "interpretation",
      "prompt": "Wanneer je partner binnenkomt en jij al gespannen bent — wat is het moeilijkste aan dat moment?",
      "helper_text": "Wat maak jij hiervan — los van wat je zou 'moeten' denken?",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Dat ik boos én opgelucht ben tegelijk — die mix is verwarrend.", "tags": {"needs.safety": 2, "skills.self_regulation": 1}},
        {"option_id": "B", "label": "Dat mijn reactie te groot lijkt voor wat er is — en ik mezelf daarvoor schaam.", "tags": {"sensitive_points.not_enough": 2, "needs.recognition": 1}},
        {"option_id": "C", "label": "Dat ik wil uitleggen wat dit met mij doet, maar bang ben voor de reactie.", "tags": {"needs.safety": 2, "skills.communication": 1}},
        {"option_id": "D", "label": "Dat de ander denkt dat ik overdrijf, terwijl ik me echt onveilig voelde.", "tags": {"sensitive_points.not_seen": 2, "needs.recognition": 2}},
        {"option_id": "E", "label": "Dat ik eigenlijk gewoon wil horen: sorry, ik had moeten beseffen dat dit telt voor jou.", "tags": {"needs.recognition": 2, "needs.reassurance": 2}}
      ]
    }
  ],
  "outputs": {
    "solo": {
      "mirror": "Wachten zonder bericht raakt iets diepers dan alleen de praktische situatie. Jij merkt hoe jouw zenuwstelsel reageert op onzekerheid over een ander — en hoe dat méér voelt dan alleen irritatie.",
      "protection_reflection": "De scenario's die je bedenkt, de boosheid die opbouwt — dat zijn manieren om met onzekerheid om te gaan. Jij geeft jezelf een gevoel van controle over iets wat buiten jou ligt.",
      "need_reflection": "Jij hebt behoefte aan een bericht. Niet als bewijs van gehoorzaamheid, maar als signaal: jij bent in mijn gedachten, ook als ik er niet ben.",
      "chance": "Dit moment biedt de kans om te zeggen wat je nodig hebt — niet als aanklacht, maar als eerlijke behoefte.",
      "challenge": "Kun jij het gesprek starten vanuit 'Dit is wat er met mij gebeurde', in plaats van 'Dit had jij moeten doen'?",
      "experiment": "Zeg het één keer simpel: 'Als jij te laat bent en er komt geen bericht, voel ik onrust. Een klein berichtje helpt mij echt.' Geen discussie, alleen die zin.",
      "gentle_phrase": "Jij bent niet te gevoelig. Jij hebt een zenuwstelsel dat verbinding zoekt."
    },
    "couple": {
      "comparison_intro": "Wachten en terugkomen — voor ieder van jullie zit er een andere beleving aan.",
      "what_a_may_hear": "Voor A is het wachten niet alleen praktisch. Het activeert iets ouders: ben jij er? Telt dit voor jou?",
      "what_b_may_hear": "Voor B was het druk of vergeten. De spanning bij thuiskomst voelt als een aanval op iets wat onbedoeld was.",
      "what_each_protects": "A beschermt zichzelf door alert te blijven op aanwezigheid. B beschermt zichzelf door het te minimaliseren.",
      "shared_chance": "Maak een kleine afspraak over bereikbaarheid — niet als regel, maar als zorg voor elkaar.",
      "shared_challenge": "Hoe blijft A ruimte geven voor vergissingen? Hoe neemt B de impact serieus zonder zich aangevallen te voelen?",
      "shared_experiment": "Spreek af: stuur een bericht als je meer dan 20 minuten later bent. Niet als plicht, maar als liefdestaal."
    }
  }
},

"D3_TENSION_003": {
  "questions": [
    {
      "question_id": "q1_emotion",
      "step": "emotion",
      "prompt": "Wat voel je vanbinnen als je de onrust merkt maar niet weet of er iets is?",
      "helper_text": "Kies wat het meest herkenbaar is, niet wat het netst klinkt.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Verwarring en schaamte — ik wil niet wantrouwig zijn.", "tags": {"needs.honesty": 2, "sensitive_points.judgment": 1}},
        {"option_id": "B", "label": "Onrust in mijn lichaam — iets klopt niet, maar ik kan er niets op zetten.", "tags": {"centers.body": 2, "needs.safety": 1}},
        {"option_id": "C", "label": "Angst — dit patroon ken ik van vroeger.", "tags": {"sensitive_points.abandonment": 2, "needs.safety": 2}},
        {"option_id": "D", "label": "Irritatie — als er niets is, waarom dan zo defensief?", "tags": {"protections.control": 1, "needs.honesty": 2}},
        {"option_id": "E", "label": "Ik probeer het te negeren — ik wil niet de jaloerse of paranoïde partner zijn.", "tags": {"protections.minimize": 2, "needs.freedom": 1}}
      ]
    },
    {
      "question_id": "q2_interpretation",
      "step": "interpretation",
      "prompt": "Wat hoor jij vanbinnen als je partner defensief reageert op jouw vraag?",
      "helper_text": "Wat maak jij hiervan — los van wat je zou 'moeten' denken?",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Ik hoor: jij vertrouwt mij niet. Dat doet pijn.", "tags": {"sensitive_points.not_trusted": 2, "needs.recognition": 1}},
        {"option_id": "B", "label": "Ik hoor: er ís iets — anders was de reactie niet zo heftig.", "tags": {"protections.control": 2, "needs.safety": 1}},
        {"option_id": "C", "label": "Ik hoor mijn eigen angst bevestigd: ik mag dit niet vragen.", "tags": {"sensitive_points.not_enough": 2, "needs.safety": 1}},
        {"option_id": "D", "label": "Ik hoor: jij bent te dichtbij gekomen — de grens is hier.", "tags": {"needs.autonomy": 1, "needs.safety": 1}},
        {"option_id": "E", "label": "Ik hoor niets concreets — maar mijn lichaam gelooft de geruststelling niet.", "tags": {"centers.body": 2, "needs.safety": 2}}
      ]
    }
  ],
  "outputs": {
    "solo": {
      "mirror": "Jij merkt iets op en weet niet of het klopt — maar je lichaam geeft een signaal. Dat is geen paranoia. Dat is oplettendheid. Het verschil zit in wat je ermee doet.",
      "protection_reflection": "De onrust wegredeneren of er fel op ingaan — beide zijn manieren om te omgaan met iets wat je niet kunt benoemen. Jij zoekt houvast in een moment van onduidelijkheid.",
      "need_reflection": "Jij hebt behoefte aan eerlijkheid — zelfs als de eerlijkheid moeilijk is. Onzekerheid verdraag jij slechter dan een pijnlijke waarheid.",
      "chance": "Dit moment vraagt om helderheid over privacy versus geheimhouding. Dat onderscheid is het waard om samen te bespreken.",
      "challenge": "Kun jij de defensiviteit van je partner benoemen zonder het als bewijs te gebruiken?",
      "experiment": "Zeg: 'Ik vraag je niet om verantwoording. Ik vraag je om openheid. Er is verschil.' En kijk wat er dan gebeurt.",
      "gentle_phrase": "Jouw onrust is niet het probleem. Het is een signaal. Luister ernaar."
    },
    "couple": {
      "comparison_intro": "Privacy en transparantie — jullie kunnen hierin fundamenteel anders zitten.",
      "what_a_may_hear": "A voelt iets en weet niet of dat klopt. De defensieve reactie maakt de onrust groter, niet kleiner.",
      "what_b_may_hear": "B voelt een inbreuk op privacy. De vraag van A voelt als wantrouwen, ook als A dat niet bedoelt.",
      "what_each_protects": "A beschermt zichzelf door te vragen. B beschermt zichzelf door grenzen te bewaken.",
      "shared_chance": "Maak onderscheid: wat is privacy (ruimte voor jezelf) en wat is geheimhouding (iets achterhouden)? Bespreek dit.",
      "shared_challenge": "Hoe geeft B ruimte aan A's gevoel zonder zich aangevallen te voelen? Hoe vraagt A zonder te beschuldigen?",
      "shared_experiment": "Spreek samen af wat jullie allebei oké vinden als 'mijn ruimte' en wat niet. Niet als regels, maar als begrip."
    }
  }
},

"D3_TENSION_004": {
  "questions": [
    {
      "question_id": "q1_reaction",
      "step": "reaction",
      "prompt": "Wat doet het met je als je merkt dat je opnieuw wil vragen, ook al heb je het antwoord al gehad?",
      "helper_text": "Kies wat het meest herkenbaar is, niet wat het netst klinkt.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Ik schaam me — ik wil niet zo zijn.", "tags": {"sensitive_points.not_enough": 2, "needs.recognition": 1}},
        {"option_id": "B", "label": "Ik word moe van mezelf — ik weet dat het niet logisch is, maar ik kan er niets aan doen.", "tags": {"needs.reassurance": 2, "sensitive_points.not_enough": 1}},
        {"option_id": "C", "label": "Ik herken het maar voel me er niet voor verantwoordelijk — dit zit dieper dan ik wil.", "tags": {"sensitive_points.abandonment": 1, "needs.safety": 2}},
        {"option_id": "D", "label": "Ik houd het voor me — ik wil de ander niet belasten met hoe hoog mijn behoefte is.", "tags": {"protections.withdraw": 2, "needs.reassurance": 2}},
        {"option_id": "E", "label": "Ik vraag toch opnieuw — ook al weet ik dat het de ander frustreert.", "tags": {"needs.reassurance": 3, "patterns.pursue_withdraw": 1}}
      ]
    },
    {
      "question_id": "q2_sensitive_point",
      "step": "sensitive_point",
      "prompt": "Wat is er eigenlijk nodig voor jou om echt gerust te zijn?",
      "helper_text": "Niet wat je denkt dat je zou moeten willen — wat helpt jou echt?",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Ergens voelen dat ik kan vertrouwen — niet alleen begrijpen.", "tags": {"needs.safety": 2, "centers.body": 2}},
        {"option_id": "B", "label": "Weten dat de ander blijft, ook als ik moeilijk ben.", "tags": {"needs.reassurance": 3, "sensitive_points.abandonment": 1}},
        {"option_id": "C", "label": "Een ervaring van consistentie — een patroon dat ik zelf begin te geloven.", "tags": {"needs.stability": 2, "needs.reassurance": 1}},
        {"option_id": "D", "label": "Iets in mezelf leren dragen — de geruststelling moet van binnenuit komen.", "tags": {"skills.self_regulation": 2, "needs.autonomy": 1}},
        {"option_id": "E", "label": "Ik weet het eerlijk gezegd niet — ik ben het misschien al lang kwijt.", "tags": {"needs.safety": 2, "sensitive_points.abandonment": 2}}
      ]
    }
  ],
  "outputs": {
    "solo": {
      "mirror": "Geruststelling die niet blijft hangen — dat is geen zwakte van jou en ook geen fout van je partner. Het zegt iets over hoe diep jouw zenuwstelsel in onzekerheid zit. Woorden raken soms de oppervlakte, maar niet de grond.",
      "protection_reflection": "Schaamte over het opnieuw vragen is een bescherming: als ik mij klein maak, beschuldig ik de ander niet. Maar daarmee los je niets op. Je verbergt alleen hoe hoog jouw behoefte eigenlijk is.",
      "need_reflection": "Jij hebt behoefte aan een vertrouwen dat voelt — niet dat bewezen wordt. Een consistent patroon, een aanwezigheid die je lichaam leert herkennen.",
      "chance": "De schaamte die je voelt over je behoefte is het eerste wat mag verdwijnen. Daarna kun je pas echt kijken wat helpt.",
      "challenge": "Kun jij het gesprek starten vanuit kwetsbaarheid: 'Ik voel dit en ik weet dat het niet logisch is'?",
      "experiment": "Zeg één keer: 'Ik merk dat ik opnieuw wil vragen. Dat zegt iets over mij, niet over jou. Kun jij gewoon even bij me zijn?'",
      "gentle_phrase": "Je bent niet te veel. Je bent iemand die leerde dat veiligheid niet zomaar gegeven is."
    },
    "couple": {
      "comparison_intro": "Herhaling van vragen kan voor ieder van jullie heel anders aanvoelen.",
      "what_a_may_hear": "A vraagt opnieuw — niet om te controleren maar omdat het niet geland is. Dat verschil is voor A cruciaal maar niet altijd zichtbaar.",
      "what_b_may_hear": "B heeft gerustgesteld. Opnieuw gevraagd worden voelt als: mijn woord is niet genoeg. Dat is vermoeiend en soms pijnlijk.",
      "what_each_protects": "A beschermt zichzelf door te vragen. B beschermt zichzelf door te antwoorden en tegelijk afstand te bewaren.",
      "shared_chance": "Samen ontdekken: wat helpt A werkelijk? En wat heeft B nodig om zich niet uitgeput te voelen?",
      "shared_challenge": "Hoe kan A leren dragen zonder steeds te vragen? Hoe kan B geven zonder te verdwijnen?",
      "shared_experiment": "Spreek af: als A de onrust voelt, zegt A dat zonder te vragen. B reageert met aanwezigheid, niet met antwoord. Oefen dat één keer."
    }
  }
},

"D3_DEEP_001": {
  "questions": [
    {
      "question_id": "q1_emotion",
      "step": "emotion",
      "prompt": "Wat voel je als je merkt dat je reactie groter is dan het moment?",
      "helper_text": "Kies wat het meest herkenbaar is, niet wat het netst klinkt.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Verwarring — ik weet dat dit te groot is, maar kan het niet stopzetten.", "tags": {"sensitive_points.not_enough": 1, "needs.safety": 2, "centers.body": 1}},
        {"option_id": "B", "label": "Schaamte — ik wil niet zo zijn.", "tags": {"sensitive_points.not_enough": 2, "needs.recognition": 1}},
        {"option_id": "C", "label": "Verdriet — dit voelt oud en vertrouwd.", "tags": {"sensitive_points.abandonment": 2, "needs.safety": 1}},
        {"option_id": "D", "label": "Boosheid op mezelf — ik laat het verleden mijn heden verpesten.", "tags": {"sensitive_points.not_enough": 2, "protections.control": 1}},
        {"option_id": "E", "label": "Opluchting dat ik het nu merk — dat is al winst.", "tags": {"skills.self_regulation": 2, "needs.autonomy": 1}}
      ]
    },
    {
      "question_id": "q2_sensitive_point",
      "step": "sensitive_point",
      "prompt": "Welk oud alarm gaat er aan in jou?",
      "helper_text": "Niet wat je denkt dat je zou moeten voelen — wat herken jij echt?",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Het alarm van: als ik mij open, word ik gekwetst.", "tags": {"sensitive_points.abandonment": 2, "protections.withdraw": 1}},
        {"option_id": "B", "label": "Het alarm van: mensen verdwijnen als het moeilijk wordt.", "tags": {"sensitive_points.abandonment": 2, "needs.safety": 1}},
        {"option_id": "C", "label": "Het alarm van: ik ben niet genoeg om bij te blijven.", "tags": {"sensitive_points.not_enough": 3, "needs.recognition": 1}},
        {"option_id": "D", "label": "Het alarm van: als ik vertrouw, verlies ik controle — en controle is veiligheid.", "tags": {"protections.control": 2, "needs.safety": 2}},
        {"option_id": "E", "label": "Ik weet het niet precies — het is meer een gevoel in mijn lichaam dan een gedachte.", "tags": {"centers.body": 2, "needs.safety": 2}}
      ]
    }
  ],
  "outputs": {
    "solo": {
      "mirror": "Jij draagt iets mee dat groter is dan deze relatie. Een oud alarm dat aanslaat bij kleine signalen. Dat alarm heeft jou ooit beschermd — het is er niet voor niets. Maar het onderscheidt niet altijd tussen toen en nu.",
      "protection_reflection": "De bescherming die je inzet — terugtrekken, controleren, klein maken van jezelf of van de ander — heeft vroeger geholpen. De vraag nu is: helpt het hier ook, of houdt het jou op afstand van wat je eigenlijk wil?",
      "need_reflection": "Jij hebt behoefte aan bewijs dat het nu anders is. Niet in woorden, maar in ervaring. Keer op keer. Dat is niet te veel gevraagd — dat is hoe vertrouwen wordt opgebouwd na een breuk.",
      "chance": "Jij kunt leren onderscheid te maken: is dit oud of is dit nu? Die vraag alleen al is krachtig.",
      "challenge": "Kun jij, als het alarm afgaat, even pauzeren en vragen: is dit oud of nieuw?",
      "experiment": "Schrijf één zin op: 'Mijn oud alarm gaat aan bij...' Lees hem hardop. Je hoeft hem niet op te lossen — alleen te herkennen.",
      "gentle_phrase": "Het verleden heeft jou gevormd. Het hoeft jou niet te sturen."
    },
    "couple": {
      "comparison_intro": "Jullie brengen allebei een verleden mee. Soms reageer je op wat er nu is — soms op wat er was.",
      "what_a_may_hear": "A's reactie is groter dan het moment. Dat is soms verwarrend, ook voor A zelf.",
      "what_b_may_hear": "B ontvangt een reactie die niet helemaal over B gaat. Maar dat is moeilijk te zien vanuit de binnenkant.",
      "what_each_protects": "A beschermt zichzelf door oud alarm serieus te nemen. B beschermt zichzelf door te begrijpen maar soms te verdwalen daarin.",
      "shared_chance": "Samen leren zeggen: 'Ik reageer nu op iets ouds. Blijf even bij me.'",
      "shared_challenge": "Hoe maakt B ruimte voor A's verleden zonder verantwoordelijk te zijn voor A's genezen?",
      "shared_experiment": "Spreek een zin af die jullie kunnen gebruiken: 'Ik denk dat dit oud is.' Dat is geen aanklacht. Het is een aanwijzing."
    }
  }
},

"D3_DEEP_002": {
  "questions": [
    {
      "question_id": "q1_protection",
      "step": "protection",
      "prompt": "Hoe uit jouw controlerende kant zich in de relatie?",
      "helper_text": "Kies wat het meest herkenbaar is — ook als het niet iets is waar je trots op bent.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Ik stel veel vragen — over waar de ander is, hoe laat, met wie.", "tags": {"protections.control": 3, "needs.safety": 2}},
        {"option_id": "B", "label": "Ik check berichten of social media — ook al wil ik dat niet.", "tags": {"protections.control": 3, "sensitive_points.not_trusted": 1}},
        {"option_id": "C", "label": "Ik maak plannen voor de ander of voor ons, zodat ik overzicht houd.", "tags": {"protections.control": 2, "protections.overperform": 1}},
        {"option_id": "D", "label": "Ik merk spanning als de ander iets doet dat ik niet had verwacht.", "tags": {"protections.control": 2, "needs.stability": 1}},
        {"option_id": "E", "label": "Ik zeg niets, maar voel van alles — vanbinnen is er een constante scan.", "tags": {"protections.control": 2, "centers.body": 1}}
      ]
    },
    {
      "question_id": "q2_sensitive_point",
      "step": "sensitive_point",
      "prompt": "Wat is er zo eng aan het loslaten van controle?",
      "helper_text": "Niet wat je denkt dat je zou moeten voelen — wat herken jij echt?",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Als ik loslaat, kan er iets gebeuren dat ik niet meer kan opvangen.", "tags": {"needs.safety": 3, "sensitive_points.abandonment": 1}},
        {"option_id": "B", "label": "Als ik loslaat, verlies ik mezelf — ik weet niet meer wie ik ben zonder houvast.", "tags": {"needs.stability": 2, "sensitive_points.losing_self": 2}},
        {"option_id": "C", "label": "Als ik loslaat, ga ik pijn krijgen. En ik weet niet of ik dat aankan.", "tags": {"sensitive_points.abandonment": 2, "needs.safety": 2}},
        {"option_id": "D", "label": "Controle is het enige wat ik kan doen als ik me onveilig voel. Loslaten voelt als niets meer kunnen doen.", "tags": {"protections.control": 2, "needs.safety": 2}},
        {"option_id": "E", "label": "Ik weet het niet precies — maar het idee alleen al geeft angst.", "tags": {"needs.safety": 3, "centers.body": 1}}
      ]
    }
  ],
  "outputs": {
    "solo": {
      "mirror": "Controle is niet jouw karakter — het is jouw bescherming. Ergens heb jij geleerd dat opletten, checken en weten jou veilig houdt. Dat was slim. Maar in een relatie kost het iets.",
      "protection_reflection": "De constante scan, het vragen, het plannen — het geeft een gevoel van grip. Maar het kost ook energie, en het houdt jou op een afstand van echte overgave. Je bent bezig met veilig zijn in plaats van veilig voelen.",
      "need_reflection": "Jij hebt behoefte aan een veiligheid die dieper gaat dan wat je kunt controleren. Dat is iets dat opgebouwd wordt — niet iets dat je kunt afdwingen.",
      "chance": "Loslaten hoeft niet alles tegelijk. Eén klein moment van vertrouwen is genoeg om te beginnen.",
      "challenge": "Kun jij één keer iets niet checken — en kijken of je het verdraagt?",
      "experiment": "Kies één dag: laat één controle-moment bewust achterwege. Schrijf op wat je voelde. Geen oordeel, alleen observatie.",
      "gentle_phrase": "Jij beschermt jezelf. Dat was ooit nodig. Nu mag je leren dat veiligheid ook van binnenuit kan komen."
    },
    "couple": {
      "comparison_intro": "Controle heeft effect op jullie allebei — ook als maar één van jullie het voelt.",
      "what_a_may_hear": "A voelt onrust en probeert die te managen via vragen, checken of plannen. Dat is geen wantrouwen — het is angst die zich zo uitdrukt.",
      "what_b_may_hear": "B ervaart de controle als druk of wantrouwen. Dat is vermoeiend en kan leiden tot meer terugtrekken — precies wat A's angst voedt.",
      "what_each_protects": "A beschermt zichzelf door te controleren. B beschermt zichzelf door ruimte te houden.",
      "shared_chance": "Samen begrijpen: wat voedt A's angst? En hoe kan B helpen zonder de eigen grens te verliezen?",
      "shared_challenge": "Hoe doorbreekt A het controlepatroon? Hoe reageert B op de angst achter de controle?",
      "shared_experiment": "Spreek één signaalzin af: als A voelt dat de scan aanspringt, zegt A: 'Ik voel onrust.' B reageert met aanwezigheid, niet met verdediging. Oefen dat."
    }
  }
}

}

# Update cases
updated = 0
for c in cases:
    cid = c['case_id']
    if cid in D3_CASES:
        c['questions'] = D3_CASES[cid]['questions']
        c['outputs'] = D3_CASES[cid]['outputs']
        updated += 1
        print('Updated: ' + cid)

data['cases'] = cases

with open('cases.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print('\nDone! Updated ' + str(updated) + ' D3 cases.')
