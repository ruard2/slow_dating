import json, sys
sys.stdout.reconfigure(encoding='utf-8')

D10_CASES = {

# ── POSITIVE ──────────────────────────────────────────────────────────────

"D10_POSITIVE_001": {
  "questions": [
    {
      "question_id": "D10_POSITIVE_001_Q1",
      "step": "emotion",
      "prompt": "Je partner zegt tegenover familie: 'Wij overleggen dit samen.' Familie blijft erbij, maar jullie relatie staat. Wat voel jij op dat moment?",
      "helper_text": "Kies de emotie die het meest klopt.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Opluchting — ik sta er niet alleen voor", "tags": {"needs.safety": 2, "needs.connection": 2}},
        {"option_id": "B", "label": "Dankbaarheid — dit is wat ik nodig had", "tags": {"needs.recognition": 2, "needs.connection": 2}},
        {"option_id": "C", "label": "Verrassing — ik had niet verwacht dat dit zo soepel ging", "tags": {"needs.safety": 1, "needs.stability": 1}},
        {"option_id": "D", "label": "Warmte — wij zijn een team, ook tegenover familie", "tags": {"needs.connection": 2, "skills.teamwork": 2}}
      ]
    },
    {
      "question_id": "D10_POSITIVE_001_Q2",
      "step": "need",
      "prompt": "Wat heb jij nodig om je veilig te voelen als jullie relatie en familie spanning geven?",
      "helper_text": "Kies het meest essentiële.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Weten dat mijn partner op het moment zelf voor ons kiest", "tags": {"needs.safety": 2, "needs.connection": 2}},
        {"option_id": "B", "label": "Dat we het van tevoren bespreken zodat ik niet verrast word", "tags": {"needs.stability": 2, "skills.communication": 1}},
        {"option_id": "C", "label": "Dat familie mijn partner niet automatisch krijgt als wij het oneens zijn", "tags": {"needs.safety": 2, "needs.recognition": 1}},
        {"option_id": "D", "label": "Dat we samen naar buiten staan, ook als we binnenshuis nog overleggen", "tags": {"skills.teamwork": 2, "needs.stability": 1}}
      ]
    }
  ],
  "outputs": {
    "solo": {
      "mirror": "Gekozen worden boven familiedruk is geen vanzelfsprekendheid. Dat jij dit voelt, zegt iets over wat je nodig hebt.",
      "protection_reflection": "Als je bang bent om niet gekozen te worden, beschermt dat je voor de pijn van tweede plek zijn.",
      "need_reflection": "Jij wil weten dat jullie relatie de kern is — niet één van de factoren.",
      "chance": "Praat van tevoren over hoe jullie naar buiten treden bij familiekwesties.",
      "challenge": "Vertrouw erop dat gekozen worden niet betekent dat familie buitengesloten wordt.",
      "experiment": "Spreek een signaal af: een woord of gebaar dat zegt 'ik sta bij jou' in lastige familiemomenten.",
      "gentle_phrase": "Familie is belangrijk — en wij zijn het middelpunt."
    },
    "couple": {
      "comparison_intro": "Familie en relatie zijn allebei echt — en soms vragen ze tegelijk om prioriteit.",
      "what_a_may_hear": "Jij koos op dat moment bewust voor jullie relatie — en dat was groter dan je misschien weet.",
      "what_b_may_hear": "Jij voelde die keuze — en het deed iets.",
      "what_each_protects": "De een beschermt de familiebanden. De ander beschermt de relatie.",
      "shared_chance": "Samen naar buiten staan geeft jullie relatie stevigheid.",
      "shared_challenge": "Bespreek van tevoren hoe je omgaat met familieverwachtingen.",
      "shared_experiment": "Spreek af: bij familiedruk overleggen we eerst privé, dan reageren we samen."
    }
  }
},

