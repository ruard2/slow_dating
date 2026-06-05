import json, sys
sys.stdout.reconfigure(encoding='utf-8')

D14_CASES = {

# ── POSITIVE ──────────────────────────────────────────────────────────────

"D14_POSITIVE_001": {
  "questions": [
    {
      "question_id": "D14_POSITIVE_001_Q1",
      "step": "reaction",
      "prompt": "Jullie praten over de toekomst zonder plan of druk — gewoon: waar verlangen we naar? Wat doet zo'n gesprek met jou?",
      "helper_text": "Kies wat het meest klopt.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Het opent iets — dromen mag opeens gewoon", "tags": {"needs.freedom": 2, "needs.connection": 2}},
        {"option_id": "B", "label": "Ik voel verbinding — we kijken samen dezelfde richting op", "tags": {"needs.connection": 2, "needs.stability": 1}},
        {"option_id": "C", "label": "Lichte spanning — ik ben bang dat mijn droom te groot of te anders is", "tags": {"patterns.self_doubt": 2, "needs.safety": 1}},
        {"option_id": "D", "label": "Verrassing — ik wist niet dat de ander dit verlangde", "tags": {"needs.connection": 2, "needs.recognition": 1}}
      ]
    },
    {
      "question_id": "D14_POSITIVE_001_Q2",
      "step": "need",
      "prompt": "Wat heb jij nodig om over de toekomst te dromen zonder dat het meteen een plan of discussie wordt?",
      "helper_text": "Kies het meest essentiële.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Dat mijn droom welkom is — ook als hij niet haalbaar lijkt", "tags": {"needs.safety": 2, "needs.recognition": 2}},
        {"option_id": "B", "label": "Dat we niet meteen gaan rekenen of redeneren", "tags": {"needs.freedom": 2, "needs.safety": 1}},
        {"option_id": "C", "label": "Dat de ander ook deelt — het is geen interview", "tags": {"needs.connection": 2, "needs.recognition": 1}},
        {"option_id": "D", "label": "Dat het gesprek zelf al goed is — los van wat er van komt", "tags": {"needs.connection": 2, "needs.stability": 1}}
      ]
    }
  ],
  "outputs": {
    "solo": {
      "mirror": "Samen dromen zonder agenda is zeldzaam — en waardevol.",
      "protection_reflection": "De spanning dat je droom te groot of te anders is, beschermt je voor teleurstelling. Maar het houdt je ook stil.",
      "need_reflection": "Jij wil dat jouw verlangen welkom is — niet gecorrigeerd of begroot.",
      "chance": "Een gesprek over dromen hoeft niets op te leveren om iets te betekenen.",
      "challenge": "Noem één ding waarvan je lang dacht: dat mag ik niet willen.",
      "experiment": "Spreek af: een half uur dromen zonder haalbaarheidscheck. Daarna pas de realiteit.",
      "gentle_phrase": "Mijn droom mag bestaan voor hij bewezen is."
    },
    "couple": {
      "comparison_intro": "Samen dromen opent een laag in de relatie die logistiek niet raakt.",
      "what_a_may_hear": "Jij verlangde naar iets — en durfde het te zeggen.",
      "what_b_may_hear": "Jij hoorde het — en gaf ruimte voor wat nog niet af is.",
      "what_each_protects": "De een beschermt het verlangen. De ander beschermt de verbinding.",
      "shared_chance": "Weten wat de ander verlangt, brengt jullie dichter bij elkaar — ook als dromen niet samenvallen.",
      "shared_challenge": "Bescherm het droomgesprek — houd de plannenmaker even buiten.",
      "shared_experiment": "Stel om beurten: 'Als alles kon — wat zou jij dan willen?' Luister zonder te plannen."
    }
  }
},

