import { httpsCallable } from 'firebase/functions'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db, functions } from '@/config/firebase'

const analyzeJobFunction = httpsCallable(functions, 'analyze_job')
export const offersCollection = collection(db, 'offers')

export async function createOffer(url: string, userId: string): Promise<string> {
  try {
    // Appeler la Cloud Function
    const result = await analyzeJobFunction({ url })
    console.log('Function result:', result.data)
    
    // Log pour vérifier l'environnement
    console.log('Environment:', import.meta.env.DEV ? 'Development' : 'Production')
    console.log('Using emulator:', import.meta.env.DEV)
    
    // Sauvegarder dans Firestore
    const doc = await addDoc(offersCollection, {
      url,
      userId,
      status: result.data.status,
      createdAt: serverTimestamp()
    })
    
    return doc.id
  } catch (error) {
    console.error('Error details:', error)
    throw error
  }
} 