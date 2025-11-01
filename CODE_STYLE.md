# Code Style Guide

## Overview

This document outlines coding conventions, naming standards, and formatting rules for the Sargam project.

## Frontend (TypeScript/React)

### Naming Conventions

| Type | Convention | Example |
|------|-----------|---------|
| **Components** | PascalCase | `FileUpload.tsx`, `AudioPlayer.tsx` |
| **Functions/Variables** | camelCase | `handleTranscribe`, `audioFile` |
| **Constants** | UPPER_SNAKE_CASE | `API_BASE_URL`, `MAX_FILE_SIZE` |
| **Types/Interfaces** | PascalCase | `SwaramNote`, `RaagaInfo` |
| **Files** | kebab-case (utils), PascalCase (components) | `app-store.ts`, `FileUpload.tsx` |
| **Props** | camelCase | `audioFile`, `isTranscribing` |

### Component Structure

```typescript
// 1. Imports (external first, then internal)
import { useState } from "react"
import { useAppStore } from "@/store/app-store"
import { Button } from "@/components/ui/button"

// 2. Types/Interfaces
interface ComponentProps {
  audioFile: File | null
  onTranscribe: () => void
}

// 3. Component
export const ComponentName = ({ audioFile, onTranscribe }: ComponentProps) => {
  // 4. Hooks
  const [state, setState] = useState(false)
  const { data } = useAppStore()
  
  // 5. Event Handlers (prefix with "handle")
  const handleClick = () => {
    // ...
  }
  
  // 6. Effects
  useEffect(() => {
    // ...
  }, [])
  
  // 7. Render
  return (
    <div>
      {/* JSX */}
    </div>
  )
}
```

### TypeScript Guidelines

**Always use types:**
```typescript
// Good
const audioFile: File | null = null
const handleClick = (): void => { ... }

// Bad
const audioFile = null
const handleClick = () => { ... }
```

**Avoid `any`:**
```typescript
// Good
const error: unknown = catchError()
if (error instanceof Error) {
  console.error(error.message)
}

// Bad
const error: any = catchError()
console.error(error.message)
```

**Use interfaces for objects:**
```typescript
// Good
interface SwaramNote {
  start: number
  end: number
  swaram: string
}

// Bad
type SwaramNote = {
  start: number
  end: number
  swaram: string
}
```

### React Best Practices

**Use functional components:**
```typescript
// Good
export const Component = () => { ... }

// Bad
export class Component extends React.Component { ... }
```

**Destructure props:**
```typescript
// Good
const Component = ({ prop1, prop2 }: Props) => { ... }

// Bad
const Component = (props: Props) => {
  const prop1 = props.prop1
}
```

**Use meaningful variable names:**
```typescript
// Good
const isTranscribing = useAppStore((state) => state.isTranscribing)

// Bad
const t = useAppStore((state) => state.isTranscribing)
```

### Code Formatting

**Prettier Configuration:**
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": false,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false
}
```

**ESLint Rules:**
- No `console.log` in production code
- No unused variables
- Require explicit return types
- Enforce consistent naming

## Backend (Python)

### Naming Conventions

| Type | Convention | Example |
|------|-----------|---------|
| **Classes** | PascalCase | `AudioProcessor`, `Transcriber` |
| **Functions/Methods** | snake_case | `process_audio`, `detect_raaga` |
| **Constants** | UPPER_SNAKE_CASE | `TARGET_SAMPLE_RATE`, `MAX_DURATION` |
| **Variables** | snake_case | `audio_file`, `sample_rate` |
| **Files** | snake_case | `audio_processor.py`, `main.py` |
| **Private Methods** | Leading underscore | `_calculate_frequencies`, `_detect_gamakam` |

### Code Structure

```python
# 1. Standard library imports
import os
import logging
from pathlib import Path
from typing import List, Optional, Tuple

# 2. Third-party imports
import librosa
import numpy as np
from fastapi import FastAPI

# 3. Local imports
from api.audio_processor import AudioProcessor

# 4. Constants
TARGET_SAMPLE_RATE = 44100
MAX_DURATION = 300

