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
    chest: {
        src: fx + 'malle.mp3',
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
    inPocket: {
        src: fx + 'pocketIn.mp3',
        volume: 0.85,
        preload: true,
        loop: false,
    },

    outPocket: {
        src: fx + 'pocketOut.mp3',
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
        volume: 0.125,
        preload: true,
        loop: true,
    },

    projectorDiapoChanged: {
        src: fx + 'projectorDiapoChanged.mp3',
        volume: 0.4,
        preload: true,
        loop: false,
    },

}