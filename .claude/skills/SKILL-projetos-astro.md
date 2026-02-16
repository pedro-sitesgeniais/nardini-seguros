# Skill: Projetos Astro

## Stack Padrão
- Astro 5+
- Tailwind CSS v4
- TypeScript (strict)
- React (apenas para componentes interativos)

---

## Estrutura de Pastas

```
src/
├── assets/
│   └── images/            # Imagens otimizadas pelo Astro
├── components/
│   ├── ui/                # Componentes base reutilizáveis (Button, Card, Badge)
│   ├── sections/          # Seções de página (Hero, Features, CTA, FAQ)
│   └── forms/             # Formulários interativos (.tsx)
├── layouts/
│   └── Layout.astro       # Layout base HTML
├── pages/
│   ├── index.astro        # Home
│   └── [slug].astro       # Páginas dinâmicas (se necessário)
├── styles/
│   └── global.css         # Tailwind directives + estilos globais
├── content/               # Content Collections (se usar blog/posts)
└── lib/
    └── utils.ts           # Funções utilitárias
public/
├── favicon.svg
├── robots.txt
└── og-image.png           # Imagens estáticas não processadas
```

---

## Convenções de Código

### Nomenclatura
- Componentes `.astro` e `.tsx`: **PascalCase** → `HeroSection.astro`
- Páginas: **kebab-case** → `sobre-nos.astro`
- Utilitários/libs: **camelCase** → `formatDate.ts`
- Assets: **kebab-case** → `hero-background.webp`

### Componentes Astro (.astro)
```astro
---
// 1. Imports
import { Image } from 'astro:assets';
import Button from '@/components/ui/Button.astro';

// 2. Interface de Props (quando recebe props)
interface Props {
  title: string;
  description?: string;
}

// 3. Destructuring de props
const { title, description = 'Descrição padrão' } = Astro.props;

// 4. Lógica server-side (fetch, cálculos, etc.)
const data = await fetch('https://api.example.com/data').then(r => r.json());
---

<!-- 5. Template HTML -->
<section class="py-16">
  <h2 class="text-3xl font-bold">{title}</h2>
  {description && <p class="text-gray-600">{description}</p>}
  <slot />
</section>

<!-- 6. Estilos scoped (quando necessário) -->
<style>
  /* Estilos específicos deste componente */
</style>
```

### Componentes React (.tsx) — Apenas para Interatividade
```tsx
import { useState } from 'react';

interface Props {
  placeholder?: string;
}

export default function SearchInput({ placeholder = 'Buscar...' }: Props) {
  const [query, setQuery] = useState('');

  return (
    <input
      type="text"
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder={placeholder}
      className="border rounded px-4 py-2"
    />
  );
}
```

### Uso de React dentro de Astro
```astro
---
import SearchInput from '@/components/forms/SearchInput.tsx';
---
<div>
  <h2>Busca</h2>
  <SearchInput client:visible placeholder="Digite sua busca..." />
</div>
```

---

## Regras de Decisão

### Quando usar `.astro`
- Conteúdo estático (textos, imagens, listas)
- Layouts e wrappers
- Seções de página sem interatividade
- Componentes que apenas recebem props e renderizam HTML
- Navegação com links simples

### Quando usar `.tsx` (React)
- Formulários com validação
- Componentes com estado (useState, useReducer)
- Animações complexas controladas por JS
- Integrações com bibliotecas React (ex: react-hook-form, framer-motion)
- Qualquer coisa que precise de event handlers

### Diretivas de Hidratação
| Diretiva | Uso |
|---|---|
| `client:load` | JS carrega imediatamente. Formulários acima da dobra, nav mobile. |
| `client:visible` | JS carrega quando visível no viewport. Padrão recomendado. |
| `client:idle` | JS carrega quando browser está idle. Chat, analytics. |
| `client:media="(query)"` | JS carrega se media query bate. Menu mobile. |
| Sem diretiva | Renderiza HTML estático, zero JS. Usar sempre que possível. |

---

## SEO e Performance

### Layout Base Obrigatório
Todo `Layout.astro` deve conter:
- `<html lang="pt-BR">`
- `<meta charset="UTF-8">`
- `<meta name="viewport" content="width=device-width, initial-scale=1.0">`
- `<title>` dinâmico via props
- `<meta name="description">` dinâmico via props
- Open Graph tags (og:title, og:description, og:image, og:url)
- Canonical URL
- Favicon
- Preconnect para fonts externas

### Imagens
- SEMPRE usar `<Image />` de `astro:assets` para imagens em `src/assets/`
- SEMPRE definir `width`, `height` e `alt`
- Usar `loading="lazy"` para imagens abaixo da dobra
- Usar `loading="eager"` para LCP (hero image)
- Preferir WebP/AVIF

```astro
---
import { Image } from 'astro:assets';
import heroImg from '@/assets/images/hero.webp';
---
<Image src={heroImg} alt="Descrição da imagem" width={1200} height={630} loading="eager" />
```

### Fonts
- Preferir fontes self-hosted em `public/fonts/`
- Usar `font-display: swap`
- Preload da fonte principal no `<head>`

---

## Estilização

### Prioridades
1. **Tailwind utility classes** — padrão para tudo
2. **`<style>` scoped** — estilos específicos de componente .astro
3. **`global.css`** — reset, variáveis CSS, estilos base

### Tailwind
- Usar design tokens via CSS variables quando houver tema
- Mobile-first: classes base são mobile, prefixos `md:`, `lg:` para desktop
- Não criar classes customizadas desnecessárias no Tailwind config
- Usar `@apply` com moderação (preferir utility classes direto no HTML)

### global.css
```css
@import 'tailwindcss';

/* Custom base styles */
@layer base {
  body {
    @apply antialiased;
  }
}
```

---

## Routing

- File-based routing em `src/pages/`
- `index.astro` → `/`
- `sobre.astro` → `/sobre`
- `blog/[slug].astro` → `/blog/:slug`
- NÃO usar react-router, next/link ou qualquer router JS
- Links internos com `<a href="/pagina">`
- Prefetch automático do Astro para links internos

---

## Content Collections (quando aplicável)

```ts
// src/content.config.ts
import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.date(),
    image: z.string().optional(),
  }),
});

export const collections = { blog };
```

---

## Build e Deploy

### Comandos
```bash
npm run dev        # Desenvolvimento
npm run build      # Build de produção
npm run preview    # Preview do build
```

### Validação antes de deploy
- [ ] `npm run build` sem erros e sem warnings
- [ ] Lighthouse Performance > 90
- [ ] Todas as imagens com alt text
- [ ] Meta tags SEO em todas as páginas
- [ ] Links internos funcionando
- [ ] Responsivo em mobile, tablet e desktop
- [ ] Favicon e og:image presentes

### Deploy
- **Vercel**: `npx astro add vercel` para SSR, ou static por padrão
- **Netlify**: `npx astro add netlify`
- **Static hosting**: build gera `dist/` com HTML estático

---

## Proibições

- NÃO instalar react-router, next, gatsby ou qualquer framework de routing
- NÃO usar CSS-in-JS (styled-components, emotion, etc.)
- NÃO colocar lógica client-side em arquivos `.astro`
- NÃO usar `document`, `window` ou APIs do browser em frontmatter
- NÃO importar componentes `.astro` dentro de componentes React
- NÃO usar `<img>` HTML direto para imagens locais (usar `<Image />`)
- NÃO deixar componentes React sem diretiva `client:` se precisam de interatividade
