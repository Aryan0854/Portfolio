import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const Simple3DBackground = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    containerRef.current.appendChild(renderer.domElement);

    // Create floating cubes
    const cubes: THREE.Mesh[] = [];
    const cubeData: Array<{
      mesh: THREE.Mesh;
      originalY: number;
      phase: number;
      speed: number;
    }> = [];

    for (let i = 0; i < 8; i++) {
      const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
      const material = new THREE.MeshPhongMaterial({
        color: new THREE.Color().setHSL(i / 8, 0.7, 0.6),
        transparent: true,
        opacity: 0.6,
        wireframe: i % 2 === 0,
      });
      
      const cube = new THREE.Mesh(geometry, material);
      cube.position.set(
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 15
      );
      
      scene.add(cube);
      cubes.push(cube);
      
      cubeData.push({
        mesh: cube,
        originalY: cube.position.y,
        phase: Math.random() * Math.PI * 2,
        speed: 0.5 + Math.random() * 1.5,
      });
    }

    // Create floating spheres
    const spheres: THREE.Mesh[] = [];
    const sphereData: Array<{
      mesh: THREE.Mesh;
      originalY: number;
      phase: number;
      speed: number;
    }> = [];

    for (let i = 0; i < 6; i++) {
      const geometry = new THREE.SphereGeometry(0.3, 32, 32);
      const material = new THREE.MeshPhongMaterial({
        color: new THREE.Color().setHSL(i / 6, 0.8, 0.7),
        transparent: true,
        opacity: 0.7,
        emissive: new THREE.Color().setHSL(i / 6, 0.5, 0.2),
        emissiveIntensity: 0.3,
      });
      
      const sphere = new THREE.Mesh(geometry, material);
      sphere.position.set(
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 12
      );
      
      scene.add(sphere);
      spheres.push(sphere);
      
      sphereData.push({
        mesh: sphere,
        originalY: sphere.position.y,
        phase: Math.random() * Math.PI * 2,
        speed: 0.3 + Math.random() * 1.2,
      });
    }

    // Create particle system
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 500;
    const posArray = new Float32Array(particlesCount * 3);
    
    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 20;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.05,
      color: 0x4a72f5,
      transparent: true,
      opacity: 0.6,
    });
    
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // Add lights
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    // Mouse interaction
    let mouseX = 0;
    let mouseY = 0;
    
    const handleMouseMove = (event: MouseEvent) => {
      mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    
    window.addEventListener('mousemove', handleMouseMove);

    // Animation loop
    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      
      time += 0.01;
      
      // Animate cubes
      cubeData.forEach(({ mesh, originalY, phase, speed }) => {
        mesh.rotation.x += 0.01;
        mesh.rotation.y += 0.01;
        mesh.position.y = originalY + Math.sin(time * speed + phase) * 0.5;
      });
      
      // Animate spheres
      sphereData.forEach(({ mesh, originalY, phase, speed }) => {
        mesh.rotation.x += 0.005;
        mesh.rotation.y += 0.005;
        mesh.position.y = originalY + Math.sin(time * speed + phase) * 0.3;
      });
      
      // Animate particles
      particlesMesh.rotation.x += 0.0005;
      particlesMesh.rotation.y += 0.0005;
      particlesMesh.rotation.y += mouseX * 0.0005;
      particlesMesh.rotation.x += mouseY * 0.0005;
      
      // Animate camera
      camera.position.x = mouseX * 0.5;
      camera.position.y = mouseY * 0.5;
      camera.lookAt(scene.position);
      
      renderer.render(scene, camera);
    };
    
    animate();

    // Resize handler
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 -z-10 w-full h-full"
      style={{ 
        background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)'
      }}
    />
  );
};

export default Simple3DBackground;
