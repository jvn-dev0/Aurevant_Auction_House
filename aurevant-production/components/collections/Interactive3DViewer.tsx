'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RotateCcw, X, Play, Pause, ZoomIn, ZoomOut, ShieldCheck, ArrowUpRight, Clock, Box } from 'lucide-react';

export interface AuctionObject3D {
  id: string;
  slotNumber: string;
  title: string;
  collection: string;
  period: string;
  provenance: string;
  estimateMin: number;
  estimateMax: number;
  currentBid: number;
  totalBids: number;
  initialSeconds: number;
  modelPath: string;
  previewImage: string;
  modelScaleAdjustment?: number;
  modelRotation?: [number, number, number];
  cameraFov?: number;
  cameraPositionOffset?: [number, number, number];
  cameraDistanceMultiplier?: number;
}

interface Interactive3DViewerProps {
  object: AuctionObject3D;
  remainingSeconds: number;
  onClose: () => void;
  formatCountdown: (totalSecs: number) => { hours: string; minutes: string; seconds: string };
  formatCurrency: (val: number) => string;
}

function MechanicalDigit({ value }: { value: string }) {
  const [curr, setCurr] = useState(value);
  const [prev, setPrev] = useState(value);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    if (value !== curr) {
      setPrev(curr);
      setCurr(value);
      setAnimating(true);
      const timer = setTimeout(() => {
        setAnimating(false);
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [value, curr]);

  return (
    <span className="relative inline-block w-[0.62em] h-[1.2em] overflow-hidden align-baseline select-none" aria-label={value}>
      <span
        className={`flex flex-col transition-transform ${
          animating
            ? 'duration-350 ease-[cubic-bezier(0.2,0.8,0.2,1)] -translate-y-1/2'
            : 'duration-0 translate-y-0'
        } motion-reduce:transition-none motion-reduce:transform-none`}
      >
        <span className="h-[1.2em] flex items-center justify-center font-mono">{animating ? prev : curr}</span>
        {animating && (
          <span className="h-[1.2em] flex items-center justify-center font-mono" aria-hidden="true">{curr}</span>
        )}
      </span>
    </span>
  );
}

export function Interactive3DViewer({
  object,
  remainingSeconds,
  onClose,
  formatCountdown,
  formatCurrency,
}: Interactive3DViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isAutoRotating, setIsAutoRotating] = useState(true);

  const controlsRef = useRef<any>(null);
  const cameraRef = useRef<any>(null);
  const initialCameraPosRef = useRef<THREE.Vector3>(new THREE.Vector3());
  const initialTargetRef = useRef<THREE.Vector3>(new THREE.Vector3());

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Three.js Lifecycle
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    let isDisposed = false;
    let animationFrameId: number;

    // 1. Scene, Camera, Renderer
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 600;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(object.cameraFov || 42, width / height, 0.05, 100);
    cameraRef.current = camera;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.25;
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = (THREE as any).PCFSoftShadowMap || 2;
    } catch (err: any) {
      setLoadError('WebGL is not available in your browser.');
      setIsLoading(false);
      return;
    }

    // 2. Curatorial Museum Lighting Rig
    // Warm Key Light (Main Exhibition Spotlight)
    const keyLight = new THREE.DirectionalLight(0xfffaed, 2.8);
    keyLight.position.set(3.5, 4.8, 4.0);
    scene.add(keyLight);

    // Cool Fill Light (Soft gallery balance)
    const fillLight = new THREE.DirectionalLight(0xdde8f5, 1.4);
    fillLight.position.set(-3.5, 2.5, 2.5);
    scene.add(fillLight);

    // Antique Gold Rim / Back Accent
    const rimLight = new THREE.DirectionalLight(0xe8d098, 2.0);
    rimLight.position.set(0.0, 4.0, -3.5);
    scene.add(rimLight);

    // Ambient gallery floor bounce
    const ambientLight = new THREE.AmbientLight(0x242926, 1.1);
    scene.add(ambientLight);

    // 3. OrbitControls with bounded vertical angles
    const controls = new OrbitControls(camera, canvas);
    controlsRef.current = controls;
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.enablePan = false;
    // Bounded vertical tilt: allows inspecting top and bottom without camera inversion
    controls.minPolarAngle = Math.PI * 0.08;
    controls.maxPolarAngle = Math.PI * 0.92;
    controls.autoRotate = isAutoRotating;
    controls.autoRotateSpeed = 1.0;

    // 4. Model Loading with Auto-Centering and Auto-Framing
    const loader = new GLTFLoader();
    let loadedObject: THREE.Object3D | null = null;

    loader.load(
      object.modelPath,
      (gltf) => {
        if (isDisposed) return;

        loadedObject = gltf.scene;

        // Auto-compute bounding box
        const box = new THREE.Box3().setFromObject(loadedObject);
        const center = new THREE.Vector3();
        const size = new THREE.Vector3();
        box.getCenter(center);
        box.getSize(size);

        // Center model at origin (0, 0, 0)
        loadedObject.position.x = -center.x;
        loadedObject.position.y = -center.y;
        loadedObject.position.z = -center.z;

        const rootGroup = new THREE.Group();
        rootGroup.add(loadedObject);

        // Apply scale adjustment if defined
        if (object.modelScaleAdjustment) {
          rootGroup.scale.multiplyScalar(object.modelScaleAdjustment);
        }

        // Apply rotation if defined
        if (object.modelRotation) {
          rootGroup.rotation.set(
            object.modelRotation[0],
            object.modelRotation[1],
            object.modelRotation[2]
          );
        }

        scene.add(rootGroup);

        // Auto-frame camera based on final bounding box
        const finalBox = new THREE.Box3().setFromObject(rootGroup);
        const finalSize = new THREE.Vector3();
        finalBox.getSize(finalSize);

        const maxDim = Math.max(finalSize.x, finalSize.y, finalSize.z) || 1.0;
        const fovRad = camera.fov * (Math.PI / 180);
        const distMultiplier = object.cameraDistanceMultiplier || 1.55;
        const cameraDist = Math.abs(maxDim / 2 / Math.tan(fovRad / 2)) * distMultiplier;

        const posX = object.cameraPositionOffset ? object.cameraPositionOffset[0] : 0;
        const posY = object.cameraPositionOffset ? object.cameraPositionOffset[1] : maxDim * 0.25;
        const posZ = object.cameraPositionOffset ? object.cameraPositionOffset[2] : cameraDist;

        camera.position.set(posX, posY, posZ);
        initialCameraPosRef.current.copy(camera.position);

        controls.target.set(0, 0, 0);
        initialTargetRef.current.copy(controls.target);

        controls.minDistance = cameraDist * 0.35;
        controls.maxDistance = cameraDist * 3.2;
        controls.update();

        setIsLoading(false);
      },
      undefined,
      (err: any) => {
        console.error('3D Model Loading Error:', err);
        if (!isDisposed) {
          setLoadError('Failed to load 3D model asset.');
          setIsLoading(false);
        }
      }
    );

    // 5. Render Loop
    const animate = () => {
      if (isDisposed) return;
      animationFrameId = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // 6. Responsive Resize Observer
    const resizeObserver = new ResizeObserver(() => {
      if (!container || isDisposed) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      if (newW > 0 && newH > 0) {
        camera.aspect = newW / newH;
        camera.updateProjectionMatrix();
        renderer.setSize(newW, newH);
      }
    });
    resizeObserver.observe(container);

    // 7. Cleanup & Resource Disposal
    return () => {
      isDisposed = true;
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      controls.dispose();

      // Dispose loaded mesh geometries and textures
      if (loadedObject) {
        loadedObject.traverse((child: any) => {
          if (child.isMesh) {
            child.geometry?.dispose();
            if (Array.isArray(child.material)) {
              child.material.forEach((mat: any) => {
                mat.map?.dispose();
                mat.dispose();
              });
            } else if (child.material) {
              child.material.map?.dispose();
              child.material.dispose();
            }
          }
        });
      }

      renderer.dispose();
    };
  }, [object.modelPath, object.modelScaleAdjustment, object.cameraFov]);

  // Sync autoRotate state with controls
  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.autoRotate = isAutoRotating;
    }
  }, [isAutoRotating]);

  // Reset Camera View
  const handleResetView = useCallback(() => {
    if (cameraRef.current && controlsRef.current) {
      cameraRef.current.position.copy(initialCameraPosRef.current);
      controlsRef.current.target.copy(initialTargetRef.current);
      controlsRef.current.update();
    }
  }, []);

  const countdown = formatCountdown(remainingSeconds);

  return (
    <div
      id="interactive-3d-modal"
      data-testid="interactive-3d-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 lg:p-10 bg-[#111312]/90 backdrop-blur-md animate-in fade-in duration-300"
      role="dialog"
      aria-modal="true"
      aria-label={`Interactive 3D Viewer: ${object.title}`}
    >
      <div className="relative w-full max-w-[1500px] h-full max-h-[920px] bg-[#151817] border border-[#C5A059]/40 shadow-2xl flex flex-col lg:flex-row overflow-hidden">
        {/* ── Left 3D Canvas Stage ── */}
        <div
          ref={containerRef}
          className="relative flex-1 h-[55%] lg:h-full bg-gradient-to-b from-[#191D1B] via-[#131615] to-[#0E100F] overflow-hidden flex items-center justify-center cursor-grab active:cursor-grabbing select-none"
        >
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(197,160,89,0.08)_0%,transparent_70%)] pointer-events-none" />

          {/* WebGL Canvas */}
          <canvas ref={canvasRef} className="w-full h-full block" />

          {/* Loading Indicator */}
          {isLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#131615]/80 backdrop-blur-sm z-30">
              <div className="w-12 h-12 rounded-full border-2 border-[#C5A059]/30 border-t-[#C5A059] animate-spin mb-4" />
              <p className="font-mono text-xs uppercase tracking-[0.24em] text-[#C5A059]">
                Loading Interactive 3D Model...
              </p>
              <p className="font-sans text-[11px] text-[#EDE7DC]/60 mt-1">
                Authentic geometry & materials
              </p>
            </div>
          )}

          {/* Error Fallback */}
          {loadError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#131615]/90 p-8 z-30 text-center">
              <img
                src={object.previewImage}
                alt={object.title}
                className="w-48 h-48 object-cover rounded-md border border-[#C5A059]/30 mb-4 shadow-lg"
              />
              <p className="font-serif text-lg text-[#F4F0E8] mb-1">{object.title}</p>
              <p className="font-mono text-xs text-[#E7C477] uppercase tracking-wider mb-2">
                {loadError}
              </p>
              <p className="font-sans text-xs text-[#EDE7DC]/70 max-w-sm">
                Displaying high-resolution curatorial archival preview in place of WebGL stream.
              </p>
            </div>
          )}

          {/* Top Stage Badges */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none z-20">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#183D30]/90 border border-[#C5A059]/40 text-[#F4F0E8] font-mono text-[10.5px] uppercase tracking-wider">
                <Box className="w-3.5 h-3.5 text-[#C5A059]" />
                Interactive 3D Inspection
              </span>
              <span className="hidden sm:inline-block px-2.5 py-1 bg-[#111312]/80 border border-[#F4F0E8]/10 text-[#C5A059] font-mono text-[10.5px] uppercase tracking-wider">
                {object.slotNumber}
              </span>
            </div>
          </div>

          {/* Bottom Floating Interaction HUD */}
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between z-20 pointer-events-none">
            {/* Gesture Hint */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-[#111312]/80 backdrop-blur-md border border-[#F4F0E8]/15 text-[#EDE7DC]/80 font-mono text-[10.5px] tracking-wide pointer-events-auto">
              <span>Drag to rotate 360°</span>
              <span className="text-[#C5A059]/50">•</span>
              <span>Scroll to zoom</span>
            </div>

            {/* Quick 3D Controls */}
            <div className="flex items-center gap-2 pointer-events-auto ml-auto">
              {/* Auto-Rotate Toggle */}
              <button
                type="button"
                onClick={() => setIsAutoRotating(!isAutoRotating)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#111312]/85 hover:bg-[#183D30] border border-[#C5A059]/40 text-[#F4F0E8] font-mono text-[11px] uppercase tracking-wider transition-colors shadow-md"
                aria-label={isAutoRotating ? 'Pause auto-rotation' : 'Start auto-rotation'}
              >
                {isAutoRotating ? <Pause className="w-3 h-3 text-[#C5A059]" /> : <Play className="w-3 h-3 text-[#C5A059]" />}
                <span className="hidden sm:inline">{isAutoRotating ? 'Pause Turntable' : 'Spin Turntable'}</span>
              </button>

              {/* Reset Camera */}
              <button
                type="button"
                onClick={handleResetView}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#111312]/85 hover:bg-[#183D30] border border-[#C5A059]/40 text-[#F4F0E8] font-mono text-[11px] uppercase tracking-wider transition-colors shadow-md"
                aria-label="Reset viewing angle to default"
              >
                <RotateCcw className="w-3 h-3 text-[#C5A059]" />
                <span className="hidden sm:inline">Reset Angle</span>
              </button>
            </div>
          </div>
        </div>

        {/* ── Right Curatorial Dossier & Bidding Panel ── */}
        <div className="w-full lg:w-[440px] xl:w-[480px] h-[45%] lg:h-full bg-[#131615] border-t lg:border-t-0 lg:border-l border-[#C5A059]/25 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto">
          {/* Top Header & Close Button */}
          <div>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 bg-[#C5A059]/20 border border-[#C5A059]/50 text-[#C5A059] font-mono text-[11px] uppercase tracking-wider font-semibold">
                  {object.slotNumber}
                </span>
                <span className="px-2.5 py-1 bg-[#183D30] border border-[#F4F0E8]/20 text-[#F4F0E8] font-mono text-[10px] uppercase tracking-wider">
                  [DEMO AUCTION]
                </span>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-full text-[#EDE7DC]/70 hover:text-[#F4F0E8] hover:bg-[#111312] border border-[#F4F0E8]/10 transition-colors focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
                aria-label="Close 3D viewer and return to catalogue"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Department */}
            <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-[#C5A059] mb-1.5">
              {object.collection}
            </p>

            {/* Title */}
            <h2 className="font-serif text-2xl sm:text-3xl text-[#F4F0E8] font-normal leading-tight mb-2">
              {object.title}
            </h2>

            {/* Period */}
            <p className="font-sans text-xs text-[#EDE7DC]/75 mb-4">
              {object.period}
            </p>

            {/* Provenance */}
            <div className="p-3.5 bg-[#0E100F] border border-[#C5A059]/20 mb-6">
              <p className="font-mono text-[9.5px] uppercase tracking-wider text-[#C5A059] mb-1">
                Curatorial Provenance
              </p>
              <p className="font-sans text-xs text-[#EDE7DC]/85 leading-relaxed">
                {object.provenance}
              </p>
            </div>

            {/* Live Countdown Clock */}
            <div className="mb-6 p-4 bg-[#0E100F] border border-[#C5A059]/30">
              <div className="flex items-center justify-between mb-2">
                <span className="inline-flex items-center gap-1.5 font-mono text-[10.5px] uppercase tracking-wider text-[#C5A059]">
                  <Clock className="w-3.5 h-3.5 text-[#E7C477]" />
                  Time Remaining
                </span>
                <span className="font-mono text-[10px] text-[#EDE7DC]/50 uppercase tracking-widest">
                  LIVE SALEROOM
                </span>
              </div>

              {/* Countdown Digits */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-[#183D30]/40 border border-[#183D30] py-2 flex flex-col items-center justify-center">
                  <div className="flex items-center justify-center font-mono text-xl sm:text-2xl text-[#F4F0E8] font-bold">
                    <MechanicalDigit value={countdown.hours[0]} />
                    <MechanicalDigit value={countdown.hours[1]} />
                  </div>
                  <span className="block font-mono text-[9px] uppercase tracking-widest text-[#C5A059] mt-0.5">
                    HRS
                  </span>
                </div>
                <div className="bg-[#183D30]/40 border border-[#183D30] py-2 flex flex-col items-center justify-center">
                  <div className="flex items-center justify-center font-mono text-xl sm:text-2xl text-[#F4F0E8] font-bold">
                    <MechanicalDigit value={countdown.minutes[0]} />
                    <MechanicalDigit value={countdown.minutes[1]} />
                  </div>
                  <span className="block font-mono text-[9px] uppercase tracking-widest text-[#C5A059] mt-0.5">
                    MIN
                  </span>
                </div>
                <div className="bg-[#183D30]/40 border border-[#183D30] py-2 flex flex-col items-center justify-center">
                  <div className="flex items-center justify-center font-mono text-xl sm:text-2xl text-[#F4F0E8] font-bold">
                    <MechanicalDigit value={countdown.seconds[0]} />
                    <MechanicalDigit value={countdown.seconds[1]} />
                  </div>
                  <span className="block font-mono text-[9px] uppercase tracking-widest text-[#C5A059] mt-0.5">
                    SEC
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing & Bidding Actions */}
          <div className="pt-4 border-t border-[#C5A059]/20">
            <div className="flex items-baseline justify-between mb-2">
              <span className="font-mono text-xs uppercase tracking-wider text-[#EDE7DC]/60">
                Estimate
              </span>
              <span className="font-mono text-xs text-[#EDE7DC]/90">
                {formatCurrency(object.estimateMin)} &ndash; {formatCurrency(object.estimateMax)} USD
              </span>
            </div>

            <div className="flex items-baseline justify-between mb-4">
              <div>
                <span className="block font-mono text-[11px] uppercase tracking-wider text-[#C5A059]">
                  Current Highest Bid
                </span>
                <span className="font-mono text-[10px] text-[#EDE7DC]/50">
                  {object.totalBids} Verified Bids Placed
                </span>
              </div>
              <span className="font-mono text-2xl sm:text-3xl font-bold text-[#E7C477]">
                {formatCurrency(object.currentBid)}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-1/3 py-3 px-4 bg-transparent hover:bg-[#111312] text-[#EDE7DC] font-mono text-xs uppercase tracking-wider border border-[#F4F0E8]/20 transition-colors text-center"
              >
                &larr; Catalogue
              </button>
              <button
                type="button"
                className="w-full sm:w-2/3 py-3 px-4 bg-[#C5A059] hover:bg-[#D8B26A] text-[#111312] font-mono text-xs font-semibold uppercase tracking-[0.16em] transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                <span>Place Live Bid</span>
                <ArrowUpRight className="w-4 h-4 text-[#111312]" />
              </button>
            </div>

            {/* Authenticity Guarantee */}
            <div className="mt-3 flex items-center justify-between text-[10px] font-mono text-[#EDE7DC]/45 uppercase tracking-wider">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" />
                Authenticated Lot
              </span>
              <span>Custody & Transit Verified</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
