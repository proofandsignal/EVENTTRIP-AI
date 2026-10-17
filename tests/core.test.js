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
  assert.equal(calculateTripCost({travelers:0,flight:10}).total,10);
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
