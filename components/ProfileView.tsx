
import React, { useState } from 'react';
import {
    User,
    ClipboardList,
    Heart,
    AlertOctagon,
    Sparkles,
    Tag,
    Lock,
    Check,
    PartyPopper,
    X,
    Plus,
    Trash2,
    RotateCcw,
    Calendar,
} from 'lucide-react';
import { BentoCard } from './BentoCard';
import { StickerBadge } from './StickerBadge';
import { UserProfile, WishlistItem } from '../types';

// --- Theme Config ---

const THEME_COLORS = {
    basicInfo: 'bg-pop-blue',
    sizes: 'bg-pop-yellow',
    interests: 'bg-pop-purple',
    wishlist: 'bg-white',
};

// --- Helper Components ---

const SimpleTagInput: React.FC<{ onAdd: (val: string) => void; placeholder: string; colorClass: string }> = ({ onAdd, placeholder, colorClass }) => {
    const [val, setVal] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (val.trim()) {
            const items = val.split(',').map(item => item.trim()).filter(item => item.length > 0);
            items.forEach(item => onAdd(item));
            setVal('');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mt-2 flex gap-2">
            <input
                value={val}
                onChange={(e) => setVal(e.target.value)}
                className={`flex-1 px-2 py-1 text-sm font-bold border-2 border-black rounded-lg focus:outline-none focus:shadow-hard-sm ${colorClass} placeholder:text-black/40`}
                placeholder={placeholder}
            />
            <button
                type="submit"
                disabled={!val.trim()}
                className="px-2 py-1 bg-black text-white rounded-lg font-bold border-2 border-black hover:bg-slate-800 disabled:opacity-50"
            >
                <Plus size={14} />
            </button>
        </form>
    );
};

const COMMON_SIZES = [
    'Shirt', 'Shoe', 'Pants', 'Jacket', 'Hat', 'Ring', 'Fav Color', 'Custom'
];

const AddSizeCard: React.FC<{ onAdd: (label: string, value: string) => void; onCancel: () => void }> = ({ onAdd, onCancel }) => {
    const [selectedType, setSelectedType] = useState(COMMON_SIZES[0]);
    const [customLabel, setCustomLabel] = useState('');
    const [value, setValue] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const label = selectedType === 'Custom' ? customLabel : selectedType;
        if (label && value) {
            onAdd(label, value);
        }
    };

    return (
        <div className="bg-white border-2 border-dashed border-black/40 p-3 rounded-xl shadow-none flex flex-col gap-2 relative">
            <button onClick={onCancel} className="absolute top-2 right-2 text-slate-400 hover:text-red-500">
                <X size={14} />
            </button>
            <h4 className="text-xs font-black uppercase text-slate-500">Add New Detail</h4>
            <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="w-full text-xs font-bold border-2 border-black rounded-md p-1 bg-slate-50 focus:bg-white"
                >
                    {COMMON_SIZES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>

                {selectedType === 'Custom' && (
                    <input
                        placeholder="Label (e.g. Coffee)"
                        className="w-full text-xs font-bold border-2 border-black rounded-md p-1 px-2"
                        value={customLabel}
                        onChange={(e) => setCustomLabel(e.target.value)}
                        autoFocus
                    />
                )}

                <input
                    placeholder="Value (e.g. Iced Oat Latte)"
                    className="w-full text-sm font-bold border-2 border-black rounded-md p-1 px-2"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    required
                />

                <button
                    type="submit"
                    className="bg-black text-white text-xs font-bold py-1.5 rounded-md hover:bg-slate-800"
                >
                    Add
                </button>
            </form>
        </div>
    );
};

