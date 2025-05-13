attribute vec3 aPosition;
attribute vec3 aNormal;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

varying vec3 vNormalEye;

void main(void) {
  vec4 positionEye = uModelViewMatrix * vec4(aPosition, 1.0);
  vNormalEye = mat3(uModelViewMatrix) * aNormal;

  gl_Position = uProjectionMatrix * positionEye;
}
