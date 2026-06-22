'use client';

import { useState } from 'react';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTheme } from '@/lib/theme-context';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await api.login({ email, password });
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Giriş başarısız');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-50 via-brand-100 to-earth-100 dark:from-earth-900 dark:via-earth-800 dark:to-earth-900 px-4">
      <button
        type="button"
        onClick={toggleTheme}
        className="fixed top-4 right-4 p-2 rounded-xl bg-white/80 dark:bg-earth-800 border border-earth-200 dark:border-earth-600 text-earth-600 dark:text-earth-300 hover:bg-white dark:hover:bg-earth-700 transition-colors"
        aria-label={theme === 'dark' ? 'Açık moda geç' : 'Koyu moda geç'}
      >
        {theme === 'dark' ? '☀️' : '🌙'}
      </button>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-800 text-white mb-4">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-earth-900">CurdCellar</h1>
          <p className="text-earth-500 mt-2">Peynir Üretim & Olgunlaştırma Yönetimi</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl shadow-brand-200/50 p-8 border border-brand-100">
          <h2 className="text-xl font-semibold text-earth-800 mb-6">Hesabınıza giriş yapın</h2>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-earth-700 mb-1">E-posta</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-earth-200 bg-earth-50 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all text-earth-900 placeholder:text-earth-400"
                placeholder="demo@peynirmahzeni.com.tr"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-earth-700 mb-1">Şifre</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-earth-200 bg-earth-50 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all text-earth-900 placeholder:text-earth-400"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-brand-800 hover:bg-brand-700 text-white font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-brand-800/25"
            >
              {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-earth-100 dark:border-earth-700 space-y-3">
            <p className="text-xs text-earth-400 text-center">
              Demo: demo@peynirmahzeni.com.tr / demo123456
            </p>
            <p className="text-center text-sm text-earth-500 dark:text-earth-400">
              Hesabınız yok mu?{' '}
              <Link href="/register" className="text-brand-700 dark:text-brand-400 font-medium hover:underline">
                Kayıt Olun
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
