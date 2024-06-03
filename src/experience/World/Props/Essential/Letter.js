import * as THREE from "three";
import Experience from "../../../Experience";
import Prop from "../Prop";

export default class Letter {
    constructor(mesh) {

        this.experience = new Experience();
        this.resources = this.experience.resources;
        this.scene = this.experience.scene;
        this.mesh = mesh;


    }

    init() {
        this.mesh.position.set(3.9, 1, -2.1);
        this.mesh.rotation.set(0, 2, 0);
        this.mesh.scale.set(1, 1, 1);
    }

    onClickGeneral() {

    }

    onClick() {
        console.log("click Letter")
    }

    destroy() {
        super.destroy()
    }

}