import { Camera, Keyboard, Sprout, Bell, TrendingUp, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { MobileLayout } from "@/components/MobileLayout";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Dashboard() {
  const navigate = useNavigate();
  const { t, lang, setLang } = useLanguage();

  const actionCards = [
    { icon: Camera, titleKey: "dash.scanCrop", descKey: "dash.scanDesc", path: "/scan", variant: "accent" as const },
    { icon: Keyboard, titleKey: "dash.describeSymptoms", descKey: "dash.describeDesc", path: "/scan?mode=text", variant: "primary" as const },
    { icon: Sprout, titleKey: "dash.farmTracker", descKey: "dash.farmTrackerDesc", path: "/farm", variant: "primary" as const },
    { icon: TrendingUp, titleKey: "dash.harvestPrediction", descKey: "dash.harvestDesc", path: "/scan?mode=predict", variant: "primary" as const },
  ];

  return (
    <MobileLayout>
      <div className="bg-primary px-5 pt-6 pb-8 rounded-b-3xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-primary-foreground/70 text-sm font-body">{t("app.greeting")}</p>
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
              onClick={() => navigate("/notifications")}
              className="relative w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center"
            >
              <Bell className="w-5 h-5 text-primary-foreground" />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-accent rounded-full" />
            </button>
          </div>
        </div>

        <div className="bg-primary-foreground/10 rounded-xl p-4 flex items-center gap-3">
          <Sprout className="w-8 h-8 text-secondary" />
          <div>
            <p className="text-primary-foreground/70 text-xs font-body">{t("dash.yourFarms")}</p>
            <p className="text-primary-foreground font-display font-bold text-lg">0 {t("dash.cropsTracked")}</p>
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
          <button className="text-xs text-primary font-semibold">{t("dash.viewAll")}</button>
        </div>
        <div className="bg-card rounded-xl border border-border p-6 flex flex-col items-center justify-center text-center">
          <BookOpen className="w-10 h-10 text-muted-foreground/40 mb-2" />
          <p className="text-sm text-muted-foreground">{t("dash.noActivity")}</p>
          <p className="text-xs text-muted-foreground/70 mt-1">{t("dash.noActivityDesc")}</p>
        </div>
      </div>
    </MobileLayout>
  );
}
