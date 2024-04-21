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

        this.debug = this.experience.debug

        if (this.debug) {
            this.debugFolder = this.debug.addFolder("GodRay")
        }

        this.setGodRay()

    }

    setGodRay() {

        this.godRayMaterial = new THREE.ShaderMaterial({
            vertexShader: godRayVertexShader,
            fragmentShader: godRayFragmentShader,
            uniforms: {
                c: { value: 0.44 },
                p: { value: 0.5 },
                uGlowColor: { value: new THREE.Color('#fff4cc') },
                viewVector: { value: this.experience.camera.instance.position },
                op: { value: 0.22 },
            },
            side: THREE.FrontSide,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        })

        if (this.debugFolder) {

            this.debugFolder.add(this.godRayMaterial.uniforms.c, "value").name("c").min(-1).max(1).step(0.01)
            this.debugFolder.add(this.godRayMaterial.uniforms.p, "value").name("p").min(-1).max(6).step(0.01)
            this.debugFolder.addColor(this.godRayMaterial.uniforms.uGlowColor, "value").name("glowColor")
            this.debugFolder.add(this.godRayMaterial.uniforms.op, "value").name("op").min(-1).max(1).step(0.01)

        }

        this.godRay.material = this.godRayMaterial

        this.scene.add(this.godRay)
    }

    destroy() {
        this.godRayMaterial.dispose()
        this.scene.remove(this.godRay)
    }

}