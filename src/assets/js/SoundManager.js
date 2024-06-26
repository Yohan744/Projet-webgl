import { Howl, Howler } from 'howler';
import { data } from '../../data/Sounds.js';
import { useAppStore } from '../../stores/appStore.js';
import { watch } from "vue";

export default class SoundManager {

    constructor() {
        this.appStore = useAppStore();
        this.sounds = {};
        this.init();

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

        this.backgroundOriginalVolume = this.sounds['background'].volume();

        Howler.volume(this.appStore.$state.globalVolume);
    }

    play(key) {
        if (this.sounds[key].state() === 'unloaded') this.loadSongs();
        if (!this.appStore.$state.muted && !this.sounds[key].playing()) {
            this.sounds[key].play();
        }
    }

    pause(key) {
        this.sounds[key].pause();
    }

    stop(key) {
        this.sounds[key].stop();
    }

    fadeIn(key, duration) {
        const sound = this.sounds[key];
        if (!this.appStore.$state.muted && !sound.playing()) {
            if (sound.state() === 'loaded') {
                const targetVolume = sound.volume();
                sound.volume(0); // Set initial volume to 0
                sound.play();
                sound.fade(0, targetVolume, duration);
            } else {
                sound.once('load', () => {
                    const targetVolume = sound.volume();
                    sound.volume(0); // Set initial volume to 0
                    sound.play();
                    sound.fade(0, targetVolume, duration);
                });
            }
        }
    }

    fadeOut(key, duration) {
        const sound = this.sounds[key];
        if (!this.appStore.$state.muted && sound.playing()) {
            sound.fade(sound.volume(), 0, duration);
        }
    }

    fadeOutAndStopBackground(fadeDuration, onComplete = () => {}) {
        const originalVolume = this.sounds['background'].volume();

        this.sounds['background'].fade(originalVolume, 0, fadeDuration);

        setTimeout(() => {
            this.sounds['background'].stop();
            if (onComplete) onComplete();
        }, fadeDuration * 1000);
    }

    playSoundWithBackgroundFade(key, fadeDuration) {

        this.sounds['background'].fade(this.backgroundOriginalVolume, this.backgroundOriginalVolume / 3, fadeDuration);

        setTimeout(() => {
            this.sounds[key].play();

            this.sounds[key].on('end', () => {
                this.sounds['background'].fade(this.backgroundOriginalVolume / 3, this.backgroundOriginalVolume, fadeDuration);
                this.sounds[key].off('end');
            });
        }, fadeDuration * 1000)

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
        this.pause('background');
    }

    unmute() {
        Howler.mute(false);
        this.appStore.toggleMute(false);
        this.play('background');
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
