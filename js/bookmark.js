
document.addEventListener("DOMContentLoaded",()=>{
  const ids=JSON.parse(localStorage.getItem("cn_bookmarks")||"[]").map(Number);
  const list=comics.filter(c=>ids.includes(c.id));
  const el=document.querySelector("#bookmarkGrid");
  const empty=document.querySelector("#bookmarkEmpty");
  if(list.length){el.innerHTML=list.map(c=>comicCard(c,{actions:true})).join("");empty.hidden=true}
  else{el.innerHTML="";empty.hidden=false}
});
