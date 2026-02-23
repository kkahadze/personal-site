export const languageTrees = [
  {
    name: "Indo-European",
    url: "https://en.wikipedia.org/wiki/Indo-European_languages",
    children: [
      {
        name: "Slavic",
        url: "https://en.wikipedia.org/wiki/Slavic_languages",
        children: [{ name: "Russian", level: 3, url: "https://en.wikipedia.org/wiki/Russian_language" }],
      },
      {
        name: "Romance",
        url: "https://en.wikipedia.org/wiki/Romance_languages",
        children: [{ name: "Spanish", level: 2, url: "https://en.wikipedia.org/wiki/Spanish_language" }],
      },
      {
        name: "Germanic",
        url: "https://en.wikipedia.org/wiki/Germanic_languages",
        children: [{ name: "English", level: 4, url: "https://en.wikipedia.org/wiki/English_language" }],
      },
    ],
  },
  {
    name: "Kartvelian",
    url: "https://en.wikipedia.org/wiki/Kartvelian_languages",
    children: [
      { name: "Georgian", level: 4, url: "https://en.wikipedia.org/wiki/Georgian_language" },
      { name: "Mingrelian", level: 1, url: "https://en.wikipedia.org/wiki/Mingrelian_language" },
    ],
  },
  {
    name: "Sino-Tibetan",
    url: "https://en.wikipedia.org/wiki/Sino-Tibetan_languages",
    children: [{ name: "Chinese", level: 1, url: "https://en.wikipedia.org/wiki/Chinese_language" }],
  },
];

export const proficiencyColors = ["#e74c3c", "#f39c12", "#f1c40f", "#2ecc71"];
