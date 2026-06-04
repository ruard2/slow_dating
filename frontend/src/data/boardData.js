// Square types: blue | red | purple | green | orange | snake | gold
// Power Switch squares are overlaid on top of the base type

export const SQUARES = {
  1:  { type: 'blue',   text: 'Eerste indruk van mij' },
  2:  { type: 'blue',   text: 'Noem één kernkwaliteit van mij die jij direct zag 💛' },
  3:  { type: 'orange', text: 'Ladder omhoog ↑ naar 19', destination: 19 },
  4:  { type: 'green',  text: 'Bovenkleding uit 👕' },
  5:  { type: 'blue',   text: 'Jouw top 3 waarden in het leven' },
  6:  { type: 'blue',   text: 'Stuur een voice note met je lach' },
  7:  { type: 'red',    text: 'Kus je scherm op de plek waar je mij wilt zoenen 💋' },
  8:  { type: 'blue',   text: 'Vertel een gênant datingverhaal' },
  9:  { type: 'blue',   text: 'Een kindertijdmoment dat je nog steeds vormt' },
  10: { type: 'red',    text: 'Stuur een foto van je handen 📸', powerSwitch: true },

  11: { type: 'green',  text: '1 kledingstuk naar keuze uit 👗' },
  12: { type: 'blue',   text: 'Favoriete niet-seksuele aanraking' },
  13: { type: 'blue',   text: 'Jouw guilty pleasure' },
  14: { type: 'red',    text: 'Beschrijf hoe je me voor het eerst zou zoenen' },
  15: { type: 'red',    text: 'Stuur een foto van je nek of sleutelbeen 📸' },
  16: { type: 'blue',   text: 'Jouw visie op liefde en relaties' },
  17: { type: 'blue',   text: 'Waar ben je het meest trots op?' },
  18: { type: 'orange', text: 'Ladder omhoog ↑ naar 37', destination: 37 },
  19: { type: 'blue',   text: 'Wat maakt jou écht gelukkig?' },
  20: { type: 'blue',   text: 'Wat is jouw droom voor de komende 5 jaar?', powerSwitch: true },

  21: { type: 'green',  text: 'Nog een extra kledingstuk uit 👙' },
  22: { type: 'red',    text: 'Stuur een foto van je billen (met ondergoed) 🍑' },
  23: { type: 'blue',   text: 'Beschrijf je ideale romantische avond' },
  24: { type: 'blue',   text: 'Een onzekerheid die je hebt in relaties' },
  25: { type: 'red',    text: 'Naaktfoto vanaf borst omhoog 🔥' },
  26: { type: 'red',    text: 'Beschrijf een sensuele fantasie die je hebt' },
  27: { type: 'blue',   text: 'Hoe zie jij de rol van seks in een relatie?' },
  28: { type: 'green',  text: 'Broek of rok uit 👖' },
  29: { type: 'blue',   text: 'Wat vind je het spannendst aan mij?' },
  30: { type: 'purple', text: 'Raak jezelf 30 seconden aan (bovenlijf) 🌊', powerSwitch: true, duration: 30 },

  31: { type: 'blue',   text: 'Een verlangen dat je nog nooit aan iemand hebt verteld' },
  32: { type: 'snake',  text: 'Slang omlaag ↓ naar 12', destination: 12 },
  33: { type: 'green',  text: 'Alles uit — behalve je ondergoed 🩱' },
  34: { type: 'red',    text: 'Geef mij 3 sexy complimenten over mijn lichaam' },
  35: { type: 'orange', text: 'Ladder omhoog ↑ naar 54', destination: 54 },
  36: { type: 'blue',   text: 'De laatste keer dat je je écht kwetsbaar voelde' },
  37: { type: 'blue',   text: 'Het intiemste dat je ooit met iemand deelde' },
  38: { type: 'red',    text: 'Doe een mini-striptease van 20 seconden 🎭' },
  39: { type: 'blue',   text: 'De belangrijkste levensles die je leerde over liefde' },
  40: { type: 'red',    text: 'Maak een close-up foto van een spannend lichaamsdeel 🔥', powerSwitch: true },

  41: { type: 'snake',  text: 'Slang omlaag ↓ naar 23', destination: 23 },
  42: { type: 'green',  text: 'Volledig naakt — alles gaat uit 🌙' },
  43: { type: 'purple', text: 'Edging — raak jezelf 45 seconden aan ✨', duration: 45 },
  44: { type: 'blue',   text: 'Wat wil je in bed maar durfde je nooit te vragen?' },
  45: { type: 'orange', text: 'Ladder omhoog ↑ naar 66', destination: 66 },

  46: { type: 'purple', text: 'Edging — 60 seconden terwijl je me aankijkt 💜', duration: 60 },
  47: { type: 'red',    text: 'Beschrijf wat je me zou fluisteren in het donker 🎙️' },
  48: { type: 'blue',   text: 'Jouw donkerste (acceptabele) fantasie' },
  49: { type: 'red',    text: 'Stuur een korte video van jezelf aanraken 🎬' },
  50: { type: 'red',    text: 'Volg mijn instructies gedurende 30 seconden 🎯', powerSwitch: true },
  51: { type: 'blue',   text: 'Hoe belangrijk is seksuele chemie voor jou?' },
  52: { type: 'green',  text: 'Blijf naakt voor de rest van het spel 🔓' },
  53: { type: 'orange', text: 'Ladder omhoog ↑ naar 72', destination: 72 },
  54: { type: 'purple', text: 'Edging ronde 2 — 60 seconden 💫', duration: 60 },
  55: { type: 'blue',   text: 'Wat betekent een zielverbinding voor jou?' },
  56: { type: 'red',    text: 'Stuur een voice note met mijn naam terwijl je jezelf aanraakt 🎙️' },
  57: { type: 'red',    text: 'Mirror game — doe exact na wat ik doe voor 30 sec 🪞' },
  58: { type: 'snake',  text: 'Slang omlaag ↓ naar 38', destination: 38 },
  59: { type: 'blue',   text: 'Wanneer was je voor het laatst jaloers en waarom?' },
  60: { type: 'purple', text: 'Edging — 90 seconden, ga zo ver als je durft 🔥', powerSwitch: true, duration: 90 },

  61: { type: 'red',    text: 'Striptease van 40 seconden 🎭' },
  62: { type: 'blue',   text: 'Wat zou je als eerste willen aanraken als we samen waren? 🤍' },
  63: { type: 'red',    text: 'Ik kies een plek op je lichaam — raak die 1 minuut aan 💋' },
  64: { type: 'purple', text: 'Volg mijn instructies — 45 seconden 🌊', duration: 45 },
  65: { type: 'blue',   text: 'Wat is iets wat je mij nog nooit hebt durven vragen? 🔐' },
  66: { type: 'red',    text: 'Stuur een verleidelijke naaktvideo (15-20 sec) 🎬' },
  67: { type: 'purple', text: 'Edging ronde 3 — ga heel dichtbij, maar stop net voor 💜', duration: 60 },
  68: { type: 'blue',   text: 'Jouw grootste seksuele onzekerheid' },
  69: { type: 'snake',  text: 'Slang omlaag ↓ naar 48', destination: 48 },
  70: { type: 'red',    text: 'Jij bepaalt — kies één opdracht van het bord die de ander nu alsnog uitvoert 🎯' },

  71: { type: 'blue',   text: 'Wat vind je het lekkerst aan mij — lichaam én karakter?' },
  72: { type: 'purple', text: 'Edging — 2 minuten, de allerlaatste ronde 🌊', duration: 120 },
  73: { type: 'red',    text: 'Jouw meest verleidelijke pose — laat zien ✨' },
  74: { type: 'blue',   text: 'Hoe zie je ons over precies 1 jaar?' },
  75: { type: 'red',    text: 'Kreun mijn naam terwijl je jezelf aanraakt 🎙️' },
  76: { type: 'red',    text: 'Volg mijn instructies 60 seconden — alles mag 🔥' },
  77: { type: 'snake',  text: 'Slang omlaag ↓ naar 63', destination: 63 },
  78: { type: 'red',    text: 'Laat je "bijna klaarkomend" gezicht zien 😍' },
  79: { type: 'blue',   text: 'Het mooiste wat je vandaag over mij geleerd hebt 💙' },
  80: { type: 'gold',   text: '🏆 FINISH — Je wint! Vraag het speciale filmpje van de ander (optioneel) 💛' },
};

