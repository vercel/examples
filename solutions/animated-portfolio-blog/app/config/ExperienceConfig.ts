import { IconKey } from "../components/icons/Icons";

export type ExperienceEntry = {
  /** Job title, e.g. "Chief Technology Officer". */
  role: string;
  /** Company / organization name. */
  org: string;
  /** "City, Country" — shown next to the org. */
  location: string;
  /** Display period, e.g. "2023 — Present". */
  period: string;
  /** Employment type — "Full-time", "Contract", "Freelance", "Part-time". */
  type: string;
  /** Two-to-three-sentence summary of the role. */
  description: string;
  /** IconKeys rendered as chips under the description (see Icons.tsx). */
  tech: IconKey[];
};

// Curated highlight list, newest-first. Edit app/config/ExperienceConfig.ts to
// add your own entries — the Section renders one card per element in this
// array. Earliest roles can be summarized in a CV instead of listed here.
const ExperienceConfig: ExperienceEntry[] = [
  {
    role: "Software Engineer",
    org: "Example Co.",
    location: "Remote",
    period: "Jan 2025 — Present",
    type: "Full-time",
    description:
      "Replace this with a two-or-three-sentence summary of what you owned and shipped in the role. Lead with the impact, then the tech.",
    tech: ["typescript", "react"],
  },
  {
    role: "Software Engineer Intern",
    org: "Example Co.",
    location: "Remote",
    period: "Jun 2024 — Dec 2024",
    type: "Internship",
    description:
      "Replace this with a two-or-three-sentence summary. Keep it concrete — what did you build, what changed for the team or product.",
    tech: ["nodejs"],
  },
];

export default ExperienceConfig;
