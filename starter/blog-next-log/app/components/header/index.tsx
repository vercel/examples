import { getNavItems } from "~lib/nav";
import NavToggles from "./toggle";
import PageNav from "./nav";

function Header() {
  const navItems = getNavItems();

  return (
    <header className="sticky top-0 z-10 w-full border-b bg-background/95 backdrop-blur">
      <nav aria-label="Main navigation" className="container flex h-14 items-center justify-between lg:px-8">
        <div className="md:flex">
          <PageNav navItems={navItems} />
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <NavToggles />
        </div>
      </nav>
    </header>
  );
}

export default Header;
