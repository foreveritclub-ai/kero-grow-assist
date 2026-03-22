import { useState, useEffect } from "react";
import { Plus, Sprout, ArrowLeft, MapPin, Trash2, ChevronRight, Loader2, Calendar, Leaf } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { MobileLayout } from "@/components/MobileLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface Farm {
  id: string;
  name: string;
  location: string | null;
  size_hectares: number | null;
  created_at: string;
}

interface FarmCrop {
  id: string;
  farm_id: string;
  crop_name: string;
  planting_date: string | null;
  growth_stage: string | null;
  notes: string | null;
  diagnosis_id: string | null;
  created_at: string;
}

const GROWTH_STAGES = ["seedling", "vegetative", "flowering", "fruiting", "harvest"];

const CROP_OPTIONS = [
  "Ibigori (Maize)", "Ibishyimbo (Beans)", "Umuceri (Rice)", "Ibirayi (Irish Potatoes)",
  "Ibijumba (Sweet Potatoes)", "Imyumbati (Cassava)", "Ibitoki (Banana)", "Amasaka (Sorghum)",
  "Ingano (Wheat)", "Soya (Soybean)", "Ubunyobwa (Groundnuts)", "Amashaza (Peas)",
  "Inyanya (Tomatoes)", "Ibinyabuntu (Onions)", "Amashu (Cabbage)", "Karoti (Carrots)",
  "Intoryi (Eggplant)", "Urusenda (Peppers)", "Imbwija (Amaranth)", "Tungurusumu (Garlic)",
  "Avoka (Avocado)", "Imyembe (Mango)", "Marakuja (Passion fruit)", "Inanasi (Pineapple)",
  "Ikinyomoro (Tree tomato)", "Ikawa (Coffee)", "Icyayi (Tea)", "Igisheke (Sugarcane)",
  "Pyrethrum", "Sunflower", "Ibihumyo (Mushrooms)", "Imbuto z'izuba (Sunflower seeds)",
  "Roses", "Lilies", "Chrysanthemums", "Carnations",
  "Eucalyptus", "Grevillea", "Pine", "Bamboo",
  "Strawberries", "Macadamia", "Moringa", "Stevia",
];

