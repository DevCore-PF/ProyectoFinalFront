
"use client";

interface LoaderProps {
  size?: 'small' | 'medium' | 'large' | 'fullscreen';
  className?: string;
}

const Loader = ({ size = 'fullscreen', className = '' }: LoaderProps) => {
  const sizeClasses = {
    small: 'h-32',
    medium: 'h-64',
    large: 'h-96',
    fullscreen: 'min-h-screen'
  };

  const dotSizes = {
    small: 'w-2 h-2',
    medium: 'w-3 h-3',
    large: 'w-4 h-4',
    fullscreen: 'w-3 h-3'
  };

  const spinnerSizes = {
    small: 'w-12 h-12',
    medium: 'w-20 h-20',
    large: 'w-28 h-28',
    fullscreen: 'w-20 h-20'
  };

  return (
    <div className={`${sizeClasses[size]} flex items-center justify-center p-4 ${className}`}>
      <div className={`relative ${spinnerSizes[size]}`}>
        <div className="absolute inset-0 animate-spin">
          <div className={`absolute top-0 left-1/2 -translate-x-1/2 ${dotSizes[size]} bg-button rounded-full`}></div>
          <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 ${dotSizes[size]} bg-button rounded-full opacity-30`}></div>
          <div className={`absolute left-0 top-1/2 -translate-y-1/2 ${dotSizes[size]} bg-button rounded-full opacity-60`}></div>
          <div className={`absolute right-0 top-1/2 -translate-y-1/2 ${dotSizes[size]} bg-button rounded-full opacity-80`}></div>
        </div>

        <style jsx>{`
          @keyframes spin {
            to {
              transform: rotate(360deg);
            }
          }
          .animate-spin {
            animation: spin 1s linear infinite;
          }
        `}</style>
      </div>
    </div>
  );
};

export default Loader;