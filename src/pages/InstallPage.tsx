import { useState, useEffect } from "react";
import { ArrowLeft, Download, Smartphone, CheckCircle2, Wifi, WifiOff, Battery, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { MobileLayout } from "@/components/MobileLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";

type InstallState = "ready" | "installing" | "installed" | "manual";

export default function InstallPage() {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const [installState, setInstallState] = useState<InstallState>("manual");
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if already installed
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as any).standalone === true;
    setIsStandalone(standalone);

    if ((window as any).deferredPWAPrompt) {
      setInstallState("ready");
    }

    const handler = () => {
      if ((window as any).deferredPWAPrompt) {
        setInstallState("ready");
      }
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    const prompt = (window as any).deferredPWAPrompt;
    if (!prompt) {
      setInstallState("manual");
      return;
    }
    setInstallState("installing");
    prompt.prompt();
    const { outcome } = await prompt.userChoice;
    (window as any).deferredPWAPrompt = null;
    if (outcome === "accepted") {
      setInstallState("installed");
    } else {
      setInstallState("ready");
    }
  };

  const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent);
  const isAndroid = /Android/.test(navigator.userAgent);

  const features = [
    {
      icon: WifiOff,
      title: lang === "ki" ? "Korera offline" : "Works offline",
      desc: lang === "ki" ? "Koresha Kero nta internet" : "Use Kero without internet",
    },
    {
      icon: Wifi,
      title: lang === "ki" ? "Byihuse cyane" : "Lightning fast",
      desc: lang === "ki" ? "Ifunguka vuba nk'appulikasiyoni" : "Opens instantly like a native app",
    },
    {
      icon: Battery,
      title: lang === "ki" ? "Ntikoresha byinshi" : "Light on resources",
      desc: lang === "ki" ? "Ikoresha bake batiri n'aho kubika" : "Uses less battery & storage",
    },
    {
      icon: Shield,
      title: lang === "ki" ? "Ibitswe mu mutekano" : "Secure & private",
      desc: lang === "ki" ? "Amakuru yawe arinzwe" : "Your data stays protected",
    },
  ];

  if (isStandalone) {
    return (
      <MobileLayout>
        <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <CheckCircle2 className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-xl font-display font-bold mb-2">
            {lang === "ki" ? "Kero yashyizweho!" : "Kero is installed!"}
          </h1>
          <p className="text-muted-foreground text-sm mb-6">
            {lang === "ki"
              ? "Uri gukoresha Kero nk'appulikasiyoni. Komeza!"
              : "You're using Kero as a standalone app. Enjoy!"}
          </p>
          <Button onClick={() => navigate("/")} className="bg-primary text-primary-foreground font-display font-bold">
            {lang === "ki" ? "Subira mu rugo" : "Go to Home"}
          </Button>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout>
      <div className="bg-primary px-5 pt-4 pb-10 rounded-b-3xl text-center">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate(-1)} className="text-primary-foreground">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-display font-bold text-primary-foreground">
            {lang === "ki" ? "Injiza Kero" : "Install Kero"}
          </h1>
        </div>

        <div className="w-20 h-20 rounded-2xl bg-primary-foreground/20 flex items-center justify-center mx-auto mb-4">
          <Smartphone className="w-10 h-10 text-primary-foreground" />
        </div>
        <h2 className="text-xl font-display font-bold text-primary-foreground mb-1">Kero Iwawe Assist</h2>
        <p className="text-primary-foreground/70 text-sm font-body">
          {lang === "ki"
            ? "Injiza appulikasiyoni ku telefoni yawe — nta App Store"
            : "Install the app on your phone — no App Store needed"}
        </p>
      </div>

      <div className="px-5 -mt-5">
        {/* Install Button */}
        {installState === "installed" ? (
          <div className="bg-primary/10 rounded-2xl p-5 flex flex-col items-center text-center">
            <CheckCircle2 className="w-12 h-12 text-primary mb-2" />
            <p className="font-display font-bold text-primary">
              {lang === "ki" ? "Kero yashyizweho neza! 🎉" : "Kero installed successfully! 🎉"}
            </p>
            <p className="text-muted-foreground text-xs mt-1">
              {lang === "ki"
                ? "Reba icon ya Kero kuri Home Screen yawe"
                : "Find the Kero icon on your Home Screen"}
            </p>
          </div>
        ) : installState === "ready" || installState === "installing" ? (
          <Button
            onClick={handleInstall}
            disabled={installState === "installing"}
            className="w-full h-14 rounded-2xl bg-accent hover:bg-accent/90 text-accent-foreground font-display font-bold text-base shadow-lg"
          >
            <Download className="w-5 h-5 mr-2" />
            {installState === "installing"
              ? (lang === "ki" ? "Birimo gushyirwaho..." : "Installing...")
              : (lang === "ki" ? "⬇️ Injiza Kero Nonaha" : "⬇️ Install Kero Now")}
          </Button>
        ) : (
          <div className="bg-card rounded-2xl border border-border p-5 space-y-4">
            <p className="font-display font-bold text-sm text-center">
              {lang === "ki" ? "Injiza Kero ku telefoni yawe:" : "Install Kero on your phone:"}
            </p>

            {isIOS ? (
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="w-7 h-7 rounded-full bg-primary/10 text-primary font-bold text-sm flex items-center justify-center shrink-0">1</span>
                  <p className="text-sm font-body">
                    {lang === "ki"
                      ? "Kanda icon ya 'Share' 📤 (hasi y'icyogajuru)"
                      : "Tap the Share icon 📤 at the bottom of Safari"}
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-7 h-7 rounded-full bg-primary/10 text-primary font-bold text-sm flex items-center justify-center shrink-0">2</span>
                  <p className="text-sm font-body">
                    {lang === "ki"
                      ? "Kanda 'Add to Home Screen' ➕"
                      : "Tap 'Add to Home Screen' ➕"}
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-7 h-7 rounded-full bg-primary/10 text-primary font-bold text-sm flex items-center justify-center shrink-0">3</span>
                  <p className="text-sm font-body">
                    {lang === "ki"
                      ? "Kanda 'Add' — Kero izaba ku Home Screen yawe! 🎉"
                      : "Tap 'Add' — Kero will appear on your Home Screen! 🎉"}
                  </p>
                </div>
              </div>
            ) : isAndroid ? (
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="w-7 h-7 rounded-full bg-primary/10 text-primary font-bold text-sm flex items-center justify-center shrink-0">1</span>
                  <p className="text-sm font-body">
                    {lang === "ki"
                      ? "Kanda ⋮ (menu) hejuru y'iburyo kuri Chrome"
                      : "Tap the ⋮ menu at the top-right in Chrome"}
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-7 h-7 rounded-full bg-primary/10 text-primary font-bold text-sm flex items-center justify-center shrink-0">2</span>
                  <p className="text-sm font-body">
                    {lang === "ki"
                      ? "Kanda 'Install app' cyangwa 'Add to Home Screen'"
                      : "Tap 'Install app' or 'Add to Home Screen'"}
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-7 h-7 rounded-full bg-primary/10 text-primary font-bold text-sm flex items-center justify-center shrink-0">3</span>
                  <p className="text-sm font-body">
                    {lang === "ki"
                      ? "Emeza — Kero izaba ku telefoni yawe! 🎉"
                      : "Confirm — Kero will be on your phone! 🎉"}
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="w-7 h-7 rounded-full bg-primary/10 text-primary font-bold text-sm flex items-center justify-center shrink-0">1</span>
                  <p className="text-sm font-body">
                    {lang === "ki"
                      ? "Fungura urupapuro rwa Kero muri Chrome/Edge"
                      : "Open Kero in Chrome or Edge browser"}
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-7 h-7 rounded-full bg-primary/10 text-primary font-bold text-sm flex items-center justify-center shrink-0">2</span>
                  <p className="text-sm font-body">
                    {lang === "ki"
                      ? "Kanda icon y'ibiza 📥 mu kibaho cy'adresse"
                      : "Click the install icon 📥 in the address bar"}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Features */}
      <div className="px-5 mt-6 mb-6">
        <h3 className="font-display font-bold text-sm mb-3">
          {lang === "ki" ? "Impamvu yo kwinjiza Kero:" : "Why install Kero:"}
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div key={i} className="bg-card rounded-xl border border-border p-3">
                <Icon className="w-5 h-5 text-primary mb-1.5" />
                <p className="font-display font-bold text-xs">{f.title}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </MobileLayout>
  );
}
