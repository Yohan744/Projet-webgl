import { defineStore } from "pinia";

export const useAppStore = defineStore({
    id: "app",
    state: () => ({
        muted: false,
        lastVisitedRoute: null,
        isVideoIntroWatched: false
    }),
    getters: {

    },
    actions: {
        toggleMute(state) {
            this.muted = state
        },
        setLastVisitedRoute(route) {
            this.lastVisitedRoute = route
        },
        setVideoIntroWatched() {
            this.isVideoIntroWatched = true
        },
        resetAll() {
            this.muted = false
            this.isVideoIntroWatched = false
        }
    },
    persist: true
})