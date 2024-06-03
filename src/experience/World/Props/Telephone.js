import Experience from "../../Experience";
import Prop from "./Prop";
import * as THREE from "three";

export default class Telephone extends Prop {

    constructor(mesh, desiredRotationOnClick = new THREE.Vector3(0, 0, 0), animatePropsToCameraOnClick = true, distanceToCamera = 0.6, isOutlined = 1.05, propSound) {
        super(mesh, desiredRotationOnClick, animatePropsToCameraOnClick, distanceToCamera, isOutlined, propSound);

        this.experience = new Experience();
        this.resources = this.experience.resources;
        this.scene = this.experience.scene;

        this.init();
    }

    init() {
        this.moveToInitialPosition();
    }

    moveToInitialPosition() {
        this.mesh.position.set(4.5, 0.8, -3);
        this.mesh.rotation.set(0, 0, 0);
        this.mesh.scale.set(1, 1, 1);
    }

    onClickGeneral() {
        // Implémentation du comportement général du clic
    }

    onClick() {
        console.log("click telephone");
        // Implémentation spécifique pour le clic sur le téléphone
    }

    destroy() {
        super.destroy();
    }
}
