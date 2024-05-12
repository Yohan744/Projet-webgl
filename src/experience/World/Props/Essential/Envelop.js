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
        this.dragThreshold = 50;
        this.dragDistance = 0.3
        this.init();
        this.setEvents();
    }

    init() {
        this.envelopModel = this.resources.items.envelopModel.scene;
        this.scene.add(this.envelopModel);
        this.setupMorphTargets();
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
        if (intersects.length > 0) {
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
    handleMouseMove(mouse) {
        if(!this.isDragging) return;
        if (!this.isAnimating && (mouse.x + 1) - (this.mouseStartClickPosition.x + 1) > this.dragDistance) {
            this.startAnimationOfMorphTargets();
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
                    ease: "power1.inOut"
                });
            }
        }
    }

    destroy() {
        this.scene.remove(this.envelopModel);
        this.envelopModel.geometry.dispose();
        this.pointer.off("click", this.handleClick);
        this.pointer.off("movement", this.handleMouseMove);
        this.pointer.off("click-release", this.handleMouseUp);
    }
}
