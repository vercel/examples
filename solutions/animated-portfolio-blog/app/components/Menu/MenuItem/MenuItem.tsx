import React, { CSSProperties } from "react";
import CircleButton from "../../CircleButton/CircleButton";
import "./MenuItem.scss";

export interface MenuItemType {
  icon: React.ReactNode;
  tooltip: string;
  action?: () => void;
  link?: string;
  key: string;
}

interface MenuItemProps {
  menuItem: MenuItemType;
  menuActive: boolean;
  isMobile: boolean;
  rotationAngle: number;
}

const activeTransformStyle = (angle1: number, angle2: number, isMobile: boolean): string => `
  translateY(${!isMobile ? "-50%" : "0"})
  rotate(${angle1}deg)
  translate(${isMobile ? 7 : 6}rem)
  rotate(${angle2}deg)
`;

const MenuItem: React.FC<MenuItemProps> = ({ menuItem, menuActive, isMobile, rotationAngle }) => {
  const style: CSSProperties = menuActive
    ? { transform: activeTransformStyle(rotationAngle, -rotationAngle, isMobile) }
    : {};

  return (
    <CircleButton
      className="menu-item"
      tooltip={menuItem.tooltip}
      onClick={menuItem.action}
      tooltipPlacement="right"
      size={isMobile ? 2 : 3}
      style={style}
      isAnimated={false}
      aria-label={menuItem.tooltip}
      link={menuItem.link}
      inert={!menuActive}
      aria-hidden={!menuActive || undefined}
    >
      {menuItem.icon}
    </CircleButton>
  );
};

export default MenuItem;
