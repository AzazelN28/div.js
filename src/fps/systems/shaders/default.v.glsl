precision highp float;

attribute vec3 a_coords;
attribute vec2 a_uv;

uniform mat4 u_modelViewProjection;

varying vec2 v_uv;
varying vec4 v_projected;

void main() {
  gl_Position = u_modelViewProjection * vec4(a_coords, 1.0);

  // pasamos las varying
  v_uv = a_uv;
  v_projected = gl_Position;
}
