import json, sys
sys.stdout.reconfigure(encoding='utf-8')

D8_CASES = {

# ── POSITIVE ──────────────────────────────────────────────────────────────

"D8_POSITIVE_001": {
  "questions": [
    {
      "question_id": "D8_POSITIVE_001_Q1",
      "step": "reaction",
      "prompt": "Je partner slaat een arm om je heen — geen druk, geen verwachting. Wat merk je bij jezelf?",
      "helper_text": "Kies wat het dichtst bij jouw eerste reactie komt.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Ik ontspan en laat het toe", "tags": {"needs.safety": 2, "needs.connection": 2}},
        {"option_id": "B", "label": "Ik voel iets warms, maar ook lichte alertheid", "tags": {"needs.safety": 1, "patterns.hypervigilance": 1}},
        {"option_id": "C", "label": "Ik vraag me af wat er nu gaat komen", "tags": {"patterns.hypervigilance": 2, "protections.control": 1}},
        {"option_id": "D", "label": "Ik wil erin opgaan maar er is iets dat remt", "tags": {"protections.distancing": 2, "needs.safety": 1}}
      ]
    },
    {
      "question_id": "D8_POSITIVE_001_Q2",
      "step": "need",
      "prompt": "Nabijheid zonder agenda — wat geeft jou dat?",
      "helper_text": "Wat het meest resoneert.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Het gevoel dat ik welkom ben, zo zoals ik ben", "tags": {"needs.recognition": 2, "needs.safety": 1}},
        {"option_id": "B", "label": "Rust — ik hoef niks te presteren", "tags": {"needs.safety": 2, "needs.freedom": 1}},
        {"option_id": "C", "label": "Verbinding zonder woorden", "tags": {"needs.connection": 2}},
        {"option_id": "D", "label": "Vertrouwen dat de ander er gewoon is", "tags": {"needs.safety": 2, "needs.stability": 1}}
      ]
    }
  ],
  "outputs": {
    "solo": {
      "mirror": "Nabijheid zonder druk raakt iets echts in jou. Je lichaam weet soms sneller dan je hoofd of er ruimte is.",
      "protection_reflection": "Als er toch alertheid is bij een veilige aanraking, beschermt dat deel van jou je voor teleurstelling.",
      "need_reflection": "Jij verlangt naar nabijheid die niet verwacht — niet als beloning, maar als thuis.",
      "chance": "Je kunt verkennen: wanneer ontspan ik écht, en wanneer blijf ik toch op wacht?",
      "challenge": "Laat de ontspanning toe zonder meteen te analyseren waarom.",
      "experiment": "Zeg een keer bij een knuffel: 'Dit voelt goed.' Hardop, zonder meer.",
      "gentle_phrase": "Ik mag genieten van nabijheid zonder te weten wat het betekent."
    },
    "couple": {
      "comparison_intro": "Jullie reageren allebei op nabijheid — maar misschien niet altijd op dezelfde manier.",
      "what_a_may_hear": "Jij ervaart aanraking als veilig en verbindend — en dat wil je graag voelen.",
      "what_b_may_hear": "Jij hebt soms even een moment nodig voordat jouw lichaam de veiligheid voelt.",
      "what_each_protects": "Beiden beschermen jullie je op eigen manier: de een door open te gaan, de ander door even te wachten.",
      "shared_chance": "Jullie kunnen samen ontdekken hoe nabijheid voor ieder van jullie voelt.",
      "shared_challenge": "Ga niet invullen — vraag.",
      "shared_experiment": "Knuffel eens zonder agenda. Achteraf: zeg één woord over hoe het voelde."
    }
  }
},

