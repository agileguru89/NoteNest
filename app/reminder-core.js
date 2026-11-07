(function(root){
'use strict';
const SOUNDS=Object.freeze({"chime":{"label":"Ding-dong · soft chime (default)","file":"reminder-chime.mp3"},"hey-female":{"label":"Hey! · female","file":"reminder-hey-female.mp3"},"hey-male":{"label":"Hey! · male","file":"reminder-hey-male.mp3"},"mmhm-female":{"label":"Mm-hm! · female","file":"reminder-mmhm-female.mp3"},"mmhm-male":{"label":"Mm-hm! · male","file":"reminder-mmhm-male.mp3"},"huhu-female":{"label":"Huhu · female (original)","file":"reminder-female.mp3"},"huhu-male":{"label":"Huhu · male (original)","file":"reminder-male.mp3"}});
function soundKey(settings={}){return Object.prototype.hasOwnProperty.call(SOUNDS,settings?.reminderSound)?settings.reminderSound:'chime';}

function instant(value){return typeof value==='string'&&value.trim()?Date.parse(value):NaN;}
function key(note){return Number.isFinite(instant(note.reminderSnoozedUntil))?note.reminderSnoozedUntil:note.reminderAt||'';}
function due(notes,time){
  return notes.filter(n=>!n.completed&&(String(n.title||'').trim()||String(n.todo||'').trim())&&
    Number.isFinite(instant(n.reminderAt))&&Number.isFinite(instant(key(n)))&&
    instant(key(n))<=time&&n.reminderDismissedFor!==key(n))
    .sort((a,b)=>instant(key(a))-instant(key(b)));
}
function fresh(notes,time){return due(notes,time).filter(n=>n.reminderFiredFor!==key(n));}
function mark(notes){for(const n of notes)n.reminderFiredFor=key(n);}
function dismiss(note){note.reminderDismissedFor=key(note);}
function snooze(note,time,minutes=10){note.reminderSnoozedUntil=new Date(time+minutes*60000).toISOString();}
function toLocal(value){
  const d=new Date(value);if(!Number.isFinite(d.getTime()))return '';
  const pad=x=>String(x).padStart(2,'0');
  return d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate())+'T'+pad(d.getHours())+':'+pad(d.getMinutes());
}
function fromLocal(value){
  if(!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value))return '';
  const d=new Date(value);
  return Number.isFinite(d.getTime())&&toLocal(d)===value?d.toISOString():'';
}
const api={SOUNDS,soundKey,instant,key,due,fresh,mark,dismiss,snooze,toLocal,fromLocal};
if(typeof module==='object')module.exports=api;else root.ReminderModel=api;
})(typeof globalThis!=='undefined'?globalThis:this);
