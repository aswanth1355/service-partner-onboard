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
  IndianRupee,
  Car,
  Bike,
  Bus,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface ServicePricing {
  [serviceId: string]: {
    [vehicleType: string]: {
      [subService: string]: string;
    };
  };
}

interface ServicePricingStepProps {
  selectedServices: string[];
  selectedVehicleTypes: string[];
  pricing: ServicePricing;
  onChange: (pricing: ServicePricing) => void;
  errors: Record<string, string>;
  showErrors: boolean;
}

const VEHICLE_TYPE_LABELS: Record<string, { label: string; icon: React.ElementType }> = {
  car: { label: "Car", icon: Car },
  bike: { label: "Bike", icon: Bike },
  commercial: { label: "Commercial", icon: Bus },
};

const SERVICE_PRICING_CONFIG: Record<string, {
  label: string;
  icon: React.ElementType;
  subServices: { id: string; label: string; unit?: string }[];
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
      { id: "petrol", label: "Petrol Delivery", unit: "/liter" },
      { id: "diesel", label: "Diesel Delivery", unit: "/liter" },
      { id: "deliveryCharge", label: "Delivery Charge" },
    ],
  },
  lockout: {
    label: "Lockout Assistance",
    icon: Key,
    subServices: [
      { id: "unlocking", label: "Door Unlocking" },
      { id: "keyMaking", label: "Key Making" },
      { id: "keyDuplication", label: "Key Duplication" },
    ],
  },
  tire: {
    label: "Flat Tire Repair",
    icon: CircleDot,
    subServices: [
      { id: "puncture", label: "Puncture Repair" },
      { id: "tireChange", label: "Tire Change" },
      { id: "tubelessRepair", label: "Tubeless Repair" },
      { id: "wheelBalancing", label: "Wheel Balancing" },
    ],
  },
  ev: {
    label: "EV Portable Charger",
    icon: Zap,
    subServices: [
      { id: "charging", label: "On-site Charging", unit: "/kWh" },
      { id: "evDiagnostics", label: "EV Diagnostics" },
      { id: "chargerSetup", label: "Charger Setup Fee" },
    ],
  },
  winching: {
    label: "Winching Services",
    icon: Anchor,
    subServices: [
      { id: "basicWinch", label: "Basic Winching" },
      { id: "mudRecovery", label: "Mud/Ditch Recovery" },
      { id: "accidentRecovery", label: "Accident Recovery" },
    ],
  },
  towing: {
    label: "Towing Services",
    icon: Truck,
    subServices: [
      { id: "baseCharge", label: "Base Charge" },
      { id: "perKm", label: "Per Kilometer", unit: "/km" },
      { id: "flatbed", label: "Flatbed Towing" },
    ],
  },
};

export function ServicePricingStep({ 
  selectedServices, 
  selectedVehicleTypes, 
  pricing, 
  onChange,
  errors,
  showErrors 
}: ServicePricingStepProps) {
  const handlePriceChange = (
    serviceId: string, 
    vehicleType: string, 
    subServiceId: string, 
    value: string
  ) => {
    const newPricing = {
      ...pricing,
      [serviceId]: {
        ...pricing[serviceId],
        [vehicleType]: {
          ...pricing[serviceId]?.[vehicleType],
          [subServiceId]: value,
        },
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
        <div className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-8 h-8 text-destructive" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">No Services Selected</h3>
        <p className="text-muted-foreground">
          Please go back to Step 2 and select at least one service to set pricing.
        </p>
      </div>
    );
  }

  if (selectedVehicleTypes.length === 0) {
    return (
      <div className="text-center py-12 animate-fade-in">
        <div className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-8 h-8 text-destructive" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">No Vehicle Types Selected</h3>
        <p className="text-muted-foreground">
          Please go back to Step 2 and select at least one vehicle type.
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
          <p className="text-sm text-muted-foreground">Set your prices for each selected service and vehicle type</p>
        </div>
      </div>

      {showErrors && errors.pricing && (
        <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-destructive" />
          <p className="text-sm text-destructive">{errors.pricing}</p>
        </div>
      )}

      <div className="space-y-8">
        {activeServices.map((serviceId) => {
          const service = SERVICE_PRICING_CONFIG[serviceId];
          if (!service) return null;

          return (
            <div
              key={serviceId}
              className="bg-card rounded-xl border border-border overflow-hidden shadow-sm"
            >
              {/* Service Header */}
              <div className="flex items-center gap-3 p-5 bg-muted/50 border-b border-border">
                <div className="w-10 h-10 rounded-lg bg-primary text-primary-foreground flex items-center justify-center">
                  <service.icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-semibold text-foreground">{service.label}</h4>
                  <div className="flex gap-2 mt-1">
                    {selectedVehicleTypes.map((vt) => {
                      const vtConfig = VEHICLE_TYPE_LABELS[vt];
                      return (
                        <Badge key={vt} variant="secondary" className="text-xs">
                          {vtConfig?.label || vt}
                        </Badge>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Pricing Grid */}
              <div className="p-5">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">
                          Service Type
                        </th>
                        {selectedVehicleTypes.map((vt) => {
                          const vtConfig = VEHICLE_TYPE_LABELS[vt];
                          const VtIcon = vtConfig?.icon || Car;
                          return (
                            <th key={vt} className="text-center py-3 px-2 text-sm font-medium text-muted-foreground min-w-[120px]">
                              <div className="flex items-center justify-center gap-2">
                                <VtIcon className="w-4 h-4" />
                                {vtConfig?.label || vt}
                              </div>
                            </th>
                          );
                        })}
                      </tr>
                    </thead>
                    <tbody>
                      {service.subServices.map((subService, idx) => (
                        <tr 
                          key={subService.id} 
                          className={cn(
                            idx !== service.subServices.length - 1 && "border-b border-border/50"
                          )}
                        >
                          <td className="py-3 px-2">
                            <div className="text-sm font-medium text-foreground">
                              {subService.label}
                            </div>
                            {subService.unit && (
                              <div className="text-xs text-muted-foreground">{subService.unit}</div>
                            )}
                          </td>
                          {selectedVehicleTypes.map((vt) => (
                            <td key={vt} className="py-3 px-2">
                              <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                                  ₹
                                </span>
                                <Input
                                  type="number"
                                  placeholder="0"
                                  className="pl-7 text-center h-9"
                                  value={pricing[serviceId]?.[vt]?.[subService.id] || ""}
                                  onChange={(e) =>
                                    handlePriceChange(serviceId, vt, subService.id, e.target.value)
                                  }
                                />
                              </div>
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-muted/50 rounded-lg p-4 flex items-start gap-3">
        <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
          <span className="text-xs text-primary font-bold">i</span>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">
            Prices are base rates and may vary based on location and complexity. 
            Leave fields empty if you don't offer that specific service for a vehicle type.
          </p>
        </div>
      </div>
    </div>
  );
}
