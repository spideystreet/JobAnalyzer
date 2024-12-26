// Types pour la base de données
export interface JobOffer {
  // Métadonnées
  ID: string
  URL: string
  CREATED_AT: Date
  UPDATED_AT: Date
  USER_ID: string
  STATUS: 'ACTIVE' | 'EXPIRED'

  // Données standardisées
  TITLE: string
  COMPANY: string
  COMPANY_TYPE: string
  CONTRACT_TYPE: string[]
  LOCATION: {
    COUNTRY: string
    REGION: string
    CITY: string
  }
  EXPERIENCE: {
    MIN: number
    MAX: number
  }
  SALARY: {
    MIN: number
    MAX: number
  }
  REMOTE: string
  TECHNOS: string[]
  DURATION: number

  HISTORY: {
    TIMESTAMP: Date
    DATA: any
  }[]
} 