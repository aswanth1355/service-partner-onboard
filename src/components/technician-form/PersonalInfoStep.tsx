import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { MapPin, User, Store, Phone, Navigation } from "lucide-react";

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
}

export function PersonalInfoStep({ data, onChange }: PersonalInfoStepProps) {
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
            Technician Name *
          </Label>
          <Input
            id="technicianName"
            placeholder="Enter your full name"
            value={data.technicianName}
            onChange={(e) => handleChange("technicianName", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="shopName" className="flex items-center gap-2">
            <Store className="w-4 h-4 text-muted-foreground" />
            Shop Name *
          </Label>
          <Input
            id="shopName"
            placeholder="Enter your shop name"
            value={data.shopName}
            onChange={(e) => handleChange("shopName", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="personalContact" className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-muted-foreground" />
            Personal Contact No. *
          </Label>
          <Input
            id="personalContact"
            type="tel"
            placeholder="+91 XXXXX XXXXX"
            value={data.personalContact}
            onChange={(e) => handleChange("personalContact", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="shopContact" className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-muted-foreground" />
            Shop Contact No. *
          </Label>
          <Input
            id="shopContact"
            type="tel"
            placeholder="+91 XXXXX XXXXX"
            value={data.shopContact}
            onChange={(e) => handleChange("shopContact", e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="shopAddress" className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-muted-foreground" />
          Shop Address *
        </Label>
        <Textarea
          id="shopAddress"
          placeholder="Enter complete shop address including landmark"
          rows={3}
          value={data.shopAddress}
          onChange={(e) => handleChange("shopAddress", e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="gpsLocation" className="flex items-center gap-2">
          <Navigation className="w-4 h-4 text-muted-foreground" />
          GPS Location *
        </Label>
        <div className="flex gap-3">
          <Input
            id="gpsLocation"
            placeholder="Latitude, Longitude"
            value={data.gpsLocation}
            onChange={(e) => handleChange("gpsLocation", e.target.value)}
            className="flex-1"
          />
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
        <p className="text-xs text-muted-foreground">
          Click "Get Location" to automatically fetch your current GPS coordinates
        </p>
      </div>
    </div>
  );
}
