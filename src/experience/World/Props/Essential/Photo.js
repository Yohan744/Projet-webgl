import * as THREE from "three";
import Experience from "../../../Experience";
import Outline from "../../Effects/Outline";
import { PI } from "three/examples/jsm/nodes/Nodes.js";

export default class Photo {
    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;
        this.renderer = this.experience.renderer.instance;
        this.camera = this.experience.camera.instance;
        this.pointer = this.experience.pointer;
        this.mixer = null;
        this.mesh = new THREE.Mesh(
            new THREE.BoxGeometry(1, 1, 1), 
            new THREE.MeshBasicMaterial({color: 0xff0000})
                 );
        this.init();
    }

    init() {
        this.photoModel = this.resources.items.photoModel.scene
        this.photoModel.scale.set(1, 1, 1);
        this.photoModel.position.set(0, 2.25, 9.32);
        
        this.photoModel.rotation.x = Math.PI / 2;
        this.scene.add(this.photoModel);
        //this.camera.scene.add(this.photoModel);
        console.log(this.photoModel.position);
    }
    onClick() {
        console.log("photo")
    }

    destroy() {
        super.destroy()
    }
}
