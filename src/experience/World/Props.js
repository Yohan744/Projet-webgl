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
        this.projector = new Projector()
        this.malle = new Malle()
    }

    // ce fichier va être supprimé bientôt

}