import Experience from "../Experience";
import Projector from "./Props/Essential/Projector";
import Malle from "./Props/Essential/Malle";
import Photo from "./Props/Essential/Photo";
import Drawer from "./Props/Essential/Drawer";
import Envelop from "./Props/Essential/Envelop";
import Cassette from "./Props/Essential/Cassette";


export default class Props {

    constructor() {
        this.experience = new Experience()
        this.resources = this.experience.resources
        this.scene = this.experience.scene

        this.init()
    }

    init() {
         this.drawer = new Drawer();
         this.envelop = new Envelop();
        // this.cassette = new Cassette();
        //this.projector = new Projector();
        this.photo = new Photo();
    }

    // ce fichier va être supprimé bientôt

}