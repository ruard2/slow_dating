# Pre-Kaart-2 Uitvoeringsplan

## Doel

Voordat wereld 2 inhoud krijgt, maken we de bestaande app geschikt om nieuwe
werelden en spellen toe te voegen zonder meer legacy-iframes, hardcoded
wereldlogica of centrale megabestanden.

Dit plan wordt strikt in volgorde uitgevoerd. Iedere fase:

1. heeft een kleine, afgebakende wijziging;
2. behoudt een lokaal startbare app;
3. draait lint, types, unit-tests, build en relevante Playwright-tests;
4. krijgt browsercontrole op desktop en mobiel;
5. wordt afzonderlijk gecommit;
6. wordt pas gevolgd door de volgende fase als de klaarcriteria slagen.

## Voortgang

- Fase 1: afgerond
- Fase 2: afgerond
- Fase 3: afgerond
- Fase 4: afgerond
- Architectuurreview: volgende stap

## Niet Onderhandelbare Regels

- De app is uitsluitend voor gekoppelde spelers; er komt geen solomodus terug.
- De server bepaalt identiteit, relatie, spelrun en toegang.
- Chat, bellen, kaartnavigatie en opties blijven permanent appbreed.
- Resultaten worden persoonlijk en waar relevant gezamenlijk opgeslagen.
- Audio, wachtwoorden, tokens en WebRTC SDP/ICE worden nooit profieldata.
- Bestaande inhoud en vormgeving blijven behouden tenzij de nieuwe structuur
  aantoonbaar een wijziging vereist.
- Legacy blijft beschikbaar als referentie tot de native vervanging compleet is.
- Geen nieuwe wereld wordt als verzameling losse HTML-iframes gebouwd.

## Fase 1: AppShell En Featuregrenzen

Splits `apps/web/src/App.tsx` zonder functionele wijzigingen.

Doelstructuur:

```text
apps/web/src/
  app/
    App.tsx
    AppShell.tsx
    routes.tsx
  features/
    account/
    calls/
    chat/
    developer/
    games/
    pairing/
    profile/
    worlds/
```

Eerst worden de permanente shell, onderste navigatie, drawers en routepagina's
losgemaakt. Providers blijven tijdens deze fase ongewijzigd.

Klaar wanneer:

- `App.tsx` alleen compositie en bootstrapping bevat;
- featurecomponenten geen circulaire imports hebben;
- alle bestaande routes en zeven wereld-1-spellen hetzelfde werken;
- de bestaande E2E-suite volledig slaagt.

## Fase 2: Datagedreven Wereld- En Spelregistry

Vervang `games.slice(0, 7)` en impliciete wereldposities door gevalideerde data.

Nieuwe kernvormen:

```ts
interface WorldDefinition {
  id: number;
  slug: string;
  name: string;
  requiredDiscoveries: number;
  priceCents: number;
  image: string;
}

interface GamePlacement {
  worldId: number;
  gameId: string;
  position: HotspotPosition;
  order: number;
}
```

De registry onderscheidt:

- `native`: nieuwe React-module;
- `legacy-adapter`: tijdelijke iframe-module;
- `planned`: nog niet toegankelijk;
- `profile`: appfunctie, geen voltooiingsspel.

Klaar wanneer:

- iedere wereld met dezelfde generieke kaartcomponent rendert;
- routes, hotspots en unlocktekst uitsluitend uit gevalideerde data komen;
- niet-speelbare profielonderdelen geen ontdekkingspunten kunnen geven;
- wereld 2 zonder spellen kan bestaan zonder speciale React-code.

## Fase 3: Herstelbare Spelstatus

Maak de backend de duurzame bron voor de actuele toestand van iedere spelrun.

Werk:

- versieerbare `GameStateSnapshot` en `GameAction` contracten;
- serverendpoint en repository-methoden voor acties en snapshots;
- pair-membershipcontrole bij iedere update;
- monotone revisienummers of optimistic concurrency;
- idempotente action-ID's;
- herstel na refresh, reconnect en tweede tab;
- expliciete statusovergangen: lobby, active, completed, abandoned;
- eindresultaat atomisch met de laatste state opslaan.

Legacy-adapters sturen tijdelijk semantische events waar beschikbaar en een
snapshot als terugval. Nieuwe native spellen gebruiken uitsluitend typed
actions.

Klaar wanneer:

- twee browsers na refresh dezelfde run hervatten;
- oude of dubbele updates geen nieuwere state overschrijven;
- een onbevoegde installatie geen run kan lezen of wijzigen;
- voltooiing precies eenmaal meetelt voor wereldprogressie.

