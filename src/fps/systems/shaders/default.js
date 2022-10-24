export default {
vertex: `
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
  `,
fragment: `
  precision highp float;

  varying vec2 v_uv;
  varying vec4 v_projected;

  uniform sampler2D u_sampler;
  uniform vec3 u_color;
  uniform vec2 u_flip;

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
    vec4 texture = texture2D(u_sampler, uv);
    vec4 color = vec4(u_color, 0.0);
    vec4 final = mix(texture, vec4(0.0, 0.0, 0.0, texture.a), fog(v_projected.z, 1.0, 1000.0)) + color;

    gl_FragColor = final;
  }
  `
}
