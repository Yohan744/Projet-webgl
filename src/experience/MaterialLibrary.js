import {
    AdditiveBlending,
    BackSide, Color,
    DoubleSide,
    FrontSide, MeshBasicMaterial,
    MeshStandardMaterial, RepeatWrapping, ShaderMaterial,
} from "three";
import Experience from "./Experience";
import locationsVertexShader from './Shaders/Locations/vertex.glsl'
import locationsFragmentShader from './Shaders/Locations/fragment.glsl'

let groundMaterial,
    windowWallMaterial,
    wallsMaterial,
    roofMaterial,
    windowMaterial,
    sideWindowMaterial,
    beamMaterial;

let mirrorMaterial,
    sheetCardBoardMaterial,
    cardBoardMaterial,
    firstCarpetMaterial,
    secondCarpetMaterial,
    sheetMaterial,
    libraryMaterial,
    deskMaterial,
    storageMaterial,
    littleStorageMaterial,
    pillowMaterial,
    secondPillowMaterial,
    coatRackMaterial,
    bulbMaterial,
    ladderMaterial,
    rockingChairMaterial,
    tableMaterial,
    lampMaterial,
    chairMaterial,
    sheetChairMaterial,
    secondSheetChairMaterial,
    rightPaintingMaterial,
    rightBigPaintingMaterial,
    leftPaintingMaterial,
    stickMaterial,
    cubeGroundMaterial,
    cubeTableMaterial,
    vaseMaterial,
    groundBooksMaterial,
    stackBooksMaterial,
    rowBooksLibraryMaterial,
    rowBooksDeskMaterial,
    frontSuitCaseMaterial,
    backSuitCaseMaterial,
    vinylRowMaterial,
    magazineMaterial,
    tableMagazineMaterial,
    firstBoxMaterial,
    secondBoxMaterial,
    thirdBoxMaterial,
    chestDrawerMaterial;

