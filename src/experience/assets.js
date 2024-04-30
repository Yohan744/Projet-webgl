export default [
    {
        name: 'base',
        data: {},
        items:
            [
                {
                    name: 'atticModel',
                    source: '/assets/models/attic_ray.glb',
                    type: 'model',
                },

                {
                    name: 'objectsModel',
                    source: '/assets/models/objects.glb',
                    type: 'model',
                },

                {
                    name: 'cassetteModel',
                    source: '/assets/models/cassette.glb',
                    type: 'model',
                    textures: {
                        diffuse: 'assets/textures/cassette/Cassette.webp',
                    }
                },
                {
                    name: 'walkmanModel',
                    source: '/assets/models/walkman.glb',
                    type: 'model',
                    textures: {
                        diffuse: 'assets/textures/cassette/Cassette.webp',
                    }
               },
                {
                    name: 'visionneuseModel',
                    source: '/assets/models/visionneuse.glb',
                    type: 'model',
                    textures: {
                        diffuse: 'assets/textures/cassette/Cassette.webp',
                    }
                },

                {
                    name: 'backgroundTreeTexture',
                    source: '/assets/textures/attic/background/backgroundTree.webp',
                    type: 'texture',
                },

                {
                    name: 'particleTexture',
                    source: '/assets/textures/particle.png',
                    type: 'texture',
                },

                {
                    name: 'testTexture',
                    source: '/assets/textures/attic/background/test.png',
                    type: 'texture',
                },

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

                {
                    name: 'window',
                    type: 'group',
                    textures: {
                        diffuse: 'assets/textures/attic/window/diffuse.webp',
                        roughness: 'assets/textures/attic/window/roughness.webp',
                        normal: 'assets/textures/attic/window/normal.webp',
                        alpha: 'assets/textures/attic/window/alpha.webp',
                        ao: 'assets/textures/attic/window/ao.webp',
                    }
                },

                ////////////////////////////////// OBJECTS //////////////////////////////////

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
                        roughness: 'assets/textures/objects/cardboard/roughness.webp',
                        normal: 'assets/textures/objects/cardboard/normal.webp',
                        ao: 'assets/textures/objects/cardboard/ao.webp',
                    }
                },

            ]
    },
]