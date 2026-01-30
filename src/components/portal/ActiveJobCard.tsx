import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Job } from "@/hooks/useJobs";
import {
  MapPin,
  User,
  Phone,
  Navigation,
  IndianRupee,
  Clock,
  CheckCircle2,
  Loader2,
  ExternalLink,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface ActiveJobCardProps {
  job: Job;
  onUpdateStatus: (jobId: string, status: string) => Promise<{ error: Error | null }>;
}

const STATUS_STEPS = [
  { status: "accepted", label: "Accepted", next: "on_the_way" },
  { status: "on_the_way", label: "On the Way", next: "arrived" },
  { status: "arrived", label: "Arrived", next: "in_progress" },
  { status: "in_progress", label: "In Progress", next: "completed" },
  { status: "completed", label: "Completed", next: null },
];

const STATUS_COLORS: Record<string, string> = {
  accepted: "bg-blue-500",
  on_the_way: "bg-orange-500",
  arrived: "bg-purple-500",
  in_progress: "bg-primary",
  completed: "bg-success",
};

export function ActiveJobCard({ job, onUpdateStatus }: ActiveJobCardProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  const currentStepIndex = STATUS_STEPS.findIndex((s) => s.status === job.status);
  const nextStep = STATUS_STEPS[currentStepIndex]?.next;

  const handleNextStep = async () => {
    if (!nextStep) return;
    setIsUpdating(true);
    await onUpdateStatus(job.id, nextStep);
    setIsUpdating(false);
  };

  const openGoogleMaps = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${job.customer_lat},${job.customer_lng}`;
    window.open(url, "_blank");
  };

  const callCustomer = () => {
    if (job.customer_phone) {
      window.location.href = `tel:${job.customer_phone}`;
    }
  };

  const getNextButtonLabel = () => {
    switch (nextStep) {
      case "on_the_way":
        return "Start Navigation";
      case "arrived":
        return "Mark Arrived";
      case "in_progress":
        return "Start Service";
      case "completed":
        return "Complete Job";
      default:
        return "Next";
    }
  };

  return (
    <Card className="shadow-card border-2 border-primary/30">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Active Job</CardTitle>
          <Badge className={`${STATUS_COLORS[job.status]} text-white`}>
            {STATUS_STEPS.find((s) => s.status === job.status)?.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress Steps */}
        <div className="flex items-center justify-between px-2">
          {STATUS_STEPS.slice(0, -1).map((step, index) => (
            <div key={step.status} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  index <= currentStepIndex
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {index < currentStepIndex ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  index + 1
                )}
              </div>
              {index < STATUS_STEPS.length - 2 && (
                <div
                  className={`w-8 sm:w-12 h-1 mx-1 ${
                    index < currentStepIndex ? "bg-primary" : "bg-muted"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Customer & Job Info */}
        <div className="bg-muted/50 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium">{job.customer_name}</span>
            </div>
            <span className="text-sm text-muted-foreground capitalize">
              {job.service_type.replace(/_/g, " ")}
            </span>
          </div>

          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
            <span className="text-sm">
              {job.customer_address || `${job.customer_lat}, ${job.customer_lng}`}
            </span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className="w-3 h-3" />
              {formatDistanceToNow(new Date(job.accepted_at || job.created_at), {
                addSuffix: true,
              })}
            </div>
            {job.estimated_price && (
              <div className="flex items-center gap-1 text-success font-medium">
                <IndianRupee className="w-4 h-4" />
                ₹{job.estimated_price}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            onClick={openGoogleMaps}
            className="flex items-center gap-2"
          >
            <Navigation className="w-4 h-4" />
            Navigate
            <ExternalLink className="w-3 h-3" />
          </Button>
          {job.customer_phone && (
            <Button
              variant="outline"
              onClick={callCustomer}
              className="flex items-center gap-2"
            >
              <Phone className="w-4 h-4" />
              Call
            </Button>
          )}
        </div>

        {/* Next Step Button */}
        {nextStep && (
          <Button
            className="w-full bg-gradient-button"
            onClick={handleNextStep}
            disabled={isUpdating}
          >
            {isUpdating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Updating...
              </>
            ) : (
              getNextButtonLabel()
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
