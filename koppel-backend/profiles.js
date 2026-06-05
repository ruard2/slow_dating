/**
 * profiles.js — Profile store
 * In-memory Map + JSON-file persistence.
 * Swap saveProfiles / loadProfiles voor PostgreSQL zodra login live gaat.
 */

const fs   = require('fs');
const path = require('path');

const PROFILES_FILE = path.join(__dirname, 'data', 'profiles.json');
const profiles = new Map(); // userId → profile object

// ── Persistence ────────────────────────────────────────────
function ensureDataDir() {
  const dir = path.join(__dirname, 'data');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function loadProfiles() {
  try {
    ensureDataDir();
    if (!fs.existsSync(PROFILES_FILE)) return;
    const data = JSON.parse(fs.readFileSync(PROFILES_FILE, 'utf8'));
    Object.entries(data).forEach(([k, v]) => profiles.set(k, v));
    console.log(`[profiles] Loaded ${profiles.size} profiles`);
  } catch (e) {
    console.warn('[profiles] Could not load profiles.json:', e.message);
  }
}

function saveProfiles() {
  try {
    ensureDataDir();
    const obj = {};
    profiles.forEach((v, k) => { obj[k] = v; });
    fs.writeFileSync(PROFILES_FILE, JSON.stringify(obj, null, 2));
  } catch (e) {
    console.warn('[profiles] Could not save profiles.json:', e.message);
  }
}

// Auto-save every 30 seconds
setInterval(saveProfiles, 30000);
// Save on exit
process.on('SIGTERM', saveProfiles);
process.on('SIGINT',  saveProfiles);

// ── Profile factory ───────────────────────────────────────
function createProfile(userId) {
  return {
    userId,
    createdAt:     new Date().toISOString(),
    lastSeen:      new Date().toISOString(),
    totalSessions: 0,
    // DISC data
    disc: {
      sessions:     [],   // [{date, scores, primary, secondary, feelingColor, stressColor}]
      primary:      null, // most consistent color
      secondary:    null,
      feelingColor: null,
      stressColor:  null,
      confidence:   0,    // 0-1: hoe consistent over sessies
    },
    // Kernkwadranten data
    kernkwadranten: {
      sessions:        [],  // [{date, topQualities, routesCompleted}]
      topQualities:    [],  // [{id, name, avgScore, count}] — geaggregeerd
      routesCompleted: 0,
    },
    // Geaggregeerde gedragsdimensies (0-10 schaal)
    traits: {
      directness:     null,  // Rood-component
      expressiveness: null,  // Geel-component
      steadiness:     null,  // Groen-component
      precision:      null,  // Blauw-component
    },
    // Patronen (afgeleid)
    patterns: {
      decisionStyle:     null,  // 'snel-intuïtief' | 'analytisch' | 'consensusgericht' | 'overwogen'
      conflictStyle:     null,  // 'direct' | 'vermijdend' | 'harmoniegericht' | 'rationeel'
      communicationStyle: null, // 'taakgericht' | 'relatiegericht' | 'feitelijk' | 'inspirerend'
      stressPattern:     null,  // beschrijving
    },
    // Herkende thema's uit vertaalmatrix, groeikaarten etc.
    recognizedThemas: [],  // bijv. ['Niet gehoord', 'Grenzen', 'Intimiteit']
    // Gegenereerde inzichten (tekst)
    insights: [],
    // Rapport (later gegenereerd)
    report: null,
    // Toekomstig: accountId na login
    accountId: null,
  };
}

// ── Core functions ─────────────────────────────────────────

function getOrCreate(userId) {
  if (!profiles.has(userId)) {
    profiles.set(userId, createProfile(userId));
  }
  const p = profiles.get(userId);
  p.lastSeen = new Date().toISOString();
  return p;
}

/**
 * updateDisc — verwerk een voltooide DISC-sessie
 * data: { scores: {R,G,Gr,B}, primary, secondary, feelingColor, stressColor }
 */
function updateDisc(userId, data) {
  const p = getOrCreate(userId);
  p.totalSessions++;

  const session = {
    date:        new Date().toISOString(),
    scores:      data.scores      || {},
    primary:     data.primary     || null,
    secondary:   data.secondary   || null,
    feelingColor: data.feelingColor || null,
    stressColor: data.stressColor  || null,
  };
  p.disc.sessions.push(session);

  // Herbereken primaire kleur (meest frequent over alle sessies)
  const colorCount = { R: 0, G: 0, Gr: 0, B: 0 };
  p.disc.sessions.forEach(s => { if (s.primary) colorCount[s.primary]++; });
  const sorted = Object.entries(colorCount).sort((a, b) => b[1] - a[1]);
  p.disc.primary   = sorted[0][0];
  p.disc.secondary = sorted[1][0];
  p.disc.confidence = sorted[0][1] / p.disc.sessions.length;

  // Meest recente feeling- en stresskleur
  if (data.feelingColor) p.disc.feelingColor = data.feelingColor;
  if (data.stressColor)  p.disc.stressColor  = data.stressColor;

  // Herbereken traits (gemiddelde scores over alle sessies genormaliseerd naar 0-10)
  const totals = { R: 0, G: 0, Gr: 0, B: 0 };
  let maxPossible = 0;
  p.disc.sessions.forEach(s => {
    if (s.scores) {
      Object.entries(s.scores).forEach(([c, v]) => { totals[c] += v; });
      maxPossible = Math.max(maxPossible, Object.values(s.scores).reduce((a,b) => a+b, 0));
    }
  });
  const n = p.disc.sessions.length;
  if (n > 0 && maxPossible > 0) {
    const normalize = (v) => Math.round((v / n / maxPossible) * 10 * 10) / 10;
    p.traits.directness     = normalize(totals.R);
    p.traits.expressiveness = normalize(totals.G);
    p.traits.steadiness     = normalize(totals.Gr);
    p.traits.precision      = normalize(totals.B);
  }

  // Afleiden van patronen
  p.patterns = derivePatterns(p);

  // Inzichten genereren
  p.insights = generateInsights(p);

  saveProfiles();
  return p;
}

/**
 * updateKernkwadranten — verwerk voltooide kernkwadranten-sessie
 * data: { topQualities: [{id, name, score}], routesCompleted }
 */
function updateKernkwadranten(userId, data) {
  const p = getOrCreate(userId);
  p.totalSessions++;

  const session = {
    date:            new Date().toISOString(),
    topQualities:    data.topQualities    || [],
    routesCompleted: data.routesCompleted || 0,
  };
  p.kernkwadranten.sessions.push(session);
  p.kernkwadranten.routesCompleted += session.routesCompleted;

  // Aggregeer kwaliteiten over alle sessies
  const qualMap = {};
  p.kernkwadranten.sessions.forEach(s => {
    (s.topQualities || []).forEach(q => {
      const key = q.id || q.name;
      if (!qualMap[key]) qualMap[key] = { id: key, name: q.name || key, totalScore: 0, count: 0 };
      qualMap[key].totalScore += (q.score || 1);
      qualMap[key].count++;
    });
  });
  p.kernkwadranten.topQualities = Object.values(qualMap)
    .map(q => ({ ...q, avgScore: Math.round(q.totalScore / q.count * 10) / 10 }))
    .sort((a, b) => b.avgScore - a.avgScore)
    .slice(0, 10);

  p.insights = generateInsights(p);
  saveProfiles();
  return p;
}

/**
 * updateWaarden — verwerk voltooide waarden-sessie
 * data: {
 *   gekozenZelf:       [{id, naam, cat}]  — zelf gekozen
 *   bevestigdVanPartner: [{id, naam, cat}] — van partner ontvangen + bevestigd
 *   modus: 'samen' | 'solo'
 * }
 */
function updateWaarden(userId, data) {
  const p = getOrCreate(userId);
  p.totalSessions++;

  // Initialiseer waarden-object als het nog niet bestaat
  if (!p.waarden) {
    p.waarden = {
      sessions:            [],
      topZelf:             [],  // [{id, naam, cat, count}] — meest consistent gekozen voor zichzelf
      topOntvangen:        [],  // [{id, naam, cat, count}] — meest bevestigd ontvangen van partner
      topCategorieenZelf:  {},  // {cat: count}
    };
  }

  const session = {
    date:               new Date().toISOString(),
    modus:              data.modus || 'samen',
    gekozenZelf:        data.gekozenZelf        || [],
    bevestigdVanPartner: data.bevestigdVanPartner || [],
  };
  p.waarden.sessions.push(session);

  // Aggregeer topZelf
  const zelfMap = {};
  p.waarden.sessions.forEach(s => {
    (s.gekozenZelf || []).forEach(w => {
      if (!zelfMap[w.id]) zelfMap[w.id] = { id: w.id, naam: w.naam, cat: w.cat, count: 0 };
      zelfMap[w.id].count++;
    });
  });
  p.waarden.topZelf = Object.values(zelfMap)
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // Aggregeer topOntvangen
  const ontvangenMap = {};
  p.waarden.sessions.forEach(s => {
    (s.bevestigdVanPartner || []).forEach(w => {
      if (!ontvangenMap[w.id]) ontvangenMap[w.id] = { id: w.id, naam: w.naam, cat: w.cat, count: 0 };
      ontvangenMap[w.id].count++;
    });
  });
  p.waarden.topOntvangen = Object.values(ontvangenMap)
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // Categorie-distributie (zelf)
  const catMap = {};
  p.waarden.topZelf.forEach(w => {
    catMap[w.cat] = (catMap[w.cat] || 0) + w.count;
  });
  p.waarden.topCategorieenZelf = catMap;

  p.insights = generateInsights(p);
  saveProfiles();
  return p;
}

/**
 * addRecognizedThema — wanneer iemand een vertaalmatrix-zin herkent of een groeikaart pakt
 */
function addRecognizedThema(userId, thema) {
  const p = getOrCreate(userId);
  if (!p.recognizedThemas.includes(thema)) {
    p.recognizedThemas.push(thema);
    p.insights = generateInsights(p);
    saveProfiles();
  }
  return p;
}

// ── Pattern deduction ──────────────────────────────────────
function derivePatterns(profile) {
  const t = profile.traits;
  if (!t.directness) return profile.patterns;

  const dominant = Object.entries({
    directness: t.directness,
    expressiveness: t.expressiveness,
    steadiness: t.steadiness,
    precision: t.precision,
  }).sort((a, b) => b[1] - a[1])[0][0];

  const styles = {
    directness:     { decision: 'snel en intuïtief',       conflict: 'direct en confronterend', communication: 'taakgericht en bondig',       stress: 'wordt korter, directer, mogelijk koud' },
    expressiveness: { decision: 'impulsief en op gevoel',  conflict: 'harmonie zoekend',        communication: 'inspirerend en persoonlijk',  stress: 'wordt chaotisch of overenthousiast' },
    steadiness:     { decision: 'consensusgericht',        conflict: 'vermijdend en innesluitend', communication: 'warm en ondersteunend',     stress: 'trekt zich terug, wordt koppig' },
    precision:      { decision: 'analytisch en overwogen', conflict: 'rationeel en afstandelijk', communication: 'feitelijk en gestructureerd', stress: 'wordt muggenzifterig of afwezig' },
  };

  const s = styles[dominant];
  return {
    decisionStyle:      s.decision,
    conflictStyle:      s.conflict,
    communicationStyle: s.communication,
    stressPattern:      s.stress,
  };
}

// ── Insight generation ─────────────────────────────────────
function generateInsights(profile) {
  const insights = [];
  const d = profile.disc;
  const kk = profile.kernkwadranten;
  const t = profile.traits;

  // DISC inzichten
  if (d.primary && d.confidence >= 0.6) {
    const colorNames = { R: 'Rood', G: 'Geel', Gr: 'Groen', B: 'Blauw' };
    insights.push(`Consistent ${colorNames[d.primary]} profiel (${Math.round(d.confidence * 100)}% consistentie over ${d.sessions.length} sessies).`);
  }

  if (d.primary && d.feelingColor && d.primary !== d.feelingColor) {
    const colorNames = { R: 'Rood', G: 'Geel', Gr: 'Groen', B: 'Blauw' };
    insights.push(`Jouw gedrag is ${colorNames[d.primary]}, maar je diepere behoefte is ${colorNames[d.feelingColor]}. Dit verschil is een sleutel tot zelfbegrip.`);
  }

  if (d.stressColor) {
    const colorNames = { R: 'Rood', G: 'Geel', Gr: 'Groen', B: 'Blauw' };
    insights.push(`Onder stress gedraag je je als ${colorNames[d.stressColor]}. Herken dit patroon als vroeg signaal.`);
  }

  // Kernkwadranten inzichten
  if (kk.topQualities.length >= 3) {
    const top3 = kk.topQualities.slice(0, 3).map(q => q.name).join(', ');
    insights.push(`Terugkerende kernkwaliteiten: ${top3}. Dit zijn jouw meest betrouwbare krachten.`);
  }

  if (kk.sessions.length >= 2) {
    insights.push(`Je hebt de kernkwadranten-quiz ${kk.sessions.length}x gedaan. Kwaliteiten die steeds terugkomen zijn het meest betrouwbaar.`);
  }

  // Trait-combinatie inzichten
  if (t.directness !== null && t.steadiness !== null) {
    const diff = Math.abs(t.directness - t.steadiness);
    if (diff > 4) {
      insights.push(t.directness > t.steadiness
        ? 'Je hebt een sterke voorkeur voor actie boven rust. Let op: mensen om je heen hebben soms meer tijd nodig.'
        : 'Je hebt een sterke voorkeur voor harmonie boven daadkracht. Let op: soms is directheid vriendelijker dan onduidelijkheid.');
    }
  }

  // Thema-inzichten
  const themas = profile.recognizedThemas;
  if (themas.length >= 3) {
    insights.push(`Terugkerende thema's voor jou: ${themas.slice(0, 4).join(', ')}. Dit zijn de gebieden waar communicatie voor jou het meest geladen is.`);
  }

  // Waarden-inzichten
  const w = profile.waarden;
  if (w && w.topZelf && w.topZelf.length >= 3) {
    const top3 = w.topZelf.slice(0, 3).map(v => v.naam).join(', ');
    insights.push(`Jouw meest gekozen persoonlijke waarden: ${top3}. Dit zijn de ankerpunten van wie jij wil zijn.`);
  }
  if (w && w.topOntvangen && w.topOntvangen.length >= 2) {
    const top2 = w.topOntvangen.slice(0, 2).map(v => v.naam).join(', ');
    insights.push(`Je partner herkende ${top2} in jou. Wat anderen in jou zien vertelt ook iets over wie je bent.`);
  }
  if (w && w.topZelf && w.topOntvangen) {
    const zelfIds = w.topZelf.map(v => v.id);
    const overlap = w.topOntvangen.filter(v => zelfIds.includes(v.id));
    if (overlap.length > 0) {
      insights.push(`${overlap.map(v=>v.naam).join(' en ')} kom${overlap.length===1?'t':'en'} zowel in jouw keuze als in die van je partner voor. Dit zijn jouw meest zichtbare waarden.`);
    }
  }

  return insights;
}

// ── Report generation ──────────────────────────────────────
function generateReport(userId) {
  const p = profiles.get(userId);
  if (!p) return null;

  const colorNames = { R: 'Rood', G: 'Geel', Gr: 'Groen', B: 'Blauw', null: 'Onbekend' };
  const d  = p.disc;
  const kk = p.kernkwadranten;
  const pt = p.patterns;

  const report = {
    generatedAt: new Date().toISOString(),
    userId,
    sections: {
      profiel: {
        titel: 'Jouw persoonlijkheidsprofiel',
        primaire_kleur: colorNames[d.primary] || 'nog niet bepaald',
        secundaire_kleur: colorNames[d.secondary] || 'nog niet bepaald',
        diepere_behoefte: colorNames[d.feelingColor] || 'nog niet bepaald',
        stresskleur: colorNames[d.stressColor] || 'nog niet bepaald',
        vertrouwen: d.confidence ? `${Math.round(d.confidence * 100)}%` : 'te weinig data',
        sessies: d.sessions.length,
      },
      kernkwaliteiten: {
        titel: 'Jouw kernkwaliteiten',
        top5: kk.topQualities.slice(0, 5),
        sessies: kk.sessions.length,
      },
      gedragsdimensies: {
        titel: 'Hoe jij functioneert',
        directheid:     p.traits.directness,
        expressiviteit: p.traits.expressiveness,
        stabiliteit:    p.traits.steadiness,
        precisie:       p.traits.precision,
      },
      patronen: {
        titel: 'Jouw stijlen',
        beslissingen:   pt.decisionStyle,
        conflict:       pt.conflictStyle,
        communicatie:   pt.communicationStyle,
        stress:         pt.stressPattern,
      },
      themas: {
        titel: 'Geladen thema\'s voor jou',
        lijst: p.recognizedThemas,
      },
      inzichten: {
        titel: 'Persoonlijke inzichten',
        lijst: p.insights,
      },
    },
    // Monetiseerbare samenvatting (voor export/verkoop)
    summary: buildSummary(p),
  };

  p.report = report;
  saveProfiles();
  return report;
}

function buildSummary(p) {
  const colorNames = { R: 'Rood', G: 'Geel', Gr: 'Groen', B: 'Blauw' };
  const d = p.disc;
  if (!d.primary) return 'Profiel nog niet volledig opgebouwd. Voltooi minimaal één sessie.';

  const primary   = colorNames[d.primary]   || d.primary;
  const secondary = colorNames[d.secondary] || d.secondary;
  const feeling   = colorNames[d.feelingColor] || '?';
  const topQ = p.kernkwadranten.topQualities.slice(0, 3).map(q => q.name).join(', ') || 'niet bepaald';

  return [
    `${primary}/${secondary} persoonlijkheidsprofiel`,
    `(${Math.round(d.confidence * 100)}% consistent over ${d.sessions.length} sessie${d.sessions.length !== 1 ? 's' : ''})`,
    `| Diepere behoefte: ${feeling}`,
    `| Kernkwaliteiten: ${topQ}`,
    `| Beslissingstijl: ${p.patterns.decisionStyle || 'n.v.t.'}`,
    `| ${p.insights.length} persoonlijke inzichten gegenereerd`,
  ].join(' ');
}

// ── Exports ────────────────────────────────────────────────
module.exports = {
  loadProfiles,
  saveProfiles,
  getOrCreate,
  updateDisc,
  updateKernkwadranten,
  updateWaarden,
  addRecognizedThema,
  generateReport,
  profiles, // for admin endpoint
};
