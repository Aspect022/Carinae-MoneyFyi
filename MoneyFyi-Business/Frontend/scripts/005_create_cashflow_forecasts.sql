-- Create cashflow forecasts table
CREATE TABLE IF NOT EXISTS public.cashflow_forecasts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  projected_balance DECIMAL(15, 2) NOT NULL,
  confidence_percentage INTEGER DEFAULT 85 CHECK (confidence_percentage >= 0 AND confidence_percentage <= 100),
  is_shortage BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- Enable RLS
ALTER TABLE public.cashflow_forecasts ENABLE ROW LEVEL SECURITY;

-- Policies for cashflow forecasts
CREATE POLICY "Users can view their own forecasts"
  ON public.cashflow_forecasts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own forecasts"
  ON public.cashflow_forecasts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own forecasts"
  ON public.cashflow_forecasts FOR UPDATE
  USING (auth.uid() = user_id);

-- Create index
CREATE INDEX IF NOT EXISTS idx_cashflow_user_date ON public.cashflow_forecasts(user_id, date);
