import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';

interface MorphingTextProps {
  text: string;
  position?: [number, number, number];
  size?: number;
  color?: string;
}

const MorphingText = ({ 
  text, 
  position = [0, 0, 0], 
  size = 0.3, 
  color = '#4a72f5' 
}: MorphingTextProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Scene setup
    const scene = new THREE.Scene();
    
    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 5;
    
    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    containerRef.current.appendChild(renderer.domElement);
    
    // Load font
    const fontLoader = new FontLoader();
    
    fontLoader.load(
      'https://threejs.org/examples/fonts/helvetiker_bold.typeface.json',
      (font) => {
        const textGeometry = new TextGeometry(text, {
          font: font,
          size: size,
          height: 0.1,
          curveSegments: 12,
          bevelEnabled: true,
          bevelThickness: 0.01,
          bevelSize: 0.02,
          bevelOffset: 0,
          bevelSegments: 5
        });
        
        textGeometry.center();
        
        const textMaterial = new THREE.MeshPhongMaterial({ 
          color: new THREE.Color(color),
          specular: new THREE.Color(0xffffff),
          shininess: 100,
          transparent: true,
          opacity: 0.9,
        });
        
        const textMesh = new THREE.Mesh(textGeometry, textMaterial);
        textMesh.position.set(...position);
        scene.add(textMesh);
        
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
        const animate = () => {
          requestAnimationFrame(animate);
          
          textMesh.rotation.y += 0.005;
          
          renderer.render(scene, camera);
        };
        
        animate();
      }
    );
    
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
  }, [text, position, size, color]);
  
  return <div ref={containerRef} className="absolute inset-0 -z-10 opacity-60" />;
};

export default MorphingText;