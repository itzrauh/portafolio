import React from 'react';

export default function ToolLayout({ 
  icon, 
  title, 
  description, 
  children, 
  className = "" 
}) {
  return (
    <div className={`max-w-4xl mx-auto pt-10 px-6 ${className}`}>
      <div className="rounded-xl border border-neutral-800 bg-neutral-950/50 backdrop-blur-sm p-6 transition-all duration-200 hover:bg-neutral-900/50 hover:border-neutral-700">
        <div className="flex items-center gap-3 mb-6">
          {icon && (
            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-700/20 border border-blue-500/30">
              {icon}
            </div>
          )}
          <div>
            <h3 className="text-xl font-semibold text-neutral-100">{title}</h3>
            {description && (
              <p className="text-neutral-400 text-sm mt-1">{description}</p>
            )}
          </div>
        </div>
        <div className="space-y-6">
          {children}
        </div>
      </div>
    </div>
  );
}