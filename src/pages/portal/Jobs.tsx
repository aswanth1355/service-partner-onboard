import { useJobs } from "@/hooks/useJobs";
import { PortalHeader } from "@/components/portal/PortalHeader";
import { PortalNav } from "@/components/portal/PortalNav";
import { JobRequestCard } from "@/components/portal/JobRequestCard";
import { ActiveJobCard } from "@/components/portal/ActiveJobCard";
import { JobHistory } from "@/components/portal/JobHistory";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Inbox, Loader2 } from "lucide-react";
import { useState } from "react";

export default function Jobs() {
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

      <main className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">Jobs</h1>

        <Tabs defaultValue={activeJob ? "active" : "pending"} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="pending" className="relative">
              Pending
              {pendingJobs.length > 0 && (
                <Badge className="ml-2 h-5 w-5 p-0 flex items-center justify-center">
                  {pendingJobs.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="active">
              Active
              {activeJob && (
                <Badge className="ml-2 h-5 w-5 p-0 flex items-center justify-center bg-success">
                  1
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-4">
            {loading ? (
              <Card>
                <CardContent className="py-12 flex items-center justify-center">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </CardContent>
              </Card>
            ) : pendingJobs.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Inbox className="w-12 h-12 mx-auto text-muted-foreground/30 mb-3" />
                  <p className="text-muted-foreground">No pending job requests</p>
                </CardContent>
              </Card>
            ) : (
              pendingJobs.map((job) => (
                <JobRequestCard
                  key={job.id}
                  job={job}
                  onAccept={handleAcceptJob}
                  onReject={handleRejectJob}
                  isLoading={processingJob === job.id}
                />
              ))
            )}
          </TabsContent>

          <TabsContent value="active">
            {activeJob ? (
              <ActiveJobCard job={activeJob} onUpdateStatus={updateJobStatus} />
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <Inbox className="w-12 h-12 mx-auto text-muted-foreground/30 mb-3" />
                  <p className="text-muted-foreground">No active job</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Accept a pending job to get started
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="history">
            <JobHistory jobs={jobHistory} />
          </TabsContent>
        </Tabs>
      </main>

      <PortalNav />
    </div>
  );
}
