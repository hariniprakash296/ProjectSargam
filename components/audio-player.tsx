"use client"

import { useEffect, useRef } from "react"
import { useAppStore } from "@/store/app-store"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Play, Pause, SkipBack, SkipForward } from "lucide-react"
import { motion } from "framer-motion"

/**
 * AudioPlayer component
 * Provides playback controls for the uploaded audio file
 * Synchronizes playback state with transcription display
 */
export const AudioPlayer = () => {
  const {
    audioUrl,
    currentTime,
    isPlaying,
    duration,
    setCurrentTime,
    setIsPlaying,
    setDuration,
  } = useAppStore()
  
  const audioRef = useRef<HTMLAudioElement>(null)

  /**
   * Update audio element when URL changes
   * Sets up event listeners for time updates and duration
   */
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    // Update duration when metadata loads
    const handleLoadedMetadata = () => {
      setDuration(audio.duration)
    }

    // Update current time during playback
    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime)
    }

    // Handle playback end
    const handleEnded = () => {
      setIsPlaying(false)
      setCurrentTime(0)
    }

    audio.addEventListener("loadedmetadata", handleLoadedMetadata)
    audio.addEventListener("timeupdate", handleTimeUpdate)
    audio.addEventListener("ended", handleEnded)

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata)
      audio.removeEventListener("timeupdate", handleTimeUpdate)
      audio.removeEventListener("ended", handleEnded)
    }
  }, [audioUrl, setCurrentTime, setIsPlaying, setDuration])

  /**
   * Toggle play/pause
   * Controls audio playback state
   */
  const togglePlayPause = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
    } else {
      audio.play()
    }
    setIsPlaying(!isPlaying)
  }

  /**
   * Skip backward by 5 seconds
   * Rewinds audio playback
   */
  const skipBackward = () => {
    const audio = audioRef.current
    if (!audio) {
      return
    }
    audio.currentTime = Math.max(0, audio.currentTime - 5)
  }

  /**
   * Skip forward by 5 seconds
   * Fast-forwards audio playback
   */
  const skipForward = () => {
    const audio = audioRef.current
    if (!audio) {
      return
    }
    audio.currentTime = Math.min(duration, audio.currentTime + 5)
  }

  /**
   * Format time in MM:SS format
   * Converts seconds to readable time string
   */
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  /**
   * Handle progress bar click
   * Seeks to clicked position in audio
   */
  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current
    if (!audio) return

    const rect = e.currentTarget.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const percentage = clickX / rect.width
    audio.currentTime = percentage * duration
  }

  if (!audioUrl) {
    return null
  }

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <Card className="p-6">
      {/* Hidden audio element */}
      <audio ref={audioRef} src={audioUrl} />
      
      {/* Progress bar */}
      <div
        className="relative h-2 bg-secondary rounded-full cursor-pointer mb-4 group"
        onClick={handleSeek}
      >
        <div
          className="absolute top-0 left-0 h-full bg-primary rounded-full transition-all duration-100"
          style={{ width: `${progressPercentage}%` }}
        />
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ left: `${progressPercentage}%`, marginLeft: '-8px' }}
        />
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={skipBackward}
            disabled={!audioUrl}
          >
            <SkipBack className="h-5 w-5" />
          </Button>
          
          <Button
            variant="default"
            size="icon"
            onClick={togglePlayPause}
            disabled={!audioUrl}
            className="h-12 w-12"
          >
            {isPlaying ? (
              <Pause className="h-6 w-6" />
            ) : (
              <Play className="h-6 w-6 ml-1" />
            )}
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={skipForward}
            disabled={!audioUrl}
          >
            <SkipForward className="h-5 w-5" />
          </Button>
        </div>

        {/* Time display */}
        <div className="text-sm text-muted-foreground font-mono">
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>
      </div>
    </Card>
  )
}

