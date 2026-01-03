# Development Guide

[← Back to Documentation Home](../README.md)

Everything you need to know for building features and fixing bugs.

## Development Workflow

### Starting Development

```bash
# Install dependencies (first time only)
npm install

# Start development server
npm run dev

# Open browser to http://localhost:5173
```

### Development Scripts

```bash
# Development server with hot reload
npm run dev

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint

# Format code
npm run format
```

## Project Structure

See [Project Structure](../getting-started/project-structure.md) for the full breakdown.

Key directories you'll work with most:
- `src/pages/` for page components (each represents a route)
- `src/components/` for reusable UI pieces
- `src/lib/` for utilities and the API client
- `src/mocks/` for MSW handlers (development only)
- `src/styles/` - Global styles and design tokens

## Coding Standards

### TypeScript

**Always use TypeScript** for type safety:

```typescript
// Good: Explicit types
interface User {
  id: string;
  name: string;
  email: string;
}

const getUser = (id: string): Promise<User> => {
  return api.get(`/users/${id}`);
};

// Avoid: Using 'any'
const getUser = (id: any): any => {
  return api.get(`/users/${id}`);
};
```

### React Components

**Functional components with hooks**:

```typescript
import React, { useState, useEffect } from 'react';

interface MyComponentProps {
  title: string;
}

export const MyComponent: React.FC<MyComponentProps> = ({ title }) => {
  const [data, setData] = useState<DataType[]>([]);
  
  useEffect(() => {
    // Fetch data
  }, []);
  
  return <div>{title}</div>;
};
```

### File Naming

- **Components**: PascalCase (e.g., `OpportunityCard.tsx`)
- **Utilities**: camelCase (e.g., `api.ts`, `formatDate.ts`)
- **Tests**: Match component name with `.test.tsx` suffix
- **Types**: `types.ts` or inline with component

### Import Organization

Organize imports in this order:

```typescript
// 1. External dependencies
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// 2. Internal components
import { Button } from '@/components/ui/Button';
import { OpportunityCard } from '@/components/OpportunityCard';

// 3. Utilities and types
import { api } from '@/lib/api';
import type { Opportunity } from '@/types';

// 4. Styles
import './styles.css';
```

## State Management

See [State Management](../reference/state-management.md) for detailed patterns.

**Use local state when possible**:

```typescript
const [isOpen, setIsOpen] = useState(false);
```

**Lift state up when sharing between siblings**:

```typescript
// Parent component manages shared state
const Parent = () => {
  const [selectedId, setSelectedId] = useState<string>();
  
  return (
    <>
      <List onSelect={setSelectedId} />
      <Details id={selectedId} />
    </>
  );
};
```

## API Integration

See [API Integration](./api-integration.md) for detailed API documentation.

**Use the centralized API client**:

```typescript
import { api } from '@/lib/api';

// Fetch data
const opportunities = await api.getOpportunities({ page: 1, limit: 10 });

// Post data
const newOpportunity = await api.createOpportunity(data);
```

## Styling

See [Styling Guide](../reference/styling.md) for comprehensive styling documentation.

**Use Tailwind utility classes**:

```tsx
<div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow">
  <h2 className="text-xl font-bold text-gray-900">Title</h2>
</div>
```

## Testing

See [Testing Guide](./testing.md) for comprehensive testing documentation.

**Write tests for all components**:

```typescript
import { render, screen } from '@testing-library/react';
import { OpportunityCard } from './OpportunityCard';

describe('OpportunityCard', () => {
  it('renders opportunity title', () => {
    render(<OpportunityCard title="Test" />);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });
});
```

## Git Workflow

### Branch Names

Use these prefixes:
- `feature/add-filtering` for new features
- `fix/pagination-error` for bug fixes
- `refactor/api-client` for refactoring
- `docs/update-readme` for documentation

### Commit Messages

Follow conventional commits:

```
feat: add opportunity filtering
fix: resolve pagination issue on mobile
docs: update setup guide
refactor: simplify API client
test: add tests for OpportunityCard
```

### Pull Request Process

1. Create feature branch from `main`
2. Make changes and commit
3. Write/update tests
4. Run tests locally: `npm test`
5. Build locally: `npm run build`
6. Push branch and create PR
7. Address review comments
8. Merge after approval

## Performance Best Practices

### 1. Lazy Loading

Use React.lazy for code splitting:

```typescript
const Admin = React.lazy(() => import('./pages/Admin'));

<Suspense fallback={<Loading />}>
  <Admin />
</Suspense>
```

### 2. Memoization

Use `useMemo` and `useCallback` for expensive operations:

```typescript
const filtered = useMemo(() => {
  return items.filter(item => item.active);
}, [items]);

const handleClick = useCallback(() => {
  // Handler logic
}, [dependencies]);
```

### 3. Avoid Unnecessary Re-renders

Use React DevTools Profiler to identify performance issues.

## Debugging

### React DevTools

Install React DevTools browser extension for:
- Component hierarchy inspection
- Props and state inspection
- Performance profiling

### Browser DevTools

- **Console**: Log errors and debug output
- **Network**: Monitor API requests
- **Sources**: Set breakpoints in TypeScript code

### VSCode Debugging

Use the VSCode debugger with source maps for TypeScript debugging.

## Mock Service Worker (Development)

MSW enables development without backend:

```typescript
// src/mocks/handlers.ts
import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('/api/opportunities', () => {
    return HttpResponse.json(mockOpportunities);
  }),
];
```

See [API Integration](./api-integration.md) for more details.

## Related Docs

[Setup](../getting-started/setup.md) • [Testing](./testing.md) • [API Integration](../reference/api-integration.md) • [Components](../reference/components.md) • [Deployment](./deployment.md)
