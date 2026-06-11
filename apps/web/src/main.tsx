import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";

import "@slow-dating/ui/tokens.css";

import { App } from "./App";
import { CallProvider } from "./providers/CallProvider";
import { RealtimeProvider } from "./providers/RealtimeProvider";
import { SessionProvider } from "./providers/SessionProvider";
import "./styles/global.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 30_000,
    },
  },
});

const root = document.getElementById("root");

if (!root) {
  throw new Error("Root element ontbreekt");
}

createRoot(root).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <SessionProvider>
          <RealtimeProvider>
            <CallProvider>
              <App />
            </CallProvider>
          </RealtimeProvider>
        </SessionProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
);
