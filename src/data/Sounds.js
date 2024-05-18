const s = './assets/sounds/';
const g = './assets/sounds/general/';
const p = './assets/sounds/props/';

export const data = {

    background: {
        src: s + 'background.mp3',
        volume: 0.25,
        autoplay: false,
        preload: true,
        loop: true,
    },

    //////// PROPS SOUNDS ////////

    telephone: {
        src: p + 'telephone.mp3',
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

}