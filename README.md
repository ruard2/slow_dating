# 🐍🪜 Slangen & Ladders — Voor Koppels op Afstand

Een erotisch web-based Slangen & Ladders spel voor twee spelers via browser.

---

## Stap 1 — Node.js installeren (eenmalig)

Download en installeer Node.js van: https://nodejs.org (kies de LTS versie)

Herstart daarna je terminal/PowerShell.

---

## Stap 2 — Backend starten (lokaal testen)

```powershell
cd "C:\Users\Eliane Stolper\Desktop\snakes and ladders\backend"
npm install
npm run dev
```

De backend draait nu op http://localhost:3001

---

## Stap 3 — Frontend starten (lokaal testen)

Open een **tweede** PowerShell venster:

```powershell
cd "C:\Users\Eliane Stolper\Desktop\snakes and ladders\frontend"

# Maak een .env bestand aan:
Copy-Item .env.example .env

npm install
npm run dev
```

Open http://localhost:5173 in je browser. Open het ook op je telefoon via je lokale IP (bijv. http://192.168.1.x:5173).

---

## Stap 4 — Deployen (online, voor op afstand spelen)

### Backend → Railway

1. Ga naar https://railway.app en maak een account
2. Klik "New Project" → "Deploy from GitHub repo"
3. Push de `backend/` map naar GitHub (of gebruik Railway CLI)
4. Railway detecteert automatisch de Procfile en start `node server.js`
5. Kopieer de gegenereerde Railway URL (bijv. `https://jouwapp.up.railway.app`)

### Frontend → Netlify

1. Ga naar https://netlify.com en maak een account
2. Sleep de `frontend/` map naar Netlify Drop, OF gebruik GitHub
3. Build command: `npm run build` | Publish directory: `dist`
4. Voeg een environment variable toe:
   - Key: `VITE_BACKEND_URL`
   - Value: jouw Railway URL (bijv. `https://jouwapp.up.railway.app`)
5. Deploy!

---

## Projectstructuur

```
snakes-and-ladders/
├── backend/
│   ├── server.js          ← Express + Socket.io server
│   ├── gameLogic.js       ← Spelregels, slangen, ladders
│   ├── package.json
│   └── Procfile           ← Voor Railway deploy
│
└── frontend/
    ├── src/
    │   ├── App.jsx            ← Hoofd app + socket events
    │   ├── socket.js          ← Socket.io client
    │   ├── data/
    │   │   ├── boardData.js   ← 80 vakjes content + kleuren
    │   │   └── eventCards.js  ← 10 mystery kaarten
    │   └── components/
    │       ├── Lobby.jsx          ← Kamer aanmaken/joinen
    │       ├── WaitingRoom.jsx    ← Wacht op partner
    │       ├── Game.jsx           ← Hoofd spelscherm
    │       ├── Board.jsx          ← Bord (8×10 grid + SVG overlay)
    │       ├── Dice.jsx           ← Geanimeerde dobbelsteen
    │       ├── ActionCard.jsx     ← Vakje opdracht tonen
    │       ├── ClothingTracker.jsx← Kleding bijhouden
    │       ├── EventCardOverlay.jsx← Mystery kaart popup
    │       ├── WinnerScreen.jsx   ← Eindscherm
    │       └── ChatBar.jsx        ← In-game chat
    ├── index.html
    ├── netlify.toml       ← Voor Netlify deploy
    └── package.json
```

---

## Spelregels (kort)

- **Ladder** → kledingstuk uit + ga omhoog
- **Slang** → kledingstuk aan + ga omlaag  
- **Power Switch** (vak 10, 20, 30, 40, 50, 60, 70) → die speler is 3 beurten de baas
- **Kleurlegenda**: Blauw=Waarheid, Rood=Durven, Paars=Edging, Groen=Kleding, Oranje=Ladder, Goud=Finish
- **Vak 80** → winnaar! Speciale beloning (optioneel filmpje)
- **Mystery kaarten** → trek op elk moment een van de 10 event kaarten

---

## Technologie

- **Frontend**: React 18 + Vite + Tailwind CSS + Framer Motion
- **Backend**: Node.js + Express + Socket.io
- **Real-time**: WebSocket via Socket.io
- **Deploy**: Netlify (frontend) + Railway (backend)
