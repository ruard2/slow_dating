import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { Socket } from "socket.io-client";
import { useQuery } from "@tanstack/react-query";

import type { RealtimeEvent } from "@slow-dating/contracts";
import { createRealtimeClient } from "@slow-dating/realtime";

import { api } from "../lib/api";
import { useSession } from "./SessionProvider";

interface RealtimeContextValue {
  connected: boolean;
  lastEvent: RealtimeEvent<unknown> | null;
  send(type: string, payload: unknown): void;
}

const RealtimeContext = createContext<RealtimeContextValue | null>(null);

export function RealtimeProvider({ children }: { children: ReactNode }) {
  const { session } = useSession();
  const pair = useQuery({
    queryKey: ["pair"],
    queryFn: api.getPair,
    enabled: Boolean(session),
  });
  const socketRef = useRef<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [lastEvent, setLastEvent] =
    useState<RealtimeEvent<unknown> | null>(null);

  useEffect(() => {
    if (!session) {
      return;
    }
    const client = createRealtimeClient({
      accessToken: session.accessToken,
      url: window.location.origin,
    });
    client.on("connect", () => setConnected(true));
    client.on("disconnect", () => setConnected(false));
    client.on("event", (event: RealtimeEvent<unknown>) => setLastEvent(event));
    socketRef.current = client;
    client.connect();
    return () => {
      client.disconnect();
      socketRef.current = null;
    };
  }, [pair.data?.id, session]);

  const send = useCallback(
    (type: string, payload: unknown) => {
      socketRef.current?.emit("event", {
        id: crypto.randomUUID(),
        type,
        version: 1,
        payload,
      });
    },
    [],
  );

  const value = useMemo(
    () => ({ connected, lastEvent, send }),
    [connected, lastEvent, send],
  );

  return (
    <RealtimeContext.Provider value={value}>
      {children}
    </RealtimeContext.Provider>
  );
}

export function useRealtime() {
  const value = useContext(RealtimeContext);
  if (!value) {
    throw new Error("useRealtime moet binnen RealtimeProvider worden gebruikt.");
  }
  return value;
}
