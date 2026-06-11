import json, sys
sys.stdout.reconfigure(encoding='utf-8')

D11_CASES = {

# ── POSITIVE ──────────────────────────────────────────────────────────────

"D11_POSITIVE_001": {
  "questions": [
    {
      "question_id": "D11_POSITIVE_001_Q1",
      "step": "reaction",
      "prompt": "Jullie hebben samen een spaardoel bereikt — buffer, huis, vakantie, schuld afgelost. Wat voel je als het lukt?",
      "helper_text": "Kies wat het meest klopt.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Trots — we hebben het samen gedaan, niet toevallig", "tags": {"skills.teamwork": 2, "needs.stability": 2}},
        {"option_id": "B", "label": "Opluchting — de druk die ik al een tijdje voelde is weg", "tags": {"needs.safety": 2, "needs.stability": 2}},
        {"option_id": "C", "label": "Verbinding — dit is bewijs dat we samen kunnen bouwen", "tags": {"needs.connection": 2, "skills.teamwork": 2}},
        {"option_id": "D", "label": "Voorzichtige blijdschap — ik geloof het pas echt als het stabiel blijft", "tags": {"patterns.hypervigilance": 2, "needs.stability": 1}}
      ]
    },
    {
      "question_id": "D11_POSITIVE_001_Q2",
      "step": "need",
      "prompt": "Wat geeft jou het meeste rust als jullie samen financiële doelen bereiken?",
      "helper_text": "Kies het meest essentiële.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Dat we het samen besloten hebben — niet dat één iemand het doorgedrukt heeft", "tags": {"needs.recognition": 2, "skills.teamwork": 1}},
        {"option_id": "B", "label": "De zekerheid die het geeft — we staan er samen voor", "tags": {"needs.safety": 2, "needs.stability": 2}},
        {"option_id": "C", "label": "Dat we allebei iets hebben ingeleverd — het voelt eerlijk", "tags": {"needs.fairness": 2, "needs.stability": 1}},
        {"option_id": "D", "label": "Dat we nu samen kunnen genieten van wat we opgebouwd hebben", "tags": {"needs.connection": 2, "needs.freedom": 1}}
      ]
    }
  ],
  "outputs": {
    "solo": {
      "mirror": "Een gedeeld financieel doel bereiken is meer dan geld — het is bewijs van gedeelde richting.",
      "protection_reflection": "Voorzichtige blijdschap beschermt je voor teleurstelling als het toch anders gaat. Maar dit moment mag ook gewoon goed zijn.",
      "need_reflection": "Jij wil niet alleen financiële zekerheid — jij wil weten dat jullie samen ergens naartoe bouwen.",
      "chance": "Dit is het moment om het te vieren — klein of groot.",
      "challenge": "Laat de volgende zorg even wachten. Dit verdient zijn eigen moment.",
      "experiment": "Benoem samen wat dit doel jullie gekost heeft én gegeven heeft. Niet alleen de euro's.",
      "gentle_phrase": "Wij kunnen samen bouwen — dat is bewezen."
    },
    "couple": {
      "comparison_intro": "Jullie hebben samen een doel gehaald. Dat is niet vanzelfsprekend.",
      "what_a_may_hear": "Jij voelde de druk het meest — en nu mag je de opluchting ook het meest voelen.",
      "what_b_may_hear": "Jij zag het als een gezamenlijk project — en dat klopte.",
      "what_each_protects": "De een beschermt veiligheid door te sparen. De ander beschermt verbinding door te vieren.",
      "shared_chance": "Dit moment laat zien dat jullie als financieel team werken.",
      "shared_challenge": "Vier het bewust — en benoem daarna het volgende doel.",
      "shared_experiment": "Maak een lijst van drie dingen die jullie nu kunnen/willen, nu dit doel bereikt is."
    }
  }
},

