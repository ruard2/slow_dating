# -*- coding: utf-8 -*-
import json, sys
sys.stdout.reconfigure(encoding='utf-8')

with open('cases.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

cases = data['cases']

D6_CASES = {

"D6_POSITIVE_001": {
  "questions": [
    {
      "question_id": "q1_reaction",
      "step": "reaction",
      "prompt": "Wat doet het met je als je partner vraagt of je wil dat hij/zij luistert of meedenkt?",
      "helper_text": "Kies wat het meest herkenbaar is, niet wat het netst klinkt.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Ik voel opluchting — ik hoef niet uit te leggen wat ik nodig heb.", "tags": {"needs.recognition": 2, "needs.connection": 1}},
        {"option_id": "B", "label": "Ik word geraakt — dit is precies wat ik nodig had.", "tags": {"needs.recognition": 3, "centers.body": 1}},
        {"option_id": "C", "label": "Ik voel even verwarring — ik ben niet gewend dat iemand dat vraagt.", "tags": {"needs.recognition": 2, "sensitive_points.not_seen": 1}},
        {"option_id": "D", "label": "Ik voel ruimte — mijn tempo wordt gerespecteerd.", "tags": {"needs.freedom": 1, "needs.recognition": 1}},
        {"option_id": "E", "label": "Ik merk het nauwelijks — ik ben gewend mijn eigen weg te kiezen in gesprekken.", "tags": {"needs.autonomy": 1, "needs.freedom": 1}}
      ]
    },
    {
      "question_id": "q2_need",
      "step": "need",
      "prompt": "Wat heeft het voor jou als iemand eerst vraagt wat je nodig hebt?",
      "helper_text": "Niet wat je denkt dat je zou moeten willen — wat helpt jou echt?",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Het zegt: jij bepaalt hoe dit gesprek gaat. Dat geeft mij veiligheid.", "tags": {"needs.safety": 2, "needs.recognition": 2}},
        {"option_id": "B", "label": "Het geeft mij het gevoel gezien te worden vóór het gesprek begint.", "tags": {"needs.recognition": 3, "needs.attention": 1}},
        {"option_id": "C", "label": "Het haalt de druk eraf — ik hoef me niet te verdedigen.", "tags": {"needs.safety": 2, "needs.freedom": 1}},
        {"option_id": "D", "label": "Het maakt mij zachter — ik kan opener zijn als ik niet hoef te vechten.", "tags": {"needs.connection": 2, "needs.recognition": 1}},
        {"option_id": "E", "label": "Eerlijk gezegd maakt het mij niet zo veel uit — ik pas me aan aan de ander.", "tags": {"needs.connection": 1, "protections.appease": 1}}
      ]
    }
  ],
  "outputs": {
    "solo": {
      "mirror": "Niet hoeven uitleggen wat je nodig hebt — dat klinkt simpel maar is zeldzaam. Jij reageert op iemand die ruimte maakt vóórdat het gesprek begint.",
      "protection_reflection": "Als je gewend bent dat gesprekken al een richting hebben vóór jij klaar bent met spreken, dan bescherm je jezelf. Hier hoefde dat niet.",
      "need_reflection": "Jij hebt behoefte aan een partner die vraagt vóór hij/zij invult. Dat is een taal van respect die niet iedereen spreekt.",
      "chance": "Dit moment laat zien hoe simpel het kan zijn om begrepen te voelen — het begint met één vraag.",
      "challenge": "Kun jij ook zeggen wat je nodig hebt vóórdat de ander radt?",
      "experiment": "Zeg de volgende keer vóór je iets deelt: 'Ik wil dit kwijt, maar ik heb meer aan luisteren dan aan oplossingen.' Test hoe dat verschil voelt.",
      "gentle_phrase": "Jij mag bepalen hoe je gehoord wil worden."
    },
    "couple": {
      "comparison_intro": "Luisteren of meedenken — voor ieder van jullie is dat misschien een andere behoefte.",
      "what_a_may_hear": "A voelt ruimte als er gevraagd wordt. Dat is meer dan beleefdheid — het is erkenning van A's tempo.",
      "what_b_may_hear": "B stelde de vraag. Maar begrijpt B ook waarom dat zo veel deed voor A?",
      "what_each_protects": "A beschermt zichzelf door te wachten tot er ruimte gevraagd wordt. B beschermt zichzelf door te vragen in plaats van te raden.",
      "shared_chance": "Samen een kleine norm maken: vragen vóór invullen.",
      "shared_challenge": "Hoe houdt B dit vol ook als het druk is of als de ander lang praat?",
      "shared_experiment": "Spreek af: begin elk serieus gesprek met: 'Wat heb jij nu nodig?' Oefen dat drie keer."
    }
  }
},

