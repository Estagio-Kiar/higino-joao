import { useEffect } from "react"

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

/*
 * O painel /admin (como no portfólio da Jaqueline Ngulo) será acrescentado
 * quando existir a API do Higino João. O conteúdo vem de `data/profile.ts`
 * e, com VITE_API_URL definido, da API.
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
  return (
    <SiteContentProvider>
      <Header />
      <Home />
      <Footer />
    </SiteContentProvider>
  )
}

export default App
