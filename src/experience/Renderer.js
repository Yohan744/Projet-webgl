import * as THREE from 'three'
import Experience from './Experience.js'
import {
    ToneMappingEffect,
    EffectPass,
    EffectComposer,
    BlendFunction,
    RenderPass,
    ToneMappingMode,
    BokehEffect, SelectiveBloomEffect, VignetteEffect, VignetteTechnique
} from "postprocessing";
import gsap from 'gsap'


export default class Renderer {
    constructor() {
        this.experience = new Experience()
        this.config = this.experience.config
        this.debug = this.experience.debug
        this.stats = this.experience.stats
        this.scene = this.experience.scene
        this.camera = this.experience.camera
        this.gameManager = this.experience.gameManager

        this.isBlurEffectEnabled = false

        this.setInstance()
        this.initPostProcessing();

        if (this.debug)  {

            this.debugFolder = this.debug.addFolder({
                title: 'Renderer',
                expanded: false
            })

            this.setDebug()
        }
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
        this.instance.domElement.style.width = '100dvw'
        this.instance.domElement.style.height = '100dvh'

        this.instance.setClearColor(this.clearColor, 1)
        this.instance.setSize(this.config.width, this.config.height)
        this.instance.setPixelRatio(this.config.pixelRatio)

        this.instance.physicallyCorrectLights = true
        this.instance.shadowMap.type = THREE.PCFSoftShadowMap
        this.instance.shadowMap.enabled = false
        this.instance.toneMapping = THREE.NoToneMapping
        this.instance.toneMappingExposure = 1.1
        this.instance.outputColorSpace = THREE.SRGBColorSpace

        if (this.stats && this.stats.instance) {
            this.stats.instance.init(this.instance)
        }
    }

    initPostProcessing() {

        this.composer = new EffectComposer(this.instance);
        this.renderPass = new RenderPass(this.scene, this.camera.instance);
        const gameStepId = this.gameManager.state.gameStepId

        this.toneMappingEffect = new ToneMappingEffect({
            blendFunction: BlendFunction.DARKEN,
            mode: ToneMappingMode.ACES_FILMIC,
            resolution: 256,
            whitePoint: 0,
            middleGrey: 0,
            minLuminance: 0.01,
            averageLuminance: 1.0,
            adaptationRate: 1.0
        });

        this.bloom = new SelectiveBloomEffect(this.scene, this.camera.instance, {
            blendFunction: BlendFunction.SCREEN,
            luminanceThreshold: 0.6,
            luminanceSmoothing: 0.025,
            intensity: gameStepId === 0 ? 0.25 : 1.5,
            radius: 0.6,
            levels: 6,
            mipmapBlur: true,
        });

        this.vignetteEffect = new VignetteEffect({
            blendFunction: BlendFunction.NORMAL,
            technique: VignetteTechnique.DEFAULT,
            offset: 0,
            darkness: 0.75
        })

        this.dofEffect = new BokehEffect({
            focus: gameStepId === 0 ? 0.75 : 0.010,
            aperture: 0, // 0.184
            dof: gameStepId === 0 ? 0.488 : 0.02,
            maxBlur: 0.004,
            width: this.config.width,
            height: this.config.height
        });

        this.globalPass = new EffectPass(this.camera.instance, this.bloom, this.vignetteEffect);
        this.onlyTonePass = new EffectPass(this.camera.instance, this.toneMappingEffect);
        this.toneAndBlurPass = new EffectPass(this.camera.instance, this.toneMappingEffect, this.dofEffect);

        this.composer.addPass(this.renderPass);
        this.composer.addPass(this.globalPass);
        this.composer.addPass(this.isBlurEffectEnabled ? this.toneAndBlurPass : this.onlyTonePass);
    }

    toggleBlurEffect(value) {
        this.isBlurEffectEnabled = value;

        gsap.set(this.dofEffect.uniforms.get('aperture'), {
            value: value ? 0 : 1,
        })

        gsap.to(this.dofEffect.uniforms.get('aperture'), {
            value: value ? 1 : 0,
            delay: value ? 0.35 : 0,
            duration: 2.5,
            ease: 'power1.out',
            onStart: () => {
                if (value) {
                    this.composer.passes.pop();
                    this.composer.addPass(this.toneAndBlurPass);
                }
            },
            onComplete: () => {
                if (!value) {
                    this.composer.passes.pop();
                    this.composer.addPass(this.onlyTonePass);
                }
            }
        })

    }

