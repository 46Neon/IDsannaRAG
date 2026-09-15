(() => {
  const api = window.idsannaSupabase;
  const status = (text) => { let node = document.querySelector('[data-supabase-status]'); if (!node) { node = document.createElement('div'); node.dataset.supabaseStatus=''; node.className='notice'; document.querySelector('.main')?.prepend(node); } node.textContent = text; };
  const run = async (work, success) => { try { status('Conectando con Supabase…'); await work(); status(success); } catch (error) { status(error.message === 'CONFIGURATION_PENDING' ? 'Configuración pública pendiente.' : 'No se pudo completar la operación.'); } };
  document.addEventListener('DOMContentLoaded', () => {
    const access = document.querySelector('#access form');
    if (access) access.addEventListener('submit', (event) => { event.preventDefault(); const fields = access.querySelectorAll('input'); run(() => api.authGrant(fields[0].value, fields[1].value), 'Sesión iniciada.'); });
    const subject = document.getElementById('subjectForm');
    if (subject) subject.addEventListener('submit', (event) => { event.preventDefault(); run(async () => { const session=api.state.session; if (!session?.user?.id) throw new Error('AUTH_REQUIRED'); await api.insert('subjects', { owner_id: session.user.id, name: document.getElementById('subjectName').value, description: document.getElementById('subjectGoal').value, metadata: { area: document.getElementById('subjectArea').value } }); }, 'Materia guardada en Supabase.'); });
    const chat = document.getElementById('chatForm');
    if (chat) chat.addEventListener('submit', (event) => { event.preventDefault(); const input=document.getElementById('message'); run(async () => { if (!api.state.session) throw new Error('AUTH_REQUIRED'); await api.invoke('chat-orchestrator', { subject_id: new URLSearchParams(location.search).get('subject'), message: input.value }); input.value=''; }, 'Solicitud enviada al orquestador.'); });
  });
})();
