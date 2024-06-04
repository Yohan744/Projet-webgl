<template>
  <div class="gallery-page general-padding">
    <h2 class="main-title">L'équipe</h2>
    <p class="sub-text">
      Dans une décennie qui se transforme. Projet réalisé dans le cadre de la formation Master de machin machin par la CCI Haute-Savoie et l’École des Gobelins. Le cours sur le Cinéma 4D et webGL, nous avons dû réaliser une expérience immersive pour un centre culturel fictif. Le sujet était “c’était mieux ! c’était mieux avant ? C’était mieux avant “ sur le thème de la communication et des médias.
    </p>
    <div class="gallery">
      <div v-for="(item, index) in items" :key="index" class="gallery-item">
        <div class="image-container" @mouseover="hoverItem = index" @mouseleave="hoverItem = null">
          <img :src="item.src" alt="Image" class="image-placeholder" :class="{ 'hovered': hoverItem === index }">
        </div>
        <div class="item-details">
          <p class="item-name" :class="{ 'hovered': hoverItem === index }">{{ item.name }}</p>
          <p class="item-title">{{ hoverItem === index ? item.sentence : item.title }}</p>
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
      hoverItem: null,
      items: [
        { name: 'Maud FLEURIET', title: 'Designeuse', src: '/src/assets/img/members/mathilde.png', sentence: 'Toujours partante pour danser sur des chansons de Queen!' },
        { name: 'Lucie LESNIER', title: 'Développeuse', src: '/src/assets/img/members/mathilde.png', sentence: 'J adore les histoires d amour...' },
        { name: 'Anaïs MOREAU', title: 'Développeuse', src: '/src/assets/img/members/mathilde.png', sentence: 'J ai un tourne disque mais spotify tient mieux dans ma poche.' },
        { name: 'Yohan QUINQUIS', title: 'Développeur', src: '/src/assets/img/members/mathilde.png', sentence: 'Je préfère les styles vestimentaires d aujourd hui.' },
        { name: 'Léa SIMONET', title: 'Designeuse', src: '/src/assets/img/members/mathilde.png', sentence: 'Chez papi, il y a plein de vieux objets qu il adore me faire découvrir.' },
        { name: 'Mathilde VAUQUIERES', title: 'Designeuse', src: '/src/assets/img/members/mathilde.png', sentence: 'Balavoine il me rappelle des souvenirs d enfance avec ma mère.' }
      ]
    };
  }
}
</script>

<style scoped>

.general-padding {
  padding: 200px
}
@media (max-width: 1200) {
  .general-padding {
  padding: 100px
  }
}
@media (max-width: 1024px) {
  .general-padding {
  padding: 80px
  }
}
@media (max-width: 768px) {
  .general-padding {
  padding: 20px
  }
}

.gallery-page {
  text-align: center;
  padding: 60px;
  text-align: -webkit-center; 
}

.main-title {
  margin-bottom: 10px;
}

.sub-text {
  padding-left: 100px;
  padding-right: 100px;
  margin-bottom: 30px;
  max-width: 1000px;
  text-align: center;
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
  width: 150px;
  border-radius: 50%;
  margin-bottom: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.image-container {
  perspective: 1000px; /* Add perspective */
}

.image-placeholder.hovered {
  transform: scale(1.1) rotateY(10deg); /* Enlarge and add slight perspective */
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.item-details {
  text-align: center;
  min-height: 50px; /* Ensure minimum height to avoid layout shifts */
}

.item-name {
  font-size: 16px;
  margin-bottom: 5px;
  transition: font-weight 0.3s ease;
}

.item-name.hovered {
  font-weight: bold; /* Make name bold on hover */
}

.item-title {
  font-size: 12px;
  color: #666;
  transition: opacity 0.5s ease;
  width: 100%;
  display: inline-block;
}

.item-title.hovered {
  opacity: 1;
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

/* Responsive Styles */
@media (max-width: 1024px) {
  .sub-text, .thanks-section {
    padding-left: 50px;
    padding-right: 50px;
  }

  .gallery-item {
    width: 45%;
  }

  .image-placeholder {
    height: 120px;
    width: 120px;
  }
}

@media (max-width: 768px) {
  .sub-text, .thanks-section {
    padding-left: 20px;
    padding-right: 20px;
  }

  .gallery-item {
    width: 90%;
  }

  .image-placeholder {
    height: 100px;
    width: 100px;
  }
}
</style>
