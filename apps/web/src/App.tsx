import {
  useCallback,
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
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import type { Message, Pair } from "@slow-dating/contracts";
import { findGame } from "@slow-dating/content";

import styles from "./App.module.css";
import { WorldMap } from "./components/WorldMap";
import { PartnerArrived, WaitingRoom } from "./components/WaitingRoom";
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

function ShellIcon({
  name,
}: {
  name: "back" | "call" | "callLocked" | "chat" | "settings";
}) {
  const paths = {
    back: <path d="M15 18l-6-6 6-6M9 12h11" />,
    call: <path d="M7.2 3.8l2.1 4.6-2.2 1.8a15 15 0 0 0 6.7 6.7l1.8-2.2 4.6 2.1-.8 3.1c-.3 1.1-1.4 1.8-2.5 1.6C9.3 20.2 3.8 14.7 2.5 7.1c-.2-1.1.5-2.2 1.6-2.5l3.1-.8Z" />,
    callLocked: (
      <>
        <path d="M7.2 3.8l2.1 4.6-2.2 1.8a15 15 0 0 0 6.7 6.7l1.8-2.2 4.6 2.1-.8 3.1c-.3 1.1-1.4 1.8-2.5 1.6C9.3 20.2 3.8 14.7 2.5 7.1c-.2-1.1.5-2.2 1.6-2.5l3.1-.8Z" />
        <path d="M4 20 20 4" />
      </>
    ),
    chat: <path d="M4 5h16v11H9l-5 4V5Z" />,
    settings: (
      <>
        <circle cx="5" cy="12" r="1.4" />
        <circle cx="12" cy="12" r="1.4" />
        <circle cx="19" cy="12" r="1.4" />
      </>
    ),
  };
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      {paths[name]}
    </svg>
  );
}

