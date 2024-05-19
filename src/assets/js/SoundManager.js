import { Howl, Howler } from 'howler';
import { data } from '../../data/Sounds.js';
import { useAppStore } from '../../stores/appStore.js';
import {watch} from "vue";

export default class SoundManager {

    constructor() {

        this.appStore = useAppStore();

        this.sounds = {};

        this.init()

        watch(() => this.appStore.$state.globalVolume, (value) => {
            Howler.volume(this.appStore.$state.globalVolume);
        });

    }

    init() {

        Object.keys(data).forEach(key => {
            const sound = data[key];
            this.sounds[key] = new Howl({
                src: sound.src,
                volume: sound.volume,
                preload: sound.preload,
                loop: sound.loop,
            });
        });

        Howler.volume(this.appStore.$state.globalVolume);

    }

    play(key) {
        if (this.sounds[key].state() === 'unloaded') this.loadSongs()
        if (!this.appStore.$state.muted && !this.sounds[key].playing()) {
            this.sounds[key].play();
        } else {
            console.log(this.sounds[key].playing())
            console.log("zebi")
        }
    }

    pause(key) {
        this.sounds[key].pause();
        this.sounds[key].isPlaying = false;
    }

    stop(key) {
        this.sounds[key].stop();
    }

    fadeIn(key, duration) {
        if (!this.appStore.$state.muted && !this.sounds[key].playing()) {
            this.sounds[key].fade(0, this.sounds[key].volume(), duration);
        }
    }

    fadeOut(key, duration) {
        if (!this.appStore.$state.muted && !this.sounds[key].playing()) {
            this.sounds[key].fade(this.sounds[key].volume(), 0, duration);
        }
    }

    playSoundWithBackgroundFade(key, fadeDuration) {
        const originalVolume = this.sounds['background'].volume();

        this.sounds['background'].fade(originalVolume, originalVolume / 3, fadeDuration);

        setTimeout(() => {
            this.sounds[key].play();

            this.sounds[key].on('end', () => {
                this.sounds['background'].fade(originalVolume / 3, originalVolume, fadeDuration);
                this.sounds[key].off('end');
            });
        }, fadeDuration * 1000);
    }

    setSoundVolume(key, volume) {
        this.sounds[key].volume(volume);
    }

    getRandomSound() {
        const generalSounds = Object.keys(data).filter(key => key.includes('general'));
        const randomIndex = Math.floor(Math.random() * generalSounds.length);
        return generalSounds[randomIndex];
    }

    mute() {
        Howler.mute(true);
        this.appStore.toggleMute(true);
        this.pause('background')
    }

    unmute() {
        Howler.mute(false);
        this.appStore.toggleMute(false);
        this.play('background')
    }

    loadSongs() {
        Object.keys(this.sounds).forEach(key => {
            this.sounds[key].load();
        });
    }

    destroy() {
        Object.keys(this.sounds).forEach(key => {
            this.sounds[key].stop();
            this.sounds[key].unload();
        });
    }

}