"D11_POSITIVE_002": {
  "questions": [
    {
      "question_id": "D11_POSITIVE_002_Q1",
      "step": "emotion",
      "prompt": "Iemand deelt eerlijk een schuld, financiële fout of zorgen. Er komt geen beschaming — alleen een gesprek. Wat voel jij als dat lukt?",
      "helper_text": "Kies de emotie die het meest klopt.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Opluchting — dit gesprek had ik al lang willen voeren", "tags": {"needs.safety": 2, "skills.vulnerability": 2}},
        {"option_id": "B", "label": "Verbinding — dit soort eerlijkheid maakt ons dichter bij elkaar", "tags": {"needs.connection": 2, "skills.vulnerability": 2}},
        {"option_id": "C", "label": "Dankbaarheid — dat de ander het durft te delen", "tags": {"needs.connection": 2, "needs.recognition": 1}},
        {"option_id": "D", "label": "Voorzichtig — ik wil niet oordelen maar weet ook nog niet hoe ik me voel", "tags": {"needs.safety": 1, "skills.regulation": 1}}
      ]
    },
    {
      "question_id": "D11_POSITIVE_002_Q2",
      "step": "need",
      "prompt": "Om eerlijk te kunnen zijn over geld — wat heb jij nodig van de ander?",
      "helper_text": "Kies het meest essentiële.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Dat hij/zij niet schrikt of meteen oplossingen aandraagt", "tags": {"needs.safety": 2, "needs.recognition": 1}},
        {"option_id": "B", "label": "Dat het gesprek veilig blijft — geen verwijten later", "tags": {"needs.safety": 2, "needs.stability": 1}},
        {"option_id": "C", "label": "Dat mijn eerlijkheid niet tegen me gebruikt wordt", "tags": {"needs.safety": 2, "needs.recognition": 2}},
        {"option_id": "D", "label": "Dat we samen kijken hoe het op te lossen — niet wie de schuld heeft", "tags": {"skills.teamwork": 2, "needs.safety": 1}}
      ]
    }
  ],
  "outputs": {
    "solo": {
      "mirror": "Eerlijk zijn over geld is een van de kwetsbaarste dingen in een relatie. Jij deed dat — of ontvong het.",
      "protection_reflection": "Voorzichtig reageren op andermans eerlijkheid beschermt de ander voor overhaast oordeel. Dat is zorg.",
      "need_reflection": "Jij wil dat eerlijkheid veilig is — dat openheid niet bestraft wordt.",
      "chance": "Een relatie waarin geldproblemen besproken kunnen worden, is een sterk fundament.",
      "challenge": "Luister eerst — los daarna op.",
      "experiment": "Spreek af: geld is een onderwerp dat we bespreken zonder schaamte. Één keer per maand check-in.",
      "gentle_phrase": "Eerlijkheid over geld is een daad van vertrouwen."
    },
    "couple": {
      "comparison_intro": "Eerlijkheid over geld opent iets — en dat verdient zorg.",
      "what_a_may_hear": "Jij durfde te delen wat moeilijk was. Dat was moedig.",
      "what_b_may_hear": "Jij ontving het zonder te beschamen. Dat was veilig geven.",
      "what_each_protects": "De een beschermt zich door eerlijk te zijn. De ander beschermt de ander door ruimte te geven.",
      "shared_chance": "Openheid over geld maakt de relatie dieper en het financiële leven makkelijker.",
      "shared_challenge": "Houd de ruimte open — ook na dit gesprek.",
      "shared_experiment": "Plan een maandelijkse geld-check-in: geen stress, alleen overzicht en eerlijkheid."
    }
  }
},

"D11_POSITIVE_003": {
  "questions": [
    {
      "question_id": "D11_POSITIVE_003_Q1",
      "step": "reaction",
      "prompt": "Jullie kiezen samen om iets te geven of iemand te helpen — niet uit druk, maar uit waarden. Hoe voelt dat voor jou?",
      "helper_text": "Kies wat het meest klopt.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Goed — geld wordt dan meer dan bezit", "tags": {"needs.connection": 2, "skills.values_alignment": 2}},
        {"option_id": "B", "label": "Verbindend — we doen iets wat bij ons beiden past", "tags": {"needs.connection": 2, "skills.teamwork": 2}},
        {"option_id": "C", "label": "Licht spannend — ik wil ook zeker zijn dat we het kunnen missen", "tags": {"needs.safety": 2, "needs.stability": 1}},
        {"option_id": "D", "label": "Trots — dit is wie wij willen zijn", "tags": {"skills.values_alignment": 2, "needs.recognition": 1}}
      ]
    },
    {
      "question_id": "D11_POSITIVE_003_Q2",
      "step": "need",
      "prompt": "Wat maakt vrijgevigheid voor jou meer dan geld weggeven?",
      "helper_text": "Kies wat het meest resoneert.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Dat het uit eigen keuze komt — niet uit verplichting of druk", "tags": {"needs.freedom": 2, "skills.agency": 1}},
        {"option_id": "B", "label": "Dat we het samen beslissen — het voelt dan ook echt van ons", "tags": {"skills.teamwork": 2, "needs.connection": 1}},
        {"option_id": "C", "label": "Dat het een uitdrukking is van wat wij waardevol vinden", "tags": {"skills.values_alignment": 2, "needs.recognition": 1}},
        {"option_id": "D", "label": "Dat het iets doet — aan de wereld, of aan de ander", "tags": {"needs.connection": 2, "skills.values_alignment": 1}}
      ]
    }
  ],
  "outputs": {
    "solo": {
      "mirror": "Samen geven is een van de sterkste uitingen van gedeelde waarden.",
      "protection_reflection": "Even checken of je het kunt missen is geen kleinzieligheid — het is verantwoordelijkheid.",
      "need_reflection": "Jij wil geld als middel gebruiken, niet als doel — als uitdrukking van wie jullie zijn.",
      "chance": "Vrijgevigheid als stel versterkt de onderlinge verbinding én jullie identiteit.",
      "challenge": "Bespreek van tevoren wat je wel en niet geeft — zodat het echt een keuze is.",
      "experiment": "Kies samen één keer per jaar een bedrag of actie die jullie waarden uitdrukt.",
      "gentle_phrase": "Geven vanuit overvloed — ook als dat overvloed bescheiden is."
    },
    "couple": {
      "comparison_intro": "Jullie gaven samen — en dat zegt iets over wie jullie willen zijn.",
      "what_a_may_hear": "Jij wil dat geld betekenis heeft — meer dan veiligheid alleen.",
      "what_b_may_hear": "Jij ook — maar misschien met andere prioriteiten of grenzen.",
      "what_each_protects": "De een beschermt de waarden. De ander beschermt de stabiliteit.",
      "shared_chance": "Vrijgevigheid als gewoonte verbindt en geeft richting.",
      "shared_challenge": "Maak het een bewust gesprek: hoeveel geven we, waaraan, en waarom?",
      "shared_experiment": "Kies samen een goed doel of actie dit jaar — klein of groot."
    }
  }
},

