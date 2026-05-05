import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface FloatingSpheresProps {
  count?: number;
  colors?: string[];
  size?: number;
  speed?: number;
}

const FloatingSpheres = ({ 
  count = 8, 
  colors = ['#4a72f5', '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#54a0ff'],
  size = 0.1,
  speed = 0.01
}: FloatingSpheresProps) => {
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
    
    // Create spheres
    const spheres: THREE.Mesh[] = [];
    const sphereData: Array<{
      mesh: THREE.Mesh;
      originalY: number;
      phase: number;
      radius: number;
      speed: number;
    }> = [];
    
    for (let i = 0; i < count; i++) {
      const geometry = new THREE.SphereGeometry(size + Math.random() * 0.05, 32, 32);
      const material = new THREE.MeshPhongMaterial({
        color: new THREE.Color(colors[i % colors.length]),
        transparent: true,
        opacity: 0.7,
        specular: 0xffffff,
        shininess: 100,
      });
      
      const sphere = new THREE.Mesh(geometry, material);
      
      // Random positioning
      const radius = 2 + Math.random() * 2;
      const angle = (i / count) * Math.PI * 2;
      sphere.position.x = Math.cos(angle) * radius;
      sphere.position.y = Math.sin(angle) * radius;
      sphere.position.z = (Math.random() - 0.5) * 4;
      
      scene.add(sphere);
      spheres.push(sphere);
      
      sphereData.push({
        mesh: sphere,
        originalY: sphere.position.y,
        phase: Math.random() * Math.PI * 2,
        radius: radius,
        speed: 0.5 + Math.random() * 1.5
      });
    }
    
    // Add lights
    const frontLight = new THREE.DirectionalLight(0xffffff, 1);
    frontLight.position.set(0, 0, 1);
    scene.add(frontLight);
    
    const backLight = new THREE.DirectionalLight(0x0044ff, 0.7);
    backLight.position.set(0, 0, -1);
    scene.add(backLight);
    
    const ambientLight = new THREE.AmbientLight(0x404040, 0.8);
    scene.add(ambientLight);
    
    // Animation
    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      
      time += speed;
      
      sphereData.forEach(({ mesh, originalY, phase, radius, speed: sphereSpeed }) => {
        // Floating motion
        mesh.position.y = originalY + Math.sin(time * sphereSpeed + phase) * 0.3;
        
        // Orbital motion
        const angle = time * sphereSpeed * 0.1 + phase;
        mesh.position.x = Math.cos(angle) * radius;
        mesh.position.z = Math.sin(angle) * radius * 0.5;
        
        // Rotation
        mesh.rotation.x += 0.01;
        mesh.rotation.y += 0.01;
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
  }, [count, colors, size, speed]);
  
  return <div ref={containerRef} className="w-full h-full absolute inset-0 -z-10" />;
};

export default FloatingSpheres;
