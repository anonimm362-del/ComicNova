document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(location.search);
  const id = Number(params.get("id")) || 1;
  const comic = comics.find(c => c.id === id) || comics[0];
  let chapter = Math.max(1, Number(params.get("chapter")) || 1);

  document.querySelectorAll("[data-comic-title]").forEach(el => el.textContent = comic.title);

  function saveHistory() {
    let history = JSON.parse(localStorage.getItem("cn_history") || "[]");
    history = history.filter(x => Number(x.id) !== comic.id);
    history.unshift({ id: comic.id, chapter, time: Date.now() });
    localStorage.setItem("cn_history", JSON.stringify(history.slice(0, 20)));
  }

  const maxChapter = Number(params.get("max")) || Number((comic.chapter || "").match(/\d+/)?.[0]) || Math.max(chapter, 1);
  const chapterNo = document.querySelector("#chapterNo");
  const readerChapter = document.querySelector("#readerChapter");
  const prev = document.querySelector("#prevChapter");
  const next = document.querySelector("#nextChapter");
  const chapterStatus = document.querySelector("#chapterStatus");

  function showReaderChrome() {
    document.body.classList.remove("reader-ui-hidden");
  }

  function update() {
    chapterNo.textContent = `Chapter ${chapter}`;
    readerChapter.textContent = `Chapter ${chapter}`;
    if (chapterStatus) chapterStatus.textContent = `Chapter ${chapter} / ${maxChapter}`;
    prev.disabled = chapter <= 1;
    next.disabled = chapter >= maxChapter;
    prev.setAttribute("aria-disabled", String(chapter <= 1));
    next.setAttribute("aria-disabled", String(chapter >= maxChapter));
    saveHistory();
    showReaderChrome();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  prev?.addEventListener("click", () => {
    if (chapter > 1) {
      chapter--;
      update();
    }
  });

  next?.addEventListener("click", () => {
    if (chapter < maxChapter) {
      chapter++;
      update();
    }
  });

  // Reader chrome: visible when a chapter is opened, hidden while reading,
  // and automatically returns near the end of the current chapter.
  let lastY = window.scrollY;
  let ticking = false;
  function handleReaderScroll() {
    const y = window.scrollY;
    const doc = document.documentElement;
    const maxScroll = Math.max(1, doc.scrollHeight - window.innerHeight);
    const progress = y / maxScroll;

    if (y > lastY + 8 && y > 80) {
      document.body.classList.add("reader-ui-hidden");
    } else if (y < lastY - 8 && y < 80) {
      showReaderChrome();
    }

    // Chapter is effectively finished: show controls again so the user can
    // move to the next/previous chapter without hunting for the UI.
    if (progress >= 0.92) showReaderChrome();
    if (y <= 20) showReaderChrome();

    lastY = y;
    ticking = false;
  }

  window.addEventListener("scroll", () => {
    if (!ticking) {
      requestAnimationFrame(handleReaderScroll);
      ticking = true;
    }
  }, { passive: true });

  // Make sure the first chapter opens with the controls visible.
  showReaderChrome();
  update();
});
