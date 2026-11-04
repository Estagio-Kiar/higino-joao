import { Briefcase, MapPin } from "lucide-react"

import { Logo } from "@/components/Logo"
import { Reveal } from "@/components/Reveal"
import { useSiteContent } from "@/content/SiteContent"
import { brand } from "@/data/profile"

export function About() {
  const { about } = useSiteContent()
  return (
    <section
      id="sobre"
      data-side="right"
      data-photo="1"
      className="bg-silver text-ink"
    >
      <div className="mx-auto grid max-w-6xl gap-12 px-5 py-16 md:grid-cols-5 md:py-24">
        <Reveal className="md:col-span-3">
          <p className="font-mono text-xs font-semibold tracking-[0.2em] uppercase">
            {"// sobre"}
          </p>
          <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">
            {about.title}
            <span className="mt-3 block h-1 w-16 rounded-full bg-gold" />
          </h2>
          <div className="mt-6 space-y-4 text-base/7 text-ink/85">
            {about.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>

          <dl className="mt-8 grid max-w-md grid-cols-2 gap-3">
            {about.location && (
              <div className="rounded-xl bg-ink/5 p-4">
                <dt className="flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.15em] uppercase">
                  <MapPin className="size-3.5" /> Baseado em
                </dt>
                <dd className="mt-1 text-sm font-bold">{about.location}</dd>
              </div>
            )}
            {about.experienceYears ? (
              <div className="rounded-xl bg-ink/5 p-4">
                <dt className="flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.15em] uppercase">
                  <Briefcase className="size-3.5" /> Experiência
                </dt>
                <dd className="mt-1 text-sm font-bold">
                  {about.experienceYears}+ anos
                </dd>
              </div>
            ) : null}
          </dl>
        </Reveal>

        <Reveal delay={120} className="md:col-span-2">
          <h3 className="font-mono text-xs font-semibold tracking-[0.2em] uppercase">
            Competências
          </h3>
          <ul className="mt-4 flex flex-wrap gap-2">
            {(
              about.skillLevels ??
              about.skills.map((name) => ({ name, percentage: null }))
            ).map((skill) => (
              <li
                key={skill.name}
                className="inline-flex items-center gap-2 rounded-full bg-ink py-2 pr-2 pl-4 text-sm text-silver"
              >
                <span className={skill.percentage == null ? "pr-2" : ""}>
                  {skill.name}
                </span>
                {skill.percentage != null && (
                  <span className="rounded-full bg-gold px-2 py-0.5 font-mono text-[11px] font-bold text-ink">
                    {Math.round(skill.percentage)}%
                  </span>
                )}
              </li>
            ))}
          </ul>

          <div className="mt-10 rounded-2xl bg-ink p-6 text-silver">
            <div className="flex items-center gap-4">
              <Logo className="h-14 w-auto text-gold" />
              <div>
                <p className="text-sm font-bold">A marca</p>
                <p className="text-xs text-stone">
                  As iniciais «H» e «J» em traços firmes: resistência e proteção.
                </p>
              </div>
            </div>
            <ul className="mt-5 space-y-3">
              {brand.map((c) => (
                <li key={c.name} className="flex gap-3">
                  <span
                    aria-hidden
                    className="mt-0.5 size-5 shrink-0 rounded-md ring-1 ring-white/20"
                    style={{ background: c.hex }}
                  />
                  <p className="text-sm/6">
                    <span className="font-semibold">{c.name}</span>
                    <span className="text-stone"> — {c.text}</span>
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
