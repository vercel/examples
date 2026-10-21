"use client";

import { useEffect, useRef, useState } from "react";
import "./ShaderBackground.scss";

/**
 * Full-viewport WebGL2 gradient-mesh background.
 *
 * Renders a single fragment shader that paints a slow-moving, mouse-reactive
 * gradient. Color palette swaps between light and dark themes by observing the
 * `.dark` class on <html>. Until the first frame draws, a static CSS gradient
 * (approximating the shader palette) shows instead — see ShaderBackground.scss.
 *
 * The committed `bg01.webp` fallback layer is mounted (and its image fetched)
 * ONLY when WebGL initialization fails or the context is lost — on the normal
 * path the opaque canvas covers the background, so eagerly loading the image
 * wasted ~155 KiB on every page view (#86: it sat in the LCP window).
 *
 * Honors prefers-reduced-motion by skipping the RAF loop (shader draws a single
 * static frame).
 */

type Uniforms = {
  uTime: WebGLUniformLocation | null;
  uMouse: WebGLUniformLocation | null;
  uScroll: WebGLUniformLocation | null;
  uResolution: WebGLUniformLocation | null;
  uColorA: WebGLUniformLocation | null;
  uColorB: WebGLUniformLocation | null;
  uColorC: WebGLUniformLocation | null;
  uColorD: WebGLUniformLocation | null;
  uPlanetA: WebGLUniformLocation | null;
  uPlanetB: WebGLUniformLocation | null;
  uStarColor: WebGLUniformLocation | null;
  uStarIntensity: WebGLUniformLocation | null;
  uAmbientFloor: WebGLUniformLocation | null;
  uAmbientRange: WebGLUniformLocation | null;
};

const PALETTE = {
  light: {
    a: [0.96, 0.97, 0.99], // #f5f7fb-ish
    b: [0.83, 0.9, 1.0], // soft cyan
    c: [0.55, 0.78, 1.0], // brand-blue tint
    d: [0.13, 0.9, 0.9], // brand-cyan-light
    // Light mode keeps the airy feel: near-white watercolor planets and faint
    // dust-star specks, never saturated dark balls punching holes in the page.
    planetA: [0.92, 0.96, 1.0],
    planetB: [1.0, 1.0, 1.0],
    starColor: [0.72, 0.8, 0.92],
    starIntensity: 0.22,
    // Light theme: lift the ambient floor so the dark side reads as pale
    // watercolor, not 22% gray. Range still gives a hint of 3D shading.
    ambientFloor: 0.78,
    ambientRange: 0.22,
  },
  dark: {
    a: [0.04, 0.05, 0.08], // near-black blue
    b: [0.06, 0.12, 0.25],
    c: [0.12, 0.32, 0.62], // brand-blue tint
    d: [0.05, 0.55, 0.65], // muted cyan
    // Dark mode is the showcase: deep brand-blue gas giant, luminous bands.
    planetA: [0.1, 0.24, 0.55],
    planetB: [0.38, 0.6, 0.85],
    starColor: [0.92, 0.96, 1.0],
    starIntensity: 0.9,
    // Dark theme: keep the original dramatic shading floor.
    ambientFloor: 0.22,
    ambientRange: 0.85,
  },
} as const;

