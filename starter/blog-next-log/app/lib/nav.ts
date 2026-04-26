import fs from "fs";
import path from "path";

export function getNavItems() {
  const items: { label: string; path: string }[] = [];
  const resumePath = path.join(process.cwd(), "app", "resume", "page.tsx");
  if (fs.existsSync(resumePath)) {
    items.push({ label: "Resume", path: "/resume" });
  }
  return items;
}
