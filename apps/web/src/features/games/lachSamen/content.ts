export interface LachVraag {
  id: string;
  v: string;
  a: string;
  b: string;
  cat: "oo" | "gs" | "wzjd";
}

const OF_OF: Omit<LachVraag, "cat">[] = [
  { id: "OO-001", v: "Je moet één dag lang alles fluisteren of alles zingen.", a: "Alles fluisteren", b: "Alles zingen" },
  { id: "OO-002", v: "Je moet op een eerste date één opvallend ding meenemen.", a: "Een tamme eend aan een tuigje", b: "Een enorme bos ballonnen" },
  { id: "OO-003", v: "Je krijgt een nutteloze superkracht.", a: "Je voelt precies wanneer pasta gaar is", b: "Je kunt met planten praten, maar alleen over het weer" },
  { id: "OO-004", v: "Je moet een week lang één kledingstijl dragen.", a: "Volledig middeleeuws", b: "Volledig jaren 80 fitness-outfit" },
  { id: "OO-005", v: "Je moet een restaurant binnenkomen op één manier.", a: "Alsof je een koning(in) bent", b: "Alsof je net een geheime missie hebt voltooid" },
  { id: "OO-006", v: "Je telefoon krijgt een rare functie.", a: "Hij applaudisseert hardop na elk bericht", b: "Hij zegt 'spannend...' voordat je elk bericht opent" },
  { id: "OO-007", v: "Je moet op elke foto voortaan hetzelfde doen.", a: "Duim omhoog met overdreven serieuze blik", b: "Doen alsof je een onzichtbare vogel vasthoudt" },
  { id: "OO-008", v: "Je wordt beroemd om iets kleins.", a: "De beste boterham-smeerder van Nederland", b: "De snelste sokkenzoeker van Europa" },
  { id: "OO-009", v: "Je kiest een huisdier dat overal mee naartoe gaat.", a: "Een dramatische papegaai die alles herhaalt", b: "Een chille geit die iedereen negeert" },
  { id: "OO-010", v: "Je krijgt een persoonlijke soundtrack.", a: "Trompetmuziek elke keer dat je binnenkomt", b: "Filmische vioolmuziek elke keer dat je wegloopt" },
  { id: "OO-011", v: "Je moet één gênante eigenschap kiezen.", a: "Je struikelt altijd nét als je cool probeert te lopen", b: "Je lacht altijd nét iets te hard in stille ruimtes" },
  { id: "OO-012", v: "Je mag één klein wereldprobleem oplossen.", a: "Nooit meer sokken kwijt", b: "Nooit meer een dopje dat niet past" },
  { id: "OO-013", v: "Je moet een bijnaam kiezen voor één week.", a: "Kapitein Kroket", b: "Professor Pannenkoek" },
  { id: "OO-014", v: "Je krijgt een robot-assistent die maar één taak kan.", a: "Je thee precies goed laten afkoelen", b: "Altijd zeggen waar je sleutels liggen" },
  { id: "OO-015", v: "Je moet een entree maken op een feest.", a: "Door een rookmachine heen lopen", b: "Opkomen met een klein koortje dat je naam zingt" },
  { id: "OO-016", v: "Je moet elke dag één geluid maken als begroeting.", a: "Een plechtig tromgeroffel nadoen", b: "Een zachte geitenmekker" },
  { id: "OO-017", v: "Je krijgt een magisch kledingstuk.", a: "Schoenen die dramatisch piepen bij elke stap", b: "Een jas die zachtjes juicht als je hem aantrekt" },
  { id: "OO-018", v: "Je moet één jaar lang één vervoermiddel gebruiken.", a: "Een step met gouden bel", b: "Een bakfiets met vlaggetjes" },
  { id: "OO-019", v: "Je mag één dierentaal verstaan.", a: "Duiven op stations", b: "Katten die je vanaf vensterbanken beoordelen" },
  { id: "OO-020", v: "Je moet elke vergadering beginnen met één ritueel.", a: "Iedereen noemt zijn favoriete snack", b: "Iedereen doet een koninklijk knikje" },
  { id: "OO-021", v: "Je moet één ding altijd overdreven serieus doen.", a: "Een banaan schillen", b: "Je schoenen aantrekken" },
  { id: "OO-022", v: "Je krijgt een persoonlijke waarschuwingstune die automatisch afspeelt.", a: "Als je hongerig wordt — sirene met drumrol", b: "Als je te lang bij een menu twijfelt — aftellende klok" },
  { id: "OO-023", v: "Je moet een week lang op één manier afscheid nemen.", a: "Met een diepe buiging", b: "Met: ik verdwijn in de mist" },
  { id: "OO-024", v: "Je moet in een talentenshow meedoen met één act.", a: "Dramatisch een boodschappenlijst voordragen", b: "Een dans doen met alleen je wenkbrauwen" },
  { id: "OO-025", v: "Je mag één voorwerp altijd laten zweven.", a: "Je koffiekopje", b: "Je afstandsbediening" },
  { id: "OO-026", v: "Je wordt achtervolgd door iets ongevaarlijks.", a: "Een fanclub van drie kippen", b: "Een wolk confetti" },
  { id: "OO-027", v: "Je moet één maaltijd voor altijd een andere naam geven.", a: "Ontbijt heet voortaan startfeest", b: "Avondeten heet voortaan eindceremonie" },
  { id: "OO-028", v: "Je krijgt een klein draakje als huisgenoot.", a: "Hij roostert brood perfect", b: "Hij steekt altijd kaarsen aan als je serieus wilt praten" },
  { id: "OO-029", v: "Je moet elke dag één kleine prestatie vieren.", a: "Met een mini-polonaise", b: "Met een plechtige medaille van papier" },
  { id: "OO-030", v: "Je krijgt één absurde professionele titel.", a: "Hoofd Kleine Ongemakken", b: "Minister van Gezellige Pauzes" },
  { id: "OO-031", v: "Je moet altijd één accessoire dragen.", a: "Een detectivehoed", b: "Een sjaal die veel te lang is" },
  { id: "OO-032", v: "Je moet op elke trap één ding doen.", a: "Tellen alsof het een expeditie is", b: "Bij de laatste trede fluisteren: we hebben het gehaald" },
  { id: "OO-033", v: "Je mag één ongemakkelijk moment automatisch oplossen.", a: "Stiltes vullen met zachte liftmuziek", b: "Iemand zegt altijd precies tegelijk: thee?" },
  { id: "OO-034", v: "Je moet één dagelijks object als trofee behandelen.", a: "De afstandsbediening", b: "De kaasschaaf" },
  { id: "OO-035", v: "Je moet elk compliment op één manier ontvangen.", a: "Met: ik draag deze eer met waardigheid", b: "Met een stille vuist in de lucht" },
  { id: "OO-036", v: "Je mag één weerfenomeen op commando oproepen.", a: "Dramatische zonnestraal precies op jou gericht", b: "Filmische wind die je haar perfect doet waaien" },
  { id: "OO-037", v: "Je moet één soort grap altijd grappig vinden.", a: "Slechte woordgrappen", b: "Overdreven droge opmerkingen" },
  { id: "OO-038", v: "Je mag één apparaat een persoonlijkheid geven.", a: "Een koelkast die bezorgd is", b: "Een waterkoker die filosofeert" },
  { id: "OO-039", v: "Je moet elke dag één willekeurige zin gebruiken.", a: "Dat klinkt als een taak voor pannenkoeken", b: "Ik raadpleeg eerst mijn innerlijke egel" },
  { id: "OO-040", v: "Je krijgt één magisch datingvoorwerp.", a: "Een kompas dat ongemakkelijke stiltes aanwijst", b: "Een belletje dat rinkelt als iemand te serieus wordt" },
];

