<script setup lang="ts">
import Card from '@/components/ui/Card.vue'
import OfferAnalysisForm from '@/components/offers/OfferAnalysisForm.vue'
</script>

<template>
  <div class="min-h-screen bg-gray-50 p-8">
    <div class="mx-auto max-w-7xl">
      <h1 class="text-2xl font-semibold text-gray-900">Dashboard</h1>
      
      <!-- Stats -->
      <div class="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card title="Offres analysées">
          <p class="text-3xl font-semibold">0</p>
        </Card>
        
        <Card title="Taux moyen">
          <p class="text-3xl font-semibold">0€/jour</p>
        </Card>
        
        <Card title="Technologies">
          <p class="text-3xl font-semibold">-</p>
        </Card>
      </div>

      <!-- Analyse Form -->
      <div class="mt-8">
        <Card>
          <OfferAnalysisForm />
        </Card>
      </div>
    </div>
  </div>
</template> 