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

function GamePage({ pair }: { pair: Pair | null | undefined }) {
  const { session } = useSession();
  const { gameId = "" } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const frameRef = useRef<HTMLIFrameElement | null>(null);
  const enteredRef = useRef<string | null>(null);
  const completedRunRef = useRef<string | null>(null);
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
    pair &&
      readyInstallationIds.filter((id) =>
        pair.members.some((member) => member.installationId === id),
      ).length >= 2,
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
    const partner = pair.members.find(
      (member) => !readyInstallationIds.includes(member.installationId),
    );
    return (
      <main className={styles.gameWelcome}>
        <button className={styles.backButton} onClick={() => navigate("/")} type="button">
          Terug naar de kaart
        </button>
        <div className={styles.gameWelcomeCard}>
          <span>Samen starten</span>
          <h1>Wachten op {partner?.displayName ?? "je partner"}</h1>
          <p>
            Open allebei <strong>{game.title}</strong>. Zodra je partner dit bord
            betreedt, begint het spel automatisch.
          </p>
          <div className={styles.waitingPulse} aria-label="Wachten op partner" />
          <p className={styles.notice}>
            Chatten en bellen blijven tijdens het wachten beschikbaar.
          </p>
          {enterRun.error && <p className={styles.error}>{enterRun.error.message}</p>}
        </div>
      </main>
    );
  }

  return (
    <main className={styles.gameFramePage}>
      <div className={styles.gameFrameHeader}>
        <button onClick={() => navigate("/")} type="button">Kaart</button>
        <strong>{game.title}</strong>
        <span>Samen</span>
      </div>
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
  pair,
  partnerOnline,
}: {
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
      <button onClick={() => setDrawer("pair")} type="button">
        {pair ? "Koppeling beheren" : "Partner koppelen"}
      </button>
    </div>
  );
}

function AppShell() {
  const { session } = useSession();
  const { partnerOnline } = useRealtime();
  const drawer = useAppStore((state) => state.drawer);
  const setDrawer = useAppStore((state) => state.setDrawer);
  const pair = useQuery({ queryKey: ["pair"], queryFn: api.getPair });
  const callAccess = useQuery({
    queryKey: ["call-access", pair.data?.id],
    queryFn: api.getCallAccess,
    enabled: Boolean(pair.data && pair.data.members.length === 2),
  });
  const chatReady = Boolean(pair.data?.members.length === 2 && partnerOnline);
  const callReady = Boolean(callAccess.data?.unlocked && partnerOnline);

  return (
    <div className={styles.app}>
      <Routes>
        <Route path="/" element={<WorldPage />} />
        <Route path="/worlds/:worldId" element={<WorldPage />} />
        <Route path="/games/:gameId" element={<GamePage pair={pair.data} />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="*" element={<Navigate replace to="/" />} />
      </Routes>

      <button
        aria-label="Instellingen openen"
        className={styles.settingsButton}
        onClick={() => setDrawer(drawer === "settings" ? null : "settings")}
        type="button"
      >
        <span aria-hidden="true">•••</span>
      </button>

      <nav className={styles.dock}>
        <NavLink to="/">Kaart</NavLink>
        <button onClick={() => setDrawer(drawer === "chat" ? null : "chat")}>
          <span>Chat</span>
          <small data-ready={chatReady}>{chatReady ? "Online" : "Offline"}</small>
        </button>
        <button onClick={() => setDrawer(drawer === "call" ? null : "call")}>
          <span>Bel</span>
          <small data-ready={callReady}>
            {callReady ? "Beschikbaar" : callAccess.data?.unlocked ? "Offline" : "Gesloten"}
          </small>
        </button>
      </nav>

      {drawer && (
        <aside className={styles.drawer}>
          <button className={styles.closeButton} onClick={() => setDrawer(null)} type="button">Sluiten</button>
          {drawer === "pair" && <PairPanel pair={pair.data} />}
          {drawer === "chat" && <ChatPanel pair={pair.data} />}
          {drawer === "call" && <CallPanel pair={pair.data} />}
          {drawer === "settings" && (
            <SettingsPanel pair={pair.data} partnerOnline={partnerOnline} />
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
