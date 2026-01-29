import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Wrench, 
  Battery, 
  Fuel, 
  Key, 
  CircleDot, 
  Zap, 
  Anchor, 
  Truck,
  Car,
  Bike,
  Bus,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ServiceTypeData {
  services: string[];
  vehicleTypes: string[];
}

interface ServiceTypeStepProps {
  data: ServiceTypeData;
  onChange: (data: ServiceTypeData) => void;
  errors: Record<string, string>;
  showErrors: boolean;
}

const SERVICES = [
  { id: "mechanical", label: "Mechanical Issues", icon: Wrench, description: "General repairs & diagnostics" },
  { id: "battery", label: "Battery Jumpstart", icon: Battery, description: "Dead battery assistance" },
  { id: "fuel", label: "Fuel Delivery", icon: Fuel, description: "Emergency fuel service" },
  { id: "lockout", label: "Lockout Assistance", icon: Key, description: "Vehicle lockout help" },
  { id: "tire", label: "Flat Tire Repair", icon: CircleDot, description: "Tire change & repair" },
  { id: "ev", label: "EV Portable Charger", icon: Zap, description: "Electric vehicle charging" },
  { id: "winching", label: "Winching", icon: Anchor, description: "Vehicle recovery" },
  { id: "towing", label: "Towing", icon: Truck, description: "Vehicle towing service" },
];

const VEHICLE_TYPES = [
  { id: "car", label: "Car", icon: Car, description: "Sedans, SUVs, Hatchbacks" },
  { id: "bike", label: "Bike", icon: Bike, description: "Motorcycles & Scooters" },
  { id: "commercial", label: "Commercial Vehicle", icon: Bus, description: "Trucks, Buses, Vans" },
];

export function ServiceTypeStep({ data, onChange, errors, showErrors }: ServiceTypeStepProps) {
  const toggleService = (serviceId: string) => {
    const newServices = data.services.includes(serviceId)
      ? data.services.filter((s) => s !== serviceId)
      : [...data.services, serviceId];
    onChange({ ...data, services: newServices });
  };

  const toggleVehicleType = (typeId: string) => {
    const newTypes = data.vehicleTypes.includes(typeId)
      ? data.vehicleTypes.filter((t) => t !== typeId)
      : [...data.vehicleTypes, typeId];
    onChange({ ...data, vehicleTypes: newTypes });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Services Section */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Wrench className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Services You Offer <span className="text-destructive">*</span></h3>
            <p className="text-sm text-muted-foreground">Select all services you can provide</p>
          </div>
        </div>

        {showErrors && errors.services && (
          <div className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-destructive" />
            <p className="text-sm text-destructive">{errors.services}</p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {SERVICES.map((service) => {
            const isSelected = data.services.includes(service.id);
            return (
              <div
                key={service.id}
                onClick={() => toggleService(service.id)}
                className={cn(
                  "relative flex flex-col items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200",
                  isSelected 
                    ? "border-primary bg-primary/5 shadow-card" 
                    : "border-border bg-card hover:border-primary/50 hover:shadow-sm",
                  showErrors && errors.services && !isSelected && "border-destructive/30"
                )}
              >
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-colors",
                  isSelected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                )}>
                  <service.icon className="w-6 h-6" />
                </div>
                <Label className="text-sm font-medium text-center cursor-pointer">
                  {service.label}
                </Label>
                <p className="text-xs text-muted-foreground text-center mt-1">
                  {service.description}
                </p>
                <Checkbox 
                  checked={isSelected} 
                  className="absolute top-3 right-3"
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Vehicle Types Section */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Car className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Vehicle Types You Handle <span className="text-destructive">*</span></h3>
            <p className="text-sm text-muted-foreground">Select the types of vehicles you service</p>
          </div>
        </div>

        {showErrors && errors.vehicleTypes && (
          <div className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-destructive" />
            <p className="text-sm text-destructive">{errors.vehicleTypes}</p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {VEHICLE_TYPES.map((type) => {
            const isSelected = data.vehicleTypes.includes(type.id);
            return (
              <div
                key={type.id}
                onClick={() => toggleVehicleType(type.id)}
                className={cn(
                  "relative flex flex-col items-center p-6 rounded-xl border-2 cursor-pointer transition-all duration-200",
                  isSelected 
                    ? "border-primary bg-primary/5 shadow-card" 
                    : "border-border bg-card hover:border-primary/50 hover:shadow-sm",
                  showErrors && errors.vehicleTypes && !isSelected && "border-destructive/30"
                )}
              >
                <div className={cn(
                  "w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-colors",
                  isSelected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                )}>
                  <type.icon className="w-8 h-8" />
                </div>
                <Label className="text-base font-medium text-center cursor-pointer">
                  {type.label}
                </Label>
                <p className="text-sm text-muted-foreground text-center mt-1">
                  {type.description}
                </p>
                <Checkbox 
                  checked={isSelected} 
                  className="absolute top-4 right-4"
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
