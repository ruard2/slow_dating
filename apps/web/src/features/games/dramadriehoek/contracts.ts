import { z } from "zod";

export const dramaRoleSchema = z.enum(["slachtoffer", "redder", "aanklager"]);
export const sceneIdSchema = z.enum([
  "partner-trekt-zich-terug",
  "kritiek-op-plan",
  "afspraak-vergeten",
  "vriend-klaagt",
  "moeder-teleurgesteld",
  "familie-mengt-zich",
  "collega-laat",
  "leiding-vraagt-extra",
  "appgroep-druk",
  "geen-reactie",
  "vrienden-ruzie",
  "grens-blijft-vragen",
]);
export const feelingIdSchema = z.enum([
  "niet-gezien",
  "verantwoordelijk",
  "schuldig",
  "machteloos",
  "boos",
  "gebruikt",
  "afwijzing",
  "druk",
  "schaamte",
  "oneerlijk",
]);
export const pullIdSchema = z.enum([
  "oplossen",
  "terugtrekken",
  "klagen",
  "aanvallen",
  "sussen",
  "overnemen",
  "uitleggen",
  "gelijk",
  "wegcijferen",
]);
export const gainIdSchema = z.enum([
  "niet-kiezen",
  "zorg-krijgen",
  "nodig-zijn",
  "controle",
  "moreel-helder",
  "kwetsbaar-niet-voelen",
  "schuldgevoel-kwijt",
  "geen-grens",
]);
export const costIdSchema = z.enum([
  "kracht-verlies",
  "afhankelijk",
  "moe",
  "ander-kleiner",
  "verbinding-verlies",
  "harder",
  "later-verwijtend",
  "passief",
]);
export const shiftIdSchema = z.enum([
  "redder-aanklager",
  "redder-slachtoffer",
  "slachtoffer-aanklager",
  "slachtoffer-redder",
  "aanklager-slachtoffer",
  "aanklager-redder",
]);

export const dramadriehoekProfileSchema = z.object({
  sceneIds: z.array(sceneIdSchema).min(1).max(1),
  feelingIds: z.array(feelingIdSchema).min(1).max(3),
  pullIds: z.array(pullIdSchema).min(1).max(3),
  sceneResponses: z
    .record(
      z.string(),
      z.object({
        feelingIds: z.array(feelingIdSchema).min(1).max(3),
        pullIds: z.array(pullIdSchema).min(1).max(3),
      }),
    )
    .default({}),
  role: dramaRoleSchema,
  roleSentence: z.string().trim().min(1).max(180),
  gainIds: z.array(gainIdSchema).min(1).max(3),
  costIds: z.array(costIdSchema).min(1).max(3),
  shiftId: shiftIdSchema,
  whatDateMayKnow: z.string().trim().min(1).max(500),
  faithReflection: z.string().trim().max(600).optional(),
});

export const dramadriehoekStateSchema = z.object({
  schemaVersion: z.literal(1),
  readyInstallationIds: z.array(z.string()).default([]),
  introSeenIds: z.array(z.string()).default([]),
  profiles: z.record(z.string(), dramadriehoekProfileSchema).default({}),
});

export const dramadriehoekActionSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("dramadriehoek.intro.seen"),
    actorId: z.string(),
  }),
  z.object({
    type: z.literal("dramadriehoek.profile.submitted"),
    actorId: z.string(),
    profile: dramadriehoekProfileSchema,
  }),
  z.object({
    type: z.literal("dramadriehoek.game.completed"),
    actorId: z.string(),
  }),
]);

export type DramadriehoekProfile = z.infer<typeof dramadriehoekProfileSchema>;
export type DramadriehoekState = z.infer<typeof dramadriehoekStateSchema>;
export type DramadriehoekAction = z.infer<typeof dramadriehoekActionSchema>;
