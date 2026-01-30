import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Job } from "@/hooks/useJobs";
import {
  MapPin,
  User,
  Wrench,
  Car,
  Navigation,
  IndianRupee,
  Clock,
  Check,
  X,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface JobRequestCardProps {
  job: Job;
  onAccept: (jobId: string) => void;
  onReject: (jobId: string) => void;
  isLoading?: boolean;
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

export function JobRequestCard({
  job,
  onAccept,
  onReject,
  isLoading,
}: JobRequestCardProps) {
  return (
    <Card className="shadow-card border-l-4 border-l-primary animate-fade-in overflow-hidden">
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-2xl">
              {SERVICE_ICONS[job.service_type] || "🚗"}
            </div>
            <div>
              <h3 className="font-semibold text-foreground capitalize">
                {job.service_type.replace(/_/g, " ")}
              </h3>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatDistanceToNow(new Date(job.created_at), { addSuffix: true })}
              </p>
            </div>
          </div>
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
            New
          </Badge>
        </div>

        {/* Customer Info */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm">
            <User className="w-4 h-4 text-muted-foreground" />
            <span>{job.customer_name}</span>
          </div>
          {job.vehicle_type && (
            <div className="flex items-center gap-2 text-sm">
              <Car className="w-4 h-4 text-muted-foreground" />
              <span className="capitalize">{job.vehicle_type}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <span className="line-clamp-1">
              {job.customer_address || `${job.customer_lat}, ${job.customer_lng}`}
            </span>
          </div>
        </div>

        {/* Distance & Price */}
        <div className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg mb-4">
          {job.estimated_distance && (
            <div className="flex items-center gap-2">
              <Navigation className="w-4 h-4 text-primary" />
              <span className="font-medium">{job.estimated_distance} km</span>
            </div>
          )}
          {job.estimated_price && (
            <div className="flex items-center gap-2">
              <IndianRupee className="w-4 h-4 text-success" />
              <span className="font-medium text-success">
                ₹{job.estimated_price}
              </span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1 border-destructive/50 text-destructive hover:bg-destructive/10"
            onClick={() => onReject(job.id)}
            disabled={isLoading}
          >
            <X className="w-4 h-4 mr-1" />
            Reject
          </Button>
          <Button
            className="flex-1 bg-gradient-button"
            onClick={() => onAccept(job.id)}
            disabled={isLoading}
          >
            <Check className="w-4 h-4 mr-1" />
            Accept
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
