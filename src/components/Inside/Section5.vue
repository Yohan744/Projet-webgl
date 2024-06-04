<template>
  <div class="new-section general-padding" @mousemove="updateImagePosition">
    <div class="info-panel info-panel-left">
      <div class="info-title-container-left">
        <div class="info-title">Société</div>
      </div>
      <div class="info-content">
        <img src="/src/assets/img/info-lgbt/Causette.png" alt="Image description" class="info-image-50">
        <div class="text-content">
          <p>
            En 2023, nous célébrons <strong>les 10 ans du mariage pour tous en France</strong>, une étape historique vers l'égalité des droits pour les couples de même sexe.
          </p>
          <p>
            <strong>Depuis 2021, la Procréation Médicalement Assistée (PMA)</strong> est également ouverte à toutes les femmes, indépendamment de leur situation matrimoniale ou de leur orientation sexuelle.
          </p>
          <p>
            Chaque année en juin, <strong>mois de la fierté</strong>, nous honorons ces avancées et continuons à lutter pour une société plus inclusive et respectueuse des diversités.
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
        <img src="/src/assets/img/info-lgbt/TelMonaSam.png" alt="Image description" class="info-image-50">
      </div>
    </div>

    <div class="info-panel info-panel-left">
      <div class="info-title-container-left">
        <div class="info-title">Musique</div>
      </div>
      <div class="info-content">
        <iframe src="https://open.spotify.com/embed/playlist/00vXCJ3TKAAHqktbLdJJ54?utm_source=generator&theme=0" width="300" height="480" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>
        <div class="text-content">
          <p>
            La scène musicale accueille de nombreux artistes qui soutiennent activement la cause LGBT et contribuent à sa visibilité.
          </p>
          <p>
            Ces artistes utilisent leurs plateformes pour sensibiliser le public, défendre les droits des personnes LGBT et promouvoir l'inclusivité à travers leur musique et leur présence médiatique.
          </p>
          <p>
            Leurs actions et leur influence jouent un rôle crucial dans l'évolution des mentalités et la lutte pour l'égalité.
          </p>
        </div>
      </div>
    </div>

    <div class="info-question">
      <h2 class="main-title">Vous avez dit "évolution" ?</h2>
        <div class="text-content">
          <p>Les chiffres de 2024 du rapport sur les LGBTiphobies de 2023 témoignent d'une aggravation des violences et des discriminations à l'encontre des personnes LGBT+ en France.
          </p>
        </div>
    </div>

    <div class="info-panel info-panel-right">
      <div class="info-title-container">
        <div class="info-title"  @mouseover="showImage('/src/assets/img/info-lgbt/RapportLGBT.png')" @mouseleave="hideImage" >LGBTiphobies, le rapport de 2024</div>
      </div>
      <div class="info-content">
        <div class="text-content">
          <div class="chart-toggle-buttons">
            <button   @mouseover="showImage('/src/assets/img/info-lgbt/RapportLGBT.png')" @mouseleave="hideImage"  :class="{ active: activeChart === 1 }" @click="switchChart(1)">Types d'agressions</button>
            <button   @mouseover="showImage('/src/assets/img/info-lgbt/RapportLGBT.png')" @mouseleave="hideImage"  :class="{ active: activeChart === 2 }" @click="switchChart(2)">Manifestations supplémentaires</button>
          </div>
          <highcharts :options="currentChartOptions"></highcharts>
          <div>
            <a href="https://ressource.sos-homophobie.org/Rapports_annuels/Rapport_LGBTIphobies_2024.pdf" target="_blank"   @mouseover="showImage('/src/assets/img/info-lgbt/RapportLGBT.png')" @mouseleave="hideImage">Rapport LGBTIphobies 2024, SOS Homophobie</a>
          </div>
        </div>
      </div>
    </div>

    <div class="info-panel info-panel-left">
      <div class="info-title-container-left">
        <div class="info-title"  @mouseover="showImage('/src/assets/img/info-lgbt/HomophobieTue.png')" @mouseleave="hideImage">Quelle évolution?</div>
      </div>
      <div class="info-content">
        <div class="text-content">
          <p>
            <strong class="dataKey">266</strong> Agressions physiques LGBT+  ont été rapportées par SOS homophobie en 2023
          </p>
          <div class="info-data">
            <highcharts :options="chartOptions" ref="chart"></highcharts>
          </div>
          <div>
            <a href="https://ressource.sos-homophobie.org/Rapports_annuels/Rapport_LGBTIphobies_2024.pdf" target="_blank"  @mouseover="showImage('/src/assets/img/info-lgbt/RapportLGBT.png')" @mouseleave="hideImage">Rapport LGBTIphobies 2024, SOS Homophobie</a>
          </div>
        </div>
      </div>
    </div>

    <div class="info-panel info-panel-right">
      <div class="info-title-container">
        <div class="info-title" @mouseover="showImage('/src/assets/img/info-lgbt/Resistance.png')" @mouseleave="hideImage">Espaces publics, espaces intimes, espaces virtuels</div>
      </div>
      <div class="info-content">
        <div class="text-content">
          <p>
            "Internet est aujourd’hui utilisé comme un relais de messages LGBTIphobes et une prolongation du harcèlement et des discriminations vécues dans le monde réel"
          </p>
          <highcharts :options="chartOptions3" ref="chart"></highcharts>
          <div>
            <a href="https://ressource.sos-homophobie.org/Rapports_annuels/Rapport_LGBTIphobies_2024.pdf" target="_blank"   @mouseover="showImage('/src/assets/img/info-lgbt/RapportLGBT.png')" @mouseleave="hideImage">Rapport LGBTIphobies 2024, SOS Homophobie</a>
          </div>
        </div>
        
      </div>
    </div>

    <div v-if="hoverImage" class="hover-image" :style="hoverImageStyle">
      <img :src="hoverImage" alt="Hovered Image">
    </div>
  </div>
