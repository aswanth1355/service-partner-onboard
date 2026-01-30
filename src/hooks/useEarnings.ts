import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface Earning {
  id: string;
  technician_id: string;
  job_id: string | null;
  amount: number;
  description: string | null;
  earned_at: string;
}

interface EarningsSummary {
  totalEarnings: number;
  todayEarnings: number;
  weeklyEarnings: number;
  totalJobs: number;
  todayJobs: number;
}

export function useEarnings() {
  const { user } = useAuth();
  const [earnings, setEarnings] = useState<Earning[]>([]);
  const [summary, setSummary] = useState<EarningsSummary>({
    totalEarnings: 0,
    todayEarnings: 0,
    weeklyEarnings: 0,
    totalJobs: 0,
    todayJobs: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchEarnings = useCallback(async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("technician_earnings")
      .select("*")
      .eq("technician_id", user.id)
      .order("earned_at", { ascending: false });

    if (data && !error) {
      const earningsData = data as Earning[];
      setEarnings(earningsData);

      // Calculate summary
      const now = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const weekStart = new Date(todayStart);
      weekStart.setDate(weekStart.getDate() - 7);

      const todayEarnings = earningsData
        .filter((e) => new Date(e.earned_at) >= todayStart)
        .reduce((sum, e) => sum + Number(e.amount), 0);

      const weeklyEarnings = earningsData
        .filter((e) => new Date(e.earned_at) >= weekStart)
        .reduce((sum, e) => sum + Number(e.amount), 0);

      const totalEarnings = earningsData.reduce((sum, e) => sum + Number(e.amount), 0);

      const todayJobs = earningsData.filter(
        (e) => new Date(e.earned_at) >= todayStart
      ).length;

      setSummary({
        totalEarnings,
        todayEarnings,
        weeklyEarnings,
        totalJobs: earningsData.length,
        todayJobs,
      });
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchEarnings();
  }, [fetchEarnings]);

  return {
    earnings,
    summary,
    loading,
    refreshEarnings: fetchEarnings,
  };
}
