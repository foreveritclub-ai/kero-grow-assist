import { Camera, Keyboard, Sprout, TrendingUp, BookOpen, Clock, MessageSquare, CloudSun, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { MobileLayout } from "@/components/MobileLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

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

        <div className="bg-primary-foreground/10 rounded-xl p-4 flex items-center gap-3">
          <Sprout className="w-8 h-8 text-secondary" />
          <div>
            <p className="text-primary-foreground/70 text-xs font-body">{t("dash.yourFarms")}</p>
            <p className="text-primary-foreground font-display font-bold text-lg">{farmCount} {t("dash.cropsTracked")}</p>
          </div>
        </div>
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

      <div className="px-5 mt-6 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display font-bold text-base">{t("dash.recentActivity")}</h2>
          <button onClick={() => navigate("/history")} className="text-xs text-primary font-semibold">{t("dash.viewAll")}</button>
        </div>
        {recent.length === 0 ? (
          <div className="bg-card rounded-xl border border-border p-6 flex flex-col items-center justify-center text-center">
            <BookOpen className="w-10 h-10 text-muted-foreground/40 mb-2" />
            <p className="text-sm text-muted-foreground">{t("dash.noActivity")}</p>
            <p className="text-xs text-muted-foreground/70 mt-1">{t("dash.noActivityDesc")}</p>
          </div>
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
