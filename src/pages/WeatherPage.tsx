import { useState, useEffect } from "react";
import { MobileLayout } from "@/components/MobileLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Cloud, Droplets, Wind, Thermometer, Sun, CloudRain, AlertTriangle, MapPin, Search } from "lucide-react";
import { toast } from "sonner";

interface WeatherData {
  current: {
    temp: number;
    humidity: number;
    wind_speed: number;
    weather: { main: string; description: string; icon: string }[];
    feels_like: number;
  };
  daily: {
    dt: number;
    temp: { min: number; max: number };
    humidity: number;
    weather: { main: string; description: string; icon: string }[];
    pop: number;
  }[];
}

const WEATHER_ICONS: Record<string, React.ElementType> = {
  Clear: Sun,
  Clouds: Cloud,
  Rain: CloudRain,
  Drizzle: CloudRain,
  Thunderstorm: CloudRain,
};

const cropAlerts = (daily: WeatherData["daily"], lang: string) => {
  const alerts: string[] = [];
  const highRain = daily.filter(d => d.pop > 0.7);
  const hotDays = daily.filter(d => d.temp.max > 32);
  const coldDays = daily.filter(d => d.temp.min < 10);

  if (highRain.length >= 3) {
    alerts.push(lang === "ki"
      ? "⚠️ Imvura nyinshi zitegerejwe. Reba ko amazi atemba neza mu murima."
      : "⚠️ Heavy rain expected. Check drainage in your fields.");
  }
  if (hotDays.length > 0) {
    alerts.push(lang === "ki"
      ? "🌡️ Ubushyuhe bukabije bwitezwe. Uhire ibihingwa mu gitondo cyangwa nimugoroba."
      : "🌡️ Extreme heat expected. Water crops early morning or evening.");
  }
  if (coldDays.length > 0) {
    alerts.push(lang === "ki"
      ? "❄️ Ubukonje bukabije bwitezwe. Kurinda ibihingwa byoroshye."
      : "❄️ Cold temperatures expected. Protect tender crops.");
  }
  if (daily.some(d => d.humidity > 85 && d.temp.max > 25)) {
    alerts.push(lang === "ki"
      ? "🍄 Ikirere gifite umwuka mwinshi gishobora gutera indwara z'ibihumyo. Reba amababi yawe."
      : "🍄 Humid conditions may promote fungal diseases. Check your leaves.");
  }
  return alerts;
};

const dayName = (dt: number, lang: string) => {
  const d = new Date(dt * 1000);
  return d.toLocaleDateString(lang === "ki" ? "rw-RW" : "en-US", { weekday: "short" });
};

