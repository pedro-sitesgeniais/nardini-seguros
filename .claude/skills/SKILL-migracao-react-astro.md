# Skill: Migração React (Lovable/Vite) → Astro

## Objetivo
Migrar projetos React (Lovable, CRA, Vite) para Astro, preservando o visual pixel por pixel, maximizando HTML estático e minimizando JavaScript no client.

## Stack de Origem
- React 18+ com Vite ou CRA
- TypeScript
- Tailwind CSS
- shadcn/ui (opcional)

## Stack de Destino
- Astro 5+
- Tailwind CSS v4
- React (apenas componentes interativos)
- TypeScript

---

## Processo de Migração

### Etapa 1: Análise
Antes de qualquer conversão, listar TODOS os componentes do projeto de origem e classificar:

| Classificação | Critério | Ação |
|---|---|---|
| Estático | Sem useState, useEffect, onClick, onChange, useRef, event handlers | Converter para `.astro` |
| Interativo | Usa hooks, estados, eventos, formulários | Manter como `.tsx` com diretiva client |
| Híbrido | Wrapper estático com parte interativa dentro | Separar: wrapper em `.astro`, parte interativa em `.tsx` |

### Etapa 2: Setup do Projeto Astro
```bash
npm create astro@latest
npx astro add react tailwind
```

### Etapa 3: Criar Base
1. `src/layouts/Layout.astro` — HTML base, head, meta tags SEO, fonts, favicon
2. `src/styles/global.css` — Tailwind directives e estilos globais
3. `src/pages/index.astro` — Página principal

### Etapa 4: Converter Componentes
Ordem de conversão:
1. Layout/Shell (Header, Footer, Navbar)
2. Seções de conteúdo (Hero, Features, About, Pricing, FAQ)
3. Componentes utilitários (Cards, Badges, Sections)
4. Copiar componentes interativos (Forms, Modals, Accordions)
5. Montar a página final

### Etapa 5: Validação
- `npm run build` sem erros
- `npm run preview` e verificar visual
- Comparar lado a lado com o projeto original

---

## Regras de Conversão de Sintaxe

### JSX → Astro Template
```
className        → class
htmlFor          → for
{children}       → <slot />
style={{ k: v }} → style="k: v;" ou <style> scoped
onChange          → remover (se estático)
onClick          → remover (se estático)
```

### Imports
```
import React from 'react'           → REMOVER
import { useState } from 'react'    → REMOVER (se convertido para .astro)
import { useEffect } from 'react'   → REMOVER (fetch vai no frontmatter)
import { Link } from 'react-router' → usar <a href="">
import { Helmet } from 'react-helmet' → meta tags no Layout.astro <head>
```

### Componente Estático: Antes (React)
```tsx
export default function Hero() {
  return (
    <section className="bg-blue-500 py-20">
      <h1 className="text-4xl font-bold">Título</h1>
      <p className="text-lg">Descrição</p>
    </section>
  );
}
```

### Componente Estático: Depois (Astro)
```astro
---
// frontmatter: imports e lógica server-side
---
<section class="bg-blue-500 py-20">
  <h1 class="text-4xl font-bold">Título</h1>
  <p class="text-lg">Descrição</p>
</section>
```

### Componente com Props: Antes (React)
```tsx
export default function Card({ title, description }: { title: string; description: string }) {
  return (
    <div className="p-4 border rounded">
      <h3 className="font-bold">{title}</h3>
      <p>{description}</p>
    </div>
  );
}
```

### Componente com Props: Depois (Astro)
```astro
---
interface Props {
  title: string;
  description: string;
}
const { title, description } = Astro.props;
---
<div class="p-4 border rounded">
  <h3 class="font-bold">{title}</h3>
  <p>{description}</p>
</div>
```

### Data Fetching: Antes (React)
```tsx
const [data, setData] = useState(null);
useEffect(() => {
  fetch('/api/data').then(r => r.json()).then(setData);
}, []);
```

### Data Fetching: Depois (Astro)
```astro
---
const response = await fetch('/api/data');
const data = await response.json();
---
<div>{data.title}</div>
```

---

## Diretivas de Hidratação

Ao importar componentes React (.tsx) dentro de arquivos .astro, usar a diretiva mais leve possível:

| Diretiva | Quando usar |
|---|---|
| `client:load` | Formulários, elementos que precisam de JS imediato (acima da dobra) |
| `client:visible` | Elementos interativos abaixo da dobra (FAQ accordion, carrossel) |
| `client:idle` | Elementos não críticos, analytics, chat widgets |
| `client:media="(max-width: 768px)"` | Interatividade condicional por viewport |
| Sem diretiva | React renderiza como HTML estático, zero JS enviado |

---

## Tratamento de Imagens

- Imagens otimizadas: `src/assets/images/` + componente `<Image />` de `astro:assets`
- Imagens não processadas (SVGs, favicons): `public/`
- SEMPRE adicionar `width`, `height` e `alt`
- Preferir formatos modernos (WebP, AVIF) quando possível

---

## Dependências para REMOVER do projeto Astro

- `react-router-dom` — Astro usa file-based routing
- `react-helmet` / `react-helmet-async` — meta tags no `<head>` do Layout
- `react-icons` — usar SVGs inline ou `astro-icon`
- `@vitejs/plugin-react` — Astro gerencia o Vite internamente
- Qualquer CSS-in-JS (styled-components, emotion) — usar Tailwind ou `<style>` scoped

---

## Checklist Final

- [ ] Todos os componentes estáticos convertidos para `.astro`
- [ ] Componentes interativos com diretiva `client:` correta
- [ ] Meta tags SEO no Layout
- [ ] Imagens otimizadas com `<Image />`
- [ ] `npm run build` sem erros e sem warnings
- [ ] Visual idêntico ao projeto original
- [ ] Nenhuma dependência React desnecessária no package.json
- [ ] Lighthouse/PageSpeed com score superior ao original
