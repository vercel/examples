#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const resumeDir = path.join(process.cwd(), "app", "resume");
const pagePath = path.join(resumeDir, "page.tsx");
const dataPath = path.join(resumeDir, "data.ts");

if (fs.existsSync(pagePath)) {
  console.error("Error: Resume page already exists at app/resume/page.tsx");
  process.exit(1);
}

// Read author name from config
let authorName = "Geon";
try {
  const configPath = path.join(process.cwd(), "next-log.config.ts");
  const configContent = fs.readFileSync(configPath, "utf8");
  const match = configContent.match(/name:\s*["']([^"']+)["']/);
  if (match && match[1] !== "Author") authorName = match[1];
} catch {}

fs.mkdirSync(resumeDir, { recursive: true });

// --- data.ts ---
const dataTemplate = `export const resumeData = {
  name: "${authorName}",
  title: "Frontend Engineer",
  summary:
    "Passionate frontend engineer with experience building modern web applications. Focused on user experience, performance, and clean code.",

  experience: [
    {
      company: "Tech Corp",
      position: "Senior Frontend Engineer",
      period: "2022.03 ~ Present",
      summary: "Leading frontend development for the main product.",
      projects: [
        {
          name: "Design System",
          duration: "2023.01 ~ Present",
          description:
            "Built and maintained a company-wide design system used by 5 teams.",
          responsibilities: [
            "Developed 30+ reusable React components with Storybook documentation",
            "Reduced UI inconsistencies by 80% across products",
            "Implemented automated visual regression testing with Chromatic",
          ],
        },
        {
          name: "Performance Optimization",
          duration: "2022.06 ~ 2022.12",
          description:
            "Led a performance initiative to improve Core Web Vitals.",
          responsibilities: [
            "Reduced LCP from 4.2s to 1.8s through code splitting and image optimization",
            "Implemented lazy loading for below-the-fold components",
            "Set up performance monitoring with custom dashboards",
          ],
        },
      ],
    },
    {
      company: "Startup Inc",
      position: "Frontend Engineer",
      period: "2020.01 ~ 2022.02",
      summary: "Full-stack web development for an early-stage startup.",
      projects: [
        {
          name: "Customer Dashboard",
          duration: "2020.06 ~ 2022.02",
          description:
            "Built the main customer-facing dashboard from scratch.",
          responsibilities: [
            "Developed responsive dashboard with React and TypeScript",
            "Integrated RESTful APIs with React Query for data fetching",
            "Implemented real-time notifications using WebSocket",
          ],
        },
      ],
    },
  ],

  skills: [
    {
      category: "Frontend",
      items: [
        "React, Next.js, TypeScript — primary stack for all projects",
        "Tailwind CSS, CSS Modules — styling approaches",
        "React Query, Zustand — state management and data fetching",
      ],
    },
    {
      category: "Tools & Infrastructure",
      items: [
        "Git, GitHub Actions — version control and CI/CD",
        "Storybook, Chromatic — component documentation and visual testing",
        "Vercel, AWS — deployment and hosting",
      ],
    },
  ],
};
`;

// --- page.tsx ---
const pageTemplate = `import { resumeData } from "./data";

export default function ResumePage() {
  return (
    <section className="flex flex-col gap-16 pt-12 pb-14 w-full md:w-[900px] m-auto px-4 md:px-0">
      {/* Header */}
      <header>
        <h1 className="text-3xl font-bold">{resumeData.name}</h1>
        <p className="text-lg text-muted-foreground mt-1">
          {resumeData.title}
        </p>
        <p className="mt-4 text-muted-foreground leading-relaxed">
          {resumeData.summary}
        </p>
      </header>

      {/* Experience */}
      <div>
        <h2 className="text-xl font-semibold mb-8 pb-2 border-b">
          Experience
        </h2>
        <div className="flex flex-col gap-12">
          {resumeData.experience.map((exp) => (
            <div
              key={exp.company}
              className="flex flex-col md:flex-row gap-6 md:gap-12"
            >
              {/* Left: Company info (sticky on desktop) */}
              <div className="md:w-[200px] shrink-0 md:sticky md:top-20 md:self-start">
                <h3 className="font-semibold text-lg">{exp.company}</h3>
                <p className="text-sm text-muted-foreground">
                  {exp.position}
                </p>
                <p className="text-sm text-muted-foreground">{exp.period}</p>
                {exp.summary && (
                  <p className="text-sm text-muted-foreground mt-2">
                    {exp.summary}
                  </p>
                )}
              </div>
              {/* Right: Projects */}
              <div className="flex-1 flex flex-col gap-8">
                {exp.projects.map((project) => (
                  <div key={project.name}>
                    <h4 className="font-medium">{project.name}</h4>
                    <p className="text-xs text-muted-foreground mb-2">
                      {project.duration}
                    </p>
                    <p className="text-sm text-muted-foreground mb-3">
                      {project.description}
                    </p>
                    <ul className="list-disc list-outside ml-4 text-sm text-muted-foreground space-y-1">
                      {project.responsibilities.map((r, i) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Skills */}
      <div>
        <h2 className="text-xl font-semibold mb-8 pb-2 border-b">Skills</h2>
        <div className="flex flex-col gap-6">
          {resumeData.skills.map((skill) => (
            <div key={skill.category}>
              <h3 className="font-medium mb-2">{skill.category}</h3>
              <ul className="list-disc list-outside ml-4 text-sm text-muted-foreground space-y-1">
                {skill.items.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
`;

fs.writeFileSync(dataPath, dataTemplate);
fs.writeFileSync(pagePath, pageTemplate);

console.log("Created: app/resume/data.ts");
console.log("Created: app/resume/page.tsx");
console.log("");
console.log("Resume link will automatically appear in the header navigation.");
console.log("Edit app/resume/data.ts to update your resume content.");
