
document.addEventListener("DOMContentLoaded",()=>{
  renderComicGrid("#trendingGrid",comics.slice(0,6),{rank:true});
  renderComicGrid("#updateGrid",comics.slice(0,12),{actions:true});
  document.querySelector("#rankList").innerHTML=comics.slice(0,7).map((c,i)=>`<a class="rank-row" href="detail.html?id=${c.id}"><div class="rank-no">#${i+1}</div><div class="rank-info"><b>${escapeHtml(c.title)}</b><span>${escapeHtml(c.genre)}</span></div><div class="rank-score">${(9.8-i*.12).toFixed(1)}</div></a>`).join("");
  document.querySelector("#chatForm")?.addEventListener("submit",e=>{
    e.preventDefault();const input=document.querySelector("#chatInput");if(!input.value.trim())return;
    const msg=document.createElement("div");msg.className="message";msg.innerHTML=`<b>You</b><span>${escapeHtml(input.value)}</span>`;
    document.querySelector("#chatMessages").appendChild(msg);input.value="";
  });
});
