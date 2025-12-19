
import React from 'react';
import { X, ExternalLink, MessageSquare, Check, Lock, Tag } from 'lucide-react';
import { WishlistItem } from '../types';

interface ItemModalProps {
  item: WishlistItem | null;
  isOpen: boolean;
  onClose: () => void;
  onClaim: (e: React.MouseEvent, id: string) => void;
}

export const ItemModal: React.FC<ItemModalProps> = ({ item, isOpen, onClose, onClaim }) => {
  if (!isOpen || !item) return null;

  const isClaimed = item.status === 'CLAIMED';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>
      
      {/* Modal Content */}
      <div className="
        relative 
        w-full max-w-lg 
        bg-white 
        border-[3px] border-black 
        rounded-3xl 
        shadow-hard-lg 
        overflow-hidden 
        flex flex-col
        max-h-[90vh]
        animate-[popIn_0.2s_ease-out]
      ">
        
        {/* Header / Image */}
        <div className="relative h-56 bg-gray-100 border-b-[3px] border-black group overflow-hidden shrink-0">
            {item.imageUrl ? (
                <img 
                  src={item.imageUrl} 
                  alt={item.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
            ) : (
                <div className="w-full h-full flex items-center justify-center bg-pop-blue/20">
                    <span className="text-black/20 font-black text-4xl uppercase">No Image</span>
                </div>
            )}
            
            {/* Close Button */}
            <button 
                onClick={onClose}
                className="absolute top-4 right-4 bg-white border-2 border-black rounded-full p-2 hover:bg-red-100 transition-colors shadow-hard-sm z-10"
            >
                <X size={20} />
            </button>
            
             {/* Priority Badge */}
             <div className="absolute bottom-4 left-4">
                <span className={`
                    px-3 py-1.5 rounded-lg text-sm font-black border-2 border-black shadow-hard-sm
                    ${item.priority === 'High' ? 'bg-red-300 text-red-900' : 
                      item.priority === 'Medium' ? 'bg-blue-300 text-blue-900' : 
                      'bg-slate-200 text-slate-800'}
                `}>
                    {item.priority} Priority
                </span>
             </div>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto pop-scrollbar">
            <div className="mb-6">
                <h2 className="text-3xl font-black text-black uppercase leading-tight mb-2">{item.name}</h2>
                <div className="flex items-center gap-2 text-slate-600 font-bold">
                    <Tag size={16} />
                    <span>Est. {item.priceRange}</span>
                </div>
            </div>

            {/* Notes Section - Sticky Note Style */}
            {item.notes && (
                <div className="bg-pop-yellow p-4 rounded-xl border-2 border-black shadow-sm transform -rotate-1 mb-6 relative">
                    {/* Tape visual */}
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-white/40 border-l border-r border-white/60 transform rotate-2"></div>
                    
                    <div className="flex items-center gap-2 mb-2 text-black/60 font-black uppercase text-xs tracking-wider">
                        <MessageSquare size={14} />
                        Notes from Alex
                    </div>
                    <p className="font-display text-lg leading-tight text-black">
                        "{item.notes}"
                    </p>
                </div>
            )}
            
            {!item.notes && (
                 <div className="p-4 rounded-xl border-2 border-dashed border-slate-300 text-slate-400 text-center mb-6 font-bold text-sm">
                    No extra notes provided for this item.
                 </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
                {item.link ? (
                    <a 
                        href={item.link} 
                        target="_blank" 
                        rel="noreferrer"
                        className="flex-1 px-4 py-3 bg-white border-2 border-black rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors shadow-hard-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none active:translate-y-[2px] active:translate-x-[2px]"
                    >
                        <ExternalLink size={18} />
                        View Online
                    </a>
                ) : (
                    <button disabled className="flex-1 px-4 py-3 bg-slate-100 border-2 border-slate-200 text-slate-400 rounded-xl font-bold flex items-center justify-center gap-2 cursor-not-allowed">
                        <ExternalLink size={18} />
                        No Link
                    </button>
                )}
                
                <button
                  disabled={isClaimed}
                  onClick={(e) => {
                      onClaim(e, item.id);
                      // Do not close immediately, let the user see the celebration
                  }}
                  className={`
                    flex-[1.5] px-4 py-3 rounded-xl font-black flex items-center justify-center gap-2 border-2 border-black transition-all
                    ${isClaimed 
                      ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none' 
                      : `text-white shadow-hard-sm hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px] bg-brand-500 hover:bg-brand-600 active:translate-y-[2px] active:translate-x-[2px]`
                    }
                  `}
                >
                  {isClaimed ? (
                    <>
                        <Lock size={18} /> CLAIMED
                    </>
                  ) : (
                    <>
                      <Check size={20} strokeWidth={4} /> I'LL GET THIS!
                    </>
                  )}
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};
