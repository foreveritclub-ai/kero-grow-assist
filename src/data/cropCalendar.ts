export type WeatherZone = "eastern" | "western" | "northern" | "southern" | "kigali";

export const RWANDA_ZONES: Record<WeatherZone, { en: string; ki: string; description_en: string; description_ki: string }> = {
  eastern: {
    en: "Eastern (Iburasirazuba)",
    ki: "Iburasirazuba",
    description_en: "Warm lowlands — Kayonza, Kirehe, Ngoma, Bugesera",
    description_ki: "Ibirwa bishyuha — Kayonza, Kirehe, Ngoma, Bugesera",
  },
  western: {
    en: "Western (Iburengerazuba)",
    ki: "Iburengerazuba",
    description_en: "Lake Kivu region — Rusizi, Nyamasheke, Karongi, Rutsiro",
    description_ki: "Akarere k'ikiyaga cya Kivu — Rusizi, Nyamasheke, Karongi, Rutsiro",
  },
  northern: {
    en: "Northern (Amajyaruguru)",
    ki: "Amajyaruguru",
    description_en: "Volcanic highlands — Musanze, Burera, Gakenke, Rulindo",
    description_ki: "Imisozi y'ibirunga — Musanze, Burera, Gakenke, Rulindo",
  },
  southern: {
    en: "Southern (Amajyepfo)",
    ki: "Amajyepfo",
    description_en: "Mid-altitude — Huye, Nyanza, Gisagara, Nyaruguru",
    description_ki: "Uburebure bwo hagati — Huye, Nyanza, Gisagara, Nyaruguru",
  },
  kigali: {
    en: "Kigali City",
    ki: "Umujyi wa Kigali",
    description_en: "Urban & peri-urban farming — Gasabo, Kicukiro, Nyarugenge",
    description_ki: "Ubuhinzi bw'umujyi — Gasabo, Kicukiro, Nyarugenge",
  },
};

export interface CropSeason {
  crop_en: string;
  crop_ki: string;
  category: string;
  plantingMonths: number[]; // 1-12
  harvestMonths: number[];
  zones: WeatherZone[];
  tips_en: string;
  tips_ki: string;
}

