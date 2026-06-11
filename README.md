# Slow Dating

Slow Dating is een modulaire relatie-app met een permanente appshell, gedeelde
chat en WebRTC-bellen, veilige gastidentiteit en een groeiende verzameling
gespreks- en ontdekspellen.

## Snel starten

```bash
npm install
npm run dev
```

- Web: `http://127.0.0.1:5173`
- API: `http://127.0.0.1:3000`

De lokale ontwikkelmodus gebruikt standaard een persistente JSON-repository in
`data/`. De PostgreSQL-doelomgeving staat in `docker-compose.yml`; het
Prisma-schema is de leidende dataspecificatie.

## Structuur

```text
apps/web       React, Router, PWA en appshell
apps/api       Express, Socket.IO, auth en data
packages       UI, contracts, realtime, content en game-kit
legacy         Bewaarde oude implementaties en broncontent
docs           Architectuur, ontwikkeling en herschrijfplan
```

## Kwaliteitscontrole

```bash
npm run check
npm run test:e2e
```

Zie `docs/ARCHITECTURE.md` voor de technische grenzen.
