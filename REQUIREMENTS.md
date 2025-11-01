# Requirements Documentation

## Functional Requirements

### FR1: Audio File Upload
**Description:** Users must be able to upload audio files for transcription.

**Acceptance Criteria:**
- Support drag-and-drop and click-to-upload
- Accept MP3, WAV, MIDI file formats
- Validate file size (max 50MB)
- Validate file duration (max 5 minutes)
- Display file information after upload
- Allow file removal before transcription

**Priority:** High

---

### FR2: Audio Transcription
**Description:** System must transcribe audio files to Carnatic swaram notation.

**Acceptance Criteria:**
- Extract fundamental frequency (pitch) from audio
- Map frequencies to Carnatic swarams (Sa, Ri1, Ri2, Ga2, Ga3, Ma1, Ma2, Pa, Da1, Da2, Ni2, Ni3)
- Classify octaves (Mandra, Madhya, Tara)
- Detect gamakam (ornamentation) types
- Calculate timing for each swaram
- Provide confidence scores
- Return results within 5 seconds for 30s clips, 60 seconds for 5min clips

**Priority:** High

---

### FR3: Raaga Detection
**Description:** System must detect Carnatic/Hindustani raaga from transcribed swarams.

**Acceptance Criteria:**
- Compare swaram patterns with known raagas
- Calculate confidence scores
- Return raaga name, type (Carnatic/Hindustani)
- Display arohana (ascending) and avarohana (descending) scales
- Show raaga characteristics

**Priority:** High

---

### FR4: Audio Playback
**Description:** Users must be able to play uploaded audio with synchronized display.

**Acceptance Criteria:**
- Play/pause controls
- Progress bar with seek functionality
- Skip forward/backward (5 seconds)
- Display current time and total duration
- Synchronize swaram highlighting with playback
- Synchronize lyrics highlighting with playback

**Priority:** High

---

### FR5: Results Display
**Description:** System must display transcription results in an organized manner.

**Acceptance Criteria:**
- Display swarams in grid layout
- Show timing, octave, gamakam, confidence for each swaram
- Highlight current swaram during playback
- Display raaga information prominently
- Show lyrics if available
- Scroll to current swaram automatically

**Priority:** High

---

### FR6: Lyrics Display (Future)
**Description:** System should display lyrics synchronized with audio playback.

**Acceptance Criteria:**
- Extract lyrics from audio files (speech-to-text)
- Display lyrics with timing information
- Highlight current lyrics during playback
- Support multiple languages (future)

**Priority:** Medium

---

## Non-Functional Requirements

### NFR1: Performance
**Description:** System must perform efficiently.

**Requirements:**
- Transcription latency: < 5 seconds for 30s audio, < 60s for 5min audio
- Frontend load time: < 3 seconds
- API response time: < 100ms for health check
- Support concurrent users: 10+ (MVP), 100+ (production)

**Priority:** High

---

### NFR2: Reliability
**Description:** System must be reliable and handle errors gracefully.

**Requirements:**
- Uptime: 99%+ (production)
- Error rate: < 1%
- Graceful error handling
- Automatic retry for transient failures (future)
- Data recovery capabilities (future)

**Priority:** High

---

### NFR3: Usability
**Description:** System must be easy to use.

**Requirements:**
- Intuitive user interface
- Clear error messages
- Responsive design (desktop-first, mobile-friendly)
- Accessibility: WCAG 2.1 AA compliance (future)
- Browser support: Chrome, Firefox, Safari, Edge (latest versions)

**Priority:** High

---

### NFR4: Security
**Description:** System must be secure.

**Requirements:**
- File type validation (client and server-side)
- File size limits enforced
- CORS configured for specific origins
- Input sanitization
- No sensitive data in logs
- HTTPS in production
- Authentication (future)
- Rate limiting (future)

**Priority:** High

---

### NFR5: Scalability
**Description:** System must scale to handle growth.

**Requirements:**
- Horizontal scaling capability
- Stateless API design
- Modular architecture
- Database-ready (future)
- Caching support (future)
- CDN support (future)

**Priority:** Medium

---

### NFR6: Maintainability
**Description:** System must be maintainable.

**Requirements:**
- Code documentation
- Clear architecture
- Modular design
- Test coverage (future)
- CI/CD pipeline (future)
- Monitoring and logging

**Priority:** Medium

---

### NFR7: Compatibility
**Description:** System must work across platforms.

**Requirements:**
- Windows, macOS, Linux support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Python 3.12+ support
- Node.js 18+ support

**Priority:** High

---

## Technical Requirements

### TR1: Frontend Stack
- Next.js 14+ with App Router
- TypeScript for type safety
- TailwindCSS for styling
- Shadcn UI component library
- Zustand for state management
- Framer Motion for animations

### TR2: Backend Stack
- FastAPI framework
- Python 3.12+
- Librosa for audio processing
- NumPy/SciPy for numerical computations
- RESTful API design

### TR3: Infrastructure
- Containerization support (Docker)
- Environment-based configuration
- Logging infrastructure
- Error tracking (future)

---

## Business Requirements

### BR1: MVP Scope
- Audio transcription to swaram notation
- Raaga detection
- Basic UI with file upload and playback
- Desktop-first design

### BR2: Future Enhancements
- Lyrics extraction
- Export functionality (MIDI, PDF)
- User authentication
- Save/load transcriptions
- Collaborative features
- Mobile app

---

## Constraints

### C1: File Size
- Maximum file size: 50MB
- Maximum duration: 5 minutes (MVP)

### C2: Performance
- Single-threaded processing (MVP)
- No background job processing (MVP)

### C3: Storage
- No persistent storage (MVP)
- Temporary files only

### C4: Browser Support
- Modern browsers only (no IE11)
- JavaScript required

---

## Success Criteria

### MVP Success Metrics
- [ ] Successfully transcribe 80%+ of test audio files
- [ ] Raaga detection accuracy: 70%+ for known raagas
- [ ] User satisfaction: 4+ stars (out of 5)
- [ ] Error rate: < 5%
- [ ] Average transcription time: < 30 seconds

### Production Success Metrics
- [ ] Successfully transcribe 90%+ of audio files
- [ ] Raaga detection accuracy: 85%+
- [ ] User satisfaction: 4.5+ stars
- [ ] Error rate: < 1%
- [ ] Uptime: 99%+
- [ ] Support 100+ concurrent users

---

**Last Updated:** 2025-11-01  
**Version:** 1.0.0

