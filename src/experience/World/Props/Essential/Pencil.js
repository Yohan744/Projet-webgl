import * as THREE from 'three';
import {gsap} from 'gsap';
import Experience from "../../../Experience";
import {useInteractableObjects} from "../../ObjectsInteractable";
import Outline from "../../Effects/Outline";
import {watch} from "vue";

export default class Pencil {
    constructor(mesh) {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.camera = this.experience.camera.instance;
        this.renderer = this.experience.renderer;
        this.pointer = this.experience.pointer;
        this.soundManager = this.experience.soundManager;
        this.gameManager = this.experience.gameManager;
        this.globalEvents = this.experience.globalEvents;

        this.mesh = mesh;
        this.mesh.rotation.order = 'YXZ';

        this.initialPosition = this.mesh.position.clone();
        this.initialRotation = this.mesh.rotation.clone();

        this.isInFrontOfCamera = false;
        this.hasBeenPlaced = false;
        this.isReadyToBeRewinded = false
        this.isInteractionFinished = false;
        this.offsetFromCamera = 0.35;
        this.cassetteOffset = new THREE.Vector3(0, 0, 0.2);
        this.basicRotation = this.mesh.rotation.clone()

        this.experience.on('ready', () => {
            this.interactableObjects = useInteractableObjects();
            this.pencilOutline = new Outline(this.mesh, 1.03);
            this.cassette = this.interactableObjects.cassette

            this.init();
            this.setWatchers()
        })
    }

    init() {
        this.pencilOutline.showOutline();

        this.mesh.material.wrapS = THREE.RepeatWrapping;
        this.mesh.material.wrapT = THREE.RepeatWrapping;
        this.mesh.material.map.repeat.set(1, 1);


        this.pencilRotation = gsap.to(this.mesh.material.map.offset, {
            x: '+=' + 0.035,
            repeat: -1,
            duration: 0.5,
            ease: 'linear',
            onUpdate: () => {
                this.mesh.material.map.needsUpdate = true;
            }
        });
        this.pencilRotation.pause()

    }

    setWatchers() {
        this.pointer.on("click", this.handleClick.bind(this));

        watch(() => this.gameManager.state.isInteractingWithObject, (newVal) => {
            if (!newVal && this.gameManager.state.actualObjectInteractingName === "pencil") {
                this.pencilRotation.pause()
                this.returnToInitialPosition()
                this.gameManager.setActualObjectInteractingName(null)
                this.soundManager.sounds['cassetteRewind'].stop()
                this.soundManager.sounds['crayonFound'].stop()
                this.cassette.returnToInitialPosition()
                this.renderer.toggleBlurEffect(false, 0)
                this.hasBeenPlaced = false;
                this.isInFrontOfCamera = false;
            }
        })
    }

    handleClick(forced = false) {
        if (!this.gameManager.state.isCameraOnSpot) return;
        const intersects = this.pointer.raycaster.intersectObject(this.mesh, true);
        if (intersects.length > 0 || forced) {

            if (!this.gameManager.state.isInteractingWithObject) {
                this.gameManager.updateInteractingState(true);
                this.gameManager.setActualObjectInteractingName("pencil")
                this.renderer.toggleBlurEffect(true)
            }

            if (!this.isReadyToBeRewinded) this.globalEvents.trigger('change-cursor', {name: 'default'})
            this.onClick();
        }
    }

    onClick() {

        if (!this.isInFrontOfCamera) {
            this.pencilOutline.removeOutline();
            this.animateToCamera();
            if (this.isInteractionFinished) this.globalEvents.trigger('change-cursor', {name: 'default'})

        } else if (!this.isInteractionFinished) {

            if (!this.hasBeenPlaced) {
                this.animatePencilAndCassette();
                this.pencilOutline.removeOutline()
                this.globalEvents.trigger('change-cursor', {name: 'default'})

            } else if (this.isReadyToBeRewinded && !this.cassette.isRewinding) {
                this.cassette?.startRewinding();
                this.globalEvents.trigger('change-cursor', {name: 'default'})
                this.pencilOutline.removeOutline()
                this.pencilRotation.play()
            }
        }
    }

