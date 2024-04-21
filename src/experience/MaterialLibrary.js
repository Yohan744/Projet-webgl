import {
    BackSide,
    DoubleSide,
    FrontSide,
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
    tmpInteractionMaterial;

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

            this.repeatTextures(['diffuse', 'roughness', 'normal', 'specular'], 'ground', 2, 2)

            groundMaterial = new MeshStandardMaterial({
                map: this.resources.items.ground.diffuse,
                roughnessMap: this.resources.items.ground.roughness,
                normalMap: this.resources.items.ground.normal,
                specularMap: this.resources.items.ground.specular,
                side: DoubleSide
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

            this.repeatTextures(['diffuse', 'roughness', 'normal', 'ao'], 'walls', 7, 1)

            wallsMaterial = new MeshStandardMaterial({
                map: this.resources.items.walls.diffuse,
                roughnessMap: this.resources.items.walls.roughness,
                normalMap: this.resources.items.walls.normal,
                aoMap: this.resources.items.walls.ao,
                side: this.debug ? DoubleSide : BackSide
            })

            this.materialsUsed.push(wallsMaterial)
        }

        return wallsMaterial
    }

    getWindowMaterial() {
        if (!windowMaterial) {
            windowMaterial = new MeshStandardMaterial({
                roughnessMap: this.resources.items.window.roughness,
                transparent: true,
                opacity: 0.7,
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
                aoMap: this.resources.items.walls.ao,
                side: this.debug ? DoubleSide : FrontSide
            })

            this.materialsUsed.push(sideWindowMaterial)
        }

        return sideWindowMaterial
    }

    getBeamMaterial() {
        if (!beamMaterial) {
            beamMaterial = new MeshStandardMaterial({
                color: '#683e1a',
                side: DoubleSide
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
                specularMap: this.resources.items.sideMirror.specular,
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
                color: '#a77331',
                side: DoubleSide
            })

            this.materialsUsed.push(cardBoardMaterial)
        }

        return cardBoardMaterial
    }

    getTmpInteractionMaterial() {
        if (!tmpInteractionMaterial) {
            tmpInteractionMaterial = new MeshStandardMaterial({
                color: '#ff0000',
                side: this.debug ? DoubleSide : FrontSide
            })

            this.materialsUsed.push(tmpInteractionMaterial)
        }

        return tmpInteractionMaterial
    }

    destroy() {
        MaterialLibrary.instance = null
        this.materialsUsed.forEach(material => {
            material.dispose()
        })
    }

}