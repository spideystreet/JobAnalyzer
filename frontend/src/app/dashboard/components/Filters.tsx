'use client'

import { useState } from 'react'
import { TagFilter } from './TagFilter'
import { Calendar } from '@/components/ui/calendar'
import { Button } from '@/components/ui/button'
import { addDays } from 'date-fns'
import { CalendarDate, parseDate, today, getLocalTimeZone } from '@internationalized/date'
import { DateValue } from 'react-aria-components'
import { RangeValue } from '@react-types/shared'

interface FiltersProps {
  onFilterChange: (filters: FilterState) => void
}

export interface FilterState {
  technologies: string[]
  experienceLevel: string[]
  location: string[]
  dateRange: [Date | null, Date | null]
}

// Suggestions pour les filtres
const TECH_SUGGESTIONS = [
  "Python", "React", "TypeScript", "JavaScript", "Java", 
  "Node.js", "SQL", "AWS", "Docker", "Angular", "Vue.js",
  "PHP", "Laravel", "Django", "Flask", "Spring", "MongoDB",
  "PostgreSQL", "MySQL", "Redis", "GraphQL", "REST", "Git",
  "CI/CD", "Kubernetes", "Azure", "GCP"
]

const XP_SUGGESTIONS = [
  "Junior (0-2 ans)",
  "Confirmé (2-5 ans)",
  "Senior (5-8 ans)",
  "Expert (8+ ans)"
]

const LOCATION_SUGGESTIONS = [
  "Île-de-France",
  "Auvergne-Rhône-Alpes",
  "Provence-Alpes-Côte d'Azur",
  "Occitanie",
  "Nouvelle-Aquitaine",
  "Full Remote"
]

export default function Filters({ onFilterChange }: FiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    technologies: [],
    experienceLevel: [],
    location: [],
    dateRange: [null, null]
  })

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    const newFilters = {
      ...filters,
      [key]: value
    }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return

    const [start, end] = filters.dateRange
    
    if (!start || (start && end)) {
      // Premier clic ou nouvelle sélection
      handleFilterChange('dateRange', [date, null])
    } else {
      // Deuxième clic
      const newEnd = date < start ? start : date
      const newStart = date < start ? date : start
      handleFilterChange('dateRange', [newStart, newEnd])
    }
  }

  const clearDateRange = () => {
    handleFilterChange('dateRange', [null, null])
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <TagFilter
        label="Technologies"
        suggestions={TECH_SUGGESTIONS}
        onTagsChange={(tags) => handleFilterChange('technologies', tags)}
      />

      <TagFilter
        label="Expérience"
        suggestions={XP_SUGGESTIONS}
        onTagsChange={(tags) => handleFilterChange('experienceLevel', tags)}
      />

      <TagFilter
        label="Région"
        suggestions={LOCATION_SUGGESTIONS}
        onTagsChange={(tags) => handleFilterChange('location', tags)}
      />

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">Période</label>
        <div className="relative">
          <Calendar
            mode="range"
            selected={{
              from: filters.dateRange[0] || undefined,
              to: filters.dateRange[1] || undefined
            }}
            onSelect={(range: any) => {
              handleFilterChange('dateRange', [range?.from || null, range?.to || null])
            }}
            className="rounded-md border"
            disabled={{ after: new Date() }}
          />
          {(filters.dateRange[0] || filters.dateRange[1]) && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-1 right-1"
              onClick={clearDateRange}
            >
              Réinitialiser
            </Button>
          )}
        </div>
      </div>
    </div>
  )
} 
