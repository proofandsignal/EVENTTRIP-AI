import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { Script, runInNewContext } from 'node:vm';

const html = readFileSync(new URL('../demo/EventTrip_AI_Test_Demo_v0.3.html', import.meta.url), 'utf8');
const scripts = [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)];
const js = scripts.map(m => m[1]).join('\n');
const a = js.indexOf('const samples=');
const b = js.indexOf('const $=');
const c = js.indexOf('function compute(');
const d = js.indexOf('function make(');
assert.ok(a >= 0 && b > a && c > b && d > c);
const engine = runInNewContext(js.slice(a,b)+'\n'+js.slice(c,d)+'\n({samples,compute,comparisonRank})', Object.create(null));

test('offline standalone demo compiles, no external scripts or booking endpoints', () => {
 assert.equal(scripts.length,1);
 assert.doesNotThrow(() => new Script(js));
 assert.doesNotMatch(html, /<script[^>]+src=/i);
 assert.doesNotMatch(html, /href=["']https?:/i);
 assert.match(html, /Booking unavailable — partner pending/);
 assert.match(html, /No referral URLs or tracking identifiers are active/);
 assert.match(html, /all combinations and amounts below are synthetic test fixtures/i);
});
test('synthetic samples cover budget, luxury and events', () => {
 assert.equal(engine.samples.length,9);
 assert.equal(new Set(engine.samples.map(x => x.id)).size,9);
 for (const seg of ['budget','luxury','events']) assert.equal(engine.samples.filter(x=>x.group===seg).length,3);
});
test('Vienna total includes transport, hotel nights, event tickets, luggage and transfers', () => {
 const trip=engine.samples.find(x=>x.id==='vieb');
 const got=engine.compute(trip,2,3);
 assert.equal(got.total,556);
 assert.deepEqual(Array.from(got.lines,x=>x.amount),[184,252,50,36,34]);
 assert.equal(engine.compute(trip,1,1).total,253);
});
test('comparison ranks multiple different synthetic trips with consistent travelers and nights', () => {
 const got=engine.comparisonRank(['viel','vieb','lone'],2,3);
 assert.deepEqual(Array.from(got,x=>x.item.id),['vieb','lone','viel']);
 assert.ok(got[0].total<got[1].total && got[1].total<got[2].total);
 const changed=engine.comparisonRank(['viel','vieb'],1,1);
 assert.equal(changed.length,2);
 assert.equal(changed[0].total,253);
});
test('unknown trip IDs cannot be compared and invalid trip quantities are rejected', () => {
 assert.equal(engine.comparisonRank(['unknown'],2,2).length,0);
 for (const [travelers,nights] of [[0,3],[3,3],[1,0],[1,8],[1.5,2],[2,2.5]]){
  assert.throws(()=>engine.compute(engine.samples[0],travelers,nights),/Invalid trip size/);
 }
});
test('comparison and checkout controls exist with safe labels and hard 3-choice cap', () => {
 for (const id of ['show-comparison','comparison','comparison-cards','clear-comparison','compare-note']){
  assert.match(html,new RegExp('id="'+id+'"'));
 }
 assert.match(js,/selectedIds\.length>=3/);
 assert.match(js,/setAttribute\("aria-pressed"/);
 assert.match(js,/compareId=item\.id/);
 assert.match(js,/next\.focus\(\)/);
 assert.match(html, /type="button" disabled title="Partner access required"/);
 assert.match(js,/departure\.min=yyyy/);
 assert.match(html,/Changing dates does not reprice samples/);
});
