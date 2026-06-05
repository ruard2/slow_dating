import json, sys
sys.stdout.reconfigure(encoding='utf-8')

D12_CASES = {

# ── POSITIVE ──────────────────────────────────────────────────────────────

"D12_POSITIVE_001": {
  "questions": [
    {
      "question_id": "D12_POSITIVE_001_Q1",
      "step": "emotion",
      "prompt": "Je partner zegt: 'Ik zie dat dit belangrijk voor je is' — over je werk, roeping of ambitie. Wat voel je op dat moment?",
      "helper_text": "Kies de emotie die het meest klopt.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Gezien — niet alleen wat ik doe, maar ook waarom het me raakt", "tags": {"needs.recognition": 2, "needs.connection": 2}},
        {"option_id": "B", "label": "Ruimte — ik hoef dit niet te verdedigen of te verkleinen", "tags": {"needs.freedom": 2, "needs.safety": 1}},
        {"option_id": "C", "label": "Opluchting — werk en relatie hoeven geen concurrenten te zijn", "tags": {"needs.connection": 2, "needs.stability": 1}},
        {"option_id": "D", "label": "Dankbaarheid — dit is precies wat ik nodig had", "tags": {"needs.recognition": 2, "needs.connection": 1}}
      ]
    },
    {
      "question_id": "D12_POSITIVE_001_Q2",
      "step": "need",
      "prompt": "Wat heb jij nodig van je partner om je roeping of ambitie te kunnen volgen zonder je schuldig te voelen?",
      "helper_text": "Kies het meest essentiële.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Dat hij/zij begrijpt waarom het me raakt — niet alleen hoe het er uitziet", "tags": {"needs.recognition": 2, "needs.connection": 2}},
        {"option_id": "B", "label": "Dat het niet steeds afgewogen wordt tegen de relatie", "tags": {"needs.freedom": 2, "needs.safety": 1}},
        {"option_id": "C", "label": "Dat er ruimte is voor mijn groei, ook als die ongemak geeft", "tags": {"needs.freedom": 2, "needs.stability": 1}},
        {"option_id": "D", "label": "Dat hij/zij af en toe vraagt hoe het écht gaat — niet alleen wat ik bereikt heb", "tags": {"needs.recognition": 2, "needs.connection": 2}}
      ]
    }
  ],
  "outputs": {
    "solo": {
      "mirror": "Gezien worden in je roeping — niet alleen getolereerd — is een van de diepste vormen van steun.",
      "protection_reflection": "Schuld over ambitie beschermt de relatie — maar het kan ook je groei klein houden.",
      "need_reflection": "Jij wil een partner die naast je groei staat, niet er omheen beweegt.",
      "chance": "Als werk en relatie geen concurrenten zijn, win je allebei.",
      "challenge": "Deel niet alleen successen — deel ook waarom het je raakt.",
      "experiment": "Vertel je partner één keer per week iets over je werk dat je innerlijk beweegt — niet wat je gedaan hebt.",
      "gentle_phrase": "Mijn roeping is onderdeel van wie ik ben — en jij mag dat kennen."
    },
    "couple": {
      "comparison_intro": "Werk dat iemand raakt, vraagt om meer dan praktische steun.",
      "what_a_may_hear": "Jij draagt iets wat betekenis heeft — en wil dat de ander dat ziet.",
      "what_b_may_hear": "Jij gaf ruimte voor iets wat groter is dan jullie routine — dat is liefde.",
      "what_each_protects": "De een beschermt zijn/haar roeping. De ander beschermt de verbinding.",
      "shared_chance": "Ambitie als gedeeld project maakt de relatie sterker dan ambitie als concurrentie.",
      "shared_challenge": "Vraag naar het waarom, niet alleen het wat.",
      "shared_experiment": "Plan één keer per maand een gesprek over hoe het gaat met wat jullie allebei drijft."
    }
  }
},

