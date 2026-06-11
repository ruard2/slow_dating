import cors from "cors";
import express from "express";
import helmet from "helmet";

import { healthResponseSchema } from "@slow-dating/contracts";

export interface CreateAppOptions {
  webOrigin: string;
}

export function createApp({ webOrigin }: CreateAppOptions) {
  const app = express();

  app.disable("x-powered-by");
  app.use(helmet());
  app.use(
    cors({
      origin: webOrigin,
    }),
  );
  app.use(express.json({ limit: "100kb" }));

  app.get("/api/health", (_request, response) => {
    response.json(
      healthResponseSchema.parse({
        ok: true,
        service: "api",
        version: "0.1.0",
      }),
    );
  });

  return app;
}
