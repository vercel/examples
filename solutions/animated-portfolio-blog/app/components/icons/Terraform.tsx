import * as React from "react";
const SvgTerraform = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 1024 1024" {...props}>
    <circle cx={512} cy={512} r={512} fill="var(--text-primary)" />
    <path
      d="M597.33 427.09v161.54l139.95-80.73V346.2ZM442 346.2l140 80.89v161.54l-140-80.81ZM286.72 256v161.62l139.95 80.81V336.81ZM442 687.19 582 768V606.38l-140-80.81Z"
      fill="var(--bg-primary)"
    />
  </svg>
);
SvgTerraform.displayName = "SvgTerraform";
export default SvgTerraform;