"D12_POSITIVE_002": {
  "questions": [
    {
      "question_id": "D12_POSITIVE_002_Q1",
      "step": "reaction",
      "prompt": "Jullie kiezen bewust voor rust in plaats van meer werk — samen eten, wandelen, gewoon zijn. Hoe voelt die keuze voor jou?",
      "helper_text": "Kies wat het meest klopt.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Bevrijdend — eindelijk hoef ik niet te presteren", "tags": {"needs.freedom": 2, "needs.safety": 1}},
        {"option_id": "B", "label": "Licht ongemakkelijk — er is altijd meer te doen", "tags": {"patterns.hypervigilance": 2, "needs.stability": 1}},
        {"option_id": "C", "label": "Verbindend — dit voelt als een statement over wat echt telt", "tags": {"needs.connection": 2, "skills.values_alignment": 2}},
        {"option_id": "D", "label": "Rustgevend — ik had dit nodig en wist het zelf niet", "tags": {"needs.safety": 2, "needs.stability": 2}}
      ]
    },
    {
      "question_id": "D12_POSITIVE_002_Q2",
      "step": "need",
      "prompt": "Wat maakt rust kiezen voor jou echt mogelijk — niet als toegeven, maar als keuze?",
      "helper_text": "Kies het meest herkenbare.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Dat de ander het ook wil — niet dat ik het alleen moet voorstellen", "tags": {"needs.connection": 2, "needs.recognition": 1}},
        {"option_id": "B", "label": "Dat ik weet dat het werk er morgen nog is", "tags": {"needs.stability": 2, "needs.safety": 1}},
        {"option_id": "C", "label": "Dat rust voelt als iets waardevols, niet als tijdverlies", "tags": {"skills.values_alignment": 2, "needs.freedom": 1}},
        {"option_id": "D", "label": "Dat we er allebei echt bij zijn — niet half met onze gedachten elders", "tags": {"needs.connection": 2, "needs.recognition": 1}}
      ]
    }
  ],
  "outputs": {
    "solo": {
      "mirror": "Rust kiezen terwijl er meer kan, is een van de moeilijkste vormen van zelfzorg.",
      "protection_reflection": "Het ongemak bij rust beschermt je voor het gevoel achterop te lopen — maar het kost ook verbinding.",
      "need_reflection": "Jij wil aanwezig zijn — in je werk én in je relatie. Dat vraagt bewuste keuzes.",
      "chance": "Bewust niets doen is ook productief — voor de relatie en voor jezelf.",
      "challenge": "Zet de telefoon weg. Niet als regel, maar als keuze.",
      "experiment": "Bescherm één avond per week als 'van ons' — geen werk, geen plannen.",
      "gentle_phrase": "Wij zijn meer dan wat we produceren."
    },
    "couple": {
      "comparison_intro": "Jullie kozen samen voor aanwezigheid boven productiviteit. Dat is niet vanzelfsprekend.",
      "what_a_may_hear": "Jij had even niets hoeven doen — en dat was meer waard dan je dacht.",
      "what_b_may_hear": "Jij ook — en samen voelde dat als thuis.",
      "what_each_protects": "De een beschermt ritme. De ander beschermt verbinding.",
      "shared_chance": "Bewust rust kiezen als stel is een investering in de basis.",
      "shared_challenge": "Bescherm de rustmomenten — ze verdwijnen als je ze niet plant.",
      "shared_experiment": "Spreek af: één avond per week is van ons. Geen uitzonderingen behalve echt nood."
    }
  }
},

"D12_POSITIVE_003": {
  "questions": [
    {
      "question_id": "D12_POSITIVE_003_Q1",
      "step": "emotion",
      "prompt": "Er is iets gelukt — project, deadline, promotie, examen. Jullie staan er samen even bij stil. Wat voel je als succes gedeeld wordt?",
      "helper_text": "Kies de emotie die het meest klopt.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Volledigheid — het voelt pas echt als hij/zij het ook weet", "tags": {"needs.connection": 2, "needs.recognition": 2}},
        {"option_id": "B", "label": "Warmte — succes alleen is minder dan succes gedeeld", "tags": {"needs.connection": 2, "needs.recognition": 1}},
        {"option_id": "C", "label": "Verrassing — ik ben niet gewend dat succes gevierd wordt", "tags": {"sensitive_points.not_seen": 2, "needs.recognition": 2}},
        {"option_id": "D", "label": "Voldoening — dit is waarom we hard werken", "tags": {"needs.stability": 1, "needs.recognition": 1}}
      ]
    },
    {
      "question_id": "D12_POSITIVE_003_Q2",
      "step": "need",
      "prompt": "Wat heb jij nodig als je iets bereikt — zodat het echt gevierd voelt en niet vluchtig?",
      "helper_text": "Kies het meest essentiële.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Dat de ander er even bij stilstaat — niet meteen doorgaat", "tags": {"needs.recognition": 2, "needs.connection": 1}},
        {"option_id": "B", "label": "Dat hij/zij vraagt hoe het voelde — niet alleen wat er gebeurde", "tags": {"needs.recognition": 2, "needs.connection": 2}},
        {"option_id": "C", "label": "Een concreet moment van vieren — hoe klein ook", "tags": {"needs.connection": 2, "needs.stability": 1}},
        {"option_id": "D", "label": "Dat mijn succes ook zijn/haar succes voelt — samen", "tags": {"needs.connection": 2, "skills.teamwork": 1}}
      ]
    }
  ],
  "outputs": {
    "solo": {
      "mirror": "Succes dat niet gedeeld wordt, voelt onaf. Jij hebt iemand nodig die het even vasthoudt met je.",
      "protection_reflection": "Verrassing bij het vieren beschermt je voor teleurstelling — maar het houdt je ook klein.",
      "need_reflection": "Jij wil dat jouw prestaties tellen — ook thuis, niet alleen in het werk.",
      "chance": "Succes vieren versterkt de motivatie voor de volgende stap.",
      "challenge": "Zeg het hardop als je iets bereikt hebt — maak het zichtbaar.",
      "experiment": "Vier dit weekend iets wat je bereikt hebt — hoe oud ook. Gewoon omdat het telt.",
      "gentle_phrase": "Mijn succes mag gevierd worden — ook thuis."
    },
    "couple": {
      "comparison_intro": "Succes delen maakt het meer — en de relatie sterker.",
      "what_a_may_hear": "Jij bereikte iets — en wil dat dat ook telt in jullie leven samen.",
      "what_b_may_hear": "Jij gaf ruimte aan het succes van de ander — dat is ook een vorm van liefde.",
      "what_each_protects": "De een beschermt zijn/haar prestaties. De ander beschermt verbinding.",
      "shared_chance": "Successen vieren als stel geeft brandstof voor het volgende doel.",
      "shared_challenge": "Stop even bij successen — voor je doorgaat naar het volgende.",
      "shared_experiment": "Vier deze week iets wat jullie allebei bereikt hebben — gezamenlijk of ieder apart."
    }
  }
},

