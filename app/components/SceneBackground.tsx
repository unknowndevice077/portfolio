"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function SceneBackground() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 1.2, 6.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    // --- Perspective grid floor (synthwave style) ---
    const gridCyan = new THREE.GridHelper(40, 40, 0x00fff2, 0x14141c);
    gridCyan.position.y = -1.6;
    (gridCyan.material as THREE.Material).transparent = true;
    (gridCyan.material as THREE.Material).opacity = 0.35;
    scene.add(gridCyan);

    // --- Wireframe icosahedron centerpiece ---
    const icoGeo = new THREE.IcosahedronGeometry(1.6, 1);
    const icoMat = new THREE.MeshBasicMaterial({
      color: 0x00fff2,
      wireframe: true,
      transparent: true,
      opacity: 0.55,
    });
    const ico = new THREE.Mesh(icoGeo, icoMat);
    ico.position.set(2.2, 0.6, -1.5);
    scene.add(ico);

    const icoGeo2 = new THREE.OctahedronGeometry(1, 0);
    const icoMat2 = new THREE.MeshBasicMaterial({
      color: 0xff2fd6,
      wireframe: true,
      transparent: true,
      opacity: 0.4,
    });
    const ico2 = new THREE.Mesh(icoGeo2, icoMat2);
    ico2.position.set(-2.6, -0.2, -1);
    scene.add(ico2);

    // --- Particle field ---
    const particleCount = 400;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 30;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 15;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20 - 5;
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x00fff2,
      size: 0.03,
      transparent: true,
      opacity: 0.6,
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

      ico.rotation.x = t * 0.15;
      ico.rotation.y = t * 0.22;
      ico2.rotation.x = -t * 0.12;
      ico2.rotation.y = t * 0.18;

      particles.rotation.y = t * 0.01;

      camera.position.x += (mouseX * 0.8 - camera.position.x) * 0.02;
      camera.position.y += (1.2 - mouseY * 0.4 - camera.position.y) * 0.02;
      camera.lookAt(0, 0, -1);

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
      icoGeo.dispose();
      icoMat.dispose();
      icoGeo2.dispose();
      icoMat2.dispose();
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
      aria-hidden="true"
    />
  );
}
