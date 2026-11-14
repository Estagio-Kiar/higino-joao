import type { LucideIcon } from "lucide-react"
import {
  Briefcase,
  CalendarDays,
  Gauge,
  Handshake,
  ImagePlus,
  KeyRound,
  LayoutDashboard,
  LifeBuoy,
  Rocket,
  Share2,
  ShieldCheck,
  Target,
  UserRound,
  UsersRound,
} from "lucide-react"

import { RESOURCES } from "@/admin/resources"

/**
 * Conteúdo do tutorial do painel. Cada tópico explica, passo a passo,
 * uma funcionalidade. `route` liga o tópico à página do painel (é o tópico
 * aberto pelo botão de ajuda nessa página). Tópicos com `resource` só
 * aparecem se essa página existir no painel.
 */

export type Step = {
  title: string
  text: string
  /** Dica opcional, mostrada em destaque. */
  tip?: string
}

export type Topic = {
  id: string
  title: string
  summary: string
  icon: LucideIcon
  group: "Começar" | "Conteúdos" | "Imagens" | "Acesso" | "Ajuda"
  /** Página do painel relacionada (ex.: "/admin/percurso"). */
  route?: string
  /** Caminho do recurso em RESOURCES de que o tópico depende. */
  resource?: string
  /** Só administradores podem fazer esta ação. */
  adminOnly?: boolean
  steps: Step[]
}

