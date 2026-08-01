import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Sidebar from '@/components/layouts/Sidebar';
import Topbar from '@/components/layouts/Topbar';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Dashboard Admin | Pena Hijau',
  description: 'Panel Pengelolaan Konten & Data Relawan Komunitas Pena Hijau Pemuda Nusantara Peduli Lingkungan.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='id' className={`${inter.variable} h-full antialiased`}>
      <body className='min-h-full bg-slate-50 font-sans text-slate-900 flex flex-col antialiased'>
        {/* Sidebar Component */}
        <Sidebar />

        {/* Main Content Outer Container (Offset 256px / 64 for Sidebar on desktop) */}
        <div className='flex flex-1 flex-col md:pl-64 pt-16 md:pt-0 min-h-screen bg-slate-50'>
          {/* Topbar Header */}
          <Topbar />

          {/* Page Content Body */}
          <main className='flex-1'>{children}</main>
        </div>
      </body>
    </html>
  );
}
