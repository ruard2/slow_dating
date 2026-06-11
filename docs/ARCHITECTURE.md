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
servergeregistreerde `GameRun`. De bestaande rijke spelimplementaties draaien
via een expliciete iframe-adapter uit `legacy/koppel-frontend`. Daardoor blijven
inhoud en vormgeving behouden, terwijl navigatie, identiteit, chat en bellen
appbreed zijn. Nieuwe modules implementeren rechtstreeks `GameDefinition`.

## Data

Het Prisma-schema is de doeldataspecificatie voor PostgreSQL. Omdat deze
werkplek geen Docker/PostgreSQL bevat, biedt `LocalRepository` dezelfde
applicatie-interface met atomische JSON-writes. Oude profiel-, voortgangs- en
belstatusbestanden worden eenmaal als afzonderlijk `legacyArchive` ingelezen.

## Privacy

- De PWA cachet geen API-, profiel- of chatresponses.
- Ontkoppelen verwijdert nieuwe pair-chat direct.
- WebRTC-audio wordt niet opgenomen of opgeslagen.
- Legacydata blijft gescheiden totdat accountkoppeling bestaat.
