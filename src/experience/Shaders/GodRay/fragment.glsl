uniform vec3 uGlowColor;

varying float opacity;
varying float intensity;


void main() {

    vec3 glow = uGlowColor * intensity;
    gl_FragColor = vec4(glow, opacity);
}