"D12_POSITIVE_004": {
  "questions": [
    {
      "question_id": "D12_POSITIVE_004_Q1",
      "step": "reaction",
      "prompt": "Je partner legt uit wat werk innerlijk vraagt — niet alleen 'druk', maar spanning, verantwoordelijkheid, verlangen of moeheid. Hoe reageer jij?",
      "helper_text": "Kies wat het meest klopt.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Ik voel verbinding — dit soort eerlijkheid mist ik vaak", "tags": {"needs.connection": 2, "skills.vulnerability": 2}},
        {"option_id": "B", "label": "Ik begrijp het beter — werk is opeens minder concurrent", "tags": {"skills.empathy": 2, "needs.connection": 1}},
        {"option_id": "C", "label": "Ik voel ook de behoefte om hetzelfde te delen over mijn werk", "tags": {"skills.vulnerability": 2, "needs.recognition": 1}},
        {"option_id": "D", "label": "Ik weet niet altijd hoe ik moet reageren maar ik waardeer de eerlijkheid", "tags": {"needs.connection": 1, "skills.regulation": 1}}
      ]
    },
    {
      "question_id": "D12_POSITIVE_004_Q2",
      "step": "need",
      "prompt": "Wat heb jij nodig om over werk te kunnen praten zonder dat het alleen logistiek of klagen wordt?",
      "helper_text": "Kies het meest essentiële.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Dat de ander vraagt naar het gevoel, niet alleen de feiten", "tags": {"needs.recognition": 2, "needs.connection": 2}},
        {"option_id": "B", "label": "Ruimte om te zeggen dat het moeilijk is zonder meteen advies te krijgen", "tags": {"needs.safety": 2, "needs.recognition": 1}},
        {"option_id": "C", "label": "Dat werk ook een gedeeld gespreksonderwerp is — geen solo-verhaal", "tags": {"needs.connection": 2, "needs.recognition": 1}},
        {"option_id": "D", "label": "Dat ik niet hoef te performen thuis — ook als het niet goed gaat", "tags": {"needs.safety": 2, "needs.freedom": 1}}
      ]
    }
  ],
  "outputs": {
    "solo": {
      "mirror": "Werk eerlijk bespreken — niet alleen rapporteren — maakt het lichter én verbindt.",
      "protection_reflection": "Als je werk alleen als feiten deelt, bescherm je jezelf voor kwetsbaarheid. Maar het houdt je ook op afstand.",
      "need_reflection": "Jij wil thuis ook gezien worden in wat werk innerlijk vraagt — niet alleen in wat je presteert.",
      "chance": "Werk als gedeeld gesprekonderwerp maakt de relatie rijker.",
      "challenge": "Deel één keer per week iets over werk dat je raakt — niet wat je gedaan hebt.",
      "experiment": "Vraag je partner vanavond: 'Wat vroeg je werk vandaag van je vanbinnen?'",
      "gentle_phrase": "Thuis mag ik ook moe zijn van wat goed gaat."
    },
    "couple": {
      "comparison_intro": "Eerlijkheid over het innerlijke leven van werk brengt jullie dichter bij elkaar.",
      "what_a_may_hear": "Jij deelde meer dan feiten — en dat was verbinding.",
      "what_b_may_hear": "Jij ontving dat — en zag de ander een beetje meer.",
      "what_each_protects": "De een beschermt zichzelf door te delen. De ander beschermt door te luisteren.",
      "shared_chance": "Werk als gedeelde werkelijkheid maakt het minder een rivaal van de relatie.",
      "shared_challenge": "Vraag naar het gevoel achter het werk — niet alleen de uitkomst.",
      "shared_experiment": "Check in één keer per week: 'Wat vroeg je werk deze week van je — niet wat deed je, maar wat kostte het je?'"
    }
  }
},

