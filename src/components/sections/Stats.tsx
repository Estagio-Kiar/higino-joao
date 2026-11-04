import { useEffect, useRef, useState } from "react"

import { stats, statsNote } from "@/data/profile"

const reducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches

/**
 * Contador animado. Recomeça do zero sempre que a secção volta a entrar
 * no ecrã (a contagem é reposta quando sai de vista).
 */
function Counter({ to }: { to: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const [value, setValue] = useState(() => (reducedMotion() ? to : 0))

  useEffect(() => {
    const el = ref.current
    if (!el || reducedMotion()) return

    let frame = 0
    const observer = new IntersectionObserver(
      ([entry]) => {
        cancelAnimationFrame(frame)
        if (!entry.isIntersecting) {
          // Fora de vista: volta a zero para recomeçar na próxima vez.
          setValue(0)
          return
        }
        const start = performance.now()
        const tick = (now: number) => {
          const progress = Math.min((now - start) / 1200, 1)
          setValue(Math.round(to * (1 - Math.pow(1 - progress, 3))))
          if (progress < 1) frame = requestAnimationFrame(tick)
        }
        frame = requestAnimationFrame(tick)
      },
      { threshold: 0.4 }
    )
    observer.observe(el)
    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [to])

  return <span ref={ref}>{value}</span>
}

export function Stats() {
  return (
    <section
      id="numeros"
      data-side="none"
      className="bg-gold text-ink"
      aria-labelledby="numeros-title"
    >
      <div className="mx-auto max-w-5xl px-5 py-16 md:py-20">
        <h2
          id="numeros-title"
          className="mb-10 text-center font-mono text-xs font-semibold tracking-[0.25em] uppercase"
        >
          Percurso em números
        </h2>
        <dl className="grid gap-y-10 sm:grid-cols-3">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center text-center">
              <dd className="text-5xl font-extrabold sm:text-6xl">
                <Counter to={stat.value} />
                {stat.suffix}
              </dd>
              <dt className="order-last mt-2 max-w-[14rem] text-xs font-semibold tracking-[0.15em] uppercase">
                {stat.label}
              </dt>
            </div>
          ))}
        </dl>
        <p className="mt-10 text-center text-xs text-ink/75">{statsNote}</p>
      </div>
    </section>
  )
}
