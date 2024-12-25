import { defineStore } from 'pinia'
import { ref } from 'vue'
import { 
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  type User
} from 'firebase/auth'
import { auth } from '@/config/firebase'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const loading = ref(false)
  const error = ref('')

  // Login with Google
  async function loginWithGoogle() {
    loading.value = true
    error.value = ''
    try {
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      user.value = result.user
    } catch (e) {
      error.value = 'Erreur de connexion avec Google'
      throw e
    } finally {
      loading.value = false
    }
  }

  // Logout
  async function signOut() {
    await firebaseSignOut(auth)
    user.value = null
  }

  return {
    user,
    loading,
    error,
    loginWithGoogle,
    signOut
  }
}) 