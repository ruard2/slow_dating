import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";
import {
  Navigate,
  NavLink,
  Route,
  Routes,
  useNavigate,
  useParams,
} from "react-router-dom";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import type { Message, Pair } from "@slow-dating/contracts";
import { findGame, games } from "@slow-dating/content";

import styles from "./App.module.css";
import { api } from "./lib/api";
import { useCall } from "./providers/CallProvider";
import { useRealtime } from "./providers/RealtimeProvider";
import { useSession } from "./providers/SessionProvider";
import { useAppStore } from "./store/appStore";

function LoadingScreen() {
  const { error } = useSession();
  return (
    <main className={styles.loading}>
      <span className={styles.logoMark}>SD</span>
      <h1>{error ?? "Jouw omgeving wordt klaargezet"}</h1>
    </main>
  );
}

function WorldPage() {
  return (
    <main className={styles.worldPage}>
      <header className={styles.worldIntro}>
        <span>Jullie reis</span>
        <h1>Slow Dating</h1>
        <p>Kies een plek. Neem de tijd. Ontdek iets nieuws in elkaar.</p>
      </header>
      <section className={styles.map} aria-label="Wereldkaart met spellen">
        <img src="/assets/kaart1.webp" alt="" />
        {games.slice(0, 7).map((game) => (
          <NavLink
            aria-label={game.title}
            className={styles.hotspot ?? ""}
            key={game.id}
            style={{
              left: `${game.position.left}%`,
              top: `${game.position.top}%`,
            }}
            to={`/games/${game.id}`}
          >
            <span>{game.title}</span>
          </NavLink>
        ))}
      </section>
      <section className={styles.library}>
        <h2>Alle ontdekkingen</h2>
        <div className={styles.gameGrid}>
          {games.map((game) => (
            <NavLink className={styles.gameCard ?? ""} key={game.id} to={`/games/${game.id}`}>
              <small>{game.modes.join(" + ")}</small>
              <strong>{game.title}</strong>
              <span>{game.description}</span>
            </NavLink>
          ))}
        </div>
      </section>
    </main>
  );
}

function GamePage({ pair }: { pair: Pair | null | undefined }) {
  const { gameId = "" } = useParams();
  const navigate = useNavigate();
  const frameRef = useRef<HTMLIFrameElement | null>(null);
  const { lastEvent, send } = useRealtime();
  const setDrawer = useAppStore((state) => state.setDrawer);
  const game = findGame(gameId);
  const [started, setStarted] = useState(false);
  const [mode, setMode] = useState<"solo" | "couple">(
    game?.modes.includes("couple") ? "couple" : "solo",
  );
  const createRun = useMutation({
    mutationFn: () => api.createGameRun(gameId, mode, game?.version ?? 1),
    onSuccess: () => setStarted(true),
  });

  useEffect(() => {
    if (lastEvent?.type !== "game.sync") {
      return;
    }
    const payload = lastEvent.payload as {
      gameRunId?: string;
      state?: unknown;
    };
    frameRef.current?.contentWindow?.postMessage(
      { type: "slow-dating:legacy-event", payload: payload.state },
      window.location.origin,
    );
  }, [lastEvent]);

  useEffect(() => {
    function receiveLegacyMessage(event: MessageEvent) {
      if (
        event.origin !== window.location.origin ||
        event.source !== frameRef.current?.contentWindow ||
        event.data?.source !== "slow-dating-legacy"
      ) {
        return;
      }
      const legacyEvent = String(event.data.legacyEvent ?? "");
      if (legacyEvent === "open_chat") {
        setDrawer("chat");
        return;
      }
      if (legacyEvent === "open_call") {
        setDrawer("call");
        return;
      }
      if (legacyEvent === "open_pair") {
        setDrawer("pair");
        return;
      }
      if (createRun.data) {
        send("game.sync", {
          gameRunId: createRun.data.id,
          state: {
            legacyEvent,
            data: event.data.data ?? {},
          },
        });
      }
    }
    window.addEventListener("message", receiveLegacyMessage);
    return () => window.removeEventListener("message", receiveLegacyMessage);
  }, [createRun.data, send, setDrawer]);

  if (!game) {
    return <Navigate replace to="/" />;
  }

  if (!started) {
    const coupleUnavailable = mode === "couple" && pair?.members.length !== 2;
    return (
      <main className={styles.gameWelcome}>
        <button className={styles.backButton} onClick={() => navigate("/")} type="button">
          Terug naar de kaart
        </button>
        <div className={styles.gameWelcomeCard}>
          <span>Ontdekking</span>
          <h1>{game.title}</h1>
          <p>{game.description}</p>
          <div className={styles.modeSwitch}>
            {game.modes.map((availableMode) => (
              <button
                className={mode === availableMode ? styles.selectedMode : ""}
                key={availableMode}
                onClick={() => setMode(availableMode)}
                type="button"
              >
                {availableMode === "solo" ? "Alleen" : "Samen"}
              </button>
            ))}
          </div>
          {coupleUnavailable && (
            <p className={styles.notice}>Koppel eerst met je partner om samen te spelen.</p>
          )}
          <button
            className={styles.primaryButton}
            disabled={coupleUnavailable || createRun.isPending}
            onClick={() => createRun.mutate()}
            type="button"
          >
            {createRun.isPending ? "Spel starten..." : "Begin"}
          </button>
          {createRun.error && <p className={styles.error}>{createRun.error.message}</p>}
        </div>
      </main>
    );
  }

  return (
    <main className={styles.gameFramePage}>
      <div className={styles.gameFrameHeader}>
        <button onClick={() => navigate("/")} type="button">Kaart</button>
        <strong>{game.title}</strong>
        <span>{mode === "couple" ? "Samen" : "Solo"}</span>
      </div>
      <iframe
        className={styles.gameFrame}
        ref={frameRef}
        src={`/legacy/${
          mode === "solo" && game.soloLegacyPath
            ? game.soloLegacyPath
            : game.legacyPath
        }?embedded=1&role=${
          pair?.members[0]?.installationId ===
          createRun.data?.installationId
            ? "creator"
            : "partner"
        }&code=${pair?.code ?? "SOLO"}`}
        title={game.title}
      />
    </main>
  );
}

