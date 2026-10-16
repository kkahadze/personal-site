import { translations } from "./i18n.js";

const themeLabels = {
  en: {
    light: "Switch to light appearance",
    dark: "Switch to dark appearance",
    open: "Open navigation",
    close: "Close navigation",
  },
  ka: {
    light: "ღია თემაზე გადართვა",
    dark: "მუქ თემაზე გადართვა",
    open: "ნავიგაციის გახსნა",
    close: "ნავიგაციის დახურვა",
  },
};

function getLabels() {
  return themeLabels[document.documentElement.lang] || themeLabels.en;
}

function readPreference(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function savePreference(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* Preferences are optional when browser storage is unavailable. */
  }
}

function getSavedTheme() {
  const theme = readPreference("theme");
  return theme === "light" || theme === "dark" ? theme : null;
}

export function getSystemTheme() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function applyTheme(theme) {
  const current =
    theme === "light" || theme === "dark" ? theme : getSystemTheme();
  document.documentElement.setAttribute("data-theme", current);
  const button = document.getElementById("theme-toggle");
  if (!button) return;
  const target = current === "dark" ? "light" : "dark";
  button.setAttribute("aria-label", getLabels()[target]);
  button.title = getLabels()[target];
  button.innerHTML =
    current === "dark"
      ? '<svg class="theme-toggle-icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"></path></svg>'
      : '<svg class="theme-toggle-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>';
}

export function initNavMenu() {
  const navbar = document.querySelector(".navbar");
  const toggle = document.getElementById("nav-menu-toggle");
  const panel = document.getElementById("nav-panel");
  if (!navbar || !toggle || !panel || toggle.dataset.initialized) return;
  toggle.dataset.initialized = "true";
  const mobileQuery = window.matchMedia("(max-width: 760px)");

  function syncMenu() {
    const open =
      mobileQuery.matches && navbar.classList.contains("navbar--menu-open");
    const unavailable = mobileQuery.matches && !open;
    panel.inert = unavailable;
    if (unavailable) panel.setAttribute("aria-hidden", "true");
    else panel.removeAttribute("aria-hidden");
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", getLabels()[open ? "close" : "open"]);
    toggle.title = getLabels()[open ? "close" : "open"];
  }

  function closeMenu(restoreFocus = false) {
    // Move focus before making the panel inert, so focus never remains in hidden content.
    if (restoreFocus && mobileQuery.matches) toggle.focus();
    navbar.classList.remove("navbar--menu-open");
    syncMenu();
  }

  toggle.addEventListener("click", () => {
    navbar.classList.toggle("navbar--menu-open");
    syncMenu();
  });
  panel.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => closeMenu(true));
  });
  document.addEventListener("click", (event) => {
    if (!event.composedPath().includes(navbar))
      closeMenu(panel.contains(document.activeElement));
  });
  document.addEventListener("keydown", (event) => {
    // Escape dismisses the nested language disclosure before the whole mobile menu.
    if (
      event.key === "Escape" &&
      navbar.classList.contains("navbar--menu-open") &&
      !document.getElementById("lang-dropdown")?.classList.contains("open")
    )
      closeMenu(true);
  });
  mobileQuery.addEventListener("change", () =>
    closeMenu(panel.contains(document.activeElement)),
  );
  document.addEventListener("languagechange", syncMenu);
  syncMenu();
}

let themeInitialized = false;
export function initTheme() {
  applyTheme(getSavedTheme() || getSystemTheme());
  if (themeInitialized) return;
  themeInitialized = true;
  document.getElementById("theme-toggle")?.addEventListener("click", () => {
    const next =
      document.documentElement.getAttribute("data-theme") === "dark"
        ? "light"
        : "dark";
    savePreference("theme", next);
    applyTheme(next);
  });
  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", (event) => {
      if (!getSavedTheme()) applyTheme(event.matches ? "dark" : "light");
    });
  document.addEventListener("languagechange", () =>
    applyTheme(document.documentElement.getAttribute("data-theme")),
  );
  initEnhancements();
}

let enhancementsInitialized = false;
export function initEnhancements() {
  if (enhancementsInitialized) return;
  enhancementsInitialized = true;
  const copyFallback = {
    en: {
      copyEmail: "Copy email address",
      copiedEmail: "Email address copied.",
      copyFailed: "Couldn’t copy. Please copy the address directly.",
    },
    ka: {
      copyEmail: "ელფოსტის მისამართის კოპირება",
      copiedEmail: "ელფოსტა დაკოპირებულია.",
      copyFailed: "კოპირება ვერ მოხერხდა. გთხოვთ, მისამართი ხელით დააკოპიროთ.",
    },
  };
  const copyText = (key) => {
    const lang = document.documentElement.lang === "ka" ? "ka" : "en";
    return translations[lang]?.[key] || copyFallback[lang][key];
  };
  const copyButtons = document.querySelectorAll("[data-copy-email]");
  const updateCopyLabels = () =>
    copyButtons.forEach((button) => {
      if (button.classList.contains("is-copied")) return;
      button.setAttribute("aria-label", copyText("copyEmail"));
      button.title = copyText("copyEmail");
    });
  document.addEventListener("languagechange", updateCopyLabels);
  updateCopyLabels();
  copyButtons.forEach((button) => {
    let feedbackTimer;
    let copying = false;
    button.addEventListener("click", async () => {
      if (copying) return;
      copying = true;
      const email = button.dataset.copyEmail || "konstantine@kahadze.com";
      const status = document.getElementById("copy-status");
      if (status) {
        status.setAttribute("role", "status");
        status.setAttribute("aria-live", "polite");
      }
      try {
        if (!navigator.clipboard?.writeText)
          throw new Error("Clipboard is unavailable");
        await navigator.clipboard.writeText(email);
        button.classList.add("is-copied");
        button.setAttribute("aria-label", copyText("copiedEmail"));
        button.title = copyText("copiedEmail");
        if (status) status.textContent = copyText("copiedEmail");
        clearTimeout(feedbackTimer);
        feedbackTimer = setTimeout(() => {
          button.classList.remove("is-copied");
          updateCopyLabels();
          if (status) status.textContent = "";
        }, 2500);
      } catch {
        if (status) status.textContent = copyText("copyFailed");
      } finally {
        copying = false;
      }
    });
  });

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
  document.querySelectorAll(".glass-surface").forEach((surface) => {
    let frame;
    const reset = () => {
      cancelAnimationFrame(frame);
      surface.style.removeProperty("--pointer-x");
      surface.style.removeProperty("--pointer-y");
    };
    surface.addEventListener(
      "pointermove",
      (event) => {
        if (reducedMotion.matches || !finePointer.matches) return;
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(() => {
          const rect = surface.getBoundingClientRect();
          surface.style.setProperty(
            "--pointer-x",
            `${event.clientX - rect.left}px`,
          );
          surface.style.setProperty(
            "--pointer-y",
            `${event.clientY - rect.top}px`,
          );
        });
      },
      { passive: true },
    );
    surface.addEventListener("pointerleave", reset);
    reducedMotion.addEventListener("change", reset);
  });
}
