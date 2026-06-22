'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { formatDate } from '@/lib/utils';

const statusLabels: Record<string, { label: string; class: string }> = {
  PRODUCTION: { label: 'Üretimde', class: 'bg-blue-100 text-blue-800' },
  AGING: { label: 'Olgunlaşıyor', class: 'bg-amber-100 text-amber-800' },
  READY: { label: 'Hazır', class: 'bg-green-100 text-green-800' },
  SOLD: { label: 'Satıldı', class: 'bg-purple-100 text-purple-800' },
  DISCARDED: { label: 'İmha Edildi', class: 'bg-red-100 text-red-800' },
};

export default function BatchesPage() {
  const [batches, setBatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ batchCode: '', recipeId: '', agingRoomId: '', milkQuantity: '', startDate: '', expectedEnd: '', notes: '' });
  const [recipes, setRecipes] = useState<any[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, [filter]);

  async function loadData() {
    try {
      const [b, r, rm] = await Promise.all([
        api.getBatches(filter || undefined),
        api.getRecipes(),
        api.getAgingRooms(),
      ]);
      setBatches(b);
      setRecipes(r);
      setRooms(rm);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    try {
      await api.createBatch({
        ...form,
        milkQuantity: parseFloat(form.milkQuantity),
        startDate: new Date(form.startDate).toISOString(),
        expectedEnd: new Date(form.expectedEnd).toISOString(),
        agingRoomId: form.agingRoomId || null,
      });
      setShowForm(false);
      setForm({ batchCode: '', recipeId: '', agingRoomId: '', milkQuantity: '', startDate: '', expectedEnd: '', notes: '' });
      loadData();
    } catch (err: any) {
      alert(err.message);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-earth-900">Üretim Partileri</h1>
          <p className="text-earth-500 mt-1">Tüm peynir üretim partilerini yönetin</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="px-4 py-2.5 bg-brand-800 text-white rounded-xl font-medium hover:bg-brand-700 transition-colors shadow-lg shadow-brand-800/25">
          + Yeni Parti
        </button>
      </div>

      <div className="flex gap-2 flex-wrap">
        {['', 'PRODUCTION', 'AGING', 'READY', 'SOLD'].map((f) => (
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
          <h3 className="font-semibold text-earth-800">Yeni Üretim Partisi</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <input value={form.batchCode} onChange={(e) => setForm({ ...form, batchCode: e.target.value })} placeholder="Parti Kodu (BT-2026-004)" className="px-4 py-2.5 rounded-xl border border-earth-200 bg-earth-50 text-earth-900 placeholder:text-earth-400 focus:outline-none focus:ring-2 focus:ring-brand-500" required />
            <select value={form.recipeId} onChange={(e) => setForm({ ...form, recipeId: e.target.value })} className="px-4 py-2.5 rounded-xl border border-earth-200 bg-earth-50 text-earth-900 focus:outline-none focus:ring-2 focus:ring-brand-500" required>
              <option value="">Tarif Seçin</option>
              {recipes.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
            <select value={form.agingRoomId} onChange={(e) => setForm({ ...form, agingRoomId: e.target.value })} className="px-4 py-2.5 rounded-xl border border-earth-200 bg-earth-50 text-earth-900 focus:outline-none focus:ring-2 focus:ring-brand-500">
              <option value="">Oda Seçin (opsiyonel)</option>
              {rooms.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
            <input type="number" step="0.1" value={form.milkQuantity} onChange={(e) => setForm({ ...form, milkQuantity: e.target.value })} placeholder="Süt Miktarı (L)" className="px-4 py-2.5 rounded-xl border border-earth-200 bg-earth-50 text-earth-900 placeholder:text-earth-400 focus:outline-none focus:ring-2 focus:ring-brand-500" required />
            <input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} className="px-4 py-2.5 rounded-xl border border-earth-200 bg-earth-50 text-earth-900 focus:outline-none focus:ring-2 focus:ring-brand-500" required />
            <input type="date" value={form.expectedEnd} onChange={(e) => setForm({ ...form, expectedEnd: e.target.value })} className="px-4 py-2.5 rounded-xl border border-earth-200 bg-earth-50 text-earth-900 focus:outline-none focus:ring-2 focus:ring-brand-500" required />
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
      ) : batches.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 border border-earth-100 text-center">
          <div className="text-4xl mb-3">🧀</div>
          <p className="text-earth-500">Henüz üretim partisi bulunmuyor</p>
          <p className="text-earth-400 text-sm mt-1">İlk partinizi oluşturmak için yukarıdaki butona tıklayın</p>
        </div>
      ) : (
        <div className="space-y-3">
          {batches.map((batch) => (
            <div key={batch.id} className="bg-white rounded-2xl p-5 border border-earth-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-brand-100 flex items-center justify-center">
                    <span className="text-brand-800 font-mono text-sm font-bold">{batch.batchCode.split('-').pop()}</span>
                  </div>
                  <div>
                    <p className="font-medium text-earth-900">{batch.batchCode}</p>
                    <p className="text-sm text-earth-500">{batch.recipe?.name} • {batch.milkQuantity}L süt</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-xs text-earth-400">Başlangıç</p>
                    <p className="text-sm text-earth-700">{formatDate(batch.startDate)}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusLabels[batch.status]?.class || 'bg-earth-100 text-earth-600'}`}>
                    {statusLabels[batch.status]?.label || batch.status}
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
