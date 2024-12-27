<script setup lang="ts">
import { ref } from 'vue'
import Card from '@/components/ui/Card.vue'
import OfferAnalysisForm from '@/components/offers/OfferAnalysisForm.vue'
import OfferStats from '@/components/dashboard/OfferStats.vue'

const statsRef = ref()

const handleOfferAdded = () => {
  statsRef.value?.refreshStats()
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 p-8">
    <div class="mx-auto max-w-7xl">
      <h1 class="text-2xl font-semibold text-gray-900">Dashboard</h1>
      
      <!-- Stats -->
      <div class="mt-6">
        <OfferStats ref="statsRef" />
      </div>

      <!-- Analyse Form -->
      <div class="mt-8">
        <Card>
          <OfferAnalysisForm @offer-added="handleOfferAdded" />
        </Card>
      </div>
    </div>
  </div>
</template> 