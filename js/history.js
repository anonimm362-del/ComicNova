
document.addEventListener("DOMContentLoaded",()=>{
  const history=JSON.parse(localStorage.getItem("cn_history")||"[]");
  const list=history.map(h=>comics.find(c=>c.id===Number(h.id))).filter(Boolean);
  const el=document.querySelector("#historyGrid"), empty=document.querySelector("#historyEmpty");
  if(list.length){el.innerHTML=list.map(c=>comicCard(c,{actions:true})).join("");empty.hidden=true}
  else{el.innerHTML="";empty.hidden=false}
});
