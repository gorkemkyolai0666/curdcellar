'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

export default function CustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '', city: '', taxId: '' });

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    try {
      const data = await api.getCustomers();
      setCustomers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    try {
      await api.createCustomer({
        name: form.name,
        email: form.email || null,
        phone: form.phone || null,
        address: form.address || null,
        city: form.city || null,
        taxId: form.taxId || null,
      });
      setShowForm(false);
      setForm({ name: '', email: '', phone: '', address: '', city: '', taxId: '' });
      loadData();
    } catch (err: any) {
      alert(err.message);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-earth-900">Müşteriler</h1>
          <p className="text-earth-500 mt-1">Alıcı ve distribütör yönetimi</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="px-4 py-2.5 bg-brand-800 text-white rounded-xl font-medium hover:bg-brand-700 transition-colors shadow-lg shadow-brand-800/25">
          + Yeni Müşteri
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-white rounded-2xl p-6 border border-earth-100 shadow-sm space-y-4">
          <h3 className="font-semibold text-earth-800">Yeni Müşteri</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Firma / Kişi Adı" className="px-4 py-2.5 rounded-xl border border-earth-200 bg-earth-50 text-earth-900 placeholder:text-earth-400 focus:outline-none focus:ring-2 focus:ring-brand-500" required />
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="E-posta" className="px-4 py-2.5 rounded-xl border border-earth-200 bg-earth-50 text-earth-900 placeholder:text-earth-400 focus:outline-none focus:ring-2 focus:ring-brand-500" />
            <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Telefon" className="px-4 py-2.5 rounded-xl border border-earth-200 bg-earth-50 text-earth-900 placeholder:text-earth-400 focus:outline-none focus:ring-2 focus:ring-brand-500" />
            <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="Adres" className="px-4 py-2.5 rounded-xl border border-earth-200 bg-earth-50 text-earth-900 placeholder:text-earth-400 focus:outline-none focus:ring-2 focus:ring-brand-500" />
            <input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="Şehir" className="px-4 py-2.5 rounded-xl border border-earth-200 bg-earth-50 text-earth-900 placeholder:text-earth-400 focus:outline-none focus:ring-2 focus:ring-brand-500" />
            <input value={form.taxId} onChange={(e) => setForm({ ...form, taxId: e.target.value })} placeholder="Vergi No" className="px-4 py-2.5 rounded-xl border border-earth-200 bg-earth-50 text-earth-900 placeholder:text-earth-400 focus:outline-none focus:ring-2 focus:ring-brand-500" />
          </div>
          <div className="flex gap-3">
            <button type="submit" className="px-4 py-2.5 bg-brand-800 text-white rounded-xl font-medium hover:bg-brand-700 transition-colors">Kaydet</button>
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2.5 bg-earth-100 text-earth-700 rounded-xl font-medium hover:bg-earth-200 transition-colors">İptal</button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <div key={i} className="h-20 bg-white rounded-2xl animate-pulse"></div>)}
        </div>
      ) : customers.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 border border-earth-100 text-center">
          <div className="text-4xl mb-3">👥</div>
          <p className="text-earth-500">Henüz müşteri kaydı bulunmuyor</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {customers.map((customer) => (
            <div key={customer.id} className="bg-white rounded-2xl p-5 border border-earth-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-earth-900">{customer.name}</h3>
                  <p className="text-sm text-earth-500 mt-1">{customer.city || 'Şehir belirtilmemiş'}</p>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${customer.isActive ? 'bg-green-100 text-green-800' : 'bg-earth-100 text-earth-600'}`}>
                  {customer.isActive ? 'Aktif' : 'Pasif'}
                </span>
              </div>
              <div className="mt-3 space-y-1 text-sm text-earth-600">
                {customer.email && <p>{customer.email}</p>}
                {customer.phone && <p>{customer.phone}</p>}
              </div>
              <div className="mt-3 pt-3 border-t border-earth-100 flex items-center justify-between">
                <span className="text-xs text-earth-400">{customer._count?.orders || 0} sipariş</span>
                {customer.taxId && <span className="text-xs text-earth-400 font-mono">VKN: {customer.taxId}</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
