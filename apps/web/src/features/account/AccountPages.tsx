import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { NavLink, useSearchParams } from "react-router-dom";

import styles from "../../App.module.css";
import { api } from "../../lib/api";
import { useSession } from "../../providers/SessionProvider";

export function AccountGate() {
  const { session } = useSession();
  const [mode, setMode] = useState<"register" | "login" | "reset">(
    "register",
  );
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
      if (nextSession) window.location.reload();
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
          Je profiel, aankopen en relatiearchieven blijven privé van jou. Je
          kunt met maximaal één persoon tegelijk gekoppeld zijn.
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
              autoComplete={
                mode === "login" ? "current-password" : "new-password"
              }
              minLength={mode === "register" ? 12 : 1}
              name="password"
              required
              type="password"
            />
          </label>
        )}
        {mode === "register" && (
          <small>
            Minimaal 12 tekens, met hoofdletter, kleine letter en cijfer.
          </small>
        )}
        <button
          className={styles.primaryButton}
          disabled={accountAction.isPending}
        >
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
            Als dit adres bestaat, staat de herstellink in de lokale
            mail-outbox.
          </p>
        )}
        <div className={styles.accountSwitch}>
          <button onClick={() => setMode("register")} type="button">
            Nieuw account
          </button>
          <button onClick={() => setMode("login")} type="button">
            Inloggen
          </button>
          <button onClick={() => setMode("reset")} type="button">
            Wachtwoord vergeten
          </button>
        </div>
      </form>
    </div>
  );
}

export function AccountPage() {
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
          <button
            className={styles.dangerButton}
            onClick={() => logout.mutate()}
          >
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
              autoComplete={
                mode === "login" ? "current-password" : "new-password"
              }
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
          <p className={styles.success}>
            Controleer je e-mail voor de herstellink.
          </p>
        )}
        <div className={styles.accountSwitch}>
          <button onClick={() => setMode("login")} type="button">
            Inloggen
          </button>
          <button onClick={() => setMode("register")} type="button">
            Registreren
          </button>
          <button onClick={() => setMode("reset")} type="button">
            Wachtwoord vergeten
          </button>
        </div>
      </form>
    </main>
  );
}

export function VerifyEmailPage() {
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

export function ResetPasswordPage() {
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
          reset.mutate(
            String(new FormData(event.currentTarget).get("password") ?? ""),
          );
        }}
      >
        <h1>Nieuw wachtwoord</h1>
        <label>
          Wachtwoord
          <input
            autoComplete="new-password"
            minLength={12}
            name="password"
            required
            type="password"
          />
        </label>
        <button className={styles.primaryButton}>Wachtwoord wijzigen</button>
        {reset.isSuccess && (
          <p className={styles.success}>
            Wachtwoord gewijzigd. Je kunt nu inloggen.
          </p>
        )}
        {reset.error && <p className={styles.error}>{reset.error.message}</p>}
      </form>
    </main>
  );
}
