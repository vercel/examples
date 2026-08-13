import { AlertTriangle } from 'lucide-react'
import { AnimateOnView } from '~/components/core/animate-on-view'

const RISKS = [
  {
    label: 'UNTRUSTED SKILLS',
    description:
      '5,700+ unvetted community skills on ClawHub. Malicious ones were found within weeks.',
    answer: "TrustClaw runs on Composio's managed tool surface instead.",
  },
  {
    label: 'EXPOSED CREDENTIALS',
    description:
      'API keys stored in plaintext on your machine. 900+ instances found leaking tokens.',
    answer: 'TrustClaw never gives the agent a raw key.',
  },
  {
    label: 'UNSAFE CODE EXECUTION',
    description:
      'Scripts run locally with your permissions. One prompt injection from an email can trigger destructive commands.',
    answer: 'TrustClaw sandboxes all execution remotely.',
  },
] as const

export function SecuritySection() {
  return (
    <section className="px-4 py-16 md:px-6 md:py-24 lg:py-32">
      <div className="mx-auto max-w-4xl">
        <AnimateOnView className="mb-10 md:mb-16">
          <p className="text-muted-foreground mb-4 font-mono text-xs font-medium uppercase tracking-widest">
            Why not vanilla OpenClaw?
          </p>
          <h2 className="text-foreground text-2xl font-bold tracking-tight md:text-3xl lg:text-4xl">
            OpenClaw is powerful.
            <br />
            Its default setup is a security liability.
          </h2>
        </AnimateOnView>

        <div className="divide-border divide-y">
          {RISKS.map((risk, index) => (
            <AnimateOnView
              key={risk.label}
              className="flex flex-col gap-4 py-8 first:pt-0 last:pb-0 md:flex-row md:gap-12"
              delay={index * 0.1}
              margin="-50px"
            >
              <div className="flex shrink-0 items-center gap-3 md:w-64">
                <AlertTriangle className="text-muted-foreground h-5 w-5 shrink-0" />
                <span className="text-muted-foreground font-mono text-xs font-medium tracking-wider">
                  {risk.label}
                </span>
              </div>
              <div className="flex flex-col gap-3">
                <p className="text-foreground leading-relaxed">
                  {risk.description}
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  {risk.answer}
                </p>
              </div>
            </AnimateOnView>
          ))}
        </div>
      </div>
    </section>
  )
}
