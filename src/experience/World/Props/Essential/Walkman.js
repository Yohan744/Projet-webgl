import * as THREE from "three";
import Experience from "../../../Experience";
import { gsap } from 'gsap';
import { useInteractableObjects } from "../../ObjectsInteractable";
import {watch} from "vue";
import Outline from "../../Effects/Outline";

export default class Walkman {
    constructor(mesh) {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.camera = this.experience.camera.instance;
        this.pointer = this.experience.pointer;
        this.soundManager = this.experience.soundManager;
        this.gameManager = this.experience.gameManager;
        this.globalEvents = this.experience.globalEvents;
        this.mesh = mesh;

        this.offsetFromCamera = 0.6;
        this.isInFrontOfCamera = false;
        this.isClapetClosedPermanently = false;

        this.basicPosition = this.mesh.position.clone();
        this.basicRotation = this.mesh.rotation.clone();

        this.morphTargetName = 'clapet';
        this.headphoneMorphTargetName = 'casque';
        this.playButtonMorphTargetName = 'boutonplay';
        this.boutonejectTargetName = 'boutoneject';

        this.isAnimating = false;
        this.isClapetOpen = false;
        this.canComeOut = false;
        this.isReadyToListen = false
        this.isFinished = false;
        this.isHeadphoneOn = false;

        this.experience.on('ready', () => {
            this.interactableObjects = useInteractableObjects();
            this.init();
            this.setupMorphTargets();
            this.setWatchers();
            this.walkmanOutline = new Outline(this.mesh, 1.01);
            this.walkmanOutline.removeOutline()
            this.cassette = this.interactableObjects.cassette;
        })

    }

    init() {
        this.applyBasicMaterial();
        this.interactableObjects.walkmanInstance = this;
    }

    setupMorphTargets() {
        if (this.mesh.isMesh && this.mesh.morphTargetInfluences) {
            this.morphMesh = this.mesh;
        } else {
            console.error(`Morph target mesh not found.`);
        }
    }

    setWatchers() {
        this.pointer.on('click', this.onPointerDown.bind(this));

        watch(() => this.gameManager.state.isInteractingWithObject, (value) => {
            if (!value && this.gameManager.state.actualObjectInteractingName === 'walkman' && !this.experience.isExperienceEnded) {
                this.returnToBasicPosition()
                this.cassette.returnToInitialPosition();
                this.isAnimating = false;
                this.isClapetOpen = false;
                this.canComeOut = false;
                this.isReadyToListen = false
                this.isFinished = false;
                this.isHeadphoneOn = false;
                this.isInFrontOfCamera = false;
                this.isClapetClosedPermanently = false;
                this.soundManager.sounds['walkman'].stop();
                this.soundManager.sounds['walkman2'].stop();
                this.globalEvents.trigger('change-cursor', {name: 'default'})
                this.resetMorphTarget()
            }
        })

    }

    onPointerDown() {
        if (this.isAnimating) return

        const mousePosition = this.pointer.getMousePosition();
        this.pointer.raycaster.setFromCamera(mousePosition, this.camera);
        const intersects = this.pointer.raycaster.intersectObjects([this.mesh], true);
        if (intersects.length > 0) {

            if (this.canComeOut && !this.isClapetClosedPermanently && this.cassette.isReady && this.gameManager.state.isCameraOnSpot && this.gameManager.state.isInteractingWithObject) {
                if (!this.isClapetOpen) {
                    this.activateEjectButton();
                    this.walkmanOutline.removeOutline();
                    this.globalEvents.trigger('change-cursor', {name: 'default'})
                } else if (this.cassette.isPlacedInWalkman) {
                    this.closeClapet();
                    this.walkmanOutline.removeOutline();
                }
            } else if (this.isClapetClosedPermanently) {

                this.globalEvents.trigger('change-cursor', {name: 'default'})

                if (!this.isHeadphoneOn) {
                    this.animateHeadphone();
                } else if (this.isReadyToListen) {
                    this.animatePlayButton();
                }

            }

        }
    }