"D8_POSITIVE_002": {
  "questions": [
    {
      "question_id": "D8_POSITIVE_002_Q1",
      "step": "emotion",
      "prompt": "Je partner zegt kwetsbaar: 'Ik mis nabijheid met je.' Niet als verwijt — als eerlijk gevoel. Wat komt er bij je op?",
      "helper_text": "Kies de reactie die het meest klopt.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Ik raak ontroerd — dit is moedig van hem/haar", "tags": {"needs.connection": 2, "skills.vulnerability": 2}},
        {"option_id": "B", "label": "Ik voel ook dat ik het gemist heb", "tags": {"needs.connection": 2, "needs.recognition": 1}},
        {"option_id": "C", "label": "Ik voel lichte schuld, ook al is dat niet de bedoeling", "tags": {"sensitive_points.not_good_enough": 2, "patterns.pleasing": 1}},
        {"option_id": "D", "label": "Ik wil reageren maar weet niet precies hoe", "tags": {"protections.withdrawal": 1, "needs.safety": 1}}
      ]
    },
    {
      "question_id": "D8_POSITIVE_002_Q2",
      "step": "need",
      "prompt": "Als verlangen zonder druk wordt uitgesproken — wat hoopt jij dan dat er gebeurt?",
      "helper_text": "Wat het meest resoneert.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Dat ik het kan horen zonder het als eis te voelen", "tags": {"needs.freedom": 2, "needs.safety": 1}},
        {"option_id": "B", "label": "Dat ik ook durf te zeggen wat ik mis", "tags": {"skills.vulnerability": 2, "needs.recognition": 1}},
        {"option_id": "C", "label": "Dat we samen een moment vinden zonder haast", "tags": {"needs.connection": 2, "needs.safety": 1}},
        {"option_id": "D", "label": "Dat de ander weet dat ik er ook ben, ook al lukt het niet altijd", "tags": {"needs.recognition": 2, "needs.safety": 1}}
      ]
    }
  ],
  "outputs": {
    "solo": {
      "mirror": "Verlangen zonder eis — dat is een uitnodiging, geen aanklacht. Toch kan het iets activeren.",
      "protection_reflection": "Schuldgevoel bij andermans kwetsbaarheid is een bescherming: je wil niemand teleurstellen.",
      "need_reflection": "Jij wil kunnen reageren op nabijheid vanuit vrijheid, niet vanuit verplichting.",
      "chance": "Oefenen: verlangen van jezelf benoemen zonder te weten of de timing klopt.",
      "challenge": "Ontvang de boodschap van de ander zonder hem meteen op te lossen.",
      "experiment": "Zeg: 'Ik hoorde je. Ik mis het ook, op mijn manier.' Kijk wat dat doet.",
      "gentle_phrase": "Verlangen mag uitgesproken worden — ook het mijne."
    },
    "couple": {
      "comparison_intro": "Eén van jullie sprak kwetsbaar over verlangen. De ander probeerde te luisteren.",
      "what_a_may_hear": "Jij zei iets echts — en dat vraagt moed.",
      "what_b_may_hear": "Jij probeerde het te ontvangen zonder het te zwaar te maken.",
      "what_each_protects": "De een beschermt zichzelf door eerlijk te zijn. De ander door voorzichtig te reageren.",
      "shared_chance": "Verbinding via kwetsbaarheid — als beiden dat durven, groeit intimiteit.",
      "shared_challenge": "Laat verlangen niet stapelen in stilte.",
      "shared_experiment": "Om beurten: vertel wat je mist — de ander luistert zonder te reageren. Daarna wissel je."
    }
  }
},

"D8_POSITIVE_003": {
  "questions": [
    {
      "question_id": "D8_POSITIVE_003_Q1",
      "step": "emotion",
      "prompt": "Je zet een grens rond intimiteit. De ander reageert rustig en respectvol. Hoe voelt dat?",
      "helper_text": "Kies wat het dichtst bij jouw gevoel komt.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Opluchting — ik hoefde me niet te verdedigen", "tags": {"needs.safety": 2, "needs.freedom": 1}},
        {"option_id": "B", "label": "Verrassing — ik had dit niet verwacht", "tags": {"patterns.hypervigilance": 1, "needs.safety": 2}},
        {"option_id": "C", "label": "Warmte — ik voel me gezien en gerespecteerd", "tags": {"needs.recognition": 2, "needs.safety": 1}},
        {"option_id": "D", "label": "Nog een beetje schuld, ook al deed ik niks verkeerd", "tags": {"sensitive_points.not_good_enough": 2, "patterns.pleasing": 1}}
      ]
    },
    {
      "question_id": "D8_POSITIVE_003_Q2",
      "step": "need",
      "prompt": "Wat heb jij nodig om een grens te kunnen zetten zonder schuldgevoel?",
      "helper_text": "Kies het meest herkenbare.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Weten dat een grens geen afwijzing is van de ander", "tags": {"needs.safety": 2, "needs.connection": 1}},
        {"option_id": "B", "label": "De ander die niet gekwetst reageert", "tags": {"needs.safety": 2, "patterns.pleasing": 1}},
        {"option_id": "C", "label": "Zelf geloven dat mijn grenzen geldig zijn", "tags": {"needs.recognition": 2, "needs.freedom": 1}},
        {"option_id": "D", "label": "Ruimte om het uit te leggen zonder te hoeven verdedigen", "tags": {"needs.freedom": 2, "skills.communication": 1}}
      ]
    }
  ],
  "outputs": {
    "solo": {
      "mirror": "Jouw grens werd gerespecteerd. Maar het schuldgevoel daarna — dat vertelt iets over hoe je geleerd hebt wat grenzen betekenen.",
      "protection_reflection": "Schuld voelen bij een grens is een oud beschermingsmechanisme: houd de ander tevreden, dan ben je veilig.",
      "need_reflection": "Jij verlangt ernaar dat jouw grenzen vanzelfsprekend zijn — geen onderhandeling, geen verklaring nodig.",
      "chance": "Een grens is geen muur. Oefenen: 'nee' zeggen en daarna niet uitleggen.",
      "challenge": "Laat de schuld toe zonder hem als signaal te zien dat je iets fout deed.",
      "experiment": "Zeg een keer: 'Ik heb nu geen ruimte' — zonder sorry.",
      "gentle_phrase": "Mijn grens beschermt ons beiden."
    },
    "couple": {
      "comparison_intro": "Eén van jullie zette een grens. De ander gaf ruimte.",
      "what_a_may_hear": "Jouw grens voelde misschien groot om te zeggen — maar het was eerlijk.",
      "what_b_may_hear": "Jij gaf ruimte — en dat is een daad van liefde.",
      "what_each_protects": "De een beschermt zichzelf door duidelijk te zijn. De ander beschermt de relatie door te respecteren.",
      "shared_chance": "Grenzen die gerespecteerd worden, maken nabijheid veiliger.",
      "shared_challenge": "Maak grenzen normaal, niet bijzonder.",
      "shared_experiment": "Praat samen over een moment waarop jij je grens hebt gezet én gerespecteerd voelde."
    }
  }
},

