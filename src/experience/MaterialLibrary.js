import {
    AdditiveBlending,
    BackSide, Color,
    DoubleSide,
    FrontSide, MeshBasicMaterial,
    MeshStandardMaterial, RepeatWrapping,
} from "three";
import Experience from "./Experience";

let groundMaterial,
    windowWallMaterial,
    wallsMaterial,
    roofMaterial,
    windowMaterial,
    sideWindowMaterial,
    beamMaterial;

let mirrorMaterial,
    cardBoardMaterial,
    firstCarpetMaterial,
    secondCarpetMaterial,
    sheetMaterial,
    libraryMaterial,
    deskMaterial,
    storageMaterial,
    littleStorageMaterial,
    pillowMaterial,
    coatRackMaterial,
    bulbMaterial,
    ladderMaterial,
    rockingChairMaterial,
    tableMaterial,
    lampMaterial,
    chairMaterial,
    sheetChairMaterial,
    paintingMaterial;

let recordPlayerMaterial,
    rubiksCubeMaterial,
    televisionMaterial,
    chestDrawerMaterial,
    drawerMaterial;


let outlineMaterial,
    locationsMaterial;

let backgroundTreeMaterial;

export default class MaterialLibrary {

    static instance;

    constructor() {

        if (MaterialLibrary.instance) {
            return MaterialLibrary.instance
        }
        MaterialLibrary.instance = this

        this.experience = new Experience()
        this.resources = this.experience.resources
        this.debug = this.experience.config.debug

        this.materialsUsed = []

    }

    repeatTextures(textures, itemName, repeatX, repeatY) {

        for (let texture of textures) {

            if (!this.resources.items[itemName][texture]) {
                throw new Error(`Texture ${texture} not found in ${itemName} resources - WRONG NAMING`)
            }

            let t = this.resources.items[itemName][texture];
            t.wrapS = RepeatWrapping;
            t.wrapT = RepeatWrapping;
            t.repeat.set(repeatX, repeatY);
        }
    }

    ///////////////////////////// ATTIC MATERIALS /////////////////////////////

    getGroundMaterial() {
        if (!groundMaterial) {

            groundMaterial = new MeshBasicMaterial({
                map: this.resources.items.ground.diffuse,
                side: this.debug ? DoubleSide : FrontSide
            })

            this.materialsUsed.push(groundMaterial)
        }

        return groundMaterial
    }

    getWindowWallMaterial() {
        if (!windowWallMaterial) {

            windowWallMaterial = new MeshBasicMaterial({
                map: this.resources.items.windowWall.diffuse,
                side: this.debug ? DoubleSide : FrontSide
            })

            this.materialsUsed.push(windowWallMaterial)
        }

        return windowWallMaterial
    }

    getWallsMaterial() {
        if (!wallsMaterial) {

            wallsMaterial = new MeshBasicMaterial({
                map: this.resources.items.walls.diffuse,
                side: this.debug ? DoubleSide : FrontSide
            })

            this.materialsUsed.push(wallsMaterial)
        }

        return wallsMaterial
    }

    getRoofMaterial() {
        if (!roofMaterial) {

            roofMaterial = new MeshBasicMaterial({
                map: this.resources.items.roof.diffuse,
                side: this.debug ? DoubleSide : FrontSide
            })

            this.materialsUsed.push(roofMaterial)
        }

        return roofMaterial
    }

    getWindowMaterial() {
        if (!windowMaterial) {

            windowMaterial = new MeshStandardMaterial({
                color: new Color('#ffde77'),
                emissive: new Color('#ffde77'),
                emissiveIntensity: 1,
                transparent: true,
                opacity: 1,
                blending: AdditiveBlending,
                side: this.debug ? DoubleSide : FrontSide,
            })

            this.materialsUsed.push(windowMaterial)
        }

        return windowMaterial
    }

    getSideWindowMaterial() {
        if (!sideWindowMaterial) {
            sideWindowMaterial = new MeshBasicMaterial({
                map: this.resources.items.sideWindow.diffuse,
                side: this.debug ? DoubleSide : FrontSide
            })

            this.materialsUsed.push(sideWindowMaterial)
        }

        return sideWindowMaterial
    }

    getBeamMaterial() {
        if (!beamMaterial) {

            beamMaterial = new MeshBasicMaterial({
                map: this.resources.items.beam.diffuse,
                side: this.debug ? DoubleSide : FrontSide
            })

            this.materialsUsed.push(beamMaterial)
        }

        return beamMaterial
    }

    ///////////////////////////// OBJECTS MATERIALS /////////////////////////////

    getMirrorMaterial() {
        if (!mirrorMaterial) {
            mirrorMaterial = new MeshBasicMaterial({
                map: this.resources.items.mirror.diffuse,
                side: this.debug ? DoubleSide : FrontSide
            })

            this.materialsUsed.push(mirrorMaterial)
        }

        return mirrorMaterial
    }

