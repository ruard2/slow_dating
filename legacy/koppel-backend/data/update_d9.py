import json, sys
sys.stdout.reconfigure(encoding='utf-8')

D9_CASES = {

# ── POSITIVE ──────────────────────────────────────────────────────────────

"D9_POSITIVE_001": {
  "questions": [
    {
      "question_id": "D9_POSITIVE_001_Q1",
      "step": "reaction",
      "prompt": "Jullie denken anders over een opvoedvraag — maar het lukt om er samen uit te komen. Wat helpt jou om dan open te blijven?",
      "helper_text": "Kies wat het meest bijdraagt.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Dat we allebei hetzelfde doel hebben: het beste voor het kind", "tags": {"skills.teamwork": 2, "needs.connection": 1}},
        {"option_id": "B", "label": "Dat de ander mijn mening serieus neemt, ook als die anders is", "tags": {"needs.recognition": 2, "needs.safety": 1}},
        {"option_id": "C", "label": "Dat we het gesprek later kunnen voeren, niet midden in het moment", "tags": {"skills.regulation": 2, "needs.safety": 1}},
        {"option_id": "D", "label": "Dat we eerder ook moeilijke afspraken werkend hebben gemaakt", "tags": {"needs.stability": 2, "skills.teamwork": 1}}
      ]
    },
    {
      "question_id": "D9_POSITIVE_001_Q2",
      "step": "need",
      "prompt": "Als jullie een gezamenlijk opvoedbesluit nemen — wat heb jij dan nodig om je er ook echt achter te kunnen zetten?",
      "helper_text": "Kies het meest essentiële.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Dat mijn perspectief gehoord is, ook al winnen we er niet altijd mee", "tags": {"needs.recognition": 2, "needs.connection": 1}},
        {"option_id": "B", "label": "Dat we het later ook echt evalueren als het niet werkt", "tags": {"needs.stability": 2, "skills.teamwork": 1}},
        {"option_id": "C", "label": "Dat de keuze voelt als van ons beiden, niet van één iemand", "tags": {"needs.connection": 2, "needs.recognition": 1}},
        {"option_id": "D", "label": "Dat we samen verantwoordelijk zijn voor het resultaat", "tags": {"skills.teamwork": 2, "needs.stability": 1}}
      ]
    }
  ],
  "outputs": {
    "solo": {
      "mirror": "Samen een opvoedbesluit nemen is een van de moeilijkste vormen van samenwerking. Jij doet dat.",
      "protection_reflection": "Als je moeite hebt om je achter een gezamenlijke keuze te scharen, beschermt dat deel van jou je waarden — en die zijn het waard om te benoemen.",
      "need_reflection": "Jij wil gehoord worden, niet alleen gevolgd. Erkenning van jouw bijdrage maakt het makkelijker om te geven.",
      "chance": "Teams die opvoedverschillen bespreken zonder elkaar te ondermijnen, geven kinderen het cadeau van consistentie.",
      "challenge": "Benoem na een besluit wat jij moeilijk vond — niet als klaag, maar als transparantie.",
      "experiment": "Spreek na een week na: werkt de afspraak? Pas zo nodig aan — samen.",
      "gentle_phrase": "We hoeven het niet eens te zijn om één lijn te trekken."
    },
    "couple": {
      "comparison_intro": "Jullie navigeren opvoedverschillen — en dat vraagt meer dan het lijkt.",
      "what_a_may_hear": "Jij wil duidelijkheid en consistentie — en zoekt bevestiging dat jouw visie telt.",
      "what_b_may_hear": "Jij zoekt naar draagvlak — je wil niet alleen uitvoeren wat bepaald is zonder jou.",
      "what_each_protects": "Beiden beschermen jullie wat jullie geloven over goed ouderschap.",
      "shared_chance": "Eenheid als ouders is een van de krachtigste cadeaus voor een kind.",
      "shared_challenge": "Houd het opvoedgesprek apart van het relatiegesprek.",
      "shared_experiment": "Bespreek maandelijks één opvoedthema — niet in crisis, maar als check-in."
    }
  }
},

