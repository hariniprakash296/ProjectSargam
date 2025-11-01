import librosa
import numpy as np
from pathlib import Path
import soundfile as sf
from typing import Tuple, Optional

class AudioProcessor:
    """
    Audio processing utility class
    Handles audio loading, preprocessing, and format conversion
    """
    
    # Target sample rate for consistent processing
    TARGET_SAMPLE_RATE = 44100
    
    # Maximum duration for MVP (5 minutes)
    MAX_DURATION = 300  # seconds
    
    def process_audio(self, file_path: str) -> Tuple[np.ndarray, int]:
        """
        Process audio file for transcription
        
        Converts to mono, resamples to target rate, and validates duration
        
        Args:
            file_path: Path to audio file
        
        Returns:
            Tuple of (audio_array, sample_rate)
        """
        try:
            # Load audio file
            # librosa automatically converts to mono and resamples
            audio, sr = librosa.load(
                file_path,
                sr=self.TARGET_SAMPLE_RATE,
                mono=True,
                duration=self.MAX_DURATION  # Limit to 5 minutes for MVP
            )
            
            # Validate audio duration
            duration = len(audio) / sr
            if duration > self.MAX_DURATION:
                raise ValueError(f"Audio duration ({duration}s) exceeds maximum ({self.MAX_DURATION}s)")
            
            if duration < 0.5:
                raise ValueError("Audio file is too short (minimum 0.5 seconds)")
            
            # Normalize audio to prevent clipping
            audio = librosa.util.normalize(audio)
            
            return audio, sr
            
        except Exception as e:
            raise Exception(f"Failed to process audio: {str(e)}")
    
    def convert_to_wav(self, input_path: str, output_path: str) -> str:
        """
        Convert audio file to WAV format
        
        Useful for ensuring compatibility with processing libraries
        
        Args:
            input_path: Input audio file path
            output_path: Output WAV file path
        
        Returns:
            Path to converted WAV file
        """
        try:
            audio, sr = librosa.load(input_path, sr=self.TARGET_SAMPLE_RATE, mono=True)
            sf.write(output_path, audio, sr)
            return output_path
        except Exception as e:
            raise Exception(f"Failed to convert audio: {str(e)}")

