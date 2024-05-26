import * as THREE from "three";
import Experience from "../../../Experience";
import gsap from "gsap";
import Outline from "../../Effects/Outline";
import {watch} from "vue";

export default class Projector {
    constructor(objects) {

        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.camera = this.experience.camera;
        this.pointer = this.experience.pointer;
        this.gameManager = this.experience.gameManager;
        this.soundManager = this.experience.soundManager;
        this.globalEvents = this.experience.globalEvents

        this.animations = [];

        this.textures = [
            this.experience.resources.items.monasurf,
            this.experience.resources.items.monabouquet,
            this.experience.resources.items.backgroundTreeTexture
        ];

        this.isDragging = false;
        this.isAnimating = false;
        this.isButtonAnimating = false;
        this.isLightsAnimating = false;
        this.isFirstAnimationIsDone = false;
        this.textureIndex = 0;

        this.maxDragDistance = 0.08;
        this.dragDistance = 0.002

        this.railMoveCount = 0;
        this.railOriginalPosition = new THREE.Vector3();
        this.tireuseBasicPosition = new THREE.Vector3();
        this.isSpotlightVisible = false;
        this.basicCameraPosition = new THREE.Vector3(-4.9, 1.225, 5.5);

        this.spotLightBasicPosition = new THREE.Vector3(-3.8, 1.15, 4.5);
        this.spotLightBasicTarget = new THREE.Vector3(-3.3, 1.17, 4.5);

        this.mouseStartClickPosition = {
            x: 0,
            y: 0,
        };

        this.init(objects);
        this.setWatchers();
        this.setupSpotlight()
    }

    init(objects) {

        if (!objects || !Array.isArray(objects)) {
            console.error('Invalid objects array passed to Projector');
            return;
        }

        this.projectorObjects = objects;

        this.projectorModel = this.projectorObjects.find(obj => obj.name.toLowerCase() === 'cube');
        this.projectorOutline = new Outline(this.projectorModel, 1.03);
        this.projectorOutline.updateOutlineMeshPosition(this.projectorModel.getWorldPosition(new THREE.Vector3()));

        this.rail = this.projectorObjects.find(obj => obj.name.toLowerCase() === 'rail_diapo');
        this.railOriginalPosition.copy(this.rail?.position);
        this.railOutline = new Outline(this.rail, 1.03);
        this.railOutline.updateOutlineMeshPosition(this.rail.getWorldPosition(new THREE.Vector3()));

        this.boutonOn = this.projectorObjects.find(obj => obj.name.toLowerCase() === 'boutonon');
        this.boutonOn?.scale.set(1.7, 1.7, 1.7);
        this.buttonOutline = new Outline(this.boutonOn, 2);
        this.buttonOutline.updateOutlineMeshPosition(this.boutonOn.getWorldPosition(new THREE.Vector3()));
        this.buttonOutline.removeOutline()

        this.tireuse = this.projectorObjects.find(obj => obj.name.toLowerCase() === 'tireuse');
        this.tireuseBasicPosition.copy(this.tireuse?.position);
        this.tireuseOutline = new Outline(this.tireuse, 1.02);
        this.tireuseOutline.updateOutlineMeshPosition(this.tireuse.getWorldPosition(new THREE.Vector3()));
        this.tireuseOutline.removeOutline()

    }

    setWatchers() {
        this.pointer.on('click', this.onPointerDown.bind(this));
        this.pointer.on('movement-orbit', this.onPointerMove.bind(this));
        this.pointer.on('click-release', this.onPointerUp.bind(this));

        watch(() => this.gameManager.state.isInteractingWithObject, (state) => {
            if (!state && this.gameManager.state.actualObjectInteractingName === 'projector') {
                this.resetAll();
            }
        })

    }

    setupSpotlight() {

        this.spotlight = new THREE.SpotLight('#e1e1e1', 80, 10, 0.14, 0.7, 1);

        this.spotlight.position.copy(this.spotLightBasicPosition);
        this.spotlight.target.position.copy(this.spotLightBasicTarget);

        this.spotlight.visible = false

        this.spotlight.castShadow = true;
        this.spotlight.near = 2;
        this.spotlight.shadow.mapSize.width = 512;
        this.spotlight.shadow.mapSize.height = 512;
        this.spotlight.shadow.camera.near = 3;
        this.spotlight.shadow.camera.far = 15;
        this.spotlight.shadow.camera.fov = 30;
        this.spotlight.shadow.camera.aspect = 6;
        this.spotlight.shadow.camera.focus = 0.6;

        this.spotlight.map = this.textures[this.textureIndex];

        //////////////

        this.staticSpotLight = this.spotlight.clone();

        this.staticSpotLight.intensity = 0

        this.scene.add(this.staticSpotLight.target, this.spotlight.target);
        this.scene.add(this.staticSpotLight, this.spotlight);
    }

