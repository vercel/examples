"use client";

import Link from "next/link";
import useIsRouteActive from "~hooks/useIsActive";
import { getConfig } from "~lib/config";
import { cn } from "~lib/utils";
import NavSheet from "../navSheet";

interface NavItem {
  label: string;
  path: string;
}

function PageNav({ navItems }: { navItems: NavItem[] }) {
  const config = getConfig();

  return (
    <div className="md:flex">
      <Link
        href="/"
        className="hidden md:flex mr-6 items-center space-x-2"
      >
        <span className="font-bold sm:inline-block">{config.author.name}</span>
      </Link>
      <nav className="hidden md:flex gap-6 items-center font-medium text-sm">
        {navItems.map((item) => (
          <NavLink key={item.path} href={item.path} label={item.label} />
        ))}
      </nav>
      <NavSheet navItems={navItems} />
    </div>
  );
}

function NavLink({ href, label }: { href: string; label: string }) {
  const isActive = useIsRouteActive(href);

  return (
    <Link
      href={href}
      className={cn(
        "transition-colors hover:text-foreground/80 text-foreground/60",
        isActive && "text-foreground"
      )}
    >
      {label}
    </Link>
  );
}

export default PageNav;
