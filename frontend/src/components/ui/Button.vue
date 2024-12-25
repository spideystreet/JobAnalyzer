<script setup lang="ts">
defineProps<{
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
}>()
</script>

<template>
  <button
    class="inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50"
    :class="[
      variant === 'primary' && 'bg-primary text-primary-foreground hover:bg-primary/90',
      variant === 'secondary' && 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
      variant === 'outline' && 'border border-gray-200 bg-white hover:bg-gray-100',
      size === 'sm' && 'h-9 px-3 text-sm',
      size === 'md' && 'h-10 px-4 text-sm',
      size === 'lg' && 'h-11 px-8 text-base',
    ]"
  >
    <slot />
  </button>
</template> 