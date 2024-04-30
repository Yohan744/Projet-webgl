import Experience from "../Experience";
import Cassette from "./Props/Cassette";
import Walkman from "./Props/Walkman";
import Visionneuse from "./Props/Visionneuse";

export default class Props {

    constructor() {
        this.experience = new Experience()
        this.resources = this.experience.resources
        this.scene = this.experience.scene

        this.init()
    }

    init() {
        this.cassette = new Cassette()
        this.walkman = new Walkman()
        this.visionneuse = new Visionneuse()
    }

    update() {
        // update des props
    }

    destroy() {
        // destruction des props
    }

}