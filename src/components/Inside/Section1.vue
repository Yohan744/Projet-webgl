<template>
  <div class="content-container">
    <div class="content-1">
      <div class="left">
        <img src="/src/assets/img/Mona.png" alt="Description of the image">
      </div>
      <div class="right">
        <h2>Mona Duprat</h2>
        <div class="personal-info">
          <div><strong>Naissance :</strong> 11 mai 1968</div>
          <div><strong>Lieu de naissance :</strong> Biarritz</div>
          <div><strong>Âge entre 1980 et 1989 :</strong> de ses 12 à 22 ans</div>
        </div>
        <br>
        <p>
            Durant son adolescence, elle se passionne pour le surf et prend des cours chaque été. 
            Elle y rencontre Sam, une jeune fille à laquelle elle s'attache.
        </p>
        <br>
        <p>
          Dans les années 80, elle passe beaucoup de temps à écouter de la musique. Elle collectionne les cassettes 
          de ses artistes préférés : Daniel Balavoine, Mylène Farmer, David Bowie et Culture Club.
        </p>
        <br>
        <div class="boxed-text">
          <p>
            Ce sont des icones queer issus de la culture pop' auxquelles elle s’identifie à travers leurs oeuvres. 
            Elles lui offrent un autre regard sur le monde et l’aideront à <strong>se construire</strong> durant l’adolescence.
          </p>
        </div>
      </div>
    </div>
    <h3>La boite à outils de Mona</h3>
    <div class="bottom-band">
      <div v-for="(item, index) in items" :key="index" class="square" @mouseover="showPopup(index)" @mouseleave="hidePopup">
        <img :src="item.src" :alt="item.name">
        <div v-if="popupVisible === index" class="popup">
          <p><strong>{{ item.name }}</strong>: {{ item.description }}</p>
          <p><em>{{ item.anecdote }}</em></p>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
export default {
  name: 'Section1',
  data() {
    return {
      popupVisible: null,
      items: [
        { 
          name: 'Tablette de sable', 
          description: 'Une tablette de sable, utilisée pour dessiner avec un stylet.', 
          anecdote: 'Populaire dans les années 80, elle permettait aux enfants de dessiner et d\'effacer facilement, offrant une alternative économique et réutilisable aux blocs de papier.', 
          src: '/src/assets/img/objects/object1.png' 
        },
        { 
          name: 'Walkman', 
          description: 'Un lecteur de cassettes portable avec des écouteurs.', 
          anecdote: 'Incontournable dans les années 80, le Walkman a révolutionné la façon d\'écouter de la musique en permettant aux gens d\'emmener leurs chansons préférées partout avec eux.', 
          src: '/src/assets/img/objects/object2.png' 
        },
        { 
          name: 'Téléphone à cadran', 
          description: 'Un téléphone fixe avec un cadran rotatif pour composer les numéros.', 
          anecdote: 'Utilisé dans la plupart des foyers des années 80, composer un numéro pouvait prendre du temps, mais le "clic-clac" du cadran était une partie nostalgique de l\'expérience téléphonique.', 
          src: '/src/assets/img/objects/object3.png' 
        },
        { 
          name: 'Cassette à rembobiner', 
          description: 'Une cassette audio magnétique nécessitant parfois un crayon pour le rembobinage manuel.', 
          anecdote: 'Les cassettes audio étaient le format musical dominant, et les utilisateurs utilisaient souvent un crayon pour rembobiner la bande afin de prolonger la durée de vie de la cassette.', 
          src: '/src/assets/img/objects/object4.png' 
        },
        { 
          name: 'Vinyl et tourne-disque', 
          description: 'Un disque en vinyle noir associé à un tourne-disque pour lire la musique.', 
          anecdote: 'Les vinyles offraient une qualité sonore chaleureuse, et écouter un album sur un tourne-disque était une activité souvent partagée en famille ou entre amis dans les années 80.', 
          src: '/src/assets/img/objects/object5.png' 
        },
        { 
          name: 'Magazines des années 80', 
          description: 'Publications imprimées regorgeant de modes, tendances, et nouvelles de l\'époque.', 
          anecdote: 'Les magazines des années 80 étaient une fenêtre sur le monde, fournissant des mises à jour sur la musique, la mode, et les célébrités avant l\'ère d\'Internet.', 
          src: '/src/assets/img/objects/object6.png' 
        },
        { 
          name: 'Disque de Balavoine', 
          description: 'Un album de l\'artiste Daniel Balavoine en format vinyle.', 
          anecdote: 'Daniel Balavoine était une icône de la musique française dans les années 80, et ses albums, comme "Sauver l\'amour", étaient souvent joués en boucle sur les tourne-disques.', 
          src: '/src/assets/img/objects/object7.png' 
        },
        { 
          name: 'Rubik\'s Cube', 
          description: 'Un puzzle en forme de cube avec des faces colorées à aligner.', 
          anecdote: 'Le Rubik\'s Cube a connu une énorme popularité dans les années 80, devenant un symbole de l\'ingéniosité et un défi incontournable pour les jeunes et les adultes.', 
          src: '/src/assets/img/objects/object8.png' 
        }
      ]
    };
  },
  methods: {
    showPopup(index) {
      this.popupVisible = index;
    },
    hidePopup() {
      this.popupVisible = null;
    }
  }
}
</script>

<style scoped>
.content-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}

.content-1 {
  display: flex;
  flex: 7;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
}

.left, .right {
  flex: 1;
  padding: 20px;
}

.left img {
  width: 80%;
  height: auto;
  border-radius: 8px;
}

.right {
  text-align: left;
}

.personal-info div {
  margin-bottom: 10px;
}

.boxed-text {
  background-color: #ec968141;
  padding: 20px;
  border-radius: 3px;
  margin-top: 20px;
}

.bottom-band {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex: 3;
  padding: 10px;
  background-color: #f9f9f9;
}

.square {
  flex: 1;
  max-width: calc(12.5% - 10px); /* 8 squares, with some padding/margin */
  margin: 0 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.square img {
  width: 100%;
  height: auto;
  border-radius: 8px;
}

.popup {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  width: 300px;
  padding: 10px;
  background-color: rgba(186, 160, 194, 0.8);
  color: #fff;
  border-radius: 8px;
  text-align: center;
  visibility: visible;
  opacity: 1;
  transition: opacity 0.3s;
}

.popup::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border-width: 5px;
  border-style: solid;
  border-color: rgba(0, 0, 0, 0.8) transparent transparent transparent;
}

.buttons {
  margin-top: 20px;
}

button {
  padding: 10px 20px;
  font-size: 1em;
  background: #444;
  color: #fff;
  border: none;
  cursor: pointer;
  border-radius: 8px;
}

button:hover {
  background: #555;
}

@media (max-width: 768px) {
  .content-container {
    flex-direction: column;
  }

  .main-content {
    flex-direction: column;
  }

  .right {
    text-align: center;
  }

  .bottom-band {
    flex-wrap: wrap;
  }

  .square {
    max-width: 45%;
    margin-bottom: 10px;
  }
}
</style>

