# 🤖 JobAnalyzer

Analyseur automatique d'offres d'emploi Freelances avec intelligence artificielle.

⚠️ **Note Importante** : Ce projet est en développement actif. Utilisez-le de manière éthique et responsable.

## 📋 Description

JobAnalyzer est une plateforme complète qui automatise l'analyse du marché freelance :
- Collecte automatique des offres depuis plusieurs plateformes
- Analyse intelligente avec IA pour extraire les informations clés
- Interface moderne et interactive pour explorer les données
- Insights en temps réel sur les tendances du marché

## 🏗 Architecture

### Frontend (Next.js 14 + Vercel)
- Application web moderne avec architecture App Router
- Interface utilisateur réactive et animations fluides
- Composants UI personnalisés et réutilisables
- Déploiement continu sur Vercel
- Mode sombre/clair natif
- Design responsive mobile-first

### Backend (Python + Airflow)
- Architecture microservices containerisée
- Pipeline de données automatisé avec Airflow
- Scraping intelligent multi-sources
- Analyse sémantique par IA
- Cache distribué avec Redis

## 🛠 Technologies & Stack

### Frontend
- **Framework** : Next.js 14 avec App Router
- **UI** : Shadcn/UI + Tailwind CSS
- **Animations** : Framer Motion
- **Icons** : Remix Icons + Simple Icons
- **State** : React Hooks
- **Build** : Turbopack
- **Déploiement** : Vercel Edge Network

### Backend
- **Runtime** : Python 3.10
- **Orchestration** : Apache Airflow
- **Cache** : Redis
- **Scraping** : Beautiful Soup 4
- **IA** : DeepSeek
- **Containers** : Docker + Docker Compose

## 📦 Structure du Projet

```
JobAnalyzer/
├── frontend/                 # Application Next.js
│   ├── src/
│   │   ├── app/             # Pages et routes
│   │   │   ├── page.tsx     # Landing page
│   │   │   └── dashboard/   # Interface d'analyse
│   │   ├── components/      # Composants React
│   │   │   └── ui/         # Composants UI réutilisables
│   │   └── lib/            # Utilitaires et hooks
│   ├── public/             # Assets statiques
│   └── tailwind.config.ts  # Configuration Tailwind
├── backend/
│   ├── airflow/            # Orchestration des tâches
│   │   └── dags/          # Pipelines de données
│   ├── scraper/           # Logique de scraping
│   │   ├── config/        # Configuration
│   │   └── core/          # Composants principaux
│   ├── infrastructure/    # Configuration cloud
│   └── models/           # Modèles de données
└── docker/               # Configuration Docker
    └── airflow/         # Setup Airflow
```

## 🔄 Workflow

1. **Collecte des Données**
   - DAGs Airflow planifiés pour le process ETL
   - Extraction intelligente des offres
   - Déduplication et nettoyage

2. **Traitement & Analyse**
   - Analyse sémantique par IA
   - Extraction des compétences et tendances
   - Enrichissement des données

3. **Présentation**
   - Interface utilisateur interactive
   - Visualisations dynamiques
   - Filtres et recherche avancée

## 🚀 Installation

### Prérequis
- Node.js 18+
- Python 3.10+
- Docker & Docker Compose

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Backend
```bash
# Configuration
cp .env.example .env

# Lancement
docker compose up --build
```

## 📊 Fonctionnalités

### Interface Utilisateur
- Landing page animée
- Dashboard d'analyse interactif
- Visualisations de données
- Mode sombre/clair
- Composants UI personnalisés
- Design responsive

### Backend & Data
- Scraping multi-sources
- Analyse IA des offres
- Cache intelligent
- Pipeline automatisé
- API REST (à venir)

## 📜 Licence

MIT License