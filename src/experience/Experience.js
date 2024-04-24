import * as THREE from 'three'
import GUI from 'lil-gui'

import Time from './Utils/Time.js'
import Sizes from './Utils/Sizes.js'
import Stats from './Utils/Stats.js'

import Resources from './Resources.js'
import Renderer from './Renderer.js'
import Camera from './Camera.js'
import World from './World.js'

import assets from './assets.js'
import Pointer from "./Utils/Pointer";
import EventEmitter from "./Utils/EventEmitter";

export default class Experience extends EventEmitter {
    static instance

    constructor(_options = {}) {
        super()

        if (Experience.instance) {
            return Experience.instance
        }
        Experience.instance = this

        this.targetElement = _options.targetElement
        if (!this.targetElement) {
            console.warn('Missing \'targetElement\' property')
            return
        }

        this.pointer = new Pointer().instance
        this.time = new Time()
        this.sizes = new Sizes()
        this.setConfig()
        this.setDebug()
        this.setStats()
        this.setScene()
        this.setCamera()
        this.setRenderer()
        this.setResources()
        this.setWorld()

        this.sizes.on('resize', () => {
            this.resize()
        })

        this.trigger('ready')
        this.update()
    }

    setConfig() {
        this.config = {}

        // Debug
        this.config.debug = window.location.hash === '#debug'

        this.config.isMobile = window.matchMedia('(max-width: 992px)').matches

        // Pixel ratio
        this.config.pixelRatio = Math.min(Math.max(window.devicePixelRatio, 1), 2)

        // Width and height
        const boundings = this.targetElement.getBoundingClientRect()
        this.config.width = boundings.width
        this.config.height = boundings.height || window.innerHeight
    }

    setDebug() {
        if (this.config.debug) {
            this.debug = new GUI()
        }
    }

    setStats() {
        if (this.config.debug) {
            this.stats = new Stats(true)
        }
    }

    setScene() {
        this.scene = new THREE.Scene()
    }

    setCamera() {
        this.camera = new Camera()
    }

    setRenderer() {
        this.renderer = new Renderer()
        this.targetElement.appendChild(this.renderer.instance.domElement)
    }

    setResources() {
        this.resources = new Resources(assets)
    }

    setWorld() {
        this.world = new World()
    }

    resize() {
        // Config
        const boundings = this.targetElement.getBoundingClientRect()
        this.config.width = boundings.width
        this.config.height = boundings.height

        this.config.pixelRatio = Math.min(Math.max(window.devicePixelRatio, 1), 2)

        if (this.camera)
            this.camera.resize()

        if (this.renderer)
            this.renderer.resize()

        if (this.world)
            this.world.resize()
    }

    update() {
        if (this.stats)
            this.stats.update()

        this.camera.update()

        if (this.world)
            this.world.update()

        if (this.renderer)
            this.renderer.update()

        window.requestAnimationFrame(() => {
            this.update()
        })
    }

    destroy() {

        Experience.instance = null

        if (this.pointer)
            this.pointer.destroy()

        if (this.stats)
            this.stats.destroy()

        if (this.renderer) {
            this.renderer.instance.domElement.remove();
            this.renderer.destroy()
        }

        if (this.world)
            this.world.destroy()

        if (this.debug)
            this.debug.destroy()

        if (this.time)
            this.time.stop()

        window.cancelAnimationFrame(this.update)

    }
}
