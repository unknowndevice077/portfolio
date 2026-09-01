"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

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
      55,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 8);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    // --- Soft floating orbs (blurred via CSS on the canvas wrapper) ---
    const orbGeo = new THREE.SphereGeometry(1, 32, 32);
    const orbMat1 = new THREE.MeshBasicMaterial({
      color: target1Ref.current.clone(),
      transparent: true,
      opacity: 0.15,
    });
    const orb1 = new THREE.Mesh(orbGeo, orbMat1);
    orb1.position.set(-3, 1.5, -3);
    orb1.scale.setScalar(2.6);
    scene.add(orb1);

    const orbMat2 = new THREE.MeshBasicMaterial({
      color: target2Ref.current.clone(),
      transparent: true,
      opacity: 0.12,
    });
    const orb2 = new THREE.Mesh(orbGeo, orbMat2);
    orb2.position.set(3.5, -1, -4);
    orb2.scale.setScalar(3.2);
    scene.add(orb2);

    // --- Fine particle drift, low opacity, subtle ---
    const particleCount = 220;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 24;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 14;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 12 - 3;
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.02,
      transparent: true,
      opacity: 0.25,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // --- Thin wireframe accent shape, very subtle ---
    const wireGeo = new THREE.IcosahedronGeometry(2.2, 1);
    const wireMat = new THREE.MeshBasicMaterial({
      color: target1Ref.current.clone(),
      wireframe: true,
      transparent: true,
      opacity: 0.08,
    });
    const wire = new THREE.Mesh(wireGeo, wireMat);
    wire.position.set(2, 0.5, -5);
    scene.add(wire);

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

      orbMat1.color.lerp(target1Ref.current, 0.02);
      orbMat2.color.lerp(target2Ref.current, 0.02);
      wireMat.color.lerp(target1Ref.current, 0.02);

      orb1.position.x = -3 + Math.sin(t * 0.15) * 0.6;
      orb1.position.y = 1.5 + Math.cos(t * 0.12) * 0.4;
      orb2.position.x = 3.5 + Math.cos(t * 0.1) * 0.5;
      orb2.position.y = -1 + Math.sin(t * 0.13) * 0.5;

      wire.rotation.x = t * 0.03;
      wire.rotation.y = t * 0.05;

      particles.rotation.y = t * 0.005;

      camera.position.x += (mouseX * 0.4 - camera.position.x) * 0.015;
      camera.position.y += (-mouseY * 0.25 - camera.position.y) * 0.015;
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
      orbMat1.dispose();
      orbMat2.dispose();
      wireGeo.dispose();
      wireMat.dispose();
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
      style={{ filter: "blur(40px)" }}
      aria-hidden="true"
    />
  );
}
