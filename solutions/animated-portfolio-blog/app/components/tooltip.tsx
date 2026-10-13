"use client";

import { Tooltip as ReactTooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";

export const TooltipId = "global-tooltip";

export default function Tooltip({
  style = {},
  ...props
}: React.ComponentProps<typeof ReactTooltip>) {
  return <ReactTooltip id={TooltipId} style={{ zIndex: 30000, ...style }} {...props} />;
}
