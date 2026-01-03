# API Integration

[← Back to Documentation Home](../README.md)

How the frontend talks to the backend API Gateway.

## API Client

All API calls are centralized in the API client module.

**Location**: `src/lib/api.ts`

### Configuration

The API base URL is configured via environment variable:

```env
VITE_API_GATEWAY_URL=http://localhost:8080
```

See [Environment Configuration](./environment.md) for more details.

### API Client Structure

```typescript
// src/lib/api.ts
const API_BASE_URL = import.meta.env.VITE_API_GATEWAY_URL;

class ApiClient {
  private async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }
    
    return response.json();
  }
  
  // API methods...
}

export const api = new ApiClient();
```

## Available Endpoints

### Opportunities

#### Get All Opportunities

Fetch a paginated list of opportunities with optional filtering.

```typescript
interface GetOpportunitiesParams {
  page?: number;
  limit?: number;
  category?: string;
  status?: string;
  search?: string;
}

const opportunities = await api.getOpportunities({
  page: 1,
  limit: 10,
  category: 'Technology',
  status: 'Open',
});
```

**Endpoint**: `GET /api/opportunities`

**Query Parameters**:
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `category` - Filter by category
- `status` - Filter by status
- `search` - Search query

**Response**:
```typescript
{
  data: Opportunity[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  }
}
```

#### Get Single Opportunity

```typescript
const opportunity = await api.getOpportunity(id);
```

**Endpoint**: `GET /api/opportunities/:id`

**Response**: `Opportunity` object

#### Create Opportunity

```typescript
const newOpportunity = await api.createOpportunity({
  title: 'Software Developer',
  description: 'Join our team...',
  category: 'Technology',
  // ... other fields
});
```

**Endpoint**: `POST /api/opportunities`

**Request Body**: `CreateOpportunityDto`

**Response**: Created `Opportunity` object

#### Update Opportunity

```typescript
const updated = await api.updateOpportunity(id, {
  status: 'Closed',
});
```

**Endpoint**: `PUT /api/opportunities/:id`

**Request Body**: Partial `Opportunity` object

**Response**: Updated `Opportunity` object

#### Delete Opportunity

```typescript
await api.deleteOpportunity(id);
```

**Endpoint**: `DELETE /api/opportunities/:id`

**Response**: 204 No Content

## Type Definitions

```typescript
interface Opportunity {
  id: string;
  title: string;
  description: string;
  category: string;
  status: 'Open' | 'Closed' | 'In Progress';
  createdAt: string;
  updatedAt: string;
  // ... additional fields
}

interface CreateOpportunityDto {
  title: string;
  description: string;
  category: string;
  // ... required fields
}
```

## Error Handling

### API Error Structure

```typescript
class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public data?: any
  ) {
    super(message);
  }
}
```

### Handling Errors in Components

```typescript
const [error, setError] = useState<string | null>(null);

try {
  const data = await api.getOpportunities();
  setOpportunities(data);
} catch (err) {
  if (err instanceof ApiError) {
    setError(err.message);
  } else {
    setError('An unexpected error occurred');
  }
}
```

## Authentication

### JWT Token Management

If authentication is required:

```typescript
// Store token
localStorage.setItem('authToken', token);

// Add to API requests
const response = await fetch(url, {
  headers: {
    'Authorization': `Bearer ${token}`,
  },
});

// Clear token on logout
localStorage.removeItem('authToken');
```

### Protected Routes

```typescript
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('authToken');
  
  if (!token) {
    return <Navigate to="/login" />;
  }
  
  return <>{children}</>;
};
```

## Mock Service Worker (MSW)

MSW is used for development and testing to mock API responses.

### Setup

**Location**: `src/mocks/`

```
mocks/
├── browser.ts    # Browser setup
├── server.ts     # Node/test setup
├── handlers.ts   # Request handlers
└── data.ts       # Mock data
```

### Handlers

```typescript
// src/mocks/handlers.ts
import { http, HttpResponse } from 'msw';
import { mockOpportunities } from './data';

export const handlers = [
  http.get('/api/opportunities', ({ request }) => {
    const url = new URL(request.url);
    const page = url.searchParams.get('page') || '1';
    const limit = url.searchParams.get('limit') || '10';
    
    return HttpResponse.json({
      data: mockOpportunities,
      pagination: {
        currentPage: parseInt(page),
        totalPages: 5,
        totalItems: 50,
        itemsPerPage: parseInt(limit),
      },
    });
  }),
  
  http.get('/api/opportunities/:id', ({ params }) => {
    const opportunity = mockOpportunities.find(
      o => o.id === params.id
    );
    
    if (!opportunity) {
      return new HttpResponse(null, { status: 404 });
    }
    
    return HttpResponse.json(opportunity);
  }),
  
  http.post('/api/opportunities', async ({ request }) => {
    const data = await request.json();
    return HttpResponse.json(
      { id: '123', ...data },
      { status: 201 }
    );
  }),
];
```

### Mock Data

```typescript
// src/mocks/data.ts
export const mockOpportunities: Opportunity[] = [
  {
    id: '1',
    title: 'Software Developer',
    description: 'Join our team...',
    category: 'Technology',
    status: 'Open',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  // ... more mock data
];
```

### Enabling MSW

MSW is enabled in development mode:

```typescript
// src/main.tsx
if (import.meta.env.DEV) {
  const { worker } = await import('./mocks/browser');
  await worker.start();
}
```

### Disabling MSW

To test against the real backend, disable MSW by commenting out the initialization in `src/main.tsx`.

## API Request Patterns

### Loading States

```typescript
const [isLoading, setIsLoading] = useState(false);

const fetchData = async () => {
  setIsLoading(true);
  try {
    const data = await api.getOpportunities();
    setOpportunities(data);
  } finally {
    setIsLoading(false);
  }
};
```

### Pagination

```typescript
const [page, setPage] = useState(1);
const [opportunities, setOpportunities] = useState<Opportunity[]>([]);

useEffect(() => {
  const fetchOpportunities = async () => {
    const response = await api.getOpportunities({ page, limit: 10 });
    setOpportunities(response.data);
  };
  
  fetchOpportunities();
}, [page]);
```

### Search and Filtering

```typescript
const [filters, setFilters] = useState({
  category: '',
  status: '',
  search: '',
});

useEffect(() => {
  const fetchFiltered = async () => {
    const response = await api.getOpportunities(filters);
    setOpportunities(response.data);
  };
  
  fetchFiltered();
}, [filters]);
```

### Debounced Search

```typescript
import { useDebounce } from '@/hooks/useDebounce';

const [searchTerm, setSearchTerm] = useState('');
const debouncedSearch = useDebounce(searchTerm, 500);

useEffect(() => {
  if (debouncedSearch) {
    api.getOpportunities({ search: debouncedSearch });
  }
}, [debouncedSearch]);
```

## Related Docs

[Architecture](./architecture.md) • [Environment Config](./environment.md) • [Testing](../guides/testing.md) • [Development](../guides/development.md)