export default function WeatherPage() {
  const { t, lang } = useLanguage();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [city, setCity] = useState("Kigali");
  const [searchCity, setSearchCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [locationName, setLocationName] = useState("Kigali, Rwanda");

  const fetchWeather = async (lat: number, lon: number) => {
    setLoading(true);
    try {
      // Use Open-Meteo (free, no API key needed)
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code,apparent_temperature&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,relative_humidity_2m_max,weather_code&timezone=Africa/Kigali&forecast_days=7`
      );
      const data = await res.json();
      
      // Map to our format
      const weatherCodeToMain = (code: number): string => {
        if (code <= 1) return "Clear";
        if (code <= 3) return "Clouds";
        if (code <= 49) return "Clouds";
        if (code <= 69) return "Rain";
        if (code <= 79) return "Rain";
        if (code <= 99) return "Thunderstorm";
        return "Clouds";
      };

      const mapped: WeatherData = {
        current: {
          temp: Math.round(data.current.temperature_2m),
          humidity: data.current.relative_humidity_2m,
          wind_speed: Math.round(data.current.wind_speed_10m),
          feels_like: Math.round(data.current.apparent_temperature),
          weather: [{ main: weatherCodeToMain(data.current.weather_code), description: "", icon: "" }],
        },
        daily: data.daily.time.map((time: string, i: number) => ({
          dt: new Date(time).getTime() / 1000,
          temp: { min: Math.round(data.daily.temperature_2m_min[i]), max: Math.round(data.daily.temperature_2m_max[i]) },
          humidity: data.daily.relative_humidity_2m_max[i],
          weather: [{ main: weatherCodeToMain(data.daily.weather_code[i]), description: "", icon: "" }],
          pop: (data.daily.precipitation_probability_max[i] || 0) / 100,
        })),
      };
      setWeather(mapped);
    } catch {
      toast.error(lang === "ki" ? "Ntibishoboye kubona ikirere" : "Could not fetch weather");
    }
    setLoading(false);
  };

  const geocodeCity = async (name: string) => {
    try {
      const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(name)}&count=1&language=en`);
      const data = await res.json();
      if (data.results?.length) {
        const r = data.results[0];
        setLocationName(`${r.name}, ${r.country || "Rwanda"}`);
        fetchWeather(r.latitude, r.longitude);
      } else {
        toast.error(lang === "ki" ? "Aho ntahaboneka" : "Location not found");
      }
    } catch {
      toast.error(lang === "ki" ? "Habaye ikosa" : "Error searching");
    }
  };

  useEffect(() => {
    // Try geolocation first, fallback to Kigali
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocationName(lang === "ki" ? "Aho uri" : "Your Location");
          fetchWeather(pos.coords.latitude, pos.coords.longitude);
        },
        () => fetchWeather(-1.9403, 29.8739) // Kigali fallback
      );
    } else {
      fetchWeather(-1.9403, 29.8739);
    }
  }, []);

  const handleSearch = () => {
    if (searchCity.trim()) {
      geocodeCity(searchCity.trim());
      setSearchCity("");
    }
  };

  const alerts = weather ? cropAlerts(weather.daily, lang) : [];

  return (
    <MobileLayout>
      <div className="px-5 pt-6 pb-4">
        <h1 className="font-display font-bold text-xl text-foreground mb-1">{t("weather.title")}</h1>
        <p className="text-sm text-muted-foreground mb-4">{t("weather.subtitle")}</p>

        {/* Search */}
        <div className="flex gap-2 mb-4">
          <Input
            placeholder={lang === "ki" ? "Shakisha ahantu..." : "Search location..."}
            value={searchCity}
            onChange={e => setSearchCity(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSearch()}
            className="flex-1"
          />
          <Button size="icon" onClick={handleSearch}>
            <Search className="w-4 h-4" />
          </Button>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        )}

        {weather && !loading && (
          <>
            {/* Current Weather */}
            <Card className="mb-4 bg-primary text-primary-foreground border-0">
              <CardContent className="p-5">
                <div className="flex items-center gap-1 text-primary-foreground/70 text-sm mb-3">
                  <MapPin className="w-4 h-4" />
                  {locationName}
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-5xl font-display font-bold">{weather.current.temp}°C</p>
                    <p className="text-primary-foreground/80 text-sm mt-1">
                      {lang === "ki" ? "Byumvikana nka" : "Feels like"} {weather.current.feels_like}°C
                    </p>
                  </div>
                  {(() => {
                    const Icon = WEATHER_ICONS[weather.current.weather[0]?.main] || Cloud;
                    return <Icon className="w-16 h-16 text-primary-foreground/60" />;
                  })()}
                </div>
                <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-primary-foreground/20">
                  <div className="flex items-center gap-1.5">
                    <Droplets className="w-4 h-4 text-primary-foreground/60" />
                    <div>
                      <p className="text-xs text-primary-foreground/60">{lang === "ki" ? "Umwuka" : "Humidity"}</p>
                      <p className="text-sm font-bold">{weather.current.humidity}%</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Wind className="w-4 h-4 text-primary-foreground/60" />
                    <div>
                      <p className="text-xs text-primary-foreground/60">{lang === "ki" ? "Umuyaga" : "Wind"}</p>
                      <p className="text-sm font-bold">{weather.current.wind_speed} km/h</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Thermometer className="w-4 h-4 text-primary-foreground/60" />
                    <div>
                      <p className="text-xs text-primary-foreground/60">{lang === "ki" ? "Ubushyuhe" : "Temp"}</p>
                      <p className="text-sm font-bold">{weather.current.temp}°C</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Crop Alerts */}
            {alerts.length > 0 && (
              <Card className="mb-4 border-severity-warning/30 bg-severity-warning/5">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-5 h-5 text-severity-warning" />
                    <h3 className="font-display font-bold text-sm">{t("weather.cropAlerts")}</h3>
                  </div>
                  <div className="space-y-2">
                    {alerts.map((a, i) => (
                      <p key={i} className="text-xs">{a}</p>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* 7-Day Forecast */}
            <h2 className="font-display font-bold text-base mb-3">{t("weather.forecast")}</h2>
            <div className="space-y-2 mb-4">
              {weather.daily.map((d, i) => {
                const Icon = WEATHER_ICONS[d.weather[0]?.main] || Cloud;
                return (
                  <div key={i} className="bg-card border border-border rounded-xl p-3 flex items-center gap-3">
                    <div className="w-10 text-center">
                      <p className="text-xs font-bold text-muted-foreground">{i === 0 ? (lang === "ki" ? "Uyu" : "Today") : dayName(d.dt, lang)}</p>
                    </div>
                    <Icon className="w-6 h-6 text-primary shrink-0" />
                    <div className="flex-1 flex items-center justify-between">
                      <div className="flex gap-2 text-sm">
                        <span className="font-bold">{d.temp.max}°</span>
                        <span className="text-muted-foreground">{d.temp.min}°</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Droplets className="w-3 h-3 text-blue-400" />
                        <span className="text-xs text-muted-foreground">{Math.round(d.pop * 100)}%</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </MobileLayout>
  );
}
