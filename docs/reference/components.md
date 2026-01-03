# Component Structure

[← Back to Documentation Home](../README.md)

Here's what you need to know about the React components in this project.

## Component Organization

Components are organized into two main categories:

```
src/components/
├── Feature Components (business logic)
│   ├── OpportunityCard.tsx
│   ├── Filters.tsx
│   └── Pagination.tsx
├── UI Components (generic, reusable)
│   └── ui/
│       ├── Badge.tsx
│       ├── Button.tsx
│       └── Input.tsx
└── Tests
    └── __tests__/
        └── OpportunityCard.test.tsx
```

## Feature Components

### OpportunityCard

Displays a single opportunity in card format.

**Location**: `src/components/OpportunityCard.tsx`

**Props**:
```typescript
interface OpportunityCardProps {
  id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  // ... additional fields
}
```

**Usage**:
```tsx
<OpportunityCard
  id="123"
  title="Software Developer"
  description="Join our team..."
  category="Technology"
  status="Open"
/>
```

Related: [Testing Guide](../guides/testing.md) has test examples for this component.

### Filters

Provides filtering by category, status, and search text.

**Location**: `src/components/Filters.tsx`

**Props**:
```typescript
interface FiltersProps {
  onFilterChange: (filters: FilterState) => void;
  categories: string[];
  statuses: string[];
}
```

### Pagination

Handles pagination for large datasets.

**Location**: `src/components/Pagination.tsx`

**Props**:
```typescript
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}
```

## UI Components (shadcn/ui)

Generic, reusable components based on shadcn/ui design system.

### Badge

Display status indicators and labels.

**Location**: `src/components/ui/Badge.tsx`

**Usage**:
```tsx
<Badge variant="success">Active</Badge>
<Badge variant="warning">Pending</Badge>
```

### Button

Standard button with multiple style variants.

**Location**: `src/components/ui/Button.tsx`

Comes in four styles: `default` (primary), `secondary`, `outline`, and `ghost` (minimal).

**Usage**:
```tsx
<Button variant="default" onClick={handleClick}>
  Submit
</Button>
```

### Input

Form input component with label and error states.

**Location**: `src/components/ui/Input.tsx`

**Usage**:
```tsx
<Input
  label="Email"
  type="email"
  placeholder="Enter email"
  error="Invalid email"
/>
```

## Component Best Practices

### 1. TypeScript Props Interface

Always define props with TypeScript interfaces:

```typescript
interface MyComponentProps {
  title: string;
  onClick: () => void;
  isActive?: boolean; // Optional prop
}

export const MyComponent: React.FC<MyComponentProps> = ({ 
  title, 
  onClick, 
  isActive = false 
}) => {
  // Component implementation
};
```

### 2. Component Composition

Break down complex components into smaller, reusable pieces:

```tsx
// Good: Composable
<Card>
  <CardHeader title="..." />
  <CardContent>...</CardContent>
  <CardFooter>...</CardFooter>
</Card>

// Avoid: Monolithic
<Card title="..." content="..." footer="..." />
```

### 3. Prop Drilling

Avoid excessive prop drilling. Consider:
- Component composition
- Context API for deeply nested props
- State management solutions for complex state

### 4. Event Handlers

Use consistent naming for event handlers:

```typescript
// Convention: on[Event] for props, handle[Event] for internal
interface Props {
  onClick: () => void; // Prop from parent
}

const Component = ({ onClick }: Props) => {
  const handleInternalClick = () => {
    // Internal logic
    onClick(); // Call parent handler
  };
  
  return <button onClick={handleInternalClick}>Click</button>;
};
```

## Testing Components

All components should have corresponding tests. See [Testing Guide](./testing.md) for details.

Example test structure:
```typescript
describe('OpportunityCard', () => {
  it('renders opportunity data correctly', () => {
    // Test implementation
  });
  
  it('handles click events', () => {
    // Test implementation
  });
});
```

## Adding New Components

When adding a new component, create the file in the right directory, define your TypeScript interface, implement it with proper types, add tests in `__tests__/`, and document it here if it's meant to be shared.

## Related Docs

[Architecture](./architecture.md) • [Testing](../guides/testing.md) • [Styling](./styling.md) • [Development](../guides/development.md)