"D14_POSITIVE_002": {
  "questions": [
    {
      "question_id": "D14_POSITIVE_002_Q1",
      "step": "emotion",
      "prompt": "Een droom blijft niet vaag — jullie zetten een concrete stap. Hoe voelt dat moment van hoop-die-beweging-wordt?",
      "helper_text": "Kies de emotie die het meest klopt.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Opwinding — eindelijk doen we iets", "tags": {"needs.freedom": 2, "skills.agency": 2}},
        {"option_id": "B", "label": "Lichte angst gemengd met vreugde — het wordt nu echt", "tags": {"needs.safety": 1, "skills.agency": 2}},
        {"option_id": "C", "label": "Trots — we hebben iets wat leeft omgezet in iets wat beweegt", "tags": {"skills.agency": 2, "needs.connection": 1}},
        {"option_id": "D", "label": "Rust — eindelijk staat er iets vast", "tags": {"needs.stability": 2, "needs.safety": 1}}
      ]
    },
    {
      "question_id": "D14_POSITIVE_002_Q2",
      "step": "need",
      "prompt": "Wat maakt een kleine stap richting droom voor jou betekenisvol — niet alleen efficiënt?",
      "helper_text": "Kies het meest essentiële.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Dat we hem samen zetten — ook al is het klein", "tags": {"needs.connection": 2, "skills.teamwork": 2}},
        {"option_id": "B", "label": "Dat het voortkomt uit wat we echt willen — niet uit moeten", "tags": {"needs.freedom": 2, "skills.values_alignment": 1}},
        {"option_id": "C", "label": "Dat het bewijs is dat we bouwen — niet alleen leven", "tags": {"skills.agency": 2, "needs.stability": 1}},
        {"option_id": "D", "label": "Dat de stap klein genoeg is om niet te falen — maar groot genoeg om te voelen", "tags": {"needs.stability": 2, "skills.agency": 1}}
      ]
    }
  ],
  "outputs": {
    "solo": {
      "mirror": "Een kleine stap is bewijs dat jullie richting kiezen — niet alleen overleven.",
      "protection_reflection": "De angst dat het nu echt wordt beschermt je voor teleurstelling. Maar het remt ook beweging.",
      "need_reflection": "Jij wil bouwen — niet alleen plannen. Actie geeft hoop een fundament.",
      "chance": "Elke kleine stap maakt de volgende aannemelijker.",
      "challenge": "Houd de stap klein genoeg om hem echt te zetten.",
      "experiment": "Stel een deadline: we doen deze stap voor [datum]. Hou het bij.",
      "gentle_phrase": "Eén stap is genoeg om te weten dat het beweegt."
    },
    "couple": {
      "comparison_intro": "Hoop die beweegt verbindt — en geeft jullie richting.",
      "what_a_may_hear": "Jij wilde actie — en het lukte.",
      "what_b_may_hear": "Jij deed mee — en dat maakte het samen.",
      "what_each_protects": "De een beschermt het verlangen. De ander beschermt de haalbaarheid.",
      "shared_chance": "Samen een stap zetten is sterker dan één iemand die trekt.",
      "shared_challenge": "Houd de stap concreet en klein — zodat jullie hem allebei kunnen dragen.",
      "shared_experiment": "Kies samen één kleine stap richting een gedeelde droom — en plan hem deze week."
    }
  }
},

"D14_POSITIVE_003": {
  "questions": [
    {
      "question_id": "D14_POSITIVE_003_Q1",
      "step": "emotion",
      "prompt": "Je deelt voorzichtig een verlangen — en je partner vraagt: 'Wat raakt jou hierin?' in plaats van meteen de risico's te noemen. Wat voel je dan?",
      "helper_text": "Kies de emotie die het meest klopt.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Warmte — mijn droom is welkom hier", "tags": {"needs.recognition": 2, "needs.safety": 2}},
        {"option_id": "B", "label": "Opluchting — ik hoef me niet meteen te verdedigen", "tags": {"needs.safety": 2, "needs.freedom": 1}},
        {"option_id": "C", "label": "Verveeld — eindelijk wordt er eens naar mij geluisterd", "tags": {"sensitive_points.not_seen": 2, "needs.recognition": 2}},
        {"option_id": "D", "label": "Kwetsbaar — nu moet ik het echt zeggen", "tags": {"skills.vulnerability": 2, "needs.safety": 1}}
      ]
    },
    {
      "question_id": "D14_POSITIVE_003_Q2",
      "step": "need",
      "prompt": "Wat heb jij nodig voordat je een verlangen of droom durft te delen?",
      "helper_text": "Kies het meest herkenbare.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Dat de ander nieuwsgierig is — niet meteen beoordeelt", "tags": {"needs.safety": 2, "needs.recognition": 2}},
        {"option_id": "B", "label": "Dat ik weet dat mijn droom veilig is — ook als het niks wordt", "tags": {"needs.safety": 2, "needs.freedom": 1}},
        {"option_id": "C", "label": "Dat het geen discussie wordt voor het een gesprek is geweest", "tags": {"needs.safety": 2, "needs.connection": 1}},
        {"option_id": "D", "label": "Dat de ander zelf ook durft te delen — zodat het gelijkwaardig voelt", "tags": {"needs.connection": 2, "needs.recognition": 1}}
      ]
    }
  ],
  "outputs": {
    "solo": {
      "mirror": "Jouw droom welkom laten zijn — dat is wat jij nodig had. En het lukte.",
      "protection_reflection": "Voorzichtig zijn met dromen beschermt je voor afwijzing. Maar het houdt ze ook klein.",
      "need_reflection": "Jij wil nieuwsgigheid ontvangen voor je verlangen — niet meteen een oordeel of plan.",
      "chance": "Als dromen welkom zijn, worden ze groter dan alleen verlangen — ze worden richting.",
      "challenge": "Deel een verlangen dat je lang voor jezelf hield.",
      "experiment": "Vraag de ander: 'Wat raakt jou in dit verlangen van mij?' — en luister.",
      "gentle_phrase": "Mijn droom verdient eerst een vraag, dan pas een antwoord."
    },
    "couple": {
      "comparison_intro": "Nieuwsgierigheid voor elkaars verlangen is een van de krachtigste vormen van liefde.",
      "what_a_may_hear": "Jij deelde iets — en voelde dat het welkom was.",
      "what_b_may_hear": "Jij vroeg door — en opende iets.",
      "what_each_protects": "De een beschermt het verlangen. De ander beschermt de verbinding.",
      "shared_chance": "Dromen uitwisselen zonder oordeel bouwt vertrouwen.",
      "shared_challenge": "Stel vaker 'wat raakt jou hierin?' — voor je advies geeft of afweegt.",
      "shared_experiment": "Vertel elkaar dit weekend één verlangen dat je zelden hardop zegt. Luister alleen — geen reactie."
    }
  }
},

