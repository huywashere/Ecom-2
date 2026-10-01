'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Cpu, Lock, Mail, User, Phone, MapPin, ArrowRight } from 'lucide-react';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/store/auth-store';

export default function RegisterPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await authService.register({
        fullName,
        email,
        password,
        phoneNumber,
        address,
      });

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
      setError(err.message || 'Đăng ký không thành công, vui lòng thử lại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-12 max-w-md mx-auto space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-cyan-400 flex items-center justify-center text-black mx-auto shadow-lg shadow-cyan-400/20">
          <Cpu className="w-7 h-7 font-bold" />
        </div>
        <h1 className="text-2xl font-black text-white">Đăng Ký Tài Khoản</h1>
        <p className="text-xs text-slate-400">
          Nhận ngay ưu đãi voucher 500.000₫ cho khách hàng mới
        </p>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
          {error}
        </div>
      )}

      <form onSubmit={handleRegister} className="rounded-3xl glass-panel p-6 border border-white/10 space-y-3.5">
        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1">
            Họ và tên *
          </label>
          <div className="relative">
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Nguyễn Văn A"
              className="w-full bg-slate-900 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:border-cyan-400 outline-none"
            />
            <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1">
            Email đăng nhập *
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
          <label className="text-xs font-semibold text-slate-300 block mb-1">
            Mật khẩu (ít nhất 6 ký tự) *
          </label>
          <div className="relative">
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-900 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:border-cyan-400 outline-none"
            />
            <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1">
            Số điện thoại
          </label>
          <div className="relative">
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="0912 345 678"
              className="w-full bg-slate-900 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:border-cyan-400 outline-none"
            />
            <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1">
            Địa chỉ
          </label>
          <div className="relative">
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Hà Nội / TP. Hồ Chí Minh"
              className="w-full bg-slate-900 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:border-cyan-400 outline-none"
            />
            <MapPin className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-2 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl shadow-cyan-500/25 transition disabled:opacity-50"
        >
          {loading ? 'Đang khởi tạo tài khoản...' : 'Hoàn Tất Đăng Ký'} <ArrowRight className="w-4 h-4" />
        </button>

        <p className="text-center text-xs text-slate-400 pt-2">
          Đã có tài khoản?{' '}
          <Link href="/login" className="text-cyan-400 font-bold hover:underline">
            Đăng nhập ngay
          </Link>
        </p>
      </form>
    </div>
  );
}