"D9_POSITIVE_002": {
  "questions": [
    {
      "question_id": "D9_POSITIVE_002_Q1",
      "step": "emotion",
      "prompt": "Je partner ondersteunt jouw grens tegenover het kind — ook al had hij/zij het misschien anders gedaan. Wat voel je dan?",
      "helper_text": "Kies de emotie die het meest klopt.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Opluchting — ik hoef het niet alleen te dragen", "tags": {"needs.safety": 2, "needs.connection": 2}},
        {"option_id": "B", "label": "Dankbaarheid — dit is team zijn", "tags": {"needs.connection": 2, "skills.teamwork": 2}},
        {"option_id": "C", "label": "Versterkt — de grens voelt steviger met twee", "tags": {"needs.stability": 2, "needs.safety": 1}},
        {"option_id": "D", "label": "Licht schuldig — misschien was mijn grens te streng", "tags": {"patterns.self_doubt": 2, "sensitive_points.not_good_enough": 1}}
      ]
    },
    {
      "question_id": "D9_POSITIVE_002_Q2",
      "step": "need",
      "prompt": "Wat heb jij nodig van je partner om je als ouder gesteund te voelen?",
      "helper_text": "Kies het meest herkenbare.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Dat hij/zij achter me staat op het moment zelf, ook als we later praten", "tags": {"needs.safety": 2, "needs.connection": 1}},
        {"option_id": "B", "label": "Dat mijn keuzes niet worden ondermijnd tegenover de kinderen", "tags": {"needs.recognition": 2, "needs.safety": 2}},
        {"option_id": "C", "label": "Dat we achteraf kunnen bespreken wat anders kon — met respect", "tags": {"skills.communication": 2, "needs.safety": 1}},
        {"option_id": "D", "label": "Dat ik weet dat we één front zijn, ook als we het niet eens zijn", "tags": {"needs.stability": 2, "skills.teamwork": 2}}
      ]
    }
  ],
  "outputs": {
    "solo": {
      "mirror": "Steun op het moment zelf is anders dan gelijk krijgen. Jij voelt dat onderscheid.",
      "protection_reflection": "Als je je schuldig voelt bij een grens die de ander ook steunt, bescherm je jezelf misschien voor het label 'te streng'.",
      "need_reflection": "Jij wil niet alleen ouder zijn — je wil ook als ouder gezien worden door je partner.",
      "chance": "Steun op het moment geeft kinderen duidelijkheid. Het gesprek daarna geeft jullie groei.",
      "challenge": "Zeg eens hardop: 'Dank je dat je me steunde, ook al was je het misschien niet eens.'",
      "experiment": "Spreek af: we steunen elkaar op het moment, bespreken het later privé.",
      "gentle_phrase": "Samen optrekken is al een halve opvoeding."
    },
    "couple": {
      "comparison_intro": "Oudersteun is een taal op zich — en jullie spreken die op eigen manier.",
      "what_a_may_hear": "Jij hebt op het moment steun gegeven — en dat was meer waard dan je misschien dacht.",
      "what_b_may_hear": "Jij hebt die steun ontvangen — en voelde hoe groot dat kan zijn.",
      "what_each_protects": "De een beschermt het kind. De ander beschermt de ander als ouder.",
      "shared_chance": "Steun geven aan elkaar als ouder is ook steun geven aan de relatie.",
      "shared_challenge": "Maak expliciet wat steun voor ieder van jullie betekent.",
      "shared_experiment": "Benoem één keer per week iets wat de ander goed deed als ouder."
    }
  }
},

"D9_POSITIVE_003": {
  "questions": [
    {
      "question_id": "D9_POSITIVE_003_Q1",
      "step": "reaction",
      "prompt": "Er is een gezinsritueel dat houvast geeft in de drukte — avondeten, voorlezen, wandeling. Wat doet dat ritueel met jou?",
      "helper_text": "Kies wat het meest resoneert.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Het geeft rust — even een vast punt in de chaos", "tags": {"needs.stability": 2, "needs.safety": 1}},
        {"option_id": "B", "label": "Het voelt als 'dit zijn wij' — identiteit als gezin", "tags": {"needs.connection": 2, "needs.stability": 2}},
        {"option_id": "C", "label": "Het herinnert me eraan dat we meer zijn dan een logistiek team", "tags": {"needs.connection": 2, "needs.recognition": 1}},
        {"option_id": "D", "label": "Ik vind het fijn dat de kinderen hierop kunnen rekenen", "tags": {"needs.stability": 2, "skills.parenting": 2}}
      ]
    },
    {
      "question_id": "D9_POSITIVE_003_Q2",
      "step": "need",
      "prompt": "Wat maakt een ritueel voor jou echt betekenisvol — niet alleen een routine?",
      "helper_text": "Kies het meest essentiële.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Dat we er allebei echt aanwezig zijn, niet half", "tags": {"needs.connection": 2, "needs.recognition": 1}},
        {"option_id": "B", "label": "Dat de kinderen er ook blij van worden", "tags": {"needs.connection": 2, "skills.parenting": 1}},
        {"option_id": "C", "label": "Dat het organisch is ontstaan, niet opgelegd", "tags": {"needs.freedom": 2, "needs.stability": 1}},
        {"option_id": "D", "label": "Dat het ons verbindt, ook op moeilijke avonden", "tags": {"needs.connection": 2, "needs.safety": 1}}
      ]
    }
  ],
  "outputs": {
    "solo": {
      "mirror": "Rituelen zijn de lijm van een gezin — niet in grote gebaren, maar in herhaling.",
      "protection_reflection": "Als je rituelen 'slechts routine' voelt, beschermt dat je misschien voor teleurstelling als ze mislukken.",
      "need_reflection": "Jij verlangt naar aanwezigheid — momenten waarop jullie er niet alleen lichamelijk maar ook echt zijn.",
      "chance": "Kleine vaste momenten bouwen veiligheid op voor kinderen én voor de relatie.",
      "challenge": "Bescherm één ritueel — hoe druk het ook is.",
      "experiment": "Vraag de kinderen: wat vind jij ons fijnste ritueel? Het antwoord verrast misschien.",
      "gentle_phrase": "Niet perfect, maar herkenbaar — zo doen wij dat."
    },
    "couple": {
      "comparison_intro": "Jullie bouwen samen iets dat groter is dan het moment: een gezinsidentiteit.",
      "what_a_may_hear": "Jij hecht aan vaste momenten — die geven jou rust en houvast.",
      "what_b_may_hear": "Jij wil dat die momenten echt zijn, niet alleen gepland.",
      "what_each_protects": "De een beschermt structuur. De ander beschermt oprechtheid.",
      "shared_chance": "Rituelen die beide ouders dragen, zijn het krachtigst.",
      "shared_challenge": "Kies samen één ritueel dat jullie komende maand beschermen — geen uitzonderingen.",
      "shared_experiment": "Start een klein, eigen ritueel voor jullie als stel — niet als ouders."
    }
  }
},