    onPointerDown() {

        if (this.gameManager.state.isCameraOnSpot) {

            const mousePosition = this.pointer.getMousePosition();

            const intersects = this.pointer.raycaster.intersectObjects(this.projectorObjects, true);
            if (intersects.length > 0) {

                if (!this.gameManager.state.isInteractingWithObject) {

                    this.onModelClicked();

                } else {

                    if ((intersects[0].object === this.tireuse || intersects[0].object === this.rail) && this.isSpotlightVisible) {
                        this.isDragging = true;
                        this.draggableModel = this.tireuse;

                        this.mouseStartClickPosition = {
                            x: mousePosition.x,
                            y: mousePosition.y,
                        };

                    }else if (intersects[0].object === this.boutonOn && !this.isButtonAnimating) {
                        this.toggleSpotlightButton();
                    }

                }
            }
        }
    }

    onPointerUp() {
        if (this.isDragging) {
            this.isDragging = false;
            this.draggableModel = null;
        }
    }

    onModelClicked() {
        this.camera.lookAtSheet(this.basicCameraPosition);
        this.gameManager.updateInteractingState(true);
        this.gameManager.setActualObjectInteractingName('projector');
        this.buttonOutline.showOutline();
        this.globalEvents.trigger('change-cursor', {name: 'default'})
        this.railOutline.removeOutline()
        this.projectorOutline.removeOutline()
    }

    toggleSpotlightButton() {

        const tl = gsap.timeline();
        this.isButtonAnimating = true;

        tl.to(this.boutonOn.position, {
            y: "-=0.004",
            duration: 0.35,
            onUpdate: () => {
                this.buttonOutline.updateOutlineMeshPosition(this.boutonOn.getWorldPosition(new THREE.Vector3()));
            },
            onComplete: () => {
                this.toggleSpotLightVisibility(!this.isSpotlightVisible);
            }
        });

        tl.to(this.boutonOn.position, {
            y: "+=0.004",
            duration: 0.35,
            onUpdate: () => {
                this.buttonOutline.updateOutlineMeshPosition(this.boutonOn.getWorldPosition(new THREE.Vector3()));
            },
            onComplete: () => {
                this.isButtonAnimating = false;
            }
        });

    }

    toggleSpotLightVisibility(state) {
        this.spotlight.visible = state;
        this.staticSpotLight.visible = state;
        this.isSpotlightVisible = state
        this.camera.updateFocusMode(state);

        state ? this.buttonOutline.removeOutline() : this.buttonOutline.showOutline();
        state ? this.tireuseOutline.showOutline() : this.tireuseOutline.removeOutline();
        state ? this.soundManager.play('projectorSound') : this.soundManager.stop('projectorSound');

        this.globalEvents.trigger('change-cursor', {name: state ? 'arrowRight' : 'click'})
    }

    onPointerMove(mouse) {
        if (!this.isDragging || !this.draggableModel || this.isAnimating) return;

        const deltaX = (mouse.x + 1) - (this.mouseStartClickPosition.x + 1);

        if (!this.isFirstAnimationIsDone && deltaX > 0) {
            this.handleForwardDrag(mouse);
        } else if (this.isFirstAnimationIsDone && deltaX < 0) {
            this.handleBackwardDrag(mouse);
        }
    }

    handleForwardDrag(mouse) {

        if (this.draggableModel.position.z < this.tireuseBasicPosition.z + this.maxDragDistance) {
            this.draggableModel.position.z += this.dragDistance;
            this.tireuseOutline.updateOutlineMeshPosition(this.draggableModel.getWorldPosition(new THREE.Vector3()));
            this.spotlight.target.position.z += this.dragDistance;
            this.spotlight.decay += 0.05;
            this.staticSpotLight.intensity += 3;
            this.staticSpotLight.needsUpdate = true;
        } else {
            this.isFirstAnimationIsDone = true;
            this.mouseStartClickPosition.x = mouse.x
            this.spotlight.target.position.z -= (this.tireuseBasicPosition.z + this.maxDragDistance) * 2

            this.globalEvents.trigger('change-cursor', {name: 'arrowLeft'})
            this.soundManager.play('projectorDiapoChanged');
            this.moveRail();
            this.changeTextureImage();
            this.animateProjectorLights();
        }

    }

