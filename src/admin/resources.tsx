import type { LucideIcon } from "lucide-react"
import {
  Briefcase,
  CalendarDays,
  Gauge,
  Handshake,
  Share2,
  Target,
} from "lucide-react"

import type { DataKey, DataMap } from "@/admin/data"
import { api } from "@/lib/api"
import { dateTime } from "@/lib/format"

export type FieldType =
  | "text"
  | "textarea"
  | "longtext"
  | "url"
  | "date"
  | "datetime"
  | "number"
  | "image"
  | "select"
  | "slug"

export type FieldDef = {
  name: string
  label: string
  type: FieldType
  required?: boolean
  placeholder?: string
  hint?: string
  /** Ocupa a linha inteira no formulário (por omissão: sim, exceto campos curtos). */
  half?: boolean
  /** Campo de origem para gerar o slug automaticamente. */
  from?: string
  /**
   * Envio da imagem para a API (POST /{recurso}/{id}/upload). Devolve o URL
   * guardado. Num registo novo, a imagem é enviada depois de o criar.
   */
  upload?: (id: string, file: File) => Promise<string>
  /** Opções fixas ou derivadas de outra lista do painel. */
  options?: { value: string; label: string }[]
  optionsFrom?: DataKey
  /** Permite escrever um valor que não está nas opções. */
  allowCustom?: boolean
  /** Limites para campos numéricos. */
  min?: number
  max?: number
}

export type CardView = {
  title: string
  subtitle?: string
  meta?: string
  image?: string | null
  badge?: string
  link?: string | null
}

export type ResourceConfig<K extends DataKey = DataKey> = {
  key: K
  path: string
  title: string
  singular: string
  /** Género gramatical do singular, para os textos da interface. */
  gender: "m" | "f"
  description: string
  icon: LucideIcon
  layout: "grid" | "list"
  fields: FieldDef[]
  view: (item: DataMap[K]) => CardView
  /** Ajustes finais no payload antes de enviar à API. */
  finalize?: (payload: Record<string, unknown>) => Record<string, unknown>
  sort?: (a: DataMap[K], b: DataMap[K]) => number
  /** Onde aparece no site, para orientar quem edita. */
  siteSection: string
  /** Só administradores podem criar/editar (a API recusa outros perfis). */
  adminOnly?: boolean
}

const byCreated = (a: { created_at?: string }, b: { created_at?: string }) =>
  (a.created_at ?? "").localeCompare(b.created_at ?? "")

export const SOCIAL_PLATFORMS = [
  { value: "linkedin", label: "LinkedIn" },
  { value: "github", label: "GitHub" },
  { value: "x", label: "X / Twitter" },
  { value: "instagram", label: "Instagram" },
  { value: "facebook", label: "Facebook" },
  { value: "youtube", label: "YouTube" },
  { value: "website", label: "Website" },
  { value: "email", label: "E-mail" },
]

/** Ícones disponíveis para as estratégias (os mesmos do site). */
export const STRATEGY_ICONS = [
  { value: "shield", label: "Escudo" },
  { value: "lock", label: "Cadeado" },
  { value: "landmark", label: "Instituição" },
  { value: "gauge", label: "Medidor" },
  { value: "users", label: "Pessoas" },
  { value: "sparkles", label: "Inovação" },
]

/** «a, b, c» ou «a_b_c» → ["a","b","c"]. */
export const splitTags = (v: unknown) =>
  (Array.isArray(v) ? v : String(v ?? "").split(/[,_]/))
    .map((t) => String(t).trim())
    .filter(Boolean)

