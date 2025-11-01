"use client"

import { useAppStore, RaagaInfo } from "@/store/app-store"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { Sparkles, TrendingUp, TrendingDown } from "lucide-react"

/**
 * RaagaInfo component
 * Displays detected raaga information with visual details
 * Shows arohana, avarohana, and characteristics
 */
export const RaagaInfoDisplay = () => {
  const { raagaInfo } = useAppStore()

  if (!raagaInfo) {
    return (
      <Card className="p-8 text-center border-dashed">
        <Sparkles className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">
          Raaga information will appear after transcription
        </p>
      </Card>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="p-6 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">{raagaInfo.name}</h2>
              <Badge variant="secondary" className="mt-1">
                {raagaInfo.type}
              </Badge>
            </div>
          </div>
          
          {/* Confidence badge */}
          <Badge 
            variant={raagaInfo.confidence > 0.7 ? "default" : "outline"}
            className="text-lg px-4 py-2"
          >
            {Math.round(raagaInfo.confidence * 100)}% confident
          </Badge>
        </div>

        {/* Arohana (Ascending scale) */}
        {raagaInfo.arohana && raagaInfo.arohana.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <TrendingUp className="h-4 w-4" />
              <span>Arohana (Ascending)</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {raagaInfo.arohana.map((swaram, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Badge 
                    variant="outline" 
                    className="text-lg px-3 py-1 font-semibold"
                  >
                    {swaram}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Avarohana (Descending scale) */}
        {raagaInfo.avarohana && raagaInfo.avarohana.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <TrendingDown className="h-4 w-4" />
              <span>Avarohana (Descending)</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {raagaInfo.avarohana.map((swaram, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Badge 
                    variant="outline" 
                    className="text-lg px-3 py-1 font-semibold"
                  >
                    {swaram}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Characteristics */}
        {raagaInfo.characteristics && (
          <div className="pt-4 border-t">
            <h3 className="font-semibold mb-2">Characteristics</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {raagaInfo.characteristics}
            </p>
          </div>
        )}
      </Card>
    </motion.div>
  )
}

