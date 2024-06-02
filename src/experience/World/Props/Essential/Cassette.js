import * as THREE from 'three';
import { gsap } from 'gsap';
import Experience from "../../../Experience";
import { useInteractableObjects } from "../../ObjectsInteractable";

export default class Cassette {
    constructor(objects) {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.camera = this.experience.camera.instance;
        this.pointer = this.experience.pointer;
        this.soundManager = this.experience.soundManager;

        this.cassetteGroup = new THREE.Group();
        this.scene.add(this.cassetteGroup);

        this.cassetteObjects = objects;

        const interactableObjects = useInteractableObjects();

        this.pencil = interactableObjects.pencil;
        this.walkman = interactableObjects.walkmanInstance;

        this.bobine1 = this.cassetteObjects.find(obj => obj.name.toLowerCase() === 'bobine1');
        this.bobine2 = this.cassetteObjects.find(obj => obj.name.toLowerCase() === 'bobine2');
        this.bobine3 = this.cassetteObjects.find(obj => obj.name.toLowerCase() === 'bobine3');
        this.corps = this.cassetteObjects.find(obj => obj.name.toLowerCase() === 'corps');

        this.objectsToAnimate = [this.bobine1, this.bobine2, this.bobine3, this.corps].filter(Boolean);
        this.soundHasBeenPlayed = false;

        this.isRewinding = false;
        this.isFullyRewound = false;
        this.inactivityTimeout = null;
        this.isPlacedInWalkman = false;

        this.init();
        this.setEvents();
    }

    init() {
        this.objectsToAnimate.forEach(object => {
            this.cassetteGroup.add(object);
        });

        this.initialPosition = this.cassetteGroup.position.clone();
        this.initialRotation = this.cassetteGroup.rotation.clone();
    }

    setEvents() {
        this.pointer.on('click', (event) => this.handleClick(event));
    }

    handleClick(event) {
        if (this.isPlacedInWalkman) return;

        const mousePosition = this.pointer.getMousePosition();
        this.pointer.raycaster.setFromCamera(mousePosition, this.camera);
        const intersects = this.pointer.raycaster.intersectObjects([this.cassetteGroup], true);
        if (intersects.length > 0) {
            if (this.walkman && this.walkman.isClapetOpen) {
                this.animateCassetteIntoWalkman();
            }
        }
    }

    animateToCamera(targetPosition = null, isInstantiatedByWalkman = false) {
        const cameraDirection = new THREE.Vector3();
        this.camera.getWorldDirection(cameraDirection);

        if (!targetPosition) {
            targetPosition = new THREE.Vector3();
            targetPosition.addVectors(this.camera.position, cameraDirection.multiplyScalar(0.6));
        }
        this.soundManager.play("outPocket");
        gsap.to(this.cassetteGroup.position, {
            x: targetPosition.x,
            y: targetPosition.y,
            z: targetPosition.z,
            duration: 2,
            ease: 'power2.inOut',
            onComplete: () => {
                this.walkman.soundHasBeenPlayed = true;
                if (this.soundHasBeenPlayed) { this.soundManager.stop("walkman2"); }
            }
        });

        gsap.to(this.cassetteGroup.rotation, {
            x: 0,
            y: 0,
            z: 0,
            duration: 3,
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
        gsap.to(this.cassetteGroup.scale, {
            x: scaleValue,
            y: scaleValue,
            z: scaleValue,
            duration: 1,
            ease: 'power2.inOut'
        });
    }

    animateMorphTargets() {
        this.soundManager.stop("outPocket");
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

        if (allMorphTargetsZero) {
            this.soundManager.play('cassetteRewind');
            this.isFullyRewound = true;
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
                        this.convertToLocalCoordinatesAndAddToWalkman();
                        this.walkman.prepareForClapetClose();
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

    convertToLocalCoordinatesAndAddToWalkman() {
        const worldPosition = this.cassetteGroup.position.clone();
        const worldQuaternion = this.cassetteGroup.quaternion.clone();

        this.walkman.mesh.worldToLocal(worldPosition);
        const localQuaternion = new THREE.Quaternion().copy(this.walkman.mesh.quaternion).invert().multiply(worldQuaternion);

        this.cassetteGroup.position.copy(worldPosition);
        this.cassetteGroup.quaternion.copy(localQuaternion);

        this.walkman.mesh.add(this.cassetteGroup);
    }

    startRewinding() {
        this.soundManager.play("rewind");
        this.isRewinding = true;
        this.isFullyRewound = false;
        this.animateMorphTargets();
    }

    stopRewinding() {
        this.isRewinding = false;
        this.soundManager.stop("rewind");

        if (this.isFullyRewound && !this.pencil.isDragging) {
            this.startInactivityTimer();
        }
    }

    startInactivityTimer() {
        if (this.inactivityTimeout) {
            clearTimeout(this.inactivityTimeout);
        }

        this.inactivityTimeout = setTimeout(() => {
            this.returnToInitialPosition();
            if (this.pencil) {
                this.pencil.returnToInitialPosition();
            }
        }, 3000);
    }

    returnToInitialPosition() {
        gsap.to(this.cassetteGroup.position, {
            x: this.initialPosition.x,
            y: this.initialPosition.y,
            z: this.initialPosition.z,
            duration: 2,
            ease: 'power2.inOut',
            onComplete: () => {
                this.soundManager.stop("inPocket");
                this.resetMovementStates();
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
        this.isFullyRewound = false;
        this.isPlacedInWalkman = false;
        this.soundHasBeenPlayed = false;


        this.cassetteGroup.position.copy(this.initialPosition);
        this.cassetteGroup.rotation.copy(this.initialRotation);
    }

    destroy() {
        this.objectsToAnimate.forEach(object => {
            if (object && object.parent) {
                object.parent.remove(object);
            }
        });
        this.scene.remove(this.cassetteGroup);

        if (this.inactivityTimeout) {
            clearTimeout(this.inactivityTimeout);
        }
    }
}
