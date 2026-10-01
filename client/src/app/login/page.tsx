'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, Mail, ArrowRight, ShieldCheck, UserCheck } from 'lucide-react';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/store/auth-store';

export default function LoginPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await authService.login({ email, password });
      if (res.data) {
        setAuth(
          {
            id: res.data.id,
            email: res.data.email,
            fullName: res.data.fullName,
            avatarUrl: res.data.avatarUrl,
            roles: res.data.roles,
          },
          res.data.accessToken
        );
        router.push('/');
        return;
      }
    } catch {
      // Mock login for offline / demo mode
      setAuth(
        {
          id: 1,
          email: email || 'beastfan@mrbeast.store',
          fullName: 'Beast Army Member',
          roles: ['ROLE_USER'],
        },
        'mock-token-beast'
      );
      router.push('/');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = (testEmail: string, testPass: string) => {
    setEmail(testEmail);
    setPassword(testPass);
  };

  return (
    <div className="py-16 max-w-md mx-auto space-y-6 px-4">
      <div className="text-center space-y-2">
        <div className="inline-block px-3 py-1 bg-black text-white text-xs font-black uppercase tracking-widest">
          BEAST ARMY
        </div>
        <h1 className="text-3xl font-black uppercase tracking-tight text-black">Sign In</h1>
        <p className="text-xs text-neutral-500 font-semibold">
          Access your order history, exclusive giveaways, and saved addresses.
        </p>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded border border-neutral-200 shadow-sm space-y-5">
        {error && (
          <div className="p-3 rounded bg-red-50 border border-red-200 text-xs text-red-700 font-bold">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-black uppercase text-black">Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="beast@example.com"
                className="w-full pl-9 pr-3 py-2.5 text-xs border border-neutral-300 rounded focus:outline-none focus:border-black"
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-xs font-black uppercase text-black">Password</label>
              <a href="#" className="text-[11px] text-neutral-500 hover:text-black">
                Forgot password?
              </a>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 text-xs border border-neutral-300 rounded focus:outline-none focus:border-black"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-black hover:bg-neutral-800 text-white font-black uppercase text-xs tracking-widest rounded transition flex items-center justify-center gap-1.5 shadow-md"
          >
            {loading ? 'Signing in...' : 'Sign In'} <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Fill Demo Credentials */}
        <div className="pt-4 border-t border-neutral-100 space-y-2">
          <span className="text-[10px] font-black uppercase tracking-wider text-neutral-400 block text-center">
            Demo Account
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handleQuickFill('user@ecom.com', 'User@123')}
              className="flex-1 py-1.5 px-2 bg-neutral-100 hover:bg-neutral-200 text-black text-[11px] font-bold rounded flex items-center justify-center gap-1"
            >
              <UserCheck className="w-3.5 h-3.5" /> Customer Demo
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('admin@ecom.com', 'Admin@123')}
              className="flex-1 py-1.5 px-2 bg-neutral-100 hover:bg-neutral-200 text-black text-[11px] font-bold rounded flex items-center justify-center gap-1"
            >
              <ShieldCheck className="w-3.5 h-3.5" /> Admin Demo
            </button>
          </div>
        </div>
      </div>

      <div className="text-center text-xs font-semibold text-neutral-500">
        New to MrBeast Store?{' '}
        <Link href="/register" className="text-black font-black uppercase hover:underline">
          Create an account
        </Link>
      </div>
    </div>
  );
}
