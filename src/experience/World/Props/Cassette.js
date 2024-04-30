import {MouseUtils} from "../Utils/MouseUtils";
import Pointer from "../../Utils/Pointer";
import {CameraUtils} from "../Utils/CameraUtils";
import Experience from "../../Experience";
import Outline from "../Effects/Outline";
import * as THREE from "three";

export default class Cassette {
    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;
        this.renderer = this.experience.renderer.instance;
        this.camera = this.experience.camera.instance;

        this.pointer = new Pointer();
        this.init();
        this.setupMouseEvents();
        this.interactiveCassette = new MouseUtils(this.cassetteModel, this.camera, this.pointer);
    }

    init() {
        this.cassetteModel = this.resources.items.cassetteModel.scene;
        this.scene.add(this.cassetteModel);
        this.cassetteModel.scale.set(0.09, 0.09, 0.09);
        this.cassetteModel.position.set(3.8, 1.3, -2.5);
        this.outline = new Outline(this.scene, this.cassetteModel, 0.05, 0xffffff);
    }

    setupMouseEvents() {
        this.pointer.on("click", this.handleClick.bind(this));
    }

    handleClick() {
        this.updateClick();
    }

    updateClick() {
        const intersects = this.pointer.raycaster.intersectObjects([this.cassetteModel], true);
        if (intersects.length > 0 && !this.hasAnimatedToCamera) {
            this.outline.removeOutline();
            CameraUtils.animateToCamera(this.cassetteModel, this.camera);
            this.hasAnimatedToCamera = true;
        }
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));
        this.renderer.render(this.scene, this.camera);
    }

    destroy() {
        this.pointer.off("click");

        if (this.cassetteModel) {
            this.scene.remove(this.cassetteModel);
        }

        if (this.interactiveCassette) {
            this.interactiveCassette.destroy();
        }
    }
}
