import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/layout/CartDrawer';
import PredictiveSearch from '@/components/layout/PredictiveSearch';
import TechConsultantBot from '@/components/chat/TechConsultantBot';

export const metadata: Metadata = {
  title: 'TITAN TECH | Siêu Thị Máy Tính, Laptop & Đồ Điện Tử Cao Cấp Flagship',
  description: 'Đại lý phân phối ủy quyền Apple, NVIDIA, ASUS ROG, Sony, Razer, Logitech G, Keychron. Chuyên máy tính workstation, custom liquid-cooled PC rigs, laptop gaming và phụ kiện cao cấp.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-white text-black antialiased selection:bg-[#00B2FE] selection:text-black">
        <Navbar />
        <main className="flex-1 w-full">
          {children}
        </main>
        <CartDrawer />
        <PredictiveSearch />
        <TechConsultantBot />
        <Footer />
      </body>
    </html>
  );
}
