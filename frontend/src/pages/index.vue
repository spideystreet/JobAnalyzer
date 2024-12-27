<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Button from '@/components/ui/Button.vue'

const router = useRouter()
const auth = useAuthStore()
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-[#1C1C1C] text-white">
    <main class="flex flex-col items-center max-w-4xl px-4">
      <h1 class="text-6xl font-bold mb-4">
        Job<span class="text-[#42E8E0]">Analyzer</span> IA
      </h1>
      
      <p class="text-xl text-gray-400 text-center mb-12">
        Analysez vos offres freelance avec l'intelligence artificielle
      </p>

      <div class="flex gap-4">
        <Button 
          variant="primary"
          class="bg-[#42E8E0] text-black hover:bg-[#42E8E0]/90 px-8 py-3"
          @click="router.push('/dashboard')"
        >
          Ajouter des offres
        </Button>

        <Button 
          variant="outline"
          class="border-[#42E8E0] text-[#42E8E0] hover:bg-[#42E8E0]/10 px-8 py-3"
        >
          En savoir plus
        </Button>
      </div>
    </main>
  </div>
</template> 