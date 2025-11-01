"use client"

import { useEffect } from "react"
import { useAppStore } from "@/store/app-store"
import { FileUpload } from "@/components/file-upload"
import { AudioPlayer } from "@/components/audio-player"
import { SwaramDisplay } from "@/components/swaram-display"
import { RaagaInfoDisplay } from "@/components/raaga-info"
import { LyricsDisplay } from "@/components/lyrics-display"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { motion } from "framer-motion"
import { Upload, Download, Sparkles } from "lucide-react"
import axios from "axios"
import toast from "react-hot-toast"

/**
 * API base URL configuration
 * Points to FastAPI backend server
 */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

/**
 * Main page component
 * Orchestrates the transcription workflow
 * Handles file upload, transcription, and result display
 */
export default function Home() {
  const {
    audioFile,
    isTranscribing,
    setTranscribing,
    setTranscriptionProgress,
    setTranscriptionResult,
    setRaagaInfo,
    setLyrics,
  } = useAppStore()

  /**
   * Handle transcription submission
   * Sends audio file to backend API for processing
   * Updates progress and results state
   */
  const handleTranscribe = async () => {
    if (!audioFile) {
      toast.error("Please upload an audio file first")
      return
    }

    setTranscribing(true)
    setTranscriptionProgress(0)

    try {
      // Create FormData for file upload
      const formData = new FormData()
      formData.append("file", audioFile)
      
      // Optional: Add sruti (tonic) if user wants to specify
      // formData.append("sruti", "131") // Example: Sa = 131Hz

      // Simulate progress updates (in real implementation, use WebSocket or polling)
      const progressInterval = setInterval(() => {
        setTranscriptionProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 500)

      // Send transcription request to backend
      const response = await axios.post(
        `${API_BASE_URL}/api/transcribe`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          timeout: 300000, // 5 minutes timeout
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 50) / progressEvent.total
              )
              setTranscriptionProgress(percentCompleted)
            }
          },
        }
      )

      clearInterval(progressInterval)
      setTranscriptionProgress(100)

      // Update state with results
      if (response.data.swarams) {
        setTranscriptionResult(response.data.swarams)
      }
      
      if (response.data.raaga) {
        setRaagaInfo(response.data.raaga)
      }
      
      if (response.data.lyrics) {
        setLyrics(response.data.lyrics)
      }

      // Show success message even if no swarams found
      if (response.data.swarams && response.data.swarams.length > 0) {
        toast.success("Transcription completed successfully!")
      } else {
        toast.success("Transcription completed, but no swarams were detected in the audio.")
      }
      
      // Reset progress after a delay
      setTimeout(() => {
        setTranscriptionProgress(0)
      }, 1000)
    } catch (error: any) {
      console.error("Transcription error:", error)
      const errorMessage = error.response?.data?.detail || 
        error.message || 
        "Failed to transcribe audio. Please try again."
      
      console.error("Full error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      })
      
      toast.error(errorMessage)
      setTranscriptionProgress(0)
    } finally {
      setTranscribing(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-yellow-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50"
      >
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
                  Sargam
                </h1>
                <p className="text-sm text-muted-foreground">
                  Carnatic Music Transcriber
                </p>
              </div>
            </div>
            
            <Button
              onClick={handleTranscribe}
              disabled={!audioFile || isTranscribing}
              className="gap-2"
            >
              <Upload className="h-4 w-4" />
              {isTranscribing ? "Transcribing..." : "Transcribe Audio"}
            </Button>
          </div>
        </div>
      </motion.header>

      {/* Main content */}
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Upload section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <FileUpload />
        </motion.div>

        {/* Audio player */}
        {audioFile && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <AudioPlayer />
          </motion.div>
        )}

        {/* Results grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Raaga Info - Full width on mobile, 1 column on desktop */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-3"
          >
            <RaagaInfoDisplay />
          </motion.div>

          {/* Swaram Display - 2 columns */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2"
          >
            <SwaramDisplay />
          </motion.div>

          {/* Lyrics Display - 1 column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="lg:col-span-1"
          >
            <LyricsDisplay />
          </motion.div>
        </div>
      </div>
    </main>
  )
}

