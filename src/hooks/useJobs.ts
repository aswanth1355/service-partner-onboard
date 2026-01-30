import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export interface Job {
  id: string;
  customer_id: string;
  customer_name: string;
  customer_phone: string | null;
  service_type: string;
  vehicle_type: string | null;
  customer_lat: number;
  customer_lng: number;
  customer_address: string | null;
  assigned_technician_id: string | null;
  status: string;
  estimated_distance: number | null;
  estimated_price: number | null;
  final_price: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  accepted_at: string | null;
  completed_at: string | null;
}

export function useJobs() {
  const { user } = useAuth();
  const [pendingJobs, setPendingJobs] = useState<Job[]>([]);
  const [activeJob, setActiveJob] = useState<Job | null>(null);
  const [jobHistory, setJobHistory] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchJobs = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    
    // Fetch pending jobs (available for acceptance)
    const { data: pending } = await supabase
      .from("jobs")
      .select("*")
      .eq("status", "pending")
      .order("created_at", { ascending: false });

    // Fetch active job (accepted but not completed)
    const { data: active } = await supabase
      .from("jobs")
      .select("*")
      .eq("assigned_technician_id", user.id)
      .in("status", ["accepted", "on_the_way", "arrived", "in_progress"])
      .order("updated_at", { ascending: false })
      .limit(1);

    // Fetch job history (completed jobs)
    const { data: history } = await supabase
      .from("jobs")
      .select("*")
      .eq("assigned_technician_id", user.id)
      .eq("status", "completed")
      .order("completed_at", { ascending: false });

    setPendingJobs((pending as Job[]) || []);
    setActiveJob(active && active.length > 0 ? (active[0] as Job) : null);
    setJobHistory((history as Job[]) || []);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  // Real-time subscription for job updates
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel("jobs-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "jobs",
        },
        (payload) => {
          console.log("Job update received:", payload);
          
          if (payload.eventType === "INSERT") {
            const newJob = payload.new as Job;
            if (newJob.status === "pending") {
              setPendingJobs((prev) => [newJob, ...prev]);
              toast.info("New job request!", {
                description: `${newJob.service_type} - ${newJob.customer_name}`,
                duration: 10000,
              });
            }
          } else if (payload.eventType === "UPDATE") {
            const updatedJob = payload.new as Job;
            
            // Update pending jobs list
            setPendingJobs((prev) =>
              updatedJob.status === "pending"
                ? prev.map((j) => (j.id === updatedJob.id ? updatedJob : j))
                : prev.filter((j) => j.id !== updatedJob.id)
            );

            // Update active job
            if (updatedJob.assigned_technician_id === user.id) {
              if (["accepted", "on_the_way", "arrived", "in_progress"].includes(updatedJob.status)) {
                setActiveJob(updatedJob);
              } else if (updatedJob.status === "completed") {
                setActiveJob(null);
                setJobHistory((prev) => [updatedJob, ...prev]);
                toast.success("Job completed!", {
                  description: `Earned ₹${updatedJob.final_price || updatedJob.estimated_price}`,
                });
              }
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const acceptJob = async (jobId: string) => {
    if (!user) return { error: new Error("Not authenticated") };

    const { error } = await supabase
      .from("jobs")
      .update({
        assigned_technician_id: user.id,
        status: "accepted",
        accepted_at: new Date().toISOString(),
      })
      .eq("id", jobId)
      .eq("status", "pending");

    if (error) {
      toast.error("Failed to accept job", { description: error.message });
      return { error };
    }

    // Create job update record
    await supabase.from("job_updates").insert({
      job_id: jobId,
      technician_id: user.id,
      update_type: "accepted",
    });

    toast.success("Job accepted!");
    return { error: null };
  };

  const rejectJob = async (jobId: string) => {
    // Simply remove from pending list (job stays pending for other technicians)
    setPendingJobs((prev) => prev.filter((j) => j.id !== jobId));
    toast.info("Job skipped");
    return { error: null };
  };

  const updateJobStatus = async (jobId: string, status: string, location?: { lat: number; lng: number }) => {
    if (!user) return { error: new Error("Not authenticated") };

    const updateData: Record<string, unknown> = { status };
    
    const { error } = await supabase
      .from("jobs")
      .update(updateData)
      .eq("id", jobId)
      .eq("assigned_technician_id", user.id);

    if (error) {
      toast.error("Failed to update status", { description: error.message });
      return { error };
    }

    // Create job update record
    await supabase.from("job_updates").insert({
      job_id: jobId,
      technician_id: user.id,
      update_type: status,
      location_lat: location?.lat,
      location_lng: location?.lng,
    });

    const statusMessages: Record<string, string> = {
      on_the_way: "On the way to customer",
      arrived: "Arrived at location",
      in_progress: "Service started",
      completed: "Job completed!",
    };

    toast.success(statusMessages[status] || "Status updated");
    return { error: null };
  };

  const updateLocation = async (jobId: string, lat: number, lng: number) => {
    if (!user) return;

    await supabase.from("job_updates").insert({
      job_id: jobId,
      technician_id: user.id,
      update_type: "location_update",
      location_lat: lat,
      location_lng: lng,
    });
  };

  return {
    pendingJobs,
    activeJob,
    jobHistory,
    loading,
    acceptJob,
    rejectJob,
    updateJobStatus,
    updateLocation,
    refreshJobs: fetchJobs,
  };
}
