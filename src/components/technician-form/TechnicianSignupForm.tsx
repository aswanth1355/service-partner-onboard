import { useState, useCallback } from "react";
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
      [vehicleType: string]: {
        [subService: string]: string;
      };
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

// Validation functions
const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^(\+91[\-\s]?)?[0]?(91)?[789]\d{9}$/;
  return phoneRegex.test(phone.replace(/\s/g, ""));
};

const validatePersonalInfo = (data: FormData["personalInfo"]): Record<string, string> => {
  const errors: Record<string, string> = {};
  
  if (!data.technicianName.trim()) {
    errors.technicianName = "Technician name is required";
  } else if (data.technicianName.trim().length < 2) {
    errors.technicianName = "Name must be at least 2 characters";
  }
  
  if (!data.shopName.trim()) {
    errors.shopName = "Shop name is required";
  }
  
  if (!data.personalContact.trim()) {
    errors.personalContact = "Personal contact is required";
  } else if (!validatePhone(data.personalContact)) {
    errors.personalContact = "Enter a valid 10-digit phone number";
  }
  
  if (!data.shopContact.trim()) {
    errors.shopContact = "Shop contact is required";
  } else if (!validatePhone(data.shopContact)) {
    errors.shopContact = "Enter a valid 10-digit phone number";
  }
  
  if (!data.shopAddress.trim()) {
    errors.shopAddress = "Shop address is required";
  } else if (data.shopAddress.trim().length < 10) {
    errors.shopAddress = "Please enter a complete address";
  }
  
  if (!data.gpsLocation.trim()) {
    errors.gpsLocation = "GPS location is required";
  }
  
  return errors;
};

const validateServiceType = (data: FormData["serviceType"]): Record<string, string> => {
  const errors: Record<string, string> = {};
  
  if (data.services.length === 0) {
    errors.services = "Please select at least one service";
  }
  
  if (data.vehicleTypes.length === 0) {
    errors.vehicleTypes = "Please select at least one vehicle type";
  }
  
  return errors;
};

const validateVerification = (data: FormData["verification"]): Record<string, string> => {
  const errors: Record<string, string> = {};
  
  if (!data.shopImage) {
    errors.shopImage = "Shop front image is required for verification";
  }
  
  return errors;
};

export function TechnicianSignupForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});
  const [stepErrors, setStepErrors] = useState<Record<string, string>>({});
  const [showStepErrors, setShowStepErrors] = useState(false);

  const handleFieldBlur = useCallback((field: string) => {
    setTouchedFields(prev => ({ ...prev, [field]: true }));
  }, []);

  const getPersonalInfoErrors = useCallback(() => {
    return validatePersonalInfo(formData.personalInfo);
  }, [formData.personalInfo]);

  const getServiceTypeErrors = useCallback(() => {
    return validateServiceType(formData.serviceType);
  }, [formData.serviceType]);

  const getVerificationErrors = useCallback(() => {
    return validateVerification(formData.verification);
  }, [formData.verification]);

  const validateCurrentStep = (): boolean => {
    let errors: Record<string, string> = {};
    let isValid = true;

    switch (currentStep) {
      case 1:
        errors = getPersonalInfoErrors();
        isValid = Object.keys(errors).length === 0;
        if (!isValid) {
          const missingFields = Object.keys(errors).map(key => {
            const fieldLabels: Record<string, string> = {
              technicianName: "Technician Name",
              shopName: "Shop Name",
              personalContact: "Personal Contact",
              shopContact: "Shop Contact",
              shopAddress: "Shop Address",
              gpsLocation: "GPS Location"
            };
            return fieldLabels[key] || key;
          });
          toast.error("Please fill all required fields", {
            description: `Missing: ${missingFields.join(", ")}`,
          });
          // Mark all fields as touched to show errors
          setTouchedFields({
            technicianName: true,
            shopName: true,
            personalContact: true,
            shopContact: true,
            shopAddress: true,
            gpsLocation: true,
          });
        }
        break;
      case 2:
        errors = getServiceTypeErrors();
        isValid = Object.keys(errors).length === 0;
        if (!isValid) {
          const issues = [];
          if (errors.services) issues.push("services");
          if (errors.vehicleTypes) issues.push("vehicle types");
          toast.error("Selection required", {
            description: `Please select at least one ${issues.join(" and ")}`,
          });
        }
        setStepErrors(errors);
        setShowStepErrors(true);
        break;
      case 3:
        errors = getVerificationErrors();
        isValid = Object.keys(errors).length === 0;
        if (!isValid) {
          toast.error("Shop image required", {
            description: "Please upload a shop front image for verification",
          });
        }
        setStepErrors(errors);
        setShowStepErrors(true);
        break;
      case 4:
        isValid = true; // Pricing is optional
        break;
    }

    return isValid;
  };

  const handleNext = () => {
    if (validateCurrentStep() && currentStep < 4) {
      setCurrentStep(currentStep + 1);
      setShowStepErrors(false);
      setStepErrors({});
      toast.success(`Step ${currentStep} completed!`, {
        description: `Moving to ${STEPS[currentStep].title}`,
      });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setShowStepErrors(false);
      setStepErrors({});
    }
  };

  const handleSubmit = async () => {
    if (!validateCurrentStep()) return;

    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    toast.success("Application submitted successfully! 🎉", {
      description: "We'll review your application and get back to you within 24-48 hours.",
      duration: 5000,
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
            errors={getPersonalInfoErrors()}
            touched={touchedFields}
            onBlur={handleFieldBlur}
          />
        )}
        {currentStep === 2 && (
          <ServiceTypeStep
            data={formData.serviceType}
            onChange={(data) => {
              setFormData({ ...formData, serviceType: data });
              setShowStepErrors(false);
            }}
            errors={stepErrors}
            showErrors={showStepErrors}
          />
        )}
        {currentStep === 3 && (
          <ShopVerificationStep
            data={formData.verification}
            onChange={(data) => {
              setFormData({ ...formData, verification: data });
              if (data.shopImage) {
                setShowStepErrors(false);
              }
            }}
            errors={stepErrors}
            showErrors={showStepErrors}
          />
        )}
        {currentStep === 4 && (
          <ServicePricingStep
            selectedServices={formData.serviceType.services}
            selectedVehicleTypes={formData.serviceType.vehicleTypes}
            pricing={formData.pricing}
            onChange={(pricing) => setFormData({ ...formData, pricing })}
            errors={stepErrors}
            showErrors={showStepErrors}
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
