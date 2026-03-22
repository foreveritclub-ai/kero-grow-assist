-- Farms table
CREATE TABLE public.farms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  location text,
  size_hectares numeric,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.farms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own farms" ON public.farms FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own farms" ON public.farms FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own farms" ON public.farms FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own farms" ON public.farms FOR DELETE USING (auth.uid() = user_id);

-- Farm crops table
CREATE TABLE public.farm_crops (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  farm_id uuid NOT NULL REFERENCES public.farms(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  crop_name text NOT NULL,
  planting_date date,
  growth_stage text DEFAULT 'seedling',
  notes text,
  diagnosis_id uuid REFERENCES public.diagnosis_history(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.farm_crops ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own farm crops" ON public.farm_crops FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own farm crops" ON public.farm_crops FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own farm crops" ON public.farm_crops FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own farm crops" ON public.farm_crops FOR DELETE USING (auth.uid() = user_id);

-- Triggers for updated_at
CREATE TRIGGER update_farms_updated_at BEFORE UPDATE ON public.farms
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_farm_crops_updated_at BEFORE UPDATE ON public.farm_crops
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();