# ── TENSION ───────────────────────────────────────────────────────────────

"D12_TENSION_001": {
  "questions": [
    {
      "question_id": "D12_TENSION_001_Q1",
      "step": "reaction",
      "prompt": "Nog even mailen. Nog één overleg. Nog snel iets afmaken. Werk wint steeds. Hoe merk jij dat bij jezelf — of bij de ander?",
      "helper_text": "Kies de meest herkenbare reactie.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Ik zeg niks maar voel me steeds wat eenzamer thuis", "tags": {"sensitive_points.loneliness": 2, "protections.withdrawal": 1}},
        {"option_id": "B", "label": "Ik maak een opmerking die scherper klinkt dan ik wil", "tags": {"patterns.escalation": 2, "needs.recognition": 1}},
        {"option_id": "C", "label": "Ik pas me aan — maar er groeit wrok onder", "tags": {"patterns.resentment": 2, "patterns.pleasing": 1}},
        {"option_id": "D", "label": "Ik voel schuld als ik de ander erop wijs — alsof ik werk aanval", "tags": {"patterns.self_blame": 2, "needs.recognition": 1}}
      ]
    },
    {
      "question_id": "D12_TENSION_001_Q2",
      "step": "interpretation",
      "prompt": "Als werk steeds wint van samen zijn — wat zegt jij jezelf dan over jullie prioriteiten?",
      "helper_text": "Kies de meest herkenbare gedachte.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "'Ik ben minder belangrijk dan zijn/haar werk'", "tags": {"sensitive_points.rejection": 2, "needs.recognition": 2}},
        {"option_id": "B", "label": "'Hij/zij kiest voor werk omdat het makkelijker is dan wij'", "tags": {"patterns.catastrophizing": 2, "needs.connection": 1}},
        {"option_id": "C", "label": "'We investeren allebei te weinig in ons samen — niet alleen hij/zij'", "tags": {"skills.insight": 2, "needs.connection": 1}},
        {"option_id": "D", "label": "'Dit is tijdelijk — maar het duurt al zo lang dat ik het niet meer geloof'", "tags": {"patterns.resentment": 2, "needs.stability": 1}}
      ]
    }
  ],
  "outputs": {
    "solo": {
      "mirror": "Als werk steeds wint, stapelt het gevoel van tweede plek zijn zich op — ook als dat de bedoeling niet is.",
      "protection_reflection": "Niets zeggen beschermt de vrede, maar de groeiende wrok maakt het groter.",
      "need_reflection": "Jij wil niet op de eerste plek hoeven strijden — je wil gewoon gekozen worden.",
      "chance": "Dit gesprek is te voeren — niet als aanval op werk, maar als verlangen naar verbinding.",
      "challenge": "Zeg het zonder het groter te maken: 'Ik mis je.'",
      "experiment": "Bespreek samen: hoeveel tijd willen we per week bewust voor ons reserveren?",
      "gentle_phrase": "Werk is belangrijk — en wij ook."
    },
    "couple": {
      "comparison_intro": "Werk als concurrent van de relatie sluipt erin — en voelt voor beiden anders.",
      "what_a_may_hear": "Jij voelt de afstand — en wil dat de ander dat ook ziet.",
      "what_b_may_hear": "Jij werkt hard — misschien ook voor jullie. Maar het wordt niet zo ontvangen.",
      "what_each_protects": "De een beschermt verbinding. De ander beschermt prestatie of plicht.",
      "shared_chance": "Jullie kunnen samen besluiten wat prioriteit heeft — en dat ook nakomen.",
      "shared_challenge": "Maak grenzen rond werk expliciet — geen 'probeer' maar 'we spreken af'.",
      "shared_experiment": "Stel samen in: wat is de werkgrens op avonden en weekenden? En houd je eraan."
    }
  }
},

