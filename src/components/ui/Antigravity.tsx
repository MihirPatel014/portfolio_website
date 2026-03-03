import { Canvas, useFrame, useThree } from '@react-three/fiber';
import React, { useMemo, useRef, useLayoutEffect } from 'react';
import * as THREE from 'three';

interface AntigravityProps {
    count?: number;
    magnetRadius?: number;
    ringRadius?: number;
    waveSpeed?: number;
    waveAmplitude?: number;
    particleSize?: number;
    lerpSpeed?: number;
    color?: string;
    autoAnimate?: boolean;
    particleVariance?: number;
    rotationSpeed?: number;
    depthFactor?: number;
    pulseSpeed?: number;
    particleShape?: 'capsule' | 'sphere' | 'box' | 'tetrahedron';
    fieldStrength?: number;
    isDark?: boolean;
}

const EXTENDED_COLORS = [
    '#4285F4', // Blue
    '#EA4335', // Red
    '#FBBC05', // Yellow
    '#34A853', // Green
    '#A142F4', // Purple
    '#24C1E0', // Cyan
    '#FF8A00', // Orange
    '#FF4081', // Pink
    '#00E5FF', // Bright Cyan
    '#FFD600', // Bright Yellow
];

const AntigravityInner: React.FC<AntigravityProps> = ({
    count = 350,
    magnetRadius = 12,
    ringRadius = 10,
    waveSpeed = 0.4,
    waveAmplitude = 1,
    particleSize = 1.8,
    lerpSpeed = 0.08,
    color,
    autoAnimate = true,
    particleVariance = 1,
    rotationSpeed = 0.2,
    depthFactor = 1,
    pulseSpeed = 3,
    particleShape = 'capsule',
    fieldStrength = 10,
    isDark = true
}) => {
    const meshRef = useRef<THREE.InstancedMesh>(null);
    const { viewport } = useThree();
    const dummy = useMemo(() => new THREE.Object3D(), []);

    const lastMousePos = useRef({ x: 0, y: 0 });
    const lastMouseMoveTime = useRef(0);
    const virtualMouse = useRef({ x: 0, y: 0 });

    const particles = useMemo(() => {
        const temp = [];
        const width = viewport.width || 100;
        const height = viewport.height || 100;

        for (let i = 0; i < count; i++) {
            const t = Math.random() * 100;
            const speed = 0.01 + Math.random() / 200;

            const x = (Math.random() - 0.5) * width * 1.5;
            const y = (Math.random() - 0.5) * height * 1.5;
            const z = (Math.random() - 0.5) * 40;

            const randomRadiusOffset = (Math.random() - 0.5) * 3;
            const pColor = color || EXTENDED_COLORS[i % EXTENDED_COLORS.length]; // Uniform distribution

            temp.push({
                t,
                speed,
                mx: x,
                my: y,
                mz: z,
                cx: x,
                cy: y,
                cz: z,
                randomRadiusOffset,
                color: new THREE.Color(pColor)
            });
        }
        return temp;
    }, [count, viewport.width, viewport.height, color]);

    useLayoutEffect(() => {
        if (meshRef.current) {
            particles.forEach((particle, i) => {
                meshRef.current?.setColorAt(i, particle.color);
            });
            meshRef.current.instanceColor!.needsUpdate = true;
        }
    }, [particles]);

    useFrame(state => {
        const mesh = meshRef.current;
        if (!mesh) return;

        const { viewport: v, pointer: m } = state;
        const time = state.clock.getElapsedTime();

        const mouseDist = Math.sqrt(Math.pow(m.x - lastMousePos.current.x, 2) + Math.pow(m.y - lastMousePos.current.y, 2));
        if (mouseDist > 0.001) {
            lastMouseMoveTime.current = Date.now();
            lastMousePos.current = { x: m.x, y: m.y };
        }

        let destX = (m.x * v.width) / 2;
        let destY = (m.y * v.height) / 2;

        if (autoAnimate && Date.now() - lastMouseMoveTime.current > 3000) {
            destX = Math.sin(time * 0.4) * (v.width / 4);
            destY = Math.cos(time * 0.3) * (v.height / 4);
        }

        const smoothFactor = 0.04;
        virtualMouse.current.x += (destX - virtualMouse.current.x) * smoothFactor;
        virtualMouse.current.y += (destY - virtualMouse.current.y) * smoothFactor;

        const targetX = virtualMouse.current.x;
        const targetY = virtualMouse.current.y;
        const globalRotation = time * rotationSpeed;

        for (let i = 0; i < count; i++) {
            const particle = particles[i];
            let { t, speed, mx, my, mz, cz, randomRadiusOffset } = particle;

            t = particle.t += speed / 2;

            const projectionFactor = 1 - cz / 60;
            const projectedTargetX = targetX * projectionFactor;
            const projectedTargetY = targetY * projectionFactor;

            const dx = mx - projectedTargetX;
            const dy = my - projectedTargetY;
            const distSq = dx * dx + dy * dy;

            let targetPos = { x: mx, y: my, z: mz * depthFactor };

            const magRadSq = magnetRadius * magnetRadius;
            const isNear = distSq < magRadSq;

            if (isNear) {
                const dist = Math.sqrt(distSq);
                const angle = Math.atan2(dy, dx) + globalRotation;
                const wave = Math.sin(t * waveSpeed + angle) * (0.5 * waveAmplitude);
                const deviation = randomRadiusOffset * (5 / (fieldStrength + 0.1));
                const currentRingRadius = ringRadius + wave + deviation;

                targetPos.x = projectedTargetX + currentRingRadius * Math.cos(angle);
                targetPos.y = projectedTargetY + currentRingRadius * Math.sin(angle);
                targetPos.z = mz * depthFactor + Math.sin(t) * (2 * waveAmplitude * depthFactor);
            }

            particle.cx += (targetPos.x - particle.cx) * lerpSpeed;
            particle.cy += (targetPos.y - particle.cy) * lerpSpeed;
            particle.cz += (targetPos.z - particle.cz) * lerpSpeed;

            dummy.position.set(particle.cx, particle.cy, particle.cz);

            // Optimization: simple logic for rotation if not near mouse
            if (isNear || particleShape === 'capsule') {
                dummy.lookAt(projectedTargetX, projectedTargetY, particle.cz);
                dummy.rotateX(Math.PI / 2);
            } else {
                dummy.rotation.set(t, t, t);
            }

            const currentDistToMouseSq = Math.pow(particle.cx - projectedTargetX, 2) + Math.pow(particle.cy - projectedTargetY, 2);
            const currentDistToMouse = Math.sqrt(currentDistToMouseSq);

            const distFromRing = Math.abs(currentDistToMouse - ringRadius);
            let scaleFactor = 1 - distFromRing / (magnetRadius * 0.8);
            scaleFactor = Math.max(0.2, Math.min(1, scaleFactor));

            const finalScale = scaleFactor * (0.9 + Math.sin(t * pulseSpeed) * 0.1 * particleVariance) * particleSize;
            dummy.scale.set(finalScale, finalScale, finalScale);

            dummy.updateMatrix();
            mesh.setMatrixAt(i, dummy.matrix);
        }

        mesh.instanceMatrix.needsUpdate = true;
    });

    return (
        <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
            {particleShape === 'capsule' && <capsuleGeometry args={[0.07, 0.3, 2, 4]} />}
            {particleShape === 'sphere' && <sphereGeometry args={[0.1, 8, 4]} />}
            <meshBasicMaterial transparent opacity={isDark ? 0.9 : 0.7} />
        </instancedMesh>
    );
};

const Antigravity: React.FC<AntigravityProps> = props => {
    return (
        <div style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}>
            <Canvas
                camera={{ position: [0, 0, 50], fov: 35 }}
                gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
            >
                <AntigravityInner {...props} />
            </Canvas>
        </div>
    );
};

export default Antigravity;
