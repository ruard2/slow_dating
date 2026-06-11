import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

import type { GuestSession } from "@slow-dating/contracts";

import { startGuestSession } from "../lib/api";

interface SessionContextValue {
  session: GuestSession | null;
  error: string | null;
}

const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<GuestSession | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void startGuestSession().then(setSession).catch((cause: unknown) => {
      setError(cause instanceof Error ? cause.message : "Starten is mislukt.");
    });
  }, []);

  return (
    <SessionContext.Provider value={{ session, error }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const value = useContext(SessionContext);
  if (!value) {
    throw new Error("useSession moet binnen SessionProvider worden gebruikt.");
  }
  return value;
}
