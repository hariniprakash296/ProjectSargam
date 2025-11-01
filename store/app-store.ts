import { create } from "zustand"

/**
 * Transcription result data structure
 * Represents a single swaram note with timing and metadata
 */
export interface SwaramNote {
  start: number // Start time in seconds
  end: number // End time in seconds
  swaram: string // Swaram name (e.g., "Sa", "Ri2", "Ga3")
  octave: "Mandra" | "Madhya" | "Tara" // Octave classification
  gamakam?: string // Optional gamakam type (e.g., "kampitam")
  confidence?: number // Detection confidence score
}

/**
 * Raaga information structure
 * Contains details about the detected raaga
 */
export interface RaagaInfo {
  name: string // Raaga name
  type: "Carnatic" | "Hindustani" // Music system type
  confidence: number // Detection confidence
  arohana?: string[] // Ascending scale
  avarohana?: string[] // Descending scale
  characteristics?: string // Musical characteristics
}

/**
 * Lyrics data structure
 * Represents lyrics with timing information
 */
export interface LyricsData {
  text: string // Lyrics text
  start: number // Start time in seconds
  end: number // End time in seconds
}

/**
 * App state interface
 * Manages global application state for transcription workflow
 */
interface AppState {
  // File upload state
  audioFile: File | null
  audioUrl: string | null
  
  // Transcription state
  isTranscribing: boolean
  transcriptionProgress: number
  transcriptionResult: SwaramNote[] | null
  
  // Raaga detection state
  raagaInfo: RaagaInfo | null
  
  // Lyrics state
  lyrics: LyricsData[] | null
  
  // Playback state
  currentTime: number
  isPlaying: boolean
  duration: number
  
  // Actions
  setAudioFile: (file: File | null) => void
  setAudioUrl: (url: string | null) => void
  setTranscribing: (isTranscribing: boolean) => void
  setTranscriptionProgress: (progress: number) => void
  setTranscriptionResult: (result: SwaramNote[] | null) => void
  setRaagaInfo: (info: RaagaInfo | null) => void
  setLyrics: (lyrics: LyricsData[] | null) => void
  setCurrentTime: (time: number) => void
  setIsPlaying: (isPlaying: boolean) => void
  setDuration: (duration: number) => void
  reset: () => void // Reset all state
}

/**
 * Zustand store for global application state
 * Provides centralized state management for the transcription app
 */
export const useAppStore = create<AppState>((set) => ({
  // Initial state
  audioFile: null,
  audioUrl: null,
  isTranscribing: false,
  transcriptionProgress: 0,
  transcriptionResult: null,
  raagaInfo: null,
  lyrics: null,
  currentTime: 0,
  isPlaying: false,
  duration: 0,
  
  // Actions
  setAudioFile: (file) => set({ audioFile: file }),
  setAudioUrl: (url) => set({ audioUrl: url }),
  setTranscribing: (isTranscribing) => set({ isTranscribing }),
  setTranscriptionProgress: (progress) => set({ transcriptionProgress: progress }),
  setTranscriptionResult: (result) => set({ transcriptionResult: result }),
  setRaagaInfo: (info) => set({ raagaInfo: info }),
  setLyrics: (lyrics) => set({ lyrics }),
  setCurrentTime: (time) => set({ currentTime: time }),
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  setDuration: (duration) => set({ duration }),
  reset: () => set({
    audioFile: null,
    audioUrl: null,
    isTranscribing: false,
    transcriptionProgress: 0,
    transcriptionResult: null,
    raagaInfo: null,
    lyrics: null,
    currentTime: 0,
    isPlaying: false,
    duration: 0,
  }),
}))

