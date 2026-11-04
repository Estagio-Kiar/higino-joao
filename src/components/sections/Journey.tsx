import { SectionLabel } from "@/components/SectionLabel"
import { Reveal } from "@/components/Reveal"
import { useSiteContent } from "@/content/SiteContent"

export function Journey() {
  const { journey } = useSiteContent()
  return (
    <section id="percurso" data-side="left" data-photo="2" className="bg-ink">
      <div className="mx-auto max-w-4xl px-5 py-16 md:py-24">
        <Reveal>
          <SectionLabel>Percurso</SectionLabel>
          <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">
            Mais de uma década na banca angolana
          </h2>
        </Reveal>
        <ol className="relative mt-10 space-y-8 border-l-2 border-gold/30 pl-7">
          {journey.map((item, i) => (
            <Reveal
              as="li"
              key={`${item.title}-${i}`}
              delay={i * 60}
              className="relative"
            >
              <span
                aria-hidden
                className="absolute top-1.5 -left-[2.15rem] size-3.5 rounded-full border-2 border-ink bg-gold"
              />
              <p className="font-mono text-xs font-semibold tracking-[0.15em] text-stone uppercase">
                {item.date}
              </p>
              <h3 className="mt-1 text-lg font-bold">{item.title}</h3>
              {item.company && (
                <p className="text-sm font-semibold text-gold">{item.company}</p>
              )}
              {item.text && (
                <p className="mt-1 text-base/7 text-stone">{item.text}</p>
              )}
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}