"D8_POSITIVE_004": {
  "questions": [
    {
      "question_id": "D8_POSITIVE_004_Q1",
      "step": "reaction",
      "prompt": "Het gesprek over intimiteit — verlangen, verschil, schaamte — lukt. Hoe reageer jij op zo'n gesprek?",
      "helper_text": "Kies de reactie die klopt.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Ik voel opluchting — eindelijk kunnen we dit zeggen", "tags": {"needs.connection": 2, "skills.vulnerability": 2}},
        {"option_id": "B", "label": "Ik voel me dichterbij de ander komen door het gesprek zelf", "tags": {"needs.connection": 2, "needs.recognition": 1}},
        {"option_id": "C", "label": "Ik vind het spannend maar ook bevrijdend", "tags": {"skills.vulnerability": 2, "needs.freedom": 1}},
        {"option_id": "D", "label": "Ik ben verrast dat dit zó kan — normaal mijden we dit", "tags": {"patterns.avoidance": 1, "needs.safety": 2}}
      ]
    },
    {
      "question_id": "D8_POSITIVE_004_Q2",
      "step": "need",
      "prompt": "Wat maakt zo'n gesprek voor jou mogelijk?",
      "helper_text": "Kies het meest essentiële.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Dat de ander niet schrikt of oordeelt", "tags": {"needs.safety": 2, "needs.recognition": 1}},
        {"option_id": "B", "label": "Dat ik weet dat het gesprek veilig is, ook als het ongemakkelijk wordt", "tags": {"needs.safety": 2, "needs.stability": 1}},
        {"option_id": "C", "label": "Dat ik zelf durf te zeggen wat ik eigenlijk voel", "tags": {"skills.vulnerability": 2, "needs.recognition": 1}},
        {"option_id": "D", "label": "Een goed moment — rust, geen haast, geen telefoons", "tags": {"needs.connection": 1, "needs.safety": 1}}
      ]
    }
  ],
  "outputs": {
    "solo": {
      "mirror": "Het gesprek over intimiteit is zelf een vorm van nabijheid. Dat jij dit aandurft, zegt iets over wat jij belangrijk vindt.",
      "protection_reflection": "Als dit gesprek spannend is, is er iets dat beschermd wil worden: je beeld van jezelf, of de relatie.",
      "need_reflection": "Jij hebt behoefte aan een relatie waar ook de kwetsbare lagen benoemd mogen worden.",
      "chance": "Intimiteit groeit niet alleen in aanraking, maar ook in woorden.",
      "challenge": "Zeg iets dat je normaal niet zegt over je eigen verlangen of grens.",
      "experiment": "Plan een check-in: 'Hoe gaat het eigenlijk met ons op dit vlak?' — gewoon als vraag.",
      "gentle_phrase": "Het gesprek zelf is al een vorm van liefde."
    },
    "couple": {
      "comparison_intro": "Jullie hebben een gesprek gevoerd dat spannend was — en toch lukte het.",
      "what_a_may_hear": "Jij durfde iets te zeggen dat niet makkelijk was.",
      "what_b_may_hear": "Jij hoorde het, zonder weg te lopen.",
      "what_each_protects": "Beiden willen jullie de nabijheid beschermen — door er juist over te praten.",
      "shared_chance": "Dit gesprek is het begin, niet het einde.",
      "shared_challenge": "Maak het een gewoonte, geen uitzondering.",
      "shared_experiment": "Stel elkaar één keer per maand de vraag: 'Wat heb jij op dit moment nodig van onze intimiteit?'"
    }
  }
},

