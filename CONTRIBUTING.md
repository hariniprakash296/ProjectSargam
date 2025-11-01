# Contributing Guide

## Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn
- Python 3.12+
- Git

### Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ProjectSargam
   ```

2. **Setup Frontend**
   ```bash
   npm install
   ```

3. **Setup Backend**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

## Code Style

### Frontend (TypeScript/React)

**Naming Conventions:**
- **Components**: PascalCase (`FileUpload.tsx`)
- **Functions/Constants**: camelCase (`handleTranscribe`, `API_BASE_URL`)
- **Types/Interfaces**: PascalCase (`SwaramNote`, `RaagaInfo`)
- **Files**: kebab-case for utilities (`app-store.ts`), PascalCase for components (`FileUpload.tsx`)

**Component Structure:**
```typescript
// 1. Imports
import { ... } from "..."
import { ... } from "@/..."

// 2. Types/Interfaces
interface ComponentProps {
  // ...
}

// 3. Component
export const ComponentName = ({ prop }: ComponentProps) => {
  // 4. Hooks
  const { state } = useAppStore()
  
  // 5. Event Handlers
  const handleClick = () => {
    // ...
  }
  
  // 6. Render
  return (
    // JSX
  )
}
```

**Code Formatting:**
- Use Prettier (configured via `.prettierrc`)
- Use ESLint (configured via `.eslintrc.json`)
- Run `npm run lint` before committing

**TypeScript:**
- Always use TypeScript types/interfaces
- Avoid `any` - use `unknown` if type is truly unknown
- Use type guards for runtime type checking

### Backend (Python)

**Naming Conventions:**
- **Classes**: PascalCase (`AudioProcessor`, `Transcriber`)
- **Functions/Methods**: snake_case (`process_audio`, `detect_raaga`)
- **Constants**: UPPER_SNAKE_CASE (`TARGET_SAMPLE_RATE`, `MAX_DURATION`)
- **Files**: snake_case (`audio_processor.py`)

**Code Formatting:**
- Follow PEP 8 style guide
- Use type hints for all functions
- Maximum line length: 100 characters
- Use `black` for formatting (when configured)

**Docstrings:**
```python
def process_audio(self, file_path: str) -> Tuple[np.ndarray, int]:
    """
    Process audio file for transcription.
    
    Converts to mono, resamples to target rate, and validates duration.
    
    Args:
        file_path: Path to audio file
    
    Returns:
        Tuple of (audio_array, sample_rate)
    
    Raises:
        Exception: If audio processing fails
    """
```

## Branch Naming

**Format:** `<type>/<description>`

**Types:**
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation changes
- `refactor/` - Code refactoring
- `test/` - Adding tests
- `chore/` - Maintenance tasks

**Examples:**
- `feature/add-export-functionality`
- `fix/cors-error-handling`
- `docs/update-api-documentation`

## Commit Messages

**Format:** `<type>: <subject>`

**Types:**
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation
- `style:` - Formatting, missing semicolons, etc.
- `refactor:` - Code restructuring
- `test:` - Adding tests
- `chore:` - Maintenance

**Examples:**
```
feat: add MIDI export functionality
fix: resolve CORS error for port 3002
docs: update API documentation
refactor: extract audio processing logic
```

**Commit Message Guidelines:**
- Use imperative mood ("add" not "added")
- Keep subject line under 50 characters
- Add body if more explanation needed
- Reference issues: `fix: resolve CORS error (#123)`

## Pull Request Process

1. **Create Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Changes**
   - Write code following style guidelines
   - Add comments explaining complex logic
   - Update documentation if needed

3. **Test Your Changes**
   - Test frontend: `npm run dev`
   - Test backend: `python backend/main.py`
   - Run linters: `npm run lint`
   - Test manually in browser

4. **Commit Changes**
   ```bash
   git add .
   git commit -m "feat: add your feature"
   ```

5. **Push and Create PR**
   ```bash
   git push origin feature/your-feature-name
   ```
   - Create PR with clear description
   - Link related issues
   - Request review from maintainers

6. **PR Review**
   - Address review comments
   - Update PR if needed
   - Wait for approval before merging

## Code Review Checklist

**Frontend:**
- [ ] TypeScript types are correct
- [ ] No console.logs in production code
- [ ] Components are properly commented
- [ ] Error handling is implemented
- [ ] UI is responsive and accessible
- [ ] No hardcoded values (use constants/config)

**Backend:**
- [ ] Type hints are present
- [ ] Docstrings are complete
- [ ] Error handling is robust
- [ ] Logging is appropriate
- [ ] No sensitive data in logs
- [ ] Input validation is performed

## Adding New Features

### Frontend Feature

1. **Create Component**
   ```bash
   touch components/new-feature.tsx
   ```

2. **Add to Store** (if needed)
   ```typescript
   // store/app-store.ts
   newFeature: string | null
   setNewFeature: (value: string | null) => void
   ```

3. **Add to Page**
   ```typescript
   // app/page.tsx
   import { NewFeature } from "@/components/new-feature"
   ```

4. **Update Types**
   ```typescript
   // types/index.ts (if creating new types file)
   export interface NewFeatureProps {
     // ...
   }
   ```

### Backend Feature

1. **Create Service Module**
   ```bash
   touch backend/api/new_service.py
   ```

2. **Add to main.py**
   ```python
   from api.new_service import NewService
   new_service = NewService()
   ```

3. **Add Endpoint**
   ```python
   @app.post("/api/new-endpoint")
   async def new_endpoint():
       # ...
   ```

4. **Update Documentation**
   - Add to `API_REFERENCE.md`
   - Update `CHANGELOG.md`

## Testing

### Frontend Testing (Future)
- Unit tests: Jest + React Testing Library
- Integration tests: Cypress/Playwright
- Component tests: Storybook

### Backend Testing (Future)
- Unit tests: pytest
- Integration tests: pytest + FastAPI TestClient
- API tests: pytest + requests

**Test Structure:**
```
tests/
├── frontend/
│   ├── components/
│   └── utils/
└── backend/
    ├── api/
    └── integration/
```

## Documentation

**When to Update Documentation:**
- Adding new features → Update `ARCHITECTURE.md` and `API_REFERENCE.md`
- Changing API → Update `API_REFERENCE.md` and `CHANGELOG.md`
- Fixing bugs → Update `TROUBLESHOOTING.md`
- Deployment changes → Update `DEPLOYMENT.md`

## Questions?

- Check existing documentation in `/docs`
- Review `ARCHITECTURE.md` for system design
- Check `TROUBLESHOOTING.md` for common issues
- Open an issue for questions

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Help others learn and grow
- Follow the project's coding standards

