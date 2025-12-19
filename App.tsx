
import React, { useState, useEffect } from 'react';
import {
  Gift,
  Pencil,
  ArrowLeft,
  LogOut,
  Loader2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { supabase } from './supabaseClient';
import { InteractiveBackground } from './components/InteractiveBackground';
import { ItemModal } from './components/ItemModal';
import { AddItemModal } from './components/AddItemModal';
import { MyPeepsView } from './components/MyPeepsView';
import { ProfileView } from './components/ProfileView';
import { MOCK_FRIEND_PROFILES } from './constants'; // Keeping for friends fallback for now
import { WishlistItem, UserProfile } from './types';

// --- View State ---

type AppView = 'PROFILE' | 'PEEPS' | 'FRIEND_PROFILE';

// --- Auth Component ---
const AuthScreen = () => {
  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    });
    if (error) alert(error.message);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <InteractiveBackground />
      <div className="bg-white/90 backdrop-blur-xl border-2 border-black shadow-hard rounded-3xl p-8 max-w-md w-full text-center z-10 animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 bg-brand-500 border-2 border-black rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-hard-sm transform -rotate-3">
          <Gift size={40} className="text-white" strokeWidth={3} />
        </div>
        <h1 className="text-4xl font-black mb-2 tracking-tighter">Gimmi</h1>
        <p className="text-slate-600 mb-8 font-medium">Stop guessing. Make gift giving a Gimmi.</p>

        <button
          onClick={handleLogin}
          className="w-full py-4 bg-black text-white font-bold text-lg rounded-xl shadow-hard hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex items-center justify-center gap-3"
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          Sign In with Google
        </button>
      </div>
    </div>
  );
};

// --- Header Component ---

const Header: React.FC<{
  isEditing: boolean;
  toggleEdit: () => void;
  currentView: AppView;
  setView: (v: AppView) => void;
  goBack: () => void;
  isViewingFriend: boolean;
  avatarUrl?: string;
}> = ({ isEditing, toggleEdit, currentView, setView, goBack, isViewingFriend, avatarUrl }) => {
  const handleLogout = async () => {
    await supabase.auth.signOut();
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
                onClick={() => setView('PEEPS')}
                className={`px-3 py-1.5 rounded-lg text-sm font-black transition-all flex items-center gap-1 ${currentView === 'PEEPS' || currentView === 'FRIEND_PROFILE' ? 'bg-white shadow-sm border border-black' : 'text-slate-500 hover:text-black'}`}
              >
                My Peeps
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
              title="Sign Out"
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

  const [currentView, setCurrentView] = useState<AppView>('PROFILE');

  // Data State
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [friendProfiles, setFriendProfiles] = useState(MOCK_FRIEND_PROFILES); // Fallback/Mock for friends for now

  const [viewingFriendId, setViewingFriendId] = useState<string | null>(null);

  const [selectedItem, setSelectedItem] = useState<WishlistItem | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // --- Auth & Data Fetching ---

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch Profile Data when Session exists
  useEffect(() => {
    if (session?.user) {
      fetchUserProfile(session.user.id);
      fetchWishlist(session.user.id);
    }
  }, [session]);

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
    } else if (error) {
      console.error("Error fetching profile", error);
    }
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
    } else if (currentView === 'FRIEND_PROFILE' && viewingFriendId) {
      setFriendProfiles(prev => ({
        ...prev,
        [viewingFriendId]: {
          ...prev[viewingFriendId],
          wishlist: prev[viewingFriendId].wishlist.map(item =>
            item.id === itemId ? { ...item, status: 'CLAIMED', claimedByMe: true } : item
          )
        }
      }));

      if (selectedItem && selectedItem.id === itemId) {
        setSelectedItem(prev => prev ? ({ ...prev, status: 'CLAIMED', claimedByMe: true }) : null);
      }
    }
  };

  const handleUnclaimGift = (e: React.MouseEvent, itemId: string) => {
    // Implement DB call here later
  };

  const handleAddWishlistItem = async (itemData: any) => {
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
        birthday: updated.birthday,
        sizes: updated.sizes,
        interests: updated.interests,
        dislikes: updated.dislikes
      })
      .eq('id', session.user.id);

    if (error) console.error("Error updating profile", error);
  };

  const handleDeleteWishlistItem = async (itemId: string) => {
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
    if (friendProfiles[friendId]) {
      setViewingFriendId(friendId);
      setCurrentView('FRIEND_PROFILE');
      setIsEditing(false);
      window.scrollTo(0, 0);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-brand-500" size={48} />
      </div>
    );
  }

  if (!session) {
    return <AuthScreen />;
  }

  // Determine which user data to show
  const activeUser = (currentView === 'FRIEND_PROFILE' && viewingFriendId)
    ? friendProfiles[viewingFriendId]
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
