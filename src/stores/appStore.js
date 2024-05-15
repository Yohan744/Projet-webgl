import { defineStore } from "pinia";

export const useAppStore = defineStore({
    id: "app",
    state: () => ({
        muted: false,
        globalVolume: 0.5,
        lastVisitedRoute: null,
        isVideoIntroWatched: false,
        isExperienceVisible: false,
        isCameraOnSpot: false,
        isInteractingWithObject: false,
        isOrbitControlsEnabled: false,
        isSettingsOpen: false,
        isPocketButtonVisible: false,
        objectToPocket: false,
        isCassetteInPocket: false,
        objectOut: false,
    }),
    getters: {

    },
    actions: {
        toggleMute(state) {
            this.muted = state
        },
        setGlobalVolume(volume) {
            this.globalVolume = volume
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
        updateInteractingState(state) {
            this.isInteractingWithObject = state
        },
        updateOrbitsControlsState(state) {
            this.isOrbitControlsEnabled = state
        },
        toggleSettings() {
            this.isSettingsOpen = !this.isSettingsOpen
        },
        updatePocketState(state) {
            this.isPocketButtonVisible = state;
        },
        updateObjectToPocket(state) {
            this.objectToPocket = state;
        },
        updateCassetteInPocketState(state) {
            this.isCassetteInPocket = state;
        },
        initObjectFromThePocket() {
            this.isObjectOut = !this.objectOut;
        },
        resetSomeStatesOnReload() {
            this.lastVisitedRoute = null
            this.isExperienceVisible = false
            this.isCameraOnSpot = false
            this.isInteractingWithObject = false
            this.isOrbitControlsEnabled = false
            this.isSettingsOpen = false
            this.isPocketButtonVisible = false
            this.objectToPocket = false
            this.isCassetteInPocket = false
        },
        resetAll() {
            this.muted = false
            this.globalVolume = 0.5
            this.lastVisitedRoute = null
            this.isVideoIntroWatched = false
            this.isExperienceVisible = false
            this.isCameraOnSpot = false
            this.isInteractingWithObject = false
            this.isOrbitControlsEnabled = false
            this.isSettingsOpen = false
            this.isPocketButtonVisible = false
            this.objectToPocket = false
            this.isCassetteInPocket = false,
            this.objectOut = false
        }
    },
    persist: true
})
