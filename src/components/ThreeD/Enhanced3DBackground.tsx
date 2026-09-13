import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const Enhanced3DBackground = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.top = '0';
    renderer.domElement.style.left = '0';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';

    containerRef.current.appendChild(renderer.domElement);

    const objectData: Array<{
      mesh: THREE.Mesh;
      originalPosition: THREE.Vector3;
      phase: number;
      speed: number;
    }> = [];

    const placeAwayFromText = (x: number) => {
      if (x > -1.2 && x < 1.2) {
        return x >= 0 ? 2.4 + Math.random() * 2 : -2.4 - Math.random() * 2;
      }
      return x;
    };

    for (let i = 0; i < 6; i++) {
      const geometry = new THREE.BoxGeometry(
        0.5 + Math.random() * 0.6,
        0.5 + Math.random() * 0.6,
        0.5 + Math.random() * 0.6
      );
      const material = new THREE.MeshPhongMaterial({
        color: new THREE.Color().setHSL(0.7 + Math.random() * 0.1, 0.75, 0.62),
        transparent: true,
        opacity: 0.75,
        specular: 0xffffff,
        shininess: 120,
        emissive: new THREE.Color().setHSL(0.72, 0.5, 0.15),
        emissiveIntensity: 0.35,
      });

      const cube = new THREE.Mesh(geometry, material);
      cube.position.set(
        placeAwayFromText((Math.random() - 0.5) * 12),
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10
      );
      scene.add(cube);
      objectData.push({
        mesh: cube,
        originalPosition: cube.position.clone(),
        phase: Math.random() * Math.PI * 2,
        speed: 0.5 + Math.random() * 1.5,
      });
    }

    for (let i = 0; i < 8; i++) {
      const geometry = new THREE.SphereGeometry(0.22 + Math.random() * 0.38, 32, 32);
      const material = new THREE.MeshPhongMaterial({
        color: new THREE.Color().setHSL(0.68 + Math.random() * 0.12, 0.85, 0.68),
        transparent: true,
        opacity: 0.8,
        emissive: new THREE.Color().setHSL(0.7, 0.6, 0.22),
        emissiveIntensity: 0.45,
        specular: 0xffffff,
        shininess: 120,
      });

      const sphere = new THREE.Mesh(geometry, material);
      sphere.position.set(
        placeAwayFromText((Math.random() - 0.5) * 14),
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 12
      );
      scene.add(sphere);
      objectData.push({
        mesh: sphere,
        originalPosition: sphere.position.clone(),
        phase: Math.random() * Math.PI * 2,
        speed: 0.3 + Math.random() * 1.2,
      });
    }

    for (let i = 0; i < 3; i++) {
      const geometry = new THREE.TorusGeometry(
        0.9 + Math.random() * 0.5,
        0.22 + Math.random() * 0.18,
        16,
        100
      );
      const material = new THREE.MeshPhongMaterial({
        color: new THREE.Color().setHSL(0.7 + Math.random() * 0.08, 0.75, 0.6),
        transparent: true,
        opacity: 0.65,
        wireframe: i === 0,
        specular: 0xffffff,
        shininess: 120,
        emissive: new THREE.Color().setHSL(0.72, 0.5, 0.12),
        emissiveIntensity: 0.3,
      });

      const torus = new THREE.Mesh(geometry, material);
      const side = i % 2 === 0 ? 1 : -1;
      torus.position.set(
        side * (3.2 + Math.random() * 2.4),
        (Math.random() - 0.5) * 6,
        -1 - Math.random() * 4
      );
      scene.add(torus);
      objectData.push({
        mesh: torus,
        originalPosition: torus.position.clone(),
        phase: Math.random() * Math.PI * 2,
        speed: 0.4 + Math.random() * 1.0,
      });
    }

    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 1400;
    const posArray = new Float32Array(particlesCount * 3);
    const colorArray = new Float32Array(particlesCount * 3);
    const sizeArray = new Float32Array(particlesCount);

    for (let i = 0; i < particlesCount; i++) {
      posArray[i * 3] = (Math.random() - 0.5) * 22;
      posArray[i * 3 + 1] = (Math.random() - 0.5) * 22;
      posArray[i * 3 + 2] = (Math.random() - 0.5) * 22;

      const color = new THREE.Color().setHSL(0.68 + Math.random() * 0.12, 0.85, 0.65);
      colorArray[i * 3] = color.r;
      colorArray[i * 3 + 1] = color.g;
      colorArray[i * 3 + 2] = color.b;
      sizeArray[i] = Math.random() * 0.12 + 0.03;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));
    particlesGeometry.setAttribute('size', new THREE.BufferAttribute(sizeArray, 1));

    const particlesMesh = new THREE.Points(
      particlesGeometry,
      new THREE.PointsMaterial({
        size: 0.06,
        vertexColors: true,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending,
      })
    );
    scene.add(particlesMesh);

    scene.add(new THREE.AmbientLight(0x606080, 0.85));

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.1);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0x8b5cf6, 1.1, 100);
    pointLight.position.set(2, 1, 4);
    scene.add(pointLight);

    const accentLight = new THREE.PointLight(0x6366f1, 0.8, 80);
    accentLight.position.set(-3, -1, 3);
    scene.add(accentLight);

    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('mousemove', handleMouseMove);

    let time = 0;
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);
      time += 0.01;

      objectData.forEach(({ mesh, originalPosition, phase, speed }) => {
        mesh.position.y = originalPosition.y + Math.sin(time * speed + phase) * 0.5;
        mesh.position.x = originalPosition.x + Math.cos(time * speed * 0.7 + phase) * 0.3;
        mesh.position.z = originalPosition.z + Math.sin(time * speed * 0.5 + phase) * 0.2;

        mesh.rotation.x += 0.01 * speed + mouseY * 0.01;
        mesh.rotation.y += 0.01 * speed + mouseX * 0.01;
        mesh.rotation.z += 0.005 * speed;

        mesh.scale.setScalar(1 + Math.sin(time * speed * 2 + phase) * 0.1);
      });

      particlesMesh.rotation.x += 0.0005 + mouseY * 0.0006;
      particlesMesh.rotation.y += 0.0005 + mouseX * 0.0006;

      const positions = particlesMesh.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particlesCount; i++) {
        positions[i * 3 + 1] += Math.sin(time + i * 0.01) * 0.002;
        positions[i * 3] += Math.cos(time + i * 0.01) * 0.001;
      }
      particlesMesh.geometry.attributes.position.needsUpdate = true;

      camera.position.x += (mouseX * 0.45 - camera.position.x) * 0.05;
      camera.position.y += (mouseY * 0.35 - camera.position.y) * 0.05;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      if (animationIdRef.current) cancelAnimationFrame(animationIdRef.current);
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 -z-10 w-screen h-screen overflow-hidden pointer-events-none"
      style={{
        background: 'linear-gradient(135deg, #0b0e14 0%, #11151f 50%, #162035 100%)',
      }}
    />
  );
};

export default Enhanced3DBackground;
