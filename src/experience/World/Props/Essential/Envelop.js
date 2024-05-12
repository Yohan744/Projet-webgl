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
        this.isPositionned = false;
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

    }

    setEvents() {
        this.pointer.on("click", this.handleClick.bind(this));
        this.pointer.on("movement", this.handleMouseMove.bind(this));
        this.pointer.on("click-release", this.handleMouseUp.bind(this));
    }

    handleClick(event) {
        const mousePosition = this.pointer.getMousePosition();
        const intersects = this.pointer.raycaster.intersectObjects([this.envelopModel, ...this.itemGroup.children], true);;
        console.log(intersects);
        if (intersects.length > 0) {
            if (this.hasOpenEnvelop) {
               this.positionItemsInFrontOfCamera();
            }
            if(intersects[0].object && this.isPositionned) {
                this.bringItemToFront(intersects[0].object)
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
    }

    bringItemToFront(item) {
        const basePosition = new THREE.Vector3(0, 0, 0);

        gsap.to(item.position, {
            x: basePosition.x,
            y: basePosition.y + 0.3,
            z: basePosition.z + 0.2,
            duration: 2,
            ease: "power2.inOut",
        });
    }


    handleMouseMove(mouse) {
        if(!this.isDragging) return;
        if (!this.isAnimating && (mouse.x + 1) - (this.mouseStartClickPosition.x + 1) > this.dragDistance) {
            this.startAnimationOfMorphTargets();
            this.itemGroup.visible = true;
            this.isAnimating = true;
        } else {
            const deltaX = event.clientX - this.mouseStartClickPosition.x;
            const rotationSpeed = 0.001;
            const deltaRotation = deltaX * rotationSpeed;

            this.itemGroup.rotation.y += deltaRotation;
            if (this.itemGroup.rotation.y >= 2 * Math.PI) {
                this.itemGroup.rotation.y -= 2 * Math.PI;
            } else if (this.itemGroup.rotation.y <= -2 * Math.PI) {
                this.itemGroup.rotation.y += 2 * Math.PI;
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
                    this.isPositionned = true;
                }
            });
        });

        const drawerPosition = new THREE.Vector3(0, -0.05, -0.05);
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
                    onComplete:() => {
                            this.hasOpenEnvelop = true;
                    }
                    })
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
