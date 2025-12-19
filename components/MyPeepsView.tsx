
import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  Search, 
  Settings, 
  Shield, 
  Gift, 
  User, 
  Plus,
  Check,
  X,
  MessageCircle,
  Cake
} from 'lucide-react';
import { BentoCard } from './BentoCard';
import { StickerBadge } from './StickerBadge';
import { MOCK_FRIENDS, MOCK_GROUPS, MOCK_REQUESTS } from '../constants';

type PeepsTab = 'FRIENDS' | 'GROUPS' | 'REQUESTS';

interface MyPeepsViewProps {
    onViewProfile: (friendId: string) => void;
}

const TabButton: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode; badgeCount?: number }> = ({ active, onClick, children, badgeCount }) => (
  <button 
    onClick={onClick}
    className={`
      flex items-center gap-2 px-5 py-3 rounded-xl font-black text-sm uppercase tracking-wide border-2 border-black transition-all
      ${active 
        ? 'bg-pop-yellow shadow-none translate-x-[2px] translate-y-[2px]' 
        : 'bg-white shadow-hard-sm hover:-translate-y-1 hover:shadow-hard'
      }
    `}
  >
    {children}
    {badgeCount !== undefined && badgeCount > 0 && (
      <span className="bg-brand-500 text-white text-[10px] px-1.5 py-0.5 rounded-full border border-black">
        {badgeCount}
      </span>
    )}
  </button>
);

