import Experience from "../Experience";
import {Raycaster} from "three";
import Locations from "../World/Locations";
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
        this.locations = new Locations().instance

        this.raycaster = new Raycaster()
        this.intersects = []
        this.triggerTreshold = 0.035

        this.mouse = {
            x: 0,
            y: 0
        }

        this.oldMouse = {
            x: 0,
            y: 0
        }

        this.experience.on('ready', async () => {
            this.locations = this.locations.getLocations()
            await this.setEvents()
        })

    }

    setEvents() {
        window.addEventListener("pointermove", this.onMovement.bind(this))
        window.addEventListener('pointerdown', this.onClick.bind(this));
        window.addEventListener('pointerup', this.onClickRelease.bind(this));
    }

    onMovement(_event) {
        this.oldMouse.x = this.mouse.x
        this.oldMouse.y = this.mouse.y

        this.mouse.x = (_event.clientX / window.innerWidth) * 2 - 1
        this.mouse.y = -(_event.clientY / window.innerHeight) * 2 + 1

        const deltaX = Math.abs(this.mouse.x - this.oldMouse.x);
        const deltaY = Math.abs(this.mouse.y - this.oldMouse.y);

        if (deltaX > this.triggerTreshold || deltaY > this.triggerTreshold) {
            this.trigger('movement', [this.mouse]);
        }

    }

    onClick() {
        this.raycaster.setFromCamera(this.mouse, this.experience.camera.instance);
        this.trigger('click')
        const intersects = this.raycaster.intersectObjects(this.locations, false);
        if (intersects.length > 0) {
            this.trigger('spot-clicked', [intersects[0]])
        }
    }

    onClickRelease() {
        this.trigger('click-release')
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