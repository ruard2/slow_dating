# Masterplan Modulaire Herschrijving

## Werkwijze

De herschrijving gebeurt uitsluitend in kleine, afzonderlijk te beoordelen stappen:

1. Een fase uitvoeren.
2. Tests en browsercontrole draaien.
3. Het resultaat beoordelen.
4. De fase afzonderlijk committen.
5. Pas daarna de volgende fase starten.

De legacy-code blijft beschikbaar totdat alle unieke functionaliteit en content is
overgenomen. De baseline voor de herschrijving is vastgelegd in Git-tag
`legacy-baseline-2026-06-11`.

## Doelarchitectuur

```text
apps/
  web/          React, Vite, routing en PWA
  api/          Express, Socket.IO en WebRTC-signaling
packages/
  ui/           Herbruikbare visuele componenten
  contracts/    TypeScript-types en Zod-schema's
  realtime/     Een socket-client en eventcontract
  game-kit/     Gedeelde spelstructuur en state-machines
  content/      Gestructureerde spelcontent
  config/       Omgevingsconfiguratie
legacy/         Bewaarde oude implementatie
```

De basis gebruikt strict TypeScript, React Router, TanStack Query, Zustand,
CSS Modules, Express, Socket.IO, PostgreSQL/Prisma, Vitest en Playwright.

## Fasen

1. **Fundament:** workspaces, apps, packages, CI, tests en lokale start.
2. **Data en identiteit:** PostgreSQL, Prisma, gastidentiteit en veilige tokens.
3. **Koppelen en realtime:** pair-membership, presence, reconnect en events.
4. **AppShell en wereldkaart:** permanente shell en datagedreven hotspots.
5. **Waarden:** eerste volledige solo- en koppelspelmodule.
6. **Chat:** appbrede, bewaarde en verwijderbare chat.
7. **Bellen:** appbrede WebRTC-laag met managed TURN.
8. **Overige spellen:** een spel per cyclus, met tests en eigen commit.
9. **Datamigratie:** idempotente import van relevante legacydata.
10. **Opruimen:** legacy archiveren nadat unieke inhoud is overgenomen.

Na fase 5 volgt een expliciete architectuurreview voordat meer spellen worden
gemigreerd.

## Vaste Interfaces

Iedere spelmodule levert minimaal:

```ts
interface GameDefinition<State, Result> {
  id: string;
  version: number;
  modes: Array<"solo" | "couple">;
  createInitialState(): State;
  validateContent(): void;
  serializeResult(state: State): Result;
  Component: React.ComponentType;
}
```

Realtime-events gebruiken een versieerbare envelop:

```ts
interface RealtimeEvent<T> {
  id: string;
  type: string;
  version: number;
  pairId: string;
  gameRunId?: string;
  sentAt: string;
  payload: T;
}
```

## Kwaliteitsregels

- Geen TypeScript-, lint- of browserconsolefouten.
- Unit-tests voor spelregels, reducers en profielberekeningen.
- Contracttests voor REST en Socket.IO.
- Twee-browsertests voor koppelen en koppelspellen.
- Visuele regressietests voor mobiel en desktop.
- Persoonlijke API- en chatdata worden nooit door de PWA gecachet.
- Elke fase is zelfstandig werkend, controleerbaar en commitbaar.

## Uitgangspunten

- Alle actieve `koppel-*` onderdelen horen bij het nieuwe product.
- De oude Slangen & Ladders-app blijft alleen referentiemateriaal.
- Accounts zijn duurzaam; koppelcodes bevestigen alleen een nieuwe relatie.
- Ontkoppelde relaties blijven als privé, read-only archief voor beide leden
  bewaard.
- Wereldtoegang die betaald is, hoort bij het persoonlijke account.
- Vormgeving, illustraties en inhoud blijven zo veel mogelijk behouden.
- Er is voorlopig geen productie-uitrol of betalingsimplementatie.
- Gastidentiteiten zijn voorbereid op latere accounts.
- Chat blijft bewaard tot wissen of ontkoppelen.
- End-to-end-encryptie valt buiten deze herschrijving.