# ── TENSION ───────────────────────────────────────────────────────────────

"D8_TENSION_001": {
  "questions": [
    {
      "question_id": "D8_TENSION_001_Q1",
      "step": "reaction",
      "prompt": "Er is verschil in verlangen tussen jullie. De één wil meer, de ander minder. Wat doet dat met jou?",
      "helper_text": "Kies wat het meest herkenbaar is.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Ik voel me afgewezen, ook al weet ik dat het niet persoonlijk is", "tags": {"sensitive_points.rejection": 2, "patterns.catastrophizing": 1}},
        {"option_id": "B", "label": "Ik voel me schuldig omdat ik minder wil", "tags": {"patterns.pleasing": 2, "sensitive_points.not_good_enough": 1}},
        {"option_id": "C", "label": "Ik trek me terug om geen druk te leggen", "tags": {"protections.withdrawal": 2, "needs.safety": 1}},
        {"option_id": "D", "label": "Ik probeer het gesprek te vermijden want het loopt toch vast", "tags": {"patterns.avoidance": 2, "protections.distancing": 1}}
      ]
    },
    {
      "question_id": "D8_TENSION_001_Q2",
      "step": "interpretation",
      "prompt": "Als de ander minder wil dan jij — wat vertel jij jezelf dan?",
      "helper_text": "Kies de interpretatie die het meest klopt.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Ik ben niet aantrekkelijk genoeg", "tags": {"sensitive_points.not_good_enough": 2, "sensitive_points.rejection": 2}},
        {"option_id": "B", "label": "Er is iets mis met onze relatie", "tags": {"patterns.catastrophizing": 2, "needs.stability": 1}},
        {"option_id": "C", "label": "De ander heeft het gewoon druk of is moe", "tags": {"skills.empathy": 2, "needs.connection": 1}},
        {"option_id": "D", "label": "Ik weet het niet — en dat maakt het moeilijker", "tags": {"needs.safety": 2, "patterns.hypervigilance": 1}}
      ]
    }
  ],
  "outputs": {
    "solo": {
      "mirror": "Verschil in verlangen is geen maatstaf voor liefde — maar het voelt soms wel zo.",
      "protection_reflection": "Je interpretatie ('ik ben niet aantrekkelijk') beschermt je: als jij het probleem bent, is er tenminste een verklaring.",
      "need_reflection": "Jij verlangt naar verbinding — en nabijheid is één van de wegen waarop jij dat voelt.",
      "chance": "Het gesprek gaat niet over frequentie, maar over wat ieder nodig heeft om zich gewenst te voelen.",
      "challenge": "Houd de interpretatie uit de situatie: minder verlangen is zelden afwijzing.",
      "experiment": "Vraag de ander: 'Wanneer voel jij je het meest dicht bij mij?' Luister zonder te verdedigen.",
      "gentle_phrase": "Verschil in verlangen is menselijk — het vraagt gesprek, geen conclusies."
    },
    "couple": {
      "comparison_intro": "Jullie willen allebei nabijheid — maar de behoefte zit op een andere plek of een ander moment.",
      "what_a_may_hear": "Jij mist nabijheid en vertaalt dat al snel naar iets over jezelf.",
      "what_b_may_hear": "Jij wil ook nabijheid, maar dan zonder druk of verwachting.",
      "what_each_protects": "De een beschermt zichzelf door te vragen. De ander door ruimte te houden.",
      "shared_chance": "Jullie kunnen samen onderzoeken: wanneer voelt nabijheid voor ieder van ons goed?",
      "shared_challenge": "Praat over de behoefte achter het verlangen.",
      "shared_experiment": "Maak twee lijstjes: 'wanneer voel ik me dicht bij jou?' — vergelijk ze."
    }
  }
},