"D10_POSITIVE_002": {
  "questions": [
    {
      "question_id": "D10_POSITIVE_002_Q1",
      "step": "reaction",
      "prompt": "Jullie stelden een rustige grens tegenover familie — niet vanuit schuldgevoel, maar vanuit helderheid. Hoe voelde dat voor jou?",
      "helper_text": "Kies wat het meest klopt.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Bevrijdend — eindelijk zeiden we wat we al lang dachten", "tags": {"needs.freedom": 2, "skills.agency": 2}},
        {"option_id": "B", "label": "Spannend maar goed — ik was bang maar het lukte", "tags": {"needs.safety": 1, "skills.agency": 2}},
        {"option_id": "C", "label": "Volwassen — dit voelde als iets wat we al eerder hadden moeten doen", "tags": {"skills.agency": 2, "needs.stability": 1}},
        {"option_id": "D", "label": "Licht schuldig, maar toch goed — ik moet eraan wennen", "tags": {"patterns.pleasing": 1, "needs.freedom": 1}}
      ]
    },
    {
      "question_id": "D10_POSITIVE_002_Q2",
      "step": "need",
      "prompt": "Wat maakt het voor jou mogelijk om een grens te stellen tegenover familie zonder je er slecht over te voelen?",
      "helper_text": "Kies het meest herkenbare.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Weten dat mijn partner er ook achter staat", "tags": {"needs.safety": 2, "skills.teamwork": 2}},
        {"option_id": "B", "label": "Dat de grens vanuit liefde komt, niet vanuit afwijzing", "tags": {"needs.connection": 2, "needs.safety": 1}},
        {"option_id": "C", "label": "Dat ik het van tevoren helder heb in mijn hoofd", "tags": {"needs.stability": 2, "skills.regulation": 1}},
        {"option_id": "D", "label": "Dat familie uiteindelijk ook begrip toont — of dat ik dat los kan laten", "tags": {"needs.freedom": 2, "skills.self_compassion": 1}}
      ]
    }
  ],
  "outputs": {
    "solo": {
      "mirror": "Een grens stellen tegenover familie is een van de moeilijkste vormen van zelfrespect.",
      "protection_reflection": "Schuldgevoel bij grenzen is een oud beschermingspatroon: zolang je geen nee zegt, blijft de vrede.",
      "need_reflection": "Jij wil grenzen kunnen stellen vanuit keuze, niet vanuit angst — en dat vraagt oefening.",
      "chance": "Elke grens die lukt, maakt de volgende iets makkelijker.",
      "challenge": "Sta stil bij de schuldgevoelens zonder er meteen naar te handelen.",
      "experiment": "Schrijf op waarom deze grens goed was voor jou én de relatie. Lees het terug als de twijfel komt.",
      "gentle_phrase": "Een grens is een daad van liefde — ook als dat niet meteen zo voelt."
    },
    "couple": {
      "comparison_intro": "Jullie stonden samen tegenover een familieverwachting — en dat is geen kleine stap.",
      "what_a_may_hear": "Jij durfde een grens te stellen — en dat heeft iets veranderd.",
      "what_b_may_hear": "Jij stond ernaast — en dat maakte het mogelijk.",
      "what_each_protects": "Beiden beschermen jullie de relatie door te kiezen voor wat klopt.",
      "shared_chance": "Elke grens die jullie samen stellen, versterkt jullie als team.",
      "shared_challenge": "Benoem daarna hardop: dit was moeilijk, maar goed.",
      "shared_experiment": "Vertel elkaar wat de moeilijkste familieverwachting is om nee tegen te zeggen — nog voor er een situatie is."
    }
  }
},

"D10_POSITIVE_003": {
  "questions": [
    {
      "question_id": "D10_POSITIVE_003_Q1",
      "step": "emotion",
      "prompt": "Jullie waren bang voor reactie, maar familie begrijpt of respecteert jullie keuze. Wat voel jij dan?",
      "helper_text": "Kies de emotie die het meest klopt.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Verlichting — ik had me er langer zorgen over gemaakt dan nodig", "tags": {"needs.safety": 2, "patterns.hypervigilance": 1}},
        {"option_id": "B", "label": "Dankbaarheid — dit had ook anders kunnen gaan", "tags": {"needs.connection": 2, "needs.stability": 1}},
        {"option_id": "C", "label": "Ontroering — erkend worden door je eigen familie raakt diep", "tags": {"needs.recognition": 2, "needs.connection": 2}},
        {"option_id": "D", "label": "Voorzichtig blij — ik wacht af of het echt zo blijft", "tags": {"patterns.hypervigilance": 2, "needs.stability": 1}}
      ]
    },
    {
      "question_id": "D10_POSITIVE_003_Q2",
      "step": "need",
      "prompt": "Wat betekent het voor jou als familie jullie keuzes erkent en respecteert?",
      "helper_text": "Kies wat het meest resoneert.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Dat ik me niet hoef te verdedigen voor wie ik geworden ben", "tags": {"needs.recognition": 2, "needs.freedom": 2}},
        {"option_id": "B", "label": "Dat ik van mijn familie kan houden zonder me aan te passen", "tags": {"needs.connection": 2, "needs.freedom": 2}},
        {"option_id": "C", "label": "Dat het gezin dat ik opbouw serieus genomen wordt", "tags": {"needs.recognition": 2, "needs.stability": 1}},
        {"option_id": "D", "label": "Dat oud en nieuw naast elkaar kunnen bestaan", "tags": {"needs.stability": 2, "needs.connection": 1}}
      ]
    }
  ],
  "outputs": {
    "solo": {
      "mirror": "Erkend worden door je familie als volwassene met eigen keuzes is helend — ook als het niet altijd zo is.",
      "protection_reflection": "Voorzichtig blij zijn beschermt je voor teleurstelling als het anders wordt.",
      "need_reflection": "Jij wil van je familie houden én jezelf blijven — en dat hoeft geen tegenstelling te zijn.",
      "chance": "Dit moment laat zien dat grenzen én verbinding samen kunnen.",
      "challenge": "Laat dit moment echt landen — zonder het al te nuanceren of te relativeren.",
      "experiment": "Zeg het hardop: 'Dit deed me goed.' Aan je partner, of aan jezelf.",
      "gentle_phrase": "Erkend worden door wie je liefhebt is een van de mooiste cadeaus."
    },
    "couple": {
      "comparison_intro": "Familie gaf ruimte aan wie jullie zijn. Dat is niet vanzelfsprekend.",
      "what_a_may_hear": "Jij had spanning verwacht — en die bleef uit. Dat mag opluchting geven.",
      "what_b_may_hear": "Jij ook — en misschien voel jij het als bevestiging dat jullie het goed doen.",
      "what_each_protects": "Beiden beschermen jullie de band met familie én met elkaar.",
      "shared_chance": "Verbinding met familie en verbinding als stel versterken elkaar.",
      "shared_challenge": "Geniet van dit moment zonder het meteen te analyseren.",
      "shared_experiment": "Vertel elkaar wat dit moment betekende — wat het raakte of opluchtte."
    }
  }
},

