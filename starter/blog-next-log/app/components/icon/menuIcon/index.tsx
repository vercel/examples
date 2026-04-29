import { IconProps } from "~types/icon";

const MenuIcon = (props: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={20}
    fill="none"
    {...props}
  >
    <g transform="scale(1.3333)">
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M8 2h5.5a.5.5 0 0 1 .5.5v10a.5.5 0 0 1-.5.5H8V2ZM7 2H1.5a.5.5 0 0 0-.5.5v10a.5.5 0 0 0 .5.5H7V2Zm-7 .5A1.5 1.5 0 0 1 1.5 1h12A1.5 1.5 0 0 1 15 2.5v10a1.5 1.5 0 0 1-1.5 1.5h-12A1.5 1.5 0 0 1 0 12.5v-10Z"
        clipRule="evenodd"
      />
    </g>
  </svg>
);
export default MenuIcon;
