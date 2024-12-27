<script setup lang="ts">
interface Props {
  modelValue: string
  placeholder?: string
  type?: string
  required?: boolean
  error?: string
  success?: boolean
  icon?: string
  id?: string
}

defineProps<Props>()
defineEmits(['update:modelValue'])
</script>

<template>
  <div class="relative w-full">
    <!-- Container de l'input avec effet glassmorphism -->
    <div 
      class="relative group rounded-lg transition-all duration-300 ease-out bg-white/5 backdrop-blur-md"
      :class="[
        error ? 'shadow-error/20' : 'shadow-primary/5',
        'hover:bg-white/10',
      ]"
    >
      <!-- Input -->
      <input
        :id="id"
        :value="modelValue"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        :type="type"
        :required="required"
        class="w-full h-10 bg-transparent px-4 rounded-lg text-white placeholder-gray-400 transition-all duration-300 ease-out
               border border-gray-700/50 focus:border-primary-500 focus:outline-none focus:ring-0
               disabled:opacity-50 disabled:cursor-not-allowed"
        :class="[
          error ? 'border-red-500 focus:border-red-500' : '',
          success ? 'border-green-500' : '',
        ]"
        :placeholder="placeholder"
      />

      <!-- Icônes à droite -->
      <div 
        v-if="icon || error || success"
        class="absolute right-4 top-1/2 -translate-y-1/2 transition-transform duration-200"
      >
        <svg 
          v-if="error"
          class="w-5 h-5 text-red-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path 
            stroke-linecap="round" 
            stroke-linejoin="round" 
            stroke-width="2" 
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <svg 
          v-else-if="success"
          class="w-5 h-5 text-green-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path 
            stroke-linecap="round" 
            stroke-linejoin="round" 
            stroke-width="2" 
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>
    </div>
  </div>
</template>

<style scoped>
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus {
  -webkit-text-fill-color: white;
  -webkit-box-shadow: 0 0 0px 1000px transparent inset;
  transition: background-color 5000s ease-in-out 0s;
}

.group:hover input::placeholder {
  color: rgba(255, 255, 255, 0.6);
  transition: color 0.3s ease-out;
}

/* Animation du focus plus douce */
input:focus {
  box-shadow: 0 0 0 1px rgba(66, 232, 224, 0.1);
  transition: all 0.3s ease-out;
}

/* Transition plus douce pour le hover */
.group {
  transition: all 0.3s ease-out;
}
</style> 