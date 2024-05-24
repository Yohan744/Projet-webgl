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