'use client'

import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

const LETTERS = ['ا', 'ب', 'ج', 'د', 'ه', 'و', 'ح', 'ط', 'ی', 'ک', 'ل', 'م', 'ن', 'ع', 'ق', 'س']
const ATLAS_COLS = 4
const ATLAS_CELL = 128

const SIM_RESOLUTION = 128
const DYE_RESOLUTION = 512
const PRESSURE_ITERATIONS = 20
const CURL_STRENGTH = 28
const VELOCITY_DISSIPATION = 0.25
const DYE_DISSIPATION = 0.85

const STATE_W = 32
const STATE_H = 20
const PARTICLE_COUNT = STATE_W * STATE_H
const GLYPH_COUNT = 72

const BASE_VERTEX = `#version 300 es
precision highp float;
in vec2 aPosition;
out vec2 vUv;
out vec2 vL;
out vec2 vR;
out vec2 vT;
out vec2 vB;
uniform vec2 texelSize;
void main() {
  vUv = aPosition * 0.5 + 0.5;
  vL = vUv - vec2(texelSize.x, 0.0);
  vR = vUv + vec2(texelSize.x, 0.0);
  vT = vUv + vec2(0.0, texelSize.y);
  vB = vUv - vec2(0.0, texelSize.y);
  gl_Position = vec4(aPosition, 0.0, 1.0);
}`

const FRAG_HEADER = `#version 300 es
precision highp float;
precision highp sampler2D;
in vec2 vUv;
in vec2 vL;
in vec2 vR;
in vec2 vT;
in vec2 vB;
out vec4 fragColor;
`

const CLEAR_SHADER = `${FRAG_HEADER}
uniform sampler2D uTexture;
uniform float value;
void main() { fragColor = value * texture(uTexture, vUv); }`

const SPLAT_SHADER = `${FRAG_HEADER}
uniform sampler2D uTarget;
uniform float aspectRatio;
uniform vec3 color;
uniform vec2 point;
uniform float radius;
void main() {
  vec2 p = vUv - point;
  p.x *= aspectRatio;
  vec3 splat = exp(-dot(p, p) / radius) * color;
  fragColor = vec4(texture(uTarget, vUv).xyz + splat, 1.0);
}`

const ADVECTION_SHADER = `${FRAG_HEADER}
uniform sampler2D uVelocity;
uniform sampler2D uSource;
uniform vec2 velocityTexel;
uniform float dt;
uniform float dissipation;
void main() {
  vec2 coord = vUv - dt * texture(uVelocity, vUv).xy * velocityTexel;
  fragColor = texture(uSource, coord) / (1.0 + dissipation * dt);
}`

const DIVERGENCE_SHADER = `${FRAG_HEADER}
uniform sampler2D uVelocity;
void main() {
  float L = texture(uVelocity, vL).x;
  float R = texture(uVelocity, vR).x;
  float T = texture(uVelocity, vT).y;
  float B = texture(uVelocity, vB).y;
  vec2 C = texture(uVelocity, vUv).xy;
  if (vL.x < 0.0) L = -C.x;
  if (vR.x > 1.0) R = -C.x;
  if (vT.y > 1.0) T = -C.y;
  if (vB.y < 0.0) B = -C.y;
  fragColor = vec4(0.5 * (R - L + T - B), 0.0, 0.0, 1.0);
}`

const CURL_SHADER = `${FRAG_HEADER}
uniform sampler2D uVelocity;
void main() {
  float L = texture(uVelocity, vL).y;
  float R = texture(uVelocity, vR).y;
  float T = texture(uVelocity, vT).x;
  float B = texture(uVelocity, vB).x;
  fragColor = vec4(0.5 * (R - L - T + B), 0.0, 0.0, 1.0);
}`

const VORTICITY_SHADER = `${FRAG_HEADER}
uniform sampler2D uVelocity;
uniform sampler2D uCurl;
uniform float curl;
uniform float dt;
void main() {
  float L = texture(uCurl, vL).x;
  float R = texture(uCurl, vR).x;
  float T = texture(uCurl, vT).x;
  float B = texture(uCurl, vB).x;
  float C = texture(uCurl, vUv).x;
  vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
  force /= length(force) + 0.0001;
  force *= curl * C;
  force.y *= -1.0;
  vec2 velocity = texture(uVelocity, vUv).xy + force * dt;
  fragColor = vec4(clamp(velocity, -1000.0, 1000.0), 0.0, 1.0);
}`