let recordPlayerMaterial,
    rubiksCubeMaterial,
    telecranMaterial,
    televisionMaterial,
    telephoneMaterial,
    drawerMaterial,
    cassetteMaterial,
    enveloppeMaterial,
    dahliaMaterial,
    postalCardMaterial,
    closedMagazineMaterial,
    openMagazineMaterial,
    letterMaterial,
    walkmanMaterial,
    bottomChestMaterial,
    topChestMaterial,
    pencilMaterial;


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

    getWindowMaterial() {
        if (!windowMaterial) {

            windowMaterial = new MeshStandardMaterial({
                color: new Color('#ffde77'),
                emissive: new Color('#ffde77'),
                emissiveIntensity: 0.5,
                transparent: true,
                opacity: 0.9,
                blending: AdditiveBlending,
                side: this.debug ? DoubleSide : FrontSide,
            })

            this.materialsUsed.push(windowMaterial)
        }

        return windowMaterial
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

    getSheetCardBoardMaterial() {
        if (!sheetCardBoardMaterial) {
            sheetCardBoardMaterial = new MeshBasicMaterial({
                map: this.resources.items.cardboard.diffuse2,
                side: this.debug ? DoubleSide : FrontSide
            })

            this.materialsUsed.push(sheetCardBoardMaterial)
        }

        return sheetCardBoardMaterial
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

    getSecondPillowMaterial() {
        if (!secondPillowMaterial) {
            secondPillowMaterial = new MeshBasicMaterial({
                map: this.resources.items.pillow.diffuse2,
                side: this.debug ? DoubleSide : FrontSide
            })

            this.materialsUsed.push(secondPillowMaterial)
        }

        return secondPillowMaterial
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

    getSecondSheetChairMaterial() {
        if (!secondSheetChairMaterial) {
            secondSheetChairMaterial = new MeshBasicMaterial({
                map: this.resources.items.sheetChair.diffuse2,
                side: this.debug ? DoubleSide : FrontSide
            })

            this.materialsUsed.push(secondSheetChairMaterial)
        }

        return secondSheetChairMaterial
    }

    getRightPaintingMaterial() {
        if (!rightPaintingMaterial) {
            rightPaintingMaterial = new MeshBasicMaterial({
                map: this.resources.items.painting.diffuse,
                side: this.debug ? DoubleSide : FrontSide
            })

            this.materialsUsed.push(rightPaintingMaterial)
        }

        return rightPaintingMaterial
    }

    getRightBigPaintingMaterial() {
        if (!rightBigPaintingMaterial) {
            rightBigPaintingMaterial = new MeshBasicMaterial({
                map: this.resources.items.painting.diffuse2,
                side: this.debug ? DoubleSide : FrontSide
            })

            this.materialsUsed.push(rightBigPaintingMaterial)
        }

        return rightBigPaintingMaterial
    }

    getLeftPaintingMaterial() {
        if (!leftPaintingMaterial) {
            leftPaintingMaterial = new MeshBasicMaterial({
                map: this.resources.items.painting.diffuse3,
                side: this.debug ? DoubleSide : FrontSide
            })

            this.materialsUsed.push(leftPaintingMaterial)
        }

        return leftPaintingMaterial
    }

    getStickMaterial() {
        if (!stickMaterial) {
            stickMaterial = new MeshBasicMaterial({
                map: this.resources.items.stick.diffuse,
                side: this.debug ? DoubleSide : FrontSide
            })

            this.materialsUsed.push(stickMaterial)
        }

        return stickMaterial
    }

    getCubeGroundMaterial() {
        if (!cubeGroundMaterial) {
            cubeGroundMaterial = new MeshBasicMaterial({
                map: this.resources.items.cube.diffuse,
                side: this.debug ? DoubleSide : FrontSide
            })

            this.materialsUsed.push(cubeGroundMaterial)
        }

        return cubeGroundMaterial
    }

    getCubeTableMaterial() {
        if (!cubeTableMaterial) {
            cubeTableMaterial = new MeshBasicMaterial({
                map: this.resources.items.cube.diffuse2,
                side: this.debug ? DoubleSide : DoubleSide
            })

            this.materialsUsed.push(cubeTableMaterial)
        }

        return cubeTableMaterial
    }

    getVaseMaterial() {
        if (!vaseMaterial) {
            vaseMaterial = new MeshBasicMaterial({
                map: this.resources.items.vase.diffuse,
                side: this.debug ? DoubleSide : FrontSide
            })

            this.materialsUsed.push(vaseMaterial)
        }

        return vaseMaterial
    }

    getGroundBooksMaterial() {
        if (!groundBooksMaterial) {
            groundBooksMaterial = new MeshBasicMaterial({
                map: this.resources.items.books.groundDiffuse,
                side: this.debug ? DoubleSide : FrontSide
            })

            this.materialsUsed.push(groundBooksMaterial)
        }

        return groundBooksMaterial
    }

    getStackBooksMaterial() {
        if (!stackBooksMaterial) {
            stackBooksMaterial = new MeshBasicMaterial({
                map: this.resources.items.books.stackDiffuse,
                side: this.debug ? DoubleSide : FrontSide
            })

            this.materialsUsed.push(stackBooksMaterial)
        }

        return stackBooksMaterial
    }

    getRowBooksLibraryMaterial() {
        if (!rowBooksLibraryMaterial) {
            rowBooksLibraryMaterial = new MeshBasicMaterial({
                map: this.resources.items.books.rowLibraryDiffuse,
                side: this.debug ? DoubleSide : FrontSide
            })

            this.materialsUsed.push(rowBooksLibraryMaterial)
        }

        return rowBooksLibraryMaterial
    }

    getRowBooksDeskMaterial() {
        if (!rowBooksDeskMaterial) {
            rowBooksDeskMaterial = new MeshBasicMaterial({
                map: this.resources.items.books.rowDeskDiffuse,
                side: this.debug ? DoubleSide : FrontSide
            })

            this.materialsUsed.push(rowBooksDeskMaterial)
        }

        return rowBooksDeskMaterial
    }

    getFrontSuitCaseMaterial() {
        if (!frontSuitCaseMaterial) {
            frontSuitCaseMaterial = new MeshBasicMaterial({
                map: this.resources.items.suitcase.diffuse,
                side: this.debug ? DoubleSide : FrontSide
            })

            this.materialsUsed.push(frontSuitCaseMaterial)
        }

        return frontSuitCaseMaterial
    }

    getBackSuitCaseMaterial() {
        if (!backSuitCaseMaterial) {
            backSuitCaseMaterial = new MeshBasicMaterial({
                map: this.resources.items.suitcase.diffuse2,
                side: this.debug ? DoubleSide : FrontSide
            })

            this.materialsUsed.push(backSuitCaseMaterial)
        }

        return backSuitCaseMaterial
    }

    getVinylRowMaterial() {
        if (!vinylRowMaterial) {
            vinylRowMaterial = new MeshBasicMaterial({
                map: this.resources.items.vinylRow.diffuse,
                side: this.debug ? DoubleSide : FrontSide
            })

            this.materialsUsed.push(vinylRowMaterial)
        }

        return vinylRowMaterial
    }

    getMagazineMaterial() {
        if (!magazineMaterial) {
            magazineMaterial = new MeshBasicMaterial({
                map: this.resources.items.magazine.diffuse,
                side: this.debug ? DoubleSide : FrontSide
            })

            this.materialsUsed.push(magazineMaterial)
        }

        return magazineMaterial
    }

    getTableMagazineMaterial() {
        if (!tableMagazineMaterial) {
            tableMagazineMaterial = new MeshBasicMaterial({
                map: this.resources.items.magazine.diffuse2,
                side: this.debug ? DoubleSide : FrontSide
            })

            this.materialsUsed.push(tableMagazineMaterial)
        }

        return tableMagazineMaterial
    }

    getFirstBoxMaterial() {
        if (!firstBoxMaterial) {
            firstBoxMaterial = new MeshBasicMaterial({
                map: this.resources.items.box.diffuse,
                side: this.debug ? DoubleSide : FrontSide
            })

            this.materialsUsed.push(firstBoxMaterial)
        }

        return firstBoxMaterial
    }

    getSecondBoxMaterial() {
        if (!secondBoxMaterial) {
            secondBoxMaterial = new MeshBasicMaterial({
                map: this.resources.items.box.diffuse2,
                side: this.debug ? DoubleSide : FrontSide
            })

            this.materialsUsed.push(secondBoxMaterial)
        }

        return secondBoxMaterial
    }

    getThirdBoxMaterial() {
        if (!thirdBoxMaterial) {
            thirdBoxMaterial = new MeshBasicMaterial({
                map: this.resources.items.box.diffuse3,
                side: this.debug ? DoubleSide : FrontSide
            })

            this.materialsUsed.push(thirdBoxMaterial)
        }

        return thirdBoxMaterial
    }

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

    //////////////////////// INTERACTIVE OBJECTS MATERIALS ////////////////////////

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

    getTelecranMaterial() {
        if (!telecranMaterial) {
            telecranMaterial = new MeshBasicMaterial({
                map: this.resources.items.telecran.diffuse,
                side: this.debug ? DoubleSide : FrontSide
            })

            this.materialsUsed.push(telecranMaterial)
        }

        return telecranMaterial
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

    getTelephoneMaterial() {
        if (!telephoneMaterial) {
            telephoneMaterial = new MeshBasicMaterial({
                map: this.resources.items.telephone.diffuse,
                side: this.debug ? DoubleSide : FrontSide
            })

            this.materialsUsed.push(telephoneMaterial)
        }

        return telephoneMaterial
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

    getCassetteMaterial() {
        if (!cassetteMaterial) {
            cassetteMaterial = new MeshBasicMaterial({
                map: this.resources.items.cassette.diffuse,
                side: this.debug ? DoubleSide : FrontSide
            })

            this.materialsUsed.push(cassetteMaterial)
        }

        return cassetteMaterial
    }

    getEnveloppeMaterial() {
        if (!enveloppeMaterial) {
            enveloppeMaterial = new MeshBasicMaterial({
                map: this.resources.items.enveloppe.diffuse,
                side: this.debug ? DoubleSide : FrontSide
            })

            this.materialsUsed.push(enveloppeMaterial)
        }

        return enveloppeMaterial
    }

    getDahliaMaterial() {
        if (!dahliaMaterial) {
            dahliaMaterial = new MeshBasicMaterial({
                map: this.resources.items.dahlia.diffuse,
                side: this.debug ? DoubleSide : FrontSide
            })

            this.materialsUsed.push(dahliaMaterial)
        }

        return dahliaMaterial
    }

    getPostalCardMaterial() {
        if (!postalCardMaterial) {
            postalCardMaterial = new MeshBasicMaterial({
                map: this.resources.items.postalCard.diffuse,
                side: this.debug ? DoubleSide : FrontSide
            })

            this.materialsUsed.push(postalCardMaterial)
        }

        return postalCardMaterial
    }

    getOpenMagazineMaterial() {
        if (!openMagazineMaterial) {
            openMagazineMaterial = new MeshBasicMaterial({
                map: this.resources.items.magazine.diffuse,
                side: this.debug ? DoubleSide : FrontSide
            })

            this.materialsUsed.push(openMagazineMaterial)
        }

        return openMagazineMaterial
    }

    getClosedMagazineMaterial() {
        if (!closedMagazineMaterial) {
            closedMagazineMaterial = new MeshBasicMaterial({
                map: this.resources.items.magazine.diffuse2,
                side: this.debug ? DoubleSide : FrontSide
            })

            this.materialsUsed.push(closedMagazineMaterial)
        }

        return closedMagazineMaterial
    }

    getLetterMaterial() {
        if (!letterMaterial) {
            letterMaterial = new MeshBasicMaterial({
                map: this.resources.items.letter.diffuse,
                side: this.debug ? DoubleSide : FrontSide
            })

            this.materialsUsed.push(letterMaterial)
        }

        return letterMaterial
    }

    getWalkmanMaterial() {
        if (!walkmanMaterial) {
            walkmanMaterial = new MeshBasicMaterial({
                map: this.resources.items.walkman.diffuse,
                side: this.debug ? DoubleSide : FrontSide
            })

            this.materialsUsed.push(walkmanMaterial)
        }

        return walkmanMaterial
    }

    getBottomChestMaterial() {
        if (!bottomChestMaterial) {
            bottomChestMaterial = new MeshBasicMaterial({
                map: this.resources.items.chest.diffuse,
                side: this.debug ? DoubleSide : FrontSide
            })

            this.materialsUsed.push(bottomChestMaterial)
        }

        return bottomChestMaterial
    }

    getTopChestMaterial() {
        if (!topChestMaterial) {
            topChestMaterial = new MeshBasicMaterial({
                map: this.resources.items.chest.diffuse2,
                side: this.debug ? DoubleSide : FrontSide
            })

            this.materialsUsed.push(topChestMaterial)
        }

        return topChestMaterial
    }

    getPencilMaterial() {
        if (!pencilMaterial) {
            pencilMaterial = new MeshBasicMaterial({
                map: this.resources.items.pencil.diffuse,
                side: this.debug ? DoubleSide : FrontSide
            })

            this.materialsUsed.push(pencilMaterial)
        }

        return pencilMaterial
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
            locationsMaterial = new ShaderMaterial({
                vertexShader: locationsVertexShader,
                fragmentShader: locationsFragmentShader,
                uniforms: {
                    uTime: {value: 0},
                    uRadius: {value: 0.5},
                },
                side: FrontSide,
                transparent: true,
                opacity: 0.65,
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