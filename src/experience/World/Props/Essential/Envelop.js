import * as THREE from "three";
import { gsap } from "gsap";
import { watch } from "vue";
import Experience from "../../../Experience";
import { CameraUtils } from "../../Utils/CameraUtils";
import { useInteractableObjects } from "../../ObjectsInteractable";

export default class Envelop {
    constructor(mesh) {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;
        this.camera = this.experience.camera;
        this.pointer = this.experience.pointer;
        this.gameManager = this.experience.gameManager;
        this.hasAnimatedToCamera = false;
        this.carouselIsSet = false;
        this.isDragging = false;
        this.isAnimating = false;
        this.morphTargetPlayed = false;
        this.mouseStartClickPosition = { x: 0, y: 0 };
        this.hasOpenEnvelop = false;
        this.dragDistance = 0.2;
        this.initialEnvelopePosition = new THREE.Vector3(0, -0.05, -0.05);
        this.mesh = mesh;
        this.envelopePosition = new THREE.Vector3();
        this.envelopeRotation = new THREE.Euler();

        this.interactableObjects = useInteractableObjects();
        this.items = [];

        this.init();
        this.setEvents();
        this.setWatchers();
        this.bindKeyEvents();
        this.bindClickEvents();
    }

    setWatchers() {
        watch(
            () => this.gameManager.state.objectToPocket,
            (newVal) => {
                if (newVal) this.putObjectInPocket();
            }
        );
    }

    init() {}

    createCarouselItems() {
        const dahlia = this.interactableObjects.dahlia ? this.interactableObjects.dahlia.mesh : null;
        const cassetteMeshes = this.interactableObjects.cassette ? this.interactableObjects.cassette : null;
        const letter = this.interactableObjects.lettre ? this.interactableObjects.lettre.mesh : null;

        const cassette = cassetteMeshes ? this.mergeMeshes(cassetteMeshes) : null;

        if (!this.gameManager.inventory.cassette) {
            this.items = [dahlia, cassette, letter].filter(Boolean);
        } else {
            this.items = [dahlia, letter].filter(Boolean);
        }

        this.items.forEach(item => {
            if (item) {
                item.position.copy(this.envelopePosition);
                item.rotation.set(Math.PI / 2, 0, 0);
                this.scene.add(item);
            }
        });
    }

    mergeMeshes(meshes) {
        const combined = new THREE.Group();

        meshes.forEach(mesh => {
            const meshClone = mesh.clone();
            combined.add(meshClone);
        });

        return combined;
    }

    setupMorphTargets() {
        this.mesh.traverse((child) => {
            if (child.isMesh && child.morphTargetInfluences) {
                this.morphMesh = child;
                this.morphTargets = child.morphTargetInfluences;
                for (let i = 0; i <= 41; i++) {
                    this.morphTargets[i] = 0;
                }
            }
        });
    }

    setEvents() {
        this.pointer.on("click", this.handleClick.bind(this));
        this.pointer.on("movement", this.handleMouseMove.bind(this));
        this.pointer.on("click-release", this.handleMouseUp.bind(this));
    }

    bindClickEvents() {
        window.addEventListener('click', this.handleScreenClick.bind(this));
    }

    handleClick() {
        const mousePosition = this.pointer.getMousePosition();
        const intersects = this.pointer.raycaster.intersectObject(this.mesh, true);
        if (intersects.length > 0) {
            this.setupMorphTargets();
            this.hidePocketButton();
            if (this.hasOpenEnvelop) this.separateItemsToTriangle();
            if (!this.hasAnimatedToCamera) {
                this.camera.moveCameraToInitialPosition(() => {
                    this.animateEnvelope(() => {
                        CameraUtils.animateToCamera(this.mesh, this.camera.instance, 0.6);
                        this.envelopePosition.set(-2.94133, 1.421451, -3.830488);
                        this.mesh.position.copy(this.envelopePosition);
                        this.envelopeRotation.set(Math.PI / 2, 0, 0);
                        this.mesh.rotation.copy(this.envelopeRotation);
                    });
                });
                this.hasAnimatedToCamera = true;
            }
            this.isDragging = true;
            this.mouseStartClickPosition = { x: mousePosition.x, y: mousePosition.y };
        }
    }

