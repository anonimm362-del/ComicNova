
document.addEventListener("DOMContentLoaded",()=>{
  const id=Number(new URLSearchParams(location.search).get("id"))||1;
  const c=comics.find(x=>x.id===id)||comics[0];
  const saved=(JSON.parse(localStorage.getItem("cn_bookmarks")||"[]")).includes(c.id);
  document.querySelector("#detailPage").innerHTML=`<div class="detail-cover" style="background:${coverData(c)}"><div class="cover-placeholder" style="min-height:430px"><strong>${escapeHtml(c.title)}</strong></div></div>
  <div class="detail-info"><div class="eyebrow">${escapeHtml(c.genre)}</div><h1>${escapeHtml(c.title)}</h1><p style="color:var(--muted)">Sebuah kisah penuh misteri, konflik, dan karakter yang berkembang seiring perjalanan mereka.</p>
  <div class="tags">${c.genre.split(" • ").map(x=>`<span class="tag">${escapeHtml(x)}</span>`).join("")}<span class="tag">Ongoing</span><span class="tag">9.8 Rating</span></div>
  <div class="info-table"><div class="info-box"><small>Author</small><b>ComicNova Studio</b></div><div class="info-box"><small>Artist</small><b>Nova Team</b></div><div class="info-box"><small>Latest</small><b>${escapeHtml(c.chapter)}</b></div><div class="info-box"><small>Status</small><b>Ongoing</b></div></div>
  <div class="actions"><button class="btn bookmark-toggle" data-id="${c.id}">${saved?"Saved":"Add Bookmark"}</button><a class="btn secondary" href="reader.html?id=${c.id}">Read Now</a></div></div>`;
  document.querySelector("#chapters").innerHTML=Array.from({length:12},(_,i)=>{const n=84-i;return `<a class="chapter" href="reader.html?id=${c.id}&chapter=${n}"><b>Chapter ${n}</b><span>${i===0?"Terbaru":"2 hari lalu"} →</span></a>`}).join("");
});
