# Standards de Développement JobAnalyzer

## 🎨 Design System

### Couleurs
```css
/* Couleurs principales */
--primary: #00D1FF;
--secondary: #0047FF;
--background: #111111;
--text: #FFFFFF;

/* Variantes avec opacité */
--text-secondary: rgba(255, 255, 255, 0.8);
--border-light: rgba(255, 255, 255, 0.05);
--border-medium: rgba(255, 255, 255, 0.1);
```

### Dégradés
```css
/* Texte */
.gradient-text {
  @apply bg-gradient-to-r from-[#00D1FF] to-[#0047FF] bg-clip-text text-transparent;
}

/* Fond */
.gradient-bg {
  @apply bg-gradient-to-r from-[#0B1EDC] via-[#00D1FF] to-[#0047FF];
}
```

### Typographie
```css
/* Titres */
h1: text-4xl md:text-6xl font-black
h2: text-3xl font-bold
p: text-lg md:text-xl text-white/80
```

## 🔄 Animations & Transitions

### Transitions de Page
```vue
<Transition 
  name="page" 
  mode="out-in" 
  appear
>
  <component :is="Component" />
</Transition>
```

### Standards d'Animation
```css
/* Durées */
--transition-fast: 150ms;
--transition-normal: 300ms;
--transition-slow: 500ms;

/* Timing Functions */
--ease: cubic-bezier(0.4, 0, 0.2, 1);
```

### Hover Effects
```css
/* Boutons */
.button {
  @apply transition-all duration-150;
  &:hover {
    @apply bg-white/90;
    box-shadow: 0 0 15px rgba(0, 209, 255, 0.2);
  }
}
```

## 📐 Layout & Structure

### Container Principal
```vue
<template>
  <main class="min-h-screen relative">
    <!-- Fond abstrait -->
    <div class="fixed inset-0 pointer-events-none overflow-hidden">
      <!-- Gradient orbs here -->
    </div>
    
    <!-- Contenu -->
    <div class="relative min-h-screen flex flex-col items-center justify-center p-6 md:p-24">
      <!-- Content here -->
    </div>
  </main>
</template>
```

### Composants Communs

#### Cards
```vue
<div class="bg-[#111111] border border-white/5 rounded-lg overflow-hidden">
  <!-- Card content -->
</div>
```

#### Badges
```vue
<div class="inline-flex items-center px-4 py-2 rounded-full bg-black/40 backdrop-blur-sm border border-white/10">
  <!-- Badge content -->
</div>
```

#### Boutons
```vue
<Button 
  variant="primary" 
  class="min-w-[240px] h-12 bg-white hover:bg-white/90 transition-all duration-150 relative group"
>
  <span class="gradient-text">
    <!-- Button text -->
  </span>
</Button>
```

## 🧩 Organisation du Code

### Structure des Composants
```typescript
// Imports
import { ref, computed } from 'vue'
import type { PropType } from 'vue'

// Types & Interfaces
interface ComponentProps {
  // ...
}

// Props
const props = defineProps<{
  // Toujours typer les props
  title: string
  items: ComponentProps[]
}>()

// Emits
const emit = defineEmits<{
  // Toujours typer les émissions
  (e: 'update', value: string): void
}>()

// Composition API setup
const state = ref(initialState)
const computed = computed(() => {
  // ...
})

// Event Handlers
const handleAction = () => {
  // Préfixer les handlers avec 'handle'
}
```

### Standards de Style
```vue
<style scoped>
/* Imports globaux en premier */
@import '@/styles/transitions.css';

/* Variables locales ensuite */
:root {
  --component-specific: value;
}

/* Styles composant */
.component {
  /* Propriétés organisées par catégorie */
  /* Layout */
  display: flex;
  position: relative;
  
  /* Dimensions */
  width: 100%;
  height: auto;
  
  /* Visuel */
  background: var(--background);
  border-radius: 8px;
  
  /* Animations */
  transition: all var(--transition-normal) var(--ease);
}
</style>
```

## 🚀 Performance

### Optimisations
- Utiliser `will-change` pour les animations complexes
- Lazy loading pour les composants lourds
- Transitions avec `mode="out-in"` pour éviter les conflits
- Images optimisées et avec dimensions spécifiées

### Bonnes Pratiques
- Éviter les calculs lourds dans les computed properties
- Utiliser `v-show` plutôt que `v-if` pour les toggles fréquents
- Mettre en cache les résultats de calculs coûteux
- Utiliser les refs plutôt que reactive pour les valeurs simples

## 🌐 Responsive Design

### Breakpoints
```css
/* Mobile first */
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
2xl: 1536px
```

### Media Queries
```css
/* Toujours utiliser les classes Tailwind */
.element {
  @apply w-full md:w-1/2 lg:w-1/3;
}
```

## 🎯 Utilisation

Pour utiliser ces standards dans un nouveau composant :

1. Copier la structure de base du container principal
2. Utiliser les classes utilitaires définies
3. Suivre les patterns d'animation pour les transitions
4. Respecter l'organisation du code
5. Implémenter les optimisations de performance

Pour les nouvelles fonctionnalités, toujours se référer à ce document pour maintenir la cohérence du design system. 