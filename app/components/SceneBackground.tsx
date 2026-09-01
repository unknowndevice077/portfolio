"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

type Blob = {
  mesh: THREE.Mesh;
  mat: THREE.MeshBasicMaterial;
  baseX: number;
  baseY: number;
  speed: number;
  phase: number;
  targetColor: THREE.Color;
};

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
    camera.position.set(0, 0, 9);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    // --- Rich, layered gradient-mesh blobs: deep indigo/navy base with
    // shifting accent color — inspired by a moody neon-lit city-at-night
    // palette, drifting slowly for a premium "alive" feel. ---
    const orbGeo = new THREE.SphereGeometry(1, 24, 24);
    const palette = [
      { color: new THREE.Color("#1e1b4b"), pos: [-4, 2, -4], scale: 3.4, opacity: 0.35, speed: 0.06 },
      { color: new THREE.Color("#3730a3"), pos: [4, -1.5, -5], scale: 3.8, opacity: 0.28, speed: 0.05 },
      { color: target1Ref.current.clone(), pos: [-2.5, -2, -3], scale: 2.2, opacity: 0.22, speed: 0.09 },
      { color: target2Ref.current.clone(), pos: [3, 2.2, -3.5], scale: 2.4, opacity: 0.2, speed: 0.07 },
      { color: new THREE.Color("#be185d"), pos: [0.5, -3, -6], scale: 3, opacity: 0.15, speed: 0.04 },
    ];

    const blobs: Blob[] = palette.map((p, i) => {
      const mat = new THREE.MeshBasicMaterial({
        color: p.color.clone(),
        transparent: true,
        opacity: p.opacity,
      });
      const mesh = new THREE.Mesh(orbGeo, mat);
      mesh.position.set(p.pos[0], p.pos[1], p.pos[2]);
      mesh.scale.setScalar(p.scale);
      scene.add(mesh);
      return {
        mesh,
        mat,
        baseX: p.pos[0],
        baseY: p.pos[1],
        speed: p.speed,
        phase: i * 1.3,
        targetColor: i === 2 ? target1Ref.current : i === 3 ? target2Ref.current : p.color.clone(),
      };
    });

    // --- Faint vertical "skyline" lines, very subtle, evokes a city horizon ---
    const skylineGroup = new THREE.Group();
    const lineMat = new THREE.LineBasicMaterial({ color: 0x818cf8, transparent: true, opacity: 0.06 });
    for (let i = 0; i < 14; i++) {
      const x = (Math.random() - 0.5) * 22;
      const h = 1 + Math.random() * 3.5;
      const points = [
        new THREE.Vector3(x, -4, -9 - Math.random() * 4),
        new THREE.Vector3(x, -4 + h, -9 - Math.random() * 4),
      ];
      const geo = new THREE.BufferGeometry().setFromPoints(points);
      skylineGroup.add(new THREE.Line(geo, lineMat));
    }
    scene.add(skylineGroup);

    // --- Fine particle drift (like distant lights / grain) ---
    const particleCount = 180;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 26;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 16;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 14 - 3;
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.025,
      transparent: true,
      opacity: 0.3,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

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

      blobs.forEach((b) => {
        b.mat.color.lerp(b.targetColor, 0.015);
        b.mesh.position.x = b.baseX + Math.sin(t * b.speed + b.phase) * 1.1;
        b.mesh.position.y = b.baseY + Math.cos(t * b.speed * 0.8 + b.phase) * 0.8;
      });

      skylineGroup.position.x = Math.sin(t * 0.01) * 0.3;
      particles.rotation.y = t * 0.004;

      camera.position.x += (mouseX * 0.5 - camera.position.x) * 0.015;
      camera.position.y += (-mouseY * 0.3 - camera.position.y) * 0.015;
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
      orbGeo.dispose();
      blobs.forEach((b) => b.mat.dispose());
      lineMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ filter: "blur(50px)" }}
      aria-hidden="true"
    />
  );
}
