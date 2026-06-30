import { ArrowRightIcon } from "@/lib/icons";
import { services } from "@/lib/services";

export default function Home() {
  return (
    <div className="mx-auto max-w-[1080px] px-6 pb-24 pt-20">
      <header className="mb-14 text-center">
        <h1 className="mb-3 bg-gradient-to-b from-white to-muted bg-clip-text text-[clamp(2rem,5vw,3rem)] font-semibold tracking-[-0.03em] text-transparent">
          Dockerfile Runtime
        </h1>
        <p className="mx-auto max-w-xl text-[1.05rem] text-muted">
          A collection of containerized services running as Vercel Functions,
          each built from its own Dockerfile and routed through{" "}
          <code className="font-mono text-subtle">vercel.json</code>.
        </p>
      </header>

      <main className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4">
        {services.map(({ name, route, description, tags, Icon }) => (
          <a
            key={route}
            href={route}
            className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card p-5 transition-colors hover:border-border-hover hover:bg-card-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <div className="mb-3.5 flex items-center gap-3">
              <span className="grid size-[38px] place-items-center rounded-[9px] border border-border bg-bg-elev">
                <Icon className="size-[18px] fill-fg" />
              </span>
              <div>
                <h2 className="text-base font-semibold tracking-[-0.01em]">
                  {name}
                </h2>
                <span className="font-mono text-[0.78rem] text-subtle">
                  {route}
                </span>
              </div>
            </div>

            <p className="mb-4 flex-1 text-[0.9rem] text-muted">{description}</p>

            <div className="mb-4 flex flex-wrap gap-1.5">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-md border border-border bg-bg-elev px-2 py-0.5 font-mono text-[0.7rem] text-muted"
                >
                  {tag}
                </span>
              ))}
            </div>

            <span className="inline-flex items-center gap-1.5 text-[0.85rem] font-medium text-fg">
              Open service
              <ArrowRightIcon className="size-3.5 transition-transform group-hover:translate-x-0.5" />
            </span>
          </a>
        ))}
      </main>
    </div>
  );
}
