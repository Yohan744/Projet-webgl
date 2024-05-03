import * as THREE from "three";
import Experience from "../../Experience";
import Outline from "../Effects/Outline";
import {watch} from "vue";
import gsap from "gsap";
import EventEmitter from "../../Utils/EventEmitter";

export default class Prop extends EventEmitter {

    constructor(mesh, desiredRotationOnClick = new THREE.Vector3(0, 0, 0), animatePropsToCameraOnClick = true, isOutlined = 1.05) {
        super(mesh, desiredRotationOnClick);

        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.pointer = this.experience.pointer
        this.appStore = this.experience.appStore;
        this.camera = this.experience.camera.modes.default.instance;
        this.mesh = mesh
        this.animatePropsToCameraOnClick = animatePropsToCameraOnClick
        this.isOutlined = isOutlined

        this.propsBasicPosition = mesh.position.clone()
        this.propsBasicRotation = mesh.rotation.clone()
        this.desiredRotation = desiredRotationOnClick
        this.offsetFromCamera = 0.6;

        if (typeof this.isOutlined === "number") this.outline = new Outline(this.mesh, this.isOutlined)

        this.setWatchers()

    }

    setWatchers() {
        this.pointer.on("click", this.handleClick.bind(this));
        watch(() => this.appStore.$state.isInteractingWithObject, (state) => {
            if (!state) {
                this.animatePropsToBasicPosition(this.mesh)
            }
        })
    }

    handleClick() {
        const intersects = this.pointer.raycaster.intersectObjects([this.mesh], true);
        if (intersects.length > 0 && this.appStore.$state.isCameraOnSpot) {
            this.onClick()
            if (this.animatePropsToCameraOnClick && !this.appStore.$state.isInteractingWithObject) {
                this.animatePropsToCamera(this.mesh)
                this.appStore.updateInteractingState(true)
            }
        }
    }

    onClick() {
        // to be overridden
    }

    animatePropsToCamera(mesh) {

        const cameraDirection = new THREE.Vector3()
        this.camera.getWorldDirection(cameraDirection)

        const targetPosition = new THREE.Vector3()
        targetPosition.addVectors(this.camera.position, cameraDirection.multiplyScalar(this.offsetFromCamera));

        gsap.to(mesh.position, {
            x: targetPosition.x,
            y: targetPosition.y,
            z: targetPosition.z,
            duration: 2,
            ease: "power2.inOut"
        });

        gsap.to(mesh.rotation, {
            x: this.desiredRotation.x,
            y: this.desiredRotation.y,
            z: this.desiredRotation.z,
            duration: 2,
            ease: "power2.inOut"
        });

    }

    animatePropsToBasicPosition(mesh) {

        console.log("lalalalalala")

        console.log(this.propsBasicPosition)
        console.log(this.mesh.position)

        gsap.to(mesh.position, {
            x: this.propsBasicPosition.x,
            y: this.propsBasicPosition.y,
            z: this.propsBasicPosition.z,
            duration: 2,
            ease: "power2.inOut"
        });

        gsap.to(mesh.rotation, {
            x: this.propsBasicRotation.x,
            y: this.propsBasicRotation.y,
            z: this.propsBasicRotation.z,
            duration: 2,
            ease: "power2.inOut"
        });

    }

    destroy() {
        this.outline?.destroy()
        this.pointer.off("click", this.handleClick.bind(this));
    }

}