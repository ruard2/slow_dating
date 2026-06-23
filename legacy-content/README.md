# Legacy content-archief

Bewaarde **inhoud** van afgedankte onderdelen. De dode *structuur* (oude servers,
build-tooling, node_modules, de `world.html`-kaart-shell, deploy-scripts, dubbele
frontend/backend) is verwijderd. Niets hier draait of wordt geïmporteerd door de live
app; puur naslag om uit te putten bij nieuwe spellen.

## Inhoud

- `snakes-and-ladders/` — het oude slangen-en-ladders koppelspel (eigen, niet-gekoppelde app).
  - `gameLogic.js` — bordindeling (LADDERS/SNAKES/power-squares) en spelverloop.
  - `src/data/boardData.js`, `src/data/eventCards.js` — actie-/gebeurteniskaarten (tekst).
  - `src/components/*` — oude UI (ActionCard, EventCardOverlay, ClothingTracker, …) als referentie.
- `standalone-games/` — losse HTML van **kernkwadranten** en **kleurkompas** (rootversies,
  werden niet meer geserveerd). Bevatten de oorspronkelijke vragen/teksten.
- `data/` — datadumps uit de verwijderde koppel-backend: `cases.json`, `domains.json`,
  `patterns.json`, `profiles.json`, `calling_states.json` + de `update_d*.py` updaters.

## Let op — NIET hier gearchiveerd (nog live!)

De koppel-spellen van **Wereld 1** (`lach_samen`, `kennismaking`, `familiedorp`,
`kwaliteiten`, `stille_vijver`, `brug_ontdekking`) + `grot`/`kleurkompas` draaien nog
als legacy-iframes vanuit `legacy/koppel-frontend/` (geserveerd op `/legacy/...`).
Die map is bewust blijven staan tot die spellen naar native React zijn omgezet.