const PRESSURE_SHADER = `${FRAG_HEADER}
uniform sampler2D uPressure;
uniform sampler2D uDivergence;
void main() {
  float L = texture(uPressure, vL).x;
  float R = texture(uPressure, vR).x;
  float T = texture(uPressure, vT).x;
  float B = texture(uPressure, vB).x;
  float divergence = texture(uDivergence, vUv).x;
  fragColor = vec4((L + R + B + T - divergence) * 0.25, 0.0, 0.0, 1.0);
}`

const GRADIENT_SHADER = `${FRAG_HEADER}
uniform sampler2D uPressure;
uniform sampler2D uVelocity;
void main() {
  float L = texture(uPressure, vL).x;
  float R = texture(uPressure, vR).x;
  float T = texture(uPressure, vT).x;
  float B = texture(uPressure, vB).x;
  vec2 velocity = texture(uVelocity, vUv).xy - vec2(R - L, T - B);
  fragColor = vec4(velocity, 0.0, 1.0);
}`

// Smoke rises from the spout, then a breeze in the upper half carries it up and to the right,
// matching the path in the reference video.
const WIND_SHADER = `${FRAG_HEADER}
uniform sampler2D uVelocity;
uniform sampler2D uDye;
uniform vec2 spout;
uniform float dt;
void main() {
  vec2 velocity = texture(uVelocity, vUv).xy;
  vec3 dye = texture(uDye, vUv).rgb;
  float density = clamp(max(dye.r, max(dye.g, dye.b)), 0.0, 1.0);
  float height = smoothstep(spout.y + 0.12, spout.y + 0.55, vUv.y);
  vec2 force = vec2(mix(-25.0, 120.0, height), mix(75.0, 35.0, height));
  fragColor = vec4(velocity + force * density * dt, 0.0, 1.0);
}`

const DISPLAY_SHADER = `${FRAG_HEADER}
uniform sampler2D uDye;
void main() {
  vec3 dye = texture(uDye, vUv).rgb;
  vec2 edge = smoothstep(vec2(0.0), vec2(0.08), vUv) * smoothstep(vec2(0.0), vec2(0.08), 1.0 - vUv);
  vec3 color = (1.0 - exp(-dye * 1.6)) * edge.x * edge.y;
  float alpha = clamp(max(color.r, max(color.g, color.b)) * 1.15, 0.0, 1.0);
  fragColor = vec4(color, alpha);
}`

const PARTICLE_UPDATE_SHADER = `${FRAG_HEADER}
uniform sampler2D uState;
uniform sampler2D uVelocity;
uniform vec2 velocityTexel;
uniform vec2 stateSize;
uniform vec2 spout;
uniform float glyphCount;
uniform float aspectRatio;
uniform float dt;
uniform float time;
float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
void main() {
  vec4 state = texture(uState, vUv);
  vec2 id = floor(vUv * stateSize);
  bool glyph = id.y * stateSize.x + id.x < glyphCount;
  float seed = mod(time, 97.0);
  if (state.w <= 0.0 || state.z >= state.w) {
    float r1 = hash(id + seed);
    float r2 = hash(id * 1.7 + seed * 1.3);
    float r3 = hash(id * 2.3 + seed * 0.7);
    float life = glyph ? mix(2.8, 4.6, r1) : mix(1.4, 3.2, r1);
    float age = state.w <= 0.0 ? -r3 * life : 0.0;
    vec2 jitter = (vec2(r2, r3) - 0.5) * vec2(0.035 / aspectRatio, 0.035);
    fragColor = vec4(spout + jitter, age, life);
    return;
  }
  vec2 position = state.xy;
  if (state.z >= 0.0) {
    vec2 velocity = texture(uVelocity, position).xy * velocityTexel;
    float drift = glyph ? 0.012 : 0.03;
    velocity += (vec2(hash(id + state.z), hash(id - state.z)) - 0.5) * drift;
    position += velocity * dt;
  }
  fragColor = vec4(position, state.z + dt, state.w);
}`

