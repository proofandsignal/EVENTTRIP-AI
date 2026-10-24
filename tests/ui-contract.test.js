import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const html=readFileSync(new URL("../index.html",import.meta.url),"utf8");
const app=readFileSync(new URL("../src/app.js",import.meta.url),"utf8");
const css=readFileSync(new URL("../src/styles.css",import.meta.url),"utf8");

test("all DOM ids referenced by UI script exist in HTML",()=>{
  const ids=[...app.matchAll(/\$\("#([A-Za-z][A-Za-z0-9-]*)"\)/g)].map(match=>match[1]);
  for(const id of new Set(ids)){
    assert.match(html,new RegExp("id=[\"']"+id+"[\"']"),"missing #"+id);
  }
  assert.match(html,/id="cost-total-label"/);
});
test("discovery controls expose accessible, named categories",()=>{
  assert.match(html,/<html lang="en">/);
  assert.match(html,/<form[^>]*id="search-form"[^>]*role="search"/);
  for(const segment of ["all","budget","luxury","events"]){
    assert.match(html,new RegExp('data-segment="'+segment+'"'));
  }
  for(const field of ["search-query","destination","travelers","nights","flight","hotelNight","eventTicket","baggage","transfers"]){
    assert.match(html,new RegExp('<label for="'+field+'"'));
    assert.match(html,new RegExp('id="'+field+'"'));
  }
  assert.match(html,/RESEARCH PREVIEW/);
  assert.match(html,/No live flight prices, event tickets or booking links yet/);
});
test("responsive styles and honest estimate disclosures remain",()=>{
  assert.match(css,/@media\(max-width:760px\)/);
  assert.match(css, /:focus-visible/);
  assert.match(html,/PARTIAL TRIP ESTIMATE/);
  assert.doesNotMatch(html,/eventtrip<span class="accent">\.ai<\/span>/);
});
