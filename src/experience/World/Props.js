import Experience from "../Experience";
import Picture from "./Props/Essential/Picture";


export default class Props {

    constructor() {
        this.experience = new Experience()
        this.resources = this.experience.resources
        this.scene = this.experience.scene

        this.init()
    }

    init() {
        this.picture = new Picture();
    }

    // ce fichier va être supprimé bientôt

}