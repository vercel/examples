import { IconKey } from "app/components/icons/Icons";

// The registry is the single source of truth: `Sections` is DERIVED from the
// array below, so adding a section means adding one entry — sibling section
// PRs no longer edit the same union line (a past merge-conflict trap).
const SectionConfig = [
  {
    key: "projects",
    name: "Projects",
    headerIconKey: "projectSection",
  },
  {
    key: "about",
    name: "About",
    headerIconKey: "aboutSection",
  },
  {
    key: "experience",
    name: "Experience",
    headerIconKey: "schedule",
  },
  {
    key: "review",
    name: "Reviews",
    headerIconKey: "reviewSection",
  },
  {
    key: "contact",
    name: "Contact",
    headerIconKey: "email",
  },
] as const;

export type Sections = (typeof SectionConfig)[number]["key"];

export interface SectionConfigType {
  key: Sections;
  name: string;
  headerIconKey: IconKey;
}

export default SectionConfig as ReadonlyArray<SectionConfigType>;
