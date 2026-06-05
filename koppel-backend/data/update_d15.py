import json, sys
sys.stdout.reconfigure(encoding='utf-8')

D15_CASES = {

# ── POSITIVE ──────────────────────────────────────────────────────────────

"D15_POSITIVE_001": {
  "questions": [
    {
      "question_id": "D15_POSITIVE_001_Q1",
      "step": "emotion",
      "prompt": "Je bent verdrietig of murw. De ander zegt niet veel — maar blijft. Geen oplossing, geen advies. Gewoon aanwezig. Wat doet dat met jou?",
      "helper_text": "Kies de emotie die het meest klopt.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Troost — dit is precies wat ik nodig had zonder het te weten", "tags": {"needs.safety": 2, "needs.connection": 2}},
        {"option_id": "B", "label": "Ontroering — dat hij/zij er gewoon is, zonder woorden", "tags": {"needs.connection": 2, "needs.recognition": 1}},
        {"option_id": "C", "label": "Verlichting — ik hoef het niet uit te leggen of op te lossen", "tags": {"needs.safety": 2, "needs.freedom": 1}},
        {"option_id": "D", "label": "Kwetsbaar maar veilig — ik kan neervallen en word opgevangen", "tags": {"needs.safety": 2, "needs.connection": 2}}
      ]
    },
    {
      "question_id": "D15_POSITIVE_001_Q2",
      "step": "need",
      "prompt": "Wat heb jij nodig van een ander als je pijn draagt — wat helpt jou het meest?",
      "helper_text": "Kies wat het meest resoneert.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Aanwezigheid zonder agenda — er zijn zonder iets te willen doen", "tags": {"needs.safety": 2, "needs.connection": 2}},
        {"option_id": "B", "label": "Dat hij/zij mijn verdriet niet probeert weg te nemen", "tags": {"needs.recognition": 2, "needs.safety": 1}},
        {"option_id": "C", "label": "Een hand, een arm, lichamelijke nabijheid zonder woorden", "tags": {"needs.connection": 2, "needs.safety": 1}},
        {"option_id": "D", "label": "Weten dat ik er niet alleen voor sta — nu niet", "tags": {"needs.safety": 2, "needs.connection": 2}}
      ]
    }
  ],
  "outputs": {
    "solo": {
      "mirror": "Aanwezig zijn zonder iets te willen fixen is een van de moeilijkste en mooiste dingen die iemand kan doen.",
      "protection_reflection": "Als je moeite hebt met stilte bij andermans pijn, beschermt dat je voor hulpeloosheid. Maar soms is stilte het meest helende.",
      "need_reflection": "Jij wil niet opgeknapt worden — je wil niet alleen zijn in je pijn.",
      "chance": "Leer je partner kennen in hoe hij/zij troost — het is misschien anders dan jij troost geeft.",
      "challenge": "Accepteer aanwezigheid zonder er meer van te vragen.",
      "experiment": "Vertel de ander één keer: 'Wat ik nodig heb als ik pijn draag is...' — maak het concreet.",
      "gentle_phrase": "Jij hoeft niks te doen. Gewoon hier zijn is genoeg."
    },
    "couple": {
      "comparison_intro": "Stil aanwezig zijn is een taal op zich — en niet iedereen spreekt hem vanzelf.",
      "what_a_may_hear": "Jij had verdriet — en voelde dat je niet alleen was.",
      "what_b_may_hear": "Jij bleef — zonder woorden. Dat was meer dan je misschien weet.",
      "what_each_protects": "De een beschermt zichzelf door aanwezig te blijven. De ander beschermt zichzelf door te ontvangen.",
      "shared_chance": "Stille aanwezigheid is fundament — het bouwt vertrouwen dat woorden niet kunnen.",
      "shared_challenge": "Leer van elkaar hoe je getroost wil worden — het is niet voor iedereen hetzelfde.",
      "shared_experiment": "Vertel elkaar: als ik pijn draag, helpt het me het meest als jij..."
    }
  }
},

