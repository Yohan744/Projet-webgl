import {MouseUtils} from "../Utils/MouseUtils";
import Experience from "../../Experience";
import Outline from "../Effects/Outline";

export default class Cassette {
    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;
        this.renderer = this.experience.renderer.instance;
        this.camera = this.experience.camera.instance;
        this.appStore = this.experience.appStore;
        this.pointer = this.experience.pointer
        // this.cameraUtils = new CameraUtils(this.resources.items.cassetteModel.scene);

        this.pointer.on("click", this.handleClick.bind(this));

        this.init();
    }

    init() {
        this.cassetteModel = this.resources.items.cassetteModel.scene;
        this.cassetteModel.scale.set(0.05, 0.05, 0.05);
        // this.interactiveCassette = new MouseUtils(this.cassetteModel, this.camera, this.pointer);
        this.cassetteModel.position.set(-3.65, 1.8, -4.1);
        this.interactiveCassette = new MouseUtils(this.cassetteModel, this.camera, this.pointer, this.renderer);
        this.cassetteModel.traverse(child => {
            if (child.isMesh && Array.isArray(child.morphTargetInfluences)) {
                child.morphTargetInfluences.forEach((_, i) => child.morphTargetInfluences[i] = 0);
            }
        });
        this.scene.add(this.cassetteModel);
        this.outline = new Outline(this.cassetteModel, 0.0525);
    }

    handleClick() {
        const intersects = this.pointer.raycaster.intersectObjects([this.cassetteModel], true);
        if (intersects.length > 0 && !this.hasAnimatedToCamera && this.appStore.$state.isCameraOnSpot) {
            this.outline.removeOutline();
            // CameraUtils.animateToCamera(this.cassetteModel, this.camera);
            // this.cameraUtils.animatePropsToCamera();
            this.pointer.on('pencilClick', () => this.handlepencilClick());
            this.hasAnimatedToCamera = true;
        }
    }

    handlepencilClick() {
        if (this.appStore.$state.isCameraOnSpot) {
            this.advanceMorphTargets();
        }
    }

    advanceMorphTargets() {
        this.cassetteModel.traverse(child => {
            if (child.isMesh && child.morphTargetInfluences) {
                child.morphTargetInfluences[0] = (child.morphTargetInfluences[0] + 0.1) % 1;
            }
        });
    }

    destroy() {
        this.pointer.off("click");

        this.outline.destroy()

        if (this.cassetteModel) {
            this.cassetteModel.traverse(child => {
                if (child.isMesh) {
                    child.material.dispose();
                    child.geometry.dispose();
                }
            });
            this.scene.remove(this.cassetteModel);
        }

        if (this.interactiveCassette) {
            this.interactiveCassette.destroy();
        }
    }
}
