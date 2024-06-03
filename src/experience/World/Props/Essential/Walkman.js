import * as THREE from "three";
import Experience from "../../../Experience";
import { gsap } from 'gsap';
import { useInteractableObjects } from "../../ObjectsInteractable";

export default class Walkman {
    constructor(mesh) {
        this.mesh = mesh;
        this.experience = new Experience();
        this.resources = this.experience.resources;
        this.scene = this.experience.scene;
        this.camera = this.experience.camera.instance;
        this.pointer = this.experience.pointer;
        this.soundManager = this.experience.soundManager;
        this.mesh = mesh;
        this.interactableObjects = useInteractableObjects();
        this.offsetFromCamera = 0.6;
        this.isDragging = false;
        this.isAnimating = false;
        this.dragDistance = 0.07;
        this.mouseStartClickPosition = { x: 0, y: 0 };
        this.hasMovedInFront = false;
        this.isInFrontOfCamera = false;
        this.isClapetClosedPermanently = false;
        this.soundHasBeenPlayed = false;

        this.morphTargetName = 'clapet';
        this.headphoneMorphTargetName = 'casque';
        this.playButtonMorphTargetName = 'boutonplay';
        this.isClapetOpen = false;
        this.canComeOut = false;
        this.boutonejectTargetName = 'boutoneject';
        this.setupMorphTargets();
        this.init();
        this.setEvents();
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

    setEvents() {
        this.pointerDown = this.onPointerDown.bind(this);
        this.pointerMove = this.onPointerMove.bind(this);
        this.pointerUp = this.onPointerUp.bind(this);

        this.pointer.on('click', this.pointerDown);
        this.pointer.on('movement', this.pointerMove);
        this.pointer.on('click-release', this.pointerUp);
    }

    onPointerDown() {
        if (this.canComeOut && !this.isClapetClosedPermanently) {
            const mousePosition = this.pointer.getMousePosition();
            this.pointer.raycaster.setFromCamera(mousePosition, this.camera);
            const intersects = this.pointer.raycaster.intersectObjects([this.mesh], true);
            if (intersects.length > 0) {
                if (!this.isClapetOpen) {
                    this.activateEjectButton();
                } else if (this.isClapetOpen) {
                    this.startDragging(mousePosition);
                }
            }
        } else if (this.isClapetClosedPermanently) {
            this.animateHeadphone();
        }
    }

    activateEjectButton() {
        this.soundManager.play("bouton")
        gsap.to(this.morphMesh.morphTargetInfluences, {
            [this.morphMesh.morphTargetDictionary[this.boutonejectTargetName]]: 1,
            duration: 1,
            ease: 'power2.inOut',
            onComplete: () => {
                this.soundManager.stop("bouton")
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
                this.soundManager.stop("ouvertureWalkman")
                this.isClapetOpen = true;
            }
        });
    }

    prepareForClapetClose() {
        this.pointer.on('movement', this.pointerMove);
        this.pointer.on('click-release', this.pointerUp);
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

    onPointerMove(mouse) {
        if (!this.isDragging || !this.draggableModel || this.isAnimating) return;

        const deltaY = mouse.y - this.mouseStartClickPosition.y;
        if (-deltaY > this.dragDistance) {
            this.closeClapet();
        }
    }

    startDragging(mousePosition) {
        this.isDragging = true;
        this.draggableModel = this.morphMesh;
        this.mouseStartClickPosition = {
            x: mousePosition.x,
            y: mousePosition.y,
        };
    }

    onPointerUp() {
        if (this.isDragging) {
            this.isDragging = false;
            this.draggableModel = null;
        }
    }

    animateToCamera(state) {
        const cameraDirection = new THREE.Vector3();
        this.camera.getWorldDirection(cameraDirection);

        const targetPosition = new THREE.Vector3();
        targetPosition.addVectors(this.camera.position, cameraDirection.multiplyScalar(this.offsetFromCamera));
        gsap.to(this.mesh.position, {
            y: this.mesh.position.y + 0.4,
            duration: 1,
            ease: 'power2.inOut',
            onComplete: () => {
                state ? this.soundManager.play("walkman"): this.soundManager.stop("walkman");
                gsap.to(this.mesh.position, {
                    x: targetPosition.x,
                    y: targetPosition.y,
                    z: targetPosition.z - 0.2,
                    duration: 2,
                    ease: 'power2.inOut',
                    onComplete: () => {
                        this.soundManager.stop("chest");
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

    positionCassetteNextToWalkman() {
        const cassette = this.interactableObjects.cassette;
        if (cassette) {
            const walkmanPosition = this.mesh.position.clone();
            const cassetteOffset = new THREE.Vector3(0, 0, 0.4);
            const targetPosition = walkmanPosition.add(cassetteOffset);
            if(this.isInFrontOfCamera) {
                setTimeout(() => {
                    this.soundManager.play("walkman2");
                    this.soundHasBeenPlayed = true;
                    cassette.animateToCamera(targetPosition, true);
                    this.soundManager.play("cassetteOut");
                }, 3000);
            }
        } else {
            console.error('Cassette instance not found in interactableObjects');
        }
    }

    animateWalkmanAndCassette() {
        gsap.to(this.mesh.rotation, {
            y: this.mesh.rotation.y + 0.5,
            duration: 1,
            ease: 'power2.inOut'
        });
        gsap.to(this.mesh.position, {
            x: this.mesh.position.x - 0.2,
            z: this.mesh.position.z + 0.3,
            y: this.mesh.position.y + 0.1,
            duration: 1,
            ease: 'power2.inOut',
            onComplete: () => {
                this.setEventsForHeadphone();
            }
        });
    }

    setEventsForHeadphone() {
        this.pointer.off('click', this.pointerDown);
        this.pointer.on('click', this.animateHeadphone.bind(this));
    }

    animateHeadphone() {
        gsap.to(this.morphMesh.morphTargetInfluences, {
            [this.morphMesh.morphTargetDictionary[this.headphoneMorphTargetName]]: 1,
            duration: 2,
            ease: 'power2.inOut',
            onComplete: () => {
                this.soundManager.play("headphoneOn");
                gsap.to(this.mesh.rotation, {
                    y: this.mesh.rotation.y - 1,
                    duration: 1,
                    ease: 'power2.inOut',
                    onComplete: () => {
                        this.setEventsForPlayButton();
                    }
                });
            }
        });
    }

    setEventsForPlayButton() {
        this.pointer.off('click', this.animateHeadphone.bind(this));
        this.pointer.on('click', this.animatePlayButton.bind(this));
    }

    animatePlayButton() {
        this.soundManager.stop("headphoneOn");
        this.soundManager.play("bouton")
        gsap.to(this.morphMesh.morphTargetInfluences, {
            [this.morphMesh.morphTargetDictionary[this.playButtonMorphTargetName]]: 1,
            duration: 2,
            ease: 'power2.inOut',
            onComplete:() => {
                gsap.to(this.morphMesh.morphTargetInfluences, {
                    [this.morphMesh.morphTargetDictionary[this.playButtonMorphTargetName]]: 0,
                    duration: 2,
                    onComplete:()=> {
                        this.soundManager.stop("bouton");
                        this.soundManager.fadeOutAndStopBackground(2000, () => {
                            this.triggerOutroVideo();
                        });
                        this.soundManager.play("final", 0.3);
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

    destroy() {
        this.pointer.off('click', this.pointerDown);
        this.pointer.off('movement-orbit', this.pointerMove);
        this.pointer.off('click-release', this.pointerUp);
        this.scene.remove(this.mesh);
    }
}