"D9_POSITIVE_004": {
  "questions": [
    {
      "question_id": "D9_POSITIVE_004_Q1",
      "step": "emotion",
      "prompt": "Je partner benoemt iets wat jij als ouder goed deed — 'Ik zag hoe geduldig je bleef.' Wat voel je bij zo'n moment?",
      "helper_text": "Kies de eerste reactie.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Warmte — ik word gezien in iets wat ik niet altijd zeker van ben", "tags": {"needs.recognition": 2, "needs.safety": 1}},
        {"option_id": "B", "label": "Opluchting — ik ben niet alleen als ouder", "tags": {"needs.connection": 2, "needs.safety": 1}},
        {"option_id": "C", "label": "Verrassing — ik dacht dat niemand het merkte", "tags": {"sensitive_points.not_seen": 2, "needs.recognition": 2}},
        {"option_id": "D", "label": "Ongemak — ik weet niet goed hoe ik complimenten moet ontvangen", "tags": {"sensitive_points.shame": 1, "patterns.self_doubt": 1}}
      ]
    },
    {
      "question_id": "D9_POSITIVE_004_Q2",
      "step": "need",
      "prompt": "Als ouder — wanneer voel jij je het meest gezien en ondersteund door je partner?",
      "helper_text": "Kies wat het meest resoneert.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Als hij/zij opmerkt wat ik doe zonder dat ik het hoef te benoemen", "tags": {"needs.recognition": 3, "needs.connection": 1}},
        {"option_id": "B", "label": "Als we samen over de kinderen praten zonder meteen probleemoplossend te worden", "tags": {"needs.connection": 2, "skills.communication": 1}},
        {"option_id": "C", "label": "Als hij/zij even overneemt zonder dat ik hoef te vragen", "tags": {"needs.recognition": 2, "needs.safety": 1}},
        {"option_id": "D", "label": "Als we lachen om iets geks van de kinderen — even als stel, niet als ouders", "tags": {"needs.connection": 2, "needs.freedom": 1}}
      ]
    }
  ],
  "outputs": {
    "solo": {
      "mirror": "Gezien worden als ouder is iets anders dan gezien worden als partner. Jij hebt allebei nodig.",
      "protection_reflection": "Ongemak bij een compliment beschermt je voor de kwetsbaarheid van echt ontvangen.",
      "need_reflection": "Jij verlangt ernaar dat je inzet als ouder wordt opgemerkt — niet als prestatie, maar als aanwezigheid.",
      "chance": "Erkenning als ouder versterkt de hele relatie — ook buiten de kinderen om.",
      "challenge": "Ontvang het compliment zonder het weg te relativeren.",
      "experiment": "Benoem vandaag één ding wat je partner als ouder goed deed — concreet en eerlijk.",
      "gentle_phrase": "Ik zie jou ook — als ouder, niet alleen als partner."
    },
    "couple": {
      "comparison_intro": "Jullie dragen allebei iets als ouders — maar dat wordt niet altijd even zichtbaar.",
      "what_a_may_hear": "Jij gaf erkenning — en dat was groter dan je misschien dacht.",
      "what_b_may_hear": "Jij ontving iets — en dat mocht even binnenkomen.",
      "what_each_protects": "De een beschermt de ander door te benoemen wat gezien wordt. De ander beschermt zichzelf door het aan te nemen.",
      "shared_chance": "Erkenning als ouder is ook verbinding als stel.",
      "shared_challenge": "Maak het concreet — niet 'jij doet het goed', maar 'ik zag hoe jij...'",
      "shared_experiment": "Vertel elkaar elke avond één ding dat de ander die dag als ouder goed deed."
    }
  }
},