export default function FarmTracker() {
  const navigate = useNavigate();
  const { t, lang } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();

  const [farms, setFarms] = useState<Farm[]>([]);
  const [selectedFarm, setSelectedFarm] = useState<Farm | null>(null);
  const [crops, setCrops] = useState<FarmCrop[]>([]);
  const [loading, setLoading] = useState(true);

  // Add farm form
  const [showAddFarm, setShowAddFarm] = useState(false);
  const [farmName, setFarmName] = useState("");
  const [farmLocation, setFarmLocation] = useState("");
  const [farmSize, setFarmSize] = useState("");
  const [saving, setSaving] = useState(false);

  // Add crop form
  const [showAddCrop, setShowAddCrop] = useState(false);
  const [cropName, setCropName] = useState("");
  const [plantingDate, setPlantingDate] = useState("");
  const [cropNotes, setCropNotes] = useState("");

  useEffect(() => {
    if (!user) return;
    loadFarms();
  }, [user]);

  const loadFarms = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("farms")
      .select("*")
      .order("created_at", { ascending: false });
    setFarms((data as Farm[]) || []);
    setLoading(false);
  };

  const loadCrops = async (farmId: string) => {
    const { data } = await supabase
      .from("farm_crops")
      .select("*")
      .eq("farm_id", farmId)
      .order("created_at", { ascending: false });
    setCrops((data as FarmCrop[]) || []);
  };

  const handleAddFarm = async () => {
    if (!user || !farmName.trim()) return;
    setSaving(true);
    const { error } = await supabase.from("farms").insert({
      user_id: user.id,
      name: farmName.trim(),
      location: farmLocation.trim() || null,
      size_hectares: farmSize ? parseFloat(farmSize) : null,
    });
    setSaving(false);
    if (error) {
      toast({ title: lang === "ki" ? "Ikosa" : "Error", description: error.message, variant: "destructive" });
      return;
    }
    setFarmName(""); setFarmLocation(""); setFarmSize(""); setShowAddFarm(false);
    loadFarms();
    toast({ title: lang === "ki" ? "Ishamba ryongewemo!" : "Farm added!" });
  };

  const handleDeleteFarm = async (id: string) => {
    await supabase.from("farms").delete().eq("id", id);
    setFarms((prev) => prev.filter((f) => f.id !== id));
    if (selectedFarm?.id === id) { setSelectedFarm(null); setCrops([]); }
  };

  const handleSelectFarm = (farm: Farm) => {
    setSelectedFarm(farm);
    loadCrops(farm.id);
  };

  const handleAddCrop = async () => {
    if (!user || !selectedFarm || !cropName.trim()) return;
    setSaving(true);
    const { error } = await supabase.from("farm_crops").insert({
      user_id: user.id,
      farm_id: selectedFarm.id,
      crop_name: cropName.trim(),
      planting_date: plantingDate || null,
      notes: cropNotes.trim() || null,
    });
    setSaving(false);
    if (error) {
      toast({ title: lang === "ki" ? "Ikosa" : "Error", description: error.message, variant: "destructive" });
      return;
    }
    setCropName(""); setPlantingDate(""); setCropNotes(""); setShowAddCrop(false);
    loadCrops(selectedFarm.id);
    toast({ title: lang === "ki" ? "Igihingwa cyongewemo!" : "Crop added!" });
  };

  const handleDeleteCrop = async (id: string) => {
    await supabase.from("farm_crops").delete().eq("id", id);
    setCrops((prev) => prev.filter((c) => c.id !== id));
  };

  const handleDiagnoseCrop = (crop: FarmCrop) => {
    navigate(`/scan?mode=text&crop=${encodeURIComponent(crop.crop_name)}`);
  };

  // Farm detail view
  if (selectedFarm) {
    return (
      <MobileLayout>
        <div className="bg-primary px-5 pt-4 pb-6 rounded-b-3xl">
          <div className="flex items-center gap-3 mb-2">
            <button onClick={() => { setSelectedFarm(null); setCrops([]); }} className="text-primary-foreground">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-display font-bold text-primary-foreground">{selectedFarm.name}</h1>
          </div>
          {selectedFarm.location && (
            <p className="text-primary-foreground/70 text-sm font-body flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" /> {selectedFarm.location}
            </p>
          )}
        </div>

        <div className="px-5 mt-5 space-y-3 mb-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-bold text-base">{lang === "ki" ? "Ibihingwa" : "Crops"}</h2>
            <button onClick={() => setShowAddCrop(true)} className="flex items-center gap-1 text-sm font-display font-semibold text-primary">
              <Plus className="w-4 h-4" /> {lang === "ki" ? "Ongeraho" : "Add"}
            </button>
          </div>

          {showAddCrop && (
            <div className="bg-card rounded-xl border border-border p-4 space-y-3">
              <select
                value={cropName}
                onChange={(e) => setCropName(e.target.value)}
                className="w-full h-12 rounded-lg border border-input bg-card px-4 text-sm font-body focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">{lang === "ki" ? "Hitamo igihingwa..." : "Select crop..."}</option>
                {CROP_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <input
                type="date"
                value={plantingDate}
                onChange={(e) => setPlantingDate(e.target.value)}
                className="w-full h-12 rounded-lg border border-input bg-card px-4 text-sm font-body focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder={lang === "ki" ? "Itariki yo gutera" : "Planting date"}
              />
              <textarea
                rows={2}
                value={cropNotes}
                onChange={(e) => setCropNotes(e.target.value)}
                placeholder={lang === "ki" ? "Amakuru yinyongera..." : "Additional notes..."}
                className="w-full rounded-lg border border-input bg-card px-4 py-3 text-sm font-body placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              />
              <div className="flex gap-2">
                <Button onClick={() => setShowAddCrop(false)} variant="outline" className="flex-1 h-10 font-display font-semibold text-sm">
                  {lang === "ki" ? "Hagarika" : "Cancel"}
                </Button>
                <Button onClick={handleAddCrop} disabled={!cropName || saving} className="flex-1 h-10 bg-accent hover:bg-accent/90 text-accent-foreground font-display font-semibold text-sm">
                  {saving && <Loader2 className="w-4 h-4 mr-1 animate-spin" />}
                  {lang === "ki" ? "Ongeraho" : "Add Crop"}
                </Button>
              </div>
            </div>
          )}

          {crops.length === 0 && !showAddCrop ? (
            <div className="bg-card rounded-xl border border-border p-6 text-center">
              <Leaf className="w-10 h-10 text-muted-foreground/30 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">{lang === "ki" ? "Nta bihingwa kuri iri shamba" : "No crops on this farm yet"}</p>
            </div>
          ) : (
            crops.map((crop) => (
              <div key={crop.id} className="bg-card rounded-xl border border-border p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-display font-bold text-sm">{crop.crop_name}</p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                      {crop.planting_date && (
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {crop.planting_date}</span>
                      )}
                      <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary font-semibold capitalize">
                        {crop.growth_stage}
                      </span>
                    </div>
                    {crop.notes && <p className="text-xs text-muted-foreground mt-1">{crop.notes}</p>}
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => handleDiagnoseCrop(crop)} className="p-2 text-accent hover:bg-accent/10 rounded-lg" title={lang === "ki" ? "Suzuma" : "Diagnose"}>
                      <Sprout className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDeleteCrop(crop.id)} className="p-2 text-muted-foreground/50 hover:text-destructive rounded-lg">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </MobileLayout>
    );
  }

  // Farm list view
  return (
    <MobileLayout>
      <div className="bg-primary px-5 pt-4 pb-6 rounded-b-3xl">
        <div className="flex items-center gap-3 mb-2">
          <button onClick={() => navigate("/")} className="text-primary-foreground">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-display font-bold text-primary-foreground">{t("farm.title")}</h1>
        </div>
        <p className="text-primary-foreground/70 text-sm font-body">{t("farm.subtitle")}</p>
      </div>

      <div className="px-5 mt-5 space-y-3 mb-4">
        {showAddFarm && (
          <div className="bg-card rounded-xl border border-border p-4 space-y-3">
            <input
              type="text"
              value={farmName}
              onChange={(e) => setFarmName(e.target.value)}
              placeholder={lang === "ki" ? "Izina ry'ishamba" : "Farm name"}
              className="w-full h-12 rounded-lg border border-input bg-card px-4 text-sm font-body placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <input
              type="text"
              value={farmLocation}
              onChange={(e) => setFarmLocation(e.target.value)}
              placeholder={lang === "ki" ? "Aho riherereye (urugero: Musanze)" : "Location (e.g. Musanze)"}
              className="w-full h-12 rounded-lg border border-input bg-card px-4 text-sm font-body placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <input
              type="number"
              value={farmSize}
              onChange={(e) => setFarmSize(e.target.value)}
              placeholder={lang === "ki" ? "Ingano (hegitare)" : "Size (hectares)"}
              className="w-full h-12 rounded-lg border border-input bg-card px-4 text-sm font-body placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              step="0.1" min="0"
            />
            <div className="flex gap-2">
              <Button onClick={() => setShowAddFarm(false)} variant="outline" className="flex-1 h-10 font-display font-semibold text-sm">
                {lang === "ki" ? "Hagarika" : "Cancel"}
              </Button>
              <Button onClick={handleAddFarm} disabled={!farmName.trim() || saving} className="flex-1 h-10 bg-accent hover:bg-accent/90 text-accent-foreground font-display font-semibold text-sm">
                {saving && <Loader2 className="w-4 h-4 mr-1 animate-spin" />}
                {lang === "ki" ? "Bika" : "Save"}
              </Button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
        ) : farms.length === 0 && !showAddFarm ? (
          <div className="bg-card rounded-xl border border-border p-8 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Sprout className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-display font-bold text-base">{t("farm.noFarms")}</h3>
            <p className="text-sm text-muted-foreground mt-1 mb-4">{t("farm.noFarmsDesc")}</p>
            <button
              onClick={() => setShowAddFarm(true)}
              className="flex items-center gap-2 bg-accent text-accent-foreground rounded-lg px-5 py-3 font-display font-bold text-sm active:scale-95 transition-transform"
            >
              <Plus className="w-4 h-4" /> {t("farm.addFarm")}
            </button>
          </div>
        ) : (
          <>
            {!showAddFarm && (
              <button
                onClick={() => setShowAddFarm(true)}
                className="w-full flex items-center justify-center gap-2 bg-accent text-accent-foreground rounded-xl py-3 font-display font-bold text-sm active:scale-95 transition-transform"
              >
                <Plus className="w-4 h-4" /> {t("farm.addFarm")}
              </button>
            )}
            {farms.map((farm) => (
              <button
                key={farm.id}
                onClick={() => handleSelectFarm(farm)}
                className="w-full bg-card rounded-xl border border-border p-4 flex items-center gap-3 text-left active:scale-[0.98] transition-transform"
              >
                <div className="w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Sprout className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-display font-bold text-sm">{farm.name}</p>
                  {farm.location && (
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3" /> {farm.location}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDeleteFarm(farm.id); }}
                    className="p-1.5 text-muted-foreground/50 hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </div>
              </button>
            ))}
          </>
        )}

        <div className="bg-card rounded-xl border border-border p-4">
          <h3 className="font-display font-bold text-sm mb-2">{t("farm.whatToTrack")}</h3>
          <ul className="space-y-2 text-xs text-muted-foreground font-body">
            <li>• {t("farm.trackItem1")}</li>
            <li>• {t("farm.trackItem2")}</li>
            <li>• {t("farm.trackItem3")}</li>
            <li>• {t("farm.trackItem4")}</li>
            <li>• {t("farm.trackItem5")}</li>
          </ul>
        </div>
      </div>
    </MobileLayout>
  );
}
