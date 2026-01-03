# Styling Guide

[← Back to Documentation Home](../README.md)

We use Tailwind CSS for styling. Here's how to work with it effectively.

## What We Use

Tailwind CSS is our main styling tool – a utility-first framework that lets you build designs directly in your markup. We also use PostCSS for processing and custom CSS properties (design tokens) for consistency.

## Tailwind CSS

### Configuration

**Location**: [tailwind.config.cjs](../tailwind.config.cjs)

```javascript
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Custom colors
        primary: '#your-color',
        secondary: '#your-color',
      },
      spacing: {
        // Custom spacing
      },
      // Other customizations
    },
  },
  plugins: [],
};
```

### Utility Classes

Use Tailwind utility classes directly in JSX:

```tsx
<div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-md">
  <h2 className="text-xl font-bold text-gray-900">Title</h2>
  <p className="text-sm text-gray-600">Description</p>
</div>
```

### Common Patterns

#### Layout

```tsx
// Flexbox
<div className="flex items-center justify-between">
  <div>Left</div>
  <div>Right</div>
</div>

// Grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</div>

// Container
<div className="container mx-auto px-4 max-w-7xl">
  {/* Content */}
</div>
```

#### Responsive Design

```tsx
<div className="
  text-sm         /* Mobile: small text */
  md:text-base    /* Tablet: base text */
  lg:text-lg      /* Desktop: large text */
  p-2             /* Mobile: small padding */
  md:p-4          /* Tablet+: medium padding */
">
  Responsive content
</div>
```

#### Colors

```tsx
// Text colors
<p className="text-gray-900">Dark text</p>
<p className="text-gray-600">Medium text</p>
<p className="text-gray-400">Light text</p>

// Background colors
<div className="bg-white">White background</div>
<div className="bg-gray-100">Light gray background</div>

// Border colors
<div className="border border-gray-300">Bordered element</div>
```

#### Spacing

```tsx
// Padding
<div className="p-4">Padding all sides</div>
<div className="px-4 py-2">Horizontal and vertical padding</div>

// Margin
<div className="m-4">Margin all sides</div>
<div className="mt-4 mb-2">Top and bottom margin</div>

// Gap (for flex/grid)
<div className="flex gap-4">Items with gap</div>
```

#### Typography

```tsx
// Font size
<h1 className="text-4xl font-bold">Large heading</h1>
<h2 className="text-2xl font-semibold">Medium heading</h2>
<p className="text-base">Regular text</p>

// Font weight
<span className="font-light">Light</span>
<span className="font-normal">Normal</span>
<span className="font-bold">Bold</span>

// Line height
<p className="leading-tight">Tight line height</p>
<p className="leading-relaxed">Relaxed line height</p>
```

### Custom Classes

For repeated patterns, extract to components rather than using `@apply`:

```tsx
// ✅ Good: Component composition
const Card = ({ children }) => (
  <div className="p-6 bg-white rounded-lg shadow-md">
    {children}
  </div>
);

// ❌ Avoid: @apply in CSS
// .card {
//   @apply p-6 bg-white rounded-lg shadow-md;
// }
```

## Design System

### Color Palette

Define colors in `tailwind.config.cjs`:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        50: '#...',
        100: '#...',
        // ... up to 900
      },
      secondary: { /* ... */ },
      success: '#...',
      warning: '#...',
      error: '#...',
    },
  },
}
```

Usage:
```tsx
<button className="bg-primary-500 hover:bg-primary-600">
  Primary Button
</button>
```

### Typography Scale

```javascript
// tailwind.config.cjs
theme: {
  extend: {
    fontSize: {
      'xs': '0.75rem',
      'sm': '0.875rem',
      'base': '1rem',
      'lg': '1.125rem',
      'xl': '1.25rem',
      '2xl': '1.5rem',
      // ...
    },
  },
}
```

### Spacing Scale

Tailwind's default spacing scale (4px increments):
- `1` = 0.25rem (4px)
- `2` = 0.5rem (8px)
- `4` = 1rem (16px)
- `8` = 2rem (32px)
- etc.

### Shadows

```tsx
<div className="shadow-sm">Small shadow</div>
<div className="shadow">Default shadow</div>
<div className="shadow-md">Medium shadow</div>
<div className="shadow-lg">Large shadow</div>
```

### Border Radius

```tsx
<div className="rounded">Small radius</div>
<div className="rounded-md">Medium radius</div>
<div className="rounded-lg">Large radius</div>
<div className="rounded-full">Full/circle</div>
```

## CSS Custom Properties (Design Tokens)

**Location**: `src/styles/tokens.css`

```css
:root {
  /* Colors */
  --color-primary: #3b82f6;
  --color-secondary: #8b5cf6;
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-error: #ef4444;
  
  /* Spacing */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
  
  /* Typography */
  --font-sans: 'Inter', system-ui, sans-serif;
  --font-mono: 'Fira Code', monospace;
  
  /* Z-index */
  --z-dropdown: 1000;
  --z-modal: 2000;
  --z-tooltip: 3000;
}
```

Use with Tailwind:
```javascript
// tailwind.config.cjs
theme: {
  extend: {
    colors: {
      primary: 'var(--color-primary)',
    },
  },
}
```

## Component Styling Patterns

### Container Component

```tsx
export const Container: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => (
  <div className="container mx-auto px-4 max-w-7xl">
    {children}
  </div>
);
```

### Card Component

```tsx
interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated';
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  variant = 'default' 
}) => (
  <div className={`
    p-6 bg-white rounded-lg
    ${variant === 'elevated' ? 'shadow-lg' : 'shadow-md'}
  `}>
    {children}
  </div>
);
```

### Button Component

```tsx
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary',
  size = 'md',
  children,
}) => {
  const baseClasses = 'font-medium rounded transition-colors';
  
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50',
  };
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };
  
  return (
    <button className={`
      ${baseClasses}
      ${variantClasses[variant]}
      ${sizeClasses[size]}
    `}>
      {children}
    </button>
  );
};
```

## Conditional Classes

### Using Template Literals

```tsx
<div className={`
  base-class
  ${isActive ? 'active-class' : 'inactive-class'}
  ${variant === 'large' ? 'text-xl' : 'text-base'}
`}>
  Content
