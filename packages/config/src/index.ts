import { z } from "zod";

const serverConfigSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().min(1).max(65_535).default(3000),
  WEB_ORIGIN: z.url().default("http://localhost:5173"),
  AUTH_SECRET: z.string().min(32).default("local-development-secret-change-before-production"),
  DATA_FILE: z.string().min(1).default("./data/local-store.json"),
  DATABASE_URL: z
    .string()
    .min(1)
    .default("postgresql://slowdating:slowdating@localhost:5432/slowdating"),
  STORAGE_DRIVER: z.enum(["local", "postgres"]).default("local"),
});

export type ServerConfig = z.infer<typeof serverConfigSchema>;

export function loadServerConfig(
  environment: Record<string, string | undefined>,
): ServerConfig {
  return serverConfigSchema.parse(environment);
}
