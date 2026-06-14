import { z } from "zod";

export {
  waitingGames,
  waitingGameSchema,
  type WaitingGame,
} from "./waitingGames.js";

export const hotspotPositionSchema = z.object({
  left: z.number().min(0).max(100),
  top: z.number().min(0).max(100),
  width: z.number().positive().max(100),
  height: z.number().positive().max(100),
});

export const worldDefinitionSchema = z.object({
  id: z.number().int().min(1).max(5),
  slug: z.string().min(1),
  name: z.string().min(1),
  description: z.string().min(1),
  requiredDiscoveries: z.number().int().nonnegative(),
  priceCents: z.number().int().nonnegative(),
  image: z.string().min(1),
  imageAspectRatio: z.number().positive(),
});

export const gameMetadataSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  legacyPath: z.string().min(1).nullable(),
  modes: z.array(z.literal("couple")).length(1),
  version: z.number().int().positive(),
  status: z.enum(["native", "legacy-adapter", "planned", "profile"]),
  scoresDiscovery: z.boolean(),
});

export const gamePlacementSchema = z.object({
  worldId: z.number().int().min(1).max(5),
  gameId: z.string().min(1),
  order: z.number().int().nonnegative(),
  position: hotspotPositionSchema,
});

export type WorldDefinition = z.infer<typeof worldDefinitionSchema>;
export type GameMetadata = z.infer<typeof gameMetadataSchema>;
export type GamePlacement = z.infer<typeof gamePlacementSchema>;

export const worlds: WorldDefinition[] = [
  {
    id: 1,
    slug: "beginland",
    name: "Het Beginland",
    description: "De eerste ontdekkingen over wie jullie zijn.",
    requiredDiscoveries: 0,
    priceCents: 0,
    image: "/assets/kaart1.webp",
    imageAspectRatio: 3764 / 6688,
  },
  {
    id: 2,
    slug: "verdieping",
    name: "Verdieping",
    description: "Jullie ontdekken elkaar steeds dieper.",
    requiredDiscoveries: 5,
    priceCents: 200,
    image: "/assets/kaart2.webp",
    imageAspectRatio: 4096 / 6140,
  },
  {
    id: 3,
    slug: "verbinding",
    name: "Verbinding",
    description: "Herken patronen en bouw bewuster aan verbinding.",
    requiredDiscoveries: 10,
    priceCents: 300,
    image: "/assets/kaart3.webp",
    imageAspectRatio: 3792 / 6636,
  },
  {
    id: 4,
    slug: "intimiteit",
    name: "Intimiteit",
    description: "Maak ruimte voor nabijheid, grenzen en vertrouwen.",
    requiredDiscoveries: 15,
    priceCents: 400,
    image: "/assets/kaart4.webp",
    imageAspectRatio: 4096 / 6144,
  },
  {
    id: 5,
    slug: "ziel",
    name: "Ziel",
    description: "Onderzoek wat jullie ten diepste samenbrengt.",
    requiredDiscoveries: 20,
    priceCents: 500,
    image: "/assets/kaart5.webp",
    imageAspectRatio: 4096 / 6144,
  },
];

export const games: GameMetadata[] = [
  {
    id: "waarden",
    title: "Je waarden",
    description: "Ontdek wat voor jou echt telt en waar waarden kunnen botsen.",
    legacyPath: null,
    modes: ["couple"],
    version: 2,
    status: "native",
    scoresDiscovery: true,
  },
  {
    id: "lach-samen",
    title: "Lach samen",
    description:
      "Speelse keuzes om elkaar met luchtigheid beter te leren kennen.",
    legacyPath: "lach_samen.html",
    modes: ["couple"],
    version: 1,
    status: "legacy-adapter",
    scoresDiscovery: true,
  },
  {
    id: "kennismaking",
    title: "Leer elkaar kennen",
    description: "Vragen en voorspellingen van licht naar persoonlijk.",
    legacyPath: "kennismaking.html",
    modes: ["couple"],
    version: 1,
    status: "legacy-adapter",
    scoresDiscovery: true,
  },
  {
    id: "familiedorp",
    title: "Familiedorp",
    description: "Breng rollen, gewoonten en familieverhalen samen in beeld.",
    legacyPath: "familiedorp.html",
    modes: ["couple"],
    version: 1,
    status: "legacy-adapter",
    scoresDiscovery: true,
  },
  {
    id: "kwaliteiten",
    title: "Jullie kwaliteiten",
    description: "Zie kracht, allergie en waardering door elkaars ogen.",
    legacyPath: "kwaliteiten.html",
    modes: ["couple"],
    version: 1,
    status: "legacy-adapter",
    scoresDiscovery: true,
  },
  {
    id: "stille-vijver",
    title: "Stille vijver",
    description: "Vertraag, kijk en voer een aandachtig gesprek.",
    legacyPath: "stille_vijver.html",
    modes: ["couple"],
    version: 1,
    status: "legacy-adapter",
    scoresDiscovery: true,
  },
  {
    id: "brug-ontdekking",
    title: "Brug van ontdekking",
    description:
      "Vertel persoonlijke verhalen aan de hand van herinneringsstenen.",
    legacyPath: "brug_ontdekking.html",
    modes: ["couple"],
    version: 1,
    status: "legacy-adapter",
    scoresDiscovery: true,
  },
  {
    id: "grot",
    title: "De grot",
    description: "Verdiep relationele patronen met begeleide casussen.",
    legacyPath: "grot.html",
    modes: ["couple"],
    version: 1,
    status: "planned",
    scoresDiscovery: false,
  },
  {
    id: "kleurkompas",
    title: "Kleurkompas",
    description: "Onderzoek communicatie, stress en samenwerking.",
    legacyPath: "kleurkompas.html",
    modes: ["couple"],
    version: 1,
    status: "planned",
    scoresDiscovery: false,
  },
  {
    id: "kernkwadranten",
    title: "Kernkwaliteitenhut",
    description: "Bouw persoonlijke kernkwadranten en leg ze naast elkaar.",
    legacyPath: null,
    modes: ["couple"],
    version: 2,
    status: "native",
    scoresDiscovery: true,
  },
  {
    id: "stilteruisje",
    title: "Stilteruisje",
    description: "Ontdek welke voorwaarden jou helpen om je werkelijk te openen.",
    legacyPath: null,
    modes: ["couple"],
    version: 1,
    status: "native",
    scoresDiscovery: true,
  },
  {
    id: "profiel",
    title: "Jouw profiel",
    description: "Bekijk de inzichten die over spellen heen zijn opgebouwd.",
    legacyPath: null,
    modes: ["couple"],
    version: 1,
    status: "profile",
    scoresDiscovery: false,
  },
  {
    id: "relatiekaart",
    title: "Relatiekaart",
    description:
      "Breng gezamenlijke patronen, krachten en groeipunten samen.",
    legacyPath: null,
    modes: ["couple"],
    version: 1,
    status: "profile",
    scoresDiscovery: false,
  },
];

