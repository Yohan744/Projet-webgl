import Experience from "../Experience";
import Cassette from "./Props/Cassette";
import Walkman from "./Props/Walkman";
import Projector from "./Props/Projector";
import Pencil from "./Props/Pencil";
import Malle from "./Props/Malle";

export default class Props {

    constructor() {
        this.experience = new Experience()
        this.resources = this.experience.resources
        this.scene = this.experience.scene

        this.init()
    }

    init() {
        this.cassette = new Cassette()
        // this.walkman = new Walkman()
        this.projector = new Projector()
        this.pencil = new Pencil()
        this.malle = new Malle()
    }

    update() {
    }

    destroy() {
        // destruction des props
    }

}