const career: ResourceConfig<"career"> = {
  key: "career",
  path: "percurso",
  title: "Percurso",
  singular: "marco",
  gender: "m",
  description: "Funções e marcos apresentados na linha do tempo do site.",
  icon: Briefcase,
  layout: "list",
  siteSection: "Secção «Percurso»",
  // Mesma ordem do site: cronológica, pela data de criação.
  sort: byCreated,
  fields: [
    {
      name: "role",
      label: "Função",
      type: "text",
      required: true,
      placeholder: "Chief Information Security Officer",
    },
    {
      name: "company",
      label: "Organização",
      type: "text",
      half: true,
      placeholder: "Standard Bank Angola",
    },
    {
      name: "period",
      label: "Período",
      type: "text",
      half: true,
      placeholder: "2024 – presente",
    },
    {
      name: "description",
      label: "Descrição",
      type: "textarea",
      placeholder: "Responsabilidades e resultados nesta função.",
    },
  ],
  view: (i) => ({
    title: i.role,
    subtitle: i.description ?? undefined,
    meta: [i.company, i.period].filter(Boolean).join(" · "),
  }),
}

const skills: ResourceConfig<"skills"> = {
  key: "skills",
  path: "competencias",
  title: "Competências",
  singular: "competência",
  gender: "f",
  description:
    "Competências mostradas na secção «Sobre». A percentagem é opcional e aparece dentro do botão.",
  icon: Gauge,
  layout: "list",
  siteSection: "Secção «Sobre» → Competências",
  sort: byCreated,
  fields: [
    {
      name: "name",
      label: "Competência",
      type: "text",
      required: true,
      half: true,
      placeholder: "Gestão de risco tecnológico",
    },
    {
      name: "percentage",
      label: "Domínio (%)",
      type: "number",
      half: true,
      min: 0,
      max: 100,
      placeholder: "85",
      hint: "Opcional, de 0 a 100.",
    },
  ],
  view: (i) => ({
    title: i.name,
    meta:
      i.percentage != null ? `${Math.round(i.percentage)}%` : "Sem percentagem",
  }),
}

const estrategias: ResourceConfig<"estrategias"> = {
  key: "estrategias",
  path: "estrategias",
  title: "Estratégias",
  singular: "estratégia",
  gender: "f",
  description:
    "Eixos de estratégia de cibersegurança mostrados em cartões na secção «Estratégias».",
  icon: Target,
  layout: "list",
  siteSection: "Secção «Estratégias»",
  sort: (a, b) => a.ordem - b.ordem,
  fields: [
    {
      name: "titulo",
      label: "Título",
      type: "text",
      required: true,
      placeholder: "Gestão de risco",
    },
    {
      name: "ordem",
      label: "Ordem",
      type: "number",
      required: true,
      half: true,
      min: 1,
      max: 99,
      placeholder: "1",
      hint: "Posição no site. Cada estratégia tem um número diferente.",
    },
    {
      name: "icon",
      label: "Ícone",
      type: "select",
      required: true,
      half: true,
      options: STRATEGY_ICONS,
    },
    {
      name: "descricao",
      label: "Descrição",
      type: "textarea",
      required: true,
      placeholder: "Identificar, medir e priorizar riscos tecnológicos…",
    },
  ],
  view: (i) => ({
    title: `${String(i.ordem).padStart(2, "0")} · ${i.titulo}`,
    subtitle: i.descricao,
    meta: STRATEGY_ICONS.find((x) => x.value === i.icon)?.label ?? i.icon ?? "",
  }),
}

const negocios: ResourceConfig<"negocios"> = {
  key: "negocios",
  path: "negocios",
  title: "Negócios",
  singular: "área de negócio",
  gender: "f",
  description:
    "Formas de colaboração apresentadas na secção «Negócios» (palestras, aconselhamento…).",
  icon: Handshake,
  layout: "list",
  siteSection: "Secção «Negócios»",
  sort: byCreated,
  fields: [
    {
      name: "titulo",
      label: "Título",
      type: "text",
      required: true,
      placeholder: "Palestras e painéis",
    },
    {
      name: "descricao",
      label: "Descrição",
      type: "textarea",
      required: true,
      placeholder: "Intervenções em fóruns executivos sobre cibersegurança…",
    },
    {
      name: "tags",
      label: "Etiquetas",
      type: "text",
      required: true,
      placeholder: "Fóruns, Conferências, Painéis",
      hint: "Separe por vírgulas.",
    },
  ],
  finalize: (p) => ({ ...p, tags: splitTags(p.tags) }),
  view: (i) => ({
    title: i.titulo,
    subtitle: i.descricao,
    meta: (i.tags ?? []).join(" · "),
  }),
}

