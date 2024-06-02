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
          <p><strong>{{ item.name }}</strong></p>
          <p>{{ item.description }}</p>
          <br>
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
          anecdote: 'Populaire dans les années 80, la tablette de sable permettait aux enfants de dessiner et d\'effacer facilement avec un stylet, offrant une alternative économique et réutilisable aux blocs de papier.', 
          src: '/src/assets/img/objects/object1.png' 
        },
        { 
          name: 'Walkman', 
          anecdote: 'Incontournable dans les années 80, le Walkman, un lecteur de cassettes portable avec des écouteurs, révolutionnait la façon d\'écouter de la musique en permettant aux gens d\'emmener leurs chansons préférées partout.', 
          src: '/src/assets/img/objects/object2.png' 
        },
        { 
          name: 'Téléphone à cadran', 
          anecdote: 'Utilisé dans la plupart des foyers des années 80, le téléphone à cadran fixe nécessitait de composer les numéros en tournant un cadran rotatif, rendant l\'expérience téléphonique unique avec son "clic-clac" distinctif.', 
          src: '/src/assets/img/objects/object3.png' 
        },
        { 
          name: 'Cassette à rembobiner', 
          anecdote: 'Les cassettes audio étaient le format musical dominant dans les années 80. Elles nécessitaient parfois un crayon pour rembobiner manuellement la bande, prolongeant ainsi leur durée de vie.', 
          src: '/src/assets/img/objects/object4.png' 
        },
        { 
          name: 'Vinyl et tourne-disque', 
          anecdote: 'Les vinyles, écoutés sur un tourne-disque, offraient une qualité sonore chaleureuse. Écouter un album était une activité souvent partagée en famille ou entre amis.', 
          src: '/src/assets/img/objects/object5.png' 
        },
        { 
          name: 'Magazines des années 80', 
          anecdote: 'Les magazines des années 80 étaient une fenêtre sur le monde, regorgeant de modes, tendances et nouvelles de l\'époque, fournissant des mises à jour avant l\'ère d\'Internet.', 
          src: '/src/assets/img/objects/object6.png' 
        },
        { 
          name: 'Disque de Balavoine', 
          anecdote: 'Daniel Balavoine était une icône de la musique française dans les années 80. Ses albums, comme "Sauver l\'amour", étaient souvent joués en boucle sur les tourne-disques.', 
          src: '/src/assets/img/objects/object7.png' 
        },
        { 
          name: 'Rubik\'s Cube', 
          anecdote: 'Le Rubik\'s Cube, un puzzle en forme de cube avec des faces colorées à aligner, a connu une énorme popularité dans les années 80, devenant un symbole de l\'ingéniosité et un défi incontournable.', 
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
  height: auto; 
  overflow: hidden;
}

.content-1 {
  display: flex;
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
  flex-wrap: wrap; 
  justify-content: space-between;
  padding: 10px;
  width: 80%;
  align-self: center;
  place-content: center;
}

.square {
  width: 100px;
  height: 100px;
  margin: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  transition: transform 0.3s;
  perspective: 1000px;
}

.square img {
  width: 100px;
  height: auto;
  border-radius: 8px;
  transition: transform 0.3s;
}

.square:hover {
  transform: rotateY(15deg) rotateX(15deg); 
  z-index: 10;
}

.square:hover img {
  transform: scale(2); 
  background-color: white;
}

.popup {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%) scale(0);
  width: 300px;
  padding: 10px;
  background-color: white;
  color: #8b4492;
  border-radius: 8px;
  text-align: center;
  visibility: hidden;
  opacity: 0;
  transition: transform 0.6s cubic-bezier(0.68, -0.55, 0.27, 1.55), opacity 0.3s;
  animation: bounceIn 0.6s cubic-bezier(0.68, -0.55, 0.27, 1.55);
}

.square:hover {
  transform: scale(0.75);
}
 .popup {
  visibility: visible;
  transform: translateX(-50%) scale(1);
  opacity: 1;
}

.popup p {
  opacity: 0;
  animation: handwriting 2s steps(30) forwards;
}

.popup::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  border-width: 5px;
  border-style: solid;
  border-color: rgba(0, 0, 0, 0.8) transparent transparent transparent;
}

@keyframes bounceIn {
  0% {
    transform: translateX(-50%) scale(0);
    opacity: 0;
  }
  60% {
    transform: translateX(-50%) scale(1.1);
    opacity: 1;
  }
  100% {
    transform: translateX(-50%) scale(1);
  }
}

@keyframes handwriting {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
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
  .bottom-band {
    justify-content: flex-start; 
  }

  .square {
    width: 48%; 
  }
}

@media (max-width: 480px) {
  .square {
    width: 100px; 
    margin-bottom: 10px;
  }
}

</style>

<style scoped></style>