function ProfilePage() {
  const queryClient = useQueryClient();
  const profile = useQuery({ queryKey: ["profile"], queryFn: api.getProfile });
  const update = useMutation({
    mutationFn: (changes: Record<string, string>) => api.updateProfile(changes),
    onSuccess: (value) => {
      queryClient.setQueryData(["profile"], value);
    },
  });

  if (!profile.data) {
    return <LoadingScreen />;
  }

  return (
    <main className={styles.formPage}>
      <form
        key={profile.data.updatedAt}
        className={styles.formCard}
        onSubmit={(event) => {
          event.preventDefault();
          const form = new FormData(event.currentTarget);
          update.mutate({
            displayName: String(form.get("displayName") ?? ""),
            bio: String(form.get("bio") ?? ""),
          });
        }}
      >
        <span>Jouw plek</span>
        <h1>Profiel</h1>
        <label>
          Naam
          <input
            defaultValue={profile.data.displayName}
            maxLength={40}
            name="displayName"
          />
        </label>
        <label>
          Iets over jou
          <textarea
            defaultValue={profile.data.bio}
            maxLength={280}
            name="bio"
            rows={5}
          />
        </label>
        <button className={styles.primaryButton} disabled={update.isPending}>
          Opslaan
        </button>
        {update.isSuccess && <p className={styles.success}>Profiel opgeslagen.</p>}
      </form>
    </main>
  );
}

function PairPanel({ pair }: { pair: Pair | null | undefined }) {
  const queryClient = useQueryClient();
  const [code, setCode] = useState("");
  const refresh = () => queryClient.invalidateQueries({ queryKey: ["pair"] });
  const create = useMutation({ mutationFn: api.createPair, onSuccess: refresh });
  const join = useMutation({ mutationFn: () => api.joinPair(code), onSuccess: refresh });
  const disconnect = useMutation({ mutationFn: api.disconnectPair, onSuccess: refresh });

  if (pair) {
    return (
      <>
        <span className={styles.panelKicker}>Jullie code</span>
        <div className={styles.pairCode}>{pair.code}</div>
        <p>{pair.members.length === 2 ? "Jullie zijn gekoppeld." : "Deel deze code met je partner."}</p>
        <ul className={styles.memberList}>
          {pair.members.map((member) => <li key={member.installationId}>{member.displayName}</li>)}
        </ul>
        <button className={styles.dangerButton} onClick={() => disconnect.mutate()} type="button">
          Ontkoppelen
        </button>
      </>
    );
  }

  return (
    <>
      <span className={styles.panelKicker}>Samen ontdekken</span>
      <h2>Koppel met je partner</h2>
      <button className={styles.primaryButton} onClick={() => create.mutate()} type="button">
        Maak een code
      </button>
      <div className={styles.or}>of</div>
      <input
        className={styles.codeInput}
        maxLength={6}
        onChange={(event) => setCode(event.target.value.toUpperCase())}
        placeholder="ABC234"
        value={code}
      />
      <button disabled={code.length !== 6} onClick={() => join.mutate()} type="button">
        Code gebruiken
      </button>
      {(create.error || join.error) && (
        <p className={styles.error}>{(create.error ?? join.error)?.message}</p>
      )}
    </>
  );
}