    getCardBoardMaterial() {
        if (!cardBoardMaterial) {
            cardBoardMaterial = new MeshBasicMaterial({
                map: this.resources.items.cardboard.diffuse,
                // aoMap: this.resources.items.cardboard.ao,
                side: this.debug ? DoubleSide : DoubleSide
            })

            this.materialsUsed.push(cardBoardMaterial)
        }

        return cardBoardMaterial
    }

    getFirstCarpetMaterial() {
        if (!firstCarpetMaterial) {

            firstCarpetMaterial = new MeshBasicMaterial({
                map: this.resources.items.carpet.diffuse,
                side: this.debug ? DoubleSide : FrontSide
            })

            this.materialsUsed.push(firstCarpetMaterial)
        }

        return firstCarpetMaterial
    }

    getSecondCarpetMaterial() {
        if (!secondCarpetMaterial) {

            secondCarpetMaterial = new MeshBasicMaterial({
                map: this.resources.items.carpet.diffuse2,
                side: this.debug ? DoubleSide : FrontSide
            })

            this.materialsUsed.push(secondCarpetMaterial)
        }

        return secondCarpetMaterial
    }

    getSheetMaterial() {
        if (!sheetMaterial) {
            sheetMaterial = new MeshBasicMaterial({
                map: this.resources.items.sheet.diffuse,
                side: this.debug ? DoubleSide : FrontSide
            })

            this.materialsUsed.push(sheetMaterial)
        }

        return sheetMaterial
    }

    getLibraryMaterial() {
        if (!libraryMaterial) {
            libraryMaterial = new MeshBasicMaterial({
                map: this.resources.items.library.diffuse,
                side: this.debug ? DoubleSide : FrontSide
            })

            this.materialsUsed.push(libraryMaterial)
        }

        return libraryMaterial
    }

    getDeskMaterial() {
        if (!deskMaterial) {
            deskMaterial = new MeshBasicMaterial({
                map: this.resources.items.desk.diffuse,
                side: this.debug ? DoubleSide : FrontSide
            })

            this.materialsUsed.push(deskMaterial)
        }

        return deskMaterial
    }

    getStorageMaterial() {
        if (!storageMaterial) {
            storageMaterial = new MeshBasicMaterial({
                map: this.resources.items.storage.diffuse,
                side: this.debug ? DoubleSide : DoubleSide
            })

            this.materialsUsed.push(storageMaterial)
        }

        return storageMaterial
    }

    getLittleStorageMaterial() {
        if (!littleStorageMaterial) {
            littleStorageMaterial = new MeshBasicMaterial({
                map: this.resources.items.littleStorage.diffuse,
                side: this.debug ? DoubleSide : FrontSide
            })

            this.materialsUsed.push(littleStorageMaterial)
        }

        return littleStorageMaterial
    }

    getPillowMaterial() {
        if (!pillowMaterial) {
            pillowMaterial = new MeshBasicMaterial({
                map: this.resources.items.pillow.diffuse,
                side: this.debug ? DoubleSide : FrontSide
            })

            this.materialsUsed.push(pillowMaterial)
        }

        return pillowMaterial
    }

    getCoatRackMaterial() {
        if (!coatRackMaterial) {
            coatRackMaterial = new MeshBasicMaterial({
                map: this.resources.items.coatRack.diffuse,
                side: this.debug ? DoubleSide : FrontSide
            })

            this.materialsUsed.push(coatRackMaterial)
        }

        return coatRackMaterial
    }

    getBulbMaterial() {
        if (!bulbMaterial) {
            bulbMaterial = new MeshBasicMaterial({
                map: this.resources.items.bulb.diffuse,
                side: this.debug ? DoubleSide : FrontSide
            })

            this.materialsUsed.push(bulbMaterial)
        }

        return bulbMaterial
    }

    getLadderMaterial() {
        if (!ladderMaterial) {
            ladderMaterial = new MeshBasicMaterial({
                map: this.resources.items.ladder.diffuse,
                side: this.debug ? DoubleSide : FrontSide
            })

            this.materialsUsed.push(ladderMaterial)
        }

        return ladderMaterial
    }

    getRockingChairMaterial() {
        if (!rockingChairMaterial) {
            rockingChairMaterial = new MeshBasicMaterial({
                map: this.resources.items.rockingChair.diffuse,
                side: this.debug ? DoubleSide : FrontSide
            })

            this.materialsUsed.push(rockingChairMaterial)
        }

        return rockingChairMaterial
    }

    getTableMaterial() {
        if (!tableMaterial) {
            tableMaterial = new MeshBasicMaterial({
                map: this.resources.items.table.diffuse,
                side: this.debug ? DoubleSide : FrontSide
            })

            this.materialsUsed.push(tableMaterial)
        }

        return tableMaterial
    }

