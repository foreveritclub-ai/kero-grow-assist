import { useState, useRef, useEffect } from "react";
import { ArrowLeft, Mic, MicOff, Volume2, VolumeX, Loader2, Sparkles, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { MobileLayout } from "@/components/MobileLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useVoiceAssistant } from "@/hooks/useVoiceAssistant";

interface ChatMessage {
  role: "user" | "assistant";
  text: string;
  severity?: string;
  timestamp: Date;
}

const POPULAR_ISSUES = [
  { ki: "Amababi y'igihingwa arimo guhinduka umuhondo", en: "My plant leaves are turning yellow" },
  { ki: "Ibyonnyi birimo kurya amababi", en: "Bugs are eating my leaves" },
  { ki: "Igihingwa kirimo kwuma", en: "My plant is wilting/drying" },
  { ki: "Utudomo tw'ikijuju ku mababi", en: "Brown spots on the leaves" },
  { ki: "Imizi y'igihingwa irimo kwangirika", en: "The roots are rotting" },
  { ki: "Igihingwa ntikimera neza", en: "My plant is not growing well" },
];

export default function VoiceAssistantPage() {
  const navigate = useNavigate();
  const { t, lang } = useLanguage();
  const { user } = useAuth();
  const { speak, stop, isSpeaking, isSupported: ttsSupported } = useVoiceAssistant();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [loading, setLoading] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [textInput, setTextInput] = useState("");
  const recognitionRef = useRef<any>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [showPopular, setShowPopular] = useState(true);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const startListening = () => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return;

    const recognition = new SR();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = lang === "ki" ? "rw" : "en-US";
    recognitionRef.current = recognition;

    recognition.onresult = (event: any) => {
      const t = Array.from(event.results).map((r: any) => r[0].transcript).join("");
      setTranscript(t);
    };

    recognition.onend = () => {
      setIsListening(false);
      // Auto-send if we have transcript
      const finalTranscript = transcript;
      if (finalTranscript.trim()) {
        // Use timeout to get final state
        setTimeout(() => {
          const el = document.getElementById("voice-transcript");
          if (el && el.textContent?.trim()) {
            handleSendMessage(el.textContent.trim());
          }
        }, 200);
      }
    };

    recognition.onerror = () => setIsListening(false);
    recognition.start();
    setIsListening(true);
    setTranscript("");
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setIsListening(false);
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || loading) return;
    setShowPopular(false);
    setTranscript("");
    setTextInput("");

    const userMsg: ChatMessage = { role: "user", text: text.trim(), timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("crop-diagnosis", {
        body: { mode: "text", symptoms: text.trim(), cropName: "" },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      const severityEmoji = data.severity === "good" ? "✅" : data.severity === "danger" ? "🔴" : "⚠️";
      const diagnosis = lang === "ki" ? data.diagnosis_ki : data.diagnosis_en;
      const disease = lang === "ki" ? data.disease_or_issue_ki : data.disease_or_issue_en;
      const emergency = lang === "ki" ? data.emergency_solution_ki : data.emergency_solution_en;
      const proper = lang === "ki" ? data.proper_solution_ki : data.proper_solution_en;
      const solutions = (lang === "ki" ? data.solutions_ki : data.solutions_en) || [];
      const prevention = (lang === "ki" ? data.prevention_ki : data.prevention_en) || [];
      const encouragement = lang === "ki" ? data.encouragement_ki : data.encouragement_en;
      const greeting = lang === "ki" ? data.greeting_ki : data.greeting_en;

      // Build farmer-friendly response
      const popularNote = lang === "ki"
        ? "\n\n👨‍🌾 Abahinzi benshi mu Rwanda bavuga ko iki kibazo gishobora gukemuka neza ukurikije izi nama."
        : "\n\n👨‍🌾 Many farmers in Rwanda report that following these steps resolves this issue effectively.";

      const responseText = [
        greeting ? `${greeting}\n` : "",
        `${severityEmoji} ${disease}\n`,
        diagnosis ? `${diagnosis}\n` : "",
        emergency ? `\n⚡ ${lang === "ki" ? "Icyo wakora UBUKOZE" : "DO THIS NOW"}:\n${emergency}\n` : "",
        proper ? `\n🛠 ${lang === "ki" ? "Igisubizo cy'igihe kirekire" : "Long-term solution"}:\n${proper}\n` : "",
        solutions.length ? `\n📋 ${lang === "ki" ? "Intambwe" : "Steps"}:\n${solutions.map((s: string, i: number) => `${i + 1}. ${s}`).join("\n")}\n` : "",
        prevention.length ? `\n🛡️ ${lang === "ki" ? "Kwirinda" : "Prevention"}:\n${prevention.slice(0, 3).map((p: string) => `• ${p}`).join("\n")}\n` : "",
        popularNote,
        encouragement ? `\n${encouragement}` : "",
      ].filter(Boolean).join("");

      const assistantMsg: ChatMessage = {
        role: "assistant",
        text: responseText,
        severity: data.severity,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMsg]);

      // Auto-speak the response
      if (ttsSupported) {
        speak(responseText, lang as "en" | "ki");
      }

      // Save to history
      if (user) {
        supabase.from("diagnosis_history").insert({
          user_id: user.id,
          mode: "voice",
          symptoms: text.trim(),
          severity: data.severity,
          diagnosis_en: data.diagnosis_en,
          diagnosis_ki: data.diagnosis_ki,
          disease_or_issue_en: data.disease_or_issue_en,
          disease_or_issue_ki: data.disease_or_issue_ki,
          solutions_en: data.solutions_en,
          solutions_ki: data.solutions_ki,
          prevention_en: data.prevention_en,
          prevention_ki: data.prevention_ki,
          emergency_solution_en: data.emergency_solution_en,
          emergency_solution_ki: data.emergency_solution_ki,
          proper_solution_en: data.proper_solution_en,
          proper_solution_ki: data.proper_solution_ki,
        }).then(() => {});
      }
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        role: "assistant",
        text: lang === "ki"
          ? "😔 Ihuse ntibashobotse. Ongera ugerageze nyuma y'akanya."
          : "😔 Sorry, I couldn't process that. Please try again shortly.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MobileLayout>
      {/* Header */}
      <div className="bg-primary px-5 pt-4 pb-5 rounded-b-3xl">
        <div className="flex items-center gap-3 mb-2">
          <button onClick={() => navigate(-1)} className="text-primary-foreground">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-display font-bold text-primary-foreground">
              {lang === "ki" ? "🎤 Kero - Umufasha w'Ubuhinzi" : "🎤 Kero - Farm Assistant"}
            </h1>
            <p className="text-primary-foreground/70 text-xs font-body">
              {lang === "ki" ? "Vuga ikibazo cy'igihingwa cyawe" : "Speak your crop problem"}
            </p>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 px-4 pt-4 pb-2 space-y-3 min-h-[40vh] max-h-[55vh] overflow-y-auto">
        {messages.length === 0 && !loading && (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <MessageCircle className="w-8 h-8 text-primary" />
            </div>
            <p className="font-display font-bold text-sm text-foreground">
              {lang === "ki" ? "Muraho! Ndi Kero 👋" : "Hello! I'm Kero 👋"}
            </p>
            <p className="text-xs text-muted-foreground mt-1 max-w-[260px] mx-auto">
              {lang === "ki"
                ? "Mbwira ikibazo cy'igihingwa cyawe, nzagufasha kubona igisubizo."
                : "Tell me about your crop problem, I'll help you find a solution."}
            </p>
          </div>
        )}

        {/* Popular issues */}
        {showPopular && messages.length === 0 && (
          <div className="space-y-2">
            <p className="text-xs font-display font-semibold text-muted-foreground">
              {lang === "ki" ? "📌 Ibibazo bisanzwe:" : "📌 Common issues:"}
            </p>
            {POPULAR_ISSUES.map((issue, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(lang === "ki" ? issue.ki : issue.en)}
                className="w-full text-left bg-card border border-border rounded-xl px-3.5 py-2.5 text-xs font-body active:scale-[0.98] transition-transform"
              >
                {lang === "ki" ? issue.ki : issue.en}
              </button>
            ))}
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${
              msg.role === "user"
                ? "bg-primary text-primary-foreground rounded-br-md"
                : msg.severity === "danger"
                  ? "bg-severity-danger/10 border border-severity-danger/20 text-foreground rounded-bl-md"
                  : msg.severity === "good"
                    ? "bg-severity-good/10 border border-severity-good/20 text-foreground rounded-bl-md"
                    : "bg-card border border-border text-foreground rounded-bl-md"
            }`}>
              <p className="text-xs font-body whitespace-pre-line leading-relaxed">{msg.text}</p>
              {msg.role === "assistant" && ttsSupported && (
                <button
                  onClick={() => isSpeaking ? stop() : speak(msg.text, lang as "en" | "ki")}
                  className="mt-2 flex items-center gap-1 text-[10px] font-display font-semibold text-primary"
                >
                  {isSpeaking ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
                  {isSpeaking ? (lang === "ki" ? "Hagarika" : "Stop") : (lang === "ki" ? "🔊 Tegera" : "🔊 Listen")}
                </button>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-card border border-border rounded-2xl rounded-bl-md px-4 py-3">
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-primary" />
                <p className="text-xs font-body text-muted-foreground">
                  {lang === "ki" ? "Kero arimo gusuzuma..." : "Kero is analyzing..."}
                </p>
              </div>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Transcript display */}
      {isListening && transcript && (
        <div className="mx-4 px-4 py-2 bg-accent/10 border border-accent/20 rounded-xl">
          <p id="voice-transcript" className="text-xs font-body text-accent">🎤 {transcript}</p>
        </div>
      )}

      {/* Input Area */}
      <div className="px-4 pb-4 pt-2 border-t border-border bg-background">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage(textInput)}
            placeholder={lang === "ki" ? "Andika ikibazo cyawe..." : "Type your problem..."}
            className="flex-1 h-11 rounded-full border border-input bg-card px-4 text-xs font-body placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <button
            onClick={() => textInput.trim() && handleSendMessage(textInput)}
            disabled={!textInput.trim() || loading}
            className="w-11 h-11 rounded-full bg-primary flex items-center justify-center disabled:opacity-50"
          >
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </button>
          <button
            onClick={() => isListening ? stopListening() : startListening()}
            className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all active:scale-90 ${
              isListening
                ? "bg-destructive animate-pulse"
                : "bg-accent"
            }`}
          >
            {isListening ? (
              <MicOff className="w-6 h-6 text-destructive-foreground" />
            ) : (
              <Mic className="w-6 h-6 text-accent-foreground" />
            )}
          </button>
        </div>
        <p className="text-center text-[10px] text-muted-foreground mt-2 font-body">
          {isListening
            ? (lang === "ki" ? "🎤 Ndategera... vuga ikibazo cyawe" : "🎤 Listening... describe your problem")
            : (lang === "ki" ? "Kanda 🎤 uvuge, cyangwa wandike ikibazo" : "Tap 🎤 to speak, or type your question")}
        </p>
      </div>
    </MobileLayout>
  );
}
