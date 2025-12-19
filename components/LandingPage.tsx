import React, { useState } from 'react';
import { Gift, Heart, Users, Sparkles, ArrowRight } from 'lucide-react';
import { InteractiveBackground } from './InteractiveBackground';
import { supabase } from '../supabaseClient';
import { StickerBadge } from './StickerBadge';

export const LandingPage: React.FC = () => {
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        setLoading(true);
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: window.location.origin
            }
        });
        if (error) {
            alert(error.message);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col font-sans selection:bg-brand-400 selection:text-white">
            <InteractiveBackground />

            {/* Navigation */}
            <nav className="w-full max-w-7xl mx-auto px-6 py-6 flex justify-between items-center relative z-10">
                <div className="flex items-center gap-2">
                    <div className="bg-black text-white p-2 rounded-lg transform -rotate-3 shadow-hard-sm">
                        <Gift size={24} strokeWidth={3} />
                    </div>
                    <span className="text-2xl font-black tracking-tighter uppercase">Gimmi</span>
                </div>
                <button
                    onClick={handleLogin}
                    className="font-bold text-sm bg-white border-2 border-black px-4 py-2 rounded-xl shadow-hard-sm hover:translate-y-px hover:shadow-none transition-all"
                >
                    Sign In
                </button>
            </nav>

            {/* Hero Section */}
            <main className="flex-grow flex flex-col items-center justify-center text-center px-4 relative z-10 py-12">

                <StickerBadge color="bg-pop-yellow rotate-2 mb-8 animate-[bounce_3s_infinite]">
                    <Sparkles size={14} className="inline mr-1" /> The #1 Wishlist App
                </StickerBadge>

                <h1 className="text-5xl sm:text-7xl font-black mb-6 tracking-tighter leading-[0.9]">
                    Stop guessing.<br />
                    <span className="text-brand-500">Get it right.</span>
                </h1>

                <p className="text-xl font-bold text-slate-500 max-w-lg mb-12 leading-relaxed">
                    Create wishlists, share with friends, and never get a bad gift again. Because gifting should be a <span className="text-black font-black underline decoration-wavy decoration-brand-500">Gimmi</span>.
                </p>

                {/* CTA Button */}
                <button
                    onClick={handleLogin}
                    disabled={loading}
                    className="group relative bg-black text-white text-lg font-bold py-4 px-8 rounded-2xl shadow-hard hover:shadow-hard-lg hover:-translate-y-1 transition-all disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:shadow-hard"
                >
                    <div className="flex items-center gap-3">
                        {/* Google G Logo - Fixed Size */}
                        <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center shrink-0">
                            <svg width="18" height="18" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                        </div>
                        <span>{loading ? 'Connecting...' : 'Join with Google'}</span>
                        <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </div>
                </button>

                {/* Features Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-20 max-w-5xl w-full">
                    <FeatureCard
                        icon={<Gift size={32} />}
                        title="Create Lists"
                        desc="Add items from any store. Add details, sizes, and links."
                        color="bg-pop-pink"
                    />
                    <FeatureCard
                        icon={<Users size={32} />}
                        title="Add Peeps"
                        desc="Connect with friends and family to see what they actually want."
                        color="bg-pop-blue"
                    />
                    <FeatureCard
                        icon={<Heart size={32} />}
                        title="Claim Gifts"
                        desc="Mark items as 'Claimed' so no one buys duplicates."
                        color="bg-pop-green"
                    />
                </div>

            </main>

            {/* Footer */}
            <footer className="py-8 text-center text-sm font-bold text-slate-400 relative z-10">
                &copy; {new Date().getFullYear()} Gimmi. All rights reserved.
            </footer>
        </div>
    );
};

const FeatureCard: React.FC<{ icon: React.ReactNode, title: string, desc: string, color: string }> = ({ icon, title, desc, color }) => (
    <div className="bg-white border-2 border-black p-6 rounded-2xl shadow-hard-sm hover:shadow-hard hover:-translate-y-1 transition-all text-left">
        <div className={`w-12 h-12 ${color} border-2 border-black rounded-full flex items-center justify-center mb-4`}>
            {icon}
        </div>
        <h3 className="text-xl font-black mb-2">{title}</h3>
        <p className="text-sm font-bold text-slate-500">{desc}</p>
    </div>
);