export const AGENDA_TYPES = [
  "Orador",
  "Palestra",
  "Painel",
  "Workshop",
  "Formação",
  "Entrevista",
  "Conferência",
].map((v) => ({ value: v, label: v }))

export const AGENDA_STATUS = [
  "Confirmado",
  "Por confirmar",
  "Esgotado",
  "Realizado",
  "Adiado",
  "Cancelado",
].map((v) => ({ value: v, label: v }))

const agenda: ResourceConfig<"agenda"> = {
  key: "agenda",
  path: "eventos",
  title: "Eventos",
  singular: "evento",
  gender: "m",
  description:
    "Palestras, painéis e outras participações. Os próximos aparecem em «Próximos encontros» no site.",
  icon: CalendarDays,
  layout: "grid",
  siteSection: "Secção «Eventos»",
  sort: (a, b) => b.data.localeCompare(a.data),
  fields: [
    {
      name: "imagem",
      label: "Imagem do evento",
      type: "image",
      upload: async (id, file) =>
        (await api.agenda.upload(id, file)).imagem ?? "",
    },
    {
      name: "evento",
      label: "Nome do evento",
      type: "text",
      required: true,
      placeholder: "SEC 360º Executive Cybersecurity Forum",
    },
    {
      name: "data",
      label: "Data e hora",
      type: "datetime",
      required: true,
      half: true,
    },
    {
      name: "tipo",
      label: "Tipo",
      type: "select",
      required: true,
      half: true,
      options: AGENDA_TYPES,
      allowCustom: true,
    },
    {
      name: "local",
      label: "Local",
      type: "text",
      required: true,
      half: true,
      placeholder: "HCTA, Luanda ou Online",
    },
    {
      name: "status",
      label: "Estado",
      type: "select",
      required: true,
      half: true,
      options: AGENDA_STATUS,
      allowCustom: true,
    },
    {
      name: "link",
      label: "Link (inscrição ou mais informação)",
      type: "url",
      placeholder: "https://…",
    },
    {
      name: "descricao",
      label: "Descrição",
      type: "textarea",
      required: true,
      placeholder: "Tema da intervenção, público do evento…",
    },
  ],
  view: (i) => ({
    title: i.evento,
    subtitle: i.descricao,
    meta: [dateTime(i.data), i.local].filter(Boolean).join(" · "),
    image: i.imagem,
    badge: i.status,
    link: i.link,
  }),
}

const social: ResourceConfig<"social"> = {
  key: "social",
  path: "redes",
  title: "Redes & contacto",
  singular: "rede",
  gender: "f",
  description:
    "Botões da secção «Contactos». Use «E-mail» para o botão «Enviar e-mail».",
  icon: Share2,
  layout: "list",
  siteSection: "Secção «Contactos»",
  fields: [
    {
      name: "platform",
      label: "Plataforma",
      type: "select",
      required: true,
      options: SOCIAL_PLATFORMS,
      allowCustom: true,
      half: true,
    },
    {
      name: "profile_url",
      label: "Link / endereço",
      type: "text",
      required: true,
      half: true,
      placeholder: "https://… ou nome@exemplo.com",
      hint: "Cada plataforma e cada link só podem existir uma vez.",
    },
  ],
  finalize: (p) => {
    const platform = String(p.platform ?? "").toLowerCase()
    let url = String(p.profile_url ?? "").trim()
    if (platform === "email" && url && !url.startsWith("mailto:"))
      url = `mailto:${url}`
    return { ...p, platform, profile_url: url, icon_name: platform }
  },
  view: (i) => ({
    title:
      SOCIAL_PLATFORMS.find((p) => p.value === i.platform)?.label ?? i.platform,
    meta: i.profile_url.replace(/^mailto:/, ""),
    link: i.profile_url,
  }),
}

export const RESOURCES = [
  career,
  skills,
  estrategias,
  negocios,
  agenda,
  social,
] as ResourceConfig[]

export const findResource = (path: string) =>
  RESOURCES.find((r) => r.path === path)
