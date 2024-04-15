import Experience from "../Experience";
import { Raycaster } from "three";

export default class Pointer {
    static instance

    constructor() {

        if (Pointer.instance) {
            return Pointer.instance
        }
        Pointer.instance = this

        this.experience = new Experience()
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

        this.setEvents()

    }

    setEvents() {
        const element = this.experience.targetElement
        const canva = element.querySelector("canvas")
        if (canva) {
            canva.addEventListener("mousemove", (_event) => this.onMovement(_event), {passive: true})
            canva.addEventListener("touchmove", (_event) => this.onMovement(_event), {passive: true})

        }
    }

    onMovement(_event) {
        this.mouse.x = (_event.clientX / window.innerWidth) * 2 - 1
        this.mouse.y = -(_event.clientY / window.innerHeight) * 2 + 1

        this.oldMouse.x = this.mouse.x
        this.oldMouse.y = this.mouse.y
    }

    getIntersects() {
        return this.intersects
    }

    getMousePosition() {
        return this.mouse
    }

    update() {
        this.raycaster.setFromCamera(this.mouse, this.experience.camera.instance)
        this.intersects = this.raycaster.intersectObjects(this.experience.scene.children, true)
    }

}