"D14_POSITIVE_004": {
  "questions": [
    {
      "question_id": "D14_POSITIVE_004_Q1",
      "step": "reaction",
      "prompt": "Wat ooit klopte, past misschien niet meer. Jullie kijken samen: wat vraagt deze fase nu? Hoe voelt dat herijken?",
      "helper_text": "Kies wat het meest klopt.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Eerlijk en volwassen — we groeien mee met het leven", "tags": {"skills.agency": 2, "skills.values_alignment": 2}},
        {"option_id": "B", "label": "Een beetje rouwend — loslaten van hoe het was", "tags": {"sensitive_points.grief": 1, "needs.stability": 1}},
        {"option_id": "C", "label": "Bevrijdend — we hoeven niet vast te houden wat niet meer past", "tags": {"needs.freedom": 2, "skills.agency": 1}},
        {"option_id": "D", "label": "Spannend — ik weet niet zeker waar we uitkomen", "tags": {"needs.stability": 1, "needs.safety": 1}}
      ]
    },
    {
      "question_id": "D14_POSITIVE_004_Q2",
      "step": "need",
      "prompt": "Wat maakt herijken voor jou mogelijk — in plaats van vasthouden of vluchten?",
      "helper_text": "Kies het meest essentiële.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Dat we samen kijken — niet dat één iemand bepaalt wat er moet veranderen", "tags": {"needs.fairness": 2, "skills.teamwork": 2}},
        {"option_id": "B", "label": "Dat wat oud was geëerd wordt voordat het losgelaten wordt", "tags": {"needs.stability": 2, "needs.recognition": 1}},
        {"option_id": "C", "label": "Dat het geen crisis is — maar een bewuste keuze", "tags": {"needs.stability": 2, "skills.agency": 1}},
        {"option_id": "D", "label": "Dat er ruimte is voor rouw én voor hoop tegelijk", "tags": {"needs.safety": 2, "needs.freedom": 1}}
      ]
    }
  ],
  "outputs": {
    "solo": {
      "mirror": "Samen herijken vraagt moed — het is gemakkelijker door te gaan dan te vragen: past dit nog?",
      "protection_reflection": "Vasthouden aan wat was beschermt je voor het onbekende van wat komt. Maar soms kost vasthouden meer dan loslaten.",
      "need_reflection": "Jij wil eerlijk zijn over wat veranderd is — zonder het oude te verraden.",
      "chance": "Elke fase vraagt eigen antwoorden. Samen kijken is al een antwoord.",
      "challenge": "Benoem één ding dat vroeger klopte maar nu misschien niet meer.",
      "experiment": "Vraag samen: 'Wat willen we vasthouden? Wat mag veranderen? Wat zijn we bereid los te laten?'",
      "gentle_phrase": "Herijken is geen falen — het is eerlijk leven."
    },
    "couple": {
      "comparison_intro": "Samen herijken is een teken van een volwassen relatie — jullie groeien mee.",
      "what_a_may_hear": "Jij durfde te zeggen: dit past niet meer.",
      "what_b_may_hear": "Jij ook — en jullie keken samen, zonder beschuldiging.",
      "what_each_protects": "De een beschermt groei. De ander beschermt continuïteit.",
      "shared_chance": "Een relatie die zichzelf kan herijken, gaat lang mee.",
      "shared_challenge": "Doe dit bewust — niet in crisis, maar als gewoonte.",
      "shared_experiment": "Plan elk jaar een 'herijkgesprek': wat willen we vasthouden, wat mag anders, wat dromen we voor dit jaar?"
    }
  }
},

