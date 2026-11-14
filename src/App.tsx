import { lazy, Suspense, useEffect } from "react"

import { ScrollCompanion } from "@/components/ScrollCompanion"
import { Footer } from "@/components/layout/Footer"
import { Header } from "@/components/layout/Header"
import { About } from "@/components/sections/About"
import { Business } from "@/components/sections/Business"
import { Contact } from "@/components/sections/Contact"
import { Events } from "@/components/sections/Events"
import { Hero } from "@/components/sections/Hero"
import { Journey } from "@/components/sections/Journey"
import { Pillars } from "@/components/sections/Pillars"
import { Stats } from "@/components/sections/Stats"
import { Strategies } from "@/components/sections/Strategies"
import { SiteContentProvider } from "@/content/SiteContent"
import { usePathname } from "@/lib/router"

// O painel só é descarregado quando se visita /admin.
const AdminApp = lazy(() => import("@/admin/AdminApp"))

/*
 * Site público: o conteúdo vem da API (VITE_API_URL), com `data/profile.ts`
 * como reserva. O painel de gestão está em /admin (mesmo desenho do painel
 * do portfólio de Jaqueline Ngulo).
 */
function Home() {
  // Ao chegar com "/#secção", desloca até à secção.
  useEffect(() => {
    const id = window.location.hash.slice(1)
    if (!id) return
    const t = setTimeout(
      () => document.getElementById(id)?.scrollIntoView(),
      150
    )
    return () => clearTimeout(t)
  }, [])

  return (
    <>
      <ScrollCompanion />
      <main>
        <Hero />
        <Pillars />
        <Stats />
        <About />
        <Journey />
        <Strategies />
        <Business />
        <Events />
        <Contact />
      </main>
    </>
  )
}

export function App() {
  const path = usePathname()

  if (path === "/admin" || path.startsWith("/admin/")) {
    return (
      <Suspense
        fallback={
          <div className="grid min-h-svh place-items-center bg-ink">
            <span className="size-8 animate-spin rounded-full border-2 border-caramel border-t-transparent" />
          </div>
        }
      >
        <AdminApp />
      </Suspense>
    )
  }

  return (
    <SiteContentProvider>
      <Header />
      <Home />
      <Footer />
    </SiteContentProvider>
  )
}

export default App
