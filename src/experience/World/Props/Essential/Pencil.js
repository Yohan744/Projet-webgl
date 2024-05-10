import Experience from "../../../Experience";
import Outline from "../../Effects/Outline";
import * as THREE from "three";
import Prop from "../Prop";
import {MouseUtils} from "../../Utils/MouseUtils";
import gsap from "gsap";

export default class Pencil extends Prop {

    constructor(mesh, desiredRotationOnClick = new THREE.Vector3(0, 0, 0), animatePropsToCameraOnClick = true, isOutlined = 1.05, propSound) {
        super(mesh, desiredRotationOnClick, animatePropsToCameraOnClick, isOutlined, propSound)

        this.experience = new Experience();
        this.resources = this.experience.resources;
        this.scene = this.experience.scene;

    }

    init() {

    }

    onClick() {
        console.log("click crayon")
    }

    destroy() {
        super.destroy()
    }
}
