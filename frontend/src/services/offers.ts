import { httpsCallable } from 'firebase/functions'
import { functions } from '@/config/firebase'
import { FirebaseError } from 'firebase/app'
import { db } from '@/config/firebase'
import { collection, query, where, getDocs } from 'firebase/firestore'

interface ExtendedError extends Error {
  code?: string
}

interface AnalysisResult {
  success: boolean
  offer_id: string
  status: 'completed' | 'error'
}

export const checkOfferExists = async (url: string, userId: string): Promise<boolean> => {
  const offersRef = collection(db, 'offers')
  const q = query(offersRef, 
    where('URL', '==', url),
    where('USER_ID', '==', userId)
  )
  const querySnapshot = await getDocs(q)
  return !querySnapshot.empty
}

export const createOffer = async (url: string, userId: string): Promise<AnalysisResult> => {
  const analyze = httpsCallable(functions, 'analyze_job')
  
  try {
    const result = await analyze({ url })
    return result.data as AnalysisResult
  } catch (error) {
    // Convertir l'erreur Firebase en erreur standard
    if (error instanceof FirebaseError) {
      const e: ExtendedError = new Error(error.message)
      e.code = error.code
      throw e
    }
    throw error
  }
} 