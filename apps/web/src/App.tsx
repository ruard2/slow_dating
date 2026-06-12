import { AppShell } from "./app/AppShell";
import { LoadingScreen } from "./app/LoadingScreen";
import { useSession } from "./providers/SessionProvider";

export function App() {
  const { session } = useSession();
  return session ? <AppShell /> : <LoadingScreen />;
}
