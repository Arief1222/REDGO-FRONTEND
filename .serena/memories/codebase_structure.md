# Codebase Structure

## Root Directory Structure
```
venturo-skeleton-react/
├── src/                    # Source code
├── public/                 # Static assets
├── docs/                   # Documentation
├── node_modules/           # Dependencies
├── dist/                   # Build output (generated)
├── .serena/               # Serena configuration
├── package.json           # NPM configuration
├── tsconfig.json          # TypeScript configuration
├── vite.config.ts         # Vite configuration
├── tailwind.config.ts     # Tailwind CSS configuration
├── .eslintrc.cjs          # ESLint configuration
├── .prettierrc            # Prettier configuration
├── .env                   # Environment variables (local)
├── .env.example           # Environment variables template
├── CLAUDE.md              # Claude Code guidance
└── README.md              # Project documentation
```

## Source Directory (`src/`)

### Top-Level Structure
```
src/
├── app/                    # Application core
│   ├── guards/            # Authentication logic & guards
│   ├── layouts/           # Layout components (Full, Blank)
│   └── routes/            # Routing configuration
├── features/              # Feature modules (domain logic)
│   ├── auth/             # Authentication feature
│   ├── users/            # Users management feature
│   └── sample-page/      # Sample/demo feature
├── shared/               # Shared/reusable code
│   ├── components/       # UI component library (20+ subdirectories)
│   ├── context/          # Global React contexts
│   ├── hooks/            # Custom React hooks
│   ├── types/            # TypeScript type definitions
│   └── utils/            # Utility functions & services
├── assets/               # Static assets (images, fonts)
├── css/                  # Global styles & theme CSS
├── App.tsx               # Root App component
├── main.tsx              # Application entry point
└── vite-env.d.ts         # Vite environment types
```

## App Directory (`src/app/`)

### Purpose
Application-level concerns: routing, guards, layouts

```
app/
├── guards/
│   ├── auth/                    # Auth context & service
│   │   ├── AuthContext.tsx     # Auth state management
│   │   ├── authService.ts      # Auth API calls
│   │   └── useAuth.ts          # Auth hook
│   ├── authGuard/              # Route guards
│   │   ├── AuthGuard.tsx       # Protected route wrapper
│   │   ├── GuestGuard.tsx      # Guest-only route wrapper
│   │   └── UseAuth.tsx         # Auth utilities
│   └── jwt/                    # JWT utilities
│       └── Jwt.ts
├── layouts/
│   ├── full/                   # Full dashboard layout
│   │   ├── FullLayout.tsx     # Main layout component
│   │   ├── horizontal/        # Horizontal navigation
│   │   ├── vertical/          # Vertical navigation (sidebar)
│   │   └── shared/            # Shared layout components
│   └── blank/                  # Minimal layout (auth pages)
│       └── BlankLayout.tsx
└── routes/
    ├── Router.tsx              # Main router configuration
    ├── SideBarData.ts         # Sidebar menu data
    ├── NavBarData.ts          # Navbar menu data
    └── SideBarParentData.ts   # Parent menu items
```

## Features Directory (`src/features/`)

### Purpose
Domain-specific features with business logic

```
features/
├── auth/                       # Authentication feature
│   ├── components/            # Auth-specific components
│   │   ├── BoxedSocialButtons.tsx
│   │   ├── BoxedAuthSlider.tsx
│   │   ├── Maintainance.tsx
│   │   └── Error.tsx
│   ├── signin/
│   │   ├── Signin.tsx
│   │   └── components/
│   ├── register/
│   │   ├── Register.tsx
│   │   └── components/
│   ├── forgot-password/
│   │   └── ForgotPassword.tsx
│   └── twosteps/
│       └── TwoSteps.tsx
├── users/                      # Users management (reference pattern)
│   ├── components/            # User-specific components
│   ├── users.hook.ts          # useUsers custom hook
│   ├── users.service.ts       # User API service (UserService class)
│   ├── users.type.ts          # User TypeScript types
│   └── users.page.tsx         # Users page component
└── sample-page/
    └── SamplePage.tsx         # Sample demo page
```

### Feature Pattern (Best Practice - from users/)
Each feature should follow this pattern:
```
features/[feature-name]/
├── components/              # Feature-specific components
├── [feature].hook.ts       # Custom hooks (e.g., useUsers)
├── [feature].service.ts    # API service class/object
├── [feature].type.ts       # TypeScript types & interfaces
└── [feature].page.tsx      # Main page component
```

## Shared Directory (`src/shared/`)

