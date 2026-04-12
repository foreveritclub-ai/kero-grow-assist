import { useState, useEffect } from "react";
import { ArrowLeft, ChevronRight, Download, Globe, LogOut, Settings, Shield, User, Save, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { MobileLayout } from "@/components/MobileLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

export default function ProfilePage() {
  const navigate = useNavigate();
  const { t, lang, setLang } = useLanguage();
  const { user, signOut } = useAuth();
  const { toast } = useToast();

  const [editing, setEditing] = useState(false);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("full_name, phone, location")
      .eq("user_id", user.id)
      .single()
      .then(({ data }) => {
        if (data) {
          setFullName(data.full_name || "");
          setPhone(data.phone || "");
          setLocation(data.location || "");
        }
      });
  }, [user]);

  const handleSaveProfile = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({ full_name: fullName, phone, location })
      .eq("user_id", user.id);
    setSaving(false);
    if (error) {
      toast({ title: lang === "ki" ? "Ikosa" : "Error", description: error.message, variant: "destructive" });
    } else {
      setEditing(false);
      toast({ title: lang === "ki" ? "Byabitswe!" : "Profile saved!" });
    }
  };

  const handleLogOut = async () => {
    await signOut();
    navigate("/auth");
  };

  const userName = fullName || user?.user_metadata?.full_name || (lang === "ki" ? "Umuhinzi" : "Farmer");

  return (
    <MobileLayout>
      <div className="bg-primary px-5 pt-4 pb-8 rounded-b-3xl">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate("/")} className="text-primary-foreground">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-display font-bold text-primary-foreground">{t("profile.title")}</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-primary-foreground/20 flex items-center justify-center">
            <User className="w-8 h-8 text-primary-foreground" />
          </div>
          <div>
            <p className="text-primary-foreground font-display font-bold text-base">{userName}</p>
            <p className="text-primary-foreground/70 text-sm font-body">{user?.email || ""}</p>
          </div>
        </div>
      </div>

      <div className="px-5 mt-5 space-y-4 mb-4">
        {editing ? (
          <div className="bg-card rounded-xl border border-border p-4 space-y-3">
            <h3 className="font-display font-bold text-sm">{lang === "ki" ? "Hindura umwirondoro" : "Edit Profile"}</h3>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder={lang === "ki" ? "Amazina yawe" : "Full name"}
              className="w-full h-12 rounded-lg border border-input bg-card px-4 text-sm font-body placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={lang === "ki" ? "Telefoni (urugero: 078...)" : "Phone (e.g. 078...)"}
              className="w-full h-12 rounded-lg border border-input bg-card px-4 text-sm font-body placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder={lang === "ki" ? "Aho ubarizwa" : "Location"}
              className="w-full h-12 rounded-lg border border-input bg-card px-4 text-sm font-body placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <div className="flex gap-2">
              <Button onClick={() => setEditing(false)} variant="outline" className="flex-1 h-10 font-display font-semibold text-sm">
                {lang === "ki" ? "Hagarika" : "Cancel"}
              </Button>
              <Button onClick={handleSaveProfile} disabled={saving} className="flex-1 h-10 bg-accent hover:bg-accent/90 text-accent-foreground font-display font-semibold text-sm">
                {saving ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Save className="w-4 h-4 mr-1" />}
                {lang === "ki" ? "Bika" : "Save"}
              </Button>
            </div>
          </div>
        ) : (
          <div className="bg-card rounded-xl border border-border overflow-hidden divide-y divide-border">
            <button onClick={() => setEditing(true)} className="w-full flex items-center gap-3 px-4 py-3.5 text-left active:bg-muted/50 transition-colors">
              <User className="w-5 h-5 text-primary" />
              <span className="flex-1 font-display text-sm font-semibold">{t("profile.editProfile")}</span>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
            <button onClick={() => setLang(lang === "en" ? "ki" : "en")} className="w-full flex items-center gap-3 px-4 py-3.5 text-left active:bg-muted/50 transition-colors">
              <Globe className="w-5 h-5 text-primary" />
              <span className="flex-1 font-display text-sm font-semibold">{t("profile.language")}</span>
              <span className="text-xs text-muted-foreground mr-1">{lang === "en" ? "English" : "Kinyarwanda"}</span>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3.5 text-left active:bg-muted/50 transition-colors">
              <Shield className="w-5 h-5 text-primary" />
              <span className="flex-1 font-display text-sm font-semibold">{t("profile.privacy")}</span>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
            <button onClick={() => navigate("/settings")} className="w-full flex items-center gap-3 px-4 py-3.5 text-left active:bg-muted/50 transition-colors">
              <Settings className="w-5 h-5 text-primary" />
              <span className="flex-1 font-display text-sm font-semibold">{t("profile.settings")}</span>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        )}

        <button
          onClick={() => navigate("/install")}
          className="w-full flex items-center gap-3 bg-accent rounded-xl px-4 py-3.5 active:scale-95 transition-transform"
        >
          <Download className="w-5 h-5 text-accent-foreground" />
          <span className="font-display text-sm font-semibold text-accent-foreground">
            {lang === "ki" ? "⬇️ Injiza Kero ku telefoni" : "⬇️ Install Kero App"}
          </span>
        </button>

        <button onClick={handleLogOut} className="w-full flex items-center gap-3 bg-destructive/10 rounded-xl px-4 py-3.5 active:bg-destructive/20 transition-colors">
          <LogOut className="w-5 h-5 text-destructive" />
          <span className="font-display text-sm font-semibold text-destructive">{t("profile.logOut")}</span>
        </button>

        <p className="text-center text-xs text-muted-foreground font-body">{t("app.version")}</p>
      </div>
    </MobileLayout>
  );
}
