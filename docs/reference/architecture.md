# Architecture Overview

[← Back to Documentation Home](../README.md)

Let's walk through how the TechConnect Web Application is structured and why we made certain design choices.

## System Architecture

```
┌─────────────────────────────────────────┐
│     TechConnect Web Application         │
│            (React SPA)                   │
├─────────────────────────────────────────┤
│  Pages Layer                             │
│  - OpportunitiesList                     │
│  - OpportunityDetail                     │
│  - Admin                                 │
│  - Submit                                │
├─────────────────────────────────────────┤
│  Components Layer                        │
│  - OpportunityCard                       │
│  - Filters                               │
│  - Pagination                            │
│  - UI Components (shadcn/ui)             │
├─────────────────────────────────────────┤
│  Services Layer                          │
│  - API Client (api.ts)                   │
│  - Mock Service Worker (Development)     │
├─────────────────────────────────────────┤
│  Styling Layer                           │
│  - Tailwind CSS                          │
│  - Custom Design Tokens                  │
└─────────────────────────────────────────┘
           ↓
┌─────────────────────────────────────────┐
│     TechConnect API Gateway             │
│         (Backend Services)               │
└─────────────────────────────────────────┘
```

## Application Structure

### Pages

Pages represent complete views/routes in the application:
- **OpportunitiesList**: Main listing page with filtering and pagination
- **OpportunityDetail**: Detailed view of a single opportunity
- **Admin**: Administrative interface
- **Submit**: Form for submitting new opportunities

See [Project Structure](../getting-started/project-structure.md) for more details.

### Components

Reusable UI components organized in two categories:
- **Feature Components**: Domain-specific components (OpportunityCard, Filters, Pagination)
- **UI Components**: Generic, reusable UI elements from shadcn/ui

See [Component Structure](./components.md) for detailed component documentation.

### Services

The services layer handles all external communication:
- **API Client**: Centralized API communication (`lib/api.ts`)
- **MSW**: Mock Service Worker for development and testing

See [API Integration](./api-integration.md) for API details.

## Design Decisions

### React with TypeScript

TypeScript provides type safety and better developer experience with autocomplete and compile-time error checking.

### Vite Build Tool

Vite offers:
- Fast development server with HMR (Hot Module Replacement)
- Optimized production builds
- Better developer experience than traditional bundlers

### Tailwind CSS

Utility-first CSS framework for:
- Rapid UI development
- Consistent design system
- Smaller bundle sizes (unused styles are purged)

See [Styling Guide](./styling.md) for styling conventions.

### Mock Service Worker (MSW)

MSW enables:
- Development without backend dependency
- Consistent test environment
- API contract validation

## Data Flow

```
User Action → Page Component → API Client → Backend
                ↓                              ↓
         Update UI State  ←──────── Response
```

1. User interacts with the UI
2. Page component handles the interaction
3. API client makes request to backend
4. Response updates application state
5. UI re-renders with new data

## State Management

The application uses React's built-in state management:
- **useState**: Local component state
- **useEffect**: Side effects and data fetching
- **Props**: Data flow between components

See [State Management](./state-management.md) for patterns and best practices.

## Routing

Client-side routing structure:
- `/` - Opportunities list
- `/opportunities/:id` - Opportunity detail
- `/admin` - Admin panel
- `/submit` - Submit new opportunity

## Build and Deployment

The application can be deployed as:
1. **Static Files**: Build with `npm run build` and serve the `dist/` folder
2. **Docker Container**: Using the provided Dockerfile and nginx configuration

See [Deployment Guide](../guides/deployment.md) for deployment instructions.

## Related Docs

[Components](./components.md) • [API Integration](./api-integration.md) • [State Management](./state-management.md) • [Deployment](../guides/deployment.md)
