import { DashboardHeader } from "./dashboard-header";
import { DashboardLayout } from "./dashboard-layout";
import { MetricCards } from "./metric-cards";
import { RecentActivity } from "./recent-activity";
import { WeeklyChart } from "./weekly-chart";
import { Card } from "@/components/ui/card";

export default function Dashboard() {
  // This data could come from a database or API call in a real application
  const chartData = [
    { day: "Mon", value: 65, color: "hsl(var(--primary))" },
    { day: "Tue", value: 85, color: "hsl(var(--chart-1))" },
    { day: "Wed", value: 70, color: "hsl(var(--chart-2))" },
    { day: "Thu", value: 95, color: "hsl(var(--chart-3))" },
    { day: "Fri", value: 45, color: "hsl(var(--chart-4))" },
  ];

  return (
    <DashboardLayout>
      <DashboardHeader />
      <main className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        </div>
        <div className="space-y-4">
          <MetricCards />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <WeeklyChart chartData={chartData} />
            <Card className="col-span-3">
              <RecentActivity />
            </Card>
          </div>
        </div>
      </main>
    </DashboardLayout>
  );
}
