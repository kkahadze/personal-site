export function getSystemTheme() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  const btn = document.getElementById("theme-toggle");
  btn.innerHTML = theme === "dark" ? '<span style="font-size:1.3em;position:relative;top:-2px">☀</span>' : "☾";
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