# ── TENSION ───────────────────────────────────────────────────────────────

"D9_TENSION_001": {
  "questions": [
    {
      "question_id": "D9_TENSION_001_Q1",
      "step": "reaction",
      "prompt": "Jullie reageren anders op hetzelfde gedrag van een kind — de één wil consequenties, de ander wil eerst begrijpen. Wat gebeurt er dan bij jou?",
      "helper_text": "Kies de meest herkenbare reactie.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Ik voel dat mijn aanpak ondergraven wordt", "tags": {"needs.recognition": 2, "sensitive_points.not_respected": 2}},
        {"option_id": "B", "label": "Ik ga het harder verdedigen dan ik eigenlijk wil", "tags": {"patterns.escalation": 2, "protections.control": 1}},
        {"option_id": "C", "label": "Ik trek me terug en laat de ander het oplossen", "tags": {"protections.withdrawal": 2, "patterns.avoidance": 1}},
        {"option_id": "D", "label": "Ik probeer het gesprek later te voeren, maar het blijft hangen", "tags": {"patterns.avoidance": 1, "needs.safety": 1}}
      ]
    },
    {
      "question_id": "D9_TENSION_001_Q2",
      "step": "interpretation",
      "prompt": "Als jij en je partner anders reageren op een kind — wat vul jij dan in over de ander?",
      "helper_text": "Kies de meest herkenbare gedachte.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "'Hij/zij is te zacht — het kind leert hier niks van'", "tags": {"patterns.criticism": 2, "needs.stability": 1}},
        {"option_id": "B", "label": "'Hij/zij is te streng — het kind heeft begrip nodig'", "tags": {"patterns.criticism": 2, "needs.connection": 1}},
        {"option_id": "C", "label": "'Dit gaat niet over het kind — dit gaat over ons'", "tags": {"skills.insight": 2, "needs.connection": 1}},
        {"option_id": "D", "label": "'We zitten fundamenteel anders — dat is groter dan dit moment'", "tags": {"patterns.catastrophizing": 2, "needs.stability": 1}}
      ]
    }
  ],
  "outputs": {
    "solo": {
      "mirror": "Opvoedverschillen zijn zelden alleen pedagogisch — ze raken waarden, angsten en de vraag: wie ben ik als ouder?",
      "protection_reflection": "Je aanpak verdedigen is ook jezelf verdedigen. Achter de stijl zit een overtuiging over wat kinderen nodig hebben.",
      "need_reflection": "Jij wil niet alleen consistent zijn — je wil ook als ouder serieus genomen worden.",
      "chance": "Jullie kunnen de vraag stellen: wat probeer ik te beschermen in dit kind?",
      "challenge": "Houd het gesprek op het kind gericht, niet op wie er gelijk heeft.",
      "experiment": "Schrijf op: wat is mijn diepste overtuiging over dit opvoedthema? Deel het met je partner.",
      "gentle_phrase": "We zijn het niet eens — en we willen allebei het beste voor ons kind."
    },
    "couple": {
      "comparison_intro": "Jullie opvoedstijlen botsen soms — en dat is menselijk. Wat eronder zit, vraagt aandacht.",
      "what_a_may_hear": "Jij wil duidelijkheid geven — grenzen die het kind veiligheid bieden.",
      "what_b_may_hear": "Jij wil begrip geven — verbinding die het kind vertrouwen biedt.",
      "what_each_protects": "De een beschermt structuur. De ander beschermt de relatie met het kind.",
      "shared_chance": "Kinderen die beide zien — consequentie én begrip — leren de wereld kennen van twee kanten.",
      "shared_challenge": "Spreek je opvoedfilosofie uit — niet bij de crisis, maar ervoor.",
      "shared_experiment": "Vraag elkaar: wat wil jij dat onze kinderen over ons zeggen als ze groot zijn?"
    }
  }
},

