<template>
  <div class="content-container">
    <div class="left">
      <img src="/src/assets/img/section1_photo.jpg" alt="Description of the image">
    </div>
    <div class="right">
      <h2>Mona Duprat</h2>
      <div class="personal-info">
        <div><strong>Naissance :</strong> 11 mai 1968</div>
        <div><strong>Lieu de naissance :</strong> Maternité de la Côte Basque, Bayonne</div>
        <div><strong>Mère :</strong> Marguerite Duprat - Mère au foyer</div>
        <div><strong>Père :</strong> Patrick Duprat - Instituteur à l’école Catholique Sainte Marie</div>
        <div><strong>Âge entre 1980 et 1989 :</strong> de ses 12 à 22 ans</div>
      </div>
      <div class="boxed-text">
        <p>
          Durant son adolescence, elle se passionne pour le surf et prend des cours chaque été. 
          Elle y rencontre Sam, une jeune fille à laquelle elle s'attache.
        </p>
        <p>
          Dans les années 80, elle passe beaucoup de temps à écouter de la musique. Elle collectionne les cassettes 
          de ses artistes préférés : Daniel Balavoine, Mylène Farmer, David Bowie et Culture Club.
        </p>
        <p>
          Ce sont des icones queer issus de la culture pop de l’époque auxquelles elle s’identifie à travers leurs oeuvres. 
          Elles lui offrent un autre regard sur le monde et l’aideront à se construire durant l’adolescence.
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Section1',
  methods: {
    handleButtonClick() {
      alert('Button clicked in section 1');
      document.getElementById('section-2').scrollIntoView({ behavior: 'smooth' });
    }
  }
}
</script>

<style scoped>
.content-container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 100vh;
  padding: 20px;
  overflow: hidden;
}

.left, .right {
  flex: 1;
  padding: 20px;
}

.left img {
  width: 100%;
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

  .right {
    text-align: center;
  }
}
</style>
