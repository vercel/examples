"use client";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { DashboardNav } from "./dashboard-nav";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <DashboardNav />
        <SidebarInset className="flex w-full flex-col">{children}</SidebarInset>
      </div>
    </SidebarProvider>
  );
}
