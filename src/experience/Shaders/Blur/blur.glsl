// Pass through texture coordinates
varying vec2 v_tex_coord;

void main() {
    v_tex_coord = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
