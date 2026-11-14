import type {
  AdminUser,
  AgendaEvent,
  AssignableRole,
  AuthResponse,
  CareerHistory,
  Estrategia,
  Negocio,
  PanelUser,
  Profile,
  Skill,
  SocialLink,
} from "@/lib/types"

/** URL base da API. Defina `VITE_API_URL` no `.env` do front. */
export const API_URL = (
  (import.meta.env.VITE_API_URL as string | undefined) ?? ""
).replace(/\/+$/, "")

/** Converte caminhos relativos devolvidos pela API em URLs absolutas. */
export function assetUrl(src?: string | null) {
  if (!src) return undefined
  if (/^(https?:)?\/\//.test(src) || src.startsWith("data:")) return src
  if (src.startsWith("/profile/") || src.startsWith("/agenda/"))
    return `${API_URL}${src}`
  return src
}

/**
 * Versão redimensionada de uma imagem do Cloudinary (largura máxima,
 * qualidade e formato automáticos). Outros URLs ficam como estão.
 */
export function imageVariant(src: string | null | undefined, width: number) {
  const url = assetUrl(src)
  if (!url) return undefined
  if (/res\.cloudinary\.com\/.+\/image\/upload\//.test(url))
    return url.replace(
      "/image/upload/",
      `/image/upload/c_limit,w_${width},q_auto,f_auto/`
    )
  return url
}

/* ------------------------------------------------------------------ */
/* Conversão camelCase (API) <-> snake_case (front)                    */
/* ------------------------------------------------------------------ */

type Json = Record<string, unknown>

const toSnake = (k: string) => k.replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`)
const toCamel = (k: string) =>
  k.replace(/_([a-z])/g, (_, c: string) => c.toUpperCase())

/** «ADMIN» / «ROLE_ADMIN» -> «admin». */
export const normalizeRole = (role?: string | null) =>
  (role ?? "")
    .trim()
    .toLowerCase()
    .replace(/^role_/, "")

function fromApi<T>(obj: unknown): T {
  if (Array.isArray(obj)) return obj.map((x) => fromApi(x)) as T
  if (!obj || typeof obj !== "object") return obj as T
  const out: Json = {}
  for (const [k, v] of Object.entries(obj as Json)) out[toSnake(k)] = v
  if (typeof out.role === "string" && "email" in out)
    out.role = normalizeRole(out.role)
  return out as T
}

/** Campos geridos pela API que não se enviam. */
const SERVER_FIELDS = new Set(["id", "owner_id", "created_at", "updated_at"])

function toApi(obj: Json): Json {
  const out: Json = {}
  for (const [k, v] of Object.entries(obj)) {
    if (SERVER_FIELDS.has(k)) continue
    out[toCamel(k)] = v === "" ? null : v
  }
  return out
}

/* ------------------------------------------------------------------ */
/* Sessão                                                              */
/* ------------------------------------------------------------------ */

const SESSION_KEY = "hj-admin-session"

export type Session = {
  token: string
  refresh_token: string
  user: AdminUser
}

function readSession(): Session | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    return raw ? (JSON.parse(raw) as Session) : null
  } catch {
    return null
  }
}

let session: Session | null = readSession()
const listeners = new Set<(s: Session | null) => void>()

export const sessionStore = {
  get: () => session,
  set(next: Session | null) {
    session = next
    try {
      if (next) localStorage.setItem(SESSION_KEY, JSON.stringify(next))
      else localStorage.removeItem(SESSION_KEY)
    } catch {
      /* armazenamento indisponível: a sessão fica só em memória */
    }
    listeners.forEach((fn) => fn(next))
  },
  subscribe(fn: (s: Session | null) => void) {
    listeners.add(fn)
    return () => {
      listeners.delete(fn)
    }
  },
}

const toSession = (data: AuthResponse): Session => ({
  token: data.token,
  refresh_token: data.refresh_token,
  user: { ...data.user, role: normalizeRole(data.user.role) },
})

/* ------------------------------------------------------------------ */
/* Pedidos                                                             */
/* ------------------------------------------------------------------ */

export class ApiError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

const MESSAGES: Record<number, string> = {
  400: "Dados inválidos. Verifique os campos e tente novamente.",
  401: "Sessão expirada. Inicie sessão novamente.",
  403: "Não tem permissão para esta ação.",
  404: "Registo não encontrado.",
  409: "Já existe um registo com estes dados.",
  413: "Ficheiro demasiado grande.",
  500: "Erro interno da API. Tente novamente mais tarde.",
  502: "A API não conseguiu contactar um serviço externo (e-mail ou imagens).",
}

/** Mensagens da API que chegam em inglês ou pouco claras. */
const API_MESSAGES: Record<string, string> = {
  "Bad credentials": "E-mail ou palavra-passe incorretos.",
  "Credenciais inválidas": "E-mail ou palavra-passe incorretos.",
  "Dont can to create other user with role ADMIN.":
    "Não é possível criar outro administrador pelo painel.",
  "User is disabled": "A sua conta ainda não está ativa. Confirme o e-mail.",
}

async function toError(res: Response) {
  let message = MESSAGES[res.status] ?? `Erro inesperado (${res.status}).`
  try {
    // Formato da API: { timestamp, status, error, message, path, details[] }
    const body = (await res.json()) as {
      message?: string
      details?: string[]
    }
    const raw = body?.message?.trim()
    const details = Array.isArray(body?.details) ? body.details : []
    if (raw && API_MESSAGES[raw]) message = API_MESSAGES[raw]
    else if (res.status === 400 && details.length)
      message = `Dados inválidos: ${details.join(" · ")}`
    else if (raw && res.status !== 500) message = raw
  } catch {
    /* corpo sem JSON */
  }
  if (res.status === 401 && message === MESSAGES[401] && !sessionStore.get())
    message = "E-mail ou palavra-passe incorretos."
  return new ApiError(res.status, message)
}

let refreshing: Promise<boolean> | null = null

async function refreshSession(): Promise<boolean> {
  const current = sessionStore.get()
  if (!current?.refresh_token) return false
  refreshing ??= (async () => {
    try {
      const res = await fetch(`${API_URL}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh_token: current.refresh_token }),
      })
      if (!res.ok) throw new Error()
      sessionStore.set(toSession((await res.json()) as AuthResponse))
      return true
    } catch {
      sessionStore.set(null)
      return false
    } finally {
      refreshing = null
    }
  })()
  return refreshing
}

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE"
  body?: unknown
  auth?: boolean
  signal?: AbortSignal
}

