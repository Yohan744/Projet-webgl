import { Howl, Howler } from 'howler';

const params = {
    globalVolume: 0.5,
    backgroundVolume: 0.2,
    dialogueVolume: 0.5,
    isMuted: false,
}

export const data = {
    background: {
        src: "...",
        volume: 0,
        preload: false,
        loop: true,
    },
    // ambiance ...
}

Howler.volume(params.globalVolume)

const sounds = {}

Object.keys(data).forEach(key => {
    const sound = data[key]
    sounds[key] = new Howl({
        src: sound.src,
        volume: sound.volume,
        preload: sound.preload,
        loop: sound.loop,
    })
})

export default class SoundManager {

    constructor() {

        if (!params.isMuted) {
            SoundManager.playBackground()
        }

    }

    static playBackground() {
        sounds.background.play()
    }

    static stopBackground() {
        sounds.background.stop()
    }

    static play(key) {
        if (!sounds[key].playing()) {
            sounds[key].play()
        }
    }

    static stop(key) {
        sounds[key].stop()
    }

    static fadeIn(key, duration) {
        sounds[key].fade(0, sounds[key].volume(), duration)
    }

    static fadeOut(key, duration) {
        sounds[key].fade(sounds[key].volume(), 0, duration)
    }

    static setVolume(key, volume) {
        sounds[key].volume(volume)
    }

    static mute() {
        Howler.mute(true)
    }

    static unmute() {
        Howler.mute(false)
    }
}