"D12_TENSION_002": {
  "questions": [
    {
      "question_id": "D12_TENSION_002_Q1",
      "step": "reaction",
      "prompt": "De één ziet kansen of wil groeien. De ander vraagt: wanneer is het genoeg? Hoe reageer jij als dat verschil zichtbaar wordt?",
      "helper_text": "Kies de meest herkenbare reactie.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Ik voel me geremd — alsof mijn ambitie een probleem is", "tags": {"needs.freedom": 2, "sensitive_points.not_respected": 1}},
        {"option_id": "B", "label": "Ik snap de zorg van de ander maar wil niet ophouden met groeien", "tags": {"skills.empathy": 2, "needs.freedom": 1}},
        {"option_id": "C", "label": "Ik vraag me af of we wel hetzelfde willen in het leven", "tags": {"patterns.catastrophizing": 2, "needs.stability": 1}},
        {"option_id": "D", "label": "Ik voel mij verantwoordelijk voor de onrust bij de ander", "tags": {"patterns.self_blame": 2, "patterns.pleasing": 1}}
      ]
    },
    {
      "question_id": "D12_TENSION_002_Q2",
      "step": "interpretation",
      "prompt": "Achter het verschil in ambitie liggen vaak diepere vragen. Welke herkent jij het meest?",
      "helper_text": "Kies de meest herkenbare.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Wanneer is het genoeg — voor jou, voor ons, voor het leven?", "tags": {"needs.stability": 2, "skills.values_alignment": 1}},
        {"option_id": "B", "label": "Wie mag bepalen wat wij samen nastreven?", "tags": {"needs.freedom": 2, "needs.fairness": 1}},
        {"option_id": "C", "label": "Betekent groei voor jou ook ruimte voor mij?", "tags": {"needs.connection": 2, "needs.recognition": 1}},
        {"option_id": "D", "label": "Ben ik veilig als jij zo hard groeit en ik niet?", "tags": {"needs.safety": 2, "sensitive_points.not_good_enough": 1}}
      ]
    }
  ],
  "outputs": {
    "solo": {
      "mirror": "Ambitieverschil is zelden over ambitie alleen — het gaat over veiligheid, aanwezigheid en genoeg.",
      "protection_reflection": "Je ambitie remmen om de ander te beschermen kost jou iets. Benoem dat.",
      "need_reflection": "Jij wil groeien én verbonden blijven. Die twee hoeven geen tegenstelling te zijn.",
      "chance": "Het gesprek over ambitie kan een gesprek worden over wat jullie allebei nodig hebben.",
      "challenge": "Benoem de behoefte achter het standpunt — niet het standpunt zelf.",
      "experiment": "Vraag: 'Wat maakt mijn ambitie onrustig voor jou?' Luister voor je antwoordt.",
      "gentle_phrase": "Mijn groei hoeft jouw veiligheid niet te kosten."
    },
    "couple": {
      "comparison_intro": "Ambitieverschil raakt veiligheid, vrijheid en de vraag: waar gaan we samen heen?",
      "what_a_may_hear": "Jij wil groeien — en voelt je geremd door zorg van de ander.",
      "what_b_may_hear": "Jij wil rust — en vraagt je af of er ook ruimte is voor jullie in al die groei.",
      "what_each_protects": "De een beschermt eigen richting. De ander beschermt de stabiliteit van de relatie.",
      "shared_chance": "Ambitie en veiligheid kunnen naast elkaar bestaan als jullie het gesprek voeren.",
      "shared_challenge": "Maak de diepere vraag expliciet — niet de oppervlakkige discussie over meer of minder.",
      "shared_experiment": "Vertel elkaar: wat betekent 'genoeg' voor jou — in werk, in leven, in de relatie?"
    }
  }
},

