document.addEventListener("DOMContentLoaded",()=>{
  const names=["Astra","Miko Studio","Nox Atelier","Kira Works","Nova Ink","Aruna Studio","Lumen House","Raven Tales","MangaForge","Sora Project","Midnight Pen","Orion Works"];
  const el=document.querySelector("#creatorGrid");
  if(!el) return;
  el.innerHTML=names.map((n,i)=>{
    const initials=n.split(/\s+/).map(x=>x[0]).join("").slice(0,2).toUpperCase();
    return `<article class="creator-card panel">
      <div class="creator-avatar">${initials}</div>
      <div class="creator-info">
        <h3>${n}</h3>
        <p>${3+i} karya <span>•</span> ${(120+i*37)} followers</p>
        <a class="creator-btn" href="search.html">Lihat karya</a>
      </div>
    </article>`;
  }).join("");
});