"D11_POSITIVE_004": {
  "questions": [
    {
      "question_id": "D11_POSITIVE_004_Q1",
      "step": "reaction",
      "prompt": "Jullie maken een budget dat zowel overzicht als ademruimte biedt — sparen én genieten. Hoe reageer jij op zo'n plan?",
      "helper_text": "Kies wat het meest klopt.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Opgelucht — eindelijk geen schuld meer als ik iets uitgeef", "tags": {"needs.freedom": 2, "needs.safety": 1}},
        {"option_id": "B", "label": "Veilig — ik weet wat er is en wat er mag worden besteed", "tags": {"needs.stability": 2, "needs.safety": 2}},
        {"option_id": "C", "label": "Trots — we hebben iets gemaakt dat voor ons beiden werkt", "tags": {"skills.teamwork": 2, "needs.connection": 1}},
        {"option_id": "D", "label": "Sceptisch — in de praktijk zal het toch weer wrijving geven", "tags": {"patterns.hypervigilance": 2, "needs.stability": 1}}
      ]
    },
    {
      "question_id": "D11_POSITIVE_004_Q2",
      "step": "need",
      "prompt": "Wat heeft jij nodig in een financieel plan om je er echt vrij in te voelen?",
      "helper_text": "Kies het meest essentiële.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Eigen geld dat ik mag besteden zonder verantwoording", "tags": {"needs.freedom": 2, "needs.autonomy": 2}},
        {"option_id": "B", "label": "Duidelijkheid — weten wat er is, zodat ik niet constant moet raden", "tags": {"needs.stability": 2, "needs.safety": 1}},
        {"option_id": "C", "label": "Dat we het samen bewaken — niet dat één iemand de bewaker is", "tags": {"needs.fairness": 2, "skills.teamwork": 1}},
        {"option_id": "D", "label": "Ruimte voor het onverwachte — een plan dat niet breekt als er iets misgaat", "tags": {"needs.stability": 2, "needs.safety": 2}}
      ]
    }
  ],
  "outputs": {
    "solo": {
      "mirror": "Een budget dat voelt als gedeelde taal in plaats van kooi — dat is een prestatie.",
      "protection_reflection": "Scepsis over het plan beschermt je voor teleurstelling. Maar soms is het plan beter dan je verwacht.",
      "need_reflection": "Jij wil financiële vrijheid én veiligheid — en die hoeven geen tegenstelling te zijn.",
      "chance": "Een plan dat voor allebei werkt is sterker dan een plan dat perfect is op papier.",
      "challenge": "Geef het plan een eerlijke kans voordat je het afschrijft.",
      "experiment": "Evalueer het plan na drie maanden — pas aan waar nodig, zonder het hele gesprek opnieuw te voeren.",
      "gentle_phrase": "Goed genoeg is beter dan perfect op papier."
    },
    "couple": {
      "comparison_intro": "Jullie hebben een plan gemaakt dat voor beiden werkt. Dat vraagt compromis — en respect.",
      "what_a_may_hear": "Jij wil structuur — weten waar je aan toe bent.",
      "what_b_may_hear": "Jij wil vrijheid — ruimte om te genieten zonder uitleg.",
      "what_each_protects": "De een beschermt veiligheid. De ander beschermt plezier.",
      "shared_chance": "Een plan dat allebei dient, is duurzamer dan een plan dat één iemand oplegt.",
      "shared_challenge": "Evalueer het plan samen — als het knelt, pas het dan aan.",
      "shared_experiment": "Geef elkaar één 'vrij te besteden' bedrag per maand — zonder vragen."
    }
  }
},

