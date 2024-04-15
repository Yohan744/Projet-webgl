import * as THREE from "three";
import Experience from "../../Experience";
import dustVertexShader from "./../../Shaders/Dust/vertex.glsl";
import dustFragmentShader from "./../../Shaders/Dust/fragment.glsl";

export default class Dust {

    constructor() {

        this.experience = new Experience()
        this.config = this.experience.config
        this.scene = this.experience.scene

        this.dustNumber = 1300
        this.size = 33

        this.init()

    }

    init() {

        this.dustGeometry = new THREE.BufferGeometry()
        this.positionArray = new Float32Array(this.dustNumber * 3)
        this.scaleArray = new Float32Array(this.dustNumber)

        for (let i = 0; i < this.dustNumber; i++) {
            this.positionArray[i * 3] = (Math.random() - 0.5) * 4
            this.positionArray[i * 3 + 1] = Math.random() * 2 + 0.15
            this.positionArray[i * 3 + 2] = (Math.random() - 0.5) * 5
            this.scaleArray[i] = Math.random() * 0.5

        }

        this.dustGeometry.setAttribute('position', new THREE.BufferAttribute(this.positionArray, 3))
        this.dustGeometry.setAttribute('aScale', new THREE.BufferAttribute(this.scaleArray, 1))


        this.dustMaterial = new THREE.ShaderMaterial({
            uniforms: {
                uTime: {value: 0},
                uPixelRatio: {value: this.config.pixelRatio},
                uSize: {value: this.size}
            },
            vertexShader: dustVertexShader,
            fragmentShader: dustFragmentShader,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        })

        this.dust = new THREE.Points(this.dustGeometry, this.dustMaterial)
        this.dust.position.set(0, 0, -1)
        this.scene.add(this.dust)

    }

    update() {

        if (this.dustMaterial) {
            this.dustMaterial.uniforms.uTime.value = this.experience.time.elapsed * 0.0005
        }

    }

}