<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Button from '@/components/ui/Button.vue'
import { useAnalysisStore } from '@/stores/analysis'

const router = useRouter()
const analysisStore = useAnalysisStore()

const steps = [
  {
    title: "Collez",
    description: "http:// job...",
    icon: "1"
  },
  {
    title: "Analysez",
    description: "",
    icon: "2"
  },
  {
    title: "Visualisez",
    description: "",
    icon: "3"
  }
]

const metrics = [
  {
    value: "100+",
    label: "Offres analysées"
  },
  {
    value: "24h",
    label: "Temps moyen d'analyse"
  },
  {
    value: "95%",
    label: "Taux de satisfaction"
  }
]

const handleStartAnalysis = () => {
  router.push('/analysis')
}
</script>

<template>
  <main class="min-h-screen relative">
    <!-- Fond abstrait -->
    <div class="fixed inset-0 pointer-events-none overflow-hidden">
      <div class="absolute -inset-[10%] opacity-75">
        <div class="absolute top-0 -left-[25%] w-[150%] h-[100%] bg-gradient-to-r from-[#0B1EDC] via-[#00D1FF] to-[#0047FF] blur-[80px]" />
        <div class="absolute bottom-0 -right-[25%] w-[150%] h-[100%] bg-gradient-to-r from-[#0047FF] via-[#00D1FF] to-[#0B1EDC] blur-[80px]" />
      </div>
    </div>

    <!-- Contenu principal -->
    <div class="relative min-h-screen flex flex-col items-center justify-center p-6 md:p-24">
      <!-- Badge IA -->
      <div class="inline-flex items-center px-3 py-1.5 rounded-full bg-[#111111]/30 backdrop-blur-sm border border-white/10 mb-8">
        <span class="text-xs text-white">🤖 Propulsé par l'IA</span>
      </div>

      <!-- Titre -->
      <h1 class="text-4xl md:text-6xl font-black tracking-tight mb-3 text-white" style="-webkit-text-stroke: 1px white;">
        JobAnalyzer
        <span class="text-white relative inline-block" style="-webkit-text-stroke: 0">
          <span class="relative z-10 gradient-pulse text-[105%] font-black">IA</span>
        </span>
      </h1>

      <p class="text-sm md:text-base text-gray-300 font-medium mb-12">Analysez vos offres freelance avec l'intelligence artificielle</p>

      <!-- Étapes -->
      <div class="grid gap-8 md:grid-cols-3 mb-12 max-w-5xl mx-auto">
        <!-- Étape 1: URL -->
        <div class="relative">
          <div class="absolute left-1/2 top-0 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white border border-white/10 flex items-center justify-center z-10 shadow-lg">
            <span class="text-xs font-medium text-black">1</span>
          </div>
          
          <div class="flex flex-col h-[240px] bg-[#111111] border border-white/5 rounded-lg overflow-hidden">
            <div class="flex-1 flex items-center justify-center p-8">
              <div class="url-demo-container bg-black/30 backdrop-blur-sm border border-white/5 rounded-md px-4 py-2 w-[280px]">
                <div class="flex items-center justify-center text-[#00D1FF] space-x-2 overflow-hidden">
                  <span class="text-sm opacity-50">http://</span>
                  <span class="typing-text">job.com</span>
                </div>
              </div>
            </div>

            <div class="h-[60px] px-6 py-4 border-t border-white/5 flex items-center justify-center">
              <div class="text-sm font-medium text-white/80">
                Collez
              </div>
            </div>
          </div>
        </div>

        <!-- Étape 2: Analyse -->
        <div class="relative">
          <div class="absolute left-1/2 top-0 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white border border-white/10 flex items-center justify-center z-10 shadow-lg">
            <span class="text-xs font-medium text-black">2</span>
          </div>
          
          <div class="flex flex-col h-[240px] bg-[#111111] border border-white/5 rounded-lg overflow-hidden">
            <div class="flex-1 flex items-center justify-center p-8">
              <div class="scan-container">
                <div class="scan-content">
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

            <div class="h-[60px] px-6 py-4 border-t border-white/5 flex items-center justify-center">
              <div class="text-sm font-medium text-white/80">
                Analysez
              </div>
            </div>
          </div>
        </div>

        <!-- Étape 3: Visualisation -->
        <div class="relative">
          <div class="absolute left-1/2 top-0 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white border border-white/10 flex items-center justify-center z-10 shadow-lg">
            <span class="text-xs font-medium text-black">3</span>
          </div>
          
          <div class="flex flex-col h-[240px] bg-[#111111] border border-white/5 rounded-lg overflow-hidden">
            <div class="flex-1 flex items-center justify-center p-8">
              <div class="data-viz-container">
                <div class="bars-container">
                  <div v-for="i in 4" :key="i" class="bar-item">
                    <div class="bar-label">{{ String.fromCharCode(64 + i) }}</div>
                    <div class="viz-bar"></div>
                  </div>
                </div>
              </div>
            </div>

            <div class="h-[60px] px-6 py-4 border-t border-white/5 flex items-center justify-center">
              <div class="text-sm font-medium text-white/80">
                Visualisez
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Bouton d'action -->
      <div class="flex items-center justify-center mt-8">
        <Button 
          size="lg" 
          variant="primary" 
          @click="handleStartAnalysis" 
          class="min-w-[240px] h-12 bg-white hover:bg-white/90 transition-all duration-150 relative group text-base"
        >
          <div class="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-150"></div>
          <span class="relative z-10 bg-gradient-to-r from-[#00D1FF] to-[#0047FF] bg-clip-text text-transparent font-medium">
            Ajouter des offres
          </span>
        </Button>
      </div>

      <!-- Métriques -->
      <div class="mt-16 pt-8 border-t border-white/10">
        <div class="flex flex-wrap justify-center gap-8">
          <div 
            v-for="metric in metrics" 
            :key="metric.label"
            class="text-center"
          >
            <div class="text-2xl font-bold text-white">{{ metric.value }}</div>
            <div class="text-sm text-white">{{ metric.label }}</div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

