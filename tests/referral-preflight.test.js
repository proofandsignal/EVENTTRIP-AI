import test from "node:test";
import assert from "node:assert/strict";
import {evaluateReferral} from "../src/core/referral-preflight.js";
import {VERIFIED_PARTNER_PERMISSIONS} from "../src/data/partner-permissions.js";
const now=Date.parse("2026-10-24T09:00:00Z");
const project={id:"p:test",status:"VERIFIED",channel:"website",websiteUrl:"https://eventtrip.example"};
const partner={projectId:"p:test",programId:"program:test",status:"APPROVED",termsAccepted:true,
  approvalEvidenceRef:"review:test",allowedLinkTypes:["DEEPLINK"],approvedHosts:["go.partner.example"]};
const link={projectId:"p:test",programId:"program:test",status:"VERIFIED",type:"DEEPLINK",mode:"LINK_ONLY",
  verificationEvidenceRef:"link:test",verifiedAt:"2026-10-24T08:00:00Z",
  bookingUrl:"https://go.partner.example/offer"};
const ctx={project,partner,link,now};
const testBlock=(name,fields,reason)=>test(name,()=>{
  const d=evaluateReferral({...ctx,...fields});
  assert.equal(d.ready,false);assert.equal(d.bookingUrl,null);assert.equal(d.reason,reason);
});
test("public registry is empty and default blocked",()=>{
  assert.equal(VERIFIED_PARTNER_PERMISSIONS.length,0);
  assert.equal(evaluateReferral({}).status,"BLOCKED");
});
test("fictional deeplink preflight never exposes price",()=>{
  const d=evaluateReferral(ctx);
  assert.equal(d.ready,true);assert.equal(d.status,"LINK_READY");
  assert.equal(d.displayPrice,null);assert.equal(d.bookingUrl,link.bookingUrl);
});
testBlock("missing project", {project:null},"PROJECT_NOT_VERIFIED");
testBlock("unverified project URL", {project:{...project,websiteUrl:"http://eventtrip.example"}},"PROJECT_NOT_VERIFIED");
testBlock("wrong project", {partner:{...partner,projectId:"different"}},"PARTNER_NOT_APPROVED");
testBlock("pending partner", {partner:{...partner,status:"PENDING"}},"PARTNER_NOT_APPROVED");
testBlock("missing approval evidence", {partner:{...partner,approvalEvidenceRef:""}},"PARTNER_NOT_APPROVED");
testBlock("partner terms not accepted", {partner:{...partner,termsAccepted:false}},"PARTNER_NOT_APPROVED");
testBlock("expired partner", {partner:{...partner,expiresAt:"2026-10-24T08:59:00Z"}},"PARTNER_APPROVAL_EXPIRED");
testBlock("future-dated link", {link:{...link,verifiedAt:"2026-10-25T08:00:00Z"}},"LINK_VERIFICATION_STALE");
testBlock("stale link", {link:{...link,verifiedAt:"2026-08-01T08:00:00Z"}},"LINK_VERIFICATION_STALE");
testBlock("link wrong project", {link:{...link,projectId:"other"}},"LINK_NOT_AUTHORIZED");
testBlock("unreviewed widget", {link:{...link,type:"WIDGET"}},"LINK_NOT_AUTHORIZED");
testBlock("wrong destination host", {link:{...link,bookingUrl:"https://evil.example/"}},"LINK_DESTINATION_NOT_ALLOWED");
testBlock("lookalike host", {link:{...link,bookingUrl:"https://go.partner.example.evil.example/"}},"LINK_DESTINATION_NOT_ALLOWED");
testBlock("unlisted child host", {link:{...link,bookingUrl:"https://other.go.partner.example/offer"}},"LINK_DESTINATION_NOT_ALLOWED");
testBlock("URL credentials", {link:{...link,bookingUrl:"https://u:p@go.partner.example/offer"}},"LINK_DESTINATION_NOT_ALLOWED");
testBlock("unexpected port", {link:{...link,bookingUrl:"https://go.partner.example:444/offer"}},"LINK_DESTINATION_NOT_ALLOWED");
testBlock("unsafe scheme", {link:{...link,bookingUrl:"javascript:alert(1)"}},"LINK_DESTINATION_NOT_ALLOWED");
testBlock("link-only with price", {link:{...link,displayPrice:25}},"PRICE_NOT_VERIFIED");
testBlock("link-only with quote", {quote:{price:25}},"PRICE_NOT_VERIFIED");
testBlock("priced offer without quote", {link:{...link,mode:"PRICED_OFFER"}},"QUOTE_NOT_VERIFIED");
const pricedLink={...link,mode:"PRICED_OFFER"};
const quote={status:"VERIFIED",partnerApproval:true,sourceId:"quote:test",programId:partner.programId,
  feeStatus:"VERIFIED",price:120,currency:"EUR",verifiedAt:"2026-10-24T08:20:00Z",
  bookingUrl:link.bookingUrl};
test("trusted priced offer can pass only with verified source, price and fees",()=>{
  const d=evaluateReferral({...ctx,link:pricedLink,quote});
  assert.equal(d.status,"PRICED_OFFER_READY");
  assert.deepEqual(d.displayPrice,{amount:120,currency:"EUR",verifiedAt:quote.verifiedAt});
});
testBlock("expired quoted price", {link:pricedLink,quote:{...quote,verifiedAt:"2026-10-22T08:20:00Z"}},"QUOTE_NOT_VERIFIED");
testBlock("mismatched quote link", {link:pricedLink,quote:{...quote,bookingUrl:"https://go.partner.example/other"}},"QUOTE_NOT_VERIFIED");
testBlock("unverified fees", {link:pricedLink,quote:{...quote,feeStatus:"UNKNOWN"}},"QUOTE_NOT_VERIFIED");
testBlock("different quote program", {link:pricedLink,quote:{...quote,programId:"other"}},"QUOTE_NOT_VERIFIED");
