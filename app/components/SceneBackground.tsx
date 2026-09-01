"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

type Ring = {
  mesh: THREE.LineLoop;
  mat: THREE.LineBasicMaterial;
  target: THREE.Color;
  baseX: number;
  baseY: number;
  z: number;
  speed: number;
  phase: number;
};

function makeRing(radius: number, segments: number): THREE.BufferGeometry {
  const points: THREE.Vector3[] = [];
  for (let i = 0; i <= segments; i++) {
    const a = (i / segments) * Math.PI * 2;
    points.push(new THREE.Vector3(Math.cos(a) * radius, Math.sin(a) * radius, 0));
  }
  return new THREE.BufferGeometry().setFromPoints(points);
}

function makePolygon(radius: number, sides: number): THREE.BufferGeometry {
  const points: THREE.Vector3[] = [];
  for (let i = 0; i <= sides; i++) {
    const a = (i / sides) * Math.PI * 2 + Math.PI / sides;
    points.push(new THREE.Vector3(Math.cos(a) * radius, Math.sin(a) * radius, 0));
  }
  return new THREE.BufferGeometry().setFromPoints(points);
}

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
    const camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 10);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    // --- Sparse geometric line-art: a handful of thin outlined shapes
    // drifting slowly on pure black, colored by the active project accent. ---
    const shapeDefs = [
      { geo: makeRing(2.6, 64), pos: [-4.5, 1.8], z: -4, speed: 0.03, opacity: 0.5, useAccent2: false },
      { geo: makeRing(1.4, 64), pos: [-4.2, 1.5], z: -3.9, speed: 0.04, opacity: 0.3, useAccent2: false },
      { geo: makePolygon(2.1, 6), pos: [4.8, -1.5], z: -5, speed: -0.025, opacity: 0.45, useAccent2: true },
      { geo: makeRing(3.4, 80), pos: [3.5, 2.6], z: -6, speed: 0.018, opacity: 0.22, useAccent2: true },
      { geo: makePolygon(1.5, 3), pos: [-2.5, -2.8], z: -4.5, speed: 0.05, opacity: 0.35, useAccent2: false },
    ];

    const rings: Ring[] = shapeDefs.map((d, i) => {
      const mat = new THREE.LineBasicMaterial({
        color: (d.useAccent2 ? target2Ref.current : target1Ref.current).clone(),
        transparent: true,
        opacity: d.opacity,
      });
      const mesh = new THREE.LineLoop(d.geo, mat);
      mesh.position.set(d.pos[0], d.pos[1], d.z);
      scene.add(mesh);
      return {
        mesh,
        mat,
        target: d.useAccent2 ? target2Ref.current : target1Ref.current,
        baseX: d.pos[0],
        baseY: d.pos[1],
        z: d.z,
        speed: d.speed,
        phase: i * 1.7,
      };
    });

    // --- Fine dot grid, very subtle, gives texture without color noise ---
    const dotCount = 260;
    const positions = new Float32Array(dotCount * 3);
    for (let i = 0; i < dotCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 28;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 18;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10 - 3;
    }
    const dotGeo = new THREE.BufferGeometry();
    dotGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const dotMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.018,
      transparent: true,
      opacity: 0.35,
    });
    const dots = new THREE.Points(dotGeo, dotMat);
    scene.add(dots);

    let raf = 0;
    let mouseX = 0;
    let mouseY = 0;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMouseMove);

    const clock = new THREE.Clock();
    const animate = () => {
      const t = clock.getElapsedTime();

      rings.forEach((r) => {
        r.mat.color.lerp(r.target, 0.015);
        r.mesh.rotation.z = t * r.speed;
        r.mesh.position.x = r.baseX + Math.sin(t * 0.05 + r.phase) * 0.3;
        r.mesh.position.y = r.baseY + Math.cos(t * 0.04 + r.phase) * 0.25;
      });

      dots.rotation.y = t * 0.003;

      camera.position.x += (mouseX * 0.5 - camera.position.x) * 0.02;
      camera.position.y += (-mouseY * 0.3 - camera.position.y) * 0.02;
      camera.lookAt(0, 0, -2);

      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    animate();

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMouseMove);
      renderer.dispose();
      shapeDefs.forEach((d) => d.geo.dispose());
      rings.forEach((r) => r.mat.dispose());
      dotGeo.dispose();
      dotMat.dispose();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 z-0 pointer-events-none"
      aria-hidden="true"
    />
  );
}