const FRAGMENT_SHADER = `
precision highp float;

uniform vec2 uResolution;
uniform vec2 uMouse;
uniform float uTime;
uniform float uScroll;
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform vec3 uColorC;
uniform vec3 uColorD;
uniform vec3 uPlanetA;
uniform vec3 uPlanetB;
uniform vec3 uStarColor;
uniform float uStarIntensity;
uniform float uAmbientFloor;
uniform float uAmbientRange;

// 2D simplex noise — Ashima/Stefan Gustavson.
vec3 permute(vec3 x){ return mod(((x*34.0)+1.0)*x, 289.0); }
float snoise(vec2 v){
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                     -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
                  + i.x + vec3(0.0, i1.x, 1.0 ));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m; m = m*m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

// FBM layered noise for softer fields.
float fbm(vec2 p){
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 5; i++) {
    v += a * snoise(p);
    p *= 2.02;
    a *= 0.5;
  }
  return v;
}

float hash21(vec2 p){
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

// Sparse twinkling star field on a jittered grid. "size" is the star radius
// as a fraction of a cell; "density" is the fraction of cells holding a star.
float starLayer(vec2 p, float scale, float density, float size, float t){
  vec2 g = p * scale;
  vec2 id = floor(g);
  vec2 f = fract(g);
  float h = hash21(id);
  float on = step(h, density);
  vec2 spos = vec2(hash21(id + 13.7), hash21(id + 91.3)) * 0.84 + 0.08;
  float d = length(f - spos);
  float core = (1.0 - smoothstep(0.0, size, d)) * on * (0.4 + 0.6 * hash21(id + 5.0));
  float tw = 0.7 + 0.3 * sin(t * (0.4 + h * 1.1) + h * 40.0);
  return core * tw;
}

// Closed-form ray/sphere intersection — returns distance along rd, or -1.
float iSphere(vec3 ro, vec3 rd, vec3 ce, float ra){
  vec3 oc = ro - ce;
  float b = dot(oc, rd);
  float c = dot(oc, oc) - ra * ra;
  float h = b * b - c;
  if (h < 0.0) return -1.0;
  h = sqrt(h);
  float t = -b - h;
  if (t < 0.0) t = -b + h;
  return t;
}

void main(){
  vec2 uv = gl_FragCoord.xy / uResolution.xy;
  vec2 p = uv;
  // Correct aspect so noise fields don't stretch.
  float aspect = uResolution.x / uResolution.y;
  p.x *= aspect;

  float t = uTime * 0.05;
  // Mouse parallax — small shift toward cursor.
  vec2 m = (uMouse - 0.5) * 0.6;
  p += m * 0.15;

  // Scroll nudges the field vertically.
  p.y += uScroll * 0.4;

  float n1 = fbm(p * 1.2 + vec2(t, -t * 0.7));
  float n2 = fbm(p * 1.8 - vec2(t * 0.6, t * 0.9) + n1 * 0.6);

  float mask1 = smoothstep(-0.2, 0.6, n1);
  float mask2 = smoothstep(0.0, 0.8, n2);
  float mask3 = smoothstep(0.2, 0.5, (n1 + n2) * 0.5);

  vec3 col = mix(uColorA, uColorB, mask1);
  col = mix(col, uColorC, mask2 * 0.85);
  col = mix(col, uColorD, mask3 * 0.4);

  // --- Starfield: two parallax depth layers, slow twinkle. ---
  vec2 sp = uv * vec2(aspect, 1.0) + m * 0.04 + vec2(0.0, -uScroll * 0.06);
  float stars = starLayer(sp, 22.0, 0.14, 0.10, uTime) * 0.9
              + starLayer(sp * 1.6 + 17.3, 34.0, 0.11, 0.06, uTime * 1.3) * 0.55;
  col += uStarColor * stars * uStarIntensity;

  // --- Mini solar system. Analytic ray tracing only — no march loops. ---
  // Celestial-slow epoch: orbits complete over minutes, not seconds.
  float et = uTime * 0.015;
  float ax = min(aspect, 1.7);
  // Planets drift with the same eased mouse/scroll offsets as the nebula.
  vec3 par = vec3((uMouse.x - 0.5) * 0.18, (uMouse.y - 0.5) * 0.12, 0.0)
           + vec3(0.0, uScroll * 0.22, 0.0);
  vec3 giantC = vec3(0.26 * ax, 0.155, 1.05) + par
              + vec3(0.03 * sin(et * 0.9), 0.02 * cos(et * 0.7), 0.015 * sin(et * 0.5));
  float giantR = 0.26;
  vec3 moonC = giantC + vec3(cos(et * 2.0) * 0.45, sin(et * 1.4) * 0.16, 0.3 * sin(et * 1.7));
  float moonR = 0.048;

  vec2 q = (uv - 0.5) * vec2(aspect, 1.0);
  vec3 ro = vec3(0.0, 0.0, -2.0);
  vec3 rd = normalize(vec3(q, 1.45));
  vec3 L = normalize(vec3(-0.55, 0.45, 0.8));

  float tG = iSphere(ro, rd, giantC, giantR);
  float tM = iSphere(ro, rd, moonC, moonR);

  // Atmospheric halo behind the gas giant.
  vec3 tc = giantC - ro;
  float pd = length(tc - rd * dot(tc, rd));
  col += uColorC * exp(-max(pd - giantR, 0.0) * 7.0) * 0.14;

  // Gas giant — banded surface, Lambert + cyan rim. Drawn before the moon
  // and ring so they composite correctly on top when they pass in front.
  if (tG > 0.0) {
    vec3 gp = ro + rd * tG;
    vec3 gn = normalize(gp - giantC);
    float gdiff = max(dot(gn, L), 0.0);
    float warp = fbm(vec2(gn.x * 1.6, gn.y * 2.6) + vec2(uTime * 0.006, 0.0) + 4.2);
    float band = sin(gn.y * 8.5 + warp * 1.8);
    vec3 gsurf = mix(uPlanetA, uPlanetB, smoothstep(-0.35, 0.35, band));
    gsurf *= 1.0 - 0.22 * smoothstep(0.55, 1.0, abs(gn.y)); // polar shading
    float fres = pow(1.0 - max(dot(gn, -rd), 0.0), 2.5);
    col = gsurf * (uAmbientFloor + uAmbientRange * gdiff) + uColorD * fres * 0.38;
  }

  // Moon — only drawn when it is the nearest body (in front of the giant);
  // when behind (tG < tM) the giant has already covered its pixels.
  if (tM > 0.0 && (tG < 0.0 || tM < tG)) {
    vec3 mp = ro + rd * tM;
    vec3 mn = normalize(mp - moonC);
    float mdiff = max(dot(mn, L), 0.0);
    float msp = fbm(mn.xy * 9.0 + 2.7);
    vec3 msurf = mix(uPlanetB, uPlanetA, 0.5 + 0.5 * msp);
    col = msurf * (uAmbientFloor + uAmbientRange * mdiff) + uColorD * pow(1.0 - max(dot(mn, -rd), 0.0), 3.0) * 0.3;
  }

  // Ring — tilted annulus with a Cassini-like gap; hidden where a nearer
  // body occludes it (giant or moon), drawn over whatever is behind it.
  vec3 rn = normalize(vec3(0.28, 1.0, 0.12));
  float denom = dot(rd, rn);
  if (abs(denom) > 1e-4) {
    float tR = -dot(ro - giantC, rn) / denom;
    if (tR > 0.0) {
      vec3 hp = (ro + rd * tR) - giantC;
      vec3 e1 = normalize(cross(rn, vec3(1.0, 0.0, 0.0)));
      vec3 e2 = cross(rn, e1);
      float rr = length(vec2(dot(hp, e1), dot(hp, e2)));
      float rIn = giantR * 1.35;
      float rOut = giantR * 2.3;
      bool ringNearest = (tG < 0.0 || tR < tG) && (tM < 0.0 || tR < tM);
      if (rr > rIn && rr < rOut && ringNearest) {
        float rb = snoise(vec2(rr * 26.0, 3.7)) * 0.5 + 0.5;
        float gap = smoothstep(0.02, 0.08, abs(rr - giantR * 1.85));
        float edge = smoothstep(rIn, rIn + giantR * 0.25, rr)
                   * (1.0 - smoothstep(rOut - giantR * 0.3, rOut, rr));
        float ralpha = (0.28 + 0.5 * rb) * gap * edge;
        vec3 rcol = mix(uPlanetB, uColorD, 0.5 + 0.5 * rb);
        col = mix(col, rcol, clamp(ralpha, 0.0, 0.75));
      }
    }
  }

  // Subtle vignette to keep content readable.
  float d = distance(uv, vec2(0.5));
  col *= smoothstep(1.05, 0.2, d);

  gl_FragColor = vec4(col, 1.0);
}
`;

