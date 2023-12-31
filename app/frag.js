export const shaderSource = `
#ifdef GL_ES
precision highp float;
#endif

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;

uniform float seed;

varying vec2 v_texcoord;

#define NUM_OCTAVES 5

float rand(vec2 n) { 
    return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

float noise(vec2 p){
    vec2 ip = floor(p);
    vec2 u = fract(p);
    u = u*u*(3.0-2.0*u);
    
    float res = mix(
        mix(rand(ip),rand(ip+vec2(1.0,0.0)),u.x),
        mix(rand(ip+vec2(0.0,1.0)),rand(ip+vec2(1.0,1.0)),u.x),u.y);
    return res*res;
}

float fbm(vec2 x) {
    float v = 0.0;
    float a = 0.5;
    vec2 shift = vec2(100);
    // Rotate to reduce axial bias
    mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.50));
    for (int i = 0; i < NUM_OCTAVES; ++i) {
        v += a * noise(x);
        x = rot * x * 2.0 + shift;
        a *= 0.5;
    }
    return v;
}

mat2 rotation2d(float angle) {
  float s = sin(angle);
  float c = cos(angle);

  return mat2(
    c, -s,
    s, c
  );
}

void main(void)
{
    vec2 uv = v_texcoord;
    
    float mouse_distance = distance(uv, u_mouse/u_resolution);
     
    float grain = mix(-0.01, 0.01, rand(uv * u_time));
    
    vec2 movement = vec2(1., 1.);
    movement *= rotation2d(1.);
    
    float f = fbm(uv + movement);
    
    f *= 50.0;
    f += u_time * 0.2;
    f += grain*3.0;
    f += pow(mouse_distance,0.10);
    f = fract(f);
    float mixer = step(0.8, f) - step(0.9, f);
    
    vec4 black = vec4(0., 0., 0., 0.);
    vec4 pink = vec4(254./255.,93./255.,168./255.,0.5);
    vec4 color = mix(black, pink, mixer);
    
    gl_FragColor = color;
}
`