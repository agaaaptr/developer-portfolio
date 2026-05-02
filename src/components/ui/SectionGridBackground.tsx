import React from 'react';

export const SectionGridBackground: React.FC = () => {
  return (
    <>
      <div
        className="absolute top-0 left-0 right-0 h-32 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, #0a0a12 0%, transparent 100%)',
        }}
      />

      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0 bg-grid-pattern bg-grid opacity-50"
          style={{
            WebkitMaskImage:
              'linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.14) 10%, rgba(0, 0, 0, 0.55) 18%, #000 28%, #000 100%)',
            maskImage:
              'linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.14) 10%, rgba(0, 0, 0, 0.55) 18%, #000 28%, #000 100%)',
          }}
        />
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-dark-900/95 via-dark-900/72 to-transparent backdrop-blur-[10px]" />
      </div>
    </>
  );
};
