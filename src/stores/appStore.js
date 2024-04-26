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
        toggleMute(state) {
            this.muted = state
        },
        setVideoIntroWatched() {
            this.isVideoIntroWatched = true
        }
    },
    persist: true
})