# ── TENSION ───────────────────────────────────────────────────────────────

"D14_TENSION_001": {
  "questions": [
    {
      "question_id": "D14_TENSION_001_Q1",
      "step": "emotion",
      "prompt": "Voor de één is verhuizen ruimte of avontuur. Voor de ander is het verlies van thuis, netwerk of rust. Wat voel jij als dat verschil er ligt?",
      "helper_text": "Kies de emotie die het meest klopt.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Verdeeld — ik wil voor mezelf kiezen én voor ons", "tags": {"needs.freedom": 2, "needs.connection": 2}},
        {"option_id": "B", "label": "Bang — stel dat dit ons breekt", "tags": {"sensitive_points.abandonment": 2, "needs.stability": 1}},
        {"option_id": "C", "label": "Schuldig — mijn verlangen kost de ander iets", "tags": {"sensitive_points.guilt": 2, "patterns.self_blame": 1}},
        {"option_id": "D", "label": "Onbegrepen — ik snap niet waarom dit zo zwaar voelt voor de ander", "tags": {"skills.empathy": 1, "needs.connection": 1}}
      ]
    },
    {
      "question_id": "D14_TENSION_001_Q2",
      "step": "interpretation",
      "prompt": "Achter de vraag 'verhuizen of niet' — wat staat er voor jou eigenlijk op het spel?",
      "helper_text": "Kies de meest herkenbare gedachte.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Of mijn verlangen telt — ook als het de ander iets kost", "tags": {"needs.recognition": 2, "needs.freedom": 2}},
        {"option_id": "B", "label": "Of we sterk genoeg zijn om een groot verschil samen te dragen", "tags": {"needs.stability": 2, "needs.connection": 1}},
        {"option_id": "C", "label": "Of we ooit op hetzelfde punt uitkomen in dit leven", "tags": {"patterns.catastrophizing": 2, "needs.stability": 1}},
        {"option_id": "D", "label": "Wie van ons het meeste inlevert — en of dat eerlijk is", "tags": {"needs.fairness": 2, "needs.recognition": 1}}
      ]
    }
  ],
  "outputs": {
    "solo": {
      "mirror": "Verhuizen is zelden alleen een adresvraag — het gaat over wie je bent en waar je thuishoort.",
      "protection_reflection": "Schuld over je verlangen beschermt de ander — maar het smoort ook iets wat echt in je leeft.",
      "need_reflection": "Jij wil dat jouw verlangen telt — ook als het ongemakkelijk is.",
      "chance": "Dit gesprek kan jullie helpen om de echte vraag te stellen: wat hebben we allebei nodig?",
      "challenge": "Praat over wat je te verliezen hebt, niet alleen wat je wil winnen.",
      "experiment": "Schrijf elk apart: wat wil ik, wat ben ik bereid te geven, wat kan ik niet missen? Deel en bespreek.",
      "gentle_phrase": "We kunnen dit samen dragen als we allebei eerlijk zijn over wat het kost."
    },
    "couple": {
      "comparison_intro": "Verhuizen raakt beider wereld — en dat vraagt om meer dan een ja of nee.",
      "what_a_may_hear": "Jij verlangt naar iets nieuws — en hoopt dat de ander dat ook ziet.",
      "what_b_may_hear": "Jij verlangt naar stabiliteit — en hoopt dat de ander dat ook ziet.",
      "what_each_protects": "De een beschermt groei. De ander beschermt thuis.",
      "shared_chance": "Als jullie allebei eerlijk zijn over wat het kost, kunnen jullie een echte beslissing nemen.",
      "shared_challenge": "Maak het geen strijd over wie gelijk heeft — maak het een gesprek over wat jullie nodig hebben.",
      "shared_experiment": "Schrijf elk drie dingen op: wat wil ik, wat ben ik bereid te geven, wat heb ik nodig van jou?"
    }
  }
},

