
document.addEventListener("DOMContentLoaded",()=>{
  const input=document.querySelector("#fullSearch");
  const grid=document.querySelector("#searchGrid");
  const render=()=>{
    const q=input.value.toLowerCase().trim();
    const list=q?comics.filter(c=>(c.title+" "+c.genre).toLowerCase().includes(q)):comics;
    grid.innerHTML=list.length?list.map(c=>comicCard(c,{actions:true})).join(""):`<div class="panel empty" style="grid-column:1/-1">Tidak ada komik yang cocok dengan pencarian.</div>`;
  };
  input.addEventListener("input",render);render();
});
