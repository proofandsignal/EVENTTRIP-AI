// Fail closed: no real booking CTA without a documented approved partner.
function hostAllowed(hostname,domains){
  return domains.some(domain=>{
    const approved=String(domain).trim().toLowerCase();
    return approved.length>0&&(hostname===approved||hostname.endsWith("."+approved));
  });
}
export function canPublishOffer(offer,{approvedDomains=[],now=Date.now(),maxQuoteAgeMs=24*60*60*1000}={}){
  if(!offer||offer.status!=="VERIFIED"||offer.partnerApproval!==true||!offer.sourceId)return false;
  if(!Number.isFinite(offer.price)||offer.price<=0)return false;
  if(!/^[A-Z]{3}$/.test(offer.currency??""))return false;
  const quoteTime=Date.parse(offer.verifiedAt??"");
  if(!Number.isFinite(quoteTime)||quoteTime>now||now-quoteTime>maxQuoteAgeMs)return false;
  try{
    const url=new URL(offer.bookingUrl);
    return url.protocol==="https:"&&hostAllowed(url.hostname.toLowerCase(),approvedDomains);
  }catch{return false;}
}
