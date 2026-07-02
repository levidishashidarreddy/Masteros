import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const ThreeJSAnimation = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Abstract "Growth" Geometry: A series of ascending rings
    const group = new THREE.Group();
    const material = new THREE.MeshPhongMaterial({
      color: 0x8b5cf6,
      shininess: 100,
      specular: 0x444444,
      transparent: true,
      opacity: 0.9
    });

    for (let i = 0; i < 12; i++) {
      const radius = 1 + i * 0.2;
      const geometry = new THREE.TorusGeometry(radius, 0.025, 16, 100);
      const torus = new THREE.Mesh(geometry, material);
      torus.rotation.x = Math.PI / 2;
      torus.position.y = i * 0.15 - 1;
      group.add(torus);
    }
    scene.add(group);

    const light = new THREE.PointLight(0xffffff, 1.2, 100);
    light.position.set(5, 5, 5);
    scene.add(light);

    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);

    camera.position.z = 5;

    let animationFrameId;

    const animate = () => {
      group.rotation.y += 0.005;
      group.children.forEach((child, i) => {
        child.rotation.x += 0.01 * (i % 2 === 0 ? 1 : -1);
        child.position.y += Math.sin(Date.now() * 0.001 + i) * 0.002;
      });

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      // Dispose materials/geometries
      group.children.forEach((child) => {
        child.geometry.dispose();
      });
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return <div ref={containerRef} className="w-full h-full" />;
};

export default ThreeJSAnimation;
