# Viibe Project - Agent Instructions

## Build & Run Commands

### Vibe Coding Platform
```bash
cd apps/vibe-coding-platform
npm install
npm run dev    # Development
npm run build  # Production build
npm run start  # Production server
npm run lint   # Linting
npm run test   # Tests (when configured)
```

### Ralph Framework
```bash
cd ralph-claude-code
./install.sh   # Install globally
ralph --help   # Show help
ralph-setup my-project  # Create new project
```

## Environment Setup

1. Copy `.env.example` to `.env.local`
2. Fill in all required variables
3. Run database migrations: `npx prisma migrate dev`
4. Start development server: `npm run dev`

## Code Standards

- TypeScript strict mode enabled
- ESLint + Prettier for formatting
- Tailwind CSS for styling
- Zustand for state management
- Follow existing patterns in codebase

## Testing

- Run tests before committing: `npm test`
- Ensure build passes: `npm run build`
- Check linting: `npm run lint`

## Commit Guidelines

- Use conventional commits (feat:, fix:, docs:, etc.)
- Keep commits atomic and focused
- Include tests with new features

## Priority Tags

- `[P0]` - Critical/Blocking
- `[P1]` - High priority
- `[P2]` - Medium priority
- `[P3]` - Low priority
- `[P4]` - Future/Nice-to-have