# ── TENSION ───────────────────────────────────────────────────────────────

"D11_TENSION_001": {
  "questions": [
    {
      "question_id": "D11_TENSION_001_Q1",
      "step": "emotion",
      "prompt": "Je ontdekt een uitgave waar je niets van wist. Misschien klein, misschien groot. Wat voel jij als eerste?",
      "helper_text": "Kies de emotie die het meest klopt.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Verraad — niet om het bedrag, maar omdat ik het niet wist", "tags": {"sensitive_points.betrayal": 2, "needs.safety": 2}},
        {"option_id": "B", "label": "Onzekerheid — wat weet ik nog meer niet?", "tags": {"patterns.hypervigilance": 2, "needs.safety": 2}},
        {"option_id": "C", "label": "Boosheid — dit voelt als een gebrek aan respect", "tags": {"sensitive_points.not_respected": 2, "needs.recognition": 1}},
        {"option_id": "D", "label": "Verdriet — ik dacht dat we open waren over geld", "tags": {"sensitive_points.betrayal": 1, "needs.connection": 2}}
      ]
    },
    {
      "question_id": "D11_TENSION_001_Q2",
      "step": "interpretation",
      "prompt": "Een verborgen uitgave — wat zegt dat voor jou over vertrouwen in de relatie?",
      "helper_text": "Kies de meest herkenbare gedachte.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "'Dit gaat niet over geld — dit gaat over eerlijkheid'", "tags": {"skills.insight": 2, "needs.safety": 1}},
        {"option_id": "B", "label": "'Hij/zij durfde het niet te zeggen — waarom niet?'", "tags": {"needs.connection": 2, "needs.safety": 1}},
        {"option_id": "C", "label": "'Misschien is er meer wat ik niet weet'", "tags": {"patterns.catastrophizing": 2, "patterns.hypervigilance": 1}},
        {"option_id": "D", "label": "'Dit moet ik bespreekbaar maken zonder het te vergroten'", "tags": {"skills.communication": 2, "skills.regulation": 1}}
      ]
    }
  ],
  "outputs": {
    "solo": {
      "mirror": "Een verborgen uitgave raakt meer dan het bedrag — het raakt het vertrouwen in openheid.",
      "protection_reflection": "De vraag 'wat weet ik nog meer niet?' beschermt je voor verdere verrassingen — maar het kan ook sneller groeien dan de situatie rechtvaardigt.",
      "need_reflection": "Jij wil financiële openheid als fundament van vertrouwen — dat is een legitieme behoefte.",
      "chance": "Dit gesprek kan leiden tot duidelijkere afspraken over wat jullie met elkaar delen.",
      "challenge": "Maak onderscheid: dit incident versus een patroon.",
      "experiment": "Vraag rustig: 'Waarom heb je het me niet verteld?' — en luister voor je concludeert.",
      "gentle_phrase": "Eerlijkheid over geld begint met veiligheid om het te zeggen."
    },
    "couple": {
      "comparison_intro": "Een verborgen uitgave opent een groter gesprek — over vertrouwen, niet alleen over geld.",
      "what_a_may_hear": "Jij voelde je verraden — en dat is een echte pijn.",
      "what_b_may_hear": "Jij verborg iets — misschien uit schaamte, angst of gewoonte. Dat vraagt uitleg.",
      "what_each_protects": "De een beschermt vertrouwen. De ander beschermde zichzelf — en vergat daarmee de ander.",
      "shared_chance": "Dit is een kans om nieuwe afspraken te maken over financiële openheid.",
      "shared_challenge": "Los het incident op zonder het te vergroten tot een oordeel over de persoon.",
      "shared_experiment": "Spreek af: elke aankoop boven [bedrag] bespreken we vooraf. Stel samen dat bedrag in."
    }
  }
},

