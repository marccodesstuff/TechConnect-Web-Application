# Setup Guide

[← Back to Documentation Home](../README.md)

This guide walks you through setting up the TechConnect Web Application on your local machine.

## What you'll need

You'll need Node.js v18 or newer (which includes npm v9+) and Git installed on your machine.

## Installation Steps

### 1. Clone the Repository

```bash
git clone <repository-url>
cd TechConnect-Web-Application
```

### 2. Install Dependencies

```bash
npm install
```

This installs React, TypeScript, Vite, Tailwind CSS, Vitest, and MSW along with their dependencies.

### 3. Environment Configuration

Create a `.env` file in the root directory (copy from `.env.example` if available):

```env
VITE_API_GATEWAY_URL=http://localhost:8080
VITE_APP_ENV=development
```

See [Environment Configuration](../reference/environment.md) for more details.

### 4. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Make Sure It Works

After setup, try these quick checks:

Start the dev server and make sure the app loads without errors. Then make a small change to `src/App.tsx` to verify hot reload works. Finally, run `npm test` to confirm the test suite passes.

## Next Steps

Once you're set up, check out the [Development Guide](../guides/development.md) to learn the workflow, or dive into the [Architecture Overview](../reference/architecture.md) to understand how everything fits together.

Having trouble? The [Troubleshooting Guide](../guides/troubleshooting.md) covers common setup issues.
