import { useState, useEffect } from "react";
import {
  ArrowLeft, Bell, Droplets, Flower2, Bug, Clock, Volume2, VolumeX,
  Loader2, MapPin, Globe, Moon, Sun, Smartphone,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { MobileLayout } from "@/components/MobileLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { RWANDA_ZONES, WeatherZone } from "@/data/cropCalendar";

const TTS_DISABLED_KEY = "kero_tts_disabled_until";
const ZONE_KEY = "kero_farm_zone";

function isTTSDisabled(): boolean {
  const until = localStorage.getItem(TTS_DISABLED_KEY);
  if (!until) return false;
  return new Date(until) > new Date();
}

function getTTSDisabledUntil(): string | null {
  const until = localStorage.getItem(TTS_DISABLED_KEY);
  if (!until || new Date(until) <= new Date()) return null;
  return until;
}

export default function SettingsPage() {
  const navigate = useNavigate();
  const { lang, setLang } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();

  // Notification prefs
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [wateringEnabled, setWateringEnabled] = useState(true);
  const [fertilizationEnabled, setFertilizationEnabled] = useState(true);
  const [pestAlertsEnabled, setPestAlertsEnabled] = useState(true);
  const [notifyTime, setNotifyTime] = useState("07:00");
  const [ttsDisabled, setTtsDisabled] = useState(isTTSDisabled());
  const [notificationsPermission, setNotificationsPermission] = useState<NotificationPermission>("default");

  // Zone
  const [zone, setZone] = useState<WeatherZone>(() => (localStorage.getItem(ZONE_KEY) as WeatherZone) || "kigali");

  useEffect(() => {
    if ("Notification" in window) setNotificationsPermission(Notification.permission);
  }, []);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    supabase
      .from("notification_preferences")
      .select("*")
      .eq("user_id", user.id)
      .single()
      .then(({ data }) => {
        if (data) {
          setWateringEnabled(data.watering_enabled);
          setFertilizationEnabled(data.fertilization_enabled);
          setPestAlertsEnabled(data.pest_alerts_enabled);
          setNotifyTime(data.notify_time);
        }
        setLoading(false);
      });
  }, [user]);

  const requestNotificationPermission = async () => {
    if (!("Notification" in window)) {
      toast({ title: lang === "ki" ? "Ntabwo bikunze" : "Not supported", description: lang === "ki" ? "Mushakisha yawe ntishyigikira notifications" : "Your browser doesn't support notifications", variant: "destructive" });
      return;
    }
    const permission = await Notification.requestPermission();
    setNotificationsPermission(permission);
    if (permission === "granted") {
      toast({ title: lang === "ki" ? "Notifications zemejwe!" : "Notifications enabled!" });
      registerPushSubscription();
    }
  };

  const registerPushSubscription = async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array("BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkOs-N7BOy0pS9q3c-fptj1ItMGS3rJENETjBpe6HI") as BufferSource,
      });
      if (user) {
        const sub = subscription.toJSON();
        await supabase.from("push_subscriptions").upsert({
          user_id: user.id,
          endpoint: sub.endpoint!,
          p256dh: sub.keys!.p256dh,
          auth_key: sub.keys!.auth,
        }, { onConflict: "user_id,endpoint" });
      }
    } catch (err) {
      console.error("Push subscription failed:", err);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from("notification_preferences").upsert({
      user_id: user.id,
      watering_enabled: wateringEnabled,
      fertilization_enabled: fertilizationEnabled,
      pest_alerts_enabled: pestAlertsEnabled,
      notify_time: notifyTime,
      language: lang,
    }, { onConflict: "user_id" });
    setSaving(false);
    if (error) {
      toast({ title: lang === "ki" ? "Ikosa" : "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: lang === "ki" ? "Igenamiterere ryabitswe!" : "Settings saved!" });
    }
  };

  const toggleTTS = () => {
    if (ttsDisabled) {
      localStorage.removeItem(TTS_DISABLED_KEY);
      setTtsDisabled(false);
      toast({ title: lang === "ki" ? "Ijwi ryongeye gukora" : "Voice assistant re-enabled" });
    } else {
      const until = new Date();
      until.setDate(until.getDate() + 30);
      localStorage.setItem(TTS_DISABLED_KEY, until.toISOString());
      setTtsDisabled(true);
      speechSynthesis.cancel();
      toast({
        title: lang === "ki" ? "Ijwi ryahagaritswe" : "Voice assistant disabled",
        description: lang === "ki" ? "Rizongera gukora nyuma y'iminsi 30" : "Will re-enable after 30 days",
      });
    }
  };

  const handleZoneChange = (z: WeatherZone) => {
    setZone(z);
    localStorage.setItem(ZONE_KEY, z);
    toast({ title: lang === "ki" ? "Akarere kahindutse" : "Zone updated" });
  };

  const ttsUntil = getTTSDisabledUntil();

  return (
    <MobileLayout>
      <div className="bg-primary px-5 pt-4 pb-6 rounded-b-3xl">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/profile")} className="text-primary-foreground">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-display font-bold text-primary-foreground">
            {lang === "ki" ? "Igenamiterere" : "Settings"}
          </h1>
        </div>
      </div>

      <div className="px-5 mt-5 space-y-4 mb-4">
        {/* Language Section */}
        <SettingsSection icon={Globe} title={lang === "ki" ? "Ururimi" : "Language"}>
          <div className="flex gap-2">
            {(["en", "ki"] as const).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`flex-1 py-2.5 rounded-lg text-sm font-display font-semibold transition-colors ${
                  lang === l ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}
              >
                {l === "en" ? "English" : "Kinyarwanda"}
              </button>
            ))}
          </div>
        </SettingsSection>

        {/* Farm Zone Section */}
        <SettingsSection icon={MapPin} title={lang === "ki" ? "Akarere k'ubuhinzi" : "Farm Zone"}>
          <div className="space-y-2">
            {(Object.keys(RWANDA_ZONES) as WeatherZone[]).map((z) => (
              <button
                key={z}
                onClick={() => handleZoneChange(z)}
                className={`w-full text-left p-3 rounded-lg border transition-colors ${
                  zone === z
                    ? "border-primary bg-primary/5"
                    : "border-border bg-card hover:bg-muted/50"
                }`}
              >
                <p className={`font-display font-semibold text-sm ${zone === z ? "text-primary" : ""}`}>
                  {lang === "ki" ? RWANDA_ZONES[z].ki : RWANDA_ZONES[z].en}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {lang === "ki" ? RWANDA_ZONES[z].description_ki : RWANDA_ZONES[z].description_en}
                </p>
              </button>
            ))}
          </div>
        </SettingsSection>

        {/* Notifications Section */}
        <SettingsSection icon={Bell} title={lang === "ki" ? "Notifications z'ubuhinzi" : "Farming Notifications"}>
          {notificationsPermission !== "granted" && (
            <button
              onClick={requestNotificationPermission}
              className="w-full mb-4 flex items-center justify-center gap-2 py-3 rounded-lg bg-primary text-primary-foreground font-display font-semibold text-sm active:scale-95 transition-transform"
            >
              <Bell className="w-4 h-4" />
              {lang === "ki" ? "Emeza Notifications" : "Enable Notifications"}
            </button>
          )}

          {notificationsPermission === "denied" && (
            <div className="mb-4 bg-destructive/10 rounded-lg p-3">
              <p className="text-xs text-destructive font-display font-semibold">
                {lang === "ki"
                  ? "Notifications zarahajwe. Jya mu ma settings ya browser uzihindure."
                  : "Notifications are blocked. Go to browser settings to allow them."}
              </p>
            </div>
          )}

          <div className="space-y-4">
            <ToggleRow
              icon={<Droplets className="w-4 h-4 text-blue-500" />}
              title={lang === "ki" ? "Kuvomera" : "Watering Reminders"}
              desc={lang === "ki" ? "Uburira bwo kuhira ibihingwa" : "Reminders to water your crops"}
              checked={wateringEnabled}
              onChange={setWateringEnabled}
            />
            <ToggleRow
              icon={<Flower2 className="w-4 h-4 text-green-500" />}
              title={lang === "ki" ? "Ifumbire" : "Fertilization Alerts"}
              desc={lang === "ki" ? "Igihe cyo gushyira ifumbire" : "When to apply fertilizer"}
              checked={fertilizationEnabled}
              onChange={setFertilizationEnabled}
            />
            <ToggleRow
              icon={<Bug className="w-4 h-4 text-red-500" />}
              title={lang === "ki" ? "Ibyonnyi" : "Pest Alerts"}
              desc={lang === "ki" ? "Uburira ku byonnyi n'indwara" : "Warnings about pests & diseases"}
              checked={pestAlertsEnabled}
              onChange={setPestAlertsEnabled}
            />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-accent" />
                <p className="font-display font-semibold text-sm">
                  {lang === "ki" ? "Igihe cyo kumenyesha" : "Notification Time"}
                </p>
              </div>
              <input
                type="time"
                value={notifyTime}
                onChange={(e) => setNotifyTime(e.target.value)}
                className="rounded-lg border border-input bg-card px-3 py-1.5 text-sm font-body"
              />
            </div>
          </div>

          <Button
            onClick={handleSave}
            disabled={saving || loading}
            className="w-full mt-4 h-11 bg-accent hover:bg-accent/90 text-accent-foreground font-display font-bold text-sm"
          >
            {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
            {lang === "ki" ? "Bika igenamiterere" : "Save Notification Settings"}
          </Button>
        </SettingsSection>

        {/* Voice Assistant Section */}
        <SettingsSection
          icon={ttsDisabled ? VolumeX : Volume2}
          title={lang === "ki" ? "Umufasha w'ijwi" : "Voice Assistant"}
          iconClassName={ttsDisabled ? "text-muted-foreground" : "text-primary"}
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="font-display font-semibold text-sm">
                {ttsDisabled
                  ? (lang === "ki" ? "Ijwi ryahagaritswe" : "Voice is disabled")
                  : (lang === "ki" ? "Ijwi rirakora" : "Voice is active")}
              </p>
              {ttsUntil && (
                <p className="text-xs text-muted-foreground mt-0.5">
                  {lang === "ki"
                    ? `Rizongera ${new Date(ttsUntil).toLocaleDateString("rw-RW")}`
                    : `Re-enables ${new Date(ttsUntil).toLocaleDateString()}`}
                </p>
              )}
            </div>
            <Switch checked={!ttsDisabled} onCheckedChange={toggleTTS} />
          </div>
          <p className="text-xs text-muted-foreground">
            {lang === "ki"
              ? "Iyo ijwi ryahagaritswe, ibuto byo 'Tegera' ntibizagaragara mu minsi 30."
              : "When disabled, 'Listen' buttons won't appear for 30 days."}
          </p>
        </SettingsSection>

        {/* App Info */}
        <SettingsSection icon={Smartphone} title={lang === "ki" ? "Ibyerekeye App" : "About"}>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">{lang === "ki" ? "Verisiyo" : "Version"}</span>
              <span className="font-display font-semibold">1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{lang === "ki" ? "Akarere" : "Zone"}</span>
              <span className="font-display font-semibold">{lang === "ki" ? RWANDA_ZONES[zone].ki : RWANDA_ZONES[zone].en}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{lang === "ki" ? "Ururimi" : "Language"}</span>
              <span className="font-display font-semibold">{lang === "en" ? "English" : "Kinyarwanda"}</span>
            </div>
          </div>
        </SettingsSection>
      </div>
    </MobileLayout>
  );
}

/* Reusable sub-components */
function SettingsSection({ icon: Icon, title, children, iconClassName }: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
  iconClassName?: string;
}) {
  return (
    <div className="bg-card rounded-xl border border-border p-4">
      <div className="flex items-center gap-2 mb-4">
        <Icon className={`w-5 h-5 ${iconClassName || "text-primary"}`} />
        <h2 className="font-display font-bold text-sm">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function ToggleRow({ icon, title, desc, checked, onChange }: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        {icon}
        <div>
          <p className="font-display font-semibold text-sm">{title}</p>
          <p className="text-xs text-muted-foreground">{desc}</p>
        </div>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
