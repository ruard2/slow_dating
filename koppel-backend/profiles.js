/**
 * profiles.js — Profile store
 * In-memory Map + JSON-file persistence.
 * Swap saveProfiles / loadProfiles voor PostgreSQL zodra login live gaat.
 *
 * Versie 2: Rijk profiel schema met tag-scoring systeem (v7.3 Build Bible)
 * - rondes: gespeelde casussen met antwoord-tags
 * - tagScores: geaggregeerde behoeften, beschermingen, patronen, gevoelige plekken
 * - relatiekaart: koppel-inzicht na voldoende rondes
 */

const fs   = require('fs');
const path = require('path');

const PROFILES_FILE = path.join(__dirname, 'data', 'profiles.json');
const profiles = new Map(); // userId => profile object

// ── Tag label map (NL) ─────────────────────────────────────
// Vertaalt interne tag-keys naar leesbare labels
// i18n-ready: vervang deze object voor EN/FR/etc.
const TAG_LABELS = {
  // Behoeften
  'needs.attention':      'Aandacht',
  'needs.closeness':      'Nabijheid',
  'needs.reassurance':    'Geruststelling',
  'needs.recognition':    'Erkenning',
  'needs.respect':        'Respect',
  'needs.safety':         'Veiligheid',
  'needs.freedom':        'Vrijheid',
  'needs.autonomy':       'Autonomie',
  'needs.appreciation':   'Waardering',
  'needs.connection':     'Verbinding',
  'needs.understanding':  'Begrepen worden',
  'needs.trust':          'Vertrouwen',
  'needs.stability':      'Stabiliteit',
  'needs.meaning':        'Zingeving',
  // Beschermingen
  'protections.withdraw':  'Terugtrekken',
  'protections.protest':   'Protest',
  'protections.perform':   'Presteren',
  'protections.control':   'Controle',
  'protections.avoid':     'Vermijden',
  'protections.humor':     'Humor als schild',
  'protections.overwork':  'Druk zijn',
  'protections.silence':   'Stilte',
  'protections.pleasing':  'Pleasen',
  'protections.analysis':  'Analyseren',
  // Gevoelige plekken
  'sensitive_points.not_seen':      'Niet gezien worden',
  'sensitive_points.not_important': 'Niet belangrijk zijn',
  'sensitive_points.rejection':     'Afwijzing',
  'sensitive_points.not_chosen':    'Niet gekozen worden',
  'sensitive_points.too_much':      'Te veel zijn',
  'sensitive_points.alone':         'Alleen staan',
  'sensitive_points.not_trusted':   'Niet vertrouwd worden',
  'sensitive_points.failure':       'Falen',
  'sensitive_points.loss_of_self':  'Jezelf verliezen',
  'sensitive_points.trapped':       'Vastzitten',
  // Patronen
  'patterns.pursue_withdraw':       'Najagen en terugtrekken',
  'patterns.control_freedom':       'Controle en vrijheid',
  'patterns.harmony_truth':         'Harmonie en eerlijkheid',
  'patterns.think_feel':            'Denken en voelen',
  'patterns.certainty_adventure':   'Zekerheid en avontuur',
  'patterns.give_receive':          'Geven en ontvangen',
  'patterns.strong_vulnerable':     'Sterk en kwetsbaar',
  'patterns.structure_spontaneous': 'Structuur en spontaniteit',
  // Vaardigheden
  'skills.asking_directly':         'Direct vragen',
  'skills.generous_interpretation': 'Welwillend interpreteren',
  'skills.emotional_regulation':    'Emotie reguleren',
  'skills.repair':                  'Herstellen',
  'skills.vulnerability':           'Kwetsbaarheid tonen',
  'skills.listening':               'Echt luisteren',
  'skills.boundaries':              'Grenzen stellen',
  // Centra (hoofd/hart/buik)
  'centers.head':   'Hoofd',
  'centers.heart':  'Hart',
  'centers.body':   'Buik',
};

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
process.on('SIGTERM', saveProfiles);
process.on('SIGINT',  saveProfiles);

