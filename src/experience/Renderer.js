import * as THREE from 'three'
import Experience from './Experience.js'
import {EffectComposer} from 'three/examples/jsm/postprocessing/EffectComposer.js'
import {RenderPass} from 'three/examples/jsm/postprocessing/RenderPass.js'

export default class Renderer {
    constructor(_options = {}) {
        this.experience = new Experience()
        this.config = this.experience.config
        this.debug = this.experience.debug
        this.stats = this.experience.stats.instance
        this.time = this.experience.time
        this.sizes = this.experience.sizes
        this.scene = this.experience.scene
        this.camera = this.experience.camera

        // Debug
        if (this.debug) {
            this.debugFolder = this.debug.addFolder({
                title: 'Renderer',
                expanded: true
            })
        }

        this.usePostprocess = false

        this.setInstance()
        //this.setPostProcess()
    }

    setInstance() {
        this.clearColor = '#000000'

        // Renderer
        this.instance = new THREE.WebGLRenderer({
            antialias: true,
            powerPreference: 'high-performance',
        })
        this.instance.domElement.style.position = 'absolute'
        this.instance.domElement.style.top = 0
        this.instance.domElement.style.left = 0
        this.instance.domElement.style.width = '100%'
        this.instance.domElement.style.height = '100%'

        this.instance.setClearColor(this.clearColor, 1)
        this.instance.setSize(this.config.width, this.config.height)
        this.instance.setPixelRatio(this.config.pixelRatio)

        this.instance.physicallyCorrectLights = true
        this.instance.shadowMap.type = THREE.PCFSoftShadowMap
        this.instance.shadowMap.enabled = true
        this.instance.toneMapping = THREE.ACESFilmicToneMapping
        this.instance.toneMappingExposure = 1

        this.context = this.instance.getContext()

        if (this.stats) {
            this.stats.init(this.instance)
        }

        // Debug
        if (this.debug) {

            const toneMappingOptions = {
                NoToneMapping: THREE.NoToneMapping,
                LinearToneMapping: THREE.LinearToneMapping,
                ReinhardToneMapping: THREE.ReinhardToneMapping,
                CineonToneMapping: THREE.CineonToneMapping,
                ACESFilmicToneMapping: THREE.ACESFilmicToneMapping
            };

            const toneMapping = this.debugFolder.addBinding(this.instance, 'toneMapping', {
                view: 'list',
                options: toneMappingOptions,
                label: "Tone mapping"
            });

            toneMapping.on('change', () => {
                this.scene.traverse((_child) => {
                    if (_child instanceof THREE.Mesh)
                        _child.material.needsUpdate = true;
                });
            });

            this.debugFolder.addBinding(this.instance, 'toneMappingExposure', {min: 0, max: 10, step: 0.01, label: "Exposure"})

        }
    }

    setPostProcess() {
        this.postProcess = {}

        /**
         * Render pass
         */
        this.postProcess.renderPass = new RenderPass(this.scene, this.camera.instance)

        /**
         * Effect composer
         */
        this.renderTarget = new THREE.WebGLRenderTarget(
            this.config.width,
            this.config.height,
            {
                generateMipmaps: false,
                minFilter: THREE.LinearFilter,
                magFilter: THREE.LinearFilter,
                format: THREE.RGBFormat,
                samples: 2
            }
        )
        this.postProcess.composer = new EffectComposer(this.instance, this.renderTarget)
        this.postProcess.composer.setSize(this.config.width, this.config.height)
        this.postProcess.composer.setPixelRatio(this.config.pixelRatio)

        this.postProcess.composer.addPass(this.postProcess.renderPass)
    }

    resize() {
        // Instance
        this.instance.setSize(this.config.width, this.config.height)
        this.instance.setPixelRatio(this.config.pixelRatio)

        // Post process
        if (this.usePostprocess) {
            this.postProcess.composer.setSize(this.config.width, this.config.height)
            this.postProcess.composer.setPixelRatio(this.config.pixelRatio)
        }
    }

    update() {

        if (this.usePostprocess) {
            this.postProcess.composer.render()
        } else {
            this.instance.render(this.scene, this.camera.instance)
        }

    }

    destroy() {
        if (this.debug) this.debugFolder.dispose()
        if (this.instance) {
            this.instance.dispose()
            if (this.instance.renderLists) this.instance.renderLists.dispose()
        }
        if (this.renderTarget) this.renderTarget.dispose()
        if (this.postProcess) {
            this.postProcess.renderPass.dispose()
            this.postProcess.composer.dispose()
            this.postProcess.composer.renderTarget1.dispose()
            this.postProcess.composer.renderTarget2.dispose()
        }
    }
}