export const CROP_CALENDAR: CropSeason[] = [
  // Season A: Sep-Feb, Season B: Feb-Jul
  {
    crop_en: "Maize (Ibigori)", crop_ki: "Ibigori", category: "cereals",
    plantingMonths: [9, 10, 2, 3], harvestMonths: [1, 2, 6, 7],
    zones: ["eastern", "southern", "kigali", "western", "northern"],
    tips_en: "Plant at start of rains. Space 75cm between rows.",
    tips_ki: "Tera mu ntangiriro y'imvura. Sigaho 75cm hagati y'imirongo.",
  },
  {
    crop_en: "Beans (Ibishyimbo)", crop_ki: "Ibishyimbo", category: "legumes",
    plantingMonths: [9, 10, 2, 3], harvestMonths: [12, 1, 5, 6],
    zones: ["eastern", "southern", "kigali", "western", "northern"],
    tips_en: "Intercrop with maize for better yields.",
    tips_ki: "Hinga hamwe n'ibigori kugira umusaruro mwiza.",
  },
  {
    crop_en: "Rice (Umuceri)", crop_ki: "Umuceri", category: "cereals",
    plantingMonths: [2, 3, 9, 10], harvestMonths: [6, 7, 1, 2],
    zones: ["eastern", "western", "southern"],
    tips_en: "Needs flooded paddies. Eastern lowlands best.",
    tips_ki: "Ikeneye imirima yuzuye amazi. Ibirwa by'iburasirazuba ni byiza.",
  },
  {
    crop_en: "Sorghum (Amasaka)", crop_ki: "Amasaka", category: "cereals",
    plantingMonths: [9, 10, 2, 3], harvestMonths: [1, 2, 6, 7],
    zones: ["eastern", "southern"],
    tips_en: "Drought-tolerant. Good for dry eastern areas.",
    tips_ki: "Ihanganira amapfa. Ni nziza mu turere twumye tw'iburasirazuba.",
  },
  {
    crop_en: "Cassava (Imyumbati)", crop_ki: "Imyumbati", category: "tubers",
    plantingMonths: [9, 10, 2, 3], harvestMonths: [3, 4, 5, 8, 9],
    zones: ["eastern", "southern", "western", "kigali"],
    tips_en: "Grows 8-12 months. Use disease-free cuttings.",
    tips_ki: "Imera amezi 8-12. Koresha ibiti bidafite indwara.",
  },
  {
    crop_en: "Sweet Potato (Ibijumba)", crop_ki: "Ibijumba", category: "tubers",
    plantingMonths: [9, 10, 2, 3], harvestMonths: [1, 2, 5, 6],
    zones: ["eastern", "southern", "kigali", "western", "northern"],
    tips_en: "Ready in 3-4 months. Mound soil around vines.",
    tips_ki: "Biteguye mu mezi 3-4. Teranya ubutaka ku mivure.",
  },
  {
    crop_en: "Irish Potato (Ibirayi)", crop_ki: "Ibirayi", category: "tubers",
    plantingMonths: [9, 10, 2, 3], harvestMonths: [12, 1, 5, 6],
    zones: ["northern", "southern", "western"],
    tips_en: "Best in cool highlands above 1800m.",
    tips_ki: "Bimera neza mu misozi ikonje hejuru ya 1800m.",
  },
  {
    crop_en: "Banana (Igitoki)", crop_ki: "Igitoki", category: "fruits",
    plantingMonths: [9, 10, 2, 3], harvestMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    zones: ["eastern", "southern", "western", "kigali", "northern"],
    tips_en: "Produces year-round once mature. Remove dry leaves.",
    tips_ki: "Itanga umusaruro umwaka wose igihe imaze gukura. Kuraho amababi yumye.",
  },
  {
    crop_en: "Coffee (Ikawa)", crop_ki: "Ikawa", category: "cash_crops",
    plantingMonths: [9, 10, 3, 4], harvestMonths: [3, 4, 5, 6, 7],
    zones: ["western", "southern", "northern", "kigali"],
    tips_en: "Shade trees improve quality. Mulch heavily.",
    tips_ki: "Ibiti biha igicucu byongera ubuziranenge. Shyira ibyatsi byinshi.",
  },
  {
    crop_en: "Tea (Icyayi)", crop_ki: "Icyayi", category: "cash_crops",
    plantingMonths: [9, 10, 2, 3], harvestMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    zones: ["northern", "western", "southern"],
    tips_en: "Harvested year-round. Needs altitude above 1500m.",
    tips_ki: "Isarurwa umwaka wose. Ikeneye uburebure hejuru ya 1500m.",
  },
  {
    crop_en: "Tomato (Inyanya)", crop_ki: "Inyanya", category: "vegetables",
    plantingMonths: [9, 10, 2, 3], harvestMonths: [12, 1, 5, 6],
    zones: ["eastern", "southern", "kigali", "western"],
    tips_en: "Stake plants for support. Watch for blight.",
    tips_ki: "Shyira inkoni zo gushyigikira. Reba indwara ya blight.",
  },
  {
    crop_en: "Cabbage (Amashu)", crop_ki: "Amashu", category: "vegetables",
    plantingMonths: [2, 3, 9, 10], harvestMonths: [5, 6, 12, 1],
    zones: ["northern", "southern", "kigali"],
    tips_en: "Cool season crop. 60-90 days to harvest.",
    tips_ki: "Igihingwa cy'igihe cy'ubukonje. Iminsi 60-90 kugeza ku isarura.",
  },
  {
    crop_en: "Onion (Igitunguru)", crop_ki: "Igitunguru", category: "vegetables",
    plantingMonths: [3, 4, 9, 10], harvestMonths: [6, 7, 12, 1],
    zones: ["eastern", "southern", "kigali"],
    tips_en: "Needs well-drained soil. Stop watering before harvest.",
    tips_ki: "Ikeneye ubutaka bunyunyuza amazi neza. Hagarika kuhira mbere y'isarura.",
  },
  {
    crop_en: "Carrot (Karoti)", crop_ki: "Karoti", category: "vegetables",
    plantingMonths: [2, 3, 9, 10], harvestMonths: [5, 6, 12, 1],
    zones: ["northern", "southern", "kigali"],
    tips_en: "Loose, deep soil required. Thin seedlings early.",
    tips_ki: "Ikeneye ubutaka bworoshye kandi burebure. Kura imbuto za hafi kare.",
  },
  {
    crop_en: "Groundnuts (Ubunyobwa)", crop_ki: "Ubunyobwa", category: "legumes",
    plantingMonths: [9, 10, 2, 3], harvestMonths: [1, 2, 5, 6],
    zones: ["eastern", "southern"],
    tips_en: "Sandy soil preferred. Good rotation crop.",
    tips_ki: "Ubutaka bw'umucanga bukunzwe. Ni igihingwa cyiza cyo guhinduranya.",
  },
  {
    crop_en: "Soybean (Soya)", crop_ki: "Soya", category: "legumes",
    plantingMonths: [9, 10, 2, 3], harvestMonths: [1, 2, 5, 6],
    zones: ["eastern", "southern", "kigali"],
    tips_en: "Fixes nitrogen in soil. Good protein source.",
    tips_ki: "Ishyira azote mu butaka. Ni isoko nziza ya poroteyine.",
  },
  {
    crop_en: "Peas (Amashaza)", crop_ki: "Amashaza", category: "legumes",
    plantingMonths: [2, 3, 9, 10], harvestMonths: [5, 6, 12, 1],
    zones: ["northern", "southern"],
    tips_en: "Cool climate crop. Provide climbing support.",
    tips_ki: "Igihingwa cy'ikirere gishyuha. Tanga ibyo kwurira.",
  },
  {
    crop_en: "Wheat (Ingano)", crop_ki: "Ingano", category: "cereals",
    plantingMonths: [2, 3], harvestMonths: [6, 7],
    zones: ["northern"],
    tips_en: "High altitude only. Needs cool temperatures.",
    tips_ki: "Mu misozi hejuru gusa. Ikeneye ubushyuhe buke.",
  },
  {
    crop_en: "Avocado (Avoka)", crop_ki: "Avoka", category: "fruits",
    plantingMonths: [9, 10, 3, 4], harvestMonths: [3, 4, 5, 6],
    zones: ["western", "southern", "kigali", "northern"],
    tips_en: "Trees take 3-5 years to bear fruit.",
    tips_ki: "Ibiti bifata imyaka 3-5 kugira ngo bitange imbuto.",
  },
  {
    crop_en: "Mango (Imyembe)", crop_ki: "Imyembe", category: "fruits",
    plantingMonths: [9, 10], harvestMonths: [11, 12, 1, 2],
    zones: ["eastern", "western"],
    tips_en: "Thrives in warm lowlands. Prune after harvest.",
    tips_ki: "Ikura neza mu birwa bishyuha. Konja nyuma y'isarura.",
  },
  {
    crop_en: "Passion Fruit (Marakuja)", crop_ki: "Marakuja", category: "fruits",
    plantingMonths: [9, 10, 3, 4], harvestMonths: [1, 2, 3, 6, 7, 8],
    zones: ["eastern", "southern", "kigali", "western"],
    tips_en: "Needs trellising. Produces for 3+ years.",
    tips_ki: "Ikeneye ibyo kwurira. Itanga imbuto imyaka 3+.",
  },
  {
    crop_en: "Pineapple (Inanasi)", crop_ki: "Inanasi", category: "fruits",
    plantingMonths: [9, 10, 2, 3], harvestMonths: [6, 7, 8, 12, 1],
    zones: ["eastern", "kigali"],
    tips_en: "Takes 18-24 months. Sandy, acidic soil preferred.",
    tips_ki: "Bifata amezi 18-24. Ubutaka bw'umucanga bukunzwe.",
  },
  {
    crop_en: "Sunflower (Igihuriri)", crop_ki: "Igihuriri", category: "cash_crops",
    plantingMonths: [2, 3, 9, 10], harvestMonths: [5, 6, 12, 1],
    zones: ["eastern", "southern"],
    tips_en: "Good for oil production. Bees love the flowers.",
    tips_ki: "Ni nziza ku musaruro w'amavuta. Inzuki zikunda indabo.",
  },
  {
    crop_en: "Sugarcane (Igisheke)", crop_ki: "Igisheke", category: "cash_crops",
    plantingMonths: [9, 10, 2, 3], harvestMonths: [6, 7, 8, 9],
    zones: ["eastern", "western"],
    tips_en: "Takes 12-18 months. Needs lots of water.",
    tips_ki: "Bifata amezi 12-18. Bikeneye amazi menshi.",
  },
  {
    crop_en: "Chili Pepper (Urusenda)", crop_ki: "Urusenda", category: "vegetables",
    plantingMonths: [9, 10, 2, 3], harvestMonths: [12, 1, 5, 6],
    zones: ["eastern", "southern", "kigali"],
    tips_en: "Hot varieties popular for local markets.",
    tips_ki: "Ubwoko bushyuha bukunzwe ku masoko y'imbere.",
  },
  {
    crop_en: "Eggplant (Intoryi)", crop_ki: "Intoryi", category: "vegetables",
    plantingMonths: [9, 10, 2, 3], harvestMonths: [12, 1, 5, 6],
    zones: ["eastern", "southern", "kigali"],
    tips_en: "Warm season crop. Harvest when glossy.",
    tips_ki: "Igihingwa cy'ubushyuhe. Sarura igihe kirabagirana.",
  },
  {
    crop_en: "Garlic (Tungurusumu)", crop_ki: "Tungurusumu", category: "vegetables",
    plantingMonths: [3, 4, 9, 10], harvestMonths: [7, 8, 1, 2],
    zones: ["northern", "southern"],
    tips_en: "Cool climate. Harvest when leaves turn yellow.",
    tips_ki: "Ikirere gishyuha. Sarura igihe amababi ahinduka umuhondo.",
  },
  {
    crop_en: "Taro (Amateke)", crop_ki: "Amateke", category: "tubers",
    plantingMonths: [9, 10, 2, 3], harvestMonths: [3, 4, 8, 9],
    zones: ["western", "southern"],
    tips_en: "Needs moist, shaded conditions. 6-8 months.",
    tips_ki: "Ikeneye ikirere cyuzuye umwuka n'igicucu. Amezi 6-8.",
  },
  {
    crop_en: "Mushrooms (Ibihumyo)", crop_ki: "Ibihumyo", category: "special",
    plantingMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], harvestMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    zones: ["northern", "southern", "kigali", "western", "eastern"],
    tips_en: "Grow indoors year-round. Use pasteurized substrate.",
    tips_ki: "Hinga imbere mu nzu umwaka wose. Koresha substrate yashyizwe mu mashanyarazi.",
  },
  {
    crop_en: "Macadamia", crop_ki: "Makadamiya", category: "cash_crops",
    plantingMonths: [9, 10, 3, 4], harvestMonths: [4, 5, 6],
    zones: ["western", "southern"],
    tips_en: "Long-term investment. Trees bear fruit after 5 years.",
    tips_ki: "Ishoramari ry'igihe kirekire. Ibiti bitanga imbuto nyuma y'imyaka 5.",
  },
];

export const MONTH_NAMES_EN = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
export const MONTH_NAMES_KI = ["Mut", "Gas", "Wer", "Mat", "Gic", "Kam", "Nya", "Kan", "Nze", "Ukw", "Ugu", "Uku"];

export const CATEGORIES: Record<string, { en: string; ki: string }> = {
  all: { en: "All Crops", ki: "Ibihingwa byose" },
  cereals: { en: "Cereals", ki: "Imyaka" },
  legumes: { en: "Legumes", ki: "Ibinyamisogwe" },
  tubers: { en: "Tubers", ki: "Ibinyamavuta" },
  vegetables: { en: "Vegetables", ki: "Imboga" },
  fruits: { en: "Fruits", ki: "Imbuto" },
  cash_crops: { en: "Cash Crops", ki: "Ibihingwa by'ubucuruzi" },
  special: { en: "Special", ki: "Ibidasanzwe" },
};
