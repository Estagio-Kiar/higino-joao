import { ArrowUpRight, Mail } from "lucide-react"

import { Logo } from "@/components/Logo"
import { Reveal } from "@/components/Reveal"
import { useSiteContent } from "@/content/SiteContent"

export function Contact() {
  const { contact } = useSiteContent()
  const links = contact.links
  return (
    <section
      id="contactos"
      data-side="none"
      className="relative overflow-hidden bg-gold text-ink"
    >
      <Logo className="pointer-events-none absolute -right-10 -bottom-24 h-[26rem] w-auto text-ink/10" />
      <div className="relative mx-auto max-w-3xl px-5 py-20 text-center md:py-28">
        <Reveal>
          <p className="font-mono text-xs font-semibold tracking-[0.2em] uppercase">
            {"// contactos"}
          </p>
          <h2 className="mt-3 text-3xl font-extrabold sm:text-5xl">
            Vamos conversar sobre segurança?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base/7 text-ink/80">
            Convites para palestras e painéis, parcerias e projetos na área da
            cibersegurança e da segurança da informação.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {contact.email && (
              <a
                href={`mailto:${contact.email}`}
                className="inline-flex items-center gap-2 rounded-md bg-ink px-6 py-3 text-sm font-bold text-silver hover:bg-ink/85"
              >
                <Mail className="size-4" /> Enviar e-mail
              </a>
            )}
            {links.map((link) => (
              <a
                key={link.key}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-md border-2 border-ink px-6 py-3 text-sm font-bold transition-colors hover:bg-ink hover:text-gold"
              >
                {link.label} <ArrowUpRight className="size-4" />
              </a>
            ))}
          </div>
          {!contact.email && links.length === 0 && (
            <p className="mt-6 text-sm">Canais de contacto oficiais em breve.</p>
          )}
        </Reveal>
      </div>
    </section>
  )
}
