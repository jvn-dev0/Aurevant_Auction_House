'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

interface SculptureCanvasProps {
  modelPath?: string;
  onLoaded?: () => void;
  onError?: (err: Error) => void;
}

export function SculptureCanvas({
  modelPath = '/models/marble_bust_01.glb',
  onLoaded,
  onError,
}: SculptureCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    // 1. WebGL capability check (using off-screen test canvas to preserve main canvas for Three.js)
    try {
      const testCanvas = document.createElement('canvas');
      const gl = testCanvas.getContext('webgl2') || testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl');
      if (!gl) {
        throw new Error('WebGL not supported in current environment');
      }
    } catch (e) {
      setHasError(true);
      onError?.(e as Error);
      return;
    }

    // 2. Scene, Camera, Renderer initialization
    let width = container.clientWidth || 500;
    let height = container.clientHeight || 650;

    const scene = new (THREE as any).Scene();
    const camera = new (THREE as any).PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 0.08, 3.2);

    let renderer: any;
    try {
      renderer = new (THREE as any).WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.toneMapping = (THREE as any).ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.2;
      renderer.outputColorSpace = (THREE as any).SRGBColorSpace;
    } catch (e) {
      setHasError(true);
      onError?.(e as Error);
      return;
    }

    // 3. Art-Directed Museum Lighting Rig
    // Soft Warm Key Light (matches museum gallery overhead spotlights)
    const keyLight = new (THREE as any).DirectionalLight(0xfff5e6, 2.6);
    keyLight.position.set(2.5, 4.2, 3.5);
    scene.add(keyLight);

    // Gentle Cool Fill Light (balances shadows)
    const fillLight = new (THREE as any).DirectionalLight(0x90a2b8, 1.1);
    fillLight.position.set(-3.2, 2.0, 2.5);
    scene.add(fillLight);

    // Marble Rim / Back Highlight (accents classical marble silhouette)
    const rimLight = new (THREE as any).DirectionalLight(0xf2dfb8, 1.7);
    rimLight.position.set(0.5, 3.8, -2.5);
    scene.add(rimLight);

    // Ambient Museum Shading
    const ambientLight = new (THREE as any).AmbientLight(0x282c30, 0.85);
    scene.add(ambientLight);

    // 4. Model Loading & Material Art-Direction
    let modelGroup: any = null;
    let targetRotationY = 0;
    let targetRotationX = 0;
    const loader = new (GLTFLoader as any)();

    // Check prefers-reduced-motion with dynamic change listener
    const motionQuery =
      typeof window !== 'undefined' && window.matchMedia
        ? window.matchMedia('(prefers-reduced-motion: reduce)')
        : null;

    let prefersReducedMotion = motionQuery ? motionQuery.matches : false;

    const handleMotionPreferenceChange = (e: MediaQueryListEvent | MediaQueryList) => {
      prefersReducedMotion = e.matches;
      if (prefersReducedMotion) {
        isDragging = false;
        targetRotationY = 0;
        targetRotationX = 0;
        dragRotationY = 0;
      }
    };

    if (motionQuery) {
      if (typeof motionQuery.addEventListener === 'function') {
        motionQuery.addEventListener('change', handleMotionPreferenceChange);
      } else if (typeof (motionQuery as any).addListener === 'function') {
        (motionQuery as any).addListener(handleMotionPreferenceChange);
      }
    }

    loader.load(
      modelPath,
      (gltf: any) => {
        modelGroup = gltf.scene;

        // Auto-center and normalize bounding box
        const box = new (THREE as any).Box3().setFromObject(modelGroup);
        const center = box.getCenter(new (THREE as any).Vector3());
        const size = box.getSize(new (THREE as any).Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 1.50 / maxDim;

        modelGroup.scale.setScalar(scale);
        modelGroup.position.x = -center.x * scale;
        modelGroup.position.y = -center.y * scale;
        modelGroup.position.z = -center.z * scale;

        // Enhance marble material appearance
        modelGroup.traverse((child: any) => {
          if (child.isMesh) {
            if (child.material) {
              child.material.roughness = Math.min(child.material.roughness, 0.38);
              child.material.metalness = 0.02;
              child.material.needsUpdate = true;
            }
          }
        });

        scene.add(modelGroup);
        onLoaded?.();
      },
      undefined,
      (err: any) => {
        console.warn('GLTF loading error, falling back to static visual:', err);
        setHasError(true);
        onError?.(err instanceof Error ? err : new Error(String(err)));
      }
    );

    // 5. Pointer Drag & Parallax Tracking
    let isDragging = false;
    let previousPointerX = 0;
    let dragRotationY = 0;

    const handlePointerDown = (e: PointerEvent) => {
      if (prefersReducedMotion) return;
      isDragging = true;
      previousPointerX = e.clientX;
      try {
        canvas.setPointerCapture(e.pointerId);
      } catch {}
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (prefersReducedMotion || !container) return;
      if (isDragging) {
        const deltaX = e.clientX - previousPointerX;
        dragRotationY += deltaX * 0.007;
        previousPointerX = e.clientX;
      }

      // Parallax tilt tracking
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetRotationY = x * 0.12;
      targetRotationX = -y * 0.06;
    };

    const handlePointerUp = (e: PointerEvent) => {
      isDragging = false;
      try {
        canvas.releasePointerCapture(e.pointerId);
      } catch {}
    };

    canvas.addEventListener('pointerdown', handlePointerDown);
    canvas.addEventListener('pointermove', handlePointerMove);
    canvas.addEventListener('pointerup', handlePointerUp);
    canvas.addEventListener('pointercancel', handlePointerUp);

    // 6. Responsive Resize Handling
    const handleResize = () => {
      if (!container || !renderer) return;
      width = container.clientWidth || 500;
      height = container.clientHeight || 650;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize, { passive: true });

    // 7. Render Loop with Restrained Rotation & Damping
    let animationFrameId: number;
    let baseRotation = -0.15; // Aesthetic initial angle showcasing draped contours

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (modelGroup) {
        if (!prefersReducedMotion && !isDragging) {
          baseRotation += 0.0012; // Restrained slow rotation (0.0012 rad/frame)
        }

        // Smooth exponential damping
        const targetTotalY = baseRotation + dragRotationY + targetRotationY;
        modelGroup.rotation.y += (targetTotalY - modelGroup.rotation.y) * 0.06;
        modelGroup.rotation.x += (targetRotationX - modelGroup.rotation.x) * 0.06;
      }

      renderer.render(scene, camera);
    };

    animate();

    // 8. Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      canvas.removeEventListener('pointerdown', handlePointerDown);
      canvas.removeEventListener('pointermove', handlePointerMove);
      canvas.removeEventListener('pointerup', handlePointerUp);
      canvas.removeEventListener('pointercancel', handlePointerUp);
      window.removeEventListener('resize', handleResize);

      if (motionQuery) {
        if (typeof motionQuery.removeEventListener === 'function') {
          motionQuery.removeEventListener('change', handleMotionPreferenceChange);
        } else if (typeof (motionQuery as any).removeListener === 'function') {
          (motionQuery as any).removeListener(handleMotionPreferenceChange);
        }
      }

      if (renderer) {
        renderer.dispose();
      }
      scene.clear();
    };
  }, [modelPath, onLoaded, onError]);

  if (hasError) return null;

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex items-center justify-center min-h-[460px] lg:min-h-[540px] xl:min-h-[580px]"
    >
      <canvas
        id="sculpture-canvas"
        ref={canvasRef}
        className="w-full h-full block cursor-grab active:cursor-grabbing"
        data-model={modelPath}
        aria-label="Interactive 3D Marble Figure Sculpture"
      />
    </div>
  );
}
