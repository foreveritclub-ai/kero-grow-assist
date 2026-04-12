import { useState, useMemo } from "react";
import { ArrowLeft, Search, Leaf, Wifi, WifiOff, ChevronDown, ChevronUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { MobileLayout } from "@/components/MobileLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { rwandaCrops, getCropCategories, searchCrops, CropInfo } from "@/data/rwandaCrops";
import { useOfflineCache } from "@/hooks/useOfflineCache";
import { DiagnosisCard } from "@/components/DiagnosisCard";
import { SpeakButton } from "@/components/SpeakButton";

function CropItem({ crop, lang }: { crop: CropInfo; lang: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center gap-3 px-4 py-3 text-left active:bg-muted/50">
        <Leaf className="w-4 h-4 text-primary shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="font-display font-bold text-sm">{lang === "ki" ? crop.name_ki : crop.name_en}</p>
          <p className="text-xs text-muted-foreground">{lang === "ki" ? crop.category_ki : crop.category_en}</p>
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
      </button>
      {open && (
        <div className="px-4 pb-3 space-y-2 border-t border-border pt-2">
          <div>
            <p className="text-xs font-display font-semibold text-primary mb-1">
              {lang === "ki" ? "💡 Inama zo guhinga" : "💡 Growing Tips"}
            </p>
            {(lang === "ki" ? crop.tips_ki : crop.tips_en).map((tip, i) => (
              <p key={i} className="text-xs text-muted-foreground">• {tip}</p>
            ))}
          </div>
          <div>
            <p className="text-xs font-display font-semibold text-destructive mb-1">
              {lang === "ki" ? "⚠️ Ibibazo bisanzwe" : "⚠️ Common Issues"}
            </p>
            {(lang === "ki" ? crop.common_issues_ki : crop.common_issues_en).map((issue, i) => (
              <p key={i} className="text-xs text-muted-foreground">• {issue}</p>
            ))}
          </div>
          <SpeakButton
            text={`${lang === "ki" ? crop.name_ki : crop.name_en}. ${(lang === "ki" ? crop.tips_ki : crop.tips_en).join(". ")}. ${lang === "ki" ? "Ibibazo bisanzwe" : "Common issues"}: ${(lang === "ki" ? crop.common_issues_ki : crop.common_issues_en).join(", ")}`}
            lang={lang as "en" | "ki"}
            label={lang === "ki" ? "Tegera" : "Listen"}
          />
        </div>
      )}
    </div>
  );
}

export default function OfflinePage() {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const { cached, isOffline, clearCache } = useOfflineCache();
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<"crops" | "history">("crops");
  const [selectedCat, setSelectedCat] = useState<string | null>(null);

  const [visibleCount, setVisibleCount] = useState(30);
  const categories = useMemo(() => getCropCategories(), []);
  const filtered = useMemo(() => {
    let results = searchCrops(query);
    if (selectedCat) results = results.filter((c) => c.category_en === selectedCat);
    return results;
  }, [query, selectedCat]);
  const visible = useMemo(() => filtered.slice(0, visibleCount), [filtered, visibleCount]);

  // Reset visible count when filter changes
  useMemo(() => { setVisibleCount(30); }, [query, selectedCat]);

  return (
    <MobileLayout>
      <div className="bg-primary px-5 pt-4 pb-6 rounded-b-3xl">
        <div className="flex items-center gap-3 mb-3">
          <button onClick={() => navigate(-1)} className="text-primary-foreground">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-display font-bold text-primary-foreground">
            {lang === "ki" ? "Korera Offline" : "Offline Mode"}
          </h1>
          <div className="ml-auto flex items-center gap-1.5">
            {isOffline ? <WifiOff className="w-4 h-4 text-destructive" /> : <Wifi className="w-4 h-4 text-secondary" />}
            <span className="text-xs text-primary-foreground/70 font-display">
              {isOffline ? "Offline" : "Online"}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setTab("crops")}
            className={`flex-1 py-2 rounded-lg font-display text-sm font-semibold ${tab === "crops" ? "bg-primary-foreground text-primary" : "bg-primary-foreground/10 text-primary-foreground/70"}`}
          >
            🌱 {lang === "ki" ? `Ibihingwa (${rwandaCrops.length})` : `Crops (${rwandaCrops.length})`}
          </button>
          <button
            onClick={() => setTab("history")}
            className={`flex-1 py-2 rounded-lg font-display text-sm font-semibold ${tab === "history" ? "bg-primary-foreground text-primary" : "bg-primary-foreground/10 text-primary-foreground/70"}`}
          >
            📋 {lang === "ki" ? `Isuzuma (${cached.length})` : `Saved (${cached.length})`}
          </button>
        </div>
      </div>

      <div className="px-5 mt-4 mb-4">
        {tab === "crops" ? (
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={lang === "ki" ? "Shakisha igihingwa..." : "Search crops..."}
                className="w-full h-10 rounded-lg border border-input bg-card pl-10 pr-4 text-sm font-body placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div className="flex gap-1.5 overflow-x-auto pb-1 -mx-1 px-1">
              <button
                onClick={() => setSelectedCat(null)}
                className={`shrink-0 px-3 py-1 rounded-full text-xs font-display font-semibold border transition-colors ${!selectedCat ? "bg-primary text-primary-foreground border-primary" : "bg-card text-foreground border-border"}`}
              >
                {lang === "ki" ? "Byose" : "All"}
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.en}
                  onClick={() => setSelectedCat(selectedCat === cat.en ? null : cat.en)}
                  className={`shrink-0 px-3 py-1 rounded-full text-xs font-display font-semibold border transition-colors ${selectedCat === cat.en ? "bg-primary text-primary-foreground border-primary" : "bg-card text-foreground border-border"}`}
                >
                  {lang === "ki" ? cat.ki : cat.en}
                </button>
              ))}
            </div>

            <p className="text-xs text-muted-foreground">
              {lang === "ki" ? `${filtered.length} ibihingwa` : `${filtered.length} crops`}
            </p>

            <div className="space-y-2">
              {filtered.map((crop) => (
                <CropItem key={crop.name_en} crop={crop} lang={lang} />
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {cached.length === 0 ? (
              <div className="text-center py-12">
                <WifiOff className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground font-display">
                  {lang === "ki" ? "Nta suzuma ribitswe offline" : "No saved diagnoses offline"}
                </p>
                <p className="text-xs text-muted-foreground/70 mt-1">
                  {lang === "ki" ? "Isuzuma 5 ziheruka zibikwa byikora" : "Last 5 diagnoses are auto-saved"}
                </p>
              </div>
            ) : (
              <>
                <p className="text-xs text-muted-foreground">
                  {lang === "ki" ? "Isuzuma 5 ziheruka zibitswe ku telefoni yawe" : "Last 5 diagnoses saved on your device"}
                </p>
                {cached.map((item) => (
                  <div key={item.id} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        {item.cropName || (item.mode === "image" ? "📷" : "—")} — {new Date(item.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                    <DiagnosisCard result={item.result} lang={lang} diagnosisId={item.id} />
                  </div>
                ))}
                <button
                  onClick={clearCache}
                  className="w-full py-2 text-xs text-destructive font-display font-semibold"
                >
                  {lang === "ki" ? "Siba ibyo wabitse byose" : "Clear all saved diagnoses"}
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </MobileLayout>
  );
}
