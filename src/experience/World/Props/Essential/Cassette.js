import * as THREE from 'three';
import { gsap } from 'gsap';
import Experience from "../../../Experience";
import {useInteractableObjects} from "../../ObjectsInteractable";

export default class Cassette {
    constructor(objects) {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.camera = this.experience.camera.instance;
        this.pointer = this.experience.pointer;

        this.cassetteGroup = new THREE.Group();
        this.scene.add(this.cassetteGroup);

        this.cassetteObjects = objects;

       const pencil = useInteractableObjects();

       this.pencil = pencil.pencil;

        this.bobine1 = this.cassetteObjects.find(obj => obj.name.toLowerCase() === 'bobine1');
        this.bobine2 = this.cassetteObjects.find(obj => obj.name.toLowerCase() === 'bobine2');
        this.bobine3 = this.cassetteObjects.find(obj => obj.name.toLowerCase() === 'bobine3');
        this.corps = this.cassetteObjects.find(obj => obj.name.toLowerCase() === 'corps');

        this.objectsToAnimate = [this.bobine1, this.bobine2, this.bobine3, this.corps].filter(Boolean);

        this.isRewinding = false;
        this.isFullyRewound = false;
        this.inactivityTimeout = null;

        this.init();
    }

    init() {
        this.objectsToAnimate.forEach(object => {
            this.cassetteGroup.add(object);

            if (object.morphTargetInfluences) {
                console.log(`Setting morph targets for: ${object.name}`);
                for (let i = 0; i < object.morphTargetInfluences.length; i++) {
                    object.morphTargetInfluences[i] = 1;
                }
            } else {
                console.log(`No morph targets found for: ${object.name}`);
            }
        });

        this.initialPosition = this.cassetteGroup.position.clone();
        this.initialRotation = this.cassetteGroup.rotation.clone();
    }

    animateToCamera(targetPosition = null) {
        const cameraDirection = new THREE.Vector3();
        this.camera.getWorldDirection(cameraDirection);

        if (!targetPosition) {
            targetPosition = new THREE.Vector3();
            targetPosition.addVectors(this.camera.position, cameraDirection.multiplyScalar(0.6));
        }

        gsap.to(this.cassetteGroup.position, {
            x: targetPosition.x,
            y: targetPosition.y,
            z: targetPosition.z,
            duration: 1,
            ease: 'power2.inOut'
        });

        gsap.to(this.cassetteGroup.rotation, {
            x: 0,
            y: 0,
            z: 0,
            duration: 1,
            ease: 'power2.inOut'
        });

        this.animateMorphTargets();
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

        if (allMorphTargetsZero) {
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

    startRewinding() {
        this.isRewinding = true;
        this.isFullyRewound = false;
        this.animateMorphTargets();
    }

    stopRewinding() {
        this.isRewinding = false;

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
            ease: 'power2.inOut'
        });

        gsap.to(this.cassetteGroup.rotation, {
            x: this.initialRotation.x,
            y: this.initialRotation.y,
            z: this.initialRotation.z,
            duration: 2,
            ease: 'power2.inOut'
        });
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
