<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { getUserOffers } from '@/services/offers'
import type { Offer } from '@/types/offer'
import Card from '@/components/ui/Card.vue'

const auth = useAuthStore()
const offers = ref<Offer[]>([])
const loading = ref(true)

onMounted(async () => {
  if (auth.user) {
    try {
      offers.value = await getUserOffers(auth.user.uid)
    } catch (error) {
      console.error('Error fetching offers:', error)
    } finally {
      loading.value = false
    }
  }
})
</script>

<template>
  <div class="mt-8">
    <h2 class="text-xl font-semibold mb-4">Offres enregistrées</h2>
    <div class="space-y-4">
      <Card v-for="offer in offers" :key="offer.id">
        <div class="flex justify-between items-center">
          <a 
            :href="offer.url" 
            target="_blank"
            class="text-primary hover:underline"
          >
            {{ offer.url }}
          </a>
          <span class="text-sm text-gray-500">
            {{ new Date(offer.createdAt).toLocaleDateString() }}
          </span>
        </div>
      </Card>
    </div>
  </div>
</template> 