import { defineStore } from "pinia";

export const useAppStore = defineStore({
    id: "app",
    state: () => ({
        muted: false,
        globalVolume: 0.5,
        isVideoIntroWatched: false,
        isVideoOutroWatched: false,
    }),
    actions: {
        toggleMute(state) {
            this.muted = state
        },
        setGlobalVolume(volume) {
            this.globalVolume = volume
        },
        setVideoIntroWatched() {
            this.isVideoIntroWatched = true
        },
        setVideoOutroWatched() {
        this.isVideoOutroWatched = true;
        },
        resetAll() {
            this.muted = false
            this.globalVolume = 0.5
            this.isVideoIntroWatched = false
            this.isVideoOutroWatched = false
        }
    },
    persist: true
})
