/* deleFOCO Producción B2B — script */
document.body.classList.remove("theme-light");
document.body.classList.add("mode-b2b", "theme-dark");

const state = { lang: "es", statusKey: null };

const copy = {
  es: {
    heroTitle: "Su producción, resuelta con<br><span>deleFOCO.</span>",
    heroText: "Planificamos y ejecutamos su proyecto audiovisual junto a las empresas, productoras y profesionales de deleFOCO: crew, equipo, locaciones, permisos y entrega final.",
    heroPrimary: "Solicitar cotización <span>→</span>",
    heroSecondary: "Ver servicios",
    contactTitle: "Cuéntenos qué quiere producir.",
    contactText: "Complete el brief de su empresa y le contactaremos con los siguientes pasos de producción.",
    formButton: "Solicitar cotización <span>→</span>",
    headerCta: "Hablar con un asesor",
    pageTitle: "Producción para Empresas | deleFOCO",
    pageDesc: "Producción audiovisual para empresas: producción ejecutiva, crew, equipo, permisos, postproducción y logística en Costa Rica.",
    toTop: "Volver arriba",
    themeDark: "Oscuro",
    themeLight: "Claro",
    errors: "Complete los campos obligatorios antes de enviar.",
    successOpen: "Solicitud lista. Se abrió WhatsApp en una nueva pestaña.",
    successBlocked: "El navegador bloqueó la ventana de WhatsApp. Permita las ventanas emergentes e intente de nuevo."
  },
  en: {
    heroTitle: "Your production, handled with<br><span>deleFOCO.</span>",
    heroText: "We plan and deliver your audiovisual project together with the companies, producers and professionals of deleFOCO: crew, gear, locations, permits and final files.",
    heroPrimary: "Request a quote <span>→</span>",
    heroSecondary: "See services",
    contactTitle: "Tell us what you want to produce.",
    contactText: "Complete your company brief and we will contact you with the next production steps.",
    formButton: "Request a quote <span>→</span>",
    headerCta: "Talk to an advisor",
    pageTitle: "Business Production | deleFOCO",
    pageDesc: "Audiovisual production for companies: executive production, crew, gear, permits, post-production and logistics in Costa Rica.",
    toTop: "Back to top",
    themeDark: "Dark",
    themeLight: "Light",
    errors: "Please complete the required fields before sending.",
    successOpen: "Request ready. WhatsApp was opened in a new tab.",
    successBlocked: "Your browser blocked the WhatsApp window. Allow pop-ups and try again."
  }
};

function setText(id, value, html = false) {
  const el = document.getElementById(id);
  if (!el) return;
  html ? (el.innerHTML = value) : (el.textContent = value);
}

const colorToggle = document.getElementById("colorToggle");

function updateThemeToggle() {
  if (!colorToggle) return;
  const isDark = document.body.classList.contains("theme-dark");
  const text = colorToggle.querySelector(".color-toggle-text");
  const icon = colorToggle.querySelector(".color-toggle-icon");
  const label = isDark ? copy[state.lang].themeLight : copy[state.lang].themeDark;
  if (text) text.textContent = label;
  if (icon) icon.textContent = isDark ? "☀" : "☾";
  colorToggle.setAttribute("aria-label", label);
  colorToggle.setAttribute("title", label);
  colorToggle.setAttribute("aria-pressed", String(isDark));
}

colorToggle?.addEventListener("click", () => {
  const isDark = document.body.classList.toggle("theme-dark");
  document.body.classList.toggle("theme-light", !isDark);
  updateThemeToggle();
});

