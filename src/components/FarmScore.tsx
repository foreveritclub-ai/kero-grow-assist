import { useState, useEffect } from "react";
import { TrendingUp, Sprout, Shield, Activity, Star } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Progress } from "@/components/ui/progress";

interface ScoreData {
  total: number;
  farmCount: number;
  cropCount: number;
  diagnosisCount: number;
  healthyCount: number;
  recentActivity: boolean;
}

function calculateScore(data: ScoreData): { score: number; breakdown: { label_en: string; label_ki: string; points: number; max: number }[] } {
  const breakdown = [];

  // Farm setup (0-20)
  const farmPoints = Math.min(data.farmCount * 10, 20);
  breakdown.push({ label_en: "Farm Setup", label_ki: "Amashamba", points: farmPoints, max: 20 });

  // Crops tracked (0-25)
  const cropPoints = Math.min(data.cropCount * 5, 25);
  breakdown.push({ label_en: "Crops Tracked", label_ki: "Ibihingwa bikurikiranwa", points: cropPoints, max: 25 });

  // Diagnosis activity (0-25)
  const diagPoints = Math.min(data.diagnosisCount * 5, 25);
  breakdown.push({ label_en: "Crop Checkups", label_ki: "Isuzuma ry'ibihingwa", points: diagPoints, max: 25 });

  // Healthy crops ratio (0-20)
  const healthRatio = data.diagnosisCount > 0 ? (data.healthyCount / data.diagnosisCount) : 0;
  const healthPoints = Math.round(healthRatio * 20);
  breakdown.push({ label_en: "Crop Health", label_ki: "Ubuzima bw'ibihingwa", points: healthPoints, max: 20 });

  // Recent activity (0-10)
  const activityPoints = data.recentActivity ? 10 : 0;
  breakdown.push({ label_en: "Active This Week", label_ki: "Bikoreshwa iki cyumweru", points: activityPoints, max: 10 });

  const score = breakdown.reduce((sum, b) => sum + b.points, 0);
  return { score, breakdown };
}

function getScoreLabel(score: number, lang: string): { label: string; emoji: string; color: string } {
  if (score >= 80) return { label: lang === "ki" ? "Umuhanga!" : "Expert!", emoji: "🏆", color: "text-severity-good" };
  if (score >= 60) return { label: lang === "ki" ? "Biragenda neza" : "Going well", emoji: "⭐", color: "text-primary" };
  if (score >= 40) return { label: lang === "ki" ? "Uragenda neza" : "Growing", emoji: "🌱", color: "text-accent" };
  if (score >= 20) return { label: lang === "ki" ? "Tangira hano" : "Getting started", emoji: "🌿", color: "text-severity-warning" };
  return { label: lang === "ki" ? "Tangira gukoresha Kero!" : "Start using Kero!", emoji: "👋", color: "text-muted-foreground" };
}

export function FarmScore() {
  const { lang } = useLanguage();
  const { user } = useAuth();
  const [scoreData, setScoreData] = useState<{ score: number; breakdown: { label_en: string; label_ki: string; points: number; max: number }[] } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setLoading(false); return; }

    const load = async () => {
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

      const [farmsRes, cropsRes, diagRes, healthyRes, recentRes] = await Promise.all([
        supabase.from("farms").select("id", { count: "exact", head: true }),
        supabase.from("farm_crops").select("id", { count: "exact", head: true }),
        supabase.from("diagnosis_history").select("id", { count: "exact", head: true }),
        supabase.from("diagnosis_history").select("id", { count: "exact", head: true }).eq("severity", "good"),
        supabase.from("diagnosis_history").select("id", { count: "exact", head: true }).gte("created_at", weekAgo),
      ]);

      const data: ScoreData = {
        total: 0,
        farmCount: farmsRes.count || 0,
        cropCount: cropsRes.count || 0,
        diagnosisCount: diagRes.count || 0,
        healthyCount: healthyRes.count || 0,
        recentActivity: (recentRes.count || 0) > 0,
      };

      setScoreData(calculateScore(data));
      setLoading(false);
    };
    load();
  }, [user]);

  if (loading || !scoreData) return null;

  const { score, breakdown } = scoreData;
  const info = getScoreLabel(score, lang);

  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-display font-bold text-sm flex items-center gap-1.5">
          <Activity className="w-4 h-4 text-primary" />
          {lang === "ki" ? "📊 Amanota y'Umurima" : "📊 Farm Score"}
        </h3>
        <div className="flex items-center gap-1">
          <span className={`font-display font-bold text-lg ${info.color}`}>{score}</span>
          <span className="text-xs text-muted-foreground">/100</span>
        </div>
      </div>

      {/* Score ring */}
      <div className="flex items-center gap-4 mb-4">
        <div className="relative w-16 h-16">
          <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
            <circle cx="32" cy="32" r="28" fill="none" strokeWidth="6" className="stroke-muted/30" />
            <circle
              cx="32" cy="32" r="28" fill="none" strokeWidth="6"
              className="stroke-primary"
              strokeDasharray={`${(score / 100) * 175.9} 175.9`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-lg">{info.emoji}</span>
          </div>
        </div>
        <div>
          <p className={`font-display font-bold text-sm ${info.color}`}>{info.label}</p>
          <p className="text-[11px] text-muted-foreground mt-0.5 font-body">
            {lang === "ki"
              ? "Komeza gukoresha Kero ubone amanota menshi!"
              : "Keep using Kero to improve your score!"}
          </p>
        </div>
      </div>

      {/* Breakdown */}
      <div className="space-y-2">
        {breakdown.map((item, i) => (
          <div key={i}>
            <div className="flex items-center justify-between mb-0.5">
              <span className="text-[11px] font-body text-muted-foreground">
                {lang === "ki" ? item.label_ki : item.label_en}
              </span>
              <span className="text-[11px] font-display font-semibold">
                {item.points}/{item.max}
              </span>
            </div>
            <Progress value={(item.points / item.max) * 100} className="h-1.5" />
          </div>
        ))}
      </div>
    </div>
  );
}