"D14_TENSION_002": {
  "questions": [
    {
      "question_id": "D14_TENSION_002_Q1",
      "step": "emotion",
      "prompt": "De vraag naar kinderen, timing of gezinsvorm raakt diep. Verlangen, angst, lichaam, roeping. Wat voel jij als dit ter sprake komt?",
      "helper_text": "Kies de emotie die het meest klopt.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Kwetsbaarheid — dit raakt iets wat ik zelden hardop zeg", "tags": {"skills.vulnerability": 2, "needs.safety": 2}},
        {"option_id": "B", "label": "Spanning — we denken er anders over en dat verontrust me", "tags": {"needs.stability": 2, "sensitive_points.rejection": 1}},
        {"option_id": "C", "label": "Verdriet — er is iets wat ik wil dat ik misschien niet krijg", "tags": {"sensitive_points.grief": 2, "needs.connection": 1}},
        {"option_id": "D", "label": "Angst — stel dat onze antwoorden te ver uit elkaar liggen", "tags": {"sensitive_points.abandonment": 2, "needs.stability": 1}}
      ]
    },
    {
      "question_id": "D14_TENSION_002_Q2",
      "step": "interpretation",
      "prompt": "Wat maakt dit gesprek zo zwaar om te voeren?",
      "helper_text": "Kies de meest herkenbare gedachte.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Het antwoord kan alles veranderen — en ik ben bang voor dat antwoord", "tags": {"needs.stability": 2, "sensitive_points.rejection": 2}},
        {"option_id": "B", "label": "Ik weet zelf nog niet zeker wat ik wil — en dat maakt me onzeker", "tags": {"patterns.self_doubt": 2, "needs.stability": 1}},
        {"option_id": "C", "label": "Dit raakt mijn lichaam, mijn toekomst, mijn angsten — dat is heel persoonlijk", "tags": {"sensitive_points.identity": 2, "needs.safety": 1}},
        {"option_id": "D", "label": "Ik wil de ander niet kwetsen met wat ik voel of niet voel", "tags": {"patterns.pleasing": 2, "needs.connection": 1}}
      ]
    }
  ],
  "outputs": {
    "solo": {
      "mirror": "Er is geen gesprek zwaarder dan dit — het raakt verlangen, lichaam, angst en liefde tegelijk.",
      "protection_reflection": "Het uitstellen van dit gesprek beschermt je voor het mogelijke antwoord — maar het laat de onzekerheid ook groeien.",
      "need_reflection": "Jij verdient ruimte om te zeggen wat je voelt — ook als het onaf is.",
      "chance": "Dit gesprek hoeft niet alles te beslissen. Het mag beginnen met: 'Ik weet nog niet alles, maar dit voel ik.'",
      "challenge": "Zeg het eerlijk — ook als het kwetsbaar is.",
      "experiment": "Spreek af: we bespreken dit zonder dat het meteen een beslissing hoeft te zijn. Gewoon eerlijk.",
      "gentle_phrase": "Dit gesprek mag langzaam gaan — het is groot."
    },
    "couple": {
      "comparison_intro": "De vraag naar kinderen is een van de meest persoonlijke gesprekken die twee mensen kunnen voeren.",
      "what_a_may_hear": "Jij draagt een verlangen — of een twijfel — die groot is.",
      "what_b_may_hear": "Jij ook — met eigen angsten, eigen verlangen, eigen lichaam.",
      "what_each_protects": "De een beschermt zijn/haar verlangen. De ander beschermt de relatie.",
      "shared_chance": "Eerlijkheid over dit onderwerp is de enige weg — ook als het moeilijk is.",
      "shared_challenge": "Spreek zonder haast. Dit verdient meerdere gesprekken, niet één.",
      "shared_experiment": "Plan een gesprek zonder tijdsdruk: ik vertel jou wat ik voel, jij vertelt mij. Geen conclusies deze keer."
    }
  }
},

