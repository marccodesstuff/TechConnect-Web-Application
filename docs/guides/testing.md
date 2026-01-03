# Testing Guide

[← Back to Documentation Home](../README.md)

How to write and run tests for the application.

## What We Use for Testing

We use Vitest as our test runner (it's fast and works great with Vite), React Testing Library for component tests, and MSW to mock API calls.

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test OpportunityCard.test.tsx
```

## Test File Structure

Place tests next to components or in `__tests__` directory:

```
src/components/
├── OpportunityCard.tsx
└── __tests__/
    └── OpportunityCard.test.tsx
```

## Writing Tests

### Basic Component Test

```typescript
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { OpportunityCard } from '../OpportunityCard';

describe('OpportunityCard', () => {
  it('renders opportunity title', () => {
    render(
      <OpportunityCard
        id="1"
        title="Software Developer"
        description="Join our team"
        category="Technology"
        status="Open"
      />
    );
    
    expect(screen.getByText('Software Developer')).toBeInTheDocument();
  });
});
```

### Testing User Interactions

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '../Button';

describe('Button', () => {
  it('handles click events', async () => {
    const handleClick = vi.fn();
    
    render(<Button onClick={handleClick}>Click Me</Button>);
    
    // Method 1: fireEvent
    fireEvent.click(screen.getByText('Click Me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
    
    // Method 2: userEvent (more realistic)
    await userEvent.click(screen.getByText('Click Me'));
    expect(handleClick).toHaveBeenCalledTimes(2);
  });
});
```

### Testing Forms

```typescript
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SubmitForm } from '../SubmitForm';

describe('SubmitForm', () => {
  it('submits form with valid data', async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();
    
    render(<SubmitForm onSubmit={onSubmit} />);
    
    await user.type(screen.getByLabelText('Title'), 'New Opportunity');
    await user.type(screen.getByLabelText('Description'), 'Description text');
    await user.click(screen.getByRole('button', { name: /submit/i }));
    
    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        title: 'New Opportunity',
        description: 'Description text',
      });
    });
  });
  
  it('displays validation errors', async () => {
    const user = userEvent.setup();
    
    render(<SubmitForm onSubmit={vi.fn()} />);
    
    await user.click(screen.getByRole('button', { name: /submit/i }));
    
    expect(screen.getByText('Title is required')).toBeInTheDocument();
  });
});
```

### Testing Async Operations

```typescript
import { render, screen, waitFor } from '@testing-library/react';
import { OpportunitiesList } from '../OpportunitiesList';

describe('OpportunitiesList', () => {
  it('loads and displays opportunities', async () => {
    render(<OpportunitiesList />);
    
    // Check loading state
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    
    // Wait for data to load
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });
    
    // Check data is displayed
    expect(screen.getByText('Software Developer')).toBeInTheDocument();
  });
  
  it('handles errors', async () => {
    // Mock API error
    server.use(
      http.get('/api/opportunities', () => {
        return new HttpResponse(null, { status: 500 });
      })
    );
    
    render(<OpportunitiesList />);
    
    await waitFor(() => {
      expect(screen.getByText(/error loading/i)).toBeInTheDocument();
    });
  });
});
```

## Mocking

### Mocking API Calls with MSW

MSW is configured in `src/setupTests.ts`:

```typescript
import { beforeAll, afterEach, afterAll } from 'vitest';
import { server } from './mocks/server';

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

Define mock handlers in `src/mocks/handlers.ts`:

```typescript
import { http, HttpResponse } from 'msw';
import { mockOpportunities } from './data';

export const handlers = [
  http.get('/api/opportunities', () => {
    return HttpResponse.json(mockOpportunities);
  }),
  
  http.post('/api/opportunities', async ({ request }) => {
    const data = await request.json();
    return HttpResponse.json({ id: '123', ...data }, { status: 201 });
  }),
];
```

Override handlers in specific tests:

```typescript
import { http, HttpResponse } from 'msw';
import { server } from '@/mocks/server';

it('handles API errors', async () => {
  server.use(
    http.get('/api/opportunities', () => {
      return new HttpResponse(null, { status: 500 });
    })
  );
  
  // Test error handling
});
```

### Mocking Modules

```typescript
import { vi } from 'vitest';

// Mock entire module
vi.mock('@/lib/api', () => ({
  api: {
    getOpportunities: vi.fn(() => Promise.resolve(mockData)),
  },
}));

// Mock specific function
const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
  ...vi.importActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));
