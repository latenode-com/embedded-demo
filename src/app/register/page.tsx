import { checkEnv } from "@/lib/env";
import { SetupError } from "@/components/SetupError";
import { RegisterForm } from "./RegisterForm";

export default function RegisterPage() {
  const env = checkEnv();
  if (!env.ok) {
    return <SetupError missing={env.missing} />;
  }

  return <RegisterForm />;
}
