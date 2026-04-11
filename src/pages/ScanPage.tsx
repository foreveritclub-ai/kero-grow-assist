import { useState, useRef } from "react";
import { Camera, Upload, Keyboard, Sparkles, ArrowLeft, Loader2, Mic, MicOff, Plus } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { MobileLayout } from "@/components/MobileLayout";
import { Button } from "@/components/ui/button";
import { DiagnosisCard, DiagnosisResult } from "@/components/DiagnosisCard";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import { useOfflineCache } from "@/hooks/useOfflineCache";

export default function ScanPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t, lang, setLang } = useLanguage();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const initialMode = searchParams.get("mode") === "text" ? "text" : "image";
  const initialCrop = searchParams.get("crop") || "";
  const [mode, setMode] = useState<"image" | "text">(initialMode);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [symptoms, setSymptoms] = useState("");
  const [cropName, setCropName] = useState(initialCrop);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [lastDiagnosisId, setLastDiagnosisId] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const { saveDiagnosis: cacheOffline } = useOfflineCache();

  // Voice input state
  const [isListening, setIsListening] = useState(false);
  const [voiceTarget, setVoiceTarget] = useState<"symptoms" | "cropName">("symptoms");
  const recognitionRef = useRef<any>(null);

  // Additional text description for image mode
  const [imageDescription, setImageDescription] = useState("");

  const startVoiceInput = (target: "symptoms" | "cropName") => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast({
        title: lang === "ki" ? "Ijwi ntirikoreshwa" : "Voice not supported",
        description: lang === "ki" ? "Mushakisha yawe ntishyigikira ijwi" : "Your browser doesn't support voice input",
        variant: "destructive",
      });
      return;
    }

    setVoiceTarget(target);
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = lang === "ki" ? "rw" : "en-US";
    recognitionRef.current = recognition;

    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((r: any) => r[0].transcript)
        .join("");
      if (target === "symptoms") {
        setSymptoms(transcript);
      } else {
        setCropName(transcript);
      }
    };

    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);

    recognition.start();
    setIsListening(true);
  };

  const stopVoiceInput = () => {
    recognitionRef.current?.stop();
    setIsListening(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const saveDiagnosis = async (diagnosis: DiagnosisResult): Promise<string | null> => {
    if (!user) return null;
    try {
      const { data } = await supabase.from("diagnosis_history").insert({
        user_id: user.id,
        mode,
        crop_name: cropName || null,
        symptoms: symptoms || imageDescription || null,
        severity: diagnosis.severity,
        diagnosis_en: diagnosis.diagnosis_en,
        diagnosis_ki: diagnosis.diagnosis_ki,
        disease_or_issue_en: diagnosis.disease_or_issue_en,
        disease_or_issue_ki: diagnosis.disease_or_issue_ki,
        solutions_en: diagnosis.solutions_en,
        solutions_ki: diagnosis.solutions_ki,
        prevention_en: diagnosis.prevention_en,
        prevention_ki: diagnosis.prevention_ki,
        emergency_solution_en: diagnosis.emergency_solution_en || null,
        emergency_solution_ki: diagnosis.emergency_solution_ki || null,
        proper_solution_en: diagnosis.proper_solution_en || null,
        proper_solution_ki: diagnosis.proper_solution_ki || null,
      }).select("id").single();
      return data?.id || null;
    } catch (err) {
      console.error("Failed to save diagnosis:", err);
      return null;
    }
  };

  const handleDiagnose = async () => {
    setLoading(true);
    setResult(null);
    setLastDiagnosisId(null);
    try {
      const payload: Record<string, string> = { mode };
      if (mode === "image" && imagePreview) {
        payload.imageBase64 = imagePreview;
        // Combined image + text analysis
        if (imageDescription.trim()) {
          payload.symptoms = imageDescription;
        }
        if (cropName.trim()) {
          payload.cropName = cropName;
        }
      } else {
        payload.symptoms = symptoms;
        payload.cropName = cropName;
      }

      const { data, error } = await supabase.functions.invoke("crop-diagnosis", { body: payload });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      const diagnosis = data as DiagnosisResult;
      setResult(diagnosis);
      const diagId = await saveDiagnosis(diagnosis);
      setLastDiagnosisId(diagId);
    } catch (err: any) {
      console.error("Diagnosis error:", err);
      toast({
        title: lang === "ki" ? "Isuzuma ntibyakunze" : "Diagnosis failed",
        description: err.message || (lang === "ki" ? "Hari ikibazo. Ongera ugerageze." : "Something went wrong. Please try again."),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <MobileLayout>
      <div className="bg-primary px-5 pt-4 pb-6 rounded-b-3xl">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => navigate(-1)} className="text-primary-foreground">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-display font-bold text-primary-foreground">{t("scan.title")}</h1>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => { setMode("image"); setResult(null); }}
            className={`flex-1 py-2.5 rounded-lg font-display text-sm font-semibold transition-colors ${
              mode === "image" ? "bg-primary-foreground text-primary" : "bg-primary-foreground/10 text-primary-foreground/70"
            }`}
          >
            <Camera className="w-4 h-4 inline mr-1.5" />{t("scan.photo")}
          </button>
          <button
            onClick={() => { setMode("text"); setResult(null); }}
            className={`flex-1 py-2.5 rounded-lg font-display text-sm font-semibold transition-colors ${
              mode === "text" ? "bg-primary-foreground text-primary" : "bg-primary-foreground/10 text-primary-foreground/70"
            }`}
          >
            <Keyboard className="w-4 h-4 inline mr-1.5" />{t("scan.describe")}
          </button>
        </div>
      </div>

      <div className="px-5 mt-5">
        {!result ? (
          <>
            {mode === "image" ? (
              <div className="space-y-4">
                <input ref={fileRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleImageChange} />
                {imagePreview ? (
                  <div className="relative rounded-xl overflow-hidden border border-border">
                    <img src={imagePreview} alt="Crop preview" className="w-full h-64 object-cover" />
                    <button onClick={() => setImagePreview(null)} className="absolute top-2 right-2 bg-card/80 rounded-full px-3 py-1 text-xs font-semibold">
                      {t("scan.remove")}
                    </button>
                  </div>
                ) : (
                  <button onClick={() => fileRef.current?.click()} className="w-full h-64 border-2 border-dashed border-primary/30 rounded-xl flex flex-col items-center justify-center gap-3 bg-primary/5 active:scale-95 transition-transform">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                      <Upload className="w-8 h-8 text-primary" />
                    </div>
                    <div className="text-center">
                      <p className="font-display font-bold text-sm text-foreground">{t("scan.uploadPhoto")}</p>
                      <p className="text-xs text-muted-foreground mt-1">{t("scan.tapToOpen")}</p>
                    </div>
                  </button>
                )}

                {/* Additional text description for image mode */}
                <div>
                  <label className="font-display font-semibold text-sm mb-2 block">
                    <Plus className="w-3.5 h-3.5 inline mr-1" />
                    {lang === "ki" ? "Ongeraho ibisobanuro (ntibikenewe)" : "Add description (optional)"}
                  </label>
                  <div className="relative">
                    <textarea
                      rows={2}
                      value={imageDescription}
                      onChange={(e) => setImageDescription(e.target.value)}
                      placeholder={lang === "ki" ? "Sobanura ibyo ubona ku gihingwa..." : "Describe what you see on the crop..."}
                      className="w-full rounded-lg border border-input bg-card px-4 py-3 pr-12 text-sm font-body placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                    />
                    <button
                      onClick={() => isListening ? stopVoiceInput() : startVoiceInput("symptoms")}
                      className={`absolute right-2 bottom-2 p-2 rounded-full transition-colors ${
                        isListening ? "bg-destructive text-destructive-foreground animate-pulse" : "bg-primary/10 text-primary"
                      }`}
                    >
                      {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <Button className="w-full h-12 bg-accent hover:bg-accent/90 text-accent-foreground font-display font-bold text-base" disabled={!imagePreview || loading} onClick={handleDiagnose}>
                  {loading ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Sparkles className="w-5 h-5 mr-2" />}
                  {loading ? t("scan.analyzing") : t("scan.diagnose")}
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="font-display font-semibold text-sm mb-2 block">{t("scan.cropName")}</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={cropName}
                      onChange={(e) => setCropName(e.target.value)}
                      placeholder={t("scan.cropPlaceholder")}
                      className="w-full h-12 rounded-lg border border-input bg-card px-4 pr-12 text-sm font-body placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                    <button
                      onClick={() => isListening && voiceTarget === "cropName" ? stopVoiceInput() : startVoiceInput("cropName")}
                      className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full transition-colors ${
                        isListening && voiceTarget === "cropName" ? "bg-destructive text-destructive-foreground animate-pulse" : "bg-primary/10 text-primary"
                      }`}
                    >
                      {isListening && voiceTarget === "cropName" ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="font-display font-semibold text-sm mb-2 block">{t("scan.symptomsLabel")}</label>
                  <div className="relative">
                    <textarea
                      rows={5}
                      value={symptoms}
                      onChange={(e) => setSymptoms(e.target.value)}
                      placeholder={t("scan.symptomsPlaceholder")}
                      className="w-full rounded-lg border border-input bg-card px-4 py-3 pr-12 text-sm font-body placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                    />
                    <button
                      onClick={() => isListening && voiceTarget === "symptoms" ? stopVoiceInput() : startVoiceInput("symptoms")}
                      className={`absolute right-2 bottom-3 p-2 rounded-full transition-colors ${
                        isListening && voiceTarget === "symptoms" ? "bg-destructive text-destructive-foreground animate-pulse" : "bg-primary/10 text-primary"
                      }`}
                    >
                      {isListening && voiceTarget === "symptoms" ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                    </button>
                  </div>
                  {isListening && (
                    <p className="text-xs text-accent mt-1 animate-pulse font-display">
                      {lang === "ki" ? "🎤 Ndategera... vuga ibimenyetso" : "🎤 Listening... describe your symptoms"}
                    </p>
                  )}
                </div>
                <Button className="w-full h-12 bg-accent hover:bg-accent/90 text-accent-foreground font-display font-bold text-base" disabled={!symptoms.trim() || loading} onClick={handleDiagnose}>
                  {loading ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Sparkles className="w-5 h-5 mr-2" />}
                  {loading ? t("scan.analyzing") : t("scan.diagnose")}
                </Button>
              </div>
            )}
            <div className="mt-6 bg-secondary/20 rounded-xl p-4 mb-4">
              <p className="font-display font-semibold text-sm text-foreground mb-1">{t("scan.howItWorks")}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{t("scan.howItWorksDesc")}</p>
            </div>
          </>
        ) : (
          <div className="space-y-4 mb-4">
            <div className="flex gap-2">
              <button onClick={() => setLang("en")} className={`flex-1 py-2 rounded-lg font-display text-sm font-semibold border transition-colors ${lang === "en" ? "bg-primary text-primary-foreground border-primary" : "bg-card text-foreground border-border"}`}>
                {t("scan.english")}
              </button>
              <button onClick={() => setLang("ki")} className={`flex-1 py-2 rounded-lg font-display text-sm font-semibold border transition-colors ${lang === "ki" ? "bg-primary text-primary-foreground border-primary" : "bg-card text-foreground border-border"}`}>
                {t("scan.kinyarwanda")}
              </button>
            </div>
            <DiagnosisCard result={result} lang={lang} diagnosisId={lastDiagnosisId} />
            <Button className="w-full h-12 bg-accent hover:bg-accent/90 text-accent-foreground font-display font-bold text-base" onClick={() => { setResult(null); setImagePreview(null); setSymptoms(""); setCropName(""); setImageDescription(""); setLastDiagnosisId(null); }}>
              {t("scan.scanAnother")}
            </Button>
          </div>
        )}
      </div>
    </MobileLayout>
  );
}
