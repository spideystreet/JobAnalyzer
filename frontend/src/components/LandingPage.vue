<template>
    <div class="landing-page">
      <header>
        <h1>Bienvenue sur notre application</h1>
        <p>Découvrez nos graphiques et analyses de données.</p>
      </header>
      <section>
        <h2>Nos Graphiques</h2>
        <p>Voici quelques exemples de graphiques que vous pouvez visualiser.</p>
        <!-- Ajoute ici tes composants graphiques -->
      </section>
      <footer>
        <p>&copy; 2023 Mon Projet</p>
      </footer>
    </div>
  </template>

  <script>
  export default {
    name: 'LandingPage',
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
  </style>