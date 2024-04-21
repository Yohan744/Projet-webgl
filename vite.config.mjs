import glsl from 'vite-plugin-glsl';
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue';

export default defineConfig({
    root: '.',
    publicDir: 'public',
    build:
    {
        outDir: 'dist',
        emptyOutDir: true,
        sourcemap: true
    },
    plugins: [
        glsl(),
        vue()
    ]
})