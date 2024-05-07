import * as THREE from 'three'
import GUI from 'lil-gui'
import {Pane} from "tweakpane";

import Time from './Utils/Time.js'
import Sizes from './Utils/Sizes.js'
import StatsMonitor from './Utils/StatsMonitor.js'

import Resources from './Resources.js'
import Renderer from './Renderer.js'
import Camera from './Camera.js'
import World from './World.js'

import assets from './assets.js'
import Pointer from "./Utils/Pointer";
import EventEmitter from "./Utils/EventEmitter";
import {useAppStore} from "../stores/appStore";

export default class Experience extends EventEmitter {
    static instance

    constructor(_options = {}) {
        super()

        if (Experience.instance) {
            return Experience.instance
        }
        Experience.instance = this

        this.targetElement = _options.targetElement

        this.setAppStore()
        this.pointer = new Pointer()
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

        this.resources.on('ready', () => {
            this.trigger('ready')
            this.update()
            this.camera.updateLerpCameraAfterFirstFrame()
        })
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
            this.debug = new Pane()
        }
    }

    setStats() {
        if (this.config.debug) {
            this.stats = new StatsMonitor(true)
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

    setAppStore() {
        this.appStore = useAppStore()
    }

    resize() {

        const boundings = this.targetElement.getBoundingClientRect()
        this.config.width = boundings.width
        this.config.height = boundings.height

        this.config.pixelRatio = Math.min(Math.max(window.devicePixelRatio, 1), 2)

        this.config.isMobile = window.matchMedia('(max-width: 992px)').matches

        this.camera?.resize()

        this.renderer?.resize()

        this.world?.resize()
    }

    update() {
        this.stats?.update()

        this.camera?.update()

        this.world?.update()

        this.renderer?.update()

        window.requestAnimationFrame(() => {
            this.update()
        })
    }

    destroy() {

        Experience.instance = null

        this.pointer?.destroy()

        this.stats?.destroy()

        this.renderer?.instance.domElement.remove();
        this.renderer?.destroy()

        this.world?.destroy()

        this.resources?.destroy()

        this.debug?.dispose()

        this.time?.stop()

        window.cancelAnimationFrame(this.update)

    }
}
