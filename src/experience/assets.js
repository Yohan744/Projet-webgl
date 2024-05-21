export default [

    {
        name: 'models',
        data: {},
        items: [

            {
                name: 'atticModel',
                source: '/assets/models/attic.glb',
                type: 'model',
            },

            {
                name: 'objectsModel',
                source: '/assets/models/objects.glb',
                type: 'model',
            },

            {
                name: 'objectsInteractableModel',
                source: '/assets/models/objectsInteractable.glb',
                type: 'model',
            },

            {
                name: 'malleModel',
                source: '/assets/models/malle-ouverture.glb',
                type: 'model',
            },
            {
                name: 'drawerModel',
                source: '/assets/models/commode.glb',
                type: 'model',
            },
            {
                name: 'envelopModel',
                source: '/assets/models/enveloppe.glb',
                type: 'model',
            },
            {
                name: 'cassetteModel',
                source: '/assets/models/cassette.glb',
                type: 'model',
            },
            {
                name: 'dahliaModel',
                source: '/assets/models/dahlia.glb',
                type: 'model',
            },
            {
                name: 'letterModel',
                source: '/assets/models/lettre.glb',
                type: 'model',
            },

            {
                name: 'photoModel',
                source: '/assets/models/photo.glb',
                type: 'model',
            },

            {
                name: 'projectorModel',
                source: '/assets/models/visionneuse.glb',
                type: 'model',
                textures: {
                    diffuse: 'assets/textures/cassette/Cassette.webp',
                }
            },

        ]
    },

    {
        name: 'atticTextures',
        data: {},
        items: [

            {
                name: 'ground',
                type: 'group',
                textures: {
                    diffuse: 'assets/textures/attic/ground/diffuse.webp',
                }
            },

            {
                name: 'windowWall',
                type: 'group',
                textures: {
                    diffuse: 'assets/textures/attic/windowWall/diffuse.webp',
                }
            },

            {
                name: 'walls',
                type: 'group',
                textures: {
                    diffuse: 'assets/textures/attic/walls/diffuse.webp',
                }
            },

            {
                name: 'beam',
                type: 'group',
                textures: {
                    diffuse: 'assets/textures/attic/beam/diffuse.webp',
                }
            },

            {
                name: 'sideWindow',
                type: 'group',
                textures: {
                    diffuse: 'assets/textures/attic/sideWindow/diffuse.webp',
                }
            },

            {
                name: 'roof',
                type: 'group',
                textures: {
                    diffuse: 'assets/textures/attic/roof/diffuse.webp',
                }
            },

        ]
    },

    {
        name: 'objectsTextures',
        data: {},
        items: [

            {
                name: 'mirror',
                type: 'group',
                textures: {
                    diffuse: 'assets/textures/objects/mirror/diffuse.webp',
                }
            },

            {
                name: 'box',
                type: 'group',
                textures: {
                    diffuse: 'assets/textures/objects/box/diffuse.webp',
                    diffuse2: 'assets/textures/objects/box/diffuse2.webp',
                    diffuse3: 'assets/textures/objects/box/diffuse3.webp',
                }
            },

            {
                name: 'carpet',
                type: 'group',
                textures: {
                    diffuse: 'assets/textures/objects/carpet/diffuse.webp',
                    diffuse2: 'assets/textures/objects/carpet/diffuse2.webp',
                }
            },

            {
                name: 'cardboard',
                type: 'group',
                textures: {
                    diffuse: 'assets/textures/objects/cardboard/diffuse.webp',
                    diffuse2: 'assets/textures/objects/cardboard/diffuse2.webp',
                    ao: 'assets/textures/objects/cardboard/ao.webp',
                }
            },

            {
                name: 'littleStorage',
                type: 'group',
                textures: {
                    diffuse: 'assets/textures/objects/littleStorage/diffuse.webp',
                }
            },

            {
                name: 'chestDrawer',
                type: 'group',
                textures: {
                    diffuse: 'assets/textures/objects/chestDrawer/diffuse.webp',
                }
            },

            {
                name: 'storage',
                type: 'group',
                textures: {
                    diffuse: 'assets/textures/objects/storage/diffuse.webp',
                }
            },

            {
                name: 'desk',
                type: 'group',
                textures: {
                    diffuse: 'assets/textures/objects/desk/diffuse.webp',
                }
            },

            {
                name: 'library',
                type: 'group',
                textures: {
                    diffuse: 'assets/textures/objects/library/diffuse.webp',
                }
            },

            {
                name: 'bulb',
                type: 'group',
                textures: {
                    diffuse: 'assets/textures/objects/bulb/diffuse.webp',
                }
            },

            {
                name: 'ladder',
                type: 'group',
                textures: {
                    diffuse: 'assets/textures/objects/ladder/diffuse.webp',
                }
            },

            {
                name: 'coatRack',
                type: 'group',
                textures: {
                    diffuse: 'assets/textures/objects/coatRack/diffuse.webp',
                }
            },

            {
                name: 'rockingChair',
                type: 'group',
                textures: {
                    diffuse: 'assets/textures/objects/rockingChair/diffuse.webp',
                }
            },

            {
                name: 'table',
                type: 'group',
                textures: {
                    diffuse: 'assets/textures/objects/table/diffuse.webp',
                }
            },

            {
                name: 'lamp',
                type: 'group',
                textures: {
                    diffuse: 'assets/textures/objects/lamp/diffuse.webp',
                }
            },

            {
                name: 'chair',
                type: 'group',
                textures: {
                    diffuse: 'assets/textures/objects/chair/diffuse.webp',
                }
            },

            {
                name: 'sheetChair',
                type: 'group',
                textures: {
                    diffuse: 'assets/textures/objects/sheetChair/diffuse.webp',
                    diffuse2: 'assets/textures/objects/sheetChair/diffuse2.webp',
                }
            },

            {
                name: 'pillow',
                type: 'group',
                textures: {
                    diffuse: 'assets/textures/objects/pillow/diffuse.webp',
                    diffuse2: 'assets/textures/objects/pillow/diffuse2.webp',
                }
            },

            {
                name: 'sheet',
                type: 'group',
                textures: {
                    diffuse: 'assets/textures/objects/sheet/diffuse.webp',
                }
            },

            {
                name: 'stick',
                type: 'group',
                textures: {
                    diffuse: 'assets/textures/objects/stick/diffuse.webp',
                }
            },

            {
                name: 'painting',
                type: 'group',
                textures: {
                    diffuse: 'assets/textures/objects/painting/diffuse.webp',
                    diffuse2: 'assets/textures/objects/painting/diffuse2.webp',
                    diffuse3: 'assets/textures/objects/painting/diffuse3.webp',
                }
            },

            {
                name: 'cube',
                type: 'group',
                textures: {
                    diffuse: 'assets/textures/objects/cube/diffuse.webp',
                    diffuse2: 'assets/textures/objects/cube/diffuse2.webp',
                }
            },

            {
                name: 'vase',
                type: 'group',
                textures: {
                    diffuse: 'assets/textures/objects/vase/diffuse.webp',
                }
            },

            {
                name: 'books',
                type: 'group',
                textures: {
                    groundDiffuse: 'assets/textures/objects/books/diffuse.webp',
                    stackDiffuse: 'assets/textures/objects/books/diffuse2.webp',
                    rowLibraryDiffuse: 'assets/textures/objects/books/diffuse3.webp',
                    rowDeskDiffuse: 'assets/textures/objects/books/diffuse4.webp',
                }
            },

            {
                name: 'suitcase',
                type: 'group',
                textures: {
                    diffuse: 'assets/textures/objects/suitcase/diffuse.webp',
                    diffuse2: 'assets/textures/objects/suitcase/diffuse2.webp',
                }
            },

            {
                name: 'vinylRow',
                type: 'group',
                textures: {
                    diffuse: 'assets/textures/objects/vinylRow/diffuse.webp',
                }
            },

            {
                name: 'magazine',
                type: 'group',
                textures: {
                    diffuse: 'assets/textures/objects/magazine/diffuse.webp',
                    diffuse2: 'assets/textures/objects/magazine/diffuse2.webp',
                }
            },

        ]
    },

    {
        name: 'objectsInteractableTextures',
        data: {},
        items: [

            {
                name: 'drawer',
                type: 'group',
                textures: {
                    diffuse: 'assets/textures/objectsInteractable/drawer/diffuse.webp',
                }
            },

            {
                name: 'rubiksCube',
                type: 'group',
                textures: {
                    diffuse: 'assets/textures/objectsInteractable/rubiksCube/diffuse.webp',
                }
            },

            {
                name: 'television',
                type: 'group',
                textures: {
                    diffuse: 'assets/textures/objectsInteractable/television/diffuse.webp',
                }
            },

            {
                name: 'telecran',
                type: 'group',
                textures: {
                    diffuse: 'assets/textures/objectsInteractable/telecran/diffuse.webp',
                }
            },

            {
                name: 'telephone',
                type: 'group',
                textures: {
                    diffuse: 'assets/textures/objectsInteractable/telephone/diffuse.webp',
                }
            },

            {
                name: 'recordPlayer',
                type: 'group',
                textures: {
                    diffuse: 'assets/textures/objectsInteractable/recordPlayer/diffuse.webp',
                }
            },

            {
                name: 'cassette',
                type: 'group',
                textures: {
                    diffuse: 'assets/textures/objectsInteractable/cassette/diffuse.webp',
                }
            },

            {
                name: 'enveloppe',
                type: 'group',
                textures: {
                    diffuse: 'assets/textures/objectsInteractable/enveloppe/diffuse.webp',
                }
            },

            {
                name: 'postalCard',
                type: 'group',
                textures: {
                    diffuse: 'assets/textures/objectsInteractable/postalCard/diffuse.webp',
                }
            },

            {
                name: 'dahlia',
                type: 'group',
                textures: {
                    diffuse: 'assets/textures/objectsInteractable/dahlia/diffuse.webp',
                }
            },

            {
                name: 'letter',
                type: 'group',
                textures: {
                    diffuse: 'assets/textures/objectsInteractable/letter/diffuse.webp',
                }
            },

            {
                name: 'magazine',
                type: 'group',
                textures: {
                    diffuse: 'assets/textures/objectsInteractable/magazine/diffuse.webp',
                    diffuse2: 'assets/textures/objectsInteractable/magazine/diffuse2.webp',
                }
            },

        ]
    },

    {
        name: 'textures',
        data: {},
        items: [

            {
                name: 'monabouquet',
                source: '/assets/textures/objects/projections/monabouquet.webp',
                type: 'texture',
            },

            {
                name: 'monasurf',
                source: '/assets/textures/objects/projections/monasurf.webp',
                type: 'texture',
            },

            {
                name: 'backgroundTreeTexture',
                source: '/assets/textures/attic/background/backgroundTree.webp',
                type: 'texture',
            },

        ]
    }

]