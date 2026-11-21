// ---------- 小工具 ----------
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

// ---------- 星点 ----------
(function sprinkle() {
  const box = $(".sparkles");
  if (!box) return;
  for (let i = 0; i < 26; i++) {
    const s = document.createElement("i");
    s.style.left = Math.random() * 100 + "%";
    s.style.top = Math.random() * 100 + "%";
    s.style.animationDelay = (Math.random() * 5).toFixed(2) + "s";
    s.style.scale = (0.5 + Math.random() * 1.2).toFixed(2);
    box.appendChild(s);
  }
})();

// ---------- 鼠标视差 ----------
(function parallax() {
  if (reduceMotion) return;
  const layers = [
    { el: $(".clouds.c1"), depth: 10 },
    { el: $(".clouds.c2"), depth: 18 },
    { el: $(".clouds.c3"), depth: 26 },
    { el: $('[data-parallax]'), depth: 14 },
  ].filter((l) => l.el);
  let tx = 0, ty = 0, cx = 0, cy = 0;
  addEventListener("pointermove", (e) => {
    tx = (e.clientX / innerWidth - 0.5) * 2;
    ty = (e.clientY / innerHeight - 0.5) * 2;
  }, { passive: true });
  (function loop() {
    cx += (tx - cx) * 0.06;
    cy += (ty - cy) * 0.06;
    for (const { el, depth } of layers) {
      el.style.translate = `${(-cx * depth).toFixed(2)}px ${(-cy * depth * 0.5).toFixed(2)}px`;
    }
    requestAnimationFrame(loop);
  })();
})();

// ---------- 滚动入场 ----------
(function revealOnScroll() {
  const items = $$(".reveal, .card, .timeline li");

  function paint() {
    const vh = window.innerHeight || 800;
    for (const el of items) {
      if (el.classList.contains("in")) continue;
      const r = el.getBoundingClientRect();
      if (r.top < vh * 0.92 && r.bottom > -40) el.classList.add("in");
    }
  }
  let lastRun = 0;
  function onScroll() {
    const now = Date.now();
    if (now - lastRun < 90) return;
    lastRun = now;
    paint();
  }

  items.forEach((el, i) => {
    el.style.transitionDelay = (i % 6) * 70 + "ms";
  });
  addEventListener("scroll", onScroll, { passive: true });
  addEventListener("resize", onScroll, { passive: true });
  paint();
  requestAnimationFrame(paint);
})();

// ---------- 飘心效果 ----------
function spawnHeart(x, y, glyph = "♥", color) {
  const h = document.createElement("div");
  h.className = "fly-heart";
  h.textContent = glyph;
  h.style.left = x + "px";
  h.style.top = y + "px";
  h.style.setProperty("--dx", (Math.random() * 160 - 80).toFixed(0) + "px");
  h.style.setProperty("--dy", (-120 - Math.random() * 140).toFixed(0) + "px");
  h.style.setProperty("--rot", (Math.random() * 120 - 60).toFixed(0) + "deg");
  if (color) h.style.color = color;
  document.body.appendChild(h);
  setTimeout(() => h.remove(), 1600);
}
function spawnCloud(x, y) {
  const c = document.createElement("div");
  c.className = "wish-cloud";
  const size = 18 + Math.random() * 26;
  c.style.left = x + "px";
  c.style.top = y + "px";
  c.style.width = size + "px";
  c.style.height = size * 0.72 + "px";
  c.style.setProperty("--dx", (Math.random() * 120 - 60).toFixed(0) + "px");
  c.style.opacity = 0.85;
  document.body.appendChild(c);
  setTimeout(() => c.remove(), 2700);
}

// ---------- 喜欢计数（有后端就走网络，纯静态就存本地） ----------
const HAS_API = /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname);
const likeBtn = $("#likeBtn");
const likeNum = $("#likeNum");

function paintLikes(n) {
  if (typeof n !== "number") return;
  likeNum.textContent = n.toLocaleString("zh-CN");
}

async function loadLikes() {
  if (!HAS_API) {
    paintLikes(Number(localStorage.getItem("cinnamoroll:likes") || 0));
    return;
  }
  try {
    const r = await fetch("/api/likes", { headers: { accept: "application/json" } });
    if (!r.ok) throw new Error(r.status);
    const d = await r.json();
    paintLikes(d.likes);
  } catch {
    const local = Number(localStorage.getItem("cinnamoroll:likes") || 0);
    paintLikes(local);
    likeNum.dataset.offline = "1";
  }
}

async function sendLike(btn) {
  btn.classList.add("pop");
  setTimeout(() => btn.classList.remove("pop"), 520);
  const rect = btn.getBoundingClientRect();
  for (let i = 0; i < 5; i++) {
    setTimeout(() => spawnHeart(rect.left + rect.width * Math.random(), rect.top + rect.height * 0.4), i * 60);
  }
  if (!HAS_API) {
    const n = Number(localStorage.getItem("cinnamoroll:likes") || 0) + 1;
    localStorage.setItem("cinnamoroll:likes", String(n));
    paintLikes(n);
    return;
  }
  try {
    const r = await fetch("/api/likes", { method: "POST" });
    if (!r.ok) throw new Error(r.status);
    const d = await r.json();
    paintLikes(d.likes);
  } catch {
    const n = Number(localStorage.getItem("cinnamoroll:likes") || 0) + 1;
    localStorage.setItem("cinnamoroll:likes", String(n));
    paintLikes(n);
  }
}

if (likeBtn) likeBtn.addEventListener("click", () => sendLike(likeBtn));
loadLikes();

// ---------- 许愿云 ----------
const cloudBtn = $("#cloudBtn");
const wishNum = $("#wishNum");
const wishNote = $("#wishNote");
const notes = [
  "云会记得每一句话。",
  "风把它带走了，朝他的方向。",
  "这一朵，替你说了喜欢。",
  "天上又多了一小片温柔。",
  "他说：收到啦。",
];
let wishes = 0;

if (cloudBtn) {
  cloudBtn.addEventListener("click", (e) => {
    const rect = cloudBtn.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    for (let i = 0; i < 3; i++) {
      setTimeout(() => spawnCloud(x + (Math.random() * 70 - 35), y), i * 110);
    }
    spawnHeart(e.clientX || x, e.clientY || y, "☁", "#9dc7ea");
    wishes++;
    wishNum.textContent = wishes;
    wishNote.textContent = notes[Math.min(wishes - 1, notes.length - 1)];
  });
}

// ---------- 轻触屏幕也会有小心心 ----------
if (!reduceMotion) {
  let last = 0;
  addEventListener("pointerdown", (e) => {
    if (e.target.closest("button, a")) return;
    const now = Date.now();
    if (now - last < 120) return;
    last = now;
    spawnHeart(e.clientX, e.clientY, "♡", "#9dc7ea");
  });
}

// ---------- 标题逐字浮入 ----------
(function titleIn() {
  const t = $(".title");
  if (!t || reduceMotion) return;
  t.style.opacity = 0;
  t.style.transform = "translateY(18px)";
  requestAnimationFrame(() => {
    t.style.transition = "opacity 1.1s ease, transform 1.1s cubic-bezier(.2,.8,.2,1)";
    t.style.opacity = 1;
    t.style.transform = "none";
  });
})();