function formatMessageTime(value: string) {
  return new Intl.DateTimeFormat("nl-NL", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function AccountGate() {
  const { session } = useSession();
  const [mode, setMode] = useState<"register" | "login" | "reset">("register");
  const accountAction = useMutation({
    mutationFn: async (form: FormData) => {
      if (mode === "reset") {
        await api.requestPasswordReset(String(form.get("email") ?? ""));
        return null;
      }
      if (mode === "login") {
        return api.login(
          String(form.get("email") ?? ""),
          String(form.get("password") ?? ""),
        );
      }
      return api.register({
        displayName: String(form.get("displayName") ?? ""),
        email: String(form.get("email") ?? ""),
        password: String(form.get("password") ?? ""),
      });
    },
    onSuccess: (nextSession) => {
      if (nextSession) {
        window.location.reload();
      }
    },
  });

  return (
    <div className={styles.accountGate} role="dialog" aria-modal="true">
      <form
        className={styles.accountCard}
        onSubmit={(event) => {
          event.preventDefault();
          accountAction.mutate(new FormData(event.currentTarget));
        }}
      >
        <span>Bewaar jullie geschiedenis</span>
        <h2>
          {mode === "register"
            ? "Maak je persoonlijke account"
            : mode === "login"
              ? "Log in op je account"
              : "Herstel je wachtwoord"}
        </h2>
        <p>
          Je profiel, aankopen en relatiearchieven blijven privé van jou.
          Je kunt met maximaal één persoon tegelijk gekoppeld zijn.
        </p>
        {mode === "register" && (
          <label>
            Naam
            <input
              defaultValue={session?.profile.displayName}
              maxLength={40}
              name="displayName"
              required
            />
          </label>
        )}
        <label>
          E-mailadres
          <input autoComplete="email" name="email" required type="email" />
        </label>
        {mode !== "reset" && (
          <label>
            Wachtwoord
            <input
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              minLength={mode === "register" ? 12 : 1}
              name="password"
              required
              type="password"
            />
          </label>
        )}
        {mode === "register" && (
          <small>Minimaal 12 tekens, met hoofdletter, kleine letter en cijfer.</small>
        )}
        <button className={styles.primaryButton} disabled={accountAction.isPending}>
          {mode === "register"
            ? "Account maken"
            : mode === "login"
              ? "Inloggen"
              : "Herstellink aanvragen"}
        </button>
        {accountAction.error && (
          <p className={styles.error}>{accountAction.error.message}</p>
        )}
        {mode === "reset" && accountAction.isSuccess && (
          <p className={styles.success}>
            Als dit adres bestaat, staat de herstellink in de lokale mail-outbox.
          </p>
        )}
        <div className={styles.accountSwitch}>
          <button onClick={() => setMode("register")} type="button">Nieuw account</button>
          <button onClick={() => setMode("login")} type="button">Inloggen</button>
          <button onClick={() => setMode("reset")} type="button">Wachtwoord vergeten</button>
        </div>
      </form>
    </div>
  );
}

function AccountPage() {
  const { session } = useSession();
  const [mode, setMode] = useState<"login" | "register" | "reset">("login");
  const action = useMutation({
    mutationFn: async (form: FormData) => {
      if (mode === "reset") {
        await api.requestPasswordReset(String(form.get("email") ?? ""));
        return;
      }
      if (mode === "register") {
        await api.register({
          displayName: String(form.get("displayName") ?? ""),
          email: String(form.get("email") ?? ""),
          password: String(form.get("password") ?? ""),
        });
      } else {
        await api.login(
          String(form.get("email") ?? ""),
          String(form.get("password") ?? ""),
        );
      }
      window.location.href = "/";
    },
  });
  const logout = useMutation({
    mutationFn: api.logout,
    onSuccess: () => window.location.reload(),
  });

  if (session?.account) {
    return (
      <main className={styles.formPage}>
        <section className={styles.accountCard}>
          <span>Jouw account</span>
          <h1>{session.account.email}</h1>
          <p>
            {session.account.emailVerified
              ? "Je e-mailadres is geverifieerd."
              : "Je e-mailadres wacht nog op verificatie."}
          </p>
          <button className={styles.dangerButton} onClick={() => logout.mutate()}>
            Uitloggen
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className={styles.formPage}>
      <form
        className={styles.accountCard}
        onSubmit={(event) => {
          event.preventDefault();
          action.mutate(new FormData(event.currentTarget));
        }}
      >
        <span>Persoonlijke toegang</span>
        <h1>
          {mode === "login"
            ? "Inloggen"
            : mode === "register"
              ? "Account maken"
              : "Wachtwoord herstellen"}
        </h1>
        {mode === "register" && (
          <label>
            Naam
            <input name="displayName" required />
          </label>
        )}
        <label>
          E-mailadres
          <input autoComplete="email" name="email" required type="email" />
        </label>
        {mode !== "reset" && (
          <label>
            Wachtwoord
            <input
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              minLength={mode === "register" ? 12 : 1}
              name="password"
              required
              type="password"
            />
          </label>
        )}
        <button className={styles.primaryButton} disabled={action.isPending}>
          Doorgaan
        </button>
        {action.error && <p className={styles.error}>{action.error.message}</p>}
        {mode === "reset" && action.isSuccess && (
          <p className={styles.success}>Controleer je e-mail voor de herstellink.</p>
        )}
        <div className={styles.accountSwitch}>
          <button onClick={() => setMode("login")} type="button">Inloggen</button>
          <button onClick={() => setMode("register")} type="button">Registreren</button>
          <button onClick={() => setMode("reset")} type="button">Wachtwoord vergeten</button>
        </div>
      </form>
    </main>
  );
}

function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const verification = useQuery({
    queryKey: ["verify-email", searchParams.get("token")],
    queryFn: () => api.verifyEmail(searchParams.get("token") ?? ""),
    retry: false,
  });
  return (
    <main className={styles.formPage}>
      <section className={styles.accountCard}>
        <h1>E-mailadres verifiëren</h1>
        <p>
          {verification.isPending
            ? "Bezig met verifiëren..."
            : verification.isSuccess
              ? "Je e-mailadres is geverifieerd. Je kunt terug naar de app."
              : verification.error?.message}
        </p>
        <NavLink to="/">Terug naar de app</NavLink>
      </section>
    </main>
  );
}

function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const reset = useMutation({
    mutationFn: (password: string) =>
      api.completePasswordReset(searchParams.get("token") ?? "", password),
  });
  return (
    <main className={styles.formPage}>
      <form
        className={styles.accountCard}
        onSubmit={(event) => {
          event.preventDefault();
          reset.mutate(String(new FormData(event.currentTarget).get("password") ?? ""));
        }}
      >
        <h1>Nieuw wachtwoord</h1>
        <label>
          Wachtwoord
          <input autoComplete="new-password" minLength={12} name="password" required type="password" />
        </label>
        <button className={styles.primaryButton}>Wachtwoord wijzigen</button>
        {reset.isSuccess && <p className={styles.success}>Wachtwoord gewijzigd. Je kunt nu inloggen.</p>}
        {reset.error && <p className={styles.error}>{reset.error.message}</p>}
      </form>
    </main>
  );
}

function WorldPage() {
  const { worldId } = useParams();
  const queryClient = useQueryClient();
  const progress = useQuery({
    queryKey: ["progress"],
    queryFn: api.getProgress,
  });
  const purchase = useMutation({
    mutationFn: api.purchaseWorld,
    onSuccess: (value) => queryClient.setQueryData(["progress"], value),
  });
  const focusWorld = Number(worldId ?? 1);
  if (!progress.data) return <LoadingScreen />;
  return (
    <WorldMap
      focusWorld={Number.isInteger(focusWorld) && focusWorld >= 1 && focusWorld <= 5 ? focusWorld : 1}
      progress={progress.data}
      purchaseWorld={(world) => purchase.mutate(world)}
      purchasing={purchase.isPending}
    />
  );
}

function GamePage({
  developerPartnerArriving,
  developerPartnerPresent,
  onDeveloperPartnerArrivalComplete,
  pair,
}: {
  developerPartnerArriving: boolean;
  developerPartnerPresent: boolean;
  onDeveloperPartnerArrivalComplete(): void;
  pair: Pair | null | undefined;
}) {
  const { session } = useSession();
  const { gameId = "" } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const frameRef = useRef<HTMLIFrameElement | null>(null);
  const enteredRef = useRef<string | null>(null);
  const completedRunRef = useRef<string | null>(null);
  const [arrivalComplete, setArrivalComplete] = useState(false);
  const { lastEvent, send } = useRealtime();
  const setDrawer = useAppStore((state) => state.setDrawer);
  const game = findGame(gameId);
  const activeRun = useQuery({
    queryKey: ["active-game-run", pair?.id, gameId],
    queryFn: () => api.getActiveGameRun(gameId),
    enabled: Boolean(game && pair?.members.length === 2),
    refetchInterval: 1_500,
  });
  const enterRun = useMutation({
    mutationFn: () => api.createGameRun(gameId, game?.version ?? 1),
    onSuccess: (run) => {
      queryClient.setQueryData(["active-game-run", pair?.id, gameId], run);
      send("game.lobby.enter", { gameId, gameRunId: run.id });
    },
  });
  const run = activeRun.data ?? enterRun.data;
  const readyInstallationIds = Array.isArray(run?.state.readyInstallationIds)
    ? run.state.readyInstallationIds.filter(
        (value): value is string => typeof value === "string",
      )
    : [];
  const started = Boolean(
    (pair?.developerMode && developerPartnerPresent) ||
      (pair &&
        !pair.developerMode &&
        readyInstallationIds.filter((id) =>
          pair.members.some((member) => member.installationId === id),
        ).length >= 2),
  );
  const partner = pair?.members.find(
    (member) => member.installationId !== session?.installationId,
  );
  const hasWaited = Boolean(
    run &&
      (!pair?.developerMode || developerPartnerArriving) &&
      run.installationId === session?.installationId,
  );

  useEffect(() => {
    if (
      !game ||
      pair?.members.length !== 2 ||
      enteredRef.current === `${pair.id}:${gameId}`
    ) {
      return;
    }
    enteredRef.current = `${pair.id}:${gameId}`;
    enterRun.mutate();
  }, [enterRun, game, gameId, pair]);

  useEffect(() => {
    if (!run || started) return;
    void api.startWaitingSession(run.id);
  }, [run, started]);

  useEffect(() => {
    if (!started || !run || !hasWaited || arrivalComplete) return;
    void api.endWaitingSession(run.id);
    const timeout = window.setTimeout(() => {
      setArrivalComplete(true);
      if (pair?.developerMode) onDeveloperPartnerArrivalComplete();
    }, 1_400);
    return () => clearTimeout(timeout);
  }, [
    arrivalComplete,
    hasWaited,
    onDeveloperPartnerArrivalComplete,
    pair?.developerMode,
    run,
    started,
  ]);

  useEffect(() => {
    if (lastEvent?.type === "game.lobby.enter") {
      const payload = lastEvent.payload as { gameId?: string };
      if (payload.gameId === gameId) {
        void queryClient.invalidateQueries({
          queryKey: ["active-game-run", pair?.id, gameId],
        });
      }
      return;
    }
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
  }, [gameId, lastEvent, pair?.id, queryClient]);

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
      if (run) {
        void api.recordActivity({
          clientEventId: crypto.randomUUID(),
          category: "game",
          type: `legacy.${legacyEvent || "unknown"}`,
          gameRunId: run.id,
          payload:
            event.data.data &&
            typeof event.data.data === "object" &&
            !Array.isArray(event.data.data)
              ? event.data.data
              : { value: event.data.data ?? null },
        });
      }
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
      if (
        legacyEvent === "session_complete" &&
        run &&
        completedRunRef.current !== run.id
      ) {
        completedRunRef.current = run.id;
        void api
          .completeGameRun(run.id, event.data.data ?? {})
          .then(() => queryClient.invalidateQueries({ queryKey: ["progress"] }))
          .catch(() => {
            completedRunRef.current = null;
          });
      }
      if (run) {
        send("game.sync", {
          gameRunId: run.id,
          state: {
            legacyEvent,
            data: event.data.data ?? {},
          },
        });
      }
    }
    window.addEventListener("message", receiveLegacyMessage);
    return () => window.removeEventListener("message", receiveLegacyMessage);
  }, [queryClient, run, send, setDrawer]);

  if (!game) {
    return <Navigate replace to="/" />;
  }

  if (!pair || pair.members.length !== 2) {
    return (
      <main className={styles.gameWelcome}>
        <button className={styles.backButton} onClick={() => navigate("/")} type="button">
          Terug naar de kaart
        </button>
        <div className={styles.gameWelcomeCard}>
          <span>Ontdekking</span>
          <h1>{game.title}</h1>
          <p>Dit spel speel je uitsluitend samen. Koppel eerst met je partner.</p>
          <button className={styles.primaryButton} onClick={() => setDrawer("pair")} type="button">
            Partner koppelen
          </button>
        </div>
      </main>
    );
  }

  if (!started) {
    if (!run) return <LoadingScreen />;
    return (
      <WaitingRoom
        gameRunId={run.id}
        partnerName={partner?.displayName ?? "Je partner"}
      />
    );
  }

  if (hasWaited && !arrivalComplete) {
    return <PartnerArrived partnerName={partner?.displayName ?? "Je partner"} />;
  }

  return (
    <main className={styles.gameFramePage}>
      <iframe
        className={styles.gameFrame}
        ref={frameRef}
        src={`/legacy/${game.legacyPath}?embedded=1&role=${
          session?.installationId === run?.installationId
            ? "creator"
            : "partner"
        }&code=${pair.developerMode ? "1111" : pair.code}`}
        title={game.title}
      />
    </main>
  );
}

