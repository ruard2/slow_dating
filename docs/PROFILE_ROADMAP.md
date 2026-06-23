# Profielroadmap

## Doel

Na iedere kaart ontstaat een nieuw hoofdstuk van het profiel:

- **Profiel 1 - Eerste indruk:** wie ben je, wat neem je mee en hoe ontmoeten
  jullie elkaar?
- **Profiel 2 - Verdieping:** wat heb je nodig, welke patronen worden zichtbaar
  en hoe gaan jullie om met verschil en spanning?
- Latere kaarten voegen nieuwe hoofdstukken toe zonder eerdere conclusies
  stilzwijgend te vervangen.

Het profiel moet voelen als een herkenbaar portret, niet als een testuitslag of
een lijst antwoorden. Het benoemt wat warm, opvallend, grappig, gedeeld en
mogelijk uitdagend is. Iedere conclusie blijft controleerbaar vanuit gespeelde
spellen.

## Ontgrendeling Profiel 1

Profiel 1 wordt beschikbaar na minimaal **vijf verschillende afgeronde spellen
op kaart 1**.

- **0-4 spellen:** gesloten profielkaart met `Nog X spellen voor jullie eerste
  profielschets`.
- **5 spellen:** eerste profielschets, duidelijk aangeduid als een eerste beeld.
- **6 spellen:** profiel wordt automatisch aangevuld en toont `Nieuw ontdekt`.
- **7 spellen:** volledige versie van Profiel 1.

Een opnieuw gespeeld spel verfijnt het profiel, maar telt niet als extra spel
voor de ontgrendeling. Alleen kaart-1-spellen tellen; de huidige algemene
`completedGames >= 5`-logica is daarvoor te breed.

## Opbouw Van Profiel 1

### 1. Openingsportret

Een korte, prettig geschreven alinea van vier tot zes zinnen. Geen opsomming,
maar een combinatie van twee of drie sterk onderbouwde lijnen.

Voorbeeldtoon:

> Jij lijkt verbinding te zoeken via nieuwsgierigheid en kleine verhalen. Je
> kiest duidelijk wat belangrijk voor je is, maar laat ook ruimte voor humor.
> Opvallend is dat je partner je op een punt steviger ziet dan jij jezelf.

### 2. Dit Typeert Jou

Drie verhalende profielkaarten:

- **Wat jou richting geeft:** waarden, prioriteiten en terugkerende thema's.
- **Hoe jij contact maakt:** vertellen, luisteren, spelen, vragen stellen of
  eerst observeren.
- **Wat de ander in jou ziet:** kwaliteiten en verschillen tussen zelfbeeld en
  partnerbeeld.

Iedere kaart heeft een korte kop, een alinea en desgewenst één concrete
`Dat zagen we hier`-verwijzing.

### 3. Jullie Samen

- **Waar jullie elkaar vanzelf vinden**
- **Waar jullie elkaar aanvullen**
- **Waar jullie een ander tempo of perspectief hebben**
- **Een klein moment dat typisch jullie was**

Een verschil wordt niet als fout of incompatibiliteit gepresenteerd. De tekst
legt uit wat het verschil interessant maakt en geeft één open vraag.

### 4. De Verrassing

Eén specifiek, licht en onverwacht inzicht. Bijvoorbeeld een tegenstelling
tussen serieuze waarden en speelse keuzes, een onverwachte overeenkomst of een
kwaliteit die vooral de partner zag.

Dit onderdeel mag alleen verschijnen wanneer er voldoende concrete data is.
Geen geforceerde grap en geen willekeurige tekst.

### 5. Mogelijke Uitdaging

Maximaal één zachte hypothese, gebaseerd op minimaal twee onafhankelijke
signalen. Formulering:

- `Het kan zijn dat...`
- `Let eens op wat er gebeurt wanneer...`
- `Jullie lijken hier anders in te stappen...`

Nooit diagnostisch, nooit `jij bent`, en nooit gebaseerd op alleen snelheid of
één antwoord.

### 6. Praat Eens Verder

Twee gespreksprompts die direct voortkomen uit het profiel. De gebruiker kan
een prompt met één druk op de knop in de gezamenlijke chat plaatsen.

### 7. Nog Te Ontdekken

Laat bewust zien welk deel nog onzeker of onbekend is. Bij vijf spellen maakt
dit nieuwsgierig naar de resterende twee; na zeven spellen vormt het de brug
naar kaart 2.

## Profielbouwstenen Per Spel

### Je Waarden