"D9_TENSION_002": {
  "questions": [
    {
      "question_id": "D9_TENSION_002_Q1",
      "step": "emotion",
      "prompt": "Jij draagt meer dan zichtbaar is — school, planning, tandarts, kleding, sport, cadeaus. Wat voel jij als dat niet opgemerkt wordt?",
      "helper_text": "Kies de emotie die het meest klopt.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Vermoeidheid met een randje pijn — ik doe zoveel en niemand ziet het", "tags": {"sensitive_points.not_seen": 2, "needs.recognition": 2}},
        {"option_id": "B", "label": "Wrok die langzaam groeit — ik houd het bij maar word er stiller van", "tags": {"patterns.resentment": 2, "protections.withdrawal": 1}},
        {"option_id": "C", "label": "Ik vind het irritant maar zeg niks — bang dat ik zeurer lijk", "tags": {"patterns.pleasing": 2, "needs.recognition": 1}},
        {"option_id": "D", "label": "Onrecht — dit is niet wat we hadden afgesproken", "tags": {"needs.fairness": 2, "sensitive_points.not_respected": 1}}
      ]
    },
    {
      "question_id": "D9_TENSION_002_Q2",
      "step": "interpretation",
      "prompt": "Als de taakverdeling voelt als oneerlijk — wat denk jij dat de ander niet ziet of niet beseft?",
      "helper_text": "Kies de meest herkenbare gedachte.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Hoeveel er in mijn hoofd zit — de mentale last naast het zichtbare werk", "tags": {"needs.recognition": 2, "sensitive_points.not_seen": 2}},
        {"option_id": "B", "label": "Dat ik ook moe ben, maar doorga omdat anders alles blijft liggen", "tags": {"patterns.self_sacrifice": 2, "needs.recognition": 1}},
        {"option_id": "C", "label": "Dat ik het eigenlijk niet meer wil dragen zoals het nu is", "tags": {"needs.fairness": 2, "needs.freedom": 1}},
        {"option_id": "D", "label": "Dat ik het niet vraag omdat ik bang ben het antwoord te horen", "tags": {"patterns.avoidance": 2, "needs.safety": 1}}
      ]
    }
  ],
  "outputs": {
    "solo": {
      "mirror": "Mentale last is de onzichtbare helft van ouderschap. Dat jij die draagt is echt — en het heeft aandacht nodig.",
      "protection_reflection": "Niks zeggen beschermt je voor conflict, maar het stapelt de pijn op.",
      "need_reflection": "Jij verlangt naar erkenning — niet alleen voor wat je doet, maar voor hoeveel er in je hoofd zit.",
      "chance": "Dit gesprek is te voeren — maar niet in het moment van irritatie.",
      "challenge": "Zeg het eens concreet: 'Dit zijn de dingen die ik deze week gedragen heb.' Maak het zichtbaar.",
      "experiment": "Schrijf een week lang alles op wat jij regelt — groot en klein. Deel de lijst, niet als aanval maar als zichtbaar maken.",
      "gentle_phrase": "Zichtbaar maken is de eerste stap naar eerlijk verdelen."
    },
    "couple": {
      "comparison_intro": "Taakverdeling is niet altijd eerlijk — en dat voelt soms groter dan alleen logistiek.",
      "what_a_may_hear": "Jij draagt veel meer dan zichtbaar is — en dat is vermoeiend en eenzaam.",
      "what_b_may_hear": "Jij ziet misschien niet alles wat er gedragen wordt — niet uit onwil, maar omdat het niet gedeeld wordt.",
      "what_each_protects": "De een beschermt de boel door te dragen. De ander beschermt zichzelf onbewust door niet te zien.",
      "shared_chance": "Eerlijk verdelen begint met alles zichtbaar maken.",
      "shared_challenge": "Maak een lijst van alle taken — together, then redistribute.",
      "shared_experiment": "Doe één week een experiment: hij/zij neemt de mentale planning op zich. Bespreek hoe dat voelt."
    }
  }
},

