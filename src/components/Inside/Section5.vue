<template>
  <div class="gallery-page">
    <h1 class="main-title">A propos</h1>
    <p class="sub-text">
      Dans une décennie qui se transforme. Projet réalisé dans le cadre de la formation Master de machin machin par la CCI Haute-Savoie et l’École des Gobelins. Le cours sur le Cinéma 4D et webGL, nous avons dû réaliser une expérience immersive pour un centre culturel fictif. Le sujet était “c’était mieux ! c’était mieux avant ? C’était mieux avant “ sur le thème de la communication et des médias.
    </p>
    <div class="gallery">
      <div v-for="(item, index) in items" :key="index" class="gallery-item">
        <div class="image-placeholder">Image</div>
        <div class="item-details">
          <h2 class="item-name">{{ item.name }}</h2>
          <p class="item-title">{{ item.title }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GalleryPage',
  data() {
    return {
      items: [
        { name: 'Maud FLEURIET', title: 'Designeuse' },
        { name: 'Lucie LESNIER', title: 'Développeuse' },
        { name: 'Anaïs MOREAU', title: 'Développeuse' },
        { name: 'Yohan QUINQUIS', title: 'Développeur' },
        { name: 'Léa SIMONET', title: 'Designeuse' },
        { name: 'Mathilde VAUQUIERES', title: 'Designeuse' }
      ]
    };
  }
}
</script>

<style scoped>
.gallery-page {
  text-align: center;
  padding: 20px;
}

.main-title {
  font-size: 2.5em;
  margin-bottom: 10px;
}

.sub-text {
  font-size: 1.2em;
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
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  background: #f9f9f9;
}

.image-placeholder {
  background: #ccc;
  height: 150px;
  border-radius: 8px;
  margin-bottom: 15px;
}

.item-details {
  text-align: center;
}

.item-name {
  font-size: 1.2em;
  margin-bottom: 5px;
}

.item-title {
  font-size: 1em;
  color: #666;
}
</style>
