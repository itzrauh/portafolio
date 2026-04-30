import React from 'react';
import CopyButton from './CopyButton';

export default function OutputArea({ 
  text, 
  placeholder = "El resultado aparecerá aquí...", 
  showCopy = true,
  className = "",
  onCopy,
  ...props 
}) {
  return (
    <div className={`relative ${className}`}>
      <div
        className="w-full rounded-lg border border-neutral-700 bg-neutral-900/50 text-neutral-200 p-3 min-h-[100px] whitespace-pre-wrap font-mono text-sm placeholder-neutral-500 transition-colors"
        {...props}
      >
        {text || placeholder}
      </div>
      
      {showCopy && text && (
        <div className="absolute top-2 right-2">
          <CopyButton text={text} onCopy={onCopy} />
        </div>
      )}
    </div>
  );
}