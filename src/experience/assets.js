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
                    roughness: 'assets/textures/attic/windowWall/roughness.webp',
                    normal: 'assets/textures/attic/windowWall/normal.webp',
                }
            },

            {
                name: 'walls',
                type: 'group',
                textures: {
                    diffuse: 'assets/textures/attic/walls/diffuse.webp',
                    roughness: 'assets/textures/attic/walls/roughness.webp',
                    normal: 'assets/textures/attic/walls/normal.webp',
                }
            },

            {
                name: 'beam',
                type: 'group',
                textures: {
                    diffuse: 'assets/textures/attic/beam/diffuse.webp',
                    roughness: 'assets/textures/attic/beam/roughness.webp',
                    normal: 'assets/textures/attic/beam/normal.webp',
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
                name: 'drawer',
                type: 'group',
                textures: {
                    diffuse: 'assets/textures/objects/drawer/diffuse.webp',
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
                name: 'rubiksCube',
                type: 'group',
                textures: {
                    diffuse: 'assets/textures/objects/rubiksCube/diffuse.webp',
                }
            },

            {
                name: 'television',
                type: 'group',
                textures: {
                    diffuse: 'assets/textures/objects/television/diffuse.webp',
                }
            },

            {
                name: 'recordPlayer',
                type: 'group',
                textures: {
                    diffuse: 'assets/textures/objects/recordPlayer/diffuse.webp',
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
                }
            },

            {
                name: 'pillow',
                type: 'group',
                textures: {
                    diffuse: 'assets/textures/objects/pillow/diffuse.webp',
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
                name: 'painting',
                type: 'group',
                textures: {
                    diffuse: 'assets/textures/objects/painting/diffuse.webp',
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
                name: 'godRayTexture',
                source: '/assets/textures/attic/godRay/alpha.png',
                type: 'texture',
            },

            {
                name: 'backgroundTreeTexture',
                source: '/assets/textures/attic/background/backgroundTree.webp',
                type: 'texture',
            },

        ]
    },
]