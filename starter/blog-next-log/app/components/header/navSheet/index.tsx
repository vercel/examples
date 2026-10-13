"use client";

import Link from "next/link";
import { getConfig } from "~lib/config";
import MenuIcon from "~components/icon/menuIcon";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~components/ui/sheet";

interface NavItem {
  label: string;
  path: string;
}

function NavSheet({ navItems }: { navItems: NavItem[] }) {
  const config = getConfig();

  const socialLinks = [
    config.social.github && { label: "GitHub", href: config.social.github },
    config.social.linkedin && {
      label: "LinkedIn",
      href: config.social.linkedin,
    },
  ].filter(Boolean) as { label: string; href: string }[];

  return (
    <Sheet>
      <SheetTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:text-accent-foreground h-9 py-2 mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden">
        <MenuIcon />
      </SheetTrigger>
      <SheetContent side={"left"}>
        <SheetHeader className="text-left">
          <SheetTitle>
            <Link className="flex items-center" href="/">
              <span className="font-bold">{config.author.name}</span>
            </Link>
          </SheetTitle>
          <SheetDescription className="relative overflow-hidden my-4 h-[calc(100vh-8rem)] pb-10 pl-6">
            <div className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className="text-base font-medium text-foreground/80 hover:text-foreground transition-colors"
                >
                  {item.label}
                </Link>
              ))}
              {socialLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  className="text-base font-medium text-foreground/80 hover:text-foreground transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}

export default NavSheet;
