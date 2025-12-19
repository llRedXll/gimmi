import React, { useState, useEffect } from 'react';
import {
    Users,
    UserPlus,
    Search,
    Shield,
    Gift,
    Plus,
    Check,
    X,
    Cake,
    Loader2,
    AlertCircle
} from 'lucide-react';
import { BentoCard } from './BentoCard';
import { StickerBadge } from './StickerBadge';
import { supabase } from '../supabaseClient';
import { Friend } from '../types';

type PeepsTab = 'FRIENDS' | 'GROUPS' | 'REQUESTS';

interface MyPeepsViewProps {
    onViewProfile: (friendId: string) => void;
    currentUserId?: string;
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

export const MyPeepsView: React.FC<MyPeepsViewProps> = ({ onViewProfile, currentUserId }) => {
    const [activeTab, setActiveTab] = useState<PeepsTab>('FRIENDS');
    const [friends, setFriends] = useState<Friend[]>([]);
    const [loading, setLoading] = useState(true);

    // Add Friend State
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [searchUsername, setSearchUsername] = useState('');
    const [addFriendStatus, setAddFriendStatus] = useState<'IDLE' | 'LOADING' | 'SUCCESS' | 'ERROR'>('IDLE');
    const [addFriendMessage, setAddFriendMessage] = useState('');

    useEffect(() => {
        if (currentUserId) {
            fetchFrieds();
        }
    }, [currentUserId]);

    const fetchFrieds = async () => {
        setLoading(true);
        // Fetch friendships where I am the user_id
        // We join on 'profiles' with the friend_id
        const { data, error } = await supabase
            .from('friendships')
            .select(`
        friend_id,
        profiles!friend_id (
          id,
          full_name,
          username,
          avatar_url,
          birthday
        )
      `)
            .eq('user_id', currentUserId);

        if (error) {
            console.error('Error fetching friends:', error);
        } else {
            const mappedFriends: Friend[] = data.map((item: any) => {
                const profile = item.profiles;
                // Calculate next birthday simple logic for now
                let nextBday = "Unknown";
                if (profile.birthday) {
                    const date = new Date(profile.birthday);
                    nextBday = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                }

                return {
                    id: profile.id,
                    name: profile.full_name || 'Friend',
                    username: profile.username || 'unknown',
                    avatar: profile.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.id}`,
                    nextBirthday: nextBday
                };
            });
            setFriends(mappedFriends);
        }
        setLoading(false);
    };

    const handleAddFriend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchUsername.trim()) return;

        setAddFriendStatus('LOADING');
        setAddFriendMessage('');

        try {
            const { data, error } = await supabase.rpc('add_friend_by_username', {
                friend_username: searchUsername
            });

            if (error) throw error;

            if (data.success) {
                setAddFriendStatus('SUCCESS');
                setAddFriendMessage(data.message);
                setSearchUsername('');
                fetchFrieds(); // Refresh list
                setTimeout(() => {
                    setIsAddModalOpen(false);
                    setAddFriendStatus('IDLE');
                    setAddFriendMessage('');
                }, 1500);
            } else {
                setAddFriendStatus('ERROR');
                setAddFriendMessage(data.message);
            }

        } catch (err: any) {
            setAddFriendStatus('ERROR');
            setAddFriendMessage(err.message || 'Failed to add friend');
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            {/* Add Friend Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setIsAddModalOpen(false)} />
                    <div className="bg-white border-2 border-black shadow-hard rounded-2xl p-6 w-full max-w-md relative z-10 animate-[popIn_0.2s_ease-out]">
                        <button
                            onClick={() => setIsAddModalOpen(false)}
                            className="absolute top-4 right-4 p-1 hover:bg-slate-100 rounded-lg"
                        >
                            <X size={20} />
                        </button>

                        <h2 className="text-2xl font-black mb-1">Add a Friend</h2>
                        <p className="text-slate-500 font-bold text-sm mb-6">Enter their username to connect.</p>

                        <form onSubmit={handleAddFriend}>
                            <div className="mb-4">
                                <label className="block text-xs font-black uppercase tracking-wide mb-2">Username</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-3.5 font-bold text-slate-400">@</span>
                                    <input
                                        value={searchUsername}
                                        onChange={(e) => setSearchUsername(e.target.value)}
                                        placeholder="username"
                                        className="w-full pl-8 pr-4 py-3 rounded-xl border-2 border-black font-bold focus:outline-none focus:shadow-hard-sm transition-shadow bg-slate-50"
                                        autoFocus
                                    />
                                </div>
                            </div>

                            {addFriendStatus === 'ERROR' && (
                                <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg border-2 border-red-100 mb-4 font-bold text-sm">
                                    <AlertCircle size={16} /> {addFriendMessage}
                                </div>
                            )}

                            {addFriendStatus === 'SUCCESS' && (
                                <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-lg border-2 border-green-100 mb-4 font-bold text-sm">
                                    <Check size={16} /> {addFriendMessage}
                                </div>
                            )}

                            <button
                                disabled={addFriendStatus === 'LOADING'}
                                className="w-full py-3 bg-black text-white font-bold rounded-xl shadow-hard hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                            >
                                {addFriendStatus === 'LOADING' ? <Loader2 className="animate-spin" /> : <UserPlus size={18} />}
                                Send Request
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* View Header */}
            <div className="mb-8 flex flex-col sm:flex-row justify-between items-end sm:items-center gap-4">
                <div>
                    <h1 className="text-4xl font-black text-black transform -rotate-1 flex items-center gap-3">
                        My Peeps <Users size={32} className="text-brand-500" />
                    </h1>
                    <p className="font-bold text-slate-500 ml-1 mt-1">Keep your circle close and your gifts closer.</p>
                </div>

                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-xl font-bold border-2 border-black shadow-hard-sm hover:scale-105 transition-transform"
                >
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
                <TabButton active={activeTab === 'REQUESTS'} onClick={() => setActiveTab('REQUESTS')} badgeCount={0}>
                    Requests
                </TabButton>
            </div>

            {/* Content Area */}
            <div className="animate-[popIn_0.3s_ease-out]">

                {/* FRIENDS TAB */}
                {activeTab === 'FRIENDS' && (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                            {loading ? (
                                <div className="col-span-full py-12 flex justify-center">
                                    <Loader2 className="animate-spin text-brand-500" size={32} />
                                </div>
                            ) : friends.length === 0 ? (
                                <div className="col-span-full py-12 text-center text-slate-400 font-bold border-2 border-dashed border-slate-200 rounded-xl">
                                    No friends yet. Add someone to get started!
                                </div>
                            ) : (
                                friends.map(friend => (
                                    <BentoCard
                                        key={friend.id}
                                        className="min-h-0 p-5 group hover:bg-slate-50 cursor-pointer"
                                    >
                                        <div onClick={() => onViewProfile(friend.id)}>
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-16 h-16 rounded-full border-2 border-black overflow-hidden bg-gray-200">
                                                        <img src={friend.avatar} alt={friend.name} className="w-full h-full object-cover" />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-lg font-black leading-none mb-1">{friend.name}</h3>
                                                        <p className="text-xs font-bold text-slate-400 mb-2">@{friend.username}</p>
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
                                ))
                            )}
                        </div>
                    </>
                )}

                {/* GROUPS TAB */}
                {activeTab === 'GROUPS' && (
                    <div className="py-12 text-center text-slate-400 font-bold">
                        Coming soon...
                    </div>
                )}

                {/* REQUESTS TAB */}
                {activeTab === 'REQUESTS' && (
                    <div className="max-w-2xl mx-auto space-y-4">
                        <div className="text-center py-12 bg-white/50 rounded-2xl border-2 border-dashed border-black/20">
                            <Shield size={48} className="mx-auto text-slate-300 mb-3" />
                            <h3 className="text-lg font-black text-slate-400">No Pending Requests</h3>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};
