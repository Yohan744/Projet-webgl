import * as THREE from 'three';
import {gsap} from 'gsap';
import Experience from "../../../Experience";
import {useInteractableObjects} from "../../ObjectsInteractable";
import Outline from "../../Effects/Outline";

export default class Cassette {
    constructor(objects) {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.camera = this.experience.camera.instance;
        this.pointer = this.experience.pointer;
        this.soundManager = this.experience.soundManager;
        this.gameManager = this.experience.gameManager;
        this.globalEvents = this.experience.globalEvents;

        this.cassetteGroup = new THREE.Group();

        this.cassetteObjects = objects;
        this.offsetFromCameraToBottomRightCorner = new THREE.Vector3(0, -1, 1);

        const interactableObjects = useInteractableObjects();

        this.pencil = interactableObjects.pencil;
        this.walkman = interactableObjects.walkmanInstance;

        this.bobine1 = this.cassetteObjects.find(obj => obj.name.toLowerCase() === 'bobine1');
        this.bobine2 = this.cassetteObjects.find(obj => obj.name.toLowerCase() === 'bobine2');
        this.bobine3 = this.cassetteObjects.find(obj => obj.name.toLowerCase() === 'bobine3');
        this.corps = this.cassetteObjects.find(obj => obj.name.toLowerCase() === 'corps');

        this.objectsToAnimate = [this.bobine1, this.bobine2, this.bobine3, this.corps].filter(Boolean);
        this.soundHasBeenPlayed = false;

        this.isReady = false
        this.isRewinding = false;
        this.isPlacedInWalkman = false;
        this.isAnimating = false;

        this.experience.on('ready', () => {
            this.scene.add(this.cassetteGroup);

            this.init();
            this.setEvents();
        })
    }

    init() {
        this.objectsToAnimate.forEach(object => {
            this.cassetteGroup.add(object);
        });

        this.initialPosition = this.cassetteGroup.position.clone();
        this.initialRotation = this.cassetteGroup.rotation.clone();
    }

    setEvents() {
        this.pointer.on('click', () => this.handleClick());
    }

    handleClick() {
        if (this.isPlacedInWalkman || !this.gameManager.state.isCameraOnSpot) return;

        const mousePosition = this.pointer.getMousePosition();
        this.pointer.raycaster.setFromCamera(mousePosition, this.camera);
        const intersects = this.pointer.raycaster.intersectObjects([this.cassetteGroup], true);
        if (intersects.length > 0) {
            if (this.walkman && this.walkman.isClapetOpen && !this.isAnimating) {
                this.animateCassetteIntoWalkman();
                this.globalEvents.trigger('change-cursor', {name: 'default'})
            }
        }
    }

    animateToCamera(targetPosition = null, isInstantiatedByWalkman = false, isInstantiatedByPencil = false) {
        const cameraDirection = new THREE.Vector3();
        this.camera.getWorldDirection(cameraDirection);

        this.updateCassetteVisibility(true);
        this.cassetteGroup.position.copy(this.getCassetteBottomRightCornerPosition())

        if (!targetPosition) {
            targetPosition = new THREE.Vector3();
            targetPosition.addVectors(this.camera.position, cameraDirection.multiplyScalar(0.6));
        }

        gsap.to(this.cassetteGroup.position, {
            x: targetPosition.x,
            y: targetPosition.y,
            z: targetPosition.z,
            duration: 2,
            ease: 'power2.inOut',
            onComplete: () => {
                this.walkman.soundHasBeenPlayed = true;
                if (this.soundHasBeenPlayed) {
                    this.soundManager.stop("walkman2");
                }
                if (isInstantiatedByWalkman) {
                    this.isReady = true
                }
            }
        });

        gsap.to(this.cassetteGroup.rotation, {
            x: isInstantiatedByPencil ? Math.PI * 0.5 : 0,
            y: isInstantiatedByPencil ? -Math.PI * 0.2 : 0,
            z: isInstantiatedByPencil ? Math.PI * 0.5 : 0,
            duration: 2,
            ease: 'power2.inOut'
        });

        if (isInstantiatedByWalkman) {
            this.setMorphTargets(0);
            this.scaleCassette(0.82);
        } else {
            this.setMorphTargets(1);
            this.scaleCassette(1);
        }

        this.animateMorphTargets();
    }

    setMorphTargets(value) {
        this.objectsToAnimate.forEach(object => {
            if (object.morphTargetInfluences) {
                for (let i = 0; i < object.morphTargetInfluences.length; i++) {
                    object.morphTargetInfluences[i] = value;
                }
            }
        });
    }

