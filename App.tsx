
import React, { useState, useEffect } from 'react';
import {
  Gift,
  Pencil,
  ArrowLeft,
  LogOut,
  Loader2,
  Lock
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { supabase } from './supabaseClient';
import { useRef } from 'react';
import { InteractiveBackground } from './components/InteractiveBackground';
import { ItemModal } from './components/ItemModal';
import { AddItemModal } from './components/AddItemModal';

import { MyPeepsView } from './components/MyPeepsView';
import { ProfileView } from './components/ProfileView';
import { LandingPage } from './components/LandingPage';
import { AuthModal } from './components/AuthModal';
import { WishlistItem, UserProfile } from './types';

// --- View State ---

type AppView = 'PROFILE' | 'PEEPS' | 'FRIEND_PROFILE';



// --- Header Component ---

const Header: React.FC<{
  isEditing: boolean;
  toggleEdit: () => void;
  currentView: AppView;
  setView: (v: AppView) => void;
  goBack: () => void;
  isViewingFriend: boolean;
  avatarUrl?: string;
  isGuest: boolean;
  onSignUpClick: () => void;
}> = ({ isEditing, toggleEdit, currentView, setView, goBack, isViewingFriend, avatarUrl, isGuest, onSignUpClick }) => {
  const handleLogout = async () => {
    if (isGuest) {
      window.location.reload(); // Simple reset for guest
    } else {
      await supabase.auth.signOut();
    }
  };

  return (
    <header className="sticky top-4 z-50 px-4 sm:px-6 lg:px-8 mb-8 pointer-events-none">
      <div className="max-w-7xl mx-auto">
        <div className="border-2 border-black shadow-hard rounded-2xl px-4 py-3 flex justify-between items-center pointer-events-auto bg-white transition-colors duration-500">
          {/* Logo & Title */}
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => setView('PROFILE')}
          >
            <div className="p-2 rounded-lg border-2 border-black text-white shadow-hard-sm transform -rotate-3 bg-brand-500">
              <Gift size={24} strokeWidth={3} />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black text-black leading-none tracking-tighter uppercase hidden sm:block">
                Gimmi
              </span>
              <span className="text-xl font-black text-black leading-none tracking-tighter uppercase sm:hidden">Gimmi</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex items-center gap-2 sm:gap-3">

            {/* Guest Banner / CTA */}
            {isGuest && (
              <button
                onClick={onSignUpClick}
                className="hidden md:flex bg-black text-white px-3 py-1.5 rounded-lg text-sm font-bold hover:scale-105 transition-transform"
              >
                Sign Up to Save
              </button>
            )}

            {currentView === 'FRIEND_PROFILE' && (
              <button
                onClick={goBack}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-black text-slate-500 hover:text-black hover:bg-slate-100 transition-all border border-transparent hover:border-black"
              >
                <ArrowLeft size={16} /> Back
              </button>
            )}

            {/* View Switcher */}
            <div className="flex bg-slate-100 p-1 rounded-xl border-2 border-black">
              <button
                onClick={() => setView('PROFILE')}
                className={`px-3 py-1.5 rounded-lg text-sm font-black transition-all ${currentView === 'PROFILE' ? 'bg-white shadow-sm border border-black' : 'text-slate-500 hover:text-black'}`}
              >
                Profile
              </button>
              <button
                onClick={() => {
                  if (isGuest) {
                    alert("Sign up to connect with friends!");
                    onSignUpClick();
                  } else {
                    setView('PEEPS');
                  }
                }}
                className={`px-3 py-1.5 rounded-lg text-sm font-black transition-all flex items-center gap-1 ${currentView === 'PEEPS' || currentView === 'FRIEND_PROFILE' ? 'bg-white shadow-sm border border-black' : 'text-slate-500 hover:text-black'}`}
              >
                My Peeps
                {isGuest && <Lock size={12} className="text-slate-400" />}
              </button>
            </div>

            {/* Edit Button - Only show on Own Profile */}
            {currentView === 'PROFILE' && (
              <button
                onClick={toggleEdit}
                className={`
                  flex items-center gap-2 px-3 sm:px-4 py-2 text-sm font-bold border-2 border-black rounded-xl shadow-hard-sm transition-all
                  ${isEditing
                    ? 'bg-pop-yellow hover:bg-yellow-300 translate-x-[2px] translate-y-[2px] shadow-none'
                    : 'bg-white hover:bg-slate-50 hover:-translate-y-0.5'
                  }
                `}
              >
                <Pencil size={16} />
                <span className="hidden sm:inline">{isEditing ? 'Done' : 'Edit'}</span>
              </button>
            )}

            <button
              onClick={handleLogout}
              className="p-2 text-slate-400 hover:text-red-500 transition-colors"
              title={isGuest ? "Exit Guest Mode" : "Sign Out"}
            >
              <LogOut size={20} />
            </button>

          </nav>
        </div>
      </div>
    </header>
  );
};


