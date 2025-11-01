# Architecture Documentation

## Overview

Sargam is a Carnatic music transcription application that converts audio files into swaram notation with raaga recognition. The system follows modern web architecture principles with clear separation between frontend and backend components.

## Design Principles

### DRY (Don't Repeat Yourself)

**Implementation:**
- **State Management**: Centralized state in `store/app-store.ts` - single source of truth for application state
- **API Client**: All API calls use axios from a single configuration point (`app/page.tsx`)
- **Utility Functions**: Shared utilities in `lib/utils.ts` (e.g., `cn()` for class merging)
- **UI Components**: Reusable Shadcn UI components in `components/ui/` - used across multiple pages
- **Backend Services**: Audio processing logic centralized in `api/audio_processor.py` - not duplicated in endpoints

**Example:**
```typescript
// Instead of repeating Zustand store creation in each component:
const useAppStore = create<AppState>((set) => ({...})) // Defined once in store/app-store.ts

// All components import from single source:
import { useAppStore } from "@/store/app-store"
```

### Separation of Concerns (SoC)

**Frontend Layers:**
- **Presentation Layer**: `components/` - UI rendering and user interaction
- **Business Logic Layer**: `store/app-store.ts` - State management and business rules
- **Data Layer**: API calls in `app/page.tsx` - Data fetching and transformation
- **Routing Layer**: Next.js App Router - Navigation and routing

**Backend Layers:**
- **API Layer**: `main.py` - HTTP endpoints and request handling
- **Business Logic Layer**: `api/transcriber.py`, `api/raaga_detector.py` - Core transcription logic
- **Data Processing Layer**: `api/audio_processor.py` - Audio file processing
- **Infrastructure Layer**: FastAPI middleware, CORS, logging - Cross-cutting concerns

**Example:**
```
Frontend: UI rendering ← State management ← API calls ← Backend endpoints
Backend: HTTP layer ← Business logic ← Audio processing ← File system
```

### Single Responsibility Principle (SRP)

**Component Responsibilities:**

| Component | Single Responsibility |
|-----------|----------------------|
| `FileUpload` | Handle file upload UI and validation only |
| `AudioPlayer` | Manage audio playback controls and synchronization |
| `SwaramDisplay` | Display transcribed swarams with playback sync |
| `RaagaInfoDisplay` | Display raaga information |
| `AudioProcessor` | Process audio files (load, normalize, resample) |
| `Transcriber` | Convert audio to swaram notation |
| `RaagaDetector` | Detect raaga from swaram patterns |
| `LyricsExtractor` | Extract lyrics from audio (placeholder) |

**Example:**
```python
# AudioProcessor - only handles audio processing
class AudioProcessor:
    def process_audio(self, file_path: str) -> Tuple[np.ndarray, int]:
        # Only responsible for audio loading and preprocessing
        # Doesn't handle transcription or raaga detection

# Transcriber - only handles transcription
class Transcriber:
    def transcribe(self, audio: np.ndarray, sample_rate: int) -> List[Dict]:
        # Only responsible for pitch detection and swaram mapping
        # Doesn't handle audio loading or raaga detection
```

### Modularity

**Frontend Modules:**
```
app/
├── layout.tsx          # Root layout module
├── page.tsx            # Main page module
└── globals.css         # Global styles module

components/
├── ui/                 # UI component library module
│   ├── button.tsx
│   ├── card.tsx
│   └── ...
├── file-upload.tsx     # File upload module
├── audio-player.tsx    # Audio player module
├── swaram-display.tsx  # Swaram display module
├── raaga-info.tsx      # Raaga info module
└── lyrics-display.tsx  # Lyrics display module

store/
└── app-store.ts        # State management module

lib/
└── utils.ts            # Utility functions module
```

**Backend Modules:**
```
backend/
├── main.py             # API entry point module
└── api/
    ├── audio_processor.py    # Audio processing module
    ├── transcriber.py        # Transcription module
    ├── raaga_detector.py     # Raaga detection module
    └── lyrics_extractor.py   # Lyrics extraction module
```

**Benefits:**
- Each module can be developed, tested, and maintained independently
- Easy to add new features (e.g., add new transcription algorithm)
- Clear module boundaries make codebase navigable

### Loose Coupling

**Frontend-Backend Coupling:**
- **API Contract**: Frontend and backend communicate via REST API contracts
- **No Direct Dependencies**: Frontend doesn't import backend code
- **Environment Configuration**: API URL configurable via `NEXT_PUBLIC_API_URL`
- **Error Handling**: Backend returns standardized error responses; frontend handles generically

**Component Coupling:**
- **State Management**: Components communicate via Zustand store, not direct props drilling
- **Event-Based**: Components react to state changes, not direct calls
- **Interface Contracts**: Components use TypeScript interfaces for type safety

**Example:**
```typescript
// Loose coupling: Components don't know about each other
// They only interact through the store

// Component A updates state
const { setAudioFile } = useAppStore()

// Component B reacts to state change
const { audioFile } = useAppStore()
```

**Backend Module Coupling:**
- **Dependency Injection**: Services initialized separately and passed to endpoints
- **Interface-Based**: Modules communicate via well-defined interfaces (function signatures)
- **No Circular Dependencies**: Clear dependency flow (API → Services → Processing)

### Scalability & Extensibility

**Frontend Scalability:**
- **Component-Based Architecture**: Easy to add new features as new components
- **State Management**: Zustand allows for store splitting as app grows
- **Code Splitting**: Next.js automatically splits code for optimal loading
- **API Abstraction**: Easy to swap API implementations or add caching