"D12_TENSION_003": {
  "questions": [
    {
      "question_id": "D12_TENSION_003_Q1",
      "step": "emotion",
      "prompt": "Er is een baan of kans elders. Voor de één voelt het als kans, voor de ander als verlies. Wat voel jij als dat verschil er ligt?",
      "helper_text": "Kies de emotie die het meest klopt.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Verdeeld — ik wil voor de ander kiezen, maar ook voor mezelf", "tags": {"needs.freedom": 2, "needs.connection": 2}},
        {"option_id": "B", "label": "Angst — stel dat we er niet uitkomen en dit ons breekt", "tags": {"sensitive_points.abandonment": 2, "needs.stability": 1}},
        {"option_id": "C", "label": "Schuldgevoel — mijn kans kost de ander iets", "tags": {"sensitive_points.guilt": 2, "patterns.self_blame": 1}},
        {"option_id": "D", "label": "Onbegrip — ik snap niet waarom dit voor de ander zo groot voelt", "tags": {"skills.empathy": 1, "needs.connection": 1}}
      ]
    },
    {
      "question_id": "D12_TENSION_003_Q2",
      "step": "interpretation",
      "prompt": "Als één van jullie moet kiezen tussen werk elders en jullie leven hier — wat staat er dan eigenlijk op het spel?",
      "helper_text": "Kies de meest herkenbare gedachte.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Wie van ons het meeste inlevert — en of dat eerlijk is", "tags": {"needs.fairness": 2, "needs.recognition": 1}},
        {"option_id": "B", "label": "Of wij sterk genoeg zijn om dit samen te dragen", "tags": {"needs.stability": 2, "needs.connection": 1}},
        {"option_id": "C", "label": "Of mijn dromen en onze dromen ooit gelijk lopen", "tags": {"needs.freedom": 2, "needs.connection": 2}},
        {"option_id": "D", "label": "Of de ander mij ook zou volgen als de rollen omgedraaid waren", "tags": {"needs.fairness": 2, "needs.safety": 1}}
      ]
    }
  ],
  "outputs": {
    "solo": {
      "mirror": "Verhuizen voor werk is zelden alleen een logistieke vraag — het is een vraag over wie wie volgt en waarom.",
      "protection_reflection": "Schuldgevoel over je kans beschermt de ander — maar het kan ook je eigen wens inslikken.",
      "need_reflection": "Jij wil een kans grijpen én de ander niet verliezen. Beide zijn echte behoeften.",
      "chance": "Dit gesprek kan jullie relatie dieper maken — als jullie de echte vragen stellen.",
      "challenge": "Praat over wat je allebei vreest te verliezen — niet alleen wat je hoopt te winnen.",
      "experiment": "Schrijf elk apart op: wat wil ik, wat ben ik bereid op te geven, wat heb ik nodig van de ander?",
      "gentle_phrase": "We kunnen dit samen dragen — als we allebei eerlijk zijn over wat het kost."
    },
    "couple": {
      "comparison_intro": "Een kans elders vraagt om meer dan een ja of nee — het vraagt om echt gesprek.",
      "what_a_may_hear": "Jij ziet een kans — en hoopt dat de ander dat ook ziet.",
      "what_b_may_hear": "Jij voelt verlies — en wil dat dat ook gezien wordt.",
      "what_each_protects": "De een beschermt groei en richting. De ander beschermt thuis en stabiliteit.",
      "shared_chance": "Als jullie allebei eerlijk zijn over wat het kost, kunnen jullie een echte beslissing nemen.",
      "shared_challenge": "Maak het geen discussie over wie gelijk heeft — maak het een gesprek over wat jullie nodig hebben.",
      "shared_experiment": "Schrijf elk apart: wat wil ik, wat ben ik bereid te geven, wat heb ik nodig? Deel en bespreek."
    }
  }
},

"D12_TENSION_004": {
  "questions": [
    {
      "question_id": "D12_TENSION_004_Q1",
      "step": "reaction",
      "prompt": "Buiten ben je op je best. Thuis zijn je restjes. Je partner krijgt niet het slechtste van je uit onwil — maar wel het minste. Hoe merk jij dat bij jezelf?",
      "helper_text": "Kies de meest herkenbare reactie.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Ik merk het pas als de ander er iets van zegt — dan schrik ik", "tags": {"patterns.avoidance": 2, "needs.recognition": 1}},
        {"option_id": "B", "label": "Ik weet het, maar ik kan er op dat moment niks aan doen", "tags": {"needs.safety": 1, "patterns.resignation": 1}},
        {"option_id": "C", "label": "Ik voel schuld maar ben ook gewoon op", "tags": {"sensitive_points.guilt": 2, "needs.safety": 1}},
        {"option_id": "D", "label": "Ik snap het van mezelf, maar snap ook dat het pijn doet bij de ander", "tags": {"skills.insight": 2, "skills.empathy": 2}}
      ]
    },
    {
      "question_id": "D12_TENSION_004_Q2",
      "step": "interpretation",
      "prompt": "Als thuis altijd de restenergie krijgt — wat zegt dat over hoe jij de relatie beleeft, denk je?",
      "helper_text": "Kies de meest herkenbare gedachte.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "'Thuis voelt veilig genoeg om neer te vallen — dat is ook een vorm van vertrouwen'", "tags": {"needs.safety": 2, "skills.insight": 1}},
        {"option_id": "B", "label": "'Ik investeer te weinig in ons en dat gaat op den duur kosten'", "tags": {"skills.insight": 2, "needs.connection": 1}},
        {"option_id": "C", "label": "'Werk vraagt zoveel dat ik daarna niets meer heb — en ik weet niet hoe ik dat verander'", "tags": {"needs.safety": 2, "patterns.resignation": 1}},
        {"option_id": "D", "label": "'De relatie trekt als een vanzelfsprekendheid — en dat is niet eerlijk tegenover de ander'", "tags": {"needs.fairness": 2, "needs.connection": 1}}
      ]
    }
  ],
  "outputs": {
    "solo": {
      "mirror": "Thuis de restjes ontvangen is een stille pijn — en thuis de restjes geven ook.",
      "protection_reflection": "Neerploffen thuis is een teken van vertrouwen — maar het vraagt ook iets van de relatie.",
      "need_reflection": "Jij wil meer energie hebben voor thuis. Dat vraagt niet alleen wilskracht — het vraagt grenzen bij werk.",
      "chance": "Als je weet wanneer je leegloopt, kun je beter bewaken wat je meeneemt naar huis.",
      "challenge": "Bouw een overgang in tussen werk en thuis — hoe klein ook.",
      "experiment": "Maak een ritueel van tien minuten: wandelen, muziek, rijden zonder podcasts — zodat je echt aankomt.",
      "gentle_phrase": "Mijn partner verdient meer dan mijn restjes — en ik ook."
    },
    "couple": {
      "comparison_intro": "Restenergie thuis is een veelvoorkomend pijnpunt — en het is goed dat het benoemd wordt.",
      "what_a_may_hear": "Jij geeft thuis wat overblijft — niet uit onwil, maar uit uitputting.",
      "what_b_may_hear": "Jij ontvangt de restjes — en dat doet pijn, ook als je het begrijpt.",
      "what_each_protects": "De een beschermt zijn/haar energie. De ander beschermt de verbinding.",
      "shared_chance": "Als jullie dit benoemen, kunnen jullie samen zoeken naar een overgang.",
      "shared_challenge": "Maak thuis geen vanzelfsprekendheid — ook als het vertrouwd voelt.",
      "shared_experiment": "Spreek af: bij thuiskomst eerst tien minuten decompressie, daarna aanwezig zijn."
    }
  }
},

