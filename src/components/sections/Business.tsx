import { ArrowUpRight } from "lucide-react"

import { Reveal } from "@/components/Reveal"
import { business } from "@/data/profile"

export function Business() {
  return (
    <section id="negocios" data-side="none" className="bg-silver text-ink">
      <div className="mx-auto max-w-6xl px-5 py-16 md:py-24">
        <div className="grid gap-10 md:grid-cols-5">
          <Reveal className="md:col-span-2">
            <p className="font-mono text-xs font-semibold tracking-[0.2em] uppercase">
              {"// negócios"}
            </p>
            <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">
              {business.title}
              <span className="mt-3 block h-1 w-16 rounded-full bg-gold" />
            </h2>
            <p className="mt-5 text-base/7 text-ink/80">{business.intro}</p>
            <a
              href="#contactos"
              className="mt-8 inline-flex items-center gap-2 rounded-md bg-ink px-6 py-3 text-sm font-bold text-silver transition-colors hover:bg-ink/85"
            >
              Propor uma colaboração <ArrowUpRight className="size-4" />
            </a>
          </Reveal>

          <ul className="grid gap-4 sm:grid-cols-2 md:col-span-3">
            {business.items.map((item, i) => (
              <Reveal
                as="li"
                key={item.title}
                delay={i * 80}
                className="flex flex-col rounded-2xl bg-white p-6 shadow-sm ring-1 ring-ink/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <span
                  aria-hidden
                  className="h-1 w-10 rounded-full bg-gold"
                />
                <h3 className="mt-4 text-lg font-bold">{item.title}</h3>
                <p className="mt-2 flex-1 text-sm/6 text-ink/75">{item.text}</p>
                <ul className="mt-4 flex flex-wrap gap-1.5">
                  {item.tags.map((tag) => (
                    <li
                      key={tag}
                      className="rounded-full bg-ink/5 px-2.5 py-1 font-mono text-[11px] text-ink/80"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
