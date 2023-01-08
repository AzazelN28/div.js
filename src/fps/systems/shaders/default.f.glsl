precision highp float;

varying vec2 v_uv;
varying vec4 v_projected;

uniform sampler2D u_sampler;
uniform vec3 u_color;
uniform vec2 u_flip;
uniform vec2 u_texsize;

float fog(float z, float zn, float zf) {
  return (z - zn) / (zf - zn);
}

void main() {
  vec2 uv = v_uv;
  if (u_flip.x > 0.0) {
    uv.x = 1.0 - v_uv.x;
  }
  if (u_flip.y > 0.0) {
    uv.y = 1.0 - v_uv.y;
  }
  vec4 texture = texture2D(u_sampler, uv * u_texsize);
  // vec4 color = vec4(u_color, 1.0);
  // vec4 final = mix(texture, vec4(0.0, 0.0, 0.0, texture.a), fog(v_projected.z, 1.0, 1000.0)) + color;
  vec4 final = mix(texture, vec4(0.0, 0.0, 0.0, texture.a), fog(v_projected.z, 1.0, 1000.0));
  gl_FragColor = final;
  // gl_FragColor = color;
}