const WishlistItemCard: React.FC<{
    item: WishlistItem;
    onClaim: (e: React.MouseEvent, id: string) => void;
    onUnclaim: (e: React.MouseEvent, id: string) => void;
    onSelect: (item: WishlistItem) => void;
    onDelete?: (id: string) => void;
    isEditing: boolean;
    isOwnProfile: boolean;
}> = ({ item, onClaim, onUnclaim, onSelect, onDelete, isEditing, isOwnProfile }) => {
    const isClaimed = item.status === 'CLAIMED';
    // Use stable ID for rotation to avoid jitter on re-render
    const rotation = React.useMemo(() => item.id.charCodeAt(0) % 2 === 0 ? 'rotate-1' : '-rotate-1', [item.id]);

    const getBadgeStyle = () => {
        if (item.priority === 'High') return 'bg-red-300 text-red-900';
        if (item.priority === 'Medium') return 'bg-blue-300 text-blue-900';
        return 'bg-slate-200 text-slate-800';
    };

    return (
        <div
            onClick={() => !isEditing && onSelect(item)}
            className={`
          relative group cursor-pointer
          p-5 rounded-xl border-2 border-black 
          ${isClaimed ? 'bg-slate-100 opacity-80' : 'bg-white hover:bg-slate-50'} 
          mb-5 last:mb-0 
          transition-all duration-300 hover:scale-[1.01]
          ${!isClaimed && 'shadow-hard-sm hover:shadow-hard'}
        `}
        >
            {isEditing && onDelete && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete(item.id);
                    }}
                    className="absolute -top-3 -right-3 z-20 bg-red-500 text-white p-2 rounded-full border-2 border-black shadow-hard-sm hover:bg-red-600 hover:scale-110 transition-transform"
                >
                    <Trash2 size={16} />
                </button>
            )}

            <div className={`
          absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-4 border-l border-r border-white/50 transform ${rotation} bg-yellow-200/80
        `}></div>

            <div className="flex justify-between items-start mb-3 mt-1">
                <div className="flex gap-4">
                    {item.imageUrl && (
                        <div className="hidden sm:block w-16 h-16 rounded-lg border-2 border-black overflow-hidden shrink-0 shadow-sm transform -rotate-2">
                            <img src={item.imageUrl} alt="" className="w-full h-full object-cover" />
                        </div>
                    )}
                    <div>
                        <h3 className={`font-black text-lg leading-tight ${isClaimed ? 'text-slate-500 line-through decoration-2' : 'text-black'}`}>
                            {item.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                            <Tag size={14} className="text-black" />
                            <p className="text-sm font-bold text-slate-600 bg-slate-100 px-2 rounded-md border border-slate-300">{item.priceRange}</p>
                        </div>
                    </div>
                </div>
                <StickerBadge color={getBadgeStyle()}>
                    {item.priority}
                </StickerBadge>
            </div>

            {!isEditing && (
                <div className="mt-5 pt-3 border-t-2 border-dashed border-slate-200 flex items-center justify-between">

                    {isClaimed ? (
                        <span className="flex items-center gap-1 text-xs font-bold px-2 py-1 rounded bg-slate-200 text-slate-500 border border-slate-300">
                            <Lock size={12} /> {item.claimedByMe ? 'FULFILLED BY YOU' : 'FULFILLED'}
                        </span>
                    ) : (
                        <span className="flex items-center gap-1 text-xs font-bold px-2 py-1 rounded bg-green-100 text-green-700 border-2 border-green-200">
                            <Sparkles size={12} /> AVAILABLE
                        </span>
                    )}

                    {/* Action Button: Show if NOT own profile, OR if claimed by me (to unclaim) */}
                    {!isOwnProfile && (
                        <>
                            {item.claimedByMe ? (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onUnclaim(e, item.id);
                                    }}
                                    className="px-4 py-2 rounded-lg text-sm font-black flex items-center gap-2 border-2 border-black transition-all bg-pop-yellow text-black shadow-hard-sm hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
                                >
                                    <RotateCcw size={16} strokeWidth={3} /> CHANGE MIND
                                </button>
                            ) : (
                                <button
                                    disabled={isClaimed}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onClaim(e, item.id);
                                    }}
                                    className={`
                        px-4 py-2 rounded-lg text-sm font-black flex items-center gap-2 border-2 border-black transition-all
                        ${isClaimed
                                            ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                                            : `text-white shadow-hard-sm hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] active:scale-95 bg-brand-500 hover:bg-brand-600`
                                        }
                        `}
                                >
                                    {isClaimed ? (
                                        <>Claimed</>
                                    ) : (
                                        <>
                                            CLAIM GIFT <Check size={16} strokeWidth={4} />
                                        </>
                                    )}
                                </button>
                            )}
                        </>
                    )}
                    {/* If own profile, show simpler status or nothing? For now show nothing extra. */}

                </div>
            )}
        </div>
    );
};