"D10_POSITIVE_004": {
  "questions": [
    {
      "question_id": "D10_POSITIVE_004_Q1",
      "step": "reaction",
      "prompt": "Jullie hebben een eigen vorm gevonden voor feestdagen of tradities — die familie eert, maar ook bij jullie past. Hoe reageer jij op zo'n moment?",
      "helper_text": "Kies wat het meest klopt.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Trots — dit hebben we zelf gemaakt, niet overgenomen", "tags": {"skills.agency": 2, "needs.connection": 1}},
        {"option_id": "B", "label": "Ruimte — eindelijk hoeven we niet te kiezen tussen oud en nieuw", "tags": {"needs.freedom": 2, "needs.stability": 1}},
        {"option_id": "C", "label": "Verbinding — dit voelt als onze identiteit als gezin of stel", "tags": {"needs.connection": 2, "needs.stability": 2}},
        {"option_id": "D", "label": "Licht moeilijk — ik hoop dat familie het ook begrijpt", "tags": {"patterns.pleasing": 1, "needs.safety": 1}}
      ]
    },
    {
      "question_id": "D10_POSITIVE_004_Q2",
      "step": "need",
      "prompt": "Wat maakt een traditie voor jou echt van jullie — niet alleen een compromis?",
      "helper_text": "Kies het meest herkenbare.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Dat we er allebei oprecht achter staan", "tags": {"needs.connection": 2, "needs.recognition": 1}},
        {"option_id": "B", "label": "Dat het voortkomt uit wat wij waardevol vinden — niet uit plicht", "tags": {"needs.freedom": 2, "needs.stability": 1}},
        {"option_id": "C", "label": "Dat het iets wordt waar we allebei naar uitkijken", "tags": {"needs.connection": 2, "needs.stability": 1}},
        {"option_id": "D", "label": "Dat het past in wie we zijn, ook als de kinderen later terugkijken", "tags": {"needs.stability": 2, "skills.parenting": 1}}
      ]
    }
  ],
  "outputs": {
    "solo": {
      "mirror": "Nieuwe tradities maken is een teken van volwassen worden — als individu en als stel of gezin.",
      "protection_reflection": "Bezorgdheid over hoe familie reageert, laat zien hoeveel die band voor je betekent.",
      "need_reflection": "Jij wil een leven opbouwen dat van jullie is — met ruimte voor het verleden en het nieuwe.",
      "chance": "Jullie schrijven samen een nieuw hoofdstuk — dat is iets om te koesteren.",
      "challenge": "Laat de nieuwe traditie ook echt nieuw zijn — niet alleen een slimme combinatie van andermans gewoontes.",
      "experiment": "Benoem samen: wat is de kern van deze traditie? Wat maakt hem van ons?",
      "gentle_phrase": "Wij mogen onze eigen tradities uitvinden."
    },
    "couple": {
      "comparison_intro": "Jullie bouwen iets nieuws — op het fundament van wat was.",
      "what_a_may_hear": "Jij hecht aan het nieuwe — aan een identiteit die van jullie samen is.",
      "what_b_may_hear": "Jij hecht aan het oude — aan continuïteit en erbij horen.",
      "what_each_protects": "De een beschermt de vrijheid. De ander beschermt de verbinding.",
      "shared_chance": "Een eigen traditie is een cadeau aan jullie toekomst.",
      "shared_challenge": "Maak het bewust — bespreek wat jullie willen bewaren en wat jullie willen uitvinden.",
      "shared_experiment": "Maak samen een lijst: tradities die we houden, tradities die we loslaten, tradities die we zelf uitvinden."
    }
  }
},