- Persoonlijke topwaarden.
- Gedeelde waarden en betekenisvolle verschillen.
- Terugkerende waardethema's en combinaties, zoals verbinding plus vrijheid.
- Eventuele wijzigingen tijdens het kiezen worden alleen als twijfel of
  zorgvuldigheid benoemd wanneer het patroon herhaald zichtbaar is.

### Lach Samen

- Waar iemand gemakkelijk om lacht.
- Voorkeur voor absurditeit, herkenning, uitdaging of samenspel.
- Hoe de twee elkaar lucht geven.
- Opvallende gedeelde of sterk verschillende humorreacties.

### Leer Elkaar Kennen

- Thema's waar iemand graag over vertelt.
- Hoe goed partners elkaar voorspellen.
- Voorkeur voor lichte, praktische of persoonlijkere onderwerpen.
- Wederzijdse nieuwsgierigheid, zonder openheid te beoordelen als goed of fout.

### Familiedorp

- Belangrijke rollen, afstanden, gewoonten en sfeerwoorden.
- Wat iemand als vertrouwd of betekenisvol uit de familie meeneemt.
- Overeenkomsten en verschillen in familiebeleving.
- Geen therapeutische conclusies uit de opstelling trekken.

### Jullie Kwaliteiten

- Zelfgekozen kwaliteiten.
- Kwaliteiten die de partner ziet.
- Overlap, blinde waardering en eventuele allergieën.
- Een verschil tussen zelfbeeld en partnerbeeld wordt als uitnodiging
  beschreven, niet als correctie.

### Stille Vijver

- Voorkeur voor woorden of foto's.
- Welke gevoelens, beelden of betekenissen iemand kiest.
- Hoe precies partners elkaars keuze of bedoeling aanvoelen.
- Stijl van reflecteren: concreet, associatief of gevoelsmatig, alleen wanneer
  meerdere antwoorden dit ondersteunen.

### Brug Van Ontdekking

- Gekozen verhaalthema's en persoonlijke accenten.
- Welke soorten herinneringen iemand graag deelt.
- Overlap tussen gekozen stenen.
- Lengte of snelheid van antwoorden is context, geen maat voor diepgang.

## Gedragsdata Die We Wel Gebruiken

De backend bewaart al `GameRun.startedAt/completedAt`, acties met timestamps,
activity-events en wachtgegevens. Die kunnen aanvullende observaties geven:

- totale speeltijd en tijd per fase;
- antwoorden wijzigen;
- beurt- en wachtpatronen;
- antwoordlengte waar tekst onderdeel van het spel is;
- herhaald gekozen thema's over verschillende spellen;
- hoeveel partners elkaar correct voorspelden;
- wie vaak als eerste klaar was, uitsluitend luchtig en feitelijk beschreven.

Timing wordt nooit zelfstandig vertaald naar karakter. `Je antwoordde vaak
snel` kan; `je bent impulsief` niet. Technische wachttijd, disconnects en
achtergrondtabs moeten buiten de analyse blijven.

Chatinhoud en telefoongesprekken worden niet gebruikt voor profielanalyse.

## Technische Architectuur

### 1. Getypeerde Spelresultaten

Ieder kaart-1-spel krijgt een versieerbaar Zod-resultaatschema in
`packages/contracts`. De vijf legacy-spellen die nog vrije JSON opleveren
worden eerst geaudit en daarna door een adapter genormaliseerd.

```ts
interface ProfileEvidence {
  sourceGameId: string;
  sourceRunId: string;
  subjectId?: string;
  observedAt: string;
  kind: string;
  value: unknown;
}
```

### 2. Extractors Per Spel

`profileInsights.ts` krijgt een register:

```ts
const profileExtractors: Record<GameId, ProfileExtractor>;
```

Elke extractor zet een spelresultaat om in genormaliseerde signalen, zonder al
mooie tekst te schrijven.

Belangrijke domeinen:

- `values`
- `humour_and_play`
- `curiosity_and_disclosure`
- `family_context`
- `self_and_partner_view`
- `attention_and_expression`
- `stories_and_memory`

Een signaal bevat scope (`personal` of `relationship`), sterkte, confidence,
bewijs en herkomst.

### 3. Inzichtengine

De inzichtengine combineert signalen tot feiten:

- één bron: alleen een concrete observatie;
- twee onafhankelijke bronnen: voorzichtig patroon;
- drie of meer consistente bronnen: sterk profielthema;
- tegenstrijdige bronnen: interessante nuance, niet middelen of verbergen.

De engine selecteert maximaal de meest onderscheidende inzichten. Daardoor
wordt het profiel geen dump van alles wat bekend is.

### 4. Narratief Zonder Willekeur