"D6_POSITIVE_002": {
  "questions": [
    {
      "question_id": "q1_emotion",
      "step": "emotion",
      "prompt": "Wat voel je wanneer iemand jouw woorden teruggeeft en het klopt?",
      "helper_text": "Kies wat het meest herkenbaar is, niet wat het netst klinkt.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Ik voel iets van rust — ik werd gezien.", "tags": {"needs.recognition": 3, "centers.body": 1}},
        {"option_id": "B", "label": "Ik word emotioneel — meer dan ik verwachtte.", "tags": {"needs.recognition": 3, "sensitive_points.not_seen": 1}},
        {"option_id": "C", "label": "Ik voel opluchting — nu kan ik verder, de basis staat.", "tags": {"needs.recognition": 2, "needs.safety": 1}},
        {"option_id": "D", "label": "Ik voel verbinding — dit is hoe ik wil dat gesprekken gaan.", "tags": {"needs.connection": 2, "needs.recognition": 1}},
        {"option_id": "E", "label": "Ik merk het maar voel weinig extra — het is gewoon goed geluisterd.", "tags": {"needs.stability": 1, "needs.connection": 1}}
      ]
    },
    {
      "question_id": "q2_interpretation",
      "step": "interpretation",
      "prompt": "Wat zegt dit moment van begrijpen over jullie relatie?",
      "helper_text": "Wat maak jij hiervan — los van wat je zou 'moeten' denken?",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Het zegt dat jij écht luistert — niet om te antwoorden maar om te begrijpen.", "tags": {"needs.recognition": 3, "needs.connection": 1}},
        {"option_id": "B", "label": "Het zegt dat we kunnen communiceren zonder dat het strijd wordt.", "tags": {"needs.connection": 2, "needs.safety": 1}},
        {"option_id": "C", "label": "Het geeft mij vertrouwen — ik kan meer delen als ik weet dat het goed landt.", "tags": {"needs.safety": 2, "needs.connection": 1}},
        {"option_id": "D", "label": "Het is een zeldzaam moment — ik wil er vaker bij zijn.", "tags": {"needs.recognition": 2, "needs.reassurance": 1}},
        {"option_id": "E", "label": "Het laat zien dat aandacht soms belangrijker is dan antwoorden.", "tags": {"needs.attention": 2, "needs.recognition": 1}}
      ]
    }
  ],
  "outputs": {
    "solo": {
      "mirror": "Begrepen worden in je eigen woorden — dat is meer dan een gesprekstechniek. Jij merkt wat het doet als iemand jou teruggeeft zonder toe te voegen of te corrigeren.",
      "protection_reflection": "De verrassing of emotie bij het samengevat worden zegt iets over hoe zelden het voorkomt dat je zo gehoord wordt.",
      "need_reflection": "Jij hebt behoefte aan een gesprek waarbij begrijpen vóór antwoorden gaat. Dat is geen hoge eis — dat is het fundament van verbinding.",
      "chance": "Dit moment is herhaalbaar. Het begint met luisteren om te begrijpen.",
      "challenge": "Kun jij zelf ook iemand zo goed samenvatten dat zij denken: ja, dat is het?",
      "experiment": "Probeer deze week één keer iemand samen te vatten vóór je reageert: 'Ik hoor je zeggen... klopt dat?' Kijk hoe dat landt.",
      "gentle_phrase": "Jij verdient een gesprek waarin jij de richting bepaalt."
    },
    "couple": {
      "comparison_intro": "Samenvatten en begrepen worden — dat is de kern van goed luisteren.",
      "what_a_may_hear": "A werd samengevat en voelde: ja, dat is het. Dat is meer dan een compliment — het is bewijs van aandacht.",
      "what_b_may_hear": "B luisterde en vatte samen. Maar begrijpt B hoe zeldzaam dat voor A aanvoelt?",
      "what_each_protects": "A beschermt zichzelf door pas verder te praten als er ruimte is. B beschermt zichzelf door te luisteren in plaats van te reageren.",
      "shared_chance": "Samen de gewoonte bouwen: samenvatten vóór antwoorden.",
      "shared_challenge": "Hoe blijft B luisteren als het onderwerp B zelf raakt?",
      "shared_experiment": "Oefen één gesprek waarbij de eerste reactie altijd een samenvatting is. Daarna pas jouw eigen mening."
    }
  }
},

"D6_POSITIVE_003": {
  "questions": [
    {
      "question_id": "q1_emotion",
      "step": "emotion",
      "prompt": "Wat voel je als jullie van mening verschillen maar het gesprek rustig blijft?",
      "helper_text": "Kies wat het meest herkenbaar is, niet wat het netst klinkt.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Opluchting — dit bewijst dat we het met elkaar kunnen hebben.", "tags": {"needs.safety": 2, "needs.connection": 1}},
        {"option_id": "B", "label": "Verbazing — ik ben niet gewend dat verschil niet escaleert.", "tags": {"needs.safety": 2, "sensitive_points.not_enough": 1}},
        {"option_id": "C", "label": "Iets van trots — dit zijn wij op ons best.", "tags": {"skills.communication": 2, "needs.connection": 1}},
        {"option_id": "D", "label": "Een lichte onzekerheid — wacht maar, het kan nog omslaan.", "tags": {"needs.safety": 2, "protections.control": 1}},
        {"option_id": "E", "label": "Vrijheid — ik mag mijn eigen mening hebben.", "tags": {"needs.freedom": 2, "needs.autonomy": 1}}
      ]
    },
    {
      "question_id": "q2_interpretation",
      "step": "interpretation",
      "prompt": "Wat zegt het dat het verschil er mag zijn?",
      "helper_text": "Wat maak jij hiervan — los van wat je zou 'moeten' denken?",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Het zegt dat wij allebei ruimte innemen — ook als we het niet eens zijn.", "tags": {"needs.freedom": 2, "needs.connection": 1}},
        {"option_id": "B", "label": "Het zegt dat onze relatie groter is dan gelijk hebben.", "tags": {"needs.connection": 2, "skills.repair": 1}},
        {"option_id": "C", "label": "Het geeft mij vertrouwen dat we ook grotere dingen aankunnen.", "tags": {"needs.safety": 2, "needs.stability": 1}},
        {"option_id": "D", "label": "Het zegt dat ik mezelf mag zijn — ook de kant die niet met jou meegaat.", "tags": {"needs.freedom": 2, "needs.autonomy": 1}},
        {"option_id": "E", "label": "Het stelt mij gerust — we hoeven niet altijd hetzelfde te denken.", "tags": {"needs.safety": 2, "needs.freedom": 1}}
      ]
    }
  ],
  "outputs": {
    "solo": {
      "mirror": "Verschil zonder escalatie — dat vraagt iets van jullie allebei. Jij merkt het verschil als dat er is: de toon blijft, de verbinding ook.",
      "protection_reflection": "Wachten op de omslag, een lichte onzekerheid — jij weet uit ervaring dat het ook anders kan gaan. Die waakzaamheid beschermt jou. Maar ze kost ook.",
      "need_reflection": "Jij hebt behoefte aan een relatie waar je van mening kunt verschillen zonder de relatie te verliezen. Dat is niet vanzelfsprekend.",
      "chance": "Dit moment is blauwdruk: zo kan het. Jullie hebben bewijs.",
      "challenge": "Kun jij na afloop zeggen: 'Dat vond ik een goed gesprek, ook al ben ik het er niet mee eens'?",
      "experiment": "Benoem het de volgende keer als een meningsverschil goed loopt: 'Ik vind het fijn dat we dit zo konden zeggen.' Dat versterkt het patroon.",
      "gentle_phrase": "Verschil mag bestaan. Verbinding ook."
    },
    "couple": {
      "comparison_intro": "Verschil van mening verdragen — dat is voor jullie misschien niet altijd even makkelijk geweest.",
      "what_a_may_hear": "A merkt de ruimte voor verschil — en dat heeft impact. Verschil was misschien niet altijd veilig.",
      "what_b_may_hear": "B heeft iets gedaan waardoor de ruimte er was. Begrijpt B dat dit voor A méér betekent dan het gesprek zelf?",
      "what_each_protects": "A beschermt zichzelf door waakzaam te blijven. B beschermt zichzelf door rustig te blijven ook als er spanning is.",
      "shared_chance": "Samen bouwen aan gesprekken waar verschil niet de verbinding kost.",
      "shared_challenge": "Hoe houden jullie de toon rustig als het echt over iets groots gaat?",
      "shared_experiment": "Oefen een mini-meningsverschil: kies een laag-risicoonderwerp en benoem bewust het verschil. Kijk hoe het voelt."
    }
  }
},

