import type { NextFunction, Request, Response } from "express";
import { SignJWT, jwtVerify } from "jose";

import type { AppRepository } from "./domain.js";
import { hashInstallationSecret } from "./localRepository.js";

const TOKEN_LIFETIME_SECONDS = 60 * 60;

export interface AuthenticatedRequest extends Request {
  installationId: string;
}

export function createAuth(secret: string, repository: AppRepository) {
  const key = new TextEncoder().encode(secret);

  async function createGuestSession(installationSecret: string) {
    const installation = await repository.findOrCreateInstallation(
      hashInstallationSecret(installationSecret),
    );
    const expiresAt = new Date(
      Date.now() + TOKEN_LIFETIME_SECONDS * 1_000,
    ).toISOString();
    const accessToken = await new SignJWT({
      installationId: installation.id,
      kind: "installation",
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime(`${TOKEN_LIFETIME_SECONDS}s`)
      .setSubject(installation.id)
      .sign(key);
    return {
      accessToken,
      expiresAt,
      installationId: installation.id,
      profile: await repository.getProfile(installation.id),
    };
  }

  async function verifyToken(token: string) {
    const { payload } = await jwtVerify(token, key, {
      algorithms: ["HS256"],
    });
    if (
      payload.kind !== "installation" ||
      typeof payload.installationId !== "string"
    ) {
      throw new Error("Ongeldig installatietoken.");
    }
    return payload.installationId;
  }

  async function requireAuth(
    request: Request,
    response: Response,
    next: NextFunction,
  ) {
    try {
      const authorization = request.header("authorization");
      if (!authorization?.startsWith("Bearer ")) {
        response.status(401).json({ error: "Authenticatie vereist." });
        return;
      }
      (request as AuthenticatedRequest).installationId = await verifyToken(
        authorization.slice(7),
      );
      next();
    } catch {
      response.status(401).json({ error: "Sessie verlopen of ongeldig." });
    }
  }

  return {
    createGuestSession,
    requireAuth,
    verifyToken,
  };
}
