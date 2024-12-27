<script setup lang="ts">
import DefaultLayout from '@/components/layout/DefaultLayout.vue'
import '@/config/firebase'
</script>

<template>
  <div class="min-h-screen relative overflow-hidden bg-gradient-to-b from-background via-background/95 to-background/90">
    <!-- Fond avec Mesh Gradient persistant -->
    <div class="fixed inset-0 overflow-hidden pointer-events-none">
      <!-- Orbe primaire -->
      <div 
        class="absolute -top-[40%] -left-[20%] w-[80%] h-[80%] rounded-full bg-primary/20 blur-[120px] opacity-20 animate-float"
      />
      <!-- Orbe secondaire -->
      <div 
        class="absolute -bottom-[40%] -right-[20%] w-[80%] h-[80%] rounded-full bg-secondary/20 blur-[120px] opacity-20 animate-float-delayed"
      />
      <!-- Overlay subtil pour améliorer la lisibilité -->
      <div class="absolute inset-0 bg-background/20 backdrop-blur-[1px]" />
    </div>

    <!-- Contenu principal -->
    <RouterView v-slot="{ Component }">
      <Transition 
        name="page" 
        mode="out-in"
      >
        <component :is="Component" />
      </Transition>
    </RouterView>
  </div>
</template>

<style>
/* Animation de flottement pour les orbes */
@keyframes float {
  0%, 100% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(-1%, -1%);
  }
}

@keyframes float-delayed {
  0%, 100% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(1%, 1%);
  }
}

.animate-float {
  animation: float 20s ease-in-out infinite;
}

.animate-float-delayed {
  animation: float-delayed 25s ease-in-out infinite;
}

/* Transitions de page */
.page-enter-active,
.page-leave-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
}

.page-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