export const gamePlacements: GamePlacement[] = [
  {
    worldId: 1,
    gameId: "waarden",
    order: 1,
    position: { left: 80, top: 19.6, width: 15.2, height: 7.3 },
  },
  {
    worldId: 1,
    gameId: "lach-samen",
    order: 2,
    position: { left: 17.1, top: 33.8, width: 15.3, height: 7.8 },
  },
  {
    worldId: 1,
    gameId: "kennismaking",
    order: 3,
    position: { left: 10.7, top: 44.9, width: 20, height: 6.7 },
  },
  {
    worldId: 1,
    gameId: "familiedorp",
    order: 4,
    position: { left: 77.3, top: 44.2, width: 19.2, height: 7.5 },
  },
  {
    worldId: 1,
    gameId: "kwaliteiten",
    order: 5,
    position: { left: 76.9, top: 57.7, width: 19.7, height: 6.8 },
  },
  {
    worldId: 1,
    gameId: "stille-vijver",
    order: 6,
    position: { left: 14.6, top: 70.4, width: 18.3, height: 7.4 },
  },
  {
    worldId: 1,
    gameId: "brug-ontdekking",
    order: 7,
    position: { left: 71.7, top: 72.8, width: 22, height: 7.3 },
  },
  {
    worldId: 2,
    gameId: "kernkwadranten",
    order: 1,
    position: { left: 11.5, top: 29.2, width: 27.5, height: 8.8 },
  },
  {
    worldId: 2,
    gameId: "stilteruisje",
    order: 2,
    position: { left: 3.7, top: 74.5, width: 23.5, height: 9.5 },
  },
];

worlds.forEach((world) => worldDefinitionSchema.parse(world));
games.forEach((game) => gameMetadataSchema.parse(game));
gamePlacements.forEach((placement) => {
  gamePlacementSchema.parse(placement);
  if (!worlds.some((world) => world.id === placement.worldId)) {
    throw new Error(`Onbekende wereld voor spelplaatsing: ${placement.worldId}`);
  }
  if (!games.some((game) => game.id === placement.gameId)) {
    throw new Error(`Onbekend spel voor plaatsing: ${placement.gameId}`);
  }
});

export function findWorld(worldId: number) {
  return worlds.find((world) => world.id === worldId);
}

export function findGame(gameId: string) {
  return games.find((game) => game.id === gameId);
}

export function findPlayableGame(gameId: string) {
  const game = findGame(gameId);
  return game &&
    (game.status === "native" || game.status === "legacy-adapter")
    ? game
    : undefined;
}

export function isDiscoveryGameId(gameId: string) {
  return Boolean(findGame(gameId)?.scoresDiscovery);
}

export function worldPathForGame(gameId: string) {
  const worldId = gamePlacements.find(
    (placement) => placement.gameId === gameId,
  )?.worldId;
  return worldId && worldId > 1 ? `/worlds/${worldId}` : "/";
}

export function getWorldPlacements(worldId: number) {
  return gamePlacements
    .filter((placement) => placement.worldId === worldId)
    .sort((left, right) => left.order - right.order)
    .flatMap((placement) => {
      const game = findGame(placement.gameId);
      return game ? [{ ...placement, game }] : [];
    });
}