"D9_TENSION_003": {
  "questions": [
    {
      "question_id": "D9_TENSION_003_Q1",
      "step": "reaction",
      "prompt": "Het kind weet precies waar de ruimte zit tussen jullie. De ene ouder zegt nee, de ander twijfelt. Hoe reageer jij op dat moment?",
      "helper_text": "Kies de meest herkenbare reactie.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Ik voel mij ondermijnd — mijn nee wordt uitgehold", "tags": {"needs.recognition": 2, "sensitive_points.not_respected": 2}},
        {"option_id": "B", "label": "Ik laat het maar gaan — conflict met het kind nóg een conflict met partner is te veel", "tags": {"protections.withdrawal": 2, "patterns.avoidance": 1}},
        {"option_id": "C", "label": "Ik probeer er later over te praten maar weet niet hoe", "tags": {"skills.communication": 1, "needs.safety": 1}},
        {"option_id": "D", "label": "Ik snap de ander, maar voel dat het kind het nu door heeft", "tags": {"skills.insight": 2, "needs.stability": 1}}
      ]
    },
    {
      "question_id": "D9_TENSION_003_Q2",
      "step": "interpretation",
      "prompt": "Als jullie als ouders niet op één lijn zitten — wat zegt dat voor jou over jullie als team?",
      "helper_text": "Kies de interpretatie die het meest klopt.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "We hebben meer afstemming nodig — dit is repareerbaar", "tags": {"skills.teamwork": 2, "needs.stability": 1}},
        {"option_id": "B", "label": "We zijn te moe om te coördineren — het gaat mis op de vermoeidheid", "tags": {"needs.stability": 1, "needs.safety": 1}},
        {"option_id": "C", "label": "We verschillen fundamenteel over opvoeden — dat baart me zorgen", "tags": {"patterns.catastrophizing": 2, "needs.stability": 1}},
        {"option_id": "D", "label": "Ik denk niet dat we het eens worden — en dat frustreert me", "tags": {"patterns.resentment": 2, "needs.connection": 1}}
      ]
    }
  ],
  "outputs": {
    "solo": {
      "mirror": "Kinderen testen de naden van teams. Het is geen manipulatie — het is leren begrijpen hoe de wereld werkt.",
      "protection_reflection": "Als jij je ondermijnd voelt, beschermt dat deel van jou je autoriteit als ouder — en dat is een echte behoefte.",
      "need_reflection": "Jij wil dat jullie één lijn trekken — niet om te winnen, maar omdat het kinderen veiligheid geeft.",
      "chance": "Afstemming vóór het moment is krachtiger dan ingrijpen ná het moment.",
      "challenge": "Spreek af: als één van ons nee zegt, blijft dat nee — het gesprek voeren we later.",
      "experiment": "Maak samen een 'onze regels'-lijstje — de drie dingen waar jullie altijd één lijn trekken.",
      "gentle_phrase": "Eén lijn trekt niet iedereen blij — maar het geeft wel houvast."
    },
    "couple": {
      "comparison_intro": "Het kind speelt jullie uit — en dat laat zien waar de naden in jullie samenwerking zitten.",
      "what_a_may_hear": "Jij voelt je ondermijnd — en hebt consistentie nodig om je rustig te voelen.",
      "what_b_may_hear": "Jij twijfelde — misschien uit mildheid, misschien uit onzekerheid.",
      "what_each_protects": "De een beschermt de grens. De ander beschermt de relatie met het kind.",
      "shared_chance": "Eén front zijn is het krachtigste opvoedgereedschap dat jullie hebben.",
      "shared_challenge": "Bespreek de top-3 grenzen waar jullie altijd één lijn trekken — en houd die vast.",
      "shared_experiment": "Schrijf elk apart: wat zijn jouw drie harde regels? Vergelijk en vind de overlap."
    }
  }
},

"D9_TENSION_004": {
  "questions": [
    {
      "question_id": "D9_TENSION_004_Q1",
      "step": "reaction",
      "prompt": "De dagen draaien om kinderen, werk en logistiek. Jullie spreken elkaar vooral nog als planning. Hoe merk jij dat bij jezelf?",
      "helper_text": "Kies wat het meest herkenbaar is.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Ik mis mijn partner — maar weet niet hoe ik het moet zeggen midden in de drukte", "tags": {"needs.connection": 2, "protections.withdrawal": 1}},
        {"option_id": "B", "label": "Ik merk het pas als we een keer rustiger zijn — dan is de afstand groter dan ik dacht", "tags": {"patterns.avoidance": 1, "needs.connection": 2}},
        {"option_id": "C", "label": "Ik accepteer het — zo gaat het nou eenmaal met kinderen", "tags": {"patterns.resignation": 2, "needs.connection": 1}},
        {"option_id": "D", "label": "Ik voel dat we van partners naar medeouders verschuiven en dat verontrust me", "tags": {"sensitive_points.relationship_loss": 2, "needs.connection": 2}}
      ]
    },
    {
      "question_id": "D9_TENSION_004_Q2",
      "step": "interpretation",
      "prompt": "Als jullie relatie verdwijnt achter de kinderen — wat denk jij dat er op het spel staat?",
      "helper_text": "Kies de meest herkenbare gedachte.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Dat we straks vreemden zijn als de kinderen het huis uit gaan", "tags": {"patterns.catastrophizing": 2, "needs.connection": 2}},
        {"option_id": "B", "label": "Dat ik me eenzaam voel in de relatie terwijl we allebei hard werken", "tags": {"needs.connection": 2, "sensitive_points.loneliness": 2}},
        {"option_id": "C", "label": "Dat onze kinderen zien dat we geen echte partners meer zijn", "tags": {"needs.stability": 2, "skills.parenting": 1}},
        {"option_id": "D", "label": "Dat we te weinig investeren in wat de basis is van dit hele gezin", "tags": {"needs.connection": 2, "needs.stability": 1}}
      ]
    }
  ],
  "outputs": {
    "solo": {
      "mirror": "Het is verleidelijk om als ouder op te gaan — maar de relatie is de bodem onder het gezin.",
      "protection_reflection": "Accepteren dat het 'nu eenmaal zo gaat' beschermt je voor de pijn van het gemis — maar het laat het ook groeien.",
      "need_reflection": "Jij verlangt naar je partner, niet alleen naar je medeouder. Dat verlangen is geldig.",
      "chance": "De relatie onderhouden ís ouderschap — kinderen groeien op in de sfeer die jullie scheppen.",
      "challenge": "Plan een moment zonder kinderen en agenda. Niks groots — gewoon samen zijn.",
      "experiment": "Vraag deze week: 'Hoe gaat het eigenlijk met jóú?' — niet met de planning.",
      "gentle_phrase": "We zijn meer dan medeouders — ook al vraagt het nu even aandacht om dat te voelen."
    },
    "couple": {
      "comparison_intro": "De relatie sluipt naar de achtergrond. Jullie zien dat allebei — maar het benoemen is al een stap.",
      "what_a_may_hear": "Jij mist verbinding — en dat is moed om te zeggen midden in al het goede.",
      "what_b_may_hear": "Jij voelt het ook — maar misschien weet je niet waar je moet beginnen.",
      "what_each_protects": "Beiden beschermen jullie de kinderen — en daarin raakt de relatie soms op de tweede plek.",
      "shared_chance": "Een sterk stel is het beste fundament voor een gezin.",
      "shared_challenge": "Reserveer één vast moment per week dat van jullie alleen is.",
      "shared_experiment": "Plan dit weekend iets voor jullie twee — hoe klein ook. Niet als luxe, maar als investering."
    }
  }
},

