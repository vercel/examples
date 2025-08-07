import { cookies, headers } from "next/headers";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Activity {
  id: string;
  name: string;
  action: string;
  timestamp: string;
}

export async function RecentActivity() {
  const reqHeaders = await headers();
  const host = reqHeaders.get("host");
  const isLocalhost = !host || host.includes("localhost");
  const cookieStore = await cookies();
  const response = await fetch(
    `${isLocalhost ? "http://localhost:3024" : "https://saas-microservices-dashboard.vercel.app"}/api/dashboard/activity`,
    {
      headers: {
        Cookie: `saas_microservices_authed_user=${cookieStore.get("saas_microservices_authed_user")?.value}`,
      },
    },
  );
  const activities = (await response.json()).activities.slice(
    0,
    6,
  ) as Activity[];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest actions from your customers</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {activities.map((activity, index) => (
            <div key={index} className="flex items-center">
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">
                  {activity.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {activity.action}
                </p>
              </div>
              <div className="ml-auto text-sm text-muted-foreground">
                {activity.timestamp}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
