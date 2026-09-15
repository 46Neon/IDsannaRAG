(() => {
  const api=window.idsannaSupabase; const $=id=>document.getElementById(id); let subjectId=null;
  const status=t=>{const n=$('status');n.textContent=t;n.classList.remove('hidden')};
  const requireSession=()=>{if(!api.state.session?.user?.id)throw Error('AUTH_REQUIRED')};
  const run=async(fn)=>{try{status('Procesando…');await fn()}catch(e){status(e.message==='AUTH_REQUIRED'?'Inicia sesión primero.':'No se pudo completar la operación.')}};
  const showChat=text=>{$('chatbox').insertAdjacentHTML('beforeend',`<div class="bubble">${String(text).replace(/[<>&]/g,c=>({'<':'&lt;','>':'&gt;','&':'&amp;'}[c]))}</div>`)};
  document.addEventListener('DOMContentLoaded',()=>{
    const access=$('accessForm'); access.addEventListener('submit',e=>{e.preventDefault();run(async()=>{await api.authGrant($('email').value,$('password').value);$('logout').classList.remove('hidden');status('Sesión iniciada.');})});
    access.querySelector('[data-mode=signup]').onclick=()=>run(async()=>{await api.signUp($('email').value,$('password').value);status('Registro creado. Revisa tu correo si Supabase exige confirmación.')});
    $('logout').onclick=()=>{api.signOut();$('logout').classList.add('hidden');status('Sesión cerrada.')};
    $('subjectForm').onsubmit=e=>{e.preventDefault();run(async()=>{requireSession();const r=await api.insert('subjects',{owner_id:api.state.session.user.id,name:$('subjectName').value,description:$('subjectDescription').value,metadata:{unit:$('subjectUnit').value}});subjectId=r?.[0]?.id||null;status('Materia creada. Entrando a la sala de chat…');setTimeout(()=>{document.querySelector('[data-v=chat]').click()},250)})};
    $('chatForm').onsubmit=e=>{e.preventDefault();run(async()=>{requireSession();showChat($('message').value);const r=await api.invoke('chat-orchestrator',{subject_id:subjectId,message:$('message').value});showChat(r.answer||r.message||'Respuesta recibida.');$('message').value=''})};
    $('importBtn').onclick=()=>run(async()=>{requireSession();const f=$('knowledgeFile').files[0];if(!f)throw Error('FILE_REQUIRED');const r=await api.invoke('ingest-document',{subject_id:subjectId,file_name:f.name,mime_type:f.type,size:f.size});showChat(r.message||'Archivo enviado a procesamiento.')});
    $('evaluateBtn').onclick=()=>run(async()=>{requireSession();const f=$('workFile').files[0];if(!f)throw Error('FILE_REQUIRED');const r=await api.invoke('process-document',{subject_id:subjectId,file_name:f.name,mime_type:f.type,mode:'evaluate_apa_opel'});showChat(`Evaluación enviada: ${r.score||'pendiente'}/20`)})
    $('profileForm').onsubmit=e=>{e.preventDefault();run(async()=>{requireSession();await api.insert('learning_events',{user_id:api.state.session.user.id,event_type:'profile_update',payload:{username:$('username').value,bio:$('bio').value}});status('Perfil guardado. Para fotos falta configurar Storage seguro.')})};
  });
})();