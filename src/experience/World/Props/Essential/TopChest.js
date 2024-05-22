import * as THREE from "three";
import Experience from "../../../Experience";
import Prop from "../Prop";
import {useInteractableObjects} from "../../ObjectsInteractable";

export default class TopChest extends Prop {
    constructor(mesh, desiredRotationOnClick = new THREE.Vector3(0, 0, 0), animatePropsToCameraOnClick = true, distanceToCamera = 0.6, isOutlined = 1.05, propSound) {
        super(mesh, desiredRotationOnClick, animatePropsToCameraOnClick, distanceToCamera, isOutlined, propSound)

        this.experience = new Experience();
        this.resources = this.experience.resources;
        this.scene = this.experience.scene;

    }

    init() {

    }

    onClickGeneral() {

    }

    onClick() {
        console.log("click top chest")
    }

    destroy() {
        super.destroy()
    }

}