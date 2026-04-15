import { useState, useEffect } from "react";
import { AlertTriangle, Droplets, Sun, Wind, CloudRain, Thermometer, ChevronRight, Sprout } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface SmartAlert {
  icon: React.ElementType;
  type: "warning" | "action" | "info";
  title_en: string;
  title_ki: string;
  action_en: string;
  action_ki: string;
}

function generateAlerts(temp: number, humidity: number, rainChance: number, windSpeed: number): SmartAlert[] {
  const alerts: SmartAlert[] = [];

  // Heavy rain coming
  if (rainChance > 70) {
    alerts.push({
      icon: CloudRain,
      type: "warning",
      title_en: "Heavy rain expected today",
      title_ki: "Imvura nyinshi itegerejwe uyu munsi",
      action_en: "🏃 Don't apply fertilizer or pesticides today — rain will wash them away. Check drainage channels.",
      action_ki: "🏃 Ntukoreshe ifumbire cyangwa imiti uyu munsi — imvura izabikuraho. Reba ho amazi asohokera.",
    });
  }

  // Hot day
  if (temp > 30) {
    alerts.push({
      icon: Thermometer,
      type: "action",
      title_en: `It's hot today (${temp}°C)`,
      title_ki: `Bishyushye uyu munsi (${temp}°C)`,
      action_en: "💧 Water your crops early morning (before 8AM) or evening (after 5PM). Mulch around plants to keep soil moist.",
      action_ki: "💧 Vomerera ibihingwa mu gitondo (mbere ya 8h) cyangwa nimugoroba (nyuma ya 17h). Shyira ibyatsi ku butaka.",
    });
  }

  // High humidity + warm = fungal risk
  if (humidity > 80 && temp > 22) {
    alerts.push({
      icon: AlertTriangle,
      type: "warning",
      title_en: "Fungal disease risk is high",
      title_ki: "Ibihumyo bishobora kwangiza ibihingwa",
      action_en: "🔍 Check leaves for spots. Remove any affected leaves. Apply Dithane M-45 if needed.",
      action_ki: "🔍 Reba utudomo ku mababi. Kuraho amababi yanduye. Koresha Dithane M-45 niba bikenewe.",
    });
  }

  // Good planting conditions
  if (rainChance > 40 && rainChance < 70 && temp > 18 && temp < 28) {
    alerts.push({
      icon: Sprout,
      type: "info",
      title_en: "Good conditions for planting",
      title_ki: "Ikirere cyiza cyo gutera",
      action_en: "🌱 Perfect day to plant or transplant seedlings. Soil is moist and temperature is ideal.",
      action_ki: "🌱 Umunsi mwiza wo gutera cyangwa kwimura ibiterwa. Ubutaka bufite umwuka uhagije.",
    });
  }

  // Dry + hot = water alert
  if (rainChance < 20 && temp > 25) {
    alerts.push({
      icon: Droplets,
      type: "action",
      title_en: "Dry conditions — water your crops",
      title_ki: "Harahumye — vomerera ibihingwa",
      action_en: "🚿 No rain expected. Water deeply at the roots, not on leaves. Focus on young plants first.",
      action_ki: "🚿 Nta mvura itegerejwe. Vomerera cyane ku mizi, ntabwo ku mababi. Tangira ku biterwa bito.",
    });
  }

  // Windy
  if (windSpeed > 25) {
    alerts.push({
      icon: Wind,
      type: "warning",
      title_en: "Strong winds expected",
      title_ki: "Umuyaga ukomeye witezwe",
      action_en: "🌬️ Support tall crops (maize, beans on sticks). Don't spray pesticides — wind will carry them away.",
      action_ki: "🌬️ Shyigikira ibihingwa birebire. Ntukoreshe imiti — umuyaga uzayijyana.",
    });
  }

  return alerts.slice(0, 3); // Max 3 alerts
}

export function SmartAlerts() {
  const { lang } = useLanguage();
  const [alerts, setAlerts] = useState<SmartAlert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        // Try geolocation, fallback Kigali
        const coords = await new Promise<{ lat: number; lon: number }>((resolve) => {
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              (pos) => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
              () => resolve({ lat: -1.9403, lon: 29.8739 })
            );
          } else {
            resolve({ lat: -1.9403, lon: 29.8739 });
          }
        });

        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m&daily=precipitation_probability_max&timezone=Africa/Kigali&forecast_days=1`
        );
        const data = await res.json();
        const temp = Math.round(data.current.temperature_2m);
        const humidity = data.current.relative_humidity_2m;
        const wind = Math.round(data.current.wind_speed_10m);
        const rainChance = data.daily.precipitation_probability_max?.[0] || 0;

        setAlerts(generateAlerts(temp, humidity, rainChance, wind));
      } catch {
        setAlerts([]);
      }
      setLoading(false);
    };
    fetchWeather();
  }, []);

  if (loading || alerts.length === 0) return null;

  const typeColors = {
    warning: "border-severity-warning/30 bg-severity-warning/5",
    action: "border-primary/30 bg-primary/5",
    info: "border-severity-good/30 bg-severity-good/5",
  };

  const iconColors = {
    warning: "text-severity-warning",
    action: "text-primary",
    info: "text-severity-good",
  };

  return (
    <div className="space-y-2">
      <h3 className="font-display font-bold text-sm flex items-center gap-1.5">
        <AlertTriangle className="w-4 h-4 text-severity-warning" />
        {lang === "ki" ? "🌦 Icyo wakora uyu munsi" : "🌦 Today's Actions"}
      </h3>
      {alerts.map((alert, i) => {
        const Icon = alert.icon;
        return (
          <div key={i} className={`rounded-xl border p-3 ${typeColors[alert.type]}`}>
            <div className="flex items-start gap-2.5">
              <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${iconColors[alert.type]}`} />
              <div className="flex-1 min-w-0">
                <p className="font-display font-bold text-xs">{lang === "ki" ? alert.title_ki : alert.title_en}</p>
                <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed font-body">
                  {lang === "ki" ? alert.action_ki : alert.action_en}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
