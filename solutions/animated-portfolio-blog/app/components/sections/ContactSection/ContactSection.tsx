import React, { forwardRef } from "react";
import Section from "../../Section/Section";
import SectionConfig from "../../../config/SectionConfig";
import CommonConfig, { getSocialLink } from "../../../config/CommonConfig";
import MotionDiv from "../../animaiton/MotionDiv";
import { zoomIn } from "../../animaiton/presets";
import { getIcon } from "../../icons/Icons";
import "./ContactSection.scss";

const contactSectionConfig = SectionConfig.find((section) => section.key === "contact")!;

// Drafts a starter email — the visitor's mail client (Gmail/Outlook via the
// OS mailto handler) opens with these prefilled. Edit CommonConfig.emailSubject
// and CommonConfig.emailBody to customize.
const emailHref = `mailto:${CommonConfig.email}?subject=${encodeURIComponent(
  CommonConfig.emailSubject
)}&body=${encodeURIComponent(CommonConfig.emailBody)}`;

/**
 * Closing beat of the page: one clear CTA (an "Email me" button that drafts
 * the email), the CV for detail, and the availability/location meta. Quiet
 * and centered — the hero carries the spectacle, this section just needs to
 * be easy to act on.
 */
const ContactSection = forwardRef<HTMLDivElement>((_, ref) => (
  <Section ref={ref} sectionConfig={contactSectionConfig} extraClass="contact-section">
    <MotionDiv variants={zoomIn} className="contact">
      <span className="contact__badge pill">
        <span className="contact__badge-dot" aria-hidden="true" />
        {CommonConfig.availability}
      </span>
      <h3 className="contact__heading">Let&apos;s build something together</h3>
      <p className="contact__lede">Open to interesting work — drop a line and let&apos;s talk.</p>
      <a className="contact__cta" href={emailHref}>
        {getIcon("email")}
        <span>Email me</span>
      </a>
      <div className="contact__meta">
        {CommonConfig.location && (
          <span className="contact__location">{CommonConfig.location}</span>
        )}
        {getSocialLink("cv") && (
          <a
            className="contact__cv"
            href={getSocialLink("cv")}
            target="_blank"
            rel="noopener noreferrer"
          >
            {getIcon("cv")}
            <span>View CV</span>
          </a>
        )}
      </div>
    </MotionDiv>
  </Section>
));

ContactSection.displayName = "ContactSection";

export default ContactSection;
