<script setup lang="ts">
import Button from '@/components/ui/Button.vue'
import OfferAnalysisForm from '@/components/offers/OfferAnalysisForm.vue'
import Input from '@/components/ui/Input.vue'
import { ref, onMounted } from 'vue'

const showAnalyzer = ref(false)
const currentUrl = ref('')
const success = ref(false)
const showAnimation = ref(true)
const currentStep = ref(0)
const showSteps = ref(false)

const steps = [
  {
    title: "Collez vos URLs",
    description: "LinkedIn, WTTJ, Indeed ou Free-work",
    icon: "🔗"
  },
  {
    title: "L'IA analyse",
    description: "Extraction automatique des informations",
    icon: "🤖"
  },
  {
    title: "Recevez les insights",
    description: "Visualisez les tendances clés",
    icon: "📊"
  }
]

const handleStartClick = () => {
  showAnalyzer.value = true
}

const handleAddUrl = () => {
  // Logique d'ajout d'URL
  success.value = true
  setTimeout(() => {
    success.value = false
  }, 2000)
}

onMounted(() => {
  setTimeout(() => {
    showAnimation.value = false
  }, 6000) // 2 cycles de 3 secondes

  // Changer de step toutes les 3 secondes
  const interval = setInterval(() => {
    if (currentStep.value < 2) {
      currentStep.value++
    } else {
      clearInterval(interval)
      // Afficher les cartes explicatives après la dernière animation
      setTimeout(() => {
        showSteps.value = true
      }, 1000)
    }
  }, 3000)
})
</script>

