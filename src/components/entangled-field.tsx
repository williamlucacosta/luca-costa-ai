"use client"

import { useEffect, useRef } from "react"
import { warp } from "@/lib/warp"

/**
 * "Entangled field": the site-wide background.
 * Pairs of light strands braid through each other (entangled) on a domain-warped flow field,
 * in two depth layers: a crisp near layer and an out-of-focus far one.
 * Scrolling slowly evolves the composition. It does not react to the cursor.
 * Raw WebGL1, one full-screen quad, rendered at reduced resolution (the image is soft anyway).
 */

const VS = `
attribute vec2 a_pos;
void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`

const FS = `
precision highp float;
uniform vec2 u_res;
uniform float u_t;
uniform float u_scroll;   // page progress 0..1
uniform float u_warp;     // in-page jump, 0..1

float hash(vec2 p) { p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  mat2 r = mat2(0.8, -0.6, 0.6, 0.8);
  for (int i = 0; i < 4; i++) { v += a * noise(p); p = r * p * 2.03; a *= 0.5; }
  return v;
}

// distance from p to the curve y = amp * sin(x * freq + phase), slope-corrected
float strand(vec2 p, float amp, float freq, float phase) {
  float a = p.x * freq + phase;
  float y = amp * sin(a);
  float dy = amp * freq * cos(a);
  return abs(p.y - y) / sqrt(1.0 + dy * dy);
}

// iridescent tint: shifts blue → cyan → violet along the strand and over time
vec3 iris(float k) {
  vec3 blue = vec3(0.16, 0.38, 1.0);
  vec3 cyan = vec3(0.2, 0.86, 1.0);
  vec3 violet = vec3(0.5, 0.34, 1.0);
  float s = 0.5 + 0.5 * sin(k);
  float u = 0.5 + 0.5 * sin(k * 0.61 + 1.7);
  return mix(mix(blue, cyan, s), violet, u * 0.45);
}

/*
 * One layer of entangled pairs. Each pair shares amplitude and frequency but is phase-opposed,
 * so the two strands braid through each other. "blur" widens the core for out-of-focus layers.
 */
vec3 layer(vec2 w, float t, float aspect, float seed, float thick, float blur, float gain) {
  vec3 col = vec3(0.0);
  for (int i = 0; i < 3; i++) {
    float fi = float(i) + seed;
    float off = (float(i) - 1.0) * 0.34 + sin(t * 0.6 + fi * 2.1) * 0.05;
    vec2 sp = w - vec2(0.0, off);
    float amp = 0.075 + 0.03 * sin(t * 0.45 + fi);
    float freq = 3.0 + float(i) * 1.15 + seed * 0.4;
    float ph = fi * 1.7 + u_scroll * 5.0 + t * (1.0 + float(i) * 0.18);
    float d1 = strand(sp, amp, freq, ph);
    float d2 = strand(sp, -amp, freq, ph);
    float w0 = thick * (1.0 + blur);
    // a sharp core plus a wide, soft bloom around it
    float core1 = w0 / (d1 + w0), core2 = w0 / (d2 + w0);
    float bloom1 = exp(-d1 / (0.035 + blur * 0.05)), bloom2 = exp(-d2 / (0.035 + blur * 0.05));
    float fade = smoothstep(1.25, 0.1, abs(sp.x) / aspect * 1.35);
    vec3 c1 = iris(sp.x * 1.4 + fi * 1.3 + t * 0.8);
    vec3 c2 = iris(sp.x * 1.4 + fi * 1.3 + t * 0.8 + 2.2);
    col += (c1 * (pow(core1, 1.7) * 0.6 + bloom1 * 0.09) + c2 * (pow(core2, 1.7) * 0.6 + bloom2 * 0.09)) * fade;
  }
  return col * gain;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_res;
  float aspect = u_res.x / u_res.y;
  vec2 p = (uv - 0.5) * vec2(aspect, 1.0);
  float t = u_t * 0.17;
  // warp: space is pulled toward the centre, like a lens at light speed
  p *= 1.0 - u_warp * 0.5 * smoothstep(0.0, 0.9, length(p));

  // domain warp: the whole field flows
  vec2 q = vec2(fbm(p * 1.25 + vec2(0.0, t * 0.6)), fbm(p * 1.25 + vec2(5.2, -t * 0.5)));
  vec2 w = p + (q - 0.5) * 0.5;

  float ang = -0.34 + u_scroll * 1.1;
  mat2 rot = mat2(cos(ang), -sin(ang), sin(ang), cos(ang));

  vec3 col = vec3(0.0);
  // far layer: out of focus, slower, rotated differently, for real depth
  vec2 wf = mat2(cos(ang + 0.5), -sin(ang + 0.5), sin(ang + 0.5), cos(ang + 0.5)) * (w * 0.72) + vec2(0.0, u_scroll * 0.25);
  col += layer(wf, t * 0.7, aspect, 3.0, 0.0035, 2.2, 0.07);
  // near layer: crisp, bright
  col += layer(rot * w, t, aspect, 0.0, 0.002, 0.0, 0.34);

  // faint warped spacetime grid, bending with the flow
  vec2 gp = (p + (q - 0.5) * 0.25) * 9.0;
  vec2 g = abs(fract(gp) - 0.5);
  float grid = smoothstep(0.495, 0.5, max(g.x, g.y));
  col += vec3(0.25, 0.45, 1.0) * grid * 0.012 * smoothstep(1.1, 0.0, length(p));

  // nebula haze carried by the same flow
  float haze = fbm(w * 2.0 + t * 0.2);
  col += mix(vec3(0.02, 0.05, 0.16), vec3(0.04, 0.12, 0.22), q.x) * haze * 0.22;
  col += vec3(0.05, 0.12, 0.32) * 0.06 * exp(-length(p - vec2(aspect * 0.3, 0.3)) * 2.0);

  vec3 base = vec3(0.014, 0.018, 0.032);
  col = base + col;
  float vig = smoothstep(1.35, 0.25, length((uv - 0.5) * vec2(aspect * 0.9, 1.0)));
  col *= mix(0.42, 1.0, vig);
  col += (hash(gl_FragCoord.xy + u_t) - 0.5) * 0.022;
  col *= 1.0 + u_warp * 0.5;
  col = col / (1.0 + col * 0.6);
  gl_FragColor = vec4(col, 1.0);
}
`

