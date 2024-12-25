<script setup lang="ts">
defineProps<{
  type?: 'error' | 'success' | 'warning'
  message: string
}>()
</script>

<template>
  <div 
    class="rounded-lg p-4 text-sm"
    :class="[
      type === 'error' && 'bg-red-50 text-red-600',
      type === 'success' && 'bg-green-50 text-green-600',
      type === 'warning' && 'bg-yellow-50 text-yellow-600'
    ]"
  >
    {{ message }}
  </div>
</template> 