import type { Profile } from "@slow-dating/contracts";

// Gewichten uit het plan (§5A). Som = 1. Afstand is een filter, geen score.
export const OVERLAP_WEIGHTS = {
  values: 0.35,
  intention: 0.25,
  faith: 0.2,
  age: 0.1,
  lifeStage: 0.1,
} as const;

// "2–3 per week" (besloten): aantal kennismakingen per persoon per week.
export const WEEKLY_INVITATION_LIMIT = 3;
// Hoeveel kandidaten we tegelijk tonen om uit te kiezen (schaars, geen markt).
export const SUGGESTION_LIMIT = 6;
export const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

export interface OverlapResult {
  score: number;
  reasons: string[];
}

function ageOf(profile: Profile, nowYear: number): number | null {
  return profile.birthYear ? nowYear - profile.birthYear : null;
}

function jaccard(a: string[], b: string[]): number {
  if (!a.length || !b.length) return 0;
  const setB = new Set(b);
  const overlap = a.filter((item) => setB.has(item)).length;
  const union = new Set([...a, ...b]).size;
  return union ? overlap / union : 0;
}

function ageFit(candidateAge: number | null, min: number | null, max: number | null) {
  if (candidateAge === null) return 0.5; // onbekend = neutraal
  if (min === null && max === null) return 0.5;
  const okMin = min === null || candidateAge >= min;
  const okMax = max === null || candidateAge <= max;
  return okMin && okMax ? 1 : 0;
}

/**
 * Inhoudelijke overlap tussen twee profielen (0..1) plus leesbare redenen.
 * Gedeeld door beide repositories zodat de rangschikking identiek is.
 */
export function overlapScore(
  viewer: Profile,
  candidate: Profile,
  nowYear: number,
): OverlapResult {
  const reasons: string[] = [];

  const values = jaccard(viewer.coreValues, candidate.coreValues);
  if (values > 0) {
    const shared = viewer.coreValues.filter((value) =>
      candidate.coreValues.includes(value),
    );
    if (shared.length) reasons.push(`Gedeelde waarden: ${shared.join(", ")}`);
  }

  let intention = 0.4;
  if (viewer.relationIntention && candidate.relationIntention) {
    intention = viewer.relationIntention === candidate.relationIntention ? 1 : 0;
    if (intention === 1) reasons.push("Zoekt hetzelfde");
  }

  const faith = viewer.christianLayer === candidate.christianLayer ? 1 : 0.3;
  if (faith === 1 && viewer.christianLayer) {
    reasons.push("Deelt het geloofsspoor");
  }

  const viewerAge = ageOf(viewer, nowYear);
  const candidateAge = ageOf(candidate, nowYear);
  const age =
    (ageFit(candidateAge, viewer.prefAgeMin, viewer.prefAgeMax) +
      ageFit(viewerAge, candidate.prefAgeMin, candidate.prefAgeMax)) /
    2;
  if (age >= 0.9) reasons.push("Past qua leeftijdswens");

  let lifeStage = 0.5;
  if (viewer.lifeStage && candidate.lifeStage) {
    lifeStage = viewer.lifeStage === candidate.lifeStage ? 1 : 0.3;
    if (lifeStage === 1) reasons.push("Zelfde levensfase");
  }

  const score =
    OVERLAP_WEIGHTS.values * values +
    OVERLAP_WEIGHTS.intention * intention +
    OVERLAP_WEIGHTS.faith * faith +
    OVERLAP_WEIGHTS.age * age +
    OVERLAP_WEIGHTS.lifeStage * lifeStage;

  return { score: Math.round(score * 1000) / 1000, reasons };
}

/** Praktische afstand-filter. Zonder coördinaten (alleen woonplaats) laten we
 *  iedereen behalve jezelf door; dit is het haakje om later echte afstand
 *  (op basis van woonplaats/coördinaten + prefMaxDistanceKm) toe te voegen. */
export function withinDistance(viewer: Profile, candidate: Profile): boolean {
  return viewer.id !== candidate.id;
}
