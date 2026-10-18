import test from "node:test";
import assert from "node:assert/strict";
import {TRIP_IDEAS} from "../src/data/trip-ideas.js";
import {filterIdeas} from "../src/core/search.js";
import {calculateTripCost} from "../src/core/cost.js";
import {canPublishOffer} from "../src/core/partner-gate.js";

test("all three segments exist and fixture items do not pose as offers",()=>{
  assert.deepEqual([...new Set(TRIP_IDEAS.map(x=>x.segment))].sort(),["budget","events","luxury"]);
  assert.ok(TRIP_IDEAS.every(x=>!Object.hasOwn(x,"price")&&!Object.hasOwn(x,"bookingUrl")));
});
test("combined query, destination and segment filtering",()=>{
  const result=filterIdeas(TRIP_IDEAS,{query:"festive",destination:"Vienna",segment:"events"});
  assert.equal(result.length,1);
  assert.equal(result[0].id,"vie-events");
  assert.equal(filterIdeas(TRIP_IDEAS,{query:"xyzmissing"}).length,0);
  assert.equal(filterIdeas(TRIP_IDEAS,{segment:"invalid"}).length,0);
});
test("true trip cost has explicit quantities",()=>{
  const result=calculateTripCost({travelers:2,nights:3,flight:70,hotelNight:110,eventTicket:85,baggage:20,transfers:35});
  assert.equal(result.total,715);
  assert.equal(result.perTraveler,357.5);
  assert.deepEqual(result.breakdown,{flights:140,hotel:330,events:170,baggage:40,transfers:35});
});
test("missing quotes never become apparent free travel",()=>{
  assert.equal(calculateTripCost({flight:"",hotelNight:"",eventTicket:""}).total,null);
});
test("negative, invalid and infinite numbers are rejected",()=>{
  assert.equal(calculateTripCost({flight:-10}).hasEstimate,false);
  assert.equal(calculateTripCost({flight:"Infinity"}).hasEstimate,false);
  assert.equal(calculateTripCost({travelers:0,flight:10}).total,null);
});
const offer={status:"VERIFIED",partnerApproval:true,sourceId:"source:1",price:100,currency:"EUR",verifiedAt:"2026-10-17T08:00:00Z",bookingUrl:"https://booking.partner.example/trip"};
const cfg={approvedDomains:["partner.example"],now:Date.parse("2026-10-17T08:15:00Z")};
test("no approval or provenance means no bookable CTA",()=>{
  assert.equal(canPublishOffer(offer),false);
  assert.equal(canPublishOffer({...offer,partnerApproval:false},cfg),false);
  assert.equal(canPublishOffer({...offer,sourceId:""},cfg),false);
});
test("only recent, approved HTTPS quotes with valid price can publish",()=>{
  assert.equal(canPublishOffer(offer,cfg),true);
  assert.equal(canPublishOffer({...offer,verifiedAt:"2026-10-14T08:00:00Z"},cfg),false);
  assert.equal(canPublishOffer({...offer,price:0},cfg),false);
  assert.equal(canPublishOffer({...offer,bookingUrl:"http://partner.example/trip"},cfg),false);
  assert.equal(canPublishOffer({...offer,bookingUrl:"https://partner.example.evil.test/"},cfg),false);
  assert.equal(canPublishOffer({...offer,bookingUrl:"https://evil.test/"},cfg),false);
});

test("partial manual estimates identify omitted cost components",()=>{
  const partial=calculateTripCost({travelers:2,flight:40,hotelNight:100});
  assert.equal(partial.total,180);
  assert.equal(partial.complete,false);
  assert.deepEqual(partial.missingComponents,["eventTicket","baggage","transfers"]);
  const complete=calculateTripCost({travelers:2,nights:2,flight:40,hotelNight:100,eventTicket:0,baggage:0,transfers:0});
  assert.equal(complete.total,280);
  assert.equal(complete.complete,true);
});
test("invalid quantities and non-finite costs cannot produce a numeric total",()=>{
  for(const item of [{travelers:0,flight:10},{travelers:21,flight:10},{nights:31,flight:10},{hotelNight:-10},{baggage:"Infinity"},{flight:true}]){
    const result=calculateTripCost(item);
    assert.equal(result.valid,false);
    assert.equal(result.total,null);
  }
  assert.equal(calculateTripCost({flight:"  "}).hasEstimate,false);
});
test("expired offers, URL credentials, unexpected ports and unsafe time config are rejected",()=>{
  assert.equal(canPublishOffer({...offer,expiresAt:"2026-10-17T08:10:00Z"},cfg),false);
  assert.equal(canPublishOffer({...offer,expiresAt:"nonsense"},cfg),false);
  assert.equal(canPublishOffer({...offer,expiresAt:"2026-10-17T09:00:00Z"},cfg),true);
  assert.equal(canPublishOffer({...offer,bookingUrl:"https://user:pass@booking.partner.example/trip"},cfg),false);
  assert.equal(canPublishOffer({...offer,bookingUrl:"https://booking.partner.example:444/trip"},cfg),false);
  assert.equal(canPublishOffer(offer,{...cfg,maxQuoteAgeMs:-1}),false);
});
