import * as THREE from 'three';
import { gsap } from 'gsap';
import Experience from "../../../Experience";
import { useInteractableObjects } from "../../ObjectsInteractable";
import Outline from "../../Effects/Outline";

export default class Pencil {
    constructor(mesh) {
        this.experience = new Experience();
        this.resources = this.experience.resources;
        this.scene = this.experience.scene;
        this.camera = this.experience.camera.instance;
        this.offsetFromCamera = 0.6;
        this.pointer = this.experience.pointer;
        this.soundManager = this.experience.soundManager;
        this.mesh = mesh;
        this.interactableObjects = useInteractableObjects();
        this.isInFrontOfCamera = false;
        this.hasBeenPlaced = false;
        this.isDragging = false;
        this.previousMousePosition = { x: 0, y: 0 };

        this.trailRings = [];
        this.pencil = new Outline(this.mesh, 1.2);
        this.initialPosition = this.mesh.position.clone();
        this.initialRotation = this.mesh.rotation.clone();

        this.init();
    }

    init() {
        this.createTrailRings();
        this.pencil.showOutline();
        this.pointer.on("click", () => this.handleClick());
        this.pointer.on("movement", () => this.onPointerMove());
        this.pointer.on("click-release", () => this.onPointerUp());
    }

    createTrailRings() {
        const ringCount = 10;
        const ringSpacing = 0.09;
        const time = performance.now() * 0.01;

        for (let i = 0; i < ringCount; i++) {
            const ringGeometry = new THREE.TorusGeometry(0.015, 0.002, 5, 100);
            const ringMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.3 });
            const ring = new THREE.Mesh(ringGeometry, ringMaterial);

            ring.rotation.x = Math.PI / 2 - 0.08 * i;
            ring.rotation.y = THREE.MathUtils.clamp(Math.sin(time) * 0.5, -Math.PI * 85 / 180, Math.PI * 85 / 180);
            ring.position.set(0, 0.05, 0);

            ring.visible = false; // Initially hide the rings
            this.trailRings.push(ring);
            this.mesh.add(ring);
        }
    }

    updateTrailRings() {
        const time = performance.now() * 0.01;

        for (let i = 0; i < this.trailRings.length; i++) {
            const ring = this.trailRings[i];
            ring.position.set(0, 0.05, 0);
            ring.rotation.y = THREE.MathUtils.clamp(Math.sin(time) * 0.5, -Math.PI * 85 / 180, Math.PI * 85 / 180);
            ring.rotation.x = Math.PI / 2 - 0.08 * i;
            ring.material.opacity = 0.5 + 0.5 * Math.sin(time + i * 0.5);
        }
    }

    animateToCamera() {
        const cameraDirection = new THREE.Vector3();
        this.camera.getWorldDirection(cameraDirection);

        const targetPosition = new THREE.Vector3();
        targetPosition.addVectors(this.camera.position, cameraDirection.multiplyScalar(this.offsetFromCamera));

        gsap.to(this.mesh.position, {
            x: targetPosition.x,
            y: targetPosition.y,
            z: targetPosition.z,
            duration: 2,
            ease: 'power2.inOut',
            onComplete: () => {
                this.soundManager.play('crayonFound');
                this.positionCassetteNextToPencil();
                this.isInFrontOfCamera = true;
            }
        });

        gsap.to(this.mesh.rotation, {
            x: 0,
            y: 0,
            z: 0,
            duration: 2,
            ease: 'power2.inOut'
        });

        this.scene.add(this.mesh);
    }

    positionCassetteNextToPencil() {
        const cassette = this.interactableObjects.cassette;
        if (cassette) {
            const pencilPosition = this.mesh.position.clone();
            const cassetteOffset = new THREE.Vector3(0, 0, -0.1);
            const targetPosition = pencilPosition.add(cassetteOffset);
            cassette.animateToCamera(targetPosition);
        } else {
            console.error('Cassette instance not found in interactableObjects');
        }
    }

    animatePencilAboveCassette() {
        gsap.to(this.mesh.position, {
            x: this.mesh.position.x - 0.04,
            y: this.mesh.position.y + 0.1,
            z: this.mesh.position.z - 0.110,
            duration: 1,
            ease: 'power2.inOut',
            onComplete: () => {
                gsap.to(this.mesh.position, {
                    y: this.mesh.position.y - 0.05,
                });
                this.hasBeenPlaced = true;

                const cassette = this.interactableObjects.cassette;
                if (cassette) {
                    gsap.to([this.mesh.rotation, cassette.cassetteGroup.rotation], {
                        z: 0.8,
                        duration: 1,
                        ease: 'power2.inOut',
                    });
                    gsap.to(this.mesh.position, {
                        x: this.mesh.position.x - 0.05,
                        y: this.mesh.position.y - 0.07,
                        duration: 1
                    });
                }
            }
        });
    }

    handleClick() {
        const intersects = this.pointer.raycaster.intersectObject(this.mesh, true);
        if (intersects.length > 0) {
            this.onClick();
        }
    }

    onClick() {
        console.log('Pencil clicked');
        if (!this.isInFrontOfCamera) {
            this.pencil.removeOutline();
            this.animateToCamera();
        } else {
            if (!this.hasBeenPlaced) {
                this.animatePencilAboveCassette();
            } else {
                this.isDragging = true;
                const mousePosition = this.pointer.getMousePosition();
                this.previousMousePosition = {
                    x: mousePosition.x,
                    y: mousePosition.y
                };
                this.showTrailRings();

                const cassette = this.interactableObjects.cassette;
                if (cassette) {
                    cassette.startRewinding();
                }
            }
        }
    }

    onPointerMove() {
        if (!this.isDragging) return;

        const mousePosition = this.pointer.getMousePosition();
        const deltaX = mousePosition.x - this.previousMousePosition.x;

        this.mesh.rotation.x += deltaX * 0.01;
        this.updateTrailRings();

        this.previousMousePosition = {
            x: mousePosition.x,
            y: mousePosition.y
        };
    }

    onPointerUp() {
        this.isDragging = false;
        this.hideTrailRings();

        const cassette = this.interactableObjects.cassette;
        if (cassette) {
            cassette.stopRewinding();
        }
    }

    returnToInitialPosition() {
        this.pencil.showOutline();
        gsap.to(this.mesh.position, {
            x: this.initialPosition.x,
            y: this.initialPosition.y,
            z: this.initialPosition.z,
            duration: 2,
            ease: 'power2.inOut',
        });

        gsap.to(this.mesh.rotation, {
            x: this.initialRotation.x,
            y: this.initialRotation.y,
            z: this.initialRotation.z,
            duration: 2,
            ease: 'power2.inOut'
        });
    }

    destroy() {
        this.pointer.off("click", this.handleClick.bind(this));
        this.pointer.off("movement", this.onPointerMove.bind(this));
        this.pointer.off("click-release", this.onPointerUp.bind(this));
        this.destroyTrailRings();
    }

    showTrailRings() {
        this.trailRings.forEach(ring => ring.visible = true);
    }

    hideTrailRings() {
        this.trailRings.forEach(ring => ring.visible = false);
    }

    destroyTrailRings() {
        this.trailRings.forEach(ring => this.mesh.remove(ring));
        this.trailRings = [];
    }
}