# ── DEEP ──────────────────────────────────────────────────────────────────

"D12_DEEP_001": {
  "questions": [
    {
      "question_id": "D12_DEEP_001_Q1",
      "step": "sensitive_point",
      "prompt": "Als werk wegvalt, mislukt of minder wordt — welke diepe vraag komt dan op?",
      "helper_text": "Kies het meest kwetsbare.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "'Wie ben ik zonder mijn functie of rol?'", "tags": {"sensitive_points.identity": 2, "sensitive_points.not_good_enough": 2}},
        {"option_id": "B", "label": "'Ben ik nog waardevol als ik niet presteer?'", "tags": {"sensitive_points.not_good_enough": 2, "sensitive_points.shame": 1}},
        {"option_id": "C", "label": "'Wat houd ik over als ik het druk-zijn loslaat?'", "tags": {"sensitive_points.identity": 2, "needs.stability": 1}},
        {"option_id": "D", "label": "'Zien mensen mij nog als ik niet meer succesvol ben?'", "tags": {"sensitive_points.not_seen": 2, "sensitive_points.rejection": 1}}
      ]
    },
    {
      "question_id": "D12_DEEP_001_Q2",
      "step": "emotion",
      "prompt": "Als je identiteit nauw verweven is met werk — wat heb je dan nodig buiten werk om je waarde te voelen?",
      "helper_text": "Kies wat het meest resoneert.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Mensen die mij zien buiten mijn prestaties", "tags": {"needs.recognition": 3, "needs.connection": 2}},
        {"option_id": "B", "label": "Iets wat ik doe puur omdat ik het mooi vind — zonder resultaat", "tags": {"needs.freedom": 2, "needs.connection": 1}},
        {"option_id": "C", "label": "Een partner die mij evenveel waardeert op mijn slechtste dag", "tags": {"needs.recognition": 2, "needs.safety": 2}},
        {"option_id": "D", "label": "Rust om te ontdekken wie ik ben buiten de rol", "tags": {"needs.freedom": 2, "needs.stability": 1}}
      ]
    }
  ],
  "outputs": {
    "solo": {
      "mirror": "Werk dat betekenis geeft is mooi. Maar als het ook je identiteit is, ben je kwetsbaar als het wankelt.",
      "protection_reflection": "Je waarde in werk stoppen beschermt je voor de vraag wie je bent als het wegvalt — maar die vraag verdient een antwoord.",
      "need_reflection": "Jij verdient een identiteit die groter is dan je CV — en een partner die je daarin ziet.",
      "chance": "Wie ben je buiten je werk? Die vraag is een geschenk als je hem rustig kunt stellen.",
      "challenge": "Doe iets deze week zonder doel, resultaat of productiviteit. Puur omdat je het mooi vindt.",
      "experiment": "Schrijf: wie ben ik als ik niet werk? Niet wie wil ik zijn — wie ben ik al.",
      "gentle_phrase": "Ik ben meer dan wat ik doe."
    },
    "couple": {
      "comparison_intro": "Identiteit in werk raakt de relatie — zeker als het werk wankelt.",
      "what_a_may_hear": "Jij bent meer dan je functie — maar dat voelen is moeilijker dan weten.",
      "what_b_may_hear": "Jij ziet de ander ook buiten het werk — laat dat dan ook merken.",
      "what_each_protects": "De een beschermt eigenwaarde via prestatie. De ander beschermt de relatie door aanwezig te zijn.",
      "shared_chance": "Als jullie elkaars waarde buiten werk benoemen, geef je de ander een fundament.",
      "shared_challenge": "Vertel elkaar wat je waardeert in de ander dat niets met werk te maken heeft.",
      "shared_experiment": "Schrijf elk drie dingen op die je waardeert in de ander — niet één ervan mag over werk gaan."
    }
  }
},