const PARTICLE_VERTEX = `#version 300 es
precision highp float;
precision highp sampler2D;
uniform sampler2D uState;
uniform vec2 stateSize;
uniform float glyphCount;
uniform float glyphTotal;
uniform float sizeScale;
uniform float time;
out float vAlpha;
out float vAngle;
flat out float vGlyph;
flat out float vKind;
void main() {
  int width = int(stateSize.x);
  vec4 state = texelFetch(uState, ivec2(gl_VertexID % width, gl_VertexID / width), 0);
  float index = float(gl_VertexID);
  float t = state.w > 0.0 ? state.z / state.w : -1.0;
  vKind = index < glyphCount ? 1.0 : 0.0;
  if (t < 0.0 || t > 1.0) {
    vAlpha = 0.0;
    vAngle = 0.0;
    vGlyph = 0.0;
    gl_PointSize = 0.0;
    gl_Position = vec4(2.0, 2.0, 0.0, 1.0);
    return;
  }
  float h = fract(sin(index * 12.9898) * 43758.5453);
  vec2 edge = smoothstep(vec2(0.0), vec2(0.06), state.xy) * smoothstep(vec2(0.0), vec2(0.06), 1.0 - state.xy);
  float twinkle = vKind > 0.5 ? 1.0 : 0.6 + 0.4 * sin(time * 9.0 + index);
  vAlpha = smoothstep(0.0, 0.12, t) * (1.0 - smoothstep(0.62, 1.0, t)) * edge.x * edge.y * twinkle;
  vGlyph = floor(h * glyphTotal);
  vAngle = (h - 0.5) * 1.1 + sin(time * 0.9 + index) * 0.35;
  float size = vKind > 0.5
    ? mix(15.0, 26.0, fract(h * 7.13)) * mix(0.75, 1.15, t)
    : mix(2.0, 5.0, fract(h * 3.7));
  gl_PointSize = size * sizeScale;
  gl_Position = vec4(state.xy * 2.0 - 1.0, 0.0, 1.0);
}`

const PARTICLE_FRAGMENT = `#version 300 es
precision highp float;
uniform sampler2D uAtlas;
uniform float atlasCols;
in float vAlpha;
in float vAngle;
flat in float vGlyph;
flat in float vKind;
out vec4 fragColor;
void main() {
  vec2 pc = gl_PointCoord - 0.5;
  if (vKind < 0.5) {
    float a = smoothstep(0.5, 0.0, length(pc));
    a *= a * vAlpha;
    vec3 tint = mod(vGlyph, 3.0) < 1.0 ? vec3(0.7, 0.82, 1.0) : vec3(1.0, 0.88, 0.6);
    fragColor = vec4(tint * a, a);
    return;
  }
  float c = cos(vAngle);
  float s = sin(vAngle);
  pc = mat2(c, -s, s, c) * pc + 0.5;
  if (any(lessThan(pc, vec2(0.0))) || any(greaterThan(pc, vec2(1.0)))) discard;
  vec2 cell = vec2(mod(vGlyph, atlasCols), floor(vGlyph / atlasCols));
  vec4 texel = texture(uAtlas, (cell + pc) / atlasCols);
  float core = texel.r;
  float glow = texel.g;
  vec3 color = vec3(1.0, 0.9, 0.62) * core + vec3(1.0, 0.6, 0.18) * glow * 0.9;
  float alpha = clamp(core + glow * 0.55, 0.0, 1.0) * vAlpha;
  fragColor = vec4(color * vAlpha, alpha);
}`

type Program = {
  program: WebGLProgram
  uniforms: Record<string, WebGLUniformLocation | null>
}

type FBO = {
  texture: WebGLTexture
  fbo: WebGLFramebuffer
  width: number
  height: number
  texelX: number
  texelY: number
  attach: (unit: number) => number
}

type DoubleFBO = {
  width: number
  height: number
  texelX: number
  texelY: number
  read: FBO
  write: FBO
  swap: () => void
}

