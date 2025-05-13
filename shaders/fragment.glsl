precision mediump float;

uniform int uWireframeMode;
uniform vec3 uColor;

varying vec3 vNormalEye;
varying vec3 vPositionEye;

void main(void) {
  if (uWireframeMode == 1) {
    gl_FragColor = vec4(uColor, 1.0);
  } else {
    vec3 lightDir = normalize(vec3(1.0, 1.0, 1.0));
    vec3 normal = normalize(vNormalEye);
    float diff = max(dot(normal, lightDir), 0.0);
    vec3 color = uColor * diff + 0.1;
    gl_FragColor = vec4(color, 1.0);
  }
}