# ── TENSION ───────────────────────────────────────────────────────────────

"D10_TENSION_001": {
  "questions": [
    {
      "question_id": "D10_TENSION_001_Q1",
      "step": "emotion",
      "prompt": "Er is spanning met familie. Je partner verdedigt zijn/haar ouders, broer of traditie. Jij voelt: waar ben ik in dit verhaal? Wat voel jij dan het sterkst?",
      "helper_text": "Kies de emotie die het meest klopt.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Pijn — ik dacht dat ik zijn/haar prioriteit was", "tags": {"sensitive_points.rejection": 2, "needs.connection": 2}},
        {"option_id": "B", "label": "Boosheid — ik voel me opzij gezet voor iemand anders", "tags": {"sensitive_points.not_respected": 2, "needs.recognition": 2}},
        {"option_id": "C", "label": "Eenzaamheid — ik sta hier alleen en hij/zij staat daar", "tags": {"sensitive_points.loneliness": 2, "needs.connection": 2}},
        {"option_id": "D", "label": "Onzekerheid — misschien overdrijf ik, maar het doet toch pijn", "tags": {"patterns.self_doubt": 2, "sensitive_points.rejection": 1}}
      ]
    },
    {
      "question_id": "D10_TENSION_001_Q2",
      "step": "interpretation",
      "prompt": "Als je partner familie verdedigt ten koste van jou — wat zegt jij jezelf dan?",
      "helper_text": "Kies de meest herkenbare gedachte.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "'Ik ben nooit echt zijn/haar prioriteit geweest'", "tags": {"sensitive_points.rejection": 2, "patterns.catastrophizing": 1}},
        {"option_id": "B", "label": "'Zijn/haar familie heeft altijd meer gewicht dan ik'", "tags": {"patterns.resentment": 2, "needs.recognition": 1}},
        {"option_id": "C", "label": "'Hij/zij is bang zijn/haar familie te verliezen — dat snap ik, maar het doet pijn'", "tags": {"skills.empathy": 2, "sensitive_points.rejection": 1}},
        {"option_id": "D", "label": "'Dit is een patroon dat we moeten aanpakken'", "tags": {"skills.insight": 2, "needs.stability": 1}}
      ]
    }
  ],
  "outputs": {
    "solo": {
      "mirror": "Tweede plek voelen tegenover familie raakt iets dieps: word ik echt gekozen?",
      "protection_reflection": "De gedachte 'ik ben nooit zijn prioriteit geweest' beschermt je voor het risico opnieuw te worden teleurgesteld.",
      "need_reflection": "Jij wil gekozen worden — niet als enige, maar als eerste.",
      "chance": "Dit gesprek is te voeren — maar niet in het moment van de spanning.",
      "challenge": "Onderscheid de pijn van nu van een patroon dat groter lijkt dan het misschien is.",
      "experiment": "Zeg het later: 'Ik voelde me opzij gezet in dat moment. Niet als aanval — als eerlijkheid.'",
      "gentle_phrase": "Gekozen worden mag ik van mijn partner vragen."
    },
    "couple": {
      "comparison_intro": "Familie en relatie botsten — en dat heeft een spoor achtergelaten.",
      "what_a_may_hear": "Jij voelde je opzij gezet — en dat is een echte pijn, ook als de bedoeling goed was.",
      "what_b_may_hear": "Jij probeerde te navigeren tussen twee loyaliteiten — en dat is ook een last.",
      "what_each_protects": "De een beschermt de relatie. De ander beschermt de familieband.",
      "shared_chance": "Jullie kunnen bespreken hoe jullie dit in het vervolg samen dragen.",
      "shared_challenge": "Geen van beiden hoeft het alleen op te lossen — het is een gedeeld vraagstuk.",
      "shared_experiment": "Maak een afspraak: hoe reageren we de volgende keer als familie en relatie spanning geven?"
    }
  }
},

