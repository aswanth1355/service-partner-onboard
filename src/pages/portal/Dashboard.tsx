import { useAuth } from "@/contexts/AuthContext";
import { useJobs } from "@/hooks/useJobs";
import { PortalHeader } from "@/components/portal/PortalHeader";
import { PortalNav } from "@/components/portal/PortalNav";
import { EarningsCard } from "@/components/portal/EarningsCard";
import { JobRequestCard } from "@/components/portal/JobRequestCard";
import { ActiveJobCard } from "@/components/portal/ActiveJobCard";
import { JobHistory } from "@/components/portal/JobHistory";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Bell, Inbox } from "lucide-react";
import { useState } from "react";

export default function Dashboard() {
  const { profile } = useAuth();
  const { pendingJobs, activeJob, jobHistory, loading, acceptJob, rejectJob, updateJobStatus } = useJobs();
  const [processingJob, setProcessingJob] = useState<string | null>(null);

  const handleAcceptJob = async (jobId: string) => {
    setProcessingJob(jobId);
    await acceptJob(jobId);
    setProcessingJob(null);
  };

  const handleRejectJob = async (jobId: string) => {
    setProcessingJob(jobId);
    await rejectJob(jobId);
    setProcessingJob(null);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <PortalHeader pendingJobsCount={pendingJobs.length} />

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Welcome Section */}
        <div>
          <h1 className="text-2xl font-bold">
            Welcome back, {profile?.full_name?.split(" ")[0] || "Technician"}! 👋
          </h1>
          <p className="text-muted-foreground">
            {activeJob
              ? "You have an active job in progress"
              : pendingJobs.length > 0
              ? `${pendingJobs.length} new job request${pendingJobs.length > 1 ? "s" : ""} waiting`
              : "No pending jobs right now"}
          </p>
        </div>

        {/* Active Job - Always show at top if exists */}
        {activeJob && (
          <ActiveJobCard job={activeJob} onUpdateStatus={updateJobStatus} />
        )}

        {/* Pending Job Requests */}
        {!activeJob && pendingJobs.length > 0 && (
          <Card className="shadow-card">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-primary animate-pulse" />
                  New Job Requests
                </CardTitle>
                <Badge variant="secondary">{pendingJobs.length}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {pendingJobs.slice(0, 3).map((job) => (
                <JobRequestCard
                  key={job.id}
                  job={job}
                  onAccept={handleAcceptJob}
                  onReject={handleRejectJob}
                  isLoading={processingJob === job.id}
                />
              ))}
              {pendingJobs.length > 3 && (
                <p className="text-center text-sm text-muted-foreground">
                  +{pendingJobs.length - 3} more requests
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {/* No Jobs State */}
        {!activeJob && pendingJobs.length === 0 && !loading && (
          <Card className="shadow-card">
            <CardContent className="py-12 text-center">
              <Inbox className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
              <h3 className="text-lg font-medium mb-2">No jobs right now</h3>
              <p className="text-muted-foreground text-sm max-w-sm mx-auto">
                Make sure you're online to receive new job requests from customers in your area.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Loading State */}
        {loading && (
          <div className="space-y-4">
            <Skeleton className="h-48 rounded-xl" />
            <Skeleton className="h-32 rounded-xl" />
          </div>
        )}

        {/* Earnings Overview */}
        <EarningsCard />

        {/* Recent Job History */}
        <JobHistory jobs={jobHistory.slice(0, 10)} />
      </main>

      <PortalNav />
    </div>
  );
}
