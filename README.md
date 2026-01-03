# TechConnect Web (Vite + React + Tailwind)

This folder contains a scaffolded Vite + React + TypeScript app wired for Tailwind and prepared for shadcn-style components.

## Quick start

1. cd into `web`
2. Install dependencies: `npm install` or `pnpm install`
3. Start dev server: `npm run dev`

## shadcn UI

To enable shadcn-style component generation and the official scaffolding tool, run:

```bash
npx shadcn-ui@latest init
# then generate components, e.g.:
# npx shadcn-ui@latest add button
```

Follow the prompts from `shadcn-ui` to add components and theme tokens.

## What I added

- Vite + React + TypeScript config
- Tailwind + PostCSS config
- Example `Button` component in `src/components/ui` using `class-variance-authority` pattern
- Usage example in `src/App.tsx`

