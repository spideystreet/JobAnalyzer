<script setup lang="ts">
import StatusIcon from './StatusIcon.vue'

interface UrlStatus {
  url: string
  status: 'pending' | 'connecting' | 'extracting' | 'parsing' | 'analyzing' | 'saving' | 'success' | 'error'
  message?: string
}

const props = defineProps<{
  urlsList: UrlStatus[]
}>()
</script>

<template>
  <div class="space-y-4">
    <div
      v-for="item in urlsList"
      :key="item.url"
      class="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg"
    >
      <div class="flex-1 truncate mr-4">
        {{ item.url }}
      </div>
      <StatusIcon :status="item.status" />
    </div>
  </div>
</template> 