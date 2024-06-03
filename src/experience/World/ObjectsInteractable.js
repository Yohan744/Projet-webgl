import Experience from "../Experience";
import { objectsData } from "../../data/Objects";
import Projector from "./Props/Essential/Projector";
import Walkman from "./Props/Essential/Walkman";
import Cassette from "./Props/Essential/Cassette";
import Picture from "./Props/Essential/Picture";
import Drawer from "./Props/Essential/Drawer";
import Letter from "./Props/Essential/Letter";
import Dahlia from "./Props/Essential/Dahlia";
import Envelop from "./Props/Essential/Envelop";
import Pencil from "./Props/Essential/Pencil";
import TopChest from "./Props/Essential/TopChest";
import BottomChest from "./Props/Essential/BottomChest";
import Telephone from "./Props/Telephone";  // Assurez-vous d'importer la classe Telephone

const interactableObjects = {};
const interactableMesh = [];

export default class ObjectsInteractable {

    constructor(materialLibrary) {
        this.experience = new Experience();
        this.resources = this.experience.resources;
        this.scene = this.experience.scene;
        this.materialLibrary = materialLibrary;
        this.gameManager = this.experience.gameManager;

        this.projectorModel = [];
        this.cassetteModels = [];

        if (this.scene) {
            this.init();
        }
    }

    init() {

        this.objectsInteractableModel = this.resources.items.objectsInteractableModel.scene;
        console.log(this.objectsInteractableModel);

        this.objectsInteractableModel.frustumCulled = true;

        this.objectsInteractableModel.traverse(child => {
            if (child.isMesh) {
                const name = child.name.toLowerCase();
                const data = objectsData[name];
                child.material.dispose();

                if (name.includes("walkman")) {
                    child.material = this.materialLibrary.getWalkmanMaterial();
                    //this.walkman = new Walkman(child);
                    interactableObjects.walkmanInstance = this.walkman;

                } else if (name.includes("tirroir")) {
                    child.material = this.materialLibrary.getDrawerMaterial();
                    interactableMesh.push(child);

                } else if (name.includes("cartepostale") || name.includes('cartespostales')) {
                    if (name.includes('biarritz')) {
                        console.log(child.position);
                        child.material = this.materialLibrary.getPostalCardBiarritzMaterial();
                        interactableObjects.cartePostaleBiarritz = child;
                    }
                    if (name.includes('plage')) {
                        console.log(child.position);
                        child.material = this.materialLibrary.getPostalCardBeachMaterial();
                        interactableObjects.cartePostalePlage = child;
                    }
                    if (name.includes('maison')) {
                        console.log(child.position);
                        child.material = this.materialLibrary.getPostalCardHouseMaterial();
                        interactableObjects.cartePostaleMaison = child;
                    }
                    interactableMesh.push(child);

                } else if (name.includes("dahlia")) {
                    child.material = this.materialLibrary.getDahliaMaterial();
                    this.dahlia = new Dahlia(child);
                    interactableObjects.dahlia = this.dahlia;

                } else if (name.includes("magazine")) {
                    child.material = this.getMagazineMaterial(name);
                    interactableMesh.push(child);

                } else if (name.includes("malle")) {
                    child.material = this.getChestMaterial(name);
                    //this.addChest(child, name);

                } else if (name.includes("bobine1") || name.includes("bobine2") || name.includes("bobine3")) {
                    child.material = this.materialLibrary.getBlackMaterial();
                   // this.cassetteModels.push(child);

                } else if (name === 'corps') {
                    child.material = this.materialLibrary.getCassetteMaterial();
                    this.cassetteModels.push(child);

                } else if (name.includes("crayon")) {
                    child.material = this.materialLibrary.getPencilMaterial();
                    this.pencil = new Pencil(child);
                    interactableObjects.pencil = this.pencil;
                    interactableMesh.push(child);

                } else if (name.includes("telephone")) {
                    child.material = this.materialLibrary.getTelephoneMaterial();
                    this.telephone = new Telephone(child, data.rotationOnClick, data.animateToCameraOnClick, data.distanceToCamera, data.outlineScale, data.propSound);
                    interactableObjects.telephone = this.telephone;
                    interactableMesh.push(child);

                } else if (name.includes("rubicub")) {
                    child.material = this.materialLibrary.getRubiksCubeMaterial();
                    this.rubikscube = new data.file(child, data.rotationOnClick, data.animateToCameraOnClick, data.distanceToCamera, data.outlineScale, data.propSound);
                    interactableObjects.rubiksCube = this.rubikscube;
                    interactableMesh.push(child);

                } else if (name.includes("tv")) {
                    child.material = this.materialLibrary.getTvMaterial();
                    this.television = new data.file(child, data.rotationOnClick, data.animateToCameraOnClick, data.distanceToCamera, data.outlineScale, data.propSound);
                    interactableObjects.television = this.television;
                    interactableMesh.push(child);

                } else if (name.includes("enveloppe")) {
                    child.material = this.materialLibrary.getEnveloppeMaterial();
                    // interactableObjects.envelopModel = new Envelop(child);

                } else if (name.includes("lettre")) {
                    child.material = this.materialLibrary.getLetterMaterial();
                    const letter = new Letter(child);
                    interactableObjects.letter = letter;
                    interactableMesh.push(child);

                } else if (name.includes("tableau_magique1")) {
                    child.material = this.materialLibrary.getTelecranMaterial();
                    this.telecran = new data.file(child, data.rotationOnClick, data.animateToCameraOnClick, data.distanceToCamera, data.outlineScale, data.propSound);
                    interactableObjects.telecran = this.telecran;
                    interactableMesh.push(child);

                } else if (name.includes("tourne_disque")) {
                    child.material = this.materialLibrary.getRecordPlayerMaterial();
                    this.recordPlayer = new data.file(child, data.rotationOnClick, data.animateToCameraOnClick, data.distanceToCamera, data.outlineScale, data.propSound);
                    interactableObjects.recordPLayer = this.recordPlayer;
                    interactableMesh.push(child);

                } else if (name.includes("rail_diapo") || name.includes("tireuse") || name.includes("boutonon") || name.includes("cube") || name.includes("oeil") || name === 'boite001' || name === 'porte') {
                    this.setProjectorMaterial(child, name);
                    this.projectorModel.push(child);
                    interactableMesh.push(child);

                } else if (name === 'vynyle' || name === 'vynyle1') {
                    this.setVinylMaterial(child, name);

                } else if (name === 'photo') {
                    child.material = this.materialLibrary.getPictureMaterial();
                    // this.picture = new Picture(child)
                    // interactableObjects.picture = this.picture

                } else {
                    console.log(name);
                }

                child.material.needsUpdate = true;

            }
        });

        this.projector = new Projector(this.projectorModel);
        this.cassette = new Cassette(this.cassetteModels);
        interactableObjects.cassette = this.cassette;

        this.scene.add(this.objectsInteractableModel);

        // Place additional objects relative to the telephone
        this.placeObjectsNearTelephone();
    }

