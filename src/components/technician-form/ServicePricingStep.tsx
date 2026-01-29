import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Wrench, 
  Battery, 
  Fuel, 
  Key, 
  CircleDot, 
  Zap, 
  Anchor, 
  Truck,
  IndianRupee
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ServicePricing {
  [serviceId: string]: {
    [subService: string]: string;
  };
}

interface ServicePricingStepProps {
  selectedServices: string[];
  pricing: ServicePricing;
  onChange: (pricing: ServicePricing) => void;
}

const SERVICE_PRICING_CONFIG: Record<string, {
  label: string;
  icon: React.ElementType;
  subServices: { id: string; label: string }[];
}> = {
  mechanical: {
    label: "Mechanical Services",
    icon: Wrench,
    subServices: [
      { id: "general", label: "General Service" },
      { id: "breakdown", label: "Breakdown Repair" },
      { id: "engine", label: "Engine Repair" },
      { id: "ac", label: "AC Repair" },
      { id: "electrical", label: "Electrical Work" },
      { id: "diagnostics", label: "Diagnostics" },
    ],
  },
  battery: {
    label: "Battery Jumpstart",
    icon: Battery,
    subServices: [
      { id: "jumpstart", label: "Jumpstart Service" },
      { id: "replacement", label: "Battery Replacement" },
      { id: "testing", label: "Battery Testing" },
    ],
  },
  fuel: {
    label: "Fuel Delivery",
    icon: Fuel,
    subServices: [
      { id: "petrol", label: "Petrol Delivery" },
      { id: "diesel", label: "Diesel Delivery" },
      { id: "emergency", label: "Emergency Fuel (per liter)" },
    ],
  },
  lockout: {
    label: "Lockout Assistance",
    icon: Key,
    subServices: [
      { id: "carLockout", label: "Car Lockout" },
      { id: "bikeLockout", label: "Bike Lockout" },
      { id: "keyMaking", label: "Key Making" },
    ],
  },
  tire: {
    label: "Flat Tire Repair",
    icon: CircleDot,
    subServices: [
      { id: "puncture", label: "Puncture Repair" },
      { id: "tireChange", label: "Tire Change" },
      { id: "wheelBalancing", label: "Wheel Balancing" },
      { id: "alignment", label: "Wheel Alignment" },
    ],
  },
  ev: {
    label: "EV Portable Charger",
    icon: Zap,
    subServices: [
      { id: "charging", label: "On-site Charging (per unit)" },
      { id: "evDiagnostics", label: "EV Diagnostics" },
      { id: "cableRepair", label: "Charging Cable Repair" },
    ],
  },
  winching: {
    label: "Winching Services",
    icon: Anchor,
    subServices: [
      { id: "lightVehicle", label: "Light Vehicle Winching" },
      { id: "heavyVehicle", label: "Heavy Vehicle Winching" },
      { id: "recovery", label: "Vehicle Recovery" },
    ],
  },
  towing: {
    label: "Towing Services",
    icon: Truck,
    subServices: [
      { id: "localTowing", label: "Local Towing (per km)" },
      { id: "longDistance", label: "Long Distance (per km)" },
      { id: "flatbed", label: "Flatbed Towing" },
      { id: "bikeTowing", label: "Bike Towing" },
    ],
  },
};

export function ServicePricingStep({ selectedServices, pricing, onChange }: ServicePricingStepProps) {
  const handlePriceChange = (serviceId: string, subServiceId: string, value: string) => {
    const newPricing = {
      ...pricing,
      [serviceId]: {
        ...pricing[serviceId],
        [subServiceId]: value,
      },
    };
    onChange(newPricing);
  };

  const activeServices = selectedServices.filter(
    (service) => SERVICE_PRICING_CONFIG[service]
  );

  if (activeServices.length === 0) {
    return (
      <div className="text-center py-12 animate-fade-in">
        <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
          <IndianRupee className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">No Services Selected</h3>
        <p className="text-muted-foreground">
          Please go back and select at least one service to set pricing.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <IndianRupee className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">Service Pricing</h3>
          <p className="text-sm text-muted-foreground">Set your prices for each selected service</p>
        </div>
      </div>

      <div className="space-y-6">
        {activeServices.map((serviceId) => {
          const service = SERVICE_PRICING_CONFIG[serviceId];
          if (!service) return null;

          return (
            <div
              key={serviceId}
              className="bg-card rounded-xl border border-border p-6 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <service.icon className="w-5 h-5 text-primary" />
                </div>
                <h4 className="text-base font-semibold text-foreground">{service.label}</h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {service.subServices.map((subService) => (
                  <div key={subService.id} className="space-y-2">
                    <Label htmlFor={`${serviceId}-${subService.id}`} className="text-sm">
                      {subService.label}
                    </Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        ₹
                      </span>
                      <Input
                        id={`${serviceId}-${subService.id}`}
                        type="number"
                        placeholder="0.00"
                        className="pl-7"
                        value={pricing[serviceId]?.[subService.id] || ""}
                        onChange={(e) =>
                          handlePriceChange(serviceId, subService.id, e.target.value)
                        }
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-muted/50 rounded-lg p-4 flex items-start gap-3">
        <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
          <span className="text-xs text-primary font-bold">i</span>
        </div>
        <p className="text-sm text-muted-foreground">
          Prices are indicative and may vary based on vehicle type and complexity. 
          You can always update these later from your dashboard.
        </p>
      </div>
    </div>
  );
}
