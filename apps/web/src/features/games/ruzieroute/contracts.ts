import { z } from "zod";

export const triggerIdSchema = z.enum([
  "stilte",
  "toon",
  "kritiek",
  "planning",
  "geld",
  "familie",
  "tempo",
  "telefoon",
  "niet-gezien",
  "druk",
  "afwijzing",
  "alleen",
]);
export const innerIdSchema = z.enum([
  "verdriet",
  "angst",
  "schaamte",
  "eenzaam",
  "teleurstelling",
  "machteloos",
  "boosheid",
  "controle",
  "verdedigen",
  "kwijtraken",
  "niet-belangrijk",
  "oplossen",
]);
export const outerIdSchema = z.enum([
  "aandringen",
  "uitleggen",
  "fel",
  "controleren",
  "stilvallen",
  "terugtrekken",
  "kort",
  "vermijden",
  "pleasen",
  "te-snel-sorry",
  "grap",
  "bevriezen",
]);
export const interpretationIdSchema = z.enum([
  "niet-belangrijk",
  "wil-winnen",
  "laat-alleen",
  "niet-serieus",
  "te-veel",
  "keurt-af",
  "tegen-mij",
  "controleert",
  "sluit-hart",
  "gaat-weg",
  "schuld",
  "voelt-niets",
]);
export const needIdSchema = z.enum([
  "geruststelling",
  "erkenning",
  "ruimte",
  "nabijheid",
  "veiligheid",
  "duidelijkheid",
  "zachtheid",
  "serieus",
  "vrijheid",
  "blijven",
]);
export const endpointIdSchema = z.enum([
  "allebei-stil",
  "boos-stil",
  "veel-woorden",
  "snel-goedmaken",
  "vermijden",
  "afstand",
  "sorry-zonder-begrip",
  "oude-pijn",
  "moe",
  "contact-kwijt",
]);
export const accelerationIdSchema = z.enum([
  "toon",
  "wegloopt",
  "duwen",
  "oude-voorbeelden",
  "altijd-nooit",
  "laat-maar",
  "analyseert",
  "geloof-wapen",
  "sarcasme",
  "afsluit",
  "geen-terugkomtijd",
  "schaamte",
]);
export const exitIdSchema = z.enum([
  "bij-trigger",
  "spanning-voel",
  "voor-uitleggen",
  "voor-stilval",
  "oranje",
  "oude-pijn",
  "pauze",
  "twintig-minuten",
  "voor-slapen",
  "willen-winnen",
]);

export const ruzieroutePersonalSchema = z.object({
  triggerIds: z.array(triggerIdSchema).min(1).max(2),
  innerIds: z.array(innerIdSchema).min(1).max(3),
  outerIds: z.array(outerIdSchema).min(1).max(3),
  interpretationId: interpretationIdSchema,
  needIds: z.array(needIdSchema).min(1).max(2),
  hiddenMeaning: z.string().trim().min(1).max(420),
});

export const ruzierouteJointSchema = z.object({
  endpointId: endpointIdSchema,
  accelerationId: accelerationIdSchema,
  exitId: exitIdSchema,
  repairSentence: z.string().trim().min(1).max(240),
  miniContract: z.string().trim().min(1).max(320),
  routeName: z.string().trim().min(1).max(120),
  faithReflection: z.string().trim().max(600).optional(),
});

export const ruzierouteStateSchema = z.object({
  schemaVersion: z.literal(1),
  readyInstallationIds: z.array(z.string()).default([]),
  introSeenIds: z.array(z.string()).default([]),
  personals: z.record(z.string(), ruzieroutePersonalSchema).default({}),
  joint: ruzierouteJointSchema.nullable().default(null),
});

export const ruzierouteActionSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("ruzieroute.intro.seen"),
    actorId: z.string(),
  }),
  z.object({
    type: z.literal("ruzieroute.personal.submitted"),
    actorId: z.string(),
    personal: ruzieroutePersonalSchema,
  }),
  z.object({
    type: z.literal("ruzieroute.joint.submitted"),
    actorId: z.string(),
    joint: ruzierouteJointSchema,
  }),
  z.object({
    type: z.literal("ruzieroute.game.completed"),
    actorId: z.string(),
  }),
]);

export type RuzieroutePersonal = z.infer<typeof ruzieroutePersonalSchema>;
export type RuzierouteJoint = z.infer<typeof ruzierouteJointSchema>;
export type RuzierouteState = z.infer<typeof ruzierouteStateSchema>;
export type RuzierouteAction = z.infer<typeof ruzierouteActionSchema>;
