"use client"

import { useEffect, useRef } from "react"
import { useAppStore, SwaramNote } from "@/store/app-store"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { motion, AnimatePresence } from "framer-motion"
import { Music, Info } from "lucide-react"

/**
 * SwaramDisplay component
 * Displays transcribed swaram notation with timing and playback sync
 * Highlights current swaram during playback
 */
export const SwaramDisplay = () => {
  const { transcriptionResult, currentTime } = useAppStore()
  const scrollRef = useRef<HTMLDivElement>(null)

  /**
   * Get current swaram based on playback time
   * Finds the swaram that should be highlighted at current playback position
   */
  const getCurrentSwaram = (): number | null => {
    if (!transcriptionResult) return null
    
    const index = transcriptionResult.findIndex(
      (note) => currentTime >= note.start && currentTime <= note.end
    )
    return index >= 0 ? index : null
  }

  /**
   * Scroll to current swaram during playback
   * Automatically scrolls the view to keep current swaram visible
   */
  useEffect(() => {
    const currentIndex = getCurrentSwaram()
    if (currentIndex === null || !scrollRef.current) return

    const element = scrollRef.current.children[currentIndex] as HTMLElement
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" })
    }
  }, [currentTime, transcriptionResult])

  /**
   * Get octave color for visual distinction
   * Returns color class based on octave type
   */
  const getOctaveColor = (octave: string) => {
    switch (octave) {
      case "Mandra":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "Madhya":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "Tara":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
      default:
        return "bg-secondary"
    }
  }

  if (!transcriptionResult || transcriptionResult.length === 0) {
    return (
      <Card className="p-12 text-center">
        <Music className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">
          Transcribed swarams will appear here
        </p>
      </Card>
    )
  }

  const currentIndex = getCurrentSwaram()

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Music className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-semibold">Transcribed Swarams</h2>
        <Badge variant="secondary">{transcriptionResult.length} notes</Badge>
      </div>

      {/* Scrollable swaram grid */}
      <div
        ref={scrollRef}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[600px] overflow-y-auto"
      >
        <AnimatePresence>
          {transcriptionResult.map((note, index) => {
            const isActive = index === currentIndex
            
            return (
              <motion.div
                key={`${note.start}-${note.end}-${index}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <Card
                  className={`
                    p-4 cursor-pointer transition-all duration-200
                    ${isActive 
                      ? 'border-primary border-2 bg-primary/5 shadow-lg scale-105' 
                      : 'border hover:border-primary/50 hover:bg-accent/50'
                    }
                  `}
                >
                  {/* Swaram name - large and prominent */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl font-bold text-primary">
                      {note.swaram}
                    </span>
                    
                    {/* Octave badge */}
                    <Badge className={getOctaveColor(note.octave)}>
                      {note.octave}
                    </Badge>
                  </div>

                  {/* Timing information */}
                  <div className="text-xs text-muted-foreground space-y-1">
                    <div className="flex items-center gap-2">
                      <span>
                        {note.start.toFixed(2)}s - {note.end.toFixed(2)}s
                      </span>
                      <span className="text-primary">
                        ({(note.end - note.start).toFixed(2)}s)
                      </span>
                    </div>
                    
                    {/* Gamakam indicator */}
                    {note.gamakam && (
                      <div className="flex items-center gap-1 mt-2">
                        <Info className="h-3 w-3" />
                        <Badge variant="outline" className="text-xs">
                          {note.gamakam}
                        </Badge>
                      </div>
                    )}
                    
                    {/* Confidence score */}
                    {note.confidence !== undefined && (
                      <div className="mt-1">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span>Confidence</span>
                          <span>{(note.confidence * 100).toFixed(1)}%</span>
                        </div>
                        <div className="h-1 bg-secondary rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary transition-all duration-300"
                            style={{ width: `${note.confidence * 100}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </Card>
  )
}