export function EntangledField() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current!
    const gl = canvas.getContext("webgl", { antialias: false, alpha: false, powerPreference: "high-performance" })
    if (!gl) return

    const sh = (type: number, src: string) => {
      const s = gl.createShader(type)!
      gl.shaderSource(s, src)
      gl.compileShader(s)
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) console.error(gl.getShaderInfoLog(s))
      return s
    }
    const prog = gl.createProgram()!
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, VS))
    gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FS))
    gl.linkProgram(prog)
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return
    gl.useProgram(prog)

    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer())
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW)
    const loc = gl.getAttribLocation(prog, "a_pos")
    gl.enableVertexAttribArray(loc)
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)

    const u = (n: string) => gl.getUniformLocation(prog, n)
    const uRes = u("u_res"), uT = u("u_t"), uScroll = u("u_scroll"), uWarp = u("u_warp")

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const coarse = window.matchMedia("(pointer: coarse)").matches
    // Soft image → render at a fraction of the screen resolution; lower still on phones.
    const scale = Math.min(window.devicePixelRatio || 1, 1.5) * (coarse ? 0.45 : 0.65)

    // size from the element, not the window: it is 100lvh tall, so a phone's collapsing
    // address bar never changes it (no black band, no re-allocation mid-scroll)
    const resize = () => {
      const w = Math.max(1, Math.floor(canvas.clientWidth * scale))
      const h = Math.max(1, Math.floor(canvas.clientHeight * scale))
      if (w !== canvas.width || h !== canvas.height) {
        canvas.width = w
        canvas.height = h
      }
      // always (re)bind: a remounted effect gets a fresh program on the same, already-sized canvas
      gl.viewport(0, 0, w, h)
      gl.uniform2f(uRes, w, h)
    }
    resize()

    let scrollT = 0, scrollS = 0
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - innerHeight
      scrollT = max > 0 ? scrollY / max : 0
    }
    onScroll()

    let raf = 0
    let clock = 0
    let prev = performance.now()
    const frame = (now: number) => {
      // during a warp the strands rush: time runs faster, and the scroll angle catches up quicker
      clock += ((now - prev) / 1000) * (1 + warp.v * 5)
      prev = now
      scrollS += (scrollT - scrollS) * (0.05 + warp.v * 0.1)
      gl.uniform1f(uT, clock)
      gl.uniform1f(uWarp, warp.v)
      gl.uniform1f(uScroll, scrollS)
      gl.drawArrays(gl.TRIANGLES, 0, 6)
      if (!reduced) raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)
    canvas.style.opacity = "1"

    const onVis = () => {
      cancelAnimationFrame(raf)
      prev = performance.now()
      if (!document.hidden && !reduced) raf = requestAnimationFrame(frame)
    }
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    addEventListener("scroll", onScroll, { passive: true })
    document.addEventListener("visibilitychange", onVis)
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      removeEventListener("scroll", onScroll)
      document.removeEventListener("visibilitychange", onVis)
    }
  }, [])

  return (
    <div aria-hidden className="pointer-events-none fixed inset-x-0 top-0 z-0 h-lvh bg-background">
      <canvas ref={ref} className="size-full opacity-0 transition-opacity duration-[2000ms]" />
    </div>
  )
}
