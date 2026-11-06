'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { SculptureFallback } from './SculptureFallback';

// Dynamically import Three.js canvas with ssr: false
const SculptureCanvas = dynamic(
  () => import('./SculptureCanvas').then((mod) => mod.SculptureCanvas),
  {
    ssr: false,
    loading: () => <SculptureFallback />,
  }
);

interface SculptureContainerProps {
  className?: string;
  modelPath?: string;
  fallbackImageSrc?: string;
}

export function SculptureContainer({
  className = '',
  modelPath = '/models/marble_bust_01.glb',
  fallbackImageSrc = '/images/sculpture-fallback.png',
}: SculptureContainerProps) {
  const [isCanvasReady, setIsCanvasReady] = useState(false);
  const [hasWebGLFailed, setHasWebGLFailed] = useState(false);

  return (
    <div
      className={`sculpture-container relative w-full h-full min-h-[420px] sm:min-h-[460px] lg:min-h-[480px] xl:min-h-[500px] h-[52vh] max-h-[520px] flex items-center justify-center ${className}`}
      data-model={modelPath}
    >
      {/* Fallback image (visible when loading or if WebGL fails) */}
      {(!isCanvasReady || hasWebGLFailed) && (
        <div
          className={`absolute inset-0 flex items-center justify-center transition-opacity duration-700 ${
            isCanvasReady ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
        >
          <SculptureFallback imageSrc={fallbackImageSrc} />
        </div>
      )}

      {/* Real-Time Three.js WebGL Canvas */}
      {!hasWebGLFailed && (
        <div
          className={`w-full h-full flex items-center justify-center transition-opacity duration-700 ${
            isCanvasReady ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <SculptureCanvas
            modelPath={modelPath}
            onLoaded={() => setIsCanvasReady(true)}
            onError={() => {
              setHasWebGLFailed(true);
              setIsCanvasReady(false);
            }}
          />
        </div>
      )}

      {/* Semantic Canvas Anchor for SSR & Assistive Technology */}
      {!isCanvasReady && (
        <canvas
          id="sculpture-canvas"
          data-model={modelPath}
          className="absolute inset-0 w-full h-full pointer-events-none opacity-0"
          aria-label="Interactive 3D Marble Figure Sculpture"
        />
      )}
    </div>

  );
}
