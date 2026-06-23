export const christianPrompts = [
  "Welke eerste reactie van jezelf wil je in gebed aan God toevertrouwen?",
  "Waar zou je willen dat je impuls meer lijkt op geduld, zachtheid of vergeving?",
  "Hoe kan jullie geloof helpen om in onverwachte momenten genadig te reageren?",
] as const;

export type ReactionCard = {
  id: string;
  category:
    | "samenleven"
    | "toekomst"
    | "ongemak"
    | "sociaal"
    | "avontuur";
  scenario: string;
  options: readonly [string, string, string, string];
  insight: string;
};

export const reactionCards: readonly ReactionCard[] = [
  {
    id: "older-sofa",
    category: "toekomst",
    scenario:
      "We zijn vijftig jaar ouder. Jij bent diep in de bank gezakt en zegt: 'Schat, de afstandsbediening ligt aan jouw kant.'",
    options: [
      "Ik geef hem aan en zucht liefdevol",
      "Ik zeg dat bewegen gezond blijft",
      "Ik koop spraakbediening",
      "Ik doe alsof ik slaap",
    ],
    insight: "Hoe verdelen jullie later gemak, zorg en een klein beetje luiheid?",
  },
  {
    id: "pet-election",
    category: "samenleven",
    scenario:
      "We mogen samen één dier nemen. De eindstrijd gaat tussen een hond, kat, parkiet en cavia.",
    options: ["Hond, samen naar buiten", "Kat, eigenwijs is goed", "Parkiet, leven in huis", "Cavia, klein maar gezellig"],
    insight: "Wat zegt jullie dierenkeuze over ruimte, ritme en gezelligheid?",
  },
  {
    id: "child-poop",
    category: "ongemak",
    scenario:
      "Een kind heeft midden in een chic restaurant een indrukwekkende poepexplosie. Wie handelt?",
    options: ["Ik pak dit heldhaftig op", "Jij bent duidelijk beter hierin", "Samen, met professioneel teamwerk", "We verhuizen naar een andere tafel"],
    insight: "Wie stapt naar voren als iets vies, druk en publiek wordt?",
  },
  {
    id: "own-poop",
    category: "ongemak",
    scenario:
      "Eén van ons heeft buikgriep in een piepkleine hotelkamer. Romantiek is tijdelijk een theoretisch begrip.",
    options: ["Volledige zorgstand aan", "Lief zijn vanaf veilige afstand", "Veel grappen, weinig oogcontact", "Nieuw hotel, zelfde liefde"],
    insight: "Hoeveel lichamelijke ongemakkelijkheid kan jullie nabijheid verdragen?",
  },
  {
    id: "wrong-train",
    category: "avontuur",
    scenario:
      "We zitten vrolijk in de trein. Na veertig minuten blijkt dat we precies de verkeerde kant op reizen.",
    options: ["Hard lachen en uitstappen", "Direct een nieuw plan maken", "Eerst vaststellen wiens schuld dit was", "Doorrijden: blijkbaar is dit de reis"],
    insight: "Wat gebeurt er bij jullie wanneer een plan onverwacht mislukt?",
  },
  {
    id: "lottery",
    category: "toekomst",
    scenario: "Morgen winnen we onverwacht tien miljoen euro. Wat doen we als eerste?",
    options: ["Niemand vertellen", "Een lange reis boeken", "Een huis voor rust kopen", "Familie en vrienden verrassen"],
    insight: "Waar zoeken jullie vrijheid als geld plotseling geen beperking meer is?",
  },
  {
    id: "snoring",
    category: "samenleven",
    scenario:
      "Ik snurk zo hard dat een slaapapp denkt dat er wegwerkzaamheden zijn.",
    options: ["Je duwt me zachtjes om", "Je neemt het op als bewijs", "Je verhuist die nacht", "Je koopt oordoppen voor ons jubileum"],
    insight: "Hoe direct en hoe speels zijn jullie bij dagelijkse irritatie?",
  },
  {
    id: "ex-at-party",
    category: "sociaal",
    scenario:
      "Op een feest komt mijn ex enthousiast op ons af en zegt: 'Wat leuk om jou weer te zien!'",
    options: ["Ik stel mezelf rustig voor", "Ik observeer eerst heel goed", "Ik word extra gezellig", "Ik wil vrij snel weer door"],
    insight: "Hoe reageren jullie op sociale spanning en oude geschiedenis?",
  },
  {
    id: "tiny-house",
    category: "toekomst",
    scenario:
      "We kunnen gratis in een prachtig tiny house wonen, maar onze spullen moeten voor tachtig procent weg.",
    options: ["Morgen beginnen met opruimen", "Alleen als er een flinke schuur is", "Mijn spullen hebben rechten", "Liever ruimte dan gratis"],
    insight: "Hoe wegen jullie vrijheid, bezit en leefruimte tegen elkaar af?",
  },
  {
    id: "phone-water",
    category: "ongemak",
    scenario:
      "Tijdens een romantisch weekend laat jij mijn telefoon in het water vallen.",
    options: ["Kan gebeuren, eerst redden", "Ik ben even echt niet gezellig", "We lachen als hij nog werkt", "Jij regelt een nieuwe"],
    insight: "Hoe snel komt herstel na schade, schrik of onhandigheid?",
  },
  {
    id: "karaoke",
    category: "sociaal",
    scenario:
      "Mijn naam wordt omgeroepen voor karaoke. Ik heb ons blijkbaar als duet opgegeven.",
    options: ["Podium op, geen twijfel", "Alleen met een veilig liedje", "Ik film jou vanaf de tafel", "Ik ontken onze relatie"],
    insight: "Hoeveel publieke gekte en overgave past bij jullie?",
  },
  {
    id: "mountain-cabin",
    category: "avontuur",
    scenario:
      "Een week in een berghut: geen bereik, geen winkels en één dekentje minder dan nodig.",
    options: ["Klinkt als pure rust", "Prima met een goede voorbereiding", "Twee dagen is ook een weekgevoel", "Waar is het dichtstbijzijnde hotel?"],
    insight: "Hoeveel eenvoud, stilte en ongemak voelt als avontuur?",
  },
  {
    id: "parent-key",
    category: "samenleven",
    scenario:
      "Een ouder vraagt om een reservesleutel van ons huis. 'Alleen voor noodgevallen natuurlijk.'",
    options: ["Natuurlijk, vertrouwd", "Alleen met duidelijke afspraken", "Liever een sleutelkluis", "Absoluut niet"],
    insight: "Waar ligt voor jullie de grens tussen familie en eigen ruimte?",
  },
  {
    id: "haircut",
    category: "ongemak",
    scenario:
      "Ik kom thuis met een kapsel dat mij zichtbaar moed geeft en jou zichtbaar vragen.",
    options: ["Ik zeg eerlijk wat ik vind", "Ik zoek eerst iets positiefs", "Ik vraag of jij er blij mee bent", "Haar groeit weer aan"],
    insight: "Hoe combineren jullie eerlijkheid met zachtheid?",
  },
  {
    id: "retirement-band",
    category: "toekomst",
    scenario:
      "Op ons pensioen wil ik een band beginnen. Ik heb nog nooit een instrument aangeraakt.",
    options: ["Ik word je manager", "Ik leer met je mee", "Eerst één proefles", "Ik steun je vanuit een ander land"],
    insight: "Hoeveel ruimte geven jullie elkaar voor late, vreemde dromen?",
  },
  {
    id: "friend-stays",
    category: "sociaal",
    scenario:
      "Mijn beste vriend vraagt of die 'een paar nachtjes' op onze bank mag slapen. Er is geen einddatum genoemd.",
    options: ["Kom maar, we zien wel", "Prima, maximaal drie nachten", "Eerst samen overleggen", "Ik ken een goed hotel"],
    insight: "Hoe nemen jullie samen besluiten wanneer anderen iets nodig hebben?",
  },
  {
    id: "lost-passport",
    category: "avontuur",
    scenario:
      "Op het vliegveld kan ik mijn paspoort nergens vinden. Boarding sluit over twaalf minuten.",
    options: ["Ik zoek systematisch", "Ik raak efficiënt in paniek", "Jij zoekt, ik praat met personeel", "We noemen dit een staycation"],
    insight: "Welke rol neemt ieder onder acute tijdsdruk?",
  },
  {
    id: "thermostat",
    category: "samenleven",
    scenario:
      "Jij wilt de verwarming op 22 graden. Ik functioneer het best als poolreiziger.",
    options: ["We ontmoeten elkaar op 20", "Dikke trui voor jou", "Raam open, verwarming aan", "Ieder een eigen klimaatkamer"],
    insight: "Hoe onderhandelen jullie over kleine, terugkerende verschillen?",
  },
  {
    id: "memory-fails",
    category: "toekomst",
    scenario:
      "Over veertig jaar vergeet ik voor de derde keer hetzelfde verhaal en vertel het opnieuw met groot enthousiasme.",
    options: ["Ik luister opnieuw", "Ik help je zacht herinneren", "Ik geef het verhaal een score", "Ik vertel mijn eigen verhaal eroverheen"],
    insight: "Hoe ziet geduld eruit wanneer ouder worden minder charmant wordt?",
  },
  {
    id: "dance-floor",
    category: "sociaal",
    scenario:
      "Op een bruiloft is de dansvloer leeg. Jij kijkt mij aan met gevaarlijk veel enthousiasme.",
    options: ["Wij openen de vloer", "Eén nummer, afgesproken", "Alleen langzaam dansen", "Ik bewaak onze drankjes"],
    insight: "Wie trekt wie mee, en hoeveel zichtbaarheid voelt leuk?",
  },
  {
    id: "spider",
    category: "ongemak",
    scenario:
      "Er zit een enorme spin boven het bed. Hij oogt alsof hij huur betaalt.",
    options: ["Ik vang hem buiten", "Jij regelt dit", "We sluiten de kamer af", "Hij krijgt een naam"],
    insight: "Wie blijft praktisch wanneer iets irrationeel spannend voelt?",
  },
  {
    id: "move-country",
    category: "toekomst",
    scenario:
      "Eén van ons krijgt een droomkans in een ander land, voor minimaal drie jaar.",
    options: ["Samen gaan", "Eerst een proefperiode", "Lange afstand proberen", "Mijn leven hier weegt zwaarder"],
    insight: "Hoe wegen jullie individuele kansen en gezamenlijke richting?",
  },
  {
    id: "mystery-smell",
    category: "samenleven",
    scenario:
      "Er hangt al twee dagen een mysterieuze geur in huis. Geen van ons wil eigenaar zijn.",
    options: ["Samen brononderzoek doen", "Alles grondig schoonmaken", "Kaarsen aan en ontkennen", "Degene die het eerst rook, lost het op"],
    insight: "Hoe verdelen jullie onaantrekkelijke taken zonder strijd?",
  },
  {
    id: "bad-gift",
    category: "ongemak",
    scenario:
      "Ik geef je met stralende ogen een cadeau dat je werkelijk afschuwelijk vindt.",
    options: ["Ik reageer warm en vertel het later", "Ik ben direct maar lief", "Ik gebruik het één keer plechtig", "Ik ontwikkel plots een allergie"],
    insight: "Hoe eerlijk durven jullie zijn wanneer goede intenties botsen met smaak?",
  },
  {
    id: "roadtrip-music",
    category: "avontuur",
    scenario:
      "We hebben zes uur autorit voor de boeg. Jij zet een afspeellijst aan die volledig uit één artiest bestaat.",
    options: ["Ik zing mee tot het pijn doet", "Om de beurt een uur", "Na drie nummers grijp ik in", "Ik zoek een treinverbinding"],
    insight: "Hoe maken jullie ruimte voor elkaars enthousiasme?",
  },
  {
    id: "group-chat",
    category: "sociaal",
    scenario:
      "Mijn familie voegt jou toe aan een groepsapp met 83 ongelezen berichten per dag.",
    options: ["Ik doe enthousiast mee", "Ik lees stilletjes mee", "Ik zet hem direct op stil", "Ik verlaat hem na één passende sticker"],
    insight: "Hoeveel sociale nabijheid en bereikbaarheid past bij ieder?",
  },
  {
    id: "future-robot",
    category: "toekomst",
    scenario:
      "Onze toekomstige huishoudrobot begint mij 'de verstandige bewoner' te noemen en jou 'de creatieve variabele'.",
    options: ["De robot heeft inzicht", "We resetten hem samen", "Ik eis dezelfde titel", "De robot moet het huis uit"],
    insight: "Hoe reageren jullie op plagen, rollen en vermeende ongelijkheid?",
  },
  {
    id: "camping-rain",
    category: "avontuur",
    scenario:
      "Onze tent lekt. Het regent horizontaal en de luchtbedden maken afscheidsgeluiden.",
    options: ["We repareren en blijven", "Eén nacht volhouden", "Nu een hotel boeken", "In de auto slapen en chips eten"],
    insight: "Wanneer wordt doorzetten voor jullie een goed verhaal, en wanneer onzin?",
  },
  {
    id: "public-argument",
    category: "sociaal",
    scenario:
      "We raken geïrriteerd op straat. Mensen kunnen duidelijk meeluisteren.",
    options: ["Direct zachter praten", "Gesprek thuis vervolgen", "Ik wil het nu oplossen", "Ik maak een grap om te ontladen"],
    insight: "Hoe beschermen jullie elkaar wanneer spanning zichtbaar wordt?",
  },
  {
    id: "sick-cancel",
    category: "samenleven",
    scenario:
      "Vlak voor een langverwacht uitje voel ik me beroerd, maar ik zeg dat het 'wel gaat'.",
    options: ["We blijven thuis", "We passen het plan aan", "Jij beslist zelf eerlijk", "We gaan en keren zo nodig om"],
    insight: "Hoe herkennen en respecteren jullie grenzen die niet duidelijk worden uitgesproken?",
  },
  {
    id: "goat-farm",
    category: "toekomst",
    scenario:
      "Ik kondig aan dat mijn ware roeping een kleine geitenboerderij is.",
    options: ["Vertel me alles", "Eerst een weekend proefwerken", "Maximaal twee geiten", "Ik steun je emotioneel vanuit de stad"],
    insight: "Hoe serieus nemen jullie onverwachte levensdromen?",
  },
  {
    id: "forgot-anniversary",
    category: "ongemak",
    scenario:
      "Eén van ons vergeet een belangrijke datum. De ander heeft al taart gekocht.",
    options: ["Teleurgesteld maar bespreekbaar", "We vieren alsnog", "Ik wil eerst een oprechte sorry", "De taart redt veel"],
    insight: "Wat is nodig om een gemiste verwachting werkelijk te herstellen?",
  },
  {
    id: "shared-bathroom",
    category: "samenleven",
    scenario:
      "We delen één badkamer. Jij hebt een ochtendritueel van 47 minuten.",
    options: ["Ik plan eromheen", "We maken een schema", "Na twintig minuten klop ik", "Ik plaats een tweede badkamer"],
    insight: "Hoe bespreekbaar zijn gewoonten die dagelijks ruimte innemen?",
  },
  {
    id: "wrong-name",
    category: "sociaal",
    scenario:
      "Tijdens een spannend gesprek noemt iemand mij per ongeluk bij de naam van een ex.",
    options: ["Ik vraag rustig wat er gebeurde", "Ik ben zichtbaar geraakt", "Ik maak één scherpe grap", "Dit gesprek heeft pauze nodig"],
    insight: "Hoe gaan jullie om met schrik, jaloezie en herstel?",
  },
  {
    id: "wild-food",
    category: "avontuur",
    scenario:
      "Op reis krijgen we een lokale delicatesse die beweegt en ons aankijkt.",
    options: ["Proeven hoort erbij", "Eén hap samen", "Ik ruik er eerst aan", "Ik bestel brood"],
    insight: "Hoe ver gaat nieuwsgierigheid wanneer comfort verdwijnt?",
  },
  {
    id: "secret-snack",
    category: "ongemak",
    scenario:
      "Ik ontdek jouw geheime voorraad snacks achter de handdoeken.",
    options: ["Ik respecteer het noodfonds", "Ik wil een aandeel", "Ik maak er vriendelijk grapjes over", "Ik begin mijn eigen geheime voorraad"],
    insight: "Hoeveel privéruimte en speelse openheid past in samenleven?",
  },
  {
    id: "retire-location",
    category: "toekomst",
    scenario:
      "Later wil jij aan zee wonen. Ik droom van een huis diep in het bos.",
    options: ["Half jaar hier, half jaar daar", "Water wint", "Bos wint", "We zoeken een bos aan zee"],
    insight: "Hoe creatief worden jullie wanneer toekomstbeelden botsen?",
  },
  {
    id: "party-exit",
    category: "sociaal",
    scenario:
      "Op een feest wil jij naar huis en ik ben net helemaal op gang.",
    options: ["We gaan samen", "Nog een half uur", "Ieder gaat eigen weg", "We spreken vooraf een eindtijd af"],
    insight: "Hoe stemmen jullie energie en autonomie af in gezelschap?",
  },
  {
    id: "flat-tire",
    category: "avontuur",
    scenario:
      "Midden in nergens hebben we een lekke band en bijna geen bereik.",
    options: ["Ik pak gereedschap", "Ik zoek hulp en informatie", "We doen dit samen stap voor stap", "Eerst koffie uit de thermos"],
    insight: "Welke kwaliteiten verschijnen wanneer er echt iets opgelost moet worden?",
  },
  {
    id: "ugly-chair",
    category: "samenleven",
    scenario:
      "Ik erf een buitengewoon lelijke stoel met grote emotionele waarde.",
    options: ["Hij krijgt een ereplek", "Hij mag in mijn eigen hoek", "We laten hem opnieuw bekleden", "We bewaren er een mooie foto van"],
    insight: "Hoe maken jullie ruimte voor betekenis die de ander niet deelt?",
  },
  {
    id: "teeth",
    category: "toekomst",
    scenario:
      "Over zestig jaar liggen onze kunstgebitten per ongeluk naast elkaar in hetzelfde glas.",
    options: ["We lachen heel hard", "We labelen alles voortaan", "Ik weiger dit toekomstbeeld", "Ware liefde zoekt het juiste gebit"],
    insight: "Hoeveel humor kunnen jullie toelaten rond ouder worden en kwetsbaarheid?",
  },
  {
    id: "silent-day",
    category: "avontuur",
    scenario:
      "We krijgen een gratis wellnessdag, maar er mag de hele dag niet gesproken worden.",
    options: ["Heerlijk, eindelijk stilte", "Mooi maar best spannend", "Alleen met briefjes", "Ik praat per ongeluk binnen tien minuten"],
    insight: "Hoe voelt samenzijn wanneer woorden tijdelijk verdwijnen?",
  },
  {
    id: "bad-cooking",
    category: "ongemak",
    scenario:
      "Ik kook drie uur voor je. Het eindresultaat smaakt naar warme teleurstelling.",
    options: ["Ik eet dapper door", "Ik stel samen afhalen voor", "Ik geef zachte feedback", "Veel saus redt relaties"],
    insight: "Hoe ontvangen jullie inzet wanneer het resultaat tegenvalt?",
  },
  {
    id: "viral-video",
    category: "sociaal",
    scenario:
      "Een onhandig filmpje van ons wordt onverwacht online populair.",
    options: ["We lachen mee", "Ik wil het direct laten verwijderen", "Alleen als we anoniem blijven", "We starten een gezamenlijk kanaal"],
    insight: "Hoe verschillen jullie in zichtbaarheid, schaamte en speelsheid?",
  },
  {
    id: "inheritance",
    category: "toekomst",
    scenario:
      "We erven samen een oud huis dat prachtig is, maar elk weekend onderhoud vraagt.",
    options: ["Samen herstellen", "Verkopen en vrijheid houden", "Eerst één jaar proberen", "Er een ontmoetingsplek van maken"],
    insight: "Hoe kiezen jullie tussen wortels, werk en vrijheid?",
  },
  {
    id: "bird-alarm",
    category: "samenleven",
    scenario:
      "Onze parkiet leert precies om 06:12 uur jouw lach na te doen. Iedere ochtend.",
    options: ["Fantastisch, houden zo", "Later afdekken", "De parkiet krijgt training", "We nemen alsnog een kat"],
    insight: "Hoeveel chaos en levendigheid willen jullie thuis verdragen?",
  },
  {
    id: "honest-photo",
    category: "ongemak",
    scenario:
      "Ik laat je een foto zien waar ik trots op ben. Jij vindt hem echt niet mijn beste.",
    options: ["Ik benoem wat ik wel mooi vind", "Ik zeg het eerlijk en zacht", "Ik vraag waarom jij hem mooi vindt", "Ik keur hem plechtig goed"],
    insight: "Hoe geven jullie eerlijke feedback zonder iemands plezier af te pakken?",
  },
  {
    id: "surprise-guests",
    category: "sociaal",
    scenario:
      "Ik sta voor de deur met vier vrienden en roep: 'Verrassing, ze eten mee!'",
    options: ["Welkom, we improviseren", "Eerst even apart met jou praten", "Pizza en duidelijke eindtijd", "Dit gebeurt precies één keer"],
    insight: "Hoe gaan jullie om met spontaniteit die de ruimte van de ander gebruikt?",
  },
  {
    id: "night-swim",
    category: "avontuur",
    scenario:
      "Op vakantie stel ik om middernacht voor om in een donker bergmeer te springen.",
    options: ["Ik ren al naar het water", "Alleen samen en voorzichtig", "Tot mijn knieën is ook avontuur", "Ik houd de handdoeken warm"],
    insight: "Wie zoekt spanning, wie bewaakt veiligheid en hoe blijft dat leuk?",
  },
  {
    id: "last-cookie",
    category: "samenleven",
    scenario:
      "Er is nog één koekje. We hebben allebei gezien dat het er ligt.",
    options: ["Ik bied het jou aan", "We delen het exact", "Wie het eerst pakt", "Ik had het mentaal al gereserveerd"],
    insight: "Hoe ziet geven, delen en gezonde hebberigheid er bij jullie uit?",
  },
] as const;

export const categoryLabels: Record<ReactionCard["category"], string> = {
  samenleven: "Samenleven",
  toekomst: "Toekomstmuziek",
  ongemak: "Ongemakkelijk",
  sociaal: "Mensen om ons heen",
  avontuur: "Avontuur",
};

export function cardById(id: string) {
  return reactionCards.find((card) => card.id === id);
}

