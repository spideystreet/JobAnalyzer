<script setup lang="ts">
defineProps<{
  variant?: 'primary' | 'secondary' | 'outline' | 'destructive'
  size?: 'sm' | 'md' | 'lg'
}>()
</script>

<template>
  <button
    class="inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50"
    :class="[
      variant === 'primary' && 'bg-primary text-primary-foreground hover:bg-primary-hover',
      variant === 'secondary' && 'bg-background-lighter text-text-primary hover:bg-background/80',
      variant === 'outline' && 'border border-primary text-primary hover:bg-primary/10',
      variant === 'destructive' && 'bg-red-500 text-white hover:bg-red-600',
      size === 'sm' && 'h-8 px-3 text-xs',
      size === 'md' && 'h-10 px-4 text-sm',
      size === 'lg' && 'h-11 px-8 text-base',
    ]"
  >
    <slot />
  </button>
</template> 