**Backend Scalability:**
- **Stateless API**: Each request is independent, supports horizontal scaling
- **Modular Services**: Services can be extracted into microservices if needed
- **Async Processing**: Architecture supports async processing (can add job queues)
- **Database Ready**: Can easily add database layer for storing transcriptions

**Extensibility Points:**

| Feature | Extension Point | How to Add |
|---------|----------------|------------|
| New Transcription Algorithm | `api/transcriber.py` | Add new method or subclass `Transcriber` |
| New Raaga Detection | `api/raaga_detector.py` | Add to `RAAGA_DATABASE` or implement ML model |
| Lyrics Extraction | `api/lyrics_extractor.py` | Integrate speech-to-text API |
| Export Formats | New endpoint | Add `POST /api/export` endpoint |
| User Authentication | Middleware | Add auth middleware to FastAPI |
| Real-time Updates | WebSocket | Add WebSocket endpoint alongside REST |

## System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (Next.js)                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   UI Layer   │  │  State Mgmt  │  │   API Layer  │      │
│  │ Components   │←→│   Zustand    │←→│    Axios     │      │
│  └──────────────┘  └──────────────┘  └──────┬───────┘      │
└──────────────────────────────────────────────┼──────────────┘
                                               │ HTTP REST
                                               ▼
┌─────────────────────────────────────────────────────────────┐
│                     Backend (FastAPI)                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  API Layer   │  │ Business     │  │  Processing  │      │
│  │  Endpoints   │→ │   Logic      │→ │   Services   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow

**Transcription Flow:**
```
1. User uploads file
   ↓
2. Frontend: FileUpload component validates file
   ↓
3. Frontend: Stores file in Zustand store
   ↓
4. User clicks "Transcribe"
   ↓
5. Frontend: Creates FormData, sends POST to /api/transcribe
   ↓
6. Backend: main.py receives request
   ↓
7. Backend: Saves file temporarily
   ↓
8. Backend: AudioProcessor.process_audio() loads and normalizes audio
   ↓
9. Backend: Transcriber.transcribe() extracts pitch and maps to swarams
   ↓
10. Backend: RaagaDetector.detect_raaga() analyzes swaram patterns
   ↓
11. Backend: Returns JSON response with swarams, raaga, lyrics
   ↓
12. Frontend: Updates Zustand store with results
   ↓
13. Frontend: Components re-render with new data
```

### Component Communication

```
┌─────────────┐
│ FileUpload  │──→ sets audioFile ──→ ┌─────────────┐
└─────────────┘                         │   Zustand   │
                                        │    Store    │
┌─────────────┐                         └─────────────┘
│AudioPlayer  │←── reads audioFile ──←
└─────────────┘

┌─────────────┐
│ SwaramDisplay│←── reads transcriptionResult ──← ┌─────────────┐
└─────────────┘                                     │   Zustand   │
                                                     │    Store    │
┌─────────────┐                                      └─────────────┘
│RaagaInfo    │←── reads raagaInfo ────────────────←
└─────────────┘
```

## Technology Stack

### Frontend
- **Framework**: Next.js 14 (React framework with App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS + Shadcn UI
- **State Management**: Zustand
- **Animations**: Framer Motion
- **HTTP Client**: Axios
- **Notifications**: React Hot Toast

### Backend
- **Framework**: FastAPI
- **Language**: Python 3.12+
- **Audio Processing**: Librosa
- **Scientific Computing**: NumPy, SciPy
- **Configuration**: python-dotenv

## Security Considerations

### Current Implementation
- **CORS**: Configured for specific origins (not wildcard)
- **File Validation**: Client and server-side file type validation
- **File Size Limits**: Enforced (50MB max)
- **Error Handling**: Generic error messages to prevent information leakage

### Future Enhancements
- **Authentication**: JWT tokens for API access
- **Rate Limiting**: Prevent abuse of transcription endpoint
- **File Scanning**: Virus scanning for uploaded files
- **Input Sanitization**: Additional validation for all inputs

## Performance Considerations

### Frontend
- **Code Splitting**: Next.js automatic code splitting
- **Image Optimization**: Next.js Image component (when needed)
- **State Optimization**: Zustand minimal re-renders
- **Memoization**: React.memo for expensive components

### Backend
- **Async Processing**: Can be extended for long-running tasks
- **Caching**: Can add Redis for caching transcriptions
- **Connection Pooling**: Database connection pooling (when DB added)
- **Resource Cleanup**: Temporary files cleaned up after processing

## Deployment Architecture

### Development
```
Frontend: localhost:3000/3001/3002
Backend:  localhost:8000
```

### Production (Recommended)
```
Frontend: Vercel/Netlify (CDN)
Backend:  Railway/Render/Fly.io (Container)
Database: PostgreSQL (future)
Storage:  S3/Cloud Storage (for file uploads)
```

## Extension Points

### Adding New Features

**New Transcription Algorithm:**
1. Create new class in `api/transcriber_v2.py`
2. Implement same interface as `Transcriber`
3. Add endpoint parameter to select algorithm
4. Update frontend to support algorithm selection

**New Export Format:**
1. Add endpoint `POST /api/export`
2. Create export service module
3. Add export button to frontend
4. Handle download in browser

**User Authentication:**
1. Add auth middleware to FastAPI
2. Add login/signup endpoints
3. Add auth state to Zustand store
4. Protect routes in frontend

This architecture supports growth from MVP to production-scale application while maintaining code quality and developer experience.

