"use client";

import React, { CSSProperties, ReactNode } from "react";
import clsx from "clsx";
import { PlacesType } from "react-tooltip";
import { TooltipId } from "../tooltip";
import { playSound } from "@/lib/sound";
import "./CircleButton.scss";

interface CircleButtonProps {
  link?: string;
  target?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>;
  className?: string;
  style?: CSSProperties;
  size?: number;
  tooltip?: string;
  tooltipPlacement?: PlacesType;
  children?: ReactNode;
  isAnimated?: boolean;
  "aria-label"?: string;
  "aria-hidden"?: boolean;
  "aria-expanded"?: boolean;
  "aria-controls"?: string;
  inert?: boolean;
}

const CircleButton: React.FC<CircleButtonProps> = ({
  link,
  target,
  onClick,
  className,
  style,
  size = 2.5,
  tooltip,
  tooltipPlacement = "top",
  children,
  isAnimated = true,
  "aria-label": ariaLabel,
  "aria-hidden": ariaHidden,
  "aria-expanded": ariaExpanded,
  "aria-controls": ariaControls,
  inert,
}) => {
  const combinedClassName = clsx("circle-button", className, {
    "circle-button-animated": isAnimated,
  });
  const sizeStyle = { width: `${size}rem`, height: `${size}rem` };
  const buttonStyle = { ...sizeStyle, ...style };

  // Forwarded to both render paths. `inert` removes the element from the tab
  // order + accessibility tree + disables pointer events — used by MenuItem
  // when the radial menu is closed. aria-* exposed for MenuToggle state.
  // NOTE: spread below is positioned AFTER the explicit `aria-label={...}`
  // on each render path. Keep it that way — if `aria-label` is ever added to
  // this object, it would silently override the per-instance label.
  const a11yProps = {
    inert: inert || undefined,
    "aria-hidden": ariaHidden || undefined,
    "aria-expanded": ariaExpanded,
    "aria-controls": ariaControls,
  };

  return link ? (
    <a
      href={link}
      target={target}
      onClick={onClick}
      onMouseEnter={() => playSound("hover")}
      className={combinedClassName}
      style={buttonStyle}
      rel={target === "_blank" ? "noopener noreferrer" : undefined}
      aria-label={ariaLabel ?? tooltip}
      data-tooltip-id={TooltipId}
      data-tooltip-content={tooltip}
      data-tooltip-place={tooltipPlacement}
      {...a11yProps}
    >
      {children}
    </a>
  ) : (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => playSound("hover")}
      className={combinedClassName}
      style={buttonStyle}
      aria-label={ariaLabel ?? tooltip}
      data-tooltip-id={TooltipId}
      data-tooltip-content={tooltip}
      data-tooltip-place={tooltipPlacement}
      {...a11yProps}
    >
      {children}
    </button>
  );
};

export default CircleButton;
