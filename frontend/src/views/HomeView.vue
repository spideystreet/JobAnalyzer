<script setup lang="ts">
import Button from '@/components/ui/Button.vue'
import OfferAnalysisForm from '@/components/offers/OfferAnalysisForm.vue'
import { ref } from 'vue'

const showAnalyzer = ref(false)

const handleStartClick = () => {
  showAnalyzer.value = true
}
</script>

<template>
  <main class="flex min-h-screen flex-col items-center justify-center p-24 relative overflow-hidden">
    <!-- Landing page content -->
    <div 
      class="text-center transition-all duration-500"
      :class="{ 'opacity-0 transform -translate-y-full': showAnalyzer }"
    >
      <h1 class="text-4xl font-bold tracking-tight sm:text-6xl">
        JobAnalyzer
        <span class="text-primary">IA</span>
      </h1>
      <p class="mt-6 text-lg leading-8 text-gray-600">
        Analysez vos offres freelance avec l'intelligence artificielle
      </p>
      <div class="mt-10 flex items-center justify-center gap-x-6">
        <Button size="lg" variant="primary" @click="handleStartClick">
          Ajouter des offres
        </Button>
        <Button size="lg" variant="outline">
          En savoir plus
        </Button>
      </div>
    </div>

    <!-- Analyzer interface -->
    <div 
      class="absolute inset-0 bg-background transition-all duration-500 flex items-center justify-center"
      :class="{ 
        'translate-y-full opacity-0': !showAnalyzer,
        'translate-y-0 opacity-100': showAnalyzer 
      }"
    >
      <div class="w-full max-w-3xl p-6">
        <div class="flex justify-between items-center mb-8">
          <h2 class="text-2xl font-bold">Analysez vos offres</h2>
          <Button variant="ghost" @click="showAnalyzer = false">
            ← Retour
          </Button>
        </div>
        <OfferAnalysisForm v-if="showAnalyzer" />
      </div>
    </div>
  </main>
</template>

<style scoped>
.translate-y-full {
  transform: translateY(100%);
}
</style>
