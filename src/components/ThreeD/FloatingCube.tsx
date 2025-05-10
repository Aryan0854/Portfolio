import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface FloatingCubeProps {
  position?: [number, number, number];
  color?: string;
  size?: number;
  opacity?: number;
}

const FloatingCube = ({ 
  position = [0, 0, 0], 
  color = '#4a72f5', 
  size = 1,
  opacity = 0.6
}: FloatingCubeProps) => {
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
    
    // Create cube
    const geometry = new THREE.BoxGeometry(size, size, size);
    const material = new THREE.MeshPhongMaterial({
      color: new THREE.Color(color),
      transparent: true,
      opacity: opacity,
      specular: 0xffffff,
      shininess: 100,
      side: THREE.DoubleSide,
    });
    
    const cube = new THREE.Mesh(geometry, material);
    cube.position.set(...position);
    scene.add(cube);
    
    // Add lights
    const frontLight = new THREE.DirectionalLight(0xffffff, 1);
    frontLight.position.set(0, 0, 1);
    scene.add(frontLight);
    
    const backLight = new THREE.DirectionalLight(0x0044ff, 0.7);
    backLight.position.set(0, 0, -1);
    scene.add(backLight);
    
    const ambientLight = new THREE.AmbientLight(0x404040, 1);
    scene.add(ambientLight);
    
    // Animation
    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      
      time += 0.01;
      
      cube.rotation.x += 0.005;
      cube.rotation.y += 0.01;
      
      // Floating effect
      cube.position.y = position[1] + Math.sin(time) * 0.1;
      
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
  }, [position, color, size, opacity]);
  
  return <div ref={containerRef} className="w-full h-full absolute inset-0 -z-10" />;
};

export default FloatingCube;