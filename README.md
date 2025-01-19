# 🤖 JobAnalyzer

Analyseur automatique d'offres d'emploi Freelances avec intelligence artificielle.

⚠️ **Note Importante** : Ce projet est en développement actif. Utilisez-le de manière éthique et responsable.

## 📋 Description

JobAnalyzer est un outil qui :
- Scrape automatiquement les nouvelles offres Freelances
- Nettoie et structure le HTML des offres (96% de réduction)
- Analyse et catégorise les offres avec l'IA (DeepSeek)
- Stocke les données de manière structurée dans Redis
- Fournit des analyses de marché et des tendances

L'avantage de l'IA sera qu'elle peut péréniser les technos

## ⚠️ Avertissements

- Respectez les conditions d'utilisation des sites sources
- Ne partagez JAMAIS vos clés API (DeepSeek)
- Utilisez le rate limiting pour ne pas surcharger les sites
- Les données scrappées doivent être utilisées de manière éthique

## 🏗 Architecture

### Backend (Python)
- Multi-source scraping (Beautiful Soup)
  - Free-Work (Implémenté)
  - Malt (À venir)
  - Comet (À venir)
- Analyse IA (DeepSeek)
- Cache (Redis)
- Orchestration (Airflow)

### Pipeline de Données
1. **DAG 01 - Scraping** (`01_JOB_SCRAPING_dag.py`)
   - Extraction des URLs d'offres
   - Scraping du HTML détaillé
   - Mise en cache Redis

2. **DAG 02 - Transformation** (`02_JOB_TRANSFO.py`)
   - Nettoyage du HTML (96% de réduction)
   - Analyse IA avec DeepSeek
   - Stockage structuré

## 🛠 Technologies

- **Backend** : Python 3.10
- **Scraping** : Beautiful Soup 4
- **Cache** : Redis
- **IA** : DeepSeek
- **Orchestration** : Apache Airflow
- **Conteneurisation** : Docker & Docker Compose

## 📦 Structure du Projet

```
JobAnalyzer/
├── backend/
│   ├── airflow/           
│   │   ├── dags/         # DAGs Airflow
│   │   │   ├── 01_JOB_SCRAPING_dag.py
│   │   │   └── 02_JOB_TRANSFO.py
│   │   └── logs/        # Logs applicatifs
│   ├── scraper/          
│   │   ├── config/       # Configuration et settings
│   │   ├── core/         # Composants principaux
│   │   │   ├── list_scraper.py    # Extraction des URLs
│   │   │   ├── job_scraper.py     # Scraping détaillé
│   │   │   ├── job_analyzer.py    # Analyse DeepSeek
│   │   │   ├── html_cleaner.py    # Nettoyage HTML
│   │   │   └── cache.py           # Gestion Redis
│   │   └── tests/        # Tests unitaires
│   └── models/           # Modèles de données
├── docker/              
│   └── airflow/         # Configuration Airflow
└── scripts/             # Scripts utilitaires
```

## 🔒 Sécurité

1. **Variables d'environnement**
   - Ne JAMAIS commiter le fichier `.env`
   - Utiliser `.env.example` comme modèle
   - Stocker les secrets de manière sécurisée

2. **Rate Limiting**
   - Respecter les limites d'API
   - Délais configurables entre les requêtes
   - Gestion des erreurs avec retry

## 🚀 Installation

1. **Prérequis**
   - Docker & Docker Compose
   - Clé API DeepSeek

2. **Configuration**
   ```bash
   # Copier le fichier d'exemple
   cp .env.example .env
   
   # Configurer dans .env :
   DEEPSEEK_API_KEY=votre_clé_api
   ```

3. **Lancement**
   ```bash
   # Construction et démarrage
   docker compose up --build

   # Vérification des services
   docker compose ps
   ```

## 🔄 Pipeline de Données

1. **Scraping (DAG 01)**
   - Extraction quotidienne des nouvelles offres
   - Gestion intelligente de la pagination
   - Mise en cache Redis avec déduplication

2. **Transformation (DAG 02)**
   - Nettoyage HTML optimisé (96% de réduction)
   - Analyse sémantique par DeepSeek
   - Logs détaillés de chaque étape

## 📊 Performances Actuelles

- **Scraping** : ~30 offres en 2-3 minutes
- **Nettoyage HTML** : 96% de réduction de taille
- **Analyse IA** : ~4 secondes par offre
- **Pipeline complet** : ~2 minutes pour 29 offres

## 📝 TODO

- [x] Implémentation du scraper Free-Work
- [x] Intégration DeepSeek
- [x] Pipeline de transformation
- [x] Logging avancé
- [ ] Tests automatisés
- [ ] Support Malt
- [ ] Support Comet
- [ ] API REST
- [ ] Interface utilisateur

## 📜 Licence

MIT License - Voir le fichier [LICENSE](LICENSE) pour plus de détails. 