"D11_TENSION_002": {
  "questions": [
    {
      "question_id": "D11_TENSION_002_Q1",
      "step": "reaction",
      "prompt": "Er is een voorstel om uit te geven — vakantie, uit eten, aankoop. De één denkt: kunnen we dit? De ander: moeten we dan nooit genieten? Hoe reageer jij typisch?",
      "helper_text": "Kies de meest herkenbare reactie.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Ik rem af — ik wil eerst weten of het verantwoord is", "tags": {"needs.safety": 2, "protections.control": 1}},
        {"option_id": "B", "label": "Ik ga mee maar voel me achteraf schuldig", "tags": {"patterns.pleasing": 2, "needs.safety": 1}},
        {"option_id": "C", "label": "Ik pleit voor genieten — leven is meer dan sparen", "tags": {"needs.freedom": 2, "needs.connection": 1}},
        {"option_id": "D", "label": "Ik voel de spanning maar zeg niks — het loopt toch vast", "tags": {"patterns.avoidance": 2, "needs.safety": 1}}
      ]
    },
    {
      "question_id": "D11_TENSION_002_Q2",
      "step": "interpretation",
      "prompt": "Onder de discussie over sparen vs. genieten — wat zijn jullie eigenlijk aan het verdedigen?",
      "helper_text": "Kies de interpretatie die het meest klopt.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Veiligheid versus plezier — twee echte behoeften die botsen", "tags": {"needs.safety": 2, "needs.freedom": 2}},
        {"option_id": "B", "label": "Controle versus vertrouwen — wie mag bepalen hoe we leven?", "tags": {"protections.control": 2, "needs.freedom": 2}},
        {"option_id": "C", "label": "Angst voor tekort versus angst om het leven te missen", "tags": {"needs.safety": 2, "sensitive_points.scarcity": 1}},
        {"option_id": "D", "label": "Twee verschillende achtergronden met geld die botsen", "tags": {"sensitive_points.old_wound": 2, "needs.stability": 1}}
      ]
    }
  ],
  "outputs": {
    "solo": {
      "mirror": "Sparen vs. genieten is zelden een meningsverschil — het is een botsing van behoeften.",
      "protection_reflection": "Afremmen beschermt je voor angst voor tekort. Loslaten beschermt je voor angst om het leven te missen. Allebei zijn ze echt.",
      "need_reflection": "Jij wil zekerheid én vrijheid — en die zijn te combineren als de taal klopt.",
      "chance": "Achter de discussie ligt de vraag: wat hebben we allebei nodig?",
      "challenge": "Benoem de behoefte onder je standpunt — niet het standpunt zelf.",
      "experiment": "Zeg: 'Ik wil dit omdat...' en luister naar hetzelfde van de ander.",
      "gentle_phrase": "We willen allebei iets goeds — alleen op een andere manier."
    },
    "couple": {
      "comparison_intro": "Dit gesprek gaat over meer dan geld — het gaat over wat jullie veilig en vrij laat voelen.",
      "what_a_may_hear": "Jij wil zekerheid — je bent bang voor tekort.",
      "what_b_may_hear": "Jij wil leven — je bent bang dat je het moment mist.",
      "what_each_protects": "De een beschermt de toekomst. De ander beschermt het nu.",
      "shared_chance": "Als jullie allebei de behoefte achter het standpunt benoemen, verdwijnt de strijd vaak.",
      "shared_challenge": "Maak ruimte voor allebei — een plan dat veiligheid én plezier bevat.",
      "shared_experiment": "Stel samen vast: hoeveel sparen we, en hoeveel is vrij te besteden voor plezier?"
    }
  }
},

