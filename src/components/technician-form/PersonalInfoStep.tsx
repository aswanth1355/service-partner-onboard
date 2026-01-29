import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { MapPin, User, Store, Phone, Navigation, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface PersonalInfoData {
  technicianName: string;
  shopName: string;
  personalContact: string;
  shopContact: string;
  shopAddress: string;
  gpsLocation: string;
}

interface PersonalInfoStepProps {
  data: PersonalInfoData;
  onChange: (data: PersonalInfoData) => void;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  onBlur: (field: string) => void;
}

export function PersonalInfoStep({ data, onChange, errors, touched, onBlur }: PersonalInfoStepProps) {
  const handleChange = (field: keyof PersonalInfoData, value: string) => {
    onChange({ ...data, [field]: value });
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          handleChange("gpsLocation", `${latitude}, ${longitude}`);
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  };

  const getFieldError = (field: string) => {
    return touched[field] && errors[field] ? errors[field] : null;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <User className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">Personal Information</h3>
          <p className="text-sm text-muted-foreground">Tell us about you and your shop</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="technicianName" className="flex items-center gap-2">
            <User className="w-4 h-4 text-muted-foreground" />
            Technician Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="technicianName"
            placeholder="Enter your full name"
            value={data.technicianName}
            onChange={(e) => handleChange("technicianName", e.target.value)}
            onBlur={() => onBlur("technicianName")}
            className={cn(getFieldError("technicianName") && "border-destructive focus-visible:ring-destructive")}
          />
          {getFieldError("technicianName") && (
            <p className="text-sm text-destructive flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {getFieldError("technicianName")}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="shopName" className="flex items-center gap-2">
            <Store className="w-4 h-4 text-muted-foreground" />
            Shop Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="shopName"
            placeholder="Enter your shop name"
            value={data.shopName}
            onChange={(e) => handleChange("shopName", e.target.value)}
            onBlur={() => onBlur("shopName")}
            className={cn(getFieldError("shopName") && "border-destructive focus-visible:ring-destructive")}
          />
          {getFieldError("shopName") && (
            <p className="text-sm text-destructive flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {getFieldError("shopName")}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="personalContact" className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-muted-foreground" />
            Personal Contact No. <span className="text-destructive">*</span>
          </Label>
          <Input
            id="personalContact"
            type="tel"
            placeholder="+91 XXXXX XXXXX"
            value={data.personalContact}
            onChange={(e) => handleChange("personalContact", e.target.value)}
            onBlur={() => onBlur("personalContact")}
            className={cn(getFieldError("personalContact") && "border-destructive focus-visible:ring-destructive")}
          />
          {getFieldError("personalContact") && (
            <p className="text-sm text-destructive flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {getFieldError("personalContact")}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="shopContact" className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-muted-foreground" />
            Shop Contact No. <span className="text-destructive">*</span>
          </Label>
          <Input
            id="shopContact"
            type="tel"
            placeholder="+91 XXXXX XXXXX"
            value={data.shopContact}
            onChange={(e) => handleChange("shopContact", e.target.value)}
            onBlur={() => onBlur("shopContact")}
            className={cn(getFieldError("shopContact") && "border-destructive focus-visible:ring-destructive")}
          />
          {getFieldError("shopContact") && (
            <p className="text-sm text-destructive flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {getFieldError("shopContact")}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="shopAddress" className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-muted-foreground" />
          Shop Address <span className="text-destructive">*</span>
        </Label>
        <Textarea
          id="shopAddress"
          placeholder="Enter complete shop address including landmark"
          rows={3}
          value={data.shopAddress}
          onChange={(e) => handleChange("shopAddress", e.target.value)}
          onBlur={() => onBlur("shopAddress")}
          className={cn(getFieldError("shopAddress") && "border-destructive focus-visible:ring-destructive")}
        />
        {getFieldError("shopAddress") && (
          <p className="text-sm text-destructive flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {getFieldError("shopAddress")}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="gpsLocation" className="flex items-center gap-2">
          <Navigation className="w-4 h-4 text-muted-foreground" />
          GPS Location <span className="text-destructive">*</span>
        </Label>
        <div className="flex gap-3">
          <div className="flex-1">
            <Input
              id="gpsLocation"
              placeholder="Latitude, Longitude"
              value={data.gpsLocation}
              onChange={(e) => handleChange("gpsLocation", e.target.value)}
              onBlur={() => onBlur("gpsLocation")}
              className={cn(getFieldError("gpsLocation") && "border-destructive focus-visible:ring-destructive")}
            />
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={handleGetLocation}
            className="flex items-center gap-2 whitespace-nowrap"
          >
            <Navigation className="w-4 h-4" />
            Get Location
          </Button>
        </div>
        {getFieldError("gpsLocation") && (
          <p className="text-sm text-destructive flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {getFieldError("gpsLocation")}
          </p>
        )}
        <p className="text-xs text-muted-foreground">
          Click "Get Location" to automatically fetch your current GPS coordinates
        </p>
      </div>
    </div>
  );
}
