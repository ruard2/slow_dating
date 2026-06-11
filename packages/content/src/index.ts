import { z } from "zod";
export { waitingGames, waitingGameSchema, type WaitingGame } from "./waitingGames.js";

export const gameMetadataSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  legacyPath: z.string().min(1),
  modes: z.array(z.literal("couple")).length(1),
  version: z.number().int().positive(),
  position: z.object({
    left: z.number().min(0).max(100),
    top: z.number().min(0).max(100),
    width: z.number().positive().max(100),
    height: z.number().positive().max(100),
  }),
  status: z.enum(["native", "adapted"]),
});

export type GameMetadata = z.infer<typeof gameMetadataSchema>;

export interface WorldDefinition {
  id: number;
  name: string;
  description: string;
  requiredDiscoveries: number;
  priceCents: number;
  image: string;
}

export const worlds: WorldDefinition[] = [
  { id: 1, name: "Het Beginland", description: "De eerste ontdekkingen over wie jullie zijn.", requiredDiscoveries: 0, priceCents: 0, image: "/assets/kaart1.webp" },
  { id: 2, name: "Verdieping", description: "Jullie ontdekken elkaar steeds dieper.", requiredDiscoveries: 5, priceCents: 200, image: "/assets/kaart2.webp" },
  { id: 3, name: "Verbinding", description: "Herken patronen en bouw bewuster aan verbinding.", requiredDiscoveries: 10, priceCents: 300, image: "/assets/kaart3.webp" },
  { id: 4, name: "Intimiteit", description: "Maak ruimte voor nabijheid, grenzen en vertrouwen.", requiredDiscoveries: 15, priceCents: 400, image: "/assets/kaart4.webp" },
  { id: 5, name: "Ziel", description: "Onderzoek wat jullie ten diepste samenbrengt.", requiredDiscoveries: 20, priceCents: 500, image: "/assets/kaart5.webp" },
];

export const games = [
  {
    id: "waarden",
    title: "Je waarden",
    description: "Ontdek wat voor jou echt telt en waar waarden kunnen botsen.",
    legacyPath: "waarden.html",
    modes: ["couple"],
    version: 1,
    position: { left: 80, top: 19.6, width: 15.2, height: 7.3 },
    status: "adapted",
  },
  {
    id: "lach-samen",
    title: "Lach samen",
    description: "Speelse keuzes om elkaar met luchtigheid beter te leren kennen.",
    legacyPath: "lach_samen.html",
    modes: ["couple"],
    version: 1,
    position: { left: 17.1, top: 33.8, width: 15.3, height: 7.8 },
    status: "adapted",
  },
  {
    id: "kennismaking",
    title: "Leer elkaar kennen",
    description: "Vragen en voorspellingen van licht naar persoonlijk.",
    legacyPath: "kennismaking.html",
    modes: ["couple"],
    version: 1,
    position: { left: 10.7, top: 44.9, width: 20, height: 6.7 },
    status: "adapted",
  },
  {
    id: "familiedorp",
    title: "Familiedorp",
    description: "Breng rollen, gewoonten en familieverhalen samen in beeld.",
    legacyPath: "familiedorp.html",
    modes: ["couple"],
    version: 1,
    position: { left: 77.3, top: 44.2, width: 19.2, height: 7.5 },
    status: "adapted",
  },
  {
    id: "kwaliteiten",
    title: "Jullie kwaliteiten",
    description: "Zie kracht, allergie en waardering door elkaars ogen.",
    legacyPath: "kwaliteiten.html",
    modes: ["couple"],
    version: 1,
    position: { left: 76.9, top: 57.7, width: 19.7, height: 6.8 },
    status: "adapted",
  },
  {
    id: "stille-vijver",
    title: "Stille vijver",
    description: "Vertraag, kijk en voer een aandachtig gesprek.",
    legacyPath: "stille_vijver.html",
    modes: ["couple"],
    version: 1,
    position: { left: 14.6, top: 70.4, width: 18.3, height: 7.4 },
    status: "adapted",
  },
  {
    id: "brug-ontdekking",
    title: "Brug van ontdekking",
    description: "Vertel persoonlijke verhalen aan de hand van herinneringsstenen.",
    legacyPath: "brug_ontdekking.html",
    modes: ["couple"],
    version: 1,
    position: { left: 71.7, top: 72.8, width: 22, height: 7.3 },
    status: "adapted",
  },
  {
    id: "grot",
    title: "De grot",
    description: "Verdiep relationele patronen met begeleide casussen.",
    legacyPath: "grot.html",
    modes: ["couple"],
    version: 1,
    position: { left: 43, top: 83, width: 14, height: 6 },
    status: "adapted",
  },
  {
    id: "kleurkompas",
    title: "Kleurkompas",
    description: "Onderzoek communicatie, stress en samenwerking.",
    legacyPath: "kleurkompas.html",
    modes: ["couple"],
    version: 1,
    position: { left: 36, top: 57, width: 12, height: 6 },
    status: "adapted",
  },
  {
    id: "kernkwadranten",
    title: "Kernkwadranten",
    description: "Ontdek kwaliteit, valkuil, uitdaging en allergie.",
    legacyPath: "kernkwadranten.html",
    modes: ["couple"],
    version: 1,
    position: { left: 55, top: 35, width: 12, height: 6 },
    status: "adapted",
  },
  {
    id: "profiel",
    title: "Jouw profiel",
    description: "Bekijk de inzichten die over spellen heen zijn opgebouwd.",
    legacyPath: "profiel.html",
    modes: ["couple"],
    version: 1,
    position: { left: 44, top: 15, width: 12, height: 6 },
    status: "adapted",
  },
  {
    id: "relatiekaart",
    title: "Relatiekaart",
    description: "Breng gezamenlijke patronen, krachten en groeipunten samen.",
    legacyPath: "relatiekaart.html",
    modes: ["couple"],
    version: 1,
    position: { left: 44, top: 45, width: 12, height: 6 },
    status: "adapted",
  },
] satisfies GameMetadata[];

games.forEach((game) => gameMetadataSchema.parse(game));

export function findGame(gameId: string) {
  return games.find((game) => game.id === gameId);
}
