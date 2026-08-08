document.addEventListener("DOMContentLoaded", () => {
  const register = document.querySelector("#registerForm");
  if (register) register.addEventListener("submit", e => {
    e.preventDefault();
    const fd = new FormData(register), p = fd.get("password"), cp = fd.get("confirm");
    if (p !== cp) { toast("Password dan konfirmasi tidak sama"); return; }
    localStorage.setItem("cn_user", JSON.stringify({ username: fd.get("username"), email: fd.get("email"), provider: "email", role: "user" }));
    toast("Akun berhasil dibuat");
    setTimeout(() => location.href = "login.html", 600);
  });

  const login = document.querySelector("#loginForm");
  if (login) login.addEventListener("submit", async e => {
    e.preventDefault();
    const fd = new FormData(login);
    const identifier = String(fd.get("email") || "").trim();
    const password = String(fd.get("password") || "");

    if (window.ComicNovaAdmin && identifier === window.ComicNovaAdmin.CN_ADMIN_USERNAME) {
      const ok = await window.ComicNovaAdmin.adminLogin(identifier, password);
      if (!ok) { toast("Username admin atau password salah"); return; }
      toast("Login admin berhasil");
      setTimeout(() => location.href = "admin.html", 600);
      return;
    }

    let user = JSON.parse(localStorage.getItem("cn_user") || "null");
    if (!user || user.role === "admin") user = { username: identifier.includes("@") ? identifier.split("@")[0] : identifier, email: identifier.includes("@") ? identifier : `${identifier}@local`, provider: "email", role: "user" };
    localStorage.setItem("cn_user", JSON.stringify(user));
    toast("Login berhasil");
    setTimeout(() => location.href = new URLSearchParams(location.search).get("return") || "index.html", 600);
  });

  document.querySelector("#googleLoginBtn")?.addEventListener("click", () => {
    const clientId = window.CN_GOOGLE_CLIENT_ID || "";
    if (!clientId) { toast("Google Login perlu Client ID Google OAuth terlebih dahulu"); return; }
    toast("Google OAuth siap dihubungkan ke Identity Services");
  });

  document.querySelectorAll("[data-logout]").forEach(btn => btn.addEventListener("click", () => {
    localStorage.removeItem("cn_user"); toast("Kamu sudah logout"); setTimeout(() => location.href = "login.html", 500);
  }));
});
