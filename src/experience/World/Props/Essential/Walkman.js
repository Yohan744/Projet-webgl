import * as THREE from "three";
import Experience from "../../../Experience";
import Prop from "../Prop";
import { gsap } from 'gsap';
import { watch } from 'vue';

export default class Walkman {
    constructor() {

        this.experience = new Experience();
        this.resources = this.experience.resources;
        this.scene = this.experience.scene;
        this.camera = this.experience.camera.instance;
        this.offsetFromCamera = 0.6;
        this.objectCanRotate = true;
        this.gameManager = this.experience.gameManager;
        this.morphTargetName = 'clapet';
        this.morphMesh = null;
        this.morphTargetMeshes = {};
        this.isDragging = false;
        this.isAnimating = false;
        this.dragDistance = 0.15;
        this.mouseStartClickPosition = { x: 0, y: 0 };
        this.hasMoveInFront = false;

        this.setupMorphTargets();
        this.init();
        this.setEvents();
    }
    init() {
        watch(() => this.gameManager.state.isCassetteInFrontOfCamera, (newVal) => {
            if (newVal && this.gameManager.state.isWalkmanInFrontOfCamera) {
                this.alignObjectsInFront();
            }
        });
        watch(() => this.gameManager.state.isCassetteInFrontOfCamera && this.gameManager.state.isWalkmanInFrontOfCamera, () => {
            this.checkObjectsInFront();
        });
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
            console.log(this.mesh.morphTargetInfluences);
            this.mesh.morphTargetInfluences.forEach((_, i) => this.mesh.morphTargetInfluences[i] = 0);
        }
    }
    setupMorphTargets() {
        if (this.mesh.isMesh && this.mesh.morphTargetInfluences) {
            console.log("Morph Targets Found in:", this.mesh);
            this.morphMesh = this.mesh;
            const morphTargetGeometry = this.mesh.geometry.clone();
            morphTargetGeometry.morphAttributes = { position: this.mesh.geometry.morphAttributes.position };
            const morphTargetMesh = new THREE.Mesh(morphTargetGeometry, new THREE.MeshBasicMaterial({ visible: false }));
            morphTargetMesh.name = 'morphTargetMesh_' + this.mesh.name;
            this.morphTargetMeshes[this.morphTargetName] = morphTargetMesh;
            this.scene.add(morphTargetMesh);
        }
        if (!this.morphMesh) {
            console.error(`Morph target mesh not found.`);
        } else if (!(this.morphTargetName in this.morphTargetMeshes)) {
            console.error(`Morph target "${this.morphTargetName}" not found in the morph target dictionary.`);
        }
    }
    setEvents() {
        this.pointerDown = this.onPointerDown.bind(this);
        this.pointerMove = this.onPointerMove.bind(this);
        this.pointerUp = this.onPointerUp.bind(this);

        this.pointer.on('click', this.pointerDown);
        this.pointer.on('movement-orbit', this.pointerMove);
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
        const mousePosition = this.pointer.getMousePosition();
        this.pointer.raycaster.setFromCamera(mousePosition, this.camera);
        const intersects = this.pointer.raycaster.intersectObjects([this.mesh], true);
        if (intersects.length > 0) {
            if (!this.hasMoveInFront) {
                this.bringObjectsInFrontOfCamera();
            } else {
                this.startDragging(mousePosition);
            }
        }
    }
    onPointerMove(mouse) {
        if (!this.isDragging || !this.draggableModel || this.isAnimating) return;

        if ( (mouse.y + 1) - (this.mouseStartClickPosition.y + 1) > this.dragDistance) {
            this.handleForwardDrag();
        } else if ((this.mouseStartClickPosition.y + 1) - (mouse.y + 1) > this.dragDistance) {
            this.handleBackwardDrag();
        } else {
            console.log("pas assez loin");
        }
    }
    startDragging(mousePosition) {
        this.isDragging = true;
        this.draggableModel = this.morphMesh;
        this.desiredRotation = null;
        this.mouseStartClickPosition = {
            x: mousePosition.x,
            y: mousePosition.y,
        };
        console.log("ready to drag");
    }
    handleForwardDrag() {
        console.log("Dragging en avant");
        this.isAnimating = true;
        gsap.to(this.draggableModel.morphTargetInfluences, {
            [this.morphMesh.morphTargetDictionary[this.morphTargetName]]: 1,
            duration: 1,
            onComplete: () => {
                this.isAnimating = false;
            }
        });
    }
    handleBackwardDrag() {
        console.log("Dragging en arrière");
        this.isAnimating = true;
        gsap.to(this.draggableModel.morphTargetInfluences, {
            [this.morphMesh.morphTargetDictionary[this.morphTargetName]]: 0,
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
        }
    }

    bringObjectsInFrontOfCamera() {
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
            z: cassette ? targetPosition.z - 0.3 : targetPosition.z,
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
        this.hasMoveInFront = true;
    }

    alignObjectsInFront() {
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

    destroy() {
        super.destroy();
        this.pointer.off('click', this.pointerDown);
        this.pointer.off('movement-orbit', this.pointerMove);
        this.pointer.off('click-release', this.pointerUp);
        this.scene.remove(this.walkman);
        this.outline.destroy();
    }
}
