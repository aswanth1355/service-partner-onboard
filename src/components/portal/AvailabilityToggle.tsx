import { Switch } from "@/components/ui/switch";
import { useAvailability } from "@/hooks/useAvailability";
import { cn } from "@/lib/utils";
import { Loader2, Wifi, WifiOff } from "lucide-react";

export function AvailabilityToggle() {
  const { isOnline, toggleAvailability, loading } = useAvailability();

  const handleToggle = async () => {
    await toggleAvailability();
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-muted">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span className="text-sm">Loading...</span>
      </div>
    );
  }

  return (
    <button
      onClick={handleToggle}
      className={cn(
        "flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300",
        isOnline
          ? "bg-success/20 text-success border border-success/30"
          : "bg-muted text-muted-foreground border border-border"
      )}
    >
      {isOnline ? (
        <Wifi className="w-4 h-4" />
      ) : (
        <WifiOff className="w-4 h-4" />
      )}
      <span className="text-sm font-medium">
        {isOnline ? "Online" : "Offline"}
      </span>
      <Switch
        checked={isOnline}
        onCheckedChange={handleToggle}
        className="ml-1"
      />
    </button>
  );
}
