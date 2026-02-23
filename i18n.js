const translations = {
  en: {
    firstName: "Konstantine",
    lastNameRoot: "Kaha",
    lastNameSuffix: "dze",
    bio: 'Developer Relations Engineer at <a href="https://www.promptfoo.dev/" target="_blank" rel="noopener">Promptfoo</a>, the most widely adopted open-source AI security platform',
    navAbout: "About",
    navResume: "Resume",
    navStats: "Stats",
    navContact: "Contact",
    resumeTitle: "Resume",
    resumeExperience: "Experience",
    resumeEducation: "Education",
    resumeSkills: "Skills",
    contactTitle: "Contact",
    aboutTitle: "About",
    aboutIntro1: 'I\'m Konstantine — a Developer Relations Engineer at <a href="https://promptfoo.dev" target="_blank" rel="noopener">Promptfoo</a>, where I help scale a community of over 300k open-source engineers building the framework for AI evaluation and security.',
    aboutIntro2: 'Before that, I was an AI Engineer at <a href="https://learnprompting.org" target="_blank" rel="noopener">Learn Prompting</a>, where I built AI-generated video pipelines and designed <a href="https://hackaprompt.com" target="_blank" rel="noopener">red-teaming competitions</a>.',
    aboutILike: "I Like",
    aboutILikeText: "Lorem ipsum dolor sit amet \u2014 replace this with things you enjoy.",
    statsTitle: "Stats",
    statsLanguages: "Languages",
  },
  ka: {
    firstName: "კონსტანტინე",
    lastNameRoot: "კახა",
    lastNameSuffix: "ძე",
    bio: 'დევრელის ინჟინერი <a href="https://www.promptfoo.dev/" target="_blank" rel="noopener">Promptfoo</a>-ში, ყველაზე ფართოდ გავრცელებულ AI უსაფრთხოების პლატფორმაში',
    navAbout: "ჩემ შესახებ",
    navResume: "რეზიუმე",
    navStats: "სტატისტიკა",
    navContact: "კონტაქტი",
    resumeTitle: "რეზიუმე",
    resumeExperience: "გამოცდილება",
    resumeEducation: "განათლება",
    resumeSkills: "უნარები",
    contactTitle: "კონტაქტი",
    aboutTitle: "ჩემ შესახებ",
    aboutIntro1: 'მე ვარ კონსტანტინე — დევრელის ინჟინერი <a href="https://promptfoo.dev" target="_blank" rel="noopener">Promptfoo</a>-ში, სადაც ვეხმარები 300 ათასზე მეტ ინჟინერს ჩვენი AI ხელსაწყოს გამოყენებაში, AI შეფასების და უსაფრთხოებისთვის.',
    aboutIntro2: 'მანამდე ვიყავი AI ინჟინერი <a href="https://learnprompting.org" target="_blank" rel="noopener">Learn Prompting</a>-ში, სადაც ვაშენებდი AI-თ გენერირებულ ვიდეო პაიპლაინებს და ვქმნიდი <a href="https://hackaprompt.com" target="_blank" rel="noopener">რედ-თიმინგის შეჯიბრებებს</a>.',
    aboutILike: "მომწონს",
    aboutILikeText: "Lorem ipsum dolor sit amet \u2014 ჩაანაცვლე ეს იმით, რაც მოგწონს.",
    statsTitle: "სტატისტიკა",
    statsLanguages: "ენები",
  },
};

const langLabels = { en: "EN", ka: "ქა" };

function setLanguage(lang) {
  document.documentElement.lang = lang;
  document.getElementById("lang-btn").textContent = langLabels[lang];
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (translations[lang]?.[key]) {
      if (el.getAttribute("data-i18n-html") !== null) {
        el.innerHTML = translations[lang][key];
      } else {
        el.textContent = translations[lang][key];
      }
    }
  });
  localStorage.setItem("lang", lang);
}

function initI18n() {
  const saved = localStorage.getItem("lang");
  const lang = saved || "en";
  setLanguage(lang);

  const btn = document.getElementById("lang-btn");
  const dropdown = document.getElementById("lang-dropdown");

  btn.addEventListener("click", () => {
    dropdown.classList.toggle("open");
  });

  document.querySelectorAll(".lang-option").forEach((opt) => {
    opt.addEventListener("click", () => {
      setLanguage(opt.dataset.lang);
      dropdown.classList.remove("open");
    });
  });

  document.addEventListener("click", (e) => {
    if (!e.target.closest(".lang-picker")) {
      dropdown.classList.remove("open");
    }
  });
}

export { initI18n, setLanguage, translations };
