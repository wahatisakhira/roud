/* =========================================================
   روض واحتي الصغيرة — script.js (JavaScript sans dépendance)
   ========================================================= */

/* ---------- CONFIGURATION ---------- */
// Numéro WhatsApp (format international, chiffres uniquement, sans "+")
const WHATSAPP_NUMBER = "212603539340";
// Serveur des photos d'activités (Lovable Cloud). Clé PUBLIQUE uniquement
// (lecture seule, protégée par les règles de sécurité de la base).
const PHOTOS_API_URL = "https://qaxruhnorjctzratvxta.supabase.co";
const PHOTOS_PUBLIC_KEY = "sb_publishable_FwlNmRQ8FmSpFuhh1pOdBw_TEECXeV4";
const PHOTOS_BUCKET = "activity-photos";

const waLink = (text) => "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(text);

/* ---------- Menu mobile ---------- */
const MENU_ICON = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5h16"/><path d="M4 12h16"/><path d="M4 19h16"/></svg>';
const CLOSE_ICON = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>';
const toggle = document.getElementById("menuToggle");
const mobileMenu = document.getElementById("mobileMenu");
function setMenu(open) {
  mobileMenu.hidden = !open;
  toggle.setAttribute("aria-expanded", String(open));
  toggle.setAttribute("aria-label", open ? "إغلاق القائمة" : "فتح القائمة");
  toggle.innerHTML = open ? CLOSE_ICON : MENU_ICON;
}
toggle.addEventListener("click", () => setMenu(mobileMenu.hidden));
mobileMenu.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setMenu(false)));

/* ---------- Formulaire d'inscription → WhatsApp ---------- */
document.getElementById("registerForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const f = new FormData(e.currentTarget);
  const msg = [
    "السلام عليكم، أريد تقديم طلب تسجيل في روض واحتي الصغيرة.",
    "اسم ولي الأمر: " + f.get("parent"), "اسم الطفل: " + f.get("child"), "العمر: " + f.get("age"),
    "رقم الهاتف: " + f.get("phone"), "البريد الإلكتروني: " + (f.get("email") || "غير محدد"),
    "القسم المطلوب: " + f.get("program"), "الرسالة: " + (f.get("message") || "لا توجد"),
  ].join("\n");
  e.currentTarget.querySelector("[data-status]").textContent = "سيُفتح WhatsApp لإرسال طلبكم. يرجى الضغط على زر الإرسال هناك لإتمام الطلب.";
  window.location.assign(waLink(msg));
});

/* ---------- Formulaire « الملاحظات » → WhatsApp ---------- */
document.getElementById("complaintForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const form = e.currentTarget, f = new FormData(form);
  const msg = [
    "السلام عليكم، أود تقديم طلب إلى روض واحتي الصغيرة.", "نوع الطلب: " + f.get("type"),
    "اسم ولي الأمر: " + f.get("parent"), "رقم الهاتف: " + f.get("phone"),
    "البريد الإلكتروني: " + (f.get("email") || "غير محدد"), "الموضوع: " + f.get("subject"), "التفاصيل: " + f.get("details"),
  ].join("\n");
  form.querySelector("[data-status]").textContent = "تم إرسال طلبكم بنجاح، شكراً لتواصلكم معنا.";
  form.reset();
  window.location.assign(waLink(msg));
});

/* ---------- Galerie photos des activités ---------- */
async function fetchPhotos(slug) {
  const h = { apikey: PHOTOS_PUBLIC_KEY };
  const r = await fetch(PHOTOS_API_URL + "/rest/v1/activity_photos?select=id,storage_path,caption&activity_slug=eq." + slug + "&order=sort_order.asc,created_at.asc", { headers: h });
  if (!r.ok) throw new Error("photos " + r.status);
  const rows = await r.json();
  if (!rows.length) return [];
  const s = await fetch(PHOTOS_API_URL + "/storage/v1/object/sign/" + PHOTOS_BUCKET, {
    method: "POST", headers: { ...h, "Content-Type": "application/json" },
    body: JSON.stringify({ expiresIn: 21600, paths: rows.map((p) => p.storage_path) }),
  });
  if (!s.ok) throw new Error("sign " + s.status);
  const signed = await s.json();
  return rows.map((p, i) => ({ ...p, url: signed[i] && signed[i].signedURL ? PHOTOS_API_URL + "/storage/v1" + signed[i].signedURL : "" }));
}
const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const btnGhost = "inline-flex size-9 items-center justify-center rounded-md hover:bg-accent";

