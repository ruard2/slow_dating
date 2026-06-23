# Slow Dating — Implementatieplan "Nabijheidsgroei"

> **Status (2026-06-14):**
> - ✅ **Fase A af** — nabijheidsbalk fijnmazig + per-landschap gemaximeerd
>   (5 spellen per kaart, extra spellen tellen niet mee; landschap N+1 opent bij
>   vol quotum; poppetjes schuiven per actie). Gedeelde, geteste kern in
>   `apps/api/src/progress.ts` (`computeCoreProgress`), gebruikt door beide
>   repositories. Punten-taal vervangen door groei-taal. Bestaande balk-illustratie
>   behouden (geen eigen streepjes toegevoegd).
> - ✅ **Fase B v1 af** — "Profielschets na kaart 1" (`/profielschets`): waar de
>   match zit, wat spannend is, warme gedragsinzichten (uit spelkeuzes, niet
>   chats/bellen) en een teaser van kaart 2. Entreepunt op de kaart zodra
>   landschap 2 opent.
> - ✅ **Fase C1 af** — dating-profiel (foto-URL, geboortejaar, woonplaats,
>   interesses, kernwaarden, relatie-intentie, levensfase, leeftijds-/afstand-
>   voorkeur, christelijke laag). Opgeslagen in `Profile.legacyData` (**geen
>   migratie**), via `profileSchema`/`ProfileUpdate`, beide repositories en de
>   profiel-editor. Round-trip-test toegevoegd.
> - ✅ **Fase C-5A af** — ontdekken/matchen. `RouteInvitation`-tabel (Prisma-model
>   + migratie `20260615090000_route_invitations`, client geregenereerd);
>   gedeelde geteste overlap-score in `apps/api/src/matching.ts` (waarden 0.35 ·
>   intentie 0.25 · geloof 0.20 · leeftijd 0.10 · levensfase 0.10; afstand =
>   filter). `suggestIntroductions` + `createRouteInvitation` +
>   `respondToRouteInvitation` in beide repos; **2–3/week**, eerste-ja →
>   "deze persoon wil je beter leren kennen — wil jij ook?", **twee ja's →
>   `Pair` (kaart 1)**, exclusiviteit afgedwongen. API-routes
>   `/api/introductions` + `/api/route-invitations(/:id/respond)`, [KennismakenPage](../apps/web/src/features/matching/KennismakenPage.tsx)
>   + dock-entree. Integratietests voor de twee-ja-flow.
> - ✅ **Fase C4 af** — veiligheid. `Block` + `Report` Prisma-modellen + migratie
>   `20260615093000_safety_blocks_reports` (client geregenereerd). Repo-methodes
>   `blockInstallation` (verbergt wederzijds, laat openstaande kennismakingen
>   vervallen, stopt een gedeelde route respectvol), `listBlockedInstallationIds`,
>   `reportInstallation` in beide repos; blokkades gefilterd in
>   `suggestIntroductions` + `createRouteInvitation`. Routes `/api/blocks` (GET/POST)
>   + `/api/reports` (POST). UI: blokkeer-/meld-acties per kaart in KennismakenPage.
>   Route respectvol stoppen bestond al (`DELETE /api/pairs/current`). Integratietest
>   voor blokkeren. (Contactdelen-na-drempelfase: nog open; er is nog geen
>   contactdeel-functie.)
> - ✅ **Fase D af** — christelijke verdiepingslaag + interne groeilijnen.
>   `pair.christianLayer` (alleen actief als **beide** partners de toggle aan
>   hebben) doorgegeven aan elk spel via `GameComponentProps.christianLayer`.
>   Gedeelde [FaithLayer](../apps/web/src/features/games/FaithLayer.tsx)-component
>   + per-spel `christianPrompts` in **alle 8 native spellen** en de
>   profielschets — inhoudelijk afgestemd op elk thema (waarden→Christus,
>   oude-eik→vergeving/zegen, grenzen-tempo→reinheid/wachten/huwelijk, enz.),
>   nooit opdringerig. Interne groeilijnen (kennis/vertrouwen/zorg/richting) via
>   `growthLineForGame` in content → `nabijheid.lines` in `computeCoreProgress`,
>   getoond als dominante lijn in de profielschets. Tests voor beide.
>
> 🎉 **Plan compleet.** Fases A · B · C1 · C-5A · C3 · C4 · D zijn gebouwd,
> getest en gebouwd (78 unit/integratietests groen, productie-build slaagt).
> Open vervolgpunten staan in §9.


