# Environment Configuration

[← Back to Documentation Home](../README.md)

How to manage environment variables across different environments.

## Environment Variables

Environment variables are managed using Vite's built-in environment variable system.

### Variable Naming

All environment variables exposed to the browser must start with `VITE_`. Anything else won't be accessible in your client-side code.

```env
# ✅ Exposed to client
VITE_API_GATEWAY_URL=http://localhost:8080
VITE_APP_ENV=development

# ❌ NOT exposed to client
API_SECRET_KEY=secret123
```

### Environment Files

Create environment files in the project root:

```
.env                # Loaded in all cases
.env.local          # Local overrides (gitignored)
.env.development    # Development mode
.env.production     # Production mode
.env.staging        # Staging mode (custom)
```

### File Priority

When you run the app, Vite loads environment files in this order (later ones override earlier):
`.env` (always loaded) → `.env.[mode]` (mode-specific) → `.env.local` (local overrides, gitignored)

### .env.example

Create a `.env.example` file (committed to git) with all required variables:

```env
# API Configuration
VITE_API_GATEWAY_URL=http://localhost:8080

# Application Environment
VITE_APP_ENV=development

# Feature Flags
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_DEBUG=true

# Optional Services
VITE_SENTRY_DSN=
VITE_GA_MEASUREMENT_ID=
```

## Environment Configurations

### Development

**.env.development**:
```env
VITE_API_GATEWAY_URL=http://localhost:8080
VITE_APP_ENV=development
VITE_ENABLE_DEBUG=true
VITE_ENABLE_MSW=true
```

Start development server:
```bash
npm run dev
```

### Production

**.env.production**:
```env
VITE_API_GATEWAY_URL=https://api.techconnect.com
VITE_APP_ENV=production
VITE_ENABLE_DEBUG=false
VITE_ENABLE_MSW=false
VITE_ENABLE_ANALYTICS=true
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

Build for production:
```bash
npm run build
```

### Staging

**.env.staging**:
```env
VITE_API_GATEWAY_URL=https://staging-api.techconnect.com
VITE_APP_ENV=staging
VITE_ENABLE_DEBUG=true
VITE_ENABLE_MSW=false
VITE_ENABLE_ANALYTICS=false
```

Build for staging:
```bash
npm run build -- --mode staging
```

### Local Development

**.env.local** (gitignored):
```env
# Override for local development
VITE_API_GATEWAY_URL=http://192.168.1.100:8080
VITE_ENABLE_EXPERIMENTAL_FEATURES=true
```

## Accessing Environment Variables

### In Application Code

```typescript
// Access environment variables
const apiUrl = import.meta.env.VITE_API_GATEWAY_URL;
const environment = import.meta.env.VITE_APP_ENV;
const isDevelopment = import.meta.env.DEV;
const isProduction = import.meta.env.PROD;