```

## Testing Best Practices

### Query Priority

Testing Library recommends using queries that match how users interact with your app. Start with accessible queries like `getByRole`, `getByLabelText`, or `getByPlaceholderText`. Fall back to `getByText` for visible text. Only use `getByTestId` as a last resort when nothing else works.

### 2. Async Utilities

Use `waitFor` for async operations:

```typescript
// Wait for element to appear
await waitFor(() => {
  expect(screen.getByText('Success')).toBeInTheDocument();
});

// Or use findBy (combines getBy + waitFor)
expect(await screen.findByText('Success')).toBeInTheDocument();
```

### 3. Test User Behavior, Not Implementation

```typescript
// Good: Test what user sees/does
it('shows error message on invalid submission', async () => {
  render(<Form />);
  await userEvent.click(screen.getByRole('button', { name: /submit/i }));
  expect(screen.getByText('Required field')).toBeInTheDocument();
});

// Avoid: Testing implementation details
it('sets error state to true', () => {
  const { result } = renderHook(() => useForm());
  result.current.submit();
  expect(result.current.hasError).toBe(true);
});
```

### 4. Arrange-Act-Assert Pattern

```typescript
it('filters opportunities by category', async () => {
  // Arrange: Setup
  render(<OpportunitiesList />);
  await screen.findByText('All Opportunities');
  
  // Act: Perform action
  await userEvent.selectOptions(
    screen.getByLabelText('Category'),
    'Technology'
  );
  
  // Assert: Verify result
  expect(screen.getByText('Software Developer')).toBeInTheDocument();
  expect(screen.queryByText('Marketing Manager')).not.toBeInTheDocument();
});
```

### 5. Cleanup

React Testing Library automatically cleans up after each test. But if you need manual cleanup:

```typescript
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

afterEach(() => {
  cleanup();
});
```

## Coverage

### Running Coverage

```bash
npm run test:coverage
```

### Coverage Thresholds

Configure in `vitest.config.ts`:

```typescript
export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'json'],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
    },
  },
});
```

### Coverage Reports

Coverage reports are generated in the `coverage/` directory:
- `coverage/index.html` - HTML report (open in browser)
- `coverage/coverage-final.json` - JSON report

## Snapshot Testing

Use snapshots sparingly for static content:

```typescript
it('matches snapshot', () => {
  const { container } = render(<StaticComponent />);
  expect(container).toMatchSnapshot();
});
```

Update snapshots:
```bash
npm test -- -u
```

## Accessibility Testing

Test for accessibility:

```typescript
import { axe, toHaveNoViolations } from 'jest-axe';
expect.extend(toHaveNoViolations);

it('has no accessibility violations', async () => {
  const { container } = render(<MyComponent />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

## Test Organization

### Describe Blocks

Group related tests:

```typescript
describe('OpportunityCard', () => {
  describe('rendering', () => {
    it('displays title', () => { /* ... */ });
    it('displays description', () => { /* ... */ });
  });
  
  describe('interactions', () => {
    it('handles click', () => { /* ... */ });
    it('handles hover', () => { /* ... */ });
  });
});
```

### Test Data

Create reusable test data:

```typescript
// test-utils.ts
export const mockOpportunity = {
  id: '1',
  title: 'Test Opportunity',
  description: 'Test description',
  category: 'Technology',
  status: 'Open',
};

// In tests
import { mockOpportunity } from './test-utils';
```

## Related Docs

[Development](./development.md) • [Components](../reference/components.md) • [API Integration](../reference/api-integration.md)
