import { defineStore } from "pinia";

export const useAppStore = defineStore({
    id: "app",
    state: () => ({
        muted: false,
        globalVolume: 0.5,
        isVideoIntroWatched: false,
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
        resetAll() {
            this.muted = false
            this.globalVolume = 0.5
            this.isVideoIntroWatched = false
        }
    },
    persist: true
})