"D15_POSITIVE_002": {
  "questions": [
    {
      "question_id": "D15_POSITIVE_002_Q1",
      "step": "reaction",
      "prompt": "Jullie noemen samen een naam, verhaal of moment dat met verlies verbonden is. Er wordt gelachen of gehuild. Hoe voelt het als verlies een plek krijgt tussen jullie?",
      "helper_text": "Kies wat het meest klopt.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Helend — het verlies verdwijnt niet maar hoeft niet meer verstopt", "tags": {"needs.connection": 2, "skills.vulnerability": 2}},
        {"option_id": "B", "label": "Verbindend — iets wat zwaar was wordt gedeeld", "tags": {"needs.connection": 2, "needs.recognition": 1}},
        {"option_id": "C", "label": "Kwetsbaar maar goed — dit is intiem op een manier die ik niet verwacht had", "tags": {"skills.vulnerability": 2, "needs.safety": 1}},
        {"option_id": "D", "label": "Verdrietig maar lichter — alsof ik het even neer kan zetten", "tags": {"needs.safety": 2, "needs.connection": 1}}
      ]
    },
    {
      "question_id": "D15_POSITIVE_002_Q2",
      "step": "need",
      "prompt": "Wat heb jij nodig om herinneringen aan verlies te kunnen delen — zonder dat het te zwaar of te stil wordt?",
      "helper_text": "Kies het meest essentiële.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Dat de ander het niet probeert op te lossen of te nuanceren", "tags": {"needs.safety": 2, "needs.recognition": 1}},
        {"option_id": "B", "label": "Dat hij/zij zelf ook iets deelt — zodat het wederzijds is", "tags": {"needs.connection": 2, "skills.vulnerability": 1}},
        {"option_id": "C", "label": "Een moment dat rustig genoeg is — geen haast", "tags": {"needs.safety": 2, "needs.stability": 1}},
        {"option_id": "D", "label": "Weten dat het verdriet welkom is — ook als het onverwacht komt", "tags": {"needs.safety": 2, "needs.connection": 1}}
      ]
    }
  ],
  "outputs": {
    "solo": {
      "mirror": "Een naam noemen, een verhaal delen — dat is een van de diepste vormen van herdenken.",
      "protection_reflection": "Als je verlies stil draagt, beschermt dat anderen voor jouw pijn. Maar het maakt jou ook eenzamer.",
      "need_reflection": "Jij wil dat je verlies er mag zijn — ook in de relatie, niet alleen in jezelf.",
      "chance": "Verlies dat gedeeld wordt, hoeft minder alleen gedragen te worden.",
      "challenge": "Noem de naam of het moment — ook als het moeilijk is.",
      "experiment": "Vertel je partner één verhaal over iemand of iets wat je verloren hebt. Kijk wat er dan gebeurt.",
      "gentle_phrase": "Herinneringen aan verlies mogen een plek hebben tussen ons."
    },
    "couple": {
      "comparison_intro": "Verlies samen benoemen maakt het kleiner en groter tegelijk — kleiner omdat je het deelt, groter omdat het erkend wordt.",
      "what_a_may_hear": "Jij droeg iets — en durfde het te noemen.",
      "what_b_may_hear": "Jij hoorde het — en gaf het een plek.",
      "what_each_protects": "De een beschermt het verlies door het te delen. De ander beschermt de ander door te luisteren.",
      "shared_chance": "Gedeeld verlies bouwt een laag in de relatie die dieper gaat dan geluk.",
      "shared_challenge": "Maak ruimte voor herinneringen — ook als het niet het goede moment lijkt.",
      "shared_experiment": "Vertel elkaar één verhaal over verlies dat de ander nog niet kent. Luister."
    }
  }
},

"D15_POSITIVE_003": {
  "questions": [
    {
      "question_id": "D15_POSITIVE_003_Q1",
      "step": "emotion",
      "prompt": "Er is pijn of verlies. De ander kookt, regelt, rijdt of ruimt op — zonder dat je hoeft te vragen. Wat voel jij bij die concrete zorg?",
      "helper_text": "Kies de emotie die het meest klopt.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Dankbaarheid die dieper gaat dan het gebaar", "tags": {"needs.recognition": 2, "needs.connection": 2}},
        {"option_id": "B", "label": "Opluchting — ik hoef even nergens aan te denken", "tags": {"needs.safety": 2, "needs.stability": 1}},
        {"option_id": "C", "label": "Ontroering — hij/zij ziet wat ik nodig heb", "tags": {"needs.recognition": 2, "needs.connection": 2}},
        {"option_id": "D", "label": "Ongemak — ik weet niet goed hoe ik dit moet ontvangen", "tags": {"sensitive_points.shame": 1, "needs.recognition": 1}}
      ]
    },
    {
      "question_id": "D15_POSITIVE_003_Q2",
      "step": "need",
      "prompt": "Praktische zorg ontvangen als je pijn draagt — wat maakt dat voor jou betekenisvol?",
      "helper_text": "Kies het meest essentiële.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Dat ik het niet hoef te vragen — dat de ander het ziet", "tags": {"needs.recognition": 2, "needs.safety": 2}},
        {"option_id": "B", "label": "Dat kleine dingen zeggen: je hoeft dit niet alleen te dragen", "tags": {"needs.connection": 2, "needs.safety": 2}},
        {"option_id": "C", "label": "Dat ik even mag stoppen met sterk zijn", "tags": {"needs.safety": 2, "needs.freedom": 1}},
        {"option_id": "D", "label": "Dat liefde ook praktisch kan zijn — niet alleen gevoelsmatig", "tags": {"needs.connection": 2, "skills.values_alignment": 1}}
      ]
    }
  ],
  "outputs": {
    "solo": {
      "mirror": "Zorg ontvangen is soms moeilijker dan zorg geven. Dat jij het toeliet, is al iets.",
      "protection_reflection": "Ongemak bij ontvangen beschermt je voor afhankelijkheid — maar het houdt ook verbinding op afstand.",
      "need_reflection": "Jij wil niet alles alleen hoeven dragen — ook al lijkt het soms makkelijker.",
      "chance": "Praktische liefde is net zo echt als emotionele liefde — misschien meer voelbaar.",
      "challenge": "Ontvang het zonder het weg te relativeren of er meteen iets tegenover te stellen.",
      "experiment": "Zeg het hardop als je geholpen bent: 'Dit deed me goed.' Niet meer dan dat.",
      "gentle_phrase": "Geholpen worden is ook een daad van vertrouwen."
    },
    "couple": {
      "comparison_intro": "Praktische zorg is een taal van liefde — en ze klinkt het luidst als woorden tekort schieten.",
      "what_a_may_hear": "Jij ontving zorg — en dat was meer dan een handeling.",
      "what_b_may_hear": "Jij gaf zorg — zonder woorden, maar met aanwezigheid.",
      "what_each_protects": "De een beschermt de ander door te doen. De ander beschermt de verbinding door te ontvangen.",
      "shared_chance": "Praktische liefde in moeilijke tijden bouwt een fundament dat lang blijft.",
      "shared_challenge": "Zeg het expliciet: 'Ik zie wat jij doet — en ik ben dankbaar.'",
      "shared_experiment": "Vertel elkaar: hoe zie jij het liefst dat iemand voor je zorgt als het moeilijk is?"
    }
  }
},

