import { defineStore } from 'pinia'
import { ref, onMounted } from 'vue'
import { 
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User
} from 'firebase/auth'
import { auth } from '@/config/firebase'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const loading = ref(true)
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

  // Listen to auth state changes
  onMounted(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      user.value = currentUser
      loading.value = false
    })

    // Cleanup listener on unmount
    return () => unsubscribe()
  })

  return {
    user,
    loading,
    error,
    loginWithGoogle,
    signOut
  }
}) 