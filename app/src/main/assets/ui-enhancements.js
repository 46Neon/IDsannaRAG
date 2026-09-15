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
  document.querySelectorAll('input,textarea,select').forEach(field=>{
    if(!field.id)return;
    const label=document.querySelector(`label[for="${field.id}"]`);
    if(!label&&!field.getAttribute('aria-label')){
      const wrapper=field.closest('.field');
      const text=wrapper?.childNodes?.[0]?.textContent?.trim();
      if(text)field.setAttribute('aria-label',text);
    }
    field.addEventListener('invalid',()=>field.closest('.field')?.classList.add('has-error'));
    field.addEventListener('input',()=>field.closest('.field')?.classList.remove('has-error'));
  });
  document.querySelectorAll('a[target="_blank"]').forEach(link=>link.rel='noopener noreferrer');
  document.querySelectorAll('.view').forEach(view=>view.setAttribute('aria-labelledby',`${view.id}-title`));
  document.querySelectorAll('.view h1').forEach(title=>{if(!title.id)title.id=`${title.closest('.view')?.id}-title`;title.setAttribute('tabindex','-1')});
  document.querySelectorAll('[data-v]').forEach(link=>link.addEventListener('click',()=>setTimeout(()=>document.querySelector(`#${link.dataset.v} h1`)?.focus(),30)));
  document.querySelectorAll('.panel:empty,.card:empty').forEach(box=>{box.classList.add('empty-state');box.innerHTML='<strong>Aún no hay información</strong><span>Cuando completes una actividad, aparecerá aquí.</span>'});
})();