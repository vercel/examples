import React, { ReactNode } from "react";
import { getIcon } from "../components/icons/Icons";

export interface ProjectLink {
  tooltip: string;
  link: string;
  icon: ReactNode;
}

export interface Project {
  name: string;
  icon: ReactNode;
  description: React.ReactNode;
  duration: string;
  coverImage: string;
  links: ProjectLink[];
}

// Placeholder projects — edit this file to add your own. Cover images default
// to public/images/bg0{1,2,3}.webp; swap for project-specific artwork when
// you have it. The data lives in app/config/ so the Section component reads
// from one place (matches the pattern of ExperienceConfig / ReviewsConfig).
const ProjectsConfig: Project[] = [
  {
    name: "Example Project 1",
    icon: getIcon("smartToy"),
    duration: "2025",
    coverImage: "/images/bg01.webp",
    description: (
      <>
        Replace this with a short description. Lead with the <b>problem</b>, then the <b>tech</b>{" "}
        you used, then the <b>outcome</b> if it&apos;s interesting.
      </>
    ),
    links: [
      {
        tooltip: "See source",
        link: "https://example.com",
        icon: getIcon("code"),
      },
    ],
  },
  {
    name: "Example Project 2",
    icon: getIcon("app"),
    duration: "2024",
    coverImage: "/images/bg02.webp",
    description: (
      <>
        Replace this with a short description. One or two sentences is plenty — visitors want the
        gist, not a thesis.
      </>
    ),
    links: [
      {
        tooltip: "See source",
        link: "https://example.com",
        icon: getIcon("code"),
      },
      {
        tooltip: "Live demo",
        link: "https://example.com",
        icon: getIcon("link"),
      },
    ],
  },
  {
    name: "Example Project 3",
    icon: getIcon("security"),
    duration: "2023",
    coverImage: "/images/bg03.webp",
    description: (
      <>
        Replace this with a short description. You don&apos;t need to list every feature — focus on
        what makes this one interesting.
      </>
    ),
    links: [],
  },
];

export default ProjectsConfig;
