/* روض واحتي الصغيرة — التفاعلات */
(function () {
  "use strict";

  /* ===== الإعدادات: غيّروا رقم WhatsApp هنا (بالصيغة الدولية بدون + أو مسافات) ===== */
  var WHATSAPP_NUMBER = "212603539340";

  document.documentElement.classList.add("js");

  function openWhatsApp(text) {
    var url = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(text);
    window.open(url, "_blank", "noopener,noreferrer");
  }

  /* ===== جميع أزرار WhatsApp تستعمل الرقم أعلاه ===== */
  document.querySelectorAll('a[href^="https://wa.me/"]').forEach(function (a) {
    a.href = a.href.replace(/wa\.me\/\d+/, "wa.me/" + WHATSAPP_NUMBER);
  });

  /* ===== قائمة الهاتف ===== */
  var toggle = document.getElementById("menuToggle");
  var menu = document.getElementById("mobileMenu");
  function setMenu(open) {
    if (!toggle || !menu) return;
    menu.hidden = !open;
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "إغلاق القائمة" : "فتح القائمة");
  }
  if (toggle && menu) {
    toggle.addEventListener("click", function () { setMenu(menu.hidden); });
    menu.addEventListener("click", function (e) { if (e.target.closest("a")) setMenu(false); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") setMenu(false); });
    window.addEventListener("resize", function () { if (window.innerWidth >= 1280) setMenu(false); });
  }

  /* ===== التمرير السلس مع مراعاة الشريط العلوي ===== */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener("click", function (e) {
      var id = link.getAttribute("href");
      if (id.length < 2) return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      var header = document.querySelector("header");
      var offset = header ? header.offsetHeight : 0;
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - offset, behavior: "smooth" });
      history.replaceState(null, "", id);
    });
  });

  /* ===== حركة ظهور الأقسام ===== */
  var sections = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-visible"); io.unobserve(en.target); }
      });
    }, { threshold: 0.08 });
    sections.forEach(function (s) { io.observe(s); });
  } else {
    sections.forEach(function (s) { s.classList.add("is-visible"); });
  }

  /* ===== معرض الصور ===== */
  var items = Array.prototype.slice.call(document.querySelectorAll("[data-gallery]"));
  var box = document.getElementById("lightbox");
  var boxImg = document.getElementById("lightboxImg");
  var boxCap = document.getElementById("lightboxCaption");
  var current = 0;
  function show(i) {
    current = (i + items.length) % items.length;
    var img = items[current].querySelector("img");
    boxImg.src = img.getAttribute("src");
    boxImg.alt = img.alt;
    boxCap.textContent = img.alt + " · " + (current + 1) + " / " + items.length;
    box.hidden = false;
    document.body.style.overflow = "hidden";
  }
  function hide() { box.hidden = true; document.body.style.overflow = ""; if (items[current]) items[current].focus(); }
  if (box && items.length) {
    items.forEach(function (btn, i) { btn.addEventListener("click", function () { show(i); }); });
    box.addEventListener("click", function (e) {
      var action = e.target.closest("[data-lb]");
      if (action) {
        e.stopPropagation();
        var a = action.getAttribute("data-lb");
        if (a === "close") hide();
        if (a === "prev") show(current - 1);
        if (a === "next") show(current + 1);
        return;
      }
      if (!e.target.closest("figure")) hide();
    });
    document.addEventListener("keydown", function (e) {
      if (box.hidden) return;
      if (e.key === "Escape") hide();
      if (e.key === "ArrowLeft") show(current + 1);
      if (e.key === "ArrowRight") show(current - 1);
    });
  }

  /* ===== التحقق من الحقول ===== */
  function validate(form) {
    var firstInvalid = null;
    form.querySelectorAll("input, select, textarea").forEach(function (f) {
      f.value = f.value.trim ? (f.tagName === "SELECT" ? f.value : f.value) : f.value;
      var ok = f.checkValidity();
      f.classList.toggle("field-error", !ok);
      f.setAttribute("aria-invalid", String(!ok));
      if (!ok && !firstInvalid) firstInvalid = f;
    });
    if (firstInvalid) { firstInvalid.focus(); firstInvalid.reportValidity(); return false; }
    return true;
  }
  document.querySelectorAll("form").forEach(function (form) {
    form.addEventListener("input", function (e) {
      if (e.target.classList.contains("field-error") && e.target.checkValidity()) {
        e.target.classList.remove("field-error");
        e.target.setAttribute("aria-invalid", "false");
      }
    });
  });

  function val(form, name) {
    var f = form.elements[name];
    return f && f.value.trim() ? f.value.trim() : "";
  }

  /* ===== نموذج التسجيل ===== */
  var reg = document.getElementById("registerForm");
  var regStatus = document.getElementById("registerStatus");
  if (reg) {
    reg.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!validate(reg)) return;
      openWhatsApp([
        "السلام عليكم، أريد تقديم طلب تسجيل في روض واحتي الصغيرة.",
        "اسم ولي الأمر: " + val(reg, "parent"),
        "اسم الطفل: " + val(reg, "child"),
        "العمر: " + val(reg, "age"),
        "رقم الهاتف: " + val(reg, "phone"),
        "البريد الإلكتروني: " + (val(reg, "email") || "غير محدد"),
        "القسم المطلوب: " + val(reg, "program"),
        "الرسالة: " + (val(reg, "message") || "لا توجد")
      ].join("\n"));
      if (regStatus) regStatus.textContent = "سيُفتح WhatsApp لإرسال طلبكم. يرجى الضغط على زر الإرسال هناك لإتمام الطلب.";
    });
  }

  /* ===== نموذج الشكاية ===== */
  var comp = document.getElementById("complaintForm");
  var compStatus = document.getElementById("complaintStatus");
  if (comp) {
    comp.addEventListener("input", function () { if (compStatus) compStatus.textContent = ""; });
    comp.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!validate(comp)) return;
      openWhatsApp([
        "السلام عليكم، أود تقديم طلب إلى روض واحتي الصغيرة.",
        "نوع الطلب: " + val(comp, "type"),
        "اسم ولي الأمر: " + val(comp, "parent"),
        "رقم الهاتف: " + val(comp, "phone"),
        "البريد الإلكتروني: " + (val(comp, "email") || "غير محدد"),
        "الموضوع: " + val(comp, "subject"),
        "التفاصيل: " + val(comp, "details")
      ].join("\n"));
      if (compStatus) compStatus.textContent = "تم إرسال طلبكم بنجاح، شكراً لتواصلكم معنا.";
      comp.reset();
    });
  }
})();
