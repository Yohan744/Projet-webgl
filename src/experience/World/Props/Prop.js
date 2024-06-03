import * as THREE from "three";
import Experience from "../../Experience";
import Outline from "../Effects/Outline";
import {watch} from "vue";
import gsap from "gsap";
import EventEmitter from "../../Utils/EventEmitter";
import {MouseUtils} from "../Utils/MouseUtils";

export default class Prop extends EventEmitter {

    constructor(mesh, desiredRotationOnClick = new THREE.Vector3(0, 0, 0), animatePropsToCameraOnClick = true, distanceToCamera = 0.6, isOutlined = 1.05, propSound = '') {
        super();

        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.pointer = this.experience.pointer
        this.camera = this.experience.camera.modes.default.instance;
        this.renderer = this.experience.renderer;
        this.soundManager = this.experience.soundManager;
        this.gameManager = this.experience.gameManager;
        this.globalEvents = this.experience.globalEvents;

        this.mesh = mesh
        this.mesh.rotation.order = "YXZ"
        this.animatePropsToCameraOnClick = animatePropsToCameraOnClick
        this.isOutlined = isOutlined
        this.propSound = propSound

        this.propsBasicPosition = mesh.position.clone()
        this.propsBasicRotation = mesh.rotation.clone()
        this.desiredRotation = desiredRotationOnClick
        this.offsetFromCamera = distanceToCamera;
        this.chanceOfPlayingASong = 0.4
        this.propsSongHasBeenPlayed = false
        this.isSpeaking = false

        if (typeof this.isOutlined === "number") this.outline = new Outline(this.mesh, this.isOutlined)

        this.init()
        this.setWatchers()

    }

    init() {
        // to be overridden
    }

    setWatchers() {
        this.pointer.on("click", this.handleClick.bind(this));
        watch(() => this.gameManager.state.isInteractingWithObject, (state) => {
            if (!state) {
                this.animatePropsToBasicPosition()
                this.outline?.showOutline()
                this.renderer.toggleBlurEffect(false)

                if (this.gameManager.state.actualObjectInteractingName !== 'projector' && this.gameManager.state.actualObjectInteractingName !== 'drawer' && this.gameManager.state.actualObjectInteractingName !== 'pencil') {
                    this.gameManager.setActualObjectInteractingName(null)
                }

                if (this.isSpeaking) this.soundManager.sounds[this.propSound].stop()

            }
            if (state) this.outline?.removeOutline()
        })
    }

    handleClick() {
        const intersects = this.pointer.raycaster.intersectObjects([this.mesh], true);
        if (intersects.length > 0 && this.gameManager.state.isCameraOnSpot) {
            this.onClickGeneral()
            if (this.animatePropsToCameraOnClick && !this.gameManager.state.isInteractingWithObject && intersects[0].distance < 4 && this.gameManager.state.actualObjectInteractingName === null) {

                this.animatePropsToCamera()
                this.playSoundOnClick()
                this.globalEvents.trigger('change-cursor', {name: 'default'})
                this.onClick()

                this.gameManager.updateInteractingState(true)
                this.gameManager.setActualObjectInteractingName(this.mesh.name.toLowerCase())
                this.outline?.removeOutline()
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
                this.isSpeaking = true
                this.soundManager.sounds[this.propSound].on('end', () => {
                    this.propsSongHasBeenPlayed = true
                    this.isSpeaking = false
                })
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
            }
        });

        gsap.to(this.mesh.rotation, {
            x: "+=" + this.desiredRotation.x,
            y: "+=" + this.desiredRotation.y,
            z: "+=" + this.desiredRotation.z,
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
        this.pointer.off("click", this.handleClick.bind(this));
    }

}
