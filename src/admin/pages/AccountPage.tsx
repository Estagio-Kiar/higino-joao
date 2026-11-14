import { useCallback, useEffect, useState, type FormEvent } from "react"
import {
  Info,
  RefreshCw,
  ShieldCheck,
  Trash2,
  UserPlus,
  UsersRound,
} from "lucide-react"

import { isAdmin, roleLabel, useSession } from "@/admin/auth"
import { GOOGLE_CLIENT_ID } from "@/admin/google"
import {
  Badge,
  Btn,
  Card,
  ConfirmDialog,
  Field,
  Input,
  PageHeader,
  Select,
  Skeleton,
  useToast,
} from "@/admin/ui"
import { api } from "@/lib/api"
import { relative } from "@/lib/format"
import type { AssignableRole, PanelUser, UserRole } from "@/lib/types"

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
/** Mínimo exigido pela API (SingUpAuthDto). */
const MIN_PASSWORD = 8

const ROLE_HINT: Record<UserRole, string> = {
  admin: "Acesso total: conteúdos e gestão da equipa.",
  manager: "Cria, edita e remove conteúdos. Não gere a equipa.",
  editor: "Cria e edita todos os conteúdos, mas não os remove.",
  user: "Cria conteúdos e edita apenas os que criou. Não remove.",
}

/** Funções que um administrador pode atribuir (o administrador é criado pela API). */
const ROLES: AssignableRole[] = ["manager", "editor", "user"]

const asAssignable = (role: string): AssignableRole =>
  ROLES.includes(role as AssignableRole) ? (role as AssignableRole) : "user"

const initialsOf = (text: string) =>
  text
    .split(/[\s@.]+/)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase())
    .join("")