"D10_TENSION_002": {
  "questions": [
    {
      "question_id": "D10_TENSION_002_Q1",
      "step": "reaction",
      "prompt": "Een familielid geeft commentaar op jullie opvoeding, eetgewoontes of keuzes. Hoe reageer jij typisch?",
      "helper_text": "Kies de meest herkenbare reactie.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Ik doe beleefd maar voel me vanbinnen koken", "tags": {"protections.compliance": 2, "patterns.resentment": 1}},
        {"option_id": "B", "label": "Ik verdedig meteen onze keuzes — soms harder dan nodig", "tags": {"protections.control": 2, "patterns.escalation": 1}},
        {"option_id": "C", "label": "Ik zeg niks en hoop dat mijn partner het oppakt", "tags": {"protections.withdrawal": 2, "patterns.passive_communication": 1}},
        {"option_id": "D", "label": "Ik twijfel even — misschien hebben ze wel een punt", "tags": {"patterns.self_doubt": 2, "sensitive_points.not_good_enough": 1}}
      ]
    },
    {
      "question_id": "D10_TENSION_002_Q2",
      "step": "interpretation",
      "prompt": "Als familie commentaar geeft op jullie opvoeding — wat raakt dat eigenlijk in jou?",
      "helper_text": "Kies wat het diepst klopt.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Mijn vertrouwen in mezelf als ouder — ben ik het wel goed aan het doen?", "tags": {"sensitive_points.not_good_enough": 2, "needs.recognition": 1}},
        {"option_id": "B", "label": "Het gevoel dat onze autonomie als gezin niet gerespecteerd wordt", "tags": {"needs.freedom": 2, "needs.recognition": 2}},
        {"option_id": "C", "label": "Oud verdriet — ook vroeger voelde ik me al beoordeeld door familie", "tags": {"sensitive_points.old_wound": 2, "patterns.hypervigilance": 1}},
        {"option_id": "D", "label": "De spanning tussen respecteren en zelf bepalen", "tags": {"needs.freedom": 2, "needs.stability": 1}}
      ]
    }
  ],
  "outputs": {
    "solo": {
      "mirror": "Commentaar op opvoeding voelt als commentaar op wie jij bent als ouder — dat is persoonlijk.",
      "protection_reflection": "Beleefd blijven maar vanbinnen koken beschermt de familievrede — maar de spanning bouwt zich op.",
      "need_reflection": "Jij wil als ouder serieus genomen worden — ook door familie.",
      "chance": "Een rustig antwoord dat jullie autonomie bevestigt hoeft geen conflict te worden.",
      "challenge": "Reageer één keer kalm maar duidelijk: 'Wij doen dit bewust zo.'",
      "experiment": "Bespreek met je partner hoe jullie samen reageren op familiebemoeienis — voor de volgende keer.",
      "gentle_phrase": "Wij mogen onze eigen ouders zijn — ook in het bijzijn van familie."
    },
    "couple": {
      "comparison_intro": "Familiebemoeienis met jullie opvoeding raakt jullie allebei — maar misschien anders.",
      "what_a_may_hear": "Jij voelt je beoordeeld — en dat maakt je defensief of stil.",
      "what_b_may_hear": "Jij navigeert ook — tussen loyaliteit aan familie en bescherming van jullie gezin.",
      "what_each_protects": "De een beschermt jullie autonomie. De ander beschermt de familievrede.",
      "shared_chance": "Één kalme gezamenlijke reactie is sterker dan twee losse reacties.",
      "shared_challenge": "Bepaal samen: hoe reageren wij als dit soort commentaar komt?",
      "shared_experiment": "Oefen een zin die jullie allebei kunnen zeggen: duidelijk, vriendelijk, eenmalig."
    }
  }
},

