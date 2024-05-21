import * as THREE from "three";
import { gsap } from "gsap";
import { watch } from "vue";
import Experience from "../../../Experience";
import { CameraUtils } from "../../Utils/CameraUtils";

export default class Envelop {
    constructor() {
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
        this.mouseStartClickPosition = {
            x: 0,
            y: 0,
        };
        this.hasOpenEnvelop = false;
        this.dragDistance = 0.2;
        this.initialEnvelopePosition = new THREE.Vector3(0, -0.05, -0.05);
        this.currentSelectedItem = null;

        this.init();
        this.setEvents();
        this.setWatchers();
        this.bindKeyEvents();
    }

    setWatchers() {
        watch(
            () => this.gameManager.state.objectToPocket,
            (newVal) => {
                if (newVal) {
                    this.putObjectInPocket();
                }
            }
        );
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
        this.letter = this.resources.items.letterModel.scene;

        if (!this.gameManager.inventory.cassette) {
            this.cassette = this.resources.items.cassetteModel.scene;
            this.itemGroup.add(this.cassette);
            this.items = [this.dahlia, this.cassette, this.letter];
        } else {
            this.items = [this.dahlia, this.letter];
        }

        this.itemGroup.add(this.dahlia);
        this.itemGroup.add(this.letter);

        this.scene.add(this.itemGroup);

        // this.positions = [
        //     { x: 0, y: 0.2, z: 0 },
        //     { x: -0.2, y: -0.1, z: -0.2 },
        //     { x: 0.2, y: 0.1, z: -0.2 }
        // ];

        // if (this.gameManager.inventory.cassette) {
        //     this.positions = [
        //         { x: 0.2, y: 0, z: 0.2 },
        //         { x: -0.2, y: 0, z: -0.2 }
        //     ];
        // }
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
        if (intersects.length > 0) {
            if (this.hasOpenEnvelop) {
                this.separateItemsToTriangle();
            }
            if (!this.hasAnimatedToCamera) {
                this.camera.moveCameraToInitialPosition(() => {
                    this.animateEnvelope(() => {
                        CameraUtils.animateToCamera(this.envelopModel, this.camera.instance, 0.4);
                       // this.animateItemGroup();
                    });
                });
                this.hasAnimatedToCamera = true;
            }
            this.isDragging = true;
            this.mouseStartClickPosition = {
                x: mousePosition.x,
                y: mousePosition.y,
            };
        } else {
           // this.resetItemPositions();
        }
    }

    handleMouseMove(mouse) {
        if (!this.isDragging) return;
        if (!this.isAnimating && (mouse.x + 1) - (this.mouseStartClickPosition.x + 1) > this.dragDistance) {
            this.startAnimationOfMorphTargets();
            this.itemGroup.visible = true;
            this.isAnimating = true;
            this.isDragging = false;
        } else if (this.carouselIsSet) {
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

    // A supprimer pour rester above.
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
        this.itemGroup.rotateY(35 * (Math.PI / 180)); 
        this.positions = [
            { x: 0, y: 0, z: 0 },
            { x: -0.35, y: 0, z: 0 },
            { x: 0.35, y: 0, z: 0 }
        ];

        if (this.gameManager.inventory.cassette) {
            this.positions = [
                { x: 0.35, y: 0, z: 0 },
                { x: -0.35, y: 0, z: 0}
            ];
        }
        gsap.to(this.itemGroup.position, {
            x: this.itemGroup.position.x + 0.1,
            duration: 1,
            ease: "power2.inOut",
            onComplete: () => {
                gsap.to(this.itemGroup.position, {
                    x: this.itemGroup.position.x - 0.05,
                    z: this.itemGroup.position.z + 0.05,
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

    // a garder
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
        const itemPositions = this.gameManager.inventory.cassette ? [
            { x: 0.35, y: 0, z: 0 },
            { x: -0.35, y: 0, z: 0}
        ] : [
            { x: 0, y: 0, z: 0 },
            { x: -0.35, y: 0, z: 0 },
            { x: 0.35, y: 0, z: 0 }
        ];
        
       

        this.items.forEach((item, index) => {
            gsap.to(item.position, {
                x: itemPositions[index].x,
                y: itemPositions[index].y,
                z: itemPositions[index].z,
                duration: 2,
                ease: "power2.inOut",
            });
        });

        this.updatePocketButtonVisibility();
    }

    rotateItemsRight() {
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
            gsap.to(item.position, {
                x: this.positions[index].x,
                y: this.positions[index].y,
                z: this.positions[index].z,
                duration: 2,
                ease: "power2.inOut",
            });
        });
    }

    updatePocketButtonVisibility() {
        const frontItem = this.items[0];
        this.gameManager.updatePocketButtonState(frontItem === this.cassette);
    }

    // a supprimer
    // resetItemPositions() {
    //     if (this.currentSelectedItem) {
    //         this.currentSelectedItem = null;
    //         this.animateItems();
    //         this.hidePocketButton();
    //     }
    // }

    hidePocketButton() {
        this.gameManager.updatePocketButtonState(false);
    }

    bringItemToFront(item) {
        this.currentSelectedItem = item;
        const frontPosition = { x: 0, y: 0.2, z: 0 };

        gsap.to(item.position, {
            x: frontPosition.x,
            y: frontPosition.y,
            z: frontPosition.z,
            duration: 2,
            ease: "power2.inOut",
        });
    }

    putObjectInPocket() {
        const frontItem = this.items[0];
        if (frontItem === this.cassette) {
            gsap.to(this.cassette.position, {
                z: this.cassette.position.z + 2,
                y: this.cassette.position.y - 1,
                duration: 2,
                ease: "power2.inOut",
                onComplete: () => {
                    this.scene.remove(this.cassette);
                    this.items = this.items.filter(item => item !== this.cassette);
                    this.positions.pop();
                    this.animateItems();
                    this.gameManager.updatePocketButtonState(false);
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
        this.itemGroup.visible = true;
        this.isAnimating = true;
        if (clockwise) {
            this.rotateItemsRight();
        } else {
            this.rotateItemsLeft();
        }
        // if (clockwise) {
        //     const first = this.itemGroup.children.shift();
        //     this.itemGroup.children.push(first);
        // } else {
        //     const last = this.itemGroup.children.pop();
        //     this.itemGroup.children.unshift(last);
        // }
        // this.updatePositions();
    }

    // updatePositions() {
    //     this.itemGroup.children.forEach((obj, index) => {
    //         obj.position.x = (index - 1) * 0.3; 
    //     });
    // }
    
    destroy() {
        this.scene.remove(this.envelopModel);
        this.envelopModel.geometry.dispose();
        this.pointer.off("click", this.handleClick);
        this.pointer.off("movement", this.handleMouseMove);
        this.pointer.off("click-release", this.handleMouseUp);
    }
}
