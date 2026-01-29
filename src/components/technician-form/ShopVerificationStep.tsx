import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { 
  Camera, 
  Upload, 
  Store, 
  Wrench, 
  LayoutGrid, 
  Building2,
  FileText,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRef } from "react";

interface ShopVerificationData {
  shopImage: File | null;
  equipmentImage: File | null;
  workingBayImage: File | null;
  facilitiesImage: File | null;
  gstinNumber: string;
}

interface ShopVerificationStepProps {
  data: ShopVerificationData;
  onChange: (data: ShopVerificationData) => void;
}

interface ImageUploadCardProps {
  label: string;
  description: string;
  icon: React.ElementType;
  file: File | null;
  onFileChange: (file: File | null) => void;
}

function ImageUploadCard({ label, description, icon: Icon, file, onFileChange }: ImageUploadCardProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    onFileChange(selectedFile);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFileChange(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div
      onClick={handleClick}
      className={cn(
        "relative flex flex-col items-center justify-center p-6 rounded-xl border-2 border-dashed cursor-pointer transition-all duration-200 min-h-[200px]",
        file 
          ? "border-success bg-success/5" 
          : "border-border bg-card hover:border-primary/50 hover:bg-primary/5"
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="hidden"
      />
      
      {file ? (
        <>
          <div className="w-16 h-16 rounded-2xl bg-success/10 flex items-center justify-center mb-3">
            <Camera className="w-8 h-8 text-success" />
          </div>
          <p className="text-sm font-medium text-foreground text-center truncate max-w-full px-2">
            {file.name}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {(file.size / 1024 / 1024).toFixed(2)} MB
          </p>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleRemove}
            className="absolute top-2 right-2 h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
          >
            <X className="w-4 h-4" />
          </Button>
        </>
      ) : (
        <>
          <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-3">
            <Icon className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="text-sm font-medium text-foreground text-center">{label}</p>
          <p className="text-xs text-muted-foreground text-center mt-1">{description}</p>
          <div className="flex items-center gap-2 mt-3 text-primary">
            <Upload className="w-4 h-4" />
            <span className="text-sm font-medium">Upload Image</span>
          </div>
        </>
      )}
    </div>
  );
}

export function ShopVerificationStep({ data, onChange }: ShopVerificationStepProps) {
  const handleImageChange = (field: keyof ShopVerificationData, file: File | null) => {
    onChange({ ...data, [field]: file });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Camera className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">Shop Verification</h3>
          <p className="text-sm text-muted-foreground">Upload images to verify your shop and facilities</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <ImageUploadCard
          label="Shop Front Image"
          description="Clear photo of your shop exterior"
          icon={Store}
          file={data.shopImage}
          onFileChange={(file) => handleImageChange("shopImage", file)}
        />
        <ImageUploadCard
          label="Equipment & Tools"
          description="Photo of your repair equipment"
          icon={Wrench}
          file={data.equipmentImage}
          onFileChange={(file) => handleImageChange("equipmentImage", file)}
        />
        <ImageUploadCard
          label="Working Bay Area"
          description="Photo of your service/working bay"
          icon={LayoutGrid}
          file={data.workingBayImage}
          onFileChange={(file) => handleImageChange("workingBayImage", file)}
        />
        <ImageUploadCard
          label="Facilities"
          description="Customer waiting area, parking, etc."
          icon={Building2}
          file={data.facilitiesImage}
          onFileChange={(file) => handleImageChange("facilitiesImage", file)}
        />
      </div>

      <div className="pt-4 border-t border-border">
        <div className="space-y-2">
          <Label htmlFor="gstinNumber" className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-muted-foreground" />
            GSTIN Number (Optional)
          </Label>
          <Input
            id="gstinNumber"
            placeholder="Enter your GSTIN if registered"
            value={data.gstinNumber}
            onChange={(e) => onChange({ ...data, gstinNumber: e.target.value })}
            className="max-w-md"
          />
          <p className="text-xs text-muted-foreground">
            Providing GSTIN helps build trust with customers and enables invoicing
          </p>
        </div>
      </div>
    </div>
  );
}
