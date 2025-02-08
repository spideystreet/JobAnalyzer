'use client'

import { useTags } from '@/hooks/use-tags'
import { useState, useRef, KeyboardEvent } from 'react'
import { cn } from '@/lib/utils'

interface TagFilterProps {
  label: string
  suggestions?: string[]
  onTagsChange: (tags: string[]) => void
  className?: string
}

export function TagFilter({ label, suggestions = [], onTagsChange, className }: TagFilterProps) {
  const [inputValue, setInputValue] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const { tags, addTag, removeTag, hasReachedMax } = useTags({
    onChange: (tags) => onTagsChange(tags.map(t => t.label)),
    maxTags: 5,
  })

  const filteredSuggestions = suggestions.filter(
    (s) => 
      s.toLowerCase().includes(inputValue.toLowerCase()) && 
      !tags.find(t => t.label.toLowerCase() === s.toLowerCase())
  )

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue) {
      e.preventDefault()
      if (filteredSuggestions.length > 0) {
        addTag({ id: filteredSuggestions[0], label: filteredSuggestions[0] })
      } else {
        addTag({ id: inputValue, label: inputValue })
      }
      setInputValue('')
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      removeTag(tags[tags.length - 1].id)
    }
  }

  return (
    <div className={cn("space-y-2", className)}>
      <label className="block text-sm font-medium text-white">{label}</label>
      <div className="relative">
        <div className="min-h-[42px] w-full rounded-md border border-white/10 bg-black/20 backdrop-blur-xl px-3 py-2 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag.id}
              className="inline-flex items-center gap-1 rounded-md bg-primary/20 text-primary-foreground px-2 py-1 text-sm"
            >
              {tag.label}
              <button
                onClick={() => removeTag(tag.id)}
                className="hover:bg-black/10 rounded-full p-0.5"
              >
                ×
              </button>
            </span>
          ))}
          {!hasReachedMax && (
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value)
                setShowSuggestions(true)
              }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              onKeyDown={handleKeyDown}
              className="flex-1 min-w-[120px] bg-transparent outline-none text-white placeholder:text-white/50"
              placeholder={tags.length === 0 ? `Ajouter un ${label.toLowerCase()}...` : ''}
            />
          )}
        </div>
        
        {/* Liste de suggestions */}
        {showSuggestions && filteredSuggestions.length > 0 && (
          <>
            <div 
              className="fixed inset-0 bg-transparent z-[100]" 
              onClick={() => setShowSuggestions(false)}
            />
            <div className="absolute z-[101] w-full mt-1 bg-black/80 backdrop-blur-xl border border-white/10 rounded-md shadow-lg">
              {filteredSuggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  className="w-full px-3 py-2 text-left text-white hover:bg-white/10"
                  onClick={() => {
                    addTag({ id: suggestion, label: suggestion })
                    setInputValue('')
                    inputRef.current?.focus()
                  }}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
} 