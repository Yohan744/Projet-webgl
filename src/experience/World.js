import * as THREE from 'three'
import Experience from './Experience.js'
import Lights from "./World/Lights";
import Attic from "./World/Attic";
import Background from "./World/Background";
import Locations from "./World/Locations";
import Pointer from "./Utils/Pointer";
import Objects from "./World/Objects";
import MaterialLibrary from "./MaterialLibrary";

export default class World {
    constructor(_options) {
        this.experience = new Experience()
        this.config = this.experience.config
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.time = this.experience.time

        this.resources.on('ready', async (_group) => {
            if (_group.name === 'base' && this.scene) {
                await this.init()
            }
        })
    }

    async init() {
        this.lights = new Lights()
        this.materialLibrary = new MaterialLibrary()
        this.attic = new Attic(this.materialLibrary)
        this.objects = new Objects(this.materialLibrary)
        this.background = new Background()
        this.locations = new Locations().instance
    }

    resize() {

    }

    update() {
        if (this.attic) this.attic.update()
        if (this.objects) this.objects.update()

    }

    destroy() {
        if (this.materialLibrary) this.materialLibrary.destroy()
        if (this.lights) this.lights.destroy()
        if (this.attic) this.attic.destroy()
        if (this.objects) this.objects.destroy()
        if (this.background) this.background.destroy()
        if (this.locations) this.locations.destroy()
    }
}