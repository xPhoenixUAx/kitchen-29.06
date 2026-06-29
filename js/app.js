const config = window.siteConfig || {};

const services = [
  ["Full Kitchen Remodeling", "services/full-kitchen-remodeling.html"],
  ["Custom Cabinet Installation", "services/custom-cabinet-installation.html"],
  ["Countertop Replacement", "services/countertop-replacement.html"],
  ["Kitchen Flooring", "services/kitchen-flooring.html"],
  ["Backsplash & Tile", "services/backsplash-tile-installation.html"],
  ["Lighting & Electrical", "services/lighting-electrical.html"],
  ["Sink, Faucet & Plumbing", "services/sink-faucet-plumbing.html"],
  ["Kitchen Layout & Design", "services/kitchen-layout-design.html"],
  ["Cabinet Refinishing", "services/cabinet-refinishing.html"],
];

function relativePrefix() {
  return document.body.dataset.depth === "service" ? "../" : "";
}

function syncConfigText() {
  const defaultCompany = "Kitchen Match Network";
  const company = config.companyName || defaultCompany;
  if (company === defaultCompany) return;
  const swapCompany = (value) => value.split(defaultCompany).join(company);

  document.title = swapCompany(document.title);
  document.querySelectorAll('meta[name="description"]').forEach((meta) => {
    meta.content = swapCompany(meta.content);
  });

  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const nodes = [];
  while (walker.nextNode()) {
    if (walker.currentNode.nodeValue.includes(defaultCompany)) {
      nodes.push(walker.currentNode);
    }
  }
  nodes.forEach((node) => {
    node.nodeValue = swapCompany(node.nodeValue);
  });
}

function applyConfig() {
  syncConfigText();
  const prefix = relativePrefix();
  document.querySelectorAll("[data-company]").forEach((el) => {
    el.textContent = config.companyName || "Kitchen Match Network";
  });
  document.querySelectorAll("[data-brand]").forEach((el) => {
    el.textContent = config.brandText || config.companyName || "Kitchen Match";
  });
  document.querySelectorAll("[data-email]").forEach((el) => {
    el.textContent = config.email || "";
    if (el.tagName === "A") el.href = `mailto:${config.email}`;
  });
  document.querySelectorAll("[data-phone]").forEach((el) => {
    el.textContent = config.phone || "";
    if (el.tagName === "A") el.href = `tel:${(config.phone || "").replace(/[^\d+]/g, "")}`;
  });
  document.querySelectorAll("[data-phone-link]").forEach((el) => {
    if (el.tagName === "A") el.href = `tel:${(config.phone || "").replace(/[^\d+]/g, "")}`;
  });
  document.querySelectorAll("[data-phone-label]").forEach((el) => {
    el.textContent = config.phoneLabel || "Call now";
  });
  document.querySelectorAll("[data-website]").forEach((el) => {
    el.textContent = config.website || "";
  });
  document.querySelectorAll("[data-address]").forEach((el) => {
    el.textContent = config.address || "";
  });
  document.querySelectorAll("[data-hours]").forEach((el) => {
    el.textContent = config.businessHours || "";
  });
  document.querySelectorAll("[data-company-line]").forEach((el) => {
    el.textContent = `${config.companyName || "Kitchen Match Network"} - ${config.address || ""} - ID ${config.companyId || ""}`;
  });
  document.querySelectorAll("[data-footer-text]").forEach((el) => {
    el.textContent = config.footerText || "";
  });
  document.querySelectorAll("[data-copyright]").forEach((el) => {
    el.textContent = `Copyright ${new Date().getFullYear()} ${config.companyName || "Kitchen Match Network"}. All rights reserved.`;
  });
  document.querySelectorAll("[data-service-links]").forEach((el) => {
    el.innerHTML = services
      .map(([label, href]) => `<a href="${prefix}${href}">${label}</a>`)
      .join("");
  });
}

function initServicesDropdown() {
  const prefix = relativePrefix();
  document.querySelectorAll(".nav-links").forEach((nav) => {
    if (nav.querySelector(".nav-services")) return;

    const servicesLink = Array.from(nav.querySelectorAll("a")).find((link) => {
      const label = link.textContent.trim().toLowerCase();
      return label === "services";
    });
    if (!servicesLink) return;

    const isActive = servicesLink.classList.contains("active");
    const wrapper = document.createElement("div");
    wrapper.className = `nav-item nav-services${isActive ? " active" : ""}`;
    wrapper.innerHTML = `
      <button class="nav-dropdown-toggle" type="button" aria-expanded="false">
        <span>Services</span>
        <i data-lucide="chevron-down"></i>
      </button>
      <div class="nav-dropdown">
        <a class="nav-dropdown-feature" href="${prefix}services.html">
          <span>All Services</span>
          <small>Browse every kitchen remodeling category</small>
        </a>
        ${services
          .map(([label, href]) => `<a href="${prefix}${href}">${label}</a>`)
          .join("")}
      </div>
    `;

    servicesLink.replaceWith(wrapper);
  });

  if (window.lucide) lucide.createIcons();
}

