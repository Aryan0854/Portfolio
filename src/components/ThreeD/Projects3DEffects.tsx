import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const Projects3DEffects = () => {
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

    // Create floating geometric shapes
    const shapes: THREE.Mesh[] = [];
    const shapeData: Array<{
      mesh: THREE.Mesh;
      originalPosition: THREE.Vector3;
      phase: number;
      speed: number;
    }> = [];

    // Create different geometric shapes
    const geometries = [
      new THREE.BoxGeometry(0.3, 0.3, 0.3),
      new THREE.SphereGeometry(0.2, 16, 16),
      new THREE.ConeGeometry(0.2, 0.4, 8),
      new THREE.CylinderGeometry(0.15, 0.15, 0.4, 8),
      new THREE.TorusGeometry(0.2, 0.1, 8, 16),
      new THREE.OctahedronGeometry(0.2),
    ];

    for (let i = 0; i < 12; i++) {
      const geometry = geometries[i % geometries.length];
      const material = new THREE.MeshPhongMaterial({
        color: new THREE.Color().setHSL(i / 12, 0.7, 0.6),
        transparent: true,
        opacity: 0.4,
        wireframe: i % 3 === 0,
      });
      
      const shape = new THREE.Mesh(geometry, material);
      shape.position.set(
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20
      );
      
      scene.add(shape);
      shapes.push(shape);
      
      shapeData.push({
        mesh: shape,
        originalPosition: shape.position.clone(),
        phase: Math.random() * Math.PI * 2,
        speed: 0.3 + Math.random() * 1.0,
      });
    }

    // Add lights
    const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    // Animation loop
    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      
      time += 0.01;
      
      // Animate shapes
      shapeData.forEach(({ mesh, originalPosition, phase, speed }) => {
        mesh.rotation.x += 0.01 * speed;
        mesh.rotation.y += 0.01 * speed;
        mesh.rotation.z += 0.005 * speed;
        
        // Floating motion
        mesh.position.y = originalPosition.y + Math.sin(time * speed + phase) * 0.3;
        mesh.position.x = originalPosition.x + Math.cos(time * speed * 0.7 + phase) * 0.2;
        mesh.position.z = originalPosition.z + Math.sin(time * speed * 0.5 + phase) * 0.1;
        
        // Scale pulsing
        const scale = 1 + Math.sin(time * speed * 2 + phase) * 0.1;
        mesh.scale.setScalar(scale);
      });
      
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
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 -z-10 w-full h-full opacity-30"
    />
  );
};

export default Projects3DEffects;