"D14_TENSION_003": {
  "questions": [
    {
      "question_id": "D14_TENSION_003_Q1",
      "step": "reaction",
      "prompt": "Jouw droom voelt voor de ander als druk — meegaan, begrijpen, geloven. Hoe reageer jij als je dat merkt?",
      "helper_text": "Kies de meest herkenbare reactie.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Ik voel me teleurgesteld — mijn droom had ik gehoopt te delen", "tags": {"sensitive_points.not_seen": 2, "needs.connection": 2}},
        {"option_id": "B", "label": "Ik word defensief — dit is mijn leven, niet een eis", "tags": {"protections.control": 2, "needs.freedom": 1}},
        {"option_id": "C", "label": "Ik trek me terug en droom stiller — minder delen", "tags": {"protections.withdrawal": 2, "needs.safety": 1}},
        {"option_id": "D", "label": "Ik probeer te begrijpen wat de druk maakt — en dat lukt maar half", "tags": {"skills.empathy": 2, "needs.connection": 1}}
      ]
    },
    {
      "question_id": "D14_TENSION_003_Q2",
      "step": "interpretation",
      "prompt": "Als jouw droom de ander belast — wat zegt dat over hoe jullie met elkaars verlangens omgaan?",
      "helper_text": "Kies de meest herkenbare gedachte.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "'We hebben niet geleerd hoe we dromen kunnen delen zonder het als eis te voelen'", "tags": {"skills.communication": 2, "needs.connection": 1}},
        {"option_id": "B", "label": "'Mijn droom vraagt iets van de ander en dat is een probleem'", "tags": {"sensitive_points.guilt": 2, "needs.freedom": 1}},
        {"option_id": "C", "label": "'De ander voelt druk omdat hij/zij niet weet hoe te reageren'", "tags": {"skills.empathy": 2, "needs.connection": 1}},
        {"option_id": "D", "label": "'We praten over dromen maar eigenlijk over wie bepaalt hoe we leven'", "tags": {"skills.insight": 2, "needs.freedom": 2}}
      ]
    }
  ],
  "outputs": {
    "solo": {
      "mirror": "Een droom die als druk landt is niet jouw schuld — maar er is iets wat het gesprek anders vraagt.",
      "protection_reflection": "Stiller dromen beschermt je voor afwijzing — maar het maakt ook de verbinding kleiner.",
      "need_reflection": "Jij wil dat jouw verlangen gehoord wordt als uitnodiging, niet als opdracht.",
      "chance": "Leren hoe je droomt zonder te eisen — dat is een vaardigheid die te oefenen is.",
      "challenge": "Zeg het: 'Dit is iets wat ik verlang — ik vraag jou niet mee te gaan, alleen te horen.'",
      "experiment": "Vraag de ander: 'Wat maakt dit gevoel als druk voor jou?' Luister voor je legt uit.",
      "gentle_phrase": "Mijn verlangen is een uitnodiging — geen eis."
    },
    "couple": {
      "comparison_intro": "Dromen die druk worden zijn geen slechte dromen — ze vragen een andere taal.",
      "what_a_may_hear": "Jij verlangt — en wil dat dat welkom is.",
      "what_b_may_hear": "Jij voelt druk — en dat is een signaal, geen oordeel.",
      "what_each_protects": "De een beschermt het verlangen. De ander beschermt eigen ruimte.",
      "shared_chance": "Als jullie leren onderscheid te maken tussen verlangen delen en verwachten, verdwijnt de druk.",
      "shared_challenge": "Maak een afspraak: dromen mogen gedeeld worden zonder dat er een ja bij hoeft.",
      "shared_experiment": "Oefen: vertel een verlangen en zeg erbij 'ik vraag je niks — ik deel alleen.' Kijk wat dat doet."
    }
  }
},

"D14_TENSION_004": {
  "questions": [
    {
      "question_id": "D14_TENSION_004_Q1",
      "step": "reaction",
      "prompt": "Waar gaan jullie heen? De vraag blijft liggen. Niet omdat hij onbelangrijk is — maar misschien omdat hij te groot voelt. Hoe merk jij dat bij jezelf?",
      "helper_text": "Kies de meest herkenbare reactie.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Ik stel het uit — het goede moment komt nooit", "tags": {"patterns.avoidance": 2, "needs.safety": 1}},
        {"option_id": "B", "label": "Ik vul in wat de ander wil — en hoop dat dat genoeg is", "tags": {"patterns.pleasing": 2, "patterns.hypervigilance": 1}},
        {"option_id": "C", "label": "Ik merk een stille onrust — maar benoem hem niet", "tags": {"protections.withdrawal": 2, "needs.connection": 1}},
        {"option_id": "D", "label": "Ik ben bang dat als we het bespreken, we ontdekken dat we het niet eens zijn", "tags": {"patterns.avoidance": 2, "needs.stability": 1}}
      ]
    },
    {
      "question_id": "D14_TENSION_004_Q2",
      "step": "interpretation",
      "prompt": "Als het toekomstgesprek steeds uitblijft — wat denk jij dat er dan eigenlijk op de achtergrond speelt?",
      "helper_text": "Kies de meest herkenbare gedachte.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "'We zijn allebei bang voor het antwoord'", "tags": {"patterns.avoidance": 2, "needs.safety": 2}},
        {"option_id": "B", "label": "'We leven dag voor dag en dat is fijn, maar ook een beetje stuurloos'", "tags": {"needs.stability": 2, "patterns.avoidance": 1}},
        {"option_id": "C", "label": "'We weten allebei dat er iets gezegd moet worden — en wachten op de ander'", "tags": {"patterns.passive_communication": 2, "needs.connection": 1}},
        {"option_id": "D", "label": "'Dit gesprek vraagt meer dan we nu hebben — moed, tijd, rust'", "tags": {"needs.safety": 2, "needs.stability": 1}}
      ]
    }
  ],
  "outputs": {
    "solo": {
      "mirror": "Een gesprek dat uitblijft over de toekomst is zelf ook een antwoord — en het verdient aandacht.",
      "protection_reflection": "Uitstellen beschermt je voor een antwoord dat ongemakkelijk kan zijn. Maar de onrust groeit ondertussen.",
      "need_reflection": "Jij wil richting — en een partner die die richting met je bespreekt.",
      "chance": "Het gesprek hoeft niet alles te beslissen. Beginnen is genoeg.",
      "challenge": "Zeg het vanavond: 'Ik wil graag eens praten over waar we heen gaan. Wanneer kunnen we dat doen?'",
      "experiment": "Plan een moment voor het toekomstgesprek — niet voor morgen, maar voor deze maand.",
      "gentle_phrase": "De toekomst is geen bedreiging — het is een uitnodiging."
    },
    "couple": {
      "comparison_intro": "Jullie weten allebei dat het gesprek er moet komen — en wachten op elkaar.",
      "what_a_may_hear": "Jij voelt de onrust — en wil dat er richting komt.",
      "what_b_may_hear": "Jij ook — maar misschien voel je ook angst voor wat je ontdekt.",
      "what_each_protects": "Beiden beschermen jullie iets: de huidige rust, de onbekende toekomst.",
      "shared_chance": "Beginnen met het gesprek is al een stap richting samen.",
      "shared_challenge": "Plan het — en kom er niet meer onderuit.",
      "shared_experiment": "Spreek af: komende [weekend/week] hebben we een uur voor 'waar gaan wij heen?' — zonder agenda, alleen eerlijkheid."
    }
  }
},

