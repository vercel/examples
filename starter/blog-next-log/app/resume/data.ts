export const resumeData = {
  name: "Geon",
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
