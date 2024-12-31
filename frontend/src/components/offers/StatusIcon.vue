<script setup lang="ts">
import { defineComponent, h } from 'vue'

type StatusType = 'pending' | 'connecting' | 'extracting' | 'parsing' | 'analyzing' | 'saving' | 'success' | 'error'

const props = defineProps<{
  status: StatusType
}>()

interface StatusIconConfig {
  text: string
  component: ReturnType<typeof defineComponent>
}

const StatusIcons: Record<StatusType, StatusIconConfig> = {
  pending: {
    text: 'En attente...',
    component: defineComponent({
      name: 'PendingIcon',
      setup() {
        return () => h('svg', {
          class: 'w-5 h-5',
          viewBox: '0 0 24 24',
          fill: 'none'
        }, [
          h('path', {
            d: 'M12 6v6l4 2',
            stroke: 'url(#pendingGradient)',
            'stroke-width': 2,
            'stroke-linecap': 'round',
            'stroke-linejoin': 'round'
          }),
          h('circle', {
            cx: 12,
            cy: 12,
            r: 9,
            stroke: 'url(#pendingGradient)',
            'stroke-width': 2
          }),
          h('defs', {}, [
            h('linearGradient', {
              id: 'pendingGradient',
              x1: 3,
              y1: 12,
              x2: 21,
              y2: 12,
              gradientUnits: 'userSpaceOnUse'
            }, [
              h('stop', { 'stop-color': '#00D1FF' }),
              h('stop', { offset: 1, 'stop-color': '#0047FF' })
            ])
          ])
        ])
      }
    })
  },
  connecting: {
    text: 'Connexion au site...',
    component: defineComponent({
      name: 'ConnectingIcon',
      setup() {
        return () => h('svg', {
          class: 'w-5 h-5',
          viewBox: '0 0 24 24',
          fill: 'none'
        }, [
          h('path', {
            d: 'M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71',
            stroke: 'url(#connectingGradient)',
            'stroke-width': 2,
            'stroke-linecap': 'round'
          }),
          h('defs', {}, [
            h('linearGradient', {
              id: 'connectingGradient',
              x1: 3,
              y1: 12,
              x2: 21,
              y2: 12,
              gradientUnits: 'userSpaceOnUse'
            }, [
              h('stop', { 'stop-color': '#00D1FF' }),
              h('stop', { offset: 1, 'stop-color': '#0047FF' })
            ])
          ])
        ])
      }
    })
  },
  extracting: {
    text: 'Extraction des données...',
    component: defineComponent({
      name: 'ExtractingIcon',
      setup() {
        return () => h('svg', {
          class: 'w-5 h-5',
          viewBox: '0 0 24 24',
          fill: 'none'
        }, [
          h('path', {
            d: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3',
            stroke: 'url(#extractingGradient)',
            'stroke-width': 2,
            'stroke-linecap': 'round'
          }),
          h('defs', {}, [
            h('linearGradient', {
              id: 'extractingGradient',
              x1: 3,
              y1: 12,
              x2: 21,
              y2: 12,
              gradientUnits: 'userSpaceOnUse'
            }, [
              h('stop', { 'stop-color': '#00D1FF' }),
              h('stop', { offset: 1, 'stop-color': '#0047FF' })
            ])
          ])
        ])
      }
    })
  },
  parsing: {
    text: 'Analyse du contenu...',
    component: defineComponent({
      name: 'ParsingIcon',
      setup() {
        return () => h('svg', {
          class: 'w-5 h-5',
          viewBox: '0 0 24 24',
          fill: 'none'
        }, [
          h('path', {
            d: 'M22 12h-4l-3 9L9 3l-3 9H2',
            stroke: 'url(#parsingGradient)',
            'stroke-width': 2,
            'stroke-linecap': 'round'
          }),
          h('defs', {}, [
            h('linearGradient', {
              id: 'parsingGradient',
              x1: 3,
              y1: 12,
              x2: 21,
              y2: 12,
              gradientUnits: 'userSpaceOnUse'
            }, [
              h('stop', { 'stop-color': '#00D1FF' }),
              h('stop', { offset: 1, 'stop-color': '#0047FF' })
            ])
          ])
        ])
      }
    })
  },
  analyzing: {
    text: 'Analyse IA en cours...',
    component: defineComponent({
      name: 'AnalyzingIcon',
      setup() {
        return () => h('svg', {
          class: 'w-5 h-5',
          viewBox: '0 0 24 24',
          fill: 'none'
        }, [
          h('path', {
            d: 'M12 2a10 10 0 0 1 10 10c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2Z',
            stroke: 'url(#analyzingGradient)',
            'stroke-width': 2
          }),
          h('defs', {}, [
            h('linearGradient', {
              id: 'analyzingGradient',
              x1: 3,
              y1: 12,
              x2: 21,
              y2: 12,
              gradientUnits: 'userSpaceOnUse'
            }, [
              h('stop', { 'stop-color': '#00D1FF' }),
              h('stop', { offset: 1, 'stop-color': '#0047FF' })
            ])
          ])
        ])
      }
    })
  },
  saving: {
    text: 'Sauvegarde...',
    component: defineComponent({
      name: 'SavingIcon',
      setup() {
        return () => h('svg', {
          class: 'w-5 h-5',
          viewBox: '0 0 24 24',
          fill: 'none'
        }, [
          h('path', {
            d: 'M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z',
            stroke: 'url(#savingGradient)',
            'stroke-width': 2
          }),
          h('defs', {}, [
            h('linearGradient', {
              id: 'savingGradient',
              x1: 3,
              y1: 12,
              x2: 21,
              y2: 12,
              gradientUnits: 'userSpaceOnUse'
            }, [
              h('stop', { 'stop-color': '#00D1FF' }),
              h('stop', { offset: 1, 'stop-color': '#0047FF' })
            ])
          ])
        ])
      }
    })
  },
  success: {
    text: 'Terminé !',
    component: defineComponent({
      name: 'SuccessIcon',
      setup() {
        return () => h('svg', {
          class: 'w-5 h-5 text-green-500',
          viewBox: '0 0 24 24',
          fill: 'none'
        }, [
          h('path', {
            d: 'M20 6L9 17L4 12',
            stroke: 'currentColor',
            'stroke-width': 2,
            'stroke-linecap': 'round'
          })
        ])
      }
    })
  },
  error: {
    text: 'Erreur',
    component: defineComponent({
      name: 'ErrorIcon',
      setup() {
        return () => h('svg', {
          class: 'w-5 h-5 text-red-500',
          viewBox: '0 0 24 24',
          fill: 'none'
        }, [
          h('path', {
            d: 'M18 6L6 18M6 6l12 12',
            stroke: 'currentColor',
            'stroke-width': 2,
            'stroke-linecap': 'round'
          })
        ])
      }
    })
  }
}
</script>

<template>
  <div class="flex items-center gap-2">
    <component :is="StatusIcons[status].component" />
    <span class="text-sm text-gray-400">{{ StatusIcons[status].text }}</span>
  </div>
</template> 