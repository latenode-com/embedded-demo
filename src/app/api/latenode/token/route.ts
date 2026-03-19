import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { issueLatenodeToken } from "@/lib/latenode";
import { EnvConfigError } from "@/lib/env";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST() {
  const ip = await getClientIp();
  const limited = rateLimit(`token:${ip}`, 120, 60_000);
  if (limited) {
    return NextResponse.json({ error: limited }, { status: 429 });
  }

  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const token = await issueLatenodeToken(session.user.id);
    return NextResponse.json({ token });
  } catch (error) {
    if (error instanceof EnvConfigError) {
      console.error("[latenode/token] Missing env vars:", error.missing);
      return NextResponse.json(
        { error: "Service configuration error", setupRequired: true },
        { status: 500 }
      );
    }

    console.error("[latenode/token] Token issuance failed:", error);
    return NextResponse.json(
      { error: "Failed to issue token" },
      { status: 500 }
    );
  }
}
