import { Plus, Sprout, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { MobileLayout } from "@/components/MobileLayout";

export default function FarmTracker() {
  const navigate = useNavigate();

  return (
    <MobileLayout>
      <div className="bg-primary px-5 pt-4 pb-6 rounded-b-3xl">
        <div className="flex items-center gap-3 mb-2">
          <button onClick={() => navigate("/")} className="text-primary-foreground">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-display font-bold text-primary-foreground">
            My Farms
          </h1>
        </div>
        <p className="text-primary-foreground/70 text-sm font-body">
          Track your crops, treatments and growth stages
        </p>
      </div>

      <div className="px-5 mt-5 space-y-4">
        {/* Empty state */}
        <div className="bg-card rounded-xl border border-border p-8 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Sprout className="w-8 h-8 text-primary" />
          </div>
          <h3 className="font-display font-bold text-base">No farms yet</h3>
          <p className="text-sm text-muted-foreground mt-1 mb-4">
            Add your first farm to start tracking your crops and treatments
          </p>
          <button className="flex items-center gap-2 bg-accent text-accent-foreground rounded-lg px-5 py-3 font-display font-bold text-sm active:scale-95 transition-transform">
            <Plus className="w-4 h-4" />
            Add Farm
          </button>
        </div>

        {/* Info cards */}
        <div className="bg-card rounded-xl border border-border p-4">
          <h3 className="font-display font-bold text-sm mb-2">📋 What you can track</h3>
          <ul className="space-y-2 text-xs text-muted-foreground font-body">
            <li>• Multiple crops per farm</li>
            <li>• Planting dates & growth stages</li>
            <li>• Treatments & interventions applied</li>
            <li>• AI diagnosis history</li>
            <li>• Predicted harvest dates & yield</li>
          </ul>
        </div>
      </div>
    </MobileLayout>
  );
}
