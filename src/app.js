import {TRIP_IDEAS} from "./data/trip-ideas.js";
import {filterIdeas} from "./core/search.js";
import {calculateTripCost} from "./core/cost.js";

const $=s=>document.querySelector(s);
const form=$("#search-form"),query=$("#search-query"),destination=$("#destination"),cards=$("#cards");
const filters=[...document.querySelectorAll("[data-segment]")];
const calc=$("#cost-calculator"),fields=[...calc.querySelectorAll("input")];
const euro=new Intl.NumberFormat("en-IE",{style:"currency",currency:"EUR"});
let segment="all";

function node(tag,cls,text){
  const el=document.createElement(tag);
  if(cls)el.className=cls;
  if(text!==undefined)el.textContent=text;
  return el;
}
function card(idea){
  const article=node("article","trip-card");
  article.append(node("div","card-art art-"+idea.theme));
  const body=node("div","card-content");
  const top=node("div","card-top");
  top.append(node("span","mini-label",idea.segment.toUpperCase()),node("span","mini-status","Planning idea"));
  body.append(top,node("h3","card-title",idea.title),node("p","card-place",idea.destination+" · "+idea.country),node("p","card-description",idea.description));
  const tags=node("div","tags");
  idea.tags.forEach(tag=>tags.append(node("span","tag",tag)));
  body.append(tags);
  const footer=node("div","card-footer");
  footer.append(node("span","no-price","No verified price yet"));
  const action=node("button","text-button","Estimate this trip →");
  action.type="button";
  action.setAttribute("aria-label","Estimate trip cost for "+idea.title);
  action.addEventListener("click",()=>{
    $("#selected-trip").textContent=idea.title+" — enter your own estimates below.";
    $("#cost").scrollIntoView({behavior:"smooth",block:"start"});
    calc.querySelector("input").focus({preventScroll:true});
  });
  footer.append(action);
  body.append(footer);
  article.append(body);
  return article;
}
function render(){
  const result=filterIdeas(TRIP_IDEAS,{query:query.value,destination:destination.value,segment});
  cards.replaceChildren(...result.map(card));
  $("#result-count").textContent=result.length+" planning "+(result.length===1?"idea":"ideas");
  $("#empty-state").hidden=result.length!==0;
}
form.addEventListener("submit",event=>{event.preventDefault();render();});
query.addEventListener("input",render);
destination.addEventListener("change",render);
filters.forEach(button=>button.addEventListener("click",()=>{
  segment=button.dataset.segment;
  filters.forEach(option=>option.setAttribute("aria-pressed",String(option===button)));
  render();
}));
$("#reset-filters").addEventListener("click",()=>{
  query.value="";
  destination.value="all";
  document.querySelector('[data-segment="all"]').click();
  query.focus();
});
function updateCost(){
  const values=Object.fromEntries(fields.map(field=>[field.name,field.value]));
  const cost=calculateTripCost(values);
  const labels={flight:"flight",hotelNight:"hotel",eventTicket:"event tickets",baggage:"baggage",transfers:"transfers"};
  $("#cost-total").textContent=cost.hasEstimate?euro.format(cost.total):"—";
  $("#cost-total-label").textContent=cost.hasEstimate&&cost.complete?"ESTIMATED TRIP TOTAL":"PARTIAL TRIP ESTIMATE";
  $("#cost-per-person").textContent=!cost.valid?"Correct invalid numbers":cost.hasEstimate
    ?euro.format(cost.perTraveler)+" per traveler":"Enter costs to calculate";
  if(!cost.valid){
    $("#cost-caption").textContent="Invalid input: "+cost.invalidFields.join(", ")+". Use non-negative costs, 1–20 travelers and 1–30 nights.";
    return;
  }
  const missing=cost.missingComponents.map(key=>labels[key]);
  $("#cost-caption").textContent=cost.hasEstimate
    ?"Manual estimate only. "+(missing.length?"Not included: "+missing.join(", ")+". Enter 0 if not applicable. ":"All five cost categories entered. ")+"Hotel is per night; transfers are per trip. No live prices or availability."
    :"Add your own estimates. No live prices or booking availability. Enter 0 for categories that do not apply.";
}
fields.forEach(field=>field.addEventListener("input",updateCost));
calc.addEventListener("reset",()=>{
  $("#selected-trip").textContent="Choose a planning idea above, or enter your own costs.";
  queueMicrotask(updateCost);
});
render();
updateCost();