function applyLanguage() {
  document.documentElement.lang = state.lang;
  document.querySelectorAll(".lang-btn").forEach((b) =>
    b.classList.toggle("active", b.dataset.lang === state.lang)
  );
  const c = copy[state.lang];
  setText("heroTitle", c.heroTitle, true);
  setText("heroText", c.heroText);
  setText("heroPrimary", c.heroPrimary, true);
  setText("heroSecondary", c.heroSecondary);
  setText("contactTitle", c.contactTitle);
  setText("contactText", c.contactText);
  setText("whatsappSubmit", c.formButton, true);
  const headerCta = document.getElementById("headerWhatsApp");
  if (headerCta) headerCta.textContent = c.headerCta;
  // Textos con data-en: alterna entre español (original) e inglés
  document.querySelectorAll("[data-en]").forEach((el) => {
    if (!("es" in el.dataset)) el.dataset.es = el.innerHTML;
    el.innerHTML = state.lang === "en" ? el.dataset.en : el.dataset.es;
  });
  // Atributos traducibles: data-en-placeholder, data-en-aria-label, data-en-aria-roledescription
  ["placeholder", "aria-label", "aria-roledescription"].forEach((attr) => {
    document.querySelectorAll("[data-en-" + attr + "]").forEach((el) => {
      const esKey = "data-es-" + attr;
      if (!el.hasAttribute(esKey)) el.setAttribute(esKey, el.getAttribute(attr) || "");
      el.setAttribute(
        attr,
        state.lang === "en" ? el.getAttribute("data-en-" + attr) : el.getAttribute(esKey)
      );
    });
  });
  // Título de la pestaña y meta descripción
  document.title = c.pageTitle;
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.setAttribute("content", c.pageDesc);
  // Botón "volver arriba" (se crea más abajo)
  const toTopBtn = document.querySelector(".to-top");
  if (toTopBtn) toTopBtn.setAttribute("aria-label", c.toTop);
  // Mensaje de estado del formulario: se vuelve a mostrar en el idioma nuevo
  const statusEl = document.getElementById("formStatus");
  if (statusEl && state.statusKey) statusEl.textContent = c[state.statusKey];
  updateThemeToggle();
}

document.querySelectorAll(".lang-btn").forEach((btn) =>
  btn.addEventListener("click", () => {
    state.lang = btn.dataset.lang;
    applyLanguage();
  })
);

/* WhatsApp form */
function enviarWhatsApp() {
  const form = document.getElementById("leadForm");
  const status = document.getElementById("formStatus");
  if (!form.checkValidity()) {
    state.statusKey = "errors";
    status.textContent = copy[state.lang].errors;
    form.reportValidity();
    return;
  }
  const data = new FormData(form);
  const value = (name) => String(data.get(name) || "").trim();
  const labels =
    state.lang === "es"
      ? {
          company: "Empresa",
          email: "Correo",
          project: "Tipo de producción",
          scope: "Alcance",
          date: "Fechas",
          budget: "Presupuesto",
          message: "Brief",
          link: "Link de referencia",
        }
      : {
          company: "Company",
          email: "Email",
          project: "Production type",
          scope: "Scope",
          date: "Dates",
          budget: "Budget",
          message: "Brief",
          link: "Reference link",
        };
  const lines = [
    state.lang === "es"
      ? "Hola, quiero solicitar una cotización de producción:"
      : "Hi, I want to request a production quote:",
    "",
    `${labels.company}: ${value("company")}`,
    `${labels.email}: ${value("email")}`,
    `${labels.project}: ${value("project")}`,
    `${labels.scope}: ${value("scope")}`,
    `${labels.date}: ${value("date")}`,
    `${labels.budget}: ${value("budget")}`,
    `${labels.message}: ${value("message")}`,
  ];
  // Enlace opcional: si el cliente escribe "drive.google.com/..." se le antepone https://
  let link = value("link");
  if (link && !/^https?:\/\//i.test(link)) link = "https://" + link;
  if (link) lines.push(`${labels.link}: ${link}`);
  const url = `https://wa.me/50686823430?text=${encodeURIComponent(lines.join("\n"))}`;
  const opened = window.open(url, "_blank", "noopener,noreferrer");
  state.statusKey = opened ? "successOpen" : "successBlocked";
  status.textContent = copy[state.lang][state.statusKey];
}

document.getElementById("whatsappSubmit")?.addEventListener("click", enviarWhatsApp);
document.getElementById("leadForm")?.addEventListener("submit", (e) => {
  e.preventDefault();
  enviarWhatsApp();
});

applyLanguage();

/* Hero carousel */
(function () {
  const root = document.getElementById("heroCarousel");
  if (!root) return;
  const slides = Array.from(root.querySelectorAll(".hero-carousel-slide"));
  const dots = Array.from(root.querySelectorAll(".hero-carousel-dots button"));
  const prevBtn = document.getElementById("heroCarouselPrev");
  const nextBtn = document.getElementById("heroCarouselNext");
  let current = 0;
  let timer = null;
  const AUTOPLAY_MS = 5000;

  function goTo(index) {
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => slide.classList.toggle("active", i === current));
    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === current);
      dot.setAttribute("aria-selected", i === current ? "true" : "false");
    });
  }
  function next() {
    goTo(current + 1);
  }
  function prev() {
    goTo(current - 1);
  }
  function startAutoplay() {
    stopAutoplay();
    timer = setInterval(next, AUTOPLAY_MS);
  }
  function stopAutoplay() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  }

  nextBtn && nextBtn.addEventListener("click", () => {
    next();
    startAutoplay();
  });
  prevBtn && prevBtn.addEventListener("click", () => {
    prev();
    startAutoplay();
  });
  dots.forEach((dot) =>
    dot.addEventListener("click", () => {
      goTo(Number(dot.dataset.index));
      startAutoplay();
    })
  );
  root.addEventListener("mouseenter", stopAutoplay);
  root.addEventListener("mouseleave", startAutoplay);
  goTo(0);
  startAutoplay();
})();