function openGallery(slug, title) {
  const d = document.createElement("div");
  d.setAttribute("role", "dialog"); d.setAttribute("aria-modal", "true"); d.setAttribute("aria-label", "صور " + title);
  d.className = "fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-deep/90 p-3 sm:p-6";
  d.innerHTML = '<div class="relative my-auto w-full max-w-5xl rounded-lg bg-background p-4 soft-shadow sm:p-7" data-panel>'
    + '<div class="mb-5 flex items-center justify-between gap-3"><div><span class="text-sm font-extrabold text-primary">معرض الأنشطة</span><h2 class="mt-1 text-2xl font-extrabold text-deep">' + esc(title) + '</h2></div>'
    + '<button type="button" class="' + btnGhost + '" aria-label="إغلاق المعرض" data-close>' + CLOSE_ICON + '</button></div>'
    + '<div data-content><p class="py-16 text-center text-primary">جارٍ التحميل…</p></div></div>';
  document.body.appendChild(d); document.body.style.overflow = "hidden";
  let photos = [], active = null, viewer = null;
  const close = () => { d.remove(); document.body.style.overflow = ""; document.removeEventListener("keydown", onKey); };
  const show = (i) => {
    active = (i + photos.length) % photos.length; const p = photos[active];
    if (!viewer) {
      viewer = document.createElement("div");
      viewer.className = "fixed inset-0 z-[110] flex items-center justify-center bg-deep/95 p-4";
      viewer.addEventListener("click", (e) => { if (e.target === viewer) hide(); });
      d.appendChild(viewer);
    }
    const nav = photos.length > 1;
    viewer.innerHTML = '<button type="button" class="' + btnGhost + ' absolute left-4 top-4 text-primary-foreground" aria-label="إغلاق الصورة" data-x>' + CLOSE_ICON + '</button>'
      + (nav ? '<button type="button" class="' + btnGhost + ' absolute right-3 top-1/2 -translate-y-1/2 text-primary-foreground text-3xl md:right-7" aria-label="الصورة السابقة" data-prev>›</button>' : "")
      + '<figure class="max-w-[calc(100%-100px)]"><img src="' + esc(p.url) + '" alt="' + esc(p.caption || title) + '" class="max-h-[80vh] max-w-full rounded-lg object-contain"><figcaption class="mt-3 text-center text-sm text-primary-foreground">' + (p.caption ? esc(p.caption) + " · " : "") + (active + 1) + " / " + photos.length + '</figcaption></figure>'
      + (nav ? '<button type="button" class="' + btnGhost + ' absolute left-3 top-1/2 -translate-y-1/2 text-primary-foreground text-3xl md:left-7" aria-label="الصورة التالية" data-next>‹</button>' : "");
    viewer.querySelector("[data-x]").onclick = hide;
    if (nav) { viewer.querySelector("[data-prev]").onclick = () => show(active - 1); viewer.querySelector("[data-next]").onclick = () => show(active + 1); }
  };
  const hide = () => { if (viewer) viewer.remove(); viewer = null; active = null; };
  function onKey(e) {
    if (e.key === "Escape") return active !== null ? hide() : close();
    if (active === null) return;
    if (e.key === "ArrowLeft") show(active + 1);
    if (e.key === "ArrowRight") show(active - 1);
  }
  document.addEventListener("keydown", onKey);
  d.addEventListener("click", (e) => { if (e.target === d) close(); });
  d.querySelector("[data-close]").onclick = close;
  const content = d.querySelector("[data-content]");
  fetchPhotos(slug).then((list) => {
    photos = list;
    if (!list.length) { content.innerHTML = '<p class="py-16 text-center text-muted-foreground">ستُضاف صور هذا النشاط قريباً.</p>'; return; }
    content.innerHTML = '<div class="grid grid-cols-2 gap-3 md:grid-cols-3">' + list.map((p, i) =>
      '<button type="button" data-i="' + i + '" aria-label="عرض الصورة ' + (i + 1) + '" class="group overflow-hidden rounded-lg bg-muted"><img src="' + esc(p.url) + '" alt="' + esc(p.caption || title) + '" loading="lazy" class="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-105"></button>').join("") + "</div>";
    content.querySelectorAll("[data-i]").forEach((b) => (b.onclick = () => show(+b.dataset.i)));
  }).catch(() => { content.innerHTML = '<p class="py-16 text-center text-muted-foreground">تعذّر تحميل الصور، يرجى المحاولة لاحقاً.</p>'; });
}
document.querySelectorAll("[data-activity]").forEach((b) => {
  b.addEventListener("click", () => openGallery(b.dataset.activity, b.closest("article, div").querySelector("h3").textContent.trim()));
});
