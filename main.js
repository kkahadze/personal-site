export function getSystemTheme() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  const btn = document.getElementById("theme-toggle");
  btn.innerHTML = theme === "dark"
    ? '<svg class="theme-toggle-icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"></path></svg>'
    : '<svg class="theme-toggle-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>';
}

export function initNavMenu() {
  const navbar = document.querySelector(".navbar");
  const toggle = document.getElementById("nav-menu-toggle");
  const panel = document.getElementById("nav-panel");

  if (!navbar || !toggle || !panel) {
    return;
  }

  const mobileQuery = window.matchMedia("(max-width: 736px)");

  function closeMenu() {
    navbar.classList.remove("navbar--menu-open");
    toggle.setAttribute("aria-expanded", "false");
  }

  function openMenu() {
    navbar.classList.add("navbar--menu-open");
    toggle.setAttribute("aria-expanded", "true");
  }

  toggle.addEventListener("click", (event) => {
    event.stopPropagation();
    const isOpen = navbar.classList.contains("navbar--menu-open");
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  panel.querySelectorAll(".nav-link, .lang-option").forEach((element) => {
    element.addEventListener("click", () => {
      closeMenu();
    });
  });

  document.addEventListener("click", (event) => {
    if (!navbar.contains(event.target)) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });

  mobileQuery.addEventListener("change", (event) => {
    if (!event.matches) {
      closeMenu();
    }
  });
}

export function initTheme() {
  const saved = localStorage.getItem("theme");
  applyTheme(saved || getSystemTheme());

  document.getElementById("theme-toggle").addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme");
    const next = current === "dark" ? "light" : "dark";
    localStorage.setItem("theme", next);
    applyTheme(next);
  });

  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", (e) => {
      if (!localStorage.getItem("theme")) {
        applyTheme(e.matches ? "dark" : "light");
      }
    });
}
