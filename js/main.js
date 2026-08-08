
const comics = [
 {id:1,title:"The Heavenly Demon Cult's Strongest Maid",genre:"Fantasy • Action",chapter:"Ch. 84",rank:1,accent:"violet"},
 {id:2,title:"The Youngest Member of a Farming Family",genre:"Fantasy • Slice of Life",chapter:"Ch. 29",rank:2,accent:"blue"},
 {id:3,title:"Rebellious Innocence",genre:"Romance • Drama",chapter:"Ch. 23",rank:3,accent:"pink"},
 {id:4,title:"We Don't Know Each Other Anymore",genre:"Drama • Romance",chapter:"Ch. 17",rank:4,accent:"blue"},
 {id:5,title:"A Baby Cat Who Commands the Dog",genre:"Comedy • Fantasy",chapter:"Ch. 41",rank:5,accent:"gold"},
 {id:6,title:"Serena",genre:"Romance • Drama",chapter:"Ch. 137",rank:6,accent:"rose"},
 {id:7,title:"I'm Finding a New Husband",genre:"Romance • Fantasy",chapter:"Ch. 48",rank:7,accent:"green"},
 {id:8,title:"The Billion's Daughter in Law Is Reborn",genre:"Romance • Drama",chapter:"Ch. 56",rank:8,accent:"green"},
 {id:9,title:"The Snow Leopard's Baby of the Black",genre:"Fantasy • Romance",chapter:"Ch. 70",rank:9,accent:"ice"},
 {id:10,title:"The Foreign Object Who Wasn't Me",genre:"Fantasy • Drama",chapter:"Ch. 31",rank:10,accent:"pink"},
 {id:11,title:"The Emperor's Favorite by His Count",genre:"Historical • Romance",chapter:"Ch. 44",rank:11,accent:"gold"},
 {id:12,title:"Turn Yourself Into a Rotten Princess",genre:"Comedy • Fantasy",chapter:"Ch. 60",rank:12,accent:"brown"},
 {id:13,title:"Philomel the Fake",genre:"Fantasy • Drama",chapter:"Ch. 82",rank:13,accent:"rose"},
 {id:14,title:"I Will Fall with the Emperor",genre:"Drama • Romance",chapter:"Ch. 19",rank:14,accent:"gray"},
 {id:15,title:"Starvation",genre:"Action • Drama",chapter:"Ch. 150",rank:15,accent:"gray"},
 {id:16,title:"Haru's Happy Ending for the Little",genre:"Romance • Fantasy",chapter:"Ch. 39",rank:16,accent:"violet"}
];

const escapeHtml = s => String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));
function coverData(c){
  const gradients={
    violet:"linear-gradient(145deg,#17243e,#5927b7 55%,#130d22)",
    blue:"linear-gradient(145deg,#0b2741,#2770cf 55%,#10152c)",
    pink:"linear-gradient(145deg,#301528,#b33d83 55%,#180d1d)",
    rose:"linear-gradient(145deg,#3d1922,#a84b58 55%,#1b1015)",
    gold:"linear-gradient(145deg,#3c2911,#c48b35 55%,#17110a)",
    green:"linear-gradient(145deg,#152d2a,#4f8a65 55%,#101c1a)",
    ice:"linear-gradient(145deg,#122e4a,#54b9dc 55%,#101b2a)",
    brown:"linear-gradient(145deg,#352218,#8e5635 55%,#17100c)",
    gray:"linear-gradient(145deg,#202738,#72798e 55%,#11141d)"
  };
  return gradients[c.accent] || gradients.violet;
}
function comicCard(c, opts={}){
  const bookmarked=(JSON.parse(localStorage.getItem("cn_bookmarks")||"[]")).includes(c.id);
  return `<article class="comic-card" data-title="${escapeHtml(c.title.toLowerCase())}">
    <a href="detail.html?id=${c.id}">
      <div class="cover" style="background:${coverData(c)}">
        <div class="cover-placeholder"><strong>${escapeHtml(c.title)}</strong></div>
        ${opts.rank?`<span class="rank">${c.rank}</span>`:""}
        <span class="badge">${bookmarked?"SAVED":"UPDATE"}</span>
      </div>
    </a>
    <a class="card-title" href="detail.html?id=${c.id}" title="${escapeHtml(c.title)}">${escapeHtml(c.title)}</a>
    <div class="card-meta">${escapeHtml(c.chapter)} • ${escapeHtml(c.genre)}</div>
    ${opts.actions?`<div class="card-actions"><button class="mini-btn bookmark-toggle" data-id="${c.id}">${bookmarked?"Saved":"Bookmark"}</button><a class="mini-btn" href="reader.html?id=${c.id}">Read</a></div>`:""}
  </article>`;
}
function renderComicGrid(selector,list=comics,opts={}){const el=document.querySelector(selector);if(el)el.innerHTML=list.map(c=>comicCard(c,opts)).join("");}
function toast(message){
  let el=document.querySelector(".toast"); if(!el){el=document.createElement("div");el.className="toast";document.body.appendChild(el)}
  el.textContent=message;el.classList.add("show");clearTimeout(window.__toast);window.__toast=setTimeout(()=>el.classList.remove("show"),2200);
}
function toggleBookmark(id){
  let ids=JSON.parse(localStorage.getItem("cn_bookmarks")||"[]");
  id=Number(id); ids=ids.includes(id)?ids.filter(x=>x!==id):[...ids,id];
  localStorage.setItem("cn_bookmarks",JSON.stringify(ids));
  return ids.includes(id);
}
document.addEventListener("click",e=>{
  const btn=e.target.closest(".bookmark-toggle");
  if(btn){const saved=toggleBookmark(btn.dataset.id);btn.textContent=saved?"Saved":"Bookmark";toast(saved?"Added to bookmarks":"Removed from bookmarks")}
});
document.addEventListener("DOMContentLoaded",()=>{
  const search=document.querySelector("[data-search]");
  if(search){
    search.addEventListener("input",()=>{
      const q=search.value.toLowerCase().trim();
      document.querySelectorAll(".comic-card").forEach(card=>card.style.display=card.dataset.title.includes(q)?"":"none");
    });
  }
  const year=document.querySelector("[data-year]");if(year)year.textContent=new Date().getFullYear();
  const user=JSON.parse(localStorage.getItem("cn_user")||"null");
  document.querySelectorAll("[data-username]").forEach(x=>x.textContent=user?.username||"Guest");
});