// --- Main Profile View Component ---

interface ProfileViewProps {
    user: UserProfile;
    isEditing: boolean;
    isOwnProfile: boolean;
    onUpdateUser: (updatedUser: UserProfile) => void;
    onClaimGift: (e: React.MouseEvent, id: string) => void;
    onUnclaimGift: (e: React.MouseEvent, id: string) => void;
    onSelectWishlistItem: (item: WishlistItem) => void;
    onDeleteWishlistItem: (id: string) => void;
    onOpenAddModal: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
    user,
    isEditing,
    isOwnProfile,
    onUpdateUser,
    onClaimGift,
    onUnclaimGift,
    onSelectWishlistItem,
    onDeleteWishlistItem,
    onOpenAddModal
}) => {
    const [isAddingSize, setIsAddingSize] = useState(false);

    // -- Edit Handlers --
    const handleAddInterest = (val: string) => {
        onUpdateUser({ ...user, interests: [...user.interests, val] });
    };

    const handleRemoveInterest = (idx: number) => {
        onUpdateUser({ ...user, interests: user.interests.filter((_, i) => i !== idx) });
    };

    const handleAddDislike = (val: string) => {
        onUpdateUser({ ...user, dislikes: [...user.dislikes, val] });
    };

    const handleRemoveDislike = (idx: number) => {
        onUpdateUser({ ...user, dislikes: user.dislikes.filter((_, i) => i !== idx) });
    };

    const handleRemoveWishlistItem = (id: string) => {
        onDeleteWishlistItem(id);
    };

    const handleUpdateSize = (id: string, newVal: string) => {
        onUpdateUser({
            ...user,
            sizes: user.sizes.map(s => s.id === id ? { ...s, value: newVal } : s)
        });
    };

    const handleRemoveSize = (id: string) => {
        onUpdateUser({
            ...user,
            sizes: user.sizes.filter(s => s.id !== id)
        });
    };

    const handleAddSize = (label: string, value: string) => {
        onUpdateUser({
            ...user,
            sizes: [...user.sizes, { id: Math.random().toString(36).substr(2, 9), label, value }]
        });
        setIsAddingSize(false);
    };

    const formatBirthday = (dateString: string) => {
        try {
            const date = new Date(dateString + 'T12:00:00');
            return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
        } catch (e) {
            return dateString;
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            {/* Mobile ID Display - Only show on own profile */}
            {isOwnProfile && (
                <div className="md:hidden mb-6 flex justify-between items-center p-4 rounded-xl shadow-hard border-2 border-black transform -rotate-1 bg-pop-yellow">
                    <span className="text-sm font-black uppercase tracking-widest">Share ID</span>
                    <code className="text-sm font-mono font-bold text-black bg-white border-2 border-black px-3 py-1 rounded shadow-sm">
                        {user.id}
                    </code>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">

                {/* Top Row: Merged Profile & Sizes Card (Full Width) */}
                <BentoCard
                    className="col-span-1 lg:col-span-3 min-h-[300px]"
                    customBg={THEME_COLORS.basicInfo}
                >
                    <div className="flex flex-col md:flex-row items-center gap-8 h-full justify-between p-2">

                        {/* Profile Info Side */}
                        <div className="flex-shrink-0 flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
                            <div className="relative group">
                                <div className="w-32 h-32 bg-white border-4 border-black rounded-full flex items-center justify-center text-black mb-0 shadow-hard z-10 relative transition-transform group-hover:scale-105 overflow-hidden">
                                    {user.id === 'ABC-123-XYZ' ? ( // Check if it's the main mock user for generic icon
                                        <User size={64} strokeWidth={1.5} />
                                    ) : (
                                        // Try to match avatar from mock friends if possible, or generic
                                        // In a real app user object would have avatar url
                                        <User size={64} strokeWidth={1.5} />
                                    )}
                                </div>
                                <div className="absolute top-0 right-0 p-2 border-2 border-black rounded-full z-20 shadow-sm animate-bounce bg-pop-pink text-black">
                                    <PartyPopper size={20} />
                                </div>
                            </div>

                            <div className="flex flex-col items-center md:items-start justify-center">
                                <h1 className="text-4xl md:text-5xl font-black text-black tracking-tight transform -rotate-1 mb-3">{user.name}</h1>

                                <div className="bg-white border-2 border-black px-5 py-2 rounded-full shadow-hard-sm flex items-center gap-2 transform rotate-1 transition-transform">
                                    {isEditing ? (
                                        <>
                                            <Calendar size={18} className="text-brand-500" />
                                            <label className="text-xs font-bold uppercase mr-1">Birthday:</label>
                                            <input
                                                type="date"
                                                value={user.birthday}
                                                onChange={(e) => onUpdateUser({ ...user, birthday: e.target.value })}
                                                className="font-bold text-base outline-none bg-slate-100 rounded px-2 py-0.5 border-b-2 border-slate-300 focus:border-brand-500"
                                            />
                                        </>
                                    ) : (
                                        <>
                                            <Calendar size={18} className="text-brand-500" />
                                            <span className="font-bold text-base">Birthday: {formatBirthday(user.birthday)}</span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="hidden md:block w-0.5 h-32 bg-black/10 rounded-full mx-4"></div>

                        {/* Sizes Grid Side */}
                        <div className="w-full md:flex-1 md:max-w-2xl">
                            <div className="flex items-center gap-2 mb-4 text-black/50 font-black uppercase tracking-widest text-xs ml-1 justify-center md:justify-start">
                                <ClipboardList size={14} /> The Important Stuff
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">

                                {user.sizes.map((size, index) => {
                                    const rotation = index % 2 === 0 ? 'rotate-1' : '-rotate-1';
                                    return (
                                        <div
                                            key={size.id}
                                            className={`
                                        relative bg-white border-2 border-black p-4 rounded-xl shadow-hard-sm 
                                        transform ${!isEditing && 'hover:-translate-y-1 hover:rotate-0'} ${rotation} transition-all group 
                                        text-center flex flex-col items-center justify-center
                                        ${isEditing ? 'border-dashed border-black/60 bg-slate-50' : ''}
                                    `}
                                        >
                                            {isEditing && (
                                                <button
                                                    onClick={() => handleRemoveSize(size.id)}
                                                    className="absolute -top-2 -right-2 bg-red-100 text-red-600 rounded-full p-1 border border-black hover:bg-red-500 hover:text-white transition-colors z-10"
                                                >
                                                    <X size={12} strokeWidth={3} />
                                                </button>
                                            )}

                                            <span className="absolute -top-3 bg-black text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm truncate max-w-[90%]">
                                                {size.label}
                                            </span>

                                            {isEditing ? (
                                                <input
                                                    value={size.value}
                                                    onChange={(e) => handleUpdateSize(size.id, e.target.value)}
                                                    className="w-full text-center font-black text-lg bg-white border-b-2 border-slate-200 focus:border-brand-500 outline-none px-1 mt-1 rounded"
                                                />
                                            ) : (
                                                <span className="font-black text-lg text-black mt-2 group-hover:scale-110 transition-transform block leading-tight">
                                                    {size.value}
                                                </span>
                                            )}
                                        </div>
                                    );
                                })}

                                {isEditing && (
                                    <>
                                        {isAddingSize ? (
                                            <AddSizeCard onAdd={handleAddSize} onCancel={() => setIsAddingSize(false)} />
                                        ) : (
                                            <button
                                                onClick={() => setIsAddingSize(true)}
                                                className="border-2 border-dashed border-black/30 p-4 rounded-xl flex flex-col items-center justify-center gap-2 text-black/40 hover:text-black hover:border-black hover:bg-white/50 transition-all min-h-[90px]"
                                            >
                                                <Plus size={24} />
                                                <span className="text-xs font-black uppercase">Add Detail</span>
                                            </button>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </BentoCard>

                {/* Preferences - Left Column */}
                <BentoCard
                    title="Vibes & Nopes"
                    icon={<Heart size={20} />}
                    className="col-span-1 min-h-[500px]"
                    customBg={THEME_COLORS.interests}
                >
                    <div className="space-y-6">
                        <div className="bg-white/50 p-4 rounded-xl border-2 border-black/10 transition-all">
                            <h3 className="text-sm font-black text-black/70 uppercase tracking-wider mb-3 flex items-center gap-2">
                                <span className="text-xl">😍</span> Loves
                            </h3>
                            <div className="flex flex-wrap gap-3">
                                {user.interests.map((interest, i) => (
                                    <StickerBadge
                                        key={`${interest}-${i}`}
                                        isEditing={isEditing}
                                        onRemove={() => handleRemoveInterest(i)}
                                        color={['bg-blue-300', 'bg-green-300', 'bg-yellow-300', 'bg-purple-300'][i % 4]}
                                    >
                                        {interest}
                                    </StickerBadge>
                                ))}
                            </div>
                            {isEditing && (
                                <SimpleTagInput
                                    onAdd={handleAddInterest}
                                    placeholder="Add loves (comma separated)..."
                                    colorClass="bg-white"
                                />
                            )}
                        </div>

                        <div className="bg-white p-4 rounded-xl border-2 border-black">
                            <h3 className="text-sm font-black text-red-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                                <AlertOctagon size={16} className="text-red-600 fill-red-100" />
                                Please Avoid
                            </h3>
                            <div className="flex flex-wrap gap-3">
                                {user.dislikes.map((dislike, i) => (
                                    <StickerBadge
                                        key={`${dislike}-${i}`}
                                        isEditing={isEditing}
                                        onRemove={() => handleRemoveDislike(i)}
                                        color="bg-red-200 text-red-900"
                                    >
                                        {dislike}
                                    </StickerBadge>
                                ))}
                            </div>
                            {isEditing && (
                                <SimpleTagInput
                                    onAdd={handleAddDislike}
                                    placeholder="Add dislikes (comma separated)..."
                                    colorClass="bg-red-50"
                                />
                            )}
                        </div>
                    </div>
                </BentoCard>

                {/* Wishlist - Right Column */}
                <BentoCard
                    title={isEditing ? "Editing Wishlist..." : "The Wishlist"}
                    icon={<Sparkles size={20} className="text-brand-500 fill-brand-200" />}
                    className="col-span-1 lg:col-span-2 min-h-[600px]"
                    customBg={THEME_COLORS.wishlist}
                >
                    <div className="flex flex-col h-full">
                        <div className="flex-none">
                            <div className="absolute left-0 top-16 w-full flex justify-evenly pointer-events-none opacity-20">
                                {[...Array(12)].map((_, i) => (
                                    <div key={i} className="w-4 h-4 rounded-full bg-black"></div>
                                ))}
                            </div>

                            {!isEditing && (
                                <div className="text-sm font-bold text-slate-500 mb-6 bg-white/80 p-2 rounded-lg border-2 border-black/10 text-center backdrop-blur-sm relative z-10 w-fit mx-auto px-8">
                                    ✨ {user.wishlist.filter(i => i.status === 'AVAILABLE').length} items available to claim!
                                </div>
                            )}
                        </div>

                        <div className="flex-1 overflow-y-auto pr-2 -mr-2 pop-scrollbar pb-4 px-2 sm:px-4">
                            <div className="max-w-4xl mx-auto">

                                {isEditing && (
                                    <div
                                        onClick={onOpenAddModal}
                                        className="mb-6 p-6 border-4 border-dashed border-black/20 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 hover:border-black/40 transition-all group"
                                    >
                                        <div className="w-16 h-16 bg-pop-green rounded-full flex items-center justify-center border-2 border-black shadow-hard-sm mb-2 group-hover:scale-110 transition-transform">
                                            <Plus size={32} strokeWidth={3} />
                                        </div>
                                        <span className="font-black text-xl uppercase text-black/60">Add New Gift</span>
                                    </div>
                                )}

                                {user.wishlist.map((item) => (
                                    <WishlistItemCard
                                        key={item.id}
                                        item={item}
                                        isEditing={isEditing}
                                        isOwnProfile={isOwnProfile}
                                        onClaim={onClaimGift}
                                        onUnclaim={onUnclaimGift}
                                        onSelect={onSelectWishlistItem}
                                        onDelete={handleRemoveWishlistItem}
                                    />
                                ))}

                                <div className="text-center py-8 opacity-40">
                                    <p className="font-display font-black text-3xl uppercase text-slate-400">End of list</p>
                                    <div className="w-12 h-2 bg-slate-300 mx-auto mt-2 rounded-full"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </BentoCard>
            </div>
        </div>
    );
};
