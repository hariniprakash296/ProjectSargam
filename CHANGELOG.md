# CHANGELOG

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-11-01

### Added
- Initial release of Sargam Carnatic Music Transcriber
- Audio file upload with drag-and-drop support
- Audio transcription to Carnatic swaram notation
- Raaga detection from transcribed swarams
- Audio playback with synchronized swaram highlighting
- Beautiful UI with animations using Framer Motion
- CORS configuration for multiple development ports
- Comprehensive error handling and logging
- API documentation (Swagger UI)
- Health check endpoint

### Architecture
- Next.js 14 frontend with TypeScript
- FastAPI backend with Python
- Zustand for state management
- Shadcn UI component library
- Librosa for audio processing
- Modular architecture following DRY, SoC, SRP principles

### Documentation
- README.md with quick start guide
- ARCHITECTURE.md with system design
- API_REFERENCE.md with endpoint documentation
- CONTRIBUTING.md with contribution guidelines
- ERROR_HANDLING.md with error handling standards
- TROUBLESHOOTING.md with common issues
- SECURITY.md with security practices
- REQUIREMENTS.md with functional and non-functional requirements
- TECHNICAL_FLOW.md with detailed technical flow
- SETUP.md with setup instructions

### Features
- Support for MP3, WAV, MIDI file formats
- File size validation (max 50MB)
- File duration validation (max 5 minutes)
- Pitch detection using Probabilistic YIN algorithm
- Swaram mapping to 12-tone Carnatic system
- Octave classification (Mandra, Madhya, Tara)
- Gamakam detection (kampitam, janta)
- Confidence scoring for swarams
- Raaga database with 6+ common raagas
- Pattern matching for raaga detection
- Yellow/orange color theme

### Fixed
- CORS configuration for multiple ports (3000, 3001, 3002)
- Python 3.12 compatibility (numpy version update)
- File upload error handling
- Audio URL cleanup in file removal
- Empty transcription result handling

### Security
- File type validation (client and server-side)
- File size limits
- CORS origin restrictions
- Generic error messages
- Temporary file cleanup

### Known Issues
- Lyrics extraction not yet implemented (placeholder)
- No user authentication
- No rate limiting
- No persistent storage
- Limited raaga database (6 raagas)

---

## [Unreleased]

### Planned
- Lyrics extraction using speech-to-text
- Export functionality (MIDI, PDF)
- User authentication and authorization
- Rate limiting
- Background job processing for long audio files
- Expanded raaga database
- Tala (rhythm) detection
- Waveform visualization
- User-adjustable sruti detection
- Save/load transcriptions
- Collaborative features
- Mobile app

---

**Legend:**
- `Added` - New features
- `Changed` - Changes in existing functionality
- `Deprecated` - Soon-to-be removed features
- `Removed` - Removed features
- `Fixed` - Bug fixes
- `Security` - Security improvements

