-- =====================================================
-- RESQNOW TECHNICIAN PORTAL DATABASE SCHEMA
-- =====================================================

-- 1. Create technician profiles table (linked to auth.users)
CREATE TABLE public.technician_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    vehicle_type TEXT,
    service_types TEXT[] DEFAULT '{}',
    service_area TEXT,
    shop_name TEXT,
    shop_address TEXT,
    gps_lat DECIMAL(10, 8),
    gps_lng DECIMAL(11, 8),
    verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create technician availability table
CREATE TABLE public.technician_availability (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    technician_id UUID NOT NULL REFERENCES public.technician_profiles(id) ON DELETE CASCADE,
    is_active BOOLEAN DEFAULT false,
    current_lat DECIMAL(10, 8),
    current_lng DECIMAL(11, 8),
    last_location_update TIMESTAMPTZ,
    last_status_change TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(technician_id)
);

-- 3. Create jobs table
CREATE TABLE public.jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id TEXT NOT NULL,
    customer_name TEXT NOT NULL,
    customer_phone TEXT,
    service_type TEXT NOT NULL,
    vehicle_type TEXT,
    customer_lat DECIMAL(10, 8) NOT NULL,
    customer_lng DECIMAL(11, 8) NOT NULL,
    customer_address TEXT,
    assigned_technician_id UUID REFERENCES public.technician_profiles(id),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'assigned', 'accepted', 'rejected', 'on_the_way', 'arrived', 'in_progress', 'completed', 'cancelled')),
    estimated_distance DECIMAL(10, 2),
    estimated_price DECIMAL(10, 2),
    final_price DECIMAL(10, 2),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    accepted_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ
);

-- 4. Create job updates/tracking table
CREATE TABLE public.job_updates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
    technician_id UUID NOT NULL REFERENCES public.technician_profiles(id) ON DELETE CASCADE,
    update_type TEXT NOT NULL CHECK (update_type IN ('accepted', 'rejected', 'on_the_way', 'arrived', 'in_progress', 'completed', 'location_update', 'note')),
    location_lat DECIMAL(10, 8),
    location_lng DECIMAL(11, 8),
    note TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Create earnings table
CREATE TABLE public.technician_earnings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    technician_id UUID NOT NULL REFERENCES public.technician_profiles(id) ON DELETE CASCADE,
    job_id UUID REFERENCES public.jobs(id) ON DELETE SET NULL,
    amount DECIMAL(10, 2) NOT NULL,
    description TEXT,
    earned_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Create storage bucket for technician documents
INSERT INTO storage.buckets (id, name, public) 
VALUES ('technician-documents', 'technician-documents', false);

-- =====================================================
-- HELPER FUNCTIONS (Security Definer)
-- =====================================================

-- Check if technician is assigned to a job
CREATE OR REPLACE FUNCTION public.is_technician_assigned_to_job(job_id_param UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.jobs
        WHERE id = job_id_param
        AND assigned_technician_id = auth.uid()
    );
$$;

-- Check if job is pending (for new job notifications)
CREATE OR REPLACE FUNCTION public.is_job_pending_or_assigned_to_me(job_id_param UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.jobs
        WHERE id = job_id_param
        AND (status = 'pending' OR assigned_technician_id = auth.uid())
    );
$$;

-- =====================================================
-- ROW LEVEL SECURITY POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE public.technician_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.technician_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.technician_earnings ENABLE ROW LEVEL SECURITY;

-- Technician Profiles Policies
CREATE POLICY "Technicians can view own profile"
ON public.technician_profiles FOR SELECT
USING (id = auth.uid());

CREATE POLICY "Technicians can update own profile"
ON public.technician_profiles FOR UPDATE
USING (id = auth.uid());

CREATE POLICY "Technicians can insert own profile"
ON public.technician_profiles FOR INSERT
WITH CHECK (id = auth.uid());

-- Technician Availability Policies
CREATE POLICY "Technicians can view own availability"
ON public.technician_availability FOR SELECT
USING (technician_id = auth.uid());

CREATE POLICY "Technicians can update own availability"
ON public.technician_availability FOR UPDATE
USING (technician_id = auth.uid());

CREATE POLICY "Technicians can insert own availability"
ON public.technician_availability FOR INSERT
WITH CHECK (technician_id = auth.uid());

-- Jobs Policies (technicians can see pending jobs and their assigned jobs)
CREATE POLICY "Technicians can view pending or assigned jobs"
ON public.jobs FOR SELECT
USING (status = 'pending' OR assigned_technician_id = auth.uid());

CREATE POLICY "Technicians can update assigned jobs"
ON public.jobs FOR UPDATE
USING (assigned_technician_id = auth.uid());

-- Job Updates Policies
CREATE POLICY "Technicians can view job updates for their jobs"
ON public.job_updates FOR SELECT
USING (public.is_technician_assigned_to_job(job_id));

CREATE POLICY "Technicians can create updates for their jobs"
ON public.job_updates FOR INSERT
WITH CHECK (technician_id = auth.uid() AND public.is_technician_assigned_to_job(job_id));

-- Earnings Policies
CREATE POLICY "Technicians can view own earnings"
ON public.technician_earnings FOR SELECT
USING (technician_id = auth.uid());

-- =====================================================
-- STORAGE POLICIES
-- =====================================================

CREATE POLICY "Technicians can upload own documents"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'technician-documents' 
    AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Technicians can view own documents"
ON storage.objects FOR SELECT
USING (
    bucket_id = 'technician-documents' 
    AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Technicians can delete own documents"
ON storage.objects FOR DELETE
USING (
    bucket_id = 'technician-documents' 
    AND auth.uid()::text = (storage.foldername(name))[1]
);

-- =====================================================
-- TRIGGERS & FUNCTIONS
-- =====================================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER set_technician_profiles_updated_at
BEFORE UPDATE ON public.technician_profiles
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_jobs_updated_at
BEFORE UPDATE ON public.jobs
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Auto-create availability record when profile is created
CREATE OR REPLACE FUNCTION public.handle_new_technician()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.technician_availability (technician_id, is_active)
    VALUES (NEW.id, false);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_technician_profile_created
AFTER INSERT ON public.technician_profiles
FOR EACH ROW EXECUTE FUNCTION public.handle_new_technician();

-- Auto-create earnings record when job is completed
CREATE OR REPLACE FUNCTION public.handle_job_completed()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
        INSERT INTO public.technician_earnings (technician_id, job_id, amount, description)
        VALUES (
            NEW.assigned_technician_id,
            NEW.id,
            COALESCE(NEW.final_price, NEW.estimated_price, 0),
            NEW.service_type || ' - ' || COALESCE(NEW.customer_name, 'Customer')
        );
        NEW.completed_at = NOW();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_job_completed
BEFORE UPDATE ON public.jobs
FOR EACH ROW EXECUTE FUNCTION public.handle_job_completed();

-- =====================================================
-- ENABLE REALTIME
-- =====================================================

ALTER PUBLICATION supabase_realtime ADD TABLE public.jobs;
ALTER PUBLICATION supabase_realtime ADD TABLE public.technician_availability;