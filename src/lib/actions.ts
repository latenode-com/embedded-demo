"use server";

import { redirect } from "next/navigation";
import { compareSync, hashSync } from "bcryptjs";
import { prisma } from "./db";
import { createSessionCookie, deleteSessionCookie, getSession } from "./auth";
import { sendVerificationEmail } from "./email";

const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000;
const VERIFICATION_CODE_TTL_MS = 10 * 60 * 1000;

function isEmailConfirmationEnabled() {
  return process.env.EMAIL_CONFIRMATION_ENABLED === "true";
}

function generateCode(): string {
  return String(Math.floor(1000 + Math.random() * 9000));
}

export async function loginAction(_prev: unknown, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !compareSync(password, user.password)) {
    return { error: "Invalid email or password." };
  }

  const session = await prisma.session.create({
    data: {
      userId: user.id,
      expiresAt: new Date(Date.now() + SESSION_DURATION_MS),
    },
  });

  await createSessionCookie(session.id);
  redirect("/dashboard");
}

export async function registerAction(_prev: unknown, formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const companyWebsite = (formData.get("companyWebsite") as string) || null;
  const phone = (formData.get("phone") as string) || null;

  if (!name || !email || !password) {
    return { error: "Full name, email, and password are required." };
  }

  if (password.length < 6) {
    return { error: "Password must be at least 6 characters." };
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    if (existing.emailVerified) {
      return { error: "An account with this email already exists." };
    }
    await prisma.user.delete({ where: { id: existing.id } });
  }

  const confirmationEnabled = isEmailConfirmationEnabled();

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashSync(password, 10),
      companyWebsite,
      phone,
      emailVerified: !confirmationEnabled,
    },
  });

  if (confirmationEnabled) {
    const code = generateCode();

    await prisma.verificationCode.deleteMany({ where: { email } });
    await prisma.verificationCode.create({
      data: {
        email,
        code,
        expiresAt: new Date(Date.now() + VERIFICATION_CODE_TTL_MS),
      },
    });

    await sendVerificationEmail(email, code);

    return { needsVerification: true, email };
  }

  const session = await prisma.session.create({
    data: {
      userId: user.id,
      expiresAt: new Date(Date.now() + SESSION_DURATION_MS),
    },
  });

  await createSessionCookie(session.id);
  redirect("/dashboard");
}

export async function verifyEmailAction(_prev: unknown, formData: FormData) {
  const email = formData.get("email") as string;
  const code = formData.get("code") as string;

  if (!email || !code) {
    return { error: "Verification code is required." };
  }

  const record = await prisma.verificationCode.findFirst({
    where: { email, code, expiresAt: { gt: new Date() } },
  });

  if (!record) {
    return { error: "Invalid or expired code. Please try again." };
  }

  await prisma.user.update({
    where: { email },
    data: { emailVerified: true },
  });

  await prisma.verificationCode.deleteMany({ where: { email } });

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return { error: "User not found." };
  }

  const session = await prisma.session.create({
    data: {
      userId: user.id,
      expiresAt: new Date(Date.now() + SESSION_DURATION_MS),
    },
  });

  await createSessionCookie(session.id);
  redirect("/dashboard");
}

export async function resendCodeAction(_prev: unknown, formData: FormData) {
  const email = formData.get("email") as string;

  if (!email) {
    return { error: "Email is required." };
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || user.emailVerified) {
    return { error: "No pending verification for this email." };
  }

  const code = generateCode();

  await prisma.verificationCode.deleteMany({ where: { email } });
  await prisma.verificationCode.create({
    data: {
      email,
      code,
      expiresAt: new Date(Date.now() + VERIFICATION_CODE_TTL_MS),
    },
  });

  await sendVerificationEmail(email, code);

  return { success: true };
}

export async function logoutAction() {
  const session = await getSession();
  if (session) {
    await prisma.session.delete({ where: { id: session.id } }).catch(() => {});
  }
  await deleteSessionCookie();
  redirect("/");
}
