import * as THREE from "three";
import Experience from "../../Experience";
import Outline from "../Effects/Outline";
import {watch} from "vue";
import gsap from "gsap";
import EventEmitter from "../../Utils/EventEmitter";
import {MouseUtils} from "../Utils/MouseUtils";

export default class Prop extends EventEmitter {

    constructor(mesh, desiredRotationOnClick = new THREE.Vector3(0, 0, 0), animatePropsToCameraOnClick = true, isOutlined = 1.05, propSound = '') {
        super();

        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.pointer = this.experience.pointer
        this.appStore = this.experience.appStore;
        this.camera = this.experience.camera.modes.default.instance;
        this.renderer = this.experience.renderer;
        this.soundManager = this.experience.soundManager;

        this.mesh = mesh
        this.animatePropsToCameraOnClick = animatePropsToCameraOnClick
        this.isOutlined = isOutlined
        this.propSound = propSound

        this.propsBasicPosition = mesh.position.clone()
        this.propsBasicRotation = mesh.rotation.clone()
        this.desiredRotation = desiredRotationOnClick
        this.offsetFromCamera = 0.6;
        this.chanceOfPlayingASong = 0.4
        this.propsSongHasBeenPlayed = false

        if (typeof this.isOutlined === "number") this.outline = new Outline(this.mesh, this.isOutlined)
        if (this.animatePropsToCameraOnClick) this.mouseUtils = new MouseUtils(this.mesh);

        this.init()
        this.setWatchers()

    }

    init() {
        // to be overridden
    }

    setWatchers() {
        this.pointer.on("click", this.handleClick.bind(this));
        watch(() => this.appStore.$state.isInteractingWithObject, (state) => {
            if (!state) {
                this.animatePropsToBasicPosition()
                this.outline?.showOutline()
                this.appStore.updateOrbitsControlsState(false)
                this.renderer.toggleBlurEffect(false)
            }
        })
    }

    handleClick() {
        const intersects = this.pointer.raycaster.intersectObjects([this.mesh], true);
        if (intersects.length > 0 && this.appStore.$state.isCameraOnSpot) {
            this.onClickGeneral()
            if (this.animatePropsToCameraOnClick && !this.appStore.$state.isInteractingWithObject) {
                this.animatePropsToCamera()
                this.appStore.updateInteractingState(true)
                this.outline?.removeOutline()
                this.playSoundOnClick()
                this.onClick()
                this.renderer.toggleBlurEffect(true)
            }
        }
    }

    onClickGeneral() {
        // to be overridden
    }

    onClick() {
        // to be overridden
    }

    playSoundOnClick() {
        if (this.propSound !== '') {
            if (!this.propsSongHasBeenPlayed) {
                this.soundManager.playSoundWithBackgroundFade(this.propSound, 1.25)
                this.propsSongHasBeenPlayed = true
            } else {
                if (Math.random() < this.chanceOfPlayingASong) {
                    const randomSound = this.experience.soundManager.getRandomSound()
                    this.soundManager.playSoundWithBackgroundFade(randomSound, 1.25)
                }
            }
        }
    }

    animatePropsToCamera() {

        const cameraDirection = new THREE.Vector3()
        this.camera.getWorldDirection(cameraDirection)

        const targetPosition = new THREE.Vector3()
        targetPosition.addVectors(this.camera.position, cameraDirection.multiplyScalar(this.offsetFromCamera));

        gsap.to(this.mesh.position, {
            x: targetPosition.x,
            y: targetPosition.y,
            z: targetPosition.z,
            duration: 2,
            ease: "power2.inOut",
            onUpdate: () => {
                this.outline?.updateOutlineMeshPosition(this.mesh.position)
            }, onComplete: () => {
                this.appStore.updateOrbitsControlsState(true)
            }
        });

        gsap.to(this.mesh.rotation, {
            x: this.desiredRotation.x,
            y: this.desiredRotation.y,
            z: this.desiredRotation.z,
            duration: 2,
            ease: "power2.inOut",
            onUpdate: () => {
                this.outline?.updateOutlineMeshRotation(this.mesh.rotation)
            }
        });

    }

    animatePropsToBasicPosition() {

        gsap.to(this.mesh.position, {
            x: this.propsBasicPosition.x,
            y: this.propsBasicPosition.y,
            z: this.propsBasicPosition.z,
            duration: 2,
            ease: "power2.inOut",
            onUpdate: () => {
                this.outline?.updateOutlineMeshPosition(this.mesh.position)
            }
        });

        gsap.to(this.mesh.rotation, {
            x: this.propsBasicRotation.x,
            y: this.propsBasicRotation.y,
            z: this.propsBasicRotation.z,
            duration: 2,
            ease: "power2.inOut",
            onUpdate: () => {
                this.outline?.updateOutlineMeshRotation(this.mesh.rotation)
            }
        });

    }

    destroy() {
        this.outline?.destroy()
        this.mesh?.geometry?.dispose()
        this.mesh?.material?.dispose()
        this.scene?.remove(this.mesh)
        this.mouseUtils?.destroy()
        this.pointer.off("click", this.handleClick.bind(this));
    }

}