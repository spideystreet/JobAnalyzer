import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/config/firebase'
import type { Offer } from '@/types/offer'

export const offersCollection = collection(db, 'offers')

export async function createOffer(url: string, userId: string): Promise<string> {
  const doc = await addDoc(offersCollection, {
    url,
    userId,
    createdAt: serverTimestamp()
  })
  return doc.id
} 