"D8_TENSION_002": {
  "questions": [
    {
      "question_id": "D8_TENSION_002_Q1",
      "step": "emotion",
      "prompt": "Je partner zegt 'nu niet'. Misschien is het vermoeidheid of stress. Maar wat voel jij meteen?",
      "helper_text": "Kies wat het dichtst bij de eerste pijn zit.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Teleurstelling die snel overgaat in afwijzing", "tags": {"sensitive_points.rejection": 2, "patterns.catastrophizing": 1}},
        {"option_id": "B", "label": "Een steek — 'wil hij/zij me eigenlijk wel?'", "tags": {"sensitive_points.rejection": 2, "sensitive_points.not_good_enough": 1}},
        {"option_id": "C", "label": "Ik snap het rationeel, maar emotioneel doet het pijn", "tags": {"needs.recognition": 1, "sensitive_points.rejection": 1}},
        {"option_id": "D", "label": "Ik trek me terug en zeg er niks meer over", "tags": {"protections.withdrawal": 2, "patterns.avoidance": 1}}
      ]
    },
    {
      "question_id": "D8_TENSION_002_Q2",
      "step": "interpretation",
      "prompt": "Op het moment van afwijzing — welke gedachte flitst er door je hoofd?",
      "helper_text": "Kies de meest herkenbare.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "'Ben ik nog gewenst?'", "tags": {"sensitive_points.rejection": 2, "sensitive_points.not_good_enough": 2}},
        {"option_id": "B", "label": "'Wat doe ik fout?'", "tags": {"sensitive_points.not_good_enough": 2, "patterns.self_blame": 1}},
        {"option_id": "C", "label": "'Dit gaat de verkeerde kant op'", "tags": {"patterns.catastrophizing": 2, "needs.stability": 1}},
        {"option_id": "D", "label": "'Ik ga er niet meer om vragen'", "tags": {"protections.withdrawal": 2, "protections.distancing": 1}}
      ]
    }
  ],
  "outputs": {
    "solo": {
      "mirror": "'Nu niet' is een moment — maar jouw pijn is groter dan dat moment. Dat vertelt iets over wat je nodig hebt.",
      "protection_reflection": "De gedachte 'ben ik gewenst?' beschermt je: als je het antwoord kent, weet je tenminste waar je staat.",
      "need_reflection": "Jij wil je gewenst weten — niet alleen in actie, maar ook in woorden.",
      "chance": "Onderscheid maken: dit moment versus wat dit moment voor jou symboliseert.",
      "challenge": "Vraag door, in plaats van je terug te trekken.",
      "experiment": "Zeg: 'Ik hoor dat het nu niet lukt. Kun je me later laten weten wanneer wel?' — en wacht op dat antwoord.",
      "gentle_phrase": "Een 'nu niet' gaat over timing, niet over mijn waarde."
    },
    "couple": {
      "comparison_intro": "Een 'nu niet' triggert meer dan het lijkt. Beiden reageren op eigen manier.",
      "what_a_may_hear": "Jij hoort 'nu niet' als afwijzing van wie je bent — terwijl het gaat over timing.",
      "what_b_may_hear": "Jij zei 'nu niet' — en zag misschien niet hoeveel dat betekende voor de ander.",
      "what_each_protects": "De een beschermt zichzelf door te reageren vanuit pijn. De ander door ruimte te vragen.",
      "shared_chance": "Een 'nu niet' kan liefdevol zijn — als er ook een 'wanneer dan?' bij komt.",
      "shared_challenge": "Maak het gewoon om even uit te leggen: 'niet nu, maar wel straks'.",
      "shared_experiment": "Spreek een woord af voor 'ik heb even ruimte nodig, maar ik ben er wel' — zodat het minder als afwijzing voelt."
    }
  }
},

