import { resumeData } from "./data";

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
