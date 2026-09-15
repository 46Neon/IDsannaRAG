import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
const headers = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "authorization,apikey,content-type" };
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers });
  const auth = req.headers.get("Authorization"); if (!auth) return Response.json({ error: "missing_auth" }, { status: 401, headers });
  const client = createClient(Deno.env.get("SUPABASE_URL") ?? "", Deno.env.get("SUPABASE_ANON_KEY") ?? "", { global: { headers: { Authorization: auth } } });
  const { data: { user } } = await client.auth.getUser(); if (!user) return Response.json({ error: "invalid_session" }, { status: 401, headers });
  let body: { subject_id?: string; query?: string; limit?: number }; try { body = await req.json(); } catch { return Response.json({ error: "invalid_json" }, { status: 400, headers }); }
  if (!body.subject_id || !body.query?.trim()) return Response.json({ error: "subject_id_and_query_required" }, { status: 400, headers });
  return Response.json({ ok: false, code: "EMBEDDING_PROVIDER_NOT_CONFIGURED", user_id: user.id, subject_id: body.subject_id, results: [] }, { status: 501, headers });
});
