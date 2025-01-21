<template>
    <div class="landing-page">
      <header>
        <h1>Bienvenue sur notre application</h1>
        <p>Découvrez nos offres d'emploi.</p>
      </header>
      <section>
        <h2>Offres d'emploi</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Titre</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="offer in jobOffers" :key="offer.id">
              <td>{{ offer.ID }}</td>
              <td>{{ offer.TITLE }}</td>
              <td>{{ offer.XP }}</td>
              <!-- Ajoute d'autres cellules si nécessaire -->
            </tr>
          </tbody>
        </table>
      </section>
      <footer>
        <p>&copy; 2023 Mon Projet</p>
      </footer>
    </div>
  </template>

  <script>
  import { supabase } from '../supabase';

  export default {
    name: 'LandingPage',
    data() {
      return {
        jobOffers: [],
      };
    },
    async mounted() {
      await this.fetchJobOffers();
    },
    methods: {
      async fetchJobOffers() {
        const { data, error } = await supabase
          .from('job_offers')
          .select('*');

        if (error) {
          console.error('Erreur lors de la récupération des offres d\'emploi:', error);
        } else {
          this.jobOffers = data;
        }
      },
    },
  };
  </script>

  <style scoped>
  .landing-page {
    text-align: center;
    padding: 20px;
  }
  header {
    background-color: #f8f9fa;
    padding: 20px;
    border-bottom: 1px solid #dee2e6;
  }
  footer {
    margin-top: 20px;
    font-size: 0.8em;
  }
  table {
    width: 100%;
    border-collapse: collapse;
  }
  th, td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
  }
  th {
    background-color: #f2f2f2;
  }
  </style>