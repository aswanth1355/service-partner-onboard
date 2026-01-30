import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Home, Briefcase, IndianRupee, User } from "lucide-react";

const NAV_ITEMS = [
  { path: "/dashboard", label: "Home", icon: Home },
  { path: "/jobs", label: "Jobs", icon: Briefcase },
  { path: "/earnings", label: "Earnings", icon: IndianRupee },
  { path: "/profile", label: "Profile", icon: User },
];

export function PortalNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50 safe-area-bottom">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-around h-16">
          {NAV_ITEMS.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-lg transition-colors",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <item.icon
                  className={cn("w-5 h-5", isActive && "text-primary")}
                />
                <span className="text-xs font-medium">{item.label}</span>
                {isActive && (
                  <div className="absolute bottom-0 w-8 h-1 bg-primary rounded-t-full" />
                )}
              </NavLink>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
