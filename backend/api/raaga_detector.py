from typing import List, Dict, Optional
import numpy as np

class RaagaDetector:
    """
    Detects Carnatic/Hindustani raaga from transcribed swarams
    
    Uses pattern matching and characteristic analysis
    to identify raaga from swaram sequences
    """
    
    # Raaga database with characteristics
    RAAGA_DATABASE = {
        "Mayamalavagowla": {
            "type": "Carnatic",
            "arohana": ["Sa", "Ri1", "Ga3", "Ma1", "Pa", "Da1", "Ni3", "Sa"],
            "avarohana": ["Sa", "Ni3", "Da1", "Pa", "Ma1", "Ga3", "Ri1", "Sa"],
            "characteristics": "A fundamental raaga used for teaching, with symmetric arohana and avarohana."
        },
        "Shankarabharanam": {
            "type": "Carnatic",
            "arohana": ["Sa", "Ri2", "Ga3", "Ma1", "Pa", "Da2", "Ni3", "Sa"],
            "avarohana": ["Sa", "Ni3", "Da2", "Pa", "Ma1", "Ga3", "Ri2", "Sa"],
            "characteristics": "A major raaga, equivalent to Western major scale. Very popular and versatile."
        },
        "Kalyani": {
            "type": "Carnatic",
            "arohana": ["Sa", "Ri2", "Ga3", "Ma2", "Pa", "Da2", "Ni3", "Sa"],
            "avarohana": ["Sa", "Ni3", "Da2", "Pa", "Ma2", "Ga3", "Ri2", "Sa"],
            "characteristics": "A bright and auspicious raaga with Prati Madhyama, often used in morning concerts."
        },
        "Bhairavi": {
            "type": "Carnatic",
            "arohana": ["Sa", "Ri1", "Ga2", "Ma1", "Pa", "Da1", "Ni2", "Sa"],
            "avarohana": ["Sa", "Ni2", "Da1", "Pa", "Ma1", "Ga2", "Ri1", "Sa"],
            "characteristics": "A versatile raaga suitable for all times, often used in devotional music."
        },
        "Yaman": {
            "type": "Hindustani",
            "arohana": ["Sa", "Ri2", "Ga3", "Ma2", "Pa", "Da2", "Ni3", "Sa"],
            "avarohana": ["Sa", "Ni3", "Da2", "Pa", "Ma2", "Ga3", "Ri2", "Sa"],
            "characteristics": "A serene evening raaga in Hindustani music, equivalent to Kalyani in Carnatic."
        },
        "Darbari": {
            "type": "Hindustani",
            "arohana": ["Sa", "Ri1", "Ga2", "Ma1", "Pa", "Da1", "Ni2", "Sa"],
            "avarohana": ["Sa", "Ni2", "Da1", "Pa", "Ma1", "Ga2", "Ri1", "Sa"],
            "characteristics": "A deep and profound raaga, typically performed in late evening or night."
        },
    }
    
    def detect_raaga(self, swarams: List[Dict]) -> Optional[Dict]:
        """
        Detect raaga from transcribed swarams
        
        Compares swaram sequences with known raaga patterns
        
        Args:
            swarams: List of transcribed swaram dictionaries
        
        Returns:
            Dictionary with raaga information or None if not detected
        """
        if not swarams or len(swarams) < 5:
            return None
        
        # Extract unique swarams in sequence
        swaram_sequence = [note["swaram"] for note in swarams if note.get("swaram")]
        
        if len(swaram_sequence) < 5:
            return None
        
        # Get unique swarams used
        unique_swarams = list(set(swaram_sequence))
        
        best_match = None
        best_score = 0.0
        
        # Compare with each raaga in database
        for raaga_name, raaga_info in self.RAAGA_DATABASE.items():
            # Get arohana and avarohana swarams
            arohana_swarams = set(raaga_info["arohana"])
            avarohana_swarams = set(raaga_info["avarohana"])
            
            # All swarams used in this raaga
            raaga_swarams = arohana_swarams.union(avarohana_swarams)
            
            # Calculate match score
            # Score based on: 1) Swaram overlap, 2) Sequence pattern similarity
            swaram_overlap = len(raaga_swarams.intersection(set(unique_swarams))) / len(raaga_swarams)
            
            # Check for ascending pattern match
            arohana_match = self._check_pattern_match(swaram_sequence, raaga_info["arohana"])
            
            # Check for descending pattern match
            avarohana_match = self._check_pattern_match(swaram_sequence, raaga_info["avarohana"][::-1])
            
            # Combined score
            pattern_score = max(arohana_match, avarohana_match)
            total_score = (swaram_overlap * 0.6) + (pattern_score * 0.4)
            
            if total_score > best_score:
                best_score = total_score
                best_match = {
                    "name": raaga_name,
                    "type": raaga_info["type"],
                    "confidence": min(total_score, 1.0),
                    "arohana": raaga_info["arohana"],
                    "avarohana": raaga_info["avarohana"],
                    "characteristics": raaga_info["characteristics"]
                }
        
        # Only return if confidence is above threshold
        if best_match and best_match["confidence"] > 0.3:
            return best_match
        
        return None
    
    def _check_pattern_match(self, sequence: List[str], pattern: List[str]) -> float:
        """
        Check how well a sequence matches a pattern
        
        Args:
            sequence: Swaram sequence from transcription
            pattern: Expected raaga pattern
        
        Returns:
            Match score between 0 and 1
        """
        if not pattern or not sequence:
            return 0.0
        
        # Find longest common subsequence
        matches = 0
        pattern_idx = 0
        
        for swaram in sequence:
            if pattern_idx < len(pattern) and swaram == pattern[pattern_idx]:
                matches += 1
                pattern_idx += 1
        
        # Normalize score
        return matches / len(pattern) if pattern else 0.0

