import React from 'react';

export default function InputArea({ 
  label, 
  value, 
  onChange, 
  placeholder = "", 
  rows = 4,
  className = "",
  ...props 
}) {
  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-neutral-300">
          {label}
        </label>
      )}
      <textarea
        className="w-full rounded-lg border border-neutral-700 bg-neutral-900/50 text-neutral-200 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none placeholder-neutral-500 transition-colors"
        rows={rows}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        {...props}
      />
    </div>
  );
}