export async function request<T>(
  path: string,
  { method = "GET", body, auth = false, signal }: RequestOptions = {},
  retry = true
): Promise<T> {
  if (!API_URL)
    throw new ApiError(0, "A API não está configurada (defina VITE_API_URL).")
  const headers: Record<string, string> = { Accept: "application/json" }
  const isForm = body instanceof FormData
  if (body !== undefined && !isForm)
    headers["Content-Type"] = "application/json"
  const token = sessionStore.get()?.token
  if (auth && token) headers.Authorization = `Bearer ${token}`

  let res: Response
  try {
    res = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      signal,
      body:
        body === undefined ? undefined : isForm ? body : JSON.stringify(body),
    })
  } catch (e) {
    if ((e as Error).name === "AbortError") throw e
    throw new ApiError(
      0,
      "Não foi possível ligar à API. Confirme que o servidor está a correr."
    )
  }

  if (res.status === 401 && auth && retry && (await refreshSession())) {
    return request<T>(path, { method, body, auth, signal }, false)
  }
  if (!res.ok) throw await toError(res)
  if (res.status === 204) return undefined as T
  const text = await res.text()
  return (text ? fromApi<T>(JSON.parse(text)) : undefined) as T
}

/**
 * CRUD de um recurso REST. A API usa PUT (substituição completa): `update`
 * junta as alterações ao registo atual antes de enviar, para não apagar
 * campos que o formulário não mostra.
 */
