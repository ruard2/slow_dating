import type { NextFunction, Request, Response } from "express";
import {
  createHash,
  randomBytes,
  scrypt as scryptCallback,
  timingSafeEqual,
} from "node:crypto";
import { promisify } from "node:util";
import { SignJWT, jwtVerify } from "jose";

import type { Account } from "@slow-dating/contracts";

import { DomainError, type AppRepository } from "./domain.js";
import { hashInstallationSecret } from "./localRepository.js";

const ACCESS_TOKEN_LIFETIME_SECONDS = 15 * 60;
const REFRESH_TOKEN_LIFETIME_SECONDS = 30 * 24 * 60 * 60;
const scrypt = promisify(scryptCallback);

export interface AuthenticatedRequest extends Request {
  installationId: string;
}

function publicAccount(account: {
  id: string;
  email: string;
  emailVerified: boolean;
  createdAt: string;
}): Account {
  return {
    id: account.id,
    email: account.email,
    emailVerified: account.emailVerified,
    createdAt: account.createdAt,
  };
}

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export async function hashPassword(password: string) {
  const salt = randomBytes(16);
  const derived = (await scrypt(password, salt, 64)) as Buffer;
  return `scrypt:${salt.toString("base64")}:${derived.toString("base64")}`;
}

async function verifyPassword(password: string, stored: string) {
  const [algorithm, saltEncoded, hashEncoded] = stored.split(":");
  if (algorithm !== "scrypt" || !saltEncoded || !hashEncoded) {
    return false;
  }
  const expected = Buffer.from(hashEncoded, "base64");
  const actual = (await scrypt(
    password,
    Buffer.from(saltEncoded, "base64"),
    expected.length,
  )) as Buffer;
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

export function createAuth(secret: string, repository: AppRepository) {
  const key = new TextEncoder().encode(secret);

  async function createAccessSession(installationId: string) {
    const account = await repository.getAccountForInstallation(installationId);
    const expiresAt = new Date(
      Date.now() + ACCESS_TOKEN_LIFETIME_SECONDS * 1_000,
    ).toISOString();
    const accessToken = await new SignJWT({
      installationId,
      kind: "installation",
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime(`${ACCESS_TOKEN_LIFETIME_SECONDS}s`)
      .setSubject(installationId)
      .sign(key);
    return {
      accessToken,
      expiresAt,
      installationId,
      profile: await repository.getProfile(installationId),
      account: account ? publicAccount(account) : null,
    };
  }

  async function issueRefreshToken(accountId: string) {
    const token = randomBytes(48).toString("base64url");
    await repository.createAuthToken(
      accountId,
      "refresh",
      hashToken(token),
      new Date(
        Date.now() + REFRESH_TOKEN_LIFETIME_SECONDS * 1_000,
      ).toISOString(),
    );
    return token;
  }

  async function createGuestSession(installationSecret: string) {
    const installation = await repository.findOrCreateInstallation(
      hashInstallationSecret(installationSecret),
    );
    return createAccessSession(installation.id);
  }

  async function register(
    installationId: string,
    input: { email: string; password: string; displayName: string },
  ) {
    const account = await repository.createAccount(
      installationId,
      input.email,
      await hashPassword(input.password),
      input.displayName,
    );
    const verificationToken = randomBytes(32).toString("base64url");
    await repository.createAuthToken(
      account.id,
      "verify_email",
      hashToken(verificationToken),
      new Date(Date.now() + 24 * 60 * 60 * 1_000).toISOString(),
    );
    await repository.queueMail(account.email, "verify_email", verificationToken);
    return {
      session: await createAccessSession(account.primaryInstallationId),
      refreshToken: await issueRefreshToken(account.id),
    };
  }

  async function login(email: string, password: string) {
    const account = await repository.findAccountByEmail(email);
    if (!account || !(await verifyPassword(password, account.passwordHash))) {
      throw new DomainError("Ongeldige inloggegevens.", 401);
    }
    return {
      session: await createAccessSession(account.primaryInstallationId),
      refreshToken: await issueRefreshToken(account.id),
    };
  }

  async function refresh(refreshToken: string) {
    const token = await repository.consumeAuthToken(
      "refresh",
      hashToken(refreshToken),
    );
    if (!token) {
      throw new DomainError("Sessie verlopen of ongeldig.", 401);
    }
    const account = await repository.getAccount(token.accountId);
    return {
      session: await createAccessSession(account.primaryInstallationId),
      refreshToken: await issueRefreshToken(account.id),
    };
  }

  async function verifyEmail(tokenValue: string) {
    const token = await repository.consumeAuthToken(
      "verify_email",
      hashToken(tokenValue),
    );
    if (!token) {
      throw new DomainError("Verificatielink is verlopen of al gebruikt.", 400);
    }
    await repository.markEmailVerified(token.accountId);
    const account = await repository.getAccount(token.accountId);
    return createAccessSession(account.primaryInstallationId);
  }

  async function requestPasswordReset(email: string) {
    const account = await repository.findAccountByEmail(email);
    if (!account) {
      return;
    }
    const resetToken = randomBytes(32).toString("base64url");
    await repository.createAuthToken(
      account.id,
      "password_reset",
      hashToken(resetToken),
      new Date(Date.now() + 60 * 60 * 1_000).toISOString(),
    );
    await repository.queueMail(account.email, "password_reset", resetToken);
  }

  async function resetPassword(tokenValue: string, password: string) {
    const token = await repository.consumeAuthToken(
      "password_reset",
      hashToken(tokenValue),
    );
    if (!token) {
      throw new DomainError("Herstellink is verlopen of al gebruikt.", 400);
    }
    await repository.updateAccountPassword(
      token.accountId,
      await hashPassword(password),
    );
  }

  async function logout(refreshToken: string | undefined) {
    if (!refreshToken) {
      return;
    }
    await repository.consumeAuthToken("refresh", hashToken(refreshToken));
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
    login,
    logout,
    refresh,
    register,
    requestPasswordReset,
    resetPassword,
    requireAuth,
    verifyEmail,
    verifyToken,
  };
}
