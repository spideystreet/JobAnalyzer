<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import '@/config/bootstrap'

const route = useRoute()
const layout = computed(() => {
  return (route.meta.layout || 'default') + '-layout'
})
</script>

<template>
  <component :is="layout">
    <div class="page-container">
      <RouterView v-slot="{ Component }">
        <Transition name="page" mode="out-in" appear>
          <component :is="Component" />
        </Transition>
      </RouterView>
    </div>
  </component>
</template>

<style src="@/styles/transitions.css"></style>
