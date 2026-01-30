import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Job } from "@/hooks/useJobs";
import { format } from "date-fns";
import { History, IndianRupee, CheckCircle2 } from "lucide-react";

interface JobHistoryProps {
  jobs: Job[];
}

const SERVICE_ICONS: Record<string, string> = {
  mechanical: "🔧",
  battery: "🔋",
  fuel: "⛽",
  lockout: "🔐",
  tire: "🛞",
  ev: "⚡",
  winching: "🪝",
  towing: "🚛",
};

export function JobHistory({ jobs }: JobHistoryProps) {
  if (jobs.length === 0) {
    return (
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="w-5 h-5 text-primary" />
            Job History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <History className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No completed jobs yet</p>
            <p className="text-sm">Your completed jobs will appear here</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="w-5 h-5 text-primary" />
          Job History
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[400px]">
          <div className="space-y-2 p-4 pt-0">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-lg">
                  {SERVICE_ICONS[job.service_type] || "🚗"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium capitalize truncate">
                      {job.service_type.replace(/_/g, " ")}
                    </span>
                    <Badge
                      variant="outline"
                      className="bg-success/10 text-success border-success/30 text-xs"
                    >
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Completed
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {job.customer_name} • {job.vehicle_type || "Vehicle"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-success flex items-center gap-1">
                    <IndianRupee className="w-3 h-3" />
                    {job.final_price || job.estimated_price || 0}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {job.completed_at
                      ? format(new Date(job.completed_at), "MMM d, h:mm a")
                      : ""}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