"D6_POSITIVE_004": {
  "questions": [
    {
      "question_id": "q1_reaction",
      "step": "reaction",
      "prompt": "Wat doet het met je als een spannend gesprek toch goed verloopt?",
      "helper_text": "Kies wat het meest herkenbaar is, niet wat het netst klinkt.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Opluchting — ik had het erger verwacht.", "tags": {"needs.safety": 2, "needs.stability": 1}},
        {"option_id": "B", "label": "Voldoening — wij kunnen dit.", "tags": {"skills.communication": 2, "needs.connection": 1}},
        {"option_id": "C", "label": "Iets van verbinding dat ik lang niet gevoeld had.", "tags": {"needs.connection": 3, "needs.recognition": 1}},
        {"option_id": "D", "label": "Verrassing — ik wist niet dat dit zo kon gaan.", "tags": {"needs.safety": 2, "sensitive_points.not_enough": 1}},
        {"option_id": "E", "label": "Een lichte uitputting — eerlijk zijn kost energie, ook als het goed gaat.", "tags": {"skills.vulnerability": 1, "centers.body": 1}}
      ]
    },
    {
      "question_id": "q2_need",
      "step": "need",
      "prompt": "Wat had dit gesprek nodig om te kunnen lukken?",
      "helper_text": "Niet wat je denkt dat je zou moeten willen — wat helpt jou echt?",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Rust — niet te moe, niet te gespannen, gewoon een goed moment.", "tags": {"needs.safety": 2, "needs.stability": 1}},
        {"option_id": "B", "label": "Moed van ons allebei — eerlijk zijn is risico nemen.", "tags": {"skills.vulnerability": 2, "needs.connection": 1}},
        {"option_id": "C", "label": "Een opening van de ander — ik had het niet alleen gekund.", "tags": {"needs.safety": 2, "needs.recognition": 1}},
        {"option_id": "D", "label": "Tijd — het had eerder niet gekund, nu was het rijp.", "tags": {"needs.stability": 1, "needs.safety": 1}},
        {"option_id": "E", "label": "Iets in mij dat besloot: ik zeg het nu, wat er ook van komt.", "tags": {"skills.vulnerability": 2, "needs.freedom": 1}}
      ]
    }
  ],
  "outputs": {
    "solo": {
      "mirror": "Een gesprek dat spannend begon en goed eindigde — jij merkt hoeveel er nodig was om het te laten werken.",
      "protection_reflection": "De spanning vóór het gesprek, het aftasten of het veilig genoeg is — dat is een bescherming die je al heel lang gebruikt. En soms terecht.",
      "need_reflection": "Jij hebt behoefte aan gesprekken die eerlijk zijn zonder gevaarlijk te worden. Veiligheid en eerlijkheid tegelijk — dat is de combinatie.",
      "chance": "Dit gesprek is bewijs dat het kan. Niet altijd, maar het bestaat.",
      "challenge": "Kun jij de volgende keer eerder beginnen — niet wachten tot het te zwaar is?",
      "experiment": "Spreek een check-in af: één keer per week een kort eerlijk gesprek van vijf minuten. Klein houden, regelmatig doen.",
      "gentle_phrase": "Eerlijkheid heeft jou niet gebroken. Het heeft jullie sterker gemaakt."
    },
    "couple": {
      "comparison_intro": "Een eerlijk gesprek dat lukt — dat vraagt iets van jullie allebei.",
      "what_a_may_hear": "A heeft iets gezegd wat eerder niet kon. Dat vraagt moed — en een veilige ontvangst.",
      "what_b_may_hear": "B heeft geluisterd en meegedaan. Maar weet B ook hoe groot het was voor A om te beginnen?",
      "what_each_protects": "A beschermt zichzelf door te wachten op het goede moment. B beschermt zichzelf door mee te gaan als het gesprek begint.",
      "shared_chance": "Bouwen aan de gewoonte van eerlijke gesprekken — niet wachten op crisis.",
      "shared_challenge": "Hoe maken jullie eerlijkheid normaal genoeg dat het geen evenement meer is?",
      "shared_experiment": "Plan één check-in per week: vijf minuten, elk zegt één ding dat er is. Geen oplossingen. Alleen horen."
    }
  }
},

