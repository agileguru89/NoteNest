const assert=require('node:assert/strict'),M=require('./app/model.js');
assert.equal(Object.keys(M.PAPERS).length,4);assert.equal(M.PAPERS.lined.kind,'tall');
const n=M.makeNote('rose',2,-1,'2026-11-06T12:00:00Z','12345678-1234-1234-1234-123456789012');assert.equal(n.x,1);assert.equal(n.y,0);
M.editNote(n,{title:'Doktor sitesi',todo:'Türkçe içerik: ı İ ş ğ ü ö ç',due:'2026-11-10'},'2026-11-06T12:01:00Z');const rev=n.revision;
assert.equal(M.pending([n]).length,1);M.editNote(n,{x:.3,y:.4},'2026-11-06T12:02:00Z');assert.equal(n.revision,rev,'Moving paper must not create a new archive revision');
M.applyAck([n],[{id:n.id,revision:rev}]);assert.equal(M.pending([n]).length,0);M.editNote(n,{todo:'New edit'},'2026-11-06T12:03:00Z');M.applyAck([n],[{id:n.id,revision:rev}]);assert.equal(M.pending([n]).length,1,'A late sync response must not acknowledge newer text');
M.editNote(n,{completed:'2026-11-06T12:04:00Z'},'2026-11-06T12:04:00Z');assert.equal(M.visible([n]).length,0);assert.equal(M.archive([n]).length,1);assert.equal(n.paper,'rose');M.editNote(n,{completed:null},'2026-11-06T12:05:00Z');assert.equal(M.visible([n]).length,1);assert.equal(M.archive([n]).length,0);assert.equal(n.todo,'New edit');
assert.equal(M.pending([M.makeNote('butter',0,0,'2026-11-06T12:00:00Z','a')]).length,0,'Blank papers do not fill the Google archive');
console.log('PASS: four paper types, clamped positions, lossless text, move without archive rewrite, late-ack safety, complete/restore, blank paper exclusion');
