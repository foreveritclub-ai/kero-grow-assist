import { ArrowLeft, BookOpen, Bug, Droplets, Leaf, Sun } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { MobileLayout } from "@/components/MobileLayout";
import { useLanguage } from "@/contexts/LanguageContext";

export default function KnowledgeBase() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const topics = [
    { icon: Leaf, titleKey: "kb.planting", descKey: "kb.plantingDesc", count: 12 },
    { icon: Bug, titleKey: "kb.pests", descKey: "kb.pestsDesc", count: 8 },
    { icon: Droplets, titleKey: "kb.soil", descKey: "kb.soilDesc", count: 6 },
    { icon: Sun, titleKey: "kb.disease", descKey: "kb.diseaseDesc", count: 15 },
  ];

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
      </div>

      <div className="px-5 mt-5 space-y-3">
        {topics.map((topic) => {
          const Icon = topic.icon;
          return (
            <button key={topic.titleKey} className="w-full bg-card rounded-xl border border-border p-4 flex items-start gap-4 text-left active:scale-[0.98] transition-transform">
              <div className="w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-display font-bold text-sm">{t(topic.titleKey)}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{t(topic.descKey)}</p>
              </div>
              <span className="text-xs text-muted-foreground font-display bg-muted rounded-full px-2.5 py-1">{topic.count}</span>
            </button>
          );
        })}

        <div className="bg-secondary/20 rounded-xl p-4 mt-4">
          <div className="flex items-center gap-2 mb-1">
            <BookOpen className="w-4 h-4 text-primary" />
            <p className="font-display font-semibold text-sm">{t("kb.comingSoon")}</p>
          </div>
          <p className="text-xs text-muted-foreground">{t("kb.comingSoonDesc")}</p>
        </div>
      </div>
    </MobileLayout>
  );
}
