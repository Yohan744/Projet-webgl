import { defineStore } from "pinia";

export const useAppStore = defineStore({
    id: "app",
    state: () => ({
        muted: false,
        lastVisitedRoute: null,
        isVideoIntroWatched: false,
        isExperienceVisible: false,
        isCameraOnSpot: false,
        isSettingsOpen: false
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
        setExperienceVisible() {
            this.isExperienceVisible = true
        },
        updateCameraOnSpot(state) {
            this.isCameraOnSpot = state
        },
        setCarousel(state) {
            this.isCarouselSetted = state
        },
        toggleSettings() {
            this.isSettingsOpen = !this.isSettingsOpen
        },
        resetSomeStatesOnReload() {
            this.lastVisitedRoute = null
            this.isExperienceVisible = false
            this.isCameraOnSpot = false
            this.isSettingsOpen = false
        },
        resetAll() {
            this.muted = false
            this.lastVisitedRoute = null
            this.isVideoIntroWatched = false
            this.isExperienceVisible = false
            this.isCameraOnSpot = false
            this.isSettingsOpen = false
        }
    },
    persist: true
})