Dit document vertaalt het conceptdocument *"Slow Dating — appconcept met
nabijheidsgroei-balk (v2)"* naar een concreet, gefaseerd en precies
bouwplan, afgezet tegen de huidige codebase. Het is bedoeld als
werkdocument: elke fase noemt het doel, de exacte stappen, de te
wijzigen/nieuwe bestanden, het datamodel, de microcopy, de
acceptatiecriteria en de tests.

> Taal: het concept verbiedt "punten/score/level". In dit plan gebruiken
> we intern de bestaande veldnamen (bv. `completedGames`) maar in de UI
> uitsluitend groei-taal (nabijheid, groeilijn, mijlpaal, naderen).

---

## 0. Uitgangssituatie (wat er al staat)

De codebase implementeert al een groot deel van het concept. Belangrijk om
te weten vóór we bouwen:

### Architectuur
- Monorepo (npm workspaces): `apps/web` (React + Router + PWA),
  `apps/api` (Express + Socket.IO + Prisma/JSON-repo), `packages/*`
  (`contracts`, `content`, `realtime`, `game-kit`, `ui`, `config`).
- Twee repository-implementaties die identiek moeten blijven:
  [localRepository.ts](../apps/api/src/localRepository.ts) (JSON, dev) en
  [prismaRepository.ts](../apps/api/src/prismaRepository.ts) (Postgres).
  Pariteit wordt bewaakt door
  [repository.contract.test.ts](../apps/api/src/repository.contract.test.ts).

### Wereld- en voortgangsmodel (nu)
- 5 werelden (= "landschappen") in
  [packages/content/src/index.ts](../packages/content/src/index.ts):
  `worlds[]` met `requiredDiscoveries` (0/5/10/15/20) en `priceCents`
  (0/200/300/400/500).
