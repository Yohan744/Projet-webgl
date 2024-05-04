import {
    AdditiveBlending,
    BackSide,
    DoubleSide,
    FrontSide, MeshBasicMaterial, MeshLambertMaterial,
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

let sideMirrorMaterial,
    mirrorMaterial,
    cardBoardMaterial,
    carpetMaterial,
    sheetMaterial;

let outlineMaterial;

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

            groundMaterial = new MeshStandardMaterial({
                map: this.resources.items.ground.diffuse,
                roughnessMap: this.resources.items.ground.roughness,
                normalMap: this.resources.items.ground.normal,
                side: this.debug ? DoubleSide : BackSide
            })

            this.materialsUsed.push(groundMaterial)
        }

        return groundMaterial
    }

    getWindowWallMaterial() {
        if (!windowWallMaterial) {

            this.repeatTextures(['diffuse', 'roughness', 'normal'], 'windowWall', 2.5, 2.5)

            windowWallMaterial = new MeshStandardMaterial({
                map: this.resources.items.windowWall.diffuse,
                roughnessMap: this.resources.items.windowWall.roughness,
                normalMap: this.resources.items.windowWall.normal,
                side: this.debug ? DoubleSide : BackSide
            })

            this.materialsUsed.push(windowWallMaterial)
        }

        return windowWallMaterial
    }

    getWallsMaterial() {
        if (!wallsMaterial) {

            this.repeatTextures(['diffuse', 'roughness', 'normal'], 'walls', 7, 1)

            wallsMaterial = new MeshStandardMaterial({
                map: this.resources.items.walls.diffuse,
                roughnessMap: this.resources.items.walls.roughness,
                normalMap: this.resources.items.walls.normal,
                side: this.debug ? DoubleSide : BackSide
            })

            this.materialsUsed.push(wallsMaterial)
        }

        return wallsMaterial
    }

    getRoofMaterial() {
        return wallsMaterial
    }

    getWindowMaterial() {
        if (!windowMaterial) {

            windowMaterial = new MeshStandardMaterial({
                color: '#ffefb0',
                transparent: true,
                blending: AdditiveBlending,
                side: this.debug ? DoubleSide : FrontSide
            })

            this.materialsUsed.push(windowMaterial)
        }

        return windowMaterial
    }

    getSideWindowMaterial() {
        if (!sideWindowMaterial) {
            sideWindowMaterial = new MeshStandardMaterial({
                map: this.resources.items.walls.diffuse,
                roughnessMap: this.resources.items.walls.roughness,
                normalMap: this.resources.items.walls.normal,
                side: this.debug ? DoubleSide : FrontSide
            })

            this.materialsUsed.push(sideWindowMaterial)
        }

        return sideWindowMaterial
    }

    getBeamMaterial() {
        if (!beamMaterial) {

            this.repeatTextures(['diffuse', 'roughness', 'normal'], 'beam', 1, 3)

            beamMaterial = new MeshStandardMaterial({
                map: this.resources.items.beam.diffuse,
                roughnessMap: this.resources.items.beam.roughness,
                normalMap: this.resources.items.beam.normal,
                side: this.debug ? DoubleSide : FrontSide
            })

            this.materialsUsed.push(beamMaterial)
        }

        return beamMaterial
    }

    ///////////////////////////// OBJECTS MATERIALS /////////////////////////////

    getSideMirrorMaterial() {
        if (!sideMirrorMaterial) {
            sideMirrorMaterial = new MeshStandardMaterial({
                map: this.resources.items.sideMirror.diffuse,
                roughnessMap: this.resources.items.sideMirror.roughness,
                normalMap: this.resources.items.sideMirror.normal,
                side: this.debug ? DoubleSide : FrontSide
            })

            this.materialsUsed.push(sideMirrorMaterial)
        }

        return sideMirrorMaterial
    }

    getMirrorMaterial() {
        if (!mirrorMaterial) {
            mirrorMaterial = new MeshStandardMaterial({
                color: '#ffffff',
                metalness: 1,
                roughnessMap: this.resources.items.mirror.roughness,
                side: this.debug ? DoubleSide : FrontSide
            })

            this.materialsUsed.push(mirrorMaterial)
        }

        return mirrorMaterial
    }

    getCardBoardMaterial() {
        if (!cardBoardMaterial) {
            cardBoardMaterial = new MeshStandardMaterial({
                map: this.resources.items.cardboard.diffuse,
                roughnessMap: this.resources.items.cardboard.roughness,
                normalMap: this.resources.items.cardboard.normal,
                aoMap: this.resources.items.cardboard.ao,
                side: this.debug ? DoubleSide : FrontSide
            })

            this.materialsUsed.push(cardBoardMaterial)
        }

        return cardBoardMaterial
    }

    getCarpetMaterial() {
        if (!carpetMaterial) {

            this.repeatTextures(['diffuse', 'roughness', 'normal'], 'carpet', 1.75, 1.75)

            carpetMaterial = new MeshStandardMaterial({
                map: this.resources.items.carpet.diffuse,
                roughnessMap: this.resources.items.carpet.roughness,
                normalMap: this.resources.items.carpet.normal,
                side: this.debug ? DoubleSide : FrontSide
            })

            this.materialsUsed.push(carpetMaterial)
        }

        return carpetMaterial
    }

    getSheetMaterial() {
        if (!sheetMaterial) {
            sheetMaterial = new MeshLambertMaterial({
                color: '#b3b3b3',
                side: this.debug ? DoubleSide : FrontSide
            })

            this.materialsUsed.push(sheetMaterial)
        }

        return sheetMaterial
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

    destroy() {
        this.materialsUsed.forEach(material => {
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
    }


}