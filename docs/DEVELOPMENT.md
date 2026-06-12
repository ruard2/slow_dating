# Lokale Ontwikkeling

## Vereisten

- Node.js 22 of nieuwer
- npm 10 of nieuwer
- Docker Desktop met WSL2 op Windows

## Starten

```powershell
npm install
npm run db:up
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
npm run test:pwa
npm run db:check
```

De browsertests bevatten functionele desktop- en mobiele flows. Visuele
wijzigingen aan kaart, wachtkamer of Waarden moeten bewust worden beoordeeld
voordat baselines worden vernieuwd:

```powershell
npx playwright test tests/e2e/visual.spec.ts --update-snapshots
```

De CI vergelijkt deze baselines op een vaste Windows-runner. `test:pwa` gebruikt
de productiebuild en controleert offline opstarten plus de afwezigheid van
persoonlijke `/api`-responses in Cache Storage.

`npm run db:check` start PostgreSQL, bouwt de database vanaf nul op, past alle
Prisma-migraties toe, draait hetzelfde repositorycontract tegen JSON en
PostgreSQL en plaatst daarna de vaste lokale seed.

## Database

```powershell
# Container starten en op gezondheid wachten
npm run db:up

# Alle lokale data wissen, migreren en opnieuw vullen
npm run db:reset

# Container stoppen; het volume blijft bestaan
npm run db:down
```

De seed maakt `ruard@example.test` en `partner@example.test` met wachtwoord
`Professioneel123`, koppelt beide profielen en bewaart een afgeronde
Waarden-run plus een chatbericht.

Gebruik voor de API:

```text
STORAGE_DRIVER=postgres
DATABASE_URL=postgresql://slowdating:slowdating@127.0.0.1:5432/slowdating
```

`LocalRepository` blijft beschikbaar als snelle JSON-fallback. PostgreSQL is
de geteste doelomgeving en de CI draait dezelfde repositorycontracten tegen
beide opslaglagen.
