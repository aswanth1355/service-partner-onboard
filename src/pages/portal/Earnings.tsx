import { useEarnings } from "@/hooks/useEarnings";
import { PortalHeader } from "@/components/portal/PortalHeader";
import { PortalNav } from "@/components/portal/PortalNav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import {
  IndianRupee,
  TrendingUp,
  Calendar,
  Briefcase,
  ArrowUpRight,
  Wallet,
} from "lucide-react";

export default function Earnings() {
  const { earnings, summary, loading } = useEarnings();

  return (
    <div className="min-h-screen bg-background pb-20">
      <PortalHeader />

      <main className="container mx-auto px-4 py-6 space-y-6">
        <h1 className="text-2xl font-bold">Earnings</h1>

        {/* Total Earnings Card */}
        <Card className="bg-gradient-hero text-primary-foreground shadow-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-primary-foreground/80 text-sm">Total Earnings</p>
                {loading ? (
                  <Skeleton className="h-10 w-32 bg-primary-foreground/20" />
                ) : (
                  <p className="text-4xl font-bold mt-1">
                    ₹{summary.totalEarnings.toLocaleString()}
                  </p>
                )}
              </div>
              <div className="w-16 h-16 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                <Wallet className="w-8 h-8" />
              </div>
            </div>
            <div className="mt-6 flex items-center gap-2 text-sm text-primary-foreground/80">
              <Briefcase className="w-4 h-4" />
              <span>{summary.totalJobs} jobs completed</span>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="shadow-card">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">Today</span>
              </div>
              {loading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <div className="flex items-baseline gap-2">
                  <p className="text-2xl font-bold text-success">
                    ₹{summary.todayEarnings.toLocaleString()}
                  </p>
                  {summary.todayJobs > 0 && (
                    <span className="text-xs text-muted-foreground">
                      ({summary.todayJobs} jobs)
                    </span>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm">This Week</span>
              </div>
              {loading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <p className="text-2xl font-bold text-primary">
                  ₹{summary.weeklyEarnings.toLocaleString()}
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Earnings History */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IndianRupee className="w-5 h-5 text-primary" />
              Transaction History
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="p-4 space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-16 rounded-lg" />
                ))}
              </div>
            ) : earnings.length === 0 ? (
              <div className="py-12 text-center text-muted-foreground">
                <IndianRupee className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>No earnings yet</p>
                <p className="text-sm">Complete jobs to start earning</p>
              </div>
            ) : (
              <ScrollArea className="h-[400px]">
                <div className="p-4 space-y-3">
                  {earnings.map((earning) => (
                    <div
                      key={earning.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center">
                          <ArrowUpRight className="w-5 h-5 text-success" />
                        </div>
                        <div>
                          <p className="font-medium">
                            {earning.description || "Job Payment"}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(earning.earned_at), "MMM d, yyyy • h:mm a")}
                          </p>
                        </div>
                      </div>
                      <p className="text-lg font-semibold text-success">
                        +₹{Number(earning.amount).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      </main>

      <PortalNav />
    </div>
  );
}
