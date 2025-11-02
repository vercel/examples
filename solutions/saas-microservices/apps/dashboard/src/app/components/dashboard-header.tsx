import { cookies, headers } from "next/headers";
import { Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/theme-toggle";
import { fetchApi } from "@/lib/fetch-api";

interface User {
  name: string;
}

export async function DashboardHeader() {
  const user = await fetchApi<User>("/api/users/user");

  return (
    <header className="flex h-14 items-center gap-4 border-b bg-background px-6">
      <form className="flex-1">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search..."
            className="w-full appearance-none bg-background pl-8 md:w-2/3 lg:w-1/3"
          />
        </div>
      </form>
      <span className="text-sm">{user.name}</span>
      <ThemeToggle />
      <Button variant="ghost" size="icon" className="relative">
        <Bell className="h-4 w-4" />
        <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-primary" />
        <span className="sr-only">Notifications</span>
      </Button>
    </header>
  );
}
