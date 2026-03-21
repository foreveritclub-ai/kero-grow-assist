import { useEffect, useState } from "react";
import { ArrowLeft, Clock, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { MobileLayout } from "@/components/MobileLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface HistoryItem {
  id: string;
  mode: string;
  crop_name: string | null;
  severity: string | null;
  disease_or_issue_en: string | null;
  disease_or_issue_ki: string | null;
  diagnosis_en: string | null;
  diagnosis_ki: string | null;
  created_at: string;
}

const severityColors: Record<string, string> = {
  good: "bg-severity-good/10 text-severity-good border-severity-good/30",
  warning: "bg-severity-warning/10 text-severity-warning border-severity-warning/30",
  danger: "bg-severity-danger/10 text-severity-danger border-severity-danger/30",
};

export default function HistoryPage() {
  const navigate = useNavigate();
  const { lang, t } = useLanguage();
  const { user } = useAuth();
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("diagnosis_history")
      .select("id, mode, crop_name, severity, disease_or_issue_en, disease_or_issue_ki, diagnosis_en, diagnosis_ki, created_at")
      .order("created_at", { ascending: false })
      .limit(50)
      .then(({ data }) => {
        setItems((data as HistoryItem[]) || []);
        setLoading(false);
      });
  }, [user]);

  const handleDelete = async (id: string) => {
    await supabase.from("diagnosis_history").delete().eq("id", id);
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  return (
    <MobileLayout>
      <div className="bg-primary px-5 pt-4 pb-6 rounded-b-3xl">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="text-primary-foreground"><ArrowLeft className="w-5 h-5" /></button>
          <h1 className="text-lg font-display font-bold text-primary-foreground">
            {lang === "ki" ? "Amateka y'isuzuma" : "Diagnosis History"}
          </h1>
        </div>
      </div>
      <div className="px-5 mt-5 space-y-3 mb-4">
        {loading ? (
          <p className="text-center text-muted-foreground text-sm py-8">{lang === "ki" ? "Biraguruka..." : "Loading..."}</p>
        ) : items.length === 0 ? (
          <div className="text-center py-12">
            <Clock className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">{lang === "ki" ? "Nta mateka ahari" : "No history yet"}</p>
            <p className="text-xs text-muted-foreground/70 mt-1">{lang === "ki" ? "Suzuma igihingwa kugira ngo utangire" : "Scan a crop to get started"}</p>
          </div>
        ) : (
          items.map((item) => (
            <div key={item.id} className="bg-card rounded-xl border border-border p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {item.severity && (
                      <span className={`text-xs px-2 py-0.5 rounded-full border font-semibold ${severityColors[item.severity] || ""}`}>
                        {item.severity}
                      </span>
                    )}
                    <span className="text-xs text-muted-foreground">
                      {new Date(item.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="font-display font-bold text-sm">{item.crop_name || (item.mode === "image" ? "📷 Image" : "—")}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {lang === "ki" ? item.disease_or_issue_ki : item.disease_or_issue_en}
                  </p>
                </div>
                <button onClick={() => handleDelete(item.id)} className="text-muted-foreground/50 hover:text-destructive p-1">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </MobileLayout>
  );
}
