import { httpsCallable } from 'firebase/functions'
import { functions } from '@/config/firebase'
import { FirebaseError } from 'firebase/app'

export const createOffer = async (url: string, userId: string) => {
  const analyze = httpsCallable(functions, 'analyze_job')
  
  try {
    const result = await analyze({ url })
    return result.data
  } catch (error) {
    // Convertir l'erreur Firebase en erreur standard
    if (error instanceof FirebaseError) {
      const e = new Error(error.message)
      e.code = error.code
      throw e
    }
    throw error
  }
} 