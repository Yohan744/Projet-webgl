import Experience from "../Experience";
import Cassette from "./Props/Essential/Cassette";
import Walkman from "./Props/Essential/Walkman";
import Projector from "./Props/Essential/Projector";
import Pencil from "./Props/Essential/Pencil";
import Malle from "./Props/Essential/Malle";

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