    placeObjectsNearTelephone() {
        if (interactableObjects.telephone) {
            const telephonePosition = interactableObjects.telephone.mesh.position;
            if (interactableObjects.letter) {
                interactableObjects.letter.mesh.position.set(telephonePosition.x - 0.3, telephonePosition.y - 0.2, telephonePosition.z - 0.9);
                interactableObjects.letter.mesh.rotation.set(0, 2, 0);
            }
            if (interactableObjects.cartePostaleBiarritz) {
                interactableObjects.cartePostaleBiarritz.position.set(telephonePosition.x - 0.25, telephonePosition.y - 0.2, telephonePosition.z - 0.5);
                interactableObjects.cartePostaleBiarritz.rotation.set(0, 2.5, 0);
            }
            if (interactableObjects.cartePostalePlage) {
                interactableObjects.cartePostalePlage.position.set(telephonePosition.x - 0.25, telephonePosition.y - 0.2, telephonePosition.z - 0.3);
                interactableObjects.cartePostalePlage.rotation.set(3.2, 0, 0);
            }
            if (interactableObjects.cartePostaleMaison) {
                interactableObjects.cartePostaleMaison.position.set(telephonePosition.x - 0.25, telephonePosition.y - 0.2, telephonePosition.z - 0.1);
                interactableObjects.cartePostaleMaison.rotation.set(0, -2.5, 0);
            }
        }
    }

    getPostalCardMaterial(name) {
        if (name.includes('biarritz')) return this.materialLibrary.getPostalCardBiarritzMaterial();
        if (name.includes('plage')) return this.materialLibrary.getPostalCardBeachMaterial();
        if (name.includes('maison')) return this.materialLibrary.getPostalCardHouseMaterial();
    }

    getMagazineMaterial(name) {
        if (name.includes('ouvert')) return this.materialLibrary.getOpenMagazineMaterial();
        if (name.includes('fermé')) return this.materialLibrary.getClosedMagazineMaterial();
    }

    getChestMaterial(name) {
        if (name.includes('haut')) return this.materialLibrary.getTopChestMaterial();
        if (name.includes('bas')) return this.materialLibrary.getBottomChestMaterial();
    }

    addChest(child, name) {
        if (name.includes('haut')) {
            this.topChest = new TopChest(child);
            interactableObjects.topChest = this.topChest;
            interactableMesh.push(child);
        }
        if (name.includes('bas')) {
            this.bottomChest = new BottomChest(child);
            interactableObjects.bottomChest = this.bottomChest;
            interactableMesh.push(child);
        }
    }

    setProjectorMaterial(child, name) {
        if (name.includes("oeil")) child.material = this.materialLibrary.getProjectorOeilMaterial();
        if (name.includes("boite001")) child.material = this.materialLibrary.getProjectorBoxMaterial();
        if (name.includes("tireuse")) child.material = this.materialLibrary.getProjectorTireuseMaterial();
        if (name.includes("boutonon")) child.material = this.materialLibrary.getProjectorButtonMaterial();
        if (name.includes("cube")) child.material = this.materialLibrary.getProjectorCubeMaterial();
        if (name === 'porte') child.material = this.materialLibrary.getProjectorDoorMaterial();
        if (name.includes("rail_diapo")) child.material = this.materialLibrary.getProjectorRailMaterial();
    }

    setVinylMaterial(child, name) {
        if (name === 'vynyle') child.material = this.materialLibrary.getVinylMaterial();
        if (name === 'vynyle1') child.material = this.materialLibrary.getVinylUpMaterial();
    }

    update() {
        if (this.topChest) this.topChest.update();
    }

    destroy() {
        if (this.objectsInteractableModel) {
            this.objectsInteractableModel.traverse(child => {
                if (child.isMesh) {
                    child.geometry.dispose();
                    child.material.dispose();
                }
            });
            this.scene.remove(this.objectsInteractableModel);
        }
        Object.keys(interactableObjects).forEach(key => {
            interactableObjects[key].destroy();
        });
    }

}

export const useInteractableObjects = () => interactableObjects;
export const getInteractablesMesh = () => interactableMesh;
