<template>
  <div 
    class="inline-flex items-center justify-center"
    :class="[size === 'sm' && 'w-4 h-4', size === 'md' && 'w-6 h-6']"
  >
    <div 
      class="w-full h-full rounded-full border-2 border-t-transparent animate-spin"
      :class="[
        variant === 'primary' && 'border-primary',
        variant === 'white' && 'border-white'
      ]"
    />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  size?: 'sm' | 'md'
  variant?: 'primary' | 'white'
}>()
</script> 