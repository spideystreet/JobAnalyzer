<script setup lang="ts">
import Button from '@/components/ui/Button.vue'
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <main class="flex min-h-screen flex-col items-center justify-center p-24">
    <div class="text-center">
      <h1 class="text-4xl font-bold tracking-tight sm:text-6xl">
        JobAnalyzer
        <span class="text-primary">IA</span>
      </h1>
      <p class="mt-6 text-lg leading-8 text-gray-600">
        Analysez vos offres freelance avec l'intelligence artificielle
      </p>
      <div class="mt-10 flex items-center justify-center gap-x-6">
        <Button size="lg" variant="primary" @click="router.push('/login')">
          Commencer gratuitement
        </Button>
        <Button size="lg" variant="outline">
          En savoir plus
        </Button>
      </div>
    </div>
  </main>
</template>
