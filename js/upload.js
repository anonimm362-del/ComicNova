const CN_UPLOAD_DB = "ComicNovaUploadDB";
const CN_UPLOAD_STORE = "comics";
function openUploadDB(){return new Promise((resolve,reject)=>{const r=indexedDB.open(CN_UPLOAD_DB,1);r.onupgradeneeded=()=>{const db=r.result;if(!db.objectStoreNames.contains(CN_UPLOAD_STORE))db.createObjectStore(CN_UPLOAD_STORE,{keyPath:"id",autoIncrement:true});};r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});}
function saveUploadedComic(comic){return openUploadDB().then(db=>new Promise((resolve,reject)=>{const tx=db.transaction(CN_UPLOAD_STORE,"readwrite");tx.objectStore(CN_UPLOAD_STORE).add(comic);tx.oncomplete=()=>resolve();tx.onerror=()=>reject(tx.error);}));}

document.addEventListener("DOMContentLoaded",()=>{
 const form=document.querySelector("#uploadForm"); if(!form)return;
 const user=JSON.parse(localStorage.getItem("cn_user")||"null");
 const coverInput=document.querySelector("#comicCover"), zipInput=document.querySelector("#chapterZip"), coverPreview=document.querySelector("#coverPreview"), pageList=document.querySelector("#pageList");
 coverInput?.addEventListener("change",()=>{const file=coverInput.files?.[0];if(!file)return;const url=URL.createObjectURL(file);coverPreview.innerHTML=`<img src="${url}" alt="Preview cover">`;});
 zipInput?.addEventListener("change",async()=>{
   pageList.innerHTML=""; const zip=zipInput.files?.[0]; if(!zip)return;
   if(!/\.zip$/i.test(zip.name)){toast("Pilih file ZIP");zipInput.value="";return;}
   pageList.innerHTML='<div class="file-item"><span>Membaca isi ZIP…</span><small>tunggu</small></div>';
   try{const files=await ComicNovaZip.readZip(zip); pageList.innerHTML=files.map((f,i)=>`<div class="file-item"><span>${i+1}. ${f.name}</span><small>${Math.round(f.size/1024)} KB</small></div>`).join(""); zipInput._pages=files; toast(`${files.length} halaman ditemukan`);}catch(err){console.error(err);zipInput._pages=null;pageList.innerHTML=`<div class="file-item"><span>ZIP tidak bisa dibaca</span><small>${err.message}</small></div>`;}
 });
 form.addEventListener("submit",async e=>{e.preventDefault();
   if(!user){toast("Login dulu sebelum upload komik");setTimeout(()=>location.href="login.html?return=upload.html",700);return;}
   const cover=coverInput.files?.[0], pages=zipInput._pages||[];
   if(!cover||!pages.length){toast("Cover dan ZIP berisi minimal 1 gambar wajib dipilih");return;}
   const chapter=Number(document.querySelector("#chapterNumber").value||1);
   const comic={title:document.querySelector("#comicTitle").value.trim(),genre:document.querySelector("#comicGenre").value.trim(),description:document.querySelector("#comicDescription").value.trim(),creator:user.username||user.email,creatorEmail:user.email,createdAt:Date.now(),cover,chapters:[{number:chapter,pages}],status:"published"};
   try{await saveUploadedComic(comic);toast("Komik berhasil disimpan di browser ini");form.reset();coverPreview.innerHTML='<span style="color:var(--muted);font-size:12px">Preview cover</span>';pageList.innerHTML="";zipInput._pages=null;}catch(err){console.error(err);toast("Upload gagal. Penyimpanan browser tidak tersedia atau kuota penuh.");}
 });
});
