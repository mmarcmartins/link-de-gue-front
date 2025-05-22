import { useState } from 'react';

interface CopyButtonProps {
  textToCopy: string;
  className?: string;
}

export const CopyButton = ({ textToCopy, className = '' }: CopyButtonProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`
        inline-flex items-center gap-1.5
        px-2 py-1
        text-xs sm:text-sm
        font-medium
        rounded-md
        transition-all
        hover:cursor-pointer
        duration-200
        ${copied 
          ? 'bg-green-100 text-green-700 border border-green-200' 
          : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
        }
        ${className}
      `}
      title={copied ? 'Copiado!' : 'Copiar link'}
    >
      {copied ? (
        <>
          <svg 
            className="w-4 h-4" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M5 13l4 4L19 7" 
            />
          </svg>
          Copiado!
        </>
      ) : (
        <>
          <svg 
            className="w-4 h-4" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" 
            />
          </svg>
          Copiar
        </>
      )}
    </button>
  );
}; 