function ProfilePage() {
  const { session } = useSession();
  const queryClient = useQueryClient();
  const [openArchiveId, setOpenArchiveId] = useState<string | null>(null);
  const profile = useQuery({ queryKey: ["profile"], queryFn: api.getProfile });
  const archives = useQuery({
    queryKey: ["relationship-archives"],
    queryFn: api.getRelationshipArchives,
    enabled: Boolean(session?.account),
  });
  const archivedMessages = useQuery({
    queryKey: ["relationship-archive-messages", openArchiveId],
    queryFn: () => api.getRelationshipMessages(openArchiveId ?? ""),
    enabled: Boolean(openArchiveId),
  });
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
      {session?.account && (
        <section className={styles.archiveCard}>
          <span>Account</span>
          <h2>{session.account.email}</h2>
          <p>
            {session.account.emailVerified
              ? "E-mailadres geverifieerd"
              : "Controleer de lokale mail-outbox om je e-mailadres te verifiëren."}
          </p>
          <h3>Relatiearchieven</h3>
          {archives.data?.length ? (
            archives.data.map((archive) => (
              <div key={archive.id}>
                <button
                  className={styles.archiveRow}
                  onClick={() =>
                    setOpenArchiveId(
                      openArchiveId === archive.id ? null : archive.id,
                    )
                  }
                  type="button"
                >
                  <strong>
                    {archive.members.map((member) => member.displayName).join(" & ")}
                  </strong>
                  <span>
                    {archive.messageCount} berichten · {archive.completedGames} ontdekkingen
                  </span>
                </button>
                {openArchiveId === archive.id && (
                  <div className={styles.archiveMessages}>
                    {archivedMessages.data?.map((message) => (
                      <p key={message.id}>
                        <strong>{message.senderName}:</strong> {message.text}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            ))
          ) : (
            <p>Nog geen afgesloten relaties.</p>
          )}
        </section>
      )}
    </main>
  );
}

function PairPanel({ pair }: { pair: Pair | null | undefined }) {
  const queryClient = useQueryClient();
  const [code, setCode] = useState("");
  const refresh = () => queryClient.invalidateQueries({ queryKey: ["pair"] });
  const create = useMutation({ mutationFn: api.createPair, onSuccess: refresh });
  const join = useMutation({ mutationFn: () => api.joinPair(code), onSuccess: refresh });
  const developer = useMutation({
    mutationFn: api.activateDeveloperPair,
    onSuccess: refresh,
  });
  const disconnect = useMutation({
    mutationFn: api.disconnectPair,
    onSuccess: () => {
      refresh();
      void queryClient.invalidateQueries({ queryKey: ["relationship-archives"] });
    },
  });

  if (pair) {
    return (
      <>
        <span className={styles.panelKicker}>
          {pair.developerMode ? "Lokale beheerdersmodus" : "Jullie code"}
        </span>
        <div className={styles.pairCode}>{pair.developerMode ? "1111" : pair.code}</div>
        <p>
          {pair.developerMode
            ? "De computer is gekoppeld als Testpartner."
            : pair.members.length === 2
              ? "Jullie zijn gekoppeld."
              : "Deel deze code met je partner."}
        </p>
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
        onChange={(event) =>
          setCode(event.target.value.toUpperCase().replace(/\s/g, ""))
        }
        placeholder="ABC234 of 1111"
        value={code}
      />
      <button
        disabled={code !== "1111" && code.length !== 6}
        onClick={() => code === "1111" ? developer.mutate() : join.mutate()}
        type="button"
      >
        {code === "1111" ? "Open beheerdersmodus" : "Code gebruiken"}
      </button>
      {(create.error || join.error || developer.error) && (
        <p className={styles.error}>
          {(create.error ?? join.error ?? developer.error)?.message}
        </p>
      )}
    </>
  );
}

function ChatPanel({
  pair,
  partnerOnline,
}: {
  pair: Pair | null | undefined;
  partnerOnline: boolean;
}) {
  const { session } = useSession();
  const { lastEvent, send } = useRealtime();
  const queryClient = useQueryClient();
  const messagesRef = useRef<HTMLDivElement | null>(null);
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

  useEffect(() => {
    messagesRef.current?.scrollTo({
      top: messagesRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages.data]);

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

  const partner = pair.members.find(
    (member) => member.installationId !== session?.installationId,
  );

  return (
    <div className={styles.chat}>
      <header className={styles.chatHeader}>
        <div className={styles.chatAvatar}>
          {(partner?.displayName ?? "P").slice(0, 1).toUpperCase()}
        </div>
        <div>
          <strong>{partner?.displayName ?? "Je partner"}</strong>
          <span data-online={partnerOnline}>
            <i />
            {partnerOnline ? "Online" : "Offline"}
          </span>
        </div>
      </header>
      <div className={styles.messages} ref={messagesRef}>
        {!messages.isPending && messages.data?.length === 0 && (
          <div className={styles.emptyChat}>
            <ShellIcon name="chat" />
            <strong>Begin jullie gesprek</strong>
            <span>Berichten blijven beschikbaar na het wisselen van spel.</span>
          </div>
        )}
        {messages.data?.map((message) => {
          const own = message.senderInstallationId === session?.installationId;
          return (
            <article data-own={own} key={message.id}>
              {!own && <strong>{message.senderName}</strong>}
              <p>{message.text}</p>
              <time dateTime={message.sentAt}>
                {formatMessageTime(message.sentAt)}
              </time>
            </article>
          );
        })}
      </div>
      <form className={styles.chatComposer} onSubmit={submit}>
        <textarea
          aria-label="Bericht"
          maxLength={2_000}
          onChange={(event) => setText(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              event.currentTarget.form?.requestSubmit();
            }
          }}
          placeholder="Schrijf iets..."
          rows={1}
          value={text}
        />
        <button aria-label="Bericht versturen" disabled={!text.trim()} type="submit">
          <svg aria-hidden="true" viewBox="0 0 24 24">
            <path d="m4 4 17 8-17 8 3-8-3-8Zm3 8h14" />
          </svg>
        </button>
      </form>
    </div>
  );
}

function CallPanel({ pair }: { pair: Pair | null | undefined }) {
  const call = useCall();
  const { session } = useSession();
  const queryClient = useQueryClient();
  const access = useQuery({
    queryKey: ["call-access", pair?.id],
    queryFn: api.getCallAccess,
    enabled: Boolean(pair && pair.members.length === 2),
  });
  const requestAccess = useMutation({
    mutationFn: api.requestCallAccess,
    onSuccess: (value) => queryClient.setQueryData(["call-access", pair?.id], value),
  });
  const answerAccess = useMutation({
    mutationFn: api.answerCallAccess,
    onSuccess: (value) => queryClient.setQueryData(["call-access", pair?.id], value),
  });
  if (!pair || pair.members.length < 2) {
    return <p>Koppel eerst met je partner om te bellen.</p>;
  }
  if (!access.data) {
    return <p>Beltoegang wordt gecontroleerd...</p>;
  }
  if (!access.data.unlocked) {
    const requestFromPartner =
      access.data.requestedBy &&
      access.data.requestedBy !== session?.installationId;
    return (
      <div className={styles.callPanel}>
        <h2>Bellen samen vrijspelen</h2>
        <p>{Math.min(30, Math.floor(access.data.sharedSeconds / 60))} / 30 minuten samen</p>
        <p>{access.data.completedGames} / 5 ontdekkingen</p>
        <p>
          Minimaal 10 berichten per persoon:{" "}
          {Object.values(access.data.messagesByMember).join(" en ")}
        </p>
        {requestFromPartner ? (
          <div className={styles.callActions}>
            <button
              className={styles.primaryButton}
              onClick={() => answerAccess.mutate("yes")}
            >
              Bellen toestaan
            </button>
            <button onClick={() => answerAccess.mutate("no")}>Nog niet</button>
          </div>
        ) : (
          <button
            className={styles.primaryButton}
            disabled={!access.data.conditionsMet || requestAccess.isPending}
            onClick={() => requestAccess.mutate()}
          >
            Vraag toestemming
          </button>
        )}
      </div>
    );
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

function SettingsPanel({
  developerPartnerPresent,
  onDeveloperPartnerPresenceChange,
  pair,
  partnerOnline,
}: {
  developerPartnerPresent: boolean;
  onDeveloperPartnerPresenceChange(present: boolean): void;
  pair: Pair | null | undefined;
  partnerOnline: boolean;
}) {
  const setDrawer = useAppStore((state) => state.setDrawer);
  return (
    <div className={styles.settingsPanel}>
      <span className={styles.panelKicker}>Instellingen</span>
      <h2>Jouw omgeving</h2>
      <p className={styles.partnerStatus} data-online={partnerOnline}>
        <span />
        {partnerOnline ? "Partner is online" : "Partner is offline"}
      </p>
      <NavLink onClick={() => setDrawer(null)} to="/profile">Profiel beheren</NavLink>
      <NavLink onClick={() => setDrawer(null)} to="/account">Account en herstel</NavLink>
      {pair?.developerMode && (
        <section className={styles.developerControls}>
          <span className={styles.panelKicker}>Testpartner</span>
          <p>
            Simuleer of de computerpartner al in het spel aanwezig is.
            Je beheerderskoppeling blijft bewaard.
          </p>
          <div>
            <button
              data-selected={!developerPartnerPresent}
              onClick={() => onDeveloperPartnerPresenceChange(false)}
              type="button"
            >
              Afwezig
            </button>
            <button
              data-selected={developerPartnerPresent}
              onClick={() => onDeveloperPartnerPresenceChange(true)}
              type="button"
            >
              Aanwezig
            </button>
          </div>
          <small>
            {developerPartnerPresent
              ? "Spellen starten direct."
              : "Je krijgt eerst de centrale wachtkamer."}
          </small>
        </section>
      )}
      <button onClick={() => setDrawer("pair")} type="button">
        {pair ? "Koppeling beheren" : "Partner koppelen"}
      </button>
    </div>
  );
}

function AppShell() {
  const { session } = useSession();
  const location = useLocation();
  const call = useCall();
  const { lastEvent, partnerOnline } = useRealtime();
  const queryClient = useQueryClient();
  const drawer = useAppStore((state) => state.drawer);
  const setDrawer = useAppStore((state) => state.setDrawer);
  const [developerPartnerPresent, setDeveloperPartnerPresent] = useState(
    () => localStorage.getItem("slow-dating:developer-partner-present") !== "false",
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
  const unreadCount = drawer === "chat"
    ? 0
    : messages.data?.filter(
        (message) =>
          message.senderInstallationId !== session?.installationId &&
          (!lastChatReadAt || message.sentAt > lastChatReadAt),
      ).length ?? 0;
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
      <Routes>
        <Route path="/" element={<WorldPage />} />
        <Route path="/worlds/:worldId" element={<WorldPage />} />
        <Route
          path="/games/:gameId"
          element={
            <GamePage
              developerPartnerArriving={developerPartnerArriving}
              developerPartnerPresent={developerPartnerPresent}
              onDeveloperPartnerArrivalComplete={completeDeveloperPartnerArrival}
              pair={pair.data}
            />
          }
        />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="*" element={<Navigate replace to="/" />} />
      </Routes>

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
          aria-label={`Chat openen${unreadCount ? `, ${unreadCount} ongelezen` : ""}`}
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
          data-call-state={callActive ? "active" : callAllowed ? "ready" : "locked"}
          onClick={() => setDrawer(drawer === "call" ? null : "call")}
          type="button"
        >
          <ShellIcon name={callAllowed ? "call" : "callLocked"} />
          {callActive && <span className={styles.callStatusDot} />}
        </button>
        <button
          aria-label="Opties openen"
          data-active={drawer === "settings" || drawer === "pair"}
          onClick={() => setDrawer(drawer === "settings" ? null : "settings")}
          type="button"
        >
          <ShellIcon name="settings" />
        </button>
      </nav>

      {drawer && (
        <aside
          className={`${styles.drawer} ${drawer === "chat" ? styles.chatDrawer : ""}`}
        >
          <button className={styles.closeButton} onClick={() => setDrawer(null)} type="button">Sluiten</button>
          {drawer === "pair" && <PairPanel pair={pair.data} />}
          {drawer === "chat" && (
            <ChatPanel pair={pair.data} partnerOnline={effectivePartnerOnline} />
          )}
          {drawer === "call" && <CallPanel pair={pair.data} />}
          {drawer === "settings" && (
            <SettingsPanel
              developerPartnerPresent={developerPartnerPresent}
              onDeveloperPartnerPresenceChange={changeDeveloperPartnerPresence}
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

export function App() {
  const { session } = useSession();
  return session ? <AppShell /> : <LoadingScreen />;
}
