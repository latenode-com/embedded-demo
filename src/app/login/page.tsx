import { checkEnv } from "@/lib/env";
import { SetupError } from "@/components/SetupError";
import { LoginForm } from "./LoginForm";

export default function LoginPage() {
  const env = checkEnv();
  if (!env.ok) {
    return <SetupError missing={env.missing} />;
  }

  return <LoginForm />;
}
