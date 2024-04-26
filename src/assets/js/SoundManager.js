import { Howl, Howler } from 'howler';
import { data } from '../../data/Sounds.js';
import { useAppStore } from '../../stores/appStore.js';

const appStore = useAppStore()

const params = {
    globalVolume: 0.5,
    backgroundVolume: 0.2,
    dialogueVolume: 0.5,
    isMuted: appStore.$state.isMuted,
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

    static playBackground() {
        if (!params.isMuted && !sounds.background.playing()) {
            sounds.background.play()
        }
    }

    static stopBackground() {
        sounds.background.stop()
    }

    static play(key) {
        if (!params.isMuted && !sounds[key].playing()) {
            sounds[key].play()
        }
    }

    static stop(key) {
        sounds[key].stop()
    }

    static fadeIn(key, duration) {
        if (!params.isMuted && !sounds[key].playing()) {
            sounds[key].fade(0, sounds[key].volume(), duration)
        }
    }

    static fadeOut(key, duration) {
        if (!params.isMuted && !sounds[key].playing()) {
            sounds[key].fade(sounds[key].volume(), 0, duration)
        }
    }

    static setVolume(key, volume) {
        sounds[key].volume(volume)
    }

    static mute() {
        Howler.mute(true)
        appStore.toggleMute(true)
    }

    static unmute() {
        Howler.mute(false)
        appStore.toggleMute(false)
    }
}