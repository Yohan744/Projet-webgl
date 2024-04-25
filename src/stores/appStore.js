import { defineStore } from "pinia";

export const useAppStore = defineStore({
    id: "app",
    state: () => ({
        muted: false,
        isVideoIntroWatched: false
    }),
    getters: {

    },
    actions: {
        toggleMute() {
            this.muted = !this.muted
        },
        setVideoIntroWatched() {
            this.isVideoIntroWatched = true
        }
    },
    persist: true
})