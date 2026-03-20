import { createContext, useContext, useState, ReactNode } from "react";

type Lang = "en" | "ki";

interface LanguageContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: string) => string;
}

const translations: Record<string, Record<Lang, string>> = {
  // Common
  "app.greeting": { en: "Hello 👋", ki: "Muraho 👋" },
  "app.name": { en: "Kero Iwawe Assist", ki: "Kero Iwawe Assist" },
  "app.version": { en: "Kero Iwawe Assist v1.0", ki: "Kero Iwawe Assist v1.0" },

  // Bottom Nav
  "nav.home": { en: "Home", ki: "Ahabanza" },
  "nav.farm": { en: "My Farm", ki: "Umurima" },
  "nav.scan": { en: "Scan", ki: "Suzuma" },
  "nav.learn": { en: "Learn", ki: "Iga" },
  "nav.profile": { en: "Profile", ki: "Umwirondoro" },

  // Dashboard
  "dash.yourFarms": { en: "Your farms", ki: "Amashamba yawe" },
  "dash.cropsTracked": { en: "crops tracked", ki: "ibihingwa bikurikiranwa" },
  "dash.scanCrop": { en: "Scan Crop", ki: "Suzuma igihingwa" },
  "dash.scanDesc": { en: "Take a photo to diagnose diseases", ki: "Fata ifoto kugira ngo usuzume indwara" },
  "dash.describeSymptoms": { en: "Describe Symptoms", ki: "Sobanura ibimenyetso" },
  "dash.describeDesc": { en: "Type what you see on your crop", ki: "Andika ibyo ubona ku gihingwa cyawe" },
  "dash.farmTracker": { en: "Farm Tracker", ki: "Gukurikirana umurima" },
  "dash.farmTrackerDesc": { en: "Track crops, treatments & growth", ki: "Kurikirana ibihingwa, imiti n'imikurire" },
  "dash.harvestPrediction": { en: "Harvest Prediction", ki: "Guteganya isarura" },
  "dash.harvestDesc": { en: "AI growth & yield estimates", ki: "Igereranya ry'imikurire n'umusaruro" },
  "dash.recentActivity": { en: "Recent Activity", ki: "Ibikorwa byanyuma" },
  "dash.viewAll": { en: "View all", ki: "Reba byose" },
  "dash.noActivity": { en: "No activity yet", ki: "Nta bikorwa bihari" },
  "dash.noActivityDesc": { en: "Scan a crop or add a farm to get started", ki: "Suzuma igihingwa cyangwa wongere umurima kugira ngo utangire" },

  // Scan Page
  "scan.title": { en: "AI Crop Diagnosis", ki: "Isuzuma ry'igihingwa na AI" },
  "scan.photo": { en: "Photo", ki: "Ifoto" },
  "scan.describe": { en: "Describe", ki: "Sobanura" },
  "scan.uploadPhoto": { en: "Upload or take a photo", ki: "Ohereza cyangwa ufate ifoto" },
  "scan.tapToOpen": { en: "Tap to open camera or gallery", ki: "Kanda kugira ngo ufungure kamera" },
  "scan.remove": { en: "Remove", ki: "Kuraho" },
  "scan.cropName": { en: "Crop name", ki: "Izina ry'igihingwa" },
  "scan.cropPlaceholder": { en: "e.g. Maize, Beans, Cassava...", ki: "urugero: Ibigori, Ibishyimbo, Imyumbati..." },
  "scan.symptomsLabel": { en: "Describe symptoms", ki: "Sobanura ibimenyetso" },
  "scan.symptomsPlaceholder": { en: "e.g. Yellow leaves, brown spots, wilting stems...", ki: "urugero: Amababi y'umuhondo, utudomo tw'ikijuju..." },
  "scan.diagnose": { en: "Diagnose Crop", ki: "Suzuma igihingwa" },
  "scan.analyzing": { en: "Analyzing...", ki: "Birasuzumwa..." },
  "scan.howItWorks": { en: "🌿 How it works", ki: "🌿 Uko bikora" },
  "scan.howItWorksDesc": {
    en: "Our AI analyzes your crop image or symptom description to identify diseases, pests, and nutrient deficiencies. You'll receive diagnosis results with 3 actionable treatment recommendations in both English and Kinyarwanda.",
    ki: "AI yacu isuzuma ifoto y'igihingwa cyawe cyangwa ibisobanuro by'ibimenyetso kugira ngo imenye indwara, ibyonnyi, n'ibura ry'intungamubiri. Uzabona ibisubizo by'isuzuma hamwe n'inama 3 z'imiti mu Kinyarwanda no mu Cyongereza.",
  },
  "scan.scanAnother": { en: "Scan Another Crop", ki: "Suzuma ikindi gihingwa" },
  "scan.english": { en: "English", ki: "English" },
  "scan.kinyarwanda": { en: "Kinyarwanda", ki: "Kinyarwanda" },

  // Farm Tracker
  "farm.title": { en: "My Farms", ki: "Amashamba yanjye" },
  "farm.subtitle": { en: "Track your crops, treatments and growth stages", ki: "Kurikirana ibihingwa, imiti n'ibyiciro by'imikurire" },
  "farm.noFarms": { en: "No farms yet", ki: "Nta mashamba ahari" },
  "farm.noFarmsDesc": { en: "Add your first farm to start tracking your crops and treatments", ki: "Ongeraho ishamba ryawe rya mbere kugira ngo utangire gukurikirana ibihingwa n'imiti" },
  "farm.addFarm": { en: "Add Farm", ki: "Ongeraho ishamba" },
  "farm.whatToTrack": { en: "📋 What you can track", ki: "📋 Ibyo ushobora gukurikirana" },
  "farm.trackItem1": { en: "Multiple crops per farm", ki: "Ibihingwa byinshi kuri buri shamba" },
  "farm.trackItem2": { en: "Planting dates & growth stages", ki: "Itariki yo gutera n'ibyiciro by'imikurire" },
  "farm.trackItem3": { en: "Treatments & interventions applied", ki: "Imiti n'ibikorwa byakoreshejwe" },
  "farm.trackItem4": { en: "AI diagnosis history", ki: "Amateka y'isuzuma rya AI" },
  "farm.trackItem5": { en: "Predicted harvest dates & yield", ki: "Itariki y'isarura n'umusaruro byateganijwe" },

  // Knowledge Base
  "kb.title": { en: "Knowledge Base", ki: "Ububiko bw'ubumenyi" },
  "kb.subtitle": { en: "Learn best farming practices", ki: "Iga uburyo bwiza bwo guhinga" },
  "kb.planting": { en: "Planting Guides", ki: "Amabwiriza yo gutera" },
  "kb.plantingDesc": { en: "Best practices for common crops in Rwanda", ki: "Uburyo bwiza bw'ibihingwa bisanzwe mu Rwanda" },
  "kb.pests": { en: "Pest Prevention", ki: "Kurwanya ibyonnyi" },
  "kb.pestsDesc": { en: "Identify and prevent common pests", ki: "Kumenya no gukumira ibyonnyi bisanzwe" },
  "kb.soil": { en: "Soil & Water Care", ki: "Ubutaka n'amazi" },
  "kb.soilDesc": { en: "Soil preparation, irrigation and drainage", ki: "Gutegura ubutaka, kuhira no gukata amazi" },
  "kb.disease": { en: "Disease Management", ki: "Gukumira indwara" },
  "kb.diseaseDesc": { en: "Common crop diseases and treatments", ki: "Indwara z'ibihingwa zisanzwe n'imiti" },
  "kb.comingSoon": { en: "Coming soon", ki: "Biragera vuba" },
  "kb.comingSoonDesc": { en: "Video tutorials, offline guides, and community Q&A — all in Kinyarwanda and English.", ki: "Amasomo kuri videwo, amabwiriza adakenera interineti, n'ibibazo n'ibisubizo — byose mu Kinyarwanda no mu Cyongereza." },

  // Profile
  "profile.title": { en: "Profile", ki: "Umwirondoro" },
  "profile.farmer": { en: "Farmer", ki: "Umuhinzi" },
  "profile.signIn": { en: "Sign in to save your data", ki: "Injira kugira ngo ubike amakuru yawe" },
  "profile.editProfile": { en: "Edit Profile", ki: "Hindura umwirondoro" },
  "profile.language": { en: "Language", ki: "Ururimi" },
  "profile.privacy": { en: "Privacy & Security", ki: "Ubuzima bwite n'umutekano" },
  "profile.settings": { en: "Settings", ki: "Igenamiterere" },
  "profile.logOut": { en: "Log Out", ki: "Sohoka" },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => {
    const saved = localStorage.getItem("kero-lang");
    return (saved === "ki" ? "ki" : "en") as Lang;
  });

  const handleSetLang = (newLang: Lang) => {
    setLang(newLang);
    localStorage.setItem("kero-lang", newLang);
  };

  const t = (key: string): string => {
    return translations[key]?.[lang] ?? key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang: handleSetLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
