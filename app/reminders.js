'use strict';
const NoteReminders=(()=>{
  const R=ReminderModel;
  let ready=false,checking=false,activeAudio=null,latestDue=[],timer=null,pausedForSave=false;
  function volume(){const v=store.settings.reminderVolume;return typeof v==='number'&&Number.isFinite(v)?M.clamp(v,0,1):.3;}
  function voice(){return store.settings.reminderVoice==='male'?'male':'female';}
  async function play(preview=false){
    if(!preview&&(store.settings.muted||store.settings.remindersMuted||volume()===0))return;
    if(activeAudio){activeAudio.pause();activeAudio=null;}
    const a=new Audio('assets/reminder-'+voice()+'.mp3');a.volume=volume();activeAudio=a;
    let played=false;try{await a.play();played=true;}catch{if(preview)toast('Sound could not play. Check your audio output.');}
    a.onended=()=>{if(activeAudio===a)activeAudio=null;};return played;
  }
  function refresh(time=Date.now()){
    latestDue=R.due(store.notes,time);
    const active=new Set(latestDue.map(n=>n.id));
    document.querySelectorAll('.note').forEach(el=>{
      const n=store.notes.find(n=>n.id===el.dataset.id),b=el.querySelector('.reminder-open');
      el.classList.toggle('reminder-due',active.has(el.dataset.id));
      if(b&&n){b.classList.toggle('has-reminder',!!n.reminderAt);b.title=n.reminderAt?'Reminder: '+stamp(R.key(n)):'Set a reminder';b.setAttribute('aria-label',b.title);}
    });
    const banner=$('#reminder-banner');if(!banner)return;
    const n=latestDue[0];banner.hidden=!n;
    if(!n)return;
    const heading=n.title||'Your note';if($('#reminder-title').textContent!==heading)$('#reminder-title').textContent=heading;
    const summary=(latestDue.length>1?latestDue.length+' notes ready · ':'')+stamp(R.key(n));if($('#reminder-summary').textContent!==summary)$('#reminder-summary').textContent=summary;
    banner.dataset.id=n.id;
  }
  async function check(time=Date.now()){
    if(!ready||checking||pausedForSave)return;
    checking=true;
    try{
      const arrivals=R.fresh(store.notes,time),before=arrivals.map(n=>({id:n.id,old:n.reminderFiredFor,key:R.key(n)}));
      if(arrivals.length){
        R.mark(arrivals);
        try{if(!await save(false))throw Error('Reminder state was not saved');}catch(e){for(const b of before){const n=store.notes.find(n=>n.id===b.id);if(n&&n.reminderFiredFor===b.key)n.reminderFiredFor=b.old;}throw e;}
        const stillDue=new Set(R.due(store.notes,time).map(n=>n.id));
        if(arrivals.some(n=>stillDue.has(n.id))){
          if(window.__NOTENEST_TEST__)(window.__reminderBatches??=[]).push(arrivals.filter(n=>stillDue.has(n.id)).map(n=>n.id));
          const played=await play();if(window.__NOTENEST_TEST__)window.__lastReminderAudioPlayed=!!played;
        }
      }
      refresh(time);
    }finally{checking=false;}
  }
  function focusNote(id){
    if($('#modal').open)$('#modal').close();
    NoteEffects.setZoom(1);const el=$('#board').querySelector('[data-id="'+id+'"]');
    if(el){el.querySelector('.title').focus({preventScroll:true});el.classList.add('reminder-viewed');setTimeout(()=>el.classList.remove('reminder-viewed'),1600);}
  }
  function act(action){
    const n=store.notes.find(n=>n.id===$('#reminder-banner').dataset.id);if(!n)return;
    if(action==='view'){focusNote(n.id);return;}
    if(action==='snooze')R.snooze(n,Date.now());else R.dismiss(n);
    changed(false);refresh();check().catch(()=>{});
  }
  function showNote(id){
    const n=store.notes.find(n=>n.id===id);if(!n||n.completed)return;
    const local=n.reminderAt?R.toLocal(n.reminderAt):n.due?n.due+'T09:00':R.toLocal(Date.now()+600000);
    modal('<p class="eyebrow">A gentle nudge</p><h1>A little reminder.</h1><p>'+esc(n.title||'Your note')+'</p>'+
      '<label class="reminder-label" for="reminder-at">Remind me on</label><input id="reminder-at" class="reminder-datetime" type="datetime-local" value="'+esc(local)+'">'+
      '<p class="small muted">Your computer’s local time. NoteNest must be open. One soft “huhu”, with no repeating alarm. Date-only notes do not make a sound.</p>'+
      '<div class="actions"><button class="primary" id="reminder-save">Save reminder</button><button class="secondary" id="reminder-clear">Remove reminder</button><button class="secondary" id="reminder-options">Sound settings</button></div>'+
      '<p id="reminder-error" class="reminder-error" role="status"></p>');
    $('#reminder-save').onclick=async()=>{
      const iso=R.fromLocal($('#reminder-at').value),error=$('#reminder-error');
      if(!iso||Date.parse(iso)<=Date.now()){error.textContent='Choose a valid future date and time.';return;}
      pausedForSave=true;
      try{
        M.editNote(n,{reminderAt:iso},now());if(!await save(false))throw Error('Reminder was not saved');render();$('#modal').close();toast('Reminder set for '+stamp(iso)+'.');
      }catch(e){error.textContent='Could not save the reminder. Your note is kept locally.';}finally{pausedForSave=false;}
    };
    $('#reminder-clear').onclick=async()=>{
      try{M.editNote(n,{reminderAt:''},now());if(!await save(false))throw Error('Reminder was not saved');render();$('#modal').close();refresh();toast('Reminder removed. Your note is unchanged.');}catch(e){$('#reminder-error').textContent='Could not save this change. Please try again.';}
    };
    $('#reminder-options').onclick=showSettings;
  }
  function showSettings(){
    const scheduled=store.notes.filter(n=>!n.completed&&n.reminderAt).sort((a,b)=>R.instant(R.key(a))-R.instant(R.key(b)));
    modal('<p class="eyebrow">Quietly, at the right time</p><h1>A friendly “huhu”.</h1>'+
      '<p>Pick a gentle voice. Reminders run only while NoteNest is open, including when minimized. Missed reminders appear once when you next open it.</p>'+
      '<div class="reminder-controls"><label for="reminder-voice">Voice</label><select id="reminder-voice"><option value="female">Female · soft and friendly</option><option value="male">Male · soft and friendly</option></select>'+
      '<label for="reminder-volume">Volume <span id="reminder-volume-value">'+Math.round(volume()*100)+'%</span></label><input id="reminder-volume" type="range" min="0" max="100" step="5" value="'+Math.round(volume()*100)+'">'+
      '<label class="reminder-mute"><input id="reminders-muted" type="checkbox" '+(store.settings.remindersMuted?'checked':'')+'> Silent reminders (visual only)</label></div>'+
      '<div class="actions"><button class="secondary" id="reminder-preview">Preview “huhu”</button><button class="primary" id="reminder-settings-done">Back to my board</button></div>'+
      '<p class="small muted">The main ♪ mute also silences reminders. Preview plays the selected voice at this volume. No audio is generated online when a reminder plays.</p>'+
      '<h2>Your reminders</h2>'+(!scheduled.length?'<p>Use the small clock on a note to add its date and time.</p>':scheduled.map(n=>'<div class="reminder-list-row"><button class="reminder-note-link" data-reminder-edit="'+esc(n.id)+'">'+esc(n.title||'Your note')+'</button><span>'+esc(stamp(R.key(n)))+(n.reminderDismissedFor===R.key(n)?' · dismissed':'')+'</span></div>').join('')));
    $('#reminder-voice').value=voice();
    $('#reminder-voice').onchange=e=>{store.settings.reminderVoice=e.target.value;changed(false);};
    $('#reminder-volume').oninput=e=>{store.settings.reminderVolume=Number(e.target.value)/100;$('#reminder-volume-value').textContent=e.target.value+'%';changed(false);};
    $('#reminders-muted').onchange=e=>{store.settings.remindersMuted=e.target.checked;changed(false);};
    $('#reminder-preview').onclick=()=>play(true);$('#reminder-settings-done').onclick=()=>$('#modal').close();
    document.querySelectorAll('[data-reminder-edit]').forEach(b=>b.onclick=()=>showNote(b.dataset.reminderEdit));
  }
  function init(){
    if(ready)return;
    $('#tools').insertAdjacentHTML('beforeend','<button id="reminder-settings" title="Reminders" aria-label="Reminders">◷</button>');
    $('#reminder-settings').onclick=showSettings;
    $('#room').insertAdjacentHTML('beforeend','<aside id="reminder-banner" aria-label="Note reminder" role="status" hidden><span class="reminder-kicker">A little nudge</span><strong id="reminder-title"></strong><small id="reminder-summary"></small><div><button id="reminder-view">View note</button><button id="reminder-snooze">10 min later</button><button id="reminder-dismiss">Dismiss</button></div></aside>');
    $('#reminder-view').onclick=()=>act('view');$('#reminder-snooze').onclick=()=>act('snooze');$('#reminder-dismiss').onclick=()=>act('dismiss');
    ready=true;timer=setInterval(()=>check().catch(()=>{}),10000);
    window.addEventListener('focus',()=>check().catch(()=>{}));
    document.addEventListener('visibilitychange',()=>{if(!document.hidden)check().catch(()=>{});});
    check().catch(()=>{});
  }
  return {init,check,refresh,showNote,showSettings,play};
})();
