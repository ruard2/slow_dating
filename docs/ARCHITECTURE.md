# Architectuur

## Grenzen

- `apps/web` bezit routing, schermen en de permanente appshell.
- `apps/api` is de enige autoriteit voor identiteit, pair-membership en data.
- `packages/contracts` bevat alle publieke REST- en realtimevormen.
- `packages/realtime` maakt exact één Socket.IO-client per browsercontext.
- `packages/content` is de centrale spelregistry.
- `packages/game-kit` definieert de interface voor native spelmodules.
- `legacy` is alleen bron- en compatibiliteitsmateriaal.

## Identiteit

De browser maakt een willekeurig installatiegeheim. Alleen de SHA-256-hash
wordt opgeslagen. De API wisselt dit geheim in voor een ondertekend token van
één uur. Routes en sockets ontlenen de installatie uitsluitend aan dit token;
een client kan geen `userId`, spelersrol of `pairId` kiezen.

## Realtime

Na authenticatie zoekt de server de actuele pair-membership op en voegt de
socket server-side toe aan `pair:<id>`. Chatberichten hebben een unieke
`clientId`, event-ID's worden idempotent verwerkt en game- en callsignalen
worden alleen binnen de geverifieerde pair-room doorgestuurd.

## Spellen

Elk spel heeft metadata in `packages/content`. De appshell start een
servergeregistreerde `GameRun`. Legacy-spellen draaien tijdelijk via een
expliciete iframe-adapter; native spellen implementeren `GameDefinition`.
Ieder native spel levert daarnaast een versieerbaar resultaatschema in
`packages/contracts`. Alleen resultaten die zo'n schema doorstaan mogen door
een server-side projector worden omgezet in persoonlijke of gezamenlijke
profielinzichten. Generieke click- en activity-events blijven diagnostiek.

## Data

Het Prisma-schema is de doeldataspecificatie voor PostgreSQL 17. Docker Compose
levert lokaal een persistente database met healthcheck. `LocalRepository`
implementeert dezelfde applicatie-interface met atomische JSON-writes en blijft
alleen de snelle fallback. Eén gedeelde contracttest bewaakt identiteit,
koppeling, berichten, spelruns, wachtdata, profielprojectie en relatiearchief
tegen beide repositories. Oude profiel-, voortgangs- en belstatusbestanden
worden eenmaal als afzonderlijk `legacyArchive` ingelezen.

Profielinzichten zijn afgeleide data en worden niet als tweede waarheid
opgeslagen. De API herberekent ze deterministisch uit gevalideerde voltooide
spelruns, wachtdata en de relatie waartoe iedere bron behoort. Iedere afleiding
bevat provenance naar `gameRunId`, spelversie en resultaatschemaversie. De
persoonlijke projectie omvat alle eigen relaties; de actuele relatieprojectie
filtert uitsluitend op de huidige `pairId`.

## Privacy

- De PWA cachet geen API-, profiel- of chatresponses.
- De service worker gebruikt alleen precache voor statische buildbestanden;
  `/api`, `/socket.io` en `/legacy` zijn uitgesloten van navigatiefallback en
  hebben geen runtime-cachestrategie.
- Ontkoppelen sluit de relatie af. Berichten en semantische spelresultaten
  blijven alleen voor de twee voormalige leden beschikbaar in het
  relatiearchief.
- Profiel-export bevat de actieve relatie en afgesloten relatiearchieven met
  berichten en gevalideerde spelresultaten.
- WebRTC-audio wordt niet opgenomen of opgeslagen.
- Legacydata blijft gescheiden totdat accountkoppeling bestaat.
