import { reactive } from 'vue';

const state = reactive({
    lastVisitedRoute: null,
    isExperienceVisible: false,
    isCameraOnSpot: false,
    spotId: null,
    actualObjectInteractingName: null,
    isInteractingWithObject: false,
    isOrbitControlsEnabled: false,
    isSettingsOpen: false,
    isPocketButtonVisible: false,
    objectToPocket: false,
    isCassetteInPocket: false,
    isPencilInPocket: false,
    objectOut: false,
});

export function useGameManager() {

    function setLastVisitedRoute(route) {
        state.lastVisitedRoute = route;
    }

    function setExperienceVisible() {
        state.isExperienceVisible = true;
    }

    function updateCameraOnSpot(stateValue) {
        state.isCameraOnSpot = stateValue;
    }

    function setSpotId(id) {
        state.spotId = id;
    }

    function setActualObjectInteractingName(name) {
        state.actualObjectInteractingName = name;
    }

    function updateInteractingState(stateValue) {
        state.isInteractingWithObject = stateValue;
    }

    function updateOrbitsControlsState(stateValue) {
        state.isOrbitControlsEnabled = stateValue;
    }

    function toggleSettings() {
        state.isSettingsOpen = !state.isSettingsOpen;
    }

    function updatePocketState(stateValue) {
        state.isPocketButtonVisible = stateValue;
    }

    function updateObjectToPocket(stateValue) {
        state.objectToPocket = stateValue;
    }

    function updateCassetteInPocketState(stateValue) {
        state.isCassetteInPocket = stateValue;
    }
    function updatePencilInPocketState(stateValue) {
        state.isPencilInPocket = stateValue;
    }

    function initObjectFromThePocket() {
        state.objectOut = !state.objectOut;
    }

    function resetAll() {
        state.lastVisitedRoute = null;
        state.isExperienceVisible = false;
        state.isCameraOnSpot = false;
        state.spotId = null;
        state.actualObjectInteractingName = null;
        state.isInteractingWithObject = false;
        state.isOrbitControlsEnabled = false;
        state.isSettingsOpen = false;
        state.isPocketButtonVisible = false;
        state.objectToPocket = false;
        state.isCassetteInPocket = false;
        state.pencilIconClicked = false;
        state.objectOut = false;
    }

    return {
        state,
        setLastVisitedRoute,
        setExperienceVisible,
        updateCameraOnSpot,
        setSpotId,
        setActualObjectInteractingName,
        updateInteractingState,
        updateOrbitsControlsState,
        toggleSettings,
        updatePocketState,
        updateObjectToPocket,
        updateCassetteInPocketState,
        updatePencilInPocketState,
        initObjectFromThePocket,
        resetAll,
    };
}
