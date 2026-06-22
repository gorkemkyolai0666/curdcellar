'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { formatDate, formatCurrency } from '@/lib/utils';

const statusLabels: Record<string, { label: string; class: string }> = {
  PENDING: { label: 'Beklemede', class: 'bg-yellow-100 text-yellow-800' },
  CONFIRMED: { label: 'Onaylandı', class: 'bg-blue-100 text-blue-800' },
  SHIPPED: { label: 'Gönderildi', class: 'bg-purple-100 text-purple-800' },
  DELIVERED: { label: 'Teslim Edildi', class: 'bg-green-100 text-green-800' },
  CANCELLED: { label: 'İptal', class: 'bg-red-100 text-red-800' },
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [customers, setCustomers] = useState<any[]>([]);
  const [form, setForm] = useState({ orderCode: '', customerId: '', orderDate: '', notes: '', items: [{ product: '', quantity: '', unitPrice: '' }] });

  useEffect(() => { loadData(); }, [filter]);

  async function loadData() {
    try {
      const [o, c] = await Promise.all([api.getOrders(filter || undefined), api.getCustomers()]);
      setOrders(o);
      setCustomers(c);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function addItem() {
    setForm({ ...form, items: [...form.items, { product: '', quantity: '', unitPrice: '' }] });
  }

  function updateItem(index: number, field: string, value: string) {
    const items = [...form.items];
    items[index] = { ...items[index], [field]: value };
    setForm({ ...form, items });
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    try {
      const items = form.items.filter(i => i.product && i.quantity && i.unitPrice).map(i => ({
        product: i.product,
        quantity: parseFloat(i.quantity),
        unit: 'kg',
        unitPrice: parseFloat(i.unitPrice),
        total: parseFloat(i.quantity) * parseFloat(i.unitPrice),
      }));
      await api.createOrder({
        orderCode: form.orderCode,
        customerId: form.customerId,
        orderDate: new Date(form.orderDate).toISOString(),
        notes: form.notes || null,
        items,
      });
      setShowForm(false);
      setForm({ orderCode: '', customerId: '', orderDate: '', notes: '', items: [{ product: '', quantity: '', unitPrice: '' }] });
      loadData();
    } catch (err: any) {
      alert(err.message);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-earth-900">Siparişler</h1>
          <p className="text-earth-500 mt-1">Sipariş takibi ve faturalama</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="px-4 py-2.5 bg-brand-800 text-white rounded-xl font-medium hover:bg-brand-700 transition-colors shadow-lg shadow-brand-800/25">
          + Yeni Sipariş
        </button>
      </div>

      <div className="flex gap-2 flex-wrap">
        {['', 'PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${filter === f ? 'bg-brand-800 text-white' : 'bg-white text-earth-600 border border-earth-200 hover:bg-earth-50'}`}
          >
            {f === '' ? 'Tümü' : statusLabels[f]?.label || f}
          </button>
        ))}
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-white rounded-2xl p-6 border border-earth-100 shadow-sm space-y-4">
          <h3 className="font-semibold text-earth-800">Yeni Sipariş</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input value={form.orderCode} onChange={(e) => setForm({ ...form, orderCode: e.target.value })} placeholder="Sipariş Kodu (SP-2026-003)" className="px-4 py-2.5 rounded-xl border border-earth-200 bg-earth-50 text-earth-900 placeholder:text-earth-400 focus:outline-none focus:ring-2 focus:ring-brand-500" required />
            <select value={form.customerId} onChange={(e) => setForm({ ...form, customerId: e.target.value })} className="px-4 py-2.5 rounded-xl border border-earth-200 bg-earth-50 text-earth-900 focus:outline-none focus:ring-2 focus:ring-brand-500" required>
              <option value="">Müşteri Seçin</option>
              {customers.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <input type="date" value={form.orderDate} onChange={(e) => setForm({ ...form, orderDate: e.target.value })} className="px-4 py-2.5 rounded-xl border border-earth-200 bg-earth-50 text-earth-900 focus:outline-none focus:ring-2 focus:ring-brand-500" required />
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-earth-700">Kalemler</p>
            {form.items.map((item, i) => (
              <div key={i} className="grid grid-cols-3 gap-3">
                <input value={item.product} onChange={(e) => updateItem(i, 'product', e.target.value)} placeholder="Ürün adı" className="px-4 py-2.5 rounded-xl border border-earth-200 bg-earth-50 text-earth-900 placeholder:text-earth-400 focus:outline-none focus:ring-2 focus:ring-brand-500" />
                <input type="number" step="0.1" value={item.quantity} onChange={(e) => updateItem(i, 'quantity', e.target.value)} placeholder="Miktar (kg)" className="px-4 py-2.5 rounded-xl border border-earth-200 bg-earth-50 text-earth-900 placeholder:text-earth-400 focus:outline-none focus:ring-2 focus:ring-brand-500" />
                <input type="number" step="0.01" value={item.unitPrice} onChange={(e) => updateItem(i, 'unitPrice', e.target.value)} placeholder="Birim Fiyat (₺)" className="px-4 py-2.5 rounded-xl border border-earth-200 bg-earth-50 text-earth-900 placeholder:text-earth-400 focus:outline-none focus:ring-2 focus:ring-brand-500" />
              </div>
            ))}
            <button type="button" onClick={addItem} className="text-sm text-brand-700 hover:text-brand-800 font-medium">+ Kalem Ekle</button>
          </div>
          <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Notlar..." className="w-full px-4 py-2.5 rounded-xl border border-earth-200 bg-earth-50 text-earth-900 placeholder:text-earth-400 focus:outline-none focus:ring-2 focus:ring-brand-500" rows={2} />
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
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 border border-earth-100 text-center">
          <div className="text-4xl mb-3">🛒</div>
          <p className="text-earth-500">Henüz sipariş bulunmuyor</p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-2xl p-5 border border-earth-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-brand-100 flex items-center justify-center">
                    <span className="text-brand-800 font-mono text-xs font-bold">{order.orderCode.split('-').pop()}</span>
                  </div>
                  <div>
                    <p className="font-medium text-earth-900">{order.orderCode}</p>
                    <p className="text-sm text-earth-500">{order.customer?.name} • {order.items?.length || 0} kalem</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-bold text-earth-900">{formatCurrency(order.totalAmount)}</p>
                    <p className="text-xs text-earth-400">{formatDate(order.orderDate)}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusLabels[order.status]?.class || 'bg-earth-100 text-earth-600'}`}>
                    {statusLabels[order.status]?.label || order.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
