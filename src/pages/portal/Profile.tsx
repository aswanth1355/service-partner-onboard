import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { PortalHeader } from "@/components/portal/PortalHeader";
import { PortalNav } from "@/components/portal/PortalNav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  User,
  Phone,
  MapPin,
  Store,
  Wrench,
  CheckCircle2,
  Clock,
  AlertCircle,
  Save,
  Loader2,
} from "lucide-react";

const SERVICE_LABELS: Record<string, string> = {
  mechanical: "Mechanical Repairs",
  battery: "Battery Jumpstart",
  fuel: "Fuel Delivery",
  lockout: "Lockout Assistance",
  tire: "Flat Tire Repair",
  ev: "EV Portable Charger",
  winching: "Winching",
  towing: "Towing",
};

export default function Profile() {
  const { profile, refreshProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || "",
    phone: profile?.phone || "",
    shop_name: profile?.shop_name || "",
    service_area: profile?.service_area || "",
  });

  const handleSave = async () => {
    if (!profile) return;

    setIsSaving(true);
    const { error } = await supabase
      .from("technician_profiles")
      .update({
        full_name: formData.full_name,
        phone: formData.phone,
        shop_name: formData.shop_name,
        service_area: formData.service_area,
      })
      .eq("id", profile.id);

    if (error) {
      toast.error("Failed to update profile");
    } else {
      toast.success("Profile updated successfully");
      await refreshProfile();
      setIsEditing(false);
    }
    setIsSaving(false);
  };

  const getVerificationBadge = () => {
    switch (profile?.verification_status) {
      case "verified":
        return (
          <Badge className="bg-success/10 text-success border-success/30">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Verified
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="outline" className="text-warning border-warning/30">
            <Clock className="w-3 h-3 mr-1" />
            Pending Verification
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="outline" className="text-destructive border-destructive/30">
            <AlertCircle className="w-3 h-3 mr-1" />
            Verification Required
          </Badge>
        );
      default:
        return null;
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-background pb-20">
      <PortalHeader />

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Profile Header */}
        <Card className="shadow-card">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <Avatar className="w-24 h-24 mb-4">
                <AvatarImage src={profile.avatar_url || ""} />
                <AvatarFallback className="bg-primary/10 text-primary text-2xl">
                  {getInitials(profile.full_name)}
                </AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-bold">{profile.full_name}</h2>
              <p className="text-muted-foreground">{profile.shop_name || "Technician"}</p>
              <div className="mt-3">{getVerificationBadge()}</div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Details */}
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              Profile Details
            </CardTitle>
            {!isEditing ? (
              <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                Edit
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button size="sm" onClick={handleSave} disabled={isSaving}>
                  {isSaving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-1" />
                      Save
                    </>
                  )}
                </Button>
              </div>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-muted-foreground">
                <User className="w-4 h-4" />
                Full Name
              </Label>
              {isEditing ? (
                <Input
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                />
              ) : (
                <p className="font-medium">{profile.full_name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-muted-foreground">
                <Phone className="w-4 h-4" />
                Phone Number
              </Label>
              {isEditing ? (
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              ) : (
                <p className="font-medium">{profile.phone}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-muted-foreground">
                <Store className="w-4 h-4" />
                Shop Name
              </Label>
              {isEditing ? (
                <Input
                  value={formData.shop_name}
                  onChange={(e) => setFormData({ ...formData, shop_name: e.target.value })}
                />
              ) : (
                <p className="font-medium">{profile.shop_name || "Not set"}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                Service Area
              </Label>
              {isEditing ? (
                <Input
                  value={formData.service_area}
                  onChange={(e) => setFormData({ ...formData, service_area: e.target.value })}
                />
              ) : (
                <p className="font-medium">{profile.service_area || "Not set"}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Services */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wrench className="w-5 h-5 text-primary" />
              Services Offered
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {profile.service_types && profile.service_types.length > 0 ? (
                profile.service_types.map((service) => (
                  <Badge
                    key={service}
                    variant="secondary"
                    className="px-3 py-1"
                  >
                    {SERVICE_LABELS[service] || service}
                  </Badge>
                ))
              ) : (
                <p className="text-muted-foreground">No services configured</p>
              )}
            </div>
          </CardContent>
        </Card>
      </main>

      <PortalNav />
    </div>
  );
}
