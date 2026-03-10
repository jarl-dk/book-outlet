import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CopyButtonProps {
  textToCopy: string;
}

const CopyButton: React.FC<CopyButtonProps> = ({ textToCopy }) => {
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const handleAction = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    try {
      await navigator.clipboard.writeText(textToCopy);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Kunne ikke kopiere", err);
    }
  };

  return (
    <div className="relative inline-flex items-center">
      {/* Selve knappen */}
      <button
        onClick={handleAction}
        type="button"
        className="inline-flex items-center justify-center w-8 h-8 rounded-md 
                   hover:bg-accent hover:text-accent-foreground transition-colors
                   opacity-0 group-hover:opacity-100 focus:opacity-100"
        title="Kopier"
      >
        {isCopied ? (
          <Check className="h-4 w-4 text-green-500" />
        ) : (
          <Copy className="h-4 w-4 text-muted-foreground" />
        )}
      </button>

      {/* Lille svævende tekst-besked */}
      {isCopied && (
        <span className="absolute left-full ml-2 px-2 py-0.5 text-[10px] 
                         font-medium text-white bg-green-600 rounded shadow-sm 
                         whitespace-nowrap animate-in fade-in zoom-in duration-200">
          Kopieret!
        </span>
      )}
    </div>
  );
};

export default CopyButton;