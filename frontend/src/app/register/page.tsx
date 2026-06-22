'use client';

import { useState } from 'react';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await api.register({ email, password, name });
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));
      router.push('/dashboard');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Kayıt başarısız');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-50 via-brand-100 to-earth-100 dark:from-earth-900 dark:via-earth-800 dark:to-earth-900 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-earth-900 dark:text-brand-50">CurdCellar</h1>
          <p className="text-earth-500 dark:text-earth-400 mt-2">Yeni hesap oluşturun</p>
        </div>

        <div className="bg-white dark:bg-earth-800 rounded-2xl shadow-xl shadow-brand-200/50 dark:shadow-none p-8 border border-brand-100 dark:border-earth-700">
          <h2 className="text-xl font-semibold text-earth-800 dark:text-earth-100 mb-6">Kayıt Ol</h2>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-earth-700 dark:text-earth-300 mb-1">Ad Soyad</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-earth-200 dark:border-earth-600 bg-earth-50 dark:bg-earth-900 text-earth-900 dark:text-earth-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-earth-700 dark:text-earth-300 mb-1">E-posta</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-earth-200 dark:border-earth-600 bg-earth-50 dark:bg-earth-900 text-earth-900 dark:text-earth-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-earth-700 dark:text-earth-300 mb-1">Şifre</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-earth-200 dark:border-earth-600 bg-earth-50 dark:bg-earth-900 text-earth-900 dark:text-earth-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
                minLength={6}
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-brand-800 hover:bg-brand-700 text-white font-medium transition-all disabled:opacity-50"
            >
              {loading ? 'Kayıt yapılıyor...' : 'Kayıt Ol'}
            </button>
          </form>

          <p className="text-center text-sm mt-6 text-earth-500 dark:text-earth-400">
            Zaten hesabınız var mı?{' '}
            <Link href="/" className="text-brand-700 dark:text-brand-400 font-medium hover:underline">
              Giriş Yapın
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