Versie 1 gebruikt zorgvuldig geschreven teksttemplates. De keuze tussen
tekstvarianten is deterministisch op basis van profielversie en signaal-ID,
zodat de tekst levendig is maar niet bij iedere refresh verandert.

Een taalmodel is niet nodig voor de eerste professionele versie. Als dat later
wordt toegevoegd, krijgt het uitsluitend goedgekeurde gestructureerde feiten
en mag het geen nieuwe conclusies verzinnen.

### 5. Profielsnapshot

Bewaar per persoon en relatie een versieerbare snapshot:

```ts
interface ProfileSnapshot {
  world: 1 | 2 | 3 | 4 | 5;
  version: number;
  status: "provisional" | "complete";
  completedGameIds: string[];
  generatedAt: string;
  personalCards: NarrativeCard[];
  relationshipCards: NarrativeCard[];
}
```

Bij spel zes en zeven wordt Profiel 1 opnieuw opgebouwd. Profiel 2 bouwt later
voort op Profiel 1 en kan expliciet tonen: `Dit beeld werd bevestigd`,
`Hier kwam nuance bij` of `Dit verraste ons op kaart 2`.

## Visueel Concept

Profiel 1 wordt een bladerbaar verhaal in de sfeer van kaart 1:

- openingskaart met beide namen;
- afwisselend persoonlijke en gezamenlijke kaarten;
- illustratieve accenten uit de gespeelde locaties;
- kleine bronlabels in plaats van statistiektabellen;
- een duidelijke voortgang `5 van 7 bronnen gebruikt`;
- bij nieuwe data één subtiele markering `Nieuw sinds jullie vorige bezoek`.

De afzonderlijke personen kunnen hun persoonlijke deel bekijken. Het
gezamenlijke deel bevat alleen informatie die volgens de spelregels met de
partner gedeeld mag worden.

## Uitvoering In Kleine Fasen

### Fase P1 - Datacontracten

1. Alle zeven kaart-1-resultaten inventariseren.
2. Resultaatschema's en migrerende adapters toevoegen.
3. Expliciet vastleggen welke velden persoonlijk of gezamenlijk zijn.
4. Tests met bestaande en onvolledige legacy-resultaten.

**Klaar wanneer:** ieder afgerond kaart-1-spel levert valide, uitleesbare
profieldata.

### Fase P2 - Signalen En Bewijs

1. Extractorregister bouwen.
2. Per spel personal en relationship signals produceren.
3. Timing- en actiedata opschonen voor technische ruis.
4. Confidence- en bewijsregels testen.

**Klaar wanneer:** de API verklaarbare profielsignalen voor alle zeven spellen
teruggeeft.

### Fase P3 - Profiel 1 Engine

1. Signalen combineren en rangschikken.
2. Openingsportret, verrassing, gedeelde punten en uitdaging genereren.
3. Deterministische tekstvarianten toevoegen.
4. Snapshot bij vijf, zes en zeven spellen opslaan.

**Klaar wanneer:** dezelfde data een stabiel, niet-repetitief en aantoonbaar
juist profiel oplevert.

### Fase P4 - Nieuwe Profielpagina

1. Huidige opsommende profielschets vervangen door het verhaalconcept.
2. Gesloten staat voor nul tot vier kaart-1-spellen bouwen.
3. `Nieuw ontdekt`, bronnen en profielstatus tonen.
4. Chatknoppen voor gespreksprompts aansluiten.

**Klaar wanneer:** Profiel 1 op mobiel en desktop prettig leest en bij vijf,
zes en zeven spellen correct verandert.

### Fase P5 - Kwaliteitscontrole

1. Fixtures maken voor contrasterende koppels en bijna gelijke koppels.
2. Controleren op herhaling, ongefundeerde claims en privacyfouten.
3. Unit-, contract- en browsertests draaien.
4. Teksten handmatig beoordelen op warmte, verrassing en volwassen toon.

**Klaar wanneer:** geen tekst verder gaat dan het bewijs en de schets toch
persoonlijk en verrassend voelt.

## Besluiten Voor Profiel 1

- Beschikbaar na vijf verschillende kaart-1-spellen.
- Zes en zeven spellen verrijken dezelfde Profiel 1-snapshot.
- Persoonlijk portret en relatieportret blijven afzonderlijke lagen.
- Geen analyse van chats of gesprekken.
- Geen diagnoses, compatibiliteitsscore of verborgen ranglijst.
- Alle belangrijke observaties bewaren bewijs en herkomst.
- Eerst regelgebaseerd en testbaar; mooie taal komt boven op betrouwbare data.