    activateEjectButton() {
        this.soundManager.play("bouton")
        this.isAnimating = true;
        gsap.to(this.morphMesh.morphTargetInfluences, {
            [this.morphMesh.morphTargetDictionary[this.boutonejectTargetName]]: 1,
            duration: 1,
            ease: 'power2.inOut',
            onComplete: () => {
                this.openClapet();
            }
        });
    }

    openClapet() {
        this.soundManager.play("ouvertureWalkman")
        gsap.to(this.morphMesh.morphTargetInfluences, {
            [this.morphMesh.morphTargetDictionary[this.morphTargetName]]: 1,
            [this.morphMesh.morphTargetDictionary[this.boutonejectTargetName]]: 0,
            duration: 1,
            ease: 'power2.inOut',
            onComplete: () => {
                this.isClapetOpen = true;
                this.isAnimating = false;
                this.walkmanOutline.removeOutline();
                this.globalEvents.trigger('change-cursor', {name: 'click'})
            }
        });
    }

    closeClapet() {
        this.soundManager.stop("cassetteSet");
        this.soundManager.play("fermetureWalkman")
        gsap.to(this.morphMesh.morphTargetInfluences, {
            [this.morphMesh.morphTargetDictionary[this.morphTargetName]]: 0,
            duration: 1,
            ease: 'power2.inOut',
            onComplete: () => {
                this.isClapetOpen = false;
                this.isClapetClosedPermanently = true;
                this.soundManager.stop("fermetureWalkman")
                this.animateWalkmanAndCassette();
            }
        });
    }

    animateToCamera(state) {
        const cameraDirection = new THREE.Vector3();
        this.camera.getWorldDirection(cameraDirection);

        const targetPosition = new THREE.Vector3();
        targetPosition.addVectors(this.camera.position, cameraDirection.multiplyScalar(this.offsetFromCamera));

        gsap.to(this.mesh.position, {
            y: '+=' + 0.4,
            duration: 1,
            ease: 'power2.inOut',
            onComplete: () => {
                state ? this.soundManager.playSoundWithBackgroundFade("walkman", 1.25) : this.soundManager.stop("walkman");
                gsap.to(this.mesh.position, {
                    x: targetPosition.x,
                    y: targetPosition.y,
                    z: targetPosition.z - 0.2,
                    duration: 2,
                    ease: 'power2.inOut',
                    onComplete: () => {
                        this.isInFrontOfCamera = true;
                        this.positionCassetteNextToWalkman();
                    }
                });
            }
        });

        gsap.to(this.mesh.rotation, {
            x: 0,
            y: -0.5,
            z: 0,
            duration: 2,
            ease: 'power2.inOut'
        });

        this.scene.add(this.mesh);
    }

    returnToBasicPosition() {
        const tl = gsap.timeline();
        this.canComeOut = false;

        tl.to(this.mesh.position, {
            x: this.basicPosition.x,
            y: this.basicPosition.y + 0.4,
            z: this.basicPosition.z,
            duration: 2,
            ease: 'power2.inOut',
            onUpdate: () => {
                this.walkmanOutline.updateOutlineMeshPosition(this.mesh.position);
            }
        });

        tl.to(this.mesh.position, {
            y: '-=' + 0.4,
            duration: 1,
            ease: 'power2.inOut',
            onUpdate: () => {
                this.walkmanOutline.updateOutlineMeshPosition(this.mesh.position);
            }
        });

        gsap.to(this.mesh.rotation, {
            x: this.basicRotation.x,
            y: this.basicRotation.y,
            z: this.basicRotation.z,
            duration: 2,
            ease: 'power2.inOut',
            onUpdate: () => {
                this.walkmanOutline.updateOutlineMeshRotation(this.mesh.rotation);
            }
        });

    }

    positionCassetteNextToWalkman() {
        if (this.cassette && this.gameManager.state.isInteractingWithObject) {
            const walkmanPosition = this.mesh.position.clone();
            const cassetteOffset = new THREE.Vector3(0, 0, 0.4);
            const targetPosition = walkmanPosition.add(cassetteOffset);
            if(this.isInFrontOfCamera) {
                setTimeout(() => {
                    this.soundManager.playSoundWithBackgroundFade("walkman2", 1.25);
                    this.soundManager.sounds['walkman2'].on('end', () => {
                        this.walkmanOutline.resetOutline();
                        this.globalEvents.trigger('change-cursor', {name: 'click'})
                    })
                    this.cassette.animateToCamera(targetPosition, true);
                    this.soundManager.play("cassetteOut");
                }, 3000);
            }
        } else {
            console.error('Cassette instance not found in interactableObjects');
        }
    }

