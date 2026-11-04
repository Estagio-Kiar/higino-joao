import { navLinks } from "@/data/profile"
import { usePathname } from "@/lib/router"

/** Links de navegação. Fora da página inicial, as âncoras apontam para "/#secção". */
export function useNavLinks() {
  const path = usePathname()
  return path === "/"
    ? navLinks
    : navLinks.map((l) => ({ ...l, href: `/${l.href}` }))
}