    handleBackwardDrag(mouse) {
        if (this.draggableModel.position.z > this.tireuseBasicPosition.z) {
            this.draggableModel.position.z -= this.dragDistance;
            this.tireuseOutline.updateOutlineMeshPosition(this.draggableModel.getWorldPosition(new THREE.Vector3()));
            this.spotlight.target.position.z += this.dragDistance;
            this.spotlight.decay -= 0.05;
            this.staticSpotLight.intensity -= 3;
            this.staticSpotLight.needsUpdate = true;
        } else {
            this.isFirstAnimationIsDone = false;
            this.staticSpotLight.intensity = 0;
            this.mouseStartClickPosition.x = mouse.x
            this.globalEvents.trigger('change-cursor', {name: 'arrowRight'})
        }
    }

    moveRail() {
        if (this.rail) {
            this.railMoveCount++;
            if (this.railMoveCount > 10) {
                gsap.to(this.rail.position, {
                    x: this.railOriginalPosition.x,
                    y: this.railOriginalPosition.y,
                    z: this.railOriginalPosition.z,
                    duration: 1,
                    onComplete: () => {
                        this.railMoveCount = 0;
                    }
                });
            } else {
                gsap.to(this.rail.position, {
                    x: "+=0.02",
                    duration: 1,
                    onComplete: () => {
                        if (this.railMoveCount === 1 && this.gameManager.state.gameStepId === 1) this.gameManager.incrementGameStepId();
                    }
                });
            }
        }
    }

    changeTextureImage() {
        this.textureIndex = (this.textureIndex + 1) % this.textures.length;
        this.spotlight.map = this.textures[this.textureIndex];
    }

    animateProjectorLights() {

        if (this.isLightsAnimating) return;

        const randomDuration = Math.random() * 4;
        const randomDelay = Math.random() * 2;

        gsap.to(this.spotlight, {
            intensity: this.spotlight.intensity, // fake just to trigger the onUpdate
            delay: randomDelay,
            duration: randomDuration,
            onStart: () => {
                this.isLightsAnimating = true;
            },
            onUpdate: () => {
                this.toggleRandomIntensityOnLights((Math.random() - 0.5) * 10);
            },
            onComplete: () => {
                this.isLightsAnimating = false;
            }
        });

    }

    toggleRandomIntensityOnLights(value) {
        this.spotlight.intensity += value;
        this.staticSpotLight.intensity += value;
        this.spotlight.intensity = Math.max(0, this.spotlight.intensity);
        this.staticSpotLight.intensity = Math.max(0, this.staticSpotLight.intensity);
        this.spotlight.needsUpdate = true;
        this.staticSpotLight.needsUpdate = true;
    }

    resetAll() {
        this.camera.moveCameraBackToSpotAfterProjector();
        this.camera.updateFocusMode(false)

        this.gameManager.setActualObjectInteractingName(null);
        this.toggleSpotLightVisibility(false);

        this.tireuse.position.z = this.tireuseBasicPosition.z;
        this.tireuseOutline.updateOutlineMeshPosition(this.tireuse.getWorldPosition(new THREE.Vector3()));

        this.spotlight.decay = 1;
        this.spotlight.target.position.copy(this.spotLightBasicTarget);
        this.spotlight.intensity = 80;

        this.staticSpotLight.intensity = 0;
        this.staticSpotLight.needsUpdate = true;

        this.isFirstAnimationIsDone = false;
        this.isButtonAnimating = false;
        this.isLightsAnimating = false;
        this.isDragging = false;

        this.railOutline.showOutline()
        this.railOutline.updateOutlineMeshPosition(this.rail.getWorldPosition(new THREE.Vector3()));
        this.projectorOutline.showOutline()

    }

    destroy() {
        if (this.spotlight) {
            this.spotlight.map?.dispose();
            this.scene.remove(this.spotlight);
        }

        this.pointer.off('click', this.onPointerDown);
        this.pointer.off('movement-orbit', this.onPointerMove);
        this.pointer.off('click-release', this.onPointerDown);
    }
}
