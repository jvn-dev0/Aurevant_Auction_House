'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';

interface GlasswaveCanvasProps {
  imageSrc: string;
  scrollProgress?: number;
  className?: string;
}

const VERTEX_SHADER = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const FRAGMENT_SHADER = /* glsl */ `
  precision highp float;

  uniform sampler2D uTexture;
  uniform vec2 uResolution;
  uniform float uTime;
  uniform vec2 uLensCenter; // Normalized UV coordinates (0.0 to 1.0)
  uniform float uLensRadius; // In UV height units (~0.18 for ~200px on desktop)
  uniform float uLensOpacity; // 0.0 (hidden/clean) to 1.0 (fully visible)
  uniform float uClickRipple; // Ripple pulse strength on click (0.0 to 1.0)
  uniform float uRippleTime; // Time elapsed since click

  varying vec2 vUv;

  // Calculates aspect-ratio preserving object-cover UV coordinates
  vec2 getCoverUv(vec2 st) {
    float screenAspect = uResolution.x / uResolution.y;
    float texAspect = 1774.0 / 887.0; // 2.0
    vec2 result = st;
    if (screenAspect > texAspect) {
      float scale = texAspect / screenAspect;
      result.y = (st.y - 0.5) * scale + 0.5;
    } else {
      float scale = screenAspect / texAspect;
      // In the statue image, the head and bust are on the left; anchoring at 0.3 preserves head & wreath in frame
      result.x = (st.x - 0.30) * scale + 0.30;
    }
    return clamp(result, 0.002, 0.998);
  }

  void main() {
    vec2 uv = vUv;
    float aspect = uResolution.x / uResolution.y;

    // Sample pure base artwork with cover mapping
    vec2 baseUv = getCoverUv(uv);
    vec4 baseColor = texture2D(uTexture, baseUv);

    // If lens is completely dissolved, render clean uninterrupted artwork directly
    if (uLensOpacity <= 0.001) {
      gl_FragColor = baseColor;
      return;
    }

    // Vector from lens center to current fragment (aspect-corrected for perfect circle)
    vec2 diff = uv - uLensCenter;
    vec2 diffCorrected = vec2(diff.x * aspect, diff.y);
    float dist = length(diffCorrected);

    // Dynamic lens radius with click pulse expansion
    float currentRadius = uLensRadius * (1.0 + 0.16 * uClickRipple);

    // Concentric glass ripple on click
    float rippleWave = 0.0;
    if (uClickRipple > 0.01) {
      float rippleDist = dist / currentRadius;
      rippleWave = sin(rippleDist * 28.0 - uRippleTime * 16.0) * exp(-uRippleTime * 4.5) * uClickRipple * 0.025;
    }

    // Normalized distance from center (0.0 at center, 1.0 at rim)
    float normR = dist / currentRadius;

    // Soft drop shadow cast by the lens onto the background just outside rim
    float shadow = (1.0 - smoothstep(1.0, 1.12, normR)) * step(1.0, normR) * 0.35 * uLensOpacity;
    vec3 resultColor = baseColor.rgb * (1.0 - shadow);

    // Inside the circular liquid-glass lens
    if (normR <= 1.06) {
      // Convex spherical lens surface height
      float z = sqrt(max(0.001, 1.0 - min(1.0, normR * normR)));

      // Surface normal pointing outward, steepening toward the beveled perimeter
      vec2 dir = normalize(diffCorrected + vec2(0.0001));
      vec2 normalXY = dir * (pow(min(1.0, normR), 1.7) * 0.85 + rippleWave * 3.5);
      float normalZ = sqrt(max(0.01, 1.0 - dot(normalXY, normalXY)));
      vec3 normal = normalize(vec3(normalXY, normalZ));

      // 1. Magnification towards lens center (optical zoom factor ~1.36x)
      float magnification = 1.36 + 0.08 * uClickRipple;
      vec2 magnifiedUv = uLensCenter + (uv - uLensCenter) / magnification;

      // 2. Spherical refraction distortion
      float refractionStrength = 0.048 * (1.0 - z * 0.35) + rippleWave * 0.4;
      vec2 refractedUv = magnifiedUv - normalXY * refractionStrength;

      // 3. Chromatic aberration (prismatic dispersion / rainbow edge distortion near rim)
      float dispersion = 0.0075 * pow(min(1.0, normR), 2.8);
      vec2 refCoverUv = getCoverUv(refractedUv);
      float r = texture2D(uTexture, clamp(refCoverUv + normalXY * dispersion, vec2(0.002), vec2(0.998))).r;
      float g = texture2D(uTexture, clamp(refCoverUv, vec2(0.002), vec2(0.998))).g;
      float b = texture2D(uTexture, clamp(refCoverUv - normalXY * dispersion, vec2(0.002), vec2(0.998))).b;
      vec3 lensColor = vec3(r, g, b);

      // 4. Subtle glass optical warmth & transmission clarity
      lensColor *= vec3(1.02, 1.01, 0.98);

      // 5. Specular highlight from key light on curved glass face
      vec3 keyLight = normalize(vec3(0.45, 0.70, 1.0));
      vec3 viewDir = vec3(0.0, 0.0, 1.0);
      vec3 halfDir = normalize(keyLight + viewDir);
      float spec = pow(max(0.0, dot(normal, halfDir)), 36.0);
      vec3 specColor = mix(vec3(1.0, 0.98, 0.92), vec3(0.85, 0.72, 0.45), 0.4) * spec * 1.3;

      // 6. Refined antique-gold metallic rim along the circular lens boundary
      float goldRim = smoothstep(0.94, 0.98, normR) * (1.0 - smoothstep(0.995, 1.02, normR));
      vec3 goldRimColor = vec3(0.88, 0.74, 0.44) * goldRim * 1.6;

      // Secondary inner glint
      float innerGlint = smoothstep(0.88, 0.94, normR) * (1.0 - smoothstep(0.95, 0.98, normR));
      vec3 glintColor = vec3(1.0, 0.98, 0.90) * innerGlint * 0.4;

      // Composite inside lens components
      vec3 compositeLens = lensColor + specColor + goldRimColor + glintColor;

      // Smooth anti-aliased circular mask edge
      float lensMask = 1.0 - smoothstep(0.98, 1.01, normR);

      // Blend lens over base background by mask and lens opacity
      resultColor = mix(resultColor, compositeLens, lensMask * uLensOpacity);
    }

    gl_FragColor = vec4(resultColor, 1.0);
  }
`;