"D6_TENSION_001": {
  "questions": [
    {
      "question_id": "q1_reaction",
      "step": "reaction",
      "prompt": "Wat doet het met jou als je advies krijgt terwijl je eigenlijk troost zocht?",
      "helper_text": "Kies wat het meest herkenbaar is, niet wat het netst klinkt.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Ik voel me minder begrepen dan geholpen — dat is niet wat ik nodig had.", "tags": {"needs.recognition": 2, "needs.connection": 2}},
        {"option_id": "B", "label": "Ik kap af — ik stop met vertellen want dit loopt verkeerd.", "tags": {"protections.withdraw": 2, "needs.recognition": 1}},
        {"option_id": "C", "label": "Ik neem het advies aan maar voel vanbinnen dat er iets mist.", "tags": {"protections.appease": 2, "needs.connection": 1}},
        {"option_id": "D", "label": "Ik word geïrriteerd — jij lost het op terwijl ik alleen maar gehoord wilde worden.", "tags": {"needs.recognition": 2, "needs.connection": 2}},
        {"option_id": "E", "label": "Ik pas het aan — ik vraag dan zelf om alleen te luisteren.", "tags": {"skills.communication": 2, "needs.recognition": 1}}
      ]
    },
    {
      "question_id": "q2_interpretation",
      "step": "interpretation",
      "prompt": "Wat hoor jij als iemand direct oplossingen aanbiedt?",
      "helper_text": "Wat maak jij hiervan — los van wat je zou 'moeten' denken?",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Ik hoor: jouw gevoel is een probleem om op te lossen.", "tags": {"sensitive_points.not_seen": 2, "needs.recognition": 2}},
        {"option_id": "B", "label": "Ik hoor: ik wil helpen, maar weet niet hoe echt gehoord worden eruitziet.", "tags": {"needs.recognition": 2, "needs.connection": 1}},
        {"option_id": "C", "label": "Ik hoor: jij moet stoppen met dit voelen en doorgaan.", "tags": {"sensitive_points.not_seen": 2, "sensitive_points.not_enough": 1}},
        {"option_id": "D", "label": "Ik hoor: ik ben ongemakkelijk met jouw gevoel.", "tags": {"sensitive_points.not_seen": 1, "needs.safety": 1}},
        {"option_id": "E", "label": "Ik hoor weinig negatiefs — advies is voor mij ook een manier van zorg.", "tags": {"needs.stability": 1, "needs.connection": 1}}
      ]
    }
  ],
  "outputs": {
    "solo": {
      "mirror": "Advies ontvangen terwijl je troost zocht — dat is geen klein verschil. Het gaat over het verschil tussen opgelost worden en gehoord worden.",
      "protection_reflection": "Afhaken, het advies aannemen of zwijgen — jij beschermt jezelf door niet te zeggen wat je eigenlijk nodig had. Dat kost minder dan uitleggen, maar laat je ook onzichtbaar.",
      "need_reflection": "Jij hebt behoefte aan iemand die bij jou blijft vóórdat die je verder helpt. Aanwezigheid voor actie.",
      "chance": "Dit moment vraagt om een eerlijke vraag: 'Kan ik je vragen om eerst gewoon te luisteren?'",
      "challenge": "Kun jij vóór je begint te vertellen zeggen wat je nodig hebt?",
      "experiment": "Zeg de volgende keer als je begint: 'Ik wil dit kwijt, ik heb geen advies nodig — alleen ruimte.' En kijk hoe het verschil voelt.",
      "gentle_phrase": "Jij mag gevoel hebben dat niet opgelost hoeft te worden."
    },
    "couple": {
      "comparison_intro": "Advies geven en troost zoeken — jullie spreken misschien een andere taal van zorg.",
      "what_a_may_hear": "A zoekt troost — en krijgt oplossingen. Dat voelt als: mijn gevoel is een probleem.",
      "what_b_may_hear": "B geeft advies vanuit betrokkenheid. Maar begrijpt B dat A daarvoor eerst iets anders nodig heeft?",
      "what_each_protects": "A beschermt zichzelf door te stoppen met vertellen. B beschermt zichzelf door actief te helpen.",
      "shared_chance": "Samen leren: vraag eerst wat de ander nodig heeft. Luisteren of meedenken?",
      "shared_challenge": "Hoe houdt B het uit om niet meteen te helpen? Hoe vraagt A vroeg genoeg om ruimte?",
      "shared_experiment": "Spreek af: bij elk serieus verhaal vraagt B eerst: 'Wil je dat ik luister of meedenk?' Oefen dat drie keer."
    }
  }
},