    setNormalPostProcessValues() {
        gsap.set(this.dofEffect.uniforms.get('focus'), {
            value: 0.010,
        })

        gsap.set(this.dofEffect.uniforms.get('dof'), {
            value: 0.02,
        })

        gsap.to(this.bloom.uniforms.get('intensity'), {
            value: 1.5,
            duration: 2,
            ease: 'power1.out',
        })

    }

    setDebug() {

        const blendFunctionDebug = {
            Skip: BlendFunction.SKIP,
            Set: BlendFunction.SET,
            Add: BlendFunction.ADD,
            Alpha: BlendFunction.ALPHA,
            Average: BlendFunction.AVERAGE,
            Color: BlendFunction.COLOR,
            ColorDodge: BlendFunction.COLOR_DODGE,
            Darken: BlendFunction.DARKEN,
            Hue: BlendFunction.HUE,
            Lighten: BlendFunction.LIGHTEN,
            LinearDodge: BlendFunction.LINEAR_DODGE,
            Luminosity: BlendFunction.LUMINOSITY,
            Multiply: BlendFunction.MULTIPLY,
            Normal: BlendFunction.NORMAL,
            Overlay: BlendFunction.OVERLAY,
            PinLight: BlendFunction.PIN_LIGHT,
            Saturation: BlendFunction.SATURATION,
            Screen: BlendFunction.SCREEN,
            SoftLight: BlendFunction.SOFT_LIGHT,
            Src: BlendFunction.SRC
        }

        const blend = this.debugFolder.addBinding(this.toneMappingEffect.blendMode, '_blendFunction', {
            view: 'list',
            options: blendFunctionDebug,
            label: "Blend function"
        });

        blend.on('change', (e) => {
            this.toneMappingEffect.blendMode.setBlendFunction(e.value)
            // this.dofEffect.blendMode.setBlendFunction(e.value)
        })

        //////////////////

        const ToneMappingModeDebug = {
            Linear: ToneMappingMode.LINEAR,
            Reinhard: ToneMappingMode.REINHARD,
            Reinhard2: ToneMappingMode.REINHARD2,
            Reinhard2Adaptive: ToneMappingMode.REINHARD2_ADAPTIVE,
            Uncharted2: ToneMappingMode.UNCHARTED2,
            OptimizedCineon: ToneMappingMode.OPTIMIZED_CINEON,
            AcesFilmic: ToneMappingMode.ACES_FILMIC,
            Agx: ToneMappingMode.AGX,
            Neutral: ToneMappingMode.NEUTRAL
        }

        this.debugFolder.addBinding(this.toneMappingEffect, 'mode', {
            view: 'list',
            options: ToneMappingModeDebug,
            label: "Tone mapping mode"
        });

        //////////////////

        this.debugFolder.addBinding(this.instance, 'toneMappingExposure', {
            min: 0,
            max: 10,
            step: 0.01,
            label: "Exposure"
        })

        //////////////////

        this.debugFolder.addBinding(this, 'isBlurEffectEnabled', {
            label: "Enable blur effect"
        }).on('change', (e) => {
            this.toggleBlurEffect(e.value)
        })

        /////////////////

        this.debugFolder.addBinding(this.bloom.uniforms.get('intensity'), 'value', {
            min: 0,
            max: 10,
            step: 0.001,
            label: 'Bloom luminance threshold'
        });

        //////////////////

        this.debugFolder.addBinding(this.dofEffect.uniforms.get('focus'), 'value', {
            min: 0,
            max: 1,
            step: 0.001,
            label: 'Blur focus'
        });

        this.debugFolder.addBinding(this.dofEffect.uniforms.get('aperture'), 'value', {
            min: 0,
            max: 1,
            step: 0.001,
            label: 'Aperture'
        });


        this.debugFolder.addBinding(this.dofEffect.uniforms.get('dof'), 'value', {
            min: 0,
            max: 1,
            step: 0.001,
            label: 'DOF'
        });

        //////////////////

        this.debugFolder.addBinding(this.vignetteEffect, 'offset', {
            min: 0,
            max: 1,
            step: 0.01,
            label: 'Vignette offset'
        });

        this.debugFolder.addBinding(this.vignetteEffect, 'darkness', {
            min: 0,
            max: 1,
            step: 0.01,
            label: 'Vignette darkness'
        });

    }


    resize() {
        this.instance.setSize(this.config.width, this.config.height)
        this.instance.setPixelRatio(this.config.pixelRatio)
        this.composer.setSize(this.config.width, this.config.height)
    }

    update() {
        this.composer.render()
    }

    destroy() {
        if (this.instance) {
            this.instance.dispose()
            if (this.instance.renderLists) this.instance.renderLists.dispose()
        }
        this.debugFolder?.dispose()
        this.composer?.dispose()
    }
}