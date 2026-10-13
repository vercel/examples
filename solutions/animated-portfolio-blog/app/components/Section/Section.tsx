"use client";

import React, { ReactNode, forwardRef, useRef, useEffect } from "react";
import { motion, useInView, Variants } from "motion/react";
import MotionDiv from "../animaiton/MotionDiv";
import { slideInLeft, slideInRight } from "../animaiton/presets";
import { getIcon } from "../icons/Icons";
import { SectionConfigType } from "app/config/SectionConfig";
import "./Section.scss";

interface SectionProps {
  sectionConfig: SectionConfigType;
  isReversed?: boolean; // Optional prop to reverse the section layout
  extraClass?: string;
  children?: ReactNode;
}

const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } }, // delay between each child animation
};

const Section = forwardRef<HTMLDivElement, SectionProps>(
  ({ sectionConfig, extraClass = "", children, isReversed = false }, ref) => {
    const internalRef = useRef<HTMLDivElement>(null);
    const innerDivRef = useRef<HTMLDivElement>(null);

    // Combine forwarded ref and internal ref
    useEffect(() => {
      if (!ref) return;
      if (typeof ref === "function") {
        ref(internalRef.current);
      } else {
        ref.current = internalRef.current;
      }
    }, [ref]);

    const isInView = useInView(internalRef, { amount: 0.2, once: true });
    // Scroll-spy trigger: section is "active" while its bounding box
    // intersects the viewport's vertical center line. Rootmargin of -50% top
    // and -50% bottom shrinks the IntersectionObserver root to a single line
    // at the viewport midpoint. This works for sections of any height
    // (including long ones like Experience where amount: 0.5 would never
    // fire — visible portion of a tall section is bounded by
    // viewport_height / section_height, which is < 50% in most cases).
    const isCurrentlyInView = useInView(internalRef, { margin: "-50% 0px -50% 0px" });

    useEffect(() => {
      if (!innerDivRef.current) return;
      const ACTIVE_CLASS = "section-active";
      const isActive = innerDivRef.current.classList.contains(ACTIVE_CLASS);

      if (!isActive && isCurrentlyInView) {
        document
          .querySelectorAll(`.${ACTIVE_CLASS}`)
          .forEach((e) => e.classList.remove(ACTIVE_CLASS));
        innerDivRef.current?.classList.add(ACTIVE_CLASS);
      } else if (isActive && !isCurrentlyInView) {
        innerDivRef.current?.classList.remove(ACTIVE_CLASS);
      }
    }, [isCurrentlyInView]);

    return (
      <motion.section
        className={`section-wrapper ${extraClass ? extraClass : ""}`}
        ref={internalRef}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={staggerContainer}
        id={sectionConfig.key}
      >
        <div className={`section${isReversed ? " section-reverse" : ""}`} ref={innerDivRef}>
          <h2 className="section-header">
            {getIcon(sectionConfig.headerIconKey, "section-header-icon")}
            {sectionConfig.name}
          </h2>
          <MotionDiv variants={isReversed ? slideInLeft : slideInRight} className="section-content">
            {children}
          </MotionDiv>
        </div>
      </motion.section>
    );
  }
);

Section.displayName = "Section";

export default Section;
