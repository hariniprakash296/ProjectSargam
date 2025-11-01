import librosa
import numpy as np
from typing import List, Dict, Optional, Tuple
import math

class Transcriber:
    """
    Transcribes audio to Carnatic swaram notation
    
    Uses pitch detection and maps frequencies to swarams
    with octave classification and gamakam detection
    """
    
    # Standard Carnatic swarams
    SWARAMS = ["Sa", "Ri1", "Ri2", "Ga2", "Ga3", "Ma1", "Ma2", "Pa", "Da1", "Da2", "Ni2", "Ni3"]
    
    # Octave frequency ranges (in Hz) for classification
    # Based on typical Carnatic vocal range
    OCTAVE_RANGES = {
        "Mandra": (80, 220),   # Lower octave
        "Madhya": (220, 440),  # Middle octave
        "Tara": (440, 880)     # Upper octave
    }
    
    def __init__(self):
        """Initialize transcriber with default settings"""
        # Default sruti (Sa frequency) - can be adjusted
        self.default_sruti = 131.0  # Hz
        
        # Frequency tolerance for swaram matching (±10 cents)
        self.tolerance_cents = 10
        
        # Window size for pitch detection smoothing
        self.hop_length = 512
        
        # Frame length for pitch detection
        self.frame_length = 2048
    
    def _cents_to_ratio(self, cents: float) -> float:
        """
        Convert cents to frequency ratio
        
        Args:
            cents: Value in cents
        
        Returns:
            Frequency ratio
        """
        return 2 ** (cents / 1200)
    
    def _calculate_swaram_frequencies(self, sruti: float) -> Dict[str, List[float]]:
        """
        Calculate frequency mappings for all swarams across octaves
        
        Uses standard Carnatic frequency ratios (just intonation)
        
        Args:
            sruti: Tonic frequency (Sa) in Hz
        
        Returns:
            Dictionary mapping swaram names to frequencies in each octave
        """
        # Standard Carnatic frequency ratios (in cents from Sa)
        ratios = {
            "Sa": 0,      # Tonic
            "Ri1": 112,   # Shuddha Rishabha
            "Ri2": 204,   # Chatushruti Rishabha
            "Ga2": 316,   # Sadharana Gandhara
            "Ga3": 386,   # Antara Gandhara
            "Ma1": 498,   # Shuddha Madhyama
            "Ma2": 590,   # Prati Madhyama
            "Pa": 702,    # Panchama
            "Da1": 814,   # Shuddha Dhaivata
            "Da2": 906,   # Chatushruti Dhaivata
            "Ni2": 1018,  # Kaishiki Nishada
            "Ni3": 1088,  # Kakali Nishada
        }
        
        swaram_freqs = {}
        
        # Calculate frequencies for each octave
        for octave_multiplier in [0.5, 1.0, 2.0]:  # Mandra, Madhya, Tara
            for swaram, cents in ratios.items():
                if swaram not in swaram_freqs:
                    swaram_freqs[swaram] = []
                
                freq = sruti * octave_multiplier * self._cents_to_ratio(cents)
                swaram_freqs[swaram].append(freq)
        
        return swaram_freqs
    
    def _frequency_to_swaram(self, freq: float, sruti: float) -> Tuple[str, str]:
        """
        Map frequency to nearest swaram and octave
        
        Args:
            freq: Frequency in Hz
            sruti: Tonic frequency (Sa) in Hz
        
        Returns:
            Tuple of (swaram_name, octave_name)
        """
        if np.isnan(freq) or freq <= 0:
            return None, None
        
        swaram_freqs = self._calculate_swaram_frequencies(sruti)
        
        min_distance = float('inf')
        best_swaram = None
        best_octave = None
        
        # Check each octave
        octave_map = {
            0: "Mandra",
            1: "Madhya",
            2: "Tara"
        }
        
        for swaram, freqs in swaram_freqs.items():
            for octave_idx, swaram_freq in enumerate(freqs):
                # Calculate distance in cents
                if swaram_freq > 0:
                    cents_diff = 1200 * math.log2(freq / swaram_freq)
                    
                    if abs(cents_diff) <= self.tolerance_cents:
                        distance = abs(cents_diff)
                        if distance < min_distance:
                            min_distance = distance
                            best_swaram = swaram
                            best_octave = octave_map[octave_idx]
        
        return best_swaram, best_octave
    
    def _detect_gamakam(self, pitch_contour: np.ndarray) -> Optional[str]:
        """
        Detect gamakam (ornamentation) from pitch contour
        
        Analyzes pitch oscillation patterns to identify ornamentation types
        
        Args:
            pitch_contour: Array of pitch values over time
        
        Returns:
            Gamakam type string or None
        """
        if len(pitch_contour) < 3:
            return None
        
        # Remove NaN values
        valid_pitches = pitch_contour[~np.isnan(pitch_contour)]
        if len(valid_pitches) < 3:
            return None
        
        # Calculate pitch variation
        pitch_std = np.std(valid_pitches)
        pitch_mean = np.mean(valid_pitches)
        
        # Calculate oscillation count (zero crossings of detrended signal)
        detrended = valid_pitches - np.mean(valid_pitches)
        zero_crossings = np.sum(np.diff(np.sign(detrended)) != 0)
        
        # Threshold-based classification
        if pitch_std / pitch_mean > 0.05:  # Significant variation
            if zero_crossings > len(valid_pitches) * 0.3:  # Many oscillations
                return "kampitam"  # Vibrato-like ornamentation
            elif zero_crossings > len(valid_pitches) * 0.15:
                return "janta"  # Repeated note pattern
        
        return None
    
    def transcribe(
        self, 
        audio: np.ndarray, 
        sample_rate: int,
        sruti: Optional[float] = None
    ) -> List[Dict]:
        """
        Transcribe audio to swaram notation
        
        Main transcription method that:
        1. Extracts pitch contour
        2. Maps pitches to swarams
        3. Groups consecutive notes
        4. Detects gamakam
        5. Calculates timing and confidence
        
        Args:
            audio: Audio signal array
            sample_rate: Sample rate of audio
            sruti: Optional tonic frequency (Sa)
        
        Returns:
            List of swaram dictionaries with timing and metadata
        """
        if sruti is None:
            sruti = self.default_sruti
        
        # Extract fundamental frequency (F0) using probabilistic YIN algorithm
        f0, voiced_flag, voiced_prob = librosa.pyin(
            audio,
            fmin=librosa.note_to_hz("C2"),  # ~65 Hz
            fmax=librosa.note_to_hz("C7"),  # ~2093 Hz
            sr=sample_rate,
            frame_length=self.frame_length,
            hop_length=self.hop_length
        )
        
        # Check if we got any valid pitch data
        if len(f0) == 0 or np.all(np.isnan(f0)):
            # Return empty list with a message - this might be silence or noise
            return []
        
        # Convert frames to time
        times = librosa.frames_to_time(np.arange(len(f0)), sr=sample_rate, hop_length=self.hop_length)
        
        # Map frequencies to swarams
        swaram_notes = []
        current_swaram = None
        current_octave = None
        current_start = None
        current_pitches = []
        
        for i, freq in enumerate(f0):
            swaram, octave = self._frequency_to_swaram(freq, sruti)
            
            # Check if swaram changed
            if swaram != current_swaram:
                # Save previous swaram
                if current_swaram is not None and current_start is not None:
                    pitch_array = np.array(current_pitches) if current_pitches else np.array([])
                    gamakam = self._detect_gamakam(pitch_array) if len(pitch_array) > 0 else None
                    
                    # Calculate confidence from voiced probability
                    start_idx = max(0, i-10)
                    confidence = float(np.mean(voiced_prob[start_idx:i])) if i > start_idx else 0.5
                    
                    swaram_notes.append({
                        "start": float(current_start),
                        "end": float(times[i]),
                        "swaram": current_swaram,
                        "octave": current_octave,
                        "gamakam": gamakam,
                        "confidence": confidence
                    })
                
                # Start new swaram
                current_swaram = swaram
                current_octave = octave
                current_start = times[i]
                current_pitches = []
            
            if freq > 0:
                current_pitches.append(freq)
        
        # Add final swaram
        if current_swaram is not None and current_start is not None:
            pitch_array = np.array(current_pitches) if current_pitches else np.array([])
            gamakam = self._detect_gamakam(pitch_array) if len(pitch_array) > 0 else None
            confidence = float(np.mean(voiced_prob[-10:])) if len(voiced_prob) > 10 else 0.5
            
            end_time = float(times[-1]) if len(times) > 0 else float(current_start + 0.5)
            swaram_notes.append({
                "start": float(current_start),
                "end": end_time,
                "swaram": current_swaram,
                "octave": current_octave,
                "gamakam": gamakam,
                "confidence": confidence
            })
        
        # If no swarams were detected, return empty list
        if len(swaram_notes) == 0:
            return []
        
        return swaram_notes

