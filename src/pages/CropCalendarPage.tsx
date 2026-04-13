import { useState } from "react";
import { ArrowLeft, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { MobileLayout } from "@/components/MobileLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { CROP_CALENDAR, MONTH_NAMES_EN, MONTH_NAMES_KI, CATEGORIES, RWANDA_ZONES, WeatherZone, CropSeason } from "@/data/cropCalendar";

const ZONE_KEY = "kero_farm_zone";

function getZone(): WeatherZone {
  return (localStorage.getItem(ZONE_KEY) as WeatherZone) || "kigali";
}

export default function CropCalendarPage() {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const [zone, setZone] = useState<WeatherZone>(getZone);
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");

  const currentMonth = new Date().getMonth() + 1;
  const months = lang === "ki" ? MONTH_NAMES_KI : MONTH_NAMES_EN;

  const filtered = CROP_CALENDAR.filter((c) => {
    if (!c.zones.includes(zone)) return false;
    if (category !== "all" && c.category !== category) return false;
    if (search) {
      const q = search.toLowerCase();
      return c.crop_en.toLowerCase().includes(q) || c.crop_ki.toLowerCase().includes(q);
    }
    return true;
  });

  // What to plant NOW
  const plantNow = filtered.filter((c) => c.plantingMonths.includes(currentMonth));
  const harvestNow = filtered.filter((c) => c.harvestMonths.includes(currentMonth));

  return (
    <MobileLayout>
      <div className="bg-primary px-5 pt-4 pb-6 rounded-b-3xl">
        <div className="flex items-center gap-3 mb-3">
          <button onClick={() => navigate("/")} className="text-primary-foreground">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-display font-bold text-primary-foreground">
            <Calendar className="w-5 h-5 inline mr-2" />
            {lang === "ki" ? "Kalandariye y'Ibihingwa" : "Crop Calendar"}
          </h1>
        </div>
        <p className="text-primary-foreground/70 text-xs">
          {lang === "ki"
            ? `Akarere: ${RWANDA_ZONES[zone].ki}`
            : `Zone: ${RWANDA_ZONES[zone].en}`}
        </p>
      </div>

      <div className="px-5 mt-4 space-y-4 mb-4">
        {/* Zone selector */}
        <select
          value={zone}
          onChange={(e) => {
            const z = e.target.value as WeatherZone;
            setZone(z);
            localStorage.setItem(ZONE_KEY, z);
          }}
          className="w-full rounded-lg border border-input bg-card px-3 py-2 text-sm font-body"
        >
          {(Object.keys(RWANDA_ZONES) as WeatherZone[]).map((z) => (
            <option key={z} value={z}>
              {lang === "ki" ? RWANDA_ZONES[z].ki : RWANDA_ZONES[z].en}
            </option>
          ))}
        </select>

        {/* Search */}
        <input
          placeholder={lang === "ki" ? "Shakisha igihingwa..." : "Search crop..."}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-input bg-card px-3 py-2 text-sm font-body"
        />

        {/* Category filter */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {Object.entries(CATEGORIES).map(([key, val]) => (
            <button
              key={key}
              onClick={() => setCategory(key)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-display font-semibold transition-colors ${
                category === key
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {lang === "ki" ? val.ki : val.en}
            </button>
          ))}
        </div>

        {/* Plant Now / Harvest Now highlights */}
        {plantNow.length > 0 && (
          <div className="bg-accent/10 border border-accent/30 rounded-xl p-3">
            <p className="font-display font-bold text-sm text-accent mb-1">
              🌱 {lang === "ki" ? "Tera ubu!" : "Plant Now!"}
            </p>
            <p className="text-xs text-muted-foreground">
              {plantNow.map((c) => (lang === "ki" ? c.crop_ki : c.crop_en.split(" (")[0])).join(", ")}
            </p>
          </div>
        )}

        {harvestNow.length > 0 && (
          <div className="bg-severity-good/10 border border-severity-good/30 rounded-xl p-3">
            <p className="font-display font-bold text-sm text-severity-good mb-1">
              🌾 {lang === "ki" ? "Sarura ubu!" : "Harvest Now!"}
            </p>
            <p className="text-xs text-muted-foreground">
              {harvestNow.map((c) => (lang === "ki" ? c.crop_ki : c.crop_en.split(" (")[0])).join(", ")}
            </p>
          </div>
        )}

        {/* Calendar grid */}
        <div className="space-y-3">
          {filtered.map((crop, i) => (
            <CropRow key={i} crop={crop} months={months} currentMonth={currentMonth} lang={lang} />
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-8 text-muted-foreground text-sm">
              {lang === "ki" ? "Nta bihingwa bibonetse" : "No crops found"}
            </div>
          )}
        </div>
      </div>
    </MobileLayout>
  );
}

function CropRow({ crop, months, currentMonth, lang }: { crop: CropSeason; months: string[]; currentMonth: number; lang: string }) {
  return (
    <div className="bg-card border border-border rounded-xl p-3">
      <div className="flex items-start justify-between mb-2">
        <div>
          <p className="font-display font-bold text-sm">
            {lang === "ki" ? crop.crop_ki : crop.crop_en}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {lang === "ki" ? crop.tips_ki : crop.tips_en}
          </p>
        </div>
      </div>
      {/* Month bar */}
      <div className="grid grid-cols-12 gap-0.5 mt-2">
        {months.map((m, idx) => {
          const monthNum = idx + 1;
          const isPlanting = crop.plantingMonths.includes(monthNum);
          const isHarvest = crop.harvestMonths.includes(monthNum);
          const isCurrent = monthNum === currentMonth;
          return (
            <div key={m} className="text-center">
              <div
                className={`h-4 rounded-sm text-[8px] flex items-center justify-center font-bold ${
                  isPlanting && isHarvest
                    ? "bg-amber-400 text-amber-900"
                    : isPlanting
                    ? "bg-primary/70 text-primary-foreground"
                    : isHarvest
                    ? "bg-severity-good/70 text-white"
                    : "bg-muted/50"
                } ${isCurrent ? "ring-1 ring-foreground ring-offset-1" : ""}`}
              >
                {m[0]}
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex gap-3 mt-1.5 text-[9px] text-muted-foreground">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-sm bg-primary/70 inline-block" />
          {lang === "ki" ? "Gutera" : "Plant"}
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-sm bg-severity-good/70 inline-block" />
          {lang === "ki" ? "Gusarura" : "Harvest"}
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-sm bg-amber-400 inline-block" />
          {lang === "ki" ? "Byombi" : "Both"}
        </span>
      </div>
    </div>
  );
}