const ALL_TOPICS: Topic[] = [
  {
    id: "primeiros-passos",
    title: "Primeiros passos",
    summary: "Entrar no painel, importar o conteúdo e conhecer o menu.",
    icon: Rocket,
    group: "Começar",
    route: "/admin",
    steps: [
      {
        title: "Inicie sessão",
        text: "Abra /admin, escreva o seu e-mail e a palavra-passe e clique em «Entrar no painel». Também pode usar «Continuar com Google» com a conta Google do mesmo e-mail.",
        tip: "Contas novas só entram depois de confirmar o e-mail (link enviado no convite).",
      },
      {
        title: "Importe o conteúdo atual (só na primeira vez)",
        text: "No Painel, se aparecer o cartão «Primeiros passos», clique em «Importar agora». O perfil, o percurso, as competências, as estratégias, os negócios, os eventos e os contactos que o site já mostra passam para a base de dados.",
      },
      {
        title: "Use o menu lateral",
        text: "À esquerda estão todas as áreas: Perfil, conteúdos (Percurso, Competências, Estratégias, Negócios, Eventos), Redes & contacto e Conta & equipa. O número ao lado de cada item é a quantidade de registos.",
      },
      {
        title: "Veja o resultado no site",
        text: "Clique em «Ver site». As alterações aparecem assim que guarda; se o site já estiver aberto noutro separador, basta voltar a ele.",
      },
      {
        title: "Peça ajuda em qualquer página",
        text: "O botão «Ajuda» no canto inferior esquerdo abre as instruções da página onde está. Este tutorial completo está em «Tutorial», no menu.",
      },
    ],
  },
  {
    id: "painel",
    title: "Painel inicial",
    summary: "Contadores, atividade recente e ações rápidas.",
    icon: LayoutDashboard,
    group: "Começar",
    route: "/admin",
    steps: [
      {
        title: "Consulte os contadores",
        text: "Cada cartão mostra quantos registos existem numa área. Clique num cartão para abrir essa página.",
      },
      {
        title: "Acompanhe a atividade recente",
        text: "A lista «Atividade recente» mostra os últimos registos alterados. Clique num deles para ir à página correspondente.",
      },
      {
        title: "Use as ações rápidas",
        text: "Atalhos para editar o perfil e criar estratégias, áreas de negócio, eventos ou marcos do percurso.",
      },
      {
        title: "Conheça o painel em 6 passos",
        text: "O botão «Conhecer o painel» abre um tour guiado. Abre sozinho na primeira entrada.",
      },
    ],
  },
  {
    id: "perfil",
    title: "Editar o perfil",
    summary: "Etiqueta, frase de apresentação, biografia e localização.",
    icon: UserRound,
    group: "Conteúdos",
    route: "/admin/perfil",
    steps: [
      {
        title: "Abra «Perfil» no menu",
        text: "O formulário está dividido em «Destaque inicial» (topo do site), «Sobre» e «Fotografia». À direita vê a pré-visualização.",
      },
      {
        title: "Altere os textos",
        text: "Na biografia, deixe uma linha em branco entre parágrafos: cada bloco vira um parágrafo da secção «Sobre».",
      },
      {
        title: "Guarde",
        text: "Clique em «Guardar alterações» (ou Ctrl + S). «Descartar» volta ao que estava guardado.",
        tip: "Se ainda não existir perfil, o formulário vem preenchido com os textos do site: reveja e clique em «Criar perfil».",
      },
    ],
  },
  {
    id: "foto-perfil",
    title: "Foto do topo do site",
    summary: "Trocar a fotografia do Hero.",
    icon: ImagePlus,
    group: "Imagens",
    route: "/admin/perfil",
    steps: [
      {
        title: "Abra «Perfil» e desça até «Fotografia»",
        text: "A foto só pode ser carregada depois de o perfil existir.",
      },
      {
        title: "Arraste ou escolha a imagem",
        text: "JPEG, PNG, WEBP ou GIF. A imagem vai logo para a API, que a guarda no Cloudinary.",
      },
      {
        title: "Sem foto?",
        text: "Se o campo ficar vazio, o site usa a foto com o monograma HJ.",
      },
    ],
  },
  {
    id: "percurso",
    title: "Percurso profissional",
    summary: "Funções e marcos da linha do tempo.",
    icon: Briefcase,
    group: "Conteúdos",
    route: "/admin/percurso",
    resource: "percurso",
    steps: [
      {
        title: "Abra «Percurso» e clique em «Adicionar marco»",
        text: "Preencha a função (obrigatória), a organização, o período (ex.: «2024 – presente») e a descrição.",
      },
      {
        title: "A ordem é a da criação",
        text: "O site mostra os marcos pela ordem em que foram criados: crie-os do mais antigo para o mais recente.",
      },
      {
        title: "Edite ou remova",
        text: "Clique num marco (ou no lápis) para editar. O caixote do lixo remove — só gestores e administradores o veem, e há sempre confirmação.",
      },
    ],
  },
  {
    id: "competencias",
    title: "Competências",
    summary: "Os botões da secção «Sobre».",
    icon: Gauge,
    group: "Conteúdos",
    route: "/admin/competencias",
    resource: "competencias",
    steps: [
      {
        title: "Adicione uma competência",
        text: "Escreva o nome e, se quiser, a percentagem de 0 a 100. No site aparece como um botão, com a percentagem dentro.",
      },
    ],
  },
  {
    id: "estrategias",
    title: "Estratégias",
    summary: "Os cartões da secção «Estratégias».",
    icon: Target,
    group: "Conteúdos",
    route: "/admin/estrategias",
    resource: "estrategias",
    steps: [
      {
        title: "Abra «Estratégias» e clique em «Adicionar estratégia»",
        text: "Preencha o título, a ordem, o ícone e a descrição.",
      },
      {
        title: "Ordem",
        text: "A ordem define a posição do cartão no site (1, 2, 3…). Cada estratégia tem de ter um número diferente.",
        tip: "Para trocar duas de lugar, mude primeiro uma delas para um número livre (ex.: 99).",
      },
      {
        title: "Ícone",
        text: "Escolha entre escudo, cadeado, instituição, medidor, pessoas ou inovação.",
      },
    ],
  },
  {
    id: "negocios",
    title: "Negócios",
    summary: "As formas de colaboração da secção «Negócios».",
    icon: Handshake,
    group: "Conteúdos",
    route: "/admin/negocios",
    resource: "negocios",
    steps: [
      {
        title: "Abra «Negócios» e clique em «Adicionar área de negócio»",
        text: "Preencha o título (ex.: «Palestras e painéis») e a descrição.",
      },
      {
        title: "Etiquetas",
        text: "Escreva as etiquetas separadas por vírgulas (ex.: «Fóruns, Conferências, Painéis»). Aparecem por baixo da descrição.",
      },
    ],
  },
  {
    id: "eventos",
    title: "Eventos",
    summary: "Palestras e participações, futuras e passadas.",
    icon: CalendarDays,
    group: "Conteúdos",
    route: "/admin/eventos",
    resource: "eventos",
    steps: [
      {
        title: "Abra «Eventos» e clique em «Adicionar evento»",
        text: "Preencha o nome, a data e hora, o tipo (Orador, Palestra, Painel…), o local, o estado e a descrição. O link é opcional.",
      },
      {
        title: "Junte uma imagem (opcional)",
        text: "Num evento novo, a imagem escolhida é enviada logo depois de criar o evento. Num evento existente, vai de imediato.",
      },
      {
        title: "Próximos e anteriores",
        text: "No site, os eventos a partir de hoje aparecem em «Próximos encontros»; os outros em «Eventos anteriores».",
      },
    ],
  },
  {
    id: "redes",
    title: "Redes & contacto",
    summary: "Os botões da secção «Contactos».",
    icon: Share2,
    group: "Conteúdos",
    route: "/admin/redes",
    resource: "redes",
    steps: [
      {
        title: "Adicione uma rede",
        text: "Escolha a plataforma (LinkedIn, GitHub…) e cole o link completo. Cada plataforma e cada link só podem existir uma vez.",
      },
      {
        title: "Botão «Enviar e-mail»",
        text: "Escolha a plataforma «E-mail» e escreva apenas o endereço.",
      },
    ],
  },
  {
    id: "equipa",
    title: "Conta & equipa",
    summary: "Convidar pessoas, mudar funções e remover contas.",
    icon: UsersRound,
    group: "Acesso",
    route: "/admin/conta",
    steps: [
      {
        title: "Veja a sua conta",
        text: "Em «Conta & equipa» estão o seu nome, e-mail e função.",
      },
      {
        title: "Convide alguém (administradores)",
        text: "Em «Adicionar utilizador», preencha nome, e-mail, palavra-passe (mínimo 8 caracteres) e função. A pessoa recebe um e-mail para ativar a conta.",
        tip: "Pode escolher Gestor, Editor ou Utilizador. A conta de administrador é criada pela própria API.",
      },
      {
        title: "Mude a função de alguém (administradores)",
        text: "Na lista da equipa, escolha a nova função no seletor ao lado do nome.",
      },
      {
        title: "Remova uma conta (administradores)",
        text: "O caixote do lixo ao lado da pessoa remove a conta, com confirmação. A conta de administrador não pode ser removida.",
      },
    ],
  },
  {
    id: "permissoes",
    title: "Funções e permissões",
    summary: "O que cada perfil pode fazer.",
    icon: ShieldCheck,
    group: "Acesso",
    steps: [
      {
        title: "Administrador",
        text: "Faz tudo: cria, edita e remove conteúdos e gere a equipa.",
      },
      {
        title: "Gestor",
        text: "Cria, edita e remove conteúdos, mas não gere a equipa.",
      },
      {
        title: "Editor",
        text: "Cria e edita todos os conteúdos, mas não remove.",
      },
      {
        title: "Utilizador",
        text: "Cria conteúdos e edita apenas os que criou. Não remove.",
      },
    ],
  },
  {
    id: "palavra-passe",
    title: "Recuperar a palavra-passe",
    summary: "Redefinir o acesso com um código enviado por e-mail.",
    icon: KeyRound,
    group: "Acesso",
    steps: [
      {
        title: "No login, clique em «Esqueci-me da palavra-passe»",
        text: "Escreva o e-mail da conta e clique em «Enviar código».",
      },
      {
        title: "Abra o e-mail",
        text: "Receberá um código de 6 dígitos.",
      },
      {
        title: "Defina a nova palavra-passe",
        text: "Escreva o código e a nova palavra-passe (mínimo 8 caracteres, duas vezes). Depois entre normalmente.",
      },
    ],
  },
  {
    id: "problemas",
    title: "Resolução de problemas",
    summary: "O que fazer quando algo não funciona.",
    icon: LifeBuoy,
    group: "Ajuda",
    steps: [
      {
        title: "«Não foi possível ligar à API»",
        text: "A API pode estar a arrancar (no plano gratuito do Render demora cerca de 1 minuto). Espere e tente de novo.",
      },
      {
        title: "«Não tem permissão para esta ação»",
        text: "A sua função não permite essa ação (ex.: remover, ou editar um registo de outra pessoa). Peça a um gestor ou administrador.",
      },
      {
        title: "Não vejo a alteração no site",
        text: "Volte ao separador do site (ele atualiza sozinho) ou recarregue a página.",
      },
      {
        title: "A imagem não carrega",
        text: "Confirme o formato (JPEG, PNG, WEBP ou GIF). Se o erro vier do Cloudinary, avise quem gere a API.",
      },
    ],
  },
]

const availablePaths = new Set(RESOURCES.map((r) => r.path))

/** Tópicos disponíveis neste painel (ignora páginas que não existam). */
export const TOPICS = ALL_TOPICS.filter(
  (t) => !t.resource || availablePaths.has(t.resource)
)

export const GROUP_ORDER: Topic["group"][] = [
  "Começar",
  "Conteúdos",
  "Imagens",
  "Acesso",
  "Ajuda",
]

/** Tópico principal de uma página do painel (para o botão de ajuda). */
export function topicForPath(path: string): Topic | undefined {
  const clean = path.replace(/\/+$/, "") || "/admin"
  if (clean === "/admin/tutorial") return undefined
  return (
    TOPICS.find((t) => t.route === clean && t.id !== "primeiros-passos") ??
    TOPICS.find(
      (t) => t.route && clean.startsWith(t.route) && t.route !== "/admin"
    ) ??
    TOPICS.find((t) => t.id === "primeiros-passos")
  )
}