"D12_DEEP_002": {
  "questions": [
    {
      "question_id": "D12_DEEP_002_Q1",
      "step": "sensitive_point",
      "prompt": "Lichaam, hoofd of ziel zegt stop. Burn-out, uitputting, niet meer kunnen. Welk gevoel overheerst?",
      "helper_text": "Kies het meest kwetsbare.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Schaamte — ik hoor dit te kunnen, anderen kunnen het ook", "tags": {"sensitive_points.shame": 2, "sensitive_points.not_good_enough": 2}},
        {"option_id": "B", "label": "Boosheid — ik heb te lang te veel gedaan en niemand zag het", "tags": {"sensitive_points.not_seen": 2, "patterns.resentment": 2}},
        {"option_id": "C", "label": "Angst — stel dat ik dit niet meer te boven kom", "tags": {"sensitive_points.not_good_enough": 2, "needs.safety": 2}},
        {"option_id": "D", "label": "Verdriet — ik ben mezelf kwijtgeraakt in alles wat ik deed", "tags": {"sensitive_points.identity": 2, "sensitive_points.grief": 2}}
      ]
    },
    {
      "question_id": "D12_DEEP_002_Q2",
      "step": "emotion",
      "prompt": "Als je niet meer kunt — wat heb je dan het meest nodig van je partner?",
      "helper_text": "Kies wat het diepst resoneert.",
      "input_type": "single_choice",
      "options": [
        {"option_id": "A", "label": "Dat hij/zij voor mij zorgt zonder het te framen als zwakte", "tags": {"needs.safety": 2, "needs.recognition": 2}},
        {"option_id": "B", "label": "Dat ik mag stoppen zonder uitleg of verantwoording", "tags": {"needs.freedom": 2, "needs.safety": 2}},
        {"option_id": "C", "label": "Dat hij/zij naast me zit — niet probleemoplossend, gewoon er", "tags": {"needs.connection": 2, "needs.safety": 2}},
        {"option_id": "D", "label": "Dat ik niet bang hoef te zijn voor zijn/haar teleurstelling in mij", "tags": {"needs.safety": 2, "sensitive_points.rejection": 1}}
      ]
    }
  ],
  "outputs": {
    "solo": {
      "mirror": "Burn-out is het lichaam dat eerder stopte dan jij wilde. Het is geen falen — het is een grens die lang genegeerd is.",
      "protection_reflection": "Schaamte over uitputting beschermt je voor het oordeel van anderen — maar het houdt je ook weg van de hulp die je nodig hebt.",
      "need_reflection": "Jij verdient zorg — niet als beloning voor prestatie, maar als mens.",
      "chance": "Stoppen is soms het moedigste wat je kunt doen.",
      "challenge": "Vraag om hulp — eén concrete vraag aan je partner of arts.",
      "experiment": "Zeg het hardop: 'Ik kom er even niet meer doorheen.' Kijk wat er dan gebeurt.",
      "gentle_phrase": "Ik mag stoppen. Dat is geen zwakte — dat is zelfzorg."
    },
    "couple": {
      "comparison_intro": "Burn-out of uitputting raakt jullie allebei — elk op eigen manier.",
      "what_a_may_hear": "Jij kunt even niet meer — en dat mag gezegd worden.",
      "what_b_may_hear": "Jij ziet de ander uitgeput — en weet misschien niet hoe je moet helpen.",
      "what_each_protects": "De een beschermt zichzelf door door te gaan. De ander beschermt de ander door er te zijn.",
      "shared_chance": "Dit is een moment om de dynamiek te herzien — samen.",
      "shared_challenge": "Vraag niet wat je kunt oplossen — vraag wat de ander nodig heeft.",
      "shared_experiment": "Spreek deze week af: wat kan ik overnemen? Zonder discussie — gewoon doen."
    }
  }
}

} # end D12_CASES

# ── Update cases.json ──────────────────────────────────────────────────────

with open('cases.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

updated = 0
for c in data['cases']:
    dom = c.get('domain', {})
    did = dom.get('domain_id') if isinstance(dom, dict) else dom
    cid = c['case_id']
    if did == 'D12' and cid in D12_CASES:
        c['questions'] = D12_CASES[cid]['questions']
        c['outputs']   = D12_CASES[cid]['outputs']
        print('Updated:', cid)
        updated += 1

with open('cases.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f'\nDone! Updated {updated} D12 cases.')
