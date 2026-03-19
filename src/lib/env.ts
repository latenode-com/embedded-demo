export class EnvConfigError extends Error {
  public readonly missing: string[];

  constructor(missing: string[], message?: string) {
    super(
      message ??
        `Missing required environment variable${missing.length > 1 ? "s" : ""}: ${missing.join(", ")}`
    );
    this.name = "EnvConfigError";
    this.missing = missing;
  }
}

interface EnvCheckOk {
  ok: true;
}

interface EnvCheckFail {
  ok: false;
  missing: string[];
  message: string;
}

export type EnvCheckResult = EnvCheckOk | EnvCheckFail;

/**
 * Check that core env vars (SESSION_SECRET) are set.
 * Pass `{ latenode: true }` to also check Latenode-specific vars.
 */
export function checkEnv(opts?: { latenode?: boolean }): EnvCheckResult {
  const missing: string[] = [];

  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) {
    missing.push("SESSION_SECRET");
  }

  if (opts?.latenode) {
    if (!process.env.LATENODE_PRIVATE_KEY) missing.push("LATENODE_PRIVATE_KEY");
    if (!process.env.LATENODE_TENANT_ID) missing.push("LATENODE_TENANT_ID");
  }

  if (missing.length > 0) {
    return {
      ok: false,
      missing,
      message: `Missing: ${missing.join(", ")}. Copy .env.example to .env and fill in values.`,
    };
  }

  return { ok: true };
}
