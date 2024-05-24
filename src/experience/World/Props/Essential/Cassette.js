import * as THREE from 'three';
import { gsap } from 'gsap';
import Experience from "../../../Experience";
import Outline from "../../Effects/Outline";
import { watch } from "vue";

export default class Cassette {
    constructor(objects) {
        //console.log(objects);
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.camera = this.experience.camera.instance;
        this.pointer = this.experience.pointer;
        this.gameManager = this.experience.gameManager;

        this.animations = [];

        this.isDragging = false;
        this.isAnimating = false;
        this.isFirstAnimationIsDone = false;
        this.mouseStartClickPosition = {
            x: 0,
            y: 0,
        };

        this.dragDistance = 0.07;
        this.pointerDown = this.onPointerDown.bind(this);
        this.pointerMove = this.onPointerMove.bind(this);
        this.pointerUp = this.onPointerUp.bind(this);

        this.setEvents();
        this.init(objects);
    }

    init(objects) {
        if (!objects || !Array.isArray(objects)) {
            console.error('Invalid objects array passed to Cassette');
            return;
        }

        this.cassetteObjects = objects;

        this.bobine1 = this.cassetteObjects.find(obj => obj.name.toLowerCase() === 'bobine1');
        this.bobine2 = this.cassetteObjects.find(obj => obj.name.toLowerCase() === 'bobine2');
        this.bobine3 = this.cassetteObjects.find(obj => obj.name.toLowerCase() === 'bobine3');
        this.corps = this.cassetteObjects.find(obj => obj.name.toLowerCase() === 'corps');

        this.objectsToAnimate = [this.bobine1, this.bobine2, this.bobine3, this.corps].filter(Boolean);
    }

    setEvents() {
        this.pointer.on('click', this.pointerDown);
        this.pointer.on('movement-orbit', this.pointerMove);
        this.pointer.on('click-release', this.pointerUp);
    }

    onPointerDown() {
        if (this.gameManager.state.isCameraOnSpot) {
            const mousePosition = this.pointer.getMousePosition();
            this.pointer.raycaster.setFromCamera(mousePosition, this.camera);
            const intersects = this.pointer.raycaster.intersectObjects(this.objectsToAnimate, true);
            if (intersects.length > 0) {
                //console.log(intersects[0].object.name);
                this.showInFrontOfCamera();
                this.gameManager.updateInteractingState(true);
            }
        }
    }

    showInFrontOfCamera() {
        const cameraDirection = new THREE.Vector3();
        this.camera.getWorldDirection(cameraDirection);

        const targetPosition = new THREE.Vector3();
        targetPosition.addVectors(this.camera.position, cameraDirection.multiplyScalar(0.6));

        if (!this.experience.objectGroup) {
            this.experience.objectGroup = new THREE.Group();
            this.scene.add(this.experience.objectGroup);
        }

        this.objectsToAnimate.forEach(object => {
            if (!this.experience.objectGroup.children.includes(object)) {
                this.experience.objectGroup.add(object);
            }

            gsap.to(object.position, {
                x: targetPosition.x,
                y: targetPosition.y,
                z: targetPosition.z,
                duration: 2,
                ease: 'power2.inOut'
            });

            gsap.to(object.rotation, {
                x: 0,
                y: 0,
                z: 0,
                duration: 2,
                ease: 'power2.inOut'
            });
        });

        this.gameManager.setCassetteInFrontOfCamera(true);
        this.gameManager.state.isObjectOut = true;
    }

    onPointerMove(mouse) {
        if (!this.isDragging || !this.draggableModel || this.isAnimating) return;

        const newZPosition = this.draggableModel.position.z + (mouse.x + 1) - (this.mouseStartClickPosition.x + 1) * this.dragDistance;

        if (newZPosition) {
            this.handleDrag(newZPosition);
        } else {
            console.log("Not far enough");
        }
    }

    handleDrag(newZPosition) {
        console.log("Dragging");
        this.isAnimating = true;
        gsap.to(this.draggableModel.position, {
            z: newZPosition,
            duration: 1,
            onComplete: () => {
                this.isAnimating = false;
            }
        });
    }

    onPointerUp() {
        if (this.isDragging) {
            this.isDragging = false;
            this.draggableModel = null;
            this.gameManager.updateInteractingState(false);
        }
    }

    destroy() {
        this.pointer.off('click', this.pointerDown);
        this.pointer.off('movement-orbit', this.pointerMove);
        this.pointer.off('click-release', this.pointerUp);

        this.objectsToAnimate.forEach(object => {
            if (object && object.parent) {
                object.parent.remove(object);
            }
        });
    }
}
