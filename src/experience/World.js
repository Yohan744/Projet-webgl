import Experience from './Experience.js'
import Lights from "./World/Lights";
import Attic from "./World/Attic";
import Background from "./World/Background";
import Locations from "./World/Locations";
import Objects from "./World/Objects";
import MaterialLibrary from "./MaterialLibrary";
import Props from "./World/Props";
import ObjectsInteractable from "./World/ObjectsInteractable";

export default class World {
    constructor(_options) {
        this.experience = new Experience()
        this.config = this.experience.config
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.time = this.experience.time

        this.resources.on('ready', async (_group) => {
            if (this.scene) {
                await this.init()
            }
        })
    }

    async init() {
        this.lights = new Lights()
        this.materialLibrary = new MaterialLibrary()
        this.attic = new Attic(this.materialLibrary)
        this.objects = new Objects(this.materialLibrary)
        this.objectsInteractable = new ObjectsInteractable(this.materialLibrary)
        this.locations = new Locations(this.materialLibrary)
        this.background = new Background(this.materialLibrary)
        this.props = new Props()
    }

    resize() {

    }

    update() {
        this.attic?.update()
        this.objects?.update()
        this.objectsInteractable?.update()
    }

    destroy() {
        this.materialLibrary?.destroy()
        this.lights?.destroy()
        this.attic?.destroy()
        this.objects?.destroy()
        this.objectsInteractable?.destroy()
        this.background?.destroy()
        this.locations?.destroy()
    }
}