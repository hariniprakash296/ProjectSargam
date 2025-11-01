"use client"

import { useAppStore, LyricsData } from "@/store/app-store"
import { Card } from "@/components/ui/card"
import { motion, AnimatePresence } from "framer-motion"
import { Mic } from "lucide-react"

/**
 * LyricsDisplay component
 * Shows lyrics synchronized with audio playback
 * Highlights current lyrics based on playback time
 */
export const LyricsDisplay = () => {
  const { lyrics, currentTime } = useAppStore()

  /**
   * Get current lyrics based on playback time
   * Finds the lyrics segment that should be highlighted
   */
  const getCurrentLyrics = (): number | null => {
    if (!lyrics) return null
    
    const index = lyrics.findIndex(
      (lyric) => currentTime >= lyric.start && currentTime <= lyric.end
    )
    return index >= 0 ? index : null
  }

  if (!lyrics || lyrics.length === 0) {
    return (
      <Card className="p-8 text-center border-dashed">
        <Mic className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">
          Lyrics will appear here if available in the audio
        </p>
      </Card>
    )
  }

  const currentIndex = getCurrentLyrics()

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Mic className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-semibold">Lyrics</h2>
      </div>

      <div className="space-y-2 max-h-[400px] overflow-y-auto">
        <AnimatePresence>
          {lyrics.map((lyric, index) => {
            const isActive = index === currentIndex
            
            return (
              <motion.div
                key={`${lyric.start}-${lyric.end}-${index}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
              >
                <div
                  className={`
                    p-3 rounded-lg transition-all duration-200
                    ${isActive 
                      ? 'bg-primary/10 border-l-4 border-primary font-medium' 
                      : 'bg-secondary/30 hover:bg-secondary/50'
                    }
                  `}
                >
                  <p className={isActive ? "text-primary" : "text-foreground"}>
                    {lyric.text}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {lyric.start.toFixed(2)}s - {lyric.end.toFixed(2)}s
                  </p>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </Card>
  )
}

