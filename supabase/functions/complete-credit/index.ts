import { authenticatedClient } from "../_shared/auth.ts";
import { json, options } from "../_shared/http.ts";
Deno.serve(async (req) => { const preflight = options(req); if (preflight) return preflight; const auth = await authenticatedClient(req); if (auth.response) return auth.response; return json({ ok: false, code: "CREDIT_RPC_NOT_DEPLOYED" }, 501); });
