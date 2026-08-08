
(function(){
  const links = [
    ["index.html","Home","home"],
    ["creator.html","Kreator","users"],
    ["bookmark.html","Bookmark","bookmark"],
    ["history.html","Riwayat","history"],
    ["settings.html","Pengaturan","settings"],
    ["profile.html","Profil","profile"]
  ];
  const icons = {
    home:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1V10Z"/></svg>`,
    users:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
    bookmark:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1Z"/></svg>`,
    history:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 4v6h6"/><path d="M12 7v5l3 2"/></svg>`,
    settings:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 8.2a3.8 3.8 0 1 0 0 7.6 3.8 3.8 0 0 0 0-7.6Z"/><path d="M19.4 13.5a7.7 7.7 0 0 0 0-3l1.7-1.3-2-3.4-2 .8a7.7 7.7 0 0 0-2.6-1.5L14.2 3h-4l-.3 2.1A7.7 7.7 0 0 0 7.3 6.6l-2-.8-2 3.4L5 10.5a7.7 7.7 0 0 0 0 3l-1.7 1.3 2 3.4 2-.8a7.7 7.7 0 0 0 2.6 1.5l.3 2.1h4l.3-2.1a7.7 7.7 0 0 0 2.6-1.5l2 .8 2-3.4-1.7-1.3Z"/></svg>`,
    profile:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>`
  };
  function renderNav(){
    const el=document.querySelector("[data-bottom-nav]");
    if(!el)return;
    const current=location.pathname.split("/").pop() || "index.html";
    el.innerHTML=links.map(([href,label,key])=>`<a href="${href}" class="${current===href?"active":""}">${icons[key]}<span>${label}</span></a>`).join("");
  }
  function setupScrollNavigation(){
    if(document.body.classList.contains("reader-mode")) return;
    let lastY=window.scrollY, ticking=false, hidden=false;
    function update(){
      const y=window.scrollY;
      if(Math.abs(y-lastY)>=8){
        if(y>lastY && y>80){ document.body.classList.add("nav-hidden"); hidden=true; }
        else if(y<lastY && hidden){ document.body.classList.remove("nav-hidden"); hidden=false; }
        if(y<=20){ document.body.classList.remove("nav-hidden"); hidden=false; }
        lastY=y;
      }
      ticking=false;
    }
    window.addEventListener("scroll",()=>{if(!ticking){requestAnimationFrame(update);ticking=true}}, {passive:true});
    window.addEventListener("mousemove",e=>{if(e.clientY<90) document.body.classList.remove("nav-hidden")},{passive:true});
    window.addEventListener("touchstart",e=>{if(e.touches[0] && e.touches[0].clientY<100) document.body.classList.remove("nav-hidden")},{passive:true});
  }
  window.ComicNovaNav={renderNav};
  document.addEventListener("DOMContentLoaded",()=>{renderNav();setupScrollNavigation()});
})();
