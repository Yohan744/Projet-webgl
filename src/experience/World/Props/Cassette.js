import Experience from "../../Experience";
import * as THREE from "three";
import {HoverOutline} from "../../Utils/HoverOutline";
import { CameraUtils } from "../../Utils/CameraUtils";
import {MouseUtils} from "../../Utils/MouseUtils";
import Pointer from "../../Utils/Pointer";

export default class Cassette {
    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;
        this.renderer = this.experience.renderer.instance;
        this.camera = this.experience.camera.instance;

        this.mouse = new THREE.Vector2();
        this.pointer = new Pointer();

        this.init();
        this.setupMouseEvents();
        this.animate = this.animate.bind(this);
        this.hasAnimatedToCamera = false;
        this.showOutline = true;
        this.animate();
        this.interactiveCassette = new MouseUtils(this.cassetteModel, this.camera);
    }

    init() {
        this.cassetteModel = this.resources.items.cassetteModel.scene;
        this.locations = this.experience.locations;
        this.modelHover = new HoverOutline(this.cassetteModel, this.scene, true)

        this.scene.add(this.cassetteModel);
        this.cassetteModel.scale.set(0.09, 0.09, 0.09);
        this.cassetteModel.position.set(3.8, 1.3, -2.5);
    }

    setupMouseEvents() {
        window.addEventListener('pointermove', this.mousemove.bind(this));
        window.addEventListener('click', this.handleClick.bind(this));
        window.addEventListener('pointerdown', this.onMouseDown.bind(this));
        window.addEventListener('pointerup', this.onMouseUp.bind(this));
    }

    onMouseDown(event) {
        const intersects = this.pointer.raycaster.intersectObjects([this.cassetteModel]);

        if (intersects.length > 0) {
            this.interactiveCassette.onMouseDown(this.pointer.getMousePosition());
        }
    }

    onMouseUp(event) {
        this.interactiveCassette.onMouseUp();
    }

    mousemove = (event) => {
        this.mouse.x = (event.clientX / this.renderer.domElement.clientWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / this.renderer.domElement.clientHeight) * 2 + 1;

        this.updateHover();
        const intersects = this.pointer.raycaster.intersectObjects([this.cassetteModel], true);
        if (intersects.length > 0) {
            this.interactiveCassette.onMouseMove(event);
        }
    }


    updateHover() {
        this.pointer.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.pointer.raycaster.intersectObjects([this.cassetteModel], true);
        if (intersects.length > 0) {
            if (!this.interactiveCassette.isDragging && this.showOutline) {
                if (!this.outlineMesh) {
                    this.outlineMesh = this.modelHover.onHover(intersects[0], this.scene);
                }
            }
        } else {
            this.onHoverExit();
        }
    }

    handleClick(event) {
        this.updateClick();
    }

    updateClick() {
        this.pointer.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.pointer.raycaster.intersectObjects([this.cassetteModel], true);
        if (intersects.length > 0) {
            if (this.outlineMesh) {
                this.onHoverExit();
            }
            this.showOutline = false;
            if (!this.hasAnimatedToCamera) {
                CameraUtils.animateToCamera(this.cassetteModel, this.camera);
                this.hasAnimatedToCamera = true;

                let rembobinageProgress = rotationProgress / maxRotation;
                rembobinageProgress = Math.min(rembobinageProgress, 1);

                this.cassetteModel.traverse(function(child) {
                    if (child.isMesh && child.morphTargetInfluences) {
                        for (let i = 0; i < child.morphTargetInfluences.length; i++) {
                            child.morphTargetInfluences[i] = 1 - rembobinageProgress;
                        }
                    }
                });
            }
        }
    }

    animate() {
        requestAnimationFrame(this.animate);
        this.renderer.render(this.scene, this.camera);
    }

    onHoverExit() {
        if (this.outlineMesh) {
            this.scene.remove(this.outlineMesh);
            this.outlineMesh = null;
        }
    }

    destroy() {
        window.removeEventListener('mousemove', this.mousemove);
        window.removeEventListener('click', this.handleClick);
        window.removeEventListener('mousedown', this.onMouseDown);
        window.removeEventListener('mouseup', this.onMouseUp);

        if (this.outlineMesh) {
            this.scene.remove(this.outlineMesh);
            this.outlineMesh.geometry.dispose();
            this.outlineMesh.material.dispose();
            this.outlineMesh = null;
        }

        if (this.cassetteModel) {
            this.scene.remove(this.cassetteModel);
        }

        if (this.interactiveCassette) {
            this.interactiveCassette.destroy();
        }
    }



}
