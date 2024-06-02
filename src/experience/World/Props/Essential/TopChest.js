import * as THREE from "three";
import Experience from "../../../Experience";
import { useInteractableObjects } from "../../ObjectsInteractable";
import { gsap } from 'gsap';
import SoundManager from "../../../../assets/js/SoundManager";

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
                action.clampWhenFinished = true;
                action.loop = THREE.LoopOnce;
                action.timeScale = 0.28;
                this.actions['animation_0_filtered'] = action;
            }
        }
    }

    animateMorphTarget(initialValue, finalValue, duration) {
        this.soundManager.play("lock");
        if (this.mesh.morphTargetInfluences) {
            gsap.to(this.mesh.morphTargetInfluences, {
                duration: duration,
                endArray: [finalValue],
                onUpdate: () => {
                    this.mesh.morphTargetInfluences[0] = this.mesh.morphTargetInfluences[0];
                },
                onComplete:()=> {
                    this.soundManager.play("chest");
                    this.playAnimation("animation_0_filtered")
                        this.walkman.canComeOut = true;
                        if (!this.walkman.isInFrontOfCamera) {
                            setTimeout(() => {
                                this.walkman.animateToCamera(!this.walkman.isInFrontOfCamera);
                            }, 1000)
                        }
                }
            });
        }
    }

    onClick() {
        this.walkman = this.interactableObjects.walkmanInstance;
        console.log(this.walkman);
        const intersects = this.pointer.raycaster.intersectObjects([this.mesh], true);
        if (intersects.length > 0 && !this.walkman.canComeOut) {
            console.log("click top chest");
            this.animateMorphTarget(0, 1, 2);
        }
    }

    playAnimation(animationName) {
            if (this.animationPlayed) {
                console.log(`Animation ${animationName} has already been played.`);
                return;
            }

            if (this.actions[animationName]) {
                console.log("Playing animation");
                this.actions[animationName].play();
                this.animationPlayed = true;
            } else {
                console.warn(`Animation ${animationName} not found.`);
            }
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