const STELLINGEN: Omit<LachVraag, "cat">[] = [
  { id: "GS-001", v: "Iemand die hardop tegen zijn fiets praat, is waarschijnlijk best gezellig.", a: "Eens", b: "Oneens" },
  { id: "GS-002", v: "Een goede pannenkoek kan een slechte dag redden.", a: "Eens", b: "Oneens" },
  { id: "GS-003", v: '"Ik ben er over vijf minuten" betekent eigenlijk: ik heb mijn schoenen nog niet aan.', a: "Eens", b: "Oneens" },
  { id: "GS-004", v: "Een picknick is 40% eten, 40% sfeer en 20% mierenmanagement.", a: "Eens", b: "Oneens" },
  { id: "GS-005", v: "Wie zonder reden een cape draagt, verdient eigenlijk respect.", a: "Eens", b: "Oneens" },
  { id: "GS-006", v: "Een eerste date in een dierentuin zegt meer over iemand dan in een restaurant.", a: "Eens", b: "Oneens" },
  { id: "GS-007", v: "Een hond die je niet mag, is een serieus waarschuwingssignaal.", a: "Eens", b: "Oneens" },
  { id: "GS-008", v: "Iemand die zijn patat telt voordat hij begint, is te georganiseerd voor deze wereld.", a: "Eens", b: "Oneens" },
  { id: "GS-009", v: "Een goede lach is belangrijker dan perfecte smalltalk.", a: "Eens", b: "Oneens" },
  { id: "GS-010", v: "Er bestaat geen neutrale manier om een banaan te eten in het openbaar.", a: "Eens", b: "Oneens" },
  { id: "GS-011", v: "Mensen die altijd snacks bij zich hebben, zijn de ruggengraat van de samenleving.", a: "Eens", b: "Oneens" },
  { id: "GS-012", v: "Een paraplu vergeten is geen fout, maar een karaktertest.", a: "Eens", b: "Oneens" },
  { id: "GS-013", v: "Iedereen heeft minstens één lied dat hij veel te dramatisch meezingt.", a: "Eens", b: "Oneens" },
  { id: "GS-014", v: "Een sok met een gat erin mag nog één dag als hij emotionele waarde heeft.", a: "Eens", b: "Oneens" },
  { id: "GS-015", v: "Wie de laatste friet opeet zonder te vragen, laat iets van zijn ziel zien.", a: "Eens", b: "Oneens" },
  { id: "GS-016", v: "Hoe iemand reageert op een winkelwagen met een koppig wiel zegt alles over wie ze zijn.", a: "Eens", b: "Oneens" },
  { id: "GS-017", v: "Koffie is soms gewoon een sociaal excuus om ergens te zitten.", a: "Eens", b: "Oneens" },
  { id: "GS-018", v: "Wie rustig blijft bij een vastgelopen printer, is bijna verlicht.", a: "Eens", b: "Oneens" },
  { id: "GS-019", v: "Een wandeling zonder doel is vaak beter dan een gesprek met doel.", a: "Eens", b: "Oneens" },
  { id: "GS-020", v: "Een slechte mop wordt beter als je hem met volledige overtuiging vertelt.", a: "Eens", b: "Oneens" },
  { id: "GS-021", v: "Mensen die planten namen geven, zijn waarschijnlijk trouw in vriendschap.", a: "Eens", b: "Oneens" },
  { id: "GS-022", v: "De beste gesprekken ontstaan vlak voordat iemand eigenlijk naar huis moet.", a: "Eens", b: "Oneens" },
  { id: "GS-023", v: "Een tafel vol kleine hapjes is gezelliger dan één indrukwekkend gerecht.", a: "Eens", b: "Oneens" },
  { id: "GS-024", v: "Wie in de regen danst, heeft ofwel wijsheid ofwel slechte schoenen.", a: "Eens", b: "Oneens" },
  { id: "GS-025", v: "Een goede bijnaam ontstaat nooit als je hem probeert te bedenken.", a: "Eens", b: "Oneens" },
  { id: "GS-026", v: "Er is altijd één persoon die bij een groepsfoto zegt: nog eentje voor de zekerheid.", a: "Eens", b: "Oneens" },
  { id: "GS-027", v: "Een spontaan ijsje kan een dag officieel verbeteren.", a: "Eens", b: "Oneens" },
  { id: "GS-028", v: "Wie de weg kwijt is maar vrolijk blijft, is goed reisgezelschap.", a: "Eens", b: "Oneens" },
  { id: "GS-029", v: "Een bankje met uitzicht is een onderschatte vorm van luxe.", a: "Eens", b: "Oneens" },
  { id: "GS-030", v: "Mensen die hard lachen om hun eigen grap zijn soms irritant maar vaak heerlijk.", a: "Eens", b: "Oneens" },
  { id: "GS-031", v: "Een supermarktbezoek kan voelen als een klein levensavontuur.", a: "Eens", b: "Oneens" },
  { id: "GS-032", v: "Wie altijd de route wil plannen, moet soms verplicht verdwalen.", a: "Eens", b: "Oneens" },
  { id: "GS-033", v: "Een goed broodje kan tijdelijk alle wereldproblemen relativeren.", a: "Eens", b: "Oneens" },
  { id: "GS-034", v: '"Even snel" is een mythe, net als "bijna thuis" en "nog één glaasje".', a: "Eens", b: "Oneens" },
  { id: "GS-035", v: "Er zijn weinig dingen zo hoopgevend als onverwacht taart aantreffen.", a: "Eens", b: "Oneens" },
  { id: "GS-036", v: "Wie een dier op straat groet, is waarschijnlijk geen slecht mens.", a: "Eens", b: "Oneens" },
  { id: "GS-037", v: "Een rommelige tas vertelt soms meer dan een nette biografie.", a: "Eens", b: "Oneens" },
  { id: "GS-038", v: "De beste mensen hebben minstens één totaal onpraktische gewoonte.", a: "Eens", b: "Oneens" },
  { id: "GS-039", v: "Een dag zonder kleine dwaasheid is eigenlijk niet helemaal af.", a: "Eens", b: "Oneens" },
  { id: "GS-040", v: "Als iemand je laatste hapje aanbiedt, moet je die persoon serieus nemen.", a: "Eens", b: "Oneens" },
];

