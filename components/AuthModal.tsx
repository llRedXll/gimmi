import React, { useState } from 'react';
import { Mail, Lock, Loader2, X, AlertCircle, Check } from 'lucide-react';
import { supabase } from '../supabaseClient';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    defaultTab?: 'LOGIN' | 'SIGNUP';
    onSuccess?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, defaultTab = 'SIGNUP', onSuccess }) => {
    const [mode, setMode] = useState<'LOGIN' | 'SIGNUP'>(defaultTab);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccessMsg(null);

        try {
            if (mode === 'SIGNUP') {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                });
                if (error) throw error;
                // Auto login happens if email confirm is off, otherwise notify user
                setSuccessMsg('Account created! You can now log in.');
                // If session is established immediately:
                const { data: { session } } = await supabase.auth.getSession();
                if (session && onSuccess) onSuccess();
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                if (onSuccess) onSuccess();
                onClose();
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <div className="bg-white border-2 border-black shadow-hard rounded-2xl p-6 w-full max-w-md relative z-10 animate-in fade-in zoom-in duration-200">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-1 hover:bg-slate-100 rounded-lg transition-colors"
                >
                    <X size={20} />
                </button>

                <div className="text-center mb-6">
                    <h2 className="text-2xl font-black mb-1">
                        {mode === 'SIGNUP' ? 'Save Your Wishlist' : 'Welcome Back'}
                    </h2>
                    <p className="text-slate-500 font-bold text-sm">
                        {mode === 'SIGNUP' ? 'Create an account to save your data forever.' : 'Sign in to access your wishlist.'}
                    </p>
                </div>

                {/* Tabs */}
                <div className="flex p-1 bg-slate-100 rounded-xl border-2 border-black mb-6">
                    <button
                        onClick={() => { setMode('SIGNUP'); setError(null); }}
                        className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${mode === 'SIGNUP' ? 'bg-white shadow-sm border border-black' : 'text-slate-500 hover:text-black'}`}
                    >
                        Sign Up
                    </button>
                    <button
                        onClick={() => { setMode('LOGIN'); setError(null); }}
                        className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${mode === 'LOGIN' ? 'bg-white shadow-sm border border-black' : 'text-slate-500 hover:text-black'}`}
                    >
                        Sign In
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-black uppercase tracking-wide mb-2">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-3.5 text-slate-400" size={18} />
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-black font-bold focus:outline-none focus:shadow-hard-sm transition-shadow bg-slate-50"
                                placeholder="you@example.com"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-black uppercase tracking-wide mb-2">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-3.5 text-slate-400" size={18} />
                            <input
                                type="password"
                                required
                                minLength={6}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-black font-bold focus:outline-none focus:shadow-hard-sm transition-shadow bg-slate-50"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg border-2 border-red-100 font-bold text-sm">
                            <AlertCircle size={16} /> {error}
                        </div>
                    )}

                    {successMsg && (
                        <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-lg border-2 border-green-100 font-bold text-sm">
                            <Check size={16} /> {successMsg}
                        </div>
                    )}

                    <button
                        disabled={loading}
                        type="submit"
                        className="w-full py-4 bg-black text-white font-bold text-lg rounded-xl shadow-hard hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none disabled:opacity-70 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 mt-2"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : (mode === 'SIGNUP' ? 'Create Account' : 'Sign In')}
                    </button>
                </form>
            </div>
        </div>
    );
};
