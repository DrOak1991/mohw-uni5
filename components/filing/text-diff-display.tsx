"use client"

import { useMemo } from "react"

interface TextDiffDisplayProps {
  oldText: string
  newText: string
  showDiff?: boolean
}

interface DiffSegment {
  type: "unchanged" | "deleted" | "added"
  text: string
}

// Simple diff algorithm for text comparison
function computeDiff(oldText: string, newText: string): DiffSegment[] {
  if (oldText === newText) {
    return [{ type: "unchanged", text: newText }]
  }

  const segments: DiffSegment[] = []
  
  // Split into words for comparison
  const oldWords = oldText.split(/(\s+)/)
  const newWords = newText.split(/(\s+)/)
  
  let i = 0
  let j = 0
  
  while (i < oldWords.length || j < newWords.length) {
    if (i >= oldWords.length) {
      // Remaining new words are additions
      segments.push({ type: "added", text: newWords.slice(j).join("") })
      break
    }
    
    if (j >= newWords.length) {
      // Remaining old words are deletions
      segments.push({ type: "deleted", text: oldWords.slice(i).join("") })
      break
    }
    
    if (oldWords[i] === newWords[j]) {
      // Words match - unchanged
      const lastSegment = segments[segments.length - 1]
      if (lastSegment && lastSegment.type === "unchanged") {
        lastSegment.text += oldWords[i]
      } else {
        segments.push({ type: "unchanged", text: oldWords[i] })
      }
      i++
      j++
    } else {
      // Check if old word was deleted or new word was added
      const oldWordIndex = newWords.indexOf(oldWords[i], j)
      const newWordIndex = oldWords.indexOf(newWords[j], i)
      
      if (newWordIndex !== -1 && (oldWordIndex === -1 || newWordIndex < oldWordIndex)) {
        // Old word found later, so current new word is an addition
        segments.push({ type: "added", text: newWords[j] })
        j++
      } else if (oldWordIndex !== -1) {
        // New word found later, so current old word is a deletion
        segments.push({ type: "deleted", text: oldWords[i] })
        i++
      } else {
        // Neither found - treat as replacement
        segments.push({ type: "deleted", text: oldWords[i] })
        segments.push({ type: "added", text: newWords[j] })
        i++
        j++
      }
    }
  }
  
  return segments
}

export function TextDiffDisplay({ oldText, newText, showDiff = true }: TextDiffDisplayProps) {
  const diffSegments = useMemo(() => {
    if (!showDiff) {
      return [{ type: "unchanged" as const, text: newText }]
    }
    return computeDiff(oldText, newText)
  }, [oldText, newText, showDiff])

  const hasChanges = diffSegments.some(s => s.type !== "unchanged")

  return (
    <div className="relative">
      <div className="text-sm leading-relaxed whitespace-pre-wrap">
        {diffSegments.map((segment, index) => {
          if (segment.type === "deleted") {
            return (
              <span
                key={index}
                className="bg-red-100 text-red-700 line-through decoration-red-500"
              >
                {segment.text}
              </span>
            )
          }
          if (segment.type === "added") {
            return (
              <span
                key={index}
                className="bg-green-100 text-green-800"
              >
                {segment.text}
              </span>
            )
          }
          return <span key={index}>{segment.text}</span>
        })}
      </div>
      {hasChanges && (
        <div className="absolute -left-3 top-0 bottom-0 w-1 bg-amber-400 rounded-full" />
      )}
    </div>
  )
}

export function useTextDiff(oldText: string, newText: string) {
  return useMemo(() => {
    const segments = computeDiff(oldText, newText)
    const hasChanges = segments.some(s => s.type !== "unchanged")
    const deletedCount = segments.filter(s => s.type === "deleted").length
    const addedCount = segments.filter(s => s.type === "added").length
    
    return {
      segments,
      hasChanges,
      deletedCount,
      addedCount,
    }
  }, [oldText, newText])
}