function MyAccount() {
  const session = useSession()
  const user = session?.user
  if (!user) return null

  return (
    <Card className="p-6">
      <h2 className="font-heading text-sm font-bold text-ink">A minha conta</h2>
      <div className="mt-5 flex items-center gap-4">
        <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-ink font-heading text-lg font-bold text-white">
          {initialsOf(user.name || user.email)}
        </span>
        <div className="min-w-0">
          <p className="truncate font-semibold text-ink">
            {user.name || "Sem nome"}
          </p>
          <p className="truncate text-sm text-ink/55">{user.email}</p>
          <div className="mt-1.5">
            <Badge tone={isAdmin(user.role) ? "lip" : "neutral"}>
              {roleLabel(user.role)}
            </Badge>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-ink/8 bg-ink/[0.02] p-5">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-0.5 size-5 shrink-0 text-ink/60" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-ink">Entrar com Google</p>
            <p className="mt-1 text-sm text-ink/55">
              {GOOGLE_CLIENT_ID ? (
                <>
                  No login, use «Continuar com Google» com a conta Google de{" "}
                  <strong>{user.email}</strong>. A API reconhece-a pelo e-mail.
                </>
              ) : (
                <>
                  Indisponível: defina <code>VITE_GOOGLE_CLIENT_ID</code> no
                  front e as credenciais Google na API.
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </Card>
  )
}

/* ------------------------------------------------------------------ */
/* Equipa: lista, funções e remoção                                    */
/* ------------------------------------------------------------------ */

function Team({
  users,
  loading,
  error,
  reload,
}: {
  users: PanelUser[]
  loading: boolean
  error: string
  reload: () => void
}) {
  const session = useSession()
  const toast = useToast()
  const [changingRole, setChangingRole] = useState("")
  const [toDelete, setToDelete] = useState<PanelUser | null>(null)
  const [deleting, setDeleting] = useState(false)

  const changeRole = async (user: PanelUser, role: AssignableRole) => {
    if (role === user.role) return
    setChangingRole(user.id)
    try {
      await api.users.update(user, { role })
      toast.success(`Função de ${user.name || user.email}: ${roleLabel(role)}.`)
      reload()
    } catch (e) {
      toast.error((e as Error).message)
    } finally {
      setChangingRole("")
    }
  }

  const remove = async () => {
    if (!toDelete) return
    setDeleting(true)
    try {
      await api.users.remove(toDelete.id)
      toast.success(`Conta de ${toDelete.email} removida.`)
      setToDelete(null)
      reload()
    } catch (e) {
      toast.error((e as Error).message)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-lavender/40 text-ink">
            <UsersRound className="size-[18px]" />
          </span>
          <div>
            <h2 className="font-heading text-sm font-bold text-ink">Equipa</h2>
            <p className="mt-0.5 text-sm text-ink/55">
              Contas com acesso ao painel.
            </p>
          </div>
        </div>
        <Btn variant="ghost" size="icon" title="Atualizar" onClick={reload}>
          <RefreshCw className={loading ? "animate-spin" : ""} />
        </Btn>
      </div>

      {error ? (
        <p className="mt-5 rounded-xl bg-lip/10 px-4 py-3 text-sm text-lip">
          {error}
        </p>
      ) : loading && users.length === 0 ? (
        <div className="mt-5 flex flex-col gap-3">
          <Skeleton className="h-16" />
          <Skeleton className="h-16" />
        </div>
      ) : (
        <ul className="mt-5 divide-y divide-ink/8">
          {users.map((u) => {
            const me = u.id === session?.user.id
            const admin = isAdmin(u.role)
            return (
              <li
                key={u.id}
                className="flex flex-wrap items-center gap-3 py-3.5"
              >
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-ink font-heading text-xs font-bold text-white">
                  {initialsOf(u.name || u.email)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-2 truncate text-sm font-semibold text-ink">
                    {u.name || "Sem nome"}
                    {me && (
                      <span className="text-xs font-normal text-ink/45">
                        (você)
                      </span>
                    )}
                  </p>
                  <p className="truncate text-xs text-ink/55">{u.email}</p>
                  <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                    {!me && !admin ? (
                      <Select
                        aria-label={`Função de ${u.name || u.email}`}
                        value={asAssignable(u.role)}
                        disabled={changingRole === u.id}
                        onChange={(e) =>
                          changeRole(u, e.target.value as AssignableRole)
                        }
                        className="h-7 w-auto rounded-full py-0 pr-8 pl-3 text-xs"
                      >
                        {ROLES.map((r) => (
                          <option key={r} value={r}>
                            {roleLabel(r)}
                          </option>
                        ))}
                      </Select>
                    ) : (
                      <Badge tone={admin ? "lip" : "neutral"}>
                        {roleLabel(u.role)}
                      </Badge>
                    )}
                    {u.active === false && (
                      <Badge tone="caramel">Por confirmar</Badge>
                    )}
                    {u.google_id && <Badge tone="green">Google</Badge>}
                    {u.created_at && (
                      <span className="text-[11px] text-ink/40">
                        criada {relative(u.created_at)}
                      </span>
                    )}
                  </div>
                </div>
                {!me && !admin && (
                  <Btn
                    variant="ghost"
                    size="icon"
                    title="Remover conta"
                    className="hover:bg-lip/10 hover:text-lip"
                    onClick={() => setToDelete(u)}
                  >
                    <Trash2 />
                  </Btn>
                )}
              </li>
            )
          })}
        </ul>
      )}

      <ConfirmDialog
        open={!!toDelete}
        title="Remover conta?"
        description={
          toDelete ? (
            <>
              A conta de <strong>{toDelete.email}</strong> deixa de ter acesso
              ao painel. Esta ação não pode ser desfeita.
            </>
          ) : undefined
        }
        loading={deleting}
        onConfirm={remove}
        onClose={() => setToDelete(null)}
      />
    </Card>
  )
}

/* ------------------------------------------------------------------ */
/* Novo utilizador                                                      */
/* ------------------------------------------------------------------ */

type NewUser = {
  nome: string
  email: string
  password: string
  confirm: string
  role: AssignableRole
}

function NewUserForm({ onCreated }: { onCreated: () => void }) {
  const toast = useToast()
  const [v, setV] = useState<NewUser>({
    nome: "",
    email: "",
    password: "",
    confirm: "",
    role: "editor",
  })
  const [errors, setErrors] = useState<Partial<Record<keyof NewUser, string>>>(
    {}
  )
  const [saving, setSaving] = useState(false)

  const set = (k: keyof NewUser) => (e: { target: { value: string } }) => {
    setV((s) => ({ ...s, [k]: e.target.value }))
    if (errors[k]) setErrors((x) => ({ ...x, [k]: "" }))
  }

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    const errs: typeof errors = {}
    if (!v.nome.trim()) errs.nome = "Indique o nome."
    if (!EMAIL_RE.test(v.email.trim())) errs.email = "E-mail inválido."
    if (v.password.length < MIN_PASSWORD)
      errs.password = `Use pelo menos ${MIN_PASSWORD} caracteres.`
    if (v.confirm !== v.password)
      errs.confirm = "As palavras-passe não coincidem."
    setErrors(errs)
    if (Object.keys(errs).length) return

    setSaving(true)
    try {
      const res = await api.auth.signUp({
        nome: v.nome.trim(),
        email: v.email.trim().toLowerCase(),
        password: v.password,
        role: v.role,
      })
      toast.success(
        res?.message ||
          `Enviámos um link de confirmação para ${v.email.trim()}.`
      )
      setV({ nome: "", email: "", password: "", confirm: "", role: "editor" })
      onCreated()
    } catch (err) {
      toast.error((err as Error).message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card className="p-6">
      <div className="flex items-start gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-lavender/40 text-ink">
          <UserPlus className="size-[18px]" />
        </span>
        <div>
          <h2 className="font-heading text-sm font-bold text-ink">
            Adicionar utilizador
          </h2>
          <p className="mt-0.5 text-sm text-ink/55">
            A pessoa recebe um e-mail para confirmar a conta antes de entrar.
          </p>
        </div>
      </div>

      <form
        onSubmit={submit}
        className="mt-6 grid gap-5 sm:grid-cols-2"
        noValidate
      >
        <Field label="Nome" required error={errors.nome} htmlFor="u-nome">
          <Input id="u-nome" value={v.nome} onChange={set("nome")} />
        </Field>
        <Field label="E-mail" required error={errors.email} htmlFor="u-email">
          <Input
            id="u-email"
            type="email"
            autoComplete="off"
            value={v.email}
            onChange={set("email")}
          />
        </Field>
        <Field
          label="Palavra-passe"
          required
          error={errors.password}
          hint={`Mínimo ${MIN_PASSWORD} caracteres.`}
          htmlFor="u-pass"
        >
          <Input
            id="u-pass"
            type="password"
            autoComplete="new-password"
            value={v.password}
            onChange={set("password")}
          />
        </Field>
        <Field
          label="Confirmar palavra-passe"
          required
          error={errors.confirm}
          htmlFor="u-confirm"
        >
          <Input
            id="u-confirm"
            type="password"
            autoComplete="new-password"
            value={v.confirm}
            onChange={set("confirm")}
          />
        </Field>
        <Field
          label="Função"
          htmlFor="u-role"
          className="sm:col-span-2"
          hint={ROLE_HINT[v.role]}
        >
          <Select id="u-role" value={v.role} onChange={set("role")}>
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {roleLabel(r)}
              </option>
            ))}
          </Select>
        </Field>
        <div className="flex flex-wrap items-center justify-between gap-4 sm:col-span-2">
          <p className="flex items-center gap-1.5 text-xs text-ink/50">
            <Info className="size-3.5" /> O administrador é criado pela API · a
            conta fica ativa ao abrir o link do e-mail.
          </p>
          <Btn type="submit" loading={saving}>
            <UserPlus /> Criar e enviar convite
          </Btn>
        </div>
      </form>
    </Card>
  )
}

export function AccountPage() {
  const session = useSession()
  const admin = isAdmin(session?.user.role)
  const [users, setUsers] = useState<PanelUser[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const load = useCallback(async () => {
    setLoading(true)
    setError("")
    try {
      setUsers(await api.users.list())
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!admin) return
    let alive = true
    api.users
      .list()
      .then((list) => alive && setUsers(list))
      .catch((e: Error) => alive && setError(e.message))
    return () => {
      alive = false
    }
  }, [admin])

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Acesso"
        title="Conta & equipa"
        description="Os seus dados de acesso e as contas da equipa."
      />
      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
        <div className="flex flex-col gap-6">
          <MyAccount />
          {admin && (
            <Team users={users} loading={loading} error={error} reload={load} />
          )}
        </div>
        {admin ? (
          <NewUserForm onCreated={load} />
        ) : (
          <Card className="flex items-start gap-3 p-6 text-sm text-ink/60">
            <Info className="mt-0.5 size-4 shrink-0" />
            Só administradores podem ver a equipa e adicionar utilizadores.
          </Card>
        )}
      </div>
    </div>
  )
}
