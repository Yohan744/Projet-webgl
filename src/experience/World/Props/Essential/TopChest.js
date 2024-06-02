import * as THREE from "three";
import Experience from "../../../Experience";
import { useInteractableObjects } from "../../ObjectsInteractable";
import { gsap } from 'gsap';

export default class TopChest {
    constructor(mesh) {
        this.mesh = mesh;
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.pointer = this.experience.pointer;
        this.camera = this.experience.camera;
        this.soundManager = this.experience.soundManager;

        this.mixer = null;
        this.actions = {};
        this.clock = new THREE.Clock();
        this.animationPlayed = false;

        this.interactableObjects = useInteractableObjects();

        this.init();
    }

    init() {
        this.setupAnimations();
        this.pointer.on('click', this.onClick.bind(this));
    }

    setupAnimations() {
        const animations = this.experience.resources.items.objectsInteractableModel.animations;

        if (animations && animations.length > 0) {
            this.mixer = new THREE.AnimationMixer(this.scene);

            const originalClip = animations.find(clip => clip.name === 'animation_0');
            if (originalClip) {
                const positionTrack = originalClip.tracks[1];
                const quaternionTrack = originalClip.tracks[2];

                const newClip = new THREE.AnimationClip('animation_0_filtered', originalClip.duration, [positionTrack, quaternionTrack]);
                const action = this.mixer.clipAction(newClip);
                action.setLoop(THREE.LoopOnce);
                action.clampWhenFinished = true;
                action.loop = THREE.LoopOnce;
                this.actions['animation_0_filtered'] = action;
            } else {
                console.warn('Animation "animation_0" not found.');
            }

            console.log('Available animations:', animations.map(clip => clip.name));
        } else {
            console.warn("No animations found in the scene.");
        }
    }

    animateMorphTarget(initialValue, finalValue, duration) {
        return new Promise((resolve) => {
            if (this.mesh.morphTargetInfluences) {
                gsap.to(this.mesh.morphTargetInfluences, {
                    duration: duration,
                    endArray: [finalValue],
                    onComplete: resolve
                });
            } else {
                resolve();
            }
        });
    }

    onClick() {
        this.walkman = this.interactableObjects.walkmanInstance;
        console.log(this.walkman);
        const intersects = this.pointer.raycaster.intersectObjects([this.mesh], true);
        if (intersects.length > 0 && !this.walkman.canComeOut) {
            console.log("click top chest");
            this.soundManager.play("chest");
            this.animateMorphTarget(0, 1, 2).then(() => {
                this.playAnimation("animation_0_filtered").then(() => {
                    this.walkman.canComeOut = true;
                    console.log(this.interactableObjects.bottomChest);
                    if(!this.walkman.isInFrontOfCamera) {
                        this.walkman.animateToCamera(!this.walkman.isInFrontOfCamera);
                    }
                });
            });
        }
    }

    playAnimation(animationName) {
        return new Promise((resolve) => {
            if (this.animationPlayed) {
                console.log(`Animation ${animationName} has already been played.`);
                resolve();
                return;
            }

            if (this.actions[animationName]) {
                console.log("Playing animation");
                this.actions[animationName].play();
                this.animationPlayed = true;
                this.actions[animationName].getMixer().addEventListener('finished', resolve);
            } else {
                console.warn(`Animation ${animationName} not found.`);
                resolve();
            }
        });
    }

    update() {
        const delta = this.clock.getDelta();
        if (this.mixer) {
            this.mixer.update(delta);
        }
    }

    destroy() {
        if (this.mixer) {
            this.mixer.stopAllAction();
        }
    }
}
