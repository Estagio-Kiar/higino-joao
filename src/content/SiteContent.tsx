import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react"

import * as defaults from "@/data/profile"
import { api, imageVariant } from "@/lib/api"
import type {
  AgendaEvent,
  CareerHistory,
  Estrategia,
  Negocio,
  Profile,
  Skill,
  SocialLink,
} from "@/lib/types"

/**
 * Conteúdo do site. Começa com os dados estáticos de `data/profile.ts`
 * e é substituído pelo que vier da API (higino-joao-server). Se a API
 * estiver indisponível, ou uma lista vier vazia, mantém-se o conteúdo
 * estático dessa secção.
 */

/** Só pede dados à API quando VITE_API_URL está definido. */
const HAS_API = Boolean(import.meta.env.VITE_API_URL)

type ContactLink = { key: string; label: string; href: string }
type StrategyItem = { icon: string; title: string; text: string }
type BusinessItem = { title: string; text: string; tags: string[] }

export type SiteContent = {
  person: typeof defaults.person
  about: typeof defaults.about & {
    /** Competências vindas da API, com percentagem opcional. */
    skillLevels?: { name: string; percentage: number | null }[]
  }
  journey: { date: string; title: string; text: string; company?: string }[]
  strategies: Omit<typeof defaults.strategies, "items"> & {
    items: StrategyItem[]
  }
  business: Omit<typeof defaults.business, "items"> & {
    items: BusinessItem[]
  }
  contact: { email: string; links: ContactLink[] }
  /** Eventos, por ordem cronológica. */
  agenda: AgendaEvent[]
  /** Fotos que acompanham o scroll (estáticas; a API não tem galeria). */
  gallery: { src: string; position: string }[]
  status: "loading" | "api" | "offline"
}

const staticContact = (): SiteContent["contact"] => ({
  email: defaults.contact.email,
  links: [
    { key: "linkedin", label: "LinkedIn", href: defaults.contact.linkedin },
    { key: "website", label: "Website", href: defaults.contact.website },
  ].filter((l) => l.href),
})

const initial: SiteContent = {
  person: defaults.person,
  about: defaults.about,
  journey: defaults.journey,
  strategies: defaults.strategies,
  business: defaults.business,
  contact: staticContact(),
  agenda: defaults.events.map((e) => ({
    ...e,
    owner_id: null,
    created_at: e.data,
    updated_at: e.data,
  })),
  gallery: defaults.gallery,
  status: HAS_API ? "loading" : "offline",
}

const PLATFORM_LABELS: Record<string, string> = {
  linkedin: "LinkedIn",
  instagram: "Instagram",
  facebook: "Facebook",
  twitter: "X / Twitter",
  x: "X / Twitter",
  youtube: "YouTube",
  github: "GitHub",
  website: "Website",
  site: "Website",
}

const label = (platform: string) =>
  PLATFORM_LABELS[platform.toLowerCase()] ?? platform

const byCreated = (a: { created_at?: string }, b: { created_at?: string }) =>
  (a.created_at ?? "").localeCompare(b.created_at ?? "")

function mergeProfile(c: SiteContent, p?: Profile): SiteContent {
  if (!p) return c
  const paragraphs = p.bio_description
    ?.split(/\n\s*\n/)
    .map((s) => s.trim())
    .filter(Boolean)
  return {
    ...c,
    person: {
      ...c.person,
      badge: p.title || c.person.badge,
      tagline: p.tagline || c.person.tagline,
      heroText: p.bio || c.person.heroText,
      // Foto do Hero vinda da API (Cloudinary) tem prioridade sobre a estática.
      ...(p.photo_url
        ? {
            photo: imageVariant(p.photo_url, 840) ?? c.person.photo,
            photoSmall: imageVariant(p.photo_url, 420) ?? c.person.photoSmall,
          }
        : {}),
    },
    about: {
      ...c.about,
      paragraphs: paragraphs?.length ? paragraphs : c.about.paragraphs,
      location: p.location || c.about.location,
      experienceYears: p.experience_years ?? c.about.experienceYears,
    },
  }
}

// Linha do tempo cronológica: o marco criado primeiro aparece primeiro.
const mapCareer = (items: CareerHistory[]) =>
  [...items].sort(byCreated).map((i) => ({
    date: i.period ?? "",
    title: i.role,
    text: i.description ?? "",
    company: i.company ?? undefined,
  }))

