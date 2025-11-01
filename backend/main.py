from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List, Optional
import uvicorn
import os
import logging
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Import our custom modules
from api.audio_processor import AudioProcessor
from api.transcriber import Transcriber
from api.raaga_detector import RaagaDetector
from api.lyrics_extractor import LyricsExtractor

# Initialize FastAPI app
app = FastAPI(
    title="Sargam API",
    description="Carnatic Music Transcription API",
    version="1.0.0"
)

# Configure CORS for Next.js frontend
# Allow multiple development ports and configure for production via environment variables

# Get allowed origins from environment or use defaults
ALLOWED_ORIGINS_ENV = os.getenv("CORS_ORIGINS", "")

if ALLOWED_ORIGINS_ENV:
    # Parse comma-separated origins from environment variable
    allowed_origins = [origin.strip() for origin in ALLOWED_ORIGINS_ENV.split(",")]
else:
    # Default: Allow common development ports
    allowed_origins = [
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:3002",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
        "http://127.0.0.1:3002",
    ]

logger.info(f"CORS configured for origins: {allowed_origins}")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,  # Allow multiple development ports
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create upload directory if it doesn't exist
UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

# Initialize processors
audio_processor = AudioProcessor()
transcriber = Transcriber()
raaga_detector = RaagaDetector()
lyrics_extractor = LyricsExtractor()


class TranscriptionResponse(BaseModel):
    """Response model for transcription endpoint"""
    swarams: List[dict]
    raaga: Optional[dict] = None
    lyrics: Optional[List[dict]] = None


@app.get("/")
async def root():
    """Health check endpoint"""
    return {"message": "Sargam API is running", "status": "healthy"}


@app.get("/api/health")
async def health_check():
    """Detailed health check endpoint"""
    return {
        "status": "healthy",
        "version": "1.0.0",
        "services": {
            "audio_processor": "ready",
            "transcriber": "ready",
            "raaga_detector": "ready",
            "lyrics_extractor": "ready"
        }
    }


@app.post("/api/transcribe", response_model=TranscriptionResponse)
async def transcribe_audio(
    file: UploadFile = File(...),
    sruti: Optional[float] = None
):
    """
    Main transcription endpoint
    
    Accepts audio file (MP3, WAV, MIDI) and returns:
    - Transcribed swarams with timing
    - Detected raaga information
    - Extracted lyrics (if available)
    
    Args:
        file: Audio file to transcribe
        sruti: Optional tonic frequency (Sa frequency in Hz)
    
    Returns:
        TranscriptionResponse with swarams, raaga, and lyrics
    """
    try:
        file_path = None  # Initialize to avoid scope issues
        
        # Validate file type
        if not file.content_type or not any(
            ext in file.content_type for ext in ['audio', 'midi']
        ):
            # Also check file extension as fallback
            file_ext = Path(file.filename).suffix.lower()
            if file_ext not in ['.mp3', '.wav', '.mid', '.midi']:
                raise HTTPException(
                    status_code=400,
                    detail="Invalid file type. Please upload MP3, WAV, or MIDI file."
                )
        
        logger.info(f"Received file: {file.filename}, content_type: {file.content_type}")
        
        # Save uploaded file temporarily
        file_path = UPLOAD_DIR / file.filename
        logger.info(f"Saving file to: {file_path}")
        
        with open(file_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
        
        logger.info(f"File saved successfully. Size: {len(content)} bytes")
        
        # Process audio file
        logger.info("Processing audio file...")
        audio_array, sample_rate = audio_processor.process_audio(str(file_path))
        logger.info(f"Audio processed. Sample rate: {sample_rate}, Length: {len(audio_array)} samples")
        
        # Transcribe audio to swarams
        logger.info("Transcribing audio to swarams...")
        swarams = transcriber.transcribe(audio_array, sample_rate, sruti=sruti)
        logger.info(f"Transcription complete. Found {len(swarams)} swarams")
        
        # Check if transcription returned results
        if len(swarams) == 0:
            logger.warning("No swarams detected in audio. This might be silence, noise, or an issue with pitch detection.")
            # Return empty result instead of error - user can see that no swarams were found
            return TranscriptionResponse(
                swarams=[],
                raaga=None,
                lyrics=None
            )
        
        # Detect raaga
        logger.info("Detecting raaga...")
        raaga_info = raaga_detector.detect_raaga(swarams)
        if raaga_info:
            logger.info(f"Raaga detected: {raaga_info.get('name')}")
        else:
            logger.info("No raaga detected")
        
        # Extract lyrics (if available)
        logger.info("Extracting lyrics...")
        lyrics = lyrics_extractor.extract_lyrics(str(file_path))
        
        # Clean up temporary file
        if file_path.exists():
            file_path.unlink()
            logger.info("Temporary file cleaned up")
        
        logger.info("Transcription completed successfully")
        
        return TranscriptionResponse(
            swarams=swarams,
            raaga=raaga_info,
            lyrics=lyrics
        )
        
    except Exception as e:
        # Clean up file on error
        if 'file_path' in locals() and file_path.exists():
            file_path.unlink()
        
        # Log the full error for debugging
        import traceback
        error_trace = traceback.format_exc()
        print(f"Transcription error: {str(e)}")
        print(f"Traceback: {error_trace}")
        
        raise HTTPException(
            status_code=500,
            detail=f"Transcription failed: {str(e)}"
        )


if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )

