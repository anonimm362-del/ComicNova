
document.addEventListener("DOMContentLoaded",()=>{
  const g=(new URLSearchParams(location.search).get("g")||"all").toLowerCase();
  const map={action:"Action",fantasy:"Fantasy",romance:"Romance",drama:"Drama",comedy:"Comedy",adventure:"Adventure"};
  document.querySelector("#genreTitle").textContent=g==="all"?"Semua Genre":map[g]||"Semua Genre";
  const list=g==="all"?comics:comics.filter(c=>c.genre.toLowerCase().includes(g));
  document.querySelector("#genreGrid").innerHTML=list.length?list.map(c=>comicCard(c,{actions:true})).join(""):`<div class="panel empty" style="grid-column:1/-1">Belum ada judul pada genre ini.</div>`;
});
