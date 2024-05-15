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
                    roughness: 'assets/textures/attic/ground/roughness.webp',
                    normal: 'assets/textures/attic/ground/normal.webp',
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

        ]
    },

    {
        name: 'objectsTextures',
        data: {},
        items: [

            {
                name: 'sideMirror',
                type: 'group',
                textures: {
                    diffuse: 'assets/textures/objects/mirror/side/diffuse.webp',
                    roughness: 'assets/textures/objects/mirror/side/roughness.webp',
                    normal: 'assets/textures/objects/mirror/side/normal.webp',
                }
            },

            {
                name: 'mirror',
                type: 'group',
                textures: {
                    roughness: 'assets/textures/objects/mirror/glass/roughness.webp',
                }
            },

            {
                name: 'carpet',
                type: 'group',
                textures: {
                    diffuse: 'assets/textures/objects/carpet/diffuse.webp',
                    roughness: 'assets/textures/objects/carpet/roughness.webp',
                    normal: 'assets/textures/objects/carpet/normal.webp',
                }
            },

            {
                name: 'cardboard',
                type: 'group',
                textures: {
                    diffuse: 'assets/textures/objects/cardboard/diffuse.webp',
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