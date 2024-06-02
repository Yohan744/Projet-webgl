const s = './assets/sounds/';
const g = './assets/sounds/general/';
const p = './assets/sounds/props/';
const fx = './assets/sounds/fx/';

export const data = {

    background: {
        src: s + 'background.mp3',
        volume: 0.5,
        autoplay: false,
        preload: true,
        loop: true,
    },

    //////// PROPS SOUNDS ////////

    walkman: {
        src: p + 'walkman.m4a',
        volume: 0.75,
        preload: true,
        loop: false,
    },
    walkman2: {
        src: p + 'walkman-p2.m4a',
        volume: 0.75,
        preload: true,
        loop: false,
    },
    final: {
        src: p + 'finalMessage.m4a',
        volume: 1,
        preload: true,
        loop: false,
    },
    chest: {
        src: fx + 'malle.mp3',
        volume: 0.75,
        preload: true,
        loop: false,
    },
    lock: {
        src: fx + 'lock.mp3',
        volume: 0.75,
        preload: true,
        loop: false,
    },
    bouton: {
        src: fx + 'BoutonOn.wav',
        volume: 0.75,
        preload: true,
        loop: false,
    },
    fermetureWalkman: {
        src: fx + 'fermetureWalkman.mp3',
        volume: 0.75,
        preload: true,
        loop: false,
    },

    ouvertureWalkman: {
        src: fx + 'OuvertureWalkman.mp3',
        volume: 0.75,
        preload: true,
        loop: false,
    },

    cassetteSet: {
        src: fx + 'cassetteSet.mp3',
        volume: 0.75,
        preload: true,
        loop: false,
    },
    cassetteIn: {
        src: fx + 'cassetteIn.mp3',
        volume: 0.85,
        preload: true,
        loop: false,
    },

    cassetteOut: {
        src: fx + 'cassetteOut.mp3',
        volume: 0.85,
        preload: true,
        loop: false,
    },

    headphoneOn: {
        src: fx + 'headphoneOn.mp3',
        volume: 0.85,
        preload: true,
        loop: false,
    },

    cassette: {
        src: p + 'cassette.m4a',
        volume: 0.75,
        preload: true,
        loop: false,
    },

    cassetteRewind: {
        src: p + 'cassette-rembobiner.m4a',
        volume: 0.75,
        preload: true,
        loop: false,
    },

    rewind: {
        src: fx + 'rattle.mp3',
        volume: 0.75,
        preload: true,
        loop: true,
    },

    crayonFound: {
        src: p + 'crayon-trouver.m4a',
        volume: 0.75,
        preload: true,
        loop: false,
    },
    grab: {
        src: fx + 'crayonGrab.mp3',
        volume: 0.75,
        preload: true,
        loop: false,
    },
    crayonDrop: {
        src: fx + 'crayonDrop.mp3',
        volume: 0.75,
        preload: true,
        loop: false,
    },
    telephone: {
        src: p + 'telephone.m4a',
        volume: 0.75,
        preload: true,
        loop: false,
    },

    telecran: {
        src: p + 'telecran.m4a',
        volume: 0.75,
        preload: true,
        loop: false,
    },

    tv: {
        src: p + 'tv.m4a',
        volume: 0.75,
        preload: true,
        loop: false,
    },

    rubiksCube: {
        src: p + 'rubiksCube.m4a',
        volume: 0.75,
        preload: true,
        loop: false,
    },

    recordPlayer: {
        src: p + 'recordPlayer.m4a',
        volume: 0.75,
        preload: true,
        loop: false,
    },

    pictureIntro: {
        src: p + 'pictureIntro.mp3',
        volume: 0.75,
        preload: true,
        loop: false,
    },

    pictureOutro: {
        src: p + 'pictureOutro.mp3',
        volume: 0.75,
        preload: true,
        loop: false,
    },

    diapo1: {
        src: p + 'diapo1.mp3',
        volume: 1,
        preload: true,
        loop: false,
    },

    diapo2: {
        src: p + 'diapo2.mp3',
        volume: 1,
        preload: true,
        loop: false,
    },

    diapo3: {
        src: p + 'diapo3.mp3',
        volume: 1,
        preload: true,
        loop: false,
    },

    diapo4: {
        src: p + 'diapo4.mp3',
        volume: 1,
        preload: true,
        loop: false,
    },

    diapo5: {
        src: p + 'diapo5.mp3',
        volume: 1,
        preload: true,
        loop: false,
    },

    commode1: {
        src: p + 'commode1.mp3',
        volume: 0.75,
        preload: true,
        loop: false,
    },

    commode2: {
        src: p + 'commode2.mp3',
        volume: 0.75,
        preload: true,
        loop: false,
    },

    commode3: {
        src: p + 'commode3.mp3',
        volume: 0.75,
        preload: true,
        loop: false,
    },

    commode4: {
        src: p + 'commode4.mp3',
        volume: 0.75,
        preload: true,
        loop: false,
    },

    commode5: {
        src: p + 'commode5.mp3',
        volume: 0.75,
        preload: true,
        loop: false,
    },

    commode6: {
        src: p + 'commode6.mp3',
        volume: 0.75,
        preload: true,
        loop: false,
    },

    //////// GENERAL SOUNDS ////////

    general1: {
        src: g + 'general1.mp3',
        volume: 0.75,
        preload: true,
        loop: false,
    },

    general2: {
        src: g + 'general2.mp3',
        volume: 0.75,
        preload: true,
        loop: false,
    },

    general3: {
        src: g + 'general3.mp3',
        volume: 0.75,
        preload: true,
        loop: false,
    },

    //////// FX SOUNDS ////////

    projectorSound: {
        src: fx + 'projectorSound.mp3',
        volume: 0.1,
        preload: true,
        loop: true,
    },

    projectorDiapoChanged: {
        src: fx + 'projectorDiapoChanged.mp3',
        volume: 0.4,
        preload: true,
        loop: false,
    },

    projectorButtonPressed: {
        src: fx + 'projectorButtonPressed.mp3',
        volume: 0.5,
        preload: true,
        loop: false,
    },

    drawerOpening: {
        src: fx + 'drawerOpening.mp3',
        volume: 0.2,
        preload: true,
        loop: false,
    },

    envelopeOpening: {
        src: fx + 'envelopeOpening.mp3',
        volume: 0.7,
        preload: true,
        loop: false,
    },

}