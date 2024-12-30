// Types pour la base de données
export interface Offer {
  id: string
  url: string
  title?: string
  company?: string
  location?: string
  description?: string
  requirements?: string[]
  salary?: {
    min?: number
    max?: number
    currency?: string
  }
  createdAt: Date
  updatedAt: Date
  status: 'pending' | 'analyzing' | 'completed' | 'error'
  userId: string
} 