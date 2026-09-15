/* Minimal Supabase REST/Auth client. Only public configuration belongs here. */
(() => {
  const state = { config: null, session: null };
  async function loadConfig() { const r = await fetch('config.json'); if (!r.ok) throw new Error('CONFIGURATION_PENDING'); state.config = await r.json(); if (!state.config.supabaseUrl || state.config.supabaseUrl.includes('YOUR_')) throw new Error('CONFIGURATION_PENDING'); }
  function headers() { if (!state.config) throw new Error('CONFIGURATION_PENDING'); const h = {'apikey': state.config.supabasePublishableKey, 'Content-Type':'application/json'}; if (state.session?.access_token) h.Authorization = `Bearer ${state.session.access_token}`; return h; }
  async function authGrant(email,password,grant='password') { await loadConfig(); const r=await fetch(`${state.config.supabaseUrl}/auth/v1/token?grant_type=${grant}`,{method:'POST',headers:headers(),body:JSON.stringify({email,password})}); if(!r.ok) throw new Error('AUTH_FAILED'); state.session=await r.json(); return state.session; }
  async function signUp(email,password) { await loadConfig(); const r=await fetch(`${state.config.supabaseUrl}/auth/v1/signup`,{method:'POST',headers:headers(),body:JSON.stringify({email,password})}); if(!r.ok) throw new Error('SIGNUP_FAILED'); return r.json(); }
  async function query(table,params='') { await loadConfig(); const r=await fetch(`${state.config.supabaseUrl}/rest/v1/${table}${params}`,{headers:headers()}); if(!r.ok) throw new Error('DATABASE_READ_FAILED'); return r.json(); }
  async function insert(table,value) { await loadConfig(); const r=await fetch(`${state.config.supabaseUrl}/rest/v1/${table}`,{method:'POST',headers:{...headers(),Prefer:'return=representation'},body:JSON.stringify(value)}); if(!r.ok) throw new Error('DATABASE_WRITE_FAILED'); return r.json(); }
  async function invoke(name,body) { await loadConfig(); const r=await fetch(`${state.config.supabaseUrl}/functions/v1/${name}`,{method:'POST',headers:headers(),body:JSON.stringify(body)}); const data=await r.json().catch(()=>({})); if(!r.ok) throw new Error(data.error || 'FUNCTION_FAILED'); return data; }
  window.idsannaSupabase={state,loadConfig,authGrant,signUp,query,insert,invoke};
})();
