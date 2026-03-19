import { Camera, Keyboard, Sprout, Bell, TrendingUp, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { MobileLayout } from "@/components/MobileLayout";

const actionCards = [
  {
    icon: Camera,
    title: "Scan Crop",
    titleKi: "Suzuma igihingwa",
    description: "Take a photo to diagnose diseases",
    path: "/scan",
    variant: "accent" as const,
  },
  {
    icon: Keyboard,
    title: "Describe Symptoms",
    titleKi: "Sobanura ibimenyetso",
    description: "Type what you see on your crop",
    path: "/scan?mode=text",
    variant: "primary" as const,
  },
  {
    icon: Sprout,
    title: "Farm Tracker",
    titleKi: "Gukurikirana umurima",
    description: "Track crops, treatments & growth",
    path: "/farm",
    variant: "primary" as const,
  },
  {
    icon: TrendingUp,
    title: "Harvest Prediction",
    titleKi: "Guteganya isarura",
    description: "AI growth & yield estimates",
    path: "/scan?mode=predict",
    variant: "primary" as const,
  },
];

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <MobileLayout>
      {/* Header */}
      <div className="bg-primary px-5 pt-6 pb-8 rounded-b-3xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-primary-foreground/70 text-sm font-body">Muraho 👋</p>
            <h1 className="text-xl font-display font-bold text-primary-foreground">
              Kero Iwawe Assist
            </h1>
          </div>
          <button
            onClick={() => navigate("/notifications")}
            className="relative w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center"
          >
            <Bell className="w-5 h-5 text-primary-foreground" />
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-accent rounded-full" />
          </button>
        </div>

        {/* Quick stat */}
        <div className="bg-primary-foreground/10 rounded-xl p-4 flex items-center gap-3">
          <Sprout className="w-8 h-8 text-secondary" />
          <div>
            <p className="text-primary-foreground/70 text-xs font-body">Your farms</p>
            <p className="text-primary-foreground font-display font-bold text-lg">
              0 crops tracked
            </p>
          </div>
        </div>
      </div>

      {/* Action Cards */}
      <div className="px-5 -mt-4">
        <div className="grid grid-cols-2 gap-3">
          {actionCards.map((card) => {
            const Icon = card.icon;
            const isAccent = card.variant === "accent";
            return (
              <button
                key={card.path + card.title}
                onClick={() => navigate(card.path)}
                className={`rounded-xl p-4 text-left transition-transform active:scale-95 ${
                  isAccent
                    ? "bg-accent text-accent-foreground col-span-2"
                    : "bg-card border border-border text-card-foreground"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center mb-2 ${
                    isAccent
                      ? "bg-accent-foreground/20"
                      : "bg-primary/10"
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 ${
                      isAccent ? "text-accent-foreground" : "text-primary"
                    }`}
                  />
                </div>
                <h3 className="font-display font-bold text-sm">{card.title}</h3>
                <p
                  className={`text-xs mt-0.5 ${
                    isAccent ? "text-accent-foreground/80" : "text-muted-foreground"
                  }`}
                >
                  {card.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="px-5 mt-6 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display font-bold text-base">Recent Activity</h2>
          <button className="text-xs text-primary font-semibold">View all</button>
        </div>
        <div className="bg-card rounded-xl border border-border p-6 flex flex-col items-center justify-center text-center">
          <BookOpen className="w-10 h-10 text-muted-foreground/40 mb-2" />
          <p className="text-sm text-muted-foreground">No activity yet</p>
          <p className="text-xs text-muted-foreground/70 mt-1">
            Scan a crop or add a farm to get started
          </p>
        </div>
      </div>
    </MobileLayout>
  );
}
