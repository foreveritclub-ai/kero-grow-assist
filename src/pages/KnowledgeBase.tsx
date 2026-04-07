import { useState } from "react";
import { ArrowLeft, BookOpen, Bug, Droplets, Leaf, Sun, ChevronRight, Sprout, Flower2, TreePine, Coffee, Play, Volume2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { MobileLayout } from "@/components/MobileLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { SpeakButton } from "@/components/SpeakButton";

interface KBArticle {
  id: string;
  titleEn: string;
  titleKi: string;
  contentEn: string;
  contentKi: string;
}

interface KBTopic {
  icon: any;
  titleKey: string;
  descKey: string;
  articles: KBArticle[];
}

const knowledgeData: KBTopic[] = [
  {
    icon: Leaf,
    titleKey: "kb.planting",
    descKey: "kb.plantingDesc",
    articles: [
      {
        id: "p1",
        titleEn: "Best Planting Times in Rwanda",
        titleKi: "Igihe cyiza cyo gutera mu Rwanda",
        contentEn: "Rwanda has two main agricultural seasons:\n\n**Season A (September - February):** Main rainy season. Best for maize, beans, Irish potatoes, wheat, and sorghum.\n\n**Season B (March - June):** Second rainy season. Good for rice, sweet potatoes, cassava, and vegetables.\n\n**Season C (July - August):** Dry season. Irrigated crops like vegetables in marshlands.\n\n**Tips:**\n• Plant at the start of rains for best germination\n• Prepare soil 2-3 weeks before planting\n• Use certified seeds from RAB distributors",
        contentKi: "Rwanda ifite ibihe bibiri by'ingenzi by'ubuhinzi:\n\n**Igihembwe A (Nzeri - Gashyantare):** Igihe cy'imvura nyinshi. Cyiza ku bigori, ibishyimbo, ibirayi, ingano, n'amasaka.\n\n**Igihembwe B (Werurwe - Kamena):** Igihembwe cya kabiri cy'imvura. Cyiza ku muceri, ibijumba, imyumbati, n'imboga.\n\n**Igihembwe C (Nyakanga - Kanama):** Igihe cy'impeshyi. Ibihingwa bihirwa nk'imboga mu bice by'imigezi.\n\n**Inama:**\n• Tera mu ntangiriro y'imvura kugira ngo imbuto zimere neza\n• Tegura ubutaka ibyumweru 2-3 mbere yo gutera\n• Koresha imbuto zemejwe ziva mu mashami ya RAB",
      },
      {
        id: "p2",
        titleEn: "Soil Preparation Guide",
        titleKi: "Amabwiriza yo gutegura ubutaka",
        contentEn: "Good soil preparation is key to healthy crops:\n\n**Step 1: Clear the land** - Remove weeds and old crop remains\n\n**Step 2: Dig deeply** - Turn soil to 20-30cm depth\n\n**Step 3: Add organic matter** - Mix in compost or animal manure (2-3 weeks before planting)\n\n**Step 4: Make ridges or beds** - Create planting rows following contour lines on slopes\n\n**Step 5: Test soil pH** - Most crops prefer pH 5.5-7.0. Add lime if soil is too acidic.\n\n**Spacing guidelines:**\n• Maize: 75cm × 25cm\n• Beans: 40cm × 15cm\n• Irish Potatoes: 60cm × 30cm\n• Cassava: 1m × 1m",
        contentKi: "Gutegura ubutaka neza ni ingenzi ku bihingwa byiza:\n\n**Intambwe ya 1: Gusukura umurima** - Kuraho ibyatsi n'ibisigaye by'ibihingwa bishaje\n\n**Intambwe ya 2: Guhinga neza** - Hindura ubutaka kuri 20-30cm\n\n**Intambwe ya 3: Kongeramo ifumbire** - Vanga ifumbire y'ibidukikije cyangwa amase y'amatungo (ibyumweru 2-3 mbere yo gutera)\n\n**Intambwe ya 4: Gukora imirongo** - Kora imirongo yo guteramo ukurikije imirongo y'ubutaka ku gasozi\n\n**Intambwe ya 5: Gupima pH y'ubutaka** - Ibihingwa byinshi bikunda pH 5.5-7.0. Ongeramoite niba ubutaka bwuzuye asidi.",
      },
      {
        id: "p3",
        titleEn: "Seed Selection & Storage",
        titleKi: "Guhitamo no kubika imbuto",
        contentEn: "Choosing the right seeds makes all the difference:\n\n**Where to get good seeds:**\n• RAB (Rwanda Agriculture Board) distributors\n• Certified seed companies\n• Farmer cooperatives\n\n**How to store seeds:**\n• Keep in dry, cool place\n• Use airtight containers or bags\n• Add ash to protect from insects\n• Label with date and variety\n• Check every month for moisture\n\n**Improved varieties available in Rwanda:**\n• Maize: ZM607, KATUMANI\n• Beans: RWR 2245, MAC 44\n• Irish Potato: KINIGI, KIRUNDO\n• Rice: FOFIFA, NERICA",
        contentKi: "Guhitamo imbuto nziza ni ingenzi cyane:\n\n**Aho kubona imbuto nziza:**\n• Abagurisha b'ikigo RAB\n• Amasosiyete yemejwe y'imbuto\n• Amakooperative y'abahinzi\n\n**Uko wabika imbuto:**\n• Zibike ahantu humye, hakonje\n• Koresha ibikoresho bidafunguka cyangwa amasaho\n• Ongeramo ivu kugira ngo urinde udukoko\n• Andikaho itariki n'ubwoko\n• Suzuma buri kwezi niba hari ubuhehere",
      },
    ],
  },
  {
    icon: Bug,
    titleKey: "kb.pests",
    descKey: "kb.pestsDesc",
    articles: [
      {
        id: "pe1",
        titleEn: "Common Pests in Rwanda & How to Fight Them",
        titleKi: "Ibyonnyi bisanzwe mu Rwanda n'uko ubizura",
        contentEn: "**Fall Armyworm (Igisimba cy'Ingabo):**\n⚡ Emergency: Hand-pick worms early morning. Spray ash + soap water on leaves.\n🛠 Proper: Spray Duduthrin or Rocket insecticide. Follow dosage on label.\n\n**Aphids (Udusimba):**\n⚡ Emergency: Spray with water + liquid soap mix. Plant onions nearby.\n🛠 Proper: Apply Cypermethrin. Use yellow sticky traps.\n\n**Bean Fly (Udukoko tw'Ibishyimbo):**\n⚡ Emergency: Remove and burn affected plants. Hill up soil around stems.\n🛠 Proper: Treat seeds with Gaucho before planting.\n\n**Whitefly (Inyenzi z'umweru):**\n⚡ Emergency: Use yellow sticky traps. Spray neem extract.\n🛠 Proper: Apply Imidacloprid. Remove heavily infested plants.",
        contentKi: "**Igisimba cy'Ingabo (Fall Armyworm):**\n⚡ Byihuse: Toranya inyo mu gitondo cya kare. Uhire ivu n'amazi avanze n'isabune ku mababi.\n🛠 Byuzuye: Hira Duduthrin cyangwa Rocket. Kurikira igipimo cyanditswe.\n\n**Udusimba (Aphids):**\n⚡ Byihuse: Hira amazi avanze n'isabune. Tera ibinyabuntu hafi.\n🛠 Byuzuye: Koresha Cypermethrin. Koresha ibikingi by'umuhondo.\n\n**Udukoko tw'Ibishyimbo (Bean Fly):**\n⚡ Byihuse: Randura kandi utwike ibihingwa birwaye. Ongeraho ubutaka ku ngingo.\n🛠 Byuzuye: Vanga imbuto na Gaucho mbere yo gutera.\n\n**Inyenzi z'umweru (Whitefly):**\n⚡ Byihuse: Koresha ibikingi by'umuhondo. Hira umuti wa neem.\n🛠 Byuzuye: Koresha Imidacloprid. Kuraho ibihingwa byibasiriwe cyane.",
      },
      {
        id: "pe2",
        titleEn: "Natural Pest Control Methods",
        titleKi: "Uburyo bwo kurwanya ibyonnyi ukoresheje ibidukikije",
        contentEn: "Simple methods using what you have:\n\n**Ash (Ivu):** Sprinkle on leaves to repel soft-bodied insects. Mix with water for spray.\n\n**Soap spray:** Mix 1 tablespoon liquid soap in 1 liter water. Spray on aphids and mites.\n\n**Neem leaves:** Boil neem leaves, cool, and spray. Natural insecticide.\n\n**Companion planting:**\n• Marigolds near tomatoes repel whiteflies\n• Onions near beans repel bean fly\n• Lemongrass repels mosquitoes\n\n**Crop rotation:** Don't plant the same crop family in the same spot for 2-3 seasons.\n\n**Trap crops:** Plant a small area of crops pests prefer to lure them away from main crop.",
        contentKi: "Uburyo bworoshye ukoresheje ibyo ufite:\n\n**Ivu:** Suka ku mababi kugira ngo wirukane udukoko dutoya. Vanga n'amazi kugira ngo uhire.\n\n**Amazi y'isabune:** Vanga ikiyiko kimwe cy'isabune muri litiro 1 y'amazi. Hira ku dusimba.\n\n**Amababi ya Neem:** Tetsa amababi ya neem, uhareke akonje, uhire. Ni umuti w'ibidukikije.\n\n**Gutera hamwe:**\n• Ibirunga hafi y'inyanya birwanya inyenzi\n• Ibinyabuntu hafi y'ibishyimbo birwanya udukoko\n\n**Guhindura ibihingwa:** Ntugatere umuryango umwe w'ibihingwa aho hamwe mu bihe 2-3.",
      },
    ],
  },
  {
    icon: Droplets,
    titleKey: "kb.soil",
    descKey: "kb.soilDesc",
    articles: [
      {
        id: "s1",
        titleEn: "Understanding Your Soil",
        titleKi: "Kumenya ubutaka bwawe",
        contentEn: "Rwanda has different soil types by region:\n\n**Volcanic soil (North/West):** Rich, fertile. Great for Irish potatoes, wheat, pyrethrum.\n\n**Clay soil (East):** Holds water well but can be heavy. Good for rice, sugarcane.\n\n**Sandy soil (East/South):** Drains quickly. Add organic matter. Good for cassava, groundnuts.\n\n**How to improve any soil:**\n• Add compost regularly\n• Use cover crops (like beans) to fix nitrogen\n• Mulch to keep moisture\n• Avoid burning crop residues — incorporate them\n• Terrace on hillsides to prevent erosion\n\n**Simple pH test:** Mix soil with vinegar — if it fizzes, soil is alkaline. Mix with baking soda — if it fizzes, soil is acidic.",
        contentKi: "Rwanda ifite ubwoko butandukanye bw'ubutaka:\n\n**Ubutaka bw'ibirunga (Amajyaruguru/Iburengerazuba):** Bwuzuye, bubyara. Bwiza ku birayi, ingano, pyrethrum.\n\n**Ubutaka bw'ibumba (Iburasirazuba):** Bufata amazi neza ariko bushobora kuba buremereye. Bwiza ku muceri.\n\n**Ubutaka bw'umucanga (Iburasirazuba/Amajyepfo):** Bukata amazi vuba. Ongeramo ifumbire. Bwiza ku myumbati.\n\n**Uko wanonosora ubutaka ubwo ari bwo bwose:**\n• Ongeramo ifumbire buri gihe\n• Koresha ibihingwa bigabanya (nk'ibishyimbo) kugira ngo bikongerere nitrogen\n• Koresha ibyatsi kugira ngo ubike ubuhehere",
      },
      {
        id: "s2",
        titleEn: "Watering & Irrigation Tips",
        titleKi: "Inama zo kuhira",
        contentEn: "Water management is crucial:\n\n**When to water:**\n• Morning (before 9am) is best — less evaporation\n• Avoid watering in hot midday sun\n• Water deeply but less frequently\n\n**Signs of overwatering:**\n• Yellowing leaves\n• Soft, mushy stems\n• Mold on soil surface\n\n**Signs of underwatering:**\n• Wilting during morning\n• Dry, cracking soil\n• Brown leaf edges\n\n**Simple irrigation methods:**\n• Drip irrigation: Use plastic bottles with small holes\n• Furrow irrigation: Dig channels between rows\n• Mulching: Reduces water loss by 50%\n\n**Rainwater harvesting:** Collect rain from roofs in tanks for dry season irrigation.",
        contentKi: "Gucunga amazi ni ingenzi cyane:\n\n**Igihe cyo kuhira:**\n• Mu gitondo (mbere ya saa 3) ni byiza — amazi menshi ntahita avamo\n• Irinde kuhira mu zuba rishyushye\n• Hira neza ariko si kenshi cyane\n\n**Ibimenyetso byo kuhira birenze:**\n• Amababi ahinduka umuhondo\n• Ingingo zoroshye\n• Ibyonyi ku butaka\n\n**Uburyo bworoshye bwo kuhira:**\n• Kuhira ukoresheje amacupa y'ibiraka atobowe utudomo\n• Gucukura imiyoboro hagati y'imirongo\n• Gukoresha ibyatsi: Igabanya itakara ry'amazi ku 50%",
      },
    ],
  },
  {
    icon: Sun,
    titleKey: "kb.disease",
    descKey: "kb.diseaseDesc",
    articles: [
      {
        id: "d1",
        titleEn: "Late Blight (Milidiyu) — Potatoes & Tomatoes",
        titleKi: "Milidiyu — Ibirayi n'Inyanya",
        contentEn: "**Symptoms:** Dark brown/black spots on leaves, white mold underneath, stems turn dark, fruits rot.\n\n**⚡ Emergency:**\n• Remove and burn all affected leaves immediately\n• Increase spacing between plants for air circulation\n• Avoid watering leaves — water at base only\n\n**🛠 Proper Solution:**\n• Spray Dithane M-45 (2.5g per liter of water) every 7-10 days\n• Ridomil Gold MZ for severe cases\n• Use resistant varieties: KINIGI for potatoes\n• Practice crop rotation — don't plant tomatoes/potatoes in same spot for 3 years\n\n**Prevention:**\n• Plant certified disease-free seed\n• Good spacing (60cm × 30cm for potatoes)\n• Apply fungicide before rainy season starts",
        contentKi: "**Ibimenyetso:** Utudomo tw'ikijuju/umukara ku mababi, ibyonyi byera munsi, ingingo zihinduka umukara.\n\n**⚡ Byihuse:**\n• Kuraho kandi utwike amababi yose yarwaye ako kanya\n• Ongeraho umwanya hagati y'ibihingwa kugira ngo umwuka ugendere\n• Irinde kuhira amababi — hira ku butaka gusa\n\n**🛠 Byuzuye:**\n• Hira Dithane M-45 (2.5g kuri litiro y'amazi) buri minsi 7-10\n• Ridomil Gold MZ ku byibasiwe cyane\n• Koresha ubwoko burwanya: KINIGI ku birayi\n• Hindura ibihingwa — ntugatere inyanya/ibirayi aho hamwe mu myaka 3",
      },
      {
        id: "d2",
        titleEn: "Bacterial Wilt — Multiple Crops",
        titleKi: "Indwara y'umushwi — Ibihingwa byinshi",
        contentEn: "Affects potatoes, tomatoes, peppers, eggplant, and bananas.\n\n**Symptoms:** Sudden wilting of entire plant even when soil is wet. Brown streaks inside stems. Plants die within days.\n\n**⚡ Emergency:**\n• Remove and burn affected plants immediately — DO NOT compost\n• Disinfect tools with bleach between plants\n• Do not save seeds from affected fields\n\n**🛠 Proper Solution:**\n• There is NO chemical cure — prevention is key\n• Use certified disease-free seeds and seedlings\n• Plant resistant varieties\n• Rotate with non-host crops (cereals, onions) for 3+ years\n• Improve drainage — bacteria thrive in wet soil\n\n**Prevention:**\n• Don't move soil from infected fields\n• Clean boots and tools when moving between farms\n• Use raised beds for better drainage",
        contentKi: "Ibyibasirwa: ibirayi, inyanya, urusenda, intoryi, n'ibitoki.\n\n**Ibimenyetso:** Gushwanagurika kw'igihingwa cyose nubwo ubutaka buriho amazi. Imirongo y'ikijuju imbere mu ngingo.\n\n**⚡ Byihuse:**\n• Kuraho kandi utwike ibihingwa birwaye ako kanya — NTUBIVANGE mu ifumbire\n• Koza ibikoresho na zabiringa hagati y'ibihingwa\n\n**🛠 Byuzuye:**\n• NTAGISUBIZO cy'imiti — kwirinda ni byo by'ingenzi\n• Koresha imbuto n'ibiterwa byemejwe ko bidafite indwara\n• Hindura ibihingwa hamwe n'ibigore, ibinyabuntu mu myaka 3+",
      },
      {
        id: "d3",
        titleEn: "Cassava Mosaic Disease",
        titleKi: "Indwara ya Mozayiki y'Imyumbati",
        contentEn: "Most common cassava disease in Rwanda.\n\n**Symptoms:** Yellow-green mosaic patterns on leaves. Leaves become small and distorted. Stunted growth. Reduced root size.\n\n**⚡ Emergency:**\n• Remove infected plants to prevent spread\n• Control whiteflies (they spread the virus)\n• Use yellow sticky traps\n\n**🛠 Proper Solution:**\n• Plant resistant varieties (ask RAB for recommendations)\n• Use disease-free cuttings from certified sources\n• Control whiteflies with Imidacloprid\n• Intercrop with tall crops (maize) to reduce whitefly landing\n\n**Prevention:**\n• Never take cuttings from infected plants\n• Regular field inspection — remove sick plants early\n• Maintain good field hygiene",
        contentKi: "Ni indwara isanzwe cyane y'imyumbati mu Rwanda.\n\n**Ibimenyetso:** Ishusho y'icyatsi n'umuhondo ku mababi. Amababi aba mato kandi ahindutse. Imikurire igabanyuka.\n\n**⚡ Byihuse:**\n• Kuraho ibihingwa byibasiriwe kugira ngo birinda gukwira\n• Kurwanya inyenzi z'umweru (ni zo zikwirakwiza virusi)\n\n**🛠 Byuzuye:**\n• Tera ubwoko burwanya (baza RAB inama)\n• Koresha ibice by'imyumbati bidafite indwara biva mu mashami yemejwe\n• Kurwanya inyenzi z'umweru na Imidacloprid",
      },
    ],
  },
  {
    icon: Coffee,
    titleKey: "kb.cashCrops",
    descKey: "kb.cashCropsDesc",
    articles: [
      {
        id: "c1",
        titleEn: "Coffee Growing Guide",
        titleKi: "Amabwiriza yo guhinga Ikawa",
        contentEn: "Coffee is Rwanda's top export crop.\n\n**Ideal conditions:**\n• Altitude: 1,400-2,000m\n• Temperature: 15-25°C\n• Well-drained volcanic soil\n• Annual rainfall: 1,200-1,800mm\n\n**Planting:**\n• Spacing: 2m × 2m\n• Dig holes 60cm × 60cm × 60cm\n• Mix topsoil with 5kg compost per hole\n• Plant during rainy season\n\n**Maintenance:**\n• Mulch heavily\n• Prune annually after harvest\n• Fertilize with NPK 17-17-17 (100g per tree, 2x per year)\n• Control Coffee Berry Disease with copper fungicides\n\n**Harvest:**\n• Pick only red, ripe cherries\n• Process within 12 hours of picking\n• Sell to washing stations for best price",
        contentKi: "Ikawa ni igihingwa cy'ingenzi cyane cy'ubusonereza mu Rwanda.\n\n**Ibikenewe:**\n• Ubuhagarike: 1,400-2,000m\n• Ubushyuhe: 15-25°C\n• Ubutaka bw'ibirunga bukata amazi neza\n\n**Gutera:**\n• Umwanya: 2m × 2m\n• Cukura imyobo 60cm × 60cm × 60cm\n• Vanga ubutaka n'ifumbire 5kg kuri buri mwobo\n• Tera mu gihe cy'imvura\n\n**Kwita ku kawa:**\n• Koresha ibyatsi byinshi\n• Korera buri mwaka nyuma y'isarura\n• Koresha NPK 17-17-17 (100g kuri buri giti, inshuro 2 mu mwaka)",
      },
      {
        id: "c2",
        titleEn: "Tea Cultivation in Rwanda",
        titleKi: "Guhinga Icyayi mu Rwanda",
        contentEn: "Tea thrives in Rwanda's highlands.\n\n**Ideal conditions:**\n• Altitude: 1,500-2,500m\n• Acidic soil (pH 4.5-5.5)\n• Well-distributed rainfall\n• Cool temperatures (15-22°C)\n\n**Planting:**\n• Use vegetatively propagated clones\n• Spacing: 1.2m × 0.6m\n• Plant at start of rainy season\n\n**Maintenance:**\n• Infill gaps in first 2 years\n• Mulch with grass clippings\n• Fertilize with NPK + sulfur-based fertilizers\n• Prune to table height every 3-4 years\n\n**Harvesting:**\n• Pick two leaves and a bud\n• Harvest every 7-14 days\n• Deliver to factory within 12 hours\n• Green leaf quality determines price",
        contentKi: "Icyayi gikura neza mu misozi y'u Rwanda.\n\n**Ibikenewe:**\n• Ubuhagarike: 1,500-2,500m\n• Ubutaka bw'asidi (pH 4.5-5.5)\n• Imvura igabanyijemo neza\n\n**Gutera:**\n• Koresha ibikoni byatewe\n• Umwanya: 1.2m × 0.6m\n• Tera mu ntangiriro y'imvura\n\n**Kwita ku cyayi:**\n• Uzuza imyanya mu myaka 2 ya mbere\n• Koresha ibyatsi\n• Koresha NPK n'ifumbire ya sulfur",
      },
    ],
  },
  {
    icon: Flower2,
    titleKey: "kb.flowers",
    descKey: "kb.flowersDesc",
    articles: [
      {
        id: "f1",
        titleEn: "Growing Flowers in Rwanda",
        titleKi: "Guhinga Indabo mu Rwanda",
        contentEn: "Rwanda's flower industry is growing rapidly.\n\n**Popular flowers:**\n• Roses — Most exported flower. Grown in Kigali, Rwamagana\n• Chrysanthemums — Good for local market\n• Lilies — High value export\n• Gladiolus — Easy to grow, good for beginners\n\n**Getting started:**\n• Start small (0.1-0.5 hectares)\n• Use greenhouse or shade net\n• Good irrigation system is essential\n• Test soil before planting\n\n**Market opportunities:**\n• Local hotels and events\n• Export to Europe (via flower auctions)\n• Wedding and ceremony decorations\n\n**Investment needed:**\n• Greenhouse: ~$5,000-15,000 per 1000m²\n• Seedlings, fertilizer, labor\n• Cold chain for export flowers",
        contentKi: "Inganda z'indabo mu Rwanda zirakura byihuse.\n\n**Indabo zizwi:**\n• Imbuto z'amawar — Indabo yoherezwa hanze cyane. Zihinzwe i Kigali, Rwamagana\n• Chrysanthemums — Nziza ku isoko ry'imbere\n• Lilies — Agaciro kenshi mu busonereza\n• Gladiolus — Zoroshye gutera, nziza ku batangiye\n\n**Gutangira:**\n• Tangira utoya (0.1-0.5 hekitari)\n• Koresha serre cyangwa igikingirizo\n• Sisitemu yo kuhira ni ngombwa",
      },
    ],
  },
  {
    icon: TreePine,
    titleKey: "kb.trees",
    descKey: "kb.treesDesc",
    articles: [
      {
        id: "t1",
        titleEn: "Agroforestry in Rwanda",
        titleKi: "Guhinga ibiti n'ibihingwa hamwe mu Rwanda",
        contentEn: "Mixing trees with crops benefits both:\n\n**Best trees for agroforestry:**\n• Grevillea — Provides shade, timber, doesn't compete much with crops\n• Calliandra — Fixes nitrogen, animal feed, firewood\n• Moringa — Nutritious leaves for food and sale\n• Albizia — Nitrogen fixer, good shade tree\n\n**Benefits:**\n• Prevents soil erosion on slopes\n• Provides firewood and timber\n• Improves soil fertility (nitrogen fixers)\n• Wind protection for crops\n• Additional income from fruit/timber\n\n**Planting tips:**\n• Plant on field borders and terrace risers\n• Don't shade small crops — prune regularly\n• Spacing depends on tree species",
        contentKi: "Guvanga ibiti n'ibihingwa bigirira byombi akamaro:\n\n**Ibiti byiza mu buhinzi bw'ibiti:**\n• Grevillea — Itanga igicucu, ibiti, ntiruhanya cyane ibihingwa\n• Calliandra — Yongerera nitrogen, ibiryo by'amatungo, inkwi\n• Moringa — Amababi arimo intungamubiri ku biryo no kugurisha\n\n**Inyungu:**\n• Birinda isuri y'ubutaka ku gasozi\n• Bitanga inkwi n'ibiti\n• Binonosora ubutaka",
      },
    ],
  },
  {
    icon: Sprout,
    titleKey: "kb.vegetables",
    descKey: "kb.vegetablesDesc",
    articles: [
      {
        id: "vg1",
        titleEn: "Growing Tomatoes in Rwanda",
        titleKi: "Guhinga Inyanya mu Rwanda",
        contentEn: "Tomatoes are one of the most profitable vegetables:\n\n**Varieties:** Roma, Moneymaker, Rio Grande, Cal J\n\n**Planting:**\n• Start seeds in nursery beds\n• Transplant after 4-5 weeks\n• Spacing: 60cm × 45cm\n• Stake plants for support\n\n**Care:**\n• Water regularly but avoid wetting leaves\n• Mulch heavily to retain moisture\n• Fertilize with NPK 17-17-17 at planting, DAP at flowering\n• Prune suckers for bigger fruits\n\n**Common problems:**\n• Late blight — use Ridomil Gold or Dithane M-45\n• Tomato leaf miner — use Duduthrin\n• Blossom end rot — add calcium (lime)\n\n**Prevention:**\n• Rotate crops every 2-3 seasons\n• Remove infected plants immediately\n• Use drip irrigation to avoid leaf wetness\n• Plant resistant varieties\n• Space properly for air circulation",
        contentKi: "Inyanya ni kimwe mu mboga zikungahaza cyane:\n\n**Ubwoko:** Roma, Moneymaker, Rio Grande, Cal J\n\n**Gutera:**\n• Tangirira imbuto mu mashyamba y'ibiterwa\n• Imura nyuma y'ibyumweru 4-5\n• Umwanya: 60cm × 45cm\n• Shyira ibiti byo gushyigikira\n\n**Kwita:**\n• Hira buri gihe ariko wirinde gutoseza amababi\n• Koresha ibyatsi byinshi kugira ngo ubike ubuhehere\n• Koresha NPK 17-17-17 mu gutera, DAP mu gihe cy'indabo\n\n**Kwirinda:**\n• Hindura ibihingwa buri bihe 2-3\n• Kuraho ibihingwa birwaye ako kanya\n• Koresha kuhira kwa drip kugira ngo wirinde gutoseza amababi",
      },
      {
        id: "vg2",
        titleEn: "Cabbage, Carrots & Onions Guide",
        titleKi: "Amabwiriza y'Amashu, Karoti n'Ibinyabuntu",
        contentEn: "Popular market vegetables in Rwanda:\n\n**Cabbage (Amashu):**\n• Spacing: 60cm × 45cm\n• Fertilize with NPK at planting, urea after 3 weeks\n• Watch for: Diamond-back moth — use Duduthrin\n• Harvest at 70-90 days\n\n**Carrots (Karoti):**\n• Plant directly in fine, deep soil\n• Thin seedlings to 5cm apart\n• Keep soil moist but not waterlogged\n• Harvest at 90-120 days\n\n**Onions (Ibinyabuntu):**\n• Start in nursery, transplant at 6 weeks\n• Spacing: 20cm × 10cm\n• Stop watering 2 weeks before harvest\n• Cure in shade for 2 weeks after harvest\n\n**Prevention tips for all vegetables:**\n• Practice crop rotation every season\n• Use certified seeds from RAB\n• Maintain proper spacing for air flow\n• Apply organic mulch to suppress weeds\n• Scout fields weekly for early pest detection\n• Remove crop debris after harvest",
        contentKi: "Imboga zizwi ku isoko mu Rwanda:\n\n**Amashu:**\n• Umwanya: 60cm × 45cm\n• Koresha NPK mu gutera, urea nyuma y'ibyumweru 3\n• Witondere: Inyo ya Diamond-back — koresha Duduthrin\n\n**Karoti:**\n• Tera mu butaka bwiza, burebure\n• Gera ibiterwa kuri 5cm\n• Bika ubutaka buriho amazi ariko ntibwuzure\n\n**Ibinyabuntu:**\n• Tangirira mu mashyamba, imura ku byumweru 6\n• Umwanya: 20cm × 10cm\n• Hagarika kuhira ibyumweru 2 mbere yo gusarura\n\n**Inama zo kwirinda ku mboga zose:**\n• Hindura ibihingwa buri gihembwe\n• Koresha imbuto zemejwe za RAB\n• Komeza umwanya ukwiye kugira ngo umwuka ugendere",
      },
      {
        id: "vg3",
        titleEn: "Growing Peppers & Eggplant",
        titleKi: "Guhinga Urusenda n'Intoryi",
        contentEn: "High-value crops for local and export markets:\n\n**Peppers (Urusenda):**\n• Varieties: Bell pepper, Chili, Scotch Bonnet\n• Start in nursery, transplant at 5-6 weeks\n• Spacing: 50cm × 40cm\n• Need full sun and well-drained soil\n• Fertilize with NPK + calcium\n\n**Eggplant (Intoryi):**\n• Very popular in Rwandan cuisine\n• Spacing: 60cm × 50cm\n• Stake plants when fruiting\n• Harvest when skin is shiny\n\n**Prevention for both:**\n• Rotate with non-solanaceae crops (beans, maize)\n• Use neem spray for aphids and whiteflies\n• Mulch to prevent soil splash diseases\n• Avoid overhead irrigation\n• Plant trap crops like marigold nearby\n• Inspect weekly and remove diseased leaves early",
        contentKi: "Ibihingwa by'agaciro ku masoko yo mu gihugu no hanze:\n\n**Urusenda:**\n• Ubwoko: Bell pepper, Urusenda ruto, Scotch Bonnet\n• Tangirira mu mashyamba, imura ku byumweru 5-6\n• Umwanya: 50cm × 40cm\n\n**Intoryi:**\n• Ikunzwe cyane mu biribwa by'u Rwanda\n• Umwanya: 60cm × 50cm\n• Shyira ibiti byo gushyigikira iyo imbuto zitangiye\n\n**Kwirinda ku byombi:**\n• Hindura ibihingwa hamwe n'ibishyimbo, ibigori\n• Koresha umuti wa neem ku dusimba\n• Koresha ibyatsi kugira ngo wirinde indwara zo mu butaka",
      },
    ],
  },
  {
    icon: Sprout,
    titleKey: "kb.mushrooms",
    descKey: "kb.mushroomsDesc",
    articles: [
      {
        id: "m1",
        titleEn: "Growing Mushrooms in Rwanda",
        titleKi: "Guhinga Ibihumyo mu Rwanda",
        contentEn: "Mushrooms are a profitable crop requiring small space:\n\n**Popular types:**\n• Oyster mushrooms (Ibihumyo) — Easiest to grow\n• Button mushrooms — Higher market price\n• Shiitake — Premium value\n\n**What you need:**\n• Dark, ventilated room (no direct sunlight)\n• Substrate: banana leaves, bean straw, or sawdust\n• Mushroom spawn (from research centers or cooperatives)\n• Clean water for misting\n\n**Steps:**\n1. Pasteurize substrate (soak in hot water 60°C for 1 hour)\n2. Mix spawn into cooled substrate\n3. Pack in plastic bags with small holes\n4. Keep in dark room, mist 2-3 times daily\n5. Harvest when caps are fully opened (3-4 weeks)\n\n**Prevention of contamination:**\n• Always wash hands before handling\n• Sterilize all tools and containers\n• Keep growing room clean and ventilated\n• Remove contaminated bags immediately\n• Use clean water only\n• Monitor temperature (20-28°C ideal)\n• Avoid excess moisture that causes mold",
        contentKi: "Ibihumyo ni igihingwa cy'inyungu kenshi gikeneye umwanya muto:\n\n**Ubwoko buzwi:**\n• Ibihumyo (Oyster mushrooms) — Byoroshye guhinga\n• Button mushrooms — Igiciro kinini ku isoko\n\n**Ibyo ukeneye:**\n• Icyumba cy'umwijima, gifite umwuka (nta zuba ryinjiramo)\n• Substrate: amababi y'ibitoki, ibyatsi by'ibishyimbo, cyangwa ibyo gupanika\n• Imbuto z'ibihumyo (ziva mu bigo by'ubushakashatsi)\n\n**Kwirinda kwanduza:**\n• Buri gihe oga amaboko mbere yo gufata\n• Koza ibikoresho byose\n• Komeza icyumba cy'aho bihinzwe gisukuye\n• Kuraho amasaho yanduye ako kanya",
      },
    ],
  },
  {
    icon: Leaf,
    titleKey: "kb.spices",
    descKey: "kb.spicesDesc",
    articles: [
      {
        id: "sp1",
        titleEn: "Growing Spices & Herbs in Rwanda",
        titleKi: "Guhinga Ibirungo n'Ibinyabijumba mu Rwanda",
        contentEn: "Spices and herbs add value and income to small farms:\n\n**Easy to start:**\n• Basil — Grows fast, harvest leaves regularly\n• Mint — Spreads easily, grow in containers\n• Rosemary — Drought tolerant, perennial\n• Lemongrass — Repels mosquitoes, easy to grow\n• Coriander — Quick harvest (30-40 days)\n\n**Higher value crops:**\n• Ginger (Tangawizi) — Plant rhizomes in rich soil, harvest at 8-10 months\n• Turmeric — Similar to ginger, needs partial shade\n• Vanilla — Needs support poles, 3 years to first harvest\n• Black pepper — Climbing vine, needs warm humid areas\n\n**Growing tips:**\n• Most herbs prefer well-drained soil\n• Harvest in morning for best flavor\n• Dry in shade for preservation\n• Plant near kitchen for easy access\n\n**Prevention of herb diseases:**\n• Avoid overwatering — most herbs prefer dry conditions\n• Ensure good drainage in planting beds\n• Space plants properly for airflow\n• Remove yellowing or spotted leaves immediately\n• Use companion planting to deter pests\n• Rotate herbs in garden beds annually",
        contentKi: "Ibirungo n'ibinyabijumba byongerera agaciro n'inyungu ku mirima mito:\n\n**Byoroshye gutangira:**\n• Basil — Bikura vuba, sarura amababi kenshi\n• Mint — Bikwira byoroshye, bihinge mu mbehe\n• Rosemary — Bihanganira amapfa, ni ibimera by'igihe kirekire\n• Lemongrass — Birukana imibu, byoroshye guhinga\n\n**Ibihingwa by'agaciro kenshi:**\n• Tangawizi — Tera impande mu butaka bwuzuye, sarura mu mezi 8-10\n• Turmeric — Bimeze nka tangawizi, bikeneye igicucu\n• Vanille — Ikeneye inkingi, imyaka 3 kugeza ku isarura rya mbere\n\n**Kwirinda indwara z'ibinyobwa:**\n• Irinde kuhira birenze — ibinyobwa byinshi bikunda umutse\n• Reba neza ko amazi atemba neza mu murima\n• Gera ibimera neza kugira ngo umwuka ugendere",
      },
    ],
  },
  {
    icon: Leaf,
    titleKey: "kb.prevention",
    descKey: "kb.preventionDesc",
    articles: [
      {
        id: "pr1",
        titleEn: "10 Golden Rules of Crop Disease Prevention",
        titleKi: "Amategeko 10 y'Agaciro yo Kwirinda Indwara z'Ibihingwa",
        contentEn: "Follow these rules to keep your farm healthy:\n\n**1. Crop Rotation:** Never plant the same crop family in the same spot for 2+ seasons. Rotate cereals → legumes → root crops.\n\n**2. Clean Seeds:** Always use certified, disease-free seeds from RAB or trusted suppliers.\n\n**3. Proper Spacing:** Crowded plants trap moisture and spread disease. Follow recommended spacing.\n\n**4. Field Hygiene:** Remove and burn diseased plants. Never compost infected material.\n\n**5. Tool Disinfection:** Clean tools with bleach solution when moving between fields.\n\n**6. Drainage:** Ensure water doesn't pool around crops. Use raised beds on flat land.\n\n**7. Mulching:** Cover soil with organic mulch to prevent soil-splash diseases and retain moisture.\n\n**8. Timely Planting:** Plant at the right time to avoid peak pest and disease pressure.\n\n**9. Resistant Varieties:** Choose varieties bred for disease resistance (ask RAB for latest recommendations).\n\n**10. Regular Scouting:** Walk your field weekly. Catching problems early saves your entire crop.\n\n**Bonus:** Keep records of what you planted where and what problems occurred. This helps plan better rotations.",
        contentKi: "Kurikiza aya mategeko kugira ngo umurima wawe ugume muzima:\n\n**1. Guhindura ibihingwa:** Ntukagere gutera umuryango umwe w'ibihingwa aho hamwe mu bihe 2+.\n\n**2. Imbuto zisukuye:** Buri gihe koresha imbuto zemejwe zidafite indwara.\n\n**3. Umwanya ukwiye:** Ibihingwa byegeranye bifata ubuhehere kandi bikwirakwiza indwara.\n\n**4. Isuku y'umurima:** Kuraho kandi utwike ibihingwa birwaye.\n\n**5. Gusukura ibikoresho:** Koza ibikoresho na zabiringa iyo uhindura imirima.\n\n**6. Gutemba kw'amazi:** Reba neza ko amazi adahagarara hafi y'ibihingwa.\n\n**7. Gukoresha ibyatsi:** Funika ubutaka n'ibyatsi kugira ngo wirinde indwara zo mu butaka.\n\n**8. Gutera ku gihe:** Tera ku gihe kiza kugira ngo wirinde ibyonnyi n'indwara.\n\n**9. Ubwoko burwanya:** Hitamo ubwoko bwubatswe kurwanya indwara.\n\n**10. Gusuzuma kenshi:** Genda mu murima wawe buri cyumweru.",
      },
      {
        id: "pr2",
        titleEn: "Organic Prevention Methods",
        titleKi: "Uburyo bwo Kwirinda Ukoresheje Ibidukikije",
        contentEn: "Natural ways to protect your crops without chemicals:\n\n**Companion Planting:**\n• Marigolds repel nematodes and whiteflies\n• Basil near tomatoes deters aphids\n• Onions near carrots repel carrot fly\n• Lemongrass around field edges repels many pests\n\n**Biological Controls:**\n• Encourage birds — they eat caterpillars and insects\n• Ladybugs eat aphids naturally\n• Praying mantis eat many harmful insects\n\n**Homemade Sprays:**\n• Ash + water: repels soft-bodied insects\n• Garlic + chili + soap spray: broad-spectrum pest repellent\n• Neem leaf tea: natural fungicide and insecticide\n• Papaya leaf extract: controls some fungal diseases\n\n**Soil Health:**\n• Add compost regularly for beneficial microbes\n• Use cover crops (beans, clover) between seasons\n• Avoid burning crop residues — incorporate them\n• Maintain soil pH 5.5-7.0 with lime if needed\n\n**Physical Barriers:**\n• Use nets to protect seedlings from birds\n• Yellow sticky traps for whiteflies\n• Hand-pick large caterpillars early morning\n• Use trenches around fields for slug control",
        contentKi: "Uburyo bw'ibidukikije bwo kurinda ibihingwa byawe nta miti:\n\n**Gutera hamwe:**\n• Ibirunga birukana udukoko tw'imitsi n'inyenzi\n• Basil hafi y'inyanya irukana udusimba\n• Ibinyabuntu hafi ya karoti birukana isazi ya karoti\n\n**Gukoresha ibinyabuzima:**\n• Shishikariza inyoni — zirya inyo n'udukoko\n• Ladybugs zirya udusimba ku buryo bw'ibidukikije\n\n**Imiti yo mu rugo:**\n• Ivu + amazi: irukana udukoko dutoya\n• Tungurusumu + urusenda + isabune: irukana ibyonnyi byinshi\n• Icyayi cy'amababi ya neem: umuti w'ibidukikije\n\n**Ubuzima bw'ubutaka:**\n• Ongeramo ifumbire kenshi\n• Koresha ibihingwa bigabanya hagati y'ibihe\n• Irinde gutwika ibisigaye by'ibihingwa",
      },
      {
        id: "pr3",
        titleEn: "Post-Harvest Prevention & Storage",
        titleKi: "Kwirinda Nyuma yo Gusarura no Kubika",
        contentEn: "Preventing losses after harvest is just as important:\n\n**Grain Storage:**\n• Dry grains to 13% moisture before storage\n• Use hermetic bags (PICS bags) for maize and beans\n• Add dried neem leaves or ash to repel storage pests\n• Store in raised, ventilated structures\n• Check monthly for insects or moisture\n\n**Root Crops:**\n• Harvest carefully — don't bruise\n• Cure sweet potatoes in shade for 5-7 days\n• Store cassava chips after drying\n• Irish potatoes: store in cool, dark place with ventilation\n\n**Vegetables & Fruits:**\n• Harvest in cool morning hours\n• Handle gently — bruises lead to rot\n• Sort out damaged produce immediately\n• Sell or process within 2-3 days\n• Consider sun-drying, pickling, or jam-making for preservation\n\n**Prevention of storage pests:**\n• Clean storage area before new harvest\n• Repair cracks and holes in storage buildings\n• Use Actellic Super dust for severe infestations\n• Never mix old and new grain\n• Keep cats or set traps for rodents",
        contentKi: "Kwirinda igihombo nyuma yo gusarura ni ingenzi cyane:\n\n**Kubika ibinyampeke:**\n• Umisha ibinyampeke kuri 13% y'ubuhehere mbere yo kubika\n• Koresha amasaho ya PICS ku bigori n'ibishyimbo\n• Ongeramo amababi y'umuyumbu cyangwa ivu kugira ngo wirinde udukoko\n• Bika mu bihingwa bishyizwe hejuru, bifite umwuka\n\n**Ibihingwa by'imizi:**\n• Sarura witonze — ntubimene\n• Umisha ibijumba mu gicucu iminsi 5-7\n\n**Imboga n'imbuto:**\n• Sarura mu gitondo gukonje\n• Fata uwitonze — ibimena bitera kubora\n• Gutandukanya ibyangirika ako kanya",
      },
    ],
  },
];

// Tutorial videos data
const tutorials = [
  {
    id: "v1",
    titleEn: "How to Identify Crop Diseases",
    titleKi: "Uko wamenya indwara z'ibihingwa",
    descEn: "Learn to spot common signs of disease on your crops",
    descKi: "Iga kumenya ibimenyetso bisanzwe by'indwara ku bihingwa byawe",
    durationMin: 8,
  },
  {
    id: "v2",
    titleEn: "Making Organic Fertilizer at Home",
    titleKi: "Gukora ifumbire y'ibidukikije mu rugo",
    descEn: "Step-by-step guide to composting with local materials",
    descKi: "Amabwiriza y'intambwe ku ntambwe yo gukora ifumbire ukoresheje ibikoresho byo mu rugo",
    durationMin: 12,
  },
  {
    id: "v3",
    titleEn: "Proper Use of Pesticides",
    titleKi: "Gukoresha neza imiti y'ibyonnyi",
    descEn: "Safety and dosage guidelines for common pesticides",
    descKi: "Amabwiriza y'umutekano n'igipimo cy'imiti isanzwe y'ibyonnyi",
    durationMin: 10,
  },
  {
    id: "v4",
    titleEn: "Water Harvesting Techniques",
    titleKi: "Uburyo bwo gukusanya amazi y'imvura",
    descEn: "Simple methods to collect and store rainwater for irrigation",
    descKi: "Uburyo bworoshye bwo gukusanya no kubika amazi y'imvura yo kuhira",
    durationMin: 7,
  },
];

export default function KnowledgeBase() {
  const navigate = useNavigate();
  const { t, lang } = useLanguage();
  const [selectedTopic, setSelectedTopic] = useState<KBTopic | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<KBArticle | null>(null);
  const [activeTab, setActiveTab] = useState<"books" | "tutorials">("books");

  // Article detail view
  if (selectedArticle) {
    return (
      <MobileLayout>
        <div className="bg-primary px-5 pt-4 pb-6 rounded-b-3xl">
          <div className="flex items-center gap-3">
            <button onClick={() => setSelectedArticle(null)} className="text-primary-foreground">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-display font-bold text-primary-foreground truncate">
              {lang === "ki" ? selectedArticle.titleKi : selectedArticle.titleEn}
            </h1>
          </div>
        </div>
        <div className="px-5 mt-5 mb-4">
          {/* Listen to article */}
          <SpeakButton
            text={lang === "ki" ? selectedArticle.contentKi : selectedArticle.contentEn}
            lang={lang}
            size="md"
            label={lang === "ki" ? "🔊 Tegera iki gisomo" : "🔊 Listen to this lesson"}
            className="w-full justify-center mb-4"
          />
          <div className="bg-card rounded-xl border border-border p-5">
            <div className="prose prose-sm max-w-none">
              {(lang === "ki" ? selectedArticle.contentKi : selectedArticle.contentEn).split("\n").map((line, i) => {
                if (line.startsWith("**") && line.endsWith("**")) {
                  return <h3 key={i} className="font-display font-bold text-base mt-4 mb-2 text-foreground">{line.replace(/\*\*/g, "")}</h3>;
                }
                if (line.startsWith("**")) {
                  const parts = line.split("**");
                  return (
                    <p key={i} className="text-sm font-body text-foreground mb-1">
                      <strong className="font-display">{parts[1]}</strong>{parts[2]}
                    </p>
                  );
                }
                if (line.startsWith("•")) {
                  return <p key={i} className="text-sm font-body text-muted-foreground ml-3 mb-0.5">{line}</p>;
                }
                if (line.trim() === "") return <div key={i} className="h-2" />;
                return <p key={i} className="text-sm font-body text-foreground mb-1">{line}</p>;
              })}
            </div>
          </div>
        </div>
      </MobileLayout>
    );
  }

  // Topic articles list view
  if (selectedTopic) {
    return (
      <MobileLayout>
        <div className="bg-primary px-5 pt-4 pb-6 rounded-b-3xl">
          <div className="flex items-center gap-3">
            <button onClick={() => setSelectedTopic(null)} className="text-primary-foreground">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-display font-bold text-primary-foreground">{t(selectedTopic.titleKey)}</h1>
          </div>
          <p className="text-primary-foreground/70 text-sm font-body mt-1">{t(selectedTopic.descKey)}</p>
        </div>
        <div className="px-5 mt-5 space-y-3 mb-4">
          {selectedTopic.articles.map((article) => (
            <button
              key={article.id}
              onClick={() => setSelectedArticle(article)}
              className="w-full bg-card rounded-xl border border-border p-4 flex items-center gap-3 text-left active:scale-[0.98] transition-transform"
            >
              <BookOpen className="w-5 h-5 text-primary shrink-0" />
              <p className="font-display font-semibold text-sm flex-1">
                {lang === "ki" ? article.titleKi : article.titleEn}
              </p>
              <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
            </button>
          ))}
        </div>
      </MobileLayout>
    );
  }

  // Main knowledge base view
  return (
    <MobileLayout>
      <div className="bg-primary px-5 pt-4 pb-6 rounded-b-3xl">
        <div className="flex items-center gap-3 mb-2">
          <button onClick={() => navigate("/")} className="text-primary-foreground">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-display font-bold text-primary-foreground">{t("kb.title")}</h1>
        </div>
        <p className="text-primary-foreground/70 text-sm font-body">{t("kb.subtitle")}</p>

        {/* Tabs */}
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => setActiveTab("books")}
            className={`flex-1 py-2 rounded-lg font-display text-sm font-semibold transition-colors ${
              activeTab === "books" ? "bg-primary-foreground text-primary" : "bg-primary-foreground/10 text-primary-foreground/70"
            }`}
          >
            📚 {lang === "ki" ? "Amasomo" : "Lessons"}
          </button>
          <button
            onClick={() => setActiveTab("tutorials")}
            className={`flex-1 py-2 rounded-lg font-display text-sm font-semibold transition-colors ${
              activeTab === "tutorials" ? "bg-primary-foreground text-primary" : "bg-primary-foreground/10 text-primary-foreground/70"
            }`}
          >
            🎬 {lang === "ki" ? "Amasomo ya Video" : "Tutorials"}
          </button>
        </div>
      </div>

      <div className="px-5 mt-5 space-y-3 mb-4">
        {activeTab === "books" ? (
          <>
            {knowledgeData.map((topic) => {
              const Icon = topic.icon;
              return (
                <button
                  key={topic.titleKey}
                  onClick={() => setSelectedTopic(topic)}
                  className="w-full bg-card rounded-xl border border-border p-4 flex items-start gap-4 text-left active:scale-[0.98] transition-transform"
                >
                  <div className="w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display font-bold text-sm">{t(topic.titleKey)}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">{t(topic.descKey)}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <span className="text-xs text-muted-foreground font-display bg-muted rounded-full px-2.5 py-1">
                      {topic.articles.length}
                    </span>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </div>
                </button>
              );
            })}
          </>
        ) : (
          <>
            {tutorials.map((tut) => (
              <div
                key={tut.id}
                className="bg-card rounded-xl border border-border p-4 flex items-start gap-3"
              >
                <div className="w-11 h-11 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                  <Play className="w-5 h-5 text-accent" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-display font-bold text-sm">
                    {lang === "ki" ? tut.titleKi : tut.titleEn}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {lang === "ki" ? tut.descKi : tut.descEn}
                  </p>
                  <p className="text-xs text-primary mt-1 font-display font-semibold">
                    ⏱ {tut.durationMin} min
                  </p>
                </div>
              </div>
            ))}
            <div className="bg-secondary/20 rounded-xl p-4 mt-2">
              <div className="flex items-center gap-2 mb-1">
                <Play className="w-4 h-4 text-primary" />
                <p className="font-display font-semibold text-sm">
                  {lang === "ki" ? "Amasomo ya Video arategereje" : "Video tutorials coming soon"}
                </p>
              </div>
              <p className="text-xs text-muted-foreground">
                {lang === "ki"
                  ? "Amasomo ya video mu Kinyarwanda n'Icyongereza ari gutegurwa. Tegereza!"
                  : "Video lessons in Kinyarwanda and English are being prepared. Stay tuned!"}
              </p>
            </div>
          </>
        )}
      </div>
    </MobileLayout>
  );
}
