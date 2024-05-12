import * as THREE from "three";
import {DoubleSide} from "three";
import Experience from "../../../Experience";
import gsap from "gsap";

export default class Projector {
    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.camera = this.experience.camera.instance;
        this.pointer = this.experience.pointer;
        this.appStore = this.experience.appStore;

        this.animations = [];

        this.textures = [
            this.experience.resources.items.monasurf,
            this.experience.resources.items.monabouquet,
            this.experience.resources.items.backgroundTreeTexture
        ];

        this.isDragging = false;
        this.isAnimating = false;
        this.isFirstAnimationIsDone = false;
        this.textureIndex = 0;

        this.mouseStartClickPosition = {
            x: 0,
            y: 0,
        };

        this.dragDistance = 0.3
        this.isSpotlight = false;
        this.pointerDown = this.onPointerDown.bind(this);
        this.pointerMove = this.onPointerMove.bind(this);
        this.pointerUp = this.onPointerUp.bind(this);

        this.setEvents();
        this.init();
    }

    init() {
        this.projectorModel = this.experience.resources.items.projectorModel.scene;
        this.projectorModel.position.set(-3.8, 1.15, 4.5);
        this.scene.add(this.projectorModel);
    }

    setEvents() {
        this.pointer.on('click', this.pointerDown );
        this.pointer.on('movement-orbit', this.pointerMove);
        this.pointer.on('click-release', this.pointerUp);
    }

    onPointerDown() {
        const mousePosition = this.pointer.getMousePosition();
        this.pointer.raycaster.setFromCamera(mousePosition, this.camera);
        const intersects = this.pointer.raycaster.intersectObjects([this.projectorModel], true);
        if (intersects.length > 0) {
            console.log(intersects[0].object.name)
            if (!this.isCameraMoved) {
                this.onModelClicked(intersects[0]);
                this.isCameraMoved = true;
            } else {
                if (intersects[0].object.name === 'tireuse') {
                    this.isDragging = true;
                    this.draggableModel = intersects[0].object;
                    this.mouseStartClickPosition = {
                        x: mousePosition.x,
                        y: mousePosition.y,
                    };
                    console.log("ready")
                    this.appStore.updateInteractingState(true)
                } else if (intersects[0].object.name === 'EnsembleRail' && this.isFirstAnimationIsDone) {
                    this.moveRail();
                } else if(intersects[0].object.name === 'BoutonOn') {
                    if (!this.isSpotlight) {
                        const button = intersects[0].object
                        gsap.to(button.position, {
                            y: "-=0.003",
                            duration: 0.5,
                            onComplete: () => {
                                this.setupSpotlight(true);
                                gsap.to(button.position, {
                                    y: "+=0.003",
                                    duration: 0.5,
                                });
                            }
                        });
                    } else {
                            const button = intersects[0].object
                            gsap.to(button.position, {
                                y: "-=0.003",
                                duration: 0.5,
                                onComplete: () => {
                                   this.removeSpotlight()
                                    gsap.to(button.position, {
                                        y: "+=0.003",
                                        duration: 0.5,
                                    });
                                }
                            });
                    }
                }
            }
        }
    }
    onModelClicked(intersect) {
        const offset = new THREE.Vector3(-1.3, 0.28, 0.5);
        const modelPosition = intersect.object.getWorldPosition(new THREE.Vector3());
        const targetPosition = modelPosition.clone().add(offset);
        this.experience.camera.lookAtSheet(targetPosition);
        this.isCameraMoved = true;
    }

    setupSpotlight(withTexture) {
        this.removeSpotlight();

        let spotlight = new THREE.SpotLight(0xffffff, 60, 0, Math.PI * 0.05);
        spotlight.position.copy(this.projectorModel.position);
        spotlight.target.position.set(this.projectorModel.position.x + 0.7, this.projectorModel.position.y + 0.02, this.projectorModel.position.z);

        spotlight.angle = 0.1;
        spotlight.penumbra = 0.7;
        spotlight.decay = 1;
        spotlight.distance = 0;

        spotlight.castShadow = true;
        spotlight.shadow.mapSize.width = 1024;
        spotlight.shadow.mapSize.height = 1024;
        spotlight.shadow.camera.near = 1;
        spotlight.shadow.camera.far = 100;
        spotlight.shadow.camera.fov = 30;
        spotlight.shadow.camera.aspect = 6;
        spotlight.shadow.camera.focus = 0.6;

        if (withTexture) {
            const texture = this.textures[this.textureIndex];
            texture.flipY = true;
            spotlight.map = texture;
            spotlight.map.side = DoubleSide;
        }

        this.scene.add(spotlight.target);
        this.scene.add(spotlight);
        this.isSpotlight = true;

        if (withTexture) {
            this.spotlightWithTexture = spotlight;
        } else {
            this.spotlight = spotlight;
        }
    }

    removeSpotlight() {
        if (this.spotlightWithTexture) {
            this.scene.remove(this.spotlightWithTexture);
            this.spotlightWithTexture = null;
            this.isSpotlight = false;
        }
    }

    onPointerMove(mouse) {
        if (!this.isDragging || !this.draggableModel || this.isAnimating) return;

        if (!this.isFirstAnimationIsDone && (mouse.x + 1) - (this.mouseStartClickPosition.x + 1) > this.dragDistance) {
            console.log("Parfait");
            this.isAnimating = true;
            gsap.to(this.draggableModel.position, {
                z: "+=0.05",
                duration: 1,
                onComplete: () => {
                    this.isAnimating = false;
                    this.isFirstAnimationIsDone = true;
                }
            });
            this.animateTextureDisappearance();
        } else if (this.isFirstAnimationIsDone && (this.mouseStartClickPosition.x + 1) - (mouse.x + 1) > this.dragDistance) {
            console.log("Parfait");
            this.isAnimating = true;
                this.changeTextureAnimation();
            gsap.to(this.draggableModel.position, {
                z: "-=0.05",
                duration: 1,
                onComplete: () => {
                    this.isAnimating = false;
                    this.isFirstAnimationIsDone = false;
                }
            });
        } else {
            console.log("pas assez loin");
        }
    }

    moveRail() {
        const rail = this.projectorModel.getObjectByName('rail_Diapo');
        if (rail) {
            gsap.to(rail.position, {
                x: "+=0.005",
                duration: 1,
                onComplete: () => {
                    console.log("Rail animation complete");
                }
            });
        }
    }

    animateTextureDisappearance() {
        if(this.isSpotlight) {
            gsap.to(this.spotlightWithTexture.position, {
                z: "+=0.05",
                duration: 0.3,
                ease: "power2.in",
                onComplete: () => {
                    this.spotlightWithTexture.position.z -= 0.05;
                    this.spotlightWithTexture.visible = false;
                    this.setupSpotlight(false);
                }
            });
        }
    }

    changeTextureAnimation() {
        this.textureIndex = (this.textureIndex + 1) % this.textures.length;
        const newTexture = this.textures[this.textureIndex];
        newTexture.flipY = true;
        if(this.isSpotlight) {
            this.spotlight.visible = false;
            if (!this.spotlightWithTexture) {
                this.setupSpotlight(true);
                this.spotlightWithTexture.position.z += 0.05;
                gsap.to(this.spotlightWithTexture.map, {
                    onComplete: () => {
                        this.textureIndex = newTexture;
                        this.isAnimating = false;
                        gsap.to(this.spotlightWithTexture.position, {
                            z: "-=0.05",
                            duration: 0.5,
                        });
                    }
                });
                this.spotlightWithTexture.map = newTexture;
            }
        }
    }
    onPointerUp() {
        if (this.isDragging) {
            this.isDragging = false;
            this.draggableModel = null;
            this.appStore.updateInteractingState(false)
        }
    }

    destroy() {
        if (this.spotlightWithTexture) {
            this.scene.remove(this.spotlightWithTexture);
            if (this.spotlightWithTexture.map) {
                this.spotlightWithTexture.map.dispose();
            }
            this.spotlightWithTexture.material.dispose();
            this.spotlightWithTexture = null;
        }

        if (this.spotlight) {
            this.scene.remove(this.spotlight);
            this.spotlight.material.dispose();
            this.spotlight = null;
        }

        this.pointer.off('click', this.onPointerDown.bind(this));
        this.pointer.off('movement-orbit', this.onPointerMove.bind(this));
        this.pointer.off('click-release', this.onPointerUp.bind(this));
    }

}