    scaleCassette(scaleValue) {
        this.cassetteGroup.scale.setScalar(scaleValue)
    }

    animateMorphTargets() {
        if (!this.isRewinding) return;

        let allMorphTargetsZero = true;

        this.objectsToAnimate.forEach(object => {
            if (object.morphTargetInfluences) {
                for (let i = 0; i < object.morphTargetInfluences.length; i++) {
                    let newInfluence = object.morphTargetInfluences[i] - 0.015;
                    if (newInfluence < 0) newInfluence = 0;
                    if (newInfluence > 0) allMorphTargetsZero = false;
                    object.morphTargetInfluences[i] = newInfluence;
                }
            }
        });

        if (allMorphTargetsZero && !this.pencil.isInteractionFinished) {
            this.soundManager.play('cassetteRewind');
            this.globalEvents.trigger('change-cursor', {name: 'click'})
            this.soundManager.sounds['cassetteRewind'].on('end', () => {
                this.pencil.returnToInitialPosition(true)
                this.returnToInitialPosition();
            })
            this.stopRewinding();
        } else {
            gsap.to({}, {
                duration: 0.1,
                onComplete: () => {
                    this.animateMorphTargets();
                }
            });
        }
    }

    animateCassetteIntoWalkman() {
        const walkmanPosition = this.walkman.mesh.position.clone();
        const targetPosition = walkmanPosition.add(new THREE.Vector3(0.01, 0.2, 0.21));
        this.isAnimating = true;

        gsap.to(this.cassetteGroup.position, {
            x: targetPosition.x,
            y: targetPosition.y,
            z: targetPosition.z,
            duration: 2,
            ease: 'power2.inOut',
            onComplete: () => {
                gsap.to(this.cassetteGroup.position, {
                    x: targetPosition.x + 0.01,
                    y: targetPosition.y - 0.197,
                    z: targetPosition.z - 0.195,
                    duration: 1,
                    ease: 'power2.inOut',
                    onComplete: () => {
                        this.soundManager.play("cassetteSet")
                        this.isPlacedInWalkman = true;
                        this.isAnimating = false;
                        this.walkman.walkmanOutline.resetOutline();
                        this.globalEvents.trigger('change-cursor', {name: 'click'})

                    }
                });
            }
        });

        gsap.to(this.cassetteGroup.rotation, {
            y: this.cassetteGroup.rotation.y - 0.49,
            duration: 2,
            ease: 'power2.inOut'
        });
    }

    getCassetteBottomRightCornerPosition() {
        const cameraDirection = new THREE.Vector3();
        this.camera.getWorldDirection(cameraDirection);

        const targetPosition = new THREE.Vector3();
        targetPosition.addVectors(this.camera.position, cameraDirection.multiplyScalar(1));

        targetPosition.add(this.offsetFromCameraToBottomRightCorner);

        return targetPosition;
    }

    startRewinding() {
        this.soundManager.play("rewind");
        this.isRewinding = true;
        this.animateMorphTargets();
    }

    stopRewinding() {
        this.isRewinding = false;
        this.soundManager.stop("rewind");
    }

    returnToInitialPosition() {

        this.initialPosition = this.getCassetteBottomRightCornerPosition()
        this.updateCassetteVisibility(true)

        gsap.to(this.cassetteGroup.position, {
            x: this.initialPosition.x,
            y: this.initialPosition.y,
            z: this.initialPosition.z,
            duration: 2,
            ease: 'power2.inOut',
            onComplete: () => {
                this.resetMovementStates();
                this.updateCassetteVisibility(false)
            }
        });

        gsap.to(this.cassetteGroup.rotation, {
            x: this.initialRotation.x,
            y: this.initialRotation.y,
            z: this.initialRotation.z,
            duration: 2,
            ease: 'power2.inOut'
        });
    }

    resetMovementStates() {
        this.isRewinding = false;
        this.isPlacedInWalkman = false;
        this.soundHasBeenPlayed = false;
        this.cassetteGroup.position.copy(this.initialPosition);
        this.cassetteGroup.rotation.copy(this.initialRotation);
    }

    updateCassetteVisibility(state) {
        this.cassetteGroup.traverse((child) => {
            if (child.isMesh) {
                child.visible = state
                child.material.visible = state;
                child.material.opacity = state ? 1 : 0;
            }
        })
    }

    destroy() {
        this.objectsToAnimate.forEach(object => {
            if (object && object.parent) {
                object.parent.remove(object);
            }
        });
        this.scene.remove(this.cassetteGroup);
    }
}