    animateToCamera() {
        const cameraDirection = new THREE.Vector3();
        this.camera.getWorldDirection(cameraDirection);

        const targetPosition = new THREE.Vector3();
        targetPosition.addVectors(this.camera.position, cameraDirection.multiplyScalar(this.offsetFromCamera));

        if (!this.isInteractionFinished) this.soundManager.playSoundWithBackgroundFade('crayonFound', 1.25);

        gsap.to(this.mesh.position, {
            x: targetPosition.x,
            y: targetPosition.y,
            z: targetPosition.z - 0.1,
            duration: 2,
            ease: 'power2.inOut',
            onUpdate: () => {
                this.pencilOutline.updateOutlineMeshPosition(this.mesh.position)
            },
            onComplete: () => {
                if (!this.isInteractionFinished) {
                    this.positionCassetteNextToPencil();
                    this.pencilOutline.showOutline()
                    this.globalEvents.trigger('change-cursor', {name: 'click'})
                }
                this.isInFrontOfCamera = true;
            }
        });

        gsap.to(this.mesh.rotation, {
            x: this.basicRotation.x * 0.5,
            y: this.basicRotation.y * 0.5,
            z: this.basicRotation.z * 0.5,
            duration: 2,
            ease: 'power2.inOut',
            onUpdate: () => {
                this.pencilOutline.updateOutlineMeshRotation(this.mesh.rotation)
            },
        });

    }

    positionCassetteNextToPencil() {
        if (this.cassette) {
            this.soundManager.play("cassetteOut");
            const targetPosition = this.mesh.position.clone().add(this.cassetteOffset);
            this.cassette.animateToCamera(targetPosition, false, true);
        } else {
            console.error('Cassette instance not found in interactableObjects');
        }
    }

    animatePencilAndCassette() {

        this.hasBeenPlaced = true;

        const delay = 0.5
        const duration = 1.5

        gsap.to(this.mesh.rotation, {
            x: 0,
            y: 0,
            z: Math.PI * 0.3,
            duration: duration,
            ease: 'power2.inOut',
            onUpdate: () => {
                this.pencilOutline.updateOutlineMeshRotation(this.mesh.rotation)
            }
        })

        //////////////////////

        gsap.to(this.mesh.position, {
            x: '-=' + 0.1,
            y: '+=' + 0.052,
            z: '+=' + 0.063,
            delay: delay,
            duration: duration,
            ease: 'power2.inOut',
            onUpdate: () => {
                this.pencilOutline.updateOutlineMeshPosition(this.mesh.position)
            }
        })

        gsap.to(this.cassette.cassetteGroup.position, {
            z: '-=' + 0.1,
            delay: delay,
            duration: duration,
            ease: 'power2.inOut',
        })

        ////////////////////

        gsap.to(this.mesh.position, {
            x: '+=' + 0.058,
            delay: duration + delay,
            duration: duration,
            ease: 'power2.inOut',
            onUpdate: () => {
                this.pencilOutline.updateOutlineMeshPosition(this.mesh.position)
            },
            onComplete: () => {
                this.isReadyToBeRewinded = true;
                this.pencilOutline.showOutline()
                this.globalEvents.trigger('change-cursor', {name: 'click'})
            }
        })

    }

    returnToInitialPosition(forced = false) {
        gsap.to(this.mesh.position, {
            x: this.initialPosition.x,
            y: this.initialPosition.y,
            z: this.initialPosition.z,
            duration: 2,
            ease: 'power2.inOut',
            onStart: () => {
                if (forced) {
                    this.gameManager.updateInteractingState(false)
                    this.gameManager.setActualObjectInteractingName(null)
                    const stepId = this.gameManager.state.gameStepId
                    if (stepId === 4 || stepId === -1) {
                        stepId === 4 ? this.gameManager.incrementGameStepId() : this.gameManager.setGameStepId(-1)
                        this.isInteractionFinished = true;
                        this.isInFrontOfCamera = false;
                    }
                }
            },
            onUpdate: () => {
                this.pencilOutline.updateOutlineMeshPosition(this.mesh.position)
            },
            onComplete: () => {
                this.soundManager.play("crayonDrop");
            }
        });

        gsap.to(this.mesh.rotation, {
            x: this.initialRotation.x,
            y: this.initialRotation.y,
            z: this.initialRotation.z,
            duration: 2,
            ease: 'power2.inOut',
            onUpdate: () => {
                this.pencilOutline.updateOutlineMeshRotation(this.mesh.rotation)
            }
        });
    }

    destroy() {
        this.pointer.off("click", this.handleClick.bind(this));
    }

}
