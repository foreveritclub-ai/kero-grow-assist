import { Shield, AlertTriangle, CheckCircle } from "lucide-react";

export interface DiagnosisResult {
  severity: "good" | "warning" | "danger";
  diagnosis_en: string;
  diagnosis_ki: string;
  disease_or_issue_en: string;
  disease_or_issue_ki: string;
  solutions_en: string[];
  solutions_ki: string[];
  prevention_en: string[];
  prevention_ki: string[];
}

interface DiagnosisCardProps {
  result: DiagnosisResult;
  lang: "en" | "ki";
}

const severityConfig = {
  good: {
    icon: CheckCircle,
    label: "Healthy",
    labelKi: "Muzima",
    bgClass: "bg-severity-good/10",
    textClass: "text-severity-good",
    borderClass: "border-severity-good/30",
  },
  warning: {
    icon: AlertTriangle,
    label: "Warning",
    labelKi: "Icyitonderwa",
    bgClass: "bg-severity-warning/10",
    textClass: "text-severity-warning",
    borderClass: "border-severity-warning/30",
  },
  danger: {
    icon: Shield,
    label: "Critical",
    labelKi: "Byihutirwa",
    bgClass: "bg-severity-danger/10",
    textClass: "text-severity-danger",
    borderClass: "border-severity-danger/30",
  },
};

export function DiagnosisCard({ result, lang }: DiagnosisCardProps) {
  const sev = severityConfig[result.severity] || severityConfig.warning;
  const Icon = sev.icon;

  const diagnosis = lang === "ki" ? result.diagnosis_ki : result.diagnosis_en;
  const issue = lang === "ki" ? result.disease_or_issue_ki : result.disease_or_issue_en;
  const solutions = lang === "ki" ? result.solutions_ki : result.solutions_en;
  const prevention = lang === "ki" ? result.prevention_ki : result.prevention_en;
  const sevLabel = lang === "ki" ? sev.labelKi : sev.label;

  return (
    <div className="space-y-4">
      {/* Severity Banner */}
      <div className={`rounded-xl p-4 border ${sev.bgClass} ${sev.borderClass} flex items-center gap-3`}>
        <Icon className={`w-8 h-8 ${sev.textClass}`} />
        <div>
          <p className={`font-display font-bold text-lg ${sev.textClass}`}>{sevLabel}</p>
          <p className="text-sm font-body text-foreground">{issue}</p>
        </div>
      </div>

      {/* Diagnosis */}
      <div className="bg-card rounded-xl border border-border p-4">
        <h3 className="font-display font-bold text-sm mb-2">
          {lang === "ki" ? "Isuzuma" : "Diagnosis"}
        </h3>
        <p className="text-sm text-muted-foreground font-body leading-relaxed">{diagnosis}</p>
      </div>

      {/* Solutions */}
      <div className="bg-card rounded-xl border border-border p-4">
        <h3 className="font-display font-bold text-sm mb-3">
          {lang === "ki" ? "Ibisubizo" : "Recommended Solutions"}
        </h3>
        <div className="space-y-2">
          {solutions?.map((sol, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="w-6 h-6 rounded-full bg-accent/10 text-accent flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                {i + 1}
              </span>
              <p className="text-sm text-foreground font-body">{sol}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Prevention */}
      <div className="bg-card rounded-xl border border-border p-4">
        <h3 className="font-display font-bold text-sm mb-3">
          {lang === "ki" ? "Kwirinda" : "Prevention Tips"}
        </h3>
        <div className="space-y-2">
          {prevention?.map((tip, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="text-secondary text-lg leading-none">•</span>
              <p className="text-sm text-foreground font-body">{tip}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
