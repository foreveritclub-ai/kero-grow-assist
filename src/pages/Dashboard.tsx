import { Camera, Keyboard, Sprout, TrendingUp, BookOpen, Clock, MessageSquare, CloudSun, Download, WifiOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { MobileLayout } from "@/components/MobileLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface RecentItem {
  id: string;
  crop_name: string | null;
  severity: string | null;
  disease_or_issue_en: string | null;
  disease_or_issue_ki: string | null;
  created_at: string;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { t, lang, setLang } = useLanguage();
  const { user } = useAuth();
  const [recent, setRecent] = useState<RecentItem[]>([]);
  const [farmCount, setFarmCount] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    if (!user) return;
    supabase
      .from("diagnosis_history")
      .select("id, crop_name, severity, disease_or_issue_en, disease_or_issue_ki, created_at")
      .order("created_at", { ascending: false })
      .limit(3)
      .then(({ data }) => setRecent((data as RecentItem[]) || []));
    supabase
      .from("farms")
      .select("id", { count: "exact", head: true })
      .then(({ count }) => setFarmCount(count || 0));
  }, [user]);

  const actionCards = [
    { icon: Camera, titleKey: "dash.scanCrop", descKey: "dash.scanDesc", path: "/scan", variant: "accent" as const },
    { icon: Keyboard, titleKey: "dash.describeSymptoms", descKey: "dash.describeDesc", path: "/scan?mode=text", variant: "primary" as const },
    { icon: Sprout, titleKey: "dash.farmTracker", descKey: "dash.farmTrackerDesc", path: "/farm", variant: "primary" as const },
    { icon: TrendingUp, titleKey: "dash.harvestPrediction", descKey: "dash.harvestDesc", path: "/scan?mode=text", variant: "primary" as const },
    { icon: CloudSun, titleKey: "weather.title", descKey: "weather.subtitle", path: "/weather", variant: "primary" as const },
    { icon: MessageSquare, titleKey: "community.title", descKey: "community.subtitle", path: "/community", variant: "primary" as const },
  ];

  const userName = user?.user_metadata?.full_name || (lang === "ki" ? "Umuhinzi" : "Farmer");

  return (
    <MobileLayout>
      <div className="bg-primary px-5 pt-6 pb-8 rounded-b-3xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-primary-foreground/70 text-sm font-body">{t("app.greeting")}, {userName}</p>
            <h1 className="text-xl font-display font-bold text-primary-foreground">{t("app.name")}</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setLang(lang === "en" ? "ki" : "en")}
              className="px-2.5 py-1.5 rounded-lg bg-primary-foreground/10 text-primary-foreground text-xs font-display font-bold active:scale-95 transition-transform"
            >
              {lang === "en" ? "KI" : "EN"}
            </button>
            <button
              onClick={() => navigate("/history")}
              className="relative w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center"
            >
              <Clock className="w-5 h-5 text-primary-foreground" />
            </button>
          </div>
        </div>

        {farmCount > 0 ? (
          <div className="bg-primary-foreground/10 rounded-xl p-4 flex items-center gap-3">
            <Sprout className="w-8 h-8 text-secondary" />
            <div>
              <p className="text-primary-foreground/70 text-xs font-body">{t("dash.yourFarms")}</p>
              <p className="text-primary-foreground font-display font-bold text-lg">{farmCount} {t("dash.cropsTracked")}</p>
            </div>
          </div>
        ) : (
          <button
            onClick={() => navigate("/scan")}
            className="w-full bg-primary-foreground/10 rounded-xl p-4 flex items-center gap-3 active:scale-95 transition-transform"
          >
            <Camera className="w-8 h-8 text-secondary" />
            <div className="text-left">
              <p className="text-primary-foreground font-display font-bold text-sm">
                {lang === "ki" ? "📷 Fata ifoto y'igihingwa cyawe utangire" : "📷 Take a photo of your plant to start"}
              </p>
              <p className="text-primary-foreground/60 text-xs font-body mt-0.5">
                {lang === "ki" ? "Kero azagufasha kumenya ikibazo" : "Kero will help identify the problem"}
              </p>
            </div>
          </button>
        )}
      </div>

      <div className="px-5 -mt-4">
        <div className="grid grid-cols-2 gap-3">
          {actionCards.map((card) => {
            const Icon = card.icon;
            const isAccent = card.variant === "accent";
            return (
              <button
                key={card.path + card.titleKey}
                onClick={() => navigate(card.path)}
                className={`rounded-xl p-4 text-left transition-transform active:scale-95 ${
                  isAccent ? "bg-accent text-accent-foreground col-span-2" : "bg-card border border-border text-card-foreground"
                }`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-2 ${isAccent ? "bg-accent-foreground/20" : "bg-primary/10"}`}>
                  <Icon className={`w-5 h-5 ${isAccent ? "text-accent-foreground" : "text-primary"}`} />
                </div>
                <h3 className="font-display font-bold text-sm">{t(card.titleKey)}</h3>
                <p className={`text-xs mt-0.5 ${isAccent ? "text-accent-foreground/80" : "text-muted-foreground"}`}>{t(card.descKey)}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Download App Button */}
      <div className="px-5 mt-4">
        <button
          onClick={() => {
            const w = window as any;
            if (w.deferredPWAPrompt) {
              w.deferredPWAPrompt.prompt();
              w.deferredPWAPrompt.userChoice.then(() => { w.deferredPWAPrompt = null; });
            } else {
              toast({
                title: lang === "ki" ? "Kwinjiza Kero" : "Install Kero",
                description: lang === "ki"
                  ? "Kanda 'Share' hanyuma 'Add to Home Screen' kuri Safari, cyangwa menu kuri Chrome."
                  : "Tap 'Share' then 'Add to Home Screen' on Safari, or use Chrome's menu.",
              });
            }
          }}
          className="w-full flex items-center gap-3 bg-primary/10 rounded-xl px-4 py-3.5 active:bg-primary/20 transition-colors"
        >
          <Download className="w-5 h-5 text-primary" />
          <span className="font-display text-sm font-semibold text-primary">
            {lang === "ki" ? "⬇️ Injiza Kero ku telefoni" : "⬇️ Download Kero App"}
          </span>
        </button>
      </div>

      <div className="px-5 mt-6 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display font-bold text-base">{t("dash.recentActivity")}</h2>
          <button onClick={() => navigate("/history")} className="text-xs text-primary font-semibold">{t("dash.viewAll")}</button>
        </div>
        {recent.length === 0 ? (
          <button
            onClick={() => navigate("/scan")}
            className="w-full bg-card rounded-xl border border-border p-6 flex flex-col items-center justify-center text-center active:scale-95 transition-transform"
          >
            <Camera className="w-10 h-10 text-primary/40 mb-2" />
            <p className="text-sm font-display font-semibold text-foreground">
              {lang === "ki" ? "📷 Fata ifoto y'igihingwa cyawe" : "📷 Take a photo of your plant"}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {lang === "ki" ? "Kero azakubwira ikibazo n'igisubizo" : "Kero will tell you the problem and solution"}
            </p>
          </button>
        ) : (
          <div className="space-y-2">
            {recent.map((item) => (
              <div key={item.id} className="bg-card rounded-xl border border-border p-3 flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full shrink-0 ${
                  item.severity === "good" ? "bg-severity-good" : item.severity === "danger" ? "bg-severity-danger" : "bg-severity-warning"
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="font-display font-semibold text-sm truncate">{item.crop_name || "—"}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {item.severity === "danger" ? "⚠️ " : item.severity === "warning" ? "⚠️ " : "✅ "}
                    {lang === "ki" ? item.disease_or_issue_ki : item.disease_or_issue_en}
                  </p>
                </div>
                <span className="text-xs text-muted-foreground shrink-0">
                  {new Date(item.created_at).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </MobileLayout>
  );
}
