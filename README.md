# 🤖 JobAnalyzer

Analyseur automatique d'offres d'emploi Freelances avec intelligence artificielle.

⚠️ **Note Importante** : Ce projet est en développement actif. Utilisez-le de manière éthique et responsable.

## 📋 Description

JobAnalyzer est un outil qui :
- Scrape automatiquement les nouvelles offres Freelances
- Analyse et catégorise les offres avec l'IA (DeepSeek v3)
- Stocke les données de manière structurée
- Fournit des analyses de marché et des tendances

## ⚠️ Avertissements

- Respectez les conditions d'utilisation des sites sources
- Ne partagez JAMAIS vos clés API (OpenAI, Supabase)
- Utilisez le rate limiting pour ne pas surcharger les sites
- Les données scrappées doivent être utilisées de manière éthique

## 🏗 Architecture

### Backend (Python)
- Scraping automatisé (Beautiful Soup)
- Analyse IA (DeepSeek v3)
- Base de données (Supabase)

### Frontend (React)
- Dashboard interactif
- Visualisation des données
- Filtres avancés

## 🛠 Technologies

- **Backend** : Python 3.11
- **Frontend** : React
- **Base de données** : Supabase (PostgreSQL)
- **IA** : DeepSeek v3
- **Déploiement** : Google Cloud Run, Vercel

## 📦 Structure du Projet

```
JobAnalyzer/
├── backend/
│   ├── scraper/        # Scraping FreeWork
│   ├── models/         # Modèles de données
│   └── database/       # Client Supabase
├── frontend/
│   ├── src/
│   └── public/
└── docker/            # Configuration Docker
```

## 🔒 Sécurité

1. **Variables d'environnement**
   - Ne JAMAIS commiter le fichier `.env`
   - Utiliser `.env.example` comme modèle
   - Stocker les secrets de manière sécurisée

2. **Rate Limiting**
   - Respecter les limites d'API
   - Implémenter des délais entre les requêtes
   - Gérer les erreurs de manière gracieuse

## 🚀 Installation

1. **Prérequis**
   - Python 3.11+
   - Docker
   - Node.js 18+
   - Clés API (voir ci-dessous)

2. **Configuration**
   ```bash
   # Ne JAMAIS commiter ce fichier
   cp .env.example .env
   
   # Configurer vos variables dans .env :
   # - OPENAI_API_KEY
   # - SUPABASE_URL
   # - SUPABASE_KEY
   ```

3. **Lancement**
   ```bash
   # Développement
   docker compose up --build

   # Production
   # Instructions à venir
   ```

## 📊 Structure de la Base de Données

### Table `JOB_OFFERS`
- Stockage des offres d'emploi
- Classification par domaine
- Analyse IA
- Informations géographiques

## 🔄 Workflow

1. Scraping quotidien des nouvelles offres
2. Analyse et enrichissement par IA
3. Stockage structuré
4. Mise à jour du dashboard

## 📝 TODO

- [ ] Implémentation du scraper
- [ ] Intégration OpenAI
- [ ] Configuration Cloud Run
- [ ] Développement frontend
- [ ] Tests automatisés
- [ ] Documentation complète
- [ ] Guide de contribution
- [ ] Sécurisation des endpoints

## 🤝 Contribution

Nous accueillons les contributions ! Merci de :
- Créer une issue avant de commencer
- Suivre les conventions de code
- Ajouter des tests pour les nouvelles fonctionnalités
- Respecter l'éthique et la légalité du scraping

## 📜 Licence

MIT License - Voir le fichier [LICENSE](LICENSE) pour plus de détails. 