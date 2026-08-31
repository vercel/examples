"use client";

import React, { useState, useMemo, useEffect } from "react";
import MenuToggle from "./MenuToggle/MenuToggle";
import MenuItem, { MenuItemType } from "./MenuItem/MenuItem";
import ThemeToggleIcon from "./ThemeToggleIcon";
import SoundToggleIcon from "./SoundToggleIcon";
import { useIsDarkMode } from "./useIsDarkMode";
import { useIsMuted } from "./useIsMuted";
import { toggleSound } from "@/lib/sound";
import { getIcon } from "../icons/Icons";
import "./Menu.scss";

// Fixed global set: the radial menu renders the same four items in the same
// order on every route. Section-scroll shortcuts have moved to the home-only
// <SectionNav /> component (see app/page.tsx). Keep this list route-agnostic
// so the arc geometry stays constant across pages.
const Menu: React.FC = () => {
  const [menuActive, setMenuActive] = useState<boolean>(false);
  const isDark = useIsDarkMode();
  const isMuted = useIsMuted();

  const closeMenu = () => setMenuActive(false);

  const toggleTheme = () => {
    const nextDark = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", nextDark);
    localStorage.setItem("theme", nextDark ? "dark" : "light");
    // useIsDarkMode picks up the class change via its MutationObserver.
  };

  const menuItems: MenuItemType[] = useMemo(
    () => [
      {
        icon: getIcon("home", "menu-item-icon"),
        tooltip: "Home",
        link: "/",
        key: "menu-page-home",
      },
      {
        icon: getIcon("blog", "menu-item-icon"),
        tooltip: "Blog",
        link: "/blog",
        key: "menu-page-blog",
      },
      {
        icon: <ThemeToggleIcon isDark={isDark} />,
        tooltip: "Toggle dark/light theme",
        action: toggleTheme,
        key: "menu-theme-toggle",
      },
      {
        icon: <SoundToggleIcon isMuted={isMuted} />,
        tooltip: "Toggle sound effects",
        action: toggleSound,
        key: "menu-sound-toggle",
      },
    ],
    [isDark, isMuted]
  );

  // Media query is the right primitive: the browser fires only when the
  // (max-width: 768px) breakpoint is actually crossed, so we don't have to
  // debounce a resize listener that's checking the same condition ourselves.
  // Lazy initializer sets the value synchronously on first render (no flash
  // on mobile + no setState-in-effect). SSR snapshot returns false.
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(max-width: 768px)").matches;
  });

  useEffect(() => {
    const mql = window.matchMedia("(max-width: 768px)");
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  // Arc geometry: only depends on `isMobile`. Memoize so the angle increment
  // doesn't recompute when the menu opens/closes (the only thing that re-renders).
  const { startAngle, increment } = useMemo(() => {
    const startAngle = isMobile ? 0 : -90;
    const rotationAngle = isMobile ? 90 : 180;
    const increment = menuItems.length > 1 ? Math.round(rotationAngle / (menuItems.length - 1)) : 0;
    return { startAngle, increment };
  }, [isMobile, menuItems.length]);

  return (
    <div className={menuActive ? "menu menu-active" : "menu"}>
      <div className="menu-backdrop" onClick={closeMenu}></div>
      <div className="menu-data" id="menu-data">
        <MenuToggle toggleMenu={() => setMenuActive((m) => !m)} isOpen={menuActive} />

        {menuItems.map((menuItem, index) => (
          <MenuItem
            key={menuItem.key}
            menuItem={menuItem}
            menuActive={menuActive}
            isMobile={isMobile}
            rotationAngle={startAngle + index * increment}
          />
        ))}
      </div>
    </div>
  );
};

export default Menu;
