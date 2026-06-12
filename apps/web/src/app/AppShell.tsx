import { useCallback, useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { NavLink, useLocation } from "react-router-dom";

import type { Message } from "@slow-dating/contracts";

import styles from "../App.module.css";
import { AccountGate } from "../features/account/AccountPages";
import { CallPanel } from "../features/calls/CallPanel";
import { ChatPanel } from "../features/chat/ChatPanel";
import { SettingsPanel } from "../features/developer/SettingsPanel";
import { PairPanel } from "../features/pairing/PairPanel";
import { api } from "../lib/api";
import { useCall } from "../providers/CallProvider";
import { useRealtime } from "../providers/RealtimeProvider";
import { useSession } from "../providers/SessionProvider";
import { useAppStore } from "../store/appStore";
import { ShellIcon } from "./ShellIcon";
import { AppRoutes } from "./routes";

export function AppShell() {
  const { session } = useSession();
  const location = useLocation();
  const call = useCall();
  const { lastEvent, partnerOnline } = useRealtime();
  const queryClient = useQueryClient();
  const drawer = useAppStore((state) => state.drawer);
  const setDrawer = useAppStore((state) => state.setDrawer);
  const [developerPartnerPresent, setDeveloperPartnerPresent] = useState(
    () =>
      localStorage.getItem("slow-dating:developer-partner-present") !== "false",
  );
  const [developerPartnerArriving, setDeveloperPartnerArriving] =
    useState(false);
  const pair = useQuery({ queryKey: ["pair"], queryFn: api.getPair });
  const messages = useQuery<Message[]>({
    queryKey: ["messages", pair.data?.id],
    queryFn: api.getMessages,
    enabled: Boolean(pair.data?.members.length === 2),
  });
  const callAccess = useQuery({
    queryKey: ["call-access", pair.data?.id],
    queryFn: api.getCallAccess,
    enabled: Boolean(pair.data && pair.data.members.length === 2),
  });
  const readStorageKey = pair.data?.id
    ? `slow-dating:last-chat-read:${pair.data.id}`
    : "";
  const lastChatReadAt = readStorageKey
    ? localStorage.getItem(readStorageKey) ?? ""
    : "";
  const unreadCount =
    drawer === "chat"
      ? 0
      : (messages.data?.filter(
          (message) =>
            message.senderInstallationId !== session?.installationId &&
            (!lastChatReadAt || message.sentAt > lastChatReadAt),
        ).length ?? 0);
  const effectivePartnerOnline = pair.data?.developerMode
    ? developerPartnerPresent
    : partnerOnline;
  const callAllowed = Boolean(callAccess.data?.unlocked);
  const callActive = call.status !== "idle";
  const inGame = location.pathname.startsWith("/games/");

  useEffect(() => {
    if (lastEvent?.type !== "chat.message") return;
    const message = lastEvent.payload as Message;
    queryClient.setQueryData<Message[]>(
      ["messages", pair.data?.id],
      (current = []) =>
        current.some((item) => item.id === message.id)
          ? current
          : [...current, message],
    );
  }, [lastEvent, pair.data?.id, queryClient]);

  useEffect(() => {
    if (drawer !== "chat" || !messages.data?.length || !readStorageKey) return;
    const latest = messages.data.at(-1)?.sentAt ?? new Date().toISOString();
    localStorage.setItem(readStorageKey, latest);
  }, [drawer, messages.data, readStorageKey]);

  function toggleChat() {
    if (drawer === "chat") {
      setDrawer(null);
      return;
    }
    const latest = messages.data?.at(-1)?.sentAt ?? new Date().toISOString();
    if (readStorageKey) localStorage.setItem(readStorageKey, latest);
    setDrawer("chat");
  }

  function changeDeveloperPartnerPresence(present: boolean) {
    setDeveloperPartnerArriving(
      present &&
        !developerPartnerPresent &&
        location.pathname.startsWith("/games/"),
    );
    localStorage.setItem(
      "slow-dating:developer-partner-present",
      String(present),
    );
    setDeveloperPartnerPresent(present);
    void queryClient.invalidateQueries({ queryKey: ["active-game-run"] });
  }

  const completeDeveloperPartnerArrival = useCallback(
    () => setDeveloperPartnerArriving(false),
    [],
  );

  return (
    <div className={styles.app}>
      <AppRoutes
        developerPartnerArriving={developerPartnerArriving}
        developerPartnerPresent={developerPartnerPresent}
        onDeveloperPartnerArrivalComplete={completeDeveloperPartnerArrival}
        pair={pair.data}
      />

      {inGame && (
        <NavLink
          aria-label="Terug naar de kaart"
          className={styles.gameBackButton!}
          onClick={() => setDrawer(null)}
          to="/"
        >
          <ShellIcon name="back" />
        </NavLink>
      )}

      <nav aria-label="Vaste appbediening" className={styles.dock}>
        <button
          aria-label={`Chat openen${
            unreadCount ? `, ${unreadCount} ongelezen` : ""
          }`}
          data-active={drawer === "chat"}
          onClick={toggleChat}
          type="button"
        >
          <ShellIcon name="chat" />
          {unreadCount > 0 && (
            <span className={styles.unreadBadge}>
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </button>
        <button
          aria-label={
            callActive
              ? "Gesprek actief"
              : callAllowed
                ? effectivePartnerOnline
                  ? "Partner bellen"
                  : "Bellen toegestaan, partner offline"
                : "Bellen nog niet toegestaan"
          }
          data-active={drawer === "call"}
          data-call-state={
            callActive ? "active" : callAllowed ? "ready" : "locked"
          }
          onClick={() => setDrawer(drawer === "call" ? null : "call")}
          type="button"
        >
          <ShellIcon name={callAllowed ? "call" : "callLocked"} />
          {callActive && <span className={styles.callStatusDot} />}
        </button>
        <button
          aria-label="Opties openen"
          data-active={drawer === "settings" || drawer === "pair"}
          onClick={() =>
            setDrawer(drawer === "settings" ? null : "settings")
          }
          type="button"
        >
          <ShellIcon name="settings" />
        </button>
      </nav>

      {drawer && (
        <aside
          className={`${styles.drawer} ${
            drawer === "chat" ? styles.chatDrawer : ""
          }`}
        >
          <button
            className={styles.closeButton}
            onClick={() => setDrawer(null)}
            type="button"
          >
            Sluiten
          </button>
          {drawer === "pair" && <PairPanel pair={pair.data} />}
          {drawer === "chat" && (
            <ChatPanel
              pair={pair.data}
              partnerOnline={effectivePartnerOnline}
            />
          )}
          {drawer === "call" && <CallPanel pair={pair.data} />}
          {drawer === "settings" && (
            <SettingsPanel
              developerPartnerPresent={developerPartnerPresent}
              onDeveloperPartnerPresenceChange={
                changeDeveloperPartnerPresence
              }
              pair={pair.data}
              partnerOnline={effectivePartnerOnline}
            />
          )}
        </aside>
      )}

      {pair.data?.members.length === 2 &&
        !pair.data.developerMode &&
        !session?.account && <AccountGate />}
    </div>
  );
}
