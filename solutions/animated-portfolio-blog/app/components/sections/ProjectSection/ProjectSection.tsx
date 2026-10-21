"use client";

import React, { forwardRef, useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

import Section from "../../Section/Section";
import SectionConfig from "../../../config/SectionConfig";
import { TiltCard } from "../../TiltCard/TiltCard";
import MotionDiv from "../../animaiton/MotionDiv";
import { slideInUp } from "../../animaiton/presets";
import { getIcon } from "../../icons/Icons";
import { playSound } from "@/lib/sound";
import Projects from "@/app/config/ProjectsConfig";
import "./ProjectSection.scss";

const projectSectionConfig = SectionConfig.find((section) => section.key === "projects")!;

/**
 * Carousel of project cover cards + an active-project inspection pane below.
 * The carousel cards use the shared TiltCard wrapper so the cursor-driven 3D
 * tilt matches the Reviews/Experience cards. The inspect pane re-mounts on
 * selection change via a key, so the `slideInUp` preset re-runs the entrance
 * animation each time the user picks a different project.
 */
const ProjectSection = forwardRef<HTMLDivElement>((_, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const isScrollingRef = useRef(false);

  // Programmatic scroll-to-index handler (used by arrow clicks & pagination dots)
  const scrollToIndex = useCallback((index: number) => {
    const container = carouselRef.current;
    if (!container) return;

    isScrollingRef.current = true;
    const cardElement = container.children[index] as HTMLElement;
    if (cardElement) {
      // Center the active card in the viewport
      const leftPosition =
        cardElement.offsetLeft - container.offsetWidth / 2 + cardElement.offsetWidth / 2;
      container.scrollTo({
        left: leftPosition,
        behavior: "smooth",
      });
    }
    setSelectedIndex(index);
    playSound("select");

    // Release scroll block after smooth scrolling animation completes
    setTimeout(() => {
      isScrollingRef.current = false;
    }, 450);
  }, []);

  // Scroll listener to update selectedIndex on manual scroll/swipe
  const handleScroll = () => {
    if (isScrollingRef.current) return;
    const container = carouselRef.current;
    if (!container) return;

    const containerCenter = container.scrollLeft + container.offsetWidth / 2;
    let closestIndex = 0;
    let minDistance = Infinity;

    Array.from(container.children).forEach((child, index) => {
      const card = child as HTMLElement;
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;
      const distance = Math.abs(containerCenter - cardCenter);
      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = index;
      }
    });

    if (closestIndex !== selectedIndex) {
      setSelectedIndex(closestIndex);
      playSound("hover");
    }
  };

  // Keyboard navigation listener (Arrow keys + Enter)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        const nextIndex = (selectedIndex + 1) % Projects.length;
        scrollToIndex(nextIndex);
      } else if (e.key === "ArrowLeft") {
        const nextIndex = (selectedIndex - 1 + Projects.length) % Projects.length;
        scrollToIndex(nextIndex);
      } else if (e.key === "Enter" || e.key === " ") {
        const activeProj = Projects[selectedIndex];
        if (activeProj.links.length > 0) {
          e.preventDefault();
          playSound("select");
          window.open(activeProj.links[0].link, "_blank", "noopener,noreferrer");
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex, scrollToIndex]);

  // Adjust scroll position if container is resized/initialized
  useEffect(() => {
    // Timeout to ensure offset positions are fully rendered in the DOM
    const t = setTimeout(() => {
      const container = carouselRef.current;
      if (!container) return;
      const cardElement = container.children[selectedIndex] as HTMLElement;
      if (cardElement) {
        const leftPosition =
          cardElement.offsetLeft - container.offsetWidth / 2 + cardElement.offsetWidth / 2;
        container.scrollLeft = leftPosition;
      }
    }, 100);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const activeProject = Projects[selectedIndex];

  return (
    <Section ref={ref} sectionConfig={projectSectionConfig} extraClass="project-section">
      <div className="project-carousel">
        <button
          className="project-carousel-btn prev"
          onClick={() => {
            const prevIndex = (selectedIndex - 1 + Projects.length) % Projects.length;
            scrollToIndex(prevIndex);
          }}
          aria-label="Select previous project"
        >
          <ChevronLeft />
        </button>

        <div className="project-carousel-viewport">
          <div className="project-carousel-list" ref={carouselRef} onScroll={handleScroll}>
            {Projects.map((project, index) => (
              <TiltCard
                key={project.name}
                className={`tilt-card project-card ${index === selectedIndex ? "selected" : ""}`}
              >
                <button
                  type="button"
                  className="project-card-cover"
                  onClick={() => scrollToIndex(index)}
                  aria-label={`Select ${project.name}`}
                  aria-pressed={index === selectedIndex}
                >
                  <Image
                    className="project-card-image"
                    src={project.coverImage}
                    alt={`${project.name} cover`}
                    fill
                    sizes="(min-width: 768px) 210px, 170px"
                    priority={index === 0}
                  />
                  <div className="project-card-overlay">
                    <div className="project-card-icon">{project.icon}</div>
                    <span className="project-card-name">{project.name}</span>
                  </div>
                </button>
              </TiltCard>
            ))}
          </div>
        </div>

        <button
          className="project-carousel-btn next"
          onClick={() => {
            const nextIndex = (selectedIndex + 1) % Projects.length;
            scrollToIndex(nextIndex);
          }}
          aria-label="Select next project"
        >
          <ChevronRight />
        </button>
      </div>

      <div className="project-pagination-dots">
        {Projects.map((_, index) => (
          <button
            key={Projects[index].name}
            className={`project-pagination-dot ${index === selectedIndex ? "active" : ""}`}
            onClick={() => scrollToIndex(index)}
            aria-label={`Go to project ${index + 1}`}
          />
        ))}
      </div>

      <div className="project-inspect">
        <MotionDiv key={selectedIndex} variants={slideInUp} className="project-inspect-content">
          <div className="project-inspect-header">
            <div className="project-inspect-icon">{activeProject.icon}</div>
            <div className="project-inspect-title-group">
              <h3 className="project-inspect-title">{activeProject.name}</h3>
              <h4 className="project-inspect-duration">
                {getIcon("schedule")}
                <span>{activeProject.duration}</span>
              </h4>
            </div>
          </div>

          <div className="project-inspect-body">
            <p className="project-inspect-description">{activeProject.description}</p>
          </div>

          {activeProject.links.length > 0 && (
            <div className="project-inspect-buttons">
              {activeProject.links.map((link) => (
                <a
                  key={link.link}
                  href={link.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="project-action-button"
                  onMouseEnter={() => playSound("hover")}
                >
                  <span className="project-action-icon">{link.icon}</span>
                  <span className="project-action-text">{link.tooltip}</span>
                </a>
              ))}
            </div>
          )}
        </MotionDiv>
      </div>
    </Section>
  );
});

ProjectSection.displayName = "ProjectSection";

export default ProjectSection;
