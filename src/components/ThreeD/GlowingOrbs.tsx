import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface GlowingOrbsProps {
  count?: number;
  colors?: string[];
  size?: number;
  intensity?: number;
}

const GlowingOrbs = ({ 
  count = 6, 
  colors = ['#4a72f5', '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57'],
  size = 0.3,
  intensity = 2
}: GlowingOrbsProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Scene setup
    const scene = new THREE.Scene();
    
    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 5;
    
    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setClearColor(0x000000, 0);
    containerRef.current.appendChild(renderer.domElement);
    
    // Create glowing orbs
    const orbs: THREE.Mesh[] = [];
    const orbData: Array<{
      mesh: THREE.Mesh;
      originalPosition: THREE.Vector3;
      phase: number;
      speed: number;
    }> = [];
    
    for (let i = 0; i < count; i++) {
      const geometry = new THREE.SphereGeometry(size, 32, 32);
      const material = new THREE.MeshPhongMaterial({
        color: new THREE.Color(colors[i % colors.length]),
        transparent: true,
        opacity: 0.8,
        emissive: new THREE.Color(colors[i % colors.length]),
        emissiveIntensity: 0.3,
        specular: 0xffffff,
        shininess: 100,
      });
      
      const orb = new THREE.Mesh(geometry, material);
      
      // Position in a circle
      const angle = (i / count) * Math.PI * 2;
      const radius = 3;
      orb.position.x = Math.cos(angle) * radius;
      orb.position.y = Math.sin(angle) * radius;
      orb.position.z = (Math.random() - 0.5) * 2;
      
      scene.add(orb);
      orbs.push(orb);
      
      orbData.push({
        mesh: orb,
        originalPosition: orb.position.clone(),
        phase: Math.random() * Math.PI * 2,
        speed: 0.5 + Math.random() * 1.5
      });
    }
    
    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    scene.add(ambientLight);
    
    // Animation
    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      
      time += 0.01;
      
      orbData.forEach(({ mesh, originalPosition, phase, speed }) => {
        // Orbital motion
        const angle = time * speed * 0.1 + phase;
        mesh.position.x = originalPosition.x + Math.cos(angle) * 0.5;
        mesh.position.y = originalPosition.y + Math.sin(angle) * 0.5;
        mesh.position.z = originalPosition.z + Math.sin(time * speed + phase) * 0.3;
        
        // Rotation
        mesh.rotation.x += 0.01;
        mesh.rotation.y += 0.01;
        
        // Pulsing glow
        const pulse = 1 + Math.sin(time * speed * 2 + phase) * 0.2;
        mesh.scale.setScalar(pulse);
        
        // Color intensity variation
        const material = mesh.material as THREE.MeshPhongMaterial;
        material.emissiveIntensity = 0.3 + Math.sin(time * speed + phase) * 0.2;
      });
      
      renderer.render(scene, camera);
    };
    
    animate();
    
    // Resize handler
    const handleResize = () => {
      if (!containerRef.current) return;
      
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [count, colors, size, intensity]);
  
  return <div ref={containerRef} className="w-full h-full absolute inset-0 -z-10" />;
};

export default GlowingOrbs;