</div>
```

### Using clsx/classnames

```bash
npm install clsx
```

```tsx
import clsx from 'clsx';

<div className={clsx(
  'base-class',
  isActive && 'active-class',
  variant === 'large' && 'text-xl',
  {
    'font-bold': isBold,
    'text-red-500': hasError,
  }
)}>
  Content
</div>
```

## Dark Mode

Enable dark mode in Tailwind:

```javascript
// tailwind.config.cjs
module.exports = {
  darkMode: 'class', // or 'media'
  // ...
};
```

Usage:
```tsx
<div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
  Content adapts to dark mode
</div>
```

## Animations

### Tailwind Animations

```tsx
// Spin
<div className="animate-spin">Loading...</div>

// Pulse
<div className="animate-pulse">Loading...</div>

// Bounce
<div className="animate-bounce">↓</div>
```

### Custom Animations

```javascript
// tailwind.config.cjs
theme: {
  extend: {
    keyframes: {
      slideIn: {
        '0%': { transform: 'translateX(-100%)' },
        '100%': { transform: 'translateX(0)' },
      },
    },
    animation: {
      slideIn: 'slideIn 0.3s ease-out',
    },
  },
}
```

Usage:
```tsx
<div className="animate-slideIn">Slides in from left</div>
```

## Transitions

```tsx
<button className="
  bg-blue-500
  transition-colors duration-200 ease-in-out
  hover:bg-blue-600
">
  Smooth color transition
</button>

<div className="
  transform transition-transform duration-300
  hover:scale-105
">
  Scales on hover
</div>
```

## Focus States

```tsx
<button className="
  focus:outline-none
  focus:ring-2
  focus:ring-blue-500
  focus:ring-offset-2
">
  Accessible focus state
</button>
```

## Best Practices

### 1. Mobile-First

Always design mobile-first, then add responsive classes:

```tsx
// ✅ Good
<div className="text-sm md:text-base lg:text-lg">

// ❌ Avoid
<div className="text-lg md:text-base sm:text-sm">
```

### 2. Consistent Spacing

Use the spacing scale consistently:

```tsx
// ✅ Good
<div className="p-4 mb-4 gap-4">

// ❌ Avoid arbitrary values
<div className="p-[17px] mb-[23px]">
```

### 3. Reusable Components

Extract repeated patterns into components:

```tsx
// ✅ Good
const SectionTitle = ({ children }) => (
  <h2 className="text-2xl font-bold mb-4">{children}</h2>
);

// ❌ Avoid repeating classes
<h2 className="text-2xl font-bold mb-4">Title 1</h2>
<h2 className="text-2xl font-bold mb-4">Title 2</h2>
```

### 4. Semantic HTML

Use semantic HTML with Tailwind:

```tsx
// ✅ Good
<nav className="...">
  <ul className="...">
    <li className="...">

// ❌ Avoid
<div className="...">
  <div className="...">
    <div className="...">
```

### 5. Accessibility

Include accessibility classes:

```tsx
// Focus states
<button className="focus:ring-2 focus:ring-blue-500">

// Screen reader only
<span className="sr-only">Hidden text for screen readers</span>
```

## Performance

### Purging Unused CSS

Tailwind automatically purges unused styles in production based on `content` configuration:

```javascript
// tailwind.config.cjs
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
};
```

### Dynamic Classes

Avoid dynamic class names:

```tsx
// ❌ Won't be detected by purge
const color = 'blue';
<div className={`text-${color}-500`}>

// ✅ Use complete class names
<div className={color === 'blue' ? 'text-blue-500' : 'text-red-500'}>
```

## Related Docs

[Components](./components.md) • [Development](../guides/development.md) • [Architecture](./architecture.md)