"D11_TENSION_003": {
  "questions": [
    {
      "question_id": "D11_TENSION_003_Q1",
      "step": "emotion",
      "prompt": "Geld wordt macht in een gesprek — 'ik betaal dit toch?' of 'jij hebt makkelijk praten.' Wat voel jij als dat gebeurt?",
      "helper_text": "Kies de emotie die het meest klopt.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Vernederd — geld mag niet bepalen wie meer zegt in te brengen", "tags": {"sensitive_points.not_respected": 2, "needs.recognition": 2}},
        {"option_id": "B", "label": "Machteloos — ik heb minder te brengen en dat doet pijn", "tags": {"sensitive_points.not_good_enough": 2, "needs.recognition": 2}},
        {"option_id": "C", "label": "Defensief — ik ga mezelf verdedigen ook al wil ik dat niet", "tags": {"protections.control": 2, "patterns.escalation": 1}},
        {"option_id": "D", "label": "Bedroefd — geld hoort ons niet te verdelen", "tags": {"needs.connection": 2, "sensitive_points.not_respected": 1}}
      ]
    },
    {
      "question_id": "D11_TENSION_003_Q2",
      "step": "interpretation",
      "prompt": "Als geld een machtsmiddel wordt in jullie relatie — wat zegt dat over de onderliggende spanning?",
      "helper_text": "Kies de meest herkenbare gedachte.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "'Er is een ongelijkheid die we nooit echt besproken hebben'", "tags": {"needs.fairness": 2, "skills.communication": 1}},
        {"option_id": "B", "label": "'Degene die meer verdient, voelt ook meer druk — en dat loopt zo over'", "tags": {"skills.empathy": 2, "needs.recognition": 1}},
        {"option_id": "C", "label": "'Geld is voor hem/haar een manier om controle te voelen'", "tags": {"protections.control": 2, "needs.safety": 1}},
        {"option_id": "D", "label": "'Wij hebben nooit afgesproken hoe we omgaan met het verschil in inkomens'", "tags": {"needs.stability": 2, "skills.communication": 1}}
      ]
    }
  ],
  "outputs": {
    "solo": {
      "mirror": "Als geld macht wordt, is het gesprek niet meer over geld. Het gaat over wie telt.",
      "protection_reflection": "Jezelf verdedigen beschermt je eigenwaarde — maar de verdediging maakt het gesprek moeilijker.",
      "need_reflection": "Jij wil gelijkwaardig zijn in de relatie — ongeacht wie meer verdient.",
      "chance": "Een gesprek over de machtsbalans in financiën is moeilijk maar noodzakelijk.",
      "challenge": "Benoem het direct als het gebeurt: 'Dit voelt alsof geld bepaalt wie gelijk heeft.'",
      "experiment": "Spreek samen af hoe jullie omgaan met inkomensverschil — als gelijkwaardige partners.",
      "gentle_phrase": "Wat ik verdien bepaalt niet wat ik waard ben."
    },
    "couple": {
      "comparison_intro": "Geld als machtsmiddel ondermijnt gelijkwaardigheid — en dat raakt de kern van de relatie.",
      "what_a_may_hear": "Jij voelt de pijn van minder bijdragen — dat raakt je eigenwaarde.",
      "what_b_may_hear": "Jij draagt meer financieel — en misschien voelt dat zwaarder dan je laat zien.",
      "what_each_protects": "De een beschermt zijn/haar waarde. De ander beschermt zijn/haar controle.",
      "shared_chance": "Een eerlijk gesprek over de gelddynamiek kan de machtsbalans herstellen.",
      "shared_challenge": "Maak geld neutraal — een middel, geen maatstaf voor inbreng.",
      "shared_experiment": "Bespreek: hoe verdelen we verantwoordelijkheid als inkomen ongelijk is? Los van het bedrag."
    }
  }
},

"D11_TENSION_004": {
  "questions": [
    {
      "question_id": "D11_TENSION_004_Q1",
      "step": "reaction",
      "prompt": "Familie vraagt om financiële hulp. Jullie staan er anders in. Hoe reageer jij als dat verschil zichtbaar wordt?",
      "helper_text": "Kies de meest herkenbare reactie.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Ik voel druk — mijn partner verwacht loyaliteit aan zijn/haar familie", "tags": {"patterns.pleasing": 2, "needs.freedom": 1}},
        {"option_id": "B", "label": "Ik maak me zorgen — en voel dat die zorgen niet gehoord worden", "tags": {"needs.recognition": 2, "needs.safety": 1}},
        {"option_id": "C", "label": "Ik trek me terug — het is zijn/haar familie, niet de mijne", "tags": {"protections.withdrawal": 2, "protections.distancing": 1}},
        {"option_id": "D", "label": "Ik zie de loyaliteit én het risico — en weet niet hoe ik die allebei eer", "tags": {"needs.stability": 2, "needs.connection": 1}}
      ]
    },
    {
      "question_id": "D11_TENSION_004_Q2",
      "step": "interpretation",
      "prompt": "Als jij geld geeft aan familie en de ander twijfelt — of andersom — wat raakt dat in jullie relatie?",
      "helper_text": "Kies de meest herkenbare gedachte.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "'Hij/zij stelt zijn/haar familie boven onze financiële veiligheid'", "tags": {"patterns.resentment": 2, "needs.safety": 1}},
        {"option_id": "B", "label": "'Ik kan mijn familie niet in de steek laten — en verwacht begrip daarvoor'", "tags": {"needs.connection": 2, "needs.recognition": 1}},
        {"option_id": "C", "label": "'We hebben nooit besproken waar onze grenzen liggen'", "tags": {"needs.stability": 2, "skills.communication": 1}},
        {"option_id": "D", "label": "'Dit is niet alleen over geld — dit is over wie we zijn voor de mensen om ons heen'", "tags": {"skills.insight": 2, "needs.connection": 1}}
      ]
    }
  ],
  "outputs": {
    "solo": {
      "mirror": "Geld aan familie raakt loyaliteit, grenzen en vertrouwen tegelijk — dat is zwaar.",
      "protection_reflection": "Je zorgen beschermen jullie financiële veiligheid. De loyaliteit beschermt een familieband. Beide zijn echt.",
      "need_reflection": "Jij wil dat financiële keuzes als team gemaakt worden — ook als het familie betreft.",
      "chance": "Een beleid over familie en geld voorkomt dat elke vraag een crisis wordt.",
      "challenge": "Bespreek het los van de concrete vraag — als principe.",
      "experiment": "Schrijf samen op: wat geven wij aan familie, onder welke voorwaarden en tot welk bedrag?",
      "gentle_phrase": "Grenzen aan familie geven is geen onliefde — het is zelfzorg."
    },
    "couple": {
      "comparison_intro": "Familie en geld raken beiden diep. Jullie voelen dat elk op eigen manier.",
      "what_a_may_hear": "Jij wil helpen — dat is liefde voor je familie.",
      "what_b_may_hear": "Jij wil beschermen — dat is liefde voor jullie relatie.",
      "what_each_protects": "De een beschermt familieband. De ander beschermt financiële veiligheid.",
      "shared_chance": "Een duidelijk beleid maakt toekomstige vragen makkelijker.",
      "shared_challenge": "Beslis samen — niet achteraf.",
      "shared_experiment": "Stel samen een familiefinancieel beleid op: wanneer ja, wanneer nee, hoeveel maximaal."
    }
  }
},

