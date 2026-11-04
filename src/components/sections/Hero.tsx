import { ArrowRight, ShieldCheck } from "lucide-react"

import { TypedName } from "@/components/TypedName"
import { useSiteContent } from "@/content/SiteContent"

export function Hero() {
  const { person } = useSiteContent()
  return (
    <section
      id="inicio"
      className="bg-grid relative overflow-hidden bg-ink pt-24 md:pt-28"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/3 -right-40 size-[28rem] rounded-full bg-gold/10 blur-3xl"
      />
      <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-5 pb-16 md:grid-cols-2 md:pb-20">
        <div className="order-2 md:order-1">
          <p className="caret font-mono text-xs text-gold">
            &gt; whoami
          </p>
          <span className="mt-4 inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-[11px] font-semibold tracking-[0.18em] text-gold uppercase">
            <ShieldCheck className="size-3.5" /> {person.badge}
          </span>
          <h1 className="mt-5 text-5xl leading-[1.02] font-extrabold tracking-tight sm:text-6xl lg:text-7xl">
            <TypedName first={person.firstName} last={person.lastName} />
          </h1>
          <p className="mt-5 max-w-md text-xl font-medium text-silver">
            {person.tagline}
          </p>
          <p className="mt-3 max-w-md text-base/7 text-stone">
            {person.heroText}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#estrategias"
              className="inline-flex items-center gap-2 rounded-md bg-gold px-6 py-3 text-sm font-bold text-ink transition-colors hover:bg-gold/85"
            >
              Ver estratégias <ArrowRight className="size-4" />
            </a>
            <a
              href="#contactos"
              className="btn-3d inline-flex items-center rounded-md border border-silver/60 px-6 py-3 text-sm font-bold"
            >
              Contactos
            </a>
          </div>
        </div>

        <div className="order-1 md:order-2">
          <div className="companion-float relative mx-auto max-w-[22rem] md:max-w-md">
            {/* Foto com o monograma, tal como no manual da marca */}
            <img
              src={person.photoSmall}
              srcSet={`${person.photoSmall} 420w, ${person.photo} 840w`}
              sizes="(min-width: 768px) 448px, 85vw"
              alt={`${person.name} com o seu monograma HJ`}
              width={840}
              height={893}
              decoding="async"
              fetchPriority="high"
              className="hero-fade relative w-full"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
