"use client"

import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import { Upload, Music, FileAudio, Loader2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useAppStore } from "@/store/app-store"
import toast from "react-hot-toast"

/**
 * FileUpload component
 * Handles drag-and-drop and click-to-upload for audio files
 * Supports MP3, WAV, MIDI, and MIDI files
 * Provides visual feedback during upload and processing
 */
export const FileUpload = () => {
  const { 
    audioFile,
    audioUrl,
    setAudioFile, 
    setAudioUrl, 
    isTranscribing, 
    transcriptionProgress 
  } = useAppStore()
  
  const [isDragging, setIsDragging] = useState(false)

  /**
   * Handle file drop or selection
   * Validates file type and size, creates object URL for preview
   */
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    
    // Validate file type
    const validTypes = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/midi', 'audio/x-midi']
    const validExtensions = ['.mp3', '.wav', '.mid', '.midi']
    
    const isValidType = validTypes.includes(file.type) || 
      validExtensions.some(ext => file.name.toLowerCase().endsWith(ext))
    
    if (!isValidType) {
      toast.error("Please upload a valid audio file (MP3, WAV, or MIDI)")
      return
    }
    
    // Validate file size (max 50MB)
    const maxSize = 50 * 1024 * 1024 // 50MB
    if (file.size > maxSize) {
      toast.error("File size must be less than 50MB")
      return
    }
    
    // Validate duration (max 5 minutes for MVP)
    // Note: Duration validation will be done server-side
    
    // Set file and create preview URL
    setAudioFile(file)
    const url = URL.createObjectURL(file)
    setAudioUrl(url)
    
    toast.success("File uploaded successfully!")
  }, [setAudioFile, setAudioUrl])

  /**
   * Configure dropzone options
   * Sets accept types, file size limits, and event handlers
   */
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'audio/*': ['.mp3', '.wav', '.mid', '.midi'],
    },
    maxFiles: 1,
    maxSize: 50 * 1024 * 1024, // 50MB
    disabled: isTranscribing,
    onDragEnter: () => setIsDragging(true),
    onDragLeave: () => setIsDragging(false),
  })

  /**
   * Handle file removal
   * Cleans up object URL and resets file state
   */
  const handleRemove = () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl)
    }
    setAudioFile(null)
    setAudioUrl(null)
  }

  return (
    <Card className="p-8 border-2 border-dashed transition-all duration-300">
      <AnimatePresence mode="wait">
        {!audioFile ? (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            {...getRootProps()}
            className={`
              flex flex-col items-center justify-center gap-4 p-12 cursor-pointer
              rounded-lg transition-all duration-300
              ${isDragActive || isDragging 
                ? 'bg-primary/10 border-primary scale-105' 
                : 'bg-secondary/30 hover:bg-secondary/50'
              }
            `}
          >
            <input {...getInputProps()} />
            
            {/* Upload icon with animation */}
            <motion.div
              animate={isDragActive ? { scale: 1.1, rotate: 5 } : { scale: 1, rotate: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Upload className="h-16 w-16 text-primary" />
            </motion.div>
            
            <div className="text-center space-y-2">
              <h3 className="text-xl font-semibold">
                {isDragActive ? "Drop your audio file here" : "Upload Audio File"}
              </h3>
              <p className="text-sm text-muted-foreground">
                Drag and drop or click to select
              </p>
              <p className="text-xs text-muted-foreground">
                Supports MP3, WAV, MIDI (Max 50MB, 5 minutes)
              </p>
            </div>
            
            <Button variant="outline" className="mt-4">
              Select File
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key="file-info"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            {/* File info display */}
            <div className="flex items-center gap-4 p-4 bg-secondary/50 rounded-lg">
              <div className="p-3 bg-primary/10 rounded-full">
                <FileAudio className="h-6 w-6 text-primary" />
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{audioFile.name}</p>
                <p className="text-sm text-muted-foreground">
                  {(audioFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              
              {!isTranscribing && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleRemove}
                  className="shrink-0"
                >
                  ×
                </Button>
              )}
            </div>
            
            {/* Transcription progress */}
            {isTranscribing && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="space-y-2"
              >
                <div className="flex items-center gap-2 text-sm">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  <span>Transcribing audio...</span>
                </div>
                <Progress value={transcriptionProgress} className="h-2" />
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  )
}

