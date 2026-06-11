# Lokale Ontwikkeling

## Vereisten

- Node.js 22 of nieuwer
- npm 10 of nieuwer

## Starten

```powershell
npm install
npm run dev
```

De nieuwe webapp draait op `http://localhost:5173`. De nieuwe API draait op
`http://localhost:3000`.

De bestaande app blijft tijdelijk beschikbaar via:

```powershell
npm run legacy:start
```

## Controles

```powershell
npm run check
npm run test:e2e
```

PostgreSQL en Prisma worden in fase 2 toegevoegd. Docker is geen vereiste voor
de huidige funderingsfase.
