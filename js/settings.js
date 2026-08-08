
document.addEventListener("DOMContentLoaded",()=>{
  const theme=document.querySelector("#themeToggle");
  if(localStorage.getItem("cn_theme")==="light"){document.body.classList.add("light");if(theme)theme.checked=true}
  theme?.addEventListener("change",()=>{
    document.body.classList.toggle("light",theme.checked);
    localStorage.setItem("cn_theme",theme.checked?"light":"dark");
  });
  document.querySelector("#clearData")?.addEventListener("click",()=>{
    if(confirm("Hapus bookmark dan riwayat?")){localStorage.removeItem("cn_bookmarks");localStorage.removeItem("cn_history");toast("Data lokal dihapus")}
  });
});
