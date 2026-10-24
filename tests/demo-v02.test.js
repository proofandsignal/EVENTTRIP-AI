import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {Script,runInNewContext} from "node:vm";

const html=readFileSync(new URL("../demo/EventTrip_AI_Test_Demo_v0.2.html",import.meta.url),"utf8");
const scripts=[...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)];
const script=scripts.map(x=>x[1]).join("\n");
const dataStart=script.indexOf("const samples=");
const dataEnd=script.indexOf("const $=");
const calcStart=script.indexOf("function compute(");
const calcEnd=script.indexOf("function make(");
if(dataStart<0||dataEnd<0||calcStart<0||calcEnd<0)throw Error("Demo engine declarations not found");
const engine=runInNewContext(
  script.slice(dataStart,dataEnd)+"\n"+script.slice(calcStart,calcEnd)+"\n({samples,compute})",
  Object.create(null)
);

test("standalone demo JavaScript compiles and includes no external scripts",()=>{
  assert.equal(scripts.length,1);
  assert.doesNotThrow(()=>new Script(script));
  assert.doesNotMatch(html,/<script[^>]+\bsrc=/i);
  assert.doesNotMatch(html,/href=["']https?:/i);
});

test("nine distinct synthetic destination and segment fixtures",()=>{
  const ids=engine.samples.map(x=>x.id);
  assert.equal(ids.length,9);
  assert.equal(new Set(ids).size,ids.length);
  for(const group of ["budget","luxury","events"]){
    assert.equal(engine.samples.filter(x=>x.group===group).length,3);
  }
  assert.match(html,/synthetic test fixtures/i);
  assert.match(html,/Changing dates does not reprice samples/i);
});

test("True Trip Cost includes five components and correctly scales group quantities",()=>{
  const vienna=engine.samples.find(x=>x.id==="vieb");
  const result=engine.compute(vienna,2,3);
  assert.equal(result.total,556);
  assert.equal(result.lines.length,5);
  assert.equal(result.lines[0].amount,184);
  assert.equal(result.lines[1].amount,252);
  assert.equal(result.lines[2].amount,50);
  assert.equal(result.lines[3].amount,36);
  assert.equal(result.lines[4].amount,34);
  assert.equal(engine.compute(vienna,1,1).total,253);
});

test("trip cost fails closed on invalid travelers or nights",()=>{
  const item=engine.samples[0];
  for(const [trav,nights] of [[0,2],[3,2],[1,0],[1,8],[1.5,2],[1,2.7]]){
    assert.throws(()=>engine.compute(item,trav,nights),/Invalid trip size/);
  }
});

test("booking stays disabled and affiliate status is not misrepresented",()=>{
  assert.match(html,/Booking unavailable — partner pending/);
  assert.match(html,/<button class="primary" type="button" disabled/);
  assert.match(html,/No referral URLs or tracking identifiers are active/);
  assert.match(html,/No external requests, accounts, checkout or analytics/);
  for(const id of ["search","destination","departure","nights","travelers","cards","details","detail-total","breakdown"]){
    assert.ok(html.includes('id="'+id+'"'),"Missing element: "+id);
  }
});
