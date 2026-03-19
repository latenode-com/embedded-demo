"use client";

import Link from "next/link";
import { useActionState, useState, useEffect } from "react";
import {
  registerAction,
  verifyEmailAction,
  resendCodeAction,
} from "@/lib/actions";

const inputClass =
  "mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none";

export function RegisterForm() {
  const [regState, regFormAction, regPending] = useActionState(
    registerAction,
    null
  );
  const [verifyState, verifyFormAction, verifyPending] = useActionState(
    verifyEmailAction,
    null
  );
  const [resendState, resendFormAction, resendPending] = useActionState(
    resendCodeAction,
    null
  );

  const needsVerification =
    regState &&
    typeof regState === "object" &&
    "needsVerification" in regState &&
    regState.needsVerification;

  const [forceRegister, setForceRegister] = useState(false);
  useEffect(() => {
    if (needsVerification) setForceRegister(false);
  }, [needsVerification]);
  const phase: "register" | "verify" = forceRegister
    ? "register"
    : needsVerification
      ? "verify"
      : "register";
  const verificationEmail = needsVerification
    ? (regState as { email: string }).email
    : "";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-gray-50">
      <div className="w-full max-w-sm">
        <Link href="/" className="block text-center mb-8">
          <span className="text-2xl font-bold text-gray-900">Acme App</span>
        </Link>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          {phase === "verify" ? (
            <VerificationPhase
              email={verificationEmail}
              verifyState={verifyState}
              verifyFormAction={verifyFormAction}
              verifyPending={verifyPending}
              resendState={resendState}
              resendFormAction={resendFormAction}
              resendPending={resendPending}
              onBack={() => setForceRegister(true)}
            />
          ) : (
            <RegistrationPhase
              state={regState}
              formAction={regFormAction}
              pending={regPending}
            />
          )}
        </div>

        <p className="mt-4 text-center text-xs text-gray-400">
          <a
            href="https://documentation.latenode.com/white-label"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-600"
          >
            Latenode White-Label Docs ↗
          </a>
        </p>
      </div>
    </div>
  );
}

function RegistrationPhase({
  state,
  formAction,
  pending,
}: {
  state: unknown;
  formAction: (payload: FormData) => void;
  pending: boolean;
}) {
  const error =
    state && typeof state === "object" && "error" in state
      ? (state as { error: string }).error
      : null;

  return (
    <>
      <h1 className="text-lg font-semibold text-gray-900">Create account</h1>

      {error && (
        <div className="mt-3 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form action={formAction} className="mt-4 space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Full name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            className={inputClass}
            placeholder="Your full name"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className={inputClass}
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={6}
            className={inputClass}
            placeholder="Min 6 characters"
          />
        </div>

        <div>
          <label htmlFor="companyWebsite" className="block text-sm font-medium text-gray-700">
            Company website{" "}
            <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <input
            id="companyWebsite"
            name="companyWebsite"
            type="url"
            className={inputClass}
            placeholder="https://example.com"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            Phone number{" "}
            <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            className={inputClass}
            placeholder="+1 (555) 123-4567"
          />
        </div>

        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {pending ? "Creating account..." : "Create account"}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-gray-500">
        Already have an account?{" "}
        <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
          Log in
        </Link>
      </p>
    </>
  );
}

function VerificationPhase({
  email,
  verifyState,
  verifyFormAction,
  verifyPending,
  resendState,
  resendFormAction,
  resendPending,
  onBack,
}: {
  email: string;
  verifyState: unknown;
  verifyFormAction: (payload: FormData) => void;
  verifyPending: boolean;
  resendState: unknown;
  resendFormAction: (payload: FormData) => void;
  resendPending: boolean;
  onBack: () => void;
}) {
  const verifyError =
    verifyState && typeof verifyState === "object" && "error" in verifyState
      ? (verifyState as { error: string }).error
      : null;

  const resendSuccess =
    resendState && typeof resendState === "object" && "success" in resendState
      ? (resendState as { success: boolean }).success
      : false;

  return (
    <>
      <h1 className="text-lg font-semibold text-gray-900">Verify your email</h1>
      <p className="mt-2 text-sm text-gray-500">
        We sent a 4-digit code to{" "}
        <span className="font-medium text-gray-700">{email}</span>
      </p>

      {verifyError && (
        <div className="mt-3 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {verifyError}
        </div>
      )}

      {resendSuccess && (
        <div className="mt-3 rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
          A new code has been sent to your email.
        </div>
      )}

      <form action={verifyFormAction} className="mt-4 space-y-4">
        <input type="hidden" name="email" value={email} />
        <div>
          <label htmlFor="code" className="block text-sm font-medium text-gray-700">
            Verification code
          </label>
          <input
            id="code"
            name="code"
            type="text"
            inputMode="numeric"
            pattern="[0-9]{4}"
            maxLength={4}
            required
            autoFocus
            className={`${inputClass} text-center text-lg tracking-[0.3em] font-mono`}
            placeholder="0000"
          />
        </div>

        <button
          type="submit"
          disabled={verifyPending}
          className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {verifyPending ? "Verifying..." : "Verify"}
        </button>
      </form>

      <div className="mt-4 flex items-center justify-between text-sm">
        <form action={resendFormAction}>
          <input type="hidden" name="email" value={email} />
          <button
            type="submit"
            disabled={resendPending}
            className="text-blue-600 hover:text-blue-700 font-medium disabled:opacity-50"
          >
            {resendPending ? "Sending..." : "Resend code"}
          </button>
        </form>

        <button
          type="button"
          onClick={onBack}
          className="text-gray-500 hover:text-gray-700"
        >
          Back
        </button>
      </div>
    </>
  );
}
