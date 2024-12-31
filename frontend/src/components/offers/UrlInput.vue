<script setup lang="ts">
import { ref } from 'vue'
import Input from '@/components/ui/Input.vue'
import Button from '@/components/ui/Button.vue'

const currentUrl = ref('')
const emit = defineEmits(['url-added'])

const isValidJobUrl = (url: string): boolean => {
  const allowedDomains = [
    'linkedin.com',
    'welcometothejungle.com',
    'free-work.com',
    'indeed.com'
  ]
  
  try {
    const urlObj = new URL(url)
    return allowedDomains.some(domain => urlObj.hostname.includes(domain))
  } catch {
    return false
  }
}

const handleAddUrl = () => {
  if (isValidJobUrl(currentUrl.value)) {
    emit('url-added', currentUrl.value)
    currentUrl.value = ''
  }
}
</script>

<template>
  <div class="flex gap-2">
    <Input
      v-model="currentUrl"
      placeholder="Collez l'URL de l'offre ici"
      class="flex-1"
      @keyup.enter="handleAddUrl"
    />
    <Button
      variant="primary"
      :disabled="!isValidJobUrl(currentUrl)"
      @click="handleAddUrl"
    >
      Ajouter
    </Button>
  </div>
</template> 