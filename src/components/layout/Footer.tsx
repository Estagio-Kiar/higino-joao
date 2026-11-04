import { Logo } from "@/components/Logo"
import { useNavLinks } from "@/content/useNavLinks"
import { person } from "@/data/profile"

export function Footer() {
  const navLinks = useNavLinks()
  return (
    <footer className="border-t border-border bg-ink">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-10 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <Logo className="h-8 w-auto text-gold" />
          <p className="text-sm font-bold">{person.name}</p>
        </div>
        <ul className="flex flex-wrap gap-x-6 gap-y-2">
          {navLinks.slice(1).map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-xs text-stone hover:text-gold"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <p className="text-xs text-stone">
          © {new Date().getFullYear()} {person.name}
        </p>
      </div>
    </footer>
  )
}
