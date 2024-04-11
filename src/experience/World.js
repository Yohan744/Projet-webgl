import * as THREE from 'three'
import Experience from './Experience.js'
import Lights from "./World/Lights";
import Attic from "./World/Attic";

export default class World {
    constructor(_options) {
        this.experience = new Experience()
        this.config = this.experience.config
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.time = this.experience.time

        this.resources.on('ready', (_group) => {
            if (_group.name === 'base') {

                this.lights = new Lights()
                this.attic = new Attic()

            }
        })
    }

    resize() {
    }

    update() {

        if (this.attic) this.attic.update()

    }

    destroy() {
    }
}