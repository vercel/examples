import React, { forwardRef } from "react";
import Section from "../../Section/Section";
import SectionConfig from "../../../config/SectionConfig";
import ExperienceConfig from "../../../config/ExperienceConfig";
import MotionDiv from "../../animaiton/MotionDiv";
import { slideInLeft, slideInRight } from "../../animaiton/presets";
import { getIcon, getIconLabel } from "../../icons/Icons";
import { TiltCard } from "../../TiltCard/TiltCard";
import "./ExperienceSection.scss";

const experienceSectionConfig = SectionConfig.find((section) => section.key === "experience")!;

/**
 * Work-history timeline. Single left rail at every breakpoint — rail + dots
 * on the left, cards stacked vertically to the right. Each card uses the
 * shared TiltCard wrapper so the 3D cursor tilt matches the Reviews cards.
 * Entry data lives in ExperienceConfig.
 */
const ExperienceSection = forwardRef<HTMLDivElement>((_, ref) => (
  <Section ref={ref} sectionConfig={experienceSectionConfig} extraClass="experience-section">
    <div className="experience-timeline">
      {ExperienceConfig.map((entry, i) => (
        <MotionDiv
          // Index disambiguates same-org entries (promotions, dual titles).
          key={`${entry.org}-${entry.period}-${i}`}
          variants={i % 2 === 0 ? slideInLeft : slideInRight}
          className="experience-timeline__item"
          delay={i * 0.1}
        >
          <span className="experience-timeline__dot" aria-hidden="true" />
          <TiltCard className="tilt-card experience-timeline__card glass-card">
            <span className="experience-timeline__period">
              {entry.period} · {entry.type}
            </span>
            <h3 className="experience-timeline__role">{entry.role}</h3>
            <p className="experience-timeline__org">
              {entry.org} · {entry.location}
            </p>
            <p className="experience-timeline__description">{entry.description}</p>
            {entry.tech.length > 0 && (
              <ul className="experience-timeline__tech">
                {entry.tech.map((key) => (
                  <li key={key} className="experience-timeline__chip pill">
                    {getIcon(key)}
                    <span>{getIconLabel(key)}</span>
                  </li>
                ))}
              </ul>
            )}
          </TiltCard>
        </MotionDiv>
      ))}
    </div>
  </Section>
));

ExperienceSection.displayName = "ExperienceSection";

export default ExperienceSection;