function compileShader(gl: WebGL2RenderingContext, type: number, source: string) {
  const shader = gl.createShader(type)
  if (!shader) throw new Error('shader allocation failed')
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    throw new Error(gl.getShaderInfoLog(shader) ?? 'shader compile failed')
  }
  return shader
}

function createProgram(gl: WebGL2RenderingContext, vertex: WebGLShader, fragmentSource: string): Program {
  const program = gl.createProgram()
  if (!program) throw new Error('program allocation failed')
  gl.attachShader(program, vertex)
  gl.attachShader(program, compileShader(gl, gl.FRAGMENT_SHADER, fragmentSource))
  gl.bindAttribLocation(program, 0, 'aPosition')
  gl.linkProgram(program)
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw new Error(gl.getProgramInfoLog(program) ?? 'program link failed')
  }
  const uniforms: Program['uniforms'] = {}
  const count = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS) as number
  for (let i = 0; i < count; i++) {
    const info = gl.getActiveUniform(program, i)
    if (info) uniforms[info.name] = gl.getUniformLocation(program, info.name)
  }
  return { program, uniforms }
}

function createFBO(
  gl: WebGL2RenderingContext,
  width: number,
  height: number,
  internalFormat: number,
  format: number,
  type: number,
  filter: number,
): FBO {
  const texture = gl.createTexture()!
  gl.activeTexture(gl.TEXTURE0)
  gl.bindTexture(gl.TEXTURE_2D, texture)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
  gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, width, height, 0, format, type, null)
  const fbo = gl.createFramebuffer()!
  gl.bindFramebuffer(gl.FRAMEBUFFER, fbo)
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0)
  gl.viewport(0, 0, width, height)
  gl.clearColor(0, 0, 0, 0)
  gl.clear(gl.COLOR_BUFFER_BIT)
  return {
    texture,
    fbo,
    width,
    height,
    texelX: 1 / width,
    texelY: 1 / height,
    attach(unit) {
      gl.activeTexture(gl.TEXTURE0 + unit)
      gl.bindTexture(gl.TEXTURE_2D, texture)
      return unit
    },
  }
}

function createDoubleFBO(...args: Parameters<typeof createFBO>): DoubleFBO {
  let read = createFBO(...args)
  let write = createFBO(...args)
  return {
    width: read.width,
    height: read.height,
    texelX: read.texelX,
    texelY: read.texelY,
    get read() {
      return read
    },
    get write() {
      return write
    },
    swap() {
      const temp = read
      read = write
      write = temp
    },
  }
}

function resolution(base: number, width: number, height: number) {
  const aspect = width / height
  const long = Math.round(base * (aspect < 1 ? 1 / aspect : aspect))
  return aspect >= 1 ? { width: long, height: base } : { width: base, height: long }
}

function buildGlyphAtlas() {
  const size = ATLAS_COLS * ATLAS_CELL
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!
  const family = getComputedStyle(document.documentElement).getPropertyValue('--font-gulzar').trim() || 'serif'
  ctx.fillStyle = '#000'
  ctx.fillRect(0, 0, size, size)
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.font = `${ATLAS_CELL * 0.55}px ${family}, "Noto Naskh Arabic", serif`
  ctx.globalCompositeOperation = 'lighter'

  const draw = (color: string, blur: number) => {
    ctx.filter = blur ? `blur(${blur}px)` : 'none'
    ctx.fillStyle = color
    LETTERS.forEach((letter, i) => {
      const x = (i % ATLAS_COLS) * ATLAS_CELL + ATLAS_CELL / 2
      const y = Math.floor(i / ATLAS_COLS) * ATLAS_CELL + ATLAS_CELL / 2
      ctx.fillText(letter, x, y)
    })
  }
  // Green channel holds the soft glow, red holds the crisp letter.
  draw('#00ff00', 10)
  draw('#00ff00', 4)
  draw('#ff0000', 0)
  return canvas
}

type LampSmokeCanvasProps = {
  /** Spout position as a fraction of the canvas width (0 = left edge). */
  originX?: number
  /** Spout position as a fraction of the canvas height (0 = top edge). */
  originY?: number
  /** Overall size of the plume relative to the canvas height. */
  scale?: number
  className?: string
}