"D15_POSITIVE_004": {
  "questions": [
    {
      "question_id": "D15_POSITIVE_004_Q1",
      "step": "reaction",
      "prompt": "Een moeilijke periode legt bloot wat echt telt. Sommige dingen worden minder belangrijk, andere helderder. Hoe reageer jij op die helderheid?",
      "helper_text": "Kies wat het meest klopt.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Dankbaar — ik zie nu wat ik eerder niet zag", "tags": {"skills.insight": 2, "needs.connection": 1}},
        {"option_id": "B", "label": "Verdrietig én helder tegelijk — pijn en inzicht tegelijk", "tags": {"sensitive_points.grief": 1, "skills.insight": 2}},
        {"option_id": "C", "label": "Vastbesloten — ik ga leven naar wat echt telt", "tags": {"skills.agency": 2, "skills.values_alignment": 2}},
        {"option_id": "D", "label": "Voorzichtig — ik wil dit inzicht vasthouden, maar weet dat het kan vervagen", "tags": {"needs.stability": 2, "skills.insight": 1}}
      ]
    },
    {
      "question_id": "D15_POSITIVE_004_Q2",
      "step": "need",
      "prompt": "Wat heeft deze moeilijke periode jou laten zien wat echt telt — in jullie relatie of in je leven?",
      "helper_text": "Kies wat het meest resoneert.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Dat aanwezigheid meer waard is dan prestatie", "tags": {"needs.connection": 2, "skills.values_alignment": 2}},
        {"option_id": "B", "label": "Dat de relatie de drager is van alles — als die goed is, is er fundament", "tags": {"needs.connection": 2, "needs.stability": 2}},
        {"option_id": "C", "label": "Dat ik dingen te lang uitgesteld heb die ik nu wil doen", "tags": {"skills.agency": 2, "needs.freedom": 1}},
        {"option_id": "D", "label": "Dat kleine dingen het leven zijn — niet de grote momenten", "tags": {"needs.connection": 2, "skills.values_alignment": 2}}
      ]
    }
  ],
  "outputs": {
    "solo": {
      "mirror": "Pijn die helderheid brengt is een van de paradoxen van het leven — en een kostbaar geschenk.",
      "protection_reflection": "Voorzichtig zijn met inzicht beschermt je voor teleurstelling als het vervagt. Maar het kan ook het inzicht klein houden.",
      "need_reflection": "Jij wil leven naar wat echt telt — niet alleen erover nadenken.",
      "chance": "Dit inzicht is het waard om vast te houden — bewust.",
      "challenge": "Benoem één concrete verandering die je wil maken op basis van dit inzicht.",
      "experiment": "Schrijf op: wat heeft deze periode jou laten zien? Lees het over een maand terug.",
      "gentle_phrase": "Pijn kan niet alles goed maken — maar wel laten zien wat echt telt."
    },
    "couple": {
      "comparison_intro": "Moeilijke perioden openen ogen — en dat kunnen jullie samen vasthouden.",
      "what_a_may_hear": "Jij ziet nu iets wat je eerder niet zag — en wil er iets mee doen.",
      "what_b_may_hear": "Jij ook — misschien met andere woorden, maar hetzelfde verlangen.",
      "what_each_protects": "De een beschermt inzicht door het vast te houden. De ander beschermt de relatie door het te delen.",
      "shared_chance": "Inzicht dat gedeeld wordt, wordt gedragen — en verandert meer.",
      "shared_challenge": "Benoem samen wat deze periode jullie heeft laten zien.",
      "shared_experiment": "Schrijf elk één zin: 'Wat deze periode mij het meest leerde over ons is...' Deel en bespreek."
    }
  }
},