    handleScreenClick(event) {
        const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;

        const raycaster = this.experience.pointer.raycaster;
        raycaster.setFromCamera({ x: mouseX, y: mouseY }, this.camera.instance);

        const intersects = raycaster.intersectObject(this.mesh, true);

        if (intersects.length === 0) {
            if (mouseX < 0) this.rotateItemsLeft();
            else this.rotateItemsRight();
        }
    }

    hidePocketButton() {
        this.gameManager.updatePocketButtonState(false);
    }

    handleMouseMove(mouse) {
        if (!this.isDragging) return;
        if (!this.isAnimating && (mouse.x + 1) - (this.mouseStartClickPosition.x + 1) > this.dragDistance) {
            this.startMorphTargetAnimation();
            this.isAnimating = true;
            this.isDragging = false;
        } else if (this.carouselIsSet) {
            this.isAnimating = true;
            if ((mouse.x + 1) - (this.mouseStartClickPosition.x + 1) > this.dragDistance) {
                this.rotateItemsRight();
                this.isDragging = false;
            } else {
                this.rotateItemsLeft();
            }
        }
    }

    handleMouseUp() {
        this.isDragging = false;
        this.isAnimating = false;
    }

    startMorphTargetAnimation() {
        if (this.morphTargets && !this.morphTargetPlayed) {
            this.morphTargetPlayed = true; // Marquez le morph target comme joué
            const timeline = gsap.timeline({
                onComplete: () => {
                    gsap.to(this.morphMesh.morphTargetInfluences, {
                        [40]: "-=1",
                        duration: 2,
                        ease: "power1.inOut",
                        onComplete: () => this.animateItemGroup()
                    });
                    this.morphTargets[0] = 1;
                }
            });
            for (let i = 41; i >= 0; i--) {
                timeline.to(this.morphMesh.morphTargetInfluences, {
                    [i]: 1,
                    duration: 0.01,
                    ease: "power1.inOut"
                }, `+=0`)
                    .to(this.morphMesh.morphTargetInfluences, {
                        [i]: 0.5,
                        [i - 1]: 0.5,
                        duration: 0.01,
                        ease: "power1.inOut"
                    }, `+=0.05`)
                    .to(this.morphMesh.morphTargetInfluences, {
                        [i]: 0,
                        [i - 1]: 1,
                        duration: 0.01,
                        ease: "power1.inOut"
                    }, `+=0.05`);
            }
            timeline.to(this.morphMesh.morphTargetInfluences, {
                [0]: 1,
                duration: 0.01,
                ease: "power1.inOut"
            });
            timeline.play();
        }
    }

    animateEnvelope(onComplete) {
        gsap.timeline({ onComplete })
            .to(this.mesh.position, {
                y: this.mesh.position.y + 0.5,
                duration: 2,
                ease: "power2.inOut"
            });
    }

    animateItemGroup() {
        this.createCarouselItems();

        this.items.forEach(item => {
            item.position.copy(this.mesh.position);
        });

        gsap.to(this.items.map(item => item.position), {
            x: this.mesh.position.x + 0.1,
            duration: 1,
            ease: "power2.inOut",
            onComplete: () => {
                gsap.to(this.items.map(item => item.position), {
                    x: this.mesh.position.x - 0.05,
                    z: this.mesh.position.z + 0.05,
                    duration: 1,
                    ease: "power2.inOut",
                    onComplete: () => {
                        this.animateEnvelopeBackToDrawer();
                        this.separateItemsToTriangle();
                        this.hasOpenEnvelop = true;
                    }
                });
            }
        });
    }

    animateEnvelopeBackToDrawer() {
        const drawerMesh = this.interactableObjects.drawer?.mesh;
        if (!drawerMesh) {
            console.error("Drawer not found");
            return;
        }
        const drawerPosition = new THREE.Vector3();
        drawerMesh.getWorldPosition(drawerPosition);

        gsap.to(this.mesh.position, {
            x: drawerPosition.x,
            y: drawerPosition.y + 0.1,
            z: drawerPosition.z - 0.04,
            duration: 2,
            ease: "power2.inOut"
        });

        gsap.to(this.mesh.rotation, {
            x: -Math.PI * 2,
            y: this.mesh.rotation.y + 0.6,
            z: 0,
            duration: 2,
            ease: "power2.inOut",
            onComplete: () => this.scene.remove(this.mesh)
        });
    }

    separateItemsToTriangle() {
        this.carouselIsSet = true;
        this.positions = this.getFixedPositions();

        this.items.forEach((item, index) => {
            gsap.to(item.position, {
                x: this.positions[index].x,
                y: this.positions[index].y,
                z: this.positions[index].z,
                duration: 2,
                ease: "power2.inOut"
            });
        });

        this.updatePocketButtonVisibility();
    }

