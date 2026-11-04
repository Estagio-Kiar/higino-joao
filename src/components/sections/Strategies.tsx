import {
  Gauge,
  Landmark,
  Lock,
  Shield,
  Sparkles,
  Users,
  type LucideIcon,
} from "lucide-react"

import { SectionLabel } from "@/components/SectionLabel"
import { Reveal } from "@/components/Reveal"
import { strategies } from "@/data/profile"

const ICONS: Record<string, LucideIcon> = {
  landmark: Landmark,
  gauge: Gauge,
  shield: Shield,
  users: Users,
  sparkles: Sparkles,
  lock: Lock,
}

export function Strategies() {
  return (
    <section
      id="estrategias"
      data-side="none"
      className="bg-grid border-t border-border bg-coal"
    >
      <div className="mx-auto max-w-6xl px-5 py-16 md:py-24">
        <Reveal className="max-w-2xl">
          <SectionLabel>Estratégias</SectionLabel>
          <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">
            {strategies.title}
          </h2>
          <p className="mt-4 text-base/7 text-stone">{strategies.intro}</p>
        </Reveal>

        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {strategies.items.map((item, i) => {
            const Icon = ICONS[item.icon] ?? Shield
            return (
              <Reveal
                as="li"
                key={item.title}
                delay={i * 70}
                className="group relative overflow-hidden rounded-2xl border border-border bg-ink/80 p-6 transition-colors duration-300 hover:border-gold/60"
              >
                <span className="absolute top-5 right-5 font-mono text-xs text-stone/60">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="grid size-12 place-items-center rounded-xl bg-gold/10 text-gold transition-colors duration-300 group-hover:bg-gold group-hover:text-ink">
                  <Icon className="size-6" />
                </span>
                <h3 className="mt-5 text-lg font-bold">{item.title}</h3>
                <p className="mt-2 text-sm/6 text-stone">{item.text}</p>
                <span
                  aria-hidden
                  className="absolute bottom-0 left-0 h-0.5 w-0 bg-gold transition-all duration-500 group-hover:w-full"
                />
              </Reveal>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
