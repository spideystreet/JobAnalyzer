<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  type?: string
  label?: string
  error?: string
  modelValue: string
}>()

const emit = defineEmits(['update:modelValue'])

const inputClasses = computed(() => [
  'mt-1 block w-full rounded-md px-3 py-2 text-sm',
  props.error 
    ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
    : 'border-gray-300 focus:border-primary focus:ring-primary'
])
</script>

<template>
  <div>
    <label v-if="label" class="block text-sm font-medium text-gray-700">
      {{ label }}
    </label>
    <input
      :type="type || 'text'"
      :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      :class="inputClasses"
    />
    <p v-if="error" class="mt-1 text-sm text-red-600">{{ error }}</p>
  </div>
</template> 