const VERTEX_SHADER = `
attribute vec2 aPosition;
void main(){
  gl_Position = vec4(aPosition, 0.0, 1.0);
}
`;

function compileShader(gl: WebGL2RenderingContext, type: number, src: string): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.warn("ShaderBackground shader compile failed:", gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export default function ShaderBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  // Mounts (and fetches) the bg01.webp fallback only when the shader can't run.
  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Canvas goes transparent if the GL context is lost at runtime — bring
    // the fallback image back when that happens.
    const onContextLost = () => setShowFallback(true);

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const gl = canvas.getContext("webgl2", { antialias: false, alpha: false, powerPreference: "high-performance" });
    if (!gl) {
      // WebGL2 unavailable — show the committed image fallback.
      setShowFallback(true);
      return;
    }

    // --- Program setup ---
    const vs = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
    const fs = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    if (!vs || !fs) {
      setShowFallback(true);
      return;
    }

    const program = gl.createProgram();
    if (!program) {
      setShowFallback(true);
      return;
    }
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.warn("ShaderBackground program link failed:", gl.getProgramInfoLog(program));
      setShowFallback(true);
      return;
    }
    gl.useProgram(program);
    canvas.addEventListener("webglcontextlost", onContextLost);

    // Full-screen triangle — covers clip space without a quad.
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW,
    );
    const aPosition = gl.getAttribLocation(program, "aPosition");
    gl.enableVertexAttribArray(aPosition);
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

    const uniforms: Uniforms = {
      uTime: gl.getUniformLocation(program, "uTime"),
      uMouse: gl.getUniformLocation(program, "uMouse"),
      uScroll: gl.getUniformLocation(program, "uScroll"),
      uResolution: gl.getUniformLocation(program, "uResolution"),
      uColorA: gl.getUniformLocation(program, "uColorA"),
      uColorB: gl.getUniformLocation(program, "uColorB"),
      uColorC: gl.getUniformLocation(program, "uColorC"),
      uColorD: gl.getUniformLocation(program, "uColorD"),
      uPlanetA: gl.getUniformLocation(program, "uPlanetA"),
      uPlanetB: gl.getUniformLocation(program, "uPlanetB"),
      uStarColor: gl.getUniformLocation(program, "uStarColor"),
      uStarIntensity: gl.getUniformLocation(program, "uStarIntensity"),
      uAmbientFloor: gl.getUniformLocation(program, "uAmbientFloor"),
      uAmbientRange: gl.getUniformLocation(program, "uAmbientRange"),
    };

    // --- Theme detection ---
    const getPalette = () =>
      document.documentElement.classList.contains("dark") ? PALETTE.dark : PALETTE.light;
    const applyPalette = () => {
      const p = getPalette();
      gl.uniform3f(uniforms.uColorA, p.a[0], p.a[1], p.a[2]);
      gl.uniform3f(uniforms.uColorB, p.b[0], p.b[1], p.b[2]);
      gl.uniform3f(uniforms.uColorC, p.c[0], p.c[1], p.c[2]);
      gl.uniform3f(uniforms.uColorD, p.d[0], p.d[1], p.d[2]);
      gl.uniform3f(uniforms.uPlanetA, p.planetA[0], p.planetA[1], p.planetA[2]);
      gl.uniform3f(uniforms.uPlanetB, p.planetB[0], p.planetB[1], p.planetB[2]);
      gl.uniform3f(uniforms.uStarColor, p.starColor[0], p.starColor[1], p.starColor[2]);
      gl.uniform1f(uniforms.uStarIntensity, p.starIntensity);
      gl.uniform1f(uniforms.uAmbientFloor, p.ambientFloor);
      gl.uniform1f(uniforms.uAmbientRange, p.ambientRange);
    };
    applyPalette();

    const themeObserver = new MutationObserver(applyPalette);
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    // --- Pointer + scroll state ---
    const mouse = { x: 0.5, y: 0.5 };
    const targetMouse = { x: 0.5, y: 0.5 };
    let targetScroll = 0;
    let currentScroll = 0;

    const onPointerMove = (e: PointerEvent) => {
      targetMouse.x = e.clientX / window.innerWidth;
      targetMouse.y = 1 - e.clientY / window.innerHeight;
    };
    const onScroll = () => {
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      targetScroll = Math.min(1, Math.max(0, window.scrollY / max));
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    // --- Resize ---
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.max(1, Math.floor(window.innerWidth * dpr));
      const h = Math.max(1, Math.floor(window.innerHeight * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
        gl.uniform2f(uniforms.uResolution, w, h);
      }
    };
    resize();
    window.addEventListener("resize", resize);

    // --- Render loop ---
    let raf = 0;
    const start = performance.now();
    const render = (now: number) => {
      // Ease mouse + scroll toward target for buttery follow.
      mouse.x += (targetMouse.x - mouse.x) * 0.06;
      mouse.y += (targetMouse.y - mouse.y) * 0.06;
      currentScroll += (targetScroll - currentScroll) * 0.08;

      const t = prefersReducedMotion ? 0 : (now - start) / 1000;
      gl.uniform1f(uniforms.uTime, t);
      gl.uniform2f(uniforms.uMouse, mouse.x, mouse.y);
      gl.uniform1f(uniforms.uScroll, currentScroll);
      gl.drawArrays(gl.TRIANGLES, 0, 3);

      if (!prefersReducedMotion) {
        raf = requestAnimationFrame(render);
      }
    };
    raf = requestAnimationFrame(render);

    // --- Cleanup ---
    return () => {
      cancelAnimationFrame(raf);
      canvas.removeEventListener("webglcontextlost", onContextLost);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", resize);
      themeObserver.disconnect();
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, []);

  return (
    <div className="shader-background" aria-hidden="true">
      {showFallback && <div className="shader-background__fallback" />}
      <canvas ref={canvasRef} className="shader-background__canvas" />
    </div>
  );
}
