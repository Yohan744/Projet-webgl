import Experience from "../../../Experience";
import * as THREE from "three";
import {useInteractableObjects} from "../../ObjectsInteractable";

export default class PencilsGroup {

    constructor(pencilMesh) {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.pointer = this.experience.pointer;
        this.gameManager = this.experience.gameManager;
        this.pencilMesh = pencilMesh;

        this.init();

    }

    init() {
        this.mesh = new THREE.Mesh(
            new THREE.BoxGeometry(0.25, 0.05, 0.25),
            new THREE.MeshBasicMaterial({color: 0x00ff00, visible: false})
        )
        this.mesh.position.copy(this.pencilMesh.position).add(new THREE.Vector3(0, 0, 0.05));
        this.scene.add(this.mesh);

        this.pointer.on('click', this.handleClick.bind(this));

    }

    handleClick() {
        if (!this.gameManager.state.isCameraOnSpot) return;
        const intersects = this.pointer.raycaster.intersectObject(this.mesh, true);
        if (intersects.length > 0 && this.gameManager.state.isCameraOnSpot && !this.gameManager.state.isInteractingWithObject) {
            const pencil = useInteractableObjects().pencil;
            if (pencil.isInFrontOfCamera) return;
            pencil.handleClick(true);
        }
    }

    getMesh() {
        return this.mesh;
    }

}