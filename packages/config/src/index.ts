import { z } from "zod";

const serverConfigSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().min(1).max(65_535).default(3000),
  WEB_ORIGIN: z.url().default("http://localhost:5173"),
});

export type ServerConfig = z.infer<typeof serverConfigSchema>;

export function loadServerConfig(
  environment: Record<string, string | undefined>,
): ServerConfig {
  return serverConfigSchema.parse(environment);
}
