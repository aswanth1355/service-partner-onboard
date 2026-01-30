import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEarnings } from "@/hooks/useEarnings";
import { IndianRupee, TrendingUp, Calendar, Briefcase } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export function EarningsCard() {
  const { summary, loading } = useEarnings();

  if (loading) {
    return (
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IndianRupee className="w-5 h-5 text-primary" />
            Earnings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-20 rounded-xl" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const stats = [
    {
      label: "Today",
      value: summary.todayEarnings,
      icon: Calendar,
      color: "text-success",
      bg: "bg-success/10",
    },
    {
      label: "This Week",
      value: summary.weeklyEarnings,
      icon: TrendingUp,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      label: "Total Earnings",
      value: summary.totalEarnings,
      icon: IndianRupee,
      color: "text-warning",
      bg: "bg-warning/10",
    },
    {
      label: "Jobs Completed",
      value: summary.totalJobs,
      isCount: true,
      icon: Briefcase,
      color: "text-accent",
      bg: "bg-accent/10",
    },
  ];

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <IndianRupee className="w-5 h-5 text-primary" />
          Earnings Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className={`${stat.bg} rounded-xl p-4 transition-transform hover:scale-[1.02]`}
            >
              <div className="flex items-center gap-2 mb-2">
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
                <span className="text-sm text-muted-foreground">{stat.label}</span>
              </div>
              <p className={`text-2xl font-bold ${stat.color}`}>
                {stat.isCount ? (
                  stat.value
                ) : (
                  <>₹{stat.value.toLocaleString()}</>
                )}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
