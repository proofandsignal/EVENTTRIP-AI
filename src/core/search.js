export const SEGMENTS = Object.freeze(["all","budget","luxury","events"]);
export function filterIdeas(ideas,{query="",destination="all",segment="all"}={}){
  const q=String(query).trim().toLocaleLowerCase("en");
  const d=String(destination).trim().toLocaleLowerCase("en");
  if(!SEGMENTS.includes(segment)) return [];
  return ideas.filter(idea=>{
    if(segment!=="all" && idea.segment!==segment) return false;
    if(d!=="all" && idea.destination.toLocaleLowerCase("en")!==d) return false;
    if(!q) return true;
    return [idea.destination,idea.country,idea.title,idea.description,...idea.tags].join(" ").toLocaleLowerCase("en").includes(q);
  });
}
