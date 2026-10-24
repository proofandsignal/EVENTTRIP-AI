import {canPublishOffer} from "./partner-gate.js";

// Fail closed: permission inputs must come from a reviewed trusted source.
const MAX_LINK_REVIEW_AGE_MS=30*24*60*60*1000;
const str=x=>typeof x==="string"&&x.trim().length>0;
const deny=reason=>Object.freeze({ready:false,status:"BLOCKED",reason,bookingUrl:null,displayPrice:null});
function httpsUrl(raw){
  if(!str(raw))return null;
  try{
    const u=new URL(raw);
    if(u.protocol!=="https:"||u.username||u.password||(u.port&&u.port!=="443")||
       !u.hostname||u.hostname.endsWith("."))return null;
    return u;
  }catch{return null;}
}
function exactHost(host,allowlist){
  return Array.isArray(allowlist)&&allowlist.some(x=>str(x)&&x.toLowerCase()===host.toLowerCase());
}
export function evaluateReferral({project,partner,link,quote,now=Date.now()}={}){
  if(!Number.isFinite(now))return deny("INVALID_CLOCK");
  if(!project||project.status!=="VERIFIED"||!str(project.id)||project.channel!=="website"||
     !httpsUrl(project.websiteUrl))return deny("PROJECT_NOT_VERIFIED");
  if(!partner||partner.status!=="APPROVED"||partner.termsAccepted!==true||
     !str(partner.programId)||partner.projectId!==project.id||
     !str(partner.approvalEvidenceRef))return deny("PARTNER_NOT_APPROVED");
  if(partner.expiresAt!==undefined){
    const expiry=Date.parse(partner.expiresAt);
    if(!Number.isFinite(expiry)||expiry<=now)return deny("PARTNER_APPROVAL_EXPIRED");
  }
  // Script widgets require their own review; this policy only permits deeplinks.
  if(!link||link.status!=="VERIFIED"||link.type!=="DEEPLINK"||
     link.projectId!==project.id||link.programId!==partner.programId||
     !str(link.verificationEvidenceRef)||
     !Array.isArray(partner.allowedLinkTypes)||!partner.allowedLinkTypes.includes("DEEPLINK"))
    return deny("LINK_NOT_AUTHORIZED");
  const reviewedAt=Date.parse(link.verifiedAt??"");
  if(!Number.isFinite(reviewedAt)||reviewedAt>now||now-reviewedAt>MAX_LINK_REVIEW_AGE_MS)
    return deny("LINK_VERIFICATION_STALE");
  const url=httpsUrl(link.bookingUrl);
  if(!url||!exactHost(url.hostname,partner.approvedHosts))
    return deny("LINK_DESTINATION_NOT_ALLOWED");
  if(link.mode==="LINK_ONLY"){
    if(quote!==undefined||link.displayPrice!==undefined)return deny("PRICE_NOT_VERIFIED");
    return Object.freeze({ready:true,status:"LINK_READY",reason:"PRECHECK_ONLY",bookingUrl:link.bookingUrl,displayPrice:null});
  }
  if(link.mode==="PRICED_OFFER"){
    if(!quote||quote.bookingUrl!==link.bookingUrl||quote.programId!==partner.programId||
       quote.feeStatus!=="VERIFIED"||
       !canPublishOffer(quote,{approvedDomains:[url.hostname],now}))
      return deny("QUOTE_NOT_VERIFIED");
    return Object.freeze({ready:true,status:"PRICED_OFFER_READY",reason:"PRECHECK_ONLY",
      bookingUrl:link.bookingUrl,
      displayPrice:Object.freeze({amount:quote.price,currency:quote.currency,verifiedAt:quote.verifiedAt})});
  }
  return deny("UNKNOWN_MODE");
}
