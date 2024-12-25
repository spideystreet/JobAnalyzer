<script setup lang="ts">
defineProps<{
  title?: string
}>()
</script>

<template>
  <div class="rounded-lg bg-white p-6 shadow-sm">
    <h3 v-if="title" class="mb-4 font-medium text-gray-900">
      {{ title }}
    </h3>
    <slot />
  </div>
</template> 