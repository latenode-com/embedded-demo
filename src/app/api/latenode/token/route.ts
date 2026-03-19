import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { issueLatenodeToken } from "@/lib/latenode";
import { EnvConfigError } from "@/lib/env";

export async function POST() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const token = await issueLatenodeToken(session.user.id);
    return NextResponse.json({ token });
  } catch (error) {
    if (error instanceof EnvConfigError) {
      return NextResponse.json(
        { error: error.message, setupRequired: true, missing: error.missing },
        { status: 500 }
      );
    }

    const message =
      error instanceof Error ? error.message : "Failed to issue token";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
