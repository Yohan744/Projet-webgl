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

    cassette: {
        src: p + 'cassette.m4a',
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