import Experience from "../Experience";

export default class Props {

    constructor() {
        this.experience = new Experience()
        this.resources = this.experience.resources
        this.scene = this.experience.scene

        this.init()
    }

    init() {
        // ajout des props
    }

    update() {
        // update des props
    }

    destroy() {
        // destruction des props
    }

}