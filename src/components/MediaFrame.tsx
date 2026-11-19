import React, { useState } from 'react';
import { Leaf } from 'lucide-react';

interface MediaFrameProps {
  src: string;
  alt: string;
  aspectClass?: string;
  className?: string;
  fallbackTitle?: string;
}

export const MediaFrame: React.FC<MediaFrameProps> = ({
  src,
  alt,
  aspectClass = 'aspect-[16/9]',
  className = '',
  fallbackTitle,
}) => {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className={`${aspectClass} w-full rounded-xl bg-gradient-to-br from-emerald-50 via-sky-50 to-slate-100 dark:from-emerald-950/50 dark:via-sky-950/40 dark:to-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center p-6 text-center ${className}`}
      >
        <Leaf className="w-8 h-8 text-emerald-600 dark:text-emerald-400 mb-2" />
        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
          {fallbackTitle || alt}
        </p>
      </div>
    );
  }

  return (
    <div className={`${aspectClass} w-full overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800 ${className}`}>
      <img
        src={src}
        alt={alt}
        referrerPolicy="no-referrer"
        loading="lazy"
        onError={() => setFailed(true)}
        className="w-full h-full object-cover"
      />
    </div>
  );
};
