import * as React from "react";
const SvgKotlin = (props: React.SVGProps<SVGSVGElement>) => (
  <svg fill="#000000" viewBox="0 0 24 24" {...props}>
    <path
      fill="currentColor"
      d="M1.3 24l11.3-11.5L24 24zM0 0h12L0 12.5zM13.4 0L0 14v10l12-12L24 0z"
    />
  </svg>
);
SvgKotlin.displayName = "SvgKotlin";
export default SvgKotlin;
