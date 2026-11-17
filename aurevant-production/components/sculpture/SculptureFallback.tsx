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
      <picture className="max-h-[420px] sm:max-h-[450px] lg:max-h-[470px] xl:max-h-[480px] w-auto flex items-center justify-center">
        <source srcSet="/images/sculpture-fallback.webp" type="image/webp" />
        <img
          src={imageSrc}
          alt="Antique Roman Classical Marble Bust"
          width={400}
          height={480}
          className="max-h-[420px] sm:max-h-[450px] lg:max-h-[470px] xl:max-h-[480px] w-auto object-contain filter drop-shadow-[0_24px_48px_rgba(0,0,0,0.85)] select-none"
          style={{
            maskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)',
          }}
        />
      </picture>
    </div>
  );
}
