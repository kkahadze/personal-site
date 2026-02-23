import { initTheme } from "./main.js";
import { initI18n } from "./i18n.js";
import { jobs, degrees, skills, categoryColors } from "./data/resume.js";

function formatDate(dateStr) {
  const [year, month] = dateStr.split("-");
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  return `${months[parseInt(month, 10) - 1]} ${year}`;
}

function renderJob(job) {
  const start = formatDate(job.startDate);
  const end = job.endDate ? formatDate(job.endDate) : "Present";
  return `
    <article class="job-card">
      <header>
        <h3 class="job-title"><a href="${job.url}" target="_blank" rel="noopener">${job.name}</a></h3>
        <p class="job-position">${job.position}</p>
        <p class="job-daterange">${start} – ${end}</p>
      </header>
      ${job.summary ? `<p class="job-summary">${job.summary}</p>` : ""}
      ${
        job.highlights
          ? `<ul class="job-highlights">${job.highlights.map((h) => `<li>${h}</li>`).join("")}</ul>`
          : ""
      }
    </article>
  `;
}

function renderExperience() {
  return `
    <section class="resume-section" id="experience">
      <div class="section-title">
        <h2 data-i18n="resumeExperience">Experience</h2>
      </div>
      ${jobs.map(renderJob).join("")}
    </section>
  `;
}

function renderEducation() {
  return `
    <section class="resume-section" id="education">
      <div class="section-title">
        <h2 data-i18n="resumeEducation">Education</h2>
      </div>
      ${degrees
        .map(
          (deg) => `
        <article class="degree-card">
          <h3>${deg.degree}</h3>
          <p class="degree-school"><a href="${deg.link}" target="_blank" rel="noopener">${deg.school}</a>, <time>${deg.year}</time></p>
        </article>
      `
        )
        .join("")}
    </section>
  `;
}

function renderSkillGroups(activeCategory) {
  const sorted = [...skills].sort(
    (a, b) => b.competency - a.competency || a.title.localeCompare(b.title)
  );

  const filtered = activeCategory
    ? sorted.filter((s) => s.category.includes(activeCategory))
    : sorted;

  const groups = {};
  for (const skill of filtered) {
    const cat = activeCategory || skill.category[0];
    if (!groups[cat]) groups[cat] = [];
    if (!groups[cat].find((s) => s.title === skill.title)) {
      groups[cat].push(skill);
    }
  }

  const catOrder = categoryColors.map((c) => c.name);
  return Object.entries(groups)
    .sort((a, b) => catOrder.indexOf(a[0]) - catOrder.indexOf(b[0]))
    .map(([catName, catSkills]) => {
      const catColor =
        categoryColors.find((c) => c.name === catName)?.color || "#999";
      return `
      <div class="skill-group">
        <h3 class="skill-group-title" style="--cat-color: ${catColor}">${catName}</h3>
        <div class="skill-tags">
          ${catSkills
            .map((skill) => {
              const color =
                categoryColors.find((c) => skill.category.includes(c.name))
                  ?.color || "#999";
              const sizeClass =
                skill.competency >= 5
                  ? "skill-tag--lg"
                  : skill.competency >= 4
                    ? "skill-tag--md"
                    : "skill-tag--sm";
              return `<span class="skill-tag ${sizeClass}" style="--tag-color: ${color}" title="${skill.title}: ${skill.competency}/5"><span class="skill-tag-name">${skill.title}</span></span>`;
            })
            .join("")}
        </div>
      </div>
    `;
    })
    .join("");
}

function renderSkills() {
  const allCategories = [...new Set(skills.flatMap((s) => s.category))];

  return `
    <section class="resume-section" id="skills">
      <div class="section-title">
        <h2 data-i18n="resumeSkills">Skills</h2>
      </div>
      <div class="skill-button-container" id="skill-filters">
        <button class="skillbutton skillbutton-active" data-category="All">All</button>
        ${allCategories.map((cat) => `<button class="skillbutton" data-category="${cat}">${cat}</button>`).join("")}
      </div>
      <div class="skill-groups" id="skill-groups">
        ${renderSkillGroups(null)}
      </div>
    </section>
  `;
}

function renderResume() {
  const container = document.getElementById("resume-content");
  container.innerHTML = `${renderExperience()}${renderEducation()}${renderSkills()}`;
}

function initResumeNav() {
  const navLinks = document.querySelectorAll(".resume-nav-link");
  const sections = document.querySelectorAll(".resume-section");

  if (!("IntersectionObserver" in window)) return;

  const observer = new IntersectionObserver(
    (entries) => {
      let best = null;
      for (const entry of entries) {
        if (entry.isIntersecting) {
          if (!best || entry.intersectionRatio > best.intersectionRatio) {
            best = entry;
          }
        }
      }
      if (best) {
        navLinks.forEach((link) => {
          const isActive =
            link.getAttribute("href") === `#${best.target.id}`;
          link.classList.toggle("active", isActive);
        });
      }
    },
    {
      threshold: [0, 0.25, 0.5, 0.75, 1],
      rootMargin: "-20% 0px -75% 0px",
    }
  );

  sections.forEach((section) => observer.observe(section));
}

function initSkillFilters() {
  const container = document.getElementById("skill-filters");
  const groupsContainer = document.getElementById("skill-groups");

  container.addEventListener("click", (e) => {
    const btn = e.target.closest(".skillbutton");
    if (!btn) return;

    const category = btn.dataset.category;

    container.querySelectorAll(".skillbutton").forEach((b) => {
      b.classList.toggle("skillbutton-active", b === btn);
    });

    groupsContainer.innerHTML = renderSkillGroups(
      category === "All" ? null : category
    );
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  renderResume();
  initI18n();
  initResumeNav();
  initSkillFilters();
});
