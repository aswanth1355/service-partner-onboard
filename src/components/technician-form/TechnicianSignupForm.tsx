import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FormProgress } from "./FormProgress";
import { PersonalInfoStep } from "./PersonalInfoStep";
import { ServiceTypeStep } from "./ServiceTypeStep";
import { ShopVerificationStep } from "./ShopVerificationStep";
import { ServicePricingStep } from "./ServicePricingStep";
import { ChevronLeft, ChevronRight, Send, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const STEPS = [
  { id: 1, title: "Personal Info", description: "Your details" },
  { id: 2, title: "Services", description: "What you offer" },
  { id: 3, title: "Verification", description: "Shop images" },
  { id: 4, title: "Pricing", description: "Set your rates" },
];

interface FormData {
  personalInfo: {
    technicianName: string;
    shopName: string;
    personalContact: string;
    shopContact: string;
    shopAddress: string;
    gpsLocation: string;
  };
  serviceType: {
    services: string[];
    vehicleTypes: string[];
  };
  verification: {
    shopImage: File | null;
    equipmentImage: File | null;
    workingBayImage: File | null;
    facilitiesImage: File | null;
    gstinNumber: string;
  };
  pricing: {
    [serviceId: string]: {
      [subService: string]: string;
    };
  };
}

const initialFormData: FormData = {
  personalInfo: {
    technicianName: "",
    shopName: "",
    personalContact: "",
    shopContact: "",
    shopAddress: "",
    gpsLocation: "",
  },
  serviceType: {
    services: [],
    vehicleTypes: [],
  },
  verification: {
    shopImage: null,
    equipmentImage: null,
    workingBayImage: null,
    facilitiesImage: null,
    gstinNumber: "",
  },
  pricing: {},
};

export function TechnicianSignupForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        const { technicianName, shopName, personalContact, shopContact, shopAddress, gpsLocation } = formData.personalInfo;
        return technicianName && shopName && personalContact && shopContact && shopAddress && gpsLocation;
      case 2:
        return formData.serviceType.services.length > 0 && formData.serviceType.vehicleTypes.length > 0;
      case 3:
        return formData.verification.shopImage !== null;
      case 4:
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    toast.success("Application submitted successfully!", {
      description: "We'll review your application and get back to you within 24-48 hours.",
    });
    console.log("Form submitted:", formData);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Progress Tracker */}
      <div className="bg-card rounded-2xl shadow-card p-6 mb-6">
        <FormProgress steps={STEPS} currentStep={currentStep} />
      </div>

      {/* Form Content */}
      <div className="bg-card rounded-2xl shadow-card p-6 sm:p-8">
        {currentStep === 1 && (
          <PersonalInfoStep
            data={formData.personalInfo}
            onChange={(data) => setFormData({ ...formData, personalInfo: data })}
          />
        )}
        {currentStep === 2 && (
          <ServiceTypeStep
            data={formData.serviceType}
            onChange={(data) => setFormData({ ...formData, serviceType: data })}
          />
        )}
        {currentStep === 3 && (
          <ShopVerificationStep
            data={formData.verification}
            onChange={(data) => setFormData({ ...formData, verification: data })}
          />
        )}
        {currentStep === 4 && (
          <ServicePricingStep
            selectedServices={formData.serviceType.services}
            pricing={formData.pricing}
            onChange={(pricing) => setFormData({ ...formData, pricing })}
          />
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
          <Button
            type="button"
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className={cn(
              "flex items-center gap-2",
              currentStep === 1 && "invisible"
            )}
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </Button>

          {currentStep < 4 ? (
            <Button
              type="button"
              onClick={handleNext}
              disabled={!canProceed()}
              className="flex items-center gap-2 bg-gradient-button shadow-button hover:shadow-card-hover transition-all"
            >
              Next Step
              <ChevronRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex items-center gap-2 bg-gradient-button shadow-button hover:shadow-card-hover transition-all"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Submit Application
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
