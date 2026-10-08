/* Kuvuki Beach Lodge — site interactions */

// Contact settings. WhatsApp is in international format, digits only.
// Add an email address to offer "Send by email" in the booking flow too.
const CONFIG = {
  whatsapp: "233200418854",
  email: "",
  instagram: "kuvukibeachlodge",
  currency: "GHS",
  // Nightly rate range per room [min, max]; min === max means a single "from" price.
  rates: {
    "Ocean View Suite": [2000, 2000],
    default: [1000, 2000],
  },
  packageFrom: { "Beach dinner / proposal": 960 },
};

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

$("#year").textContent = new Date().getFullYear();

/* ---------- Promo bar ---------- */
const promo = $("#promo");
const syncPromo = () => {
  const show = promo && !promo.hidden;
  document.body.classList.toggle("has-promo", show);
  document.body.style.setProperty("--promo-h", show ? `${promo.offsetHeight}px` : "0px");
};
try { if (localStorage.getItem("kuvuki-promo-dismissed") === "1") promo.hidden = true; } catch {}
$(".promo-close", promo).addEventListener("click", () => {
  promo.hidden = true;
  try { localStorage.setItem("kuvuki-promo-dismissed", "1"); } catch {}
  syncPromo();
});
window.addEventListener("resize", syncPromo);
syncPromo();

/* ---------- Header & navigation ---------- */
const header = $(".site-header");
const fab = $(".fab");
const onScroll = () => {
  const y = window.scrollY;
  header.classList.toggle("is-scrolled", y > 40);
  fab.classList.toggle("is-visible", y > window.innerHeight * 0.6);
};
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

const toggle = $(".nav-toggle");
const menu = $("#nav-menu");
const setMenu = (open) => {
  toggle.setAttribute("aria-expanded", String(open));
  toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  menu.classList.toggle("is-open", open);
  document.body.classList.toggle("menu-open", open);
};
toggle.addEventListener("click", () => setMenu(toggle.getAttribute("aria-expanded") !== "true"));
$$("a", menu).forEach((a) => a.addEventListener("click", () => setMenu(false)));

// Highlight the nav link for the section in view
const navLinks = $$('.nav-menu a[href^="#"]:not(.btn)');
const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      navLinks.forEach((a) => a.classList.toggle("is-current", a.getAttribute("href") === `#${e.target.id}`));
    });
  },
  { rootMargin: "-45% 0px -50% 0px" }
);
navLinks.forEach((a) => {
  const s = $(a.getAttribute("href"));
  if (s) sectionObserver.observe(s);
});

/* ---------- Hero slideshow ---------- */
const slides = $$(".hero-slide");
if (slides.length > 1 && !reduceMotion) {
  let i = 0;
  setInterval(() => {
    slides[i].classList.remove("is-active");
    i = (i + 1) % slides.length;
    slides[i].classList.add("is-active");
  }, 6000);
}

// On portrait screens (phones), the vertical suite tour plays behind the hero.
const heroVideo = $(".hero-video");
const portrait = window.matchMedia("(orientation: portrait) and (max-width: 860px)");
const syncHeroVideo = () => {
  const use = portrait.matches && !reduceMotion;
  heroVideo.closest(".hero").classList.toggle("has-video", use);
  if (use) {
    if (!heroVideo.currentSrc) {
      heroVideo.canPlayType("video/webm") ? (heroVideo.src = heroVideo.dataset.webm) : (heroVideo.src = heroVideo.dataset.mp4);
    }
    heroVideo.play().catch(() => {});
  } else {
    heroVideo.pause();
  }
};
portrait.addEventListener("change", syncHeroVideo);
syncHeroVideo();

/* ---------- Reveal on scroll ---------- */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("is-visible");
        revealObserver.unobserve(e.target);
      }
    });
  },
  { threshold: 0.12 }
);
$$(".reveal").forEach((el) => revealObserver.observe(el));

/* ---------- Swipe helper ---------- */
function onSwipe(el, cb) {
  let x0 = null;
  el.addEventListener("touchstart", (e) => (x0 = e.touches[0].clientX), { passive: true });
  el.addEventListener("touchend", (e) => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 40) cb(dx < 0 ? 1 : -1);
    x0 = null;
  });
}

