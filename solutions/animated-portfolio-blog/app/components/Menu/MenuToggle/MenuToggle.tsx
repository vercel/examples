import React from "react";
import CircleButton from "../../CircleButton/CircleButton";
import "./MenuToggle.scss";

interface MenuToggleProps {
  toggleMenu: () => void;
  isOpen: boolean;
}

const MenuToggle: React.FC<MenuToggleProps> = ({ toggleMenu, isOpen }) => (
  <CircleButton
    onClick={toggleMenu}
    size={4}
    className="menu-toggle"
    isAnimated={false}
    aria-label={isOpen ? "Close menu" : "Open menu"}
    aria-expanded={isOpen}
    aria-controls="menu-data"
  >
    <div className="menu-burger">
      <span className="menu-burger-bar"></span>
      <span className="menu-burger-bar"></span>
      <span className="menu-burger-bar"></span>
    </div>
  </CircleButton>
);

export default MenuToggle;