"D6_TENSION_002": {
  "questions": [
    {
      "question_id": "q1_emotion",
      "step": "emotion",
      "prompt": "Wat voel je als je onderbroken wordt of niet uitgesproken kunt raken?",
      "helper_text": "Kies wat het meest herkenbaar is, niet wat het netst klinkt.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Ik voel irritatie — ik was nog niet klaar.", "tags": {"needs.recognition": 2, "needs.freedom": 1}},
        {"option_id": "B", "label": "Ik stop met praten — als er toch niet geluisterd wordt, waarom dan nog?", "tags": {"protections.withdraw": 2, "needs.recognition": 2}},
        {"option_id": "C", "label": "Ik ga harder praten om toch de ruimte terug te nemen.", "tags": {"protections.control": 1, "needs.recognition": 2}},
        {"option_id": "D", "label": "Ik trek mezelf terug en denk: vergeet het maar.", "tags": {"protections.withdraw": 2, "sensitive_points.not_seen": 1}},
        {"option_id": "E", "label": "Ik pas me aan — ik maak mijn verhaal korter dan ik van plan was.", "tags": {"protections.appease": 2, "needs.recognition": 1}}
      ]
    },
    {
      "question_id": "q2_interpretation",
      "step": "interpretation",
      "prompt": "Wat zegt het patroon van onderbroken worden over de ruimte die er voor jou is?",
      "helper_text": "Wat maak jij hiervan — los van wat je zou 'moeten' denken?",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Het zegt: jouw tempo is te langzaam, jouw richting is minder interessant.", "tags": {"sensitive_points.not_seen": 2, "needs.recognition": 2}},
        {"option_id": "B", "label": "Het zegt: ik wil ook iets zeggen — maar ik vergeet daarin jou.", "tags": {"needs.recognition": 1, "needs.connection": 1}},
        {"option_id": "C", "label": "Het zegt dat er weinig echte luisterruimte is voor mij.", "tags": {"sensitive_points.not_seen": 2, "needs.attention": 1}},
        {"option_id": "D", "label": "Het zegt niets bewust — het is een patroon, geen keuze.", "tags": {"needs.stability": 1, "needs.connection": 1}},
        {"option_id": "E", "label": "Het zegt dat ik meer grenzen moet stellen in gesprekken.", "tags": {"skills.boundary_setting": 1, "needs.recognition": 1}}
      ]
    }
  ],
  "outputs": {
    "solo": {
      "mirror": "Niet uitgepraat kunnen raken — jij merkt wat er dan met jou gebeurt. Stoppen, harder praten, je aanpassen: dat zijn allemaal reacties op ruimte die er niet is.",
      "protection_reflection": "Stoppen of je aanpassen beschermt jou tegen de herhaling van tegenaan praten. Maar het geeft de ander ook het signaal dat het goed gaat. Dat klopt niet.",
      "need_reflection": "Jij hebt behoefte aan ruimte om je zin af te maken. Niet omdat je graag lang praat — maar omdat je volledig begrepen wil worden.",
      "chance": "Dit patroon is bespreekbaar — niet als klacht, maar als verzoek.",
      "challenge": "Kun jij één keer zeggen: 'Laat me even uitpraten' in plaats van stoppen?",
      "experiment": "Zeg één keer rustig: 'Ik was nog niet klaar.' Geen aanklacht. Alleen een grens.",
      "gentle_phrase": "Jij mag uitpraten. Jouw zin is het waard om afgemaakt te worden."
    },
    "couple": {
      "comparison_intro": "Ruimte in gesprekken — voor A en B kan dat heel anders aanvoelen.",
      "what_a_may_hear": "A merkt het onderbroken worden — en reageert door te stoppen of harder te praten. Dat is niet moeilijk doen, dat is overleven.",
      "what_b_may_hear": "B onderbreekt misschien vanuit enthousiasme of betrokkenheid. Maar merkt B wat het doet met A?",
      "what_each_protects": "A beschermt zichzelf door te stoppen. B beschermt zichzelf door snel te reageren.",
      "shared_chance": "Samen leren: ruimte geven is een actieve keuze.",
      "shared_challenge": "Hoe leert B wachten op het einde van A's zin? Hoe zegt A het op het moment dat het gebeurt?",
      "shared_experiment": "Oefen één gesprek waarbij B niet reageert voor A een signaal geeft dat hij/zij klaar is. Kijk hoe dat voelt voor beiden."
    }
  }
},

