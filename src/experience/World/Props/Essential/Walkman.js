import * as THREE from "three";
import Experience from "../../../Experience";
import Prop from "../Prop";
import { gsap } from 'gsap';
import { watch } from 'vue';

export default class Walkman extends Prop {
    constructor(mesh, desiredRotationOnClick = null, animatePropsToCameraOnClick = true, distanceToCamera = 0.6, isOutlined = 1.05, propSound, spotId) {
        super(mesh, desiredRotationOnClick, animatePropsToCameraOnClick, distanceToCamera, isOutlined, propSound, spotId);

        this.experience = new Experience();
        this.resources = this.experience.resources;
        this.scene = this.experience.scene;
        this.camera = this.experience.camera.instance;
        this.offsetFromCamera = 0.6;
        this.desiredRotation = desiredRotationOnClick;
        this.objectCanRotate = true;

        this.gameManager = this.experience.gameManager;

        this.isDragging = false;
        this.isAnimating = false;
        this.dragDistance = 0.3;
        this.mouseStartClickPosition = { x: 0, y: 0 };

        this.init();
        this.setEvents();
    }

    init() {
        watch(() => this.gameManager.state.isCassetteInFrontOfCamera, () => {
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
            const walkman = this.experience.objectGroup.children.find(obj => obj.userData.type === 'walkman');
            const cassette = this.experience.objectGroup.children.find(obj => obj.userData.type === 'cassette');

            if (walkman) walkman.position.set(-0.3, 0, -0.5);
            if (cassette) cassette.position.set(0.3, 0, 0.5);
        }

        console.log(`ObjectCanRotate: ${this.objectCanRotate}`);
    }

    onPointerDown() {
        const mousePosition = this.pointer.getMousePosition();
        this.pointer.raycaster.setFromCamera(mousePosition, this.camera);
        const intersects = this.pointer.raycaster.intersectObjects([this.mesh], true);

        if (intersects.length > 0) {
            const clickedObject = intersects[0].object;
            console.log(clickedObject.name);

            if (clickedObject.name === 'clapet') {
                this.isDragging = true;
                this.draggableModel = clickedObject;
                this.mouseStartClickPosition = {
                    x: mousePosition.x,
                    y: mousePosition.y,
                };
                console.log("ready to drag");
                this.gameManager.updateInteractingState(true);
            }
        }
    }

    onPointerMove(mouse) {
        if (!this.isDragging || !this.draggableModel || this.isAnimating) return;

        if ((mouse.y + 1) - (this.mouseStartClickPosition.y + 1) > this.dragDistance) {
            this.handleForwardDrag();
        } else if ((this.mouseStartClickPosition.y + 1) - (mouse.y + 1) > this.dragDistance) {
            this.handleBackwardDrag();
        } else {
            console.log("not dragged far enough");
        }
    }

    handleForwardDrag() {
        console.log("Dragging forward");
        this.isAnimating = true;
        gsap.to(this.draggableModel.morphTargetInfluences, {
            0: 1,
            duration: 1,
            onComplete: () => {
                this.isAnimating = false;
            }
        });
    }

    handleBackwardDrag() {
        console.log("Dragging backward");
        this.isAnimating = true;
        gsap.to(this.draggableModel.morphTargetInfluences, {
            0: 0,
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

    logMeshElements(mesh) {
        console.log(mesh);
        mesh.children.forEach(child => this.logMeshElements(child));
    }

    onClick() {
        console.log("click walkman");
        this.logMeshElements(this.mesh);

        const mousePosition = this.pointer.getMousePosition();
        this.pointer.raycaster.setFromCamera(mousePosition, this.camera);
        const intersects = this.pointer.raycaster.intersectObjects([this.mesh], true);

        if (intersects.length > 0) {
            const clickedObject = intersects[0].object;
            console.log(clickedObject.name);

            if (clickedObject.name === 'clapet') {
                this.isDragging = true;
                this.draggableModel = clickedObject;
                this.mouseStartClickPosition = {
                    x: mousePosition.x,
                    y: mousePosition.y,
                };
                console.log("ready to drag");
                this.gameManager.updateInteractingState(true);
            } else {
                super.onClick();
            }
        }
    }
    destroy() {
        super.destroy();
        this.pointer.off('click', this.pointerDown);
        this.pointer.off('movement-orbit', this.pointerMove);
        this.pointer.off('click-release', this.pointerUp);
    }
}
