import * as THREE from "three";
import { gsap } from "gsap";
import Experience from "../../../Experience";
import { CameraUtils } from "../../Utils/CameraUtils";
import Locations from "../../Locations";

export default class Envelop {
    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;
        this.renderer = this.experience.renderer.instance;
        this.camera = this.experience.camera;
        this.pointer = this.experience.pointer;
        this.appStore = this.experience.appStore;
        this.locations = new Locations(this.experience.materialLibrary);

        this.hasAnimatedToCamera = false;
        this.carouselIsSet = false;
        this.isDragging = false;
        this.isAnimating = false;
        this.mouseStartClickPosition = {
            x: 0,
            y: 0,
        };
        this.hasOpenEnvelop = false;
        this.dragDistance = 0.2;
        this.initialEnvelopePosition = new THREE.Vector3(0, -0.05, -0.05);
        this.init();
        this.setEvents();
    }

    init() {
        this.envelopModel = this.resources.items.envelopModel.scene;
        this.envelopModel.position.copy(this.initialEnvelopePosition);
        this.scene.add(this.envelopModel);
        this.setupMorphTargets();
        this.createCarouselItems();
    }

    createCarouselItems() {
        this.itemGroup = new THREE.Group();

        this.dahlia = this.resources.items.dahliaModel.scene;
        this.cassette = this.resources.items.cassetteModel.scene;
        this.letter = this.resources.items.letterModel.scene;

        this.itemGroup.add(this.dahlia);
        this.itemGroup.add(this.cassette);
        this.itemGroup.add(this.letter);

        this.scene.add(this.itemGroup);

        this.items = [this.dahlia, this.cassette, this.letter];
        this.positions = [
            { x: 0, y: 0.2, z: 0 },
            { x: -0.2, y: -0.1, z: -0.2 },
            { x: 0.2, y: 0.1, z: -0.2 }
        ];
    }

    setupMorphTargets() {
        this.envelopModel.traverse((child) => {
            if (child.isMesh && child.morphTargetInfluences) {
                console.log("Morph Targets Found in:", child);
                this.morphMesh = child;
                this.morphTargets = child.morphTargetInfluences;
                this.morphTargets[41] = 1;
                child.morphTargetInfluences[40] = 1;
            }
        });
    }

    setEvents() {
        this.pointer.on("click", this.handleClick.bind(this));
        this.pointer.on("movement", this.handleMouseMove.bind(this));
        this.pointer.on("click-release", this.handleMouseUp.bind(this));
    }

    handleClick() {
        const mousePosition = this.pointer.getMousePosition();
        const intersects = this.pointer.raycaster.intersectObjects([this.envelopModel, this.itemGroup, ...this.itemGroup.children], true);
        console.log(intersects);
        if (intersects.length > 0) {
            if (this.hasOpenEnvelop) {
                this.separateItemsToTriangle();
            }
            if (!this.hasAnimatedToCamera) {
                this.camera.moveCameraToInitialPosition(() => {
                    this.animateEnvelope(() => {
                        CameraUtils.animateToCamera(this.envelopModel, this.camera.instance, () => {
                            this.animateItemGroup();
                        });
                    });
                });
                this.hasAnimatedToCamera = true;
            }
            this.isDragging = true;
            this.mouseStartClickPosition = {
                x: mousePosition.x,
                y: mousePosition.y,
            };
        }
    }

    handleMouseMove(mouse) {
        if (!this.isDragging) return;
        if (!this.isAnimating && (mouse.x + 1) - (this.mouseStartClickPosition.x + 1) > this.dragDistance) {
            this.startAnimationOfMorphTargets();
            this.itemGroup.visible = true;
            this.isAnimating = true;
            this.isDragging = false;
        } else if(this.carouselIsSet) {
            this.itemGroup.visible = true;
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

    startAnimationOfMorphTargets() {
        if (this.morphTargets) {
            for (let i = 0; i < this.morphTargets.length; i++) {
                gsap.to(this.morphMesh.morphTargetInfluences, {
                    [40]: "-=1",
                    duration: 2,
                    ease: "power1.inOut",
                    onComplete: () => {
                        this.animateItemGroup();
                    }
                });
            }
        }
    }

    animateEnvelope(onComplete) {
        const liftUp = { y: this.envelopModel.position.y + 0.5 };

        const tl = gsap.timeline({ onComplete });

        tl.to(this.envelopModel.position, {
            y: liftUp.y,
            duration: 2,
            ease: "power2.inOut",
        });
    }


    animateItemGroup() {
        this.itemGroup.position.copy(this.envelopModel.position);
        this.itemGroup.rotation.copy(this.envelopModel.rotation);

        gsap.to(this.itemGroup.position, {
            x: this.itemGroup.position.x + 0.2,
            duration: 1,
            ease: "power2.inOut",
            onComplete: () => {
                gsap.to(this.itemGroup.position, {
                    x: this.itemGroup.position.x - 0.2,
                    z: this.itemGroup.position.z + 0.1,
                    duration: 1,
                    ease: "power2.inOut",
                    onComplete: () => {
                        this.animateEnvelopeBackToDrawer();
                        this.hasOpenEnvelop = true;
                    }
                });
            }
        });
    }

    animateEnvelopeBackToDrawer() {
        const drawerPosition = new THREE.Vector3();
        const drawer = this.experience.scene.getObjectByName("tirroir-haut");
        drawer.getWorldPosition(drawerPosition);

        const envelopPositionX = drawerPosition.x;
        const envelopPositionY = drawerPosition.y + 0.1;
        const envelopPositionZ = drawerPosition.z - 0.4;

        gsap.to(this.envelopModel.position, {
            x: envelopPositionX,
            y: envelopPositionY,
            z: envelopPositionZ,
            duration: 2,
            ease: "power2.inOut"
        });

        gsap.to(this.envelopModel.rotation, {
            x: -Math.PI * 2,
            y: this.envelopModel.rotation.y + 0.6,
            z: 0,
            duration: 2,
            ease: "power2.inOut",
            onComplete: () => {
                this.scene.remove(this.envelopModel);
            }
        });
    }

    separateItemsToTriangle() {
        this.carouselIsSet = true;
        const itemPositions = [
            { x: 0, y: 0.2, z: 0 },
            { x: -0.2, y: -0.3, z: -0.2 },
            { x: 0.2, y: -0.3, z: -0.2 }
        ];

        const items = [this.dahlia, this.cassette, this.letter];
        items.forEach((item, index) => {
            gsap.to(item.position, {
                x: itemPositions[index].x,
                y: itemPositions[index].y,
                z: itemPositions[index].z,
                duration: 2,
                ease: "power2.inOut",
            });
        });
    }

    rotateItemsRight() {
        const temp = this.items.pop();
        this.items.unshift(temp);
        this.animateItems();
    }

    rotateItemsLeft() {
        const temp = this.items.shift();
        this.items.push(temp);
        this.animateItems();
    }

    animateItems() {
        this.items.forEach((item, index) => {
            gsap.to(item.position, {
                x: this.positions[index].x,
                y: this.positions[index].y,
                z: this.positions[index].z,
                duration: 2,
                ease: "power2.inOut",
            });
        });
    }

    destroy() {
        this.scene.remove(this.envelopModel);
        this.envelopModel.geometry.dispose();
        this.pointer.off("click", this.handleClick);
        this.pointer.off("movement", this.handleMouseMove);
        this.pointer.off("click-release", this.handleMouseUp);
    }
}
