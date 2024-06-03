<template>
  <div class="gallery-page">
    <h1 class="main-title">A propos</h1>
    <p class="sub-text">
      Dans une décennie qui se transforme. Projet réalisé dans le cadre de la formation Master de machin machin par la CCI Haute-Savoie et l’École des Gobelins. Le cours sur le Cinéma 4D et webGL, nous avons dû réaliser une expérience immersive pour un centre culturel fictif. Le sujet était “c’était mieux ! c’était mieux avant ? C’était mieux avant “ sur le thème de la communication et des médias.
    </p>
    <div class="gallery">
      <div v-for="(item, index) in items" :key="index" class="gallery-item">
        <img :src="item.src" alt="Image" class="image-placeholder">
        <div class="item-details">
          <p class="item-name">{{ item.name }}</p>
          <p class="item-title">{{ item.title }}</p>
        </div>
      </div>
    </div>
    <div class="thanks-section">
      <h2>Remerciements</h2>
      <p>
        Aux professeurs : Eric Gaudet-Traffy, Yann Qilquin et les KIDS : Guillaume Imbert & Vincent Larsonneur ainsi qu’à L’école by CCi Digital Campus & les Gobelins Paris
      </p>
      <p>
        Compositeurs : Emmanuel (Nom ?) et Damien Lacore
      </p>
      <p>
        Voix off : 
        <br>Marguerite : mamie de Léa
        <br>Dahlia : Léa Simonet
        <br>Sam : 
        <br>Mona : 
      </p>
      <p>
        Projet scolaire réalisé dans le cadre du Master 1 ECNI aux Gobelins l’école de l’image
      </p>
      <p>
        Tous droits réservés - 2024
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GalleryPage',
  data() {
    return {
      items: [
        { name: 'Maud FLEURIET', title: 'Designeuse', src: '/src/assets/img/members/mathilde.png' },
        { name: 'Lucie LESNIER', title: 'Développeuse', src: '/src/assets/img/members/mathilde.png' },
        { name: 'Anaïs MOREAU', title: 'Développeuse', src: '/src/assets/img/members/mathilde.png' },
        { name: 'Yohan QUINQUIS', title: 'Développeur', src: '/src/assets/img/members/mathilde.png' },
        { name: 'Léa SIMONET', title: 'Designeuse', src: '/src/assets/img/members/mathilde.png'  },
        { name: 'Mathilde VAUQUIERES', title: 'Designeuse', src: '/src/assets/img/members/mathilde.png' }
      ]
    };
  }
}
</script>

<style scoped>
.gallery-page {
  text-align: center;
  padding: 60px;
}

.main-title {
  margin-bottom: 10px;
}

.sub-text {
  padding-left: 100px;
  padding-right: 100px;
  margin-bottom: 30px;
}

.gallery {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.gallery-item {
  width: 30%;
  margin: 1%;
  padding: 20px;
}

.image-placeholder {
  height: 150px;
  border-radius: 8px;
  margin-bottom: 15px;
  
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 50%;
}

.item-details {
  text-align: center;
}

.item-name {
  font-size: 16px;
  margin-bottom: 5px;
}

.item-title {
  font-size: 12px;
  color: #666;
}

.thanks-section {
  margin-top: 50px;
  text-align: left;
  padding-left: 100px;
  padding-right: 100px;
}

.thanks-section h2 {
  margin-bottom: 20px;
}

.thanks-section p {
  margin-bottom: 10px;
}
</style>