/* Animation du texte IA */
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
  text-shadow: 0 0 25px rgba(0, 209, 255, 0.6);
  font-weight: 900;
}

@keyframes gradient-shift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

/* Animation de l'URL */
.typing-text {
  position: relative;
  overflow: hidden;
  white-space: nowrap;
  border-right: 2px solid #00D1FF;
  animation: typing 4s cubic-bezier(0.4, 0.0, 0.2, 1) infinite, blink 0.8s ease-in-out infinite alternate;
  max-width: fit-content;
  margin: 0 auto;
  background: linear-gradient(to right, #00D1FF, #0047FF);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  font-family: 'Menlo', monospace;
  font-size: 14px;
}

@keyframes typing {
  0%, 100% { width: 0; opacity: 0.5; }
  10%, 90% { opacity: 1; }
  30%, 70% { width: 7ch; }
}

@keyframes blink {
  0% { border-color: #00D1FF; }
  100% { border-color: transparent; }
}

/* Animation du robot */
.robot-container {
  position: relative;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.robot-head {
  filter: drop-shadow(0 0 8px rgba(0, 209, 255, 0.5));
}

.robot-eye {
  animation: pulse 3s ease-in-out infinite;
}

.loading-ring {
  position: absolute;
  width: 60px;
  height: 60px;
}

.spinner {
  animation: rotate 8s linear infinite;
}

.path {
  stroke-linecap: round;
  stroke-dasharray: 90, 150;
  animation: infiniteDash 3s linear infinite;
}

@keyframes rotate {
  100% { transform: rotate(360deg); }
}

@keyframes infiniteDash {
  0% {
    stroke-dashoffset: 0;
  }
  100% {
    stroke-dashoffset: -240;
  }
}

/* Animation des barres de données */
.data-viz-container {
  width: 200px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.bars-container {
  width: 100%;
  height: 100px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 12px;
  padding: 0;
}

.bar-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  gap: 4px;
  width: 20px;
}

.bar-label {
  color: #00D1FF;
  font-size: 10px;
  opacity: 0;
  animation: fadeIn 0.5s ease forwards;
}

.viz-bar {
  width: 12px;
  background: linear-gradient(180deg, #00D1FF 0%, #0047FF 100%);
  border-radius: 6px;
  opacity: 1;
  transform-origin: bottom;
  box-shadow: 0 0 15px rgba(0, 209, 255, 0.4);
  position: relative;
  overflow: hidden;
  animation: barAnimation 3s ease-in-out infinite;
}

.bar-item:nth-child(1) .viz-bar { height: 85%; animation-delay: 0s; }
.bar-item:nth-child(2) .viz-bar { height: 65%; animation-delay: 0.5s; }
.bar-item:nth-child(3) .viz-bar { height: 95%; animation-delay: 1s; }
.bar-item:nth-child(4) .viz-bar { height: 75%; animation-delay: 1.5s; }

@keyframes barAnimation {
  0%, 100% { transform: scaleY(1); filter: brightness(1); }
  50% { transform: scaleY(0.92); filter: brightness(1.3); }
}

.viz-bar::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 200%;
  background: linear-gradient(
    to bottom,
    transparent,
    rgba(255, 255, 255, 0.2),
    transparent
  );
  animation: shineEffect 2s linear infinite;
}

@keyframes shineEffect {
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100%); }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Titre plus gras */
h1 {
  text-shadow: 0 0 30px rgba(255, 255, 255, 0.2);
  letter-spacing: -0.02em;
}
</style> 