export const languageTrees = [
  {
    name: "Indo-European", nameKa: "ინდოევროპული",
    url: "https://en.wikipedia.org/wiki/Indo-European_languages",
    children: [
      { name: "Russian", nameKa: "რუსული", level: 3, url: "https://en.wikipedia.org/wiki/Russian_language" },
      { name: "Spanish", nameKa: "ესპანური", level: 2, url: "https://en.wikipedia.org/wiki/Spanish_language" },
      { name: "English", nameKa: "ინგლისური", level: 4, url: "https://en.wikipedia.org/wiki/English_language" },
    ],
  },
  {
    name: "Kartvelian", nameKa: "ქართველური",
    url: "https://en.wikipedia.org/wiki/Kartvelian_languages",
    children: [
      { name: "Georgian", nameKa: "ქართული", level: 4, url: "https://en.wikipedia.org/wiki/Georgian_language" },
      { name: "Mingrelian", nameKa: "მეგრული", level: 1, url: "https://en.wikipedia.org/wiki/Mingrelian_language" },
    ],
  },
  {
    name: "Sino-Tibetan", nameKa: "სინო-ტიბეტური",
    url: "https://en.wikipedia.org/wiki/Sino-Tibetan_languages",
    children: [{ name: "Chinese", nameKa: "ჩინური", level: 1, url: "https://en.wikipedia.org/wiki/Chinese_language" }],
  },
];

export const proficiencyColors = ["#e74c3c", "#f39c12", "#f1c40f", "#2ecc71"];
