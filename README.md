# Portfólio Higino João — Front-end

Site público e painel de administração (`/admin`) do portfólio de **Higino João**, Chief Information Security Officer (CISO) do Standard Bank Angola.

O site mostra o perfil, o percurso, as competências, as estratégias, os negócios, os eventos e os contactos. O painel tem o mesmo desenho do painel do portfólio de Jaqueline Ngulo, com a paleta da marca HJ, e permite à equipa atualizar os conteúdos sem mexer no código. Os dados vêm da API [`higino-joao-server`](https://github.com/Estagio-Kiar/higino-joao-server) (Java / Spring Boot).

Projeto desenvolvido pelo **Grupo KIAR**.

## Stack

| Tecnologia | Uso |
| --- | --- |
| React 19 + TypeScript 6 | Interface do site e do painel |
| Vite 8 | Servidor de desenvolvimento e build |
| Tailwind CSS 4 + tw-animate-css | Estilos e animações |
| lucide-react | Ícones |
| driver.js | Tour guiado do painel |
| Google Identity Services | Entrar com Google |

## Começar

Requisitos: Node.js 22 ou superior e a API a correr (localmente em `http://localhost:8080` ou no Render).

```bash
npm install
cp .env.example .env
npm run dev         # http://localhost:5173
```

### Variáveis de ambiente (`.env`)

| Variável | Descrição | Exemplo |
| --- | --- | --- |
| `VITE_API_URL` | Endereço da API. Vazio: o site usa só o conteúdo de `src/data/profile.ts` e o painel não funciona | `http://localhost:8080` |
| `VITE_GOOGLE_CLIENT_ID` | Opcional. Ativa «Continuar com Google» no login | `xxxx.apps.googleusercontent.com` |

### Do lado da API

1. **Origem do front:** `app.frontend-url` tem de incluir o endereço do site (ex.: `http://localhost:5173,https://<site>.onrender.com`), para o CORS.
2. **Primeiro administrador:** é criado pela API no arranque (`app.boostrap.user.*`). Não existe registo público no front.
3. **Google:** a API reconhece a conta Google pelo e-mail; adicione os domínios do site em *Authorized JavaScript origins* no Google Cloud.

## Scripts

| Comando | O que faz |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Verificação de tipos e build de produção em `dist/` |
| `npm run preview` | Pré-visualiza o build |
| `npm run lint` | ESLint |
| `npm run format` | Prettier |

## Como funciona

### Site público

Lê da API o perfil (textos e foto do Hero), o percurso, as competências, as estratégias, os negócios, os eventos e as redes sociais. Se a API estiver em baixo, ou uma secção vier vazia, usa o conteúdo de `src/data/profile.ts`, para o site nunca ficar vazio. Os dados voltam a ser pedidos quando o separador volta a ficar visível.

### Painel `/admin`

- Login com e-mail e palavra-passe ou com Google; sessão JWT com renovação automática.
- Recuperação da palavra-passe com código de 6 dígitos enviado por e-mail.
- Painel inicial com contadores, atividade recente, ações rápidas e importação do conteúdo do site para a API.
- Edição do perfil com pré-visualização e envio da foto do Hero (`POST /profile/{id}/upload`).
- Percurso, Competências, Estratégias, Negócios, Eventos (com imagem) e Redes & contacto.
- Conta & equipa: convidar utilizadores, mudar funções e remover contas (administradores).
- Tour guiado, tutorial passo a passo e botão de ajuda em cada página.

### Funções e permissões

As regras são da API; o painel só mostra os botões que cada função pode usar.

| Função | Criar | Editar | Remover | Gerir a equipa |
| --- | :---: | :---: | :---: | :---: |
| Administrador (`ADMIN`) | ✓ | ✓ | ✓ | ✓ |
| Gestor (`MANAGER`) | ✓ | ✓ | ✓ | — |
| Editor (`EDITOR`) | ✓ | ✓ | — | — |
| Utilizador (`USER`) | ✓ | só os seus registos | — | — |

### Formato dos dados

A API usa camelCase (`bioDescription`, `photoUrl`, `createdAt`) e PUT com substituição completa. `src/lib/api.ts` converte para snake_case (o formato usado pelo painel) e, ao editar, junta as alterações ao registo atual antes de enviar.

## Endpoints da API usados

| Área | Endpoints |
| --- | --- |
| Autenticação | `POST /auth/sing-in`, `/auth/refresh`, `/auth/sing-up` (admin), `/auth/forgot-password`, `/auth/reset-password`, `/auth/login-google` |
| Conteúdos (GET público; POST/PUT com sessão; DELETE gestor/admin) | `/profile`, `/career-history`, `/skills`, `/estrategia`, `/negocio`, `/agenda`, `/social-links` |
| Imagens | `POST /profile/{id}/upload`, `POST /agenda/{id}/upload` |
| Equipa (admin) | `GET /users`, `PUT /users/{id}`, `DELETE /users/{id}` |

A confirmação de e-mail é feita diretamente na API (`GET /auth/confirm-email`), pelo link enviado no convite.

## Estrutura

```text
src/
├── App.tsx                 rotas: site e /admin
├── data/profile.ts         conteúdo estático de reserva
├── content/                dados do site (API + reserva)
├── components/             secções do site, cabeçalho, rodapé e efeitos
├── lib/
│   ├── api.ts              cliente HTTP, sessão, refresh token e conversão de campos
│   ├── types.ts            modelos da API
│   └── router.tsx          router baseado em history
└── admin/
    ├── AdminApp.tsx        rotas do painel
    ├── auth.ts             sessão e regras de permissão por função
    ├── resources.tsx       formulários de cada conteúdo
    ├── pages/              painel, perfil, conteúdos, conta & equipa
    ├── onboarding/         tour guiado
    └── tutorial/           tutorial e botão de ajuda
```

## Publicação (Render — Static Site)

| Campo | Valor |
| --- | --- |
| Build Command | `npm install --include=dev && npm run build` |
| Publish Directory | `dist` |
| Variáveis | `NODE_VERSION=22`, `VITE_API_URL` (URL da API no Render) e, se usado, `VITE_GOOGLE_CLIENT_ID` |
| Redirects/Rewrites | `/*` → `/index.html` (Rewrite), para `/admin` funcionar |

As variáveis `VITE_*` são lidas no momento do build: depois de as mudar, faça um novo deploy.
