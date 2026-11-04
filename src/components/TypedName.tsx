import { useEffect, useRef, useState } from "react"

const reducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches

/**
 * Nome escrito letra a letra (efeito de autocompletar), com cursor a piscar.
 *
 * Repete-se enquanto o nome estiver visível no ecrã: escreve, espera
 * `pause` ms, apaga, espera `restart` ms e volta a escrever. Fora de vista
 * a animação pára e o nome fica completo. O nome completo fica reservado de
 * forma invisível (o layout não salta) e os leitores de ecrã leem-no de uma vez.
 */
export function TypedName({
  first,
  last,
  speed = 110,
  eraseSpeed = 55,
  pause = 3500,
  restart = 1250,
}: {
  first: string
  last: string
  /** Intervalo entre letras ao escrever (ms). */
  speed?: number
  /** Intervalo entre letras ao apagar (ms). */
  eraseSpeed?: number
  /** Tempo com o nome completo antes de apagar (ms). */
  pause?: number
  /** Tempo com o nome apagado antes de voltar a escrever (ms). */
  restart?: number
}) {
  const full = `${first} ${last}`
  const ref = useRef<HTMLSpanElement>(null)
  const [count, setCount] = useState(() => (reducedMotion() ? full.length : 0))

  useEffect(() => {
    const el = ref.current
    if (!el || reducedMotion()) return

    let timer: ReturnType<typeof setTimeout> | undefined
    let n = 0

    const stop = () => clearTimeout(timer)

    const type = () => {
      n += 1
      setCount(n)
      timer =
        n < full.length ? setTimeout(type, speed) : setTimeout(erase, pause)
    }
    const erase = () => {
      n -= 1
      setCount(n)
      timer = n > 0 ? setTimeout(erase, eraseSpeed) : setTimeout(type, restart)
    }

    // Só anima enquanto a secção de início está visível.
    const observer = new IntersectionObserver(
      ([entry]) => {
        stop()
        if (entry.isIntersecting) {
          n = 0
          setCount(0)
          timer = setTimeout(type, restart)
        } else {
          n = full.length
          setCount(full.length)
        }
      },
      { threshold: 0.3 }
    )
    observer.observe(el)
    return () => {
      observer.disconnect()
      stop()
    }
  }, [full, speed, eraseSpeed, pause, restart])

  const typedFirst = full.slice(0, Math.min(count, first.length))
  const space = count > first.length ? " " : ""
  const typedLast =
    count > first.length + 1 ? full.slice(first.length + 1, count) : ""

  return (
    <span
      ref={ref}
      className="relative inline-grid"
      aria-label={full}
      role="text"
    >
      {/* Reserva o espaço do nome completo */}
      <span aria-hidden className="invisible col-start-1 row-start-1">
        {first} {last}
        <span className="typed-caret" />
      </span>
      <span aria-hidden className="col-start-1 row-start-1">
        {typedFirst}
        {space}
        <span className="text-gold">{typedLast}</span>
        <span className="typed-caret" />
      </span>
    </span>
  )
}