# ── TENSION ───────────────────────────────────────────────────────────────

"D15_TENSION_001": {
  "questions": [
    {
      "question_id": "D15_TENSION_001_Q1",
      "step": "reaction",
      "prompt": "De één wil praten en tranen. De ander wordt stil of praktisch. Jullie overleven elk op eigen manier. Hoe reageer jij als dat verschil voelbaar wordt?",
      "helper_text": "Kies de meest herkenbare reactie.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Ik voel me alleen — alsof ik het pijn-moment niet kan delen", "tags": {"sensitive_points.loneliness": 2, "needs.connection": 2}},
        {"option_id": "B", "label": "Ik begrijp de ander, maar voel toch een steek van afwijzing", "tags": {"skills.empathy": 1, "sensitive_points.rejection": 2}},
        {"option_id": "C", "label": "Ik pas me aan — maar voel me daarin verloren", "tags": {"patterns.pleasing": 2, "needs.recognition": 1}},
        {"option_id": "D", "label": "Ik raak gefrustreerd — dit is niet hoe ik zorg wil ontvangen", "tags": {"needs.recognition": 2, "patterns.escalation": 1}}
      ]
    },
    {
      "question_id": "D15_TENSION_001_Q2",
      "step": "interpretation",
      "prompt": "Als jullie anders omgaan met verlies — wat zeg jij jezelf over de ander?",
      "helper_text": "Kies de meest herkenbare gedachte.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "'Hij/zij rouwt anders — dat wil niet zeggen dat het minder is'", "tags": {"skills.empathy": 2, "needs.connection": 1}},
        {"option_id": "B", "label": "'Hij/zij kan dit niet aan — en dat laat mij alleen'", "tags": {"sensitive_points.loneliness": 2, "patterns.catastrophizing": 1}},
        {"option_id": "C", "label": "'Zijn/haar stilte voelt als afstand terwijl ik nabijheid nodig heb'", "tags": {"sensitive_points.rejection": 2, "needs.connection": 2}},
        {"option_id": "D", "label": "'We hebben nooit geleerd hoe we samen rouwen'", "tags": {"skills.insight": 2, "needs.stability": 1}}
      ]
    }
  ],
  "outputs": {
    "solo": {
      "mirror": "Rouwen is persoonlijk — er is geen goede manier. Maar het verschil in stijl kan pijn voelen als afstand.",
      "protection_reflection": "De ander die stil wordt beschermt zichzelf — niet jou buiten. Maar dat voelt zo niet.",
      "need_reflection": "Jij wil niet alleen zijn in je pijn — ook niet als de ander op een andere manier aanwezig is.",
      "chance": "Begrijpen hoe de ander rouwt is ook een vorm van liefde.",
      "challenge": "Vraag — niet verwijt. 'Hoe ben jij hierin?' opent meer dan 'waarom praat je niet?'",
      "experiment": "Vertel de ander: 'Als ik rouw, helpt het me als jij...' — en vraag hetzelfde terug.",
      "gentle_phrase": "We rouwen allebei — alleen op een andere manier."
    },
    "couple": {
      "comparison_intro": "Rouwen doe je elk op eigen manier — en dat kan afstand voelen als er verbinding nodig is.",
      "what_a_may_hear": "Jij wil woorden en tranen — en voelt je alleen als die er niet zijn.",
      "what_b_may_hear": "Jij wordt stil of praktisch — ook dat is rouw, ook al ziet het er niet zo uit.",
      "what_each_protects": "De een beschermt zichzelf door te praten. De ander door te zwijgen.",
      "shared_chance": "Elkaars rouwstijl leren kennen maakt de volgende pijn minder eenzaam.",
      "shared_challenge": "Vraag naar de manier van rouwen — niet naar het gevoel zelf.",
      "shared_experiment": "Vertel elkaar: hoe ben jij als je pijn draagt? Wat helpt jou? Wat niet?"
    }
  }
},

