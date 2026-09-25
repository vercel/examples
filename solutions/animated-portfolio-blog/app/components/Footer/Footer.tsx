import React from "react";
import CircleButton from "../CircleButton/CircleButton";
import Magnetic from "../Magnetic/Magnetic";
import CommonConfig from "../../config/CommonConfig";
import { getIcon, IconKey } from "../icons/Icons";
import "./Footer.scss";

// Hoist the year — the date never changes during the lifetime of the page.
// Re-evaluating it on every Footer render was the only reason this lived
// inside the component.
const CURRENT_YEAR = new Date().getFullYear();

const Footer: React.FC = () => (
  <footer className="footer">
    <p>Copyright &copy; {CURRENT_YEAR} All rights reserved</p>
    <div>
      {CommonConfig.social.map((socialDetails, index) => (
        <Magnetic key={`footer-social-${index}`} strength={0.4}>
          <CircleButton
            tooltip={socialDetails.name}
            link={socialDetails.link}
            target="_blank"
          >
            {socialDetails.iconKey
              ? getIcon(socialDetails.iconKey)
              : getIcon(socialDetails.name.toLowerCase() as IconKey)}
          </CircleButton>
        </Magnetic>
      ))}
    </div>
  </footer>
);

export default Footer;
