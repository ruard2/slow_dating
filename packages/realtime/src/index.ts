import { io, type Socket } from "socket.io-client";

export interface CreateRealtimeClientOptions {
  accessToken?: string;
  url: string;
}

export function createRealtimeClient({
  accessToken,
  url,
}: CreateRealtimeClientOptions): Socket {
  return io(url, {
    ...(accessToken
      ? {
          auth: {
            accessToken,
          },
        }
      : {}),
    autoConnect: false,
    reconnection: true,
    transports: ["polling", "websocket"],
  });
}