"D15_TENSION_002": {
  "questions": [
    {
      "question_id": "D15_TENSION_002_Q1",
      "step": "emotion",
      "prompt": "Voor de één moet het leven verder. Voor de ander voelt verdergaan als verraad of is het gewoon onmogelijk. Wat voel jij als dat verschil in tempo er ligt?",
      "helper_text": "Kies de emotie die het meest klopt.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Eenzaamheid — we lopen niet meer gelijk", "tags": {"sensitive_points.loneliness": 2, "needs.connection": 2}},
        {"option_id": "B", "label": "Schuld — ben ik te snel, of is hij/zij te langzaam?", "tags": {"sensitive_points.guilt": 2, "patterns.self_doubt": 1}},
        {"option_id": "C", "label": "Ongeduld met mezelf — ik wil door maar kan niet", "tags": {"patterns.self_blame": 2, "needs.safety": 1}},
        {"option_id": "D", "label": "Onbegrip — ik snap niet hoe de ander dit al loslaat of juist nog niet", "tags": {"skills.empathy": 1, "needs.connection": 1}}
      ]
    },
    {
      "question_id": "D15_TENSION_002_Q2",
      "step": "interpretation",
      "prompt": "Verschil in rouwtempo — wat zegt dat voor jou over jullie?",
      "helper_text": "Kies de meest herkenbare gedachte.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "'We zijn op verschillende plekken — en dat maakt mij eenzaam'", "tags": {"sensitive_points.loneliness": 2, "needs.connection": 1}},
        {"option_id": "B", "label": "'Rouw heeft geen tijdlijn — maar samen staan helpt'", "tags": {"skills.insight": 2, "needs.connection": 1}},
        {"option_id": "C", "label": "'Ik voel druk om te herstellen voor de ander — of om te wachten'", "tags": {"patterns.pleasing": 2, "needs.freedom": 1}},
        {"option_id": "D", "label": "'Dit test onze verbinding op een manier die ik niet had voorzien'", "tags": {"needs.stability": 2, "needs.connection": 1}}
      ]
    }
  ],
  "outputs": {
    "solo": {
      "mirror": "Rouw heeft geen tijdlijn — en het verschil in tempo is geen maatstaf voor liefde.",
      "protection_reflection": "Schuld over je eigen tempo beschermt de ander — maar het remt ook je eigen herstel.",
      "need_reflection": "Jij wil je eigen rouwtempo mogen hebben — zonder dat het de ander pijn doet of jou afwijst.",
      "chance": "Naast elkaar rouwen op eigen tempo is ook samen zijn.",
      "challenge": "Vertel de ander waar jij nu bent — zonder te eisen dat hij/zij op dezelfde plek is.",
      "experiment": "Check in bij de ander: 'Hoe gaat het met jou hierin, vandaag?' — zonder vergelijking.",
      "gentle_phrase": "Jouw tempo is goed. Mijn tempo is goed. We hoeven niet gelijk te lopen."
    },
    "couple": {
      "comparison_intro": "Rouwtempo verschilt — en dat voelt soms als afstand, terwijl jullie allebei bezig zijn met hetzelfde verlies.",
      "what_a_may_hear": "Jij bent al een stap verder — en voelt je misschien schuldig of alleen.",
      "what_b_may_hear": "Jij bent er nog middenin — en voelt je misschien achtergelaten.",
      "what_each_protects": "De een beschermt de toekomst door vooruit te kijken. De ander beschermt het verlies door het vast te houden.",
      "shared_chance": "Naast elkaar rouwen op eigen tempo is ook samen zijn — als jullie dat benoemen.",
      "shared_challenge": "Wacht niet op gelijke gevoelens — check in bij elkaar.",
      "shared_experiment": "Spreek af: eens per week vragen we hoe het gaat met het rouwen — zonder oordeel of vergelijking."
    }
  }
},