export function LampSmokeCanvas({ originX = 0.3, originY = 0.85, scale = 0.7, className }: LampSmokeCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const gl = canvas.getContext('webgl2', { alpha: true, premultipliedAlpha: true, antialias: false, depth: false })
    if (!gl) return
    const floatExt = gl.getExtension('EXT_color_buffer_float')
    const halfExt = gl.getExtension('EXT_color_buffer_half_float')
    if (!floatExt && !halfExt) return

    let raf = 0
    let disposed = false
    let visible = true
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const baseVertex = compileShader(gl, gl.VERTEX_SHADER, BASE_VERTEX)
    const programs = {
      clear: createProgram(gl, baseVertex, CLEAR_SHADER),
      splat: createProgram(gl, baseVertex, SPLAT_SHADER),
      advection: createProgram(gl, baseVertex, ADVECTION_SHADER),
      divergence: createProgram(gl, baseVertex, DIVERGENCE_SHADER),
      curl: createProgram(gl, baseVertex, CURL_SHADER),
      vorticity: createProgram(gl, baseVertex, VORTICITY_SHADER),
      pressure: createProgram(gl, baseVertex, PRESSURE_SHADER),
      gradient: createProgram(gl, baseVertex, GRADIENT_SHADER),
      wind: createProgram(gl, baseVertex, WIND_SHADER),
      display: createProgram(gl, baseVertex, DISPLAY_SHADER),
      particleUpdate: createProgram(gl, baseVertex, PARTICLE_UPDATE_SHADER),
      particleDraw: createProgram(gl, compileShader(gl, gl.VERTEX_SHADER, PARTICLE_VERTEX), PARTICLE_FRAGMENT),
    }

    const quadVao = gl.createVertexArray()
    gl.bindVertexArray(quadVao)
    const quadBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]), gl.STATIC_DRAW)
    const indexBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 0, 2, 3]), gl.STATIC_DRAW)
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0)
    gl.enableVertexAttribArray(0)
    const pointVao = gl.createVertexArray()

    const atlas = gl.createTexture()
    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, atlas)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array(4))
    document.fonts.ready.then(() => {
      if (disposed) return
      gl.activeTexture(gl.TEXTURE0)
      gl.bindTexture(gl.TEXTURE_2D, atlas)
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, buildGlyphAtlas())
      gl.generateMipmap(gl.TEXTURE_2D)
    })

    const half = gl.HALF_FLOAT
    let velocity!: DoubleFBO
    let dye!: DoubleFBO
    let pressure!: DoubleFBO
    let divergence!: FBO
    let curl!: FBO
    const particles = floatExt
      ? createDoubleFBO(gl, STATE_W, STATE_H, gl.RGBA32F, gl.RGBA, gl.FLOAT, gl.NEAREST)
      : createDoubleFBO(gl, STATE_W, STATE_H, gl.RGBA16F, gl.RGBA, half, gl.NEAREST)

    const allocate = () => {
      const sim = resolution(SIM_RESOLUTION, canvas.width, canvas.height)
      const dyeRes = resolution(DYE_RESOLUTION, canvas.width, canvas.height)
      velocity = createDoubleFBO(gl, sim.width, sim.height, gl.RG16F, gl.RG, half, gl.LINEAR)
      dye = createDoubleFBO(gl, dyeRes.width, dyeRes.height, gl.RGBA16F, gl.RGBA, half, gl.LINEAR)
      pressure = createDoubleFBO(gl, sim.width, sim.height, gl.R16F, gl.RED, half, gl.NEAREST)
      divergence = createFBO(gl, sim.width, sim.height, gl.R16F, gl.RED, half, gl.NEAREST)
      curl = createFBO(gl, sim.width, sim.height, gl.R16F, gl.RED, half, gl.NEAREST)
    }

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const width = Math.max(1, Math.round(canvas.clientWidth * dpr))
      const height = Math.max(1, Math.round(canvas.clientHeight * dpr))
      if (canvas.width === width && canvas.height === height && velocity) return
      canvas.width = width
      canvas.height = height
      allocate()
    }
    resize()

    const use = (p: Program) => {
      gl.useProgram(p.program)
      return p.uniforms
    }

    const blit = (target: FBO | null) => {
      gl.bindVertexArray(quadVao)
      if (target) {
        gl.viewport(0, 0, target.width, target.height)
        gl.bindFramebuffer(gl.FRAMEBUFFER, target.fbo)
      } else {
        gl.viewport(0, 0, canvas.width, canvas.height)
        gl.bindFramebuffer(gl.FRAMEBUFFER, null)
      }
      gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0)
    }

    const spout = { x: originX, y: 1 - originY }

    const splat = (x: number, y: number, dx: number, dy: number, color: [number, number, number], radius: number) => {
      const aspect = canvas.width / canvas.height
      let u = use(programs.splat)
      gl.uniform1i(u.uTarget, velocity.read.attach(0))
      gl.uniform1f(u.aspectRatio, aspect)
      gl.uniform2f(u.point, x, y)
      gl.uniform3f(u.color, dx, dy, 0)
      gl.uniform1f(u.radius, radius)
      blit(velocity.write)
      velocity.swap()

      u = use(programs.splat)
      gl.uniform1i(u.uTarget, dye.read.attach(0))
      gl.uniform3f(u.color, color[0], color[1], color[2])
      gl.uniform1f(u.radius, radius * 1.4)
      blit(dye.write)
      dye.swap()
    }

    const emit = (time: number, dt: number) => {
      const angle = 1.95 + Math.sin(time * 1.1) * 0.45 + Math.sin(time * 2.7 + 1.3) * 0.18
      const dirX = Math.cos(angle)
      const dirY = Math.sin(angle)
      const strength = dt * 60
      const force = 60 * scale * strength
      const pulse = 0.75 + 0.25 * Math.sin(time * 3.1)
      const radius = 0.0007 * scale * scale
      splat(spout.x, spout.y, dirX * force, dirY * force, [0.5 * strength * pulse, 0.32 * strength * pulse, 0.1 * strength * pulse], radius)

      const side = 0.012 * scale
      const blue: [number, number, number] = [0.05 * strength, 0.12 * strength, 0.38 * strength]
      splat(spout.x - dirY * side, spout.y + dirX * side, dirX * force * 0.8, dirY * force * 0.8, blue, radius * 0.6)
      splat(spout.x + dirY * side, spout.y - dirX * side, dirX * force * 0.8, dirY * force * 0.8, blue, radius * 0.6)
    }

    const step = (time: number, dt: number) => {
      gl.disable(gl.BLEND)

      let u = use(programs.curl)
      gl.uniform2f(u.texelSize, velocity.texelX, velocity.texelY)
      gl.uniform1i(u.uVelocity, velocity.read.attach(0))
      blit(curl)

      u = use(programs.vorticity)
      gl.uniform2f(u.texelSize, velocity.texelX, velocity.texelY)
      gl.uniform1i(u.uVelocity, velocity.read.attach(0))
      gl.uniform1i(u.uCurl, curl.attach(1))
      gl.uniform1f(u.curl, CURL_STRENGTH)
      gl.uniform1f(u.dt, dt)
      blit(velocity.write)
      velocity.swap()

      u = use(programs.wind)
      gl.uniform1i(u.uVelocity, velocity.read.attach(0))
      gl.uniform1i(u.uDye, dye.read.attach(1))
      gl.uniform2f(u.spout, spout.x, spout.y)
      gl.uniform1f(u.dt, dt)
      blit(velocity.write)
      velocity.swap()

      u = use(programs.divergence)
      gl.uniform2f(u.texelSize, velocity.texelX, velocity.texelY)
      gl.uniform1i(u.uVelocity, velocity.read.attach(0))
      blit(divergence)

      u = use(programs.clear)
      gl.uniform1i(u.uTexture, pressure.read.attach(0))
      gl.uniform1f(u.value, 0.8)
      blit(pressure.write)
      pressure.swap()

      u = use(programs.pressure)
      gl.uniform2f(u.texelSize, velocity.texelX, velocity.texelY)
      gl.uniform1i(u.uDivergence, divergence.attach(0))
      for (let i = 0; i < PRESSURE_ITERATIONS; i++) {
        gl.uniform1i(u.uPressure, pressure.read.attach(1))
        blit(pressure.write)
        pressure.swap()
      }

      u = use(programs.gradient)
      gl.uniform2f(u.texelSize, velocity.texelX, velocity.texelY)
      gl.uniform1i(u.uPressure, pressure.read.attach(0))
      gl.uniform1i(u.uVelocity, velocity.read.attach(1))
      blit(velocity.write)
      velocity.swap()

      u = use(programs.advection)
      gl.uniform2f(u.velocityTexel, velocity.texelX, velocity.texelY)
      gl.uniform1i(u.uVelocity, velocity.read.attach(0))
      gl.uniform1i(u.uSource, velocity.read.attach(0))
      gl.uniform1f(u.dt, dt)
      gl.uniform1f(u.dissipation, VELOCITY_DISSIPATION)
      blit(velocity.write)
      velocity.swap()

      gl.uniform1i(u.uVelocity, velocity.read.attach(0))
      gl.uniform1i(u.uSource, dye.read.attach(1))
      gl.uniform1f(u.dissipation, DYE_DISSIPATION)
      blit(dye.write)
      dye.swap()

      emit(time, dt)

      u = use(programs.particleUpdate)
      gl.uniform1i(u.uState, particles.read.attach(0))
      gl.uniform1i(u.uVelocity, velocity.read.attach(1))
      gl.uniform2f(u.velocityTexel, velocity.texelX, velocity.texelY)
      gl.uniform2f(u.stateSize, STATE_W, STATE_H)
      gl.uniform2f(u.spout, spout.x, spout.y)
      gl.uniform1f(u.glyphCount, GLYPH_COUNT)
      gl.uniform1f(u.aspectRatio, canvas.width / canvas.height)
      gl.uniform1f(u.dt, dt)
      gl.uniform1f(u.time, time)
      blit(particles.write)
      particles.swap()
    }

    const render = (time: number) => {
      gl.bindFramebuffer(gl.FRAMEBUFFER, null)
      gl.viewport(0, 0, canvas.width, canvas.height)
      gl.clearColor(0, 0, 0, 0)
      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.enable(gl.BLEND)
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA)

      let u = use(programs.display)
      gl.uniform1i(u.uDye, dye.read.attach(0))
      blit(null)

      u = use(programs.particleDraw)
      gl.uniform1i(u.uState, particles.read.attach(0))
      gl.uniform1i(u.uAtlas, (gl.activeTexture(gl.TEXTURE1), gl.bindTexture(gl.TEXTURE_2D, atlas), 1))
      gl.uniform2f(u.stateSize, STATE_W, STATE_H)
      gl.uniform1f(u.glyphCount, GLYPH_COUNT)
      gl.uniform1f(u.glyphTotal, LETTERS.length)
      gl.uniform1f(u.atlasCols, ATLAS_COLS)
      gl.uniform1f(u.sizeScale, (canvas.height / 520) * scale * 1.4)
      gl.uniform1f(u.time, time)
      gl.bindVertexArray(pointVao)
      gl.drawArrays(gl.POINTS, 0, PARTICLE_COUNT)
    }

    let last = performance.now()
    let elapsed = 0
    const frame = (now: number) => {
      raf = 0
      if (disposed) return
      const dt = Math.min((now - last) / 1000, 1 / 30)
      last = now
      elapsed += dt
      resize()
      step(elapsed, dt)
      render(elapsed)
      if (reduceMotion && elapsed > 4) return
      if (visible && !document.hidden) raf = requestAnimationFrame(frame)
    }

    const resume = () => {
      if (raf || disposed || !visible || document.hidden) return
      if (reduceMotion && elapsed > 4) return
      last = performance.now()
      raf = requestAnimationFrame(frame)
    }

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      resume()
    })
    observer.observe(canvas)
    document.addEventListener('visibilitychange', resume)
    resume()

    return () => {
      disposed = true
      cancelAnimationFrame(raf)
      observer.disconnect()
      document.removeEventListener('visibilitychange', resume)
      gl.getExtension('WEBGL_lose_context')?.loseContext()
    }
  }, [originX, originY, scale])

  return <canvas ref={canvasRef} aria-hidden="true" className={cn('pointer-events-none block h-full w-full', className)} />
}
