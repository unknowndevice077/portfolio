"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// Classic Ashima Arts simplex noise (public domain / MIT) — standard,
// widely-used GLSL noise implementation.
const noiseGlsl = /* glsl */ `
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                        -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
      + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m;
    m = m*m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }
`;

const fragmentShader = /* glsl */ `
  varying vec2 vUv;
  uniform float uTime;
  uniform vec2 uResolution;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform vec3 uColorBase;

  ${noiseGlsl}

  void main() {
    vec2 uv = vUv;
    vec2 aspectUv = (uv - 0.5) * vec2(uResolution.x / uResolution.y, 1.0);

    float t = uTime * 0.045;

    // Layered flow-field noise — slow, large-scale bands drifting diagonally,
    // like an aurora rather than static blobs.
    float n1 = snoise(aspectUv * 1.4 + vec2(t, t * 0.6));
    float n2 = snoise(aspectUv * 2.2 - vec2(t * 0.7, t * 0.3) + 4.2);
    float n3 = snoise(aspectUv * 3.1 + vec2(t * 0.35, -t * 0.5) + 9.1);

    float flow = n1 * 0.5 + n2 * 0.3 + n3 * 0.2;
    flow = flow * 0.5 + 0.5; // normalize to 0..1

    // Mix base navy with two accent colors based on flow value and position
    vec3 col = mix(uColorBase, uColorA, smoothstep(0.35, 0.85, flow));
    float mixB = smoothstep(0.55, 1.0, n2 * 0.5 + 0.5);
    col = mix(col, uColorB, mixB * 0.6);

    // Soft radial vignette
    float dist = length(aspectUv);
    col *= smoothstep(1.3, 0.1, dist) * 0.7 + 0.3;

    gl_FragColor = vec4(col, 1.0);
  }
`;

export default function SceneBackground({
  accent1 = "#6ee7d8",
  accent2 = "#818cf8",
}: {
  accent1?: string;
  accent2?: string;
}) {
  const mountRef = useRef<HTMLDivElement>(null);
  const target1Ref = useRef(new THREE.Color(accent1));
  const target2Ref = useRef(new THREE.Color(accent2));

  useEffect(() => {
    target1Ref.current.set(accent1);
  }, [accent1]);

  useEffect(() => {
    target2Ref.current.set(accent2);
  }, [accent2]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      preserveDrawingBuffer: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    mount.appendChild(renderer.domElement);

    const liveColorA = target1Ref.current.clone();
    const liveColorB = target2Ref.current.clone();
    const baseColor = new THREE.Color("#0a0a14");

    const uniforms = {
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
      uColorA: { value: liveColorA },
      uColorB: { value: liveColorB },
      uColorBase: { value: baseColor },
    };

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    let raf = 0;
    const clock = new THREE.Clock();
    const animate = () => {
      uniforms.uTime.value = clock.getElapsedTime();
      liveColorA.lerp(target1Ref.current, 0.008);
      liveColorB.lerp(target2Ref.current, 0.008);
      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    animate();

    const onResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      uniforms.uResolution.value.set(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ filter: "blur(60px) saturate(1.3)" }}
      aria-hidden="true"
    />
  );
}
