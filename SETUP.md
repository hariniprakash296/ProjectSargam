# 🎼 Sargam - Carnatic Music Transcriber

A beautiful web application for transcribing Carnatic and Hindustani music to swaram notation with raaga recognition.

## Features

- 🎵 **Audio Transcription**: Upload MP3, WAV, or MIDI files and get transcribed swaram notation
- 🎶 **Raaga Recognition**: Automatically detect Carnatic/Hindustani raaga from transcribed swarams
- 📝 **Lyrics Display**: View synchronized lyrics (when available)
- 🎹 **Interactive Playback**: Play audio with synchronized swaram highlighting
- ✨ **Beautiful UI**: Modern, animated interface with smooth transitions
- 🎨 **Yellow/Orange Theme**: Warm color scheme designed for music exploration

## Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **TailwindCSS** - Utility-first styling
- **Shadcn UI** - Beautiful component library
- **Framer Motion** - Smooth animations and transitions
- **Zustand** - State management
- **React Dropzone** - File upload handling

### Backend
- **FastAPI** - Modern Python web framework
- **Librosa** - Audio processing and pitch detection
- **NumPy** - Numerical computations
- **Custom Algorithms** - Carnatic-specific pitch mapping and raaga detection

## Setup Instructions

### Prerequisites

- Node.js 18+ and npm/yarn
- Python 3.9+
- pip (Python package manager)

### Frontend Setup

1. Install dependencies:
```bash
npm install
# or
yarn install
```

2. Create environment file (optional):
```bash
cp .env.example .env.local
```

3. Start development server:
```bash
npm run dev
# or
yarn dev
```

The frontend will be available at `http://localhost:3000`

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Create virtual environment (recommended):
```bash
python -m venv venv

# On Windows
venv\Scripts\activate

# On macOS/Linux
source venv/bin/activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create uploads directory:
```bash
mkdir uploads
```

5. Start FastAPI server:
```bash
python main.py
# or
uvicorn main:app --reload
```

The backend API will be available at `http://localhost:8000`

### API Documentation

Once the backend is running, visit:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Project Structure

```
ProjectSargam/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Main page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ui/               # Shadcn UI components
│   ├── file-upload.tsx   # File upload component
│   ├── audio-player.tsx  # Audio playback controls
│   ├── swaram-display.tsx # Swaram notation display
│   ├── raaga-info.tsx    # Raaga information display
│   └── lyrics-display.tsx # Lyrics display
├── lib/                   # Utility functions
│   └── utils.ts          # Helper functions
├── store/                 # State management
│   └── app-store.ts      # Zustand store
├── backend/              # FastAPI backend
│   ├── main.py          # FastAPI app entry point
│   ├── api/             # API modules
│   │   ├── audio_processor.py
│   │   ├── transcriber.py
│   │   ├── raaga_detector.py
│   │   └── lyrics_extractor.py
│   └── requirements.txt
└── README.md
```

## Usage

1. **Upload Audio**: Drag and drop or click to select an MP3, WAV, or MIDI file
2. **Transcribe**: Click the "Transcribe Audio" button
3. **View Results**: 
   - See transcribed swarams with timing information
   - View detected raaga with arohana/avarohana
   - Read synchronized lyrics (if available)
4. **Playback**: Use the audio player to play the file and see synchronized swaram highlighting

## API Endpoints

### `POST /api/transcribe`
Transcribes audio file to swaram notation.

**Request:**
- `file`: Audio file (MP3, WAV, MIDI)
- `sruti` (optional): Tonic frequency in Hz

**Response:**
```json
{
  "swarams": [
    {
      "start": 0.0,
      "end": 0.5,
      "swaram": "Sa",
      "octave": "Madhya",
      "gamakam": "kampitam",
      "confidence": 0.95
    }
  ],
  "raaga": {
    "name": "Mayamalavagowla",
    "type": "Carnatic",
    "confidence": 0.85,
    "arohana": ["Sa", "Ri1", "Ga3", "Ma1", "Pa", "Da1", "Ni3", "Sa"],
    "avarohana": ["Sa", "Ni3", "Da1", "Pa", "Ma1", "Ga3", "Ri1", "Sa"]
  },
  "lyrics": null
}
```

### `GET /api/health`
Health check endpoint.

## Development

### Frontend Development
- Components are modular and reusable
- State is managed centrally with Zustand
- Animations use Framer Motion for smooth transitions
- UI follows Shadcn UI patterns

### Backend Development
- Audio processing uses librosa for pitch detection
- Custom algorithms map frequencies to Carnatic swarams
- Raaga detection uses pattern matching against known raagas
- All processing is synchronous for MVP (can be async for production)

## Future Enhancements

- [ ] Real-time transcription with WebSocket support
- [ ] Advanced lyrics extraction with speech-to-text
- [ ] Export functionality (MIDI, PDF notation)
- [ ] User-adjustable sruti detection
- [ ] Expanded raaga database
- [ ] Gamakam visualization
- [ ] Tala (rhythm) detection
- [ ] Sharing and collaboration features

## License

MIT License

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

