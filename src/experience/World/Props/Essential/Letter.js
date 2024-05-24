import * as THREE from "three";
import Experience from "../../../Experience";
import Prop from "../Prop";

export default class Letter {
    constructor(mesh) {

        this.experience = new Experience();
        this.resources = this.experience.resources;
        this.scene = this.experience.scene;
        this.mesh = mesh;

        // this.basicRotation = mesh.rotation.clone()
        // this.debugFolder = this.experience.debug.addFolder({
        //     title: 'Lettre',
        //     expanded: true
        // });
        //
        // const x = this.debugFolder.addBinding(this.desiredRotation, 'x', { label: 'rotationX', min: -Math.PI, max: Math.PI, step: 0.01 });
        // const y = this.debugFolder.addBinding(this.desiredRotation, 'y', { label: 'rotationY', min: -Math.PI, max: Math.PI, step: 0.01 });
        // const z = this.debugFolder.addBinding(this.desiredRotation, 'z', { label: 'rotationZ', min: -Math.PI, max: Math.PI, step: 0.01 });
        //
        // x.on('change', () => {
        //     this.mesh.rotation.x = this.basicRotation.x + this.desiredRotation.x;
        // })
        //
        // y.on('change', () => {
        //     this.mesh.rotation.y = this.basicRotation.y + this.desiredRotation.y;
        // })
        //
        // z.on('change', () => {
        //     this.mesh.rotation.z = this.basicRotation.z + this.desiredRotation.z;
        // })

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