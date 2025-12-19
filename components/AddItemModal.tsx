
import React, { useState } from 'react';
import { X, Plus, Sparkles } from 'lucide-react';
import { Priority } from '../types';

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (item: {
    name: string;
    priceRange: string;
    priority: Priority;
    imageUrl?: string;
    link?: string;
    notes?: string;
  }) => void;
}

export const AddItemModal: React.FC<AddItemModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: '',
    priceRange: '',
    priority: 'Medium' as Priority,
    imageUrl: '',
    link: '',
    notes: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(formData);
    setFormData({
      name: '',
      priceRange: '',
      priority: 'Medium',
      imageUrl: '',
      link: '',
      notes: ''
    });
    onClose();
  };

  const inputClass = "w-full px-4 py-2 border-2 border-black rounded-xl focus:outline-none focus:shadow-hard-sm transition-all font-bold placeholder:text-slate-400";
  const labelClass = "block text-xs font-black uppercase tracking-wider mb-1 ml-1";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-lg bg-white border-[3px] border-black rounded-3xl shadow-hard-lg overflow-hidden flex flex-col max-h-[90vh] animate-[popIn_0.2s_ease-out]">
        
        {/* Header */}
        <div className="bg-pop-green p-6 border-b-[3px] border-black flex justify-between items-center">
          <h2 className="text-2xl font-black text-black uppercase flex items-center gap-2">
            <Plus size={28} strokeWidth={4} /> Add New Gift
          </h2>
          <button onClick={onClose} className="bg-white border-2 border-black rounded-full p-2 hover:bg-red-100 shadow-hard-sm">
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <div className="p-6 overflow-y-auto pop-scrollbar bg-slate-50">
          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div>
              <label className={labelClass}>Item Name *</label>
              <input 
                required
                className={inputClass}
                placeholder="e.g. Super Cool Sneakers"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Price Est. *</label>
                <input 
                  required
                  className={inputClass}
                  placeholder="$50 - $100"
                  value={formData.priceRange}
                  onChange={e => setFormData({...formData, priceRange: e.target.value})}
                />
              </div>
              <div>
                <label className={labelClass}>Priority</label>
                <select 
                  className={`${inputClass} appearance-none bg-white`}
                  value={formData.priority}
                  onChange={e => setFormData({...formData, priority: e.target.value as Priority})}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
            </div>

            <div>
              <label className={labelClass}>Image URL (Optional)</label>
              <input 
                className={inputClass}
                placeholder="https://..."
                value={formData.imageUrl}
                onChange={e => setFormData({...formData, imageUrl: e.target.value})}
              />
            </div>

            <div>
              <label className={labelClass}>Link (Optional)</label>
              <input 
                className={inputClass}
                placeholder="https://amazon.com/..."
                value={formData.link}
                onChange={e => setFormData({...formData, link: e.target.value})}
              />
            </div>

            <div>
              <label className={labelClass}>Notes</label>
              <textarea 
                className={`${inputClass} min-h-[100px] resize-none`}
                placeholder="Any specific details? Color? Size?"
                value={formData.notes}
                onChange={e => setFormData({...formData, notes: e.target.value})}
              />
            </div>

            <div className="pt-4">
              <button 
                type="submit"
                className="w-full py-4 bg-brand-500 hover:bg-brand-600 text-white border-2 border-black rounded-xl font-black text-lg shadow-hard-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                ADD TO WISHLIST <Sparkles size={20} fill="currentColor" />
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};
