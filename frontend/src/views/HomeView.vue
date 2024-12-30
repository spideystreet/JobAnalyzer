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
  <!-- Container principal -->
  <main class="min-h-screen relative">
    <!-- Fond abstrait -->
    <div class="fixed inset-0 pointer-events-none overflow-hidden">
      <!-- Stripe-style gradient -->
      <div class="absolute -inset-[10%] opacity-75">
        <div class="absolute top-0 -left-[25%] w-[150%] h-[100%] bg-gradient-to-r from-[#0B1EDC] via-[#00D1FF] to-[#0047FF] blur-[80px] animate-slow-spin" />
        <div class="absolute bottom-0 -right-[25%] w-[150%] h-[100%] bg-gradient-to-r from-[#0047FF] via-[#00D1FF] to-[#0B1EDC] blur-[80px] animate-slow-spin-reverse" />
      </div>
    </div>

    <!-- Conteneur des pages -->
    <div class="relative min-h-screen">
      <!-- Landing page -->
      <div 
        class="absolute inset-0 min-h-screen flex flex-col items-center justify-center p-6 md:p-24 transition-all duration-700 ease-out"
        :class="{ 
          'opacity-0 pointer-events-none scale-95 -translate-y-6': showAnalyzer,
          'opacity-100 scale-100 translate-y-0': !showAnalyzer 
        }"
      >
        <!-- Badge en haut -->
        <div class="inline-flex items-center px-4 py-2 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 mb-8">
          <span class="text-sm text-white">✨ Propulsé par l'IA</span>
        </div>

        <h1 class="text-4xl md:text-6xl font-bold tracking-tight mb-6 text-white leading-normal py-1">
          JobAnalyzer
          <span class="text-white relative inline-block">
            <span class="relative z-10 gradient-pulse">IA</span>
          </span>
        </h1>

        <p class="text-lg md:text-xl text-white max-w-2xl mx-auto mb-12">
          Analysez vos offres freelance avec l'intelligence artificielle
        </p>

        <!-- Animations Section -->
        <div class="grid gap-8 md:grid-cols-3 mb-12 max-w-5xl mx-auto">
          <!-- Animation 1: URL -->
          <div class="relative">
            <!-- Badge numéroté -->
            <div class="absolute left-1/2 top-0 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white border border-white/10 flex items-center justify-center z-10 shadow-lg">
              <span class="text-xs font-medium text-black">1</span>
            </div>
            
            <div class="flex flex-col h-[240px] bg-[#111111] border border-white/5 rounded-lg overflow-hidden">
              <!-- Contenu principal -->
              <div class="flex-1 flex items-center justify-center p-8">
                <div class="url-demo-container bg-black/30 backdrop-blur-sm border border-white/5 rounded-md px-4 py-2 w-[280px]">
                  <div class="flex items-center justify-center text-[#00D1FF] space-x-2 overflow-hidden">
                    <span class="text-sm opacity-50">http://</span>
                    <span class="typing-text">job.com</span>
                  </div>
                </div>
              </div>

              <!-- Conteneur de titre uniformisé -->
              <div class="h-[60px] px-6 py-4 border-t border-white/5 flex items-center justify-center">
                <div class="text-sm font-medium text-white/80">
                  Collez
                </div>
              </div>
            </div>
          </div>

          <!-- Animation 2: Scan -->
          <div class="relative">
            <!-- Badge numéroté -->
            <div class="absolute left-1/2 top-0 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white border border-white/10 flex items-center justify-center z-10 shadow-lg">
              <span class="text-xs font-medium text-black">2</span>
            </div>
            
            <div class="flex flex-col h-[240px] bg-[#111111] border border-white/5 rounded-lg overflow-hidden">
              <!-- Contenu principal -->
              <div class="flex-1 flex items-center justify-center p-8">
                <div class="scan-container">
                  <div class="scan-content">
                    <!-- Robot avec cercle de chargement -->
                    <div class="robot-container">
                      <div class="loading-ring">
                        <svg class="spinner" viewBox="0 0 60 60">
                          <defs>
                            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                              <stop offset="0%" style="stop-color: #00D1FF" />
                              <stop offset="100%" style="stop-color: #0047FF" />
                            </linearGradient>
                          </defs>
                          <circle
                            class="path"
                            cx="30"
                            cy="30"
                            r="25"
                            fill="none"
                            stroke="url(#gradient)"
                            stroke-width="2"
                          ></circle>
                        </svg>
                      </div>
                      <div class="robot absolute">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" class="robot-head">
                          <defs>
                            <linearGradient id="robotGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                              <stop offset="0%" style="stop-color: #00D1FF" />
                              <stop offset="100%" style="stop-color: #0047FF" />
                            </linearGradient>
                          </defs>
                          <path d="M12 2L20 7V17L12 22L4 17V7L12 2Z" stroke="url(#robotGradient)" stroke-width="2"/>
                          <circle cx="12" cy="12" r="3" stroke="url(#robotGradient)" stroke-width="2" class="robot-eye"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Conteneur de titre uniformisé -->
              <div class="h-[60px] px-6 py-4 border-t border-white/5 flex items-center justify-center">
                <div class="text-sm font-medium text-white/80">
                  Analysez
                </div>
              </div>
            </div>
          </div>

          <!-- Animation 3: Visualisation -->
          <div class="relative">
            <!-- Badge numéroté -->
            <div class="absolute left-1/2 top-0 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white border border-white/10 flex items-center justify-center z-10 shadow-lg">
              <span class="text-xs font-medium text-black">3</span>
            </div>
            
            <div class="flex flex-col h-[240px] bg-[#111111] border border-white/5 rounded-lg overflow-hidden">
              <!-- Contenu principal -->
              <div class="flex-1 flex items-center justify-center p-8">
                <div class="data-viz-container">
                  <div class="bars-container">
                    <div class="bar-item">
                      <div class="bar-label">A</div>
                      <div class="viz-bar"></div>
                    </div>
                    <div class="bar-item">
                      <div class="bar-label">B</div>
                      <div class="viz-bar"></div>
                    </div>
                    <div class="bar-item">
                      <div class="bar-label">C</div>
                      <div class="viz-bar"></div>
                    </div>
                    <div class="bar-item">
                      <div class="bar-label">D</div>
                      <div class="viz-bar"></div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Conteneur de titre uniformisé -->
              <div class="h-[60px] px-6 py-4 border-t border-white/5 flex items-center justify-center">
                <div class="text-sm font-medium text-white/80">
                  Visualisez
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Bouton unique -->
        <div class="flex items-center justify-center mt-8">
          <Button 
            size="lg" 
            variant="primary" 
            @click="handleStartClick" 
            class="min-w-[200px] h-11 bg-white hover:bg-white/90 transition-all duration-150 relative group"
          >
            <div class="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-150"></div>
            <span class="relative z-10 bg-gradient-to-r from-[#00D1FF] to-[#0047FF] bg-clip-text text-transparent font-medium">
              Ajouter des offres
            </span>
          </Button>
        </div>

        <!-- Metrics/Social proof -->
        <div class="mt-16 pt-8 border-t border-white/10">
          <div class="flex flex-wrap justify-center gap-8">
            <div class="text-center">
              <div class="text-2xl font-bold text-white">100+</div>
              <div class="text-sm text-white">Offres analysées</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-white">24h</div>
              <div class="text-sm text-white">Temps moyen d'analyse</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-white">95%</div>
              <div class="text-sm text-white">Taux de satisfaction</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Page d'analyse -->
      <div 
        class="absolute inset-0 min-h-screen flex items-center justify-center p-6 md:p-24 transition-all duration-700 ease-out"
        :class="{ 
          'opacity-0 pointer-events-none scale-95 translate-y-6': !showAnalyzer,
          'opacity-100 scale-100 translate-y-0': showAnalyzer 
        }"
      >
        <div class="w-full max-w-4xl">
          <!-- En-tête -->
          <div class="flex justify-between items-center mb-8">
            <h2 class="text-3xl md:text-4xl font-bold tracking-tight text-white">
              Analysez vos offres
              <span class="text-white relative inline-block">
                <span class="relative z-10 bg-gradient-to-r from-[#00D1FF] to-[#0047FF] bg-clip-text text-transparent">freelance</span>
              </span>
            </h2>
            <Button 
              variant="outline" 
              @click="showAnalyzer = false" 
              class="px-6 h-11 flex items-center gap-2 bg-[#111111] border border-white/5 hover:bg-black/90 transition-all duration-150 group"
            >
              <svg 
                class="w-4 h-4 text-[#00D1FF] group-hover:translate-x-[-2px] transition-transform duration-150" 
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
              <span class="bg-gradient-to-r from-[#00D1FF] to-[#0047FF] bg-clip-text text-transparent font-medium">
                Retour
              </span>
            </Button>
          </div>

          <!-- Conteneur principal avec le même style que nos cartes -->
          <div class="bg-[#111111] border border-white/5 rounded-lg p-8 shadow-xl backdrop-blur-sm relative overflow-hidden group">
            <!-- Effet de glow subtil au hover -->
            <div class="absolute inset-0 bg-gradient-to-r from-[#00D1FF] to-[#0047FF] opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none"></div>
            
            <!-- Formulaire d'analyse -->
            <OfferAnalysisForm v-if="showAnalyzer" />
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.translate-y-\[-100\%\] {
  transform: translateY(-100%);
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 1000ms;
}