function initMenu() {
  const toggle = document.querySelector(".menu-toggle");
  const links = document.querySelector(".nav-links");
  if (!toggle || !links) return;
  const serviceDropdowns = document.querySelectorAll(".nav-services");

  function setMenu(open) {
    links.classList.toggle("is-open", open);
    document.body.classList.toggle("nav-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    toggle.innerHTML = `<i data-lucide="${open ? "x" : "menu"}"></i>`;
    if (!open) {
      serviceDropdowns.forEach((dropdown) => {
        dropdown.classList.remove("is-open");
        dropdown.querySelector(".nav-dropdown-toggle")?.setAttribute("aria-expanded", "false");
      });
    }
    if (window.lucide) lucide.createIcons();
  }

  function closeServiceDropdowns(except = null) {
    serviceDropdowns.forEach((dropdown) => {
      if (dropdown === except) return;
      dropdown.classList.remove("is-open");
      dropdown.querySelector(".nav-dropdown-toggle")?.setAttribute("aria-expanded", "false");
    });
  }

  serviceDropdowns.forEach((dropdown) => {
    const dropdownToggle = dropdown.querySelector(".nav-dropdown-toggle");
    dropdownToggle?.addEventListener("click", () => {
      const open = !dropdown.classList.contains("is-open");
      closeServiceDropdowns(dropdown);
      dropdown.classList.toggle("is-open", open);
      dropdownToggle.setAttribute("aria-expanded", String(open));
    });
  });

  toggle.addEventListener("click", () => {
    setMenu(!links.classList.contains("is-open"));
  });

  links.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      setMenu(false);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && links.classList.contains("is-open")) {
      setMenu(false);
      return;
    }
    if (event.key === "Escape") {
      closeServiceDropdowns();
    }
  });

  document.addEventListener("click", (event) => {
    if (!event.target.closest(".nav-services")) closeServiceDropdowns();
  });
}

function initAnimations() {
  if (!window.gsap || !window.ScrollTrigger) return;

  gsap.registerPlugin(ScrollTrigger);

  gsap.utils.toArray("[data-reveal]").forEach((el) => {
    gsap.from(el, {
      y: 48,
      opacity: 0,
      duration: 0.9,
      ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 86%" },
    });
  });

  gsap.utils.toArray("[data-split]").forEach((el) => {
    const words = el.textContent.trim().split(" ");
    el.innerHTML = words.map((word) => `<span class="word">${word}</span>`).join(" ");
    gsap.from(el.querySelectorAll(".word"), {
      yPercent: 100,
      opacity: 0,
      rotateX: -45,
      stagger: 0.045,
      duration: 0.8,
      ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 88%" },
    });
  });

  gsap.utils.toArray(".image-reveal img").forEach((img) => {
    gsap.fromTo(
      img,
      { clipPath: "inset(0 100% 0 0)" },
      {
        clipPath: "inset(0 0% 0 0)",
        duration: 1.15,
        ease: "power3.out",
        scrollTrigger: { trigger: img, start: "top 82%" },
      },
    );
  });

  gsap.utils.toArray("[data-parallax]").forEach((el) => {
    gsap.to(el, {
      y: Number(el.dataset.parallax || -80),
      ease: "none",
      scrollTrigger: {
        trigger: el,
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
      },
    });
  });
}

function initSwiper() {
  if (!window.Swiper) return;
  document.querySelectorAll(".service-swiper").forEach((el) => {
    new Swiper(el, {
      loop: true,
      slidesPerView: 1,
      spaceBetween: 24,
      autoplay: { delay: 6000, disableOnInteraction: false },
      pagination: {
        el: el.querySelector(".swiper-pagination"),
        type: "progressbar",
      },
      breakpoints: {
        768: { slidesPerView: 2 },
        1100: { slidesPerView: 3 },
      },
    });
  });
}

function initForm() {
  const form = document.querySelector("[data-contact-form]");
  const success = document.querySelector(".success-message");
  const modal = document.querySelector("[data-confirmation-modal]");
  const modalMessage = document.querySelector("[data-confirmation-message]");
  if (!form || !success) return;

  function confirmationText() {
    return (config.successMessage || "")
      .replace("{company}", config.companyName || "Kitchen Match Network")
      .replace("{email}", config.email || "");
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove("is-open");
    document.body.classList.remove("modal-open");
    window.setTimeout(() => {
      modal.hidden = true;
    }, 220);
  }

  function openModal(message) {
    if (!modal || !modalMessage) return;
    modalMessage.textContent = message;
    modal.hidden = false;
    document.body.classList.add("modal-open");
    window.requestAnimationFrame(() => modal.classList.add("is-open"));
    const closeButton = modal.querySelector("[data-modal-close]");
    if (closeButton) closeButton.focus();
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const message = confirmationText();
    success.textContent = message;
    success.style.display = "none";
    form.reset();
    openModal(message);
  });

  if (modal) {
    modal.addEventListener("click", (event) => {
      if (event.target === modal || event.target.closest("[data-modal-close]")) {
        closeModal();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !modal.hidden) closeModal();
    });
  }
}