# ── DEEP ──────────────────────────────────────────────────────────────────

"D14_DEEP_001": {
  "questions": [
    {
      "question_id": "D14_DEEP_001_Q1",
      "step": "sensitive_point",
      "prompt": "Er was iets wat je hoopte — gezin, plek, werk, gezondheid, roeping. Het kwam niet zo. Welk gevoel raakt jou het diepst?",
      "helper_text": "Kies het meest kwetsbare.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Rouw — ik moet iets loslaten wat ik echt wilde", "tags": {"sensitive_points.grief": 2, "needs.stability": 1}},
        {"option_id": "B", "label": "Schaamte — ik had het beter moeten doen of willen", "tags": {"sensitive_points.shame": 2, "sensitive_points.not_good_enough": 2}},
        {"option_id": "C", "label": "Boosheid — het had anders kunnen gaan", "tags": {"sensitive_points.grief": 1, "patterns.resentment": 2}},
        {"option_id": "D", "label": "Leegte — ik weet niet meer wat ik nog mag hopen", "tags": {"sensitive_points.grief": 2, "needs.stability": 2}}
      ]
    },
    {
      "question_id": "D14_DEEP_001_Q2",
      "step": "emotion",
      "prompt": "Als je een gemiste droom met je meedraagt — wat heb je dan nodig van je partner?",
      "helper_text": "Kies wat het diepst resoneert.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Dat hij/zij de pijn erkent — zonder hem weg te redeneren", "tags": {"needs.recognition": 2, "needs.safety": 2}},
        {"option_id": "B", "label": "Ruimte om te rouwen — ook als de ander al verder is", "tags": {"needs.freedom": 2, "needs.safety": 2}},
        {"option_id": "C", "label": "Dat we samen mogen zoeken naar wat nu wél mogelijk is", "tags": {"needs.connection": 2, "skills.agency": 1}},
        {"option_id": "D", "label": "Dat hij/zij niet bang is voor mijn verdriet", "tags": {"needs.safety": 2, "needs.connection": 2}}
      ]
    }
  ],
  "outputs": {
    "solo": {
      "mirror": "Een gemiste droom vraagt rouw — net als elk verlies. Dat is geen zwakte.",
      "protection_reflection": "Schaamte over wat niet lukte beschermt je voor herhaling — maar het houdt ook hoop op afstand.",
      "need_reflection": "Jij verdient ruimte om te rouwen én ruimte om opnieuw te hopen.",
      "chance": "Rouwen en hopen zijn geen tegenpolen — ze kunnen naast elkaar leven.",
      "challenge": "Zeg het: 'Ik mis wat ik hoopte.' Zonder oplossing — gewoon eerlijk.",
      "experiment": "Schrijf over de gemiste droom: wat wilde je, wat heeft het gekost, wat draag je nog mee?",
      "gentle_phrase": "Ik mag treuren om wat niet werd — en toch verder gaan."
    },
    "couple": {
      "comparison_intro": "Een gemiste droom is een van de diepste dingen die iemand kan dragen — en jullie hoeven het niet alleen te dragen.",
      "what_a_may_hear": "Jij draagt iets wat groot is en misschien zelden gezegd wordt.",
      "what_b_may_hear": "Jij ziet de ander — en wil er zijn, ook voor iets wat niet opgelost kan worden.",
      "what_each_protects": "De een beschermt de pijn door hem stil te dragen. De ander beschermt de ander door er te zijn.",
      "shared_chance": "Samen rouwen om een gemiste droom maakt de verbinding dieper.",
      "shared_challenge": "Wees niet bang voor elkaars verdriet — het vraagt aanwezigheid, geen oplossing.",
      "shared_experiment": "Vertel elkaar één droom die niet is geworden. Luister zonder te troosten of op te lossen."
    }
  }
},