.translate-y-\[100\%\] {
  transform: translateY(100%);
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 1000ms;
}

/* Transitions plus douces et synchronisées */
.transition-all {
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 700ms;
  transition-property: all;
}

.duration-700 {
  transition-duration: 700ms;
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
  0%, 100% { transform: none; }
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
  animation: none;
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

.animate-slow-spin,
.animate-slow-spin-reverse {
  animation: none;
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
  overflow: hidden;
}

.url-demo-container::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at center, rgba(0, 209, 255, 0.1), transparent 70%);
  opacity: 0;
  animation: pulse 4s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
}

.url-text {
  position: relative;
  font-family: monospace;
  font-size: 14px;
  color: #00D1FF;
}

.url-text::after {
  content: 'job.com';
  position: absolute;
  left: 0;
  top: 0;
  width: 0;
  border-right: 2px solid #00D1FF;
  white-space: nowrap;
  overflow: hidden;
  animation: typing 4s cubic-bezier(0.4, 0.0, 0.2, 1) infinite;
}

@keyframes typing {
  0%, 100% {
    width: 0;
  }
  30%, 70% {
    width: 7ch;
  }
}

.scan-container {
  width: 100%;
  max-width: 280px;
  height: 100%;
}

.scan-content {
  background: rgba(0, 209, 255, 0.02);
  border-radius: 8px;
  padding: 1rem;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.scan-text {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-size: 12px;
  flex-grow: 1;
}

.scan-item {
  padding: 3px 6px;
  background: rgba(0, 209, 255, 0.03);
  border-radius: 4px;
  opacity: 0;
  transform: translateX(-10px);
  animation: slideIn 0.5s ease forwards;
  min-height: 24px;
}

.scan-item:nth-child(1) { animation-delay: 0.2s; }
.scan-item:nth-child(2) { animation-delay: 0.4s; }
.scan-item:nth-child(3) { animation-delay: 0.6s; }

.scan-item span {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.scan-item span::before {
  content: '';
  display: inline-block;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: #00D1FF;
  animation: pulseDot 2s ease-in-out infinite;
}

@keyframes pulseDot {
  0%, 100% { transform: scale(1); opacity: 0.5; }
  50% { transform: scale(1.5); opacity: 1; }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Animation des graphiques */
.insights-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  width: 100%;
  max-width: 280px;
  margin: 0 auto;
}

.pie-chart {
  position: relative;
  width: 50px;
  height: 50px;
  margin: 0 auto;
}

.pie-segment {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: linear-gradient(90deg, #00D1FF, #0047FF);
  opacity: 0;
  transform: scale(0.95);
  animation: fadeInScale 0.8s ease forwards;
}

.pie-segment:nth-child(1) {
  animation-delay: 0.2s;
  clip-path: polygon(50% 50%, 50% 0%, 100% 0%, 100% 100%, 50% 100%);
}

.pie-segment:nth-child(2) {
  animation-delay: 0.4s;
  clip-path: polygon(50% 50%, 0% 0%, 50% 0%, 50% 100%, 0% 100%);
}

.pie-segment:nth-child(3) {
  animation-delay: 0.6s;
  clip-path: polygon(50% 50%, 0% 100%, 0% 0%, 50% 0%);
}

.bar-chart {
  width: 30px;
  height: 50px;
  margin: 0 auto;
  position: relative;
}

.bar {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100%;
  background: linear-gradient(180deg, #00D1FF 0%, #0047FF 100%);
  border-radius: 4px;
  opacity: 0;
  transform: scaleY(0);
  transform-origin: bottom;
  animation: growBar 1s ease-out forwards;
  animation-delay: 0.8s;
}

.line-chart {
  width: 50px;
  height: 50px;
  margin: 0 auto;
  position: relative;
}

.line-path {
  stroke: #00D1FF;
  stroke-width: 2;
  fill: none;
  stroke-dasharray: 100;
  stroke-dashoffset: 100;
  animation: drawLine 1.5s ease-out forwards;
  animation-delay: 1s;
}

@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes growBar {
  from {
    opacity: 0;
    transform: scaleY(0);
  }
  to {
    opacity: 1;
    transform: scaleY(1);
  }
}

@keyframes drawLine {
  to {
    stroke-dashoffset: 0;
  }
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

/* Nouvelle animation de frappe pour l'URL */
.typing-text {
  overflow: hidden;
  border-right: 2px solid #00D1FF;
  white-space: nowrap;
  font-family: monospace;
  font-size: 14px;
  background: linear-gradient(to right, #00D1FF, #0047FF);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  animation: typing 4s ease-in-out infinite;
}

@keyframes typing {
  0%, 100% {
    width: 0;
  }
  30%, 70% {
    width: 7ch;
  }
}

/* Ajout d'un effet de hover subtil */
.bg-\[\#111111\] {
  transition: border-color 0.2s ease;
}

.bg-\[\#111111\]:hover {
  border-color: rgba(255, 255, 255, 0.1);
}

/* Style pour le bouton avec glow */
.group:hover {
  box-shadow: 0 0 15px rgba(0, 209, 255, 0.2);
  transition: all 300ms ease;
}

.group {
  transition: all 150ms ease;
}

.robot-container {
  position: relative;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 0.5rem;
  flex-shrink: 0;
}

.robot {
  position: relative;
}

.robot-head {
  filter: drop-shadow(0 0 8px rgba(0, 209, 255, 0.5));
}

.robot-eye {
  animation: pulse 3s ease-in-out infinite;
}

.scan-beam {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, 
    transparent 0%, 
    rgba(0, 209, 255, 0.5) 20%,
    #00D1FF 50%,
    rgba(0, 209, 255, 0.5) 80%,
    transparent 100%
  );
  animation: scan 3s ease-in-out infinite;
  filter: blur(1px);
}

.scan-content {
  background: rgba(0, 209, 255, 0.02);
  border-radius: 8px;
  padding: 1.5rem;
  position: relative;
  overflow: hidden;
}

.scan-text {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.scan-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem;
  background: rgba(0, 209, 255, 0.03);
  border-radius: 6px;
  opacity: 0;
  transform: translateX(-10px);
  animation: slideIn 0.5s ease forwards;
}

.scan-item:nth-child(1) { animation-delay: 0.2s; }
.scan-item:nth-child(2) { animation-delay: 0.4s; }
.scan-item:nth-child(3) { animation-delay: 0.6s; }

.label {
  color: rgba(255, 255, 255, 0.7);
}

.status {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #00D1FF;
}

.dot {
  width: 6px;
  height: 6px;
  background: #00D1FF;
  border-radius: 50%;
  animation: pulseDot 2s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: none; }
}

@keyframes scan {
  0%, 100% { transform: translateY(15px); opacity: 0; }
  50% { transform: translateY(-15px); opacity: 0.7; }
}

@keyframes pulse {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes pulseDot {
  0%, 100% { transform: scale(1); opacity: 0.5; }
  50% { transform: scale(1.5); opacity: 1; }
}

.terminal-style {
  font-family: 'Menlo', 'Monaco', 'Courier New', monospace;
  font-size: 11px;
}

.terminal-style .scan-item {
  padding: 4px 8px;
  background: transparent;
}

.terminal-style .label {
  color: rgba(255, 255, 255, 0.9);
}

.terminal-success {
  color: #00D1FF !important;
}

.scan-item:nth-child(1) { animation-delay: 0s; }
.scan-item:nth-child(2) { animation-delay: 0.5s; }
.scan-item:nth-child(3) { animation-delay: 1.5s; }
.scan-item:nth-child(4) { animation-delay: 2.5s; }
.scan-item:nth-child(5) { animation-delay: 3.5s; }
.scan-item:nth-child(6) { animation-delay: 4.5s; }

.dot {
  width: 4px;
  height: 4px;
  background: #00D1FF;
  border-radius: 50%;
  animation: pulseDot 1s ease-in-out infinite;
  margin-left: 6px;
}

/* Styles pour le cercle de progression */
.loading-ring {
  position: absolute;
  width: 60px;
  height: 60px;
}

.spinner {
  animation: rotate 4s linear infinite;
  width: 60px;
  height: 60px;
}

.path {
  stroke: url(#gradient);
  stroke-linecap: round;
  animation: dash 3s ease-in-out infinite;
}

@keyframes rotate {
  100% {
    transform: rotate(360deg);
  }
}

@keyframes dash {
  0% {
    stroke-dasharray: 1, 150;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -35;
  }
  100% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -124;
  }
}

/* Styles pour l'animation de récolte de données */
.data-collection-container {
  position: relative;
  width: 200px;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.data-points {
  position: absolute;
  width: 100%;
  height: 100%;
}

.data-point {
  position: absolute;
  width: 6px;
  height: 6px;
  background: #00D1FF;
  border-radius: 50%;
  opacity: 0;
  animation: dataPointAppear 3s infinite;
}

.data-point:nth-child(1) { top: 20%; left: 20%; animation-delay: 0s; }
.data-point:nth-child(2) { top: 20%; right: 20%; animation-delay: 0.3s; }
.data-point:nth-child(3) { bottom: 20%; left: 20%; animation-delay: 0.6s; }
.data-point:nth-child(4) { bottom: 20%; right: 20%; animation-delay: 0.9s; }
.data-point:nth-child(5) { top: 50%; left: 10%; animation-delay: 1.2s; }
.data-point:nth-child(6) { top: 50%; right: 10%; animation-delay: 1.5s; }
.data-point:nth-child(7) { top: 10%; left: 50%; animation-delay: 1.8s; }
.data-point:nth-child(8) { bottom: 10%; left: 50%; animation-delay: 2.1s; }
.data-point:nth-child(9) { top: 50%; left: 50%; animation-delay: 2.4s; }

.data-collection-circle {
  position: absolute;
  width: 40px;
  height: 40px;
  border: 2px solid #00D1FF;
  border-radius: 50%;
  animation: pulseCircle 3s infinite;
}

@keyframes dataPointAppear {
  0% { 
    opacity: 0;
    transform: scale(0);
  }
  20% {
    opacity: 1;
    transform: scale(1);
  }
  80% {
    opacity: 1;
    transform: scale(1);
  }
  100% {
    opacity: 0;
    transform: scale(0);
  }
}

@keyframes pulseCircle {
  0% {
    transform: scale(1);
    opacity: 0.5;
  }
  50% {
    transform: scale(1.5);
    opacity: 0.2;
  }
  100% {
    transform: scale(1);
    opacity: 0.5;
  }
}

/* Alignement des titres */
.flex-col > .px-6.py-4 {
  height: 56px; /* Hauteur fixe pour tous les titres */
  display: flex;
  align-items: center;
}

.flex-col > .px-6.py-4 > .text-sm {
  line-height: 1;
}

/* Styles pour la visualisation de données */
.data-viz-container {
  width: 200px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
}

.bars-container {
  width: 100%;
  height: 100px;
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
  padding: 0 20px;
}

.bar-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  gap: 4px;
}

.bar-label {
  color: #00D1FF;
  font-size: 10px;
  opacity: 0;
  animation: fadeIn 0.5s ease forwards;
}

.viz-bar {
  width: 16px;
  background: linear-gradient(180deg, #00D1FF 0%, #0047FF 100%);
  border-radius: 3px;
  opacity: 0;
  height: 0;
  animation: growBar 2s ease forwards, subtlePulse 2s ease-in-out infinite;
  transform-origin: bottom;
  box-shadow: 0 0 10px rgba(0, 209, 255, 0.3);
}

.bar-item:nth-child(1) .viz-bar { 
  animation-delay: 0.4s, 2.0s;
  height: 60%;
}

.bar-item:nth-child(2) .viz-bar {
  animation-delay: 0.8s, 2.2s;
  height: 45%;
}

.bar-item:nth-child(3) .viz-bar {
  animation-delay: 1.2s, 2.4s;
  height: 70%;
}

.bar-item:nth-child(4) .viz-bar {
  animation-delay: 1.6s, 2.6s;
  height: 50%;
}

.bar-item:nth-child(1) .bar-label { animation-delay: 0.4s; }
.bar-item:nth-child(2) .bar-label { animation-delay: 0.8s; }
.bar-item:nth-child(3) .bar-label { animation-delay: 1.2s; }
.bar-item:nth-child(4) .bar-label { animation-delay: 1.6s; }

@keyframes growBar {
  from {
    opacity: 0;
    transform: scaleY(0);
  }
  to {
    opacity: 1;
    transform: scaleY(1);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Style uniformisé pour les conteneurs de titre */
.flex-col > div:last-child {
  height: 60px;
  min-height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

/* Ajustement de la hauteur du contenu principal */
.flex-1 {
  height: calc(100% - 60px);
  min-height: calc(100% - 60px);
}

/* Style du titre */
.text-sm {
  line-height: 1;
  margin: 0;
  text-align: center;
}

@keyframes subtlePulse {
  0%, 100% {
    transform: scaleY(1);
    filter: brightness(1);
  }
  50% {
    transform: scaleY(1.05);
    filter: brightness(1.2);
  }
}
</style>
