import { interfaceCopy } from "./data/interface-copy.js";

const translations = {
  en: {
    ...interfaceCopy.en,
    firstName: "Konstantine",
    lastNameRoot: "Kaha",
    lastNameSuffix: "dze",
    bio: 'Developer Experience Engineer at <a href="https://openai.com/" target="_blank" rel="noopener">OpenAI</a>',
    navAbout: "About",
    navResume: "Resume",
    navWriting: "Writing",
    navContact: "Contact",
    resumeTitle: "Experience.",
    resumeExperience: "Experience",
    resumeEducation: "Education",
    resumeSkills: "Skills",
    contactTitle: "Say hello.",
    aboutTitle: "About me.",
    aboutIntro1:
      'I\'m Konstantine, a Developer Experience Engineer at <a href="https://openai.com/" target="_blank" rel="noopener">OpenAI</a>, where I help developers build with OpenAI products and APIs.',
    aboutIntro2:
      'Previously, I was at <a href="https://promptfoo.dev" target="_blank" rel="noopener">Promptfoo</a>, where I helped scale an open-source community of over 300k.',
    aboutIntro3:
      "In my free time, I like to learn languages, spend time outside and build AI projects.",
    aboutBtn: "About me",
    writingTitle: "Writing.",
    writingIntro: "Notes on AI, language,\nand the things in between.",
    writingGuides: "Guides",
    writingBack: "Back to writing",
    writingMissingTitle: "Post not found",
    writingMissingBody: "This post does not exist.",
  },
  ka: {
    ...interfaceCopy.ka,
    firstName: "კონსტანტინე",
    lastNameRoot: "კახა",
    lastNameSuffix: "ძე",
    bio: 'დევექსის ინჟინერი <a href="https://openai.com/" target="_blank" rel="noopener">OpenAI</a>-ში',
    navAbout: "ჩემ შესახებ",
    navResume: "რეზიუმე",
    navWriting: "წერა",
    navContact: "კონტაქტი",
    resumeTitle: "რეზიუმე",
    resumeExperience: "გამოცდილება",
    resumeEducation: "განათლება",
    resumeSkills: "უნარები",
    contactTitle: "კონტაქტი",
    aboutTitle: "ჩემ შესახებ",
    aboutIntro1:
      'მე ვარ კონსტანტინე — დევექსის ინჟინერი <a href="https://openai.com/" target="_blank" rel="noopener">OpenAI</a>-ში, სადაც დეველოპერებს OpenAI-ის პროდუქტებით და API-ების აშენებაში ვეხმარები.',
    aboutIntro2:
      'მანამდე ვიყავი დევრელის ინჟინერი <a href="https://promptfoo.dev" target="_blank" rel="noopener">Promptfoo</a>-ში, სადაც 300 ათასზე მეტი open-source ინჟინრის საზოგადოების გაფართოებაში ვეხმარებოდი. მანამდე კი ვიყავი AI ინჟინერი <a href="https://learnprompting.org" target="_blank" rel="noopener">Learn Prompting</a>-ში, სადაც ვაშენებდი AI-თ გენერირებულ ვიდეო პაიპლაინებს და ვქმნიდი <a href="https://hackaprompt.com" target="_blank" rel="noopener">რედ-თიმინგის შეჯიბრებებს</a>.',
    aboutIntro3:
      "თავისუფალ დროს მიყვარს ენების სწავლა, ბუნებაში დროის გატარება და AI პროექტების შექმნა.",
    aboutBtn: "ჩემ შესახებ",
    writingTitle: "წერა",
    writingIntro: "ჩანაწერები AI-ზე, ენებზე\nდა მათ შორის არსებულ კავშირებზე.",
    writingGuides: "გაიდები",
    writingBack: "უკან წერაზე",
    writingMissingTitle: "პოსტი ვერ მოიძებნა",
    writingMissingBody: "ეს პოსტი არ არსებობს.",
  },
};

const langLabels = { en: "EN", ka: "ქა" };
const languageControlLabels = {
  en: "Select language. Current language: English",
  ka: "ენის არჩევა. მიმდინარე ენა: ქართული",
};

function normalizeLanguage(lang) {
  return Object.hasOwn(translations, lang) ? lang : "en";
}

function setLanguage(lang) {
  lang = normalizeLanguage(lang);
  document.documentElement.lang = lang;
  const languageButton = document.getElementById("lang-btn");
  if (languageButton) {
    languageButton.textContent = langLabels[lang];
    languageButton.setAttribute("aria-label", languageControlLabels[lang]);
    languageButton.title = languageControlLabels[lang];
  }
  document.querySelectorAll(".lang-option").forEach((option) => {
    const isActive = option.dataset.lang === lang;
    option.classList.toggle("active", isActive);
    option.setAttribute("aria-pressed", String(isActive));
    option.setAttribute("lang", option.dataset.lang);
  });
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.getAttribute("data-i18n");
    if (!translations[lang]?.[key]) return;
    if (element.hasAttribute("data-i18n-html"))
      element.innerHTML = translations[lang][key];
    else element.textContent = translations[lang][key];
  });
  for (const attribute of ["aria-label", "title"]) {
    document.querySelectorAll(`[data-i18n-${attribute}]`).forEach((element) => {
      const key = element.getAttribute(`data-i18n-${attribute}`);
      if (translations[lang]?.[key])
        element.setAttribute(attribute, translations[lang][key]);
    });
  }
  try {
    localStorage.setItem("lang", lang);
  } catch {
    /* The interface works without persistent storage. */
  }
  document.dispatchEvent(
    new CustomEvent("languagechange", { detail: { language: lang } }),
  );
}

let i18nInitialized = false;
function initI18n() {
  if (i18nInitialized) return;
  i18nInitialized = true;
  let saved;
  try {
    saved = localStorage.getItem("lang");
  } catch {
    saved = null;
  }
  setLanguage(saved || "en");

  const button = document.getElementById("lang-btn");
  const dropdown = document.getElementById("lang-dropdown");
  if (!button || !dropdown) return;
  button.setAttribute("aria-controls", dropdown.id);

  function setDropdownOpen(open, restoreFocus = false) {
    if (restoreFocus) button.focus();
    dropdown.classList.toggle("open", open);
    dropdown.inert = !open;
    dropdown.setAttribute("aria-hidden", String(!open));
    button.setAttribute("aria-expanded", String(open));
  }

  button.addEventListener("click", () =>
    setDropdownOpen(!dropdown.classList.contains("open")),
  );
  document.querySelectorAll(".lang-option").forEach((option) => {
    option.addEventListener("click", () => {
      setLanguage(option.dataset.lang);
      setDropdownOpen(false, true);
    });
  });
  document.addEventListener("click", (event) => {
    if (!event.target.closest(".lang-picker")) setDropdownOpen(false);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && dropdown.classList.contains("open")) {
      event.preventDefault();
      setDropdownOpen(false, true);
    }
  });
  document.addEventListener("focusin", (event) => {
    if (!event.target.closest(".lang-picker")) setDropdownOpen(false);
  });
  setDropdownOpen(false);
}

export { initI18n, setLanguage, translations };
