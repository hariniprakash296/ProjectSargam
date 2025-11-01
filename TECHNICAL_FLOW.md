# Technical Flow Documentation

## Data Flow Overview

This document explains the complete technical flow of the Sargam application, from audio upload to transcription display.

## Architecture Overview

```
User Upload → Frontend (Next.js) → Backend API (FastAPI) → Audio Processing → Transcription → Results Display
```

## Detailed Technical Flow

### 1. Frontend: File Upload (`components/file-upload.tsx`)

**Process:**
1. User drags/drops or selects audio file (MP3, WAV, MIDI)
2. `react-dropzone` handles file validation
3. File is validated for:
   - File type (MP3, WAV, MIDI)
   - File size (max 50MB)
4. File object stored in Zustand store (`useAppStore`)
5. Object URL created for audio preview
6. UI updates with file info and upload progress

**Key Technologies:**
- `react-dropzone`: File upload handling
- `Zustand`: State management
- `Framer Motion`: Smooth animations

### 2. Frontend: Transcription Request (`app/page.tsx`)

**Process:**
1. User clicks "Transcribe Audio" button
2. `handleTranscribe` function executes
3. Creates `FormData` with audio file
4. Sends POST request to `/api/transcribe` endpoint
5. Updates progress state during upload
6. Receives response with transcription results
7. Updates Zustand store with:
   - `transcriptionResult`: Array of swaram notes
   - `raagaInfo`: Detected raaga information
   - `lyrics`: Extracted lyrics (if available)

**Key Technologies:**
- `axios`: HTTP client for API requests
- `react-hot-toast`: User feedback notifications

### 3. Backend: Audio Processing (`backend/api/audio_processor.py`)

**Process:**
1. Receives uploaded file path
2. Uses `librosa.load()` to:
   - Load audio file
   - Convert to mono (single channel)
   - Resample to 44.1kHz (target sample rate)
   - Limit duration to 5 minutes (MVP constraint)
3. Normalizes audio to prevent clipping
4. Returns audio array and sample rate

**Key Functions:**
- `process_audio()`: Main processing function
- `convert_to_wav()`: Format conversion utility

**Technical Details:**
- Sample rate: 44.1kHz (CD quality)
- Mono conversion: Ensures consistent pitch detection
- Duration limit: 300 seconds (5 minutes) for MVP

### 4. Backend: Pitch Detection (`backend/api/transcriber.py`)

**Process:**
1. Receives processed audio array and sample rate
2. Uses `librosa.pyin()` (Probabilistic YIN algorithm) to extract:
   - Fundamental frequency (F0) contour
   - Voiced/unvoiced probability
   - Frame-by-frame pitch values
3. Configures pitch detection with:
   - Frequency range: C2 (65Hz) to C7 (2093Hz)
   - Frame length: 2048 samples
   - Hop length: 512 samples
4. Converts frame indices to time positions

**Key Functions:**
- `transcribe()`: Main transcription method
- `_frequency_to_swaram()`: Maps frequency to swaram
- `_detect_gamakam()`: Detects ornamentation

**Technical Details:**
- Pitch detection algorithm: Probabilistic YIN (pyin)
- Frame analysis: Overlapping windows for smooth detection
- Time resolution: ~11.6ms per frame (512/44100 seconds)

### 5. Backend: Swaram Mapping (`backend/api/transcriber.py`)

**Process:**
1. For each detected pitch:
   - Calculates swaram frequencies using Carnatic ratios
   - Maps frequency to nearest swaram using cent-based matching
   - Classifies octave (Mandra/Madhya/Tara) based on frequency range
2. Groups consecutive identical swarams
3. Calculates timing (start/end) for each swaram
4. Detects gamakam (ornamentation) from pitch contour oscillations
5. Calculates confidence scores from voiced probability

**Key Functions:**
- `_calculate_swaram_frequencies()`: Generates frequency map
- `_frequency_to_swaram()`: Finds nearest swaram match
- `_detect_gamakam()`: Analyzes pitch oscillations

**Technical Details:**
- Swaram system: 12-tone Carnatic system (Sa, Ri1, Ri2, Ga2, Ga3, Ma1, Ma2, Pa, Da1, Da2, Ni2, Ni3)
- Frequency ratios: Based on just intonation (natural harmonics)
- Tolerance: ±10 cents (musical cent = 1/1200 octave)
- Octave classification:
  - Mandra: 80-220 Hz (lower octave)
  - Madhya: 220-440 Hz (middle octave)
  - Tara: 440-880 Hz (upper octave)