"D8_TENSION_003": {
  "questions": [
    {
      "question_id": "D8_TENSION_003_Q1",
      "step": "reaction",
      "prompt": "Een aanraking of hint roept spanning op. Je lichaam sluit eerder dan je hart wil. Wat doe jij dan?",
      "helper_text": "Kies de reactie die het meest herkenbaar is.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Ik doe mee maar voel me niet echt aanwezig", "tags": {"protections.compliance": 2, "patterns.pleasing": 1}},
        {"option_id": "B", "label": "Ik zeg niks maar mijn lichaam zegt nee", "tags": {"protections.withdrawal": 2, "needs.safety": 1}},
        {"option_id": "C", "label": "Ik zeg dat het nu niet zo goed uitkomt", "tags": {"skills.communication": 2, "needs.safety": 1}},
        {"option_id": "D", "label": "Ik word geïrriteerd en de ander snapt niet waarom", "tags": {"patterns.escalation": 1, "protections.distancing": 2}}
      ]
    },
    {
      "question_id": "D8_TENSION_003_Q2",
      "step": "protection",
      "prompt": "Jouw lichaam reageert met spanning voor je hoofd de kans krijgt. Wat beschermt dat?",
      "helper_text": "Kies wat het meest resoneert.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Mijn grens — ik wil niet moeten als ik niet wil", "tags": {"needs.freedom": 2, "needs.safety": 1}},
        {"option_id": "B", "label": "Mezelf — nabijheid voelt soms te groot", "tags": {"protections.distancing": 2, "needs.safety": 1}},
        {"option_id": "C", "label": "Iets uit het verleden dat ik nog niet helemaal heb verwerkt", "tags": {"sensitive_points.old_wound": 2, "needs.safety": 1}},
        {"option_id": "D", "label": "Mijn eigen ritme — ik heb tijd nodig voordat ik open kan", "tags": {"needs.freedom": 2, "needs.stability": 1}}
      ]
    }
  ],
  "outputs": {
    "solo": {
      "mirror": "Jouw lichaam spreekt zijn eigen taal. De spanning die opkomt is niet slecht — het is informatie.",
      "protection_reflection": "Het lichaam heeft geleerd om te beschermen. Dat kan oud zijn. Het betekent niet dat de ander gevaarlijk is.",
      "need_reflection": "Jij hebt behoefte aan ritme en ruimte — nabijheid op jouw moment, niet op verzoek.",
      "chance": "Leren onderscheiden: is dit spanning van nu, of een oud alarm?",
      "challenge": "Zeg hardop wat je lichaam voelt — zonder er een verklaring bij te geven.",
      "experiment": "Zeg: 'Mijn lichaam heeft even ruimte nodig' — in plaats van 'nu niet' zonder meer.",
      "gentle_phrase": "Mijn lichaam weet iets. Ik hoef het niet te negeren én niet te gehoorzamen."
    },
    "couple": {
      "comparison_intro": "Eén van jullie voelt spanning bij aanraking. De ander begrijpt misschien niet waarom.",
      "what_a_may_hear": "Jouw lichaam communiceert — maar de boodschap komt niet altijd duidelijk over.",
      "what_b_may_hear": "Jij ervaart de reactie van de ander — en vraagt je af wat het over jou zegt.",
      "what_each_protects": "De een beschermt eigen ruimte. De ander beschermt de verbinding.",
      "shared_chance": "Jullie kunnen een taal ontwikkelen: 'ik heb nu even ruimte nodig' is geen afwijzing.",
      "shared_challenge": "Maak de spanning bespreekbaar voor ze een kloof wordt.",
      "shared_experiment": "Praat buiten het moment: wanneer voel jij je het meest vrij om dichtbij te komen?"
    }
  }
},

"D8_TENSION_004": {
  "questions": [
    {
      "question_id": "D8_TENSION_004_Q1",
      "step": "reaction",
      "prompt": "Er is verschil of gemis rond intimiteit, maar er wordt niet over gesproken. Hoe merk jij dat bij jezelf?",
      "helper_text": "Kies wat het meest herkenbaar is.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Ik vul in wat de ander denkt of wil — en dat klopt waarschijnlijk niet", "tags": {"patterns.hypervigilance": 2, "protections.control": 1}},
        {"option_id": "B", "label": "Er groeit een stille afstand die we allebei voelen maar niet benoemen", "tags": {"patterns.avoidance": 2, "protections.distancing": 1}},
        {"option_id": "C", "label": "Ik word stiller en hoop dat de ander het oppikt", "tags": {"protections.withdrawal": 2, "patterns.passive_communication": 1}},
        {"option_id": "D", "label": "Ik stel het steeds uit — het goede moment komt nooit", "tags": {"patterns.avoidance": 2, "needs.safety": 1}}
      ]
    },
    {
      "question_id": "D8_TENSION_004_Q2",
      "step": "interpretation",
      "prompt": "Als het gesprek uitblijft — wat vult jij dan in over de ander of over jullie relatie?",
      "helper_text": "Kies de meest herkenbare gedachte.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Dat het hem/haar gewoon niet interesseert", "tags": {"patterns.catastrophizing": 2, "sensitive_points.rejection": 1}},
        {"option_id": "B", "label": "Dat we nooit goed over dit onderwerp kunnen praten", "tags": {"patterns.catastrophizing": 2, "needs.stability": 1}},
        {"option_id": "C", "label": "Dat ik het zelf moet oplossen of aanpassen", "tags": {"patterns.self_blame": 2, "protections.compliance": 1}},
        {"option_id": "D", "label": "Dat het gesprek te groot of te gevaarlijk voelt om te beginnen", "tags": {"needs.safety": 2, "protections.avoidance": 1}}
      ]
    }
  ],
  "outputs": {
    "solo": {
      "mirror": "Wat niet gezegd wordt, wordt ingevuld. En invullen gaat zelden ten goede.",
      "protection_reflection": "Het uitstellen van dit gesprek beschermt je voor het onbekende antwoord.",
      "need_reflection": "Jij wil verbinding — en vermijding houdt die op afstand, hoe goed bedoeld ook.",
      "chance": "Een klein begin is genoeg: 'Ik merk dat we hier weinig over praten.' Dat is al een gesprek.",
      "challenge": "Wacht niet op het perfecte moment — dat komt niet.",
      "experiment": "Zeg vanavond één zin: 'Ik wil graag een keer praten over hoe het gaat met ons op dit vlak.' Meer niet.",
      "gentle_phrase": "Het gesprek hoeft niet groot te zijn om iets te openen."
    },
    "couple": {
      "comparison_intro": "Jullie weten allebei dat er iets is — maar het gesprek blijft hangen.",
      "what_a_may_hear": "Jij vult in, en dat wat je invult voelt steeds zwaarder.",
      "what_b_may_hear": "Jij vermijdt ook — misschien uit een andere angst.",
      "what_each_protects": "Beiden beschermen jullie je voor een gesprek dat te groot of te kwetsbaar lijkt.",
      "shared_chance": "Het gesprek zelf hoeft niet alles op te lossen — alleen de stilte te doorbreken.",
      "shared_challenge": "Spreek af: we praten hier een keer over, zonder conclusies.",
      "shared_experiment": "Plan tien minuten — geen oplossingen, alleen vragen stellen."
    }
  }
},

