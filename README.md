# Portfólio — Higino João

Site do portfólio de Higino João (CISO do Standard Bank Angola), baseado no
front-end do portfólio de Jaqueline Ngulo: React 19, TypeScript, Vite e
Tailwind CSS 4.

## Correr localmente

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # gera dist/
```

## Conteúdo

Todo o conteúdo está em `src/data/profile.ts`. Os textos marcados como
**PROVISÓRIO** (frase do Hero, competências, «Estratégias» e «Negócios»)
foram escritos pela equipa e devem ser validados pelo Higino.

- Cores: `src/index.css` (preto `#060606`, dourado `#D8B061`, cinza `#E2E2E2`).
- Monograma: `src/components/Logo.tsx` e `public/logo-hj.svg`.
- Foto do Hero: `public/higino-hero-*.webp` (recortada do manual da marca;
  substituir por um original em alta resolução, com o mesmo nome).

## API (futuro)

Sem `VITE_API_URL` o site usa apenas o conteúdo estático. Quando existir a
API (mesmo contrato da API da Jaqueline), basta definir `VITE_API_URL` no
`.env`; o painel `/admin` será acrescentado nessa fase.

## Publicação no Render (Static Site)

- Build: `npm install && npm run build` · Publish directory: `dist`
- Regra Rewrite: `/*` → `/index.html`
