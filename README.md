# 🎼 Sargam - Carnatic Music Transcriber

A beautiful web application for transcribing Carnatic and Hindustani music to swaram notation with raaga recognition.

## 📚 Documentation Layers

This repository follows a layered documentation approach:

### Business Layer
**Why the system exists**
- [PRD.md](./PRD.md) - Product Requirements Document
- [Requirements.md](./REQUIREMENTS.md) - Functional and non-functional requirements

### Architecture Layer
**How the system is designed**
- [ARCHITECTURE.md](./ARCHITECTURE.md) - System architecture, design principles (DRY, SoC, SRP, Modularity)
- [API_REFERENCE.md](./API_REFERENCE.md) - API endpoints, request/response formats

### Implementation Layer
**How the code works**
- [SETUP.md](./SETUP.md) - Setup and installation guide
- [TECHNICAL_FLOW.md](./TECHNICAL_FLOW.md) - Detailed technical flow documentation
- Code comments and inline documentation

### Maintenance Layer
**How to run, debug, and improve**
- [CONTRIBUTING.md](./CONTRIBUTING.md) - How to contribute code
- [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) - Common issues and solutions
- [ERROR_HANDLING.md](./ERROR_HANDLING.md) - Error handling standards
- [SECURITY.md](./SECURITY.md) - Security practices and guidelines
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Deployment procedures

## ✨ Features

- 🎵 **Audio Transcription**: Upload MP3, WAV, or MIDI files and get transcribed swaram notation
- 🎶 **Raaga Recognition**: Automatically detect Carnatic/Hindustani raaga from transcribed swarams
- 📝 **Lyrics Display**: View synchronized lyrics (when available)
- 🎹 **Interactive Playback**: Play audio with synchronized swaram highlighting
- ✨ **Beautiful UI**: Modern, animated interface with smooth transitions
- 🎨 **Yellow/Orange Theme**: Warm color scheme designed for music exploration

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm/yarn
- Python 3.12+
- pip (Python package manager)

### Frontend Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will be available at `http://localhost:3000` (or 3001, 3002 if ports are in use)

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create uploads directory
mkdir uploads

# Start FastAPI server
python main.py
```

Backend API will be available at `http://localhost:8000`

### API Documentation

Once the backend is running, visit:
- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

## 📖 Usage

1. **Upload Audio**: Drag and drop or click to select an MP3, WAV, or MIDI file
2. **Transcribe**: Click the "Transcribe Audio" button
3. **View Results**: 
   - See transcribed swarams with timing information
   - View detected raaga with arohana/avarohana
   - Read synchronized lyrics (if available)
4. **Playback**: Use the audio player to play the file and see synchronized swaram highlighting

## 🛠️ Tech Stack

**Frontend**: Next.js 14, TypeScript, TailwindCSS, Shadcn UI, Framer Motion, Zustand  
**Backend**: FastAPI, Python, Librosa, NumPy, SciPy

## 📁 Project Structure

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
└── docs/                 # Documentation
    ├── ARCHITECTURE.md
    ├── API_REFERENCE.md
    ├── CONTRIBUTING.md
    ├── ERROR_HANDLING.md
    ├── SECURITY.md
    └── TROUBLESHOOTING.md
```

## 🔗 API Endpoints

- `POST /api/transcribe` - Transcribe audio to swaram notation
- `GET /api/health` - Health check
- `GET /docs` - API documentation (Swagger UI)

See [API_REFERENCE.md](./API_REFERENCE.md) for detailed API documentation.

## 🐛 Troubleshooting

Common issues and solutions are documented in [TROUBLESHOOTING.md](./TROUBLESHOOTING.md).

Quick fixes:
- **CORS errors**: Check `backend/CORS_CONFIG.md`
- **Installation issues**: See `backend/INSTALLATION_GUIDE.md`
- **Transcription fails**: Check audio quality and format

## 🤝 Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines on:
- Code style and conventions
- Branch naming
- Commit messages
- Pull request process

## 📝 License

MIT License

## 🔒 Security

See [SECURITY.md](./SECURITY.md) for security practices and guidelines.

## 📊 Architecture

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed architecture documentation including:
- Design principles (DRY, SoC, SRP, Modularity)
- System architecture
- Component communication
- Extension points

## 📞 Support

- **Documentation**: Check `/docs` directory
- **Issues**: GitHub Issues
- **Questions**: Open a discussion

---

**Built with ❤️ for Carnatic music enthusiasts**
