'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Cpu, Lock, Mail, ArrowRight, ShieldCheck, UserCheck } from 'lucide-react';
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
    } catch (err: any) {
      setError(err.message || 'Đăng nhập không thành công, vui lòng kiểm tra lại');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = (testEmail: string, testPass: string) => {
    setEmail(testEmail);
    setPassword(testPass);
  };

  return (
    <div className="py-12 max-w-md mx-auto space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-cyan-400 flex items-center justify-center text-black mx-auto shadow-lg shadow-cyan-400/20">
          <Cpu className="w-7 h-7 font-bold" />
        </div>
        <h1 className="text-2xl font-black text-white">Đăng Nhập E-TECH</h1>
        <p className="text-xs text-slate-400">
          Truy cập hệ sinh thái thương mại điện tử công nghệ cao cấp
        </p>
      </div>

      {/* Quick Test Fill Badges */}
      <div className="rounded-2xl glass-panel p-4 border border-cyan-500/20 bg-cyan-950/10 space-y-2">
        <p className="text-[11px] font-bold text-cyan-400 flex items-center gap-1.5">
          <UserCheck className="w-3.5 h-3.5" /> Bấm để điền nhanh tài khoản test mẫu:
        </p>
        <div className="grid grid-cols-2 gap-2 text-[11px]">
          <button
            type="button"
            onClick={() => handleQuickFill('admin@ecom.com', 'admin123')}
            className="p-2 rounded-xl bg-slate-900 border border-white/10 hover:border-cyan-400 text-left text-slate-300 hover:text-white transition"
          >
            <span className="font-bold text-cyan-400 block">Tài khoản Admin</span>
            admin@ecom.com
          </button>
          <button
            type="button"
            onClick={() => handleQuickFill('customer@ecom.com', 'password123')}
            className="p-2 rounded-xl bg-slate-900 border border-white/10 hover:border-cyan-400 text-left text-slate-300 hover:text-white transition"
          >
            <span className="font-bold text-emerald-400 block">Khách hàng</span>
            customer@ecom.com
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleLogin} className="rounded-3xl glass-panel p-6 border border-white/10 space-y-4">
        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1.5">
            Email tài khoản
          </label>
          <div className="relative">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tenban@example.com"
              className="w-full bg-slate-900 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:border-cyan-400 outline-none"
            />
            <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-slate-300">Mật khẩu</label>
            <a href="#" className="text-[11px] text-cyan-400 hover:underline">Quên mật khẩu?</a>
          </div>
          <div className="relative">
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-900 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:border-cyan-400 outline-none"
            />
            <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl shadow-cyan-500/25 transition disabled:opacity-50"
        >
          {loading ? 'Đang đăng nhập...' : 'Đăng Nhập Ngay'} <ArrowRight className="w-4 h-4" />
        </button>

        <p className="text-center text-xs text-slate-400 pt-2">
          Chưa có tài khoản?{' '}
          <Link href="/register" className="text-cyan-400 font-bold hover:underline">
            Đăng ký tài khoản mới
          </Link>
        </p>
      </form>
    </div>
  );
}