</template>

<script>
import HighchartsVue from 'highcharts-vue';
import Highcharts from 'highcharts';

export default {
  name: 'NewSection',
  
  components: {
    highcharts: HighchartsVue.component
  },
  data() {
    return {
      activeChart: 1,
      hoverImage: null,
      hoverImageStyle: {
        top: '0px',
        left: '0px'
      },
      chartOptions: {
        chart: {
          type: 'spline',
          backgroundColor: 'transparent',
          width: null
        },
        legend:{ enabled:false },
        title: {
          text: 'Évolution des agressions'
        },
        credits: {
          enabled: false
        },
        xAxis: {
          categories: ['2016', '2017', '2018', '2019', '2020','2021','2022','2023']
        },
        yAxis: {
          min: 0,
          title: {
            text: ''
          }
        },
        series: [{
          name: '',
          data: [1810, 1929, 2450, 3330, 3260, 3920, 4040, 4558],
          color: '#A7CF90'
        }],
        plotOptions: {
          series: {
            lineWidth: 1,
            marker: {
              enabledThreshold: 2,
              symbol: 'circle',
              radius: 3,
              fillColor: '#FFFFFF',
              lineWidth: 2,
              lineColor: null 
            },
            dataLabels: {
              enabled: true,
              align: 'left',
              crop: false,
              useHTML: false,
              formatter: function() {
                if (this.point.x === this.series.data.length - 1) {
                  return '<span style="color: '+ this.color + '">' + Highcharts.numberFormat(this.y, 0) + '</span>';
                } else {
                  return null;
                }
              }
            }
          }
        },
        responsive: {
          rules: [{
            condition: {
              maxWidth: 560
            },
            chartOptions: {
              xAxis: {
                labels: {
                  step: 4
                }
              }
            }
          }]
        }
      },
      chartOptions1: {
        chart: {
          type: 'column',
          backgroundColor: 'transparent'
        },
        credits: {
          enabled: false
        },
        legend:{ enabled:false },
        title: {
          text: "Types d'agressions"
        },
        xAxis: {
          categories: ['Coups', 'Crachats et jet d’objets', 'Viols ou tentatives de viol', 'Agressions sexuelles', 'Meurtres'],
          title: {
            text: null
          }
        },
        yAxis: {
          min: 0,
          title: {
            text: ''
          }
        },
        tooltip: {
          pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}%</b><br/>',
          shared: true
        },
        plotOptions: {
          column: {
            pointPadding: 0.2,
            borderWidth: 0,
            dataLabels: {
              enabled: true,
              format: '{point.y}%',
              style: {
                fontSize: '8px'
              }
            }
          }
        },
        series: [{
          name: 'Types d\'agressions',
          data: [72, 17, 8, 3, 1],
          color: '#A7CF90'
        }]
      },
      chartOptions2: {
        chart: {
          type: 'column',
          backgroundColor: 'transparent'
        },
        legend:{ enabled:false },
        credits: {
          enabled: false
        },
        title: {
          text: 'Manifestations supplémentaires'
        },
        xAxis: {
          categories: [
            'Insultes', 
            'Rejet', 
            'Menaces', 
            'Harcèlement', 
            'Dégradations / vols',
            'Sexualisation', 
            'Traquenard', 
            'Inaction', 
            'Diffamation',
            'Discrimination', 
            'Amalgame pédocrim.', 
            'Agress. sex.',
            'Outing', 
            'Invisibilisation', 
            'Contrôle déplacements'
          ],
          title: {
            text: null
          },
          labels: {
            rotation: -45,
            style: {
              fontSize: '8px',
              fontFamily: 'Verdana, sans-serif'
            }
          }
        },
        yAxis: {
          min: 0,
          title: {
            text: ''
          },
          labels: {
            rotation: -45,
            style: {
              fontSize: '8px',
              fontFamily: 'Verdana, sans-serif'
            }
          }
        },
        tooltip: {
          pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}%</b><br/>',
          shared: true
        },
        plotOptions: {
          column: {
            pointPadding: 0.2,
            borderWidth: 0,
            dataLabels: {
              enabled: true,
              format: '{point.y}%',
              style: {
                fontSize: '8px'
              }
            }
          }
        },
        series: [{
          name: '',
          data: [71, 40, 31, 25, 14, 9, 8, 8, 7, 5, 3, 3, 2, 1, 1],
          color: '#A7CF90'
        }]
      },
      chartOptions3: {
        chart: {
          type: 'column',
          backgroundColor: 'transparent'
        },
        legend:{ enabled:false },
        credits: {
          enabled: false
        },
        title: {
          text: 'Evolution des contextes principaux de lgbtiphobies entre 2022 et 2023'
        },
        xAxis: {
          categories : ['haine en ligne', 'famille', 'commerces, services', 'lieux publics', 'voisinage', 'mal de vivre'],
          title: {
            text: null
          },
          labels: {
            rotation: -45,
            style: {
              fontSize: '10px',
              fontFamily: 'Verdana, sans-serif'
            }
          }
        },
        yAxis: {
          min: 0,
          title: {
            text: ''
          }
        },
        tooltip: {
          pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}%</b><br/>',
          shared: true
        },
        plotOptions: {
          column: {
            pointPadding: 0.2,
            borderWidth: 0,
            dataLabels: {
              enabled: true,
              format: '{point.y}%',
              style: {
                fontSize: '8px'
              }
            }
          }
        },
        series: [
          {
            name: '2022',
            data: [17, 15, 13, 12, 9, 9],
            color: '#A7CF90'
          },
          {
            name: '2023',
            data: [23, 13, 11, 10, 8, 7],
            color: '#EC9781'
          }
        ]
      },
      currentChartOptions: {}
    };
  },
  methods: {
    switchChart(chartNumber) {
      this.activeChart = chartNumber;
      if (chartNumber === 1) {
        this.currentChartOptions = this.chartOptions1;
      } else {
        this.currentChartOptions = this.chartOptions2;
      }
    },
    showImage(imageSrc) {
      this.hoverImage = imageSrc;
    },
    hideImage() {
      this.hoverImage = null;
    },
    updateImagePosition(event) {
      this.hoverImageStyle.top = event.clientY + 10 + 'px';
      this.hoverImageStyle.left = event.clientX + 10 + 'px';
    }
  },
  mounted() {
    this.currentChartOptions = this.chartOptions1;
  }
};
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


