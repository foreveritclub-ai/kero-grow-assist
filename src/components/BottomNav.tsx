import { Home, Sprout, Camera, BookOpen, User } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

const tabs = [
  { path: "/", labelKey: "nav.home", icon: Home },
  { path: "/farm", labelKey: "nav.farm", icon: Sprout },
  { path: "/scan", labelKey: "nav.scan", icon: Camera },
  { path: "/knowledge", labelKey: "nav.learn", icon: BookOpen },
  { path: "/profile", labelKey: "nav.profile", icon: User },
];

export function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-card border-t border-border pb-safe z-50">
      <div className="flex items-center justify-around h-16">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path;
          const Icon = tab.icon;
          const isScan = tab.path === "/scan";

          if (isScan) {
            return (
              <button
                key={tab.path}
                onClick={() => navigate(tab.path)}
                className="flex flex-col items-center -mt-5"
              >
                <div className="w-14 h-14 rounded-full bg-accent flex items-center justify-center shadow-lg">
                  <Icon className="w-7 h-7 text-accent-foreground" />
                </div>
                <span className="text-[10px] font-display font-semibold mt-0.5 text-accent">
                  {t(tab.labelKey)}
                </span>
              </button>
            );
          }

          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className="flex flex-col items-center gap-0.5 min-w-[56px]"
            >
              <Icon className={`w-5 h-5 transition-colors ${isActive ? "text-primary" : "text-muted-foreground"}`} />
              <span className={`text-[10px] font-display font-semibold transition-colors ${isActive ? "text-primary" : "text-muted-foreground"}`}>
                {t(tab.labelKey)}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