"D10_TENSION_003": {
  "questions": [
    {
      "question_id": "D10_TENSION_003_Q1",
      "step": "reaction",
      "prompt": "Feestdagen zijn in aantocht. Elke familie heeft verwachtingen. Hoe reageer jij als de agenda een spiegel van loyaliteit wordt?",
      "helper_text": "Kies de meest herkenbare reactie.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Ik voel me al vermoeid voor het begint — dit kost zoveel energie", "tags": {"needs.safety": 1, "patterns.resignation": 2}},
        {"option_id": "B", "label": "Ik ga onderhandelen — maar het voelt nooit eerlijk voor iedereen", "tags": {"patterns.pleasing": 2, "needs.stability": 1}},
        {"option_id": "C", "label": "Ik stel het uit want het gesprek loopt altijd vast", "tags": {"patterns.avoidance": 2, "needs.safety": 1}},
        {"option_id": "D", "label": "Ik voel schuld als ik kies — wat ik ook kies", "tags": {"sensitive_points.guilt": 2, "patterns.pleasing": 2}}
      ]
    },
    {
      "question_id": "D10_TENSION_003_Q2",
      "step": "interpretation",
      "prompt": "Als jij kiest voor de ene familie, wat vertelt de schuldgevoelens jou over de andere?",
      "helper_text": "Kies de meest herkenbare gedachte.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "'Zij voelen zich minder belangrijk — en dat wil ik hun niet aandoen'", "tags": {"patterns.pleasing": 2, "needs.connection": 1}},
        {"option_id": "B", "label": "'Ik ben iemand die mensen teleurstelt — dat klopt niet bij wie ik wil zijn'", "tags": {"sensitive_points.not_good_enough": 2, "patterns.self_blame": 1}},
        {"option_id": "C", "label": "'Ze zullen het me kwalijk nemen — ook al zeggen ze dat niet'", "tags": {"patterns.hypervigilance": 2, "needs.safety": 1}},
        {"option_id": "D", "label": "'Ik kan niet winnen — hoe ik het ook doe'", "tags": {"patterns.resignation": 2, "needs.stability": 1}}
      ]
    }
  ],
  "outputs": {
    "solo": {
      "mirror": "Schuld bij feestdagenkeuzes is bijna universeel — het gaat over loyaliteit, niet over fout of goed.",
      "protection_reflection": "Schuldgevoel wat je ook kiest beschermt je op een rare manier: als je je schuldig voelt, doe je tenminste 'je best'.",
      "need_reflection": "Jij wil niemand teleurstellen — en tegelijk wil je ook een eigen leven leiden.",
      "chance": "De keuze zelf is zelden het probleem. Het gesprek erover al maken het lichter.",
      "challenge": "Accepteer dat kiezen altijd iemand teleurstelt — en dat jij dat kunt dragen.",
      "experiment": "Maak dit jaar een plan van tevoren en deel het vroeg — zodat verwachtingen bijgesteld kunnen worden.",
      "gentle_phrase": "Ik mag kiezen — en liefde overleeft een eerlijke keuze."
    },
    "couple": {
      "comparison_intro": "Feestdagen zijn niet alleen logistiek — ze zijn een weerspiegeling van loyaliteit.",
      "what_a_may_hear": "Jij voelt schuld wat je ook kiest — en dat is een zware last om te dragen.",
      "what_b_may_hear": "Jij ook — en misschien met andere families en andere druk.",
      "what_each_protects": "Beiden beschermen jullie familierelaties — ook als dat ten koste gaat van jezelf.",
      "shared_chance": "Een plan dat jullie samen maken staat sterker dan een keuze die één van jullie alleen draagt.",
      "shared_challenge": "Bespreek de feestdagenplanning tijdig — en beslis samen wat jullie willen.",
      "shared_experiment": "Schrijf samen een agenda die van jullie is. Deel die dan met de families — als mededeling, niet als vraag."
    }
  }
},

"D10_TENSION_004": {
  "questions": [
    {
      "question_id": "D10_TENSION_004_Q1",
      "step": "reaction",
      "prompt": "Een familielid vraagt om financiële hulp. Jullie denken er anders over. Hoe reageer jij als dat verschil duidelijk wordt?",
      "helper_text": "Kies de meest herkenbare reactie.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Ik voel druk — mijn partner verwacht dat ik meewerk", "tags": {"patterns.pleasing": 2, "needs.freedom": 1}},
        {"option_id": "B", "label": "Ik zie risico en vind het moeilijk dat dat niet gehoord wordt", "tags": {"needs.recognition": 2, "needs.safety": 1}},
        {"option_id": "C", "label": "Ik trek me terug — dit is zijn/haar familie, niet de mijne", "tags": {"protections.withdrawal": 2, "protections.distancing": 1}},
        {"option_id": "D", "label": "Ik voel spanning: loyaliteit tegenover gezond verstand", "tags": {"needs.stability": 2, "sensitive_points.loyalty_conflict": 2}}
      ]
    },
    {
      "question_id": "D10_TENSION_004_Q2",
      "step": "interpretation",
      "prompt": "Als jullie het oneens zijn over geld en familie — wat zegt dat voor jou over jullie als team?",
      "helper_text": "Kies de meest herkenbare gedachte.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "'We hebben nooit echt gesproken over grenzen rond geld en familie'", "tags": {"needs.stability": 2, "skills.communication": 1}},
        {"option_id": "B", "label": "'Zijn/haar familie heeft prioriteit boven onze financiële rust'", "tags": {"patterns.resentment": 2, "needs.safety": 1}},
        {"option_id": "C", "label": "'Ik zie hoe moeilijk dit is — en begrijp het, maar maak me zorgen'", "tags": {"skills.empathy": 2, "needs.safety": 1}},
        {"option_id": "D", "label": "'Dit gaat niet alleen over geld — dit gaat over wie er voor wie kiest'", "tags": {"skills.insight": 2, "needs.connection": 1}}
      ]
    }
  ],
  "outputs": {
    "solo": {
      "mirror": "Geld lenen aan familie raakt meer dan financiën — het raakt loyaliteit, grenzen en vertrouwen.",
      "protection_reflection": "Je zorgen over risico beschermen jullie financiële veiligheid — dat is een legitieme behoefte.",
      "need_reflection": "Jij wil dat jullie beslissingen als team worden genomen — ook als het familie betreft.",
      "chance": "Dit is een gesprek over waarden, niet alleen over cijfers.",
      "challenge": "Spreek het uit: wat is jouw grens, en waarom?",
      "experiment": "Maak samen een financieel beleid over familie: wat doen we wel, wat doen we niet?",
      "gentle_phrase": "Grenzen rond geld zijn ook grenzen die de relatie beschermen."
    },
    "couple": {
      "comparison_intro": "Geld en familie — twee thema's die allebei loyaliteit raken.",
      "what_a_may_hear": "Jij wil helpen — dat is liefde voor je familie.",
      "what_b_may_hear": "Jij wil beschermen — dat is liefde voor de relatie.",
      "what_each_protects": "De een beschermt de familieband. De ander beschermt de financiële veiligheid.",
      "shared_chance": "Een gezamenlijk beleid geeft houvast bij toekomstige verzoeken.",
      "shared_challenge": "Maak de beslissing samen — niet achteraf.",
      "shared_experiment": "Bespreek: tot welk bedrag helpen we familie? Onder welke voorwaarden? Schrijf het op."
    }
  }
},

