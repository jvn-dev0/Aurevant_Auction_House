import React from 'react';

interface SculptureFallbackProps {
  className?: string;
  imageSrc?: string;
}

export function SculptureFallback({
  className = '',
  imageSrc = '/images/sculpture-fallback.png',
}: SculptureFallbackProps) {
  return (
    <div
      className={`sculpture-fallback relative w-full h-full flex items-center justify-center pointer-events-none select-none ${className}`}
      aria-hidden="true"
    >
      {/* Warm ambient spotlight under statue */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-72 h-16 bg-[#C5A059]/10 rounded-full blur-2xl -z-10" />

      {/* Fallback Classical Marble Statue Image */}
      <img
        src={imageSrc}
        alt="Antique Roman Classical Marble Bust"
        className="max-h-[540px] lg:max-h-[640px] xl:max-h-[700px] w-auto object-contain filter drop-shadow-[0_24px_48px_rgba(0,0,0,0.85)] transform transition-transform duration-700 ease-out"
        style={{
          maskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)',
        }}
      />
    </div>
  );
}
