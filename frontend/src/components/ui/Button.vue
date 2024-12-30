<script setup lang="ts">
defineProps<{
  variant?: 'primary' | 'secondary' | 'outline' | 'destructive' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  className?: string
}>()
</script>

<template>
  <button
    :class="[
      // Base styles
      'relative group rounded-lg transition-all duration-300 ease-out tracking-wide inline-flex items-center justify-center',
      // Variants
      {
        // Primary avec effet noir premium
        'bg-black/80 backdrop-blur-sm border border-[#00D1FF]/30 text-white hover:bg-black/90 hover:border-[#00D1FF]/50 font-medium': variant === 'primary',
        
        // Secondary avec effet noir subtil
        'bg-black/40 backdrop-blur-sm border border-white/10 text-white hover:bg-black/50 hover:border-white/20 font-normal': variant === 'secondary',
        
        // Outline avec bordure subtile
        'bg-transparent backdrop-blur-sm border border-white/20 text-white hover:bg-white/5 hover:border-white/30 font-normal': variant === 'outline',
        
        // Ghost transparent
        'bg-transparent text-white hover:bg-white/5 font-normal': variant === 'ghost',
        
        // Destructive avec effet noir
        'bg-black/60 backdrop-blur-sm border border-red-500/50 text-red-400 hover:bg-black/70 hover:border-red-500/60 font-medium': variant === 'destructive',
      },
      // Sizes avec ajustements
      {
        'h-9 px-4 text-[13px] leading-[13px]': size === 'sm',
        'h-11 px-5 text-[14px] leading-[14px]': size === 'md',
        'h-8 px-7 text-[15px] leading-[15px]': size === 'lg',
      },
      // Disabled state
      'disabled:opacity-50 disabled:cursor-not-allowed',
      // Custom class
      className
    ]"
    v-bind="$attrs"
  >
    <!-- Effet de glow sur hover -->
    <div 
      class="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      :class="{
        'bg-[#00D1FF]/10 blur-xl': variant === 'primary',
        'bg-white/5 blur-lg': variant === 'secondary' || variant === 'outline',
        'bg-red-500/10 blur-xl': variant === 'destructive'
      }"
    />

    <!-- Loading spinner -->
    <Spinner v-if="loading" class="w-4 h-4" />
    
    <!-- Content -->
    <span 
      class="relative z-10 inline-flex items-center justify-center gap-2.5 whitespace-nowrap leading-none text-white"
      :class="{ 'opacity-0': loading }"
    >
      <slot />
    </span>
  </button>
</template>

<style scoped>
/* Effet de glow plus prononcé sur le hover */
.group:hover::after {
  content: '';
  position: absolute;
  inset: -1px;
  background: var(--primary);
  opacity: 0.15;
  filter: blur(12px);
  border-radius: 8px;
}

/* Transition plus douce */
.group {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  letter-spacing: 0.01em;
}

/* Amélioration de la netteté du texte */
button {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Assurer un centrage parfait */
button, span {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
</style> 