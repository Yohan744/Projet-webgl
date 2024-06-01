import * as THREE from "three";
import { gsap } from "gsap";
import { watch } from "vue";
import Experience from "../../../Experience";
import { CameraUtils } from "../../Utils/CameraUtils";
import { useInteractableObjects } from "../../ObjectsInteractable";

export default class EnvelopOLD {
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
        this.mesh = mesh;
        this.initialCarouselPosition = new THREE.Vector3();
        this.carouselRotation = new THREE.Euler();

        this.interactableObjects = useInteractableObjects();
        this.items = [];
        this.itemGroup = new THREE.Group();
        this.scene.add(this.itemGroup);

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

        this.items.forEach((item, index) => {
            if (item) {
                item.position.copy(this.initialCarouselPosition);
                item.rotation.set(Math.PI / 2, index * Math.PI / 2, 0);
                this.itemGroup.add(item);
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
        // this.pointer.on("click", this.handleClick.bind(this));
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
            if (!this.hasAnimatedToCamera) {
                this.camera.moveCameraToInitialPosition(() => {
                    this.animateEnvelope(() => {
                        CameraUtils.animateToCamera(this.mesh, this.camera.instance, 0.6);
                        this.initializeCarouselPosition();
                        this.startMorphTargetAnimation();
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
            this.morphTargetPlayed = true;
            const timeline = gsap.timeline({
                onComplete: () => {
                    gsap.to(this.morphMesh.morphTargetInfluences, {
                        [0]: 1,
                        duration: 2,
                        ease: "power1.inOut",
                        onComplete: () => {
                            this.animateEnvelopeBackToDrawer();
                            this.createCarouselItems();
                            this.alignItemsToCamera();
                        }
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

    initializeCarouselPosition() {
        const camera = this.camera.instance;
        const distance = 0.5;
        const targetPosition = new THREE.Vector3(0, 0, -distance).applyMatrix4(camera.matrixWorld);
        this.initialCarouselPosition.copy(targetPosition);
        this.carouselRotation.copy(camera.rotation);
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

    alignItemsToCamera() {
        this.carouselIsSet = true;

        const finalCarouselPosition = this.initialCarouselPosition.clone();
        const itemOffsets = [-0.5, 0, 0.5];

        this.items.forEach((item, index) => {
            gsap.to(item.position, {
                x: finalCarouselPosition.x + itemOffsets[index],
                y: finalCarouselPosition.y,
                z: finalCarouselPosition.z,
                duration: 2,
                ease: "power2.inOut"
            });

            gsap.to(item.rotation, {
                x: Math.PI / 2,
                y: this.carouselRotation.y,
                z: this.carouselRotation.z,
                duration: 2,
                ease: "power2.inOut"
            });
        });

        this.updatePocketButtonVisibility();
    }

    rotateItemsRight() {
        if (!this.carouselIsSet) return;

        const temp = this.items.pop();
        this.items.unshift(temp);
        this.animateItems();
        this.updatePocketButtonVisibility();
    }

    rotateItemsLeft() {
        if (!this.carouselIsSet) return;

        const temp = this.items.shift();
        this.items.push(temp);
        this.animateItems();
        this.updatePocketButtonVisibility();
    }

    animateItems() {
        const finalCarouselPosition = this.initialCarouselPosition.clone();
        const itemOffsets = [-0.5, 0, 0.5];

        this.items.forEach((item, index) => {
            gsap.to(item.position, {
                x: finalCarouselPosition.x + itemOffsets[index],
                y: finalCarouselPosition.y,
                z: finalCarouselPosition.z,
                duration: 2,
                ease: "power2.inOut"
            });

            gsap.to(item.rotation, {
                x: Math.PI / 2,
                y: this.carouselRotation.y,
                z: this.carouselRotation.z,
                duration: 2,
                ease: "power2.inOut"
            });
        });
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