// --- Main App Component ---

const App: React.FC = () => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'LOGIN' | 'SIGNUP'>('SIGNUP');

  const [currentView, setCurrentView] = useState<AppView>('PROFILE');

  // Data State
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [friendProfile, setFriendProfile] = useState<UserProfile | null>(null); // Single friend profile being viewed

  const [viewingFriendId, setViewingFriendId] = useState<string | null>(null);

  const [selectedItem, setSelectedItem] = useState<WishlistItem | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Guest Data Persistence
  const guestWishlistRef = useRef<WishlistItem[]>([]);

  // Sync Guest Wishlist to Ref
  useEffect(() => {
    if (isGuest && userProfile) {
      guestWishlistRef.current = userProfile.wishlist;
    }
  }, [userProfile, isGuest]);

  // --- Auth & Data Fetching ---

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) setIsGuest(false);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        setIsGuest(false);
        // If we were a guest, we might want to sync data here but keeping it simple for now
        // Could just fetch fresh data
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch Profile Data
  useEffect(() => {
    if (session?.user) {
      // Check for Guest Migration
      if (guestWishlistRef.current.length > 0) {
        migrateGuestItems(session.user.id, guestWishlistRef.current);
        guestWishlistRef.current = []; // Clear after triggering
      }
      fetchUserProfile(session.user.id);
      fetchWishlist(session.user.id);
    } else if (isGuest) {
      // Initialize Guest Profile if empty
      if (!userProfile) {
        setUserProfile({
          id: 'guest',
          name: 'Guest',
          username: 'guest',
          birthday: '',
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=guest`,
          sizes: [],
          interests: [],
          dislikes: [],
          wishlist: []
        });
      }
    }
  }, [session, isGuest]);

  const fetchUserProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (data) {
      setUserProfile(prev => ({
        ...prev,
        id: data.id,
        name: data.full_name || 'New User',
        username: data.username,
        birthday: data.birthday,
        avatar: data.avatar_url,
        sizes: data.sizes || [],
        interests: data.interests || [],
        dislikes: data.dislikes || [],
        wishlist: prev?.wishlist || [] // Keep wishlist if already fetched
      }));
      console.error("Error fetching profile", error);
    }
  };

  const fetchFriendProfile = async (friendId: string) => {
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', friendId)
      .single();

    if (data) {
      const profile: UserProfile = {
        id: data.id,
        name: data.full_name || 'Friend',
        username: data.username,
        birthday: data.birthday,
        avatar: data.avatar_url,
        sizes: data.sizes || [],
        interests: data.interests || [],
        dislikes: data.dislikes || [],
        wishlist: []
      };

      // Fetch wishlist separately to ensure we get latest items
      const { data: wishlistData } = await supabase
        .from('wishlist_items')
        .select('*')
        .eq('user_id', friendId)
        .order('created_at', { ascending: false });

      if (wishlistData) {
        profile.wishlist = wishlistData.map(item => ({
          id: item.id,
          name: item.name,
          priceRange: item.price_range,
          priority: item.priority as any,
          status: item.status as any,
          notes: item.notes,
          link: item.link,
          imageUrl: item.image_url,
          claimedByMe: item.claimed_by === session?.user?.id
        }));
      }

      setFriendProfile(profile);
    } else {
      console.error("Error fetching friend profile", error);
    }
    setLoading(false);
  };

  const fetchWishlist = async (userId: string) => {
    const { data, error } = await supabase
      .from('wishlist_items')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (data) {
      const mappedItems: WishlistItem[] = data.map(item => ({
        id: item.id,
        name: item.name,
        priceRange: item.price_range,
        priority: item.priority as any,
        status: item.status as any,
        notes: item.notes,
        link: item.link,
        imageUrl: item.image_url,
        claimedByMe: item.claimed_by === session?.user?.id
      }));

      setUserProfile(prev => prev ? ({ ...prev, wishlist: mappedItems }) : null);
    }
  };


  // --- Handlers ---

  const handleClaimGift = (e: React.MouseEvent, itemId: string) => {
    // Note: In real app, we would update DB here. 
    // Implementing Optimistic UI updates for now.

    const isModalOpen = !!selectedItem;

    // Confetti Logic
    let x = 0;
    let y = 0;
    if (isModalOpen) {
      x = 0.5;
      y = 0.5;
    } else {
      const rect = (e.target as HTMLElement).getBoundingClientRect();
      x = (rect.left + rect.width / 2) / window.innerWidth;
      y = (rect.top + rect.height / 2) / window.innerHeight;
    }

    const colors = ['#f43f5e', '#facc15', '#60a5fa', '#a78bfa'];
    confetti({ origin: { x, y }, colors, particleCount: 150, spread: isModalOpen ? 120 : 70, startVelocity: isModalOpen ? 55 : 30, scalar: 1.2, shapes: ['circle', 'square'], zIndex: 200 });
    setTimeout(() => {
      confetti({ origin: { x, y }, colors, particleCount: 80, angle: 60, spread: 80, startVelocity: 45, zIndex: 200 });
      confetti({ origin: { x, y }, colors, particleCount: 80, angle: 120, spread: 80, startVelocity: 45, zIndex: 200 });
    }, 150);


    // State Update Logic
    if (currentView === 'PROFILE') {
      // Can't claim own gift usually, but for demo:
    } else if (currentView === 'FRIEND_PROFILE' && friendProfile) {
      // Optimistic update for friend's list
      setFriendProfile(prev => prev ? ({
        ...prev,
        wishlist: prev.wishlist.map(item =>
          item.id === itemId ? { ...item, status: 'CLAIMED', claimedByMe: true } : item
        )
      }) : null);

      // DB Call
      supabase
        .from('wishlist_items')
        .update({ status: 'CLAIMED', claimed_by: session.user.id })
        .eq('id', itemId)
        .then(({ error }) => {
          if (error) console.error("Error claiming gift", error);
        });

      if (selectedItem && selectedItem.id === itemId) {
        setSelectedItem(prev => prev ? ({ ...prev, status: 'CLAIMED', claimedByMe: true }) : null);
      }
    }
  };

  const handleUnclaimGift = (e: React.MouseEvent, itemId: string) => {
    // Implement DB call here later
  };

  const handleAddWishlistItem = async (itemData: any) => {
    // Guest Mode Logic
    if (isGuest) {
      const newItem: WishlistItem = {
        id: Math.random().toString(36).substr(2, 9),
        status: 'AVAILABLE',
        name: itemData.name,
        priceRange: itemData.priceRange,
        priority: itemData.priority,
        link: itemData.link,
        notes: itemData.notes,
        imageUrl: itemData.imageUrl
      };
      setUserProfile(prev => prev ? ({ ...prev, wishlist: [newItem, ...prev.wishlist] }) : null);
      return;
    }

    if (!session?.user) return;

    // Database Insert
    const { data, error } = await supabase
      .from('wishlist_items')
      .insert({
        user_id: session.user.id,
        name: itemData.name,
        price_range: itemData.priceRange,
        priority: itemData.priority,
        link: itemData.link,
        notes: itemData.notes,
        image_url: itemData.imageUrl
      })
      .select()
      .single();

    if (data) {
      const newItem: WishlistItem = {
        id: data.id,
        status: 'AVAILABLE',
        name: data.name,
        priceRange: data.price_range,
        priority: data.priority,
        link: data.link,
        notes: data.notes,
        imageUrl: data.image_url
      };
      // Optimistic Update
      setUserProfile(prev => prev ? ({ ...prev, wishlist: [newItem, ...prev.wishlist] }) : null);
    } else {
      console.error("Error adding item", error);
    }
  };

  const handleUpdateUser = async (updated: UserProfile) => {
    // Optimistic Update
    setUserProfile(updated);

    if (!session?.user) return;

    // DB Update for Profile Fields
    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: updated.name,
        username: updated.username,
        birthday: updated.birthday,
        sizes: updated.sizes,
        interests: updated.interests,
        dislikes: updated.dislikes
      })
      .eq('id', session.user.id);

    if (error) console.error("Error updating profile", error);
  };

  const handleDeleteWishlistItem = async (itemId: string) => {

    if (isGuest) {
      setUserProfile(prev => prev ? ({
        ...prev,
        wishlist: prev.wishlist.filter(i => i.id !== itemId)
      }) : null);
      if (selectedItem?.id === itemId) setSelectedItem(null);
      return;
    }

    if (!session?.user) return;

    // DB Delete
    const { error } = await supabase
      .from('wishlist_items')
      .delete()
      .eq('id', itemId)
      .eq('user_id', session.user.id);

    if (!error) {
      setUserProfile(prev => prev ? ({
        ...prev,
        wishlist: prev.wishlist.filter(i => i.id !== itemId)
      }) : null);
      if (selectedItem?.id === itemId) setSelectedItem(null);
    } else {
      console.error("Error deleting item", error);
    }
  };

  const handleViewProfile = (friendId: string) => {
    setViewingFriendId(friendId);
    setFriendProfile(null); // Clear previous friend data
    setCurrentView('FRIEND_PROFILE');
    setIsEditing(false);
    fetchFriendProfile(friendId);
    window.scrollTo(0, 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-brand-500" size={48} />
      </div>
    );
  }

  if (!session && !isGuest) {
    return (
      <>
        <LandingPage
          onGuestAccess={() => setIsGuest(true)}
          onLogin={() => {
            setAuthModalTab('LOGIN');
            setIsAuthModalOpen(true);
          }}
        />
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          defaultTab={authModalTab}
          onSuccess={() => setIsAuthModalOpen(false)}
        />
      </>
    );
  }

  // Determine which user data to show
  const activeUser = (currentView === 'FRIEND_PROFILE' && viewingFriendId)
    ? friendProfile
    : userProfile;

  const isOwnProfile = currentView === 'PROFILE';

  // If userProfile isn't loaded yet
  if (isOwnProfile && !userProfile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
        <Loader2 className="animate-spin text-brand-500" size={48} />
        <p className="text-slate-500">Creating your profile...</p>
        {/* Fallback if it takes too long or if profile trigger didn't run - reload might help */}
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-12 font-sans selection:bg-brand-400 selection:text-white">
      <InteractiveBackground />

      <ItemModal
        item={selectedItem}
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        onClaim={handleClaimGift}
      />

      <AddItemModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddWishlistItem}
      />

      <Header
        isEditing={isEditing}
        toggleEdit={() => setIsEditing(!isEditing)}
        currentView={currentView}
        setView={(view) => {
          setCurrentView(view);
          if (view !== 'PROFILE') setIsEditing(false);
          if (view !== 'FRIEND_PROFILE') setViewingFriendId(null);
        }}
        goBack={() => {
          setCurrentView('PEEPS');
          setViewingFriendId(null);
        }}
        isViewingFriend={currentView === 'FRIEND_PROFILE'}
        avatarUrl={userProfile?.avatar}
        isGuest={isGuest}
        onSignUpClick={() => {
          setAuthModalTab('SIGNUP');
          setIsAuthModalOpen(true);
        }}
      />

      {currentView === 'PEEPS' ? (
        <MyPeepsView
          onViewProfile={handleViewProfile}
          currentUserId={session?.user?.id}
        />
      ) : activeUser ? (
        <ProfileView
          user={activeUser}
          isEditing={isEditing && isOwnProfile}
          isOwnProfile={isOwnProfile}
          onUpdateUser={(updated) => isOwnProfile && handleUpdateUser(updated)}
          onClaimGift={handleClaimGift}
          onUnclaimGift={handleUnclaimGift}
          onSelectWishlistItem={setSelectedItem}
          onDeleteWishlistItem={handleDeleteWishlistItem}
          onOpenAddModal={() => setIsAddModalOpen(true)}
        />
      ) : (
        <div>User not found</div>
      )}
    </div>
  );
};

export default App;
