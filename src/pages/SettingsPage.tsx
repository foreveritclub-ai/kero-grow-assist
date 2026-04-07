import { useState, useEffect } from "react";
import { ArrowLeft, Bell, Droplets, Flower2, Bug, Clock, Volume2, VolumeX, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { MobileLayout } from "@/components/MobileLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

const TTS_DISABLED_KEY = "kero_tts_disabled_until";

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
  const { lang } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [wateringEnabled, setWateringEnabled] = useState(true);
  const [fertilizationEnabled, setFertilizationEnabled] = useState(true);
  const [pestAlertsEnabled, setPestAlertsEnabled] = useState(true);
  const [notifyTime, setNotifyTime] = useState("07:00");
  const [ttsDisabled, setTtsDisabled] = useState(isTTSDisabled());
  const [notificationsPermission, setNotificationsPermission] = useState<NotificationPermission>("default");

  useEffect(() => {
    if ("Notification" in window) {
      setNotificationsPermission(Notification.permission);
    }
  }, []);

  useEffect(() => {
    if (!user) return;
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
      toast({
        title: lang === "ki" ? "Ntabwo bikunze" : "Not supported",
        description: lang === "ki" ? "Mushakisha yawe ntishyigikira notifications" : "Your browser doesn't support notifications",
        variant: "destructive",
      });
      return;
    }
    const permission = await Notification.requestPermission();
    setNotificationsPermission(permission);
    if (permission === "granted") {
      toast({ title: lang === "ki" ? "Notifications zemejwe!" : "Notifications enabled!" });
      // Register push subscription
      registerPushSubscription();
    }
  };

  const registerPushSubscription = async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          "BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkOs-N7BOy0pS9q3c-fptj1ItMGS3rJENETjBpe6HI"
        ) as BufferSource,
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
        {/* Notifications Section */}
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="flex items-center gap-2 mb-4">
            <Bell className="w-5 h-5 text-primary" />
            <h2 className="font-display font-bold text-sm">
              {lang === "ki" ? "Notifications z'ubuhinzi" : "Farming Notifications"}
            </h2>
          </div>

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
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Droplets className="w-4 h-4 text-blue-500" />
                <div>
                  <p className="font-display font-semibold text-sm">
                    {lang === "ki" ? "Kuvomera" : "Watering Reminders"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {lang === "ki" ? "Uburira bwo kuhira ibihingwa" : "Reminders to water your crops"}
                  </p>
                </div>
              </div>
              <Switch checked={wateringEnabled} onCheckedChange={setWateringEnabled} />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Flower2 className="w-4 h-4 text-green-500" />
                <div>
                  <p className="font-display font-semibold text-sm">
                    {lang === "ki" ? "Ifumbire" : "Fertilization Alerts"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {lang === "ki" ? "Igihe cyo gushyira ifumbire" : "When to apply fertilizer"}
                  </p>
                </div>
              </div>
              <Switch checked={fertilizationEnabled} onCheckedChange={setFertilizationEnabled} />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bug className="w-4 h-4 text-red-500" />
                <div>
                  <p className="font-display font-semibold text-sm">
                    {lang === "ki" ? "Ibyonnyi" : "Pest Alerts"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {lang === "ki" ? "Uburira ku byonnyi n'indwara" : "Warnings about pests & diseases"}
                  </p>
                </div>
              </div>
              <Switch checked={pestAlertsEnabled} onCheckedChange={setPestAlertsEnabled} />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-accent" />
                <div>
                  <p className="font-display font-semibold text-sm">
                    {lang === "ki" ? "Igihe cyo kumenyesha" : "Notification Time"}
                  </p>
                </div>
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
        </div>

        {/* Voice Assistant (TTS) Section */}
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="flex items-center gap-2 mb-4">
            {ttsDisabled ? (
              <VolumeX className="w-5 h-5 text-muted-foreground" />
            ) : (
              <Volume2 className="w-5 h-5 text-primary" />
            )}
            <h2 className="font-display font-bold text-sm">
              {lang === "ki" ? "Umufasha w'ijwi" : "Voice Assistant"}
            </h2>
          </div>

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
        </div>

        {/* Notification Preview */}
        <div className="bg-secondary/20 rounded-xl p-4">
          <p className="font-display font-semibold text-sm mb-2">
            {lang === "ki" ? "Urugero rw'ubutumwa" : "Sample notifications you'll receive"}
          </p>
          <div className="space-y-2">
            {wateringEnabled && (
              <div className="bg-card rounded-lg p-3 border border-border">
                <p className="text-xs font-display font-semibold text-blue-600">💧 {lang === "ki" ? "Kuvomera" : "Watering"}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {lang === "ki"
                    ? "Ibigori byawe bikeneye amazi. Vomera uyu munsi saa 10 z'igitondo."
                    : "Your maize needs water. Water today before 10 AM for best results."}
                </p>
              </div>
            )}
            {fertilizationEnabled && (
              <div className="bg-card rounded-lg p-3 border border-border">
                <p className="text-xs font-display font-semibold text-green-600">🌱 {lang === "ki" ? "Ifumbire" : "Fertilization"}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {lang === "ki"
                    ? "Igihe cyo gushyira ifumbire ya DAP ku birayi byawe. Gukoresha 100g kuri buri gihingwa."
                    : "Time to apply DAP fertilizer to your potatoes. Use 100g per plant."}
                </p>
              </div>
            )}
            {pestAlertsEnabled && (
              <div className="bg-card rounded-lg p-3 border border-border">
                <p className="text-xs font-display font-semibold text-red-600">🐛 {lang === "ki" ? "Ibyonnyi" : "Pest Alert"}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {lang === "ki"
                    ? "Icyitonderwa: Ibyonnyi by'inyenzi bigaragara mu karere kawe. Suzuma ibihingwa byawe."
                    : "Warning: Fall armyworm activity detected in your area. Check your crops today."}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </MobileLayout>
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
