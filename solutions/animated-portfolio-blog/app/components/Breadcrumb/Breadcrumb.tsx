"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import React from "react";
import { getIcon } from "../icons/Icons";
import { playSound } from "@/lib/sound";
import "./Breadcrumb.scss";

const Breadcrumb: React.FC = () => {
  const pathname = usePathname(); // e.g., /blog/2025/post-title

  // Split the path into parts
  const pathParts = pathname.split("/").filter(Boolean);

  // Build paths with hrefs
  const paths = pathParts.map((part, index) => {
    const href = "/" + pathParts.slice(0, index + 1).join("/");
    // Convert slug-like path to human readable, e.g., "post-title" => "Post Title"
    const name = part
      .replace(/-[a-zA-Z0-9]+$/, "") // remove trailing IDs or slugs if any
      .replace(/-/g, " ") // replace hyphens with spaces
      .replace(/\b\w/g, (l) => l.toUpperCase()); // capitalize first letter of each word

    return { name, href };
  });

  return (
    <nav className="breadcrumb flex items-center gap-2 text-sm whitespace-nowrap overflow-x-auto no-scrollbar">
      {/* Home Button */}
      <Link href="/" className="link-underline" onMouseEnter={() => playSound("hover")}>
        {getIcon("home", "inline-block mr-1 mb-0.5 !w-4 !h-4")}
        Home
      </Link>

      {/* Breadcrumb Links */}
      {paths.map((path, index) => (
        <React.Fragment key={index}>
          <span className="breadcrumb__separator mx-1">/</span>
          {index === paths.length - 1 ? (
            <span className="breadcrumb__current font-semibold truncate max-w-[200px] block">
              {path.name}
            </span>
          ) : (
            <Link href={path.href} className="link-underline" onMouseEnter={() => playSound("hover")}>
              {path.name}
            </Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumb;
