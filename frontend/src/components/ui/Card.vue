<script setup lang="ts">
defineProps<{
  title?: string
}>()
</script>

<template>
  <div class="rounded-lg bg-background-lighter border border-gray-800 p-6">
    <h3 v-if="title" class="mb-4 font-medium text-text-primary">
      {{ title }}
    </h3>
    <slot />
  </div>
</template> 