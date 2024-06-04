import Experience from "../../Experience";
import Prop from "./Prop";
import * as THREE from "three";
import gsap from 'gsap';

export default class RubiksCube extends Prop {

    constructor(mesh, desiredRotationOnClick = new THREE.Vector3(0, 0, 0), animatePropsToCameraOnClick = true, distanceToCamera = 0.6, isOutlined = 1.05, propSound) {
        super(mesh, desiredRotationOnClick, animatePropsToCameraOnClick, distanceToCamera, isOutlined, propSound);

        this.experience = new Experience();
        this.resources = this.experience.resources;
        this.scene = this.experience.scene;

        this.init();
    }

    init() {
        this.mesh.position.set(0, -2.1, 8.2);
        this.mesh.rotation.set(0, 0, 0);
        this.mesh.scale.set(1, 1, 1);

       // this.animateRotation();
    }

    animateRotation() {
        gsap.to(this.mesh.rotation, {
            x: 2 * Math.PI,
            y: 2 * Math.PI,
            duration: 5,
            ease: 'none',
            repeat: -1 
        });
    }

    onClickGeneral() {
        // Implémentation du comportement général du clic
    }

    onClick() {
        console.log("click rubik's cube");
        // Implémentation spécifique pour le clic sur le Rubik's Cube
    }

    destroy() {
        gsap.killTweensOf(this.mesh.rotation); // Stop any ongoing GSAP animation
        super.destroy();
    }
}
