uniform vec2 blur_size;
uniform float opacity;

void main() {
    vec2 texelSize = vec2(1.0 / 512.0, 1.0 / 512.0);

    vec4 sum = vec4(0.0);
    int kernelSize = 20;
    int halfKernelSize = kernelSize / 2;

    for (int x = -halfKernelSize; x <= halfKernelSize; x++) {
        for (int y = -halfKernelSize; y <= halfKernelSize; y++) {
            vec2 offset = vec2(float(x), float(y)) * blur_size * texelSize;
            sum += vec4(1.0, 1.0, 1.0, 1.0);
        }
    }
    sum /= float(kernelSize * kernelSize);

    gl_FragColor = vec4(sum.rgb, 1.0) * opacity;
}
