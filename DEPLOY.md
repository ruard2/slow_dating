# Deploy instructies — KleurKompas + Kernkwadranten

## Stap 1 — Backend op Railway

1. Maak een nieuwe GitHub repo aan, bijv. `kleurkompas-backend`
2. Zet de inhoud van `koppel-backend/` erin (server.js, package.json, Procfile)
3. Ga naar [railway.app](https://railway.app) → New Project → Deploy from GitHub
4. Kies de backend-repo
5. Railway detecteert `Procfile` automatisch en draait `node server.js`
6. Ga naar Settings → Environment → voeg toe:
   - `FRONTEND_URL` = jouw Netlify-URL (zie stap 2)
7. Kopieer de Railway-URL (bijv. `https://kleurkompas-backend.up.railway.app`)

## Stap 2 — Frontend op Netlify

1. Maak een nieuwe GitHub repo aan, bijv. `kleurkompas-frontend`  
2. Zet de inhoud van `koppel-frontend/` erin
3. **Pas de backend URL aan** in `koppel.js`:
   ```js
   const BACKEND_URL = 'https://JOUW-RAILWAY-URL.up.railway.app';
   ```
   (vervang het placeholder door je echte Railway URL uit stap 1)
4. Ga naar [netlify.com](https://netlify.com) → New site from Git
5. Kies de frontend-repo
6. Build command: *(leeg laten)*
7. Publish directory: `.`
8. Deploy → klaar!

## Hoe de koppelcode werkt

```
Persoon 1 (telefoon A)          Persoon 2 (telefoon B)
──────────────────────          ──────────────────────
1. Open app                     1. Open app
2. Kies KleurKompas             2. Kies KleurKompas
3. Klik "Wij samen"             3. Klik "Wij samen"  
4. Klik "Maak koppelcode"       4. Voer code in (bijv. ROOS42)
5. Zie code: ROOS42             5. Klik Verbinden
6. ✓ Beide verbonden            6. ✓ Beide verbonden
7. Klik Start →                 7. Klik Start →
8. Doe scenarios op eigen scherm  8. Doe scenarios op eigen scherm
9. Klaar → wacht op partner     9. Klaar → wacht op partner
10. ← Beide klaar → resultaten samen op beide schermen →
```

## Architectuur

```
Netlify (static)                Railway (Node.js)
─────────────────               ──────────────────
index.html                      Express HTTP
kleurkompas.html       ←─────→  Socket.io WebSocket
kernkwadranten.html             In-memory sessies
koppel.js                       Auto-expire na 24h
```