# ── DEEP ──────────────────────────────────────────────────────────────────

"D9_DEEP_001": {
  "questions": [
    {
      "question_id": "D9_DEEP_001_Q1",
      "step": "sensitive_point",
      "prompt": "Je ziet jezelf reageren zoals je niet wilde — of je staat niet waar je had moeten staan. Welk gevoel zit er het diepst onder die gedachte?",
      "helper_text": "Kies het meest kwetsbare.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Angst dat ik mijn kind beschadig zoals ik zelf beschadigd ben", "tags": {"sensitive_points.old_wound": 2, "sensitive_points.not_good_enough": 2}},
        {"option_id": "B", "label": "Schaamte — mijn kind verdient beter dan dit", "tags": {"sensitive_points.shame": 2, "sensitive_points.not_good_enough": 2}},
        {"option_id": "C", "label": "Schuld — ik wist het beter maar deed het toch", "tags": {"sensitive_points.guilt": 2, "patterns.self_blame": 2}},
        {"option_id": "D", "label": "Twijfel — misschien ben ik gewoon niet goed genoeg als ouder", "tags": {"sensitive_points.not_good_enough": 3, "patterns.self_doubt": 2}}
      ]
    },
    {
      "question_id": "D9_DEEP_001_Q2",
      "step": "emotion",
      "prompt": "Als die angst opkomt — 'doe ik het wel goed genoeg?' — wat heb jij dan het meest nodig?",
      "helper_text": "Kies het meest herkenbare.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Bevestiging van mijn partner dat ik goede dingen doe", "tags": {"needs.recognition": 2, "needs.safety": 1}},
        {"option_id": "B", "label": "Rust om te herstellen — niet meer willen dan ik aankan", "tags": {"needs.safety": 2, "needs.stability": 1}},
        {"option_id": "C", "label": "Mildheid naar mezelf — ik hoef niet perfect te zijn", "tags": {"needs.recognition": 2, "skills.self_compassion": 2}},
        {"option_id": "D", "label": "Weten dat mijn kind het gevoel heeft dat ik er ben, ook als ik fouten maak", "tags": {"needs.connection": 2, "needs.safety": 2}}
      ]
    }
  ],
  "outputs": {
    "solo": {
      "mirror": "De vraag 'doe ik het goed genoeg?' stellen is geen teken van falen — het is het teken van een ouder die het meent.",
      "protection_reflection": "Schaamte en schuld beschermen je op hun eigen manier: als jij het probleem bent, is er tenminste een verklaring.",
      "need_reflection": "Jij wil een goed genoeg ouder zijn — niet perfect, maar aanwezig, eerlijk en mild.",
      "chance": "Kinderen hebben geen perfecte ouders nodig. Ze hebben ouders nodig die fouten kunnen herstellen.",
      "challenge": "Zeg eens hardop: 'Ik heb het niet goed gedaan vandaag — en ik probeer het morgen anders.'",
      "experiment": "Vraag je kind eens: 'Wat vind jij het fijnste aan mij als papa/mama?' Het antwoord verrast misschien.",
      "gentle_phrase": "Goed genoeg is echt genoeg — als het van binnenuit komt."
    },
    "couple": {
      "comparison_intro": "De angst om tekort te schieten als ouder is menselijk — en jullie dragen die misschien allebei.",
      "what_a_may_hear": "Jij twijfelt aan jezelf — en dat maakt je zowel kwetsbaar als menselijk.",
      "what_b_may_hear": "Jij ziet de ander worstelen — en misschien herken je het ook in jezelf.",
      "what_each_protects": "Beiden beschermen jullie het kind — en zichzelf voor de pijn van het niet-genoeg-zijn.",
      "shared_chance": "Mildheid naar elkaar als ouders geeft kinderen toestemming om ook mild te zijn naar zichzelf.",
      "shared_challenge": "Spreek het eens uit: 'Ik ben bang dat ik het verkeerd doe.' Luister.",
      "shared_experiment": "Vertel elkaar één moment van deze week als ouder waar je trots op bent — hoe klein ook."
    }
  }
},