# ── DEEP ──────────────────────────────────────────────────────────────────

"D10_DEEP_001": {
  "questions": [
    {
      "question_id": "D10_DEEP_001_Q1",
      "step": "sensitive_point",
      "prompt": "Loskomen van ouders voelt soms als verraad — ook al weet je dat het groei is. Welk woord raakt jou het diepst?",
      "helper_text": "Kies het meest kwetsbare.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Schuld — ik stel ze teleur als ik mijn eigen weg ga", "tags": {"sensitive_points.guilt": 2, "patterns.pleasing": 2}},
        {"option_id": "B", "label": "Angst — stel dat ik ze verlies als ik grenzen stel", "tags": {"sensitive_points.abandonment": 2, "needs.safety": 2}},
        {"option_id": "C", "label": "Verdriet — ik wil dichtbij zijn én mezelf zijn, maar dat botst soms", "tags": {"sensitive_points.grief": 2, "needs.freedom": 2}},
        {"option_id": "D", "label": "Trots — ik doe het anders dan ze me leerden, en dat is goed", "tags": {"skills.agency": 2, "needs.freedom": 2}}
      ]
    },
    {
      "question_id": "D10_DEEP_001_Q2",
      "step": "emotion",
      "prompt": "Als je je eigen weg gaat en dat botst met wat je ouders verwachten — wat heb jij dan nodig?",
      "helper_text": "Kies wat het meest resoneert.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Dat mijn partner begrijpt hoeveel dit kost", "tags": {"needs.recognition": 2, "needs.connection": 2}},
        {"option_id": "B", "label": "Toestemming van mezelf — dat het oké is om volwassen te worden", "tags": {"needs.freedom": 2, "skills.self_compassion": 2}},
        {"option_id": "C", "label": "Dat mijn ouders uiteindelijk begrijpen dat ik van ze houd óók als ik anders kies", "tags": {"needs.connection": 2, "needs.recognition": 2}},
        {"option_id": "D", "label": "Rust met het idee dat ik niet voor iedereen kan zorgen", "tags": {"needs.freedom": 2, "needs.safety": 1}}
      ]
    }
  ],
  "outputs": {
    "solo": {
      "mirror": "Loskomen is geen afwijzing — het is het voltooien van wat ouderschap begon.",
      "protection_reflection": "Schuldgevoel bij grenzen beschermt de band met ouders — maar het houdt ook je eigen groei soms gevangen.",
      "need_reflection": "Jij wil van je ouders houden én jezelf zijn. Dat zijn geen tegenstelling — maar het vraagt werk.",
      "chance": "Volwassen worden tegenover ouders is een van de diepste groeimomenten.",
      "challenge": "Laat het schuldgevoel er zijn zonder het te gehoorzamen.",
      "experiment": "Schrijf een brief aan je ouders die je nooit hoeft te sturen: wat wil je zeggen?",
      "gentle_phrase": "Ik kan van je houden én mijn eigen leven leiden."
    },
    "couple": {
      "comparison_intro": "Loskomen van ouders is een persoonlijk proces — maar het raakt ook jullie relatie.",
      "what_a_may_hear": "Jij draagt iets zwaars: de spanning tussen liefde en vrijheid.",
      "what_b_may_hear": "Jij ziet dat — en misschien herken je het in je eigen familie ook.",
      "what_each_protects": "Beiden beschermen jullie iets: familiebanden, eigen groei, of de rust van de relatie.",
      "shared_chance": "Jullie kunnen elkaars getuige zijn in dit proces.",
      "shared_challenge": "Geef ruimte aan de ander om zijn/haar eigen tempo te vinden in dit loskomen.",
      "shared_experiment": "Vertel elkaar: wat heb je van je ouders meegekregen dat je wil houden — en wat mag je loslaten?"
    }
  }
},

