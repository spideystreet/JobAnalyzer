<script setup lang="ts">
defineProps<{
  title?: string
  description?: string
}>()
</script>

<template>
  <div class="rounded-lg border bg-card p-6 shadow-sm">
    <div class="flex flex-col space-y-1.5">
      <h3 v-if="title" class="text-lg font-semibold">
        {{ title }}
      </h3>
      <p v-if="description" class="text-sm text-gray-500">
        {{ description }}
      </p>
    </div>
    <div class="pt-4">
      <slot />
    </div>
  </div>
</template> 