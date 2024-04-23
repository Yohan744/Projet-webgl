import * as THREE from 'three'
import Experience from './Experience.js'
import Lights from "./World/Lights";
import Attic from "./World/Attic";
import Background from "./World/Background";
import Locations from "./World/Locations";
import Pointer from "./Utils/Pointer";

export default class World {
    constructor(_options) {
        this.experience = new Experience()
        this.config = this.experience.config
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.time = this.experience.time

        this.resources.on('ready', (_group) => {
            if (_group.name === 'base' && this.scene) {

                this.lights = new Lights()
                this.attic = new Attic()
                this.background = new Background()
                this.locations = new Locations().instance

            }
        })
    }

    resize() {

    }

    update() {
        if (this.attic) this.attic.update()
    }

    destroy() {
        if (this.lights) this.lights.destroy()
        if (this.attic) this.attic.destroy()
        if (this.background) this.background.destroy()
        if (this.locations) this.locations.destroy()
    }
}