import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const cors = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type" };
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...cors, "content-type": "application/json" } });

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (request.method !== "POST") return json({ error: "method_not_allowed" }, 405);
  const auth = request.headers.get("Authorization");
  if (!auth?.startsWith("Bearer ")) return json({ error: "missing_auth" }, 401);
  const url = Deno.env.get("SUPABASE_URL");
  const anon = Deno.env.get("SUPABASE_ANON_KEY");
  if (!url || !anon) return json({ error: "backend_not_configured" }, 503);
  const supabase = createClient(url, anon, { global: { headers: { Authorization: auth } } });
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) return json({ error: "invalid_session" }, 401);
  let input: { subject_id?: string; message?: string; agent_id?: string; idempotency_key?: string };
  try { input = await request.json(); } catch { return json({ error: "invalid_json" }, 400); }
  if (!input.subject_id || !input.message?.trim()) return json({ error: "subject_id_and_message_required" }, 400);
  if (input.message.length > 12000) return json({ error: "message_too_long" }, 413);
  // The production implementation must verify subject membership with RLS,
  // reserve credits atomically, persist the user message, call Gemini using
  // GEMINI_API_KEY, persist the response, and record citations/usage.
  // It intentionally refuses to fabricate a response while those contracts
  // are not deployed and verified in Supabase.
  return json({ ok: false, code: "ORCHESTRATOR_NOT_DEPLOYED", user_id: user.id, subject_id: input.subject_id }, 501);
});
