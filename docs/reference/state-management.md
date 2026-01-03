# State Management

[← Back to Documentation Home](../README.md)

We keep things simple by using React's built-in hooks rather than external state libraries.

## Our Approach

For most apps, React's built-in hooks (`useState`, `useReducer`, `useEffect`) are enough. We only reach for libraries like Redux or Zustand when state gets genuinely complex or deeply shared.

## React State Hooks

### useState

For local component state:

```typescript
import { useState } from 'react';

const Counter = () => {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
};
```

#### With TypeScript

```typescript
interface User {
  id: string;
  name: string;
}

const [user, setUser] = useState<User | null>(null);
const [users, setUsers] = useState<User[]>([]);
const [isLoading, setIsLoading] = useState<boolean>(false);
```

#### Lazy Initialization

For expensive initial state calculations:

```typescript
const [data, setData] = useState(() => {
  // Expensive calculation
  return expensiveOperation();
});
```

### useReducer

For complex state logic:

```typescript
import { useReducer } from 'react';

interface State {
  opportunities: Opportunity[];
  isLoading: boolean;
  error: string | null;
}

type Action =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: Opportunity[] }
  | { type: 'FETCH_ERROR'; payload: string };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, isLoading: true, error: null };
    case 'FETCH_SUCCESS':
      return { ...state, isLoading: false, opportunities: action.payload };
    case 'FETCH_ERROR':
      return { ...state, isLoading: false, error: action.payload };
    default:
      return state;
  }
};

const OpportunitiesList = () => {
  const [state, dispatch] = useReducer(reducer, {
    opportunities: [],
    isLoading: false,
    error: null,
  });
  
  const fetchOpportunities = async () => {
    dispatch({ type: 'FETCH_START' });
    try {
      const data = await api.getOpportunities();
      dispatch({ type: 'FETCH_SUCCESS', payload: data });
    } catch (error) {
      dispatch({ type: 'FETCH_ERROR', payload: error.message });
    }
  };
  
  // ...
};
```

### useEffect

For side effects and data fetching:

```typescript
import { useEffect, useState } from 'react';

const OpportunityDetail = ({ id }: { id: string }) => {
  const [opportunity, setOpportunity] = useState<Opportunity | null>(null);
  
  useEffect(() => {
    const fetchOpportunity = async () => {
      const data = await api.getOpportunity(id);
      setOpportunity(data);
    };
    
    fetchOpportunity();
  }, [id]); // Re-run when id changes
  
  return <div>{opportunity?.title}</div>;
};
```

#### Cleanup

```typescript
useEffect(() => {
  const controller = new AbortController();
  
  fetch(url, { signal: controller.signal })
    .then(res => res.json())
    .then(setData);
  
  // Cleanup function
  return () => {
    controller.abort();
  };
}, [url]);
```

## State Patterns

### Loading States

```typescript
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState<string | null>(null);
const [data, setData] = useState<Data[]>([]);

const fetchData = async () => {
  setIsLoading(true);
  setError(null);
  
  try {
    const result = await api.getData();
    setData(result);
  } catch (err) {
    setError(err.message);
  } finally {
    setIsLoading(false);
  }
};

// Render
if (isLoading) return <Loading />;
if (error) return <Error message={error} />;
return <DataList data={data} />;
```

### Pagination State

```typescript
interface PaginationState {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
}

const [pagination, setPagination] = useState<PaginationState>({
  currentPage: 1,
  totalPages: 1,
  itemsPerPage: 10,
});

const handlePageChange = (page: number) => {
  setPagination(prev => ({ ...prev, currentPage: page }));
};
```

### Filter State

```typescript
interface FilterState {
  category: string;
  status: string;
  search: string;
}

const [filters, setFilters] = useState<FilterState>({
  category: '',
  status: '',
  search: '',
});

const updateFilter = (key: keyof FilterState, value: string) => {
  setFilters(prev => ({ ...prev, [key]: value }));
};

// Or update multiple at once
const updateFilters = (updates: Partial<FilterState>) => {
  setFilters(prev => ({ ...prev, ...updates }));
};
```

### Form State

```typescript
interface FormState {
  title: string;
  description: string;
  category: string;
}

interface FormErrors {
  title?: string;
  description?: string;
  category?: string;
}

const [formData, setFormData] = useState<FormState>({
  title: '',
  description: '',
  category: '',
});

const [errors, setErrors] = useState<FormErrors>({});

const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;
  setFormData(prev => ({ ...prev, [name]: value }));
};

const validate = (): boolean => {
  const newErrors: FormErrors = {};
  
  if (!formData.title) {
    newErrors.title = 'Title is required';
  }
  
  if (!formData.description) {
    newErrors.description = 'Description is required';
  }
  
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  
  if (validate()) {
    // Submit form
    api.createOpportunity(formData);
  }
};
```

## Lifting State Up

When multiple components need to share state:

```typescript
// Parent component manages shared state
const OpportunitiesPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  
  useEffect(() => {
    // Fetch opportunities when category changes
    const fetchOpportunities = async () => {
      const data = await api.getOpportunities({ 
        category: selectedCategory 
      });
      setOpportunities(data);
    };
    
    fetchOpportunities();
  }, [selectedCategory]);
  
  return (
    <>
      <Filters 
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />
      <OpportunitiesList opportunities={opportunities} />
    </>
  );
};
```

## Context API

