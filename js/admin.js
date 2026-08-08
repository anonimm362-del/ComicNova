const CN_ADMIN_USERNAME = "@mangareader100168";
const CN_ADMIN_PASSWORD_SHA256 = "f7af24d0907243c09f30d067432d25c719e02ed39635b3cbcf8c255dc0ae7023";

async function cnSha256(text){const data=new TextEncoder().encode(text);const hash=await crypto.subtle.digest("SHA-256",data);return [...new Uint8Array(hash)].map(b=>b.toString(16).padStart(2,"0")).join("");}
function cnCurrentUser(){return JSON.parse(localStorage.getItem("cn_user")||"null");}
function cnIsAdmin(){return cnCurrentUser()?.role==="admin";}

function openAdminDB(){return new Promise((resolve,reject)=>{const r=indexedDB.open("ComicNovaUploadDB",1);r.onupgradeneeded=()=>{const db=r.result;if(!db.objectStoreNames.contains("comics"))db.createObjectStore("comics",{keyPath:"id",autoIncrement:true});};r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});}
function getAllUploadedComics(){return openAdminDB().then(db=>new Promise((resolve,reject)=>{const tx=db.transaction("comics","readonly");const req=tx.objectStore("comics").getAll();req.onsuccess=()=>resolve(req.result||[]);req.onerror=()=>reject(req.error);}));}
function deleteUploadedComic(id){return openAdminDB().then(db=>new Promise((resolve,reject)=>{const tx=db.transaction("comics","readwrite");tx.objectStore("comics").delete(id);tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);}));}

async function adminLogin(identifier,password){
  const normalized=(identifier||"").trim();
  if(normalized!==CN_ADMIN_USERNAME)return false;
  const hash=await cnSha256(password||"");
  if(hash!==CN_ADMIN_PASSWORD_SHA256)return false;
  localStorage.setItem("cn_user",JSON.stringify({username:CN_ADMIN_USERNAME,email:"admin@comicnova.local",provider:"admin",role:"admin"}));
  return true;
}

window.ComicNovaAdmin={CN_ADMIN_USERNAME,adminLogin,cnIsAdmin,getAllUploadedComics,deleteUploadedComic};

document.addEventListener("DOMContentLoaded",async()=>{
 const grid=document.querySelector("#adminComicList"); if(!grid)return;
 if(!cnIsAdmin()){grid.innerHTML='<div class="empty-state"><h3>Akses ditolak</h3><p>Halaman ini khusus admin.</p><a class="btn" href="login.html">Kembali ke Login</a></div>';return;}
 async function render(){
   const comics=await getAllUploadedComics();
   if(!comics.length){grid.innerHTML='<div class="empty-state"><h3>Belum ada komik upload</h3><p>Komik dari user akan muncul di sini.</p></div>';return;}
   grid.innerHTML=comics.map(c=>`<article class="admin-comic-card"><div class="admin-cover">${c.cover?'<span>Cover</span>':'No cover'}</div><div class="admin-comic-info"><h3>${escapeHtml(c.title||'Tanpa judul')}</h3><p>${escapeHtml(c.creator||'Unknown')} • ${c.chapters?.length||0} chapter</p><small>${new Date(c.createdAt||Date.now()).toLocaleString('id-ID')}</small><button class="btn danger admin-delete" data-id="${c.id}">Hapus Komik</button></div></article>`).join('');
   grid.querySelectorAll('.admin-delete').forEach(btn=>btn.addEventListener('click',async()=>{if(!confirm('Hapus komik ini dari penyimpanan ComicNova di browser ini?'))return;await deleteUploadedComic(Number(btn.dataset.id));toast('Komik dihapus');render();}));
 }
 render();
});
function escapeHtml(s){return String(s).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));}
