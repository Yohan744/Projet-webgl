import Experience from "../Experience";
import {Raycaster} from "three";
import EventEmitter from "./EventEmitter";
import {getActualCursor} from "../../assets/js/Cursor";
import {getInteractablesMesh} from "../World/ObjectsInteractable";

export default class Pointer extends EventEmitter {
    static instance

    constructor() {
        super()

        if (Pointer.instance) {
            return Pointer.instance
        }
        Pointer.instance = this

        this.experience = new Experience()
        this.gameManager = this.experience.gameManager
        this.globalEvents = this.experience.globalEvents

        this.raycaster = new Raycaster()
        this.triggerMovementTreshold = 0.035

        this.projectorMesh = []

        this.mouse = {
            x: 0,
            y: 0
        }

        this.oldMouse = {
            x: 0,
            y: 0
        }

        this.experience.on('ready', async () => {
            this.locations = this.experience.world.locations.getLocations()
            await this.setEvents()
        })

    }

    setEvents() {
        window.addEventListener("pointermove", this.onMovement.bind(this))
        window.addEventListener('pointerdown', this.onClick.bind(this));
        window.addEventListener('pointerup', this.onClickRelease.bind(this));
    }

    onMovement(_event) {
        this.updateMousePosition(_event)

        const deltaX = Math.abs(this.mouse.x - this.oldMouse.x);
        const deltaY = Math.abs(this.mouse.y - this.oldMouse.y);

        if (deltaX > this.triggerMovementTreshold || deltaY > this.triggerMovementTreshold) {
            this.trigger('movement', [this.mouse]);
        }

        if (this.gameManager.state.isInteractingWithObject) {
            this.trigger('movement-orbit', [this.mouse]);
        }

        this.raycaster.setFromCamera(this.mouse, this.experience.camera.instance);
        this.checkIntersections()
    }

    onClick(_event) {
        this.updateMousePosition(_event)
        const intersects = this.raycaster.intersectObjects(this.locations, false);
        if (intersects.length > 0 && !this.gameManager.state.isCameraOnSpot && !this.gameManager.state.isInteractingWithObject && !this.experience.camera.isMoving) {
            const position = intersects[0].object.position.clone()
            const lookingPoint = intersects[0].object.data.lookingPoint
            this.trigger('spot-clicked', [position, lookingPoint])
            this.experience.world.locations.setLocationsVisibility(false)
        }
        this.trigger('click')
    }

    onClickRelease() {
        this.trigger('click-release')
    }

    updateMousePosition(_event) {
        this.oldMouse.x = this.mouse.x
        this.oldMouse.y = this.mouse.y

        this.mouse.x = (_event.clientX / window.innerWidth) * 2 - 1
        this.mouse.y = -(_event.clientY / window.innerHeight) * 2 + 1
    }

    getMousePosition() {
        return this.mouse
    }

    getOldMousePosition() {
        return this.oldMouse
    }

    checkIntersections() {

        if (!this.gameManager.state.isSettingsOpen) {

            if (this.gameManager.state.isCameraOnSpot) {

                if (this.gameManager.state.isInteractingWithObject) {

                    /////

                } else {

                    const interactableMesh = this.raycaster.intersectObjects(getInteractablesMesh(), false)

                    if (interactableMesh.length > 0 && getActualCursor() !== 'grab') {
                        this.globalEvents.trigger('change-cursor', {name: 'grab'})
                    }

                    if (interactableMesh.length === 0 && getActualCursor() !== 'default') {
                        this.globalEvents.trigger('change-cursor', {name: 'default'})
                    }

                }

            } else {

                const locations = this.raycaster.intersectObjects(this.locations, false)

                if (locations.length > 0 && getActualCursor() !== 'grab') {
                    this.globalEvents.trigger('change-cursor', {name: 'grab'})
                }

                if (locations.length === 0 && getActualCursor() !== 'default') {
                    this.globalEvents.trigger('change-cursor', {name: 'default'})
                }


            }

        }

    }

    destroy() {
        Pointer.instance = null
        window.removeEventListener("pointermove", (_event) => this.onMovement(_event))
        window.removeEventListener('pointerdown', this.onClick.bind(this), false);
        window.removeEventListener('pointerup', this.onClickRelease.bind(this), false);
    }

}