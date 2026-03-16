import { initNavMenu, initTheme } from "./main.js";
import { initI18n, translations } from "./i18n.js";
import { posts } from "./generated/writing-data.js";

function getLang() {
  return document.documentElement.lang || "en";
}

function formatDate(dateString) {
  if (!dateString) {
    return "";
  }

  const lang = getLang();
  const locale = lang === "ka" ? "ka-GE" : "en-US";
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(dateString));
}

function renderPost() {
  const slug = window.__WRITING_SLUG__;
  const container = document.getElementById("writing-post");
  const post = posts.find((entry) => entry.slug === slug);
  const lang = getLang();

  if (!post) {
    const fallbackTitle = translations[lang]?.writingMissingTitle || "Post not found";
    const fallbackBody = translations[lang]?.writingMissingBody || "This post does not exist.";
    container.innerHTML = `
      <header class="writing-post-header">
        <h1 class="writing-post-title">${fallbackTitle}</h1>
      </header>
      <p class="writing-post-description">${fallbackBody}</p>
    `;
    return;
  }

  document.title = `${post.title} - Konstantine Kahadze`;
  const dateHtml = post.date
    ? `<time class="writing-post-date" datetime="${post.date}">${formatDate(post.date)}</time>`
    : "";

  container.innerHTML = `
    <header class="writing-post-header">
      <h1 class="writing-post-title">${post.title}</h1>
      ${dateHtml}
      <p class="writing-post-description">${post.description}</p>
    </header>
    <div class="writing-post-body markdown-body">${post.contentHtml}</div>
  `;
}

document.addEventListener("DOMContentLoaded", () => {
  initNavMenu();
  initTheme();
  initI18n();
  renderPost();

  document.querySelectorAll(".lang-option").forEach((option) => {
    option.addEventListener("click", () => {
      requestAnimationFrame(renderPost);
    });
  });
});
