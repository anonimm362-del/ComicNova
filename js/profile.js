document.addEventListener("DOMContentLoaded",()=>{
  const user=JSON.parse(localStorage.getItem("cn_user")||"null");
  document.querySelector("#profileName").textContent=user?.username||"Guest Reader";
  document.querySelector("#profileEmail").textContent=user?.email||"Belum login";
  const ids=JSON.parse(localStorage.getItem("cn_bookmarks")||"[]");
  document.querySelector("#bookmarkCount").textContent=ids.length;
  document.querySelector("#historyCount").textContent=JSON.parse(localStorage.getItem("cn_history")||"[]").length;
  if(user?.role==="admin"){
    const actions=document.querySelector(".profile-head")?.parentElement?.querySelector(".actions");
    if(actions && !actions.querySelector(".admin-link")) actions.insertAdjacentHTML("afterbegin",'<a class="btn admin-link" href="admin.html">🛡 Admin Panel</a>');
  }
});
