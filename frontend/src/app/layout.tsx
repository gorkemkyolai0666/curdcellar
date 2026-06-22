import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/lib/theme-context';

export const metadata: Metadata = {
  title: 'CurdCellar — Peynir Üretim & Olgunlaştırma Yönetimi',
  description: 'Zanaat peynir üreticileri için üretim takip, olgunlaştırma ve sipariş yönetim platformu',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body className="bg-brand-50 dark:bg-earth-900 text-earth-900 dark:text-earth-100 antialiased min-h-screen">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
