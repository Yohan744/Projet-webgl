import * as THREE from 'three'
import { Pane } from "tweakpane";

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
import { useAppStore } from "../stores/appStore";
import { useSoundManager } from "../main";
import { useGameManager } from "../assets/js/GameManager";
import { useGlobalEvents } from "../assets/js/GlobalEvents";

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
        this.setGameManager()
        this.setGlobalEvents()
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
        this.setSoundManager()
        this.setWatchers()

        this.addLODObjects();
    }

    setWatchers() {
        this.sizes.on('resize', () => {
            this.resize()
        })

        this.resources.on('ready', () => {
            this.trigger('ready')
            this.update()
            this.camera.updateLerpCameraAfterFirstFrame()
        })

        this.resources.on('progress', (data) => {
            const progress = data.loaded / data.toLoad
            this.trigger('assetLoading', [progress])
        })
    }

    setConfig() {
        this.config = {}

        // Debug
        this.config.debug = window.location.hash === '#debug'

        this.config.isMobile = window.matchMedia('(max-width: 576px)').matches

        // Pixel ratio
        this.config.pixelRatio = Math.min(Math.max(window.devicePixelRatio, 1), 2)

        // Width and height
        const boundings = this.targetElement.getBoundingClientRect()
        this.config.width = boundings.width
        this.config.height = boundings.height || window.innerHeight
    }

    setDebug() {
        if (this.config.debug) {
            this.debug = new Pane({
                title: 'Debug',
                expanded: true
            })

            this.debugFolder = this.debug.addFolder({
                title: 'Game Debug',
                expanded: true
            })

            const params = {
                id: 0
            }

            const gameIdDebug = this.debugFolder.addBinding(params, 'id', { min: 0, max: 5, step: 1, label: 'Game Step Id' })
            gameIdDebug.on('change', value => {
                this.gameManager.setGameStepId(value.value)
            })

        }
    }

    setStats() {
        if (this.config.debug) {
            this.stats = new StatsMonitor(true)
        }
    }

    setAppStore() {
        this.appStore = useAppStore()
    }

    setGameManager() {
        this.gameManager = useGameManager()
    }

    setGlobalEvents() {
        this.globalEvents = useGlobalEvents()
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

    setSoundManager() {
        this.soundManager = useSoundManager
    }

    addLODObjects() {
        // Create a LOD object
        const lod = new THREE.LOD();

        // High detail model
        const geometryHigh = new THREE.BoxGeometry(1, 1, 1);
        const materialHigh = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        const meshHigh = new THREE.Mesh(geometryHigh, materialHigh);
        lod.addLevel(meshHigh, 0); // Full detail

        // Medium detail model
        const geometryMedium = new THREE.BoxGeometry(0.7, 0.7, 0.7);
        const materialMedium = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const meshMedium = new THREE.Mesh(geometryMedium, materialMedium);
        lod.addLevel(meshMedium, 50); // Medium detail at distance 50

        // Low detail model
        const geometryLow = new THREE.BoxGeometry(0.4, 0.4, 0.4);
        const materialLow = new THREE.MeshBasicMaterial({ color: 0x0000ff });
        const meshLow = new THREE.Mesh(geometryLow, materialLow);
        lod.addLevel(meshLow, 100); // Low detail at distance 100

        // Position LOD object in the scene
        lod.position.set(0, 0, -5);
        lod.frustumCulled = true; // Enable frustum culling for this LOD object
        this.scene.add(lod);
    }

    resize() {
        const boundings = this.targetElement.getBoundingClientRect()
        this.config.width = boundings.width
        this.config.height = boundings.height

        this.config.pixelRatio = Math.min(Math.max(window.devicePixelRatio, 1), 2)

        this.config.isMobile = window.matchMedia('(max-width: 576px)').matches

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
        this.soundManager?.destroy()

        window.cancelAnimationFrame(this.update)
    }
}