const SCENARIOS: Omit<LachVraag, "cat">[] = [
  { id: "WZJD-001", v: "Jullie zitten op een terras en een duif steelt jouw koekje. Wat doe je?", a: "Je accepteert je nederlaag waardig", b: "Je begint een juridisch conflict met de duif" },
  { id: "WZJD-002", v: "Je date komt aan met een rugzak vol snacks \"voor noodgevallen\". Wat denk je?", a: "Verstandig mens", b: "Rode vlag, maar wel een lekkere rode vlag" },
  { id: "WZJD-003", v: "Je mag één absurde regel invoeren voor alle eerste dates.", a: "Iedereen noemt eerst zijn favoriete dinosaurus", b: "Iedereen vertelt binnen tien minuten een slechte mop" },
  { id: "WZJD-004", v: "Je verdwaalt samen tijdens een wandeling. Wat is jouw rol?", a: "Ik doe alsof ik weet waar we zijn", b: "Ik roep: dit is avontuur!" },
  { id: "WZJD-005", v: "Er loopt ineens een fanfare achter jullie aan. Wat doe je?", a: "Strak doorlopen alsof dit normaal is", b: "Zwaaien naar onbekenden alsof je beroemd bent" },
  { id: "WZJD-006", v: "Jullie moeten samen een talentenshow doen. Wat kies je?", a: "Dramatisch voorlezen uit een menukaart", b: "Synchroon ongemakkelijk dansen" },
  { id: "WZJD-007", v: "Je krijgt een menukaart met alleen rare gerechten. Wat bestel je?", a: "Mysterieuze soep van de dag", b: "Verrassingsbroodje met karakter" },
  { id: "WZJD-008", v: "Jullie moeten een teamnaam kiezen voor deze route.", a: "Team Voorzichtig Optimistisch", b: "Team Twee Mensen en Veel Vragen" },
  { id: "WZJD-009", v: "Je moet een nieuwe feestdag bedenken.", a: "Nationale Pyjamawandeldag", b: "Internationale Tweede-Ontbijtdag" },
  { id: "WZJD-010", v: "Je mag één gadget uitvinden speciaal voor dates.", a: "Een kompas dat ongemakkelijke stiltes detecteert en er dramatisch naartoe wijst", b: "Een knopje dat zacht \"boing\" doet als iemand te diep wordt" },
  { id: "WZJD-011", v: "Jullie bestellen hetzelfde maar krijgen allebei iets totaal anders. Wat doe je?", a: "Proeven en doen alsof dit de bedoeling was", b: "Een onderzoek starten naar het mysterie" },
  { id: "WZJD-012", v: "Een onbekende hond kiest jou als beste vriend en loopt mee. Wat doe je?", a: "Je voelt je vereerd", b: "Je benoemt hem tijdelijk tot reisleider" },
  { id: "WZJD-013", v: "Jullie moeten samen een picknick redden van oprukkende mieren.", a: "Onderhandelen met de mierenkoningin", b: "Alles hoger zetten en doen alsof je rustig bent" },
  { id: "WZJD-014", v: "Je krijgt per ongeluk een veel te grote paraplu mee. Wat doe je?", a: "Je gebruikt hem trots als mobiel dak", b: "Je noemt hem \"ons tiny house\"" },
  { id: "WZJD-015", v: "Jullie staan in de rij en iemand begint spontaan te zingen. Wat doe je?", a: "Zacht meeneuriën", b: "Alsof het normaal is het refrein zoeken" },
  { id: "WZJD-016", v: "Een ober vraagt \"jullie gebruikelijke tafel?\" terwijl jullie daar nooit zijn geweest.", a: "Je speelt mee", b: "Je fluistert: onze reputatie is ons vooruitgesneld" },
  { id: "WZJD-017", v: "Jullie vinden een briefje met \"volg de eend\". Wat doe je?", a: "Uiteraard de eend zoeken", b: "Eerst bespreken of dit ethisch verantwoord is" },
  { id: "WZJD-018", v: "Je moet samen een mascotte kiezen voor jullie wandeling.", a: "Een dennenappel met charisma", b: "Een takje dat duidelijk leiderschap uitstraalt" },
  { id: "WZJD-019", v: "Je schoenen maken bij elke stap een raar geluid. Wat doe je?", a: "Je loopt ritmisch verder", b: "Je noemt het je persoonlijke beat" },
  { id: "WZJD-020", v: "Jullie moeten samen een taart beoordelen — maar praten mag niet.", a: "Alleen gezichtsuitdrukkingen: alsof je een Oscar-jury bent", b: "Alleen handgebaren: alsof je een land koopt op een veiling" },
  { id: "WZJD-021", v: "Je ziet iemand zwaaien en zwaait terug maar het was voor iemand achter je.", a: "Je zwaait nog trotser", b: "Je doet alsof je net je arm strekte" },
  { id: "WZJD-022", v: "Jullie komen bij een bordje \"geheim pad\". Wat doe je?", a: "Nieuwsgierig kijken waar het heen gaat", b: "Eerst plechtig verklaren dat dit avontuur is" },
  { id: "WZJD-023", v: "Een kind vraagt of jullie beroemde avonturiers zijn.", a: "Je zegt: nog niet officieel", b: "Je vraagt of hij een queeste heeft" },
  { id: "WZJD-024", v: "Jullie moeten een foto maken maar mogen niet normaal poseren.", a: "Heldhaftig in de verte kijken", b: "Doen alsof je een kaart leest die ondersteboven is" },
  { id: "WZJD-025", v: "Je krijgt een gratis ballon maar hij is enorm. Wat doe je?", a: "Trots meenemen", b: "Hem benoemen tot derde wiel" },
  { id: "WZJD-026", v: "20 seconden. Jullie moeten samen een slechte mop verzinnen. Nu.", a: "Vol vertrouwen beginnen — ook als het niks wordt", b: "Eerst 19 seconden paniek, dan vol gas iets met kaas" },
  { id: "WZJD-027", v: "Een kat zit naast jullie en kijkt alsof hij jullie beoordeelt.", a: "Je probeert zijn goedkeuring te winnen", b: "Je accepteert dat je waarschijnlijk gezakt bent" },
  { id: "WZJD-028", v: "Jullie krijgen de opdracht een geheime handdruk te maken.", a: "Kort en stijlvol", b: "Veel te ingewikkeld en dus perfect" },
  { id: "WZJD-029", v: "Je moet ineens namens jullie beiden een ijssmaak kiezen.", a: "Veilig en klassiek", b: "Iets raars, want dit is onderzoek" },
  { id: "WZJD-030", v: "Jullie moeten één minuut lang doen alsof jullie gidsen zijn in een museum.", a: "Je verzint historische feiten", b: "Je doet alsof alles diep symbolisch is" },
  { id: "WZJD-031", v: "De wind blaast je haar of jas precies dramatisch de goede kant op.", a: "Even filmisch stilstaan", b: "Doen alsof je dit gepland had" },
  { id: "WZJD-032", v: "Jullie vinden een bankje met perfect uitzicht maar het piept enorm.", a: "Blijven zitten en het karakter noemen", b: "Ritmisch meebewegen met het gepiep" },
  { id: "WZJD-033", v: "Je moet één klein voorwerp tot gelukssymbool van de date verklaren.", a: "Een steentje", b: "Een servetje met potentie" },
  { id: "WZJD-034", v: "Jullie moeten samen een denkbeeldige zaak openen.", a: "Koffie en slechte moppen", b: "Wafels en levensadvies" },
  { id: "WZJD-035", v: "Je mag één ongemakkelijk moment van vandaag opnieuw doen.", a: "Ja graag — dit keer nonchalant, als een James Bond", b: "Nee — ongemak is de ziel van een goed verhaal later" },
  { id: "WZJD-036", v: "Een straatmuzikant speelt precies jullie heldhaftige wandelmuziek.", a: "Langzamer lopen voor effect", b: "Een missie verzinnen" },
  { id: "WZJD-037", v: "Jullie moeten een bijnaam kiezen voor een irritante regenbui.", a: "Motregen met mening", b: "Hemelse sproeistand" },
  { id: "WZJD-038", v: "Je date zegt per ongeluk een woord verkeerd. Wat doe je?", a: "Het liefdevol bewaren voor later", b: "Het meteen benoemen tot officieel nieuw woord" },
  { id: "WZJD-039", v: "Jullie krijgen één minuut om een klein ritueel voor toekomstige dates te bedenken.", a: "Eerst proosten op moed", b: "Altijd één belachelijke vraag starten" },
  { id: "WZJD-040", v: "Een meeuw kijkt alsof hij jullie friet wil overnemen.", a: "Beschermen met waardigheid", b: "Hem streng toespreken als volwassen vogel" },
];

function seededShuffle<T>(arr: T[], seed: number): T[] {
  const result = [...arr];
  let s = seed;
  for (let i = result.length - 1; i > 0; i--) {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    const j = Math.abs(s) % (i + 1);
    const tmp = result[i] as T;
    result[i] = result[j] as T;
    result[j] = tmp;
  }
  return result;
}

export function pickQuestions(seed: number): LachVraag[] {
  const oo = seededShuffle(OF_OF, seed).slice(0, 5);
  const gs = seededShuffle(STELLINGEN, seed + 1).slice(0, 5);
  const wzjd = seededShuffle(SCENARIOS, seed + 2).slice(0, 5);
  const mixed: LachVraag[] = [];
  for (let i = 0; i < 5; i++) {
    mixed.push({ ...(oo[i] as Omit<LachVraag, "cat">), cat: "oo" });
    mixed.push({ ...(gs[i] as Omit<LachVraag, "cat">), cat: "gs" });
    mixed.push({ ...(wzjd[i] as Omit<LachVraag, "cat">), cat: "wzjd" });
  }
  return mixed;
}

export const CAT_LABELS: Record<LachVraag["cat"], string> = {
  oo: "Of — of",
  gs: "Stelling",
  wzjd: "Wat zou jij doen?",
};
