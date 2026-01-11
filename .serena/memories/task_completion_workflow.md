# Task Completion Workflow

## When a Task is Completed

Follow these steps after completing any development task:

### 1. Linting ✅
```bash
npm run lint
```
- **Purpose**: Check for code quality issues
- **Must Pass**: Yes - max warnings set to 0
- **Fix Issues**: Address all ESLint errors and warnings

### 2. Build Check ✅
```bash
npm run build
```
- **Purpose**: Ensure TypeScript compiles and Vite builds successfully
- **Must Pass**: Yes - production build must work
- **Output**: Check `dist/` folder is generated

### 3. Manual Testing ✅
```bash
npm run dev
```
- **Navigate to affected pages**: Test functionality in browser
- **Check console**: No errors in browser console
- **Test auth flows**: If auth-related changes
- **Test responsive**: Check mobile/tablet views if UI changes
- **Test dark mode**: If styling changes

### 4. Git Workflow (If Applicable)
```bash
# Stage changes
git add .

# Commit with descriptive message
git commit -m "feat: add user management feature"

# Push to remote (if ready)
git push
```

## Pre-Commit Checklist

- [ ] **Code compiles**: `npm run build` succeeds
- [ ] **Linting passes**: `npm run lint` shows no errors
- [ ] **Manual test passed**: Feature works in browser
- [ ] **No console errors**: Browser console is clean
- [ ] **Auth still works**: Login/logout functional (if applicable)
- [ ] **Imports use absolute paths**: Using `src/` prefix
- [ ] **Types defined**: No `any` types unless necessary
- [ ] **Dark mode supported**: UI works in both light/dark
- [ ] **Responsive**: Works on mobile/tablet (if UI changes)

## Common Issues to Check

### TypeScript Errors
```bash
# Check for type errors
npm run build

# Common fixes:
# - Add missing type imports
# - Define proper interfaces
# - Avoid 'any' types
```

### ESLint Warnings
```bash
# Check linting
npm run lint

# Common fixes:
# - Remove unused imports
# - Remove unused variables
# - Fix React hooks dependencies
# - Add missing prop-types
```

### Import Errors
```typescript
// ❌ BAD - Relative imports
import { useAuth } from '../../../auth/useAuth';

// ✅ GOOD - Absolute imports
import { useAuth } from 'src/features/auth/auth.hook';
```

### Build Failures
Common causes:
- Missing dependencies: `npm install`
- Type errors: Check TypeScript output
- Syntax errors: Check ESLint output
- Import path errors: Use absolute paths

## Feature-Specific Checks

### Authentication Changes
- [ ] Login still works
- [ ] Logout still works
- [ ] Protected routes redirect properly
- [ ] Guest routes redirect properly
- [ ] Token persists in localStorage

### UI/Component Changes
- [ ] Component renders correctly
- [ ] Props are typed properly
- [ ] Dark mode works
- [ ] Responsive design works
- [ ] No layout shifts
- [ ] Accessibility considered

### API/Service Changes
- [ ] API calls work
- [ ] Error handling works
- [ ] Loading states work
- [ ] Type safety maintained
- [ ] Auth token injected

### Routing Changes
- [ ] All routes accessible
- [ ] Guards work correctly
- [ ] 404 page works
- [ ] Lazy loading works
- [ ] Browser back/forward works

## Git Commit Message Convention

### Format
```
<type>: <short description>

[optional body]
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `refactor`: Code refactoring (no functional change)
- `style`: Code style changes (formatting, etc.)
- `docs`: Documentation changes
- `chore`: Build process, dependencies, etc.
- `test`: Adding or updating tests

### Examples
```bash
git commit -m "feat: add user management page"
git commit -m "fix: resolve auth redirect loop"
git commit -m "refactor: consolidate auth logic into features/auth"
git commit -m "style: apply prettier formatting"
git commit -m "docs: update CLAUDE.md with new structure"
git commit -m "chore: upgrade React to v19"
```

## Testing Notes

### No Automated Tests
- **No test framework configured** in this project
- **No test files** found (*.test.ts, *.spec.ts)
- **Manual testing required** for all changes
- **Consider adding** testing framework if needed (Vitest, Jest, React Testing Library)

### Manual Testing Checklist
1. **Functionality**: Feature works as expected
2. **Edge Cases**: Test with empty data, errors, etc.
3. **Auth States**: Test logged in and logged out
4. **Browser Compatibility**: Test in Chrome, Firefox, Safari
5. **Performance**: Check for slow renders or memory leaks

## Before Pushing to Main

### Final Checks
```bash
# Full workflow
npm run lint          # Linting passes
npm run build         # Build succeeds
npm run preview       # Test production build locally

# Git
git status            # Review changes
git diff              # Review code changes
git add .             # Stage changes
git commit -m "..."   # Commit with message
git push              # Push to remote
```

### Production Readiness
- [ ] No console.log statements
- [ ] No commented-out code
- [ ] No TODO comments (or documented in issues)
- [ ] Environment variables configured
- [ ] API endpoints correct
- [ ] Error messages user-friendly
- [ ] Loading states implemented
- [ ] Error states implemented

## Deployment (If Applicable)

### Build for Production
```bash
npm run build
```

### Output
- **Directory**: `dist/`
- **Deploy**: Upload contents to static hosting
- **Preview**: `npm run preview` before deploying

### Environment Variables
Check `.env.example` for required variables:
- API_URL: Backend API endpoint
- Other auth/config variables as needed

## When in Doubt
1. Check `CLAUDE.md` for project-specific guidelines
2. Review `docs/ARCHITECTURE_ASSESSMENT.md` for architecture decisions
3. Look at `features/users/` as reference pattern
4. Run all checks: `npm run lint && npm run build`
5. Test manually in browser before committing
