import { createPrivateKey } from "crypto";
import { SignJWT } from "jose";
import { EnvConfigError } from "./env";

/**
 * Sign a Latenode embedded JWT for the given app user.
 * The private key, tenant ID, and plan ID come from environment variables.
 */
export async function issueLatenodeToken(userId: string) {
  const privateKeyPem = process.env.LATENODE_PRIVATE_KEY;
  const tenantId = process.env.LATENODE_TENANT_ID;
  const planId = process.env.LATENODE_DEFAULT_PLAN_ID;

  const missing: string[] = [];
  if (!privateKeyPem) missing.push("LATENODE_PRIVATE_KEY");
  if (!tenantId) missing.push("LATENODE_TENANT_ID");

  if (missing.length > 0) {
    throw new EnvConfigError(missing);
  }

  const normalizedPem = privateKeyPem!.replace(/\\n/g, "\n");

  let privateKey;
  try {
    privateKey = createPrivateKey(normalizedPem);
  } catch {
    throw new Error(
      "LATENODE_PRIVATE_KEY is not a valid PEM private key. " +
        "Ensure the full key including BEGIN/END lines is in your .env file. " +
        "Both PKCS#1 (BEGIN RSA PRIVATE KEY) and PKCS#8 (BEGIN PRIVATE KEY) formats are accepted."
    );
  }

  const payload: Record<string, unknown> = {
    tenant_id: Number(tenantId),
    user_id: userId,
  };

  if (planId) {
    payload.plan_id = Number(planId);
  }

  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "RS512", typ: "JWT" })
    .setExpirationTime("10m")
    .sign(privateKey);

  return token;
}
