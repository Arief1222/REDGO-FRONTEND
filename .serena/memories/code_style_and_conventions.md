# Code Style and Conventions

## Prettier Configuration
Located in `.prettierrc`:
```json
{
  "bracketSpacing": true,
  "printWidth": 100,
  "singleQuote": true,
  "trailingComma": "all",
  "tabWidth": 2,
  "useTabs": false
}
```

### Key Rules
- **Indentation**: 2 spaces (no tabs)
- **Line Width**: 100 characters max
- **Quotes**: Single quotes for strings
- **Trailing Commas**: Always add (all)
- **Bracket Spacing**: Yes

## ESLint Configuration
Located in `.eslintrc.cjs`:
- Extends: `eslint:recommended`, `@typescript-eslint/recommended`, `react-hooks/recommended`
- Parser: `@typescript-eslint/parser`
- **Max Warnings**: 0 (strict - no warnings allowed)
- React Refresh plugin enabled

## TypeScript Configuration

### Compiler Options (tsconfig.json)
- **Strict Mode**: Enabled
- **Target**: ES2020
- **Module**: ESNext
- **JSX**: react-jsx
- **No Unused Locals**: true
- **No Unused Parameters**: true
- **No Fallthrough Cases**: true
- **Skip Lib Check**: true

### Path Aliases
```typescript
"paths": {
  "@/*": ["src/*"],
  "src/*": ["src/*"]
}
```

## Naming Conventions

### Files
- **Components**: PascalCase (e.g., `LoginPage.tsx`, `UserCard.tsx`)
- **Hooks**: lowercase with extension (e.g., `users.hook.ts`, `auth.hook.ts`)
- **Services**: lowercase with extension (e.g., `users.service.ts`, `auth.service.ts`)
- **Types**: lowercase with extension (e.g., `users.type.ts`, `auth.type.ts`)
- **Utilities**: lowercase (e.g., `venturoApiUtil.ts`, `theme.util.ts`)

### Code
- **Components**: PascalCase (e.g., `function LoginPage()`, `const UserCard = ()`)
- **Functions**: camelCase (e.g., `function fetchUsers()`, `const handleClick = ()`)
- **Hooks**: camelCase with `use` prefix (e.g., `useAuth()`, `useUsers()`)
- **Constants**: UPPER_SNAKE_CASE or camelCase (e.g., `API_URL`, `defaultConfig`)
- **Interfaces/Types**: PascalCase (e.g., `interface User`, `type AuthResponse`)
- **Service Instances**: camelCase (e.g., `const userService`, `const authService`)

## Import Conventions

### Use Absolute Imports
```typescript
// ✅ GOOD - Absolute imports
import { useAuth } from 'src/features/auth/auth.hook';
import { Button } from 'src/shared/components/ui/Button';

// ❌ BAD - Relative imports (avoid for cross-directory)
import { useAuth } from '../../../auth/auth.hook';
```

### Import Order (Recommended)
1. External libraries (React, third-party)
2. Internal absolute imports (`src/`)
3. Relative imports (if any)
4. Types (with `type` keyword)
5. Styles/CSS

```typescript
// External
import { useState, useEffect } from 'react';
import axios from 'axios';

// Internal
import { useAuth } from 'src/features/auth/auth.hook';
import { Button } from 'src/shared/components/ui/Button';

// Types
import type { User } from './users.type';

// Styles
import './styles.css';
```

## Component Structure

### Functional Components (Preferred)
```typescript
// PascalCase, default export for pages
export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  
  return (
    <div>
      {/* JSX */}
    </div>
  );
}

// Named export for reusable components
export const UserCard = ({ user }: { user: User }) => {
  return <div>{user.name}</div>;
};
```

### Props with Interfaces
```typescript
interface UserCardProps {
  user: User;
  onEdit?: (id: string) => void;
  className?: string;
}

export const UserCard = ({ user, onEdit, className }: UserCardProps) => {
  // Component logic
};
```

## Feature Module Pattern

### Standard Structure
```
features/[feature-name]/
├── components/              # Feature-specific components
├── pages/                  # Multiple pages (optional)
├── [feature].hook.ts       # Custom hooks
├── [feature].service.ts    # API service (class or object)
├── [feature].type.ts       # TypeScript types & interfaces
└── [feature].page.tsx      # Main page (if single page)
```

### Example
```typescript
// users.type.ts
export interface User {
  id: string;
  name: string;
  email: string;
}

// users.service.ts
class UserService {
  async getUsers() {
    // Implementation
  }
}
export const userService = new UserService();

// users.hook.ts
export const useUsers = () => {
  // Hook logic
  return { users, loading };
};

// users.page.tsx
export default function UsersPage() {
  const { users } = useUsers();
  return <div>{/* UI */}</div>;
}
```

## Styling Conventions

### Tailwind CSS (Primary)
```typescript
// Use utility classes
<div className="flex items-center gap-4 p-4 bg-white dark:bg-dark">

// Support dark mode
<button className="bg-primary hover:bg-primary-600 dark:bg-dark-primary">

// Use CSS variables for theme colors
<div style={{ color: 'var(--color-primary)' }}>
```

### Class Composition
```typescript
import { clsx } from 'clsx';

const className = clsx(
  'base-class',
  isActive && 'active-class',
  'hover:opacity-80'
);
```

## API Service Pattern

### Service Class
```typescript
// features/users/users.service.ts
import venturoService from 'src/shared/utils/venturoApiUtil';
import type { User } from './users.type';

class UserService {
  private readonly baseUrl = '/api/users';

  async getUsers(params?: object): Promise<User[]> {
    const response = await venturoService.DataGet(this.baseUrl, params);
    return response.data;
  }
}

export const userService = new UserService();
```

## Comments & Documentation

### JSDoc (Optional but Recommended for Complex Logic)
```typescript
/**
 * Fetches users with pagination and filtering
 * @param params - Query parameters for filtering
 * @returns Promise with users list and metadata
 */
async getUsers(params: UsersListParams): Promise<UsersListResponse> {
  // Implementation
}
```

### Inline Comments
- Use sparingly - code should be self-documenting
- Explain "why" not "what"
- Complex business logic should have comments

## Error Handling
```typescript
// Service layer
try {
  const response = await api.get('/users');
  return response.data;
} catch (error: any) {
  if (error.response?.data?.message) {
    throw new Error(error.response.data.message);
  }
  throw new Error('Failed to fetch users');
}

// Component layer
const [error, setError] = useState<string | null>(null);

try {
  await fetchData();
} catch (err: any) {
  setError(err.message);
}
```

## No Testing Convention
- No test files or testing framework configured
- No `*.test.ts` or `*.spec.ts` files found
- Testing setup would need to be added if required
