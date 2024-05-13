import * as THREE from 'three';
import Experience from "../../Experience";
import godRayVertexShader from './../../Shaders/GodRay/vertex.glsl';
import godRayFragmentShader from './../../Shaders/GodRay/fragment.glsl';
import {DoubleSide, FrontSide, MeshStandardMaterial} from "three";

export default class GodRay {

    constructor(godRays) {

        this.experience = new Experience()
        this.scene = this.experience.scene
        this.config = this.experience.config
        this.debug = this.experience.debug
        this.resources = this.experience.resources
        this.godRaysArray = godRays

        this.init()

        if (this.debug) {
            this.debugFolder = this.debug.addFolder({
                title: 'GodRay',
                expanded: false,
            })
            this.setDebug()
        }

    }

    init() {

        const t = this.resources.items.godRayTexture
        t.flipY = true

        this.godRayMaterial = new THREE.ShaderMaterial({
            vertexShader: godRayVertexShader,
            fragmentShader: godRayFragmentShader,
            uniforms: {
                uColor: {value: new THREE.Color('#ffefb0')},
                uAlphaBase: {value: 0}, // 0.2
                uAlphaRays: {value: 0.41}, // 0.05
                uSeed: {value: Math.random() * 1000},
                uTime: {value: 0},
                uTexture: {value: t}
            },
            blending: THREE.AdditiveBlending,
            transparent: true,
            depthWrite: false,
            depthTest: false,
            side: THREE.FrontSide,
        });

        this.godRaysArray.forEach(godRay => {
            godRay.material.dispose();
            godRay.material = this.godRayMaterial;
            godRay.material.needsUpdate = true;
            this.scene.add(godRay);
        });
    }

    setDebug() {
        this.debugFolder.addBinding(this.godRayMaterial.uniforms.uAlphaBase, 'value', {label: 'uAlphaBase', min: 0, max: 1, step: 0.001})
        this.debugFolder.addBinding(this.godRayMaterial.uniforms.uAlphaRays, 'value', {label: 'uAlphaRays', min: 0, max: 1, step: 0.001})
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