    rotateItemsRight() {
        if (!this.positions) this.positions = this.getFixedPositions();

        if (this.items.length === 2) {
            this.rotateTwoItems(true);
        } else {
            const temp = this.items.pop();
            this.items.unshift(temp);
            this.animateItems();
        }

        this.updatePocketButtonVisibility();
    }

    rotateItemsLeft() {
        if (!this.positions) this.positions = this.getFixedPositions();

        if (this.items.length === 2) {
            this.rotateTwoItems(false);
        } else {
            const temp = this.items.shift();
            this.items.push(temp);
            this.animateItems();
        }

        this.updatePocketButtonVisibility();
    }

    rotateTwoItems(clockwise) {
        const [firstItem, secondItem] = this.items;
        const center = new THREE.Vector3().addVectors(firstItem.position, secondItem.position).multiplyScalar(0.5);
        const angle = clockwise ? Math.PI : -Math.PI;

        gsap.to(firstItem.position, {
            x: center.x + (firstItem.position.x - center.x) * Math.cos(angle) - (firstItem.position.z - center.z) * Math.sin(angle),
            z: center.z + (firstItem.position.x - center.x) * Math.sin(angle) + (firstItem.position.z - center.z) * Math.cos(angle),
            duration: 2,
            ease: "power2.inOut"
        });

        gsap.to(secondItem.position, {
            x: center.x + (secondItem.position.x - center.x) * Math.cos(angle) - (secondItem.position.z - center.z) * Math.sin(angle),
            z: center.z + (secondItem.position.x - center.x) * Math.sin(angle) + (secondItem.position.z - center.z) * Math.cos(angle),
            duration: 2,
            ease: "power2.inOut"
        });

        this.items = [secondItem, firstItem];
    }

    animateItems() {
        this.items.forEach((item, index) => {
            if (item && this.positions[index]) {
                gsap.to(item.position, {
                    x: this.positions[index].x,
                    y: this.positions[index].y,
                    z: this.positions[index].z,
                    duration: 2,
                    ease: "power2.inOut"
                });
            }
        });
    }

    getFixedPositions() {
        return this.gameManager.inventory.cassette ? [
            { x: -2.5, y: 1.9, z: -3.5 },
            { x: -3.0, y: 1.9, z: -3.5 }
        ] : [
            { x: -2.5, y: 1.9, z: -3.5 },
            { x: -3.0, y: 1.9, z: -3.5 },
            { x: -2.0, y: 1.9, z: -3.5 }
        ];
    }

    updatePocketButtonVisibility() {
        if (this.hasOpenEnvelop) {
            const frontItem = this.items[0];
            const isCassette = frontItem === this.interactableObjects.cassette;
            this.gameManager.updatePocketButtonState(isCassette);
            this.gameManager.state.isCassetteInFrontOfCamera = isCassette;
        } else {
            this.gameManager.updatePocketButtonState(false);
        }
    }

    putObjectInPocket() {
        const frontItem = this.items[0];
        if (frontItem === this.interactableObjects.cassette) {
            gsap.to(frontItem.position, {
                z: frontItem.position.z + 2,
                y: frontItem.position.y - 1,
                duration: 2,
                ease: "power2.inOut",
                onComplete: () => {
                    this.scene.remove(frontItem);
                    this.items = this.items.filter(item => item !== frontItem);
                    this.positions.pop();
                    this.animateItems();
                    this.gameManager.updatePocketButtonState(false);
                    this.gameManager.setCassetteInFrontOfCamera(false);
                    this.gameManager.addObjectToInventory('cassette');
                }
            });
        }
    }

    bindKeyEvents() {
        window.addEventListener('keydown', (event) => {
            if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
                this.rotateObjects(event.key === 'ArrowRight');
            }
        });
    }

    rotateObjects(clockwise = true) {
        this.isAnimating = true;
        clockwise ? this.rotateItemsRight() : this.rotateItemsLeft();
    }

    destroy() {
        this.scene.remove(this.mesh);
        this.mesh.geometry.dispose();
        this.pointer.off("click", this.handleClick);
        this.pointer.off("movement", this.handleMouseMove);
        this.pointer.off("click-release", this.handleMouseUp);
        window.removeEventListener('click', this.handleScreenClick);
    }
}
