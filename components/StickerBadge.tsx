
import React from 'react';
import { X } from 'lucide-react';

interface StickerBadgeProps { 
  children: React.ReactNode; 
  color?: string; 
  onRemove?: () => void;
  isEditing?: boolean;
}

export const StickerBadge: React.FC<StickerBadgeProps> = ({ children, color = 'bg-blue-300 text-blue-900', onRemove, isEditing }) => {
  return (
    <span className={`
      relative group
      px-3 py-1.5 
      rounded-lg 
      text-sm font-bold 
      border-2 border-black 
      shadow-hard-sm 
      transform hover:-rotate-2 transition-transform cursor-default
      ${color} 
      inline-flex items-center gap-1
    `}>
      {children}
      {isEditing && onRemove && (
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-1 -mr-1 p-0.5 bg-white rounded-full border border-black hover:bg-red-100 text-red-600"
        >
          <X size={10} strokeWidth={3} />
        </button>
      )}
    </span>
  );
};
