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
    showingInventoryObjectInFrontOfCamera: null,
});

const inventory = reactive({
    cassette: false,
    pencil: false,
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

    function updatePocketButtonState(stateValue) {
        state.isPocketButtonVisible = stateValue;
    }

    function updateObjectToPocket(stateValue) {
        state.objectToPocket = stateValue;
    }

    function addObjectToInventory(objectName) {
        if (inventory[objectName] !== undefined) {
            inventory[objectName] = true;
        } else {
            console.error('Object not found in inventory, wrong naming');

        }
    }

    function setInventoryObjectInFrontOfCamera(name) {
        state.showingInventoryObjectInFrontOfCamera = name;
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
        state.pencilIconClicked = false;
        state.objectOut = false;
        state.showingInventoryObjectInFrontOfCamera = null;

        inventory.cassette = false;
        inventory.pencil = false;
    }

    return {
        state,
        inventory,
        setLastVisitedRoute,
        setExperienceVisible,
        updateCameraOnSpot,
        setSpotId,
        setActualObjectInteractingName,
        updateInteractingState,
        updateOrbitsControlsState,
        toggleSettings,
        updatePocketButtonState,
        addObjectToInventory,
        updateObjectToPocket,
        setInventoryObjectInFrontOfCamera,
        resetAll,
    };
}