function initAccordions() {
  document.querySelectorAll(".faq-grid details").forEach((details) => {
    const summary = details.querySelector("summary");
    if (!summary) return;

    let content = details.querySelector(".faq-content");
    if (!content) {
      content = document.createElement("div");
      content.className = "faq-content";
      while (summary.nextSibling) content.appendChild(summary.nextSibling);
      details.appendChild(content);
    }

    content.style.height = details.open ? `${content.scrollHeight}px` : "0px";
    content.style.opacity = details.open ? "1" : "0";

    summary.addEventListener("click", (event) => {
      event.preventDefault();
      const isOpen = details.open;
      const startHeight = content.offsetHeight;
      const endHeight = isOpen ? 0 : content.scrollHeight;

      if (!isOpen) details.open = true;

      content.animate(
        [
          { height: `${startHeight}px`, opacity: isOpen ? 1 : 0 },
          { height: `${endHeight}px`, opacity: isOpen ? 0 : 1 },
        ],
        { duration: 280, easing: "cubic-bezier(.22,.61,.36,1)" },
      ).onfinish = () => {
        content.style.height = isOpen ? "0px" : `${content.scrollHeight}px`;
        content.style.opacity = isOpen ? "0" : "1";
        if (isOpen) details.open = false;
      };
    });
  });
}

function initCookieBanner() {
  const storageKey = "kitchenMatchCookieChoice";
  const savedChoice = localStorage.getItem(storageKey);
  if (savedChoice) return;

  const prefix = relativePrefix();
  const banner = document.createElement("aside");
  banner.className = "cookie-banner";
  banner.setAttribute("aria-label", "Cookie notice");
  banner.innerHTML = `
    <div class="cookie-copy">
      <span class="eyebrow">Cookie Notice</span>
      <h2>We Use Cookies Carefully</h2>
      <p>Cookies may support site operation, form behavior, security, and basic performance measurement. This aggregator does not perform remodeling work and does not add advertising trackers unless configured.</p>
      <a href="${prefix}cookie-policy.html">Read Cookie Policy</a>
    </div>
    <div class="cookie-actions">
      <button class="btn secondary" type="button" data-cookie-choice="declined"><span>Decline</span></button>
      <button class="btn secondary" type="button" data-cookie-choice="managed"><span>Manage</span></button>
      <button class="btn" type="button" data-cookie-choice="accepted"><span>Accept</span><i data-lucide="check"></i></button>
    </div>
  `;

  function updateCookieOffset() {
    document.documentElement.style.setProperty("--cookie-offset", `${banner.offsetHeight + 18}px`);
  }

  const handleCookieResize = () => updateCookieOffset();

  function saveChoice(choice) {
    localStorage.setItem(storageKey, choice);
    document.body.classList.remove("cookie-notice-active");
    document.documentElement.style.removeProperty("--cookie-offset");
    window.removeEventListener("resize", handleCookieResize);
    banner.classList.add("is-hidden");
    window.setTimeout(() => banner.remove(), 260);
  }

  banner.addEventListener("click", (event) => {
    const button = event.target.closest("[data-cookie-choice]");
    if (!button) return;
    const choice = button.dataset.cookieChoice;
    if (choice === "managed") {
      window.location.href = `${prefix}cookie-policy.html`;
      return;
    }
    saveChoice(choice);
  });

  document.body.appendChild(banner);
  document.body.classList.add("cookie-notice-active");
  window.requestAnimationFrame(() => {
    updateCookieOffset();
    banner.classList.add("is-visible");
  });
  window.addEventListener("resize", handleCookieResize);
  if (window.lucide) window.lucide.createIcons();
}

function initFloatingActionButton() {
  const phone = config.phone || "";
  const cleanPhone = phone.replace(/[^\d+]/g, "");
  if (!cleanPhone) return;

  const action = document.createElement("a");
  action.className = "floating-action";
  action.href = `tel:${cleanPhone}`;
  action.setAttribute("aria-label", `Call ${config.companyName || "Kitchen Match Network"}`);
  action.innerHTML = `
    <span class="floating-action-icon"><i data-lucide="phone-call"></i></span>
    <span>Call</span>
  `;

  function updateVisibility() {
    action.classList.toggle("is-visible", window.scrollY > 160);
  }

  document.body.appendChild(action);
  updateVisibility();
  window.addEventListener("scroll", updateVisibility, { passive: true });
  if (window.lucide) window.lucide.createIcons();
}

document.addEventListener("DOMContentLoaded", () => {
  applyConfig();
  initServicesDropdown();
  initMenu();
  initCookieBanner();
  initFloatingActionButton();
  initAnimations();
  initSwiper();
  initForm();
  initAccordions();
  if (window.lucide) window.lucide.createIcons();
});