/* Scroll progress + to-top + reveal */
(function () {
  const reduce =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const bar = document.createElement("div");
  bar.className = "scroll-progress";
  bar.setAttribute("aria-hidden", "true");
  document.body.appendChild(bar);

  const toTop = document.createElement("button");
  toTop.type = "button";
  toTop.className = "to-top";
  toTop.setAttribute("aria-label", copy[state.lang].toTop);
  toTop.textContent = "↑";
  toTop.addEventListener("click", () =>
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" })
  );
  document.body.appendChild(toTop);

  const topbar = document.querySelector(".topbar");
  let ticking = false;
  function onScroll() {
    const y = window.scrollY || document.documentElement.scrollTop;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.transform = "scaleX(" + (max > 0 ? Math.min(y / max, 1) : 0) + ")";
    if (topbar) topbar.classList.toggle("is-scrolled", y > 8);
    toTop.classList.toggle("show", y > 600);
    ticking = false;
  }
  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(onScroll);
      }
    },
    { passive: true }
  );
  onScroll();

  const carousel = document.getElementById("heroCarousel");
  if (carousel && !reduce) {
    requestAnimationFrame(() =>
      requestAnimationFrame(() => carousel.classList.add("kb-on"))
    );
  }

  if ("IntersectionObserver" in window) {
    const targets = document.querySelectorAll(
      ".section-heading, .service-grid, .cases-grid, .timeline, .location-grid, .filters, .cat-grid, .contact-intro, .lead-form"
    );
    if (targets.length) {
      document.documentElement.classList.add("js-reveal");
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add("is-visible");
              io.unobserve(e.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
      );
      targets.forEach((el) => {
        el.classList.add("reveal");
        io.observe(el);
      });
    }
  }
})();


/* Header: Hablar con un asesor → WhatsApp según audiencia B2B/B2C */
(function () {
  const btn = document.getElementById("headerWhatsApp");
  if (!btn) return;
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    const audience = "b2b";
    const messages = {
      es: {
        b2b: "Hola, quiero cotizar los servicios de producción de deleFOCO."
      },
      en: {
        b2b: "Hi, I want to get a quote for deleFOCO production services."
      }
    };
    const lang = (typeof state !== "undefined" && state.lang) ? state.lang : "es";
    const text = (messages[lang] || messages.es)[audience];
    const url = "https://wa.me/50686823430?text=" + encodeURIComponent(text);
    window.open(url, "_blank", "noopener,noreferrer");
  });
})();

/* Filtros de locaciones */
document.querySelectorAll(".filter").forEach((btn) =>
  btn.addEventListener("click", () => {
    document.querySelectorAll(".filter").forEach((x) => x.classList.remove("active"));
    btn.classList.add("active");
    const filter = btn.dataset.filter;
    document.querySelectorAll(".location-card").forEach((card) => {
      card.style.display =
        filter === "all" || card.dataset.type === filter ? "block" : "none";
    });
  })
);

/* Aviso de privacidad */
(function () {
  const dlg = document.getElementById("privacyDialog");
  if (!dlg) return;
  const close = () => dlg.close();
  document.addEventListener("click", (e) => {
    const a = e.target.closest("[data-privacy]");
    if (!a) return;
    e.preventDefault();
    if (typeof dlg.showModal === "function") dlg.showModal(); else dlg.setAttribute("open", "");
  });
  document.getElementById("privacyClose")?.addEventListener("click", close);
  document.getElementById("privacyOk")?.addEventListener("click", close);
  dlg.addEventListener("click", (e) => { if (e.target === dlg) close(); });
})();
