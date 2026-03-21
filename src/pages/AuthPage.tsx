import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { Sprout, Loader2, Eye, EyeOff } from "lucide-react";

export default function AuthPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t, lang, setLang } = useLanguage();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate("/");
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName },
            emailRedirectTo: window.location.origin,
          },
        });
        if (error) throw error;
        toast({
          title: lang === "ki" ? "Kwiyandikisha byagenze neza!" : "Sign up successful!",
          description: lang === "ki" ? "Reba imeri yawe kugira ngo wemeze konti yawe." : "Check your email to confirm your account.",
        });
      }
    } catch (err: any) {
      toast({
        title: lang === "ki" ? "Ikosa" : "Error",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-4">
            <Sprout className="w-9 h-9 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-display font-bold text-foreground">Kero Iwawe Assist</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {lang === "ki" ? "Umufasha w'ubuhinzi wa AI" : "AI Agriculture Assistant"}
          </p>
        </div>

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-2.5 rounded-lg font-display text-sm font-semibold transition-colors ${
              isLogin ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            }`}
          >
            {lang === "ki" ? "Injira" : "Log In"}
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-2.5 rounded-lg font-display text-sm font-semibold transition-colors ${
              !isLogin ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            }`}
          >
            {lang === "ki" ? "Iyandikishe" : "Sign Up"}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="font-display font-semibold text-sm mb-1.5 block">
                {lang === "ki" ? "Amazina yawe" : "Full Name"}
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder={lang === "ki" ? "urugero: Uwimana Jean" : "e.g. Jean Uwimana"}
                className="w-full h-12 rounded-lg border border-input bg-card px-4 text-sm font-body placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                required
              />
            </div>
          )}
          <div>
            <label className="font-display font-semibold text-sm mb-1.5 block">
              {lang === "ki" ? "Imeri" : "Email"}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="farmer@example.com"
              className="w-full h-12 rounded-lg border border-input bg-card px-4 text-sm font-body placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              required
            />
          </div>
          <div>
            <label className="font-display font-semibold text-sm mb-1.5 block">
              {lang === "ki" ? "Ijambo ry'ibanga" : "Password"}
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-12 rounded-lg border border-input bg-card px-4 pr-12 text-sm font-body placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                required
                minLength={6}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
          <Button type="submit" className="w-full h-12 bg-accent hover:bg-accent/90 text-accent-foreground font-display font-bold text-base" disabled={loading}>
            {loading && <Loader2 className="w-5 h-5 mr-2 animate-spin" />}
            {isLogin
              ? (lang === "ki" ? "Injira" : "Log In")
              : (lang === "ki" ? "Iyandikishe" : "Sign Up")}
          </Button>
        </form>

        <button
          onClick={() => setLang(lang === "en" ? "ki" : "en")}
          className="mt-6 mx-auto block text-sm text-primary font-display font-semibold"
        >
          {lang === "en" ? "🇷🇼 Hindura ururimi → Kinyarwanda" : "🇬🇧 Switch language → English"}
        </button>
      </div>
    </div>
  );
}
