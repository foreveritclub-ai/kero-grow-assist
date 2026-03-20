import { ArrowLeft, ChevronRight, Globe, LogOut, Settings, Shield, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { MobileLayout } from "@/components/MobileLayout";
import { useLanguage } from "@/contexts/LanguageContext";

export default function ProfilePage() {
  const navigate = useNavigate();
  const { t, lang, setLang } = useLanguage();

  const menuItems = [
    { icon: User, labelKey: "profile.editProfile" },
    { icon: Globe, labelKey: "profile.language", action: () => setLang(lang === "en" ? "ki" : "en"), value: lang === "en" ? "English" : "Kinyarwanda" },
    { icon: Shield, labelKey: "profile.privacy" },
    { icon: Settings, labelKey: "profile.settings" },
  ];

  return (
    <MobileLayout>
      <div className="bg-primary px-5 pt-4 pb-8 rounded-b-3xl">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate("/")} className="text-primary-foreground">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-display font-bold text-primary-foreground">{t("profile.title")}</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-primary-foreground/20 flex items-center justify-center">
            <User className="w-8 h-8 text-primary-foreground" />
          </div>
          <div>
            <p className="text-primary-foreground font-display font-bold text-base">{t("profile.farmer")}</p>
            <p className="text-primary-foreground/70 text-sm font-body">{t("profile.signIn")}</p>
          </div>
        </div>
      </div>

      <div className="px-5 mt-5">
        <div className="bg-card rounded-xl border border-border overflow-hidden divide-y divide-border">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.labelKey}
                onClick={item.action}
                className="w-full flex items-center gap-3 px-4 py-3.5 text-left active:bg-muted/50 transition-colors"
              >
                <Icon className="w-5 h-5 text-primary" />
                <span className="flex-1 font-display text-sm font-semibold">{t(item.labelKey)}</span>
                {item.value && <span className="text-xs text-muted-foreground mr-1">{item.value}</span>}
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </button>
            );
          })}
        </div>

        <button className="w-full mt-4 flex items-center gap-3 bg-destructive/10 rounded-xl px-4 py-3.5 active:bg-destructive/20 transition-colors">
          <LogOut className="w-5 h-5 text-destructive" />
          <span className="font-display text-sm font-semibold text-destructive">{t("profile.logOut")}</span>
        </button>

        <p className="text-center text-xs text-muted-foreground mt-6 font-body">{t("app.version")}</p>
      </div>
    </MobileLayout>
  );
}
