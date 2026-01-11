# Suggested Commands

## Development Commands

### Daily Development
```bash
npm run dev              # Start development server (Vite, port 5173)
npm run build           # Build for production (TypeScript check + Vite build)
npm run lint            # Run ESLint with TypeScript
npm run preview         # Preview production build locally
```

### Common Workflows

#### Starting Development
```bash
npm install             # Install dependencies (first time or after pulling)
npm run dev            # Start dev server
```

#### Before Committing
```bash
npm run lint           # Check for linting errors
npm run build          # Ensure production build works
```

#### Production Build
```bash
npm run build          # Compile TypeScript and build with Vite
npm run preview        # Test production build locally
```

## Git Commands (macOS)
```bash
git status             # Check working tree status
git add .              # Stage all changes
git commit -m "message" # Commit with message
git push               # Push to remote
git pull               # Pull from remote
git branch             # List branches
git checkout -b name   # Create and switch to new branch
```

## File System Commands (macOS)
```bash
ls -la                 # List files with details
find . -name "*.tsx"   # Find files by pattern
grep -r "text" src/    # Search for text in files
cd directory/          # Change directory
pwd                    # Print working directory
rm -rf directory/      # Remove directory recursively
mkdir directory/       # Create directory
```

## NPM Package Management
```bash
npm install package    # Install package
npm uninstall package  # Remove package
npm outdated          # Check for outdated packages
npm update            # Update packages
npm ci                # Clean install (CI/CD)
```

## Development Server
- **URL**: http://localhost:5173
- **Hot Reload**: Enabled automatically
- **Port Change**: Update vite.config.ts if needed

## Build Output
- **Directory**: `dist/`
- **Deployment**: Upload `dist/` folder to static hosting

## Notes
- No test framework configured (no `npm test` command)
- No formatter script (use IDE prettier integration)
- ESLint warnings set to max 0 (strict linting)
