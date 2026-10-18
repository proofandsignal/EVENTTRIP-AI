const MONEY_MAX=1_000_000;
const COST_KEYS=["flight","hotelNight","eventTicket","baggage","transfers"];
function blank(value){
  return value===null||value===undefined||(typeof value==="string"&&value.trim()==="");
}
function amount(value){
  if(blank(value))return null;
  if(typeof value==="boolean")return NaN;
  const n=Number(value);
  return Number.isFinite(n)&&n>=0&&n<=MONEY_MAX?n:NaN;
}
function count(value,fallback,max){
  if(blank(value))return fallback;
  const n=Number(value);
  return Number.isInteger(n)&&n>=1&&n<=max?n:null;
}
export function calculateTripCost(input={}){
  const travelers=count(input.travelers,1,20);
  const nights=count(input.nights,1,30);
  const values=Object.fromEntries(COST_KEYS.map(key=>[key,amount(input[key])]));
  const missingComponents=COST_KEYS.filter(key=>values[key]===null);
  const invalidFields=COST_KEYS.filter(key=>Number.isNaN(values[key]));
  if(travelers===null)invalidFields.push("travelers");
  if(nights===null)invalidFields.push("nights");
  const base={travelers,nights,missingComponents,invalidFields,complete:missingComponents.length===0};
  if(invalidFields.length)return {...base,valid:false,hasEstimate:false,total:null,perTraveler:null,breakdown:null};
  const hasEstimate=missingComponents.length<COST_KEYS.length;
  if(!hasEstimate)return {...base,valid:true,hasEstimate:false,total:null,perTraveler:null,breakdown:null};
  const {flight,hotelNight,eventTicket,baggage,transfers}=values;
  const breakdown={
    flights:(flight??0)*travelers,
    hotel:(hotelNight??0)*nights,
    events:(eventTicket??0)*travelers,
    baggage:(baggage??0)*travelers,
    transfers:transfers??0
  };
  const total=Math.round((Object.values(breakdown).reduce((sum,value)=>sum+value,0)+Number.EPSILON)*100)/100;
  return {...base,valid:true,hasEstimate:true,total,perTraveler:Math.round((total/travelers+Number.EPSILON)*100)/100,breakdown};
}
