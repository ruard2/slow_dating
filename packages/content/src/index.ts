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
    image: "/assets/kaart2-v6.webp",
    imageAspectRatio: 3764 / 6688,
  },
  {
    id: 3,
    slug: "samen-leven",
    name: "Samen Leven",
    description:
      "Ontdek hoe aandacht, zorg, geld, rust en liefde vorm krijgen in het gewone leven.",
    requiredDiscoveries: 10,
    priceCents: 300,
    image: "/assets/kaart3-samen-leven.png",
    imageAspectRatio: 941 / 1672,
  },
  {
    id: 4,
    slug: "botsen-zonder-breken",
    name: "Botsen zonder breken",
    description:
      "Onderzoek spanning, verschil en herstel zonder elkaar kwijt te raken.",
    requiredDiscoveries: 15,
    priceCents: 400,
    image: "/assets/kaart4-botsen-zonder-breken.png",
    imageAspectRatio: 941 / 1672,
  },
  {
    id: 5,
    slug: "samen-bouwen",
    name: "Samen bouwen",
    description:
      "Kies richting in toekomst, trouw, gezin, grenzen en gezamenlijke gewoontes.",
    requiredDiscoveries: 20,
    priceCents: 500,
    image: "/assets/kaart5-samen-bouwen.png",
    imageAspectRatio: 941 / 1672,
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
    legacyPath: null,
    modes: ["couple"],
    version: 1,
    status: "native",
    scoresDiscovery: true,
  },
  {
    id: "kennismaking",
    title: "Leer elkaar kennen",
    description: "Vragen en voorspellingen van licht naar persoonlijk.",
    legacyPath: null,
    modes: ["couple"],
    version: 1,
    status: "native",
    scoresDiscovery: true,
  },
  {
    id: "familiedorp",
    title: "Familiedorp",
    description: "Breng rollen, gewoonten en familieverhalen samen in beeld.",
    legacyPath: null,
    modes: ["couple"],
    version: 1,
    status: "native",
    scoresDiscovery: true,
  },
  {
    id: "kwaliteiten",
    title: "Jullie kwaliteiten",
    description: "Zie kracht, allergie en waardering door elkaars ogen.",
    legacyPath: null,
    modes: ["couple"],
    version: 2,
    status: "native",
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
    description:
      "Ontdek welke kleur jullie krijgen onder spanning en oefen hoe verschil zachter kan landen.",
    legacyPath: null,
    modes: ["couple"],
    version: 2,
    status: "native",
    scoresDiscovery: true,
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
    id: "vrolijke-open-plek",
    title: "Vrolijke Open Plek",
    description: "Speel, ontspan en ontdek wat jullie werkelijk lucht geeft.",
    legacyPath: null,
    modes: ["couple"],
    version: 1,
    status: "native",
    scoresDiscovery: true,
  },
  {
    id: "oude-eik",
    title: "Oude Eik",
    description:
      "Onderzoek met mildheid welke familieboodschappen, rollen en beschermingsreacties je meeneemt.",
    legacyPath: null,
    modes: ["couple"],
    version: 1,
    status: "native",
    scoresDiscovery: true,
  },
  {
    id: "spiegelvijver",
    title: "Onder de oppervlakte",
    description:
      "Leg je eigen zelfbeeld naast wat de ander werkelijk ziet, laag voor laag.",
    legacyPath: null,
    modes: ["couple"],
    version: 1,
    status: "native",
    scoresDiscovery: true,
  },
  {
    id: "grenzen-tempo",
    title: "Grenzen & tempo",
    description:
      "Ontdek hoe jullie nabijheid, tempo en een kleine nee zorgvuldig afstemmen.",
    legacyPath: null,
    modes: ["couple"],
    version: 1,
    status: "native",
    scoresDiscovery: true,
  },
  {
    id: "kruispunt-reacties",
    title: "Kruispunt van Reacties",
    description:
      "Kies onder tijdsdruk een reactie op grappige en spannende situaties en vergelijk jullie eerste impuls.",
    legacyPath: null,
    modes: ["couple"],
    version: 1,
    status: "native",
    scoresDiscovery: true,
  },
  {
    id: "huishoudtafel",
    title: "De Huishoudtafel",
    description: "Ontdek hoe jullie kijken naar taken, verantwoordelijkheid en mentale last.",
    legacyPath: null,
    modes: ["couple"],
    version: 2,
    status: "native",
    scoresDiscovery: true,
  },
  {
    id: "geldbrug",
    title: "De Geldbrug",
    description:
      "Onderzoek wat geld voor jullie betekent en hoe vertrouwen, vrijheid en verantwoordelijkheid samenkomen.",
    legacyPath: null,
    modes: ["couple"],
    version: 2,
    status: "native",
    scoresDiscovery: true,
  },
  {
    id: "winkelmandje",
    title: "Het Winkelmandje",
    description:
      "Kijk achter koopgedrag en ontdek welke behoefte, impuls of verwachting meespeelt.",
    legacyPath: null,
    modes: ["couple"],
    version: 2,
    status: "native",
    scoresDiscovery: true,
  },
  {
    id: "liefdestaal",
    title: "Liefdestaal of misverstand",
    description:
      "Vertaal hoe jullie liefde geven en ontvangen zonder er een rekensom van te maken.",
    legacyPath: null,
    modes: ["couple"],
    version: 2,
    status: "native",
    scoresDiscovery: true,
  },
  {
    id: "stressmeter",
    title: "De Stressmeter",
    description:
      "Vlieg een speels luchtduel en ontdek hoe jullie reageren als spanning oploopt.",
    legacyPath: null,
    modes: ["couple"],
    version: 3,
    status: "native",
    scoresDiscovery: true,
  },
  {
    id: "irritatiebingo",
    title: "Kleine-irritatiebingo",
    description:
      "Gebruik kleine ergernissen voor humor, zelfkennis en een gesprek zonder minachting.",
    legacyPath: null,
    modes: ["couple"],
    version: 1,
    status: "native",
    scoresDiscovery: true,
  },
  {
    id: "kleine-date",
    title: "Plan een kleine date",
    description:
      "Maak aandacht concreet met een haalbare ontmoeting die bij jullie allebei past.",
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
  {
    id: "dramadriehoek",
    title: "De Dramadriehoek",
    description:
      "Herken hoe slachtoffer, redder en aanklager je uit volwassen verantwoordelijkheid trekken.",
    legacyPath: null,
    modes: ["couple"],
    version: 2,
    status: "native",
    scoresDiscovery: true,
  },
  {
    id: "als-ik-bang-word",
    title: "Als ik bang word",
    description:
      "Ontdek welke beschermingsreacties opkomen wanneer spanning of afstand voelbaar wordt.",
    legacyPath: null,
    modes: ["couple"],
    version: 1,
    status: "planned",
    scoresDiscovery: false,
  },
  {
    id: "onze-ruzieroute",
    title: "Onze ruzieroute",
    description:
      "Teken samen waar conflict begint, versnelt en via welke afslag jullie terug kunnen.",
    legacyPath: null,
    modes: ["couple"],
    version: 2,
    status: "native",
    scoresDiscovery: true,
  },
  {
    id: "oude-knoppen-conflict",
    title: "Oude knoppen",
    description:
      "Onderzoek oude pijn, gevoelige knoppen, beschermingsreacties en herstelzinnen.",
    legacyPath: null,
    modes: ["couple"],
    version: 2,
    status: "native",
    scoresDiscovery: true,
  },
  {
    id: "wie-stuurt-het-stuur",
    title: "Wie stuurt het stuur?",
    description:
      "Onderzoek macht, gelijkwaardigheid en beslissingen zonder strijd om controle.",
    legacyPath: null,
    modes: ["couple"],
    version: 1,
    status: "planned",
    scoresDiscovery: false,
  },
  {
    id: "ruzie-reparatie-theater",
    title: "Ruzie-reparatie theater",
    description:
      "Oefen herstelzinnen luchtig en concreet, juist voordat het te zwaar wordt.",
    legacyPath: null,
    modes: ["couple"],
    version: 1,
    status: "planned",
    scoresDiscovery: false,
  },
  {
    id: "stoplichtgesprek",
    title: "Het stoplichtgesprek",
    description:
      "Voer een begeleid gesprek met rood, oranje en groen: stoppen, vertragen, doorgaan.",
    legacyPath: null,
    modes: ["couple"],
    version: 1,
    status: "planned",
    scoresDiscovery: false,
  },
  {
    id: "toekomsthuis",
    title: "Het Toekomsthuis",
    description:
      "Bouw samen een beeld van wonen, werk, rust, ritme en ruimte voor later.",
    legacyPath: null,
    modes: ["couple"],
    version: 1,
    status: "planned",
    scoresDiscovery: false,
  },
  {
    id: "wat-beloven-mensen",
    title: "Wat beloven mensen eigenlijk?",
    description:
      "Maak commitment concreet: wat bedoelen jullie met trouw, kiezen en blijven bouwen?",
    legacyPath: null,
    modes: ["couple"],
    version: 1,
    status: "planned",
    scoresDiscovery: false,
  },
  {
    id: "kinderen-gezin-opvoeding",
    title: "Kinderen, gezin en opvoeding",
    description:
      "Bespreek verlangens, grenzen, zorgen en verwachtingen rond gezin en opvoeding.",
    legacyPath: null,
    modes: ["couple"],
    version: 1,
    status: "planned",
    scoresDiscovery: false,
  },
  {
    id: "seksualiteit-trouw-grenzen",
    title: "Seksualiteit, trouw en digitale grenzen",
    description:
      "Verken nabijheid, veiligheid, verlangen en grenzen in een taal die eerlijk blijft.",
    legacyPath: null,
    modes: ["couple"],
    version: 1,
    status: "planned",
    scoresDiscovery: false,
  },
  {
    id: "waarschuwingslampjes",
    title: "Waarschuwingslampjes en eerlijke risico's",
    description:
      "Benoem signalen die aandacht vragen voordat ze groter worden dan nodig.",
    legacyPath: null,
    modes: ["couple"],
    version: 1,
    status: "planned",
    scoresDiscovery: false,
  },
  {
    id: "mini-tradities",
    title: "Onze mini-tradities",
    description:
      "Ontwerp kleine gewoontes die jullie relatie dragen zonder groot systeem.",
    legacyPath: null,
    modes: ["couple"],
    version: 1,
    status: "planned",
    scoresDiscovery: false,
  },
  {
    id: "de-kruising",
    title: "De Kruising",
    description:
      "Breng samen de eindkeuze in beeld: waar gaan jullie ja tegen zeggen?",
    legacyPath: null,
    modes: ["couple"],
    version: 1,
    status: "planned",
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
    position: { left: 11.4, top: 32.2, width: 21.5, height: 7.2 },
  },
  {
    worldId: 2,
    gameId: "stilteruisje",
    order: 2,
    position: { left: 4.2, top: 73.6, width: 18.2, height: 8.2 },
  },
  {
    worldId: 2,
    gameId: "vrolijke-open-plek",
    order: 3,
    position: { left: 3.8, top: 57.2, width: 18.2, height: 8.5 },
  },
  {
    worldId: 2,
    gameId: "oude-eik",
    order: 4,
    position: { left: 80, top: 37.7, width: 17.5, height: 8.2 },
  },
  {
    worldId: 2,
    gameId: "spiegelvijver",
    order: 5,
    position: { left: 38, top: 48.5, width: 24, height: 7 },
  },
  {
    worldId: 2,
    gameId: "grenzen-tempo",
    order: 6,
    position: { left: 78.5, top: 15.8, width: 18.5, height: 8.5 },
  },
  {
    worldId: 2,
    gameId: "kruispunt-reacties",
    order: 7,
    position: { left: 78.5, top: 62.4, width: 18.5, height: 6.8 },
  },
  {
    worldId: 3,
    gameId: "huishoudtafel",
    order: 1,
    position: { left: 69.2, top: 16.1, width: 25.2, height: 7.2 },
  },
  {
    worldId: 3,
    gameId: "geldbrug",
    order: 2,
    position: { left: 30.2, top: 29.6, width: 25.2, height: 7.1 },
  },
  {
    worldId: 3,
    gameId: "winkelmandje",
    order: 3,
    position: { left: 67.5, top: 32.1, width: 26, height: 7.3 },
  },
  {
    worldId: 3,
    gameId: "liefdestaal",
    order: 4,
    position: { left: 4.5, top: 45.8, width: 27.5, height: 7.7 },
  },
  {
    worldId: 3,
    gameId: "stressmeter",
    order: 5,
    position: { left: 69.3, top: 49.1, width: 25.7, height: 7.1 },
  },
  {
    worldId: 3,
    gameId: "irritatiebingo",
    order: 6,
    position: { left: 8.7, top: 62.6, width: 28.2, height: 7.3 },
  },
  {
    worldId: 3,
    gameId: "kleine-date",
    order: 7,
    position: { left: 61.6, top: 64.8, width: 28, height: 7.2 },
  },
  {
    worldId: 4,
    gameId: "dramadriehoek",
    order: 1,
    position: { left: 4.8, top: 70.2, width: 34.5, height: 10.2 },
  },
  {
    worldId: 4,
    gameId: "kleurkompas",
    order: 2,
    position: { left: 63.8, top: 61.2, width: 29.5, height: 9.2 },
  },
  {
    worldId: 4,
    gameId: "onze-ruzieroute",
    order: 3,
    position: { left: 23.8, top: 38.3, width: 34.8, height: 9 },
  },
  {
    worldId: 4,
    gameId: "oude-knoppen-conflict",
    order: 4,
    position: { left: 70.2, top: 35.4, width: 28.2, height: 10.6 },
  },
  {
    worldId: 4,
    gameId: "wie-stuurt-het-stuur",
    order: 5,
    position: { left: 9.5, top: 15.3, width: 35.6, height: 9.4 },
  },
  {
    worldId: 4,
    gameId: "ruzie-reparatie-theater",
    order: 6,
    position: { left: 56.2, top: 16.7, width: 36, height: 9.4 },
  },
  {
    worldId: 4,
    gameId: "stoplichtgesprek",
    order: 7,
    position: { left: 32.8, top: 3.4, width: 34.5, height: 8.6 },
  },
  {
    worldId: 5,
    gameId: "toekomsthuis",
    order: 1,
    position: { left: 3.8, top: 69.2, width: 35.5, height: 9.8 },
  },
  {
    worldId: 5,
    gameId: "wat-beloven-mensen",
    order: 2,
    position: { left: 75.8, top: 62.7, width: 20.7, height: 7.5 },
  },
  {
    worldId: 5,
    gameId: "kinderen-gezin-opvoeding",
    order: 3,
    position: { left: 4, top: 41.6, width: 26.8, height: 7.8 },
  },
  {
    worldId: 5,
    gameId: "seksualiteit-trouw-grenzen",
    order: 4,
    position: { left: 74.2, top: 40.8, width: 22.5, height: 7.6 },
  },
  {
    worldId: 5,
    gameId: "waarschuwingslampjes",
    order: 5,
    position: { left: 2.2, top: 16.4, width: 31.5, height: 8.2 },
  },
  {
    worldId: 5,
    gameId: "mini-tradities",
    order: 6,
    position: { left: 72.8, top: 17.6, width: 25.2, height: 7.7 },
  },
  {
    worldId: 5,
    gameId: "de-kruising",
    order: 7,
    position: { left: 37.2, top: 8, width: 28.2, height: 7.5 },
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

/** Aantal discovery-spellen dat per landschap meetelt voor de nabijheidsgroei. */
export const GAMES_PER_WORLD = 5;

/** Interne groeilijnen onder de ene zichtbare nabijheidsbalk. */
export type GrowthLine = "kennis" | "vertrouwen" | "zorg" | "richting";

const GROWTH_LINE_BY_GAME: Record<string, GrowthLine> = {
  waarden: "richting",
  "lach-samen": "kennis",
  kennismaking: "kennis",
  familiedorp: "kennis",
  kwaliteiten: "vertrouwen",
  "stille-vijver": "vertrouwen",
  "brug-ontdekking": "kennis",
  kernkwadranten: "vertrouwen",
  stilteruisje: "zorg",
  "vrolijke-open-plek": "kennis",
  "oude-eik": "vertrouwen",
  spiegelvijver: "vertrouwen",
  "grenzen-tempo": "zorg",
  "kruispunt-reacties": "vertrouwen",
  huishoudtafel: "zorg",
  geldbrug: "richting",
  winkelmandje: "richting",
  liefdestaal: "zorg",
  stressmeter: "vertrouwen",
  irritatiebingo: "zorg",
  "kleine-date": "kennis",
  kleurkompas: "vertrouwen",
  "oude-knoppen-conflict": "vertrouwen",
  "onze-ruzieroute": "vertrouwen",
  dramadriehoek: "vertrouwen",
};

/** Welke interne groeilijn een spel voedt. Onbekend → 'kennis'. */
export function growthLineForGame(gameId: string): GrowthLine {
  return GROWTH_LINE_BY_GAME[gameId] ?? "kennis";
}

/** Het landschap (wereld-id) waar een spel geplaatst is, of undefined. */
export function worldIdForGame(gameId: string) {
  return gamePlacements.find((placement) => placement.gameId === gameId)
    ?.worldId;
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
