import TopSection from "./components/sections/TopSection/TopSection";
import ProjectSection from "./components/sections/ProjectSection/ProjectSection";
import ReviewSection from "./components/sections/ReviewSection/ReviewSection";
import AboutSection from "./components/sections/AboutSection/AboutSection";
import ExperienceSection from "./components/sections/ExperienceSection/ExperienceSection";
import ContactSection from "./components/sections/ContactSection/ContactSection";
import SectionNav from "./components/SectionNav/SectionNav";

export default function Page() {
  return (
    <>
      <TopSection />
      <ProjectSection />
      <AboutSection />
      <ExperienceSection />
      <ReviewSection />
      <ContactSection />
      <SectionNav />
    </>
  );
}
