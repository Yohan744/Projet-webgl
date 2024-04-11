import * as THREE from 'three';
import godRayVertexShader from './../../Shaders/GodRay/vertex.glsl';
import godRayFragmentShader from './../../Shaders/GodRay/fragment.glsl';
import Experience from "../../Experience";

export default class GodRay {

    constructor(mesh) {

        this.experience = new Experience()
        this.godRay = mesh
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
                uAlphaRays: { value: 0.05 },
                uFrequency: { value: 0.95 }
            },
            side: THREE.DoubleSide,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        })

        this.godRay.material = this.godRayMaterial

        this.scene.add(this.godRay)
    }

}