### Purpose
Reusable code across all features

```
shared/
├── components/                 # UI component library
│   ├── ui/                    # Base UI components
│   ├── ui-components/         # Flowbite components
│   ├── venturo-ui/            # Custom Venturo components
│   ├── shadcn-ui/             # Shadcn components
│   ├── headless-ui/           # Headless UI components
│   ├── headless-form/         # Headless form components
│   ├── shadcn-form/           # Shadcn form components
│   ├── form-components/       # Form components
│   ├── tables/                # Table components
│   ├── react-tables/          # React table components
│   ├── shadcn-table/          # Shadcn table components
│   ├── apps/                  # App-specific components
│   ├── dashboards/            # Dashboard components
│   ├── charts/                # Chart components
│   ├── widgets/               # Widget components
│   ├── theme-pages/           # Theme page components
│   ├── front-pages/           # Frontend page components
│   ├── landingpage/           # Landing page components
│   └── shared/                # Truly shared components
├── context/
│   ├── CustomizerContext.tsx  # Theme customizer context
│   ├── DashboardContext/      # Dashboard state context
│   └── config.ts              # Context configuration
├── hooks/                      # Custom React hooks
├── types/                      # Global TypeScript types
│   ├── auth/                  # Auth types
│   ├── apps/                  # App-specific types
│   └── layout/                # Layout types
└── utils/                      # Utility functions
    ├── venturoApiUtil.ts      # Axios API client wrapper
    ├── theme/                 # Theme utilities
    │   └── custom-theme.tsx   # Flowbite theme overrides
    ├── languages/             # i18n language files
    │   ├── en.json
    │   ├── ar.json
    │   ├── ch.json
    │   └── fr.json
    ├── i18n.ts                # i18n initialization
    └── utils.ts               # General utilities
```

## Entry Points

### Application Entry
```typescript
// src/main.tsx - Application bootstrap
ReactDOM.createRoot(document.getElementById('root')!).render(
  <DashboardContextProvider>
    <CustomizerContextProvider>
      <Suspense fallback={<Spinner />}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </Suspense>
    </CustomizerContextProvider>
  </DashboardContextProvider>,
);
```

### Root Component
```typescript
// src/App.tsx - Root component
function App() {
  return (
    <>
      <ThemeModeScript />
      <Flowbite theme={{ theme: customTheme }}>
        <RouterProvider router={router} />
      </Flowbite>
      <Toaster />
    </>
  );
}
```

### Router Configuration
```typescript
// src/app/routes/Router.tsx
const Router = [
  {
    path: '/',
    element: (
      <AuthGuard>
        <FullLayout />
      </AuthGuard>
    ),
    children: [
      { path: '/', element: <SamplePage /> },
      { path: '/users', element: <Users /> },
      // ... more protected routes
    ],
  },
  {
    path: '/',
    element: (
      <GuestGuard>
        <BlankLayout />
      </GuestGuard>
    ),
    children: [
      { path: '/auth/login', element: <Signin /> },
      { path: '/auth/register', element: <Register /> },
      // ... more public routes
    ],
  }
];
```

## Key Architecture Patterns

### 1. Feature-Based Architecture
- Domain logic grouped by feature
- Each feature is self-contained
- Minimal dependencies between features

### 2. Context Providers
- Global state via React Context
- AuthProvider for authentication
- CustomizerContext for theme/layout
- DashboardContext for dashboard state

### 3. Route Guards
- AuthGuard for protected routes
- GuestGuard for public-only routes
- Automatic redirects based on auth state

### 4. Lazy Loading
- Routes lazy-loaded with React.lazy()
- Custom Loadable wrapper for loading states
- Code splitting for better performance

### 5. API Client
- Centralized VenturoApiUtil service
- Automatic auth token injection
- Automatic 401 error handling
- Consistent error handling

### 6. Styling Strategy
- Tailwind CSS for utilities
- Flowbite for component base
- Custom theme overrides
- CSS variables for theming
- Dark mode support

## Notes on Current Structure

### ⚠️ Known Issues (per docs/ARCHITECTURE_ASSESSMENT.md)
1. Auth logic scattered across 3 locations (app/guards/auth, app/guards/authGuard, features/auth)
2. Inconsistent feature patterns (auth uses subfolders, users uses flat structure)
3. Planned refactoring to consolidate auth into features/auth/

### ✅ Best Practices
- Use `features/users/` as reference pattern
- Follow feature module pattern for new features
- Use absolute imports with `src/` prefix
- Keep shared components truly generic
