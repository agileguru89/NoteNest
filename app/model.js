(function(root){'use strict';
const THEMES={cork:{name:'The classic corner',image:'room-cork.png',bounds:[.059,.043,.881,.852]},linen:{name:'The linen studio',image:'room-linen.png',bounds:[.095,.055,.818,.809]},evening:{name:'The evening loft',image:'room-evening.png',bounds:[.107,.069,.779,.736]},garden:{name:'The garden workroom',image:'room-garden.png',bounds:[.107,.061,.786,.788]}};
const PAPERS={butter:{label:'Yellow sticky note',color:'#f4db80',kind:'square'},rose:{label:'Pink sticky note',color:'#edbec7',kind:'square'},mint:{label:'Green sticky note',color:'#cbd9b3',kind:'square'},lined:{label:'White lined note',color:'#faf8f0',kind:'tall'}};
function clamp(v,min,max){return Math.max(min,Math.min(max,v));}
function makeNote(paper,x,y,now,id){if(!PAPERS[paper])paper='butter';return {id:id,title:'',todo:'',category:'',due:'',paper,fastener:paper==='kraft'?'clip':'pin',x:clamp(x,0,1),y:clamp(y,0,1),rotation:((id.charCodeAt(0)%9)-4)*.7,z:1,created:now,updated:now,completed:null,revision:1,syncedRevision:0};}
function editNote(note,patch,now){const keys=['title','todo','category','due','paper','fastener','completed'];let dirty=false;for(const k of keys)if(k in patch&&note[k]!==patch[k]){note[k]=String(patch[k]??'');if(k==='completed'&&!patch[k])note[k]=null;dirty=true;}for(const k of ['x','y'])if(k in patch)note[k]=clamp(Number(patch[k])||0,0,1);if('rotation'in patch)note.rotation=clamp(Number(patch.rotation)||0,-12,12);if('z'in patch)note.z=Number(patch.z)||1;if(dirty){note.revision++;note.updated=now;}return note;}
function visible(notes){return notes.filter(n=>!n.completed);}
function archive(notes){return notes.filter(n=>n.completed).sort((a,b)=>b.completed.localeCompare(a.completed));}
function pending(notes){return notes.filter(n=>(n.title.trim()||n.todo.trim())&&n.revision>(n.syncedRevision||0));}
function applyAck(notes,acks){for(const a of acks||[]){const n=notes.find(n=>n.id===a.id);if(n)n.syncedRevision=Math.max(n.syncedRevision||0,Math.min(a.revision,n.revision));}return notes;}
const api={THEMES,PAPERS,clamp,makeNote,editNote,visible,archive,pending,applyAck};if(typeof module==='object')module.exports=api;else root.NoteModel=api;
})(typeof globalThis!=='undefined'?globalThis:this);
