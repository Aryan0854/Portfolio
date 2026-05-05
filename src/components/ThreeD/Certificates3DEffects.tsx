import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const Certificates3DEffects = () => {
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

    // Create floating certificate-like shapes (rectangles)
    const certificates: THREE.Mesh[] = [];
    const certData: Array<{
      mesh: THREE.Mesh;
      originalPosition: THREE.Vector3;
      phase: number;
      speed: number;
    }> = [];

    for (let i = 0; i < 8; i++) {
      const geometry = new THREE.PlaneGeometry(0.8, 0.6);
      const material = new THREE.MeshPhongMaterial({
        color: new THREE.Color().setHSL(i / 8, 0.6, 0.5),
        transparent: true,
        opacity: 0.3,
        side: THREE.DoubleSide,
      });
      
      const certificate = new THREE.Mesh(geometry, material);
      certificate.position.set(
        (Math.random() - 0.5) * 18,
        (Math.random() - 0.5) * 18,
        (Math.random() - 0.5) * 18
      );
      
      // Rotate to face different directions
      certificate.rotation.x = Math.random() * Math.PI;
      certificate.rotation.y = Math.random() * Math.PI;
      certificate.rotation.z = Math.random() * Math.PI;
      
      scene.add(certificate);
      certificates.push(certificate);
      
      certData.push({
        mesh: certificate,
        originalPosition: certificate.position.clone(),
        phase: Math.random() * Math.PI * 2,
        speed: 0.2 + Math.random() * 0.8,
      });
    }

    // Create floating stars/achievements
    const stars: THREE.Mesh[] = [];
    const starData: Array<{
      mesh: THREE.Mesh;
      originalPosition: THREE.Vector3;
      phase: number;
      speed: number;
    }> = [];

    for (let i = 0; i < 6; i++) {
      const geometry = new THREE.OctahedronGeometry(0.15);
      const material = new THREE.MeshPhongMaterial({
        color: new THREE.Color().setHSL(i / 6, 0.8, 0.7),
        transparent: true,
        opacity: 0.6,
        emissive: new THREE.Color().setHSL(i / 6, 0.5, 0.2),
        emissiveIntensity: 0.3,
      });
      
      const star = new THREE.Mesh(geometry, material);
      star.position.set(
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 15
      );
      
      scene.add(star);
      stars.push(star);
      
      starData.push({
        mesh: star,
        originalPosition: star.position.clone(),
        phase: Math.random() * Math.PI * 2,
        speed: 0.4 + Math.random() * 1.0,
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
      
      // Animate certificates
      certData.forEach(({ mesh, originalPosition, phase, speed }) => {
        mesh.rotation.x += 0.005 * speed;
        mesh.rotation.y += 0.005 * speed;
        mesh.rotation.z += 0.003 * speed;
        
        // Floating motion
        mesh.position.y = originalPosition.y + Math.sin(time * speed + phase) * 0.2;
        mesh.position.x = originalPosition.x + Math.cos(time * speed * 0.7 + phase) * 0.1;
        mesh.position.z = originalPosition.z + Math.sin(time * speed * 0.5 + phase) * 0.1;
      });
      
      // Animate stars
      starData.forEach(({ mesh, originalPosition, phase, speed }) => {
        mesh.rotation.x += 0.01 * speed;
        mesh.rotation.y += 0.01 * speed;
        mesh.rotation.z += 0.005 * speed;
        
        // Floating motion
        mesh.position.y = originalPosition.y + Math.sin(time * speed + phase) * 0.3;
        mesh.position.x = originalPosition.x + Math.cos(time * speed * 0.7 + phase) * 0.2;
        mesh.position.z = originalPosition.z + Math.sin(time * speed * 0.5 + phase) * 0.1;
        
        // Scale pulsing
        const scale = 1 + Math.sin(time * speed * 2 + phase) * 0.2;
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
      className="fixed inset-0 -z-10 w-full h-full opacity-25"
    />
  );
};

export default Certificates3DEffects;
