<template>
  <div class="new-section">
    <div class="info-panel info-panel-left">
      <div class="info-title-container">
        <div class="info-title">Société</div>
      </div>
      <div class="info-content">
        <img src="/src/assets/img/Causette.png" alt="Image description" class="info-image">
        <div class="text-content">
          <p>
            En 2023, nous célébrons les 10 ans du mariage pour tous en France, une étape historique vers l'égalité des droits pour les couples de même sexe.
          </p>
          <p>
            Depuis 2021, la Procréation Médicalement Assistée (PMA) est également ouverte à toutes les femmes, indépendamment de leur situation matrimoniale ou de leur orientation sexuelle.
          </p>
          <p>
            Chaque année en juin, mois de la fierté, nous honorons ces avancées et continuons à lutter pour une société plus inclusive et respectueuse des diversités.
          </p>
        </div>
      </div>
    </div>

    <div class="info-panel info-panel-right">
      <div class="info-title-container">
        <div class="info-title info-title-right">Communication</div>
      </div>
      <div class="info-content">
        <div class="text-content">
          <p>
            En 2024, les smartphones et les réseaux sociaux ont révolutionné la communication, rendant les échanges quotidiens faciles même dans les relations à distance.
          </p>
          <p>
            Grâce à ces technologies, il est possible de rester en contact avec ses proches en temps réel, peu importe la distance. 
          </p>
          <p>           
            Par ailleurs, les réseaux sociaux sont devenus des plateformes puissantes pour soutenir le mouvement LGBT, offrant des espaces de dialogue, de visibilité et de mobilisation pour défendre les droits et promouvoir l'égalité.
          </p>
        </div>
        <img src="/src/assets/img/TelMonaSam.png" alt="Image description" class="info-image">
      </div>
    </div>

    <div class="info-panel info-panel-left">
      <div class="info-title-container">
        <div class="info-title">Musique</div>
      </div>
      <div class="info-content">
        <iframe src="https://open.spotify.com/embed/playlist/19tq2QerDNgEqwNLcSuwL3" width="300" height="480" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>
        <div class="text-content">
          <p>
            La scène musicale accueille de nombreux artistes qui soutiennent activement la cause LGBT et contribuent à sa visibilité.
          </p>
          <p>
            Ces artistes, véritables icônes, utilisent leur plateforme pour sensibiliser le public, défendre les droits des personnes LGBT et promouvoir l'inclusivité à travers leur musique et leur présence médiatique.
          </p>
          <p>           
            Leurs actions et leur influence jouent un rôle crucial dans l'évolution des mentalités et la lutte pour l'égalité.
          </p>
        </div>
      </div>
    </div>


    <h2 class="main-title">L’évolution ... mais pas trop</h2>
    <p>En somme, les chiffres de 2024 témoignent d'une aggravation des violences et des discriminations à l'encontre des personnes LGBT+ en France, nécessitant des actions renforcées pour lutter contre ces actes et soutenir les victimes.
    </p>

    <div class="info-panel info-panel-right">
      <div class="info-title-container">
        <div class="info-title">LGBTiphobies</div>
      </div>
      <div class="info-content"> 
        <div class="text-content">
          <p>
            Agressions physiques LGBT+ ont éyé rapportes par SOS homophobie en 2023
          </p>
          <p>
            72% de coups, 17% de crachats et jet d’objets, 8% de viols ou de tentatives de viol, 3ù d’agressions sexuelles, 1% de meurtres
          </p>
        </div>
      <img src="/src/assets/img/RapportLGBT.png" alt="Image description" class="info-image">
      </div>
    </div>

    <div class="info-panel info-panel-left">
      <div class="info-title-container">
        <div class="info-title">Agressions</div>
      </div>
      <div class="info-content">
        <img src="/src/assets/img/HomophobieTue.png" alt="Image description" class="info-image">
        <div class="text-content">
          <p>
            Agressions physiques LGBT+ ont éyé rapportes par SOS homophobie en 2023
          </p>
          <div class="info-data">

          </div>
        </div>
      </div>
    </div>

    <div class="info-panel info-panel-right">
      <div class="info-title-container">
        <div class="info-title">Espaces publics, espaces intimes</div>
      </div>
      <div class="info-content">
        <div class="text-content">
          <p>
            Dans quel contexte ont lieu les principaux faits recencées en 2022 (SOS Homophobie)
          </p>
          </div>
          <img src="/src/assets/img/Resistance.png" alt="Image description" class="info-image">
        
      </div>
    </div>


  </div>
</template>

<script>
export default {
  name: 'NewSection',
}
</script>

<style scoped>
.new-section {
  padding-left: 100px;
  padding-right: 100px;
}

.info-panel {
  width: 80%;
  margin-bottom: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.info-panel-right {
  float: right;
}
.info-panel-left {
  float: left;
}

.info-title-container {
  display: flex;
  justify-content: flex-end;
}

.info-title {
  padding-right: 10px;
  padding-left: 10px ;
  margin-top: 20px;
  font-size: 24px;
  background-color: #EC9781;
  color: white;
}

.info-content {
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}


.info-image {
  width: 50%;
  max-width: 600px;
  margin-bottom: 15px;
  border-radius: 8px;
}

.info-data {
  width: 50%;
}

.text-content {
  text-align: left;
  line-height: 1.5;
}

.text-content p {
  padding: 10px;
}

.left, .right {
  flex: 1;
  padding: 10px;
}

.right {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.image-container {
  
  margin-bottom: 15px;
}

.image-container img {
  width: 50%;
  height: auto;
  border-radius: 8px;
}

.text-container {
  width: 100%;
  text-align: center;
}

@media (max-width: 768px) {

  .info-panel {
    width: 100%;
  }
}

@media (min-width: 768px) {
  .info-content {
    flex-direction: row;
    align-items: center;
    text-align: left;
  }


  .info-image {
    margin-right: 20px;
    margin-bottom: 0;
  }
}
</style>
