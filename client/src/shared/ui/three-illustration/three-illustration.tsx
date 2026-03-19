"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

type ShapeType = "gem" | "torus" | "crystal";

interface LowPolyShapeProps {
    type: ShapeType;
    position?: [number, number, number];
    scale?: number;
    rotationSpeed?: [number, number, number];
    floatSpeed?: number;
    floatOffset?: number;
}

function LowPolyShape({
    type,
    position = [0, 0, 0],
    scale = 1,
    rotationSpeed = [0.2, 0.3, 0],
    floatSpeed = 2,
    floatOffset = 0,
}: LowPolyShapeProps) {
    const meshRef = useRef<THREE.Group>(null);

    useFrame((state, delta) => {
        if (meshRef.current) {
            meshRef.current.rotation.x += delta * rotationSpeed[0];
            meshRef.current.rotation.y += delta * rotationSpeed[1];
            meshRef.current.rotation.z += delta * rotationSpeed[2];
            meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * floatSpeed + floatOffset) * 0.15;
        }
    });

    const getGeometry = () => {
        switch (type) {
            case "gem":
                return <icosahedronGeometry args={[1, 0]} />;
            case "torus":
                return <torusGeometry args={[0.8, 0.3, 8, 12]} />;
            case "crystal":
                return <dodecahedronGeometry args={[1, 0]} />;
        }
    };

    return (
        <group ref={meshRef} position={position} scale={scale}>
            <mesh>
                {getGeometry()}
                <meshStandardMaterial 
                    color="#111111" 
                    roughness={0.7} 
                    flatShading={true} 
                />
            </mesh>

            <mesh scale={1.002}>
                {getGeometry()}
                <meshBasicMaterial 
                    color="#ffffff" 
                    wireframe={true} 
                    transparent 
                    opacity={0.6}
                />
            </mesh>
        </group>
    );
}

function SceneGem() {
    return (
        <>
            <LowPolyShape type="gem" scale={1.5} position={[0, -0.2, 0]} floatOffset={0} />
            <LowPolyShape type="torus" scale={0.4} position={[1.8, 1.2, -1]} rotationSpeed={[0.5, 0.4, 0.1]} floatOffset={2} floatSpeed={1.5} />
            <LowPolyShape type="crystal" scale={0.3} position={[-1.5, -1.2, 0.5]} rotationSpeed={[-0.2, 0.8, 0.2]} floatOffset={4} floatSpeed={2.5} />
        </>
    );
}

function SceneTorus() {
    return (
        <>
            <LowPolyShape type="torus" scale={1.3} position={[0, 0, 0]} rotationSpeed={[0.1, 0.2, 0.1]} floatOffset={1} />
            <LowPolyShape type="gem" scale={0.5} position={[1.2, -1.2, 1]} rotationSpeed={[0.8, 0.2, -0.5]} floatOffset={3} floatSpeed={1.8} />
            <LowPolyShape type="crystal" scale={0.4} position={[-1.6, 1.4, -2]} rotationSpeed={[-0.5, -0.4, 0.1]} floatOffset={0.5} floatSpeed={2.2} />
        </>
    );
}

function SceneCrystal() {
    return (
        <>
            <LowPolyShape type="crystal" scale={1.4} position={[0, 0, 0]} rotationSpeed={[-0.2, 0.3, 0]} floatOffset={0} />
            <LowPolyShape type="gem" scale={0.35} position={[-1.6, -1, 0]} rotationSpeed={[0.5, 0.9, 0]} floatOffset={1.5} floatSpeed={2} />
            <LowPolyShape type="gem" scale={0.45} position={[1.5, 1.2, -1]} rotationSpeed={[-0.4, 0.5, 0.3]} floatOffset={3} floatSpeed={1.7} />
            <LowPolyShape type="torus" scale={0.25} position={[0, -1.8, 1]} rotationSpeed={[0.1, 1.2, 0.5]} floatOffset={5} floatSpeed={2.8} />
        </>
    );
}

export default function ThreeIllustration({ type }: { type: ShapeType }) {
    return (
        <div className="absolute inset-0 w-full h-full pointer-events-none">
            <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
                <ambientLight intensity={1} />
                <directionalLight position={[10, 10, 10]} intensity={2} color="#ffffff" />
                <directionalLight position={[-10, -10, -10]} intensity={1.5} color="#facc15" />
                
                {type === "gem" && <SceneGem />}
                {type === "torus" && <SceneTorus />}
                {type === "crystal" && <SceneCrystal />}
            </Canvas>
        </div>
    );
}