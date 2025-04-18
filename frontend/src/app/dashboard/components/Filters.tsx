'use client'

import { useState, useEffect } from 'react'
import { Calendar } from '@/components/ui/calendar'
import { Button } from '@/components/ui/button-aremettre'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { CalendarIcon, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

interface FiltersProps {
  onFilterChange: (filters: FilterState) => void
  initialFilters?: FilterState
  minDate?: Date
  maxDate?: Date
}

export interface FilterState {
  technologies: string[]
  experienceLevel: string[]
  location: string[]
  dateRange: [Date | null, Date | null]
  country: string[]
  domain: string[]
  workMode: string[]
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
  "Junior",
  "Intermédiaire",
  "Confirmé",
  "Sénior"
]

const LOCATION_SUGGESTIONS = [
  "Île-de-France",
  "Auvergne-Rhône-Alpes",
  "Provence-Alpes-Côte d'Azur",
  "Occitanie",
  "Nouvelle-Aquitaine"
]

const COUNTRY_SUGGESTIONS = [
  "France",
  "Belgique",
  "Suisse",
  "Luxembourg"
]

const DOMAIN_SUGGESTIONS = [
  "Fullstack",
  "Backend",
  "Frontend",
  "DevOps",
  "Data Engineer",
  "Data Analyst",
  "Data Scientist",
  "Mobile",
  "Cloud Engineer",
  "Sécurité"
]

const WORK_MODE_OPTIONS = [
  "Oui",
  "Non",
  "Hybride"
]

export default function Filters({ onFilterChange, initialFilters, minDate, maxDate }: FiltersProps) {
  const defaultFilters: FilterState = {
    technologies: [],
    experienceLevel: [],
    location: [],
    dateRange: [null, null],
    country: [],
    domain: [],
    workMode: []
  }

  const [filters, setFilters] = useState<FilterState>(() => {
    return {
      ...defaultFilters,
      ...(initialFilters || {}),
      technologies: initialFilters?.technologies || [],
      experienceLevel: initialFilters?.experienceLevel || [],
      location: initialFilters?.location || [],
      country: initialFilters?.country || [],
      domain: initialFilters?.domain || [],
      workMode: initialFilters?.workMode || [],
      dateRange: initialFilters?.dateRange || [null, null]
    }
  })

  // États de recherche pour chaque filtre
  const [techSearch, setTechSearch] = useState('')
  const [xpSearch, setXpSearch] = useState('')
  const [locationSearch, setLocationSearch] = useState('')
  const [countrySearch, setCountrySearch] = useState('')
  const [domainSearch, setDomainSearch] = useState('')
  const [workModeSearch, setWorkModeSearch] = useState('')

  // Filtrer les suggestions en fonction de la recherche
  const filteredTechSuggestions = TECH_SUGGESTIONS.filter(tech =>
    tech.toLowerCase().includes(techSearch.toLowerCase())
  )

  const filteredXpSuggestions = XP_SUGGESTIONS.filter(xp =>
    xp.toLowerCase().includes(xpSearch.toLowerCase())
  )

  const filteredLocationSuggestions = LOCATION_SUGGESTIONS.filter(location =>
    location.toLowerCase().includes(locationSearch.toLowerCase())
  )

  const filteredCountrySuggestions = COUNTRY_SUGGESTIONS.filter(country =>
    country.toLowerCase().includes(countrySearch.toLowerCase())
  )

  const filteredDomainSuggestions = DOMAIN_SUGGESTIONS.filter(domain =>
    domain.toLowerCase().includes(domainSearch.toLowerCase())
  )

  // Ajouter un helper pour convertir le mode de travail
  const getWorkModeLabel = (mode: string) => {
    switch (mode) {
      case "Oui": return "Full Remote"
      case "Non": return "Présentiel"
      default: return "Hybride"
    }
  }

  // Modifier la logique de filtrage pour le mode de travail
  const filteredWorkModeSuggestions = WORK_MODE_OPTIONS.filter(mode => {
    const label = getWorkModeLabel(mode)
    return label.toLowerCase().includes(workModeSearch.toLowerCase())
  })

  useEffect(() => {
    if (initialFilters) {
      // Même logique pour les mises à jour
      setFilters({
        ...defaultFilters,
        ...initialFilters,
        technologies: initialFilters.technologies || [],
        experienceLevel: initialFilters.experienceLevel || [],
        location: initialFilters.location || [],
        country: initialFilters.country || [],
        domain: initialFilters.domain || [],
        workMode: initialFilters.workMode || [],
        dateRange: initialFilters.dateRange || [null, null]
      })
    }
  }, [initialFilters])

  const handleFilterChange = (key: keyof FilterState, value: string[] | [Date | null, Date | null]) => {
    const newFilters = {
      ...filters,
      [key]: value
    }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const toggleFilter = (key: keyof Omit<FilterState, 'dateRange'>, value: string) => {
    const currentValues = filters[key]
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value]
    handleFilterChange(key, newValues)
  }

  return (
    <div className="w-full mb-6">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Technologies Filter */}
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                className="w-full justify-start bg-black/20 backdrop-blur-xl border-white/10
                  active:bg-black/30
                  transition-all duration-200
                  hover:scale-[1.02] active:scale-[0.98]
                  touch-manipulation select-none
                  -webkit-tap-highlight-color-transparent"
              >
                <span className="text-white/50">
                  {filters.technologies.length === 0 
                    ? "Technologies..." 
                    : `${filters.technologies.length} sélectionnée${filters.technologies.length > 1 ? 's' : ''}`
                  }
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0 bg-black/80 backdrop-blur-xl border-white/10" align="start">
              <div className="p-2">
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={techSearch}
                  onChange={(e) => setTechSearch(e.target.value)}
                  className="w-full p-2 mb-2 bg-transparent border border-white/10 rounded-md text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/20"
                />
                <div className="max-h-[200px] overflow-auto">
                  {filteredTechSuggestions.map((tech) => (
                    <button
                      key={tech}
                      onClick={() => toggleFilter('technologies', tech)}
                      className={cn(
                        "w-full text-left px-2 py-1.5 text-sm rounded-md mb-1 flex items-center",
                        "text-white hover:bg-white/10 active:bg-white/20",
                        "transition-all duration-200",
                        "touch-manipulation select-none",
                        "-webkit-tap-highlight-color-transparent",
                        filters.technologies.includes(tech) ? "bg-white/10" : ""
                      )}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          filters.technologies.includes(tech) ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {tech}
                    </button>
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {/* Experience Filter */}
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                className="w-full justify-start bg-black/20 backdrop-blur-xl border-white/10"
              >
                <span className="text-white/50">
                  {filters.experienceLevel.length === 0 
                    ? "Expérience..." 
                    : `${filters.experienceLevel.length} sélectionnée${filters.experienceLevel.length > 1 ? 's' : ''}`
                  }
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0 bg-black/80 backdrop-blur-xl border-white/10" align="start">
              <div className="p-2">
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={xpSearch}
                  onChange={(e) => setXpSearch(e.target.value)}
                  className="w-full p-2 mb-2 bg-transparent border border-white/10 rounded-md text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/20"
                />
                <div className="max-h-[200px] overflow-auto">
                  {filteredXpSuggestions.map((xp) => (
                    <button
                      key={xp}
                      onClick={() => toggleFilter('experienceLevel', xp)}
                      className={cn(
                        "w-full text-left px-2 py-1.5 text-sm rounded-md mb-1 flex items-center",
                        "text-white hover:bg-white/10",
                        filters.experienceLevel.includes(xp) ? "bg-white/10" : ""
                      )}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          filters.experienceLevel.includes(xp) ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {xp}
                    </button>
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {/* Location Filter */}
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                className="w-full justify-start bg-black/20 backdrop-blur-xl border-white/10"
              >
                <span className="text-white/50">
                  {filters.location.length === 0 
                    ? "Région..." 
                    : `${filters.location.length} sélectionnée${filters.location.length > 1 ? 's' : ''}`
                  }
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0 bg-black/80 backdrop-blur-xl border-white/10" align="start">
              <div className="p-2">
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={locationSearch}
                  onChange={(e) => setLocationSearch(e.target.value)}
                  className="w-full p-2 mb-2 bg-transparent border border-white/10 rounded-md text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/20"
                />
                <div className="max-h-[200px] overflow-auto">
                  {filteredLocationSuggestions.map((location) => (
                    <button
                      key={location}
                      onClick={() => toggleFilter('location', location)}
                      className={cn(
                        "w-full text-left px-2 py-1.5 text-sm rounded-md mb-1 flex items-center",
                        "text-white hover:bg-white/10",
                        filters.location.includes(location) ? "bg-white/10" : ""
                      )}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          filters.location.includes(location) ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {location}
                    </button>
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {/* Country Filter */}
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                className="w-full justify-start bg-black/20 backdrop-blur-xl border-white/10"
              >
                <span className="text-white/50">
                  {filters.country.length === 0 
                    ? "Pays..." 
                    : `${filters.country.length} sélectionné${filters.country.length > 1 ? 's' : ''}`
                  }
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0 bg-black/80 backdrop-blur-xl border-white/10" align="start">
              <div className="p-2">
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={countrySearch}
                  onChange={(e) => setCountrySearch(e.target.value)}
                  className="w-full p-2 mb-2 bg-transparent border border-white/10 rounded-md text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/20"
                />
                <div className="max-h-[200px] overflow-auto">
                  {filteredCountrySuggestions.map((country) => (
                    <button
                      key={country}
                      onClick={() => toggleFilter('country', country)}
                      className={cn(
                        "w-full text-left px-2 py-1.5 text-sm rounded-md mb-1 flex items-center",
                        "text-white hover:bg-white/10",
                        filters.country.includes(country) ? "bg-white/10" : ""
                      )}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          filters.country.includes(country) ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {country}
                    </button>
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {/* Domain Filter */}
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                className="w-full justify-start bg-black/20 backdrop-blur-xl border-white/10"
              >
                <span className="text-white/50">
                  {filters.domain.length === 0 
                    ? "Métier..." 
                    : `${filters.domain.length} sélectionné${filters.domain.length > 1 ? 's' : ''}`
                  }
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0 bg-black/80 backdrop-blur-xl border-white/10" align="start">
              <div className="p-2">
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={domainSearch}
                  onChange={(e) => setDomainSearch(e.target.value)}
                  className="w-full p-2 mb-2 bg-transparent border border-white/10 rounded-md text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/20"
                />
                <div className="max-h-[200px] overflow-auto">
                  {filteredDomainSuggestions.map((domain) => (
                    <button
                      key={domain}
                      onClick={() => toggleFilter('domain', domain)}
                      className={cn(
                        "w-full text-left px-2 py-1.5 text-sm rounded-md mb-1 flex items-center",
                        "text-white hover:bg-white/10",
                        filters.domain.includes(domain) ? "bg-white/10" : ""
                      )}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          filters.domain.includes(domain) ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {domain}
                    </button>
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {/* Work Mode Filter */}
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                className="w-full justify-start bg-black/20 backdrop-blur-xl border-white/10"
              >
                <span className="text-white/50">
                  {filters.workMode.length === 0 
                    ? "Mode de travail..." 
                    : `${filters.workMode.length} sélectionné${filters.workMode.length > 1 ? 's' : ''}`
                  }
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0 bg-black/80 backdrop-blur-xl border-white/10" align="start">
              <div className="p-2">
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={workModeSearch}
                  onChange={(e) => setWorkModeSearch(e.target.value)}
                  className="w-full p-2 mb-2 bg-transparent border border-white/10 rounded-md text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/20"
                />
                <div className="max-h-[200px] overflow-auto">
                  {filteredWorkModeSuggestions.map((mode) => (
                    <button
                      key={mode}
                      onClick={() => toggleFilter('workMode', mode)}
                      className={cn(
                        "w-full text-left px-2 py-1.5 text-sm rounded-md mb-1 flex items-center",
                        "text-white hover:bg-white/10",
                        filters.workMode.includes(mode) ? "bg-white/10" : ""
                      )}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          filters.workMode.includes(mode) ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {getWorkModeLabel(mode)}
                    </button>
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {/* Date Range Filter */}
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                className="w-full justify-start bg-black/20 backdrop-blur-xl border-white/10"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                <span className="text-white/50">
                  {filters.dateRange[0] ? (
                    filters.dateRange[1] ? (
                      <>
                        {format(filters.dateRange[0], 'P', { locale: fr })} -{' '}
                        {format(filters.dateRange[1], 'P', { locale: fr })}
                      </>
                    ) : (
                      format(filters.dateRange[0], 'P', { locale: fr })
                    )
                  ) : (
                    "Période..."
                  )}
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-black/80 backdrop-blur-xl border-white/10" align="start">
              <Calendar
                mode="range"
                selected={{
                  from: filters.dateRange[0] || undefined,
                  to: filters.dateRange[1] || undefined
                }}
                onSelect={(range: any) => {
                  handleFilterChange('dateRange', [range?.from || null, range?.to || null])
                }}
                locale={fr}
                disabled={{ 
                  before: minDate,
                  after: maxDate
                }}
                className="rounded-md text-white"
              />
              {(filters.dateRange[0] || filters.dateRange[1]) && (
                <div className="p-3 border-t border-white/10">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full text-white hover:text-white/80"
                    onClick={() => handleFilterChange('dateRange', [null, null])}
                  >
                    Réinitialiser
                  </Button>
                </div>
              )}
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  )
} 