function ChatPanel({ pair }: { pair: Pair | null | undefined }) {
  const { lastEvent, send } = useRealtime();
  const queryClient = useQueryClient();
  const [text, setText] = useState("");
  const messages = useQuery<Message[]>({
    queryKey: ["messages", pair?.id],
    queryFn: api.getMessages,
    enabled: Boolean(pair),
  });

  useEffect(() => {
    if (lastEvent?.type === "chat.message") {
      const message = lastEvent.payload as Message;
      queryClient.setQueryData<Message[]>(["messages", pair?.id], (current = []) =>
        current.some((item) => item.id === message.id) ? current : [...current, message],
      );
    }
  }, [lastEvent, pair?.id, queryClient]);

  function submit(event: FormEvent) {
    event.preventDefault();
    const value = text.trim();
    if (!value) return;
    send("chat.send", { clientId: crypto.randomUUID(), text: value });
    setText("");
  }

  if (!pair || pair.members.length < 2) {
    return <p>Koppel eerst met je partner om te chatten.</p>;
  }

  return (
    <div className={styles.chat}>
      <div className={styles.messages}>
        {messages.data?.map((message) => (
          <article key={message.id}>
            <strong>{message.senderName}</strong>
            <p>{message.text}</p>
          </article>
        ))}
      </div>
      <form onSubmit={submit}>
        <input
          maxLength={2_000}
          onChange={(event) => setText(event.target.value)}
          placeholder="Schrijf iets..."
          value={text}
        />
        <button type="submit">Stuur</button>
      </form>
    </div>
  );
}

function CallPanel({ pair }: { pair: Pair | null | undefined }) {
  const call = useCall();
  if (!pair || pair.members.length < 2) {
    return <p>Koppel eerst met je partner om te bellen.</p>;
  }
  return (
    <div className={styles.callPanel}>
      <span className={styles.callPulse} data-active={call.status !== "idle"} />
      <h2>{call.status === "idle" ? "Even echt horen" : `Status: ${call.status}`}</h2>
      {call.status === "idle" && <button className={styles.primaryButton} onClick={() => void call.start()}>Bel partner</button>}
      {call.status === "ringing" && (
        <div className={styles.callActions}>
          <button className={styles.primaryButton} onClick={() => void call.accept()}>Opnemen</button>
          <button onClick={call.decline}>Weigeren</button>
        </div>
      )}
      {!["idle", "ringing"].includes(call.status) && <button className={styles.dangerButton} onClick={call.hangup}>Ophangen</button>}
    </div>
  );
}

function AppShell() {
  const { connected } = useRealtime();
  const drawer = useAppStore((state) => state.drawer);
  const setDrawer = useAppStore((state) => state.setDrawer);
  const pair = useQuery({ queryKey: ["pair"], queryFn: api.getPair });

  return (
    <div className={styles.app}>
      <Routes>
        <Route path="/" element={<WorldPage />} />
        <Route path="/games/:gameId" element={<GamePage pair={pair.data} />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="*" element={<Navigate replace to="/" />} />
      </Routes>

      <nav className={styles.dock}>
        <NavLink to="/">Kaart</NavLink>
        <button onClick={() => setDrawer(drawer === "pair" ? null : "pair")}>Koppel</button>
        <button onClick={() => setDrawer(drawer === "chat" ? null : "chat")}>Chat</button>
        <button onClick={() => setDrawer(drawer === "call" ? null : "call")}>Bel</button>
        <NavLink to="/profile">Profiel</NavLink>
        <span className={connected ? styles.onlineDot : styles.offlineDot} title={connected ? "Online" : "Offline"} />
      </nav>

      {drawer && (
        <aside className={styles.drawer}>
          <button className={styles.closeButton} onClick={() => setDrawer(null)} type="button">Sluiten</button>
          {drawer === "pair" && <PairPanel pair={pair.data} />}
          {drawer === "chat" && <ChatPanel pair={pair.data} />}
          {drawer === "call" && <CallPanel pair={pair.data} />}
        </aside>
      )}
    </div>
  );
}

export function App() {
  const { session } = useSession();
  return session ? <AppShell /> : <LoadingScreen />;
}
