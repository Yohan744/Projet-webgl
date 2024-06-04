uniform float uOpacity;

void main() {

    vec2 uv = gl_PointCoord.xy * 2.0 - 1.0;
    float dist = length(uv);
    float alpha = (1.0 - smoothstep(0.3, 0.5, dist)) - 0.8;
    gl_FragColor = vec4(vec3(0.25), alpha * uOpacity);

}