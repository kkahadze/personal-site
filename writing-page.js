import { initNavMenu, initTheme } from "./main.js";
import { initI18n, translations } from "./i18n.js";
import { externalWriting } from "./data/writing.js";
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
    month: "short",
    day: "numeric",
  }).format(new Date(dateString));
}

function renderItem(item, showDate = true) {
  const dateHtml = showDate && item.date
    ? `<time class="writing-item-date" datetime="${item.date}">${formatDate(item.date)}</time>`
    : "";
  const markerHtml = item.isExternal
    ? `<span class="writing-item-marker" aria-hidden="true">↗</span>`
    : "";
  const body = `
    ${dateHtml}
    <div class="writing-item-main">
      <h2 class="writing-item-title">${item.title}</h2>
      <p class="writing-item-description">${item.description}</p>
    </div>
    ${markerHtml}
  `;

  if (item.isExternal) {
    return `<a class="writing-item" href="${item.url}" target="_blank" rel="noopener">${body}</a>`;
  }

  return `<a class="writing-item" href="${item.url}">${body}</a>`;
}

function renderWriting() {
  const container = document.getElementById("writing-list");
  const internalItems = posts.map((post) => ({
    title: post.title,
    url: `/writing/${post.slug}/`,
    date: post.date,
    description: post.description,
    isExternal: false,
  }));
  const externalItems = externalWriting.map((item) => ({
    ...item,
    isExternal: true,
  }));
  const allItems = [...internalItems, ...externalItems];
  const datedItems = allItems
    .filter((item) => item.date)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const undatedItems = allItems.filter((item) => !item.date);
  const lang = getLang();
  const guidesLabel = translations[lang]?.writingGuides || "Guides";

  container.innerHTML = `
    ${datedItems.map((item) => renderItem(item)).join("")}
    ${
      undatedItems.length
        ? `
      <div class="writing-section-label">${guidesLabel}</div>
      ${undatedItems.map((item) => renderItem(item, false)).join("")}
    `
        : ""
    }
  `;
}

document.addEventListener("DOMContentLoaded", () => {
  initNavMenu();
  initTheme();
  initI18n();
  renderWriting();

  document.querySelectorAll(".lang-option").forEach((option) => {
    option.addEventListener("click", () => {
      requestAnimationFrame(renderWriting);
    });
  });
});
