import Experience from "../Experience";
import {Raycaster} from "three";
import EventEmitter from "./EventEmitter";

export default class Pointer extends EventEmitter {
    static instance

    constructor() {
        super()

        if (Pointer.instance) {
            return Pointer.instance
        }
        Pointer.instance = this

        this.experience = new Experience()
        this.appStore = this.experience.appStore

        this.raycaster = new Raycaster()
        this.intersects = []
        this.triggerMovementTreshold = 0.035

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

        if (this.appStore.$state.isInteractingWithObject) {
            this.trigger('movement-orbit', [this.mouse]);
        }

    }

    onClick(_event) {
        this.updateMousePosition(_event)
        this.raycaster.setFromCamera(this.mouse, this.experience.camera.instance);
        const intersects = this.raycaster.intersectObjects(this.locations, false);
        if (intersects.length > 0) {
            const position = intersects[0].object.position.clone()
            const lookingPoint = intersects[0].object.data.lookingPoint
            this.trigger('spot-clicked', [position, lookingPoint])
            this.appStore.setSpotId(intersects[0].object.data.id)
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

    destroy() {
        window.removeEventListener("pointermove", (_event) => this.onMovement(_event))
        window.removeEventListener('pointerdown', this.onClick.bind(this), false);
        window.removeEventListener('pointerup', this.onClickRelease.bind(this), false);
    }

}