/* ---------- Suite carousels ---------- */
$$("[data-carousel]").forEach((carousel) => {
  const track = $(".carousel-track", carousel);
  const imgs = $$("img", track);
  const dots = $(".carousel-dots", carousel);
  let index = 0;
  imgs.forEach(() => dots.appendChild(document.createElement("span")));
  const go = (n) => {
    index = (n + imgs.length) % imgs.length;
    track.style.transform = `translateX(-${index * 100}%)`;
    $$("span", dots).forEach((d, i) => d.classList.toggle("is-active", i === index));
  };
  $(".prev", carousel).addEventListener("click", () => go(index - 1));
  $(".next", carousel).addEventListener("click", () => go(index + 1));
  onSwipe(carousel, (dir) => go(index + dir));
  go(0);
});

/* ---------- Suite tabs ---------- */
const tabs = $$('.suite-tabs [role="tab"]');
const selectTab = (tab) => {
  tabs.forEach((t) => {
    const selected = t === tab;
    t.setAttribute("aria-selected", String(selected));
    t.tabIndex = selected ? 0 : -1;
    const panel = $(`#${t.getAttribute("aria-controls")}`);
    panel.hidden = !selected;
    if (selected) panel.classList.add("is-visible");
    const video = $("video", panel);
    if (video) selected && !reduceMotion ? video.play().catch(() => {}) : video.pause();
  });
};

