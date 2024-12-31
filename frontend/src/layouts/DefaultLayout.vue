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
    <slot />
  </div>
</template> 