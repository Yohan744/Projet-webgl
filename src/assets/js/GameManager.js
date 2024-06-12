import { reactive } from 'vue';

const state = reactive({
    gameStepId: 0,
    lastVisitedRoute: null,
    isExperienceVisible: false,
    isCameraOnSpot: false,
    actualObjectInteractingName: null,
    isInteractingWithObject: false,
    isSettingsOpen: false,
});

export function useGameManager() {

    function incrementGameStepId() {
        state.gameStepId++;
        console.log("new gameStepId: " + state.gameStepId)
    }

    function setGameStepId(id) {
        state.gameStepId = id;
        console.log("new gameStepId: " + state.gameStepId)
    }

    function setLastVisitedRoute(route) {
        state.lastVisitedRoute = route;
    }

    function setExperienceVisible() {
        state.isExperienceVisible = true;
    }

    function updateCameraOnSpot(stateValue) {
        state.isCameraOnSpot = stateValue;
    }

    function setActualObjectInteractingName(name) {
        state.actualObjectInteractingName = name;
    }

    function updateInteractingState(stateValue) {
        state.isInteractingWithObject = stateValue;
    }

    function toggleSettings() {
        state.isSettingsOpen = !state.isSettingsOpen;
    }

    function resetAll() {
        state.gameStepId = 0;
        state.lastVisitedRoute = null;
        state.isExperienceVisible = false;
        state.isCameraOnSpot = false;
        state.actualObjectInteractingName = null;
        state.isInteractingWithObject = false;
        state.isSettingsOpen = false;
    }

    return {
        state,
        incrementGameStepId,
        setGameStepId,
        setLastVisitedRoute,
        setExperienceVisible,
        updateCameraOnSpot,
        setActualObjectInteractingName,
        updateInteractingState,
        toggleSettings,
        resetAll,
    };
}