- Voortgang wordt server-side berekend in `getProgress` (beide repo's):
  - `completedGames` = aantal **unieke voltooide discovery-spellen** van het
    koppel (`isDiscoveryGameId`, vlag `scoresDiscovery` in content).
  - `eligibleWorlds` = wereld 1 altijd; wereld N als `completedGames >= (N-1)*5`.
  - `unlockedWorlds` = eligible **én** gekocht (`WorldPurchase`); wereld 1 gratis.
- De **nabijheidsbalk bestaat al** in
  [WorldMap.tsx](../apps/web/src/components/WorldMap.tsx): twee poppetjes
  (`figuur_t.webp`, `figuur2_t.webp`) bewegen vanaf links/rechts naar het
  midden op basis van `completedGames`, via
  `WAYPOINTS = [7.4, 14.5, 24.9, 35.2, 48.5]` en `progressPosition()`.
  Achtergrond: `nabijheid_balk2.webp`.

### Spellen
- Native (React): `waarden`, `kernkwadranten`, `stilteruisje`,
  `vrolijke-open-plek`, `oude-eik`, `spiegelvijver`.
- Legacy-adapter (iframe): `lach-samen`, `kennismaking`, `familiedorp`,
  `kwaliteiten`, `stille-vijver`, `brug-ontdekking`.
- Profiel: `profiel`, `relatiekaart` (status `profile`).
- Gedeeld mechaniek "**eerst allebei antwoorden**" is per spel aanwezig via
  `bothSubmitted`-gating (zie bv. `spiegelvijver`, `oude-eik`).
- Actie-afhandeling generiek: `api.applyGameAction` met `expectedRevision`
  (optimistic locking), realtime sync via `game.state.updated`.

### Profiel/inzichten
- `/profile`-route + [ProfilePage.tsx](../apps/web/src/features/profile/ProfilePage.tsx).
- [profileInsights.ts](../apps/api/src/profileInsights.ts) bouwt inzichten,
  maar **alleen `waarden`** wordt semantisch geparset; overige spellen worden
  alleen als ruwe `relationshipGameResults` bewaard.

### Chat / bellen / veiligheid
- Vaste dock (chat, bellen, opties) in
  [AppShell.tsx](../apps/web/src/app/AppShell.tsx).
- Bellen achter `callAccess`-gate. Géén blokkeren/rapporteren/route-stop.

---

## 1. Gap-analyse (concept ⟶ code)

| Conceptonderdeel | Status | Actie nodig |
|---|---|---|
| 5 landschappen + kaartwereld | ✅ | Geen |
| Twee poppetjes → midden | ✅ basis | Verfijnen (Fase A) |
| Landschap 1 gratis, 2+ betaald, één betaalt voor beiden | ✅ | Microcopy (Fase A) |
| Eerst allebei antwoorden | ✅ per spel | Borgen als gedeeld patroon (Fase A/B) |
| Resultaten per persoon + koppel bewaren | ✅ | Benutten (Fase B) |
| Chat + bellen in route | ✅ | Geen |
| **Geen punten-taal → groei-taal** | ❌ | Fase A |
| **9 groeilijnen, geleidelijk per micro-actie** | ❌ (per voltooid spel) | Fase A |
| Interne groeilijnen (kennis/vertrouwen/zorg/richting) | ❌ | Fase D |
| Profiel + relatiekaart gevuld | ⚠️ deels | Fase B |
| Dating-profiel (foto/bio/leeftijd/intentie) | ❌ | Fase C |
| Match-verzoek → accept/weiger → exclusiviteit | ❌ | Fase C |
| Christelijke laag (toggle + extra vragen) | ❌ | Fase D |
| Veiligheid: blokkeren/rapporteren/route stoppen | ❌ | Fase C |

**Conclusie:** de spelmotor en de balk zijn het zware werk en zijn er al.
De grootste *gevoels*-winst zit in Fase A (taal + balkmechaniek). De
grootste *product*-uitbreiding is Fase C (de datingschil).

---

## 2. Ontwerpprincipes (leidend voor alle fases)

1. **Groei, geen score.** Nooit getallen als prestatie tonen. Wel: "Jullie
   naderen de volgende groeilijn."
2. **Beide deelnemers nodig.** De balk groeit alleen als bíede iets doen.
3. **Geleidelijk, niet sprongsgewijs.** Kleine stapjes per betekenisvolle
   actie; een groeilijn wordt pas gepasseerd bij echte voltooiing.
4. **Eerst allebei, dan onthullen.** Persoonlijke antwoorden worden pas
   zichtbaar als beiden hebben geantwoord.
5. **Rust en veiligheid boven snelheid.** Geen druk-taal; alles
   respectvol stopbaar.
6. **Eén zichtbare balk, meerdere interne lijnen.** Onder de motorkap mag
   het rijker zijn dan wat de gebruiker ziet.
7. **Ontdekken in slow-dating-geest, geen Tinder.** Geen oneindige swipe-deck,
   geen foto-eerst-oordeel, geen popularity-metrics, geen vele gelijktijdige
   chats. Wél: weinig, weloverwogen kennismakingen; inhoud (waarden, woorden)
   vóór uiterlijk; één route tegelijk; uitnodigen met een persoonlijk bericht
   i.p.v. wegswipen. Zie §5A.
8. **Pariteit repo's + groene quality gates** bij elke wijziging.

---

## 3. Fase A — Nabijheidsgroei-balk + taal (klein, hoogste rendement)

**Doel:** de bestaande app laten *voelen* als het concept: 9 groeilijnen,
geleidelijke beweging per actie, en groei-taal i.p.v. punten/ontdekkingen.
Geen breuk in het unlock/betaalmodel.

### A.1 Datamodel: voeg een "nabijheid"-signaal toe aan voortgang

Doel: een fijnmazige fractie (0..1) die binnen een segment kruipt op basis
van betekenisvolle acties, maar een groeilijn pas passeert bij voltooiing.

Stappen:
1. **Contract uitbreiden.** In
   [packages/contracts/src/index.ts](../packages/contracts/src/index.ts),
   `worldProgressSchema` (regel ~243) uitbreiden met:
   ```ts
   nabijheid: z.object({
     fraction: z.number().min(0).max(1),   // positie poppetjes (0=buiten, 1=midden)
     milestonesPassed: z.number().int().min(0).max(9),
     growthLines: z.literal(9),
   })
   ```
2. **Berekening (beide repo's, identiek).** In `getProgress` van
   [localRepository.ts](../apps/api/src/localRepository.ts) (±r835-870) en
   [prismaRepository.ts](../apps/api/src/prismaRepository.ts) (±r921-957):
   - `milestonesPassed` = afgeleid van `completedGames` met de bestaande
     drempel-logica (elke 5 discovery-spellen = volgende wereld). Map naar
     0..9: bv. `Math.min(9, Math.round(completedGames / 20 * 9))` voor de
     ruwe mijlpaal, **maar** cap zo dat een mijlpaal pas telt bij
     daadwerkelijke wereldvoltooiing.
   - `fraction` = vloeiende waarde:
     `base = completedGames / 20` (voltooide spellen, 0..1) plus een kleine
     "in-uitvoering"-bonus uit lopende activiteit, geclampt zodat hij de
     volgende mijlpaal-grens niet overschrijdt vóór voltooiing:
     ```
     inProgress = openActiesSindsLaatsteVoltooiing / actiesPerSpelSchatting
     fraction = clamp(base + inProgress * stapPerSpel, 0, volgendeMijlpaalGrens)
     ```
   - **Activiteitsbron** voor `inProgress`: tel `GameAction`-rijen (native)
     en relevante `ActivityEvent`-rijen (legacy) van het koppel sinds de
     laatste voltooide run. Beide tabellen bestaan al
     (`api.recordActivity`, `applyGameAction`).
3. **Tests bijwerken:** `app.test.ts` (verwacht nu `completedGames: 1`,
   regel ~106) uitbreiden met `nabijheid`-assertions; `repository.contract.test.ts`
   moet dezelfde `nabijheid` uit beide repo's krijgen.

> Alternatief (kleiner, als stap 2 te complex is): laat `fraction = completedGames/20`
> en voeg later pas de in-progress-bonus toe. De UI (A.2) werkt met beide.

### A.2 Front-end: 9 groeilijnen + beweging op fractie

In [WorldMap.tsx](../apps/web/src/components/WorldMap.tsx):
1. Vervang `progressPosition(completedGames)` door gebruik van
   `progress.nabijheid.fraction`. Linker poppetje: `left = fraction*50%`;
   rechter poppetje: `right = fraction*50%` (ontmoeting bij `fraction=1` op 50%).
2. Render **9 groeilijnen**: een rij van 9 even verdeelde tickmarkers over de
   balk; de middelste (5e) visueel benadrukt als "ontmoetingslijn".
3. Subtiele animatie (CSS transition op `left/right`) zodat verschuiving
   vloeiend oogt bij refetch.
4. Verwijder `WAYPOINTS`/`progressPosition` of behoud als fallback achter
   `nabijheid` (defensief).

### A.3 Microcopy: punten/ontdekkingen → groei

Vervang exact deze plekken:
- [WorldMap.tsx](../apps/web/src/components/WorldMap.tsx):
  - `worldLockOverlay`: `"${completedGames} / ${requiredDiscoveries} ontdekkingen"`
    → `"Nog een stukje groeien om ${world.name} te openen"` of
    `"Jullie zijn ${milestonesPassed} groeilijnen genaderd"`.
  - `unlockToast`: `"Wereld X is klaar"` → `"Een nieuw landschap opent zich"`.
  - `unlockCard`: "Ontdekkingen X / Y" → "Nabijheid gegroeid"; knoptekst
    "Wereld vrijschakelen" → "Samen dit landschap openen".
- [GamePage.tsx](../apps/web/src/features/games/GamePage.tsx): de
  `gameWelcomeCard` `<span>Ontdekking</span>` (±r800) → `"Samen ontdekken"`.
- Voeg een microcopy-bron toe (bv.
  `packages/content/src/microcopy.ts`) met de zinnen uit het concept:
  - "Jullie zijn gegroeid in nabijheid."
  - "Jullie naderen de volgende groeilijn."
  - "De volgende fase is geopend."
  - "Neem de tijd. Nabijheid groeit niet door haast, maar door aandacht."

### A.4 Acceptatiecriteria Fase A
- De balk toont 9 groeilijnen; poppetjes ontmoeten elkaar in het midden bij
  volledige voltooiing.
- Bij het indienen van een antwoord schuift de fractie zichtbaar (klein) op,
  zonder een groeilijn te passeren vóór spelvoltooiing.
- Nergens in de UI staat nog "punt(en)", "score", "level" of "ontdekking" als
  prestatiemaat.
- `npm run check` groen; e2e in `tests/` groen.

---

## 4. Fase B — Profiel & relatiekaart vullen (data is er al)

**Doel:** de opgeslagen koppel- en persoonsresultaten omzetten in een
persoonlijk profiel, een relatiekaart en gesprekssuggesties.

### B.1 Server: inzicht-extractors per spel
In [profileInsights.ts](../apps/api/src/profileInsights.ts):
1. Generaliseer `parseSemanticResult` van alleen-`waarden` naar een
   register van extractors per `gameId`, elk met het bijbehorende
   result-schema (uit `serializeResult` van het spel):
   - `kernkwadranten`, `stilteruisje`, `vrolijke-open-plek`, `oude-eik`,
     `spiegelvijver`.
2. Per spel een `PersonalInsight` + `RelationalInsight` produceren, bv.
   spiegelvijver: "jij toont snel X; eronder Y; partner ziet Z;
   (h)erkenning: …". Voeg result-schema's toe aan
   `packages/contracts` waar die nog ontbreken.
3. **Gesprekssuggesties** (regelgebaseerd): genereer 2–3 zachte prompts uit
   verschillen, bv. spiegelvijver `recognises ∈ {no, partly}` → "Bespreek wat
   er niet klopte aan het beeld dat de ander zag."
4. Tests in `profileInsights.test.ts` uitbreiden per extractor.

### B.2 Front-end: ProfilePage + Relatiekaart
1. [ProfilePage.tsx](../apps/web/src/features/profile/ProfilePage.tsx)
   uitbreiden met secties: *Wat je over jezelf liet zien* (persoonlijk),
   *Wat jullie samen ontdekten* (relationeel), *Gesprekssuggesties*.
2. **Relatiekaart**: nieuwe route `/relatiekaart` in
   [routes.tsx](../apps/web/src/app/routes.tsx) + component
   `features/profile/RelatiekaartPage.tsx`, gevoed door dezelfde
   `profileInsights`-data maar met relationele focus (gedeelde waarden,
   verschillen, patronen). Koppel aan de bestaande content-id `relatiekaart`.
3. Toegang: link vanuit de dock/opties of vanaf de kaart.

### B.3 Acceptatiecriteria Fase B
- Na het spelen van ≥2 native spellen toont `/profile` echte, leesbare
  inzichten (geen ruwe JSON) en minimaal 2 gesprekssuggesties.
- `/relatiekaart` toont gedeelde en verschillende punten van het koppel.
- `npm run check` groen.

---

## 5. Fase C — Datingschil (volwaardige datingapp, slow-dating-geest)

**Richting (besloten):** Slow Dating wordt een **volwaardige datingapp**,
maar nadrukkelijk in de geest van slow dating — **geen Tinder**. Van "samen
spellen" naar: elkaar leren kennen, weloverwogen kennismaken, één route
tegelijk, en veiligheid. Opgeknipt in C1–C4 zodat het incrementeel te leveren
is.

### 5A. Ontdekken & matchen — het slow-dating-ontwerp (kern)

Dit is de belangrijkste productkeuze. Het verschil met Tinder zit niet in een
detail maar in de hele mechaniek. Leidend: **weinig, weloverwogen, wederkerig.**

**Toetredingsvolgorde (besloten): "twee ja's = kaart 1".** Je ontmoet elkaar
niet *op* kaart 1; de kaartwereld is de gezamenlijke route die pas begint na
wederzijdse instemming:

```
Profiel maken  →  Kennismaking (je ziet elkaars profiel)  →  Beiden "ja"
       →  Route start bij KAART 1 (gratis)  →  Kaart 2+ (betaald, §9)
```

- Eén ja is niet genoeg: geen eenzijdige match. Pas bij **twee ja's** wordt het
  `Pair` (de route) aangemaakt en opent kaart 1.
- "Schaars" = **2–3 kennismakingen per week** (besloten; rate-limit per
  gebruiker in `suggestIntroductions`).
- Concreet betekent dit in datamodel-termen: A nodigt uit (ja #1) →
  B accepteert (ja #2) → `RouteInvitation.status = accepted` → `Pair` aangemaakt
  → kaart 1 toegankelijk. Een afwijzing geeft een rustige melding (concept §10).

**Anti-patronen die we bewust NIET bouwen:**
- Oneindige swipe-deck / snel links-rechts oordelen.
- Foto-eerst, uiterlijk-gedreven snelle selectie.
- Veel gelijktijdige matches en chats.
- Likes-tellers, populariteits-scores, "wie keek naar jou".
- Infinite scroll / dopamine-lus.

**Wel, het slow-dating-alternatief:**

1. **Inhoudelijk profiel eerst.** Een profiel leidt met wóórden: waarden,
   relatie-intentie en enkele korte reflectie-antwoorden. Foto en basisgegevens
   (leeftijd, woonplaats) zijn aanwezig maar secundair in de presentatie —
   nooit het eerste en enige.
2. **Schaarse kennismakingen.** De app toont géén eindeloze lijst, maar een
   klein aantal **kennismakingen** per periode (bv. 1–3 per week). Dit dwingt
   aandacht af i.p.v. consumeren.
3. **Afstemming op diepte, niet op uiterlijk/nabijheid.** Voorstellen worden
   gerangschikt op **waarde-overlap en intentie** (uit de filosofie van de
   spellen), met lichte filters (leeftijdsrange, afstand, optioneel
   geloofslaag) — maar de rangschikking is inhoudelijk.
4. **Uitnodigen, niet wegswipen.** Interesse tonen = een korte **persoonlijke
   uitnodiging** sturen (bv. een antwoord op een van hun reflectieprompts).
   Geen instant-match: het is een *uitnodiging tot een Slow Date-route*.
5. **Weloverwogen accepteren.** De ander bekijkt rustig en accepteert of
   weigert. Weigeren geeft een **rustige, niet-beschuldigende** melding
   (concept §10).
6. **Eén route tegelijk (exclusiviteit).** Bij acceptatie start de exclusieve
   route (de bestaande kaartwereld + nabijheidsbalk). Zolang een route actief
   is, worden er **geen nieuwe kennismakingen** getoond. Dit is dé
   anti-Tinder-kernregel (zie C.3).
7. **Rust- en reflectiemomenten.** Na het afronden van een route volgt een
   korte pauze ("neem even rust") vóór nieuwe kennismakingen verschijnen.
8. **Geen druk-signalen.** Geen leesbevestigingen-druk, geen "online nu" als
   jachtinstrument, geen tellers.

**Kennismaking-mechaniek (precies, besloten):**
- Er is **altijd een eerste-ja**: de initiatiefnemer. Door bij een getoonde
  kandidaat "ja, beter leren kennen" te kiezen, plaats jij ja #1.
- De ander krijgt een rustige vraag met diens inhoudelijke profiel:
  *"Deze persoon zou je graag beter leren kennen — wil jij dat ook?"*
- **Weekbudget: max 3 kennismakingsvragen per week** (ontvanger-kant). Per
  vraag antwoord je ja of nee:
  - **Ja** → ja #2 → `RouteInvitation.accepted` → `Pair` aangemaakt → samen
    naar **kaart 1**.
  - **Nee** → één van de drie van die week is **verbruikt**; rustige,
    niet-beschuldigende afronding voor beide kanten.
- Ook uitgaand schaars: het tonen/initiëren is gerangschikt en gelimiteerd
  (geen bulk-uitnodigen).

**Overlap-score (rangschikking van kennismakingen, voorstel):**
Kandidaten worden voor jou (en jij voor hen) gerangschikt op een gewogen
overlap-score `0..1`. Voorgestelde dimensies en gewichten (instelbaar):

| Dimensie | Gewicht | Bron |
|---|---|---|
| **Waarden** (zwaarst) | 0.35 | profiel + `waarden`-spelresultaten |
| **Relatie-intentie** | 0.25 | profiel (verkennen / serieus / vriendschap) |
| **Geloof** | 0.20 | profiel + of christelijke laag gewenst is |
| **Leeftijd** | 0.10 | leeftijd t.o.v. opgegeven voorkeursrange |
| **Levensfase / kinderwens** *(extra #1)* | 0.10 | profiel |

Plus **afstand/locatie** als **praktische filter** (niet als score): kandidaten
buiten de gewenste straal worden niet getoond. (Tweede mogelijke extra:
levensstijl — bewust later, om het profiel licht te houden.)

> Rangschikking gebeurt server-side in `suggestIntroductions`. Gewichten en de
> exacte leeftijds-/afstand-curves zijn tunables in `apps/api`.

**Datamodel (5A):**
- `Introduction { forInstallationId, candidateInstallationId, rank, reason,
  shownAt, status: shown|invited|dismissed|expired }` — de schaarse,
  gerangschikte voorstellen.
- `RouteInvitation { fromId, toId, message, promptAnswer?, status:
  pending|accepted|declined, createdAt }` — de persoonlijke uitnodiging.
- Bij `accepted` → maak een `Pair` (route) aan; hergebruik de bestaande
  pairing-/realtime-infra (vervangt de koppelcode-flow voor echte gebruikers).
- Rangschikking: een `suggestIntroductions(installationId)`-functie in de api
  die kandidaten scoort op waarde-overlap (uit profiel/`waarden`-resultaten),
  intentie en lichte filters; levert max N per periode (rate-limit per
  gebruiker).

**Acceptatiecriteria (5A):**
- Nergens een swipe-deck of oneindige lijst; per periode ≤ N kennismakingen.
- Profielweergave toont eerst woorden/waarden, daarna pas foto/basis.
- Interesse kan alleen via een persoonlijke uitnodiging met bericht.
- Tijdens een actieve route zijn er geen nieuwe kennismakingen.

**Doel:** van "samen spellen" naar een echte slow-dating-app:
profielen, matchen, exclusiviteit, veiligheid. Opgeknipt in C1–C4 zodat het
incrementeel te leveren is.

### C.1 Dating-profiel
1. Datamodel: `Profile` (Prisma + `profileSchema`/`updateProfileSchema` in
   contracts) uitbreiden met: `photoUrl`, `bio`, `birthDate`/`age`, `city`,
   `interests[]`, `coreValues[]`, `relationIntention`
   (enum: verkennen/serieus/vriendschap), `christianLayer` (bool, zie D).
2. Endpoints: `GET/PUT /profile` uitbreiden; foto-upload (opslag-keuze:
   lokaal/dev vs. object storage prod — **open beslissing**).
3. UI: profiel-editor + read-only profielweergave.
4. Moderatie-velden: `status` (zichtbaar/verborgen/geblokkeerd),
   `reportedCount`.

### C.2 Ontdekken & matchen
Uitgewerkt in **§5A** (het slow-dating-ontwerp). Bouwstappen:
1. Datamodel: `Introduction` + `RouteInvitation` (zie §5A).
2. `suggestIntroductions(installationId)` in de api: scoor kandidaten op
   waarde-overlap + intentie + lichte filters; lever ≤ N per periode
   (rate-limit per gebruiker).
3. Flow: schaarse kennismakingen tonen → persoonlijke uitnodiging sturen →
   ontvanger accepteert/weigert → bij acceptatie `Pair` (route) aanmaken via de
   bestaande pairing-/realtime-infra (vervangt de koppelcode-flow voor echte
   gebruikers).
4. UI: kennismakingsweergave (woorden eerst), inkomende/uitgaande
   uitnodigingen, rustige weiger-melding (concept §10).

### C.3 Exclusiviteit
1. Regel: maximaal één **actieve** route (`Pair`) per gebruiker tegelijk.
2. Server-guard bij `createPair`/`acceptMatch`: weiger als er al een actieve
   route is; bied "huidige route respectvol afronden" aan.

### C.4 Veiligheid (concept §10)
1. `Block { byId, blockedId }`, `Report { byId, targetId, reason, note }`.
2. Endpoints + UI: blokkeren, rapporteren, **route respectvol stoppen** (de
   ander krijgt een rustige melding, zonder beschuldiging).
3. Contactgegevens: nooit automatisch delen; pas na expliciete wederzijdse
   toestemming en na een drempelfase (koppelen aan `nabijheid.milestonesPassed`
   ≥ 3, concept §5).
4. Gedragsregels, profiel/bericht-moderatie (minimaal: rapport-queue).

### C.5 Acceptatiecriteria Fase C
- Een gebruiker kan een profiel maken, iemand uitnodigen, en alleen met één
  persoon tegelijk een route lopen.
- Blokkeren/rapporteren/stoppen werkt en is respectvol verwoord.
- Contactdelen kan alleen na wederzijds akkoord ná de drempelfase.

---

## 6. Fase D — Christelijke laag + interne groeilijnen (modulair)

### D.1 Christelijke laag (toggle)
1. Voorkeur: `Profile.christianLayer` (bool) — of per route, als koppel-keuze.
2. Contentstructuur: elk spel-`content.ts` krijgt optionele
   `christian`-vraagsets naast de algemene. Definieer een type in `game-kit`:
   `QuestionSet { base: ...; christian?: ... }`.
3. Spellen lezen de toggle (via props/context) en voegen de extra
   vragen/reflecties toe (concept §8-tabel: per landschap een
   verdiepingsvraag).
4. Begin met 1 spel als referentie (bv. `waarden`), daarna uitrollen.

### D.2 Interne groeilijnen
1. Tag elke discovery-actie met een `growthLine`
   (kennis/vertrouwen/zorg/richting) in content-metadata.
2. Accumuleer per koppel in `getProgress` (naast `nabijheid`), bewaar de
   breakdown maar toon **één** balk; gebruik de breakdown in het profiel
   ("Jullie groeiden vooral in vertrouwen").

---

## 7. Volgorde, afhankelijkheden en MVP-afbakening

```
Fase A  ─▶  Fase B  ─▶ [beslispunt scope] ─▶  Fase C  ─▶  Fase D
(taal+balk)  (profiel)                        (datingschil)  (extra's)
```

- **Doe Fase A eerst** (1 werksessie, geen nieuwe architectuur, hoogste
  gevoelswinst).
- **Fase B** benut bestaande data; logische tweede stap.
- **Richting (besloten):** dit wordt een **volwaardige datingapp in
  slow-dating-geest**. Fase C is dus in scope; A+B blijven de eerste,
  goedkope stappen die de bestaande ervaring op orde brengen vóór de schil.
- **MVP-van-de-visie** (concept §11) = Fase A + B + C1 (dating-profiel) +
  **5A minimaal** (schaarse kennismaking + persoonlijke uitnodiging) + C3
  (exclusiviteit) + C4 minimaal (blokkeren/rapporteren/route stoppen).
  Daarmee is de slow-dating-app in de kern ervaarbaar en veilig.

---

## 8. Teststrategie & kwaliteitspoorten

Bij **elke** fase:
- `npm run check` (lint + typecheck + unit + build) groen.
- `npm run test:e2e` (Playwright) groen; voeg e2e toe voor nieuwe flows.
- Bij progress/repo-wijzigingen: `repository.contract.test.ts` moet pariteit
  tussen `localRepository` en `prismaRepository` bevestigen.
- Nieuwe content/spellen: reducer-tests + content-registry-tests
  (`packages/content/src/index.test.ts`).
- Microcopy-check: een test/lint-regel die UI-strings scant op verboden
  woorden ("punt", "score", "level", "ontdekking" als maat) is optioneel maar
  aanbevolen.

---

## 9. Open beslissingen (input nodig)

1. **Balk-granulariteit (A.1):** volledige in-progress-formule nu, of eerst
   de eenvoudige `completedGames/20` en later verfijnen?
2. **Unlock-model:** betaald per landschap behouden (concept §9) — bevestigd?
   Of richting puur groei zonder betaling in deze fase?
3. **Matchen (C.2):** ~~hoe vinden gebruikers elkaar?~~ **Besloten:**
   volwaardige datingapp in slow-dating-geest — schaarse, op waarden
   gerangschikte kennismakingen + persoonlijke uitnodiging, geen swipe-markt.
   Zie §5A. Aantal kennismakingen: **2–3 per week (besloten)**.
   Toetredingsgate: **twee ja's = kaart 1 (besloten)**.
4. **Foto-opslag (C.1):** lokaal (dev) en welke storage in productie?
5. **Christelijke laag (D.1):** per gebruiker of per koppel in te schakelen?
6. **Moderatie (C.4):** handmatige rapport-queue volstaat voor MVP, of
   directe geautomatiseerde filtering nodig?

---

## 10. Concrete eerste stap (zodra akkoord)

Fase A, in deze volgorde van commits:
1. `contracts`: `worldProgressSchema.nabijheid` toevoegen (+ types).
2. `api`: `getProgress` in beide repo's uitbreiden + tests.
3. `web`: `WorldMap` 9 groeilijnen + beweging op `fraction`.
4. `web/content`: microcopy vervangen (geen punten/ontdekkingen meer).
5. `npm run check` + e2e groen, daarna Fase B.
```