### 6. Backend: Raaga Detection (`backend/api/raaga_detector.py`)

**Process:**
1. Receives transcribed swaram sequence
2. Extracts unique swarams used
3. Compares against raaga database:
   - Checks swaram overlap (which swarams are used)
   - Matches ascending pattern (arohana)
   - Matches descending pattern (avarohana)
4. Calculates confidence score:
   - 60% weight on swaram overlap
   - 40% weight on pattern matching
5. Returns best match if confidence > 30%

**Key Functions:**
- `detect_raaga()`: Main detection method
- `_check_pattern_match()`: Pattern matching algorithm

**Technical Details:**
- Raaga database: Pre-defined set of common raagas
- Pattern matching: Longest common subsequence algorithm
- Confidence threshold: 30% minimum for detection

### 7. Backend: Lyrics Extraction (`backend/api/lyrics_extractor.py`)

**Process:**
1. Receives audio file path
2. Checks file type (MIDI vs audio)
3. For MIDI: Could extract lyrics from metadata
4. For audio: Placeholder for future speech-to-text integration
5. Returns None for MVP (can be extended)

**Future Enhancements:**
- Google Speech-to-Text API integration
- Whisper AI for transcription
- MIDI lyrics track parsing

### 8. Backend: Response Formation (`backend/main.py`)

**Process:**
1. Combines all results:
   - Swaram notes array
   - Raaga information (if detected)
   - Lyrics array (if available)
2. Formats as JSON response
3. Cleans up temporary uploaded file
4. Returns `TranscriptionResponse` object

**Response Structure:**
```json
{
  "swarams": [...],
  "raaga": {...},
  "lyrics": [...]
}
```

### 9. Frontend: Result Display

#### Swaram Display (`components/swaram-display.tsx`)
- Receives `transcriptionResult` from store
- Renders grid of swaram cards
- Synchronizes with playback time
- Highlights current swaram during playback
- Shows timing, octave, gamakam, and confidence

#### Raaga Info (`components/raaga-info.tsx`)
- Displays detected raaga name and type
- Shows arohana (ascending) and avarohana (descending) scales
- Displays confidence score
- Shows raaga characteristics

#### Lyrics Display (`components/lyrics-display.tsx`)
- Shows synchronized lyrics
- Highlights current lyrics during playback
- Displays timing information

#### Audio Player (`components/audio-player.tsx`)
- Provides playback controls
- Updates current time in store
- Synchronizes with transcription display
- Shows progress bar with seek functionality

### 10. State Management Flow

**Zustand Store (`store/app-store.ts`):**
- Centralized state management
- Stores:
  - Audio file and URL
  - Transcription results
  - Raaga information
  - Lyrics data
  - Playback state
- Provides actions for state updates
- Ensures reactive UI updates

## Key Algorithms

### Pitch Detection
- **Algorithm**: Probabilistic YIN (pyin)
- **Why**: Robust to noise, works well with monophonic audio
- **Output**: Fundamental frequency (F0) contour over time

### Swaram Mapping
- **Method**: Cent-based frequency matching
- **Why**: Accurate musical interval detection
- **Tolerance**: ±10 cents (allows for slight pitch variations)

### Gamakam Detection
- **Method**: Pitch oscillation analysis
- **Metrics**:
  - Standard deviation of pitch
  - Zero crossings (oscillation count)
- **Classification**: kampitam (vibrato), janta (repeated notes)

### Raaga Detection
- **Method**: Pattern matching + swaram overlap
- **Why**: Leverages known raaga structures
- **Scoring**: Weighted combination of pattern and swaram match

## Performance Considerations

### Frontend
- Virtual scrolling for large swaram lists
- Debounced state updates
- Lazy loading of components
- Optimized re-renders with React.memo

### Backend
- Efficient audio processing (librosa optimized)
- Temporary file cleanup
- Error handling and recovery
- Progress tracking (can be extended with WebSocket)

## Error Handling

### Frontend
- File validation before upload
- API error handling with user-friendly messages
- Toast notifications for feedback
- Graceful degradation

### Backend
- File type validation
- Audio processing error handling
- Timeout handling for long files
- Cleanup of temporary files on error

## Future Enhancements

1. **Real-time Processing**: WebSocket support for progressive transcription
2. **Advanced Lyrics**: Speech-to-text integration
3. **Export**: MIDI/PDF export functionality
4. **Tala Detection**: Rhythm pattern recognition
5. **Visualization**: Pitch contour visualization
6. **User Adjustments**: Manual sruti adjustment
7. **Expanded Database**: More raaga patterns

