-- Create vendors table
CREATE TABLE IF NOT EXISTS public.vendors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  monthly_spend DECIMAL(15, 2) DEFAULT 0,
  risk_level TEXT DEFAULT 'low' CHECK (risk_level IN ('low', 'medium', 'high', 'critical')),
  flagged_transactions INTEGER DEFAULT 0,
  total_transactions INTEGER DEFAULT 0,
  last_transaction_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, name)
);

-- Enable RLS
ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;

-- Policies for vendors
CREATE POLICY "Users can view their own vendors"
  ON public.vendors FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own vendors"
  ON public.vendors FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own vendors"
  ON public.vendors FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own vendors"
  ON public.vendors FOR DELETE
  USING (auth.uid() = user_id);

-- Create index
CREATE INDEX IF NOT EXISTS idx_vendors_user_id ON public.vendors(user_id);
CREATE INDEX IF NOT EXISTS idx_vendors_risk_level ON public.vendors(risk_level);
