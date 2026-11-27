"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { TypeAnimation } from "react-type-animation";
import { motion, useMotionValue, useSpring } from "motion/react";
import CircleButton from "../../CircleButton/CircleButton";
import Magnetic from "../../Magnetic/Magnetic";
import { useCursorMotionGate } from "../../animaiton/useCursorMotionGate";
import CommonConfig from "../../../config/CommonConfig";
import { getIcon, IconKey } from "../../icons/Icons";
import "./TopSection.scss";

// Variable-font weight range for the name.
const WEIGHT_REST = 500;
const WEIGHT_MIN = 300;
const WEIGHT_MAX = 800;

const TopSection: React.FC = () => {
  const pathRef = useRef<SVGPathElement | null>(null);
  const nameRef = useRef<HTMLHeadingElement | null>(null);

  const enabled = useCursorMotionGate();

  const weight = useMotionValue(WEIGHT_REST);
  const weightSpring = useSpring(weight, { stiffness: 150, damping: 20, mass: 0.4 });

  useEffect(() => {
    const pathElement = pathRef.current;
    if (pathElement && CommonConfig.signature?.viewBox) {
      const signatureLength = pathElement.getTotalLength();
      pathElement.setAttribute("stroke-dasharray", signatureLength.toString());
      pathElement.setAttribute("stroke-dashoffset", signatureLength.toString());

      const viewBoxCoords = CommonConfig.signature.viewBox
        .split(" ")
        .map((val) => parseInt(val, 10));
      if (viewBoxCoords.length > 0) {
        pathElement.setAttribute("stroke-width", (Math.max(...viewBoxCoords) / 100).toString());
      }
    }
  }, []);

  const handlePointerMove = (e: React.PointerEvent<HTMLHeadingElement>) => {
    const el = nameRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const center = rect.left + rect.width / 2;
    // Distance from cursor to name's horizontal center, normalized 0..1 at the
    // rect's half-width (closer = higher proximity).
    const half = Math.max(1, rect.width / 2);
    const distance = Math.abs(e.clientX - center);
    const proximity = Math.max(0, 1 - distance / half);
    weight.set(WEIGHT_MIN + proximity * (WEIGHT_MAX - WEIGHT_MIN));
  };

  const resetWeight = () => weight.set(WEIGHT_REST);

  return (
    // The `id="top"` is referenced by SectionNav's scroll-spy (Home dot) and
    // by scrollToSection("top"). Don't rename without updating SectionNav.
    <section className="top-section" id="top">
      <div className="signature">
        <div className="avatar">
          <Image
            className="profile-picture"
            src={CommonConfig.heroImage}
            alt={CommonConfig.heroImageAlt}
            width={356}
            height={466}
            priority
          />
        </div>
        {CommonConfig.signature.signaturePathD && (
          <svg viewBox={CommonConfig.signature.viewBox} aria-hidden="true">
            <path
              ref={pathRef}
              id="signature-path"
              stroke="var(--text-primary)"
              fill="none"
              d={CommonConfig.signature.signaturePathD}
            />
          </svg>
        )}
      </div>

      <div className="intro">
        <p className="intro__kicker">Hello, I&apos;m</p>
        <motion.h1
          ref={nameRef}
          className="intro__name"
          style={{ fontWeight: enabled ? weightSpring : WEIGHT_REST }}
          onPointerMove={enabled ? handlePointerMove : undefined}
          onPointerLeave={enabled ? resetWeight : undefined}
        >
          {CommonConfig.name}
        </motion.h1>
        <TypeAnimation
          sequence={CommonConfig.taglines.flatMap((t) => [`${t}...`, 2000])}
          wrapper="h2"
          className="intro__tagline"
          repeat={Infinity}
        />
      </div>
      <div className="social">
        {CommonConfig.social.map((socialDetails, index) => (
          <Magnetic key={`top-section-social-${index}`} strength={0.4}>
            <CircleButton tooltip={socialDetails.name} link={socialDetails.link} target="_blank">
              {socialDetails.iconKey
                ? getIcon(socialDetails.iconKey)
                : getIcon(socialDetails.name.toLowerCase() as IconKey)}
            </CircleButton>
          </Magnetic>
        ))}
      </div>
    </section>
  );
};

export default TopSection;
