import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/layout/CartDrawer';

export const metadata: Metadata = {
  title: 'E-TECH | Hệ Thống Bán Lẻ Đồ Điện Tử & Công Nghệ Hàng Đầu',
  description: 'Chuyên cung cấp MacBook, Laptop Gaming RTX 4090, iPhone 16 Pro Max, Màn hình OLED, Bàn phím cơ chính hãng 100% bảo hành 24 tháng.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className="dark">
      <body className="min-h-screen flex flex-col bg-[#090D16] text-slate-100 antialiased selection:bg-cyan-500 selection:text-black">
        <Navbar />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4">
          {children}
        </main>
        <CartDrawer />
        <Footer />
      </body>
    </html>
  );
}