"D10_DEEP_002": {
  "questions": [
    {
      "question_id": "D10_DEEP_002_Q1",
      "step": "sensitive_point",
      "prompt": "In conflicten herken je soms een oude familierol in jezelf — pleaser, redder, stille, bemiddelaar. Welke rol herkent jij het meest?",
      "helper_text": "Kies de meest herkenbare.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "De pleaser — ik suste en schiktte om de vrede te bewaren", "tags": {"patterns.pleasing": 2, "sensitive_points.not_good_enough": 1}},
        {"option_id": "B", "label": "De sterke — ik loste op en liet mijn eigen pijn niet zien", "tags": {"protections.strength_mask": 2, "needs.recognition": 1}},
        {"option_id": "C", "label": "De stille — ik verdween in mijn kamer of in mezelf", "tags": {"protections.withdrawal": 2, "patterns.avoidance": 1}},
        {"option_id": "D", "label": "De bemiddelaar — ik zorgde dat anderen het goed hadden met elkaar", "tags": {"patterns.caretaking": 2, "needs.connection": 1}}
      ]
    },
    {
      "question_id": "D10_DEEP_002_Q2",
      "step": "emotion",
      "prompt": "Als je die oude familierol terugziet in jezelf — wat voel je dan?",
      "helper_text": "Kies wat het meest resoneert.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Erkenning — ik snap nu waarom ik zo reageer", "tags": {"skills.insight": 2, "needs.recognition": 1}},
        {"option_id": "B", "label": "Moeheid — ik doe dit al zo lang en wil het anders", "tags": {"needs.freedom": 2, "patterns.resignation": 1}},
        {"option_id": "C", "label": "Schrik — ben ik eigenlijk nooit veranderd?", "tags": {"sensitive_points.shame": 2, "patterns.self_doubt": 1}},
        {"option_id": "D", "label": "Compassie voor mezelf — dat kind had geen andere keuze", "tags": {"skills.self_compassion": 2, "skills.insight": 1}}
      ]
    }
  ],
  "outputs": {
    "solo": {
      "mirror": "De rollen die je in je gezin van herkomst speelde, zijn niet voor niets gekozen — ze werkten toen.",
      "protection_reflection": "Die rol beschermde iets: de vrede, de ander, jezelf. Dat was slim — maar je hoeft hem niet levenslang te spelen.",
      "need_reflection": "Jij wil reageren vanuit wie je nu bent, niet vanuit wie je moest zijn.",
      "chance": "Bewustzijn is de eerste stap: de rol zien is al niet meer er volledig in zitten.",
      "challenge": "Merk één moment op deze week waarop je die oude rol in werking ziet. Pauzeer.",
      "experiment": "Vraag jezelf: als ik niet mijn oude familierol speelde, wat zou ik dan doen?",
      "gentle_phrase": "Ik ben ouder geworden — en ik mag anders reageren."
    },
    "couple": {
      "comparison_intro": "Jullie brengen allebei een familiesysteem mee — met eigen rollen, eigen reflexen.",
      "what_a_may_hear": "Jij herkent een patroon in jezelf dat van vroeger komt. Dat is moedige zelfkennis.",
      "what_b_may_hear": "Jij ook — misschien met een andere rol, maar dezelfde dynamiek.",
      "what_each_protects": "Beiden beschermen jullie iets van vroeger dat in het nu meespeelt.",
      "shared_chance": "Als jullie elkaars patronen herkennen met mildheid, verandert de dynamiek.",
      "shared_challenge": "Benoem de rol als je hem herkent — zonder oordeel, als informatie.",
      "shared_experiment": "Vertel elkaar: welke rol speelde jij in je gezin van herkomst? Herken je hem nog in ons?"
    }
  }
}

} # end D10_CASES

# ── Update cases.json ──────────────────────────────────────────────────────

with open('cases.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

updated = 0
for c in data['cases']:
    dom = c.get('domain', {})
    did = dom.get('domain_id') if isinstance(dom, dict) else dom
    cid = c['case_id']
    if did == 'D10' and cid in D10_CASES:
        c['questions'] = D10_CASES[cid]['questions']
        c['outputs']   = D10_CASES[cid]['outputs']
        print('Updated:', cid)
        updated += 1

with open('cases.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f'\nDone! Updated {updated} D10 cases.')