"D14_DEEP_002": {
  "questions": [
    {
      "question_id": "D14_DEEP_002_Q1",
      "step": "sensitive_point",
      "prompt": "Je merkt verandering — in jezelf of de ander. Nieuwe verlangens, geloof, tempo, richting. De stille vraag: blijven we samen onderweg? Welk gevoel raakt het diepst?",
      "helper_text": "Kies het meest kwetsbare.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Angst — stel dat we uiteen groeien zonder het te beseffen", "tags": {"sensitive_points.abandonment": 2, "needs.stability": 2}},
        {"option_id": "B", "label": "Verdriet — de ander die ik kende lijkt te veranderen", "tags": {"sensitive_points.grief": 2, "needs.connection": 1}},
        {"option_id": "C", "label": "Nieuwsgierigheid — wie worden we, ook al is dat spannend", "tags": {"skills.insight": 2, "needs.freedom": 1}},
        {"option_id": "D", "label": "Eenzaamheid — ik groei in een richting die de ander niet volgt", "tags": {"sensitive_points.loneliness": 2, "needs.connection": 2}}
      ]
    },
    {
      "question_id": "D14_DEEP_002_Q2",
      "step": "emotion",
      "prompt": "Als je bang bent om uit elkaar te groeien — wat heb je dan het meest nodig van de ander?",
      "helper_text": "Kies wat het diepst resoneert.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Dat hij/zij blijft vragen naar wie ik aan het worden ben", "tags": {"needs.recognition": 2, "needs.connection": 2}},
        {"option_id": "B", "label": "Dat verandering niet als bedreiging wordt gezien maar als groei", "tags": {"needs.freedom": 2, "needs.safety": 1}},
        {"option_id": "C", "label": "Dat we regelmatig checken of we nog samen lopen", "tags": {"needs.connection": 2, "needs.stability": 2}},
        {"option_id": "D", "label": "Dat hij/zij ook verandert — zodat we allebei in beweging zijn", "tags": {"needs.connection": 2, "needs.freedom": 1}}
      ]
    }
  ],
  "outputs": {
    "solo": {
      "mirror": "Samen groeien betekent niet hetzelfde worden — het betekent bewust naast elkaar blijven lopen.",
      "protection_reflection": "Angst voor uit elkaar groeien beschermt de relatie — maar het kan ook groei remmen.",
      "need_reflection": "Jij wil gekend blijven terwijl je verandert — niet vastgehouden worden, maar bijgehouden.",
      "chance": "Groei hoeft geen afstand te worden als jullie er regelmatig over praten.",
      "challenge": "Vertel de ander wie je aan het worden bent — voor de kloof groeit.",
      "experiment": "Vraag de ander: 'Wat zie jij veranderen in mij? Wat zie ik veranderen in jou?' Als een gesprek, niet als evaluatie.",
      "gentle_phrase": "Samen groeien is mooier dan gelijk blijven."
    },
    "couple": {
      "comparison_intro": "Uit elkaar groeien is een stilstelling die vraagt om bewuste aandacht.",
      "what_a_may_hear": "Jij verandert — en wil dat de ander dat ziet en volgt.",
      "what_b_may_hear": "Jij ziet de ander veranderen — en vraagt je af of je nog meeloopt.",
      "what_each_protects": "De een beschermt groei. De ander beschermt de verbinding.",
      "shared_chance": "Als jullie verandering benoemen voor hij een kloof wordt, blijven jullie samen onderweg.",
      "shared_challenge": "Check regelmatig: wie zijn we nu? Niet wie waren we.",
      "shared_experiment": "Spreek elk kwartaal af: vertel me drie dingen die in jou veranderd zijn. Luister."
    }
  }
}

} # end D14_CASES

# ── Update cases.json ──────────────────────────────────────────────────────

with open('cases.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

updated = 0
for c in data['cases']:
    dom = c.get('domain', {})
    did = dom.get('domain_id') if isinstance(dom, dict) else dom
    cid = c['case_id']
    if did == 'D14' and cid in D14_CASES:
        c['questions'] = D14_CASES[cid]['questions']
        c['outputs']   = D14_CASES[cid]['outputs']
        print('Updated:', cid)
        updated += 1

with open('cases.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f'\nDone! Updated {updated} D14 cases.')
