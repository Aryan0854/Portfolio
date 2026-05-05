import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const Enhanced3DBackground = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animationIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 5;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: true,
      powerPreference: "high-performance"
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current = renderer;
    
    containerRef.current.appendChild(renderer.domElement);

    // Create multiple floating objects
    const objects: THREE.Mesh[] = [];
    const objectData: Array<{
      mesh: THREE.Mesh;
      originalPosition: THREE.Vector3;
      phase: number;
      speed: number;
      type: 'cube' | 'sphere' | 'torus';
    }> = [];

    // Create cubes
    for (let i = 0; i < 4; i++) {
      const geometry = new THREE.BoxGeometry(0.5 + Math.random() * 0.5, 0.5 + Math.random() * 0.5, 0.5 + Math.random() * 0.5);
      const material = new THREE.MeshPhongMaterial({
        color: new THREE.Color().setHSL(Math.random(), 0.7, 0.6),
        transparent: true,
        opacity: 0.6,
        specular: 0xffffff,
        shininess: 100,
      });
      
      const cube = new THREE.Mesh(geometry, material);
      cube.position.set(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10
      );
      
      scene.add(cube);
      objects.push(cube);
      
      objectData.push({
        mesh: cube,
        originalPosition: cube.position.clone(),
        phase: Math.random() * Math.PI * 2,
        speed: 0.5 + Math.random() * 1.5,
        type: 'cube'
      });
    }

    // Create spheres
    for (let i = 0; i < 6; i++) {
      const geometry = new THREE.SphereGeometry(0.2 + Math.random() * 0.3, 32, 32);
      const material = new THREE.MeshPhongMaterial({
        color: new THREE.Color().setHSL(Math.random(), 0.8, 0.7),
        transparent: true,
        opacity: 0.7,
        emissive: new THREE.Color().setHSL(Math.random(), 0.5, 0.2),
        emissiveIntensity: 0.3,
        specular: 0xffffff,
        shininess: 100,
      });
      
      const sphere = new THREE.Mesh(geometry, material);
      sphere.position.set(
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 12
      );
      
      scene.add(sphere);
      objects.push(sphere);
      
      objectData.push({
        mesh: sphere,
        originalPosition: sphere.position.clone(),
        phase: Math.random() * Math.PI * 2,
        speed: 0.3 + Math.random() * 1.2,
        type: 'sphere'
      });
    }

    // Create torus
    for (let i = 0; i < 2; i++) {
      const geometry = new THREE.TorusGeometry(0.8 + Math.random() * 0.4, 0.2 + Math.random() * 0.2, 16, 100);
      const material = new THREE.MeshPhongMaterial({
        color: new THREE.Color().setHSL(Math.random(), 0.7, 0.6),
        transparent: true,
        opacity: 0.5,
        wireframe: Math.random() > 0.5,
        specular: 0xffffff,
        shininess: 100,
      });
      
      const torus = new THREE.Mesh(geometry, material);
      torus.position.set(
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 8
      );
      
      scene.add(torus);
      objects.push(torus);
      
      objectData.push({
        mesh: torus,
        originalPosition: torus.position.clone(),
        phase: Math.random() * Math.PI * 2,
        speed: 0.4 + Math.random() * 1.0,
        type: 'torus'
      });
    }

    // Create particle system
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 1000;
    
    const posArray = new Float32Array(particlesCount * 3);
    const colorArray = new Float32Array(particlesCount * 3);
    const sizeArray = new Float32Array(particlesCount);
    
    for (let i = 0; i < particlesCount; i++) {
      // Position
      posArray[i * 3] = (Math.random() - 0.5) * 20;
      posArray[i * 3 + 1] = (Math.random() - 0.5) * 20;
      posArray[i * 3 + 2] = (Math.random() - 0.5) * 20;
      
      // Color
      const hue = Math.random();
      const color = new THREE.Color().setHSL(hue, 0.8, 0.6);
      colorArray[i * 3] = color.r;
      colorArray[i * 3 + 1] = color.g;
      colorArray[i * 3 + 2] = color.b;
      
      // Size
      sizeArray[i] = Math.random() * 0.1 + 0.02;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));
    particlesGeometry.setAttribute('size', new THREE.BufferAttribute(sizeArray, 1));
    
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.05,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });
    
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // Add lights
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    const pointLight = new THREE.PointLight(0x4a72f5, 0.5, 100);
    pointLight.position.set(0, 0, 5);
    scene.add(pointLight);

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
      animationIdRef.current = requestAnimationFrame(animate);
      
      time += 0.01;
      
      // Animate objects
      objectData.forEach(({ mesh, originalPosition, phase, speed, type }) => {
        // Floating motion
        mesh.position.y = originalPosition.y + Math.sin(time * speed + phase) * 0.5;
        mesh.position.x = originalPosition.x + Math.cos(time * speed * 0.7 + phase) * 0.3;
        mesh.position.z = originalPosition.z + Math.sin(time * speed * 0.5 + phase) * 0.2;
        
        // Rotation
        mesh.rotation.x += 0.01 * speed;
        mesh.rotation.y += 0.01 * speed;
        mesh.rotation.z += 0.005 * speed;
        
        // Scale pulsing
        const scale = 1 + Math.sin(time * speed * 2 + phase) * 0.1;
        mesh.scale.setScalar(scale);
        
        // Mouse interaction
        mesh.rotation.y += mouseX * 0.01;
        mesh.rotation.x += mouseY * 0.01;
      });
      
      // Animate particles
      particlesMesh.rotation.x += 0.0005;
      particlesMesh.rotation.y += 0.0005;
      particlesMesh.rotation.y += mouseX * 0.0005;
      particlesMesh.rotation.x += mouseY * 0.0005;
      
      // Animate particle positions
      const positions = particlesMesh.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particlesCount; i++) {
        positions[i * 3 + 1] += Math.sin(time + i * 0.01) * 0.002;
        positions[i * 3] += Math.cos(time + i * 0.01) * 0.001;
      }
      particlesMesh.geometry.attributes.position.needsUpdate = true;
      
      // Animate particle sizes
      const sizes = particlesMesh.geometry.attributes.size.array as Float32Array;
      for (let i = 0; i < particlesCount; i++) {
        sizes[i] = (Math.sin(time * 2 + i * 0.1) * 0.05 + 0.05);
      }
      particlesMesh.geometry.attributes.size.needsUpdate = true;
      
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
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
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
      className="fixed inset-0 -z-10 w-full h-full"
      style={{ 
        background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)'
      }}
    />
  );
};

export default Enhanced3DBackground;
