import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Line, Text, OrbitControls, Cylinder, Torus } from '@react-three/drei';
import * as THREE from 'three';

const ElectricParticle = ({ position, color, speed, size }) => {
  const meshRef = useRef();
  const [progress, setProgress] = useState(0);
  
  useFrame((state) => {
    if (meshRef.current) {
      // Circular motion path
      const radius = 2.5;
      const angle = state.clock.elapsedTime * speed + progress;
      meshRef.current.position.x = Math.cos(angle) * radius;
      meshRef.current.position.y = Math.sin(angle * 0.3) * 0.5;
      meshRef.current.position.z = Math.sin(angle) * radius;
      
      // Particle rotation
      meshRef.current.rotation.x += 0.02;
      meshRef.current.rotation.y += 0.02;
      
      // Pulsing effect
      const scale = 1 + Math.sin(state.clock.elapsedTime * 4 + progress) * 0.3;
      meshRef.current.scale.setScalar(scale);
    }
  });

  return (
    <Sphere ref={meshRef} position={position} args={[size, 16, 16]}>
      <meshStandardMaterial 
        color={color} 
        emissive={color} 
        emissiveIntensity={0.8} 
        metalness={0.1}
        roughness={0.2}
      />
    </Sphere>
  );
};

const PowerConductor = ({ current }) => {
  const conductorRef = useRef();
  const glowRef = useRef();
  
  useFrame((state) => {
    if (conductorRef.current && glowRef.current) {
      // Slow rotation
      conductorRef.current.rotation.z += 0.01;
      
      // Glow intensity based on current
      const intensity = (current / 20) * 2;
      glowRef.current.material.emissiveIntensity = intensity;
    }
  });

  return (
    <group>
      {/* Main conductor */}
      <Torus ref={conductorRef} args={[2.5, 0.1, 16, 100]} position={[0, 0, 0]}>
        <meshStandardMaterial 
          color="#1E293B" 
          metalness={0.9}
          roughness={0.1}
          emissive="#0F172A"
          emissiveIntensity={0.2}
        />
      </Torus>
      
      {/* Glow effect */}
      <Torus ref={glowRef} args={[2.5, 0.15, 16, 100]} position={[0, 0, 0]}>
        <meshStandardMaterial 
          color="#059669" 
          transparent
          opacity={0.6}
          emissive="#059669"
          emissiveIntensity={1}
        />
      </Torus>
    </group>
  );
};

const PowerCore = ({ current }) => {
  const coreRef = useRef();
  const ringsRef = useRef([]);
  
  useFrame((state) => {
    if (coreRef.current) {
      // Core pulsing
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.2;
      coreRef.current.scale.setScalar(scale);
      coreRef.current.rotation.x += 0.005;
      coreRef.current.rotation.y += 0.01;
    }
    
    // Animate energy rings
    ringsRef.current.forEach((ring, i) => {
      if (ring) {
        ring.rotation.x += 0.02 * (i + 1);
        ring.rotation.z += 0.01 * (i + 1);
      }
    });
  });

  return (
    <group>
      {/* Central energy core */}
      <Sphere ref={coreRef} args={[0.3, 32, 32]}>
        <meshStandardMaterial 
          color="#22D3EE" 
          emissive="#0EA5E9"
          emissiveIntensity={2}
          metalness={0.1}
          roughness={0.1}
        />
      </Sphere>
      
      {/* Energy rings */}
      {[0.8, 1.2, 1.6].map((radius, i) => (
        <Torus 
          key={i}
          ref={el => ringsRef.current[i] = el}
          args={[radius, 0.02, 8, 32]} 
        >
          <meshStandardMaterial 
            color="#06B6D4" 
            emissive="#0891B2"
            emissiveIntensity={1.5}
            transparent
            opacity={0.8}
          />
        </Torus>
      ))}
    </group>
  );
};

const CurrentAnimation = ({ current = 12.5 }) => {
  const particleCount = Math.min(Math.floor(current / 2) + 5, 20);
  const speed = current / 10;
  
  return (
    <div className="w-full h-96 bg-gradient-to-br from-deep-blue/30 via-emerald-green/20 to-slate-700/10 rounded-2xl backdrop-blur-md border border-gray-400/30 shadow-2xl overflow-hidden">
      <Canvas camera={{ position: [4, 2, 6], fov: 60 }}>
        {/* Enhanced lighting */}
        <ambientLight intensity={0.3} color="#1E293B" />
        <pointLight position={[0, 0, 0]} intensity={2} color="#0EA5E9" />
        <pointLight position={[5, 5, 5]} intensity={1} color="#059669" />
        <pointLight position={[-5, -5, -5]} intensity={0.8} color="#0F172A" />
        <directionalLight position={[10, 10, 10]} intensity={0.5} color="#22D3EE" />
        
        {/* Power conductor ring */}
        <PowerConductor current={current} />
        
        {/* Central energy core */}
        <PowerCore current={current} />
        
        {/* Animated particles */}
        {Array.from({ length: particleCount }, (_, i) => (
          <ElectricParticle
            key={i}
            position={[0, 0, 0]}
            color={current > 15 ? "#EF4444" : current > 10 ? "#F59E0B" : "#22D3EE"}
            speed={speed + i * 0.2}
            size={0.08 + Math.random() * 0.04}
          />
        ))}
        
        {/* Status text */}
        <Text
          position={[0, 3.5, 0]}
          fontSize={0.4}
          color="#E2E8F0"
          anchorX="center"
          anchorY="middle"
          font="Inter"
        >
          ⚡ {current.toFixed(1)}A Current Flow
        </Text>
        
        <Text
          position={[0, -3.5, 0]}
          fontSize={0.25}
          color={current > 15 ? "#EF4444" : current > 10 ? "#F59E0B" : "#22D3EE"}
          anchorX="center"
          anchorY="middle"
        >
          {current > 15 ? "HIGH LOAD" : current > 10 ? "MODERATE" : "OPTIMAL"}
        </Text>
        
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          minDistance={3}
          maxDistance={10}
          maxPolarAngle={Math.PI / 1.5}
          minPolarAngle={Math.PI / 6}
        />
      </Canvas>
    </div>
  );
};

export default CurrentAnimation;
