import { ArrowLeft, BookOpen, Bug, Droplets, Leaf, Sun } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { MobileLayout } from "@/components/MobileLayout";

const topics = [
  {
    icon: Leaf,
    title: "Planting Guides",
    titleKi: "Amabwiriza yo gutera",
    description: "Best practices for common crops in Rwanda",
    count: 12,
  },
  {
    icon: Bug,
    title: "Pest Prevention",
    titleKi: "Kurwanya ibyonnyi",
    description: "Identify and prevent common pests",
    count: 8,
  },
  {
    icon: Droplets,
    title: "Soil & Water Care",
    titleKi: "Ubutaka n'amazi",
    description: "Soil preparation, irrigation and drainage",
    count: 6,
  },
  {
    icon: Sun,
    title: "Disease Management",
    titleKi: "Gukumira indwara",
    description: "Common crop diseases and treatments",
    count: 15,
  },
];

export default function KnowledgeBase() {
  const navigate = useNavigate();

  return (
    <MobileLayout>
      <div className="bg-primary px-5 pt-4 pb-6 rounded-b-3xl">
        <div className="flex items-center gap-3 mb-2">
          <button onClick={() => navigate("/")} className="text-primary-foreground">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-display font-bold text-primary-foreground">
            Knowledge Base
          </h1>
        </div>
        <p className="text-primary-foreground/70 text-sm font-body">
          Learn best farming practices — Iga uburyo bwiza bwo guhinga
        </p>
      </div>

      <div className="px-5 mt-5 space-y-3">
        {topics.map((topic) => {
          const Icon = topic.icon;
          return (
            <button
              key={topic.title}
              className="w-full bg-card rounded-xl border border-border p-4 flex items-start gap-4 text-left active:scale-[0.98] transition-transform"
            >
              <div className="w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-display font-bold text-sm">{topic.title}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{topic.description}</p>
              </div>
              <span className="text-xs text-muted-foreground font-display bg-muted rounded-full px-2.5 py-1">
                {topic.count}
              </span>
            </button>
          );
        })}

        <div className="bg-secondary/20 rounded-xl p-4 mt-4">
          <div className="flex items-center gap-2 mb-1">
            <BookOpen className="w-4 h-4 text-primary" />
            <p className="font-display font-semibold text-sm">Coming soon</p>
          </div>
          <p className="text-xs text-muted-foreground">
            Video tutorials, offline guides, and community Q&A — all in Kinyarwanda and English.
          </p>
        </div>
      </div>
    </MobileLayout>
  );
}
