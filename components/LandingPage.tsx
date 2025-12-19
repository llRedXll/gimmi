import React, { useState } from 'react';
import { Gift, Heart, Users, Sparkles, ArrowRight } from 'lucide-react';
import { InteractiveBackground } from './InteractiveBackground';
import { supabase } from '../supabaseClient';
import { StickerBadge } from './StickerBadge';

export const LandingPage: React.FC<{ onGuestAccess: () => void; onLogin: () => void }> = ({ onGuestAccess, onLogin }) => {
    const [loading, setLoading] = useState(false);

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
                    onClick={onLogin}
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

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <button
                        onClick={onGuestAccess}
                        className="group relative bg-black text-white text-lg font-bold py-4 px-8 rounded-2xl shadow-hard hover:shadow-hard-lg hover:-translate-y-1 transition-all"
                    >
                        <div className="flex items-center gap-3">
                            <Gift size={24} />
                            <span>Start My Wishlist</span>
                            <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                        </div>
                    </button>
                    <button
                        onClick={onLogin}
                        className="font-bold text-slate-500 hover:text-black underline decoration-2 decoration-brand-500 underline-offset-4"
                    >
                        Already have an account?
                    </button>
                </div>

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