# ── DEEP ──────────────────────────────────────────────────────────────────

"D8_DEEP_001": {
  "questions": [
    {
      "question_id": "D8_DEEP_001_Q1",
      "step": "sensitive_point",
      "prompt": "Onder de vraag 'voel ik me gewenst?' liggen vaak diepere gevoelens. Welk woord raakt jou het meest?",
      "helper_text": "Kies het meest kwetsbare.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Aantrekkelijk — vind jij me nog mooi, begeerlijk?", "tags": {"sensitive_points.not_good_enough": 2, "sensitive_points.rejection": 2}},
        {"option_id": "B", "label": "Gekozen — wil je mij, of doe je het uit gewoonte?", "tags": {"sensitive_points.rejection": 2, "needs.recognition": 2}},
        {"option_id": "C", "label": "Welkom — hoor ik er echt bij voor jou?", "tags": {"sensitive_points.not_belonging": 2, "needs.connection": 2}},
        {"option_id": "D", "label": "Gezien — zie jij mij nog, of ben ik gewoon deel van de routine?", "tags": {"sensitive_points.not_seen": 2, "needs.recognition": 2}}
      ]
    },
    {
      "question_id": "D8_DEEP_001_Q2",
      "step": "emotion",
      "prompt": "Als jij je niet gewenst voelt — wat wil je dan het liefst van de ander horen of zien?",
      "helper_text": "Kies wat het diepst resoneert.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Dat hij/zij initiatief neemt — mij zoekt", "tags": {"needs.connection": 2, "needs.recognition": 2}},
        {"option_id": "B", "label": "Dat hij/zij zegt dat ik er voor hem/haar toe doe", "tags": {"needs.recognition": 3, "needs.connection": 1}},
        {"option_id": "C", "label": "Een aanraking die niet vraagt, maar gewoon geeft", "tags": {"needs.connection": 2, "needs.safety": 2}},
        {"option_id": "D", "label": "Het gesprek — samen kunnen zeggen wat er is", "tags": {"skills.vulnerability": 2, "needs.connection": 2}}
      ]
    }
  ],
  "outputs": {
    "solo": {
      "mirror": "Niet gewenst voelen raakt verder dan het moment. Het raakt de vraag: ben ik genoeg?",
      "protection_reflection": "Als je je niet gewenst voelt, bescherm je jezelf soms door minder te vragen — zodat je minder kunt verliezen.",
      "need_reflection": "Jij verlangt ernaar gezien, gekozen en gewelkomd te worden — in je lichaam en in je bestaan.",
      "chance": "Dit gevoel kun je niet oplossen door minder te verlangen. Het vraagt gesprek.",
      "challenge": "Zeg het: 'Ik merk dat ik me soms niet gewenst voel.' Ook al voelt het groot.",
      "experiment": "Vertel de ander één woord dat je nodig hebt — 'aanraking', 'bevestiging', 'initiatief'. Eén woord is genoeg.",
      "gentle_phrase": "Verlangen naar gewenst zijn is geen zwakte — het is menselijk."
    },
    "couple": {
      "comparison_intro": "Dit is een diep gevoel. Het vraagt om een gesprek, niet om een oplossing.",
      "what_a_may_hear": "Jij draagt iets mee dat groot is — de vraag of je echt gewenst bent.",
      "what_b_may_hear": "Jij bent er — maar misschien zie je niet altijd hoe hard de ander zoekt naar jouw bevestiging.",
      "what_each_protects": "De een beschermt het verlangen. De ander beschermt misschien zichzelf voor de druk.",
      "shared_chance": "Dit gesprek kan de relatie dieper maken.",
      "shared_challenge": "Luister naar wat er echt achter de woorden zit.",
      "shared_experiment": "Zeg om beurten: 'Ik voel me het meest gewenst als jij...' Luister zonder te reageren."
    }
  }
},

