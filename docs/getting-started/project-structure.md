# Project Structure

[← Back to Documentation Home](../README.md)

Here's how the codebase is organized and where to find things.

## Root Directory

```
TechConnect-Web-Application/
├── docs/                    # 📚 Documentation (this folder)
├── src/                     # 🎯 Source code
├── public/                  # 📁 Static assets
├── node_modules/            # 📦 Dependencies (gitignored)
├── dist/                    # 🏗️ Production build output (gitignored)
├── .github/                 # ⚙️ GitHub workflows and configurations
├── .vscode/                 # 🔧 VSCode settings
│
├── index.html               # HTML entry point
├── package.json             # Dependencies and scripts
├── tsconfig.json            # TypeScript configuration
├── vite.config.ts           # Vite build configuration
├── vitest.config.ts         # Vitest test configuration
├── tailwind.config.cjs      # Tailwind CSS configuration
├── postcss.config.cjs       # PostCSS configuration
│
├── Dockerfile               # Docker image definition
├── docker-compose.yml       # Docker Compose configuration
├── nginx.conf               # Nginx configuration for Docker
│
├── README.md                # Main project README
├── README_SETUP_NOTES.md    # Setup notes
├── DOCKER_DEPLOYMENT.md     # Docker deployment guide
└── LICENSE                  # License file
```

## Source Code Structure (`src/`)

```
src/
├── main.tsx                 # Application entry point
├── App.tsx                  # Root component
├── index.css                # Global styles (Tailwind imports)
├── setupTests.ts            # Test configuration
│
├── pages/                   # 📄 Page components (routes)
│   ├── OpportunitiesList.tsx      # Main listing page
│   ├── OpportunityDetail.tsx      # Detail view page
│   ├── Admin.tsx                  # Admin dashboard
│   └── Submit.tsx                 # Submission form page
│
├── components/              # 🧩 Reusable components
│   ├── OpportunityCard.tsx        # Opportunity card component
│   ├── Filters.tsx                # Filter component
│   ├── Pagination.tsx             # Pagination component
│   ├── README.md                  # Component documentation
│   │
│   ├── ui/                        # Generic UI components
│   │   ├── Badge.tsx
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   └── README_SHADCN.md       # shadcn/ui documentation
│   │
│   └── __tests__/                 # Component tests
│       └── OpportunityCard.test.tsx
│
├── lib/                     # 🛠️ Utilities and libraries
│   └── api.ts                     # API client
│
├── mocks/                   # 🎭 MSW mocks for development
│   ├── browser.ts                 # Browser MSW setup
│   ├── server.ts                  # Server MSW setup (for tests)
│   ├── handlers.ts                # Request handlers
│   └── data.ts                    # Mock data
│
└── styles/                  # 🎨 Additional styles
    ├── globals.css                # Global CSS
    └── tokens.css                 # Design tokens
```

## Key Files

### Entry Point

**index.html**
- HTML template
- Includes `<div id="root">` for React mounting
- Loads `src/main.tsx`

**src/main.tsx**
- Application entry point
- Initializes React
- Sets up MSW in development mode
- Mounts `<App />` to `#root`

### Root Component

**src/App.tsx**
- Root React component
- Sets up routing
- Wraps app with providers (if any)

### Configuration Files

**tsconfig.json**
- TypeScript compiler options
- Path aliases configuration
- Include/exclude patterns

**vite.config.ts**
- Build tool configuration
- Path aliases (@/ prefix)
- Plugin configuration
- Development server settings

**vitest.config.ts**
- Test runner configuration
- Test environment (jsdom)
- Coverage settings
- Setup files

**tailwind.config.cjs**
- Tailwind CSS configuration
- Custom theme settings
- Content paths for purging
- Plugin configuration

**postcss.config.cjs**
- PostCSS configuration
- Tailwind CSS plugin
- Autoprefixer plugin

## Pages

Each page component represents a full screen/route:

**OpportunitiesList.tsx** (`/`) – The main landing page with filtering and pagination  
**OpportunityDetail.tsx** (`/opportunities/:id`) – Full details for a single opportunity  
**Admin.tsx** (`/admin`) – Administrative dashboard  
**Submit.tsx** (`/submit`) – Form for creating new opportunities

## Components

### Feature Components

**OpportunityCard.tsx**
- Displays opportunity in card format
- Used in listings
- Includes click handling

**Filters.tsx**
- Filter controls (category, status, search)
- Emits filter change events
- Used on listing page

**Pagination.tsx**
- Page navigation controls
- Shows current page and total pages
- Handles page change events

### UI Components

Located in `components/ui/`:
- Generic, reusable components
- Based on shadcn/ui design system
- Includes: Badge, Button, Input, etc.

See [Component Structure](./components.md) for detailed documentation.

## Library Code

### api.ts
- Centralized API client
- All backend communication
- Request/response handling
- Error handling

See [API Integration](../reference/api-integration.md) for details.

## Mock Service Worker

### browser.ts
- MSW setup for browser
- Used in development mode./reference

### server.ts  
- MSW setup for Node/tests
- Used in test environment

### handlers.ts
- Request handlers
- Defines API responses
- Matches API contract

### data.ts
- Mock data definitions
- Reusable test data

## Styles

### index.css
- Tailwind CSS imports
- Global reset
- Base styles

### styles/globals.css
- Additional global styles
- Custom CSS if needed

### styles/tokens.css
- CSS custom properties
- Design tokens
- Colors, spacing, etc.

## Tests

Tests are co-located with components:

```
src/components/
└── __tests__/
    └── OpportunityCard.test.tsx
```

Or next to the file:
```
src/lib/
├── api.ts
└── api.test.ts
```

See [Testing Guide](../guides/testing.md) for testing conventions.

## Build Output

### dist/
Generated by `npm run build`:
```
dist/
├── index.html              # Entry HTML
├── assets/                 # Bundled assets
│   ├── index-[hash].js    # Main JavaScript bundle
│   ├── vendor-[hash].js   # Vendor dependencies
│   └── index-[hash].css   # Bundled CSS
└── vite.svg               # Static assets
```

## Docker Files

### Dockerfile
Multi-stage build:
1. Build stage: Compile application
2. Production stage: Serve with nginx

### docker-compose.yml
Orchestrates multiple services:
- Frontend (this app)
- API Gateway
- Other microservices

### nginx.conf
Nginx configuration for:
- Serving static files
- SPA routing (fallback to index.html)
- Caching headers

See [Deployment Guide](../guides/deployment.md) for deployment details.

## Path Aliases

TypeScript path aliases for cleaner imports:

```typescript
// Instead of: import { api } from '../../../lib/api'
// Use: import { api } from '@/lib/api'

// Configured in tsconfig.json and vite.config.ts
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

## Git Ignored Files

```.gitignore
node_modules/
dist/
.env.local
.env.*.local
*.log
coverage/
.DS_Store
```

## Adding New Files

### New Page

1. Create `src/pages/NewPage.tsx`
2. Add route in `App.tsx`
3. Add to navigation
4. Create tests

### New Component

1. Create `src/components/NewComponent.tsx`
2. Create test file
3. Document in [Component Structure](./components.md)
4. Use in pages

### New Utility

1. Create `src/lib/newUtil.ts`
2. Export functions
3. Add tests
4. Import where needed

## Related Docs

[Architecture Overview](../reference/architecture.md) • [Components](../reference/components.md) • [Development Guide](../guides/development.md) • [Testing](../guides/testing.md)
