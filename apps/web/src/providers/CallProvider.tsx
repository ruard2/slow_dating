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

import { api } from "../lib/api";
import { useRealtime } from "./RealtimeProvider";

type CallStatus = "idle" | "calling" | "ringing" | "connecting" | "active";

interface CallContextValue {
  status: CallStatus;
  start(): Promise<void>;
  accept(): Promise<void>;
  decline(): void;
  hangup(): void;
}

interface CallSignal {
  signalType: "offer" | "answer" | "ice" | "hangup" | "request" | "accept" | "decline";
  data?: unknown;
}

const CallContext = createContext<CallContextValue | null>(null);

export function CallProvider({ children }: { children: ReactNode }) {
  const { lastEvent, send } = useRealtime();
  const [status, setStatus] = useState<CallStatus>("idle");
  const connectionRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const remoteAudioRef = useRef<HTMLAudioElement | null>(null);
  const callIdRef = useRef<string | null>(null);

  const trackCall = useCallback(
    (type: string, payload: Record<string, unknown> = {}) => {
      void api.recordActivity({
        clientEventId: crypto.randomUUID(),
        category: "call",
        type,
        payload: {
          callId: callIdRef.current,
          ...payload,
        },
      });
    },
    [],
  );

  const sendSignal = useCallback(
    (signalType: CallSignal["signalType"], data?: unknown) => {
      send("call.signal", { signalType, data });
    },
    [send],
  );

  const ensureMedia = useCallback(async () => {
    if (!localStreamRef.current) {
      localStreamRef.current = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });
    }
    return localStreamRef.current;
  }, []);

  const ensureConnection = useCallback(async () => {
    if (connectionRef.current) {
      return connectionRef.current;
    }
    const connection = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });
    const stream = await ensureMedia();
    stream.getTracks().forEach((track) => connection.addTrack(track, stream));
    connection.onicecandidate = ({ candidate }) => {
      if (candidate) {
        sendSignal("ice", candidate.toJSON());
      }
    };
    connection.ontrack = ({ streams }) => {
      if (remoteAudioRef.current) {
        remoteAudioRef.current.srcObject = streams[0] ?? null;
        void remoteAudioRef.current.play();
      }
      setStatus("active");
      trackCall("call.connected");
    };
    connectionRef.current = connection;
    return connection;
  }, [ensureMedia, sendSignal, trackCall]);

  const cleanup = useCallback(() => {
    connectionRef.current?.close();
    connectionRef.current = null;
    localStreamRef.current?.getTracks().forEach((track) => track.stop());
    localStreamRef.current = null;
    if (remoteAudioRef.current) {
      remoteAudioRef.current.srcObject = null;
    }
    setStatus("idle");
  }, []);

  useEffect(() => {
    if (lastEvent?.type !== "call.signal") {
      return;
    }
    const signal = lastEvent.payload as CallSignal;
    void (async () => {
      if (signal.signalType === "request") {
        callIdRef.current = lastEvent.id;
        setStatus("ringing");
        trackCall("call.received");
      } else if (signal.signalType === "accept") {
        setStatus("connecting");
        const connection = await ensureConnection();
        const offer = await connection.createOffer();
        await connection.setLocalDescription(offer);
        sendSignal("offer", offer);
      } else if (signal.signalType === "offer") {
        setStatus("connecting");
        const connection = await ensureConnection();
        await connection.setRemoteDescription(
          signal.data as RTCSessionDescriptionInit,
        );
        const answer = await connection.createAnswer();
        await connection.setLocalDescription(answer);
        sendSignal("answer", answer);
      } else if (signal.signalType === "answer") {
        await connectionRef.current?.setRemoteDescription(
          signal.data as RTCSessionDescriptionInit,
        );
      } else if (signal.signalType === "ice" && signal.data) {
        await connectionRef.current?.addIceCandidate(
          signal.data as RTCIceCandidateInit,
        );
      } else if (
        signal.signalType === "hangup" ||
        signal.signalType === "decline"
      ) {
        trackCall(
          signal.signalType === "decline" ? "call.declined_remote" : "call.ended_remote",
        );
        cleanup();
      }
    })().catch(() => cleanup());
  }, [cleanup, ensureConnection, lastEvent, sendSignal, trackCall]);

  const value = useMemo<CallContextValue>(
    () => ({
      status,
      async start() {
        await ensureMedia();
        callIdRef.current = crypto.randomUUID();
        setStatus("calling");
        trackCall("call.requested");
        sendSignal("request");
      },
      async accept() {
        await ensureMedia();
        setStatus("connecting");
        trackCall("call.accepted");
        sendSignal("accept");
      },
      decline() {
        trackCall("call.declined");
        sendSignal("decline");
        cleanup();
      },
      hangup() {
        trackCall("call.ended");
        sendSignal("hangup");
        cleanup();
      },
    }),
    [cleanup, ensureMedia, sendSignal, status, trackCall],
  );

  return (
    <CallContext.Provider value={value}>
      {children}
      <audio ref={remoteAudioRef} autoPlay />
    </CallContext.Provider>
  );
}

export function useCall() {
  const value = useContext(CallContext);
  if (!value) {
    throw new Error("useCall moet binnen CallProvider worden gebruikt.");
  }
  return value;
}
