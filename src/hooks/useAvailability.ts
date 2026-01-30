import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface Availability {
  id: string;
  technician_id: string;
  is_active: boolean;
  current_lat: number | null;
  current_lng: number | null;
  last_location_update: string | null;
  last_status_change: string;
}

export function useAvailability() {
  const { user } = useAuth();
  const [availability, setAvailability] = useState<Availability | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAvailability = useCallback(async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("technician_availability")
      .select("*")
      .eq("technician_id", user.id)
      .single();

    if (data && !error) {
      setAvailability(data as Availability);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchAvailability();
  }, [fetchAvailability]);

  const toggleAvailability = async () => {
    if (!user || !availability) return { error: new Error("Not ready") };

    const newStatus = !availability.is_active;

    const { error } = await supabase
      .from("technician_availability")
      .update({
        is_active: newStatus,
        last_status_change: new Date().toISOString(),
      })
      .eq("technician_id", user.id);

    if (error) {
      toast.error("Failed to update status");
      return { error };
    }

    setAvailability((prev) =>
      prev ? { ...prev, is_active: newStatus } : null
    );

    toast.success(newStatus ? "You're now online!" : "You're now offline");
    return { error: null };
  };

  const updateLocation = async (lat: number, lng: number) => {
    if (!user) return;

    const { error } = await supabase
      .from("technician_availability")
      .update({
        current_lat: lat,
        current_lng: lng,
        last_location_update: new Date().toISOString(),
      })
      .eq("technician_id", user.id);

    if (!error) {
      setAvailability((prev) =>
        prev
          ? {
              ...prev,
              current_lat: lat,
              current_lng: lng,
              last_location_update: new Date().toISOString(),
            }
          : null
      );
    }
  };

  return {
    availability,
    loading,
    toggleAvailability,
    updateLocation,
    isOnline: availability?.is_active ?? false,
  };
}