<template>
  <main class="min-h-screen relative overflow-hidden">
    <!-- Fond abstrait -->
    <div class="fixed inset-0 pointer-events-none overflow-hidden">
      <!-- Stripe-style gradient -->
      <div class="absolute -inset-[10%] opacity-75">
        <div class="absolute top-0 -left-[25%] w-[150%] h-[100%] bg-gradient-to-r from-[#0B1EDC] via-[#00D1FF] to-[#0047FF] blur-[80px] animate-slow-spin" />
        <div class="absolute bottom-0 -right-[25%] w-[150%] h-[100%] bg-gradient-to-r from-[#0047FF] via-[#00D1FF] to-[#0B1EDC] blur-[80px] animate-slow-spin-reverse" />
      </div>

      <!-- Filtre fixe très léger -->
      <div class="absolute inset-0 bg-background/50 backdrop-blur-[1px]" />
      
      <!-- Noise texture subtile -->
      <div 
        class="absolute inset-0 opacity-[0.15] mix-blend-soft-light"
        style="background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJub2lzZSIgeD0iMCIgeT0iMCIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSI+PGZlVHVyYnVsZW5jZSBiYXNlRnJlcXVlbmN5PSIwLjgiIG51bU9jdGF2ZXM9IjQiIHN0aXRjaFRpbGVzPSJzdGl0Y2giIHR5cGU9ImZyYWN0YWxOb2lzZSIvPjxmZUNvbG9yTWF0cml4IHR5cGU9InNhdHVyYXRlIiB2YWx1ZXM9IjAiLz48L2ZpbHRlcj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgZmlsdGVyPSJ1cmwoI25vaXNlKSIgb3BhY2l0eT0iMC40Ii8+PC9zdmc+')"
      />
    </div>

    <!-- Landing page content -->
    <div class="relative flex flex-col items-center justify-center min-h-screen p-6 md:p-24">
      <!-- Page d'accueil -->
      <div 
        class="text-center max-w-4xl mx-auto transition-all duration-500 absolute inset-0 flex flex-col items-center justify-center"
        :class="{ 
          'opacity-0 translate-y-[-100%]': showAnalyzer,
          'opacity-100 translate-y-0': !showAnalyzer 
        }"
      >
        <!-- Badge en haut -->
        <div class="inline-flex items-center px-4 py-2 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 mb-8">
          <span class="text-sm text-white">✨ Propulsé par l'IA</span>
        </div>

        <h1 class="text-4xl md:text-6xl font-bold tracking-tight mb-6 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent leading-normal py-1">
          JobAnalyzer
          <span class="text-white relative inline-block">
            <span class="relative z-10 gradient-pulse">IA</span>
          </span>
        </h1>

        <p class="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-12">
          Analysez vos offres freelance avec l'intelligence artificielle
        </p>

        <!-- Animations côte à côte -->
        <div class="w-full max-w-4xl mx-auto mb-12">
          <div class="grid grid-cols-3 gap-6">
            <!-- Animation URL -->
            <div class="flex items-center justify-center h-[200px] relative bg-black/20 backdrop-blur-sm border border-white/10 rounded-lg">
              <div class="url-demo-container">
                <span class="url-text">https://www.linkedin.com/jobs/view/...</span>
              </div>
            </div>

            <!-- Animation Scan -->
            <div class="flex items-center justify-center h-[200px] relative bg-black/20 backdrop-blur-sm border border-white/10 rounded-lg">
              <div class="scan-container">
                <div class="scan-content">
                  <div class="scan-line"></div>
                  <div class="scan-text">
                    <div>Salaire: <span class="text-[#00D1FF]">Analysé ✓</span></div>
                    <div>Stack: <span class="text-[#00D1FF]">Analysé ✓</span></div>
                    <div>Remote: <span class="text-[#00D1FF]">Analysé ���</span></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Animation Insights -->
            <div class="flex items-center justify-center h-[200px] relative bg-black/20 backdrop-blur-sm border border-white/10 rounded-lg">
              <div class="insights-container">
                <!-- Graphique en camembert pour les technos -->
                <div class="pie-chart">
                  <div class="pie-segment" style="--rotation: 0deg; --size: 120deg"></div>
                  <div class="pie-segment" style="--rotation: 120deg; --size: 90deg"></div>
                  <div class="pie-segment" style="--rotation: 210deg; --size: 150deg"></div>
                  <div class="pie-label">Technos</div>
                </div>

                <!-- Graphique en barres pour les TJM -->
                <div class="bar-chart">
                  <div class="bar" style="--height: 80%">
                    <div class="bar-label">TJM</div>
                  </div>
                </div>

                <!-- Graphique en ligne pour la fréquence -->
                <div class="line-chart">
                  <svg width="80" height="60" viewBox="0 0 80 60">
                    <path class="line-path" d="M0,30 Q20,10 40,40 T80,20" fill="none" stroke="#00D1FF" stroke-width="2"/>
                  </svg>
                  <div class="line-label">Fréquence</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button 
            size="lg" 
            variant="primary" 
            @click="handleStartClick" 
            class="min-w-[200px] h-11"
          >
            Ajouter des offres
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            class="min-w-[200px] h-11"
          >
            En savoir plus
          </Button>
        </div>

        <!-- Metrics/Social proof -->
        <div class="mt-16 pt-8 border-t border-white/10">
          <div class="flex flex-wrap justify-center gap-8">
            <div class="text-center">
              <div class="text-2xl font-bold text-white">100+</div>
              <div class="text-sm text-gray-400">Offres analysées</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-white">24h</div>
              <div class="text-sm text-gray-400">Temps moyen d'analyse</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-white">95%</div>
              <div class="text-sm text-gray-400">Taux de satisfaction</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Interface d'analyse avec les cartes explicatives -->
      <div 
        class="absolute inset-0 transition-all duration-800 ease-in-out flex items-center justify-center"
        :class="{ 
          'opacity-0 translate-y-[100%]': !showAnalyzer,
          'opacity-100 translate-y-0': showAnalyzer 
        }"
      >
        <div class="w-full max-w-3xl p-6 transition-all duration-inherit">
          <div class="flex justify-between items-center mb-8">
            <h2 class="text-2xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
              Analysez vos offres
            </h2>
            <Button 
              variant="outline" 
              @click="showAnalyzer = false" 
              class="px-6 h-11 flex items-center gap-2"
            >
              <svg 
                class="w-4 h-4" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  stroke-linecap="round" 
                  stroke-linejoin="round" 
                  stroke-width="2" 
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Retour
            </Button>
          </div>

          <!-- Cartes explicatives -->
          <div class="grid gap-6 md:grid-cols-3 mb-8">
            <div 
              v-for="(step, index) in steps" 
              :key="index"
              class="relative flex flex-col items-center justify-center p-6 rounded-lg bg-black/20 backdrop-blur-sm border border-white/10 min-h-[200px]"
            >
              <div class="absolute -top-2 -left-2 w-8 h-8 rounded-full bg-[#00D1FF] flex items-center justify-center text-black font-medium z-10">
                {{ index + 1 }}
              </div>
              
              <div class="flex flex-col items-center justify-center space-y-3 text-center">
                <div class="text-3xl">{{ step.icon }}</div>
                <h4 class="text-lg font-medium text-white">{{ step.title }}</h4>
                <p class="text-sm text-gray-400">{{ step.description }}</p>
              </div>
            </div>
          </div>

          <!-- Formulaire d'analyse -->
          <OfferAnalysisForm v-if="showAnalyzer" />
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.translate-y-\[-100\%\] {
  transform: translateY(-100%);
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 800ms;
}

