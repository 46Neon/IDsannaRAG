/* IDsanna interaction polish: accessibility and safe form feedback. */
(()=>{
  const status=document.getElementById('status');
  if(status){status.setAttribute('role','status');status.setAttribute('aria-live','polite');}
  const nav=document.querySelector('.bar');
  if(nav){nav.setAttribute('role','navigation');nav.setAttribute('aria-label','Navegación principal');}
  document.querySelectorAll('form').forEach(form=>{
    form.addEventListener('submit',()=>{
      const button=form.querySelector('button[type="submit"],button:not([type])');
      if(!button||button.dataset.busy==='1')return;
      button.dataset.busy='1';button.dataset.originalText=button.textContent;
      button.textContent='Procesando…';button.disabled=true;
      setTimeout(()=>{button.dataset.busy='0';button.textContent=button.dataset.originalText||'Continuar';button.disabled=false},35000);
    });
  });
  document.querySelectorAll('button').forEach(button=>{
    button.addEventListener('keydown',event=>{if(event.key===' '){event.preventDefault();button.click()}});
  });
})();