function mapSocial(items: SocialLink[]): SiteContent["contact"] {
  const email = items.find(
    (s) =>
      s.platform.toLowerCase() === "email" ||
      s.profile_url.startsWith("mailto:")
  )
  return {
    email: email ? email.profile_url.replace(/^mailto:/, "") : "",
    links: items
      .filter((s) => s !== email)
      .map((s) => ({
        key: s.id,
        label: label(s.platform),
        href: s.profile_url,
      })),
  }
}

const mapStrategies = (items: Estrategia[]): StrategyItem[] =>
  [...items]
    .sort((a, b) => a.ordem - b.ordem)
    .map((s) => ({ icon: s.icon, title: s.titulo, text: s.descricao }))

const mapBusiness = (items: Negocio[]): BusinessItem[] =>
  [...items].sort(byCreated).map((b) => ({
    title: b.titulo,
    text: b.descricao,
    tags: b.tags ?? [],
  }))

const Ctx = createContext<SiteContent>(initial)

export function SiteContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<SiteContent>(initial)
  const contentRef = useRef(content)
  useEffect(() => {
    contentRef.current = content
  }, [content])

  useEffect(() => {
    let ctrl = new AbortController()
    let lastLoad = 0

    const load = () => {
      lastLoad = Date.now()
      ctrl.abort()
      ctrl = new AbortController()
      const s = ctrl.signal
      Promise.allSettled([
        api.profile.list(s),
        api.career.list(s),
        api.social.list(s),
        api.skills.list(s),
        api.agenda.list(s),
        api.estrategias.list(s),
        api.negocios.list(s),
      ]).then((results) => {
        if (s.aborted) return
        const [profile, career, social, skills, agenda, estrategias, negocios] =
          results
        const ok = <T,>(r: PromiseSettledResult<T[]>) =>
          r.status === "fulfilled" && Array.isArray(r.value) ? r.value : []
        const anyOk = results.some((r) => r.status === "fulfilled")
        // Numa recarga em segundo plano sem resposta da API, mantém o que
        // já está no ecrã em vez de voltar ao conteúdo estático.
        if (!anyOk && contentRef.current.status === "api") return
        let next: SiteContent = {
          ...initial,
          status: anyOk ? "api" : "offline",
        }
        next = mergeProfile(next, ok<Profile>(profile)[0])
        const c = ok<CareerHistory>(career)
        if (c.length) next.journey = mapCareer(c)
        const so = ok<SocialLink>(social)
        if (so.length) next.contact = mapSocial(so)
        const ag = ok<AgendaEvent>(agenda).filter((e) => e.data && e.evento)
        if (ag.length)
          next.agenda = ag.sort((a, b) => a.data.localeCompare(b.data))
        const st = ok<Estrategia>(estrategias)
        if (st.length)
          next.strategies = { ...next.strategies, items: mapStrategies(st) }
        const ng = ok<Negocio>(negocios)
        if (ng.length)
          next.business = { ...next.business, items: mapBusiness(ng) }
        const sk = ok<Skill>(skills).filter((x) => x.name)
        if (sk.length) {
          const sorted = [...sk].sort(byCreated)
          next.about = {
            ...next.about,
            skills: sorted.map((x) => x.name),
            skillLevels: sorted.map((x) => ({
              name: x.name,
              percentage: x.percentage,
            })),
          }
        }
        setContent(next)
      })
    }

    if (!HAS_API) return
    load()

    // Volta a pedir os dados quando o separador fica visível de novo
    // (ex.: depois de editar no /admin noutro separador), no máximo a cada
    // 15 s.
    const refresh = () => {
      if (
        document.visibilityState === "visible" &&
        Date.now() - lastLoad > 15_000
      )
        load()
    }
    document.addEventListener("visibilitychange", refresh)
    window.addEventListener("focus", refresh)
    return () => {
      ctrl.abort()
      document.removeEventListener("visibilitychange", refresh)
      window.removeEventListener("focus", refresh)
    }
  }, [])

  return <Ctx.Provider value={content}>{children}</Ctx.Provider>
}

export const useSiteContent = () => useContext(Ctx)