For deeply nested components that need shared state:

```typescript
import { createContext, useContext, useState } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const [user, setUser] = useState<User | null>(null);
  
  const login = (user: User) => {
    setUser(user);
    localStorage.setItem('user', JSON.stringify(user));
  };
  
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };
  
  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

// Usage in components
const Profile = () => {
  const { user, logout } = useAuth();
  
  return (
    <div>
      <p>Welcome, {user?.name}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
};
```

## Custom Hooks

Extract reusable state logic:

### useFetch Hook

```typescript
import { useState, useEffect } from 'react';

interface UseFetchResult<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

function useFetch<T>(url: string): UseFetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refetchTrigger, setRefetchTrigger] = useState(0);
  
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await fetch(url);
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [url, refetchTrigger]);
  
  const refetch = () => setRefetchTrigger(prev => prev + 1);
  
  return { data, isLoading, error, refetch };
}

// Usage
const OpportunitiesList = () => {
  const { data, isLoading, error, refetch } = useFetch<Opportunity[]>(
    '/api/opportunities'
  );
  
  if (isLoading) return <Loading />;
  if (error) return <Error message={error} />;
  
  return (
    <>
      <button onClick={refetch}>Refresh</button>
      <List items={data} />
    </>
  );
};
```

### useLocalStorage Hook

```typescript
import { useState, useEffect } from 'react';

function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });
  
  const setValue = (value: T) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(error);
    }
  };
  
  return [storedValue, setValue];
}

// Usage
const [theme, setTheme] = useLocalStorage('theme', 'light');
```

### useDebounce Hook

```typescript
import { useState, useEffect } from 'react';

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  
  return debouncedValue;
}

// Usage
const SearchInput = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  
  useEffect(() => {
    if (debouncedSearchTerm) {
      // Perform search
      api.search(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm]);
  
  return (
    <input
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
  );
};
```

## Performance Optimization

### useMemo

Memoize expensive calculations:

```typescript
import { useMemo } from 'react';

const ExpensiveComponent = ({ items }: { items: Item[] }) => {
  const filteredItems = useMemo(() => {
    return items.filter(item => item.isActive).sort((a, b) => 
      a.name.localeCompare(b.name)
    );
  }, [items]);
  
  return <List items={filteredItems} />;
};
```

### useCallback

Memoize callback functions:

```typescript
import { useCallback } from 'react';

const Parent = () => {
  const [count, setCount] = useState(0);
  
  // Without useCallback, this creates a new function on every render
  const increment = useCallback(() => {
    setCount(c => c + 1);
  }, []);
  
  return <Child onIncrement={increment} />;
};
```

### React.memo

Prevent unnecessary re-renders:

```typescript
import React from 'react';

interface Props {
  title: string;
  onClick: () => void;
}

export const ExpensiveComponent = React.memo<Props>(({ title, onClick }) => {
  // This component only re-renders when props change
  return <button onClick={onClick}>{title}</button>;
});
```

## State Management Best Practices

### 1. Keep State Close

Keep state as close as possible to where it's used:

```typescript
// ✅ Good - state in component that uses it
const SearchBox = () => {
  const [query, setQuery] = useState('');
  return <input value={query} onChange={e => setQuery(e.target.value)} />;
};

// ❌ Avoid - state too high in tree
const App = () => {
  const [searchQuery, setSearchQuery] = useState(''); // Not used in App
  return <SearchBox query={searchQuery} setQuery={setSearchQuery} />;
};
```

### 2. Derive State When Possible

```typescript
// ❌ Avoid - redundant state
const [items, setItems] = useState<Item[]>([]);
const [filteredItems, setFilteredItems] = useState<Item[]>([]);

// ✅ Good - derive from existing state
const [items, setItems] = useState<Item[]>([]);
const [filter, setFilter] = useState('');
const filteredItems = items.filter(item => item.category === filter);
```

### 3. Single Source of Truth

```typescript
// ❌ Avoid - duplicate state
const [user, setUser] = useState<User>();
const [userName, setUserName] = useState('');

// ✅ Good - single source
const [user, setUser] = useState<User>();
const userName = user?.name;
```

### 4. Immutable Updates

Always update state immutably:

```typescript
// ❌ Avoid - mutating state
const [items, setItems] = useState<Item[]>([]);
items.push(newItem); // Mutation!
setItems(items);

// ✅ Good - immutable update
setItems([...items, newItem]);

// Object updates
const [user, setUser] = useState<User>({ name: 'John', age: 30 });
setUser({ ...user, age: 31 });

// Nested object updates
setUser(prev => ({
  ...prev,
  address: {
    ...prev.address,
    city: 'New York',
  },
}));
```

### 5. Batch Updates

React automatically batches updates in event handlers:

```typescript
const handleClick = () => {
  setCount(count + 1); // Batched
  setFlag(true);       // Batched
  setName('John');     // Batched
  // Only one re-render
};
```

## When to Use External State Management

Consider libraries like Redux, Zustand, or Jotai when:

1. **Complex global state**: Many components need the same state
2. **Frequent updates**: State changes frequently across app
3. **Time travel debugging**: Need to replay state changes
4. **Middleware**: Need advanced side effects handling

For most applications, React's built-in state management is sufficient.

## Related Docs

[Architecture](./architecture.md) • [Components](./components.md) • [Development](../guides/development.md) • [API Integration](./api-integration.md)
