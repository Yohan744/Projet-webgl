import * as THREE from "three";
import Experience from "../../../Experience";
import Outline from "../../Effects/Outline";

export default class Malle {
    constructor() {
        this.experience = new Experience();
        this.camera = this.experience.camera.instance;
        this.pointer = this.experience.pointer;
        this.mixer = null;

        this.init();
    }

    init() {

    }

    update(deltaTime) {
        if (this.mixer) {
            this.mixer.update(deltaTime);
        }
    }

    destroy() {
    }
}