## Fase 4: Waarden Native Maken

Waarden wordt de architectuurproef voor alle toekomstige spellen.

Structuur:

```text
features/games/waarden/
  definition.ts
  contracts.ts
  content.ts
  reducer.ts
  selectors.ts
  result.ts
  WaardenGame.tsx
  *.test.ts
```

Werk:

- inhoud uit HTML naar gevalideerde TypeScript-data;
- reducer voor alle spelstappen;
- typed couple-actions;
- state, rendering, synchronisatie en resultaatberekening scheiden;
- bestaande vormgeving nauwkeurig reconstrueren;
- wachten en partnerarrival via de centrale lobby houden;
- iframe voor Waarden verwijderen zodra pariteit bewezen is.

Klaar wanneer:

- beide spelers het volledige spel kunnen afronden;
- refresh/reconnect midden in iedere belangrijke stap werkt;
- individuele keuzes en gezamenlijke vergelijking semantisch worden opgeslagen;
- desktop en mobiel visueel zijn goedgekeurd;
- Waarden geen legacy-script of iframe meer gebruikt.

Hier volgt een expliciete architectuurreview. Problemen worden in Waarden
opgelost voordat een tweede native spel wordt gebouwd.

Status: afgerond. Waarden draait als getypeerde React-spelmodule met
gevalideerde content, een reducer, servergestuurde spelstatus,
conflict-herstel en semantische resultaatopslag. Refresh,
twee-browser-synchronisatie en wereldkaartprogressie zijn met browsertests
afgedekt. Fase 5 start pas na de hierboven genoemde architectuurreview.

## Fase 5: Profielinzichten En Resultaatmodellen

Zet de huidige algemene activity-log om in betrouwbare profielbronnen.

Werk:

- versieerbaar resultaatschema per spel;
- persoonlijke en gezamenlijke resultaatscope;
- profielaggregaties met provenance naar game-run en spelversie;
- wachtstatistieken, voorkeuren, overeenkomsten en verschillen;
- relatiearchief met resultaten naast berichten;
- data-export en verwijderbaarheid voorbereiden;
- generieke click-events alleen als diagnostische fallback behandelen.

Klaar wanneer:

- profielwaarden uit semantische resultaten worden berekend;
- herberekening deterministisch is;
- een nieuwe partner geen oud relatieprofiel ziet;
- persoonlijke geschiedenis na ontkoppeling behouden blijft.

## Fase 6: PostgreSQL Als Geteste Doelomgeving

Voeg lokale infrastructuur toe:

```text
docker-compose.yml
apps/api/.env.example
scripts/
  db-reset
  db-check
```

Werk:

- PostgreSQL-container met persistente lokale volume;
- Prisma migrate/reset/generate-scripts;
- migraties vanaf lege database testen;
- kritieke repositorycontracttests tegen LocalRepository en PrismaRepository;
- seed voor twee testgebruikers, relatie en spelrun;
- documentatie voor starten, resetten en inspecteren.

Klaar wanneer:

- een schone database met één commando opstart en migreert;
- dezelfde contracttests op beide repositories slagen;
- lokale JSON alleen nog snelle fallback is, niet de enige geteste opslag.

## Fase 7: Kwaliteitspoort Voor Nieuwe Werelden

Breid de tests uit met:

- twee browsers die een volledig native spel afronden;
- refresh tijdens lobby en tijdens spel;
- disconnect/reconnect;
- dubbele en out-of-order events;
- resultaatisolatie per persoon en relatie;
- ontkoppelen en opnieuw koppelen;
- desktop- en mobiele screenshots voor kaart, lobby en Waarden;
- PWA-offlinegedrag zonder caching van persoonlijke responses;
- accessibility-smokechecks voor toetsenbord en dialogen.

Klaar wanneer:

- CI alle bovenstaande scenario's stabiel draait;
- geen console-, type-, lint- of buildfouten bestaan;
- regressies in de permanente shell visueel worden gedetecteerd.

## Go/No-Go Voor Wereld 2

Wereld 2 mag inhoud krijgen wanneer:

1. Waarden volledig native en herstelbaar is;
2. de wereldregistry wereld 2 generiek kan renderen;
3. profielresultaten semantisch zijn;
4. PostgreSQL-migraties aantoonbaar werken;
5. de kwaliteitspoort groen is;
6. de architectuurreview geen blokkerende schuld vindt.

Daarna wordt ieder nieuw spel één voor één gebouwd volgens het bewezen
Waarden-patroon: content, reducer, synchronisatie, resultaat, tests, visuele
controle en een eigen commit.