/* ---------- Room video ---------- */
$$(".video-frame").forEach((frame) => {
  const video = $("video", frame);
  const btn = $(".video-toggle", frame);
  const sync = () => {
    btn.textContent = video.paused ? "▶" : "❚❚";
    btn.setAttribute("aria-label", video.paused ? "Play video" : "Pause video");
  };
  btn.addEventListener("click", () => (video.paused ? video.play() : video.pause()));
  video.addEventListener("play", sync);
  video.addEventListener("pause", sync);
  sync();
});
tabs.forEach((tab, i) => {
  tab.addEventListener("click", () => selectTab(tab));
  tab.addEventListener("keydown", (e) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    const next = tabs[(i + (e.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length];
    selectTab(next);
    next.focus();
  });
});

/* ---------- Video tour viewer ---------- */
const videoModal = $("#video-modal");
const tourVideo = $("#tour-video");
const openTour = (btn) => {
  lastFocus = document.activeElement;
  const base = `assets/video/${btn.dataset.tour}`;
  tourVideo.src = tourVideo.canPlayType("video/webm") ? `${base}.webm` : `${base}.mp4`;
  tourVideo.setAttribute("aria-label", btn.dataset.title);
  videoModal.hidden = false;
  document.body.style.overflow = "hidden";
  tourVideo.play().catch(() => {});
  $(".lb-close", videoModal).focus();
};
const closeTour = () => {
  tourVideo.pause();
  tourVideo.removeAttribute("src");
  tourVideo.load();
  videoModal.hidden = true;
  document.body.style.overflow = "";
  lastFocus?.focus();
};
$$(".tour-btn").forEach((b) => b.addEventListener("click", () => openTour(b)));
$(".lb-close", videoModal).addEventListener("click", closeTour);
videoModal.addEventListener("click", (e) => { if (e.target === videoModal) closeTour(); });

/* ---------- Gallery filter & lightbox ---------- */
const items = $$(".g-item");
$$(".chip").forEach((chip) =>
  chip.addEventListener("click", () => {
    $$(".chip").forEach((c) => {
      c.classList.toggle("is-active", c === chip);
      c.setAttribute("aria-pressed", String(c === chip));
    });
    const f = chip.dataset.filter;
    items.forEach((it) => it.classList.toggle("is-hidden", f !== "all" && !it.dataset.cat.split(" ").includes(f)));
  })
);

const lb = $("#lightbox");
const lbImg = $("#lb-img");
const lbCap = $("#lb-cap");
let lbIndex = 0;
let lastFocus = null;
const visibleItems = () => items.filter((it) => !it.classList.contains("is-hidden"));
const showLb = (n) => {
  const list = visibleItems();
  lbIndex = (n + list.length) % list.length;
  const img = $("img", list[lbIndex]);
  lbImg.src = img.src;
  lbImg.alt = img.alt;
  lbCap.textContent = `${img.alt} · ${lbIndex + 1} / ${list.length}`;
};
const openLb = (item) => {
  lastFocus = document.activeElement;
  lb.hidden = false;
  document.body.style.overflow = "hidden";
  showLb(visibleItems().indexOf(item));
  $(".lb-close", lb).focus();
};
const closeLb = () => {
  lb.hidden = true;
  document.body.style.overflow = "";
  lastFocus?.focus();
};
items.forEach((it) => it.addEventListener("click", () => openLb(it)));
$(".lb-close", lb).addEventListener("click", closeLb);
$(".lb-prev", lb).addEventListener("click", () => showLb(lbIndex - 1));
$(".lb-next", lb).addEventListener("click", () => showLb(lbIndex + 1));
lb.addEventListener("click", (e) => { if (e.target === lb) closeLb(); });
onSwipe(lb, (dir) => showLb(lbIndex + dir));

/* ---------- Booking form ---------- */
const form = $("#booking-form");
const checkin = $("#checkin");
const checkout = $("#checkout");
const guests = $("#guests");
const suiteSel = $("#suite");
const errorEl = $("#form-error");
const estValue = $("#estimate-value");
const estNote = $("#estimate-note");

const toISO = (d) => new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
const addDays = (iso, n) => { const d = new Date(iso + "T00:00"); d.setDate(d.getDate() + n); return toISO(d); };
const today = toISO(new Date());
checkin.min = today;
checkout.min = addDays(today, 1);

const nights = () => {
  if (!checkin.value || !checkout.value) return 0;
  return Math.round((new Date(checkout.value) - new Date(checkin.value)) / 86400000);
};
const money = (n) => `${CONFIG.currency} ${n.toLocaleString("en-GH")}`;
const pkg = () => $('input[name="package"]:checked', form).value;

function updateEstimate() {
  const n = nights();
  if (n < 1) {
    estValue.textContent = "—";
    estNote.textContent = "Select dates to see an estimate.";
    return;
  }
  const [lo, hi] = CONFIG.rates[suiteSel.value] || CONFIG.rates.default;
  const extra = CONFIG.packageFrom[pkg()] || 0;
  const nightsLabel = `${n} night${n > 1 ? "s" : ""}`;
  let note;
  if (lo === hi) {
    estValue.textContent = `from ${money(n * lo + extra)}`;
    note = `${nightsLabel} × from ${money(lo)}, breakfast included.`;
  } else {
    estValue.textContent = `${money(n * lo + extra)} – ${(n * hi + extra).toLocaleString("en-GH")}`;
    note = `${nightsLabel} at ${money(lo)}–${hi.toLocaleString("en-GH")} per night depending on the room, breakfast included.`;
  }
  if (extra) note += ` Includes beach dinner / proposal from ${money(extra)}.`;
  else if (pkg() !== "None") note += ` ${pkg()} priced on request.`;
  estNote.textContent = note + " Final price confirmed by our team.";
}

checkin.addEventListener("change", () => {
  if (checkin.value) {
    checkout.min = addDays(checkin.value, 1);
    if (!checkout.value || checkout.value <= checkin.value) checkout.value = addDays(checkin.value, 1);
  }
  updateEstimate();
});
[checkout, suiteSel].forEach((el) => el.addEventListener("change", updateEstimate));
$$('input[name="package"]', form).forEach((r) => r.addEventListener("change", updateEstimate));

$$(".stepper button").forEach((b) =>
  b.addEventListener("click", () => {
    const v = Math.min(+guests.max, Math.max(+guests.min, (+guests.value || 1) + +b.dataset.step));
    guests.value = v;
  })
);

// Pre-fill the form from "Book" buttons around the page
$$("[data-suite], [data-package]").forEach((btn) =>
  btn.addEventListener("click", () => {
    if (btn.dataset.suite) suiteSel.value = btn.dataset.suite;
    if (btn.dataset.package) {
      const r = $(`input[name="package"][value="${btn.dataset.package}"]`, form);
      if (r) r.checked = true;
    }
    if (btn.dataset.nights && checkin.value) checkout.value = addDays(checkin.value, +btn.dataset.nights);
    updateEstimate();
    setTimeout(() => $("#name").focus({ preventScroll: true }), 600);
  })
);

const fmtDate = (iso) => new Date(iso + "T00:00").toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" });

form.addEventListener("submit", (e) => {
  e.preventDefault();
  $$(".invalid", form).forEach((el) => el.classList.remove("invalid"));
  const problems = [];
  const name = $("#name");
  if (!name.value.trim()) { problems.push("your name"); name.classList.add("invalid"); }
  if (!checkin.value) { problems.push("a check-in date"); checkin.classList.add("invalid"); }
  if (!checkout.value) { problems.push("a check-out date"); checkout.classList.add("invalid"); }
  if (problems.length) {
    errorEl.textContent = `Please add ${problems.join(", ")}.`;
    $(".invalid", form).focus();
    return;
  }
  if (nights() < 1) {
    errorEl.textContent = "Check-out must be after check-in.";
    checkout.classList.add("invalid");
    checkout.focus();
    return;
  }
  errorEl.textContent = "";

  const n = nights();
  const lines = [
    "Hello Kuvuki Beach Lodge! I'd like to make a booking request:",
    "",
    `Name: ${name.value.trim()}`,
    `Check-in: ${fmtDate(checkin.value)}`,
    `Check-out: ${fmtDate(checkout.value)} (${n} night${n > 1 ? "s" : ""})`,
    `Guests: ${guests.value}`,
    `Suite: ${suiteSel.value}`,
  ];
  if (pkg() !== "None") lines.push(`Package: ${pkg()}`);
  const notes = $("#notes").value.trim();
  if (notes) lines.push(`Notes: ${notes}`);
  openConfirm(lines.join("\n"));
});

/* ---------- Confirmation modal ---------- */
const modal = $("#confirm-modal");
const actions = $("#confirm-actions");

function actionLink(label, href, cls = "btn") {
  const a = document.createElement("a");
  a.className = cls;
  a.href = href;
  a.target = "_blank";
  a.rel = "noopener";
  a.textContent = label;
  return a;
}

function openConfirm(message) {
  $("#confirm-summary").textContent = message;
  actions.replaceChildren();
  if (CONFIG.whatsapp) {
    actions.append(actionLink("Send on WhatsApp", `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(message)}`));
  }
  if (CONFIG.email) {
    actions.append(actionLink("Send by email", `mailto:${CONFIG.email}?subject=${encodeURIComponent("Booking request")}&body=${encodeURIComponent(message)}`, CONFIG.whatsapp ? "btn btn-outline" : "btn"));
  }
  // Instagram DMs can't be pre-filled, so copy the message first.
  const ig = actionLink("Copy & message on Instagram", `https://ig.me/m/${CONFIG.instagram}`, actions.children.length ? "btn btn-outline" : "btn");
  ig.addEventListener("click", () => copy(message));
  actions.append(ig);
  const copyBtn = document.createElement("button");
  copyBtn.type = "button";
  copyBtn.className = "btn btn-outline";
  copyBtn.textContent = "Copy message";
  copyBtn.addEventListener("click", async () => {
    copyBtn.textContent = (await copy(message)) ? "Copied ✓" : "Select the text above to copy";
  });
  actions.append(copyBtn);

  lastFocus = document.activeElement;
  modal.hidden = false;
  document.body.style.overflow = "hidden";
  $("a, button", actions).focus();
}

async function copy(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

const closeModal = () => {
  modal.hidden = true;
  document.body.style.overflow = "";
  lastFocus?.focus();
};
$("#confirm-close").addEventListener("click", closeModal);
modal.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });

/* ---------- Global keyboard ---------- */
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    if (!videoModal.hidden) closeTour();
    else if (!lb.hidden) closeLb();
    else if (!modal.hidden) closeModal();
    else if (menu.classList.contains("is-open")) setMenu(false);
  }
  if (!lb.hidden) {
    if (e.key === "ArrowLeft") showLb(lbIndex - 1);
    if (e.key === "ArrowRight") showLb(lbIndex + 1);
  }
});
