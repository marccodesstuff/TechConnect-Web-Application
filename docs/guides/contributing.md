# Contributing

[← Back to Documentation Home](../README.md)

Thanks for your interest in contributing! Here's how to get started.

## Getting Started

1. **Fork the repository**
2. **Clone your fork**
   ```bash
   git clone <your-fork-url>
   cd TechConnect-Web-Application
   ```
3. **Install dependencies**
   ```bash
   npm install
   ```
4. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

See [Setup Guide](../getting-started/setup.md) for detailed instructions.

## Development Workflow

### 1. Make Changes

- Follow the [Development Guide](./development.md)
- Adhere to [Coding Standards](#coding-standards)
- Write tests for new features (see [Testing Guide](./testing.md))

### 2. Test Changes

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Check test coverage
npm run test:coverage

# Lint code
npm run lint

# Build to ensure no errors
npm run build
```

### 3. Commit Changes

**Commit format**: `<type>(<scope>): <description>`

Examples:
```bash
git commit -m "feat(opportunities): add date range filtering"
git commit -m "fix(pagination): resolve off-by-one error"
git commit -m "docs(api): update integration examples"
git commit -m "test(filters): add unit tests for category filter"
```

Types: `feat`, `fix`, `docs`, `test`, `refactor`, `style`, `perf`, `chore`

### 4. Push Changes

```bash
git push origin feature/your-feature-name
```

### 5. Create Pull Request

1. Go to the original repository
2. Click "New Pull Request"
3. Select your branch
4. Fill out the PR template
5. Wait for review

## Coding Standards

### TypeScript

**Always use TypeScript with explicit types**:

```typescript
// ✅ Good
interface User {
  id: string;
  name: string;
}

const getUser = (id: string): Promise<User> => {
  return api.get(`/users/${id}`);
};

// ❌ Avoid
const getUser = (id: any): any => {
  return api.get(`/users/${id}`);
};
```

### React Components

**Use functional components with TypeScript**:

```typescript
import React from 'react';

interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

export const Button: React.FC<ButtonProps> = ({ 
  label, 
  onClick, 
  variant = 'primary' 
}) => {
  return (
    <button 
      onClick={onClick}
      className={`btn btn-${variant}`}
    >
      {label}
    </button>
  );
};
```

### File Naming

- **Components**: PascalCase (e.g., `OpportunityCard.tsx`)
- **Utilities**: camelCase (e.g., `formatDate.ts`)
- **Tests**: Match component name with `.test.tsx` suffix
- **Constants**: UPPER_SNAKE_CASE

### Import Order

Organize imports:

```typescript
// 1. External dependencies
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// 2. Internal components
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/Card';

// 3. Utilities and types
import { api } from '@/lib/api';
import type { User } from '@/types';

// 4. Styles
import './styles.css';
```

### Code Style

Follow these conventions:

```typescript
// Use const for variables that won't be reassigned
const apiUrl = import.meta.env.VITE_API_GATEWAY_URL;

// Use meaningful variable names
const filteredOpportunities = opportunities.filter(o => o.isActive);

// Prefer template literals
const message = `Hello, ${user.name}!`;

// Use optional chaining
const city = user?.address?.city;

// Use nullish coalescing
const name = user?.name ?? 'Guest';

// Destructure props
const MyComponent = ({ title, description }: Props) => { /* ... */ };

// Early returns for guard clauses
if (!user) return <LoginPrompt />;
if (isLoading) return <Loading />;
return <Content />;
```

## Testing Requirements

### Required Tests

All new features must include tests:

1. **Component tests**: Test rendering and interactions
2. **Integration tests**: Test component integration with API
3. **Unit tests**: Test utility functions

### Test Coverage

Aim for:
- **80%+ line coverage**
- **80%+ branch coverage**
- **80%+ function coverage**

Check coverage:
```bash
npm run test:coverage
```

### Writing Good Tests

```typescript
describe('OpportunityCard', () => {
  // Descriptive test names
  it('displays opportunity title and description', () => {
    // Arrange
    const opportunity = {
      id: '1',
      title: 'Developer',
      description: 'Join us',
    };
    
    // Act
    render(<OpportunityCard {...opportunity} />);
    
    // Assert
    expect(screen.getByText('Developer')).toBeInTheDocument();
    expect(screen.getByText('Join us')).toBeInTheDocument();
  });
  
  it('calls onClick when card is clicked', async () => {
    // Arrange
    const handleClick = vi.fn();
    render(<OpportunityCard {...mockData} onClick={handleClick} />);
    
    // Act
    await userEvent.click(screen.getByRole('article'));
    
    // Assert
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

See [Testing Guide](./testing.md) for comprehensive testing documentation.

## Documentation

### Update Documentation

When adding features:

1. **Update relevant documentation** in `docs/` folder
2. **Add JSDoc comments** to functions and components
3. **Update README** if necessary

### JSDoc Comments

```typescript
/**
 * Fetches opportunities from the API with optional filters
 * @param filters - Filter criteria for opportunities
 * @returns Promise resolving to array of opportunities
 * @throws {ApiError} When the API request fails
 */
export const getOpportunities = async (
  filters?: OpportunityFilters
): Promise<Opportunity[]> => {
  // Implementation
};
```

## Pull Request Guidelines

### PR Checklist

Before submitting:

- [ ] Code follows style guidelines
- [ ] Tests added/updated and passing
- [ ] Documentation updated
- [ ] No console errors or warnings
- [ ] Build succeeds (`npm run build`)
- [ ] Commits follow conventional commit format
- [ ] PR description explains changes

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
Describe testing performed

## Screenshots (if applicable)
Add screenshots for UI changes

## Related Issues
Closes #123
```

### Review Process

1. **Automated checks** must pass
2. **Code review** by maintainer(s)
3. **Feedback addressed**
4. **Approved and merged**

## Code Review

### As a Reviewer

- Be respectful and constructive
- Test the changes locally
- Check for edge cases
- Verify test coverage
- Suggest improvements, don't demand

### As an Author

- Respond to all comments
- Make requested changes
- Ask questions if unclear
- Be open to feedback
- Update PR as needed

## Reporting Issues

### Bug Reports

Include:

1. **Description**: Clear description of the bug
2. **Steps to Reproduce**: Detailed steps
3. **Expected Behavior**: What should happen
4. **Actual Behavior**: What actually happens
5. **Environment**:
   - OS and version
   - Node.js version
   - Browser and version
6. **Screenshots**: If applicable
7. **Error Messages**: Full error output

### Feature Requests

Include:

1. **Use Case**: Why is this needed?
2. **Proposed Solution**: How should it work?
3. **Alternatives**: Other approaches considered
4. **Additional Context**: Any other relevant information

## Communication

### Be Respectful

- Use inclusive language
- Be patient with newcomers
- Give constructive feedback
- Assume good intentions

### Ask Questions

- No question is too basic
- Ask in issues or pull requests
- Reference relevant documentation

## Getting Help

Resources:

- [Setup Guide](./setup.md)
- [Development Guide](./development.md)
- [Architecture Overview](./architecture.md)
- [Troubleshooting Guide](./troubleshooting.md)

## License

By contributing, you agree that your contributions will be licensed under the same license as the project.

## Thank You!

Your contributions make this project better for everyone. Thank you for taking the time to contribute!

## Related Docs

[Development](./development.md) • [Testing](./testing.md) • [Architecture](../reference/architecture.md) • [Troubleshooting](./troubleshooting.md)