# ── DEEP ──────────────────────────────────────────────────────────────────

"D11_DEEP_001": {
  "questions": [
    {
      "question_id": "D11_DEEP_001_Q1",
      "step": "sensitive_point",
      "prompt": "Geld roept bij jou iets op in het lichaam — spanning, schaamte, controle, haast of angst. Welk woord raakt jou het diepst?",
      "helper_text": "Kies het meest herkenbare.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Angst — er is nooit genoeg, ook als er genoeg is", "tags": {"sensitive_points.scarcity": 2, "patterns.hypervigilance": 2}},
        {"option_id": "B", "label": "Schaamte — geld is nooit ver weg van wie ik ben of niet ben", "tags": {"sensitive_points.shame": 2, "sensitive_points.not_good_enough": 2}},
        {"option_id": "C", "label": "Controle — als ik het overzicht houd, kan het niet misgaan", "tags": {"protections.control": 2, "needs.safety": 2}},
        {"option_id": "D", "label": "Haast — ik moet het nu vastleggen voor het weg is", "tags": {"sensitive_points.scarcity": 2, "patterns.hypervigilance": 1}}
      ]
    },
    {
      "question_id": "D11_DEEP_001_Q2",
      "step": "emotion",
      "prompt": "Als je terugkijkt op hoe geld in jouw jeugd was — wat heeft dat meegenomen in hoe jij nu met geld omgaat?",
      "helper_text": "Kies wat het meest resoneert.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Tekort — er was soms te weinig, en dat zit nog in mijn lijf", "tags": {"sensitive_points.scarcity": 2, "sensitive_points.old_wound": 2}},
        {"option_id": "B", "label": "Spanning — geld gaf thuis ruzie of stress", "tags": {"sensitive_points.old_wound": 2, "patterns.hypervigilance": 1}},
        {"option_id": "C", "label": "Zwijgen — over geld werd niet gepraat, dus weet ik nu niet hoe", "tags": {"sensitive_points.old_wound": 1, "skills.communication": 1}},
        {"option_id": "D", "label": "Overvloed maar ook druk — geld was er, maar er zat altijd een verwachting bij", "tags": {"sensitive_points.old_wound": 1, "patterns.pleasing": 1}}
      ]
    }
  ],
  "outputs": {
    "solo": {
      "mirror": "Jouw relatie met geld is ouder dan je huidige rekening. Het begon lang voor jij zelf verdiende.",
      "protection_reflection": "Controle over geld beschermt je voor het gevoel van tekort dat je van vroeger kent. Dat is slim geworden — maar het hoeft niet alles te sturen.",
      "need_reflection": "Jij verdient rust met geld — niet alleen zekerheid, maar ook vrede.",
      "chance": "Begrijpen waar je geldpatroon vandaan komt, geeft je meer keuze in hoe je nu reageert.",
      "challenge": "Onderscheid: is dit angst van nu, of een oud alarm?",
      "experiment": "Schrijf: wat betekende geld thuis? Lees het terug en kijk wat je herkent in jezelf nu.",
      "gentle_phrase": "Het verleden heeft mij gevormd — maar het hoeft mij niet te besturen."
    },
    "couple": {
      "comparison_intro": "Jullie brengen allebei een geldgeschiedenis mee. Die twee verhalen botsen soms zonder dat je het weet.",
      "what_a_may_hear": "Jij reageert op geld vanuit iets dat ouder is dan jullie relatie.",
      "what_b_may_hear": "Jij ook — met eigen angsten, eigen patronen, eigen verleden.",
      "what_each_protects": "Beiden beschermen jullie iets van vroeger — in de vorm van gedrag nu.",
      "shared_chance": "Als jullie elkaars geldgeschiedenis kennen, begrijpen jullie reacties beter.",
      "shared_challenge": "Luister naar het verhaal achter het gedrag — niet alleen het gedrag zelf.",
      "shared_experiment": "Vertel elkaar: hoe was geld thuis? Wat heeft dat aan jou achtergelaten?"
    }
  }
},

