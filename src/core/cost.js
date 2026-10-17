const MONEY_MAX=1_000_000;
function amount(value){
  if(value==="" || value===null || value===undefined) return null;
  const n=Number(value);
  return Number.isFinite(n)&&n>=0&&n<=MONEY_MAX?n:null;
}
function count(value,fallback,max){
  const n=Number(value);
  return Number.isInteger(n)&&n>=1&&n<=max?n:fallback;
}
export function calculateTripCost(input={}){
  const travelers=count(input.travelers,1,20);
  const nights=count(input.nights,1,30);
  const flight=amount(input.flight),hotelNight=amount(input.hotelNight),eventTicket=amount(input.eventTicket),baggage=amount(input.baggage),transfers=amount(input.transfers);
  const hasEstimate=[flight,hotelNight,eventTicket,baggage,transfers].some(v=>v!==null);
  if(!hasEstimate) return {travelers,nights,hasEstimate:false,total:null,perTraveler:null,breakdown:null};
  const breakdown={flights:(flight??0)*travelers,hotel:(hotelNight??0)*nights,events:(eventTicket??0)*travelers,baggage:(baggage??0)*travelers,transfers:transfers??0};
  const total=Math.round((Object.values(breakdown).reduce((s,v)=>s+v,0)+Number.EPSILON)*100)/100;
  return {travelers,nights,hasEstimate,total,perTraveler:Math.round((total/travelers+Number.EPSILON)*100)/100,breakdown};
}