export const SQUARE_COLORS = {
  blue:   { bg: '#0a1628', border: '#1e4d8c', text: '#60a5fa', label: 'Waarheid' },
  red:    { bg: '#1f0a0a', border: '#8b1a1a', text: '#f87171', label: 'Durven' },
  purple: { bg: '#150a2a', border: '#6b21a8', text: '#c084fc', label: 'Edging' },
  green:  { bg: '#0a1f0a', border: '#166534', text: '#4ade80', label: 'Kleding' },
  orange: { bg: '#1f1205', border: '#92400e', text: '#fb923c', label: 'Ladder ↑' },
  snake:  { bg: '#1f0505', border: '#7f1d1d', text: '#f87171', label: 'Slang ↓' },
  gold:   { bg: '#1f1a05', border: '#d4af37', text: '#fbbf24', label: 'FINISH' },
};

export const POWER_SWITCH_SQUARES = new Set([10, 20, 30, 40, 50, 60, 70]);
export const LADDERS = { 3: 19, 18: 37, 35: 54, 45: 66, 53: 72 };
export const SNAKES  = { 32: 12, 41: 23, 58: 38, 69: 48, 77: 63 };

// Build the 8×10 board grid (visual: top row = squares 71-80)
export function buildBoardGrid() {
  const grid = [];
  for (let row = 7; row >= 0; row--) {
    const rowSquares = [];
    for (let col = 0; col < 10; col++) {
      let squareNum;
      if (row % 2 === 0) {
        squareNum = row * 10 + col + 1;
      } else {
        squareNum = row * 10 + (9 - col) + 1;
      }
      rowSquares.push(squareNum);
    }
    grid.push(rowSquares);
  }
  return grid;
}
