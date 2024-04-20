import * as THREE from 'three';
import godRayVertexShader from './../../Shaders/GodRay/vertex.glsl';
import godRayFragmentShader from './../../Shaders/GodRay/fragment.glsl';
import Experience from "../../Experience";

export default class GodRay {

    constructor(mesh) {

        this.experience = new Experience()
        this.godRay = mesh
        this.godRay.matrixAutoUpdate = false
        this.scene = this.experience.scene

        this.setGodRay()

    }

    setGodRay() {

        this.godRayMaterial = new THREE.ShaderMaterial({
            vertexShader: godRayVertexShader,
            fragmentShader: godRayFragmentShader,
            uniforms: {
                uGlowColor: { value: new THREE.Color('#fff4cc') },
                uBlurOffset: { value: 0.93 },
                uAlphaBase: { value: 0.25 },
                uAlphaRays: { value: 0.1 },
                uFrequency: { value: 0.4 },
            },
            side: THREE.BackSide,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        })

        this.godRay.material = this.godRayMaterial

        this.scene.add(this.godRay)
    }

}