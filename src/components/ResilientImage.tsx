import { useState } from 'react';

interface ResilientImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackLabel?: string;
}

export function ResilientImage({ src, alt, className = '', fallbackLabel }: ResilientImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#EDF3EF] via-[#E3E9E5] to-[#D6E0D9] text-[#1B4332] p-6 text-center ${className}`}
        role="img"
        aria-label={alt}
      >
        <svg
          className="w-8 h-8 mb-2 opacity-70"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 3c-2.5 3.5-6 6.2-6 10.2A6 6 0 0 0 18 13.2C18 9.2 14.5 6.5 12 3Z"
          />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v11" />
        </svg>
        <span className="font-display text-lg font-semibold tracking-tight text-[#1A1D1B]">
          {fallbackLabel || alt}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
      loading="lazy"
    />
  );
}