"D15_TENSION_003": {
  "questions": [
    {
      "question_id": "D15_TENSION_003_Q1",
      "step": "reaction",
      "prompt": "In verlies grijpt de één naar gebed of hoop. De ander kan dat niet verdragen of voelt woede. Hoe reageer jij als die reacties botsen?",
      "helper_text": "Kies de meest herkenbare reactie.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Ik voel me gemist — mijn manier van omgaan wordt niet begrepen", "tags": {"sensitive_points.not_seen": 2, "needs.recognition": 2}},
        {"option_id": "B", "label": "Ik begrijp de ander maar kan zijn/haar reactie soms moeilijk verdragen", "tags": {"skills.empathy": 1, "needs.safety": 1}},
        {"option_id": "C", "label": "Ik houd mijn manier van omgaan voor mezelf — om conflict te vermijden", "tags": {"protections.withdrawal": 2, "patterns.avoidance": 1}},
        {"option_id": "D", "label": "Ik voel afstand — op het moment dat nabijheid het meest nodig is", "tags": {"sensitive_points.loneliness": 2, "needs.connection": 2}}
      ]
    },
    {
      "question_id": "D15_TENSION_003_Q2",
      "step": "interpretation",
      "prompt": "Als geloofsreacties botsen in verlies — wat is de diepere vraag die dat stelt?",
      "helper_text": "Kies de meest herkenbare gedachte.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "'Mag ik mijn eigen manier van omgaan hebben — ook als die de ander stoort?'", "tags": {"needs.freedom": 2, "needs.recognition": 1}},
        {"option_id": "B", "label": "'Kunnen we samen zijn ook als we de pijn heel anders dragen?'", "tags": {"needs.connection": 2, "needs.stability": 1}},
        {"option_id": "C", "label": "'Waarom doet zijn/haar reactie iets met mij — is dat over mij of over ons?'", "tags": {"skills.insight": 2, "needs.safety": 1}},
        {"option_id": "D", "label": "'Verdeelt pijn ons — of kan het ons ook dichter brengen?'", "tags": {"needs.connection": 2, "skills.insight": 1}}
      ]
    }
  ],
  "outputs": {
    "solo": {
      "mirror": "Hoe je pijn draagt is persoonlijk — en toch raakt het de ander als jullie dat heel anders doen.",
      "protection_reflection": "Je reactie voor jezelf houden beschermt de vrede — maar het maakt je ook eenzamer in je rouw.",
      "need_reflection": "Jij wil je manier van rouwen mogen hebben — ook als die anders is dan die van de ander.",
      "chance": "Respect voor elkaars rouwstijl is ook een vorm van liefde.",
      "challenge": "Zeg het zonder te verdedigen: 'Dit helpt mij — ook al helpt het jou misschien niet.'",
      "experiment": "Vertel de ander: hoe ik omga met verlies is... Dit is waarom het me helpt...",
      "gentle_phrase": "We dragen hetzelfde verlies — op onze eigen manier."
    },
    "couple": {
      "comparison_intro": "Geloofsreacties in verlies botsen soms hard — juist als de pijn het grootst is.",
      "what_a_may_hear": "Jij grijpt naar iets dat jou houvast geeft — en voelt je gemist als dat niet begrepen wordt.",
      "what_b_may_hear": "Jij reageert anders — en voelt je misschien schuldig of buitengesloten.",
      "what_each_protects": "De een beschermt hoop. De ander beschermt eerlijkheid.",
      "shared_chance": "Ruimte voor elkaars rouwstijl maakt de band sterker — zelfs bij verschil.",
      "shared_challenge": "Vraag naar de betekenis achter de reactie — voor je hem beoordeelt.",
      "shared_experiment": "Vertel elkaar: hoe help jij jezelf als je pijn draagt? Luister zonder te beoordelen."
    }
  }
},

"D15_TENSION_004": {
  "questions": [
    {
      "question_id": "D15_TENSION_004_Q1",
      "step": "reaction",
      "prompt": "Rollen verschuiven door ziekte, zorg of verlies — verzorger, patiënt, sterke, breekbare. Hoe merk jij dat in jullie relatie?",
      "helper_text": "Kies de meest herkenbare reactie.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Ik mis de ander zoals hij/zij was — dit voelt als verlies in het verlies", "tags": {"sensitive_points.grief": 2, "needs.connection": 2}},
        {"option_id": "B", "label": "Ik voel mij eenzaam in een nieuwe rol die ik niet koos", "tags": {"sensitive_points.loneliness": 2, "needs.recognition": 1}},
        {"option_id": "C", "label": "Ik doe wat nodig is, maar voel ook moeheid en gemis", "tags": {"patterns.self_sacrifice": 2, "needs.recognition": 1}},
        {"option_id": "D", "label": "Ik weet niet meer hoe we partner zijn als dit zo bepaalt wie we zijn", "tags": {"sensitive_points.identity": 2, "needs.stability": 1}}
      ]
    },
    {
      "question_id": "D15_TENSION_004_Q2",
      "step": "interpretation",
      "prompt": "Als intimiteit verandert door zorg of verlies — wat mist jij het meest?",
      "helper_text": "Kies wat het diepst resoneert.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "De gelijkwaardigheid — even twee mensen naast elkaar, niet naast rollen", "tags": {"needs.fairness": 2, "needs.connection": 2}},
        {"option_id": "B", "label": "De lichtheid — even lachen, spelen, niks hoeven", "tags": {"needs.freedom": 2, "needs.connection": 1}},
        {"option_id": "C", "label": "De vanzelfsprekende nabijheid — die nu niet vanzelf meer komt", "tags": {"needs.connection": 2, "needs.stability": 1}},
        {"option_id": "D", "label": "Gezien worden als mens — niet alleen als zorgverlener of zorgvrager", "tags": {"needs.recognition": 2, "needs.connection": 2}}
      ]
    }
  ],
  "outputs": {
    "solo": {
      "mirror": "Intimiteit veranderen door zorg is een van de stille pijnen — groot, maar zelden benoemd.",
      "protection_reflection": "Doen wat nodig is beschermt de ander — maar als jij nooit ruimte geeft aan je eigen gemis, groeit de uitputting.",
      "need_reflection": "Jij wil ook mens zijn in de relatie — niet alleen rol.",
      "chance": "Kleine momenten van gelijkwaardigheid kunnen de zorgrelatie menselijker maken.",
      "challenge": "Vraag één keer: 'Kunnen we even geen verzorger en patiënt zijn — gewoon even wij?'",
      "experiment": "Plan één moment per week buiten de zorgrollen — hoe klein ook. Koffie, wandeling, een film.",
      "gentle_phrase": "Wij zijn meer dan onze rollen — ook nu."
    },
    "couple": {
      "comparison_intro": "Rollen in zorg en verlies veranderen de dynamiek — en dat vraagt bewuste aandacht.",
      "what_a_may_hear": "Jij mist de relatie zoals die was — en draagt nu ook de zorg.",
      "what_b_may_hear": "Jij ook — en misschien voel jij je schuldig dat je zoveel vraagt.",
      "what_each_protects": "De een beschermt de ander door te zorgen. De ander beschermt de ander door te ontvangen.",
      "shared_chance": "Kleine momenten van gelijkwaardigheid houden de relatie levend.",
      "shared_challenge": "Maak bewust ruimte voor partner-zijn naast verzorger-zijn.",
      "shared_experiment": "Spreek af: één keer per week een moment dat niet over zorg gaat — gewoon samen zijn."
    }
  }
},

