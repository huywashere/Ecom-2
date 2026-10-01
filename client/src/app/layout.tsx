import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/layout/CartDrawer';
import PredictiveSearch from '@/components/layout/PredictiveSearch';

export const metadata: Metadata = {
  title: 'MrBeast.Store | The ONLY Official Merch Store for MrBeast in the world',
  description: 'Shop official MrBeast merch, hoodies, tees, Feastables chocolate, Beast Athletics gear, and toys. 100% authentic, fast worldwide shipping.',
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
        <Footer />
      </body>
    </html>
  );
}
