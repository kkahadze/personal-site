import { initNavMenu, initTheme } from "./main.js";
import { initI18n } from "./i18n.js";
import { jobs, degrees } from "./data/resume.js";

function getLang() {
  return document.documentElement.lang || "en";
}

function formatDate(dateStr) {
  const [year, month] = dateStr.split("-");
  const lang = getLang();
  const monthsEn = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthsKa = ["იან", "თებ", "მარ", "აპრ", "მაი", "ივნ", "ივლ", "აგვ", "სექ", "ოქტ", "ნოე", "დეკ"];
  const months = lang === "ka" ? monthsKa : monthsEn;
  return `${months[parseInt(month, 10) - 1]} ${year}`;
}

function renderJob(job) {
  const lang = getLang();
  const start = formatDate(job.startDate);
  const end = job.endDate ? formatDate(job.endDate) : (lang === "ka" ? "დღემდე" : "Present");
  const position = (lang === "ka" && job.positionKa) ? job.positionKa : job.position;
  const highlights = (lang === "ka" && job.highlightsKa) ? job.highlightsKa : job.highlights;
  return `
    <article class="job-card">
      <header>
        <h3 class="job-title"><a href="${job.url}" target="_blank" rel="noopener">${job.name}</a></h3>
        <p class="job-position">${position}</p>
        <p class="job-daterange">${start} – ${end}</p>
      </header>
      ${job.summary ? `<p class="job-summary">${job.summary}</p>` : ""}
      ${
        highlights
          ? `<ul class="job-highlights">${highlights.map((h) => `<li>${h}</li>`).join("")}</ul>`
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
          (deg) => {
            const lang = getLang();
            const degree = (lang === "ka" && deg.degreeKa) ? deg.degreeKa : deg.degree;
            const school = (lang === "ka" && deg.schoolKa) ? deg.schoolKa : deg.school;
            return `
        <article class="degree-card">
          <h3>${degree}</h3>
          <p class="degree-school"><a href="${deg.link}" target="_blank" rel="noopener">${school}</a>${deg.year ? `, <time>${deg.year}</time>` : ''}</p>
        </article>
      `;
          }
        )
        .join("")}
    </section>
  `;
}

function renderResume() {
  const container = document.getElementById("resume-content");
  container.innerHTML = `${renderExperience()}${renderEducation()}`;
}

document.addEventListener("DOMContentLoaded", () => {
  initNavMenu();
  initTheme();
  renderResume();
  initI18n();

  // Re-render when language changes
  document.querySelectorAll(".lang-option").forEach((opt) => {
    opt.addEventListener("click", () => {
      requestAnimationFrame(() => {
        renderResume();
      });
    });
  });
});