    getLampMaterial() {
        if (!lampMaterial) {
            lampMaterial = new MeshBasicMaterial({
                map: this.resources.items.lamp.diffuse,
                side: this.debug ? DoubleSide : FrontSide
            })

            this.materialsUsed.push(lampMaterial)
        }

        return lampMaterial
    }

    getChairMaterial() {
        if (!chairMaterial) {
            chairMaterial = new MeshBasicMaterial({
                map: this.resources.items.chair.diffuse,
                side: this.debug ? DoubleSide : FrontSide
            })

            this.materialsUsed.push(chairMaterial)
        }

        return chairMaterial
    }

    getSheetChairMaterial() {
        if (!sheetChairMaterial) {
            sheetChairMaterial = new MeshBasicMaterial({
                map: this.resources.items.sheetChair.diffuse,
                side: this.debug ? DoubleSide : FrontSide
            })

            this.materialsUsed.push(sheetChairMaterial)
        }

        return sheetChairMaterial
    }

    getPaintingMaterial() {
        if (!paintingMaterial) {
            paintingMaterial = new MeshBasicMaterial({
                map: this.resources.items.painting.diffuse,
                side: this.debug ? DoubleSide : FrontSide
            })

            this.materialsUsed.push(paintingMaterial)
        }

        return paintingMaterial
    }

    //////////////////////// INTERACTIVE OBJECTS MATERIALS ////////////////////////

    getChestDrawerMaterial() {
        if (!chestDrawerMaterial) {
            chestDrawerMaterial = new MeshBasicMaterial({
                map: this.resources.items.chestDrawer.diffuse,
                side: this.debug ? DoubleSide : FrontSide
            })

            this.materialsUsed.push(chestDrawerMaterial)
        }

        return chestDrawerMaterial
    }

    getDrawerMaterial() {
        if (!drawerMaterial) {
            drawerMaterial = new MeshBasicMaterial({
                map: this.resources.items.drawer.diffuse,
                side: this.debug ? DoubleSide : FrontSide
            })

            this.materialsUsed.push(drawerMaterial)
        }

        return drawerMaterial
    }

    getRubiksCubeMaterial() {
        if (!rubiksCubeMaterial) {
            rubiksCubeMaterial = new MeshBasicMaterial({
                map: this.resources.items.rubiksCube.diffuse,
                side: this.debug ? DoubleSide : FrontSide
            })

            this.materialsUsed.push(rubiksCubeMaterial)
        }

        return rubiksCubeMaterial
    }

    getTvMaterial() {
        if (!televisionMaterial) {
            televisionMaterial = new MeshBasicMaterial({
                map: this.resources.items.television.diffuse,
                side: this.debug ? DoubleSide : FrontSide
            })

            this.materialsUsed.push(televisionMaterial)
        }

        return televisionMaterial
    }

    getRecordPlayerMaterial() {
        if (!recordPlayerMaterial) {
            recordPlayerMaterial = new MeshBasicMaterial({
                map: this.resources.items.recordPlayer.diffuse,
                side: this.debug ? DoubleSide : FrontSide
            })

            this.materialsUsed.push(recordPlayerMaterial)
        }

        return recordPlayerMaterial
    }

    ///////////////////////// TEXTURE MATERIALS /////////////////////////////

    getBackgroundTreeMaterial() {
        if (!backgroundTreeMaterial) {
            backgroundTreeMaterial = new MeshBasicMaterial({
                map: this.resources.items.backgroundTreeTexture,
                side: FrontSide
            })

            this.materialsUsed.push(backgroundTreeMaterial)
        }

        return backgroundTreeMaterial
    }


    //////////////////////// EFFECTS MATERIALS ////////////////////////

    getOutlineMaterial() {
        if (!outlineMaterial) {
            outlineMaterial = new MeshBasicMaterial({
                color: 0xffffff,
                side: BackSide,
                transparent: true,
                opacity: 0.5
            })

            this.materialsUsed.push(outlineMaterial)
        }

        return outlineMaterial
    }

    getLocationsMaterial() {
        if (!locationsMaterial) {
            locationsMaterial = new MeshBasicMaterial({
                color: 0xffffff,
                side: FrontSide,
                transparent: true,
                opacity: 0.6,
            })

            this.materialsUsed.push(locationsMaterial)
        }

        return locationsMaterial
    }

    destroy() {
        this.materialsUsed?.forEach(material => {
            material.dispose();

            if (material.map) material.map.dispose();
            if (material.roughnessMap) material.roughnessMap.dispose();
            if (material.normalMap) material.normalMap.dispose();
            if (material.aoMap) material.aoMap.dispose();
        });

        this.materialsUsed = null;

        this.resources = null;
        this.experience = null;
        this.debug = null;

        MaterialLibrary.instance = null
    }


}