# ── DEEP ──────────────────────────────────────────────────────────────────

"D15_DEEP_001": {
  "questions": [
    {
      "question_id": "D15_DEEP_001_Q1",
      "step": "sensitive_point",
      "prompt": "Een diagnose, miskraam, verlies of breuk verandert het beeld van morgen. Je rouwt ook om wat niet meer komt. Welk gevoel raakt jou het diepst?",
      "helper_text": "Kies het meest kwetsbare.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Rouw om de toekomst die ik me had voorgesteld", "tags": {"sensitive_points.grief": 2, "needs.stability": 2}},
        {"option_id": "B", "label": "Angst — ik weet niet meer hoe het leven eruit ziet", "tags": {"needs.safety": 2, "sensitive_points.grief": 1}},
        {"option_id": "C", "label": "Leegte — het verhaal klopt niet meer", "tags": {"sensitive_points.identity": 2, "sensitive_points.grief": 2}},
        {"option_id": "D", "label": "Boosheid — dit had niet mogen gebeuren", "tags": {"sensitive_points.grief": 1, "patterns.resentment": 2}}
      ]
    },
    {
      "question_id": "D15_DEEP_001_Q2",
      "step": "emotion",
      "prompt": "Als het toekomstbeeld verbroken is — wat heb je dan het meest nodig van je partner?",
      "helper_text": "Kies wat het diepst resoneert.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Dat hij/zij ook rouwt — ik wil niet de enige zijn die dit voelt", "tags": {"needs.connection": 2, "needs.recognition": 2}},
        {"option_id": "B", "label": "Dat we samen mogen zoeken naar een nieuw verhaal", "tags": {"needs.connection": 2, "skills.agency": 1}},
        {"option_id": "C", "label": "Dat hij/zij mijn pijn niet wegpraat of oplost", "tags": {"needs.recognition": 2, "needs.safety": 2}},
        {"option_id": "D", "label": "Aanwezigheid — ook als er geen woorden zijn", "tags": {"needs.connection": 2, "needs.safety": 2}}
      ]
    }
  ],
  "outputs": {
    "solo": {
      "mirror": "Rouwen om een toekomst die niet meer klopt is echt verlies — ook als het onzichtbaar is voor anderen.",
      "protection_reflection": "Boosheid beschermt je voor de diepe pijn van het gemis. Maar eronder is rouw — en die verdient ruimte.",
      "need_reflection": "Jij wil niet alleen rouwen om wat was — je wil ook niet alleen een nieuw verhaal schrijven.",
      "chance": "Samen rouwen om een gebroken toekomstbeeld is ook samen bouwen aan een nieuw begin.",
      "challenge": "Benoem het verlies van het toekomstbeeld — niet alleen het concrete verlies.",
      "experiment": "Vertel je partner: 'Ik rouw niet alleen om wat is gebeurd, maar ook om...' — maak het concreet.",
      "gentle_phrase": "Ik mag treuren om wat niet meer komt — en toch beginnen."
    },
    "couple": {
      "comparison_intro": "Het verlies van een toekomstbeeld is een van de diepste vormen van rouw — en het raakt jullie allebei.",
      "what_a_may_hear": "Jij rouwt om meer dan wat er is — ook om wat niet meer mag zijn.",
      "what_b_may_hear": "Jij ook — misschien anders, maar ook echt.",
      "what_each_protects": "De een beschermt de pijn door hem te dragen. De ander beschermt de toekomst door voor te uitkijken.",
      "shared_chance": "Samen rouwen maakt ruimte voor samen opnieuw beginnen.",
      "shared_challenge": "Benoem allebei wat je verloren hebt — ook het onzichtbare.",
      "shared_experiment": "Vertel elkaar: wat verlies ik niet alleen nu, maar ook voor de toekomst? Luister alleen."
    }
  }
},