"D8_DEEP_002": {
  "questions": [
    {
      "question_id": "D8_DEEP_002_Q1",
      "step": "sensitive_point",
      "prompt": "Er zijn dingen over je lichaam, verlangen of verleden die je niet makkelijk zegt. Wat houdt je het meest tegen?",
      "helper_text": "Kies de meest herkenbare blokkade.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Angst dat de ander mij anders gaat zien", "tags": {"sensitive_points.shame": 2, "sensitive_points.rejection": 2}},
        {"option_id": "B", "label": "Schaamte voor mijn lichaam of verleden", "tags": {"sensitive_points.shame": 3, "sensitive_points.not_good_enough": 2}},
        {"option_id": "C", "label": "Niet weten hoe ik het moet zeggen", "tags": {"needs.safety": 1, "skills.communication": 1}},
        {"option_id": "D", "label": "Dat het kwetsbaar maakt en dan pijn kan doen", "tags": {"protections.distancing": 2, "needs.safety": 2}}
      ]
    },
    {
      "question_id": "D8_DEEP_002_Q2",
      "step": "need",
      "prompt": "Wat heb jij nodig om je veilig genoeg te voelen om dat toch te delen?",
      "helper_text": "Kies het meest essentiële.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "De zekerheid dat de ander me niet veroordeelt", "tags": {"needs.safety": 2, "needs.recognition": 2}},
        {"option_id": "B", "label": "Weten dat hij/zij ook iets kwetsbaars deelt", "tags": {"needs.safety": 2, "skills.vulnerability": 1}},
        {"option_id": "C", "label": "Kleine stappen — niet alles tegelijk", "tags": {"needs.safety": 2, "needs.stability": 1}},
        {"option_id": "D", "label": "Genoeg ruimte en tijd om het op mijn manier te zeggen", "tags": {"needs.freedom": 2, "needs.safety": 1}}
      ]
    }
  ],
  "outputs": {
    "solo": {
      "mirror": "Schaamte rond het lichaam of verlangen zit diep. Het is geleerd — en het kan ook worden ongeleerd.",
      "protection_reflection": "Schaamte beschermt je voor afwijzing. Maar het houdt ook de echte nabijheid buiten.",
      "need_reflection": "Jij verlangt naar nabijheid én bescherming tegelijk. Beide zijn geldig.",
      "chance": "Je hoeft niet alles te delen. Maar één klein eerlijk ding kan al lucht geven.",
      "challenge": "Zeg één zin over jezelf die je normaal nooit hardop zegt — aan jezelf of aan de ander.",
      "experiment": "Schrijf wat je moeilijk vindt om te zeggen. Je hoeft het nog niet te delen. Maar schrijf het.",
      "gentle_phrase": "Ik mag zijn wie ik ben, ook in de ruimte van intimiteit."
    },
    "couple": {
      "comparison_intro": "Dit is de diepste laag van intimiteit: durven zijn wie je bent, ook waar je je schaamt.",
      "what_a_may_hear": "Jij draagt iets mee dat groot voelt — en nog niet gezegd is.",
      "what_b_may_hear": "Jij bent er. Je kunt een plek zijn waar dit welkom is.",
      "what_each_protects": "De een beschermt zichzelf voor schaamte en afwijzing. De ander beschermt misschien onbewust de eigen comfort.",
      "shared_chance": "Echte intimiteit groeit als je ook de kwetsbare delen welkom maakt.",
      "shared_challenge": "Maak het veilig voor de ander om iets te zeggen dat moeilijk is.",
      "shared_experiment": "Begin met: 'Er is iets dat ik eigenlijk nog nooit hardop heb gezegd.' Zeg het. Luister. Reageer met: 'Dank je.'"
    }
  }
}

} # end D8_CASES

# ── Update cases.json ──────────────────────────────────────────────────────

with open('cases.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

updated = 0
for c in data['cases']:
    dom = c.get('domain', {})
    did = dom.get('domain_id') if isinstance(dom, dict) else dom
    cid = c['case_id']
    if did == 'D8' and cid in D8_CASES:
        c['questions'] = D8_CASES[cid]['questions']
        c['outputs']   = D8_CASES[cid]['outputs']
        print('Updated:', cid)
        updated += 1

with open('cases.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f'\nDone! Updated {updated} D8 cases.')
