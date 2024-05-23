import * as THREE from "three";
import Experience from "../../../Experience";
import { gsap } from 'gsap';
import { watch } from 'vue';

export default class Walkman {
    constructor(mesh) {
        this.experience = new Experience();
        this.resources = this.experience.resources;
        this.scene = this.experience.scene;
        this.camera = this.experience.camera.instance;
        this.pointer = this.experience.pointer;
        this.gameManager = this.experience.gameManager;
        this.mesh = mesh;

        this.offsetFromCamera = 0.6;
        this.isDragging = false;
        this.isAnimating = false;
        this.dragDistance = 0.07;
        this.mouseStartClickPosition = { x: 0, y: 0 };
        this.hasMovedInFront = false;

        this.morphTargetName = 'clapet';
        this.setupMorphTargets();
        this.init();
        this.setEvents();
    }

    init() {
        watch(() => this.gameManager.state.showingInventoryObjectInFrontOfCamera === "cassette", (newVal) => {
            if (newVal && this.gameManager.state.isWalkmanInFrontOfCamera) {
                console.log("Cassette and Walkman are both in front");
                this.alignObjectsInFront();
            }
        });
        watch(() => this.gameManager.state.isCassetteInFrontOfCamera && this.gameManager.state.isWalkmanInFrontOfCamera, () => {
            this.checkObjectsInFront();
        });

        this.applyBasicMaterial();
    }

    setupMorphTargets() {
        if (this.mesh.isMesh && this.mesh.morphTargetInfluences) {
            console.log("Morph Targets Found in:", this.mesh);
            this.morphMesh = this.mesh;
            console.log("Morph target dictionary:", this.morphMesh.morphTargetDictionary);
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

    checkObjectsInFront() {
        const isCassetteInFront = this.gameManager.state.isCassetteInFrontOfCamera;
        const isWalkmanInFront = this.gameManager.state.showingInventoryObjectInFrontOfCamera === 'walkman';
        this.objectCanRotate = !(isCassetteInFront && isWalkmanInFront);
        if (isCassetteInFront && isWalkmanInFront) {
            this.desiredRotation = null;
            this.alignObjectsInFront();
        }
    }

    onPointerDown() {
        console.log("Pointer down");
        const mousePosition = this.pointer.getMousePosition();
        this.pointer.raycaster.setFromCamera(mousePosition, this.camera);
        const intersects = this.pointer.raycaster.intersectObjects([this.mesh], true);
        if (intersects.length > 0) {
            if (!this.hasMovedInFront) {
                this.bringObjectsInFrontOfCamera();
            } else {
                this.startDragging(mousePosition);
            }
        }
    }

    onPointerMove(mouse) {
        if (!this.isDragging || !this.draggableModel || this.isAnimating) return;

        const deltaY = mouse.y - this.mouseStartClickPosition.y;
        console.log("Mouse move deltaY:", deltaY);

        if (deltaY > this.dragDistance) {
            this.handleForwardDrag(deltaY);
        } else if (-deltaY > this.dragDistance) {
            this.handleBackwardDrag(deltaY);
        } else {
            console.log("pas assez loin");
        }
    }

    startDragging(mousePosition) {
        this.isDragging = true;
        this.draggableModel = this.morphMesh;
        this.mouseStartClickPosition = {
            x: mousePosition.x,
            y: mousePosition.y,
        };
        console.log("ready to drag");
    }

    handleForwardDrag(deltaY) {
        const influence = Math.min(1, deltaY / this.dragDistance);
        console.log("Dragging forward, influence:", influence);
        gsap.to(this.draggableModel.morphTargetInfluences, {
            [this.morphMesh.morphTargetDictionary[this.morphTargetName]]: influence,
            duration: 0.1,
            ease: 'linear'
        });
    }

    handleBackwardDrag(deltaY) {
        const influence = Math.max(0, deltaY / this.dragDistance);
        console.log("Dragging backward, influence:", influence);
        gsap.to(this.draggableModel.morphTargetInfluences, {
            [this.morphMesh.morphTargetDictionary[this.morphTargetName]]: influence,
            duration: 0.1,
            ease: 'linear'
        });
    }

    onPointerUp() {
        if (this.isDragging) {
            console.log("Pointer up, stopping drag");
            this.isDragging = false;
            this.draggableModel = null;
        }
    }

    bringObjectsInFrontOfCamera() {
        console.log("Bringing objects in front of camera");
        const cameraDirection = new THREE.Vector3();
        this.camera.getWorldDirection(cameraDirection);

        const targetPosition = new THREE.Vector3();
        targetPosition.addVectors(this.camera.position, cameraDirection.multiplyScalar(this.offsetFromCamera));

        if (!this.experience.objectGroup) {
            this.experience.objectGroup = new THREE.Group();
            this.scene.add(this.experience.objectGroup);
        }

        this.experience.objectGroup.add(this.mesh);
        const cassette = this.experience.objectGroup.children.find(obj => obj.userData.type === 'cassette');
        if (cassette) {
            this.experience.objectGroup.add(cassette);
        }

        gsap.to(this.mesh.position, {
            x: targetPosition.x,
            y: targetPosition.y,
            z: targetPosition.z - 0.3,
            duration: 2,
            ease: 'power2.inOut'
        });

        if (cassette) {
            gsap.to(cassette.position, {
                x: targetPosition.x,
                y: targetPosition.y,
                z: targetPosition.z + 0.3,
                duration: 2,
                ease: 'power2.inOut'
            });
        }

        this.gameManager.setWalkmanInFrontOfCamera(true);
        this.gameManager.setCassetteInFrontOfCamera(true);
        this.gameManager.state.isObjectOut = true;
        this.hasMovedInFront = true;
    }

    alignObjectsInFront() {
        console.log("Aligning objects in front");
        const walkman = this.experience.objectGroup.children.find(obj => obj.userData.type === 'walkman');
        const cassette = this.experience.objectGroup.children.find(obj => obj.userData.type === 'cassette');

        if (walkman && cassette) {
            const cameraDirection = new THREE.Vector3();
            this.camera.getWorldDirection(cameraDirection);

            const targetPosition = new THREE.Vector3();
            targetPosition.addVectors(this.camera.position, cameraDirection.multiplyScalar(this.offsetFromCamera));

            gsap.to(walkman.position, {
                x: targetPosition.x,
                y: targetPosition.y,
                z: targetPosition.z - 0.3,
                duration: 2,
                ease: 'power2.inOut'
            });

            gsap.to(cassette.position, {
                x: targetPosition.x,
                y: targetPosition.y,
                z: targetPosition.z + 0.3,
                duration: 2,
                ease: 'power2.inOut'
            });
        }
    }

    applyBasicMaterial() {
        const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
        this.mesh.traverse((child) => {
            if (child.isMesh) {
                child.material = material;
                const edges = new THREE.EdgesGeometry(child.geometry);
                const lineMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });
                const lines = new THREE.LineSegments(edges, lineMaterial);
                child.add(lines);
            }
        });
        if (this.mesh.isMesh && Array.isArray(this.mesh.morphTargetInfluences)) {
            console.log("Initial morph target influences:", this.mesh.morphTargetInfluences);
            this.mesh.morphTargetInfluences.forEach((_, i) => this.mesh.morphTargetInfluences[i] = 0);
        }
    }

    destroy() {
        console.log("Destroying Walkman");
        this.pointer.off('click', this.pointerDown);
        this.pointer.off('movement-orbit', this.pointerMove);
        this.pointer.off('click-release', this.pointerUp);
        this.scene.remove(this.mesh);
    }
}
