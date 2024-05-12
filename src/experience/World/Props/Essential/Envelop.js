import * as THREE from "three";
import { gsap } from "gsap";
import { CameraUtils } from "../../Utils/CameraUtils";
import Experience from "../../../Experience";

export default class Envelop {
    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;
        this.renderer = this.experience.renderer.instance;
        this.camera = this.experience.camera.instance;
        this.pointer = this.experience.pointer;
        this.appStore = this.experience.appStore;

        this.hasAnimatedToCamera = false;
        this.isDragging = false;
        this.mouseStartClickPosition = {
            x: 0,
            y: 0,
        };
        this.currentItemIndex = 0;
        this.hasOpenEnvelop = false;
        this.dragDistance = 0.3
        this.init();
        this.setEvents();
    }

    init() {
        this.envelopModel = this.resources.items.envelopModel.scene;
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

        //this.itemGroup.position.copy(this.envelopModel.position);
       // console.log(this.itemGroup.position)
        this.scene.add(this.itemGroup);
    }


    setupMorphTargets() {
        this.envelopModel.traverse((child) => {
            if (child.isMesh && child.morphTargetInfluences) {
                console.log("Morph Targets Found in:", child);
                this.morphMesh = child;
                this.morphTargets = child.morphTargetInfluences;
                this.morphTargets[41] = 1;
                child.morphTargetInfluences[40] = 1
            }
        });

        if (!this.morphTargets) {
            console.log("No morph targets found in the model");
        }
    }

    setEvents() {
        this.pointer.on("click", this.handleClick.bind(this));
        this.pointer.on("movement", this.handleMouseMove.bind(this));
        this.pointer.on("click-release", this.handleMouseUp.bind(this));
    }

    handleClick(event) {
        const mousePosition = this.pointer.getMousePosition();
        const intersects = this.pointer.raycaster.intersectObjects([this.envelopModel], true);
        const intersectedObject = this.pointer.raycaster.intersectObjects([this.itemGroup, ...this.itemGroup.children], true);
        if (intersects.length > 0) {
            if (this.hasOpenEnvelop) {
                console.log("here")
               this.positionItemsInFrontOfCamera();
            }
            if (!this.hasAnimatedToCamera) {
                CameraUtils.animateToCamera(this.envelopModel, this.camera);
                this.hasAnimatedToCamera = true;
            }
            else {
                    this.isDragging = true;
                    this.mouseStartClickPosition = {
                    x: mousePosition.x,
                    y: mousePosition.y,
                };
                }
        }
        if (intersectedObject.length > 0) {
            if (!this.hasOpenEnvelop) {
                this.positionItemsInFrontOfCamera();
            } else {
                this.bringItemToFront(intersectedObject);
            }
            this.resetItemsToCarousel()
        }
    }

    bringItemToFront(item) {
        const targetPosition = new THREE.Vector3();
        this.camera.getWorldDirection(targetPosition);
        targetPosition.multiplyScalar(2).add(this.camera.position);

        gsap.to(item.position, {
            x: targetPosition.x,
            y: targetPosition.y,
            z: targetPosition.z,
            duration: 2,
            ease: "power2.inOut",
            onComplete: () => {
                //item.lookAt(this.camera.position);
                console.log("Item is now in front of the camera.");
            }
        });
    }
    handleMouseMove(mouse) {
        if(!this.isDragging) return;
        if (!this.isAnimating && (mouse.x + 1) - (this.mouseStartClickPosition.x + 1) > this.dragDistance) {
            this.startAnimationOfMorphTargets();
            this.itemGroup.visible = true;
            this.isAnimating = true;
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
                        this.prepareCarouselDisplay();
                    }
                });
            }
        }
    }

    resetItemsToCarousel() {
        this.positionItemsInFrontOfCamera();
    }

    positionItemsInFrontOfCamera() {
        const spacing = 0.3;
        const positions = [
            new THREE.Vector3(-spacing, 0, -0.1),
            new THREE.Vector3(0, 0, -0.1),
            new THREE.Vector3(spacing, 0, -0.1)
        ];

        this.itemGroup.children.forEach((item, index) => {
            gsap.to(item.position, {
                x: positions[index].x,
                y: positions[index].y,
                z: positions[index].z,
                duration: 2,
                ease: "power2.inOut",
                onComplete: () => {
                    console.log(this.hasOpenEnvelop)
                    this.hasOpenEnvelop = true;
                }
            });
        });

        const drawerPosition = new THREE.Vector3(0, -0.1, 0);
        gsap.to(this.envelopModel.position, {
            x: drawerPosition.x,
            y: drawerPosition.y,
            z: drawerPosition.z,
            duration: 2,
            ease: "power2.inOut"
        });
    }

    prepareCarouselDisplay() {
        this.itemGroup.visible = true;
        this.itemGroup.position.copy(this.envelopModel.position);
        this.itemGroup.rotation.copy(this.envelopModel.rotation);

        this.envelopModel.getWorldPosition(this.envelopModel.position);
        this.itemGroup.quaternion.copy(this.envelopModel.quaternion)
        const itemPosition = this.envelopModel.position.clone().add(new THREE.Vector3(0, -0.2, 0));

        gsap.to(this.itemGroup.position, {
            x: itemPosition.x + 0.5,
            y: itemPosition.y,
            z: itemPosition.z,
            duration: 2,
            ease: "power2.inOut",
            onComplete: () => {
                gsap.to(this.itemGroup.position, {
                        x: itemPosition.x,
                        y: itemPosition.y + 0.3,
                        z: itemPosition.z,
                        duration: 2,
                        ease: "power2.inOut",
                    })
            }
        });
    }

    showNextItem() {
        console.log(this.currentItemIndex);
        const newPosition = -this.currentItemIndex * 2;
        console.log(this.itemGroup);
        gsap.to(this.itemGroup.position, {
            z: newPosition,
            duration: 1,
            ease: "power2.inOut",
            onComplete: () => {
                this.currentItemIndex = (this.currentItemIndex + 1) % 3;
            }
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