.translate-y-\[100\%\] {
  transform: translateY(100%);
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 800ms;
}

/* Transitions plus douces et synchronisées */
.transition-all {
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 800ms;
  transition-property: all;
}

.duration-800 {
  transition-duration: 800ms;
}

.duration-inherit {
  transition-duration: inherit;
}

.ease-in-out {
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Animation de glow sur le hover des boutons */
button:hover {
  box-shadow: 0 0 20px rgba(0, 209, 255, 0.3);
}

/* Animation subtile du fond */
@keyframes float {
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  25% { transform: translate(2%, 2%) rotate(1deg); }
  75% { transform: translate(-2%, -2%) rotate(-1deg); }
}

/* On cible uniquement le conteneur des dégradés */
.fixed > div:first-child {
  animation: float 20s infinite ease-in-out;
}

@keyframes border-glow {
  0% {
    background: conic-gradient(
      from 0deg at 50% 50%,
      rgba(255, 255, 255, 0) 0deg,
      rgba(255, 255, 255, 0.8) 60deg,
      rgba(255, 255, 255, 0.9) 120deg,
      rgba(255, 255, 255, 0.8) 180deg,
      rgba(255, 255, 255, 0) 240deg
    );
    transform: rotate(0deg);
  }
  100% {
    background: conic-gradient(
      from 0deg at 50% 50%,
      rgba(255, 255, 255, 0) 0deg,
      rgba(255, 255, 255, 0.8) 60deg,
      rgba(255, 255, 255, 0.9) 120deg,
      rgba(255, 255, 255, 0.8) 180deg,
      rgba(255, 255, 255, 0) 240deg
    );
    transform: rotate(360deg);
  }
}

.animate-border-glow {
  animation: border-glow 3s linear infinite;
  padding: 3px;
  filter: blur(3px);
  border-radius: 4px;
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
}

@keyframes slow-spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes slow-spin-reverse {
  0% {
    transform: rotate(360deg);
  }
  100% {
    transform: rotate(0deg);
  }
}

.animate-slow-spin {
  animation: slow-spin 30s linear infinite;
  will-change: transform;
}

.animate-slow-spin-reverse {
  animation: slow-spin-reverse 30s linear infinite;
  will-change: transform;
}

.gradient-pulse {
  background: linear-gradient(
    to right,
    #00D1FF,
    #0047FF,
    #0B1EDC,
    #00D1FF
  );
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  animation: gradient-shift 8s ease infinite;
  background-size: 300% auto;
  text-shadow: 0 0 20px rgba(0, 209, 255, 0.5);
}

@keyframes gradient-shift {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.url-demo-container {
  position: relative;
  transform-origin: center;
  padding: 8px 16px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.url-text {
  display: block;
  white-space: nowrap;
  overflow: hidden;
  color: #00D1FF;
  font-family: monospace;
  font-size: 14px;
  border-right: 2px solid #00D1FF;
  width: 0;
  animation: typing 3s steps(40) infinite;
}

@keyframes typing {
  0% {
    width: 0;
  }
  50% {
    width: 280px;
  }
  100% {
    width: 0;
  }
}

.scan-container {
  width: 80%;
  position: relative;
  overflow: hidden;
}

.scan-line {
  position: absolute;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, transparent, #00D1FF, transparent);
  animation: scan-move 3s ease-in-out infinite;
}

.scan-text {
  display: flex;
  flex-direction: column;
  gap: 8px;
  opacity: 0.7;
}

@keyframes scan-move {
  0% {
    top: 0;
    opacity: 0;
  }
  20% {
    opacity: 1;
  }
  80% {
    opacity: 1;
  }
  100% {
    top: 100%;
    opacity: 0;
  }
}

.insights-container {
  display: flex;
  align-items: center;
  justify-content: space-around;
  width: 100%;
  padding: 0 20px;
  gap: 20px;
}

/* Styles pour le camembert */
.pie-chart {
  width: 60px;
  height: 60px;
  position: relative;
  border-radius: 50%;
  background: transparent;
  animation: rotate-pie 3s ease-in-out infinite;
}

.pie-segment {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  clip-path: polygon(50% 50%, 50% 0%, 100% 0%, 100% 100%, 50% 100%);
  background: linear-gradient(90deg, #00D1FF, #0047FF);
  transform-origin: 50% 50%;
  transform: rotate(var(--rotation));
  animation: show-segment 3s ease-in-out infinite;
}

.pie-label {
  position: absolute;
  bottom: -20px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 10px;
  color: #00D1FF;
  white-space: nowrap;
}

/* Styles pour le graphique en barres */
.bar-chart {
  width: 40px;
  height: 60px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.bar {
  width: 100%;
  background: linear-gradient(180deg, #00D1FF 0%, #0047FF 100%);
  border-radius: 4px;
  animation: grow-bar 3s ease-in-out infinite;
}

.bar-label {
  position: absolute;
  bottom: -20px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 10px;
  color: #00D1FF;
  white-space: nowrap;
}

/* Styles pour le graphique en ligne */
.line-chart {
  position: relative;
  width: 80px;
  height: 60px;
}

.line-path {
  stroke-dasharray: 150;
  stroke-dashoffset: 150;
  animation: draw-line 3s ease-in-out infinite;
}

.line-label {
  position: absolute;
  bottom: -20px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 10px;
  color: #00D1FF;
  white-space: nowrap;
}

@keyframes rotate-pie {
  0% { transform: scale(0.5) rotate(0deg); opacity: 0; }
  20% { transform: scale(1) rotate(0deg); opacity: 1; }
  80% { transform: scale(1) rotate(360deg); opacity: 1; }
  100% { transform: scale(0.5) rotate(720deg); opacity: 0; }
}

@keyframes show-segment {
  0% { opacity: 0; }
  20% { opacity: 1; }
  80% { opacity: 1; }
  100% { opacity: 0; }
}

@keyframes draw-line {
  0% { stroke-dashoffset: 150; opacity: 0; }
  20% { stroke-dashoffset: 0; opacity: 1; }
  80% { stroke-dashoffset: 0; opacity: 1; }
  100% { stroke-dashoffset: -150; opacity: 0; }
}

.delay-1000 {
  animation-delay: 1s;
}

.delay-2000 {
  animation-delay: 2s;
}

@keyframes fade-in {
  0% {
    opacity: 0;
    transform: translateY(10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