# 5. Class definition
class AudioProcessor:
    """
    Audio processing utility class.
    
    Handles audio loading, preprocessing, and format conversion.
    """
    
    def __init__(self):
        """Initialize processor with default settings."""
        self.sample_rate = TARGET_SAMPLE_RATE
    
    def process_audio(self, file_path: str) -> Tuple[np.ndarray, int]:
        """
        Process audio file for transcription.
        
        Args:
            file_path: Path to audio file
        
        Returns:
            Tuple of (audio_array, sample_rate)
        """
        # Implementation
        pass
```

### Python Guidelines

**Type Hints:**
```python
# Always use type hints
def process_audio(file_path: str) -> Tuple[np.ndarray, int]:
    ...

# Use Optional for nullable types
def detect_raaga(swarams: List[Dict]) -> Optional[Dict]:
    ...
```

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
        ValueError: If audio file is invalid
        Exception: If processing fails
    """
```

**Error Handling:**
```python
# Good - specific exception
try:
    audio = librosa.load(file_path)
except Exception as e:
    logger.error(f"Failed to load audio: {str(e)}")
    raise ValueError(f"Invalid audio file: {file_path}")

# Bad - bare except
try:
    audio = librosa.load(file_path)
except:
    pass
```

### Code Formatting

**Black Configuration:**
```toml
[tool.black]
line-length = 100
target-version = ['py312']
```

**PEP 8 Compliance:**
- Maximum line length: 100 characters
- Use 4 spaces for indentation
- Blank lines between functions/classes
- Import order: stdlib → third-party → local

## Comments

### When to Comment

**DO:**
- Explain "why" not "what"
- Document complex algorithms
- Explain business logic
- Add TODO comments for future work

**DON'T:**
- Comment obvious code
- Repeat code in comments
- Leave commented-out code

### Comment Style

**TypeScript:**
```typescript
/**
 * Handle file removal
 * Cleans up object URL and resets file state
 */
const handleRemove = () => {
  // Implementation
}

// TODO: Add file validation before upload
```

**Python:**
```python
# Process audio file
# This function handles audio loading and preprocessing
# Note: Duration is limited to 5 minutes for MVP
def process_audio(file_path: str) -> Tuple[np.ndarray, int]:
    # TODO: Add support for streaming audio
    pass
```

## File Organization

### Frontend Structure

```
app/
├── layout.tsx          # Root layout
├── page.tsx           # Main page
└── globals.css        # Global styles

components/
├── ui/                # Reusable UI components
│   ├── button.tsx
│   └── card.tsx
├── file-upload.tsx    # Feature components
├── audio-player.tsx
└── ...

lib/
└── utils.ts           # Utility functions

store/
└── app-store.ts       # State management
```

### Backend Structure

```
backend/
├── main.py            # Application entry point
├── api/               # API modules
│   ├── audio_processor.py
│   ├── transcriber.py
│   └── ...
├── tests/             # Test files
│   └── ...
└── requirements.txt   # Dependencies
```

## Linting & Formatting

### Frontend

**Prettier:**
```bash
npm run format        # Format code
npm run lint          # Check linting
```

**ESLint:**
```bash
npm run lint          # Run ESLint
npm run lint:fix      # Fix auto-fixable issues
```

### Backend

**Black:**
```bash
black backend/        # Format code
black --check backend/  # Check formatting
```

**Flake8:**
```bash
flake8 backend/       # Check code style
```

## Git Hooks (Future)

**Pre-commit Hook:**
- Run linting
- Run formatting check
- Run tests
- Check for secrets

**Example (.husky/pre-commit):**
```bash
#!/bin/sh
npm run lint
npm run format:check
npm run test
```

## Code Review Guidelines

### Review Checklist

**Functionality:**
- [ ] Code works as intended
- [ ] Edge cases handled
- [ ] Error handling implemented

**Code Quality:**
- [ ] Follows style guide
- [ ] No code duplication
- [ ] Well commented
- [ ] Type safe (TypeScript/Python)

**Performance:**
- [ ] No unnecessary re-renders
- [ ] Efficient algorithms
- [ ] No memory leaks

**Security:**
- [ ] Input validation
- [ ] No secrets in code
- [ ] Error messages sanitized

## Resources

- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React Best Practices](https://react.dev/learn)
- [PEP 8 Style Guide](https://pep8.org/)
- [Google Python Style Guide](https://google.github.io/styleguide/pyguide.html)

---

**Last Updated:** 2025-11-01  
**Version:** 1.0.0