"D6_TENSION_003": {
  "questions": [
    {
      "question_id": "q1_reaction",
      "step": "reaction",
      "prompt": "Wat doet het met jou als je gevoel gecorrigeerd wordt op de details?",
      "helper_text": "Kies wat het meest herkenbaar is, niet wat het netst klinkt.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Ik voel me niet gehoord — het gesprek gaat ineens niet meer over mij.", "tags": {"sensitive_points.not_seen": 2, "needs.recognition": 2}},
        {"option_id": "B", "label": "Ik word defensief — of het dinsdag of woensdag was maakt niets uit.", "tags": {"protections.control": 1, "needs.recognition": 1}},
        {"option_id": "C", "label": "Ik doe er het zwijgen toe — dit loopt verkeerd.", "tags": {"protections.withdraw": 2, "sensitive_points.not_seen": 1}},
        {"option_id": "D", "label": "Ik ga mee in de discussie over de feiten — ook al was dat niet de bedoeling.", "tags": {"protections.appease": 2, "needs.recognition": 1}},
        {"option_id": "E", "label": "Ik merk het maar kan er niet altijd wat mee in het moment.", "tags": {"needs.recognition": 1, "centers.body": 1}}
      ]
    },
    {
      "question_id": "q2_interpretation",
      "step": "interpretation",
      "prompt": "Wat hoor jij als de ander de feiten recht zet in plaats van bij het gevoel te blijven?",
      "helper_text": "Wat maak jij hiervan — los van wat je zou 'moeten' denken?",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Ik hoor: jouw gevoel klopt alleen als de feiten kloppen.", "tags": {"sensitive_points.not_seen": 2, "needs.recognition": 2}},
        {"option_id": "B", "label": "Ik hoor: ik weet niet hoe ik met gevoel moet omgaan — dus ik ga naar iets wat ik kan controleren.", "tags": {"sensitive_points.not_seen": 1, "needs.connection": 1}},
        {"option_id": "C", "label": "Ik hoor: jij wil gelijk hebben.", "tags": {"protections.control": 1, "needs.recognition": 1}},
        {"option_id": "D", "label": "Ik hoor: details zijn belangrijk voor hem/haar — dat is hoe zijn/haar hoofd werkt.", "tags": {"needs.stability": 1, "needs.connection": 1}},
        {"option_id": "E", "label": "Ik hoor iets dat ik wil bespreken maar nu nog niet kan.", "tags": {"needs.honesty": 1, "skills.communication": 1}}
      ]
    }
  ],
  "outputs": {
    "solo": {
      "mirror": "Jij deelt een gevoel — en de ander corrigeert de feiten. Het gesprek gaat van hart naar bewijslast. Jij merkt die verschuiving meteen.",
      "protection_reflection": "Meegaan in de feiten of zwijgen beschermt jou tegen een debat dat je toch niet wint. Maar je verliest daarmee ook het gevoel dat er was.",
      "need_reflection": "Jij hebt behoefte aan iemand die bij jouw gevoel blijft, ook als de feiten niet precies kloppen. Gevoel heeft geen accountantscontrole nodig.",
      "chance": "Dit moment vraagt om een kleine correctie: 'Of het dinsdag was maakt voor mij niet uit — ik wil het gevoel bespreken.'",
      "challenge": "Kun jij de gespreksverschuiving benoemen zonder te beschuldigen?",
      "experiment": "Zeg één keer: 'Ik laat even de feiten los. Wat ik eigenlijk wil zeggen is: ik voelde me...' en ga daarvandaan.",
      "gentle_phrase": "Jouw gevoel hoeft niet bewezen te worden. Het is er."
    },
    "couple": {
      "comparison_intro": "Feiten en gevoelens — jullie lijken hier een verschillende taal te spreken.",
      "what_a_may_hear": "A deelt een gevoel — en voelt dat het gesprek verschuift naar wat er precies gebeurde. Dat is een kleine pijn die groot kan worden.",
      "what_b_may_hear": "B corrigeert details vanuit nauwkeurigheid, niet uit onwil. Maar begrijpt B wat die correctie doet met het gevoel van A?",
      "what_each_protects": "A beschermt zichzelf door te zwijgen of mee te gaan. B beschermt zichzelf door naar de feiten te gaan waar B grip op heeft.",
      "shared_chance": "Samen leren: gevoelens en feiten in hetzelfde gesprek — in de juiste volgorde.",
      "shared_challenge": "Hoe leert B bij gevoel te blijven vóór het over feiten gaat? Hoe zegt A dat het gesprek verschoven is?",
      "shared_experiment": "Spreek een spelregel af: bij een gevoelsgesprek mogen de eerste vijf minuten geen feiten worden gecorrigeerd. Oefen dat."
    }
  }
},

"D6_TENSION_004": {
  "questions": [
    {
      "question_id": "q1_emotion",
      "step": "emotion",
      "prompt": "Wat voel je als een gesprek steeds uitgesteld of vermeden wordt?",
      "helper_text": "Kies wat het meest herkenbaar is, niet wat het netst klinkt.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Ik voel frustratie — het hangt al te lang in de lucht.", "tags": {"needs.connection": 2, "needs.stability": 1}},
        {"option_id": "B", "label": "Ik voel onzekerheid — wil je dit gesprek eigenlijk wel met mij?", "tags": {"sensitive_points.not_chosen": 2, "needs.reassurance": 1}},
        {"option_id": "C", "label": "Ik voel eenzaamheid — ik draag dit alleen terwijl we samen zijn.", "tags": {"needs.connection": 2, "sensitive_points.not_seen": 1}},
        {"option_id": "D", "label": "Ik hou het in mijn hoofd — en het groeit.", "tags": {"needs.stability": 1, "centers.head": 1}},
        {"option_id": "E", "label": "Ik accepteer het — soms is het gewoon niet het goede moment.", "tags": {"needs.freedom": 1, "needs.stability": 1}}
      ]
    },
    {
      "question_id": "q2_sensitive_point",
      "step": "sensitive_point",
      "prompt": "Wat worden die onuitgesproken woorden voor jou naarmate ze langer wachten?",
      "helper_text": "Niet wat je denkt dat je zou moeten voelen — wat herken jij echt?",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Ze worden groter dan ze ooit bedoeld waren — de drempel stijgt.", "tags": {"needs.stability": 2, "sensitive_points.not_seen": 1}},
        {"option_id": "B", "label": "Ze worden een bewijs voor mij: dit gesprek kan niet.", "tags": {"sensitive_points.not_seen": 2, "needs.connection": 1}},
        {"option_id": "C", "label": "Ze worden een muur tussen ons — van woorden die er niet zijn.", "tags": {"sensitive_points.not_seen": 2, "needs.connection": 2}},
        {"option_id": "D", "label": "Ze worden soms bitter — iets wat ik wilde zeggen maar nooit mocht.", "tags": {"sensitive_points.not_chosen": 2, "needs.recognition": 1}},
        {"option_id": "E", "label": "Ze vervagen — ik vergeet soms zelf wat ik wilde zeggen.", "tags": {"protections.minimize": 1, "needs.stability": 1}}
      ]
    }
  ],
  "outputs": {
    "solo": {
      "mirror": "Woorden die wachten worden zwaarder — dat is jouw ervaring. Niet het gesprek zelf is het probleem, maar het steeds uitstellen ervan.",
      "protection_reflection": "Accepteren dat het 'nu even niet' is beschermt jou tegen de confrontatie. Maar het laat ook de drempel groeien tot het gesprek onmogelijk lijkt.",
      "need_reflection": "Jij hebt behoefte aan een partner die niet eindeloos uitstelt. Niet elk moment hoeft perfect te zijn — maar er moeten momenten zijn.",
      "chance": "Benoem het patroon — niet het gesprek, maar het vermijden ervan. Dat is het gesprek dat nu nodig is.",
      "challenge": "Kun jij vragen: 'Wanneer is het dan wel een goed moment?' En dat vastpinnen?",
      "experiment": "Vraag één keer: 'Ik merk dat dit al lang wacht. Kunnen we afspreken wanneer we het hebben?' Niet pushen — gewoon een moment vragen.",
      "gentle_phrase": "Jij mag vragen om tijd. Maar tijd mag ook een grens hebben."
    },
    "couple": {
      "comparison_intro": "Gesprekken vermijden of uitstellen — voor A en B zit er een heel ander gevoel aan.",
      "what_a_may_hear": "A wil praten — en wordt steeds verwezen naar later. Dat is niet alleen praktisch onhandig, dat raakt de verbinding.",
      "what_b_may_hear": "B zegt 'nu even niet' — misschien met een goede reden. Maar begrijpt B wat de herhaling ervan doet met A?",
      "what_each_protects": "A beschermt zichzelf door te blijven proberen. B beschermt zichzelf door afstand te bewaren van moeilijke gesprekken.",
      "shared_chance": "Een klein protocol maken: 'nu even niet' is oké, maar met een concreet alternatief moment.",
      "shared_challenge": "Hoe geeft B echt ruimte voor het gesprek, niet alleen uitstel? Hoe wacht A zonder druk op te bouwen?",
      "shared_experiment": "Spreek af: als iemand zegt 'nu even niet', noemen ze ook een concreet moment. Oefen dat één keer."
    }
  }
},