// Type-safe access
interface ImportMetaEnv {
  readonly VITE_API_GATEWAY_URL: string;
  readonly VITE_APP_ENV: 'development' | 'staging' | 'production';
  readonly VITE_ENABLE_DEBUG: string;
  readonly VITE_ENABLE_MSW: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```

### TypeScript Declaration

Create `src/vite-env.d.ts`:

```typescript
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_GATEWAY_URL: string;
  readonly VITE_APP_ENV: 'development' | 'staging' | 'production';
  readonly VITE_ENABLE_DEBUG: string;
  readonly VITE_ENABLE_MSW: string;
  readonly VITE_ENABLE_ANALYTICS: string;
  readonly VITE_GA_MEASUREMENT_ID?: string;
  readonly VITE_SENTRY_DSN?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```

### Boolean Values

Environment variables are always strings. Convert to boolean:

```typescript
const isDebugEnabled = import.meta.env.VITE_ENABLE_DEBUG === 'true';
const isMswEnabled = import.meta.env.VITE_ENABLE_MSW === 'true';
```

## Configuration Module

Create a centralized configuration module:

```typescript
// src/config/index.ts
export const config = {
  api: {
    baseUrl: import.meta.env.VITE_API_GATEWAY_URL,
    timeout: 30000,
  },
  app: {
    environment: import.meta.env.VITE_APP_ENV,
    isDevelopment: import.meta.env.DEV,
    isProduction: import.meta.env.PROD,
    enableDebug: import.meta.env.VITE_ENABLE_DEBUG === 'true',
  },
  features: {
    enableMsw: import.meta.env.VITE_ENABLE_MSW === 'true',
    enableAnalytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
  },
  services: {
    sentry: {
      dsn: import.meta.env.VITE_SENTRY_DSN,
    },
    analytics: {
      measurementId: import.meta.env.VITE_GA_MEASUREMENT_ID,
    },
  },
} as const;

// Usage
import { config } from '@/config';

if (config.app.enableDebug) {
  console.log('Debug mode enabled');
}
```

## Runtime Configuration

For configuration that needs to change without rebuild:

### Config File Approach

**public/config.json**:
```json
{
  "apiUrl": "https://api.techconnect.com",
  "features": {
    "enableNewFeature": true
  }
}
```

Load at runtime:
```typescript
const loadConfig = async () => {
  const response = await fetch('/config.json');
  return response.json();
};

// Use in app initialization
const runtimeConfig = await loadConfig();
```

### Window Object Approach

Inject configuration via script tag in `index.html`:

```html
<!DOCTYPE html>
<html>
  <head>
    <script>
      window.__APP_CONFIG__ = {
        apiUrl: 'https://api.techconnect.com',
      };
    </script>
  </head>
  <body>
    <!-- ... -->
  </body>
</html>
```

Access in application:
```typescript
const config = (window as any).__APP_CONFIG__;
```

## Docker Environment Variables

### Dockerfile

```dockerfile
# Build-time variables
ARG VITE_API_GATEWAY_URL
ARG VITE_APP_ENV

# Set environment variables
ENV VITE_API_GATEWAY_URL=$VITE_API_GATEWAY_URL
ENV VITE_APP_ENV=$VITE_APP_ENV

# Build application
RUN npm run build
```

### Docker Compose

```yaml
version: '3.8'
services:
  web:
    build:
      context: .
      args:
        VITE_API_GATEWAY_URL: ${API_GATEWAY_URL}
        VITE_APP_ENV: ${APP_ENV}
    environment:
      - VITE_API_GATEWAY_URL=${API_GATEWAY_URL}
      - VITE_APP_ENV=${APP_ENV}
```

### Build with Arguments

```bash
docker build \
  --build-arg VITE_API_GATEWAY_URL=https://api.techconnect.com \
  --build-arg VITE_APP_ENV=production \
  -t techconnect-web:latest .
```

## CI/CD Environment Variables

### GitHub Actions

```yaml
- name: Build
  run: npm run build
  env:
    VITE_API_GATEWAY_URL: ${{ secrets.API_GATEWAY_URL }}
    VITE_APP_ENV: production
    VITE_SENTRY_DSN: ${{ secrets.SENTRY_DSN }}
```

### GitLab CI

```yaml
build:
  script:
    - npm run build
  variables:
    VITE_API_GATEWAY_URL: $API_GATEWAY_URL
    VITE_APP_ENV: production
```

## Security Best Practices

### 1. Never Commit Secrets

```gitignore
# .gitignore
.env.local
.env.*.local
.env.production
```

### 2. Validate Required Variables

```typescript
// src/config/validation.ts
const requiredEnvVars = [
  'VITE_API_GATEWAY_URL',
  'VITE_APP_ENV',
] as const;

export const validateEnv = () => {
  const missing = requiredEnvVars.filter(
    (key) => !import.meta.env[key]
  );
  
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}`
    );
  }
};

// Call in app initialization
validateEnv();
```

### 3. Sensitive Data

Never expose sensitive data in client-side code:

```env
# ❌ WRONG - exposed to client
VITE_API_SECRET=secret123

# ✅ CORRECT - only on server
API_SECRET=secret123
```

### 4. Environment-Specific Secrets

Use secret management services in production:
- AWS Secrets Manager
- Azure Key Vault
- HashiCorp Vault
- Doppler

## Troubleshooting

### Variables Not Loading

1. Check variable prefix: Must start with `VITE_`
2. Restart dev server after changing `.env` files
3. Clear Vite cache: `rm -rf node_modules/.vite`

### Build-Time vs Runtime

Remember: Vite replaces environment variables at **build time**, not runtime.

```typescript
// ✅ Works - replaced at build time
const url = import.meta.env.VITE_API_GATEWAY_URL;

// ❌ Won't work - dynamic access
const key = 'VITE_API_GATEWAY_URL';
const url = import.meta.env[key];
```

### Type Errors

Ensure `vite-env.d.ts` is included in `tsconfig.json`:

```json
{
  "include": ["src/**/*", "src/vite-env.d.ts"]
}
```

## Related Docs

[Setup](../getting-started/setup.md) • [Deployment](../guides/deployment.md) • [API Integration](./api-integration.md) • [Troubleshooting](../guides/troubleshooting.md)
