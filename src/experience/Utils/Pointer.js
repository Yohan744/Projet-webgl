import Experience from "../Experience";
import {Raycaster} from "three";
import Locations from "../World/Locations";
import EventEmitter from "./EventEmitter";

export default class Pointer extends EventEmitter {

    constructor() {

        super()

        this.instance = this

        this.experience = new Experience()
        this.locations = new Locations().instance

        this.raycaster = new Raycaster()
        this.intersects = []

        this.mouse = {
            x: 0,
            y: 0
        }

        this.oldMouse = {
            x: 0,
            y: 0
        }

        this.experience.on('ready', () => {
            this.locations = this.locations.getLocations()
            this.scene = this.experience.scene
            this.setEvents()
        })

    }

    setEvents() {
        window.addEventListener("pointermove", (_event) => this.onMovement(_event),)
        window.addEventListener('click', this.onClick.bind(this), false);
    }

    onMovement(_event) {
        this.mouse.x = (_event.clientX / window.innerWidth) * 2 - 1
        this.mouse.y = -(_event.clientY / window.innerHeight) * 2 + 1

        this.oldMouse.x = this.mouse.x
        this.oldMouse.y = this.mouse.y
    }

    onClick(event) {
        event.preventDefault();
        this.raycaster.setFromCamera(this.mouse, this.experience.camera.instance);
        const intersects = this.raycaster.intersectObjects(this.locations, false);
        if (intersects.length > 0) {
            this.trigger('spot-clicked', [intersects[0]])
        }
    }

    getIntersects() {
        return this.intersects
    }

    getMousePosition() {
        return this.mouse
    }

    getOldMousePosition() {
        return this.oldMouse
    }

    destroy() {
        window.removeEventListener("pointermove", (_event) => this.onMovement(_event),)
        window.removeEventListener('click', this.onClick.bind(this), false);
    }

}