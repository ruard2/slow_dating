import {
  GAMES_PER_WORLD,
  growthLineForGame,
  worldIdForGame,
} from "@slow-dating/content";
import type { WorldProgress } from "@slow-dating/contracts";

const WORLDS = [1, 2, 3, 4, 5];

// Hoeveel een lopend (nog niet afgerond) spel maximaal mag bijdragen aan de
// nabijheidsgroei. Een groeilijn (5 spellen per landschap) wordt pas echt
// gepasseerd als spellen daadwerkelijk afgerond zijn — niet door tussentijdse
// acties alleen.
const MAX_IN_PROGRESS_PER_GAME = 0.9;
// Elke betekenisvolle actie in een lopend spel (≈ één revisie-stap) schuift de
// poppetjes een klein stukje op. Zo voelt de balk fijnmazig i.p.v. sprongsgewijs.
const STEP_PER_ACTION = 0.12;

export interface ActiveRunProgress {
  gameId: string;
  revision: number;
}

export type CoreProgress = Pick<
  WorldProgress,
  "completedGames" | "eligibleWorlds" | "nabijheid"
>;

/**
 * Pure berekening van nabijheidsgroei + landschap-toegang, gedeeld door de
 * lokale en de Prisma-repository zodat ze identiek blijven.
 *
 * Regels (besloten):
 * - Per landschap tellen maximaal {@link GAMES_PER_WORLD} afgeronde
 *   discovery-spellen mee; een 6e/7e spel op dezelfde kaart telt niet extra.
 * - Een landschap N+1 opent pas als landschap N zijn volle quotum heeft.
 * - De poppetjes bewegen fijnmazig: elk afgerond spel is een vaste stap, en
 *   lopende spellen schuiven alvast een klein stukje op (gemaximeerd, zodat een
 *   groeilijn pas bij echte voltooiing wordt gepasseerd).
 * - Bij volledige route (alle 5 landschappen vol) ontmoeten ze elkaar (1.0).
 */
export function computeCoreProgress(
  completedDiscoveryGameIds: string[],
  activeRuns: ActiveRunProgress[],
): CoreProgress {
  const completedSet = new Set(completedDiscoveryGameIds);

  const completedByWorld = new Map<number, Set<string>>();
  for (const gameId of completedSet) {
    const world = worldIdForGame(gameId);
    if (!world) continue;
    const set = completedByWorld.get(world) ?? new Set<string>();
    set.add(gameId);
    completedByWorld.set(world, set);
  }
  const completedCount = (world: number) =>
    Math.min(GAMES_PER_WORLD, completedByWorld.get(world)?.size ?? 0);

  // Lopende, nog niet afgeronde spellen: één slot per spel, bijdrage o.b.v. acties.
  const inProgressByWorld = new Map<number, number>();
  const seen = new Set<string>();
  for (const run of activeRuns) {
    if (completedSet.has(run.gameId) || seen.has(run.gameId)) continue;
    seen.add(run.gameId);
    const world = worldIdForGame(run.gameId);
    if (!world) continue;
    const contribution = Math.min(
      MAX_IN_PROGRESS_PER_GAME,
      Math.max(0, run.revision) * STEP_PER_ACTION,
    );
    inProgressByWorld.set(
      world,
      (inProgressByWorld.get(world) ?? 0) + contribution,
    );
  }

  // Sequentieel: hoeveel landschappen zijn volledig (= groeilijnen gepasseerd).
  let milestonesReached = 0;
  for (const world of WORLDS) {
    if (completedCount(world) >= GAMES_PER_WORLD) milestonesReached += 1;
    else break;
  }

  const currentWorld = milestonesReached + 1;
  let currentFraction = 0;
  if (currentWorld <= WORLDS.length) {
    const base = completedCount(currentWorld);
    const inProgress = inProgressByWorld.get(currentWorld) ?? 0;
    // Nooit via tussentijdse acties de volgende groeilijn bereiken.
    const slot = Math.min(base + inProgress, GAMES_PER_WORLD - 0.1);
    currentFraction = slot / GAMES_PER_WORLD;
  }

  const fraction = Math.min(
    1,
    (milestonesReached + currentFraction) / WORLDS.length,
  );

  const eligibleWorlds = WORLDS.filter(
    (world) => world === 1 || milestonesReached >= world - 1,
  );

  const lines = { kennis: 0, vertrouwen: 0, zorg: 0, richting: 0 };
  for (const gameId of completedSet) {
    lines[growthLineForGame(gameId)] += 1;
  }

  return {
    completedGames: completedSet.size,
    eligibleWorlds,
    nabijheid: { fraction, growthLines: 9, lines },
  };
}
