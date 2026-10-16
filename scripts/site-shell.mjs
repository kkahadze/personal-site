export const arrow =
  '<svg class="arrow-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
export const diagonal =
  '<svg class="arrow-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 18 18 6M6 6h12v12"/></svg>';
const routes = [
  ["about", "/about.html", "About"],
  ["resume", "/resume.html", "Resume"],
  ["writing", "/writing/", "Writing"],
  ["contact", "/contact.html", "Contact"],
];
export function shell({
  title,
  description,
  page = "",
  content,
  script,
  extraScript = "",
}) {
  return `<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="color-scheme" content="light dark" />
  <meta name="description" content="${description}" />
  <title>${title}</title>
  <link rel="icon" href="/favicon.png" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Georgian:wght@400;500;600;700&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="/style.css" />
  <script>
    (() => {
      let saved;
      try { saved = localStorage.getItem('theme'); } catch {}
      const theme = ['light', 'dark'].includes(saved) ? saved : (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
      document.documentElement.dataset.theme = theme;
    })();
    ${extraScript}
  </script>
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-DPVVKJWZZZ"></script>
  <script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','G-DPVVKJWZZZ');</script>
</head>
<body class="${page}-page-body">
  <a class="skip-link" href="#main" data-i18n="skipContent">Skip to content</a>
  <div class="atmosphere" aria-hidden="true"><div class="light-field field-one"></div><div class="light-field field-two"></div><div class="light-field field-three"></div><div class="orbital orbital-one"></div><div class="orbital orbital-two"></div></div>
  <header class="site-header">
    <nav class="navbar glass-surface" aria-label="Main navigation">
      <a href="/" class="logo-link" aria-label="Konstantine Kahadze — Home"><span class="monogram" aria-hidden="true">კ<span>.</span></span><span class="wordmark">kahadze<span>.com</span></span></a>
      <div class="nav-panel" id="nav-panel">
        <div class="nav-links">${routes.map(([id, href, label]) => `<a href="${href}" class="nav-link${page === id ? " active" : ""}" ${page === id ? 'aria-current="page"' : ""} data-i18n="nav${label}">${label}</a>`).join("")}</div>
        <div class="nav-controls">
          <button id="theme-toggle" class="icon-button" type="button" aria-label="Switch appearance"><svg class="theme-toggle-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg></button>
          <div class="lang-picker"><button id="lang-btn" type="button" aria-label="Select language" aria-expanded="false" aria-controls="lang-dropdown">EN</button><div class="lang-dropdown" id="lang-dropdown"><button class="lang-option" data-lang="en" lang="en">English</button><button class="lang-option" data-lang="ka" lang="ka">ქართული</button></div></div>
        </div>
      </div>
      <button class="nav-menu-toggle" id="nav-menu-toggle" type="button" aria-label="Open navigation" aria-controls="nav-panel" aria-expanded="false"><span class="nav-menu-toggle-bar" aria-hidden="true"></span><span class="nav-menu-toggle-bar" aria-hidden="true"></span></button>
    </nav>
  </header>
  ${content}
  <footer class="site-footer">
    <a href="/" class="footer-signature">Konstantine Kahadze<span data-i18n="footerNote">A little corner of the internet.</span></a>
    <div class="footer-links" aria-label="Social links">
      <a href="https://github.com/kkahadze" target="_blank" rel="noopener">GitHub ${diagonal}</a>
      <a href="https://www.linkedin.com/in/kahadze/" target="_blank" rel="noopener">LinkedIn ${diagonal}</a>
      <a href="https://scholar.google.com/citations?user=uhH7v3IAAAAJ&amp;hl=en" target="_blank" rel="noopener">Scholar ${diagonal}</a>
      <a href="https://x.com/codestantine" target="_blank" rel="noopener" aria-label="X (Twitter)">X ${diagonal}</a>
    </div>
  </footer>
  <script type="module" src="/${script}"></script>
</body>
</html>`;
}
