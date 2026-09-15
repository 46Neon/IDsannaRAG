import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { configuredProvider } from "../_shared/providers.ts";
import { reserveCredits } from "../_shared/credits.ts";
import { json, options } from "../_shared/http.ts";

Deno.serve(async (request) => {
  const preflight = options(request); if (preflight) return preflight;
  if (request.method !== 'POST') return json({ error: 'method_not_allowed' }, 405);
  const authorization = request.headers.get('Authorization');
  if (!authorization?.startsWith('Bearer ')) return json({ error: 'missing_auth' }, 401);
  const url = Deno.env.get('SUPABASE_URL'); const key = Deno.env.get('SUPABASE_ANON_KEY');
  if (!url || !key) return json({ error: 'backend_not_configured' }, 503);
  const db = createClient(url, key, { global: { headers: { Authorization: authorization } } });
  const { data: { user }, error: authError } = await db.auth.getUser();
  if (authError || !user) return json({ error: 'invalid_session' }, 401);
  let input: { subject_id?: string; conversation_id?: string; message?: string; idempotency_key?: string; agent_id?: string };
  try { input = await request.json(); } catch { return json({ error: 'invalid_json' }, 400); }
  const message = input.message?.trim(); if (!input.subject_id || !message) return json({ error: 'subject_id_and_message_required' }, 400);
  if (message.length > 12000) return json({ error: 'message_too_long' }, 413);
  const subject = await db.from('subjects').select('id,name,description').eq('id', input.subject_id).maybeSingle();
  if (subject.error || !subject.data) return json({ error: 'subject_not_found_or_forbidden' }, 404);
  let conversationId = input.conversation_id;
  if (conversationId) {
    const existing = await db.from('conversations').select('id').eq('id', conversationId).eq('subject_id', input.subject_id).maybeSingle();
    if (existing.error || !existing.data) return json({ error: 'conversation_not_found_or_forbidden' }, 404);
  } else {
    const created = await db.from('conversations').insert({ subject_id: input.subject_id, user_id: user.id, title: message.slice(0, 80) }).select('id').single();
    if (created.error) return json({ error: 'conversation_create_failed' }, 500); conversationId = created.data.id;
  }
  const provider = configuredProvider(input.agent_id); if (!provider) return json({ error: 'provider_not_configured' }, 503);
  const keyId = input.idempotency_key ?? crypto.randomUUID();
  const reservation = await reserveCredits(db, 'chat', keyId);
  if (!reservation.ok) return json({ error: reservation.code }, 402);
  const userMessage = await db.from('messages').insert({ conversation_id: conversationId, user_id: user.id, role: 'user', content: message }).select('id').single();
  if (userMessage.error) return json({ error: 'message_persist_failed' }, 500);
  try {
    const answer = await provider.complete({ system: `Eres IDsanna, asistente académico. Responde en español con evidencia y reconoce incertidumbre. Materia: ${subject.data.name}.`, user: message, agentId: input.agent_id });
    const saved = await db.from('messages').insert({ conversation_id: conversationId, user_id: user.id, role: 'assistant', agent_id: 'idsanna', content: answer.text, citations: [], usage: answer.usage });
    if (saved.error) return json({ error: 'assistant_persist_failed' }, 500);
    return json({ ok: true, conversation_id: conversationId, message: answer.text, provider: answer.provider, model: answer.model, usage: answer.usage });
  } catch { return json({ error: 'provider_request_failed' }, 502); }
});
