import { useState, useRef } from "react";
import { Camera, Upload, Keyboard, Sparkles, ArrowLeft, Loader2 } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { MobileLayout } from "@/components/MobileLayout";
import { Button } from "@/components/ui/button";
import { DiagnosisCard, DiagnosisResult } from "@/components/DiagnosisCard";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function ScanPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const initialMode = searchParams.get("mode") === "text" ? "text" : "image";
  const [mode, setMode] = useState<"image" | "text">(initialMode);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [symptoms, setSymptoms] = useState("");
  const [cropName, setCropName] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [lang, setLang] = useState<"en" | "ki">("en");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleDiagnose = async () => {
    setLoading(true);
    setResult(null);
    try {
      const payload: Record<string, string> = { mode };
      if (mode === "image" && imagePreview) {
        payload.imageBase64 = imagePreview;
      } else {
        payload.symptoms = symptoms;
        payload.cropName = cropName;
      }

      const { data, error } = await supabase.functions.invoke("crop-diagnosis", {
        body: payload,
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      setResult(data as DiagnosisResult);
    } catch (err: any) {
      console.error("Diagnosis error:", err);
      toast({
        title: "Diagnosis failed",
        description: err.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <MobileLayout>
      {/* Header */}
      <div className="bg-primary px-5 pt-4 pb-6 rounded-b-3xl">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => navigate(-1)} className="text-primary-foreground">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-display font-bold text-primary-foreground">
            AI Crop Diagnosis
          </h1>
        </div>
        {/* Mode toggle */}
        <div className="flex gap-2">
          <button
            onClick={() => { setMode("image"); setResult(null); }}
            className={`flex-1 py-2.5 rounded-lg font-display text-sm font-semibold transition-colors ${
              mode === "image"
                ? "bg-primary-foreground text-primary"
                : "bg-primary-foreground/10 text-primary-foreground/70"
            }`}
          >
            <Camera className="w-4 h-4 inline mr-1.5" />
            Photo
          </button>
          <button
            onClick={() => { setMode("text"); setResult(null); }}
            className={`flex-1 py-2.5 rounded-lg font-display text-sm font-semibold transition-colors ${
              mode === "text"
                ? "bg-primary-foreground text-primary"
                : "bg-primary-foreground/10 text-primary-foreground/70"
            }`}
          >
            <Keyboard className="w-4 h-4 inline mr-1.5" />
            Describe
          </button>
        </div>
      </div>

      <div className="px-5 mt-5">
        {!result ? (
          <>
            {mode === "image" ? (
              <div className="space-y-4">
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={handleImageChange}
                />
                {imagePreview ? (
                  <div className="relative rounded-xl overflow-hidden border border-border">
                    <img src={imagePreview} alt="Crop preview" className="w-full h-64 object-cover" />
                    <button
                      onClick={() => setImagePreview(null)}
                      className="absolute top-2 right-2 bg-card/80 rounded-full px-3 py-1 text-xs font-semibold"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => fileRef.current?.click()}
                    className="w-full h-64 border-2 border-dashed border-primary/30 rounded-xl flex flex-col items-center justify-center gap-3 bg-primary/5 active:scale-95 transition-transform"
                  >
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                      <Upload className="w-8 h-8 text-primary" />
                    </div>
                    <div className="text-center">
                      <p className="font-display font-bold text-sm text-foreground">Upload or take a photo</p>
                      <p className="text-xs text-muted-foreground mt-1">Tap to open camera or gallery</p>
                    </div>
                  </button>
                )}

                <Button
                  className="w-full h-12 bg-accent hover:bg-accent/90 text-accent-foreground font-display font-bold text-base"
                  disabled={!imagePreview || loading}
                  onClick={handleDiagnose}
                >
                  {loading ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Sparkles className="w-5 h-5 mr-2" />}
                  {loading ? "Analyzing..." : "Diagnose Crop"}
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="font-display font-semibold text-sm mb-2 block">Crop name</label>
                  <input
                    type="text"
                    value={cropName}
                    onChange={(e) => setCropName(e.target.value)}
                    placeholder="e.g. Maize, Beans, Cassava..."
                    className="w-full h-12 rounded-lg border border-input bg-card px-4 text-sm font-body placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div>
                  <label className="font-display font-semibold text-sm mb-2 block">Describe symptoms</label>
                  <textarea
                    rows={5}
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    placeholder="e.g. Yellow leaves, brown spots, wilting stems..."
                    className="w-full rounded-lg border border-input bg-card px-4 py-3 text-sm font-body placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                  />
                </div>

                <Button
                  className="w-full h-12 bg-accent hover:bg-accent/90 text-accent-foreground font-display font-bold text-base"
                  disabled={!symptoms.trim() || loading}
                  onClick={handleDiagnose}
                >
                  {loading ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Sparkles className="w-5 h-5 mr-2" />}
                  {loading ? "Analyzing..." : "Diagnose Crop"}
                </Button>
              </div>
            )}

            {/* Info */}
            <div className="mt-6 bg-secondary/20 rounded-xl p-4 mb-4">
              <p className="font-display font-semibold text-sm text-foreground mb-1">🌿 How it works</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Our AI analyzes your crop image or symptom description to identify diseases,
                pests, and nutrient deficiencies. You'll receive diagnosis results with
                3 actionable treatment recommendations in both English and Kinyarwanda.
              </p>
            </div>
          </>
        ) : (
          <div className="space-y-4 mb-4">
            {/* Language toggle */}
            <div className="flex gap-2">
              <button
                onClick={() => setLang("en")}
                className={`flex-1 py-2 rounded-lg font-display text-sm font-semibold border transition-colors ${
                  lang === "en" ? "bg-primary text-primary-foreground border-primary" : "bg-card text-foreground border-border"
                }`}
              >
                English
              </button>
              <button
                onClick={() => setLang("ki")}
                className={`flex-1 py-2 rounded-lg font-display text-sm font-semibold border transition-colors ${
                  lang === "ki" ? "bg-primary text-primary-foreground border-primary" : "bg-card text-foreground border-border"
                }`}
              >
                Kinyarwanda
              </button>
            </div>

            <DiagnosisCard result={result} lang={lang} />

            <Button
              className="w-full h-12 bg-accent hover:bg-accent/90 text-accent-foreground font-display font-bold text-base"
              onClick={() => { setResult(null); setImagePreview(null); setSymptoms(""); setCropName(""); }}
            >
              Scan Another Crop
            </Button>
          </div>
        )}
      </div>
    </MobileLayout>
  );
}
