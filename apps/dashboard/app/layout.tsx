import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import DashboardLayoutWrapper from '@/components/layouts/DashboardLayoutWrapper';

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
        <DashboardLayoutWrapper>{children}</DashboardLayoutWrapper>
      </body>
    </html>
  );
}