function resource<T extends { id: string }>(base: string) {
  const get = (id: string) => request<T>(`${base}/${id}`)
  return {
    list: (signal?: AbortSignal) => request<T[]>(base, { signal }),
    get,
    create: (data: Partial<T>) =>
      request<T>(base, {
        method: "POST",
        body: toApi(data as Json),
        auth: true,
      }),
    update: async (id: string, patch: Partial<T>) => {
      const current = await get(id)
      return request<T>(`${base}/${id}`, {
        method: "PUT",
        body: toApi({ ...(current as Json), ...(patch as Json) }),
        auth: true,
      })
    },
    remove: (id: string) =>
      request<unknown>(`${base}/${id}`, { method: "DELETE", auth: true }),
  }
}

/** Envio de imagem associado a um registo (POST /{recurso}/{id}/upload). */
function uploader<T>(base: string) {
  return (id: string, file: File) => {
    const form = new FormData()
    form.append("file", file)
    return request<T>(`${base}/${id}/upload`, {
      method: "POST",
      body: form,
      auth: true,
    })
  }
}

export const api = {
  auth: {
    signIn: async (email: string, password: string) =>
      toSession(
        await request<AuthResponse>("/auth/sing-in", {
          method: "POST",
          body: { email, password },
        })
      ),
    /** Entra com o credential (id_token) do Google Identity Services. */
    google: async (credential: string) =>
      toSession(
        await request<AuthResponse>("/auth/login-google", {
          method: "POST",
          body: { credential },
        })
      ),
    /**
     * Cria um utilizador (só administradores). A API envia um link de
     * confirmação por e-mail; a conta fica ativa depois de o abrir.
     */
    signUp: (data: {
      nome: string
      email: string
      password: string
      role: AssignableRole
    }) =>
      request<{ message: string }>("/auth/sing-up", {
        method: "POST",
        body: { ...data, role: data.role.toUpperCase() },
        auth: true,
      }),
    /** Pede um código de 6 dígitos para redefinir a palavra-passe. */
    requestPasswordReset: (email: string) =>
      request<{ message: string }>("/auth/forgot-password", {
        method: "POST",
        body: { email },
      }),
    /** Define a nova palavra-passe com o código recebido por e-mail. */
    confirmPasswordReset: (data: {
      email: string
      code: string
      newPassword: string
    }) =>
      request<{ message: string }>("/auth/reset-password", {
        method: "POST",
        body: data,
      }),
  },
  profile: {
    ...resource<Profile>("/profile"),
    /** Envia a foto do Hero; a API guarda-a no Cloudinary e atualiza o perfil. */
    upload: uploader<Profile>("/profile"),
  },
  social: resource<SocialLink>("/social-links"),
  career: resource<CareerHistory>("/career-history"),
  skills: resource<Skill>("/skills"),
  agenda: {
    ...resource<AgendaEvent>("/agenda"),
    upload: uploader<AgendaEvent>("/agenda"),
  },
  negocios: resource<Negocio>("/negocio"),
  estrategias: resource<Estrategia>("/estrategia"),
  /** Gestão de utilizadores (só administradores). */
  users: {
    list: () => request<PanelUser[]>("/users", { auth: true }),
    me: () => request<AdminUser>("/users/me", { auth: true }),
    /** A API substitui todos os campos (email, nome, função e estado). */
    update: (
      user: PanelUser,
      patch: { role?: AssignableRole; name?: string; active?: boolean }
    ) =>
      request<PanelUser>(`/users/${user.id}`, {
        method: "PUT",
        body: {
          email: user.email,
          name: patch.name ?? user.name ?? user.email,
          role: (patch.role ?? normalizeRole(user.role)).toUpperCase(),
          // A API ainda não devolve o estado; por omissão mantém a conta ativa.
          active: patch.active ?? user.active ?? true,
        },
        auth: true,
      }),
    remove: (id: string) =>
      request<void>(`/users/${id}`, { method: "DELETE", auth: true }),
  },
}

export type ApiResources = typeof api
