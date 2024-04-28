import * as THREE from 'three';
import Experience from "../../Experience";
import godRayVertexShader from './../../Shaders/GodRay/vertex.glsl';
import godRayFragmentShader from './../../Shaders/GodRay/fragment.glsl';
import {DoubleSide, FrontSide} from "three";

export default class GodRay {

    constructor(godRays) {

        this.experience = new Experience()
        this.scene = this.experience.scene
        this.config = this.experience.config
        this.debug = this.experience.debug
        this.resources = this.experience.resources
        this.godRaysArray = godRays

        if (this.debug) {
            // this.debugFolder = this.debug.addFolder("GodRay")
        }

        this.init()

    }

    init() {

        this.godRayMaterial = new THREE.ShaderMaterial({
            vertexShader: godRayVertexShader,
            fragmentShader: godRayFragmentShader,
            uniforms: {
                uColor: {value: new THREE.Color('#ffefb0')},
                uAlphaBase: {value: 0.075}, // 0.2
                uAlphaRays: {value: 0.035}, // 0.05
                uSeed: {value: Math.random() * 1000},
                uTime: {value: 0},
            },
            blending: THREE.AdditiveBlending,
            transparent: true,
            depthWrite: false,
            side: THREE.FrontSide,
        });

        this.godRaysArray.forEach(godRay => {
            godRay.material.dispose();
            godRay.material = this.godRayMaterial;
            godRay.material.needsUpdate = true;
            this.scene.add(godRay);
        });
    }

    update() {
        if (this.godRayMaterial) {
            this.godRayMaterial.uniforms.uTime.value = this.experience.time.elapsed * 0.0004;
        }
    }

    destroy() {
        this.godRaysArray.forEach(godRay => {
            godRay.geometry.dispose()
            godRay.material.dispose()
            this.scene.remove(godRay)
        })
    }

}

/*
init() {
        this.godRaysArray.forEach(godRay => {
            const godRayMaterial = new THREE.ShaderMaterial({
                vertexShader: godRayVertexShader,
                fragmentShader: godRayFragmentShader,
                uniforms: {
                    uColor: {value: new THREE.Color('#ffefb0')},
                    uAlphaBase: {value: 0.075}, // 0.2
                    uAlphaRays: {value: 0.035}, // 0.05
                    uSeed: {value: Math.random() * 1000},
                    uTime: {value: 0},
                },
                blending: THREE.AdditiveBlending,
                transparent: true,
                depthWrite: false,
                side: THREE.FrontSide,
            });

            godRay.material.dispose();
            godRay.material = godRayMaterial;
            godRay.material.needsUpdate = true;
            this.scene.add(godRay);
        });
    }

    update() {
        this.godRaysArray.forEach(godRay => {
            if (godRay.material) {
                godRay.material.uniforms.uTime.value = this.experience.time.elapsed * 0.0004;
            }
        });
    }

    destroy() {
        this.godRaysArray.forEach(godRay => {
            if (godRay.material) {
                godRay.geometry.dispose()
                godRay.material.dispose()
                godRay.dispose()
                this.scene.remove(godRay)
            }
        })
    }
 */