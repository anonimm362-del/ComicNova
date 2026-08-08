# ComicNova v3

Frontend multi-page menggunakan HTML, CSS, dan JavaScript vanilla.

## Struktur
- Setiap menu memiliki file HTML sendiri.
- CSS global: `css/style.css`.
- Navigasi reusable: `js/navigation.js`.
- Tidak ada logo image di navbar; wordmark ComicNova dibuat dengan CSS agar mudah diedit.

## Wordmark
Ubah warna/ukuran di bagian `ComicNova v3 visual cleanup` pada `css/style.css`, terutama `.brand-comic`, `.brand-nova`, dan `.brand-wordmark`.

## Navigasi
- Scroll ke bawah: topbar + bottom navigation menghilang.
- Scroll ke atas: navigasi muncul lagi.
- Posisi paling atas: navigasi selalu terlihat.
- `reader.html`: bottom navigation tidak digunakan dan auto-hide tidak aktif.

## ComicNova v4 additions
- Reader controls now appear when a chapter opens, hide while scrolling down, and return near the end of a chapter.
- Prev/Next chapter buttons are connected to the `chapter` query parameter and have working disabled states.
- Added `upload.html` for logged-in users. Browser-only uploads are stored in IndexedDB as a frontend demo.
- Added Google Login button. Real Google OAuth requires a Google OAuth Client ID and an authorized origin, so this version does not fake a successful Google login.
- For multi-device/shared uploads and real authentication, add a backend or Firebase/Supabase project.
