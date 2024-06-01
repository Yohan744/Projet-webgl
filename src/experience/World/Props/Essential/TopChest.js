import * as THREE from "three";
import Experience from "../../../Experience";
import Prop from "../Prop";

export default class TopChest extends Prop {
    constructor(mesh, desiredRotationOnClick = new THREE.Vector3(0, 0, 0), animatePropsToCameraOnClick = true, distanceToCamera = 0.6, isOutlined = 1.05, propSound) {
        super(mesh, desiredRotationOnClick, animatePropsToCameraOnClick, distanceToCamera, isOutlined, propSound)

        this.experience = new Experience();
        this.resources = this.experience.resources;
        this.scene = this.experience.scene;

        this.mixer = null;
        this.actions = {};

        this.init();
    }

    init() {
        this.setupAnimations();
    }

    setupAnimations() {
        const animations = this.mesh.animations;

        if (animations && animations.length > 0) {
            this.mixer = new THREE.AnimationMixer(this.mesh);
            animations.forEach(animation => {
                this.actions[animation.name] = this.mixer.clipAction(animation);
            });
        } else {
            console.warn("No animations found on the mesh.");
        }
    }

    onClick() {
        console.log("click top chest");
        this.playAnimation("AnimationName");
    }

    playAnimation(animationName) {
        if (this.actions[animationName]) {
            this.actions[animationName].reset().play();
        } else {
            console.warn(`Animation ${animationName} not found.`);
        }
    }

    update(delta) {
        if (this.mixer) {
            this.mixer.update(delta);
        }
    }

    destroy() {
        super.destroy();
        if (this.mixer) {
            this.mixer.stopAllAction();
        }
    }
}
