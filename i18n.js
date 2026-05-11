const translations = {
  en: {
    firstName: "Konstantine",
    lastNameRoot: "Kaha",
    lastNameSuffix: "dze",
    bio: 'Developer Experience Engineer at <a href="https://openai.com/" target="_blank" rel="noopener">OpenAI</a>',
    navAbout: "About",
    navResume: "Resume",
    navWriting: "Writing",
    navContact: "Contact",
    resumeTitle: "Resume",
    resumeExperience: "Experience",
    resumeEducation: "Education",
    resumeSkills: "Skills",
    contactTitle: "Contact",
    aboutTitle: "About",
    aboutIntro1: 'I\'m Konstantine — a Developer Experience Engineer at <a href="https://openai.com/" target="_blank" rel="noopener">OpenAI</a>, where I help developers build with OpenAI products and APIs.',
    aboutIntro2: 'Previously, I was a Developer Relations Engineer at <a href="https://promptfoo.dev" target="_blank" rel="noopener">Promptfoo</a>, where I helped scale a community of over 300k open-source engineers. Before that, I was an AI Engineer at <a href="https://learnprompting.org" target="_blank" rel="noopener">Learn Prompting</a>, where I built AI-generated video pipelines and designed <a href="https://hackaprompt.com" target="_blank" rel="noopener">red-teaming competitions</a>.',
    aboutILike: "I Like",
    aboutILikeText: '<li>Learning languages.</li><li>Building things with AI, like <a href="https://mkhedruli.com" target="_blank" rel="noopener">mkhedruli.com</a>, the best translator online for the language of Mingrelian, a language with 300k speakers and practically no data online.</li><li>Movies. In the summer of 2025, I got to produce a documentary short about the <a href="https://en.wikipedia.org/wiki/Bats_language" target="_blank" rel="noopener">Tsova-Tush language</a> with my friends <a href="https://www.lukeandnoahclarke.com/" target="_blank" rel="noopener">Noah and Luke Clarke</a>.</li>',
    aboutBtn: "About Me",
    writingTitle: "Writing",
    writingIntro: "Notes, essays, and links.",
    writingGuides: "Guides",
    writingBack: "Back to writing",
    writingMissingTitle: "Post not found",
    writingMissingBody: "This post does not exist.",
  },
  ka: {
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
    aboutIntro1: 'მე ვარ კონსტანტინე — დევექსის ინჟინერი <a href="https://openai.com/" target="_blank" rel="noopener">OpenAI</a>-ში, სადაც დეველოპერებს OpenAI-ის პროდუქტებით და API-ების აშენებაში ვეხმარები.',
    aboutIntro2: 'მანამდე ვიყავი დევრელის ინჟინერი <a href="https://promptfoo.dev" target="_blank" rel="noopener">Promptfoo</a>-ში, სადაც 300 ათასზე მეტი open-source ინჟინრის საზოგადოების გაფართოებაში ვეხმარებოდი. მანამდე კი ვიყავი AI ინჟინერი <a href="https://learnprompting.org" target="_blank" rel="noopener">Learn Prompting</a>-ში, სადაც ვაშენებდი AI-თ გენერირებულ ვიდეო პაიპლაინებს და ვქმნიდი <a href="https://hackaprompt.com" target="_blank" rel="noopener">რედ-თიმინგის შეჯიბრებებს</a>.',
    aboutILike: "მიყვარს",
    aboutILikeText: '<li>ენების სწავლა</li><li>AI პროექტების შექმნა, მაგალითად <a href="https://mkhedruli.com" target="_blank" rel="noopener">mkhedruli.com</a>, LLM-ზე დაფუძნებული მთარგმნელი მეგრულისთვის</li><li>კინო. 2025 წლის ზაფხულში მეგობრებთან, <a href="https://www.lukeandnoahclarke.com/" target="_blank" rel="noopener">ნოასთან და ლუქ კლარქთან</a> ერთად, მოკლემეტრაჟიანი ფილმი გადავიღეთ <a href="https://ka.wikipedia.org/wiki/%E1%83%AC%E1%83%9D%E1%83%95%E1%83%90-%E1%83%97%E1%83%A3%E1%83%A8%E1%83%94%E1%83%91%E1%83%98" target="_blank" rel="noopener">თუშურ-ენაზე</a></li>',
    aboutBtn: "ჩემ შესახებ",
    writingTitle: "წერა",
    writingIntro: "ჩანაწერები, ესეები და ბმულები.",
    writingGuides: "გაიდები",
    writingBack: "უკან წერაზე",
    writingMissingTitle: "პოსტი ვერ მოიძებნა",
    writingMissingBody: "ეს პოსტი არ არსებობს.",
  },
};

const langLabels = { en: "EN", ka: "ქა" };

function setLanguage(lang) {
  document.documentElement.lang = lang;
  document.getElementById("lang-btn").textContent = langLabels[lang];
  document.querySelectorAll(".lang-option").forEach((option) => {
    const isActive = option.dataset.lang === lang;
    option.classList.toggle("active", isActive);
    option.setAttribute("aria-pressed", isActive ? "true" : "false");
  });
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
