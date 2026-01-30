import { TechnicianSignupForm } from "@/components/technician-form/TechnicianSignupForm";
import { Wrench, Phone, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-burgundy sticky top-0 z-50 border-b border-burgundy-light/20">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Wrench className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-primary">ResQNow</span>
          </div>
          <div className="flex items-center gap-2">
            {user ? (
              <Link to="/dashboard">
                <Button size="sm" className="bg-primary text-primary-foreground hover:bg-coral-dark">
                  Dashboard
                </Button>
              </Link>
            ) : (
              <Link to="/login">
                <Button size="sm" variant="outline" className="flex items-center gap-2 border-primary text-primary hover:bg-primary/10">
                  <LogIn className="w-4 h-4" />
                  <span className="hidden sm:inline">Technician Login</span>
                </Button>
              </Link>
            )}
            <Button size="sm" className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-coral-dark">
              <Phone className="w-4 h-4" />
              <span className="hidden sm:inline">Emergency Call</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-hero py-12 sm:py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-secondary/90 backdrop-blur-sm text-secondary-foreground rounded-full px-4 py-2 text-sm font-medium mb-6 animate-fade-in">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
            Available 24/7
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-secondary mb-4 animate-fade-in">
            Join Our Technician Network
          </h1>
          <p className="text-secondary/80 text-lg max-w-2xl mx-auto animate-fade-in">
            Become part of our growing network of skilled roadside assistance professionals. 
            Complete the form below to submit your application.
          </p>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-8 sm:py-12 -mt-8 relative z-10">
        <div className="container mx-auto px-4">
          <TechnicianSignupForm />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-burgundy text-secondary-foreground py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Wrench className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-primary">ResQNow</span>
          </div>
          <p className="text-muted-foreground text-sm">
            © 2024 ResQNow. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