.new-section {
  position: relative;
  display: block;
}

@media (max-width: 768px) {
  .new-section {
    display: contents;
  }
}

.info-panel {
  width: 80%;
  max-width: 1000px;
  margin: 50px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.info-question {
  display: inline-block;
  width: 80%;
  max-width: 1000px;
  margin: 50px;
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

.info-title-container-left {
  display: flex;
  justify-content: flex-start;
}

.info-title {
  padding-right: 10px;
  padding-left: 10px;
  margin-top: 20px;
  font-size: 20px;
  background-color: #EC9781;
  color: white;
}

.dataKey {
  font-size: 20px;
  padding-right: 10px;
  padding-left: 10px;
  background-color: #A7CF90;
  color: white;
}

.info-content {
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.info-image-50 {
  width: 50%;
  max-width: 600px;
  margin-bottom: 15px;
  border-radius: 8px;
}
.info-image-30 {
  width: 30%;
  max-width: 600px;
  margin-bottom: 15px;
  border-radius: 8px;
}
.info-data {
  padding: 40px;
}

.chart-toggle-buttons {
  display: flex;
  justify-content: center;
  margin-bottom: 15px;
}

.chart-toggle-buttons button {
  margin: 0 10px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  background-color: white;
  color: #A7CF90;
  border: 1px solid #A7CF90;
  border-radius: 4px;
  transition: background-color 0.3s, color 0.3s;
}

.chart-toggle-buttons button.active {
  background-color: #A7CF90;
  color: white;
}

a  {
   color: #EC9781;
   z-index: 2;
}

a:hover {
  color: #A7CF90;
  font-weight: bold;
}

.hover-image {
  position: fixed;
  pointer-events: none;
  /* z-index: 1000; */
  z-index: 1;
}

.hover-image img {
  z-index: 1;
  width: 200px;
  height: auto;
}

.text-content {
  text-align: left;
  line-height: 1.5;
}

.text-content p {
  padding: 30px;
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

  .info-image-50 {
    margin-right: 20px;
    margin-bottom: 0;
  }
}
</style>
