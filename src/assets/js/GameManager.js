import { reactive } from 'vue';

const state = reactive({
    gameStepId: -1,
    lastVisitedRoute: null,
    isExperienceVisible: false,
    isCameraOnSpot: false,
    actualObjectInteractingName: null,
    isInteractingWithObject: false,
    isSettingsOpen: false,
    isPocketButtonVisible: false,
    objectToPocket: false,
    isPencilInFrontOfCamera: false,
    isCassetteInFrontOfCamera: false,
    isWalkmanInFrontOfCamera: false,
    showingInventoryObjectInFrontOfCamera: null,
});

const inventory = reactive({
    cassette: false,
    pencil: false,
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

    function updatePocketButtonState(stateValue) {
        state.isPocketButtonVisible = stateValue;
    }

    function updateObjectToPocket(stateValue) {
        state.objectToPocket = stateValue;
    }

    function setPencilInFrontOfCamera(stateValue) {
        state.isPencilInFrontOfCamera = stateValue;
    }

    function setCassetteInFrontOfCamera(stateValue) {
        state.isCassetteInFrontOfCamera = stateValue;
    }
    function setWalkmanInFrontOfCamera(stateValue) {
        state.isWalkmanInFrontOfCamera = stateValue;
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
        state.gameStepId = 0;
        state.lastVisitedRoute = null;
        state.isExperienceVisible = false;
        state.isCameraOnSpot = false;
        state.actualObjectInteractingName = null;
        state.isInteractingWithObject = false;
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
        incrementGameStepId,
        setGameStepId,
        setLastVisitedRoute,
        setExperienceVisible,
        updateCameraOnSpot,
        setActualObjectInteractingName,
        updateInteractingState,
        toggleSettings,
        updatePocketButtonState,
        addObjectToInventory,
        updateObjectToPocket,
        setPencilInFrontOfCamera,
        setCassetteInFrontOfCamera,
        setWalkmanInFrontOfCamera,
        setInventoryObjectInFrontOfCamera,
        resetAll,
    };
}