export function GlasswaveCanvas({ imageSrc, className = '' }: GlasswaveCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);

  const [hasWebGL, setHasWebGL] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  // Smooth lens position tracking state (target vs current for subtle inertia)
  const lensState = useRef({
    targetX: 0.5,
    targetY: 0.5,
    currentX: 0.5,
    currentY: 0.5,
    targetOpacity: 0.0,
    currentOpacity: 0.0,
    clickRipple: 0.0,
    rippleTime: 0.0,
  });

  // Calculate normalized UV from pointer/touch event
  const updatePointerPosition = useCallback((clientX: number, clientY: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    // Three.js UV has Y=0 at bottom, Y=1 at top
    const y = Math.max(0, Math.min(1, 1 - (clientY - rect.top) / rect.height));

    lensState.current.targetX = x;
    lensState.current.targetY = y;
    lensState.current.targetOpacity = 1.0;
  }, []);

  // Pointer event handlers
  const handlePointerEnter = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    updatePointerPosition(e.clientX, e.clientY);
    // Instant initial snap to avoid flying in from corner
    lensState.current.currentX = lensState.current.targetX;
    lensState.current.currentY = lensState.current.targetY;
    lensState.current.targetOpacity = 1.0;
  }, [updatePointerPosition]);

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    updatePointerPosition(e.clientX, e.clientY);
  }, [updatePointerPosition]);

  const handlePointerLeave = useCallback(() => {
    lensState.current.targetOpacity = 0.0;
  }, []);

  // Click pulse trigger
  const handleClick = useCallback(() => {
    lensState.current.clickRipple = 1.0;
    lensState.current.rippleTime = 0.0;
  }, []);

  // Mobile Touch handlers
  const handleTouchStart = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      updatePointerPosition(touch.clientX, touch.clientY);
      lensState.current.currentX = lensState.current.targetX;
      lensState.current.currentY = lensState.current.targetY;
      lensState.current.targetOpacity = 1.0;
    }
  }, [updatePointerPosition]);

  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      updatePointerPosition(touch.clientX, touch.clientY);
    }
  }, [updatePointerPosition]);

  const handleTouchEnd = useCallback(() => {
    lensState.current.targetOpacity = 0.0;
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    // Respect prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setHasWebGL(false);
      return;
    }

    let renderer: THREE.WebGLRenderer | null = null;
    let scene: THREE.Scene | null = null;
    let camera: THREE.OrthographicCamera | null = null;
    let material: THREE.ShaderMaterial | null = null;
    let texture: THREE.Texture | null = null;
    let animationFrameId: number | null = null;
    let isVisible = false;

    try {
      // 1. WebGL Renderer
      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: false,
        powerPreference: 'high-performance',
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      const width = container.clientWidth || 800;
      const height = container.clientHeight || 500;
      renderer.setSize(width, height);

      // 2. Camera and Scene
      scene = new THREE.Scene();
      camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

      // 3. Load Texture
      const textureLoader = new THREE.TextureLoader();
      texture = textureLoader.load(
        imageSrc,
        (tex) => {
          tex.colorSpace = THREE.SRGBColorSpace;
          tex.minFilter = THREE.LinearFilter;
          tex.magFilter = THREE.LinearFilter;
          tex.generateMipmaps = false;
          setIsLoaded(true);
        },
        undefined,
        (err) => {
          console.warn('Could not load story background texture:', err);
          setHasWebGL(false);
        }
      );

      // 4. Calculate responsive lens radius (~200px diameter on desktop)
      // Diameter 200px on height ~500px => radius ~100px => radius/height ~ 0.20
      const calculateLensRadius = (h: number) => {
        const targetRadiusPixels = Math.min(105, Math.max(75, h * 0.19));
        return targetRadiusPixels / Math.max(1, h);
      };

      const initialRadius = calculateLensRadius(height);

      // 5. Shader Material
      const uniforms = {
        uTexture: { value: texture },
        uResolution: { value: new THREE.Vector2(width, height) },
        uTime: { value: 0 },
        uLensCenter: { value: new THREE.Vector2(0.5, 0.5) },
        uLensRadius: { value: initialRadius },
        uLensOpacity: { value: 0.0 }, // Starts clean & dissolved
        uClickRipple: { value: 0.0 },
        uRippleTime: { value: 0.0 },
      };

      material = new THREE.ShaderMaterial({
        vertexShader: VERTEX_SHADER,
        fragmentShader: FRAGMENT_SHADER,
        uniforms,
        depthTest: false,
        depthWrite: false,
      });
      materialRef.current = material;

      const geometry = new THREE.PlaneGeometry(2, 2);
      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);

      // 6. IntersectionObserver for Visibility & Performance
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            isVisible = entry.isIntersecting;
          });
        },
        { threshold: 0.05 }
      );
      observer.observe(container);

      // 7. Resize Handler
      const handleResize = () => {
        if (!container || !renderer || !material) return;
        const w = container.clientWidth;
        const h = container.clientHeight;
        if (w <= 0 || h <= 0) return;
        renderer.setSize(w, h);
        material.uniforms.uResolution.value.set(w, h);
        material.uniforms.uLensRadius.value = calculateLensRadius(h);
      };

      window.addEventListener('resize', handleResize);
      handleResize();

      // 8. Render & Inertia Animation Loop
      let startTime = performance.now();
      let lastTime = startTime;

      const render = () => {
        animationFrameId = requestAnimationFrame(render);
        if (!isVisible || !renderer || !scene || !camera || !material) return;

        const now = performance.now();
        const delta = Math.min(0.1, (now - lastTime) / 1000);
        lastTime = now;

        const elapsed = (now - startTime) / 1000;
        material.uniforms.uTime.value = elapsed;

        const state = lensState.current;

        // Smooth cursor follow with subtle inertia delay (lerp rate ~ 0.14)
        state.currentX += (state.targetX - state.currentX) * 0.14;
        state.currentY += (state.targetY - state.currentY) * 0.14;

        // Smooth fade-in and dissolve (lerp rate ~ 0.12)
        state.currentOpacity += (state.targetOpacity - state.currentOpacity) * 0.12;

        // Click ripple pulse decay
        if (state.clickRipple > 0.001) {
          state.rippleTime += delta;
          state.clickRipple *= Math.pow(0.04, delta); // Fast smooth decay
          if (state.clickRipple < 0.001) {
            state.clickRipple = 0;
            state.rippleTime = 0;
          }
        }

        // Update Shader Uniforms
        material.uniforms.uLensCenter.value.set(state.currentX, state.currentY);
        material.uniforms.uLensOpacity.value = state.currentOpacity;
        material.uniforms.uClickRipple.value = state.clickRipple;
        material.uniforms.uRippleTime.value = state.rippleTime;

        renderer.render(scene, camera);
      };
      render();

      return () => {
        observer.disconnect();
        window.removeEventListener('resize', handleResize);
        if (animationFrameId !== null) cancelAnimationFrame(animationFrameId);
        geometry.dispose();
        material?.dispose();
        texture?.dispose();
        renderer?.dispose();
      };
    } catch (e) {
      console.warn('WebGL initialization failed, using static fallback:', e);
      setHasWebGL(false);
    }
  }, [imageSrc]);

  return (
    <div
      ref={containerRef}
      onPointerEnter={handlePointerEnter}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onClick={handleClick}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className={`relative w-full h-full overflow-hidden cursor-crosshair select-none ${className}`}
    >
      {hasWebGL ? (
        <>
          <canvas
            ref={canvasRef}
            className="w-full h-full block object-cover"
            style={{ width: '100%', height: '100%' }}
          />
          {/* Subtle antique gold luxury perimeter rim */}
          <div className="pointer-events-none absolute inset-0 border border-[#C5A059]/40 z-20 shadow-[inset_0_0_24px_rgba(17,19,18,0.6)]" />
        </>
      ) : (
        /* Clean uninterrupted static fallback */
        <div className="relative w-full h-full overflow-hidden bg-[#111312]">
          <img
            src={imageSrc}
            alt="Historical art and heritage archival objects"
            className="w-full h-full object-cover object-[30%_center]"
          />
          <div className="pointer-events-none absolute inset-0 border border-[#C5A059]/40 z-20" />
        </div>
      )}
    </div>
  );
}
