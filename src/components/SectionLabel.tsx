import { cn } from "@/lib/utils"

/** Etiqueta de secção em estilo terminal: «// sobre». */
export function SectionLabel({
  children,
  className,
}: {
  children: string
  className?: string
}) {
  return (
    <p
      className={cn(
        "font-mono text-xs font-medium tracking-[0.2em] text-gold uppercase",
        className
      )}
    >
      {"// "}
      {children}
    </p>
  )
}