"D9_DEEP_002": {
  "questions": [
    {
      "question_id": "D9_DEEP_002_Q1",
      "step": "sensitive_point",
      "prompt": "Je herkent soms je eigen vader of moeder in jezelf als ouder. Of je doet je best om het anders te doen. Wat roept dat bij jou op?",
      "helper_text": "Kies het meest kwetsbare.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Schrik — ik word wie ik niet wilde worden", "tags": {"sensitive_points.old_wound": 2, "sensitive_points.shame": 2}},
        {"option_id": "B", "label": "Verdriet — ik begrijp nu mijn ouders beter, maar het doet ook pijn", "tags": {"sensitive_points.grief": 2, "skills.insight": 1}},
        {"option_id": "C", "label": "Vastberadenheid — ik ga het anders doen, bewust", "tags": {"skills.agency": 2, "needs.freedom": 1}},
        {"option_id": "D", "label": "Verwarring — ik weet niet meer wat van hen is en wat van mij", "tags": {"sensitive_points.identity": 2, "needs.stability": 1}}
      ]
    },
    {
      "question_id": "D9_DEEP_002_Q2",
      "step": "emotion",
      "prompt": "Wat wil jij doorgeven aan je kind dat je zelf nooit hebt gekregen — of juist niet meegeven wat je wel hebt gekregen?",
      "helper_text": "Kies wat het meest resoneert.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Rust — dat je er mag zijn zonder te presteren", "tags": {"needs.safety": 2, "needs.freedom": 2}},
        {"option_id": "B", "label": "Veiligheid om fouten te maken zonder ze lang te voelen", "tags": {"needs.safety": 2, "skills.self_compassion": 2}},
        {"option_id": "C", "label": "Echte aanwezigheid — niet alleen lichamelijk, maar ook emotioneel", "tags": {"needs.connection": 2, "needs.recognition": 2}},
        {"option_id": "D", "label": "Het gevoel dat je er mag zijn zoals je bent", "tags": {"needs.recognition": 3, "needs.safety": 1}}
      ]
    }
  ],
  "outputs": {
    "solo": {
      "mirror": "Ouderschap is het moment waarop jouw eigen jeugd terugkeert — soms als cadeau, soms als les, soms als pijn.",
      "protection_reflection": "Het bewuste 'anders doen' beschermt je kind — maar kost ook energie. Die verdient ook erkenning.",
      "need_reflection": "Jij wil de keten doorbreken of de goede dingen doorgeven — allebei zijn ze een daad van liefde.",
      "chance": "Wat jij bewust anders doet, is al een geschenk — ook al lukt het niet altijd.",
      "challenge": "Zeg eens aan je kind: 'Ik leer het ook.' Oprecht en zonder zelfkritiek.",
      "experiment": "Schrijf één zin: 'Wat ik mijn kind wil geven dat ik zelf heb gemist.' Lees het later terug.",
      "gentle_phrase": "Ik ben niet mijn ouders. En ik hoef het niet perfect te doen om het anders te doen."
    },
    "couple": {
      "comparison_intro": "Jullie brengen allebei een jeugd mee. Die raakt hoe jullie ouders zijn — en dat mag besproken worden.",
      "what_a_may_hear": "Jij draagt iets mee uit jouw verleden — en dat vormt hoe je nu reageert.",
      "what_b_may_hear": "Jij ook — met eigen patronen, eigen pijn, eigen mooie dingen.",
      "what_each_protects": "Beiden beschermen jullie iets: de ander voor pijn, het kind voor herhaling.",
      "shared_chance": "Als jullie elkaars achtergrond kennen, worden reacties begrijpelijker.",
      "shared_challenge": "Vertel elkaar één ding uit je jeugd dat je bewust anders wilt doen als ouder.",
      "shared_experiment": "Praat eens over: wat was goed thuis? Wat wil je doorgeven? Wat niet?"
    }
  }
}

} # end D9_CASES

# ── Update cases.json ──────────────────────────────────────────────────────

with open('cases.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

updated = 0
for c in data['cases']:
    dom = c.get('domain', {})
    did = dom.get('domain_id') if isinstance(dom, dict) else dom
    cid = c['case_id']
    if did == 'D9' and cid in D9_CASES:
        c['questions'] = D9_CASES[cid]['questions']
        c['outputs']   = D9_CASES[cid]['outputs']
        print('Updated:', cid)
        updated += 1

with open('cases.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f'\nDone! Updated {updated} D9 cases.')
