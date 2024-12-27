<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { collection, query, where, getDocs, writeBatch, doc } from 'firebase/firestore'
import { db } from '@/config/firebase'
import { useAuthStore } from '@/stores/auth'
import Card from '@/components/ui/Card.vue'
import Button from '@/components/ui/Button.vue'

const auth = useAuthStore()
const offerCount = ref(0)
const loading = ref(false)

const fetchStats = async () => {
  if (!auth.user) return
  
  const q = query(
    collection(db, 'offers'),
    where('USER_ID', '==', auth.user.uid)
  )
  
  const snapshot = await getDocs(q)
  offerCount.value = snapshot.size
}

const resetOffers = async () => {
  if (!auth.user || !confirm('Êtes-vous sûr de vouloir supprimer toutes vos offres ?')) return
  
  loading.value = true
  try {
    // 1. Récupérer toutes les offres
    const q = query(
      collection(db, 'offers'),
      where('USER_ID', '==', auth.user.uid)
    )
    const snapshot = await getDocs(q)
    
    // 2. Supprimer par lots
    const batch = writeBatch(db)
    snapshot.docs.forEach((doc) => {
      batch.delete(doc.ref)
    })
    await batch.commit()
    
    // 3. Mettre à jour le compteur
    offerCount.value = 0
  } catch (error) {
    console.error('Error resetting offers:', error)
  } finally {
    loading.value = false
  }
}

onMounted(fetchStats)

// Exposer la méthode pour le parent
defineExpose({
  refreshStats: fetchStats
})
</script>

<template>
  <Card>
    <div class="flex justify-between items-center">
      <div>
        <h3 class="text-sm font-medium text-gray-500">Offres analysées</h3>
        <p class="text-3xl font-semibold">{{ offerCount }}</p>
      </div>
      
      <Button 
        variant="destructive"
        size="sm"
        @click="resetOffers"
        :disabled="loading || offerCount === 0"
      >
        {{ loading ? 'Suppression...' : 'Reset' }}
      </Button>
    </div>
  </Card>
</template> 