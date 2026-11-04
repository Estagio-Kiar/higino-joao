import { useEffect, useState } from "react"

const reducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches

/**
 * Nome escrito letra a letra (efeito de autocompletar), com cursor a piscar.
 * O nome completo fica reservado de forma invisível para o layout não saltar,
 * e os leitores de ecrã leem-no de uma vez.
 */
export function TypedName({
  first,
  last,
  speed = 110,
  startDelay = 400,
}: {
  first: string
  last: string
  speed?: number
  startDelay?: number
}) {
  const full = `${first} ${last}`
  const [count, setCount] = useState(() => (reducedMotion() ? full.length : 0))

  useEffect(() => {
    if (reducedMotion()) return
    let timer: ReturnType<typeof setTimeout>
    const step = (n: number) => {
      setCount(n)
      if (n < full.length) timer = setTimeout(() => step(n + 1), speed)
    }
    timer = setTimeout(() => step(1), startDelay)
    return () => clearTimeout(timer)
  }, [full, speed, startDelay])

  const typedFirst = full.slice(0, Math.min(count, first.length))
  const typedLast = count > first.length + 1 ? full.slice(first.length + 1, count) : ""
  const space = count > first.length ? " " : ""
  const done = count >= full.length

  return (
    <span className="relative inline-grid" aria-label={full} role="text">
      {/* Reserva o espaço do nome completo */}
      <span aria-hidden className="invisible col-start-1 row-start-1">
        {first} {last}
        <span className="typed-caret" />
      </span>
      <span aria-hidden className="col-start-1 row-start-1">
        {typedFirst}
        {space}
        <span className="text-gold">{typedLast}</span>
        <span className={`typed-caret ${done ? "is-done" : ""}`} />
      </span>
    </span>
  )
}