"D6_DEEP_001": {
  "questions": [
    {
      "question_id": "q1_emotion",
      "step": "emotion",
      "prompt": "Wat voel je als je iets niet zegt omdat je de reactie vreest?",
      "helper_text": "Kies wat het meest herkenbaar is, niet wat het netst klinkt.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Opluchting dat ik het niet gezegd heb — en meteen daarna spijt.", "tags": {"protections.withdraw": 2, "needs.recognition": 1}},
        {"option_id": "B", "label": "Frustratie op mezelf — ik weet wat ik denk maar zeg het niet.", "tags": {"needs.freedom": 2, "sensitive_points.not_enough": 1}},
        {"option_id": "C", "label": "Een soort leegte — ik ben er wel, maar niet echt.", "tags": {"sensitive_points.losing_self": 2, "needs.recognition": 1}},
        {"option_id": "D", "label": "Vermoeidheid — dit kost meer energie dan zeggen.", "tags": {"protections.withdraw": 2, "centers.body": 1}},
        {"option_id": "E", "label": "Ik herken dit niet zo — ik zeg doorgaans wat ik denk.", "tags": {"needs.autonomy": 1, "skills.communication": 1}}
      ]
    },
    {
      "question_id": "q2_sensitive_point",
      "step": "sensitive_point",
      "prompt": "Wat is er zo eng aan jouw stem laten horen?",
      "helper_text": "Niet wat je denkt dat je zou moeten voelen — wat herken jij echt?",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Dat de ander boos wordt of het gesprek escaleert.", "tags": {"needs.safety": 2, "protections.withdraw": 1}},
        {"option_id": "B", "label": "Dat ik afgewezen of genegeerd word.", "tags": {"sensitive_points.not_seen": 2, "sensitive_points.not_chosen": 1}},
        {"option_id": "C", "label": "Dat ik de relatie beschadig door te eerlijk te zijn.", "tags": {"needs.safety": 2, "protections.appease": 1}},
        {"option_id": "D", "label": "Dat mijn mening er eigenlijk niet toe doet.", "tags": {"sensitive_points.not_enough": 2, "needs.recognition": 2}},
        {"option_id": "E", "label": "Ik weet het niet precies — maar het voelt als risico.", "tags": {"needs.safety": 2, "centers.body": 1}}
      ]
    }
  ],
  "outputs": {
    "solo": {
      "mirror": "Weten wat je voelt of denkt — en het niet zeggen. Dat is geen zwakte, dat is bescherming. Maar langzaam ben je wel iets kwijt.",
      "protection_reflection": "Zwijgen beschermt je tegen conflict, afwijzing of beschadiging van de relatie. Maar het beschermt ook iets dat daadwerkelijk verlies is: je eigen stem.",
      "need_reflection": "Jij hebt behoefte aan een gesprek waar het veilig is om jezelf te zijn. Niet akkoord gaan, niet verzachten — maar echt zeggen wat er is.",
      "chance": "Jij hoeft je stem niet terug te vinden in één grote zin. Een kleine zin is al een begin.",
      "challenge": "Kun jij één keer iets zeggen dat je normaal binnenhoudt — zonder te verwachten dat het perfect landt?",
      "experiment": "Kies deze week één moment en zeg één ding dat je normaal inslikt. Niet het grootste — gewoon één.",
      "gentle_phrase": "Jouw stem mag er zijn. Dat is niet te veel gevraagd."
    },
    "couple": {
      "comparison_intro": "Een stem verliezen in een relatie — dat gaat langzaam en is moeilijk te benoemen.",
      "what_a_may_hear": "A houdt meer in dan de ander ziet. Dat maakt A onzichtbaar — ook voor zichzelf.",
      "what_b_may_hear": "B denkt misschien dat alles goed is omdat A niets zegt. Maar stil zijn is niet hetzelfde als oké zijn.",
      "what_each_protects": "A beschermt de relatie door te zwijgen. B beschermt de rust door niet door te vragen.",
      "shared_chance": "Samen ruimte maken voor wat er niet gezegd wordt.",
      "shared_challenge": "Hoe maakt B het veilig genoeg voor A om te spreken? Hoe begint A die stap te zetten?",
      "shared_experiment": "Spreek af: één keer per week vraagt B: 'Is er iets wat je wilde zeggen maar niet hebt gezegd?' Luister zonder te reageren."
    }
  }
},

