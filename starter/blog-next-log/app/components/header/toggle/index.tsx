"use client";

import { useState, useEffect } from "react";
import { useTheme } from "~styles/themeProvider";
import Link from "next/link";

import { getConfig } from "~lib/config";
import GithubIcon from "~components/icon/githubIcon";
import LinkedInIcon from "~components/icon/linkedInIcon";
import MoonIcon from "~components/icon/moonIcon";
import SunIcon from "~components/icon/sunIcon";

import { Button } from "~components/ui/button";

function NavToggles() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const config = getConfig();

  useEffect(() => setMounted(true), []);

  const changeTheme = () => {
    if (resolvedTheme === "dark") {
      setTheme("light");
    } else {
      setTheme("dark");
    }
  };

  return (
    <nav className="flex items-center">
      {config.social.github && (
        <Link href={config.social.github} target="_blank" passHref>
          <Button variant="ghost" className="w-9 shrink-0 px-0">
            <GithubIcon className="h-4 w-4" />
          </Button>
        </Link>
      )}
      {config.social.linkedin && (
        <Link href={config.social.linkedin} target="_blank" passHref>
          <Button variant="ghost" className="w-9 shrink-0 px-0">
            <LinkedInIcon className="h-4 w-4" />
          </Button>
        </Link>
      )}
      <Button
        variant="ghost"
        className="w-9 shrink-0 px-0"
        onClick={changeTheme}
        aria-label="Toggle theme"
      >
        {mounted && resolvedTheme === "dark" ? (
          <SunIcon className="h-4 w-4" />
        ) : (
          <MoonIcon className="h-4 w-4" />
        )}
      </Button>
    </nav>
  );
}

export default NavToggles;
