import Experience from "../Experience";
import Cassette from "./Props/Cassette";
import Walkman from "./Props/Walkman";
import Projector from "./Props/Projector";
import Pencil from "./Props/Pencil";
import Malle from "./Props/Malle";
import ChestDrawer from "./Props/ChestDrawer";
import Envelop from "./Props/Envelop";
import Dahlia from "./Props/Dahlia";
import Letter from "./Props/Letter";
import Carousel from "./Props/Carousel";

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
        this.projector = new Projector()
        this.pencil = new Pencil()
        this.malle = new Malle()

        this.chestDrawer = new ChestDrawer();
        this.envelop = new Envelop(this.chestDrawer);
        this.dahlia = new Dahlia();
        this.letter = new Letter();

        this.chestDrawer.setDependencies(this.envelop, this.dahlia, this.letter);
        this.envelop.setDependencies(this.dahlia, this.letter, this.chestDrawer, this.carousel, this.cassette);
        this.dahlia.setDependencies(this.envelop, this.chestDrawer);
        this.letter.setDependencies(this.envelop, this.chestDrawer);
    }

    update() {
        // update des props
    }

    destroy() {
        // destruction des props
    }

}