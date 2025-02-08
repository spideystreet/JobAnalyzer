export interface DomainStats {
  name: string
  value: number
}

export interface CompanyStats {
  company_type: string
  count: number
}

export interface TJMStats {
  technology: string
  count: number
  tjmTotal: number
  tjmMoyen: number
}

export interface JobStats {
  companyTypeStats: CompanyStats[]
  domainStats: DomainStats[]
  tjmStats: TJMStats[]
} 