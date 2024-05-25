uniform float uPixelRatio;
uniform float uSize;
attribute float aScale;

void main() {
    vec4 gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
    gl_PointSize = uSize * aScale * uPixelRatio * (1.0 / -viewPosition.z);
}