"D6_DEEP_002": {
  "questions": [
    {
      "question_id": "q1_emotion",
      "step": "emotion",
      "prompt": "Wat voel je als je het gevoel hebt dat je niet werkelijk begrepen wordt?",
      "helper_text": "Kies wat het meest herkenbaar is, niet wat het netst klinkt.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Eenzaamheid — ik ben er maar ben er ook niet.", "tags": {"needs.connection": 2, "sensitive_points.not_seen": 2}},
        {"option_id": "B", "label": "Vermoeidheid — uitleggen kost energie die niks oplevert.", "tags": {"needs.recognition": 2, "protections.withdraw": 1}},
        {"option_id": "C", "label": "Frustratie — ik zeg hetzelfde maar het landt niet.", "tags": {"needs.recognition": 2, "needs.connection": 1}},
        {"option_id": "D", "label": "Berusting — ik verwacht niet meer dat het lukt.", "tags": {"protections.minimize": 2, "sensitive_points.not_seen": 2}},
        {"option_id": "E", "label": "Iets van rouw — de verbinding die ik zocht is er niet.", "tags": {"needs.connection": 3, "sensitive_points.not_seen": 1}}
      ]
    },
    {
      "question_id": "q2_sensitive_point",
      "step": "sensitive_point",
      "prompt": "Wat doe jij als begrijpen uitblijft?",
      "helper_text": "Niet wat je denkt dat je zou moeten doen — wat herken jij echt?",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Ik leg harder uit — ik zoek de juiste woorden, de juiste context.", "tags": {"protections.overperform": 2, "needs.recognition": 2}},
        {"option_id": "B", "label": "Ik trek me terug — en denk: dit heeft geen zin.", "tags": {"protections.withdraw": 3, "needs.connection": 1}},
        {"option_id": "C", "label": "Ik verander van onderwerp — en draag het zelf.", "tags": {"protections.withdraw": 2, "sensitive_points.not_seen": 1}},
        {"option_id": "D", "label": "Ik zoek het buiten deze relatie — vrienden, dagboek, iets anders.", "tags": {"needs.recognition": 2, "needs.connection": 1}},
        {"option_id": "E", "label": "Ik geef op stukje bij beetje — en vertel steeds minder.", "tags": {"protections.withdraw": 3, "sensitive_points.not_seen": 2}}
      ]
    }
  ],
  "outputs": {
    "solo": {
      "mirror": "Niet begrepen worden — en toch blijven praten, of er juist mee stoppen. Beiden zijn reacties op hetzelfde: het verlangen naar echt contact.",
      "protection_reflection": "Harder uitleggen, terugtrekken of opgeven — dat zijn manieren om te omgaan met een pijn die je niet kunt oplossen. Jij hebt geleerd: als het niet werkt, zoek een uitweg.",
      "need_reflection": "Jij hebt behoefte aan verbinding die dieper gaat dan woorden oppervlakkig terugkrijgen. Echt begrepen worden — dat is iets dat sommige mensen nooit hebben meegemaakt.",
      "chance": "Begrijpen is leerbaar. En soms begint het met zeggen: 'Ik wil dat je dit echt begrijpt. Wil je proberen het te herhalen?'",
      "challenge": "Kun jij het benoemen als je het gevoel hebt dat het niet landt — op het moment zelf?",
      "experiment": "Zeg de volgende keer als je je niet begrepen voelt: 'Ik heb het gevoel dat dit niet helemaal aankomt. Mag ik het anders proberen?' En kijk of dat een opening geeft.",
      "gentle_phrase": "Jij verdient meer dan oppervlakkig gehoord worden."
    },
    "couple": {
      "comparison_intro": "Begrepen worden — voor A is dat iets dat lang gemist kan worden zonder dat het zichtbaar is.",
      "what_a_may_hear": "A praat — maar het landt niet. Dat is een bijzondere pijn: aanwezig zijn en toch onzichtbaar.",
      "what_b_may_hear": "B hoort A spreken — maar raakt misschien de diepere laag niet. Dat is geen onwil. Maar het vraagt iets.",
      "what_each_protects": "A beschermt zichzelf door harder uit te leggen of terug te trekken. B beschermt zichzelf door oppervlakkig begrepen te hebben.",
      "shared_chance": "Samen oefenen: begrijpen vóór reageren.",
      "shared_challenge": "Hoe leert B dieper te luisteren? Hoe geeft A aan wanneer het niet landt?",
      "shared_experiment": "Oefen één gesprek waarbij B aan het einde samenvat wat A bedoeld heeft — niet de feiten maar het gevoel. A corrigeert als het niet klopt."
    }
  }
}

}

# Update cases
updated = 0
for c in cases:
    cid = c['case_id']
    if cid in D6_CASES:
        c['questions'] = D6_CASES[cid]['questions']
        c['outputs'] = D6_CASES[cid]['outputs']
        updated += 1
        print('Updated: ' + cid)

data['cases'] = cases

with open('cases.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print('\nDone! Updated ' + str(updated) + ' D6 cases.')