// ── Profile factory ───────────────────────────────────────
function createProfile(userId) {
  return {
    userId,
    createdAt:     new Date().toISOString(),
    lastSeen:      new Date().toISOString(),
    totalSessions: 0,

    // ── DISC data ─────────────────────────────────────────
    disc: {
      sessions:     [],
      primary:      null,
      secondary:    null,
      feelingColor: null,
      stressColor:  null,
      confidence:   0,
    },

    // ── Kernkwadranten data ───────────────────────────────
    kernkwadranten: {
      sessions:        [],
      topQualities:    [],
      routesCompleted: 0,
    },

    // ── Waarden data ─────────────────────────────────────
    waarden: null,

    // ── Rondes (De Grot) ──────────────────────────────────
    // Elke ronde = een gespeelde casus
    rondes: [],
    // [{
    //   date, caseId, domain (D1..D15), caseType (positive/tension/deep),
    //   tags: {needs:{...}, protections:{...}, ...},
    //   modus: 'solo'|'samen',
    //   koppelCode: null|'ABCDEF'
    // }]

    // ── Tag scores (geaggregeerd uit alle rondes) ─────────
    tagScores: {
      needs:            {},
      protections:      {},
      sensitive_points: {},
      patterns:         {},
      skills:           {},
      centers:          {},
      domains:          {},
    },

    // ── Afgeleide top-lijsten ─────────────────────────────
    topBehoeften:        [],  // [{key, label, score}]
    topBeschermingen:    [],
    topGevoeligePlekken: [],
    topPatronen:         [],
    topSkills:           [],
    sterkeDomainen:      [],  // domeinen waar positieve/skill tags hoog zijn
    groeiDomainen:       [],  // domeinen waar tension/deep tags hoog zijn

    // Enneagram signalen (altijd als signalen, nooit als label)
    enneagramSignalen: {},

    // ── Gedragsdimensies (uit DISC) ───────────────────────
    traits: {
      directness:     null,
      expressiveness: null,
      steadiness:     null,
      precision:      null,
    },

    // ── Gedragspatronen (afgeleid) ────────────────────────
    patterns: {
      decisionStyle:      null,
      conflictStyle:      null,
      communicationStyle: null,
      stressPattern:      null,
    },

    // ── Herkende thema's ──────────────────────────────────
    recognizedThemas: [],

    // ── Inzichten ────────────────────────────────────────
    insights: [],

    // ── Rapport + account ─────────────────────────────────
    report:    null,
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
  // Migreer oude profielen die nog geen tagScores hebben
  if (!p.tagScores) {
    p.tagScores = { needs:{}, protections:{}, sensitive_points:{}, patterns:{}, skills:{}, centers:{}, domains:{} };
    p.topBehoeften = []; p.topBeschermingen = []; p.topGevoeligePlekken = [];
    p.topPatronen = []; p.topSkills = []; p.sterkeDomainen = []; p.groeiDomainen = [];
    p.rondes = p.rondes || [];
    p.enneagramSignalen = {};
  }
  return p;
}

// ── TAG SCORING ENGINE ─────────────────────────────────────
/**
 * updateTags — verwerk antwoord-tags na een gespeelde ronde
 *
 * data: {
 *   caseId:    'D1_TENSION_001',
 *   domain:    'D1',
 *   caseType:  'tension' | 'positive' | 'deep',
 *   tags:      { 'needs.attention': 2, 'protections.withdraw': 1, ... }
 *   modus:     'solo' | 'samen',
 *   koppelCode: null | 'ABCDEF'
 * }
 *
 * Case type multipliers (uit v7.3 Build Bible):
 *   positive → needs/skills: x1.5 | protections/sensitive_points: x0.8
 *   tension  → protections/patterns/sensitive_points: x1.5 | skills: x0.8
 *   deep     → sensitive_points/needs: x1.8 | skills: x0.6
 */
function updateTags(userId, data) {
  const p = getOrCreate(userId);

  const MULTIPLIERS = {
    positive: { needs: 1.5, skills: 1.5, protections: 0.8, sensitive_points: 0.8, patterns: 1.0, centers: 1.0 },
    tension:  { needs: 1.0, skills: 0.8, protections: 1.5, sensitive_points: 1.5, patterns: 1.5, centers: 1.0 },
    deep:     { needs: 1.8, skills: 0.6, protections: 1.2, sensitive_points: 1.8, patterns: 1.2, centers: 1.0 },
  };
  const mult = MULTIPLIERS[data.caseType] || MULTIPLIERS.tension;

  // Pas tags toe op tagScores
  Object.entries(data.tags || {}).forEach(([tagKey, rawScore]) => {
    const [category] = tagKey.split('.');
    if (!p.tagScores[category]) p.tagScores[category] = {};
    const weight = (mult[category] || 1.0) * rawScore;
    p.tagScores[category][tagKey] = (p.tagScores[category][tagKey] || 0) + weight;
  });

  // Domein tellen
  if (data.domain) {
    p.tagScores.domains[data.domain] = (p.tagScores.domains[data.domain] || 0) + 1;
  }

  // Ronde opslaan
  p.rondes.push({
    date:       new Date().toISOString(),
    caseId:     data.caseId,
    domain:     data.domain,
    caseType:   data.caseType,
    tags:       data.tags,
    modus:      data.modus || 'solo',
    koppelCode: data.koppelCode || null,
  });
  p.totalSessions++;

  // Herbereken top-lijsten
  recalcTopLists(p);

  // Herbereken domeinen
  recalcDomains(p);

  // Herbereken inzichten
  p.insights = generateInsights(p);

  saveProfiles();
  return p;
}

// ── Top-lijsten herberekenen ──────────────────────────────
function recalcTopLists(p) {
  const makeTop = (scoreObj, n = 5) =>
    Object.entries(scoreObj)
      .map(([key, score]) => ({
        key,
        label: TAG_LABELS[key] || key.split('.')[1] || key,
        score: Math.round(score * 10) / 10,
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, n);

  p.topBehoeften        = makeTop(p.tagScores.needs, 5);
  p.topBeschermingen    = makeTop(p.tagScores.protections, 5);
  p.topGevoeligePlekken = makeTop(p.tagScores.sensitive_points, 5);
  p.topPatronen         = makeTop(p.tagScores.patterns, 5);
  p.topSkills           = makeTop(p.tagScores.skills, 5);
}

// ── Domein sterkte vs groei ───────────────────────────────
function recalcDomains(p) {
  // Sterk domein: veel rondes met positieve cases in dat domein
  const positivePerDomain = {};
  const tensionPerDomain  = {};
  p.rondes.forEach(r => {
    if (!r.domain) return;
    if (r.caseType === 'positive') {
      positivePerDomain[r.domain] = (positivePerDomain[r.domain] || 0) + 1;
    } else {
      tensionPerDomain[r.domain] = (tensionPerDomain[r.domain] || 0) + 1;
    }
  });

  p.sterkeDomainen = Object.entries(positivePerDomain)
    .sort((a, b) => b[1] - a[1]).slice(0, 3).map(([d]) => d);
  p.groeiDomainen  = Object.entries(tensionPerDomain)
    .sort((a, b) => b[1] - a[1]).slice(0, 3).map(([d]) => d);
}

// ── DISC sessie opslaan ───────────────────────────────────
function updateDisc(userId, data) {
  const p = getOrCreate(userId);
  p.totalSessions++;

  const session = {
    date:         new Date().toISOString(),
    scores:       data.scores      || {},
    primary:      data.primary     || null,
    secondary:    data.secondary   || null,
    feelingColor: data.feelingColor || null,
    stressColor:  data.stressColor  || null,
  };
  p.disc.sessions.push(session);

  // Herbereken primaire kleur
  const colorCount = { R: 0, G: 0, Gr: 0, B: 0 };
  p.disc.sessions.forEach(s => { if (s.primary) colorCount[s.primary]++; });
  const sorted = Object.entries(colorCount).sort((a, b) => b[1] - a[1]);
  p.disc.primary    = sorted[0][0];
  p.disc.secondary  = sorted[1][0];
  p.disc.confidence = sorted[0][1] / p.disc.sessions.length;

  if (data.feelingColor) p.disc.feelingColor = data.feelingColor;
  if (data.stressColor)  p.disc.stressColor  = data.stressColor;

  // Traits
  const totals = { R: 0, G: 0, Gr: 0, B: 0 };
  let maxPossible = 0;
  p.disc.sessions.forEach(s => {
    if (s.scores) {
      Object.entries(s.scores).forEach(([c, v]) => { totals[c] += v; });
      maxPossible = Math.max(maxPossible, Object.values(s.scores).reduce((a, b) => a + b, 0));
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

  p.patterns = derivePatterns(p);
  p.insights = generateInsights(p);
  saveProfiles();
  return p;
}

// ── Kernkwadranten sessie opslaan ─────────────────────────
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

// ── Waarden sessie opslaan ────────────────────────────────
function updateWaarden(userId, data) {
  const p = getOrCreate(userId);
  p.totalSessions++;

  if (!p.waarden) {
    p.waarden = { sessions: [], topZelf: [], topOntvangen: [], topCategorieenZelf: {} };
  }

  const session = {
    date:                new Date().toISOString(),
    modus:               data.modus || 'samen',
    gekozenZelf:         data.gekozenZelf         || [],
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
  p.waarden.topZelf = Object.values(zelfMap).sort((a, b) => b.count - a.count).slice(0, 10);

  // Aggregeer topOntvangen
  const ontvangenMap = {};
  p.waarden.sessions.forEach(s => {
    (s.bevestigdVanPartner || []).forEach(w => {
      if (!ontvangenMap[w.id]) ontvangenMap[w.id] = { id: w.id, naam: w.naam, cat: w.cat, count: 0 };
      ontvangenMap[w.id].count++;
    });
  });
  p.waarden.topOntvangen = Object.values(ontvangenMap).sort((a, b) => b.count - a.count).slice(0, 10);

  p.insights = generateInsights(p);
  saveProfiles();
  return p;
}

// ── Thema herkenning ──────────────────────────────────────
function addRecognizedThema(userId, thema) {
  const p = getOrCreate(userId);
  if (!p.recognizedThemas.includes(thema)) {
    p.recognizedThemas.push(thema);
    p.insights = generateInsights(p);
    saveProfiles();
  }
  return p;
}

// ── RELATIEKAART ENGINE ────────────────────────────────────
/**
 * buildRelatiekaart — genereer koppel-inzicht voor twee gebruikers
 * Vereist: beide spelers hebben rondes gespeeld via dezelfde koppelCode
 *
 * Confidence levels (uit v7.1 score engine):
 *   low    = 5-7 rondes
 *   medium = 8-11 rondes
 *   high   = 12+ rondes
 */
function buildRelatiekaart(userIdA, userIdB) {
  const pA = profiles.get(userIdA);
  const pB = profiles.get(userIdB);
  if (!pA || !pB) return null;

  const rondesA = (pA.rondes || []).filter(r => r.modus === 'samen');
  const rondesB = (pB.rondes || []).filter(r => r.modus === 'samen');
  const rondeCount = Math.min(rondesA.length, rondesB.length);

  const confidence = rondeCount >= 12 ? 'high' : rondeCount >= 8 ? 'medium' : rondeCount >= 5 ? 'low' : 'insufficient';
  if (confidence === 'insufficient') {
    return { ok: false, message: 'Nog niet genoeg rondes gespeeld. Speel minimaal 5 rondes samen.' };
  }

  // Overlap: zelfde tag hoog bij beide
  const overlap = [];
  const allNeeds = new Set([
    ...Object.keys(pA.tagScores.needs),
    ...Object.keys(pB.tagScores.needs),
  ]);
  allNeeds.forEach(key => {
    const scoreA = pA.tagScores.needs[key] || 0;
    const scoreB = pB.tagScores.needs[key] || 0;
    if (scoreA >= 2 && scoreB >= 2) {
      overlap.push({ key, label: TAG_LABELS[key] || key, scoreA, scoreB });
    }
  });

  // Gap: A en B hebben verschillende topbehoefte
  const gaps = [];
  const topNeedA = pA.topBehoeften[0];
  const topNeedB = pB.topBehoeften[0];
  if (topNeedA && topNeedB && topNeedA.key !== topNeedB.key) {
    gaps.push({ labelA: topNeedA.label, labelB: topNeedB.label });
  }

  // Clash: bescherming van A raakt gevoelige plek van B
  const clashes = [];
  const protectionPatternMap = {
    'protections.withdraw':  'sensitive_points.alone',
    'protections.control':   'sensitive_points.trapped',
    'protections.silence':   'sensitive_points.not_seen',
    'protections.protest':   'sensitive_points.rejection',
    'protections.pleasing':  'sensitive_points.not_important',
  };
  Object.entries(protectionPatternMap).forEach(([protKey, sensKey]) => {
    const aProtects = (pA.tagScores.protections[protKey] || 0) >= 2;
    const bSensitive = (pB.tagScores.sensitive_points[sensKey] || 0) >= 1;
    if (aProtects && bSensitive) {
      clashes.push({ who: 'A', protects: TAG_LABELS[protKey], triggers: TAG_LABELS[sensKey] });
    }
    const bProtects = (pB.tagScores.protections[protKey] || 0) >= 2;
    const aSensitive = (pA.tagScores.sensitive_points[sensKey] || 0) >= 1;
    if (bProtects && aSensitive) {
      clashes.push({ who: 'B', protects: TAG_LABELS[protKey], triggers: TAG_LABELS[sensKey] });
    }
  });

  // Gedeelde sterke en groei-domeinen
  const sharedSterk  = pA.sterkeDomainen.filter(d => pB.sterkeDomainen.includes(d));
  const sharedGroei  = pA.groeiDomainen.filter(d => pB.groeiDomainen.includes(d));

  return {
    ok:           true,
    rondeCount,
    confidence,
    userIdA,
    userIdB,
    generatedAt:  new Date().toISOString(),
    overlap,      // gedeelde behoeften
    gaps,         // verschillende topbehoeften
    clashes,      // bescherming raakt gevoelige plek
    topBehoeftenA:        pA.topBehoeften.slice(0, 3),
    topBehoeftenB:        pB.topBehoeften.slice(0, 3),
    topBeschermingA:      pA.topBeschermingen[0] || null,
    topBeschermingB:      pB.topBeschermingen[0] || null,
    topGevoeligA:         pA.topGevoeligePlekken[0] || null,
    topGevoeligB:         pB.topGevoeligePlekken[0] || null,
    sharedSterkeDomeinen: sharedSterk,
    sharedGroeiDomeinen:  sharedGroei,
    experimenten:         buildExperimenten(pA, pB, clashes, overlap),
  };
}

// ── Experimenten genereren ────────────────────────────────
function buildExperimenten(pA, pB, clashes, overlap) {
  const experimenten = [];

  // Clash-experiment
  if (clashes.length > 0) {
    const c = clashes[0];
    experimenten.push(`Bespreek samen: "${c.protects}" is een bescherming. "${c.triggers}" is een gevoeligheid. Wat zit er onder?`);
  }

  // Overlap-experiment
  if (overlap.length > 0) {
    experimenten.push(`Jullie delen de behoefte aan ${overlap[0].label}. Vraag elkaar: wanneer voel jij dit het sterkst?`);
  }

  // Default experiment
  if (experimenten.length < 2) {
    experimenten.push('Kies deze week een moment van 10 minuten: een vertelt, de ander vat samen. Dan wisselen.');
  }

  return experimenten.slice(0, 3);
}

// ── Patronen afleiden (uit DISC) ──────────────────────────
function derivePatterns(profile) {
  const t = profile.traits;
  if (!t.directness) return profile.patterns;

  const dominant = Object.entries({
    directness:     t.directness,
    expressiveness: t.expressiveness,
    steadiness:     t.steadiness,
    precision:      t.precision,
  }).sort((a, b) => b[1] - a[1])[0][0];

  const styles = {
    directness:     { decision: 'snel en intuïtief',       conflict: 'direct en confronterend',   communication: 'taakgericht en bondig',        stress: 'wordt korter, directer, mogelijk koud' },
    expressiveness: { decision: 'impulsief en op gevoel',  conflict: 'harmonie zoekend',           communication: 'inspirerend en persoonlijk',   stress: 'wordt chaotisch of overenthousiast' },
    steadiness:     { decision: 'consensusgericht',        conflict: 'vermijdend en innesluitend', communication: 'warm en ondersteunend',         stress: 'trekt zich terug, wordt koppig' },
    precision:      { decision: 'analytisch en overwogen', conflict: 'rationeel en afstandelijk',  communication: 'feitelijk en gestructureerd',  stress: 'wordt muggenzifterig of afwezig' },
  };

  const s = styles[dominant];
  return { decisionStyle: s.decision, conflictStyle: s.conflict, communicationStyle: s.communication, stressPattern: s.stress };
}

// ── Insight generation ─────────────────────────────────────
function generateInsights(profile) {
  const insights = [];
  const d  = profile.disc;
  const kk = profile.kernkwadranten;
  const t  = profile.traits;

  // DISC
  if (d.primary && d.confidence >= 0.6) {
    const colorNames = { R: 'Rood', G: 'Geel', Gr: 'Groen', B: 'Blauw' };
    insights.push(`Consistent ${colorNames[d.primary]} profiel (${Math.round(d.confidence * 100)}% consistentie).`);
  }
  if (d.primary && d.feelingColor && d.primary !== d.feelingColor) {
    const colorNames = { R: 'Rood', G: 'Geel', Gr: 'Groen', B: 'Blauw' };
    insights.push(`Je gedrag is ${colorNames[d.primary]}, je diepere behoefte is ${colorNames[d.feelingColor]}. Dit verschil vertelt iets over jou.`);
  }

  // Kernkwadranten
  if (kk.topQualities.length >= 3) {
    const top3 = kk.topQualities.slice(0, 3).map(q => q.name).join(', ');
    insights.push(`Terugkerende kernkwaliteiten: ${top3}.`);
  }

  // Trait combinatie
  if (t.directness !== null && t.steadiness !== null) {
    const diff = Math.abs(t.directness - t.steadiness);
    if (diff > 4) {
      insights.push(t.directness > t.steadiness
        ? 'Je hebt een voorkeur voor actie boven rust. Mensen om je heen hebben soms meer tijd nodig.'
        : 'Je hebt een voorkeur voor harmonie boven daadkracht. Soms is directheid vriendelijker dan onduidelijkheid.');
    }
  }

  // Thema's
  if (profile.recognizedThemas.length >= 3) {
    insights.push(`Terugkerende thema\'s: ${profile.recognizedThemas.slice(0, 4).join(', ')}.`);
  }

  // Waarden
  const w = profile.waarden;
  if (w && w.topZelf && w.topZelf.length >= 3) {
    insights.push(`Jouw meest gekozen waarden: ${w.topZelf.slice(0, 3).map(v => v.naam).join(', ')}.`);
  }

  // Rondes-gebaseerde inzichten
  const topBehoefte = (profile.topBehoeften || [])[0];
  const topBescherming = (profile.topBeschermingen || [])[0];
  if (topBehoefte) {
    insights.push(`Je sterkste behoefte in relaties lijkt ${topBehoefte.label} te zijn.`);
  }
  if (topBescherming) {
    insights.push(`Je meest gebruikte bescherming is ${topBescherming.label}. Dit probeert iets waardevols te bewaken.`);
  }

  return insights;
}

// ── Report generation ──────────────────────────────────────
function generateReport(userId) {
  const p = profiles.get(userId);
  if (!p) return null;

  const colorNames = { R: 'Rood', G: 'Geel', Gr: 'Groen', B: 'Blauw' };
  const d  = p.disc;
  const kk = p.kernkwadranten;
  const pt = p.patterns;

  const report = {
    generatedAt: new Date().toISOString(),
    userId,
    rondeCount:  (p.rondes || []).length,
    sections: {
      profiel: {
        titel:            'Jouw persoonlijkheidsprofiel',
        primaire_kleur:   colorNames[d.primary]      || 'nog niet bepaald',
        secundaire_kleur: colorNames[d.secondary]    || 'nog niet bepaald',
        diepere_behoefte: colorNames[d.feelingColor] || 'nog niet bepaald',
        stresskleur:      colorNames[d.stressColor]  || 'nog niet bepaald',
        vertrouwen:       d.confidence ? `${Math.round(d.confidence * 100)}%` : 'te weinig data',
      },
      kernkwaliteiten: {
        titel: 'Jouw kernkwaliteiten',
        top5:  kk.topQualities.slice(0, 5),
      },
      behoeften: {
        titel: 'Wat jij nodig hebt in een relatie',
        top5:  p.topBehoeften,
      },
      beschermingen: {
        titel: 'Wat jij probeert te beschermen',
        top5:  p.topBeschermingen,
      },
      gevoeligePlekken: {
        titel: 'Gevoelige plekken',
        top5:  p.topGevoeligePlekken,
      },
      domeinen: {
        titel:  'Domeinen',
        sterk:  p.sterkeDomainen,
        groei:  p.groeiDomainen,
      },
      gedragsstijlen: {
        titel:          'Hoe jij functioneert',
        beslissingen:   pt.decisionStyle,
        conflict:       pt.conflictStyle,
        communicatie:   pt.communicationStyle,
        stress:         pt.stressPattern,
      },
      themas: {
        titel: 'Geladen thema\'s',
        lijst: p.recognizedThemas,
      },
      inzichten: {
        titel: 'Persoonlijke inzichten',
        lijst: p.insights,
      },
    },
    summary: buildSummary(p),
  };

  p.report = report;
  saveProfiles();
  return report;
}

function buildSummary(p) {
  const colorNames = { R: 'Rood', G: 'Geel', Gr: 'Groen', B: 'Blauw' };
  const d = p.disc;
  const parts = [];
  if (d.primary) parts.push(`${colorNames[d.primary]}${d.secondary ? '/' + colorNames[d.secondary] : ''} profiel`);
  if (p.topBehoeften && p.topBehoeften[0]) parts.push(`Behoefte: ${p.topBehoeften[0].label}`);
  if (p.topBeschermingen && p.topBeschermingen[0]) parts.push(`Bescherming: ${p.topBeschermingen[0].label}`);
  const rondeCount = (p.rondes || []).length;
  parts.push(`${rondeCount} ronde${rondeCount !== 1 ? 's' : ''} gespeeld`);
  return parts.join(' | ') || 'Profiel in opbouw.';
}

// ── Exports ────────────────────────────────────────────────
module.exports = {
  loadProfiles,
  saveProfiles,
  getOrCreate,
  updateDisc,
  updateKernkwadranten,
  updateWaarden,
  updateTags,
  addRecognizedThema,
  buildRelatiekaart,
  generateReport,
  profiles,
};
