# TechConnect Web Application

The frontend for the TechConnect ecosystem, built with React, TypeScript, and Vite.

## 📖 Documentation

A comprehensive guide to the operation, development, and architecture of this repository can be found in the **[docs/ folder](./docs/README.md)**.

### Quick Links
- **[Getting Started](./docs/getting-started/setup.md)**
- **[Operations Guide](./docs/operations/environment-orchestration.md)**
- **[System Context](./docs/operations/system-context.md)**

## Quick Start

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