"D11_DEEP_002": {
  "questions": [
    {
      "question_id": "D11_DEEP_002_Q1",
      "step": "sensitive_point",
      "prompt": "Minder verdienen, afhankelijk zijn of niet kunnen geven voelt soms als aantasting van je waarde. Welk gevoel raakt jou het diepst?",
      "helper_text": "Kies het meest kwetsbare.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Schaamte — ik zou meer moeten bijdragen", "tags": {"sensitive_points.shame": 2, "sensitive_points.not_good_enough": 2}},
        {"option_id": "B", "label": "Machteloosheid — ik kan niet geven wat ik zou willen", "tags": {"sensitive_points.not_good_enough": 2, "needs.recognition": 2}},
        {"option_id": "C", "label": "Angst — stel dat hij/zij me minder waardeert omdat ik minder verdien", "tags": {"sensitive_points.rejection": 2, "sensitive_points.not_good_enough": 1}},
        {"option_id": "D", "label": "Ongelijkheid — ik voel me schuldig dat het niet fifty-fifty is", "tags": {"sensitive_points.guilt": 2, "needs.fairness": 1}}
      ]
    },
    {
      "question_id": "D11_DEEP_002_Q2",
      "step": "emotion",
      "prompt": "Als geld raakt aan wie je bent — wat heb je dan nodig van je partner om je waarde niet te verliezen?",
      "helper_text": "Kies wat het meest resoneert.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Dat hij/zij mijn bijdrage ziet die niet in geld uit te drukken is", "tags": {"needs.recognition": 3, "needs.connection": 1}},
        {"option_id": "B", "label": "Dat geld nooit gebruikt wordt als argument over wie meer recht heeft van spreken", "tags": {"needs.fairness": 2, "needs.recognition": 2}},
        {"option_id": "C", "label": "Dat we gelijkwaardig zijn — ook als we niet gelijk bijdragen", "tags": {"needs.fairness": 2, "needs.recognition": 2}},
        {"option_id": "D", "label": "Dat mijn waarde voor hem/haar niet in mijn inkomen zit", "tags": {"needs.recognition": 3, "needs.safety": 1}}
      ]
    }
  ],
  "outputs": {
    "solo": {
      "mirror": "Je waarde is niet je inkomen — maar dat weten en dat voelen zijn twee verschillende dingen.",
      "protection_reflection": "Schaamte over wat je verdient beschermt je voor afwijzing. Maar het kost ook veel energie.",
      "need_reflection": "Jij wil gezien worden voor wie je bent — niet voor wat je op de rekening zet.",
      "chance": "Dit gesprek met je partner kan iets bevrijden dat al lang drukt.",
      "challenge": "Zeg het hardop: 'Mijn bijdrage aan ons leven is meer dan geld.'",
      "experiment": "Schrijf tien manieren op waarop jij bijdraagt aan jullie relatie of gezin die niets met geld te maken hebben.",
      "gentle_phrase": "Mijn waarde staat los van mijn inkomen."
    },
    "couple": {
      "comparison_intro": "Inkomensverschil raakt eigenwaarde — en dat vraagt een gesprek met zorg.",
      "what_a_may_hear": "Jij draagt een last die niet zichtbaar is: de twijfel aan je eigen waarde.",
      "what_b_may_hear": "Jij ziet misschien niet hoe zwaar dat weegt — of je ziet het wel maar weet niet hoe je het bespreekt.",
      "what_each_protects": "De een beschermt eigenwaarde. De ander beschermt de harmonie.",
      "shared_chance": "Gelijkwaardigheid gaat niet over gelijke bedragen — maar over gelijke waarde.",
      "shared_challenge": "Benoem expliciet hoe jullie allebei bijdragen — in geld én in alles wat geen geld is.",
      "shared_experiment": "Maak samen een lijst van alles wat jullie elk bijdragen aan de relatie. Vergelijk."
    }
  }
}

} # end D11_CASES

# ── Update cases.json ──────────────────────────────────────────────────────

with open('cases.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

updated = 0
for c in data['cases']:
    dom = c.get('domain', {})
    did = dom.get('domain_id') if isinstance(dom, dict) else dom
    cid = c['case_id']
    if did == 'D11' and cid in D11_CASES:
        c['questions'] = D11_CASES[cid]['questions']
        c['outputs']   = D11_CASES[cid]['outputs']
        print('Updated:', cid)
        updated += 1

with open('cases.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f'\nDone! Updated {updated} D11 cases.')