    animateWalkmanAndCassette() {
        this.walkmanOutline.resetOutline()

        gsap.to([this.mesh.rotation, this.cassette.cassetteGroup.rotation], {
            y: '+=' + 0.5,
            duration: 1,
            ease: 'power2.inOut',
            onUpdate: () => {
                this.walkmanOutline.updateOutlineMeshRotation(this.mesh.rotation);
            },
        });
        gsap.to([this.mesh.position, this.cassette.cassetteGroup.position], {
            x: '-=' + 0.2,
            z: '+=' + 0.3,
            y: '+=' + 0.1,
            duration: 1,
            ease: 'power2.inOut',
            onUpdate: () => {
                this.walkmanOutline.updateOutlineMeshPosition(this.mesh.position);
            },
            onComplete: () => {
                this.walkmanOutline.showOutline()
                this.globalEvents.trigger('change-cursor', {name: 'click'})
                this.isReadyToListen = true
            }
        });
    }

    animateHeadphone() {
        this.isHeadphoneOn = true;
        this.isAnimating = true;
        this.walkmanOutline.removeOutline()
        gsap.delayedCall(1.5, () => {
            this.soundManager.play("headphoneOn");
        })
        gsap.to(this.morphMesh.morphTargetInfluences, {
            [this.morphMesh.morphTargetDictionary[this.headphoneMorphTargetName]]: 1,
            duration: 2,
            ease: 'power2.inOut',
            onUpdate: () => {
                this.walkmanOutline.updateOutlineMeshPosition(this.mesh.position);
            },
            onComplete: () => {
                gsap.to([this.mesh.rotation, this.cassette.cassetteGroup.rotation], {
                    y: '-=' + 1,
                    duration: 1,
                    ease: 'power2.inOut',
                    onUpdate: () => {
                        this.walkmanOutline.updateOutlineMeshRotation(this.mesh.rotation);
                    },
                    onComplete: () => {
                        this.walkmanOutline.resetOutline();
                        this.isAnimating = false;
                        this.isReadyToListen = true;
                        this.globalEvents.trigger('change-cursor', {name: 'click'})
                    }
                });
            }
        });
    }

    animatePlayButton() {
        if (this.isFinished) return;

        this.soundManager.stop("headphoneOn");
        this.soundManager.play("bouton")
        this.walkmanOutline.removeOutline()
        gsap.to(this.morphMesh.morphTargetInfluences, {
            [this.morphMesh.morphTargetDictionary[this.playButtonMorphTargetName]]: 1,
            duration: 2,
            ease: 'power2.inOut',
            onComplete:() => {
                gsap.to(this.morphMesh.morphTargetInfluences, {
                    [this.morphMesh.morphTargetDictionary[this.playButtonMorphTargetName]]: 0,
                    duration: 2,
                    onComplete:()=> {
                        this.experience.endExperience();
                        this.isFinished = true;
                    }
                });
            }
        });
    }

    applyBasicMaterial() {
        if (this.mesh.isMesh && Array.isArray(this.mesh.morphTargetInfluences)) {
            this.mesh.morphTargetInfluences.forEach((_, i) => this.mesh.morphTargetInfluences[i] = 0);
        }
    }

    resetMorphTarget() {
        gsap.to(this.morphMesh.morphTargetInfluences, {
            [this.morphMesh.morphTargetDictionary[this.morphTargetName]]: 0,
            [this.morphMesh.morphTargetDictionary[this.boutonejectTargetName]]: 0,
            [this.morphMesh.morphTargetDictionary[this.playButtonMorphTargetName]]: 0,
            [this.morphMesh.morphTargetDictionary[this.headphoneMorphTargetName]]: 0,
            duration: 1,
            ease: 'power2.inOut',
        });
    }

    destroy() {
        this.pointer.off('click', this.onPointerDown);
        this.scene.remove(this.mesh);
    }
}