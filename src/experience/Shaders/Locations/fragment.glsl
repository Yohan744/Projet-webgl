uniform float uTime;
uniform float uRadius;

varying vec2 vUv;

void main() {

    float r = uRadius;
    r += sin(uTime) * 0.5 + 0.5;

    float distanceToCenter = length(vUv - vec2(0.5));
    float alpha = 1.0 - step(r, distanceToCenter);

    gl_FragColor = vec4(vec3(1.0), alpha);
}