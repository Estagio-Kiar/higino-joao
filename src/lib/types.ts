/**
 * Modelos da API (higino-joao-server, Java/Spring).
 *
 * A API devolve os campos em camelCase (`bioDescription`, `createdAt`…);
 * `lib/api.ts` converte-os para snake_case, o formato usado em todo o front
 * (o mesmo do painel do portfólio de Jaqueline Ngulo).
 */

export type Timestamps = {
  created_at: string
  updated_at: string
}

/** Autor do registo. Utilizadores com a função `user` só alteram os seus. */
export type Owned = { owner_id: string | null }

export type Profile = Timestamps &
  Owned & {
    id: string
    tagline: string | null
    title: string | null
    quote: string | null
    bio: string | null
    bio_description: string | null
    location: string | null
    experience_years: number | null
    /** Foto do Hero (Cloudinary). */
    photo_url: string | null
  }

export type SocialLink = Timestamps &
  Owned & {
    id: string
    platform: string
    profile_url: string
    icon_name: string | null
  }

export type CareerHistory = Timestamps &
  Owned & {
    id: string
    role: string
    company: string | null
    period: string | null
    description: string | null
  }

export type Skill = Timestamps &
  Owned & {
    id: string
    name: string
    /** 0–100 (opcional). */
    percentage: number | null
  }

/** Evento da agenda (secção «Eventos»). */
export type AgendaEvent = Timestamps &
  Owned & {
    id: string
    /** ISO 8601 (Instant). */
    data: string
    evento: string
    tipo: string
    descricao: string
    local: string
    status: string
    link: string | null
    imagem: string | null
  }

/** Secção «Negócios». */
export type Negocio = Timestamps &
  Owned & {
    id: string
    titulo: string
    descricao: string
    tags: string[]
  }

/** Secção «Estratégias». */
export type Estrategia = Partial<Timestamps> &
  Owned & {
    id: string
    /** Posição na secção (única). */
    ordem: number
    /** Nome do ícone (shield, gauge, landmark, users, sparkles, lock…). */
    icon: string
    titulo: string
    descricao: string
  }

/** Funções da API (guardadas em maiúsculas; o front usa minúsculas). */
export type UserRole = "admin" | "manager" | "editor" | "user"

/** Funções que um administrador pode atribuir (o admin é criado pela API). */
export type AssignableRole = Exclude<UserRole, "admin">

/** Utilizador do painel (GET /users). */
export type PanelUser = {
  id: string
  email: string
  name: string | null
  role: string
  google_id: string | null
  /** Ainda não devolvido pela API; quando vier, é respeitado. */
  active?: boolean
  created_at?: string
}

export type AdminUser = {
  id: string
  email: string
  name: string | null
  role: string
  google_id: string | null
}

export type AuthResponse = {
  token: string
  refresh_token: string
  user: AdminUser
}
