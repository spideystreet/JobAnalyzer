import { httpsCallable } from 'firebase/functions'
import { functions } from '@/config/firebase'

const analyzeJobFunction = httpsCallable(functions, 'analyze_job')

export async function createOffer(url: string, userId: string): Promise<string> {
  try {
    // Appeler uniquement la Cloud Function
    const result = await analyzeJobFunction({ url })
    
    // La fonction retourne déjà le doc_id
    return result.data.doc_id
  } catch (error) {
    console.error('Error analyzing offer:', error)
    throw error
  }
} 