export const MyPeepsView: React.FC<MyPeepsViewProps> = ({ onViewProfile }) => {
  const [activeTab, setActiveTab] = useState<PeepsTab>('FRIENDS');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* View Header */}
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-end sm:items-center gap-4">
         <div>
            <h1 className="text-4xl font-black text-black transform -rotate-1 flex items-center gap-3">
               My Peeps <Users size={32} className="text-brand-500" />
            </h1>
            <p className="font-bold text-slate-500 ml-1 mt-1">Keep your circle close and your gifts closer.</p>
         </div>
         
         <button className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-xl font-bold border-2 border-black shadow-hard-sm hover:scale-105 transition-transform">
             <UserPlus size={18} /> Add Friend
         </button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-3 mb-8">
        <TabButton active={activeTab === 'FRIENDS'} onClick={() => setActiveTab('FRIENDS')}>
            All Peeps
        </TabButton>
        <TabButton active={activeTab === 'GROUPS'} onClick={() => setActiveTab('GROUPS')}>
            My Groups
        </TabButton>
        <TabButton active={activeTab === 'REQUESTS'} onClick={() => setActiveTab('REQUESTS')} badgeCount={MOCK_REQUESTS.length}>
            Requests
        </TabButton>
      </div>

      {/* Content Area */}
      <div className="animate-[popIn_0.3s_ease-out]">
        
        {/* FRIENDS TAB */}
        {activeTab === 'FRIENDS' && (
           <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {/* Search Bar - Pseudo functional */}
                 <div className="col-span-1 md:col-span-2 lg:col-span-3 mb-2">
                    <div className="relative">
                        <Search className="absolute left-4 top-3.5 text-slate-400" size={20} />
                        <input 
                           placeholder="Search your peeps..." 
                           className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-black font-bold focus:outline-none focus:shadow-hard-sm transition-shadow placeholder:text-slate-300"
                        />
                    </div>
                 </div>

                 {MOCK_FRIENDS.map(friend => (
                     <BentoCard 
                        key={friend.id} 
                        className="min-h-0 p-5 group hover:bg-slate-50 cursor-pointer"
                        // Make the whole card clickable
                        
                     >
                         {/* Card content wrapper to handle click */}
                        <div onClick={() => onViewProfile(friend.id)}>
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-full border-2 border-black overflow-hidden bg-gray-200">
                                        <img src={friend.avatar} alt={friend.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-black leading-none mb-1">{friend.name}</h3>
                                        <p className="text-xs font-bold text-slate-400 mb-2">{friend.username}</p>
                                        <StickerBadge color="bg-pop-pink text-black text-[10px] py-0.5">
                                            <Cake size={10} /> {friend.nextBirthday}
                                        </StickerBadge>
                                    </div>
                                </div>
                                <button className="p-2 border-2 border-black rounded-lg hover:bg-pop-blue transition-colors shadow-sm">
                                    <Gift size={20} />
                                </button>
                            </div>
                        </div>
                     </BentoCard>
                 ))}
              </div>
           </>
        )}

        {/* GROUPS TAB */}
        {activeTab === 'GROUPS' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Create New Group Card */}
                <button className="border-4 border-dashed border-black/20 rounded-2xl p-8 flex flex-col items-center justify-center gap-3 text-slate-400 hover:text-black hover:bg-white/50 hover:border-black/50 transition-all min-h-[200px]">
                    <div className="bg-white p-3 rounded-full border-2 border-dashed border-current">
                        <Plus size={32} strokeWidth={3} />
                    </div>
                    <span className="font-black uppercase text-lg">Create New Group</span>
                </button>

                {MOCK_GROUPS.map(group => (
                    <BentoCard key={group.id} variant="white" className="min-h-0 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-2 bg-black text-white rounded-bl-xl font-bold text-xs">
                            {group.role}
                        </div>
                        <div className="flex flex-col h-full">
                            <div className="mb-4">
                                <h3 className="text-2xl font-black uppercase mb-1">{group.name}</h3>
                                <p className="text-sm font-bold text-slate-500">{group.description}</p>
                            </div>
                            
                            <div className="mt-auto flex items-center justify-between border-t-2 border-slate-100 pt-4">
                                <div className="flex -space-x-2">
                                    {group.members.map((m, i) => (
                                        <div key={i} className="w-8 h-8 rounded-full border-2 border-white ring-2 ring-black overflow-hidden bg-gray-200">
                                            <img src={m} alt="" className="w-full h-full object-cover" />
                                        </div>
                                    ))}
                                    <div className="w-8 h-8 rounded-full border-2 border-white ring-2 ring-black bg-slate-100 flex items-center justify-center text-[10px] font-bold">
                                        +{group.memberCount - group.members.length}
                                    </div>
                                </div>
                                <button className="text-xs font-black uppercase underline hover:text-brand-500">
                                    Manage Group
                                </button>
                            </div>
                        </div>
                    </BentoCard>
                ))}
            </div>
        )}

        {/* REQUESTS TAB */}
        {activeTab === 'REQUESTS' && (
            <div className="max-w-2xl mx-auto space-y-4">
                {MOCK_REQUESTS.length === 0 ? (
                    <div className="text-center py-12 bg-white/50 rounded-2xl border-2 border-dashed border-black/20">
                        <Shield size={48} className="mx-auto text-slate-300 mb-3" />
                        <h3 className="text-lg font-black text-slate-400">No Pending Requests</h3>
                    </div>
                ) : (
                    MOCK_REQUESTS.map(req => (
                        <div key={req.id} className="bg-white border-2 border-black p-4 rounded-xl shadow-hard-sm flex items-center justify-between">
                             <div className="flex items-center gap-3">
                                 <div className="w-12 h-12 rounded-full border-2 border-black overflow-hidden">
                                     <img src={req.fromAvatar} alt="" className="w-full h-full object-cover" />
                                 </div>
                                 <div>
                                     <h4 className="font-black text-lg leading-none">{req.fromName}</h4>
                                     <span className="text-xs font-bold text-slate-500">Sent {req.timestamp}</span>
                                 </div>
                             </div>
                             <div className="flex gap-2">
                                 <button className="w-10 h-10 flex items-center justify-center bg-slate-100 border-2 border-black rounded-lg hover:bg-red-100 hover:text-red-600 transition-colors">
                                     <X size={20} strokeWidth={3} />
                                 </button>
                                 <button className="w-10 h-10 flex items-center justify-center bg-brand-500 text-white border-2 border-black rounded-lg hover:bg-brand-600 transition-colors shadow-sm active:translate-y-1">
                                     <Check size={20} strokeWidth={4} />
                                 </button>
                             </div>
                        </div>
                    ))
                )}
            </div>
        )}

      </div>
    </div>
  );
};