"D15_DEEP_002": {
  "questions": [
    {
      "question_id": "D15_DEEP_002_Q1",
      "step": "sensitive_point",
      "prompt": "Er zijn momenten waarop het donker te zwaar voelt — niet als gewone dip, maar als iets wat groter is. Wat herkent jij in jezelf op zulke momenten?",
      "helper_text": "Kies wat het meest herkenbaar is — en weet dat er hulp beschikbaar is.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Ik sluit me af — niemand mag zien hoe zwaar het is", "tags": {"protections.withdrawal": 2, "needs.safety": 2}},
        {"option_id": "B", "label": "Ik functioneer aan de buitenkant maar voel me vanbinnen leeg", "tags": {"protections.strength_mask": 2, "sensitive_points.not_seen": 2}},
        {"option_id": "C", "label": "Ik weet niet meer hoe ik het moet zeggen — of aan wie", "tags": {"needs.safety": 2, "needs.connection": 2}},
        {"option_id": "D", "label": "Ik ben bang dat als ik het zeg, alles erger wordt of de ander schrikt", "tags": {"patterns.pleasing": 2, "needs.safety": 2}}
      ]
    },
    {
      "question_id": "D15_DEEP_002_Q2",
      "step": "emotion",
      "prompt": "Als het donker te zwaar voelt — wat zou jou het meest helpen om een stap naar hulp te zetten?",
      "helper_text": "Dit is een moment om ook externe hulp te overwegen — jij hoeft dit niet alleen te dragen.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Weten dat ik niet veroordeeld word als ik zeg hoe zwaar het is", "tags": {"needs.safety": 2, "needs.recognition": 2}},
        {"option_id": "B", "label": "Iemand die de eerste stap voor me regelt — het voelt te groot om alleen te doen", "tags": {"needs.safety": 2, "needs.connection": 2}},
        {"option_id": "C", "label": "Dat de ander mij niet loslaat als ik dit deel", "tags": {"needs.safety": 2, "sensitive_points.abandonment": 2}},
        {"option_id": "D", "label": "Ruimte om klein te beginnen — één zin, één stap", "tags": {"needs.safety": 2, "skills.agency": 1}}
      ]
    }
  ],
  "outputs": {
    "solo": {
      "mirror": "Wat jij draagt is echt — en het is te zwaar om alleen te dragen. Dat is geen zwakte.",
      "protection_reflection": "Jezelf afsluiten beschermt anderen voor je pijn — maar het houdt jou ook weg van de hulp die je nodig hebt.",
      "need_reflection": "Jij verdient hulp — niet als beloning, maar als mens.",
      "chance": "Één stap richting hulp is genoeg om te beginnen. Je hoeft niet alles tegelijk.",
      "challenge": "Zeg het tegen één persoon: 'Het gaat niet goed met mij.' Dat is al een stap.",
      "experiment": "Als dit te zwaar voelt: bel 0800-0113 (Stichting 113, gratis, dag en nacht). Je hoeft het niet alleen te dragen.",
      "gentle_phrase": "Om hulp vragen is de moedigste stap die je kunt zetten."
    },
    "couple": {
      "comparison_intro": "Als het donker te zwaar wordt, is dit meer dan een spelmoment — het vraagt echte aandacht en zorg.",
      "what_a_may_hear": "Jij draagt iets wat groot is — en verdient echte hulp, niet alleen begrip.",
      "what_b_may_hear": "Jij ziet de ander worstelen — en wil er zijn. Maar professionele hulp is soms noodzakelijk.",
      "what_each_protects": "De een beschermt zichzelf door te zwijgen. De ander wil beschermen maar weet niet hoe.",
      "shared_chance": "Samen hulp zoeken is sterker dan samen dragen zonder hulp.",
      "shared_challenge": "Als dit herkend wordt: neem het serieus en zoek professionele ondersteuning.",
      "shared_experiment": "Spreek samen af: als één van ons dit zegt, zoeken we samen hulp. Vandaag nog als het nodig is."
    }
  }
}

} # end D15_CASES

# ── Update cases.json ──────────────────────────────────────────────────────

with open('cases.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

updated = 0
for c in data['cases']:
    dom = c.get('domain', {})
    did = dom.get('domain_id') if isinstance(dom, dict) else dom
    cid = c['case_id']
    if did == 'D15' and cid in D15_CASES:
        c['questions'] = D15_CASES[cid]['questions']
        c['outputs']   = D15_CASES[cid]['outputs']
        print('Updated:', cid)
        updated += 1

with open('cases.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f'\nDone! Updated {updated} D15 cases.')
